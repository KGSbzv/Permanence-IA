// Passage quotidien (Cloud Scheduler) : relances d’essai à J+10 et J+14.
import type { NextApiRequest, NextApiResponse } from 'next';
import { TRIAL_DAYS, dbSelect, dbUpdate, isAuthorized, sendMail } from '@/lib/server';

interface Signup { id: string; email: string; name: string | null; signed_up_at: string; reminder_sent_at: string | null; ended_sent_at: string | null }

const APP = 'https://app.permanenceia.com';
const SITE = 'https://www.permanenceia.com';

function mail(name: string | null, body: string) {
  const hello = name ? `Bonjour ${name.split(' ')[0]},` : 'Bonjour,';
  return `${hello}\n\n${body}\n\nVotre espace : ${APP}\nNos forfaits : ${SITE}/tarifs\nUne question ? Répondez simplement à cet email, ou demandez un rappel sur ${SITE}/contact.\n\nL’équipe Permanence IA`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Jeton invalide.' });
  const day = 86_400_000;
  const now = Date.now();
  const rows = await dbSelect<Signup>('signups', 'select=*&ended_sent_at=is.null&order=signed_up_at.asc&limit=500');
  let reminders = 0; let ends = 0;

  for (const s of rows) {
    const age = (now - new Date(s.signed_up_at).getTime()) / day;
    try {
      if (age >= TRIAL_DAYS) {
        await sendMail(s.email, 'Votre essai Permanence IA est terminé',
          mail(s.name, 'Vos 14 jours d’essai sont terminés. Pour que votre agent continue de répondre à vos appels, choisissez le forfait adapté à votre volume : Réceptionniste (99 $ HT / 350 min), Assistant (249 $ HT / 1 000 min) ou Centre d’appels (499 $ HT / 2 200 min). Vos réglages et votre historique sont conservés.'));
        await dbUpdate('signups', `id=eq.${s.id}`, { ended_sent_at: new Date().toISOString() });
        ends++;
      } else if (age >= TRIAL_DAYS - 4 && !s.reminder_sent_at) {
        await sendMail(s.email, 'Plus que 4 jours d’essai gratuit',
          mail(s.name, 'Votre essai gratuit se termine dans 4 jours. C’est le bon moment pour tester votre agent sur un vrai appel, connecter votre agenda et ajouter le widget à votre site. Besoin d’aide pour la configuration ? Nous pouvons vous rappeler.'));
        await dbUpdate('signups', `id=eq.${s.id}`, { reminder_sent_at: new Date().toISOString() });
        reminders++;
      }
    } catch (e: any) { console.error('[cron-trials]', s.email, e.message); }
  }
  return res.status(200).json({ checked: rows.length, reminders, ends });
}
