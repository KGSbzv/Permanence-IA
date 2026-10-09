// Moteur des relances (conception du 8 oct. 2026, docs/relances/conception-2026-10-08.md), appelé toutes les heures
// par POST /api/cron/relances. À chaque passage :
// 1. interrupteurs : RELANCES_ENABLED et relance_settings.enabled, sinon rien ; mode test (RELANCES_DRY_RUN) par défaut ;
// 2. synchronisation : demandes, inscriptions, fiche contacts, Stripe, instantané quotidien des comptes white-label,
//    désinscriptions, oppositions, réponses et rebonds lus dans la boîte contact@ ;
// 3. une seule série par contact (priorité C > F > U > I > P), étape suivante échue, jamais d’envoi rétroactif ;
// 4. filtres journalisés : compte de test, langue, marché ouvert, base légale, désinscription, opposition, réponse,
//    rebond, ticket support, fenêtre locale et jours fériés, pression (1 marketing / 3 jours, 2 / semaine, jamais deux
//    messages le même jour), plafonds par passage et par jour, variable obligatoire manquante ;
// 5. idempotence : ligne relance_log (contact, série, étape, mode) écrite AVANT l’envoi ; envoi uniquement par sendMail.
// Ajouté le 9 oct. 2026 (audit des parcours) : RELANCES_LOCALES ne ferme que le commercial (messages de service dans
// les 7 langues, en anglais si la langue est inconnue) ; essai annulé (C2 à C4 arrêtés, C5 « rien ne sera débité ») ;
// C4 sur le solde lu au passage (C4_exhausted à 0 minute) ; rapport court même relances coupées ; erreurs du passage
// dans les journaux. Mise en route (§ 7, actions 6, 7 et 13) : lecture quotidienne des agents, numéros et appels des
// comptes en essai, abonnés ou à la minute (cache du jour) ; série A en parallèle de l’étape de vie (A1 à A4, suivi
// mensuel des abonnés sans appel) ; C2 et C3 seulement si un agent existe ; série S (minutes basses ou épuisées d’un
// abonné ou d’un compte à la minute) ; alertes à l’équipe (client sans agent, risque de résiliation, renouvellement
// sans appel, minutes, crédits à 0, agent en pause, solde de l’agence) ; rubrique « À faire aujourd’hui » du rapport.
// Relecture du 9 oct. : tables Stripe illisibles → rien n’est décidé à ce passage (aucune série close à tort) ; alertes
// plafonnées (10 par passage, 3 s entre deux) ; adresses e-mail masquées dans le journal des erreurs.
// Action 15 : désinscription reçue par e-mail (objet « unsubscribe » de l’en-tête List-Unsubscribe, ou équivalent dans
// les 7 langues) enregistrée comme préférence « e-mails essentiels seulement » (arrêt « unsubscribed ») ; arrêt posé par
// l’équipe avec le lien signé des alertes (arrêt « manual », src/lib/relances/stopLink.ts) : plus aucun commercial, et
// les messages de service facultatifs sautés, quelle que soit la série ; lien d’arrêt dans l’alerte « réponses reçues ».
import { getI18n } from '@/i18n';
import { buildRelanceFacts } from '@/i18n/content/fr';
import type { RelanceKey, RelanceMessage, RelancesContent } from '@/i18n/content/fr/ui/relances';
import { LANG_OF, type Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import { maskEmails } from '@/lib/maskEmails';
import { MARKET_TZ, dayMonth, localParts, longDate, windowBlock } from './calendar';
import { renderMessage, type RenderVars } from './render';
import { SERVICE_FALLBACK_LOCALE } from './config';
import {
  A_STAGES, S_STAGES, agencyBalanceMail, agentIdle, balanceEpisode, balanceMail, buildTodo, churnRiskMail, creditsEpisode, creditsMail,
  freshActivity, lowMinutesThreshold, noAgentMail, noCallSince, onboardingStart, onboardingStop, pausedAgentMail, planOf, renewalMail,
  runningSubscription, type AccountView,
} from './onboarding';
import { sendPausedReportIfDue, sendReportIfDue } from './report';
import { stopRelancesLine } from './stopLink';
import {
  buildContacts, latestTrialOf, marketingBasis, stageOf, trialCancelScheduled, trialEndedUnpaid, SEQ_OF_STAGE, type Contact,
} from './selection';
import {
  A_CHURN_RISK_DAYS, A_MONTHLY_STEPS, A_NO_AGENT_ALERT_DAYS, A_READS_PER_RUN, A_RENEWAL_ALERT_DAYS, C4_MINUTES_LEFT,
  C4_MIN_HOURS_AFTER_START, C5_DAYS_BEFORE_END, DAY, STEPS, U_LOW_USAGE, U_MIN_ACCOUNT_AGE_DAYS, U_REGULAR_USAGE, dueAt,
  stepsOf, uHeavyUsage, type StepDef,
} from './sequences';
import type { AccountActivity, EngineDeps, LegalBasis, LogRow, RunRow, Seq, SettingsRow, SnapshotRow, Stage, StateRow, StopRow } from './types';

export interface RunResult {
  status: 'disabled' | 'not_installed' | 'done' | 'halted' | 'error';
  dryRun: boolean;
  reason?: string;
  counts: Counts;
}
interface Counts { contacts: number; candidates: number; sent: number; dry_run: number; failed: number; alerts: number; skipped: Record<string, number>; waiting: Record<string, number> }

/** Version des textes enregistrée avec chaque envoi (à changer quand les textes changent). */
const TEMPLATE_VERSION = '2026-10-09';
const LIVE_GAP_MS = 3_000; // 3 s entre deux envois réels (Zoho : pas d’envoi groupé)
/** Alertes à l’équipe par passage (même boîte Zoho que les relances) : le reste part au passage suivant. */
const MAX_ALERTS_PER_RUN = 10;
const COUNTED: LogRow['status'][] = ['sent', 'dry_run', 'queued'];

/** Verrous d’alerte déjà posés, par base (instance) : une situation qui dure n’écrit pas en base à chaque passage. */
const claimedAlerts = new WeakMap<object, Set<string>>();

/** Plafond du jour : imposé par RELANCES_MAX_PER_DAY, sinon montée progressive 20 (1re semaine), 50, puis 150. */
function dailyCap(logs: LogRow[], override: number | null, now: Date) {
  if (override != null) return override;
  const first = logs.filter((l) => l.status === 'sent' || l.status === 'dry_run').map((l) => Date.parse(l.created_at)).sort((a, b) => a - b)[0];
  const days = first ? (now.getTime() - first) / DAY : 0;
  return days < 7 ? 20 : days < 14 ? 50 : 150;
}

const latestTrial = (c: Contact) => latestTrialOf(c.subscriptions);

/**
 * Solde de minutes le plus sûr : celui lu à ce passage (comptes white-label), sinon l’instantané quotidien de moins de
 * 2 jours. `snapDay` : jour de l’instantané (pris au premier passage du jour UTC), null pour une lecture du passage.
 */
function minutesNow(c: Contact, now: Date): { minutes: number; snapDay: string | null } | null {
  if (c.live) return { minutes: c.live.minutes, snapDay: null };
  if (c.platform && now.getTime() - Date.parse(c.platform.snapDate) <= 2 * DAY) return { minutes: c.platform.minutes, snapDay: c.platform.snapDate };
  return null;
}

/** Crédits de messages : lus à ce passage, sinon instantané de moins de 2 jours ; null si inconnus. */
function creditsNow(c: Contact, now: Date): number | null {
  if (c.live) return c.live.credits;
  return c.platform && now.getTime() - Date.parse(c.platform.snapDate) <= 2 * DAY ? c.platform.credits : null;
}

/** Variables du contact pour les textes ; ce qui vient de Stripe n’est jamais estimé (absent = étape sautée).
 *  Exportée pour les aperçus (scripts/preview-relances.ts), qui passent par le même calcul. */
export function varsFor(c: Contact, locale: Locale, content: RelancesContent, step: StepDef, now: Date): RenderVars {
  const i18n = getI18n(locale);
  const tz = MARKET_TZ[locale];
  const nl = i18n.market.numberLocale;
  const sector = c.sector && !c.pausedSector ? i18n.c.sectors.find((s) => s.slug === c.sector) : undefined;
  const sub = latestTrial(c);
  const plan = planOf(sub, locale);
  const reading = minutesNow(c, now);
  const origin = c.origin === 'callback_done' && !c.requestAt ? 'callback' : c.origin;
  const topic = step.seq === 'M' ? content.monthly.topics[Number(step.step.slice(1)) - 1] : undefined;
  return {
    first_name: c.firstName,
    company: c.company,
    source_line: origin ? content.shared.sourceLine[origin] : null,
    request_date: c.requestAt ? dayMonth(c.requestAt, nl, tz) : null,
    sector_name: sector?.name ?? null,
    sector_problem: sector?.problems[0] ? content.shared.clause(sector.problems[0]) : null,
    sector_handles: sector?.handles.length ? content.shared.list(sector.handles.slice(0, 3)) : null,
    trial_end_date: sub?.trial_end ? longDate(new Date(sub.trial_end), nl, tz) : null,
    minutes_left: reading ? i18n.num(Math.max(0, Math.floor(reading.minutes))) : null,
    plan_name: plan ? i18n.c.offers[plan.slug].name : null,
    // Prix du mois, ou de l’année pour un forfait annuel (texte C5_annual).
    plan_price: plan && sub?.price_amount ? i18n.money(sub.price_amount / 100) : null,
    topic_title: topic?.title ?? null,
    topic_paragraph: topic?.paragraph ?? null,
  };
}

/** Texte de l’étape (P3 sans secteur connu → P3_generic ; M → prospect ou espace client selon la série d’origine ;
 *  P1 « inscription non terminée », C4 à 0 minute (minutes épuisées), C5 d’un essai annulé ou d’un forfait annuel,
 *  F1 après un paiement refusé, A3 hors essai). Exportée pour les aperçus (scripts/preview-relances.ts). */
export function templateOf(content: RelancesContent, step: StepDef, c: Contact, locale: Locale, origin: Seq, now: Date) {
  if (step.key === 'M') return { key: origin === 'P' ? 'M_prospect' : 'M_account', build: origin === 'P' ? content.monthly.prospect : content.monthly.account };
  let key: RelanceKey = step.key;
  if (key === 'P1' && c.origin === 'signup_abandoned') key = 'P1_signup';
  // Solde arrondi comme {minutes_left} : à 0, les appels sont déjà arrêtés (« vos minutes sont utilisées »).
  if (key === 'C4') {
    const reading = minutesNow(c, now);
    if (reading && Math.floor(reading.minutes) <= 0) key = 'C4_exhausted';
  }
  if (key === 'P3' && !(c.sector && !c.pausedSector && getI18n(locale).c.sectors.some((s) => s.slug === c.sector))) key = 'P3_generic';
  if (key === 'C5') {
    const trial = latestTrial(c);
    if (trialCancelScheduled(trial)) key = 'C5_cancelled';
    else if (planOf(trial, locale)?.monthly === false) key = 'C5_annual';
  }
  if (key === 'F1' && trialEndedUnpaid(c)) key = 'F1_payment_failed';
  // A3 hors essai (abonné, compte à la minute) : pas de date de fin d’essai, « votre compte est actif ».
  if (key === 'A3' && runningSubscription(c)?.status !== 'trialing') key = 'A3_active';
  return { key, build: content.messages[key] };
}

interface Candidate {
  c: Contact;
  seq: Seq;
  /** Série d’origine pour M (base légale et texte). */
  origin: Seq;
  step: StepDef;
  due: Date;
  entered: Date;
  last: boolean;
  retry?: LogRow;
  /** Minutes épuisées (S2) : avant les autres messages de service du passage. */
  urgent?: boolean;
}

export async function runRelances(deps: EngineDeps, opts: { forceDryRun?: boolean } = {}): Promise<RunResult> {
  const { store, config: cfg } = deps;
  const log = deps.log ?? ((m: string) => console.log(m));
  const logError = deps.logError ?? ((m: string) => console.error(m));
  const now = deps.now();
  const counts: Counts = { contacts: 0, candidates: 0, sent: 0, dry_run: 0, failed: 0, alerts: 0, skipped: {}, waiting: {} };
  const decisions: RunRow['decisions'] = [];
  const errors: string[] = [];
  let dryRun = cfg.dryRun || Boolean(opts.forceDryRun);
  const startedAt = now.toISOString();
  const finish = async (status: RunResult['status'], reason?: string): Promise<RunResult> => {
    if (status !== 'not_installed') {
      await store.saveRun({ started_at: startedAt, finished_at: deps.now().toISOString(), dry_run: dryRun, status, counts: { ...counts, reason }, decisions, errors: errors.map(maskEmails) })
        .catch((e) => log(`[relances] journal du passage non enregistré : ${e?.message}`));
    }
    log(`[relances] ${status}${reason ? ` (${reason})` : ''} — ${dryRun ? 'mode test' : 'envoi réel'} : ${counts.sent} envoyés, ${counts.dry_run} simulés, ${counts.failed} échecs`);
    // Erreurs du passage en gravité ERROR : elles apparaissent dans les journaux (et l’alerte d’erreurs Google Cloud).
    // Adresses masquées (une réponse SMTP de refus cite souvent le destinataire) : jamais l’identité d’un client.
    if (errors.length) logError(`[relances] ${errors.length} erreur(s) pendant le passage : ${errors.slice(0, 10).map(maskEmails).join(' | ')}`);
    return { status, dryRun, reason, counts };
  };
  /** Relances coupées : rapport court à l’équipe une fois par jour, pour ne pas oublier de les rallumer. */
  const pausedReport = async (reason: string, known?: SettingsRow | null) => {
    try {
      const settings = known ?? await store.settings();
      if (settings) await sendPausedReportIfDue(deps, { now, settings, reason });
    } catch (e: any) { errors.push(`rapport (relances coupées) : ${e?.message}`); }
  };
  const note = (kind: 'skipped' | 'waiting', c: Contact, step: string, reason: string) => {
    counts[kind][reason] = (counts[kind][reason] || 0) + 1;
    if (decisions.length < 300) decisions.push({ k: c.key.slice(0, 12), s: step, r: `${kind}:${reason}` });
  };

  // 1. Interrupteurs (coupées : rapport court quotidien quand même).
  if (!cfg.envEnabled) {
    await pausedReport('variable RELANCES_ENABLED absente ou à 0 (apphosting.yaml)');
    return finish('disabled', 'RELANCES_ENABLED');
  }
  const settings = await store.settings();
  if (!settings) return finish('not_installed', 'relance_settings');
  if (!settings.enabled) {
    await pausedReport(settings.paused_reason ? `relance_settings.enabled = false (${settings.paused_reason})` : 'relance_settings.enabled = false (Supabase)', settings);
    return finish('disabled', settings.paused_reason ? `relance_settings (${settings.paused_reason})` : 'relance_settings');
  }

  const [logs, states, stops] = await Promise.all([store.logs(dryRun), store.states(dryRun), store.stops()]);
  if (!logs || !states || !stops) return finish('not_installed', 'relance_log / relance_state / relance_stops');

  // 2. Synchronisation.
  const since = new Date(now.getTime() - 200 * DAY).toISOString();
  const [callbacks, signups, contactRows, prefs, optouts, consents, stripe, snapshotsRaw] = await Promise.all([
    store.callbacks(since), store.signups(), store.contacts(), store.emailPrefs(), store.phoneOptouts(), store.consents(), store.stripe(),
    store.snapshots(new Date(now.getTime() - 40 * DAY).toISOString().slice(0, 10)),
  ]);
  if (!callbacks) errors.push('callbacks illisible');
  if (!signups) errors.push('signups illisible : série P suspendue');
  const stripeReady = cfg.stripeConfigured && Boolean(stripe?.eventsSeen);
  const snapshots: SnapshotRow[] = snapshotsRaw ?? [];

  // Comptes white-label : lus à chaque passage, instantané enregistré une fois par jour.
  let platformUsers: Awaited<ReturnType<NonNullable<EngineDeps['platformUsers']>>> = [];
  if (deps.platformUsers) {
    try {
      platformUsers = await deps.platformUsers();
      const today = now.toISOString().slice(0, 10);
      if (snapshotsRaw && !snapshots.some((s) => s.snap_date === today)) {
        const rows: SnapshotRow[] = platformUsers.map((u) => ({
          user_id: String(u.id), snap_date: today, email_key: deps.emailKey(u.email), minutes_balance: Number(u.minutes_balance) || 0,
          credits_balance: Number(u.credits_balance) || 0, platform_created_at: u.created_at || null,
        }));
        if (rows.length && await store.saveSnapshots(rows)) snapshots.push(...rows);
      }
    } catch (e: any) { errors.push(`comptes white-label : ${e?.message}`); }
  }

  const contacts = buildContacts({
    callbacks: callbacks ?? [], signups: signups ?? [], contacts: contactRows ?? [], customers: stripe?.customers ?? [],
    subscriptions: stripe?.subscriptions ?? [], snapshots, platformUsers, consents: consents ?? [], prefs: prefs ?? new Map(),
    optouts: optouts ?? new Set(), stops,
  }, deps.emailKey, now, cfg.excludeEmails);
  counts.contacts = contacts.length;
  const byEmail = new Map(contacts.map((c) => [c.email, c]));

  // Réponses et rebonds (boîte contact@, lecture seule) : arrêt des relances et équipe prévenue.
  let replyCheck: 'ok' | 'failed' | 'absent' = 'absent';
  if (deps.inbound) {
    try {
      const mails = await deps.inbound(3);
      replyCheck = 'ok';
      const fresh: string[] = [];
      const unsubscribed: string[] = [];
      for (const m of mails) {
        // Désinscription depuis la messagerie (mailto de List-Unsubscribe) : préférence enregistrée, pas une réponse.
        if (m.unsubscribe && m.from) {
          const key = deps.emailKey(m.from);
          const source = `imap:${m.date ?? ''}`.slice(0, 80);
          if (stops.some((x) => x.email_key === key && x.reason === 'unsubscribed' && x.source === source)) continue;
          let saved = false;
          if (deps.saveEmailPref) {
            try { await deps.saveEmailPref(m.from, 'désinscription reçue par e-mail (objet « unsubscribe »)'); saved = true; }
            catch (e: any) { errors.push(`préférence de désinscription non enregistrée : ${e?.message}`); }
          }
          const row: StopRow = { email_key: key, reason: 'unsubscribed', scope: 'marketing', source, created_at: now.toISOString() };
          await store.addStop(row).catch((e) => errors.push(`arrêt non enregistré : ${e?.message}`));
          stops.push(row);
          const c = byEmail.get(m.from);
          if (c) { c.stops.push(row); if (saved) c.pref = 'essential_only'; }
          if (saved) prefs?.set(key, 'essential_only');
          // Objet repris : une demande de résiliation écrite d’un mot (« Stop ») ne doit pas passer pour une simple désinscription.
          unsubscribed.push(`${m.from}${c ? '' : ' (adresse inconnue des relances)'} — « ${m.subject.slice(0, 120)} » — ${saved
            ? 'préférence enregistrée : e-mails essentiels seulement'
            : 'À FAIRE : préférence NON enregistrée, la poser à la main (page des préférences) ; les relances commerciales sont déjà arrêtées'}`);
          continue;
        }
        const targets = m.bounce ? m.bodyEmails.map((e) => byEmail.get(e)).filter(Boolean) as Contact[] : (m.automatic ? [] : [byEmail.get(m.from)].filter(Boolean) as Contact[]);
        for (const c of targets) {
          const reason = m.bounce ? 'bounced' : 'replied';
          const source = `imap:${m.date ?? ''}`.slice(0, 80);
          if (c.stops.some((s) => s.reason === reason && s.source === source)) continue;
          const row: StopRow = { email_key: c.key, reason, scope: m.bounce ? 'all' : 'marketing', source, created_at: now.toISOString() };
          await store.addStop(row).catch((e) => errors.push(`arrêt non enregistré : ${e?.message}`));
          c.stops.push(row);
          stops.push(row);
          // Réponse : la série en cours s’arrête ; le lien arrête aussi les suivantes (étape de vie suivante, suivi mensuel).
          const link = m.bounce ? '' : stopRelancesLine(c.email);
          fresh.push(`${reason === 'bounced' ? 'Rebond' : 'Réponse'} : ${c.email}${m.bounce ? '' : ` — « ${m.subject.slice(0, 120)} »`}${link ? `\n  ${link}` : ''}`);
        }
      }
      if (fresh.length) {
        await deps.notifyTeam(`Relances : ${fresh.length} réponse(s) ou rebond(s) — relances arrêtées`, `${fresh.join('\n')}\n\nLes relances marketing de ces contacts sont arrêtées ; l’équipe prend le relais.`)
          .catch((e) => errors.push(`alerte réponses : ${e?.message}`));
      }
      if (unsubscribed.length) {
        await deps.notifyTeam(`Relances : ${unsubscribed.length} désinscription(s) reçue(s) par e-mail`, `${unsubscribed.join('\n')}\n\nPlus aucun e-mail commercial ne part du site vers ces adresses ; les messages liés au compte continuent. À reporter si besoin dans les envois hors du site (Autocalls, outils marketing).\nLire chaque message dans contact@ : s’il demande en fait la résiliation de l’abonnement, la traiter dans Stripe (sinon le renouvellement sera débité).`)
          .catch((e) => errors.push(`alerte désinscriptions : ${e?.message}`));
      }
    } catch (e: any) {
      replyCheck = 'failed';
      errors.push(`lecture des réponses (IMAP) : ${e?.message}`);
      await deps.notifyTeam('Relances : lecture des réponses en échec', `La boîte contact@ n’a pas pu être lue (${e?.message}). Les e-mails marketing sont suspendus tant que la lecture échoue ; les messages de service continuent.`).catch(() => undefined);
    }
  }

  // Disjoncteur : plus de 5 % de rebonds sur la journée (2 au moins) → envois réels coupés en base, équipe prévenue.
  const today = now.toISOString().slice(0, 10);
  const liveSentToday = dryRun ? 0 : logs.filter((l) => l.status === 'sent' && (l.sent_at || l.created_at).slice(0, 10) === today).length;
  const bouncesToday = stops.filter((s) => s.reason === 'bounced' && s.created_at.slice(0, 10) === today).length;
  if (!dryRun && bouncesToday >= 2 && bouncesToday > 0.05 * Math.max(liveSentToday, 1)) {
    const reason = `disjoncteur : ${bouncesToday} rebonds pour ${liveSentToday} envois le ${today}`;
    await store.updateSettings({ enabled: false, paused_reason: reason });
    await deps.notifyTeam('Relances coupées par le disjoncteur', `${reason}.\nRemettre relance_settings.enabled à true après vérification (DKIM, adresses).`).catch(() => undefined);
    return finish('halted', reason);
  }

  // Tables Stripe illisibles (erreur passagère de la base) alors que Stripe est branché : sans abonnements, chaque
  // client en essai ou abonné paraîtrait « inscrit », ses séries C et A seraient closes pour de bon (stage_changed) et
  // il pourrait recevoir I1. Rien n’est décidé à ce passage (ni série, ni alerte) ; le rapport de 8 h part quand même
  // avec l’erreur, et tout reprend au passage suivant.
  if (cfg.stripeConfigured && !stripe) {
    errors.push('tables Stripe illisibles : aucune relance ni alerte décidée à ce passage');
    await sendReportIfDue(deps, {
      now, dryRun, settings, logs, stops, review: [], replyCheck, counts, errors,
      todo: ['À FAIRE AUJOURD’HUI : indisponible (tables Stripe illisibles au moment de ce rapport ; aucune relance ni alerte décidée à ce passage). Tout reprend au passage horaire suivant ; la liste revient dans le rapport de demain.'],
    }).catch((e) => errors.push(`rapport : ${e?.message}`));
    return finish('error', 'stripe illisible');
  }

  // Index du journal et des séries de ce mode.
  const logsByKey = new Map<string, LogRow[]>();
  for (const l of logs) (logsByKey.get(l.email_key) ?? logsByKey.set(l.email_key, []).get(l.email_key)!).push(l);
  const statesByKey = new Map<string, StateRow[]>();
  for (const s of states) (statesByKey.get(s.email_key) ?? statesByKey.set(s.email_key, []).get(s.email_key)!).push(s);
  const stateOf = (c: Contact, seq: Seq) => statesByKey.get(c.key)?.find((s) => s.sequence === seq);

  const ensureState = async (c: Contact, seq: Seq, entered: Date) => {
    if (stateOf(c, seq)) return;
    const row: StateRow = { email_key: c.key, sequence: seq, dry_run: dryRun, entered_at: entered.toISOString(), status: 'active' };
    await store.insertStateIfNew(row);
    (statesByKey.get(c.key) ?? statesByKey.set(c.key, []).get(c.key)!).push(row);
  };
  const stopState = async (c: Contact, seq: Seq, entered: Date, reason: string) => {
    await ensureState(c, seq, entered);
    const st = stateOf(c, seq)!;
    if (st.status === 'stopped') return;
    st.status = 'stopped';
    st.stop_reason = reason;
    await store.updateState({ email_key: c.key, sequence: seq, dry_run: dryRun }, { status: 'stopped', stop_reason: reason });
  };
  /** Étape abandonnée pour de bon (journalisée : l’étape suivante pourra partir). */
  const skipStep = async (c: Contact, seq: Seq, step: StepDef, reason: string, entered: Date, extra: Partial<LogRow> = {}) => {
    note('skipped', c, step.step, reason);
    await ensureState(c, seq, entered);
    const row: LogRow = { email_key: c.key, sequence: seq, step: step.step, dry_run: dryRun, status: 'skipped', skip_reason: reason, category: null, created_at: now.toISOString(), ...extra };
    if (await store.insertLogIfNew(row)) (logsByKey.get(c.key) ?? logsByKey.set(c.key, []).get(c.key)!).push(row);
  };
  const markDone = async (c: Contact, seq: Seq) => {
    const st = stateOf(c, seq);
    if (st && st.status === 'active') {
      st.status = 'done';
      await store.updateState({ email_key: c.key, sequence: seq, dry_run: dryRun }, { status: 'done' });
    }
  };

  // Mise en route : agents, numéros et appels des comptes en essai, abonnés ou à la minute, lus une fois par jour
  // (jour UTC) et gardés en base ; au plus A_READS_PER_RUN lectures et 60 s par passage, le reste au passage suivant.
  // Une lecture en échec n’est jamais « 0 agent » : les étapes qui en dépendent attendent.
  const stageByKey = new Map<string, Stage | null>(contacts.map((c) => [c.key, stageOf(c, stripeReady)]));
  const userIdOf = (c: Contact) => c.live?.userId ?? c.platform?.userId ?? null;
  const activityByUser = new Map<string, AccountActivity>();
  const reads = { tracked: 0, failed: 0, pending: 0, unavailable: !deps.accountActivity };
  const tracked = contacts.filter((c) => A_STAGES.includes(stageByKey.get(c.key)!) && userIdOf(c));
  reads.tracked = tracked.length;
  if (deps.accountActivity && tracked.length) {
    try {
      for (const a of (await store.activity?.(new Date(now.getTime() - 3 * DAY).toISOString())) ?? []) {
        const known = activityByUser.get(a.userId);
        if (!known || known.readAt < a.readAt) activityByUser.set(a.userId, a);
      }
    } catch (e: any) { errors.push(`mise en route (cache) : ${e?.message}`); }
    const deadline = Date.now() + 60_000;
    let budget = A_READS_PER_RUN;
    for (const c of tracked) {
      const id = userIdOf(c)!;
      if (activityByUser.get(id)?.readAt.slice(0, 10) === today) continue;
      if (budget <= 0 || Date.now() > deadline) { reads.pending++; continue; }
      budget--;
      try {
        const a = await deps.accountActivity(id, now);
        activityByUser.set(id, a);
        await store.saveActivity?.(a);
      } catch (e: any) {
        reads.failed++;
        errors.push(`lecture des agents (compte ${id}) : ${e?.message}`);
      }
    }
  }
  const activityOf = (c: Contact) => { const id = userIdOf(c); return id ? activityByUser.get(id) ?? null : null; };
  const snapsByKey = new Map<string, SnapshotRow[]>();
  for (const r of snapshots) if (r.email_key) (snapsByKey.get(r.email_key) ?? snapsByKey.set(r.email_key, []).get(r.email_key)!).push(r);

  // 3. Étape échue de chaque contact.
  const candidates: Candidate[] = [];
  const review: string[] = [];
  for (const c of contacts) {
    const stage = stageByKey.get(c.key) ?? null;
    const target = stage ? SEQ_OF_STAGE[stage] : undefined;
    // Changement d’étape de vie : la série précédente est close (A et S courent en parallèle, closes à part).
    for (const st of statesByKey.get(c.key) ?? []) {
      if (st.sequence === 'A' || st.sequence === 'S') continue;
      const closesM = st.sequence === 'M' && (!target || stateOf(c, target)?.status !== 'done');
      if (st.status === 'active' && st.sequence !== target && (st.sequence !== 'M' || closesM)) {
        await stopState(c, st.sequence, new Date(st.entered_at), `stage_changed:${stage ?? 'none'}`);
      }
    }
    // Mise en route (A) et solde de minutes (S), en parallèle de l’étape de vie.
    try {
      const a = await nextStepA(c, stage);
      if (a) candidates.push(a);
      const b = nextStepS(c, stage);
      if (b) candidates.push(b);
    } catch (e: any) { errors.push(`mise en route ${c.key.slice(0, 8)} : ${e?.message}`); }
    if (!target) continue;
    if (target === 'P' && !signups) { note('waiting', c, 'P', 'signups_unavailable'); continue; }
    try {
      const picked = await nextStep(c, target, stage!);
      if (picked) candidates.push(picked);
    } catch (e: any) { errors.push(`contact ${c.key.slice(0, 8)} : ${e?.message}`); }
  }

  /**
   * Série A (mise en route), § 7 de l’audit du 9 oct. : depuis le début de l’essai, de l’abonnement ou du premier
   * passage à la minute. A1 (J+1), A2 (J+3), A3 (J+7) tant qu’aucun agent n’existe ; A4 (J+10) si l’agent n’a pas de
   * numéro ou aucun appel réel ; puis, pour un abonné, suivi mensuel si aucun appel réel sur 30 jours. Arrêt : autre
   * étape de vie, résiliation ou annulation programmée, impayé, opposition, réponse du client.
   */
  async function nextStepA(c: Contact, stage: Stage | null): Promise<Candidate | null> {
    const st = stateOf(c, 'A');
    if (!stage || !A_STAGES.includes(stage)) {
      if (st?.status === 'active') await stopState(c, 'A', new Date(st.entered_at), `stage_changed:${stage ?? 'none'}`);
      return null;
    }
    if (st?.status === 'stopped') return null;
    // Début inconnu (paiement à la minute, abonnement sans date) : première fois que le compte est vu à cette étape.
    const entered = st ? new Date(st.entered_at) : onboardingStart(c) ?? now;
    if (!st) await ensureState(c, 'A', entered);
    const stop = onboardingStop(c) ?? (c.stops.some((x) => x.reason === 'replied' && Date.parse(x.created_at) >= entered.getTime()) ? 'replied' : null);
    if (stop) { await stopState(c, 'A', entered, stop); return null; }
    if (!deps.accountActivity) { note('waiting', c, 'A', 'activity_unavailable'); return null; }
    const a = activityOf(c);
    if (!freshActivity(a, now)) { note('waiting', c, 'A', 'activity_unknown'); return null; }
    const own = logsByKey.get(c.key) ?? [];
    const done = (step: string) => own.find((l) => l.sequence === 'A' && l.step === step);
    for (const step of STEPS.A) {
      const prior = done(step.step);
      if (prior && prior.status !== 'failed_retry') continue;
      const due = dueAt(entered, step)!;
      if (now < due) { note('waiting', c, step.step, 'not_due'); return null; }
      if (now.getTime() > due.getTime() + step.staleDays * DAY) { await skipStep(c, 'A', step, 'stale', entered); continue; }
      if (step.step === 'A4') {
        const idle = agentIdle(a);
        if (idle == null) { note('waiting', c, step.step, 'activity_unknown'); return null; }
        if (!idle) { await skipStep(c, 'A', step, a.agents ? 'agent_in_use' : 'no_agent', entered); continue; }
      } else if (a.agents > 0) { await skipStep(c, 'A', step, 'agent_created', entered); continue; }
      return { c, seq: 'A', origin: 'A', step, due, entered, last: false, retry: prior };
    }
    // Suivi mensuel (abonnés) : agent existant, 0 appel réel sur 30 jours, tous les 30 jours après le début.
    if (stage !== 'paying') return null;
    for (const step of A_MONTHLY_STEPS) {
      const prior = done(step.step);
      if (prior && prior.status !== 'failed_retry') continue;
      const due = dueAt(entered, step)!;
      if (now < due) { note('waiting', c, step.step, 'not_due'); return null; }
      if (now.getTime() > due.getTime() + step.staleDays * DAY) { await skipStep(c, 'A', step, 'stale', entered); continue; }
      // Sans agent, « votre agent n’a reçu aucun appel » serait faux (et A3 a annoncé le dernier message) : l’abonné
      // reste suivi par les alertes « risque de résiliation » et « renouvellement », et par « À faire aujourd’hui ».
      if (a.agents === 0) { await skipStep(c, 'A', step, 'no_agent', entered); continue; }
      const quiet = noCallSince(a, now, 30);
      if (quiet == null) { note('waiting', c, step.step, 'activity_unknown'); return null; }
      if (!quiet) { await skipStep(c, 'A', step, 'calls_ok', entered); continue; }
      return { c, seq: 'A', origin: 'A', step, due, entered, last: false, retry: prior };
    }
    return null;
  }

  /**
   * Série S : minutes basses (S1) ou épuisées (S2) d’un abonné ou d’un compte à la minute (l’essai a C4), sur le solde
   * lu au passage (sinon l’instantané récent). Étape « S1@<date> » : une fois par baisse observée dans les instantanés.
   */
  function nextStepS(c: Contact, stage: Stage | null): Candidate | null {
    if (!stage || !S_STAGES.includes(stage)) return null;
    const reading = minutesNow(c, now);
    if (!reading) return null;
    const ep = balanceEpisode(snapsByKey.get(c.key) ?? [], reading.minutes, lowMinutesThreshold(c, c.locale ?? SERVICE_FALLBACK_LOCALE));
    if (!ep) return null;
    const step: StepDef = { ...STEPS.S.find((x) => x.key === ep.step)!, step: `${ep.step}@${ep.since}` };
    const prior = (logsByKey.get(c.key) ?? []).find((l) => l.sequence === 'S' && l.step === step.step);
    if (prior && prior.status !== 'failed_retry') return null;
    const st = stateOf(c, 'S');
    return { c, seq: 'S', origin: 'S', step, due: now, entered: st ? new Date(st.entered_at) : now, last: false, retry: prior, urgent: ep.step === 'S2' };
  }

  async function nextStep(c: Contact, seq: Seq, stage: string): Promise<Candidate | null> {
    const own = logsByKey.get(c.key) ?? [];
    const done = (s: Seq, step: string) => own.find((l) => l.sequence === s && l.step === step);
    let entered: Date | null = stateOf(c, seq) ? new Date(stateOf(c, seq)!.entered_at) : null;
    const trial = latestTrial(c);

    if (seq === 'U') {
      // Usage sur 30 jours : < 10 min = peu actif (U1) ; ≥ seuil du forfait = U3 directement ; ≥ 60 min = sortie sans message.
      const usage = c.platform?.usage30 ?? null;
      const heavy = c.locale ? uHeavyUsage(c.locale) : Infinity;
      const createdAt = c.platform?.createdAt ?? (c.signup?.signed_up_at ? new Date(c.signup.signed_up_at) : null);
      const old = createdAt && now.getTime() - createdAt.getTime() >= U_MIN_ACCOUNT_AGE_DAYS * DAY;
      const st = stateOf(c, 'U');
      if (!st) {
        if (!old || usage == null || (usage >= U_LOW_USAGE && usage < heavy)) { note('waiting', c, 'U', 'not_eligible'); return null; }
        entered = now;
        await ensureState(c, 'U', now);
      } else if (st.status === 'active' && usage != null && usage >= U_REGULAR_USAGE && usage < heavy) {
        await stopState(c, 'U', entered!, 'regular_usage');
        return null;
      }
      if (usage != null && usage >= heavy && !done('U', 'U3')) {
        for (const s of stepsOf('U').slice(0, 2)) if (!done('U', s.step)) await skipStep(c, 'U', s, 'jump_heavy_usage', entered!);
        return { c, seq: 'U', origin: 'U', step: stepsOf('U')[2], due: now, entered: entered!, last: false };
      }
    }
    if (!entered) {
      entered = seq === 'P' ? c.prospectSince
        : seq === 'I' ? (c.signup?.signed_up_at ? new Date(c.signup.signed_up_at) : c.platform?.createdAt ?? null)
          : seq === 'C' ? (trial?.trial_start ? new Date(trial.trial_start) : null)
            : seq === 'F' ? latestDate(c.subscriptions.filter((s) => s.status === 'canceled').map((s) => s.ended_at || s.canceled_at))
              : null;
    }
    if (!entered) { note('waiting', c, seq, 'no_entry_date'); return null; }
    const st = stateOf(c, seq);
    if (st?.status === 'stopped') return null;

    const steps = stepsOf(seq);
    const sequential = seq !== 'C';
    // Essai annulé par le client (fin programmée) : plus d’aide à la prise en main ni d’avertissement de minutes.
    const cancelled = seq === 'C' && trialCancelScheduled(trial);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const prior = done(seq, step.step);
      if (prior && prior.status !== 'failed_retry') continue;
      let due: Date | null = dueAt(entered, step);
      let staleAt: number | null = null;
      if (seq === 'C') {
        if (step.step === 'C4') {
          // Événement : 5 minutes d’essai ou moins, sur le solde lu à ce passage, et jamais dans les premières heures
          // de l’essai. Repli sur l’instantané quotidien (lecture du passage en échec) seulement s’il a été pris au
          // moins C4_MIN_HOURS_AFTER_START heures après le début : pris au plus tôt à 0 h UTC de son jour, il peut
          // sinon dater d’avant que les minutes d’essai soient créditées (essai démarré à 23 h 50 UTC). Essai annulé : jamais.
          const reading = minutesNow(c, now);
          const start = trial?.trial_start ? Date.parse(trial.trial_start) : NaN;
          const readAfterStart = reading && !Number.isNaN(start)
            && (reading.snapDay == null || Date.parse(`${reading.snapDay}T00:00:00Z`) >= start + C4_MIN_HOURS_AFTER_START * 3_600_000);
          const settled = !Number.isNaN(start) && now.getTime() - start >= C4_MIN_HOURS_AFTER_START * 3_600_000;
          due = !cancelled && readAfterStart && settled && reading!.minutes <= C4_MINUTES_LEFT ? now : null;
        }
        if (step.step === 'C5') {
          if (!trial?.trial_end) { await skipStep(c, seq, step, 'missing_variable:trial_end_date', entered); continue; }
          const end = Date.parse(trial.trial_end);
          due = new Date(end - C5_DAYS_BEFORE_END * DAY);
          staleAt = end - DAY / 2;
        }
      }
      if (!due) continue; // événement pas encore survenu
      if (now < due) { if (sequential) { note('waiting', c, step.step, 'not_due'); return null; } continue; }
      if (now.getTime() > (staleAt ?? due.getTime() + step.staleDays * DAY)) {
        // Jamais d’envoi rétroactif : une première étape trop ancienne clôt la série (sauf l’essai en cours, dont
        // les messages de service restent utiles, comme C5 avant la fin de l’essai).
        if (i === 0 && !prior && sequential) {
          await skipStep(c, seq, step, 'stale_entry', entered);
          await stopState(c, seq, entered, 'stale_entry');
          return null;
        }
        await skipStep(c, seq, step, 'stale', entered);
        continue;
      }
      if (cancelled && (step.step === 'C2' || step.step === 'C3')) { await skipStep(c, seq, step, 'trial_cancel_scheduled', entered); continue; }
      let callsKnown = false;
      if (seq === 'C' && (step.step === 'C2' || step.step === 'C3') && deps.accountActivity) {
        // Mise en route (§ 7) : C2 et C3 seulement si un agent existe (sinon la série A prend le relais) ; C2 seulement
        // sans appel réel depuis le début de l’essai. Lecture des agents absente ou trop ancienne : l’étape attend.
        const a = activityOf(c);
        if (!freshActivity(a, now)) { note('waiting', c, step.step, 'activity_unknown'); continue; }
        if (a.agents === 0) { await skipStep(c, seq, step, 'no_agent', entered); continue; }
        if (step.step === 'C2') {
          const called = a.lastCallAt ? Date.parse(a.lastCallAt) >= entered.getTime() : a.realCalls === 0 ? false : null;
          if (called) { await skipStep(c, seq, step, 'condition_not_met', entered); continue; }
          callsKnown = called === false;
        }
      }
      if (seq === 'C' && step.step === 'C2' && !callsKnown) {
        // Sans lecture des appels : seulement si aucune minute n’a été consommée (solde lu à ce passage, sinon instantané).
        const reading = minutesNow(c, now);
        const trialMinutes = MARKETS[c.locale ?? SERVICE_FALLBACK_LOCALE].trial.minutes;
        if (!reading) { await skipStep(c, seq, step, 'condition_unknown', entered); continue; }
        if (reading.minutes < trialMinutes) { await skipStep(c, seq, step, 'condition_not_met', entered); continue; }
      }
      return { c, seq, origin: seq, step, due, entered, last: i === steps.length - 1, retry: prior };
    }

    // Série terminée : suivi mensuel M (P, I, F, U), 30 jours après le dernier message, 4 au plus.
    await markDone(c, seq);
    if (seq === 'C' || stage === 'paying') return null;
    // Seulement après une série dont au moins un message est parti (ou a été simulé en mode test).
    const ends = own.filter((l) => l.sequence === seq && (l.status === 'sent' || l.status === 'dry_run')).map((l) => Date.parse(l.created_at));
    if (!ends.length) return null;
    const mEntered = stateOf(c, 'M') ? new Date(stateOf(c, 'M')!.entered_at) : new Date(Math.max(...ends));
    if (stateOf(c, 'M')?.status === 'stopped' || stateOf(c, 'M')?.status === 'done') return null;
    const monthly = stepsOf('M');
    for (let i = 0; i < monthly.length; i++) {
      const step = monthly[i];
      const prior = done('M', step.step);
      if (prior && prior.status !== 'failed_retry') continue;
      const due = dueAt(mEntered, step)!;
      if (now < due) { note('waiting', c, step.step, 'not_due'); return null; }
      if (now.getTime() > due.getTime() + step.staleDays * DAY) { await skipStep(c, 'M', step, 'stale', mEntered); continue; }
      return { c, seq: 'M', origin: seq, step, due, entered: mEntered, last: i === monthly.length - 1, retry: prior };
    }
    await markDone(c, 'M');
    return null;
  }

  counts.candidates = candidates.length;
  // Messages de service d’abord (minutes épuisées en tête), puis les plus anciens.
  candidates.sort((a, b) => Number(b.step.service) - Number(a.step.service) || Number(Boolean(b.urgent)) - Number(Boolean(a.urgent)) || a.due.getTime() - b.due.getTime());

  // 4. Filtres, mise en forme et envoi.
  const allLogs = () => Array.from(logsByKey.values()).flat();
  const cap = dailyCap(allLogs(), cfg.maxPerDay, now);
  let sentToday = allLogs().filter((l) => COUNTED.includes(l.status) && l.created_at.slice(0, 10) === today).length;
  let sentRun = 0;

  const processCandidate = async (cand: Candidate) => {
    const { c, seq, step, entered } = cand;
    const wait = (reason: string) => note('waiting', c, step.step, reason);
    if (c.isTest) { wait('test_account'); return; }
    // Langue inconnue : listée dans le rapport ; aucun commercial, mais les messages de service partent en anglais.
    if (!c.locale && review.length < 50 && !review.includes(c.email)) review.push(c.email);
    if (!c.locale && !step.service) { wait('locale_unknown'); return; }
    const locale: Locale = c.locale ?? SERVICE_FALLBACK_LOCALE;
    // RELANCES_LOCALES ne ferme que le commercial ; les messages de service suivent RELANCES_SERVICE_LOCALES (7 langues).
    if (!(step.service ? cfg.serviceLocales : cfg.locales).includes(locale)) { wait('locale_closed'); return; }
    if (!cfg.sequences.includes(seq)) { wait('sequence_closed'); return; }
    // Sans Stripe, l’étape de vie d’un compte est incertaine : seules la série P et I1 peuvent partir.
    if ((step.needsStripe || (seq === 'M' && cand.origin !== 'P')) && !stripeReady) { wait('stripe_not_ready'); return; }
    const content = deps.content(locale);
    if (!content) { wait('content_missing'); return; }
    const facts = buildRelanceFacts(getI18n(locale));
    if (!facts) { wait('facts_missing'); return; }
    const tpl = templateOf(content, step, c, locale, cand.origin, now);
    const message: RelanceMessage | null = tpl.build(facts);
    if (!message) { await skipStep(c, seq, step, 'template_skipped', entered, { template_key: tpl.key }); return; }
    const marketing = message.category === 'marketing';
    if (marketing && (!c.locale || !cfg.locales.includes(locale))) { wait(c.locale ? 'locale_closed' : 'locale_unknown'); return; }

    // Arrêts et accords.
    if (c.stops.some((s) => s.scope === 'all')) { await stopState(c, seq, entered, 'bounced'); wait('bounced'); return; }
    // Arrêt posé par l’équipe (lien des alertes) : définitif, quelle que soit la date. Désinscription reçue par e-mail :
    // comme une préférence « essentiels seulement », sauf si la personne s’est réinscrite depuis (préférence « all »).
    const manualStop = c.stops.some((s) => s.reason === 'manual');
    const mailOptOut = c.pref !== 'all' && c.stops.some((s) => s.reason === 'unsubscribed');
    if (marketing && manualStop) { await stopState(c, seq, entered, 'manual'); wait('manual_stop'); return; }
    if (message.skipIfEssentialOnly && (manualStop || mailOptOut)) {
      await skipStep(c, seq, step, manualStop ? 'manual_stop' : 'essential_only', entered, { template_key: tpl.key, category: message.category });
      return;
    }
    const replied = c.stops.some((s) => s.reason === 'replied' && Date.parse(s.created_at) >= entered.getTime());
    if (marketing && replied) { await stopState(c, seq, entered, 'replied'); wait('replied'); return; }
    if (message.skipIfEssentialOnly && replied) { await skipStep(c, seq, step, 'replied', entered, { template_key: tpl.key, category: message.category }); return; }
    if (message.skipIfEssentialOnly && c.pref === 'essential_only') { await skipStep(c, seq, step, 'essential_only', entered, { template_key: tpl.key, category: message.category }); return; }
    let basis: LegalBasis = 'contract';
    if (marketing) {
      if (!prefs || !optouts) { wait('prefs_unavailable'); return; }
      if (c.phoneOptout) { await stopState(c, seq, entered, 'phone_optout'); wait('phone_optout'); return; }
      if (c.pref === 'essential_only' || mailOptOut) { wait('opted_out'); return; }
      if (cand.origin === 'P' && c.pausedSector) { await stopState(c, seq, entered, 'paused_sector'); wait('paused_sector'); return; }
      if (cand.origin === 'P' && c.phones.some((p) => p.startsWith('+1'))) { await stopState(c, seq, entered, 'phone_plus1'); wait('phone_plus1'); return; }
      if (c.supportOpen) { wait('support_open'); return; }
      const b = marketingBasis(c, locale, cand.origin);
      if ('reason' in b) { wait(b.reason); return; }
      basis = b.basis;
      if (!dryRun && replyCheck !== 'ok') { wait('reply_check_unavailable'); return; }
    }

    // Fenêtre locale, pression et plafonds.
    const block = windowBlock(locale, now, step.service);
    if (block) { wait(block); return; }
    const own = (logsByKey.get(c.key) ?? []).filter((l) => COUNTED.includes(l.status));
    const tz = MARKET_TZ[locale];
    if (own.some((l) => localParts(new Date(l.created_at), tz).date === localParts(now, tz).date)) { wait('same_day'); return; }
    if (marketing) {
      const mk = own.filter((l) => l.category === 'marketing').map((l) => Date.parse(l.created_at));
      if (mk.some((t) => now.getTime() - t < 3 * DAY)) { wait('pressure_3d'); return; }
      if (mk.filter((t) => now.getTime() - t < 7 * DAY).length >= 2) { wait('pressure_week'); return; }
    }
    if (sentToday >= cap) { wait('cap_day'); return; }
    if (sentRun >= cfg.maxPerRun) { wait('cap_run'); return; }

    // Mise en forme : variable obligatoire absente = étape sautée.
    // utm_campaign : nom de l’étape, sans l’épisode des alertes de solde (« S1@2026-10-08 » → S1).
    const rendered = renderMessage({ content, message, locale, brand: MARKETS[locale].brand, vars: varsFor(c, locale, content, step, now), campaign: step.step.replace(/@.*/, '') });
    if (!rendered.ok) { await skipStep(c, seq, step, rendered.reason, entered, { template_key: tpl.key, category: message.category }); return; }
    const mail = rendered.mail;

    // Étape de vie relue juste avant l’envoi.
    const fresh = await store.recheck(c.email);
    if (!fresh) { wait('recheck_failed'); return; }
    const freshSubs = fresh.subscriptions.filter((s) => s.livemode !== false);
    const now2 = stageOf({ ...c, signup: c.signup ?? (fresh.signedUp ? { email: c.email, name: null, signed_up_at: null } : null), subscriptions: freshSubs }, stripeReady);
    if (seq === 'A' || seq === 'S') {
      // Séries parallèles : toujours à une étape suivie, et (A) sans résiliation, annulation ni impayé depuis la lecture.
      if (!now2 || !(seq === 'A' ? A_STAGES : S_STAGES).includes(now2) || (seq === 'A' && onboardingStop({ ...c, subscriptions: freshSubs }))) { wait('stage_changed'); return; }
    } else if ((now2 ? SEQ_OF_STAGE[now2] : undefined) !== (seq === 'M' ? cand.origin : seq)) { wait('stage_changed'); return; }
    // Essai annulé (ou annulation retirée) depuis la lecture : le texte choisi ne correspond plus.
    if (seq === 'C' && trialCancelScheduled(latestTrialOf(freshSubs)) !== trialCancelScheduled(latestTrial(c))) { wait('stage_changed'); return; }

    await ensureState(c, seq, entered);
    const base: LogRow = {
      email_key: c.key, sequence: seq, step: step.step, dry_run: dryRun, status: 'queued', category: mail.category, locale,
      subject: mail.subject, created_at: now.toISOString(), attempts: 1,
    };
    const extra: Partial<LogRow> = { template_key: tpl.key, template_version: `${LANG_OF[locale]}:${TEMPLATE_VERSION}`, legal_basis: basis };
    const key = { email_key: c.key, sequence: seq, step: step.step, dry_run: dryRun };
    const remember = (row: LogRow) => (logsByKey.get(c.key) ?? logsByKey.set(c.key, []).get(c.key)!).push(row);

    if (dryRun) {
      const row: LogRow = { ...base, ...extra, status: 'dry_run', preview: `${mail.subject}\n\n${mail.text}`.slice(0, 4000) };
      if (!(await store.insertLogIfNew(row))) { wait('already_logged'); return; }
      remember(row);
      counts.dry_run++;
      sentToday++;
      sentRun++;
      if (decisions.length < 300) decisions.push({ k: c.key.slice(0, 12), s: step.step, r: 'dry_run' });
      if (cand.last) await markDone(c, seq);
      return;
    }

    // Envoi réel : ligne « queued » d’abord (idempotence), puis sendMail, puis résultat.
    const attempts = (cand.retry?.attempts ?? 0) + 1;
    if (cand.retry) await store.updateLog(key, { status: 'queued', attempts });
    else if (!(await store.insertLogIfNew({ ...base, ...extra }))) { wait('already_logged'); return; }
    const row: LogRow = { ...base, ...extra, attempts };
    remember(row);
    sentToday++;
    sentRun++;
    if (sentRun > 1) await deps.sleep(LIVE_GAP_MS);
    try {
      const ok = await deps.sendMail({ to: c.email, subject: mail.subject, text: mail.text, html: mail.html, category: mail.category, locale, fromName: MARKETS[locale].brand });
      row.status = ok ? 'sent' : 'skipped';
      row.sent_at = ok ? deps.now().toISOString() : null;
      await store.updateLog(key, ok ? { status: 'sent', sent_at: row.sent_at } : { status: 'skipped', skip_reason: 'mail_skipped' });
      if (ok) {
        counts.sent++;
        if (decisions.length < 300) decisions.push({ k: c.key.slice(0, 12), s: step.step, r: 'sent' });
      } else note('skipped', c, step.step, 'mail_skipped');
      if (cand.last) await markDone(c, seq);
    } catch (e: any) {
      const final = attempts >= 3;
      row.status = final ? 'failed' : 'failed_retry';
      counts.failed++;
      // Réponse SMTP de refus : elle cite souvent l’adresse du destinataire, masquée dans le journal et en base.
      errors.push(`envoi ${step.step} : ${maskEmails(String(e?.message ?? e))}`);
      await store.updateLog(key, { status: row.status, skip_reason: maskEmails(String(e?.message || 'error')).slice(0, 200) }).catch(() => undefined);
      if (final) await deps.notifyTeam(`Relances : échec définitif ${step.step}`, `L’étape ${step.step} n’a pas pu partir après 3 tentatives (${e?.message}).`).catch(() => undefined);
    }
  };
  for (const cand of candidates) {
    // Une erreur d’écriture ou d’envoi n’arrête pas le passage : elle est journalisée et le contact suivant est traité.
    try { await processCandidate(cand); } catch (e: any) { errors.push(`${cand.step.step} : ${e?.message}`); }
  }

  // 5. Alertes à l’équipe sur les comptes suivis (essai, abonné, paiement à la minute) : client sans agent (J+3), risque
  //    de résiliation (abonné, J+14), renouvellement sans appel sur 30 jours (5 jours avant), minutes basses ou épuisées,
  //    crédits de messages à 0, agent mis en pause par la conformité, solde de l’agence. Une seule fois par clé (verrou
  //    en base, tous modes confondus, posé avant l’envoi) ; jamais pour un compte de test ; 10 au plus par passage.
  const views: AccountView[] = contacts.filter((c) => A_STAGES.includes(stageByKey.get(c.key)!)).map((c) => {
    const st = stateOf(c, 'A');
    return {
      c, stage: stageByKey.get(c.key)!, act: activityOf(c), start: st ? new Date(st.entered_at) : onboardingStart(c),
      sub: runningSubscription(c), minutes: minutesNow(c, now)?.minutes ?? null, credits: creditsNow(c, now), userId: userIdOf(c),
    };
  });
  const lowBalance = views.filter((v) => S_STAGES.includes(v.stage) && v.minutes != null).map((v) => {
    const threshold = lowMinutesThreshold(v.c, v.c.locale ?? SERVICE_FALLBACK_LOCALE);
    // Solde arrondi comme {minutes_left} : sous 1 minute, c’est « épuisé » (S2).
    return { v, threshold, step: (Math.floor(v.minutes!) <= 0 ? 'S2' : 'S1') as 'S1' | 'S2', low: v.minutes! <= threshold, ep: balanceEpisode(snapsByKey.get(v.c.key) ?? [], v.minutes!, threshold) };
  }).filter((x) => x.low);
  const creditsOut = views.filter((v) => v.credits != null && creditsEpisode(snapsByKey.get(v.c.key) ?? [], v.credits) != null);
  const claimed = claimedAlerts.get(store) ?? claimedAlerts.set(store, new Set()).get(store)!;
  // Plafond et rythme : les alertes partent par la même boîte Zoho que les relances (pas d’envoi groupé). Au plus
  // MAX_ALERTS_PER_RUN par passage, 3 s entre deux envois ; au-delà, la clé n’est pas réservée et l’alerte part au
  // passage suivant (premier passage après le déploiement : tous les comptes suivis d’un coup). Ordre : solde de
  // l’agence (tous les clients), minutes épuisées puis basses, puis la mise en route, les agents en pause, les crédits.
  let alertsRun = 0;
  const alert = async (key: string, m: { subject: string; text: string; html: string }) => {
    if (!store.claimAlert || claimed.has(key)) return;
    if (alertsRun >= MAX_ALERTS_PER_RUN) { counts.waiting.alert_cap = (counts.waiting.alert_cap || 0) + 1; return; }
    try {
      const first = await store.claimAlert(key);
      claimed.add(key);
      if (!first) return;
      if (alertsRun > 0 || (!dryRun && sentRun > 0)) await deps.sleep(LIVE_GAP_MS);
      alertsRun++;
      await deps.notifyTeam(m.subject, m.text, m.html);
      counts.alerts++;
    // Type d’alerte seulement dans le journal (jamais le nom ni l’adresse du client).
    } catch (e: any) { errors.push(`alerte « ${key.split(':')[0]} » : ${e?.message}`); }
  };
  const agency = { balance: null as number | null, min: cfg.agencyBalanceMin, read: false };
  if (deps.agencyBalance) {
    agency.read = true;
    // Lecture facultative (GET /user/me) : une réponse illisible est notée « illisible » dans le rapport, sans erreur.
    try { agency.balance = await deps.agencyBalance(); } catch (e: any) { log(`[relances] solde de l’agence illisible : ${e?.message}`); }
    // Seuil à 0 : alerte coupée (même un solde négatif ne la déclenche pas).
    if (agency.min > 0 && agency.balance != null && agency.balance < agency.min) await alert(`solde_agence:${localParts(now, 'Europe/Paris').date}`, agencyBalanceMail(agency.balance, agency.min));
  }
  for (const x of [...lowBalance].sort((p, q) => Number(q.ep?.step === 'S2') - Number(p.ep?.step === 'S2'))) {
    if (!x.v.c.isTest && x.ep) await alert(`minutes:${x.v.c.key}:${x.ep.step}@${x.ep.since}`, balanceMail(x.v, x.ep.step, x.threshold, now, dryRun));
  }
  for (const v of views) {
    if (v.c.isTest) continue;
    const a = freshActivity(v.act, now) ? v.act : null;
    const startKey = v.start ? v.start.toISOString().slice(0, 10) : null;
    const days = v.start ? Math.floor((now.getTime() - v.start.getTime()) / DAY) : null;
    // Mise en route : rien si la série A est arrêtée (réponse, opposition, annulation, impayé).
    const stopped = Boolean(onboardingStop(v.c) || stateOf(v.c, 'A')?.status === 'stopped');
    if (a && startKey && days != null && !stopped) {
      if (a.agents === 0 && days >= A_NO_AGENT_ALERT_DAYS) await alert(`sans_agent:${v.c.key}:${startKey}`, noAgentMail(v, now, dryRun));
      if (v.stage === 'paying' && days >= A_CHURN_RISK_DAYS && (a.agents === 0 || a.realCalls === 0)) {
        await alert(`risque_resiliation:${v.c.key}:${startKey}`, churnRiskMail(v, now, a.agents === 0));
      }
    }
    // Renouvellement : sans agent, le texte dit qu’aucun e-mail ne part plus (le suivi mensuel est sauté).
    const end = v.sub?.current_period_end ? new Date(v.sub.current_period_end) : null;
    if (a && !stopped && v.stage === 'paying' && end && end.getTime() > now.getTime() && end.getTime() - now.getTime() <= A_RENEWAL_ALERT_DAYS * DAY && noCallSince(a, now, 30) === true) {
      await alert(`renouvellement:${v.c.key}:${end.toISOString().slice(0, 10)}`, renewalMail(v, now, end, dryRun));
    }
    if (a?.paused.length) await alert(`agent_pause:${v.userId ?? v.c.key}:${a.paused.map((p) => p.since.slice(0, 10)).sort()[0]}`, pausedAgentMail(v, now));
  }
  for (const v of creditsOut) {
    if (!v.c.isTest) await alert(`credits:${v.c.key}:${creditsEpisode(snapsByKey.get(v.c.key) ?? [], v.credits!)}`, creditsMail(v, now));
  }

  // Rubrique « À faire aujourd’hui » du rapport de 8 h (nominative, interne).
  const emailOfKey = new Map(contacts.map((c) => [c.key, c.email]));
  const replies = Array.from(new Set(stops.filter((x) => x.reason === 'replied' && now.getTime() - Date.parse(x.created_at) <= DAY).map((x) => emailOfKey.get(x.email_key) ?? 'adresse inconnue')));
  const todo = buildTodo({
    views, lowBalance: lowBalance.map(({ v, step, threshold }) => ({ v, step, threshold })), creditsOut, replies,
    callbacks: callbacks ?? [], reads, agency,
  }, now);

  // 6. Rapport quotidien à l’équipe (8 h, heure de Paris).
  await sendReportIfDue(deps, { now, dryRun, settings, logs: allLogs(), stops, review, replyCheck, counts, errors, todo })
    .catch((e) => errors.push(`rapport : ${e?.message}`));

  return finish('done');
}

/** Date la plus récente d’une liste (fin d’essai annulé). */
function latestDate(values: (string | null)[]) {
  const t = values.filter(Boolean).map((v) => Date.parse(v as string)).filter((n) => !Number.isNaN(n)).sort((a, b) => b - a)[0];
  return t ? new Date(t) : null;
}
