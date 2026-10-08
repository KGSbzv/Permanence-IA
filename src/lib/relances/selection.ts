// Fiches de travail du moteur : une par adresse email, rapprochée des demandes de rappel (callbacks), des
// inscriptions (signups), de la fiche contacts, de Stripe et des comptes white-label. On en tire la langue (jamais
// devinée en silence), la provenance, l’étape de vie (une seule série à la fois) et la base légale du marketing.
import { PAUSED_SECTORS } from '@/data/site';
import type { RelanceOrigin } from '@/i18n/content/fr/ui/relances';
import { isLocale, type Locale } from '@/i18n/locales';
import { isValidEmail, normEmail } from '@/lib/emailPrefs';
import type {
  CallbackRow, ConsentRow, ContactRow, LegalBasis, PlatformUser, Seq, SignupRow, SnapshotRow, Stage, StopRow,
  StripeCustomerRow, StripeSubscriptionRow,
} from './types';

const DAY = 86_400_000;

export interface PlatformState {
  userId: string;
  minutes: number;
  credits: number;
  createdAt: Date | null;
  /** Minutes consommées sur 30 jours (baisses du solde entre instantanés quotidiens) ; null si moins de 28 jours d’historique. */
  usage30: number | null;
  /** Date de l’instantané le plus récent. */
  snapDate: string;
}

export interface Contact {
  email: string;
  key: string;
  firstName: string | null;
  company: string | null;
  sector: string | null;
  phones: string[];
  locale: Locale | null;
  localeSource: string;
  origin: RelanceOrigin | null;
  /** Date de la demande (ou du rappel prévu), pour {request_date}. */
  requestAt: Date | null;
  /** Entrée dans la série P (J ; P1 part à J+1). */
  prospectSince: Date | null;
  supportOpen: boolean;
  pausedSector: boolean;
  signup: SignupRow | null;
  platform: PlatformState | null;
  subscriptions: StripeSubscriptionRow[];
  hasPaid: boolean;
  hasCreditPurchase: boolean;
  preferredLocale: string | null;
  isTest: boolean;
  consents: ConsentRow[];
  pref: string | null;
  phoneOptout: boolean;
  stops: StopRow[];
}

export interface Sources {
  callbacks: CallbackRow[];
  signups: SignupRow[];
  contacts: ContactRow[];
  customers: StripeCustomerRow[];
  subscriptions: StripeSubscriptionRow[];
  snapshots: SnapshotRow[];
  platformUsers: PlatformUser[];
  consents: ConsentRow[];
  prefs: Map<string, string>;
  optouts: Set<string>;
  stops: StopRow[];
}

/* ---------- Langue ---------- */

/** Langue d’après l’indicatif, seulement s’il n’est pas ambigu (+32, +41, +352, +1… : à valider à la main). */
export function phoneLocale(e164: string): Locale | null {
  if (/^\+(?:33|377)/.test(e164)) return 'fr';
  if (/^\+44/.test(e164)) return 'en-gb';
  if (/^\+61/.test(e164)) return 'en-au';
  if (/^\+39/.test(e164)) return 'it';
  if (/^\+48/.test(e164)) return 'pl';
  if (/^\+31/.test(e164)) return 'nl';
  if (/^\+972/.test(e164)) return 'he';
  return null;
}

/** Langue écrite par un agent ou par Stripe (« en », « en-AU », « he »…) ; « en » seul tranché par l’indicatif. */
function langToLocale(raw: string, phones: string[]): Locale | null {
  const s = raw.trim().toLowerCase().replace('_', '-');
  if (isLocale(s)) return s;
  const base = s === 'iw' ? 'he' : s.slice(0, 2);
  if (base === 'en') {
    if (s === 'en-au') return 'en-au';
    if (s === 'en-gb') return 'en-gb';
    const byPhone = phones.map(phoneLocale).find((l) => l === 'en-gb' || l === 'en-au');
    return byPhone ?? null;
  }
  return isLocale(base) ? base : null;
}

