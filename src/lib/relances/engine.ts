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
import { getI18n } from '@/i18n';
import { buildRelanceFacts } from '@/i18n/content/fr';
import type { RelanceKey, RelanceMessage, RelancesContent } from '@/i18n/content/fr/ui/relances';
import { LANG_OF, type Locale } from '@/i18n/locales';
import { MARKETS, type PlanSlug } from '@/i18n/markets';
import { MARKET_TZ, dayMonth, localParts, longDate, windowBlock } from './calendar';
import { renderMessage, type RenderVars } from './render';
import { sendReportIfDue } from './report';
import { buildContacts, marketingBasis, stageOf, SEQ_OF_STAGE, type Contact } from './selection';
import {
  C4_MINUTES_LEFT, C5_DAYS_BEFORE_END, DAY, U_LOW_USAGE, U_MIN_ACCOUNT_AGE_DAYS, U_REGULAR_USAGE, dueAt, stepsOf, uHeavyUsage,
  type StepDef,
} from './sequences';
import type { EngineDeps, LegalBasis, LogRow, RunRow, Seq, SnapshotRow, StateRow, StopRow, StripeSubscriptionRow } from './types';

export interface RunResult {
  status: 'disabled' | 'not_installed' | 'done' | 'halted' | 'error';
  dryRun: boolean;
  reason?: string;
  counts: Counts;
}
interface Counts { contacts: number; candidates: number; sent: number; dry_run: number; failed: number; skipped: Record<string, number>; waiting: Record<string, number> }

/** Version des textes enregistrée avec chaque envoi (à changer quand les textes changent). */
const TEMPLATE_VERSION = '2026-10-08';
const LIVE_GAP_MS = 3_000; // 3 s entre deux envois réels (Zoho : pas d’envoi groupé)
const COUNTED: LogRow['status'][] = ['sent', 'dry_run', 'queued'];

/** Plafond du jour : imposé par RELANCES_MAX_PER_DAY, sinon montée progressive 20 (1re semaine), 50, puis 150. */
function dailyCap(logs: LogRow[], override: number | null, now: Date) {
  if (override != null) return override;
  const first = logs.filter((l) => l.status === 'sent' || l.status === 'dry_run').map((l) => Date.parse(l.created_at)).sort((a, b) => a - b)[0];
  const days = first ? (now.getTime() - first) / DAY : 0;
  return days < 7 ? 20 : days < 14 ? 50 : 150;
}

/** Forfait d’un abonnement Stripe, reconnu au prix lu dans markets.ts (mensuel ou annuel). */
function planOf(sub: StripeSubscriptionRow | undefined, locale: Locale): { slug: PlanSlug; monthly: boolean } | null {
  if (!sub?.price_amount || (sub.currency && sub.currency.toLowerCase() !== MARKETS[locale].currency.toLowerCase())) return null;
  for (const slug of ['receptionniste', 'assistant', 'centre-appels'] as PlanSlug[]) {
    const p = MARKETS[locale].plans[slug];
    if (sub.billing_interval === 'month' && p.price != null && Math.round(p.price * 100) === sub.price_amount) return { slug, monthly: true };
    if (sub.billing_interval === 'year' && p.annualPrice != null && Math.round(p.annualPrice * 100) === sub.price_amount) return { slug, monthly: false };
  }
  return null;
}

const latestTrial = (c: Contact) => c.subscriptions.filter((s) => s.trial_end).sort((a, b) => String(b.trial_end).localeCompare(String(a.trial_end)))[0];

/** Variables du contact pour les textes ; ce qui vient de Stripe n’est jamais estimé (absent = étape sautée).
 *  Exportée pour les aperçus (scripts/preview-relances.ts), qui passent par le même calcul. */
