// Contrôle d’une demande de rappel juste avant l’appel : chaque automatisation Autocalls de rappel l’interroge
// après son attente (call_at), avant d’ajouter le contact à la campagne. Une demande remplacée par une demande
// plus récente du même numéro, elle-même mise en file d’appel (reprogrammation par un agent, nouvelle demande
// sur le site), n’est plus appelée ; une nouvelle demande refusée par les plafonds laisse l’ancienne valable.
//
// GET ?request_id=…&phone=… → { current: true|false }, rien d’autre (aucune donnée de la demande).
// Sans request_id (automatisations lancées avant ce contrôle) → current: true, comme avant.
// Audit du 9 oct. 2026 (action 34) : un ticket clos (« done », rappel du support résolu) n’est plus appelé ; sans jeton,
// la limite porte sur l’adresse IP ET le numéro (les 14 automatisations partent des mêmes serveurs Autocalls : une
// limite par IP seule était un plafond commun, et un 429 laisse l’automatisation appeler quand même), avec un plafond
// par IP plus large contre les abus. Le jeton (en-tête x-webhook-token, à ajouter à l’étape step_5 des automatisations)
// reste la voie normale.
import type { NextApiRequest, NextApiResponse } from 'next';
import { clientIp, dbSelect, isAuthorized, tooManyMessage } from '@/lib/server';

// Limites légères (par instance), par tranche de 10 minutes : 120 contrôles par numéro (avec le jeton) ou par adresse
// IP et numéro (sans jeton) ; sans jeton, 1 200 au plus par adresse IP, tous numéros confondus.
const hits = new Map<string, number[]>();
function tooMany(key: string, max = 120) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  while (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > max;
}
export const IP_CHECKS_PER_10_MIN = 1200;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const digits = (v: unknown) => String(v ?? '').replace(/\D/g, '');

/**
 * Demande encore à appeler ? Inconnue, numéro différent, annulée ou close → non ; remplacée par une plus récente du même
 * type (commercial ou support) en file → non. Une demande de support ne remplace pas une demande commerciale.
 */
export async function isCurrent(requestId: string, phone: string) {
  if (!requestId) return true;
  if (!UUID.test(requestId) || digits(phone).length < 8) return false;
  const [row] = await dbSelect<{ phone: string; created_at: string; status: string; type: string | null }>(
    'callbacks', `select=phone,created_at,status,type&id=eq.${requestId}&limit=1`);
  // Annulée (opposition, remplacement) ou close (ticket résolu pendant un rappel du support) : plus d’appel.
  if (!row || digits(row.phone) !== digits(phone) || row.status === 'cancelled' || row.status === 'done') return false;
  const type = row.type === 'support' ? 'support' : 'commercial';
  const newer = await dbSelect('callbacks',
    `select=id&phone=eq.${encodeURIComponent(row.phone)}&type=eq.${type}&status=eq.scheduled&created_at=gt.${encodeURIComponent(row.created_at)}&id=neq.${requestId}&limit=1`);
  return newer.length === 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' });
  // Avec le jeton des webhooks (automatisations Autocalls, toutes sur les mêmes serveurs), la limite porte sur le
  // numéro et non sur l’adresse IP, qui serait un plafond commun à tous les rappels. Sans jeton : adresse IP et numéro,
  // plus un plafond large par adresse IP.
  const phoneKey = digits(req.query.phone).slice(0, 20);
  const limited = isAuthorized(req)
    ? tooMany(`phone:${phoneKey}`)
    : tooMany(`ip:${clientIp(req)}:${phoneKey}`) || tooMany(`ip:${clientIp(req)}`, IP_CHECKS_PER_10_MIN);
  if (limited) {
    return res.status(429).json({ error: 'Trop de demandes.', message_for_agent: tooManyMessage('en') });
  }
  const requestId = String(req.query.request_id ?? '').trim().slice(0, 64);
  try {
    return res.status(200).json({ current: await isCurrent(requestId, String(req.query.phone ?? '')) });
  } catch (e: any) {
    // Base injoignable : on appelle comme avant ce contrôle plutôt que de perdre un rappel demandé.
    console.error('[callback-check] supabase:', e.message);
    return res.status(200).json({ current: true });
  }
}
