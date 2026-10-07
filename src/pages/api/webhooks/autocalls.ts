// Webhook Autocalls : fin d’appel (post_call) et fin de conversation (widget, WhatsApp…).
// Enregistre chaque échange et alerte l’équipe quand un prospect demande une démo ou un rappel.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsert, dbSelect, esc, isAuthorized, sendMail } from '@/lib/server';
import { safeFirstName, sendTemplate } from '@/lib/whatsapp';

const HOT = ['rappel', 'demo', 'demo_planifiee', 'essai_gratuit', 'ticket_cree'];
const MISSED = ['no-answer', 'busy', 'failed', 'voicemail'];
const MISSED_OUTCOME = 'whatsapp_rappel_manque';

/**
 * Rappel sortant sans réponse : un seul message WhatsApp « nous avons essayé de vous joindre », dans la langue
 * de la demande, et seulement si la personne a coché la case WhatsApp sur le site (marqueur [WA:langue]) ces 7 derniers jours.
 * La campagne refait ensuite ses tentatives d’appel ; la personne peut aussi répondre « Rappelez-moi » à l’agent WhatsApp.
 */
async function whatsappAfterMissedCall(phone: string) {
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const enc = encodeURIComponent(phone);
  const [req] = await dbSelect<{ name: string; note: string | null }>('callbacks', `select=name,note&phone=eq.${enc}&note=like.*${encodeURIComponent('[WA:')}*&created_at=gte.${since}&order=created_at.desc&limit=1`);
  const lang = /\[WA:([a-z-]+)\]/.exec(req?.note || '')?.[1];
  if (!req || !lang) return 'sans accord WhatsApp';
  const sent = await dbSelect('call_events', `select=id&customer_phone=eq.${enc}&outcome=eq.${MISSED_OUTCOME}&created_at=gte.${since}&limit=1`);
  if (sent.length) return 'déjà prévenu';
  await sendTemplate('pia_callback_missed', lang, phone, { 1: safeFirstName(req.name, lang) });
  await dbInsert('call_events', { kind: 'whatsapp', external_id: `missed-${Date.now()}`, customer_phone: phone, outcome: MISSED_OUTCOME, summary: 'Message WhatsApp envoyé après un rappel sans réponse.' });
  return 'envoyé';
}

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
  const missed = kind === 'call' && p.type === 'outbound' && p.customer_phone
    && (MISSED.includes(String(p.status)) || /voicemail/i.test(String(p.ended_by || '')));
  if (missed) {
    try { console.log('[autocalls-webhook] rappel manqué :', await whatsappAfterMissedCall(String(p.customer_phone))); }
    catch (e: any) { console.error('[autocalls-webhook] whatsapp:', e.message); }
  }
  return res.status(200).json({ received: true });
}
