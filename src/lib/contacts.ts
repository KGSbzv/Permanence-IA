// Contacts et accords marketing (relances) : langue toujours enregistrée avec sa provenance, page d’origine et UTM,
// fiche « contacts » (une ligne par adresse email) et journal « consents » (ajout seul, preuve des accords).
// - Les tables et colonnes viennent de supabase/migrations/20261008_relances_capture.sql, à exécuter par le
//   propriétaire. Tant qu’elles n’existent pas, tout ce module se tait : erreur journalisée une fois par table,
//   écriture sautée, et les demandes de rappel continuent d’être enregistrées sans les nouvelles colonnes.
// - Aucun envoi ici : ce module ne fait qu’enregistrer. Les relances lisent ces tables (moteur séparé).
// Les accès à la base sont passés en paramètre (helpers de src/lib/server.ts en production, faux en test).
import { createHmac } from 'crypto';
import { isLocale, type Locale } from '@/i18n/locales';
import { emailKey, isValidEmail, normEmail } from './emailPrefs';
import { dbInsert, dbInsertIfNew, dbSelect, dbUpdate } from './server';

/** Version des textes de la case marketing et de la mention d’information (ui/components.ts, marketingConsent).
 *  À changer à chaque modification de ces textes : elle est enregistrée avec chaque accord. */
export const MARKETING_TEXT_VERSION = 'mkt-2026-10-08';

export type LocaleSource = 'site_form' | 'agent_call' | 'phone_prefix' | 'picker' | 'manual' | 'unknown';
// trial_signup : email laissé sur /essai-gratuit juste avant la création du compte (/api/contact).
export type ContactOrigin = 'callback' | 'demo' | 'agent_lead' | 'trial_request' | 'contact' | 'signup' | 'trial_signup';
export type LegalBasis = 'consent' | 'b2b_legit_interest' | 'soft_opt_in' | 'inferred_consent' | 'contract';

export interface ContactsDb {
  insert: (table: string, row: Record<string, unknown>, returnId?: boolean) => Promise<string | undefined>;
  insertIfNew: (table: string, row: Record<string, unknown>, onConflict: string) => Promise<boolean>;
  update: (table: string, query: string, patch: Record<string, unknown>) => Promise<void>;
  select: <T>(table: string, query: string) => Promise<T[]>;
}
/** Accès réel à Supabase (les tests passent un faux). */
export const CONTACTS_DB: ContactsDb = { insert: dbInsert, insertIfNew: dbInsertIfNew, update: dbUpdate, select: dbSelect };

/* ---------- Langue ---------- */

/** Langue d’après l’indicatif, seulement quand il n’est pas ambigu (+32, +41, +352, +1… : null, à valider). */
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

/** Pays (ISO) d’après l’indicatif, pour les pays desservis et voisins ; null si inconnu ou partagé (+1). */
export function phoneCountry(e164: string): string | null {
  const m = /^\+(33|377|44|61|39|48|31|972|32|41|352|353|64|49|34|351)/.exec(e164);
  const map: Record<string, string> = {
    33: 'FR', 377: 'MC', 44: 'GB', 61: 'AU', 39: 'IT', 48: 'PL', 31: 'NL', 972: 'IL', 32: 'BE', 41: 'CH', 352: 'LU', 353: 'IE', 64: 'NZ', 49: 'DE', 34: 'ES', 351: 'PT',
  };
  return m ? map[m[1]] : null;
}

/**
 * Langue déclarée par un agent (« fr », « en », « English », « en-AU », « hebrew »…) → locale du site.
 * « en » seul est tranché par l’indicatif : +61 → en-au, sinon en-gb. Null si la valeur n’est pas reconnue.
 */
export function normalizeAgentLang(raw: unknown, e164 = ''): Locale | null {
  const s = String(raw ?? '').trim().toLowerCase().replace('_', '-');
  if (!s) return null;
  if (isLocale(s)) return s;
  const names: Record<string, string> = {
    french: 'fr', français: 'fr', francais: 'fr', english: 'en', anglais: 'en', italian: 'it', italiano: 'it', italien: 'it',
    polish: 'pl', polski: 'pl', polonais: 'pl', dutch: 'nl', nederlands: 'nl', néerlandais: 'nl', hebrew: 'he', hébreu: 'he', iw: 'he', עברית: 'he',
  };
  const base = names[s] || s.slice(0, 2);
  if (base === 'en') return s === 'en-au' || s === 'en-nz' || /^\+(?:61|64)/.test(e164) ? 'en-au' : 'en-gb';
  return isLocale(base) ? base : null;
}

