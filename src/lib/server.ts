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

export async function dbInsert(table: string, row: Record<string, unknown>) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: supabaseHeaders({ Prefer: 'return=minimal' }), body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}: ${(await res.text()).slice(0, 200)}`);
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

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) throw new Error('SMTP Zoho non configuré');
  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
  });
  await transporter.sendMail({ from: `Permanence IA <${process.env.ZOHO_SMTP_USER}>`, to, subject, text, html });
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
  fr: { cc: '33' }, 'en-gb': { cc: '44' }, 'en-au': { cc: '61' }, it: { cc: '39', keepZero: true }, pl: { cc: '48' }, nl: { cc: '31' },
};

/** Numéro au format international (+33…). Un numéro national est converti selon la langue du site. Null si illisible. */
export function toE164(raw: string, locale = 'fr') {
  const s = raw.replace(/[\s.\-()/]/g, '');
  if (/^\+\d{8,15}$/.test(s)) return s;
  if (/^00\d{8,15}$/.test(s)) return `+${s.slice(2)}`;
  const d = DIAL[locale] || DIAL.fr;
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
  /^\+1(?!(?:900|976|8(?:00|33|44|55|66|77|88)))[2-9]\d{2}[2-9]\d{6}$/, // États-Unis / Canada hors surtaxés et numéros verts
];
// Indicatifs +1 qui ne sont ni aux États-Unis ni au Canada (Caraïbes, territoires) ou non géographiques (5xx, 6xx réservés, 700, 710).
const NANP_EXCLUDED = /^\+1(?:242|246|264|268|284|340|345|441|473|649|658|664|670|671|684|721|758|767|784|787|809|829|849|868|869|876|939|5\d\d|600|622|633|644|655|677|688|700|710)/;
export const isAutoCallable = (e164: string) => !NANP_EXCLUDED.test(e164) && CALLABLE.some((r) => r.test(e164));

export const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