export function varsFor(c: Contact, locale: Locale, content: RelancesContent, step: StepDef, now: Date): RenderVars {
  const i18n = getI18n(locale);
  const tz = MARKET_TZ[locale];
  const nl = i18n.market.numberLocale;
  const sector = c.sector && !c.pausedSector ? i18n.c.sectors.find((s) => s.slug === c.sector) : undefined;
  const sub = latestTrial(c);
  const plan = planOf(sub, locale);
  const fresh = c.platform && now.getTime() - Date.parse(c.platform.snapDate) <= 2 * DAY;
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
    minutes_left: fresh ? i18n.num(Math.max(0, Math.floor(c.platform!.minutes))) : null,
    plan_name: plan ? i18n.c.offers[plan.slug].name : null,
    plan_price: plan?.monthly && sub?.price_amount ? i18n.money(sub.price_amount / 100) : null,
    topic_title: topic?.title ?? null,
    topic_paragraph: topic?.paragraph ?? null,
  };
}

/** Texte de l’étape (P3 sans secteur connu → P3_generic ; M → prospect ou espace client selon la série d’origine).
 *  Exportée pour les aperçus (scripts/preview-relances.ts). */
export function templateOf(content: RelancesContent, step: StepDef, c: Contact, locale: Locale, origin: Seq) {
  if (step.key === 'M') return { key: origin === 'P' ? 'M_prospect' : 'M_account', build: origin === 'P' ? content.monthly.prospect : content.monthly.account };
  let key: RelanceKey = step.key;
  if (key === 'P3' && !(c.sector && !c.pausedSector && getI18n(locale).c.sectors.some((s) => s.slug === c.sector))) key = 'P3_generic';
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
}

