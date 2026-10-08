// Webhook « User Signup » de l’espace white-label : enregistre le nouveau client et prévient l’équipe.
// L’essai (14 jours, 30 minutes) est géré nativement par la plateforme à la première souscription.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsertIfNew, dbSelect, isAuthorized, sendMail } from '@/lib/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Jeton invalide.' });

  const { name, email, created_at } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email manquant.' });

  // Idempotence : l’équipe n’est prévenue qu’à la première réception de cette inscription.
  let isNew = false;
  try {
    isNew = await dbInsertIfNew('signups', { email: String(email).toLowerCase(), name: name || null, signed_up_at: created_at || new Date().toISOString() }, 'email');
  } catch (e: any) {
    console.error('[signup] supabase:', e.message);
    return res.status(503).json({ error: 'Enregistrement indisponible, réessayez.' }); // Autocalls renverra le webhook
  }
  if (!isNew) return res.status(200).json({ received: true, duplicate: true });

  // Contexte pour la mise en route : dernière demande de rappel faite avec le même email (activité, besoins,
  // note lue par l’agent). Aucun agent n’est préconfiguré dans le compte du client sans son accord.
  const [previous] = await dbSelect<{ created_at: string; phone: string; company: string | null; sector: string | null; note: string | null }>(
    'callbacks', `select=created_at,phone,company,sector,note&email=ilike.${encodeURIComponent(String(email).replace(/[*%,()]/g, '').replace(/_/g, '\\_'))}&order=created_at.desc&limit=1`,
  ).catch(() => []);
  const context = previous
    ? `\n\nDemande de rappel du ${previous.created_at.slice(0, 10)} avec cet email :\nTéléphone : ${previous.phone}\nEntreprise : ${previous.company || ''}\nSecteur : ${previous.sector || ''}\nNote : ${previous.note || ''}`
    : '';
  try {
    await sendMail({
      to: NOTIFY_TO, category: 'internal', subject: `Nouvelle inscription — ${name || email}`,
      text: `Nom : ${name || ''}\nEmail : ${email}\nInscrit le : ${created_at || ''}\nProchaine étape : choix d’un forfait (essai 14 jours / 30 minutes).${context}`,
    });
  } catch (e: any) { console.error('[signup] email:', e.message); }

  return res.status(200).json({ received: true });
}
