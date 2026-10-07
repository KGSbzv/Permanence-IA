// Outils côté serveur partagés par les routes API : Supabase (REST), email (Zoho SMTP)
// et vérification du jeton des webhooks.
import { timingSafeEqual } from 'crypto';
import type { NextApiRequest } from 'next';
import nodemailer from 'nodemailer';

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

export async function sendMail(to: string, subject: string, text: string, html?: string, fromName = 'Permanence IA') {
  if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) throw new Error('SMTP Zoho non configuré');
  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
  });
  await transporter.sendMail({ from: `${fromName} <${process.env.ZOHO_SMTP_USER}>`, to, subject, text, html });
}

/** Adresse du client : avant-dernière valeur de X-Forwarded-For (la dernière est ajoutée par le répartiteur Google ;
 *  la première peut être falsifiée par le client). */
export function clientIp(req: NextApiRequest) {
  const parts = String(req.headers['x-forwarded-for'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || req.socket.remoteAddress || '';
}

/** Jeton secret des webhooks : en-tête x-webhook-token, ou ?token=… car Autocalls n’envoie pas d’en-têtes personnalisés. */
export function isAuthorized(req: NextApiRequest) {
  const expected = process.env.WEBHOOK_TOKEN;
  if (!expected) return false;
  const got = Buffer.from(String(req.headers['x-webhook-token'] || req.query.token || ''));
  const want = Buffer.from(expected);
  return got.length === want.length && timingSafeEqual(got, want);
}

/** Numéro au format international (+33…) ; les numéros français à 10 chiffres sont convertis. Null si illisible. */
/** Indicatif du pays visé par chaque langue du site, pour convertir un numéro saisi au format national. */
const DIAL: Record<string, { cc: string; keepZero?: boolean }> = {
  fr: { cc: '33' }, 'en-gb': { cc: '44' }, 'en-au': { cc: '61' }, it: { cc: '39', keepZero: true }, pl: { cc: '48' }, nl: { cc: '31' }, he: { cc: '972' },
};

/** Numéro au format international (+33…). Un numéro national est converti selon la langue du site. Null si illisible. */
export function toE164(raw: string, locale = 'fr', cc?: string) {
  const s = raw.replace(/[\s.\-()/]/g, '');
  if (/^\+\d{8,15}$/.test(s)) return s;
  if (/^00\d{8,15}$/.test(s)) return `+${s.slice(2)}`;
  // Indicatif choisi dans le formulaire (prioritaire sur la langue du site) ; l’Italie garde le 0 initial.
  const d = cc && /^\d{1,3}$/.test(cc) ? { cc, keepZero: cc === '39' } : DIAL[locale] || DIAL.fr;
  if (/^\d{6,12}$/.test(s)) {
    if (d.keepZero || !s.startsWith('0')) return `+${d.cc}${s}`;
    return `+${d.cc}${s.slice(1)}`;
  }
  return null;
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
// Indicatifs +1 qui ne sont ni aux États-Unis ni au Canada (Caraïbes, territoires) ou non géographiques (5xx, 6xx réservés, 700, 710).
const NANP_EXCLUDED = /^\+1(?:242|246|264|268|284|340|345|441|473|649|658|664|670|671|684|721|758|767|784|787|809|829|849|868|869|876|939|5\d\d|600|622|633|644|655|677|688|700|710)/;
// Ailleurs dans le monde, tout numéro international est accepté, sauf les destinations connues pour la fraude
// aux appels surtaxés (satellites, réseaux internationaux, micro-États du Pacifique, Cuba, Somalie…).
// Les autorisations géographiques du compte Twilio restent le dernier filtre.
const COVERED = /^\+(?:33|32|41|352|377|44|61|39|48|31|972|1)/;
const HIGH_RISK = /^\+(?:53|252|232|224|245|220|231|235|239|269|222|291|246|247|290|500|67\d|68\d|69[0-2]|87\d|88[0-3]|979|808|800|99\d)/;
export const isAutoCallable = (e164: string) => (COVERED.test(e164)
  ? !NANP_EXCLUDED.test(e164) && CALLABLE.some((r) => r.test(e164))
  : /^\+[1-9]\d{7,14}$/.test(e164) && !HIGH_RISK.test(e164));

/** Campagne à utiliser pour un numéro reçu sans langue du site (demande enregistrée par un agent pendant un appel). */
export function langFromPhone(e164: string) {
  if (/^\+44/.test(e164)) return 'en-gb';
  if (/^\+61/.test(e164)) return 'en-au';
  if (/^\+39/.test(e164)) return 'it';
  if (/^\+48/.test(e164)) return 'pl';
  if (/^\+31/.test(e164)) return 'nl';
  if (/^\+972/.test(e164)) return 'he';
  // France, Belgique, Suisse, Luxembourg, Monaco, Canada francophone par défaut et Afrique francophone (+2xx).
  if (/^\+(?:33|32|41|352|377|2[0-6]\d)/.test(e164)) return 'fr';
  return 'en-gb';
}

/* ---------- Rappels programmés ---------- */

/** Fuseau par défaut de chaque langue du site, quand le navigateur n’en fournit pas. */
export const TZ: Record<string, string> = {
  fr: 'Europe/Paris', 'en-gb': 'Europe/London', 'en-au': 'Australia/Sydney', it: 'Europe/Rome', pl: 'Europe/Warsaw', nl: 'Europe/Amsterdam', he: 'Asia/Jerusalem',
};
export const validTz = (tz: string) => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; } };

/** Écart (ms) entre l’heure locale d’un fuseau et l’heure UTC, à un instant donné. */
export function tzOffset(at: Date, tz: string) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - at.getTime();
}

/** Heure locale « AAAA-MM-JJTHH:MM » d’un fuseau → instant UTC. */
function localToUtc(local: string, tz: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(local);
  if (!m) return null;
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return new Date(guess - tzOffset(new Date(guess), tz));
}

/** Date du jour (AAAA-MM-JJ) dans un fuseau, décalée de `days` jours. */
function dayIn(tz: string, days: number) {
  const d = new Date(Date.now() + days * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

// Créneaux du formulaire du site (valeurs fixes, quelle que soit la langue) → heure locale du rappel.
const SLOT_TIME: Record<string, [number, string]> = {
  'Aujourd’hui après-midi': [0, '14:00'], 'Demain matin': [1, '09:30'], 'Demain après-midi': [1, '14:30'],
};

/**
 * Moment du rappel, en UTC. Priorité : date précise (ISO avec décalage, ou heure locale du fuseau `tz`),
 * puis créneau du formulaire, sinon tout de suite. Toujours entre maintenant et 30 jours.
 * La campagne n’appelle de toute façon que dans ses plages horaires.
 */
export function resolveCallAt(opts: { callAt?: unknown; slot?: unknown; tz?: unknown; lang: string }) {
  const zone = typeof opts.tz === 'string' && validTz(opts.tz) ? opts.tz : TZ[opts.lang] || TZ.fr;
  const now = Date.now();
  let at: Date | null = null;
  const raw = typeof opts.callAt === 'string' ? opts.callAt.trim() : '';
  if (raw) at = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(raw) ? new Date(raw) : localToUtc(raw, zone);
  else if (typeof opts.slot === 'string' && SLOT_TIME[opts.slot]) {
    const [days, time] = SLOT_TIME[opts.slot];
    at = localToUtc(`${dayIn(zone, days)}T${time}`, zone);
  }
  if (!at || Number.isNaN(at.getTime()) || at.getTime() <= now) return new Date(now);
  return new Date(Math.min(at.getTime(), now + 30 * 86_400_000));
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

export const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
