// Mise en route (série A), solde de minutes (série S), alertes à l’équipe et rubrique « À faire aujourd’hui » du
// rapport de 8 h (audit du 9 oct., § 7 et actions 6, 7 et 13) : fonctions pures appelées par le moteur
// (src/lib/relances/engine.ts). Rien ne part d’ici. Règles :
// - comptes suivis : essai (trialing), abonné (active, past_due…) et paiement à la minute (payg) ;
// - début (J0) : début de l’essai, sinon début de l’abonnement (start_date, migration facultative du 9 oct.) ; à défaut
//   (paiement à la minute, abonnement sans date), le moteur prend la première fois qu’il voit le compte à cette étape ;
// - série A arrêtée : opposition, impayé, annulation ou résiliation programmée (et réponse du client, vue par le
//   moteur) ; A1 à A3 sautées dès qu’un agent existe, A4 au premier appel réel ;
// - une lecture des agents de plus de 48 h, ou en échec, ne décide rien : les étapes attendent ;
// - solde de minutes : S1 sous le seuil (20 minutes, ou 15 % des minutes du forfait si c’est plus), S2 à 0 minute, une
//   fois par épisode, seulement après une baisse observée dans les instantanés (jamais d’envoi rétroactif).
import { getI18n } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { MARKETS, type PlanSlug } from '@/i18n/markets';
import { formatAmount, teamMail, type Row, type TeamMail } from './payments';
import { trialCancelScheduled, type Contact } from './selection';
import {
  A_ACTIVITY_MAX_AGE_HOURS, A_CALL_DAYS, A_IDLE_DAYS, A_NO_AGENT_ALERT_DAYS, DAY, S_LOW_MINUTES, S_LOW_SHARE,
} from './sequences';
import type { AccountActivity, CallbackRow, SnapshotRow, Stage, StripeSubscriptionRow } from './types';

/** Étapes de vie suivies par la série A (mise en route) et par la série S (solde de minutes ; l’essai a C4). */
export const A_STAGES: Stage[] = ['trialing', 'paying', 'payg'];
export const S_STAGES: Stage[] = ['paying', 'payg'];

const RUNNING = ['trialing', 'active', 'past_due', 'unpaid', 'incomplete', 'paused'];
const UNPAID = ['past_due', 'unpaid', 'incomplete', 'paused'];
const PARIS = 'Europe/Paris';

const dateOf = (v: string | null | undefined) => {
  const t = v ? Date.parse(v) : NaN;
  return Number.isNaN(t) ? null : new Date(t);
};

/** Forfait d’un abonnement Stripe, reconnu au prix lu dans markets.ts (mensuel ou annuel). */
export function planOf(sub: StripeSubscriptionRow | undefined, locale: Locale): { slug: PlanSlug; monthly: boolean } | null {
  if (!sub?.price_amount || (sub.currency && sub.currency.toLowerCase() !== MARKETS[locale].currency.toLowerCase())) return null;
  for (const slug of ['receptionniste', 'assistant', 'centre-appels'] as PlanSlug[]) {
    const p = MARKETS[locale].plans[slug];
    if (sub.billing_interval === 'month' && p.price != null && Math.round(p.price * 100) === sub.price_amount) return { slug, monthly: true };
    if (sub.billing_interval === 'year' && p.annualPrice != null && Math.round(p.annualPrice * 100) === sub.price_amount) return { slug, monthly: false };
  }
  return null;
}

/** Abonnement en cours (essai ou payant), le plus récent. */
export function runningSubscription(c: Pick<Contact, 'subscriptions'>) {
  const start = (s: StripeSubscriptionRow) => String(s.start_date ?? s.trial_start ?? '');
  return c.subscriptions.filter((s) => RUNNING.includes(String(s.status))).sort((a, b) => start(b).localeCompare(start(a)))[0];
}

/** Début de la mise en route : début de l’essai, sinon de l’abonnement ; null si inconnu (paiement à la minute). */
export function onboardingStart(c: Pick<Contact, 'subscriptions'>): Date | null {
  const sub = runningSubscription(c);
  return dateOf(sub?.trial_start) ?? dateOf(sub?.start_date);
}