/** Règle de langue : fiche contact, inscription, formulaire du site, agent, Stripe, puis indicatif ; sinon à valider. */
function resolveLocale(o: { contact?: ContactRow; signup?: SignupRow | null; callbacks: CallbackRow[]; preferred: string | null; phones: string[] }) {
  if (o.contact && isLocale(o.contact.locale) && o.contact.locale_source !== 'unknown') return { locale: o.contact.locale, source: o.contact.locale_source || 'contacts' };
  if (o.signup && isLocale(o.signup.locale)) return { locale: o.signup.locale, source: 'signup' };
  for (const cb of o.callbacks) {
    if (isLocale(cb.locale) && cb.locale_source !== 'phone_prefix') return { locale: cb.locale, source: cb.locale_source || 'site_form' };
    const agentLang = /\[([a-zA-Z-]{2,5})\]\s*$/.exec(cb.agent || '')?.[1];
    const fromAgent = agentLang ? langToLocale(agentLang, cb.phone ? [cb.phone] : []) : null;
    if (fromAgent) return { locale: fromAgent, source: 'agent_call' };
    const wa = /\[WA:([a-zA-Z-]{2,5})\]/.exec(cb.note || '')?.[1];
    if (wa && isLocale(wa.toLowerCase())) return { locale: wa.toLowerCase() as Locale, source: 'site_form' };
  }
  if (o.preferred) {
    const l = langToLocale(o.preferred, o.phones);
    if (l) return { locale: l, source: 'stripe' };
  }
  for (const p of o.phones) {
    const l = phoneLocale(p);
    if (l) return { locale: l, source: 'phone_prefix' };
  }
  return { locale: null, source: 'unknown' };
}

/* ---------- Provenance et nom ---------- */

const ORIGINS: RelanceOrigin[] = ['callback_done', 'callback', 'trial_request', 'agent_lead', 'demo', 'contact'];
const TITLES = /^(m|mr|mrs|ms|mme|mlle|dr|me|pr|sig|sig\.ra|pan|pani|dhr|mevr)\.?$/i;

