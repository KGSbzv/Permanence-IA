// Résumé hebdomadaire à l’équipe (NOTIFY_TO, email interne) : chaque lundi, au premier passage horaire à partir de 8 h
// (heure de Paris), greffé sur POST /api/cron/relances APRÈS les relances. Il part même relances coupées
// (RELANCES_ENABLED, relance_settings) ou en mode test ; une erreur ici ne touche jamais les relances.
// - Période : du lundi 0 h au dimanche 24 h (Paris) de la semaine écoulée ; la semaine d’avant entre parenthèses.
// - Une seule fois par semaine : ligne call_events (kind 'resume_hebdo', external_id 'semaine-<lundi>', status
//   en_cours → envoye | echec | doublon) posée AVANT l’envoi. Deux passages simultanés : seule la réservation la plus
//   ancienne envoie. Envoi en échec : nouvel essai au passage suivant du lundi, 3 fois au plus. Base illisible : rien
//   n’est envoyé (jamais de résumé en boucle).
// - Sources, en lecture seule : signups, stripe_subscriptions (essais), call_events (paiements kind stripe_paiement,
//   appels et conversations, oppositions kind optout, copies d’échange kind email), callbacks, contacts (e-mails
//   laissés sur /essai-gratuit, origine trial_signup, sans inscription à ce jour). Table absente ou illisible : la
//   section indique « donnée indisponible », le reste part.
// - Ajouté le 9 oct. (audit des parcours, action 7) : essais devenus payants, résiliations d’abonnés, essais annulés,
//   abonnés payants à ce jour (stripe_subscriptions) ; mise en route à ce jour (dernières lectures des agents,
//   call_events kind activite_compte) ; e-mails de mise en route (série A) et alertes de solde (série S) envoyés.
// Accès à la base et envoi passés en paramètre (helpers de src/lib/server.ts en production, faux en test).
import { localToUtc } from '@/lib/callHours';
import { COPY_KIND, COPY_OUTCOME } from '@/lib/conversationCopy';
import { OPTOUT_KIND } from '@/lib/optout';
import { esc } from '@/lib/server';
import { localParts } from './calendar';
import { ACTIVITY_KIND } from './activity';
import { PAYMENT_KIND, formatAmount } from './payments';
import type { AccountActivity } from './types';

export const WEEKLY_HOUR = 8;
export const WEEKLY_KIND = 'resume_hebdo';
/** Essais d’envoi au plus par semaine (un par passage horaire du lundi). */
export const WEEKLY_MAX_ATTEMPTS = 3;
/** Au-delà, une réservation « en_cours » est un envoi interrompu. */
const STALE_MS = 30 * 60_000;
const PARIS = 'Europe/Paris';
const PAGE = 1000; // limite par défaut de PostgREST (Supabase)
// Copie de l’échange réellement envoyée à la personne (src/lib/conversationCopy.ts).
const COPY_FILTER = `kind=eq.${COPY_KIND}&outcome=eq.${COPY_OUTCOME}&status=eq.envoyee`;

export interface WeeklyDeps {
  select: <T>(table: string, query: string) => Promise<T[]>;
  /** Insertion qui renvoie l’identifiant de la ligne créée (dbInsert(table, row, true)). */
  insert: (table: string, row: Record<string, unknown>) => Promise<string | undefined>;
  update: (table: string, query: string, patch: Record<string, unknown>) => Promise<void>;
  notifyTeam: (subject: string, text: string, html: string) => Promise<void>;
  now: () => Date;
  log?: (msg: string) => void;
}

const enc = encodeURIComponent;
const addDays = (date: string, n: number) => new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const midnight = (date: string) => localToUtc(`${date}T00:00`, PARIS)!;

/**
 * Semaine du résumé à un instant donné : lundi de l’envoi (clé), semaine écoulée [start, end[ et semaine d’avant
 * [prevStart, start[, bornes à minuit heure de Paris (une semaine qui contient un changement d’heure dure 167 ou 169 h).
 * due : lundi, 8 h ou plus à Paris.
 */