/** Motif d’arrêt de la série A (hors réponse du client, vue par le moteur), sinon null. */
export function onboardingStop(c: Contact): string | null {
  if (c.phoneOptout || c.stops.some((s) => s.reason === 'manual')) return 'opposed';
  if (c.subscriptions.some((s) => UNPAID.includes(String(s.status)))) return 'unpaid';
  const sub = runningSubscription(c);
  if (sub && (trialCancelScheduled(sub) || (sub.status !== 'trialing' && (sub.cancel_at_period_end || dateOf(sub.cancel_at))))) return 'cancel_scheduled';
  return null;
}

/** Lecture des agents utilisable (moins de 48 h). */
export const freshActivity = (a: AccountActivity | null | undefined, now: Date): a is AccountActivity =>
  Boolean(a && now.getTime() - Date.parse(a.readAt) <= A_ACTIVITY_MAX_AGE_HOURS * 3_600_000);

/**
 * A4 : agent créé, mais sans numéro ou sans aucun appel réel sur la fenêtre lue ; null = appels illisibles. Un compte
 * sans agent relié à un numéro mais avec des appels réels (agent sortant, campagnes) est en service : pas de A4.
 */
export function agentIdle(a: AccountActivity): boolean | null {
  if (a.agents === 0) return false;
  if (a.agentsWithNumber === 0) return a.realCalls ? false : true;
  return a.realCalls == null ? null : a.realCalls === 0;
}

/** Aucun appel réel depuis `days` jours (au plus la fenêtre lue, 45 jours) ; null = inconnu. */
export function noCallSince(a: AccountActivity, now: Date, days: number): boolean | null {
  if (a.lastCallAt) return now.getTime() - Date.parse(a.lastCallAt) > days * DAY;
  return a.realCalls === 0 ? true : null;
}

/** Seuil des minutes basses : 20 minutes, ou 15 % des minutes du forfait reconnu si c’est plus. */
export function lowMinutesThreshold(c: Pick<Contact, 'subscriptions'>, locale: Locale) {
  const plan = planOf(runningSubscription(c), locale);
  const minutes = plan ? MARKETS[locale].plans[plan.slug].minutes : 0;
  return Math.max(S_LOW_MINUTES, Math.round(minutes * S_LOW_SHARE));
}

/**
 * Épisode de solde bas : S2 à 0 minute, S1 sous le seuil ; `since` = dernier instantané au-dessus de la borne (l’étape
 * est journalisée « S1@since » : une seule fois par baisse). Aucune baisse observée dans les instantanés : null.
 * Solde arrondi comme {minutes_left} (minute entière inférieure) : 0,6 minute, c’est « 0 », donc S2 et non S1 ; un
 * instantané sous 1 minute ne compte pas comme « au-dessus de 0 » (jamais de S2 sans baisse observée).
 */
export function balanceEpisode(rows: SnapshotRow[], minutes: number, threshold: number): { step: 'S1' | 'S2'; since: string } | null {
  if (minutes > threshold) return null;
  const step = Math.floor(minutes) <= 0 ? 'S2' : 'S1';
  const above = (r: SnapshotRow) => (step === 'S2' ? Math.floor(Number(r.minutes_balance ?? 0)) > 0 : Number(r.minutes_balance ?? 0) > threshold);
  const since = rows.filter(above).map((r) => r.snap_date).sort().pop();
  return since ? { step, since } : null;
}

/** Crédits de messages tombés à 0 : dernier instantané avec des crédits, sinon null (jamais eu de crédits). */
export function creditsEpisode(rows: SnapshotRow[], credits: number): string | null {
  if (credits > 0) return null;
  return rows.filter((r) => Number(r.credits_balance ?? 0) > 0).map((r) => r.snap_date).sort().pop() ?? null;
}

/* ---------- Vue d’un compte (alertes et rapport) ---------- */

export interface AccountView {
  c: Contact;
  stage: Stage;
  act: AccountActivity | null;
  /** Début de la mise en route (J0). */
  start: Date | null;
  sub: StripeSubscriptionRow | undefined;
  minutes: number | null;
  credits: number | null;
  userId: string | null;
}

const day = (d: Date) => new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS, day: 'numeric', month: 'long', year: 'numeric' }).format(d);
const daysSince = (d: Date | null, now: Date) => (d ? Math.max(0, Math.floor((now.getTime() - d.getTime()) / DAY)) : null);
const who = (c: Contact) => [c.name, c.email].filter(Boolean).join(' — ');
const minutesLabel = (n: number) => `${Math.max(0, Math.floor(n))} min`;

