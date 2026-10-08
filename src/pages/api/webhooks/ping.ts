// Contrôle du jeton des webhooks, sans aucun effet : 200 si l’en-tête x-webhook-token (ou ?token) est accepté, 401 sinon.
// Sert à vérifier un nouveau jeton (WEBHOOK_TOKEN_NEXT) avant de le coller dans les outils et le relais Autocalls.
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthorized } from '@/lib/server';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  return isAuthorized(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ ok: false });
}
