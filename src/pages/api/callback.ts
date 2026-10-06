import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsert, dbSelect, isAutoCallable, sendMail, toE164 } from '@/lib/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const { name, phone, email, company, sector, slot, note, consentCall, type, agent, locale } = req.body || {};
  // Accepte true ou "true" (les outils des agents envoient des chaînes).
  if (!(consentCall === true || consentCall === 'true')) return res.status(400).json({ error: 'Consentement au rappel requis.' });
  if (!name || !phone || String(phone).trim().length < 8) return res.status(400).json({ error: 'Nom et numéro valides requis.' });

  // Langue du site (fr, en-gb, en-au, it, pl, nl) ; « intl » = demande enregistrée par un agent pendant un appel.
  const lang = typeof locale === 'string' ? locale : 'fr';
  const e164 = toE164(String(phone), lang);
  const row = {
    name, phone: e164 || String(phone).trim(), email: email || null, company: company || null, sector: sector || null,
    slot: slot || 'asap', note: note || null, type: type === 'support' ? 'support' : 'commercial',
    agent: agent ? `${agent}${locale && locale !== 'fr' ? ` [${locale}]` : ''}` : null, consent_call: true, status: 'pending',
  };

  // Rappel automatique : la demande rejoint la campagne d’appels de son pays et de son type (commercial ou support).
  const kind = row.type === 'support' ? 'support' : 'commercial';
  let leadHook: string | undefined;
  if (lang === 'fr') leadHook = kind === 'support' ? process.env.LEAD_WEBHOOK_SUPPORT : process.env.LEAD_WEBHOOK_COMMERCIAL;
  else {
    try { leadHook = JSON.parse(process.env.LEAD_WEBHOOKS_INTL || '{}')[lang]?.[kind]; } catch { leadHook = undefined; }
  }
  const queueCall = async () => {
    // Une demande déjà enregistrée par un agent pendant un appel n’est pas remise en file : l’équipe la traite.
    if (lang === 'intl') throw new Error('demande issue d’un agent : suivi par l’équipe');
    if (!leadHook) throw new Error(`webhook de campagne non configuré pour ${lang}/${kind}`);
    // Garde-fous contre les appels abusifs : pays desservis seulement, et une seule demande par numéro sur 7 jours.
    if (!e164 || !isAutoCallable(e164)) throw new Error(`numéro hors zone d’appel automatique : ${phone}`);
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const recent = await dbSelect('callbacks', `select=id&phone=eq.${encodeURIComponent(e164)}&created_at=gte.${since}&limit=2`);
    if (recent.length > 1) throw new Error('demande déjà en file pour ce numéro');
    // Plafond global : au-delà de 50 demandes en 24 h, plus d’appel automatique (l’équipe reste prévenue par email).
    const day = await dbSelect('callbacks', `select=id&created_at=gte.${new Date(Date.now() - 86_400_000).toISOString()}&limit=51`);
    if (day.length > 50) throw new Error('plafond quotidien d’appels automatiques atteint');
    const r = await fetch(leadHook, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone: e164, company: company || '', sector: sector || '', note: [note, slot && `Créneau souhaité : ${slot}`].filter(Boolean).join(' — ') }),
    });
    if (!r.ok) throw new Error(`campagne ${r.status}`);
  };

  const [db, mail] = await Promise.allSettled([
    dbInsert('callbacks', row),
    sendMail(NOTIFY_TO, `Nouvelle demande de rappel (${row.type}) — ${row.name}`, Object.entries(row).map(([k, v]) => `${k}: ${v ?? ''}`).join('\n')),
  ]);
  // Appel automatique seulement une fois la demande enregistrée (le contrôle des doublons s’appuie sur la base).
  const [call] = await Promise.allSettled([db.status === 'fulfilled' ? queueCall() : Promise.reject(new Error('demande non enregistrée'))]);
  if (db.status === 'rejected') console.error('[callback] supabase:', db.reason?.message);
  if (mail.status === 'rejected') console.error('[callback] email:', mail.reason?.message);
  if (call.status === 'rejected') console.error('[callback] campagne:', call.reason?.message);
  // Succès seulement si la demande est conservée quelque part.
  if (db.status === 'rejected' && mail.status === 'rejected') {
    return res.status(502).json({ error: 'Impossible d’enregistrer la demande pour le moment.' });
  }
  return res.status(200).json({ success: true, stored: db.status === 'fulfilled', notified: mail.status === 'fulfilled', queued: call.status === 'fulfilled' });
}
