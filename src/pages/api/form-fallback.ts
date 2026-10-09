// Envoi d’un formulaire du site AVANT le chargement de son script (réseau lent, script bloqué) : les formulaires ont
// method="post" et cette adresse pour action (FORM_FALLBACK_ACTION ; audit des parcours du 9 oct. 2026, action 32).
// Sans cela, le navigateur rechargeait la page avec l’e-mail, le nom ou le téléphone dans l’adresse, qui partait
// ensuite dans Google Analytics (page_location) si la mesure était acceptée.
// Le corps n’est ni lu, ni enregistré, ni journalisé : la personne est renvoyée (303) sur la page du formulaire, avec
// « envoi=interrompu » dans l’adresse. La page (Layout) dit alors que la demande n’est pas partie et qu’il faut la
// renvoyer ; le script, chargé entre-temps, fera l’envoi normal (fetch). Une fois le script chargé, cette adresse ne
// sert plus. Le référent n’a jamais l’ancre (#…) : la personne revient en haut de la page, où s’affiche le message.
import type { NextApiRequest, NextApiResponse } from 'next';
import { SITE, withInterruptedNotice } from '@/data/site';

// Corps jamais analysé.
export const config = { api: { bodyParser: false } };

/**
 * Page du formulaire (chemin et requête, sans domaine : jamais de redirection vers un autre site), lue dans le
 * référent s’il vient du site ; accueil sinon.
 */
export function backTo(referer: string | undefined, host: string | undefined): string {
  try {
    const u = new URL(String(referer || ''));
    const own = [new URL(SITE.url).host, 'permanenceia.com', host].filter(Boolean);
    if (!/^https?:$/.test(u.protocol) || !own.includes(u.host)) return '/';
    // « //autre-site » serait lu comme un autre domaine : une seule barre au début.
    return `${u.pathname.replace(/^\/+/, '/')}${u.search}`;
  } catch {
    return '/';
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  res.setHeader('Location', withInterruptedNotice(backTo(req.headers.referer, host || undefined)));
  return res.status(303).end();
}