/** Prénom utilisable dans la formule d’appel (premier mot, lettres seulement), sinon null : « Bonjour, ». */
export function firstNameOf(raw: string | null | undefined) {
  const first = String(raw ?? '').trim().split(/\s+/)[0] || '';
  if (TITLES.test(first) || !/^[A-Za-zÀ-ÖØ-öø-ÿĀ-žא-ת'’-]{2,30}$/.test(first)) return null;
  return first.charAt(0).toLocaleUpperCase() + first.slice(1);
}

/** Moment du rappel prévu (« … → 2026-10-09T09:30:00+02:00 » dans slot), sinon la date de la demande. */
function callTime(cb: CallbackRow) {
  const iso = /→\s*(\S+)/.exec(cb.slot || '')?.[1];
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? new Date(cb.created_at) : new Date(t);
}

function originOf(cb: CallbackRow): RelanceOrigin {
  const agent = cb.agent || '';
  const declared = String(cb.origin || '');
  if (declared === 'callback') return cb.status === 'done' ? 'callback_done' : 'callback';
  if ((ORIGINS as string[]).includes(declared)) return declared as RelanceOrigin;
  if (/^Accompagnement essai/i.test(agent)) return 'trial_request';
  if (/^Démo live/i.test(agent)) return 'demo';
  if (cb.status === 'lead' || /^Fiche prospect/i.test(agent)) return 'agent_lead';
  return cb.status === 'done' ? 'callback_done' : 'callback';
}

/** Entrée dans la série P : P1 part 24 h après le rappel effectué ou le créneau demandé, au plus tard J+3. */
function prospectBase(cb: CallbackRow, origin: RelanceOrigin) {
  const created = new Date(cb.created_at);
  if (origin !== 'callback' && origin !== 'callback_done') return created;
  const call = callTime(cb).getTime();
  return new Date(Math.max(created.getTime(), Math.min(call, created.getTime() + 2 * DAY)));
}

/* ---------- Comptes white-label ---------- */

function platformState(rows: SnapshotRow[], now: Date): PlatformState | null {
  if (!rows.length) return null;
  const sorted = [...rows].sort((a, b) => a.snap_date.localeCompare(b.snap_date));
  const last = sorted[sorted.length - 1];
  const since = new Date(now.getTime() - 30 * DAY).toISOString().slice(0, 10);
  const window = sorted.filter((r) => r.snap_date >= since);
  let usage = 0;
  for (let i = 1; i < window.length; i++) usage += Math.max(0, Number(window[i - 1].minutes_balance ?? 0) - Number(window[i].minutes_balance ?? 0));
  const span = window.length ? (Date.parse(last.snap_date) - Date.parse(window[0].snap_date)) / DAY : 0;
  return {
    userId: last.user_id,
    minutes: Number(last.minutes_balance ?? 0),
    credits: Number(last.credits_balance ?? 0),
    createdAt: last.platform_created_at ? new Date(last.platform_created_at) : null,
    usage30: span >= 28 ? Math.round(usage) : null,
    snapDate: last.snap_date,
  };
}

/* ---------- Fiches ---------- */

const INTERNAL_DOMAINS = ['permanenceia.com', 'sinaystrategic.com'];

export function buildContacts(src: Sources, emailKey: (e: string) => string, now: Date, excludeEmails: string[]): Contact[] {
  const byEmail = new Map<string, { callbacks: CallbackRow[]; signup: SignupRow | null; customers: StripeCustomerRow[] }>();
  const slot = (raw: unknown) => {
    const email = normEmail(raw);
    if (!isValidEmail(email)) return null;
    if (!byEmail.has(email)) byEmail.set(email, { callbacks: [], signup: null, customers: [] });
    return byEmail.get(email)!;
  };
  for (const cb of src.callbacks) slot(cb.email)?.callbacks.push(cb);
  for (const s of src.signups) { const e = slot(s.email); if (e) e.signup = s; }
  for (const c of src.customers) if (c.livemode !== false && c.email) slot(c.email)?.customers.push(c);
  for (const u of src.platformUsers) slot(u.email);

  const contactsByKey = new Map(src.contacts.map((c) => [c.email_key, c]));
  const snapsByKey = new Map<string, SnapshotRow[]>();
  for (const s of src.snapshots) if (s.email_key) (snapsByKey.get(s.email_key) ?? snapsByKey.set(s.email_key, []).get(s.email_key)!).push(s);
  const consentsByKey = new Map<string, ConsentRow[]>();
  for (const c of src.consents) if (c.email_key) (consentsByKey.get(c.email_key) ?? consentsByKey.set(c.email_key, []).get(c.email_key)!).push(c);
  const stopsByKey = new Map<string, StopRow[]>();
  for (const s of src.stops) (stopsByKey.get(s.email_key) ?? stopsByKey.set(s.email_key, []).get(s.email_key)!).push(s);

  const out: Contact[] = [];
  Array.from(byEmail.entries()).forEach(([email, e]) => {
    const key = emailKey(email);
    const row = contactsByKey.get(key);
    const callbacks = [...e.callbacks].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const commercial = callbacks.find((cb) => (cb.type || 'commercial') === 'commercial' && cb.status !== 'cancelled') ?? null;
    const phones = Array.from(new Set(callbacks.map((cb) => cb.phone).filter((p): p is string => Boolean(p && /^\+\d{6,15}$/.test(p)))));
    const customerIds = new Set(e.customers.map((c) => c.customer_id));
    const subscriptions = src.subscriptions.filter((s) => s.livemode !== false && s.customer_id && customerIds.has(s.customer_id));
    const preferred = e.customers.map((c) => c.preferred_locale).find(Boolean) ?? null;
    const { locale, source } = resolveLocale({ contact: row, signup: e.signup, callbacks, preferred, phones });
    const origin = commercial ? originOf(commercial) : null;
    const domain = email.split('@')[1];
    const sector = commercial?.sector || row?.sector || null;
    out.push({
      email, key,
      firstName: firstNameOf(commercial?.name ?? e.signup?.name ?? row?.first_name ?? src.platformUsers.find((u) => normEmail(u.email) === email)?.name),
      company: (commercial?.company || row?.company || '').trim() || null,
      sector,
      phones,
      locale, localeSource: source,
      origin,
      requestAt: commercial ? callTime(commercial) : null,
      prospectSince: commercial && origin ? prospectBase(commercial, origin) : null,
      supportOpen: callbacks.some((cb) => cb.type === 'support' && (cb.status === 'pending' || cb.status === 'scheduled')),
      pausedSector: Boolean(sector && PAUSED_SECTORS.includes(sector)),
      signup: e.signup,
      platform: platformState(snapsByKey.get(key) ?? [], now),
      subscriptions,
      hasPaid: e.customers.some((c) => c.has_paid),
      hasCreditPurchase: e.customers.some((c) => c.has_credit_purchase),
      preferredLocale: preferred,
      isTest: Boolean(row?.is_test) || INTERNAL_DOMAINS.includes(domain) || excludeEmails.some((x) => x === email || (x.startsWith('@') && email.endsWith(x))),
      consents: consentsByKey.get(key) ?? [],
      pref: src.prefs.get(key) ?? null,
      phoneOptout: phones.some((p) => src.optouts.has(p)),
      stops: stopsByKey.get(key) ?? [],
    });
  });
  return out;
}

/* ---------- Étape de vie ---------- */

const PAYING = ['active', 'past_due', 'unpaid', 'incomplete', 'paused'];

/** Étape de vie, d’après Stripe d’abord (seule source sûre pour l’essai et l’abonnement). */
export function stageOf(c: Contact, stripeReady: boolean): Stage | null {
  const st = c.subscriptions.map((s) => s.status || '');
  if (st.some((s) => PAYING.includes(s))) return 'paying';
  if (st.includes('trialing')) return 'trialing';
  const cancelled = c.subscriptions.filter((s) => s.status === 'canceled' || s.status === 'incomplete_expired');
  if (cancelled.length) return cancelled.some((s) => s.trial_end) && !c.hasPaid ? 'trial_cancelled' : 'churned';
  const hasAccount = Boolean(c.signup || c.platform);
  // Sans Stripe, un solde de minutes ne distingue pas l’usage d’un essai : le compte reste « inscrit » (I1 seulement).
  if (hasAccount && stripeReady && (c.hasCreditPurchase || (c.platform && c.platform.minutes > 0))) return 'payg';
  if (hasAccount) return 'signed_up';
  return c.origin ? 'prospect' : null;
}

export const SEQ_OF_STAGE: Partial<Record<Stage, Seq>> = { prospect: 'P', signed_up: 'I', trialing: 'C', trial_cancelled: 'F', payg: 'U' };

/* ---------- Base légale du marketing ---------- */

/** Bases admises par marché (conception du 8 oct.) : it, pl, nl, he = consentement exprès seulement. */
const ALLOWED: Record<Locale, LegalBasis[]> = {
  fr: ['consent', 'b2b_legit_interest'],
  'en-gb': ['consent', 'soft_opt_in'],
  'en-au': ['consent', 'inferred_consent'],
  it: ['consent'], pl: ['consent'], nl: ['consent'], he: ['consent'],
};
const GENERIC_LOCAL = /^(contact|info|infos|hello|bonjour|accueil|office|admin|sales|ventes|support|secretariat|secrétariat|reception|mail|team|equipe|biuro|kantoor|ufficio)$/i;

/**
 * Base légale d’un email marketing pour ce contact, ou le motif du refus. Série U : consentement exprès partout
 * (la page d’inscription de la plateforme n’offre ni mention ni droit de refus).
 */
export function marketingBasis(c: Contact, locale: Locale, seq: Seq): { basis: LegalBasis } | { reason: string } {
  const rows = c.consents.filter((r) => r.channel === 'email' && r.purpose === 'marketing').sort((a, b) => b.created_at.localeCompare(a.created_at));
  const last = rows[0];
  if (!last) return { reason: 'no_legal_basis' };
  if (last.granted === false) return { reason: 'consent_refused' };
  const basis = (last.legal_basis || (last.granted ? 'consent' : '')) as LegalBasis;
  if (!basis) return { reason: 'no_legal_basis' };
  const allowed = seq === 'U' ? ['consent'] : ALLOWED[locale];
  if (!allowed.includes(basis)) return { reason: 'basis_not_valid_for_market' };
  if (basis !== 'consent' && GENERIC_LOCAL.test(c.email.split('@')[0])) return { reason: 'generic_address_needs_consent' };
  return { basis };
}
