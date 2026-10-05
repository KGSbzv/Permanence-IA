// Webhook Autocalls : fin d’appel (post_call) et fin de conversation (widget, WhatsApp…).
// Enregistre chaque échange et alerte l’équipe quand un prospect demande une démo ou un rappel.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsert, esc, isAuthorized, sendMail } from '@/lib/server';

const HOT = ['rappel', 'demo', 'demo_planifiee', 'essai_gratuit', 'ticket_cree'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Jeton invalide.' });

  const p = req.body || {};
  const vars = p.extracted_variables || {};
  const kind = p.conversation_id || p.message_count !== undefined ? 'conversation' : 'call';
  const row = {
    kind,
    external_id: String(p.id ?? p.conversation_id ?? ''),
    assistant_id: p.assistant_id ?? null,
    assistant_name: p.assistant_name ?? null,
    customer_phone: p.customer_phone ?? null,
    duration_seconds: p.duration ?? null,
    status: p.status ?? null,
    outcome: vars.outcome ?? vars.request_type ?? null,
    summary: vars.summary ?? null,
    variables: vars,
    transcript: p.formatted_transcript ?? null,
    recording_url: p.recording_url ?? null,
  };

  try { await dbInsert('call_events', row); } catch (e: any) { console.error('[autocalls-webhook] supabase:', e.message); }

  if (row.outcome && HOT.includes(String(row.outcome))) {
    const lines = Object.entries(vars).map(([k, v]) => `<li><b>${esc(k)}</b> : ${esc(typeof v === 'object' ? JSON.stringify(v) : v)}</li>`).join('');
    try {
      await sendMail(
        NOTIFY_TO,
        `À traiter : ${row.outcome} — ${row.assistant_name || 'agent'} (${row.customer_phone || 'site web'})`,
        `${row.summary || ''}\n\n${JSON.stringify(vars, null, 2)}`,
        `<p>${esc(row.summary)}</p><ul>${lines}</ul>${row.recording_url ? `<p><a href="${esc(row.recording_url)}">Écouter l’enregistrement</a></p>` : ''}`,
      );
    } catch (e: any) { console.error('[autocalls-webhook] email:', e.message); }
  }
  return res.status(200).json({ received: true });
}
