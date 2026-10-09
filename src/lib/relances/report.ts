// Rapport quotidien des relances, envoyé à l’équipe (NOTIFY_TO, email interne) au premier passage après 8 h
// (heure de Paris) : rubrique nominative « À faire aujourd’hui » en tête (clients sans agent, agents sans appel, essais
// qui finissent sans usage, soldes bas, réponses reçues, rappels à faire : src/lib/relances/onboarding.ts), puis
// envois par série, étape et langue, étapes sautées par motif, attentes, contacts dont la langue est à valider,
// réponses et rebonds, erreurs ; en mode test, 3 exemples rendus pour relecture.
// Relances coupées (variable ou interrupteur en base) : rapport court « Relances COUPÉES » à la même heure, pour ne
// pas oublier de les rallumer. Envoi en échec : la date est remise et le rapport repart au passage horaire suivant.
import { localParts } from './calendar';
import type { EngineDeps, LogRow, SettingsRow, StopRow } from './types';

const REPORT_HOUR = 8;
const PARIS = 'Europe/Paris';

interface ReportInput {
  now: Date;
  dryRun: boolean;
  settings: SettingsRow;
  logs: LogRow[];
  stops: StopRow[];
  review: string[];
  replyCheck: 'ok' | 'failed' | 'absent';
  counts: { waiting: Record<string, number> };
  errors: string[];
  /** Rubrique « À faire aujourd’hui » (lignes déjà rédigées), placée en tête du rapport. */
  todo?: string[];
}

/** Étape sans l’épisode des alertes de solde (« S1@2026-10-08 » → S1). */
const stepName = (step: string) => step.replace(/@.*/, '');

const tally = (items: string[]) => {
  const m = new Map<string, number>();
  for (const k of items) m.set(k, (m.get(k) || 0) + 1);
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${k} : ${n}`);
};

export function buildReport(i: ReportInput, waiting24h: Record<string, number>) {
  const since = i.now.getTime() - 86_400_000;
  const recent = i.logs.filter((l) => Date.parse(l.created_at) >= since);
  const done = recent.filter((l) => l.status === 'sent' || l.status === 'dry_run');
  const skipped = recent.filter((l) => l.status === 'skipped');
  const failed = recent.filter((l) => l.status === 'failed' || l.status === 'failed_retry');
  const stuck = i.logs.filter((l) => l.status === 'queued' && i.now.getTime() - Date.parse(l.created_at) > 3_600_000);
  const stops = i.stops.filter((s) => Date.parse(s.created_at) >= since);
  // Exemples : les plus récents, une étape différente chacun.
  const examples: LogRow[] = [];
  for (const l of [...recent].reverse()) {
    if (l.status === 'dry_run' && l.preview && !examples.some((x) => x.step === l.step)) examples.push(l);
    if (examples.length === 3) break;
  }
  const lines = [
    ...(i.todo?.length ? [...i.todo, '', '— Relances —', ''] : []),
    `Mode : ${i.dryRun ? 'TEST (dry-run) — rien n’est parti aux contacts' : 'ENVOI RÉEL'}`,
    `Lecture des réponses (IMAP) : ${i.replyCheck === 'ok' ? 'en service' : i.replyCheck === 'failed' ? 'EN ÉCHEC — marketing suspendu' : 'non configurée — marketing bloqué en envoi réel'}`,
    '',
    `${i.dryRun ? 'Envois simulés' : 'Envois'} des dernières 24 h (série / étape / langue) : ${done.length}`,
    ...tally(done.map((l) => `${stepName(l.step)} ${l.locale ?? ''}`.trim())),
    '',
    `Étapes abandonnées (24 h) : ${skipped.length}`,
    ...tally(skipped.map((l) => `${stepName(l.step)} — ${l.skip_reason ?? ''}`)),
    '',
    'En attente (cumul des passages des dernières 24 h) :',
    ...Object.entries(waiting24h).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${k} : ${n}`),
    '',
    `Langue à valider à la main (aucun e-mail commercial d’ici là ; messages de service en anglais) : ${i.review.length}`,
    ...i.review.slice(0, 30).map((e) => `  ${e}`),
    '',
    `Réponses reçues (24 h) : ${stops.filter((s) => s.reason === 'replied').length} ; rebonds : ${stops.filter((s) => s.reason === 'bounced').length}`,
    `Échecs d’envoi (24 h) : ${failed.length}${stuck.length ? ` ; envois à l’issue inconnue (vérifier à la main) : ${stuck.length}` : ''}`,
    ...i.errors.slice(0, 10).map((e) => `  Erreur : ${e}`),
  ];
  if (examples.length) {
    lines.push('', '— Exemples rendus (relecture) —');
    for (const ex of examples) lines.push('', `[${ex.step} · ${ex.locale}]`, ex.preview!.slice(0, 2500));
  }
  return {
    subject: `Relances — rapport du ${localParts(i.now, PARIS).date}${i.dryRun ? ' (mode test)' : ''}`,
    text: lines.join('\n'),
  };
}

