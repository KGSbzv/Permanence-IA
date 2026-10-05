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

export const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