export async function runRelances(deps: EngineDeps, opts: { forceDryRun?: boolean } = {}): Promise<RunResult> {
  const { store, config: cfg } = deps;
  const log = deps.log ?? ((m: string) => console.log(m));
  const now = deps.now();
  const counts: Counts = { contacts: 0, candidates: 0, sent: 0, dry_run: 0, failed: 0, skipped: {}, waiting: {} };
  const decisions: RunRow['decisions'] = [];
  const errors: string[] = [];
  let dryRun = cfg.dryRun || Boolean(opts.forceDryRun);
  const startedAt = now.toISOString();
  const finish = async (status: RunResult['status'], reason?: string): Promise<RunResult> => {
    if (status !== 'not_installed') {
      await store.saveRun({ started_at: startedAt, finished_at: deps.now().toISOString(), dry_run: dryRun, status, counts: { ...counts, reason }, decisions, errors })
        .catch((e) => log(`[relances] journal du passage non enregistré : ${e?.message}`));
    }
    log(`[relances] ${status}${reason ? ` (${reason})` : ''} — ${dryRun ? 'mode test' : 'envoi réel'} : ${counts.sent} envoyés, ${counts.dry_run} simulés, ${counts.failed} échecs`);
    return { status, dryRun, reason, counts };
  };
  const note = (kind: 'skipped' | 'waiting', c: Contact, step: string, reason: string) => {
    counts[kind][reason] = (counts[kind][reason] || 0) + 1;
    if (decisions.length < 300) decisions.push({ k: c.key.slice(0, 12), s: step, r: `${kind}:${reason}` });
  };

  // 1. Interrupteurs.
  if (!cfg.envEnabled) return finish('disabled', 'RELANCES_ENABLED');
  const settings = await store.settings();
  if (!settings) return finish('not_installed', 'relance_settings');
  if (!settings.enabled) return finish('disabled', settings.paused_reason ? `relance_settings (${settings.paused_reason})` : 'relance_settings');

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
      for (const m of mails) {
        const targets = m.bounce ? m.bodyEmails.map((e) => byEmail.get(e)).filter(Boolean) as Contact[] : (m.automatic ? [] : [byEmail.get(m.from)].filter(Boolean) as Contact[]);
        for (const c of targets) {
          const reason = m.bounce ? 'bounced' : 'replied';
          const source = `imap:${m.date ?? ''}`.slice(0, 80);
          if (c.stops.some((s) => s.reason === reason && s.source === source)) continue;
          const row: StopRow = { email_key: c.key, reason, scope: m.bounce ? 'all' : 'marketing', source, created_at: now.toISOString() };
          await store.addStop(row).catch((e) => errors.push(`arrêt non enregistré : ${e?.message}`));
          c.stops.push(row);
          stops.push(row);
          fresh.push(`${reason === 'bounced' ? 'Rebond' : 'Réponse'} : ${c.email}${m.bounce ? '' : ` — « ${m.subject.slice(0, 120)} »`}`);
        }
      }
      if (fresh.length) {
        await deps.notifyTeam(`Relances : ${fresh.length} réponse(s) ou rebond(s) — relances arrêtées`, `${fresh.join('\n')}\n\nLes relances marketing de ces contacts sont arrêtées ; l’équipe prend le relais.`)
          .catch((e) => errors.push(`alerte réponses : ${e?.message}`));
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

  // 3. Étape échue de chaque contact.
  const candidates: Candidate[] = [];
  const review: string[] = [];
  for (const c of contacts) {
    const stage = stageOf(c, stripeReady);
    const target = stage ? SEQ_OF_STAGE[stage] : undefined;
    // Changement d’étape de vie : la série précédente est close.
    for (const st of statesByKey.get(c.key) ?? []) {
      const closesM = st.sequence === 'M' && (!target || stateOf(c, target)?.status !== 'done');
      if (st.status === 'active' && st.sequence !== target && (st.sequence !== 'M' || closesM)) {
        await stopState(c, st.sequence, new Date(st.entered_at), `stage_changed:${stage ?? 'none'}`);
      }
    }
    if (!target) continue;
    if (target === 'P' && !signups) { note('waiting', c, 'P', 'signups_unavailable'); continue; }
    try {
      const picked = await nextStep(c, target, stage!);
      if (picked) candidates.push(picked);
    } catch (e: any) { errors.push(`contact ${c.key.slice(0, 8)} : ${e?.message}`); }
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
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const prior = done(seq, step.step);
      if (prior && prior.status !== 'failed_retry') continue;
      let due: Date | null = dueAt(entered, step);
      let staleAt: number | null = null;
      if (seq === 'C') {
        if (step.step === 'C4') {
          // Événement : 5 minutes d’essai ou moins, lues dans un instantané récent.
          const fresh = c.platform && now.getTime() - Date.parse(c.platform.snapDate) <= 2 * DAY;
          due = fresh && c.platform!.minutes <= C4_MINUTES_LEFT ? now : null;
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
      if (seq === 'C' && step.step === 'C2') {
        // Seulement si aucune minute n’a été consommée (instantané récent obligatoire).
        const fresh = c.platform && now.getTime() - Date.parse(c.platform.snapDate) <= 2 * DAY;
        const trialMinutes = c.locale ? MARKETS[c.locale].trial.minutes : null;
        if (!fresh || trialMinutes == null) { await skipStep(c, seq, step, 'condition_unknown', entered); continue; }
        if (c.platform!.minutes < trialMinutes) { await skipStep(c, seq, step, 'condition_not_met', entered); continue; }
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
  // Messages de service d’abord, puis les plus anciens.
  candidates.sort((a, b) => Number(b.step.service) - Number(a.step.service) || a.due.getTime() - b.due.getTime());

  // 4. Filtres, mise en forme et envoi.
  const allLogs = () => Array.from(logsByKey.values()).flat();
  const cap = dailyCap(allLogs(), cfg.maxPerDay, now);
  let sentToday = allLogs().filter((l) => COUNTED.includes(l.status) && l.created_at.slice(0, 10) === today).length;
  let sentRun = 0;

  const processCandidate = async (cand: Candidate) => {
    const { c, seq, step, entered } = cand;
    const wait = (reason: string) => note('waiting', c, step.step, reason);
    if (c.isTest) { wait('test_account'); return; }
    if (!c.locale) { wait('locale_unknown'); if (review.length < 50) review.push(c.email); return; }
    const locale = c.locale;
    if (!cfg.locales.includes(locale)) { wait('locale_closed'); return; }
    if (!cfg.sequences.includes(seq)) { wait('sequence_closed'); return; }
    // Sans Stripe, l’étape de vie d’un compte est incertaine : seules la série P et I1 peuvent partir.
    if ((step.needsStripe || (seq === 'M' && cand.origin !== 'P')) && !stripeReady) { wait('stripe_not_ready'); return; }
    const content = deps.content(locale);
    if (!content) { wait('content_missing'); return; }
    const facts = buildRelanceFacts(getI18n(locale));
    if (!facts) { wait('facts_missing'); return; }
    const tpl = templateOf(content, step, c, locale, cand.origin);
    const message: RelanceMessage | null = tpl.build(facts);
    if (!message) { await skipStep(c, seq, step, 'template_skipped', entered, { template_key: tpl.key }); return; }
    const marketing = message.category === 'marketing';

    // Arrêts et accords.
    if (c.stops.some((s) => s.scope === 'all')) { await stopState(c, seq, entered, 'bounced'); wait('bounced'); return; }
    const replied = c.stops.some((s) => s.reason === 'replied' && Date.parse(s.created_at) >= entered.getTime());
    if (marketing && replied) { await stopState(c, seq, entered, 'replied'); wait('replied'); return; }
    if (message.skipIfEssentialOnly && replied) { await skipStep(c, seq, step, 'replied', entered, { template_key: tpl.key, category: message.category }); return; }
    if (message.skipIfEssentialOnly && c.pref === 'essential_only') { await skipStep(c, seq, step, 'essential_only', entered, { template_key: tpl.key, category: message.category }); return; }
    let basis: LegalBasis = 'contract';
    if (marketing) {
      if (!prefs || !optouts) { wait('prefs_unavailable'); return; }
      if (c.phoneOptout) { await stopState(c, seq, entered, 'phone_optout'); wait('phone_optout'); return; }
      if (c.pref === 'essential_only') { wait('opted_out'); return; }
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
    const rendered = renderMessage({ content, message, locale, brand: MARKETS[locale].brand, vars: varsFor(c, locale, content, step, now), campaign: step.step });
    if (!rendered.ok) { await skipStep(c, seq, step, rendered.reason, entered, { template_key: tpl.key, category: message.category }); return; }
    const mail = rendered.mail;

    // Étape de vie relue juste avant l’envoi.
    const fresh = await store.recheck(c.email);
    if (!fresh) { wait('recheck_failed'); return; }
    const now2 = stageOf({ ...c, signup: c.signup ?? (fresh.signedUp ? { email: c.email, name: null, signed_up_at: null } : null), subscriptions: fresh.subscriptions.filter((s) => s.livemode !== false) }, stripeReady);
    if ((now2 ? SEQ_OF_STAGE[now2] : undefined) !== (seq === 'M' ? cand.origin : seq)) { wait('stage_changed'); return; }

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
      errors.push(`envoi ${step.step} : ${e?.message}`);
      await store.updateLog(key, { status: row.status, skip_reason: String(e?.message || 'error').slice(0, 200) }).catch(() => undefined);
      if (final) await deps.notifyTeam(`Relances : échec définitif ${step.step}`, `L’étape ${step.step} n’a pas pu partir après 3 tentatives (${e?.message}).`).catch(() => undefined);
    }
  };
  for (const cand of candidates) {
    // Une erreur d’écriture ou d’envoi n’arrête pas le passage : elle est journalisée et le contact suivant est traité.
    try { await processCandidate(cand); } catch (e: any) { errors.push(`${cand.step.step} : ${e?.message}`); }
  }

  // 5. Rapport quotidien à l’équipe (8 h, heure de Paris).
  await sendReportIfDue(deps, { now, dryRun, settings, logs: allLogs(), stops, review, replyCheck, counts, errors })
    .catch((e) => errors.push(`rapport : ${e?.message}`));

  return finish('done');
}

/** Date la plus récente d’une liste (fin d’essai annulé). */
function latestDate(values: (string | null)[]) {
  const t = values.filter(Boolean).map((v) => Date.parse(v as string)).filter((n) => !Number.isNaN(n)).sort((a, b) => b - a)[0];
  return t ? new Date(t) : null;
}