function planLabel(v: AccountView) {
  const locale = v.c.locale ?? 'en-gb';
  const plan = planOf(v.sub, locale);
  const price = v.sub?.price_amount ? `${formatAmount(v.sub.price_amount, v.sub.currency)}${v.sub.billing_interval === 'year' ? ' par an' : v.sub.billing_interval === 'month' ? ' par mois' : ''}` : '';
  return [plan ? getI18n('fr').c.offers[plan.slug].name : '', price].filter(Boolean).join(', ');
}

/** Étape lisible : « essai jusqu’au 25 octobre 2026 », « abonné (Réceptionniste, 99,00 $US par mois) », « paiement à la minute ». */
export function stageLabel(v: AccountView) {
  if (v.stage === 'trialing') { const end = dateOf(v.sub?.trial_end); return `essai${end ? ` jusqu’au ${day(end)}` : ''}`; }
  if (v.stage === 'paying') { const p = planLabel(v); return `abonné${p ? ` (${p})` : ''}`; }
  return 'paiement à la minute';
}

function accountRows(v: AccountView, now: Date): Row[] {
  const n = daysSince(v.start, now);
  const a = v.act;
  return [
    ['Client', who(v.c)],
    ['Téléphone', v.c.phones[0] ?? 'inconnu'],
    ['Langue', v.c.locale ?? 'à valider (messages de service en anglais)'],
    ['Étape', stageLabel(v)],
    ...(v.start ? [['Début', `${day(v.start)} (J+${n})`] as Row] : []),
    ...(a ? [
      ['Agents', `${a.agents}${a.agents ? ` (dont ${a.agentsWithNumber} relié(s) à un numéro)` : ''}`] as Row,
      ['Dernier appel réel', a.lastCallAt ? day(new Date(a.lastCallAt)) : a.realCalls === 0 ? `aucun depuis le ${day(new Date(a.callsSince))}` : 'illisible'] as Row,
    ] : []),
    ...(v.minutes != null ? [['Minutes restantes', minutesLabel(v.minutes)] as Row] : []),
    ...(v.userId ? [['Compte de l’espace client', `n° ${v.userId}`] as Row] : []),
  ];
}

const testNote = (dryRun: boolean) => (dryRun ? ' (Relances en mode test : aucun e-mail n’est parti au client.)' : '');

/**
 * Alerte « client sans agent » (J+3, série A, A2) : nom, e-mail, téléphone, langue, forfait, fin d’essai. Appel par une
 * personne de l’équipe seulement pour un client payant (abonné, paiement à la minute) ; pendant l’essai, seulement si
 * le client l’a demandé (conception, « Accord / base légale » de la série A ; audit du 9 oct., § 6).
 */
export function noAgentMail(v: AccountView, now: Date, dryRun: boolean): TeamMail {
  const n = daysSince(v.start, now) ?? A_NO_AGENT_ALERT_DAYS;
  const trial = v.stage === 'trialing';
  const call = trial
    ? 'Pendant l’essai, ne l’appelez que s’il a demandé à être rappelé (bouton de A2 ou A3) ; il figure dans « À faire aujourd’hui » du rapport de 8 h, et y sera marqué « à appeler » s’il devient abonné.'
    : null;
  // Avant J+7 : le client reçoit encore A2 puis A3 ; après (ou alerte tardive, compte ancien) : l’équipe appelle un client payant.
  const closing = n < A_CALL_DAYS
    ? `Aucun agent n’est créé sur ce compte. Le client reçoit A2 « On configure votre agent avec vous ? » (bouton « Être rappelé »), puis A3 à J+${A_CALL_DAYS} s’il n’a toujours pas d’agent. ${call ?? `À partir de J+${A_CALL_DAYS}, appelez-le : il figure dans « À faire aujourd’hui » du rapport de 8 h.`}`
    : `Aucun agent n’est créé sur ce compte depuis ${n} jours. ${call ?? 'Appelez-le pour configurer l’agent avec lui : il figure dans « À faire aujourd’hui » du rapport de 8 h.'}`;
  return teamMail(`Client sans agent depuis ${n} jours — ${v.c.name || v.c.email}`, accountRows(v, now), `${closing}${testNote(dryRun)}`);
}