export interface ResolvedLocale { locale: Locale | null; locale_source: LocaleSource; locale_needs_review: boolean }

/**
 * Règle de langue, jamais devinée en silence : (1) langue du site du formulaire ; (2) langue déclarée par l’agent ;
 * (3) indicatif non ambigu ; sinon aucune langue, à valider à la main (aucune relance commerciale d’ici là).
 */
export function resolveLocale(o: { siteLocale?: unknown; agentLang?: unknown; phone?: string }): ResolvedLocale {
  if (isLocale(o.siteLocale)) return { locale: o.siteLocale, locale_source: 'site_form', locale_needs_review: false };
  const agent = normalizeAgentLang(o.agentLang, o.phone);
  if (agent) return { locale: agent, locale_source: 'agent_call', locale_needs_review: false };
  const byPhone = o.phone ? phoneLocale(o.phone) : null;
  if (byPhone) return { locale: byPhone, locale_source: 'phone_prefix', locale_needs_review: false };
  return { locale: null, locale_source: 'unknown', locale_needs_review: true };
}

/* ---------- Page d’origine et UTM ---------- */

const cleanText = (v: unknown, max: number) => {
  const s = String(v ?? '').replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, max);
  return s || null;
};

export interface CaptureMeta {
  origin_page: string | null; referrer: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
}

/**
 * Provenance envoyée par les formulaires : chemin de la page (sans paramètres), site d’où vient la personne
 * (domaine et chemin, jamais la requête, qui peut contenir des données personnelles) et UTM.
 */
