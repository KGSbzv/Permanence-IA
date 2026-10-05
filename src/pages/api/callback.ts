import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'contact@permanenceia.com';

async function saveToSupabase(row: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase non configuré');
  const res = await fetch(`${url}/rest/v1/callbacks`, {
    method: 'POST',
    headers: {
      apikey: key,
      // Les clés sb_secret_... ne sont pas des JWT : seul l'en-tête apikey est utilisé.
      ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
}

async function notifyByEmail(row: Record<string, any>) {
  if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) throw new Error('SMTP Zoho non configuré');
  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
  });
  await transporter.sendMail({
    from: `Permanence IA <${process.env.ZOHO_SMTP_USER}>`,
    to: NOTIFY_TO,
    subject: `Nouvelle demande de rappel (${row.type}) — ${row.name}`,
    text: Object.entries(row).map(([k, v]) => `${k}: ${v}`).join('\n'),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const { name, phone, email, company, sector, slot, note, consentCall, type, agent } = req.body || {};
  if (!consentCall) return res.status(400).json({ error: 'Consentement au rappel requis.' });
  if (!name || !phone || String(phone).trim().length < 8) return res.status(400).json({ error: 'Nom et numéro valides requis.' });

  const row = {
    name, phone, email: email || null, company: company || null, sector: sector || null,
    slot: slot || 'asap', note: note || null, type: type === 'support' ? 'support' : 'commercial',
    agent: agent || null, consent_call: true, status: 'pending',
  };

  const [db, mail] = await Promise.allSettled([saveToSupabase(row), notifyByEmail(row)]);
  // Succès seulement si la demande est conservée quelque part.
  if (db.status === 'rejected' && mail.status === 'rejected') {
    return res.status(502).json({ error: 'Impossible d’enregistrer la demande pour le moment.' });
  }
  return res.status(200).json({ success: true, stored: db.status === 'fulfilled', notified: mail.status === 'fulfilled' });
}