/** Alerte « risque de résiliation » (A5, J+14) : abonné payant sans agent ou sans appel réel. */
export function churnRiskMail(v: AccountView, now: Date, noAgent: boolean): TeamMail {
  return teamMail(`Risque de résiliation : abonné ${noAgent ? 'sans agent' : 'sans appel réel'} — ${v.c.name || v.c.email}`, accountRows(v, now),
    `Ce client paie son abonnement mais ${noAgent ? 'n’a créé aucun agent' : 'son agent n’a reçu aucun appel réel'}. Appelez-le (c’est son propre contrat) pour l’aider à le mettre en service, avant qu’il ne résilie ou ne demande un remboursement.`);
}

/**
 * Alerte cinq jours avant le renouvellement d’un abonné sans appel réel sur 30 jours (suivi mensuel). Sans agent, le
 * suivi mensuel ne part pas (A3 était le dernier e-mail sur le sujet) : le texte le dit.
 */
export function renewalMail(v: AccountView, now: Date, end: Date, dryRun: boolean): TeamMail {
  const noAgent = v.act?.agents === 0;
  return teamMail(`Renouvellement le ${day(end)} ${noAgent ? 'sans agent' : 'sans appel sur 30 jours'} — ${v.c.name || v.c.email}`, accountRows(v, now),
    noAgent
      ? `Ce client n’a créé aucun agent et son abonnement se renouvelle le ${day(end)} ; aucun e-mail ne lui est plus envoyé à ce sujet (A3 était le dernier) : appelez-le avant le renouvellement, pour éviter une résiliation ou une demande de remboursement.${testNote(dryRun)}`
      : `L’agent de ce client n’a reçu aucun appel réel depuis 30 jours, et son abonnement se renouvelle le ${day(end)}. Le site lui envoie tous les 30 jours, tant que cela dure, un e-mail de service « votre agent n’a reçu aucun appel » (sauf désinscription). Un appel de l’équipe avant le renouvellement évite une résiliation ou une demande de remboursement.${testNote(dryRun)}`);
}

/** Alerte minutes basses (S1) ou épuisées (S2) ; le client reçoit le même jour l’e-mail de service dans sa langue. */
export function balanceMail(v: AccountView, step: 'S1' | 'S2', threshold: number, now: Date, dryRun: boolean): TeamMail {
  const out = step === 'S2';
  return teamMail(`${out ? 'Minutes épuisées' : `Minutes basses (${minutesLabel(v.minutes ?? 0)})`} — ${v.c.name || v.c.email}`, accountRows(v, now),
    `${out ? 'Le solde de minutes est à 0 : l’agent ne prend plus d’appels.' : `Le solde de minutes est passé sous le seuil d’alerte (${threshold} min).`} Le client reçoit un e-mail de service dans sa langue (${out ? 'S2' : 'S1'}, entre 8 h et 20 h locales) : minutes restantes, ajout de minutes dans Add credits ou renouvellement du forfait, sans prix ni offre. Vous pouvez l’appeler s’il ne réagit pas.${testNote(dryRun)}`);
}

/** Alerte crédits de messages à 0 (réponses écrites de l’IA arrêtées) ; aucun e-mail au client. */
export function creditsMail(v: AccountView, now: Date): TeamMail {
  return teamMail(`Crédits de messages à 0 — ${v.c.name || v.c.email}`, [...accountRows(v, now), ['Crédits de messages', String(Math.max(0, Math.floor(v.credits ?? 0)))]],
    'Les crédits de messages de ce client sont épuisés : les réponses écrites de l’IA (chat du site, WhatsApp, Messenger) sont arrêtées tant qu’il n’en ajoute pas (Add credits). Aucun e-mail n’est envoyé au client : prévenez-le si un canal écrit est en service chez lui.');
}