export function captureMeta(b: Record<string, any>): CaptureMeta {
  const page = cleanText(b.originPage, 200);
  let referrer: string | null = null;
  try {
    const u = new URL(String(b.referrer || ''));
    if (/^https?:$/.test(u.protocol)) referrer = `${u.hostname}${u.pathname}`.slice(0, 200);
  } catch { /* référent absent ou illisible */ }
  const utm = b.utm && typeof b.utm === 'object' ? b.utm : {};
  const tag = (v: unknown) => cleanText(v, 100)?.replace(/[^\w ._\-+/|:]/g, '') || null;
  return {
    origin_page: page && page.startsWith('/') ? page.split(/[?#]/)[0] : null,
    referrer,
    utm_source: tag(utm.source), utm_medium: tag(utm.medium), utm_campaign: tag(utm.campaign),
  };
}

/** true pour true, "true", "yes", "oui", "1" (les outils d’agents envoient des chaînes). */
export const isYes = (v: unknown) => v === true || /^(true|yes|oui|1)$/i.test(String(v ?? '').trim());

/* ---------- Écriture tolérante (migration pas encore appliquée) ---------- */

const warned = new Set<string>();
/** Journalise une seule fois par instance qu’une table ou colonne manque (migration à exécuter). */
function warnOnce(key: string, msg: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[contacts] ${msg} — exécuter supabase/migrations/20261008_relances_capture.sql`);
}
/** Erreur PostgREST « colonne inconnue » (PGRST204, 42703) ou « table inconnue » (PGRST205, 42P01, 404). */
export const isSchemaMissing = (e: unknown) => /PGRST20[45]|42703|42P01|\b404\b|column|schema cache/i.test(String((e as any)?.message ?? e));

/**
 * Insère une ligne avec ses colonnes nouvelles (`extra`) ; si la base ne les connaît pas encore, réessaie sans elles
 * pour que la demande soit enregistrée quand même. Renvoie l’identifiant si `returnId`.
 */
export async function insertWithExtras(db: ContactsDb, table: string, row: Record<string, unknown>, extra: Record<string, unknown>, returnId = false) {
  try {
    return await db.insert(table, { ...row, ...extra }, returnId);
  } catch (e) {
    if (!isSchemaMissing(e)) throw e;
    warnOnce(`${table}-columns`, `colonnes nouvelles absentes de ${table}`);
    return db.insert(table, row, returnId);
  }
}

/** Lecture avec colonnes nouvelles, puis sans elles si la base ne les connaît pas encore. */
export async function selectWithFallback<T>(db: ContactsDb, table: string, query: string, fallbackQuery: string): Promise<T[]> {
  try {
    return await db.select<T>(table, query);
  } catch (e) {
    // dbSelect ne renvoie que le statut : 400 = colonne inconnue, 404 = table inconnue.
    if (!isSchemaMissing(e) && !/\b400\b/.test(String((e as any)?.message))) throw e;
    warnOnce(`${table}-select`, `colonnes nouvelles absentes de ${table} (lecture)`);
    return db.select<T>(table, fallbackQuery);
  }
}

/** Met à jour des colonnes nouvelles sans jamais faire échouer l’appelant. */
export async function updateQuietly(db: ContactsDb, table: string, query: string, patch: Record<string, unknown>) {
  try { await db.update(table, query, patch); } catch (e: any) {
    if (isSchemaMissing(e)) warnOnce(`${table}-update`, `colonnes nouvelles absentes de ${table} (mise à jour)`);
    else console.error(`[contacts] ${table}:`, e.message);
  }
}

/* ---------- Fiche contact ---------- */

export interface ContactInput {
  email: unknown;
  name?: unknown; company?: unknown; sector?: unknown; phone?: string | null;
  resolved: ResolvedLocale;
  origin: ContactOrigin;
  /** Garde la provenance d’une fiche existante (inscription : la demande d’origine reste la source). */
  keepOrigin?: boolean;
  meta?: Partial<CaptureMeta>;
  autocallsUserId?: string | null;
}

/** Clé de l’adresse (HMAC, comme les préférences email) ; null si l’adresse est invalide ou le secret absent. */
function keyOf(email: string) {
  try { return emailKey(email); } catch (e: any) { warnOnce('secret', e.message); return null; }
}

/**
 * Crée ou complète la fiche du contact (une ligne par adresse). La demande la plus récente fixe la provenance, le
 * secteur et la langue s’il s’agit d’une langue sûre (site ou agent) ; une langue tirée de l’indicatif ne fait que
 * compléter une fiche sans langue. L’étape de vie (stage) n’est jamais modifiée ici. Ne lève jamais d’erreur.
 */
export async function upsertContact(db: ContactsDb, c: ContactInput): Promise<string | null> {
  const email = normEmail(c.email);
  if (!isValidEmail(email)) return null;
  const key = keyOf(email);
  if (!key) return null;
  const clip = (v: unknown, n: number) => { const s = String(v ?? '').trim().slice(0, n); return s || undefined; };
  const firstName = clip(String(c.name ?? '').split(/\s+/)[0], 60);
  const patch: Record<string, unknown> = {
    email, first_name: firstName, company: clip(c.company, 160), sector: clip(c.sector, 80), phone_e164: c.phone || undefined,
    country: c.phone ? phoneCountry(c.phone) ?? undefined : undefined, origin: c.keepOrigin ? undefined : c.origin,
    ...Object.fromEntries(Object.entries(c.meta || {}).filter(([, v]) => v)),
    autocalls_user_id: c.autocallsUserId || undefined, last_interaction_at: new Date().toISOString(),
  };
  const strong = c.resolved.locale && (c.resolved.locale_source === 'site_form' || c.resolved.locale_source === 'agent_call');
  if (strong) Object.assign(patch, { locale: c.resolved.locale, locale_source: c.resolved.locale_source, locale_needs_review: false });
  const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
  try {
    await db.insertIfNew('contacts', { email_key: key, email, origin: c.origin }, 'email_key');
    await db.update('contacts', `email_key=eq.${key}`, clean);
    // Langue faible (indicatif) ou à valider : seulement sur une fiche encore sans langue.
    if (!strong) {
      await db.update('contacts', `email_key=eq.${key}&locale=is.null`, c.resolved.locale
        ? { locale: c.resolved.locale, locale_source: c.resolved.locale_source, locale_needs_review: false }
        : { locale_source: 'unknown', locale_needs_review: true });
    }
    return key;
  } catch (e: any) {
    if (isSchemaMissing(e)) warnOnce('contacts', 'table contacts absente');
    else console.error('[contacts] fiche:', e.message);
    return null;
  }
}

/** Passe la fiche de « prospect » à une étape suivante (inscription…) sans jamais revenir en arrière. */
export async function advanceStage(db: ContactsDb, email: unknown, from: string, to: string) {
  const e = normEmail(email);
  const key = isValidEmail(e) ? keyOf(e) : null;
  if (key) await updateQuietly(db, 'contacts', `email_key=eq.${key}&stage=eq.${from}`, { stage: to, stage_source: 'signup' });
}

/* ---------- Journal des accords ---------- */

export interface ConsentInput {
  email?: unknown; phone?: string | null;
  channel: 'email' | 'whatsapp' | 'phone';
  purpose: 'marketing' | 'account_alerts';
  /** true : case cochée ou oui explicite ; false : refus ; null : aucun choix, seule la mention a été affichée. */
  granted: boolean | null;
  legal_basis: LegalBasis | null;
  notice_shown: boolean;
  locale: Locale | null;
  /** Formulaire et page (« site:callback:/tarifs ») ou outil d’agent (« agent:save_lead »). */
  source: string;
  call_id?: string | null;
  ip?: string;
}

/** Empreinte de l’adresse IP (preuve sans garder l’adresse en clair). */
function ipHash(ip?: string) {
  const s = process.env.ACCOUNT_CODE_SECRET;
  if (!ip || !s || s.length < 32) return null;
  return createHmac('sha256', s).update(`permanenceia|consent-ip|${ip}`).digest('hex').slice(0, 32);
}

/** Ajoute une ligne au journal des accords (jamais modifiée ensuite). Ne lève jamais d’erreur. */
export async function recordConsent(db: ContactsDb, c: ConsentInput) {
  const email = normEmail(c.email);
  const key = isValidEmail(email) ? keyOf(email) : null;
  if (!key && !c.phone) return false;
  try {
    await db.insert('consents', {
      email_key: key, phone_e164: c.channel === 'email' ? null : c.phone || null, channel: c.channel, purpose: c.purpose,
      granted: c.granted, legal_basis: c.legal_basis, notice_shown: c.notice_shown, text_version: MARKETING_TEXT_VERSION,
      locale: c.locale, source: c.source.slice(0, 200), call_id: c.call_id ? String(c.call_id).slice(0, 80) : null, ip_hash: ipHash(c.ip),
    });
    return true;
  } catch (e: any) {
    if (isSchemaMissing(e)) warnOnce('consents', 'table consents absente');
    else console.error('[contacts] accord:', e.message);
    return false;
  }
}

/**
 * Base légale candidate quand la case n’est PAS cochée mais que la mention d’information (avec droit de refus) était
 * affichée : intérêt légitime B2B en France, soft opt-in au Royaume-Uni, consentement inféré en Australie.
 * it, pl, nl, he : aucune (consentement exprès obligatoire). Le moteur de relances applique ses propres filtres.
 */
export function noticeBasis(locale: Locale | null): LegalBasis | null {
  if (locale === 'fr') return 'b2b_legit_interest';
  if (locale === 'en-gb') return 'soft_opt_in';
  if (locale === 'en-au') return 'inferred_consent';
  return null;
}

/**
 * Accords marketing reçus d’un formulaire du site : email (case cochée, ou mention seule pour fr, en-gb, en-au)
 * et WhatsApp (case cochée seulement). Rien n’est écrit sans email ni case WhatsApp cochée.
 */
export async function recordFormConsents(db: ContactsDb, o: {
  email?: unknown; phone?: string | null; locale: Locale | null; marketingEmail: boolean; marketingWhatsApp: boolean; source: string; ip?: string;
}) {
  const jobs: Promise<boolean>[] = [];
  if (isValidEmail(normEmail(o.email))) {
    const basis = o.marketingEmail ? 'consent' : noticeBasis(o.locale);
    if (basis) {
      jobs.push(recordConsent(db, {
        email: o.email, channel: 'email', purpose: 'marketing', granted: o.marketingEmail ? true : null, legal_basis: basis,
        notice_shown: true, locale: o.locale, source: o.source, ip: o.ip,
      }));
    }
  }
  if (o.marketingWhatsApp && o.phone) {
    jobs.push(recordConsent(db, {
      email: o.email, phone: o.phone, channel: 'whatsapp', purpose: 'marketing', granted: true, legal_basis: 'consent',
      notice_shown: true, locale: o.locale, source: o.source, ip: o.ip,
    }));
  }
  await Promise.all(jobs);
}
