// Outils côté serveur partagés par les routes API : Supabase (REST), email (Zoho SMTP, pied de page commun)
// et vérification du jeton des webhooks.
import { timingSafeEqual } from 'crypto';
import type { NextApiRequest } from 'next';
import nodemailer from 'nodemailer';
import { SITE } from '@/data/site';
import { DEFAULT_LOCALE, isRtl, type Locale } from '@/i18n/locales';
import { appendHtmlFooter, buildEmailFooter, textToHtml } from './emailFooter';
import { CALL_TZ, localToUtc, nextCallTime, tzOffset } from './callHours';
import { emailOptedOut, unsubscribeUrl, type MailCategory, type PrefDb } from './emailPrefs';

export const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'contact@permanenceia.com';

function supabaseHeaders(extra: Record<string, string> = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.SUPABASE_URL || !key) throw new Error('Supabase non configuré');
  return {
    apikey: key,
    // Les clés sb_secret_... ne sont pas des JWT : seul l'en-tête apikey est utilisé.
    ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
    'Content-Type': 'application/json',
    ...extra,
  };
}

/** Insère une ligne ; avec `returnId`, renvoie l’identifiant de la ligne créée (undefined s’il est illisible). */
export async function dbInsert(table: string, row: Record<string, unknown>, returnId = false): Promise<string | undefined> {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}${returnId ? '?select=id' : ''}`, {
    method: 'POST', headers: supabaseHeaders({ Prefer: returnId ? 'return=representation' : 'return=minimal' }), body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  if (!returnId) return undefined;
  const created = await res.json().catch(() => []);
  const id = Array.isArray(created) ? created[0]?.id : undefined;
  return id == null ? undefined : String(id);
}

/** Insère la ligne si elle n’existe pas (contrainte unique) ; renvoie true seulement si elle a été créée. */
export async function dbInsertIfNew(table: string, row: Record<string, unknown>, onConflict: string) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: supabaseHeaders({ Prefer: 'resolution=ignore-duplicates,return=representation' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const created = await res.json().catch(() => []);
  return Array.isArray(created) && created.length > 0;
}

export async function dbSelect<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: supabaseHeaders() });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}`);
  return res.json();
}