/** Alerte agent mis en pause par le contrôle de conformité Autocalls (compliance_blocked_at). */
export function pausedAgentMail(v: AccountView, now: Date): TeamMail {
  const paused = v.act?.paused ?? [];
  return teamMail(`Agent mis en pause par la conformité Autocalls — ${v.c.name || v.c.email}`,
    [...accountRows(v, now), ...paused.map((p) => [`Agent en pause`, `${p.name} (depuis ${p.since.slice(0, 10)})`] as Row)],
    'Le contrôle de conformité d’Autocalls a mis en pause un agent de ce client : il ne prend plus d’appels. Il faut en général revoir l’accueil (annonce de l’IA, droit de refuser) puis enregistrer l’agent : voir docs/autocalls-pieges-interface.md. Prévenez le client.');
}

/** Alerte solde de l’agence Autocalls bas (une fois par jour au plus). */
export function agencyBalanceMail(balance: number, min: number): TeamMail {
  const amount = formatAmount(Math.round(balance * 100), 'usd');
  return teamMail(`Solde de l’agence Autocalls bas : ${amount}`, [['Solde', amount], ['Seuil d’alerte', formatAmount(min * 100, 'usd')]],
    'Le solde de l’agence finance les minutes de tous les clients : à 0, leurs agents ne prennent plus d’appels. Rechargez le compte de l’agence chez Autocalls. (Seuil réglable par RELANCES_AGENCY_BALANCE_MIN ; 0 coupe cette alerte.)');
}

/* ---------- Rubrique « À faire aujourd’hui » du rapport de 8 h ---------- */

export interface TodoInput {
  views: AccountView[];
  /** Comptes à court de minutes : vue, seuil, épisode. */
  lowBalance: { v: AccountView; step: 'S1' | 'S2'; threshold: number }[];
  creditsOut: AccountView[];
  /** Réponses reçues sur 24 h (adresses). */
  replies: string[];
  callbacks: CallbackRow[];
  reads: { tracked: number; failed: number; pending: number; unavailable: boolean };
  agency: { balance: number | null; min: number; read: boolean };
}

const MAX_LINES = 20;
const list = (title: string, lines: string[]) => [
  `${title} : ${lines.length}`,
  ...lines.slice(0, MAX_LINES).map((l) => `  - ${l}`),
  ...(lines.length > MAX_LINES ? [`  … et ${lines.length - MAX_LINES} autre(s)`] : []),
];

/**
 * Rubrique nominative « À faire aujourd’hui » (rapport interne de 8 h) : clients sans agent (abonnés et paiement à la
 * minute à appeler dès J+7 ; essai : rappel seulement à sa demande), agents sans appel, essais qui finissent sans usage,
 * soldes bas, crédits à 0, agents en pause, impayés, réponses reçues, rappels à faire à la main ; puis l’état de la
 * lecture des agents et le solde de l’agence.
 */
