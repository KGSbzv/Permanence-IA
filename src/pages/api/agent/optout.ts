// Outil des agents « ne plus appeler » : appelé pendant l’appel dès que la personne refuse d’être rappelée.
// Annule ses demandes de rappel en attente, bloque toute nouvelle mise en file automatique de ce numéro
// et prévient l’équipe (qui l’ajoute à la liste de blocage Autocalls).
//
// POST { phone, reason?, agent? } — phone = {{customer_phone}} de l’appel (ou numéro dicté, avec indicatif).
// Jeton secret (en-tête x-webhook-token) : opposition appliquée tout de suite. Sans jeton, rien n’est annulé
// (sinon n’importe qui pourrait bloquer le rappel d’un autre numéro) : l’équipe est prévenue et le webhook de
// fin d’appel applique l’opposition (résultat ne_plus_appeler). Limité à 10 demandes par IP et par 10 minutes.
import type { NextApiRequest, NextApiResponse } from 'next';
import { clientIp, isAuthorized, toE164 } from '@/lib/server';
import { registerOptOut } from '@/lib/optout';

const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.delete(ip);
  hits.set(ip, recent);
  while (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > 10;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const authorized = isAuthorized(req);
  if (!authorized && tooMany(clientIp(req))) return res.status(429).json({ error: 'Trop de demandes.' });
  const b = req.body || {};
  const raw = String(b.phone ?? b.customer_phone ?? '').slice(0, 32);
  // Numéro reçu de l’appel au format international ; un numéro national dicté est lu comme français par défaut.
  const phone = toE164(raw, 'fr');
  if (!phone) {
    return res.status(200).json({
      success: false, error: 'phone invalid',
      message_for_agent: `The phone number "${raw}" is not valid. Confirm to the person that they will not be called again, and note it in the call outcome (ne_plus_appeler).`,
    });
  }
  const agent = String(b.agent ?? '').slice(0, 120);
  const result = await registerOptOut({
    phone, outcome: 'ne_plus_appeler',
    source: `outil agent${agent ? ` ${agent}` : ''}${authorized ? '' : ' (sans jeton)'}`,
    reason: typeof b.reason === 'string' ? b.reason : undefined,
    apply: authorized,
  });
  if (result.problems.length) console.error('[agent-optout]', result.problems.join(' ; '));
  return res.status(200).json({
    success: result.cancelled || result.recorded || result.notified,
    cancelled_callbacks: result.cancelled,
    message_for_agent: 'Recorded: this number will not be called again. Confirm it briefly to the person, apologise for the disturbance and end the call politely. Do not offer another callback. The call outcome must be ne_plus_appeler.',
  });
}