export async function dbUpdate(table: string, query: string, patch: Record<string, unknown>) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: 'PATCH', headers: supabaseHeaders({ Prefer: 'return=minimal' }), body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}`);
}

/** Accès à la base pour les préférences email (src/lib/emailPrefs.ts). */
export const PREF_DB: PrefDb = { select: dbSelect, insert: (table, row) => dbInsert(table, row) };

/** L’adresse s’est-elle désinscrite des emails non essentiels ? */
export const isEmailOptedOut = (email: string) => emailOptedOut(email, PREF_DB);

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  fromName?: string;
  /** essential : codes, confirmations, réponses à une demande de la personne ; marketing : non envoyé après
   *  désinscription ; internal : notification à l’équipe (NOTIFY_TO). */
  category: MailCategory;
  /** Langue du pied de page (plusieurs pour un email bilingue) ; français par défaut et pour l’équipe. */
  locale?: Locale | Locale[];
}

/**
 * Message prêt à partir : pied de page (texte et HTML, version HTML créée si l’appelant n’envoie que du texte)
 * et en-têtes List-Unsubscribe. { skipped } si l’email ne doit pas partir : marketing vers une adresse désinscrite,
 * ou préférence illisible (base en panne) — dans le doute, un email non essentiel n’est pas envoyé.
 */
export async function prepareMail(m: MailOptions, db: PrefDb = PREF_DB) {
  if (m.category === 'marketing') {
    try {
      if (await emailOptedOut(m.to, db)) return { skipped: 'opted_out' as const };
    } catch (e: any) {
      console.error('[mail] préférence illisible, email marketing non envoyé:', e.message);
      return { skipped: 'pref_unavailable' as const };
    }
  }
  const locales = m.category === 'internal' ? ['fr' as Locale] : [m.locale ?? DEFAULT_LOCALE].flat();
  const footer = buildEmailFooter(m.to, locales);
  const rtl = isRtl(locales[0]);
  const unsub = unsubscribeUrl(m.to, locales[0]);
  return {
    message: {
      to: m.to,
      subject: m.subject,
      text: `${m.text}\n\n${footer.text}`,
      html: appendHtmlFooter(m.html ?? textToHtml(m.text, rtl), footer.html),
      // Désinscription depuis la messagerie : mailto (traité à la main) et lien HTTPS en un clic (RFC 8058).
      headers: {
        'List-Unsubscribe': [`<mailto:${SITE.email}?subject=unsubscribe>`, unsub && `<${unsub}>`].filter(Boolean).join(', '),
        ...(unsub ? { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : {}),
      },
    },
  };
}

/** Envoie un email (Zoho SMTP) avec le pied de page commun ; renvoie false s’il a été volontairement sauté. */
export async function sendMail(m: MailOptions) {
  if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) throw new Error('SMTP Zoho non configuré');
  const prepared = await prepareMail(m);
  if (!prepared.message) {
    console.log(`[mail] non envoyé (${prepared.skipped}) : ${m.subject}`);
    return false;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
  });
  await transporter.sendMail({ from: `${m.fromName || 'Permanence IA'} <${process.env.ZOHO_SMTP_USER}>`, ...prepared.message });
  return true;
}

// Alertes d’exploitation : au plus un email par sujet et par heure (par instance), pour ne pas inonder la boîte.
const alerted = new Map<string, number>();
/** Prévient l’équipe d’une panne (base, campagne…) sans jamais faire échouer la route qui l’appelle. */
export async function alertTeam(key: string, subject: string, detail: string) {
  const now = Date.now();
  if (now - (alerted.get(key) || 0) < 3_600_000) return;
  alerted.set(key, now);
  try { await sendMail({ to: NOTIFY_TO, category: 'internal', subject: `[Alerte site] ${subject}`, text: `${detail}\n\n(Une seule alerte par heure pour ce sujet ; voir les journaux App Hosting.)` }); }
  catch (e: any) { console.error('[alerte] email:', e.message); }
}

/** Adresse du client : avant-dernière valeur de X-Forwarded-For (la dernière est ajoutée par le répartiteur Google ;
 *  la première peut être falsifiée par le client). */
export function clientIp(req: NextApiRequest) {
  const parts = String(req.headers['x-forwarded-for'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || req.socket.remoteAddress || '';
}

/** Comparaison à temps constant ; un secret absent ou vide ne valide jamais rien. */
function tokenMatches(got: Buffer, expected: string | undefined) {
  if (!expected) return false;
  const want = Buffer.from(expected);
  return got.length === want.length && timingSafeEqual(got, want);
}

export type AuthOptions = {
  /** Secret dédié au jeton dans l’adresse (?token=…) de cette route : seul accepté dans l’adresse quand
   *  WEBHOOK_ALLOW_QUERY_TOKEN=0, accepté en plus des jetons communs sinon. Réservé au webhook d’inscription. */
  querySecret?: 'SIGNUP_WEBHOOK_TOKEN';
};

/**
 * Jeton secret des webhooks et des outils Autocalls : en-tête x-webhook-token (outils en appel, relais d’automatisation)
 * ou ?token=… (webhooks d’agents, qui n’envoient pas d’en-têtes). Pendant le changement de jeton, WEBHOOK_TOKEN_NEXT est
 * accepté aussi. Le mode utilisé (en-tête, adresse, aucun) est journalisé par route, jamais la valeur : il dira quand
 * plus aucun appel n’utilise ?token=… et que l’ancien jeton peut être retiré.
 * WEBHOOK_ALLOW_QUERY_TOKEN=0 coupe le jeton dans l’adresse sur toutes les routes (« query=off » dans le journal), sauf
 * celles qui passent `querySecret` : elles ne l’acceptent alors que contre ce secret dédié (refus s’il n’est pas défini).
 * Variable absente ou autre valeur : comportement d’origine.
 */
export function isAuthorized(req: NextApiRequest, opts: AuthOptions = {}) {
  const header = req.headers['x-webhook-token'];
  const mode = header ? 'header' : req.query.token ? 'query' : 'none';
  const got = Buffer.from(String(header || req.query.token || ''));
  const common = [process.env.WEBHOOK_TOKEN, process.env.WEBHOOK_TOKEN_NEXT];
  const dedicated = opts.querySecret ? process.env[opts.querySecret] : undefined;
  const queryOff = String(process.env.WEBHOOK_ALLOW_QUERY_TOKEN ?? '').trim() === '0';
  const accepted = mode !== 'query' ? common : queryOff ? (opts.querySecret ? [dedicated] : []) : [...common, dedicated];
  const ok = accepted.some((expected) => tokenMatches(got, expected));
  const note = mode === 'query' && queryOff && !opts.querySecret ? ' query=off' : '';
  console.info(`[auth] ${String(req.url || '').split('?')[0]} mode=${mode} ok=${ok}${note}`);
  return ok;
}

/** Indicatif du pays visé par chaque langue du site, pour convertir un numéro saisi au format national. */
const DIAL: Record<string, { cc: string; keepZero?: boolean }> = {
  fr: { cc: '33' }, 'en-gb': { cc: '44' }, 'en-au': { cc: '61' }, it: { cc: '39', keepZero: true }, pl: { cc: '48' }, nl: { cc: '31' }, he: { cc: '972' },
};

/** Numéro au format international (+33…). Un numéro national est converti selon la langue du site. Null si illisible. */
export function toE164(raw: string, locale = 'fr', cc?: string) {
  // « +44 (0)20… » : le 0 entre parenthèses ne se compose pas depuis l’étranger.
  let s = raw.replace(/\(0\)/g, '').replace(/[\s.\-()/]/g, '');
  if (/^00\d{8,15}$/.test(s)) s = `+${s.slice(2)}`;
  if (/^\+\d{8,15}$/.test(s)) {
    // « +33 06… » : préfixe national 0 saisi après l’indicatif, retiré (sauf en Italie, où il fait partie du numéro).
    return s.replace(/^\+(33|32|41|44|61|31|972|48)0(?=\d{7})/, '+$1');
  }
  // Indicatif choisi dans le formulaire (prioritaire sur la langue du site) ; l’Italie garde le 0 initial.
  // « intl » (outil d’agent) sans indicatif : aucun pays supposé — un 050-123-4567 israélien ne devient pas +33….
  const d = cc && /^\d{1,3}$/.test(cc) ? { cc, keepZero: cc === '39' } : locale === 'intl' ? null : DIAL[locale] || DIAL.fr;
  let national: string | null = null;
  if (d && /^\d{6,12}$/.test(s)) national = d.keepZero || !s.startsWith('0') ? `+${d.cc}${s}` : `+${d.cc}${s.slice(1)}`;
  // Indicatif saisi sans « + » (33612345678, 447700900123) : retenu seulement si la lecture nationale n’est pas
  // un numéro valide et que la lecture internationale en est un (pays desservis uniquement).
  if (/^[1-9]\d{7,13}$/.test(s) && !(national && isValidCovered(national)) && isValidCovered(`+${s}`)) return `+${s}`;
  return national;
}

/** Numéros que l’agent peut rappeler automatiquement : liste blanche des fixes et mobiles des pays desservis
 *  (aucun numéro surtaxé, spécial ou international hors liste). */
const CALLABLE = [
  /^\+33[1-79]\d{8}$/, // France : fixes 01-05, 09 et mobiles 06-07 (jamais 08)
  /^\+32(?:4[5-9]\d{7}|[1-6]\d{7})$/, // Belgique : mobiles 045-049 et fixes géographiques (hors 07x, 08x, 09x)
  /^\+41(?:[2-6]\d{8}|7[5-9]\d{7})$/, // Suisse : fixes géographiques et mobiles 075-079
  /^\+352(?:6[2-9]1\d{6}|[2-5]\d{5,7})$/, // Luxembourg : mobiles 6x1 et fixes
  /^\+377[4-9]\d{7}$/, // Monaco : fixes et mobiles
  /^\+44(?:1\d{8,9}|2\d{9}|3\d{9}|7[1-57-9]\d{8})$/, // Royaume-Uni : fixes 01-03 et mobiles 07 (hors 070, 076, 08, 09)
  /^\+61(?:[2378]\d{8}|4\d{8})$/, // Australie : fixes et mobiles 04 (hors 13, 1300, 1800, 19)
  /^\+39(?:3\d{8,9}|0\d{5,10})$/, // Italie : mobiles 3xx et fixes 0x (hors 8xx surtaxés)
  /^\+48(?!70|80)[1-9]\d{8}$/, // Pologne : fixes et mobiles (hors 70x surtaxés et 80x)
  /^\+31(?:[1-57]\d{8}|6[1-5]\d{7})$/, // Pays-Bas : fixes et mobiles 06 (hors 08x, 09x)
  /^\+972(?:5[0-9]\d{7}|[234689]\d{7}|7[2-9]\d{7})$/, // Israël : mobiles 05x, fixes 02-04, 08-09 et 07x (hors 1-800, 1-700, *xxxx)
  /^\+1(?!(?:900|976|8(?:00|33|44|55|66|77|88)))[2-9]\d{2}[2-9]\d{6}$/, // États-Unis / Canada hors surtaxés et numéros verts
];
// Indicatifs +1 qui ne sont ni aux États-Unis ni au Canada (Caraïbes, territoires) ou non géographiques
// (5xx hors indicatifs géographiques, 6xx réservés, 456, 700, 710). Les 5xx géographiques restent appelables :
// Canada 506, 514, 519, 548, 579, 581, 584, 587 et États-Unis 501-510, 512-518, 520, 530, 531, 534, 539-541,
// 551, 557, 559, 561-564, 567, 570-575, 580, 582, 585, 586.
const NANP_EXCLUDED = /^\+1(?:242|246|264|268|284|340|345|441|473|649|658|664|670|671|684|721|758|767|784|787|809|829|849|868|869|876|939|5(?!0[1-9]|1[02-9]|20|3[0149]|4[018]|5[179]|6[1-47]|7[0-59]|8[0-24-7])\d\d|600|622|633|644|655|677|688|456|700|710)/;
/** Numéro valide d’un pays desservi (liste blanche, sans les indicatifs +1 hors États-Unis et Canada). */
const isValidCovered = (e164: string) => !NANP_EXCLUDED.test(e164) && CALLABLE.some((r) => r.test(e164));
// Ailleurs dans le monde, tout numéro international est accepté, sauf les destinations connues pour la fraude
// aux appels surtaxés (satellites, réseaux internationaux, micro-États du Pacifique, Cuba, Somalie…) et les pays
// les plus visés par la fraude aux rappels (Nigeria, Pakistan, Russie et Kazakhstan, Chine, Ukraine).
// Les autorisations géographiques du compte Twilio restent le dernier filtre.
const COVERED = /^\+(?:33|32|41|352|377|44|61|39|48|31|972|1)/;
const HIGH_RISK = /^\+(?:53|252|232|224|245|220|231|235|239|269|222|291|246|247|290|500|67\d|68\d|69[0-2]|87\d|88[0-3]|979|808|800|99\d|234|92|7|86|380)/;
export const isAutoCallable = (e164: string) => (COVERED.test(e164)
  ? isValidCovered(e164)
  : /^\+[1-9]\d{7,14}$/.test(e164) && !HIGH_RISK.test(e164));

/** Campagne à utiliser pour un numéro reçu sans langue du site (demande enregistrée par un agent pendant un appel). */
export function langFromPhone(e164: string) {
  if (/^\+44/.test(e164)) return 'en-gb';
  if (/^\+61/.test(e164)) return 'en-au';
  if (/^\+39/.test(e164)) return 'it';
  if (/^\+48/.test(e164)) return 'pl';
  if (/^\+31/.test(e164)) return 'nl';
  if (/^\+972/.test(e164)) return 'he';
  // France, Belgique, Suisse, Luxembourg, Monaco, départements d’outre-mer (+262, +590, +594, +596) et Afrique
  // francophone seulement (Maghreb, Afrique de l’Ouest et centrale, océan Indien). Le reste de l’Afrique (+20 Égypte,
  // +234 Nigeria, +254 Kenya, +27 Afrique du Sud…) part vers la campagne anglaise.
  if (/^\+(?:33|32|41|352|377|262|590|594|596|212|213|216|22[1-9]|23[5-7]|24[0-3]|250|253|257|261|269)/.test(e164)) return 'fr';
  return 'en-gb';
}

/* ---------- Rappels programmés ---------- */

/** Fuseau par défaut de chaque langue du site, quand le navigateur n’en fournit pas. */
export const TZ: Record<string, string> = CALL_TZ;
export const validTz = (tz: string) => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; } };

// Conversions de fuseau : src/lib/callHours.ts (aussi utilisé dans le navigateur).
export { localToUtc, tzOffset };

/**
 * Les `count` prochaines dates du calendrier local (AAAA-MM-JJ), aujourd’hui compris. Calcul sur le calendrier,
 * pas par pas de 24 h : aucune date sautée ni répétée autour d’un changement d’heure.
 */
export function calendarDays(tz: string, count: number) {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-').map(Number);
  return Array.from({ length: count }, (_, i) => new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10));
}

// Créneaux du formulaire du site (valeurs fixes, quelle que soit la langue) → heure locale du rappel.
const SLOT_TIME: Record<string, [number, string]> = {
  'Aujourd’hui après-midi': [0, '14:00'], 'Demain matin': [1, '09:30'], 'Demain après-midi': [1, '14:30'],
};

/** Jour ouvré des campagnes d’appel : du dimanche au jeudi en Israël, du lundi au samedi ailleurs. */
export function isBusinessDay(date: string, lang: string) {
  const wd = new Date(`${date}T12:00:00Z`).getUTCDay(); // 0 = dimanche
  return lang === 'he' ? wd <= 4 : wd !== 0;
}

/** Date (AAAA-MM-JJ) d’un créneau : `days` jours après aujourd’hui, reportée au prochain jour ouvré du marché
 *  (« Demain matin » un samedi soir en France → lundi 9:30 ; un jeudi en Israël → dimanche). */
function slotDay(tz: string, days: number, lang: string) {
  const list = calendarDays(tz, days + 8);
  return list.slice(days).find((d) => isBusinessDay(d, lang)) ?? list[days];
}

/**
 * Moment du rappel, en UTC. Priorité : date précise (ISO avec décalage, ou heure locale du fuseau `tz`),
 * puis créneau du formulaire, sinon tout de suite. Toujours entre maintenant et 30 jours.
 * Une date précise un jour non ouvré ou hors des plages d’appel du marché (src/lib/callHours.ts) est reportée au
 * début du créneau ouvré suivant : la date confirmée (scheduled_for, WhatsApp) est celle où l’appel partira.
 * `now` : horloge simulée pour les tests.
 */
export function resolveCallAt(opts: { callAt?: unknown; slot?: unknown; tz?: unknown; lang: string; now?: number }) {
  const zone = typeof opts.tz === 'string' && validTz(opts.tz) ? opts.tz : TZ[opts.lang] || TZ.fr;
  const now = opts.now ?? Date.now();
  let at: Date | null = null;
  const raw = typeof opts.callAt === 'string' ? opts.callAt.trim() : '';
  if (raw) at = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(raw) ? new Date(raw) : localToUtc(raw, zone);
  else if (typeof opts.slot === 'string' && SLOT_TIME[opts.slot]) {
    const [days, time] = SLOT_TIME[opts.slot];
    at = localToUtc(`${slotDay(zone, days, opts.lang)}T${time}`, zone);
  }
  if (!at || Number.isNaN(at.getTime()) || at.getTime() <= now) return new Date(now);
  const capped = new Date(Math.min(at.getTime(), now + 30 * 86_400_000));
  return raw ? nextCallTime(capped, opts.lang) : capped;
}

/** Locale d’affichage des dates pour chaque langue du site. */
const DATE_LOCALE: Record<string, string> = { fr: 'fr-FR', 'en-gb': 'en-GB', 'en-au': 'en-AU', it: 'it-IT', pl: 'pl-PL', nl: 'nl-NL', he: 'he-IL' };

/** Décalage « +02:00 » d’un fuseau à un instant donné. */
export function offsetLabel(at: Date, tz: string) {
  const min = Math.round(tzOffset(at, tz) / 60_000);
  const a = Math.abs(min);
  return `${min < 0 ? '-' : '+'}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}

