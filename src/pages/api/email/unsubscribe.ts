// Lien de désinscription des emails (pied de page et en-tête List-Unsubscribe) :
// GET  → page de confirmation /preferences-email, rien n’est changé (les antivirus des messageries ouvrent les liens) ;
// POST → désinscription en un clic des emails non essentiels (RFC 8058, corps « List-Unsubscribe=One-Click »),
//        seulement avec un lien signé valide.
import type { NextApiRequest, NextApiResponse } from 'next';
import { DEFAULT_LOCALE, asLocale } from '@/i18n/locales';
import { decodeEmail, verifyEmailToken } from '@/lib/emailPrefs';
import { recordEmailPref } from '@/lib/emailPrefsApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const email = decodeEmail(req.query.e);
  const token = String(req.query.t || '');
  const locale = asLocale(req.query.l);

  if (req.method === 'GET' || req.method === 'HEAD') {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
    // Lien transmis tel quel : la page le vérifie (et signale un lien abîmé).
    const signed = req.query.e || req.query.t ? `e=${encodeURIComponent(String(req.query.e || ''))}&t=${encodeURIComponent(token)}&` : '';
    res.setHeader('Location', `${prefix}/preferences-email?${signed}l=${locale}&action=unsubscribe`);
    return res.status(303).end();
  }
  if (req.method !== 'POST') return res.status(405).end();

  if (!email || !verifyEmailToken(email, token)) return res.status(403).send('Invalid link');
  try {
    await recordEmailPref(email, 'essential_only', 'désinscription en un clic depuis la messagerie');
    return res.status(200).send('Unsubscribed');
  } catch (e: any) {
    console.error('[email-unsubscribe]', e.message);
    return res.status(503).send('Try again later');
  }
}