export function weeklyWindow(now: Date) {
  const { date, hour, weekday } = localParts(now, PARIS);
  const monday = addDays(date, -((weekday + 6) % 7));
  return {
    due: weekday === 1 && hour >= WEEKLY_HOUR,
    monday,
    prevStart: midnight(addDays(monday, -14)),
    start: midnight(addDays(monday, -7)),
    end: midnight(monday),
    from: addDays(monday, -7),
    to: addDays(monday, -1),
  };
}
type Week = ReturnType<typeof weeklyWindow>;

const day = (date: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', ...opts }).format(new Date(`${date}T12:00:00Z`));
/** « du lundi 5 au dimanche 11 octobre 2026 » (mois et année répétés seulement s’ils changent). */
export function periodLabel(from: string, to: string) {
  const sameYear = from.slice(0, 4) === to.slice(0, 4);
  const sameMonth = sameYear && from.slice(5, 7) === to.slice(5, 7);
  const a = day(from, { weekday: 'long', day: 'numeric', ...(sameMonth ? {} : { month: 'long' }), ...(sameYear ? {} : { year: 'numeric' }) });
  return `du ${a} au ${day(to, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
}

interface PayRow { external_id: string | null; status: string | null; outcome: string | null; variables: Record<string, any> | null; created_at: string }
interface ExchangeRow { kind: string; assistant_name: string | null; customer_phone: string | null; status: string | null; duration_seconds: number | null; created_at: string }
interface CallbackRow { phone: string | null; type: string | null; status: string | null; created_at: string }
/** cancellation_reason : colonne de la migration du 9 oct. (supabase/migrations/20261009_relances_annulation.sql), lue si elle existe. */
interface SubRow { status: string | null; trial_end: string | null; canceled_at: string | null; cancel_at_period_end: boolean | null; livemode: boolean | null; cancellation_reason?: string | null }
interface SeriesLogRow { sequence: string; step: string; status: string | null; created_at: string }

const UNAVAILABLE = 'donnée indisponible';
const digits = (v: unknown) => String(v ?? '').replace(/\D/g, '');
const amountOf = (r: PayRow) => Number(r.variables?.amount) || 0;
const currencyOf = (r: PayRow) => String(r.variables?.currency || '').toLowerCase();

/** Total par devise : « 396,00 $US + 49,00 € ». */
function totals(rows: PayRow[]) {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(currencyOf(r), (m.get(currencyOf(r)) || 0) + amountOf(r)));
  return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([c, a]) => formatAmount(a, c)).join(' + ');
}

/**
 * Paiements du journal, chacun compté une fois : même objet Stripe reçu deux fois (événement renvoyé, invoice.paid et
 * invoice.payment_succeeded) ; paiement hors facture (pi_…) du même client, même montant et même devise qu’une
 * facture payée à 15 minutes près = paiement de cette facture (depuis l’API Stripe 2025-03-31, un paiement ne cite
 * plus sa facture). Les événements du mode test Stripe sont écartés.
 */
export function countPayments(rows: PayRow[]) {
  const seen = new Map<string, PayRow>();
  rows.forEach((r) => { const k = `${r.status}|${r.external_id}`; if (r.external_id && !seen.has(k)) seen.set(k, r); });
  const list = Array.from(seen.values()).filter((r) => r.variables?.livemode !== false);
  const paid = list.filter((r) => r.status === 'recu');
  const invoices = paid.filter((r) => String(r.outcome).startsWith('invoice.'));
  const sameMoney = (a: PayRow, b: PayRow) => Boolean(a.variables?.customer) && a.variables?.customer === b.variables?.customer
    && amountOf(a) === amountOf(b) && currencyOf(a) === currencyOf(b) && Math.abs(Date.parse(a.created_at) - Date.parse(b.created_at)) <= 15 * 60_000;
  return {
    paid: paid.filter((r) => r.outcome !== 'payment_intent.succeeded' || !invoices.some((i) => sameMoney(r, i))),
    failed: list.filter((r) => r.status === 'echec'),
  };
}

/** E-mails laissés sur /essai-gratuit dont l’adresse n’a pas (encore) d’inscription. */
export function abandonedTrialEmails<T extends { email: string | null }>(left: T[], signups: { email: string | null }[]) {
  const signed = new Set(signups.map((r) => String(r.email ?? '').trim().toLowerCase()).filter(Boolean));
  return left.filter((r) => r.email && !signed.has(r.email.trim().toLowerCase()));
}

/** Données d’une semaine du résumé, lues en base ; null = source illisible. */
interface Sources {
  signups: { signed_up_at: string | null }[] | null;
  trials: { trial_start: string | null; livemode: boolean | null }[] | null;
  payments: PayRow[] | null;
  exchanges: ExchangeRow[] | null;
  callbacks: CallbackRow[] | null;
  optouts: { created_at: string }[] | null;
  copies: { created_at: string }[] | null;
  /** E-mails laissés sur /essai-gratuit pendant les deux semaines (fiche contacts, origine trial_signup). */
  trialEmails: { email: string | null; last_interaction_at: string | null }[] | null;
  /** Toutes les adresses inscrites, quelle que soit la date (rapprochement avec trialEmails : un client inscrit avant
   *  la période qui revient retaper son e-mail sur /essai-gratuit n’est pas « sans inscription »). */
  signupEmails: { email: string | null }[] | null;
  /** Tous les abonnements (conversions, résiliations, abonnés à ce jour) ; facultatif (anciens appels de test). */
  subscriptions?: SubRow[] | null;
  /** Lectures des agents des 3 derniers jours (mise en route à ce jour). */
  activity?: { variables: AccountActivity | null; created_at: string }[] | null;
  /** E-mails envoyés des séries A (mise en route) et S (solde de minutes), envoi réel. */
  seriesLogs?: SeriesLogRow[] | null;
}

async function loadSources(d: Pick<WeeklyDeps, 'select' | 'log'>, w: Week): Promise<Sources> {
  const log = d.log ?? ((m: string) => console.warn(m));
  const since = enc(w.prevStart.toISOString());
  // Tri unique (date puis clé) : la lecture par pages ne saute ni ne double aucune ligne de même date.
  const range = (col: string, key = 'id') => `${col}=gte.${since}&${col}=lt.${enc(w.end.toISOString())}&order=${col}.asc,${key}.asc`;
  /** `quiet` : échec attendu (colonne facultative absente), non journalisé ; l’appelant relit sans elle. */
  const load = async <T>(table: string, query: string, quiet = false): Promise<T[] | null> => {
    const out: T[] = [];
    try {
      for (let offset = 0; offset < 20 * PAGE; offset += PAGE) {
        const rows = await d.select<T>(table, `${query}&limit=${PAGE}&offset=${offset}`);
        out.push(...rows);
        if (rows.length < PAGE) break;
      }
      return out;
    } catch (e: any) {
      if (!quiet) log(`[résumé hebdo] ${table} illisible : ${e?.message}`);
      return null;
    }
  };
  const [signups, trials, payments, exchanges, callbacks, optouts, copies, trialEmails, signupEmails, subscriptions, activity, seriesLogs] = await Promise.all([
    load<{ signed_up_at: string | null }>('signups', `select=signed_up_at&${range('signed_up_at')}`),
    load<{ trial_start: string | null; livemode: boolean | null }>('stripe_subscriptions', `select=trial_start,livemode&${range('trial_start', 'subscription_id')}`),
    load<PayRow>('call_events', `select=external_id,status,outcome,variables,created_at&kind=eq.${PAYMENT_KIND}&${range('created_at')}`),
    // Jusqu’à maintenant : un rappel demandé dimanche soir et passé lundi matin compte comme fait.
    load<ExchangeRow>('call_events', `select=kind,assistant_name,customer_phone,status,duration_seconds,created_at&kind=in.(call,conversation)&created_at=gte.${since}&order=created_at.asc,id.asc`),
    load<CallbackRow>('callbacks', `select=phone,type,status,created_at&${range('created_at')}`),
    load<{ created_at: string }>('call_events', `select=created_at&kind=eq.${OPTOUT_KIND}&${range('created_at')}`),
    load<{ created_at: string }>('call_events', `select=created_at&${COPY_FILTER}&${range('created_at')}`),
    load<{ email: string | null; last_interaction_at: string | null }>('contacts', `select=email,last_interaction_at&origin=eq.trial_signup&${range('last_interaction_at')}`),
    // Sans filtre de date (table petite, adresse unique) : une inscription faite ce lundi matin compte aussi.
    load<{ email: string | null }>('signups', 'select=email&order=email.asc'),
    // Motif de résiliation lu s’il existe (migration du 9 oct.), sinon colonnes d’origine seulement (start_date et
    // cancel_at peuvent manquer aussi : jamais lues ici).
    load<SubRow>('stripe_subscriptions', 'select=status,trial_end,canceled_at,cancel_at_period_end,cancellation_reason,livemode&order=subscription_id.asc', true)
      .then((rows) => rows ?? load<SubRow>('stripe_subscriptions', 'select=status,trial_end,canceled_at,cancel_at_period_end,livemode&order=subscription_id.asc')),
    load<{ variables: AccountActivity | null; created_at: string }>('call_events', `select=variables,created_at&kind=eq.${ACTIVITY_KIND}&created_at=gte.${enc(new Date(w.end.getTime() - 3 * 86_400_000).toISOString())}&order=created_at.asc,id.asc`),
    load<SeriesLogRow>('relance_log', `select=sequence,step,status,created_at&sequence=in.(A,S)&dry_run=eq.false&status=eq.sent&${range('created_at')}`),
  ]);
  return { signups, trials, payments, exchanges, callbacks, optouts, copies, trialEmails, signupEmails, subscriptions, activity, seriesLogs };
}

interface Section { title: string; lines: string[] }

const PAID = ['active', 'past_due', 'unpaid'];
const DAY_MS = 86_400_000;
/**
 * Résiliation après impayé (jamais comptée comme une résiliation d’abonné) : motif Stripe payment_failed ; sans motif
 * enregistré (migration absente, ligne plus ancienne), essai dont le premier prélèvement a échoué : résilié sans fin
 * programmée plus de 12 h après la fin de l’essai, dans le mois des nouvelles tentatives de Stripe (comme F1).
 */
function unpaidCancel(r: SubRow) {
  if (r.cancellation_reason) return r.cancellation_reason === 'payment_failed';
  if (r.status !== 'canceled' || r.cancel_at_period_end || !r.trial_end || !r.canceled_at) return false;
  const gap = Date.parse(r.canceled_at) - Date.parse(r.trial_end);
  return gap > DAY_MS / 2 && gap <= 35 * DAY_MS;
}
/**
 * Cycle des abonnements (mode réel seulement) : essais devenus payants (fin d’essai dans la semaine, abonnement actif :
 * un premier prélèvement refusé, en past_due, n’est pas une conversion), résiliations d’abonnés (demande enregistrée
 * dans la semaine, hors essai et hors impayé), essais annulés, abonnés payants à ce jour (impayés en cours compris).
 * Résiliation demandée : Stripe date canceled_at au moment de la demande, même si la fin est programmée.
 */
function lifecycleLines(subs: SubRow[] | null, line: <T>(label: string, rows: T[] | null, at: (r: T) => string | null | undefined) => string) {
  const live = subs && subs.filter((r) => r.livemode !== false);
  const trialCancel = (r: SubRow) => Boolean(r.trial_end && r.canceled_at && Date.parse(r.canceled_at) <= Date.parse(r.trial_end));
  const paying = live && live.filter((r) => PAID.includes(String(r.status)));
  return [
    line('Essais devenus payants', live && live.filter((r) => r.trial_end && r.status === 'active'), (r) => r.trial_end),
    line('Résiliations d’abonnés (demandées ou effectives)', live && live.filter((r) => r.canceled_at && !trialCancel(r) && !unpaidCancel(r)), (r) => r.canceled_at),
    line('Essais annulés', live && live.filter(trialCancel), (r) => r.canceled_at),
    `Abonnés payants à ce jour : ${paying ? `${paying.length} (dont résiliation programmée : ${paying.filter((r) => r.cancel_at_period_end).length})` : UNAVAILABLE}`,
  ];
}

/** Contenu du résumé (sujet, texte, HTML échappé) à partir des données lues ; exporté pour les tests. */
export function buildWeekly(s: Sources, w: Week) {
  const cur = (iso: string | null | undefined) => { const t = Date.parse(String(iso)); return t >= w.start.getTime() && t < w.end.getTime(); };
  const prev = (iso: string | null | undefined) => { const t = Date.parse(String(iso)); return t >= w.prevStart.getTime() && t < w.start.getTime(); };
  const both = <T>(rows: T[], at: (r: T) => string | null | undefined) => `${rows.filter((r) => cur(at(r))).length} (${rows.filter((r) => prev(at(r))).length})`;
  const line = <T>(label: string, rows: T[] | null, at: (r: T) => string | null | undefined) => `${label} : ${rows ? both(rows, at) : UNAVAILABLE}`;

  const accounts: Section = {
    title: 'Comptes et essais',
    lines: [
      line('Nouveaux comptes (inscriptions)', s.signups, (r) => r.signed_up_at),
      line('Essais démarrés', s.trials && s.trials.filter((r) => r.livemode !== false), (r) => r.trial_start),
      // Prospect le plus avancé : il a cliqué « Créer mon compte » puis n’a pas fini l’inscription (série P, étape
      // « inscription non terminée », seulement avec base légale).
      line('E-mails laissés sur /essai-gratuit sans inscription à ce jour', s.trialEmails && s.signupEmails && abandonedTrialEmails(s.trialEmails, s.signupEmails), (r) => r.last_interaction_at),
      ...(s.subscriptions === undefined ? [] : lifecycleLines(s.subscriptions, line)),
    ],
  };

  // Mise en route à ce jour : dernière lecture des agents de chaque compte suivi (essai, abonné, à la minute).
  const onboarding: Section = { title: 'Mise en route (à ce jour)', lines: [] };
  if (s.activity !== undefined) {
    if (!s.activity) onboarding.lines.push(`Lecture des agents : ${UNAVAILABLE}`);
    else {
      const latest = new Map<string, AccountActivity>();
      s.activity.forEach((r) => { const a = r.variables; if (a?.userId && (!latest.get(a.userId) || latest.get(a.userId)!.readAt < a.readAt)) latest.set(a.userId, a); });
      const all = Array.from(latest.values());
      const quiet = all.filter((a) => a.agents > 0 && (a.lastCallAt ? Date.parse(a.readAt) - Date.parse(a.lastCallAt) > 30 * 86_400_000 : a.realCalls === 0));
      onboarding.lines.push(`Comptes suivis (essai, abonné, paiement à la minute) : ${all.length} ; sans agent : ${all.filter((a) => a.agents === 0).length} ; agent sans numéro relié : ${all.filter((a) => a.agents > 0 && a.agentsWithNumber === 0).length} ; sans appel réel depuis 30 jours : ${quiet.length} ; agents en pause (conformité) : ${all.filter((a) => a.paused?.length).length}`);
    }
  }
  if (s.seriesLogs !== undefined) {
    onboarding.lines.push(line('E-mails de mise en route envoyés (A1 à A4, suivi mensuel)', s.seriesLogs && s.seriesLogs.filter((r) => r.sequence === 'A'), (r) => r.created_at));
    onboarding.lines.push(line('Alertes de solde envoyées aux clients (minutes basses ou épuisées)', s.seriesLogs && s.seriesLogs.filter((r) => r.sequence === 'S'), (r) => r.created_at));
  }

  const money: Section = { title: 'Paiements', lines: [] };
  if (!s.payments) money.lines.push(`Paiements reçus : ${UNAVAILABLE}`, `Paiements échoués : ${UNAVAILABLE}`);
  else {
    const { paid, failed } = countPayments(s.payments);
    const [paidNow, paidBefore] = [paid.filter((r) => cur(r.created_at)), paid.filter((r) => prev(r.created_at))];
    const sum = paidNow.length || paidBefore.length ? ` — total ${totals(paidNow) || '0'} (${totals(paidBefore) || '0'})` : '';
    money.lines.push(`Paiements reçus : ${paidNow.length} (${paidBefore.length})${sum}`);
    const failedNow = failed.filter((r) => cur(r.created_at));
    const clients = new Set(failedNow.map((r) => String(r.variables?.customer ?? r.external_id)));
    const finals = failedNow.filter((r) => r.variables?.final).length;
    money.lines.push(`Paiements échoués : ${failedNow.length} (${failed.filter((r) => prev(r.created_at)).length})${failedNow.length
      ? ` — ${clients.size} client${clients.size > 1 ? 's' : ''}, dont impayé définitif (dernière tentative) : ${finals}` : ''}`);
    money.lines.push('Suivis par le site depuis octobre 2026 ; le détail fait foi dans Stripe.');
  }

  const talks: Section = { title: 'Appels et conversations', lines: [] };
  if (!s.exchanges) talks.lines.push(`Appels et conversations : ${UNAVAILABLE}`);
  else {
    const calls = s.exchanges.filter((r) => r.kind === 'call');
    const minutes = Math.round(calls.filter((r) => cur(r.created_at)).reduce((n, r) => n + (Number(r.duration_seconds) || 0), 0) / 60);
    talks.lines.push(`Appels téléphoniques : ${both(calls, (r) => r.created_at)}${minutes ? ` — ${minutes} min au total` : ''}`);
    talks.lines.push(`Conversations écrites (widget, WhatsApp, Messenger, espace client) : ${both(s.exchanges.filter((r) => r.kind === 'conversation'), (r) => r.created_at)}`);
    const byAgent = new Map<string, number>();
    s.exchanges.filter((r) => cur(r.created_at)).forEach((r) => { const k = r.assistant_name || 'agent inconnu'; byAgent.set(k, (byAgent.get(k) || 0) + 1); });
    const top = Array.from(byAgent.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    if (top.length) talks.lines.push(`Par agent : ${top.slice(0, 8).map(([k, n]) => `${k} ${n}`).join(', ')}${top.length > 8 ? ', …' : ''}`);
  }

  const callbacks: Section = { title: 'Demandes de rappel', lines: [] };
  if (!s.callbacks) callbacks.lines.push(`Demandes de rappel : ${UNAVAILABLE}`);
  else {
    // Fiches prospect (status lead) : enregistrées par un agent, sans rappel demandé.
    const asks = s.callbacks.filter((r) => r.status !== 'lead');
    const week = asks.filter((r) => cur(r.created_at));
    // Faite : statut done (rappel fait à la main), ou appel abouti avec ce numéro depuis la demande.
    const reached = (r: CallbackRow) => Boolean(s.exchanges?.some((x) => x.kind === 'call' && x.status === 'completed'
      && digits(x.customer_phone) && digits(x.customer_phone) === digits(r.phone) && Date.parse(x.created_at) >= Date.parse(r.created_at)));
    const done = week.filter((r) => r.status === 'done' || (r.status !== 'cancelled' && reached(r))).length;
    const cancelled = week.filter((r) => r.status === 'cancelled').length;
    callbacks.lines.push(`Créées : ${both(asks, (r) => r.created_at)}, dont support : ${week.filter((r) => r.type === 'support').length}`);
    callbacks.lines.push(`Faites : ${done} ; en attente : ${week.length - done - cancelled} ; annulées : ${cancelled}`);
    callbacks.lines.push(`(faite = statut « done », ou appel abouti avec ce numéro après la demande${s.exchanges ? '' : ' — appels illisibles : seul le statut compte'})`);
    callbacks.lines.push(`Fiches prospect enregistrées par les agents : ${both(s.callbacks.filter((r) => r.status === 'lead'), (r) => r.created_at)}`);
  }

  const contact: Section = {
    title: 'Oppositions et copies',
    lines: [
      line('Oppositions « ne plus appeler »', s.optouts, (r) => r.created_at),
      line('Copies de conversation envoyées', s.copies, (r) => r.created_at),
    ],
  };

  const sections = [accounts, ...(onboarding.lines.length ? [onboarding] : []), money, talks, callbacks, contact];
  const period = periodLabel(w.from, w.to);
  const intro = `Voici le résumé de la semaine ${period} (heure de Paris). Entre parenthèses : la semaine précédente.`;
  return {
    subject: `Résumé de la semaine ${period}`,
    text: ['Bonjour,', '', intro, ...sections.flatMap((x) => ['', x.title.toUpperCase(), ...x.lines])].join('\n'),
    html: `<p>Bonjour,</p><p>${esc(intro)}</p>${sections.map((x) => `<h3>${esc(x.title)}</h3><ul>${x.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`).join('')}`,
    missing: sections.flatMap((x) => x.lines).filter((l) => l.endsWith(UNAVAILABLE)).length,
  };
}

export type WeeklyResult = 'not_due' | 'already_sent' | 'gave_up' | 'duplicate' | 'unavailable' | 'sent' | 'failed';

/** Envoie le résumé de la semaine s’il est dû et pas encore parti ; ne lève jamais d’erreur. */
export async function sendWeeklyIfDue(d: WeeklyDeps): Promise<WeeklyResult> {
  const log = d.log ?? ((m: string) => console.log(m));
  const w = weeklyWindow(d.now());
  if (!w.due) return 'not_due';
  const byExt = `kind=eq.${WEEKLY_KIND}&external_id=eq.semaine-${w.monday}`;
  let id: string | undefined;
  try {
    const rows = await d.select<{ id: string; status: string | null; created_at: string | null }>('call_events', `select=id,status,created_at&${byExt}&limit=20`);
    // Réservation « en_cours » de plus de 30 min : envoi interrompu (instance arrêtée pendant l’envoi) ; elle compte
    // comme un essai en échec, sinon plus aucun résumé ne partirait de la semaine.
    const stale = rows.filter((r) => r.status === 'en_cours' && d.now().getTime() - Date.parse(r.created_at ?? '') > STALE_MS);
    if (rows.some((r) => r.status === 'envoye' || (r.status === 'en_cours' && !stale.includes(r)))) return 'already_sent';
    if (rows.filter((r) => r.status === 'echec').length + stale.length >= WEEKLY_MAX_ATTEMPTS) return 'gave_up';
    for (const r of stale) await d.update('call_events', `id=eq.${enc(r.id)}`, { status: 'echec', summary: 'Envoi interrompu (réservation restée en cours) : nouvel essai.' });
    id = await d.insert('call_events', { kind: WEEKLY_KIND, external_id: `semaine-${w.monday}`, status: 'en_cours', summary: `Résumé de la semaine ${periodLabel(w.from, w.to)} : envoi en cours.` });
    // Deux passages simultanés (deux instances) : seule la réservation la plus ancienne envoie.
    const [first] = await d.select<{ id: string }>('call_events', `select=id&${byExt}&status=in.(en_cours,envoye)&order=created_at.asc,id.asc&limit=1`);
    if (id && first && String(first.id) !== id) {
      await d.update('call_events', `id=eq.${enc(id)}`, { status: 'doublon' }).catch(() => undefined);
      return 'duplicate';
    }
  } catch (e: any) {
    log(`[résumé hebdo] réservation impossible, rien n’est envoyé : ${e?.message}`);
    return 'unavailable';
  }
  const mark = (status: string, summary: string) => (id
    ? d.update('call_events', `id=eq.${enc(id)}`, { status, summary }).catch((e) => log(`[résumé hebdo] statut non enregistré : ${e?.message}`))
    : Promise.resolve());
  try {
    const m = buildWeekly(await loadSources(d, w), w);
    await d.notifyTeam(m.subject, m.text, m.html);
    await mark('envoye', `${m.subject} : envoyé${m.missing ? ` (${m.missing} donnée(s) indisponible(s))` : ''}.`);
    log(`[résumé hebdo] envoyé (${m.subject})`);
    return 'sent';
  } catch (e: any) {
    log(`[résumé hebdo] envoi en échec : ${e?.message}`);
    await mark('echec', `Résumé non envoyé : ${String(e?.message ?? e).slice(0, 200)}`);
    return 'failed';
  }
}