/** Date et heure en toutes lettres dans la langue et le fuseau donnés (« vendredi 9 octobre 2026 à 14:30 »). */
export function describeLocal(at: Date, tz: string, lang: string) {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang] || 'en-GB', {
    timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(at);
}

/** Fuseau d’une langue du site, ou celui demandé s’il est valide. */
export const zoneFor = (tz: unknown, lang: string) => (typeof tz === 'string' && validTz(tz) ? tz : TZ[lang] || TZ.fr);

/**
 * Contrôle d’une date de rappel fournie par un agent : illisible ou passée → motif (l’agent redemande la date),
 * au lieu d’un appel immédiat que la personne n’a pas demandé.
 */
export function checkCallAt(raw: string, tz: string): { at?: Date; problem?: 'unreadable' | 'past' | 'too_far' } {
  const at = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(raw) ? new Date(raw) : localToUtc(raw, tz);
  if (!at || Number.isNaN(at.getTime())) return { problem: 'unreadable' };
  if (at.getTime() < Date.now() - 10 * 60_000) return { problem: 'past' };
  if (at.getTime() > Date.now() + 30 * 86_400_000) return { problem: 'too_far' };
  return { at };
}

/** Message lisible pour l’agent (et la personne) quand une limite de fréquence est atteinte (réponse 429),
 *  dans la langue de l’échange (fr, en, it, pl, nl, he ; anglais par défaut). */
