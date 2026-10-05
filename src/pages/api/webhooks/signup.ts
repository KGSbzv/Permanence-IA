// Webhook « User Signup » de l’espace white-label : enregistre le nouveau client,
// lui crédite les minutes d’essai et prévient l’équipe.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, TRIAL_MINUTES, dbInsert, isAuthorized, sendMail, transferMinutes } from '@/lib/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Jeton invalide.' });

  const { name, email, created_at } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email manquant.' });

  let granted = false;
  let grantError: string | null = null;
  try { await transferMinutes(email, 'add', TRIAL_MINUTES); granted = true; } catch (e: any) { grantError = e.message; console.error('[signup] transfer:', e.message); }

  try {
    await dbInsert('signups', { email, name: name || null, signed_up_at: created_at || new Date().toISOString(), trial_minutes: granted ? TRIAL_MINUTES : 0 });
  } catch (e: any) { console.error('[signup] supabase:', e.message); }

  try {
    await sendMail(NOTIFY_TO, `Nouvelle inscription — ${name || email}`,
      `Nom : ${name || ''}\nEmail : ${email}\nInscrit le : ${created_at || ''}\nMinutes d’essai créditées : ${granted ? TRIAL_MINUTES : `non (${grantError})`}`);
  } catch (e: any) { console.error('[signup] email:', e.message); }

  return res.status(200).json({ received: true, trial_minutes: granted ? TRIAL_MINUTES : 0 });
}