function mergePreviews(logs: LogRow[], previews: LogRow[]) {
  const key = (l: LogRow) => `${l.email_key}|${l.sequence}|${l.step}`;
  const byKey = new Map(previews.map((p) => [key(p), p.preview]));
  return logs.map((l) => (l.preview || !byKey.has(key(l)) ? l : { ...l, preview: byKey.get(key(l)) }));
}

/**
 * Réserve le rapport du jour (date enregistrée AVANT l’envoi : deux passages simultanés n’envoient qu’une fois), puis
 * envoie ; si l’envoi échoue, la réservation est annulée et le rapport repart au passage horaire suivant.
 */
async function sendOncePerDay(deps: EngineDeps, settings: SettingsRow, now: Date, send: () => Promise<void>) {
  const { date, hour } = localParts(now, PARIS);
  if (hour < REPORT_HOUR || settings.last_report_on === date) return false;
  const previous = settings.last_report_on ?? null;
  if (!(await deps.store.updateSettings({ last_report_on: date }))) return false;
  settings.last_report_on = date;
  try {
    await send();
  } catch (e) {
    if (await deps.store.updateSettings({ last_report_on: previous }).catch(() => false)) settings.last_report_on = previous;
    throw e;
  }
  return true;
}

/** Rapport court quand les relances sont coupées : motif et façon de les rallumer. */
export function buildPausedReport(now: Date, reason: string) {
  const env = /RELANCES_ENABLED/.test(reason);
  return {
    subject: `Relances COUPÉES — rapport du ${localParts(now, PARIS).date}`,
    text: [
      'Les relances sont coupées : aucun e-mail de relance ne part, ni de service (aide à l’essai, fin d’essai), ni commercial.',
      `Motif : ${reason}.`,
      '',
      env
        ? 'Pour les rallumer : remettre RELANCES_ENABLED à 1 dans apphosting.yaml, puis pousser (déploiement automatique).'
        : 'Pour les rallumer, après vérification (rebonds, DKIM, adresses) : remettre relance_settings.enabled à true dans Supabase (ligne id = 1). Effet au passage horaire suivant, sans déploiement.',
      'Ce rapport repart chaque jour à 8 h (heure de Paris) tant que les relances restent coupées.',
    ].join('\n'),
  };
}

export async function sendPausedReportIfDue(deps: EngineDeps, i: { now: Date; settings: SettingsRow; reason: string }) {
  return sendOncePerDay(deps, i.settings, i.now, async () => {
    const r = buildPausedReport(i.now, i.reason);
    await deps.notifyTeam(r.subject, r.text);
  });
}

/** Envoie le rapport une fois par jour (jamais de rapport en boucle ; nouvel essai au passage suivant si l’envoi échoue). */
export async function sendReportIfDue(deps: EngineDeps, i: ReportInput) {
  return sendOncePerDay(deps, i.settings, i.now, async () => {
    const runs = await deps.store.runs(new Date(i.now.getTime() - 86_400_000).toISOString()) ?? [];
    const waiting: Record<string, number> = {};
    for (const r of runs) {
      const w = (r.counts as { waiting?: Record<string, number> })?.waiting ?? {};
      for (const [k, n] of Object.entries(w)) waiting[k] = (waiting[k] || 0) + Number(n || 0);
    }
    for (const [k, n] of Object.entries(i.counts.waiting)) waiting[k] = (waiting[k] || 0) + n;
    // Exemples : textes rendus des envois simulés des dernières 24 h (absents du journal chargé par le moteur).
    const previews = i.dryRun ? await deps.store.logPreviews(new Date(i.now.getTime() - 86_400_000).toISOString()) ?? [] : [];
    const r = buildReport({ ...i, logs: mergePreviews(i.logs, previews) }, waiting);
    await deps.notifyTeam(r.subject, r.text);
  });
}