export function tooManyMessage(lang: unknown) {
  const key = String(lang ?? '').toLowerCase().slice(0, 2);
  const text: Record<string, string> = {
    fr: 'Trop de demandes en peu de temps pour ce contact : rien n’a été enregistré. Dites à la personne que la demande n’a pas pu être prise maintenant et réessayez dans une dizaine de minutes, sans le promettre à une heure précise.',
    en: 'Too many requests for this contact in a short time: nothing was saved. Tell the person the request could not be taken right now and try again in about ten minutes, without promising a specific time.',
    it: 'Troppe richieste in poco tempo per questo contatto: non è stato salvato nulla. Dica alla persona che la richiesta non può essere registrata ora e riprovi tra una decina di minuti, senza promettere un orario preciso.',
    pl: 'Zbyt wiele żądań w krótkim czasie dla tego kontaktu: nic nie zostało zapisane. Powiedz osobie, że zgłoszenia nie można teraz przyjąć, i spróbuj ponownie za około dziesięć minut, bez obiecywania konkretnej godziny.',
    nl: 'Te veel verzoeken in korte tijd voor dit contact: er is niets opgeslagen. Zeg tegen de persoon dat het verzoek nu niet kan worden aangenomen en probeer het over ongeveer tien minuten opnieuw, zonder een precies tijdstip te beloven.',
    he: 'יותר מדי בקשות בזמן קצר עבור איש קשר זה: שום דבר לא נשמר. יש לומר לאדם שלא ניתן לקבל את הבקשה כרגע ולנסות שוב בעוד כעשר דקות, בלי להבטיח שעה מסוימת.',
  };
  return text[key === 'iw' ? 'he' : key] || text.en;
}

export const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