export function buildTodo(i: TodoInput, now: Date): string[] {
  const tag = (v: AccountView) => (v.c.isTest ? ' [compte de test]' : '');
  const base = (v: AccountView) => `${who(v.c)} — ${v.c.phones[0] ?? 'tél. inconnu'} — ${v.c.locale ?? 'langue à valider'} — ${stageLabel(v)}`;
  const fresh = i.views.filter((v) => freshActivity(v.act, now));
  const noAgent = fresh.filter((v) => v.act!.agents === 0).map((v) => {
    const n = daysSince(v.start, now);
    // Appel d’une personne de l’équipe : client payant seulement ; pendant l’essai, seulement s’il l’a demandé.
    const due = n != null && n >= A_CALL_DAYS ? (v.stage === 'trialing' ? ' : rappel seulement à sa demande (bouton de A2/A3)' : ' : à appeler') : '';
    return `${base(v)}${n != null ? ` — J+${n}` : ''}${due}${tag(v)}`;
  });
  // Sans numéro relié mais avec des appels réels (agent sortant) : seulement si ces appels sont anciens (comme agentIdle).
  const idle = fresh.filter((v) => v.act!.agents > 0 && ((v.act!.agentsWithNumber === 0 && !v.act!.realCalls) || noCallSince(v.act!, now, A_IDLE_DAYS) === true)
    && (daysSince(v.start, now) ?? A_IDLE_DAYS) >= A_IDLE_DAYS).map((v) => {
    const a = v.act!;
    return `${base(v)} — ${a.agents} agent(s), ${a.agentsWithNumber ? 'numéro relié' : 'aucun numéro relié'} — dernier appel réel : ${a.lastCallAt ? day(new Date(a.lastCallAt)) : 'aucun'}${tag(v)}`;
  });
  const ending = i.views.filter((v) => {
    const end = dateOf(v.sub?.trial_end);
    if (v.stage !== 'trialing' || !end || end.getTime() <= now.getTime() || end.getTime() - now.getTime() > 3 * DAY) return false;
    const trial = MARKETS[v.c.locale ?? 'en-gb'].trial.minutes;
    const used = v.minutes != null ? trial - v.minutes : null;
    const a = freshActivity(v.act, now) ? v.act : null;
    return (a && (a.agents === 0 || a.realCalls === 0)) || (used != null && used < 5);
  }).map((v) => {
    const trial = MARKETS[v.c.locale ?? 'en-gb'].trial.minutes;
    const used = v.minutes != null ? `${Math.max(0, Math.round(trial - v.minutes))} min utilisées sur ${trial}` : 'minutes inconnues';
    const a = freshActivity(v.act, now) ? v.act : null;
    return `${base(v)} — ${used}${a ? ` — ${a.agents} agent(s), ${a.realCalls ?? '?'} appel(s) réel(s)` : ''}${tag(v)}`;
  });
  const low = i.lowBalance.map(({ v, step, threshold }) => `${base(v)} — ${step === 'S2' ? 'minutes épuisées : l’agent ne prend plus d’appels' : `${minutesLabel(v.minutes ?? 0)} restantes (seuil ${threshold} min)`}${tag(v)}`);
  const credits = i.creditsOut.map((v) => `${base(v)}${tag(v)}`);
  const paused = fresh.filter((v) => v.act!.paused.length).map((v) => `${base(v)} — ${v.act!.paused.map((p) => p.name).join(', ')}${tag(v)}`);
  const unpaid = i.views.filter((v) => v.c.subscriptions.some((s) => UNPAID.includes(String(s.status)))).map((v) => {
    const s = v.c.subscriptions.find((x) => UNPAID.includes(String(x.status)))!;
    return `${who(v.c)} — abonnement « ${s.status} »${tag(v)}`;
  });
  const manual = i.callbacks.filter((cb) => cb.status === 'pending' && now.getTime() - Date.parse(cb.created_at) > 30 * 60_000
    && now.getTime() - Date.parse(cb.created_at) <= 14 * DAY)
    .map((cb) => `${cb.name ?? 'sans nom'} — ${cb.phone ?? 'tél. inconnu'}${cb.email ? ` — ${cb.email}` : ''} — ${cb.type ?? 'commercial'} — demandé le ${day(new Date(cb.created_at))}`);
  const r = i.reads;
  return [
    'À FAIRE AUJOURD’HUI (liste interne, nominative)',
    ...list(`Clients sans agent (abonnés et paiement à la minute : à appeler à partir de J+${A_CALL_DAYS})`, noAgent),
    ...list(`Agents sans appel réel depuis ${A_IDLE_DAYS} jours ou sans numéro`, idle),
    ...list('Essais qui finissent sous 3 jours sans usage', ending),
    ...list('Minutes basses ou épuisées (abonnés, paiement à la minute)', low),
    ...list('Crédits de messages à 0', credits),
    ...list('Agents mis en pause par la conformité Autocalls', paused),
    ...list('Abonnements en impayé', unpaid),
    ...list('Réponses reçues (24 h) : l’équipe prend le relais', i.replies),
    ...list('Rappels à faire à la main (demandes non mises en file)', manual),
    r.unavailable
      ? 'Lecture des agents : non configurée (AUTOCALLS_API_KEY absente) — série A en attente.'
      : `Lecture des agents : ${r.tracked} compte(s) suivi(s)${r.failed ? `, ${r.failed} lecture(s) en échec` : ''}${r.pending ? `, ${r.pending} en attente (passage suivant)` : ''}.`,
    i.agency.read
      ? `Solde de l’agence Autocalls : ${i.agency.balance == null ? 'illisible' : formatAmount(Math.round(i.agency.balance * 100), 'usd')} (${i.agency.min > 0 ? `seuil d’alerte : ${formatAmount(i.agency.min * 100, 'usd')}` : 'alerte coupée : RELANCES_AGENCY_BALANCE_MIN à 0'}).`
      : 'Solde de l’agence Autocalls : non lu.',
  ];
}
