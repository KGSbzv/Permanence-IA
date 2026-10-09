// Lien « Arrêter les relances de ce contact » des alertes internes (src/lib/relances/stopLink.ts) :
// GET  → page de confirmation, rien n’est changé (les antivirus des messageries ouvrent les liens) ;
// POST → arrêt enregistré (relance_stops : reason 'manual', scope 'marketing', source « lien équipe »), une seule fois
//        par contact, seulement avec un lien signé valide. Effet : commercial, aide facultative et toute la série A de
//        mise en route (A1 et A2 compris, qui continuent après une simple désinscription) arrêtés ; service maintenu.
// Page interne en français, jamais indexée. Pour annuler un arrêt : supprimer la ligne « manual » de ce contact dans
// relance_stops (Supabase).
import type { NextApiRequest, NextApiResponse } from 'next';
import { decodeEmail, emailKey } from '@/lib/emailPrefs';
import { maskEmails } from '@/lib/maskEmails';
import { verifyStopToken } from '@/lib/relances/stopLink';
import { dbInsert, dbSelect, esc } from '@/lib/server';

export const STOP_REASON = 'manual';

/** Accès à la base (helpers de src/lib/server.ts en production, faux en test). */
export const stopDeps = {
  select: <T,>(table: string, query: string) => dbSelect<T>(table, query),
  insert: (table: string, row: Record<string, unknown>) => dbInsert(table, row),
};

function page(res: NextApiResponse, status: number, title: string, body: string) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  return res.status(status).send(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${esc(title)}</title></head>`
    + `<body style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:40px auto;padding:0 16px;color:#1f2937;line-height:1.5"><h1 style="font-size:22px">${esc(title)}</h1>${body}</body></html>`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const email = decodeEmail(req.query.e);
  const token = String(req.query.t || '');
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  }
  if (!email || !verifyStopToken(email, token)) {
    return page(res, 403, 'Lien non valide', '<p>Ce lien n’est pas valide ou n’a été copié qu’en partie. Reprenez-le dans l’alerte reçue sur contact@.</p>');
  }
  if (req.method !== 'POST') {
    const action = `/api/relances/stop?e=${encodeURIComponent(String(req.query.e))}&t=${encodeURIComponent(token)}`;
    return page(res, 200, 'Arrêter les relances de ce contact ?',
      `<p>Contact : <b>${esc(email)}</b></p><p>Plus aucun e-mail commercial ne lui sera envoyé par le site ; les messages d’aide facultatifs et toute la série de mise en route (aide à créer l’agent) s’arrêtent aussi. Les messages liés à son compte (inscription, fin d’essai, solde, paiement) continuent.</p>`
      + `<form method="post" action="${esc(action).replace(/"/g, '&quot;')}"><button type="submit" style="background:#0f172a;color:#fff;border:0;border-radius:8px;padding:10px 18px;font-size:15px;cursor:pointer">Arrêter les relances</button></form>`);
  }
  try {
    const key = emailKey(email);
    const done = await stopDeps.select<{ created_at: string }>('relance_stops', `select=created_at&email_key=eq.${key}&reason=eq.${STOP_REASON}&limit=1`);
    if (!done.length) await stopDeps.insert('relance_stops', { email_key: key, reason: STOP_REASON, scope: 'marketing', source: 'lien équipe' });
    console.info(`[relances-stop] arrêt manuel ${done.length ? 'déjà enregistré' : 'enregistré'} pour ${maskEmails(email)}`);
    return page(res, 200, 'Relances arrêtées', `<p>C’est fait : les relances de <b>${esc(email)}</b> sont arrêtées${done.length ? ' (elles l’étaient déjà)' : ''}. Le changement s’applique au prochain passage horaire.</p>`);
  } catch (e: any) {
    console.error('[relances-stop]', maskEmails(String(e?.message ?? e)));
    return page(res, 503, 'Arrêt non enregistré', '<p>La base de données n’a pas répondu. Réessayez dans quelques minutes (le lien reste valable).</p>');
  }
}
