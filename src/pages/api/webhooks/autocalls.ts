// Webhook Autocalls : fin d’appel (post_call) et fin de conversation (widget, WhatsApp…).
// Enregistre chaque échange et alerte l’équipe quand un prospect demande une démo ou un rappel.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, dbInsert, dbSelect, esc, isAuthorized, langFromPhone, sendMail } from '@/lib/server';
import { sendMissedCallSms } from '@/lib/sms';
import { safeFirstName, sendTemplate } from '@/lib/whatsapp';

const HOT = ['rappel', 'rappel_commercial', 'demo', 'demo_planifiee', 'essai_gratuit', 'ticket_cree', 'ticket_support'];
// « failed » (numéro invalide, erreur opérateur) n’est pas un appel manqué : pas de message.
const MISSED = ['no-answer', 'busy', 'voicemail'];
const MISSED_OUTCOME = 'whatsapp_rappel_manque';
const MISSED_SMS = 'sms_rappel_manque';

/**
 * Rappel sortant sans réponse : un seul message « nous avons essayé de vous joindre » par demande (7 jours) :
 * WhatsApp si la personne a coché la case sur le site (marqueur [WA:langue]), sinon SMS depuis le numéro britannique.
 * La campagne refait ensuite ses tentatives d’appel ; la personne peut aussi répondre « Rappelez-moi » à l’agent WhatsApp.
 */
async function messageAfterMissedCall(phone: string) {
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const enc = encodeURIComponent(phone);
  // Demande de rappel de ces 7 derniers jours (site ou agent) : sans elle, aucun message.
  const [req] = await dbSelect<{ name: string; note: string | null }>('callbacks', `select=name,note&phone=eq.${enc}&created_at=gte.${since}&order=created_at.desc&limit=1`);
  if (!req) return 'aucune demande de rappel récente';
  const sent = await dbSelect('call_events', `select=id&customer_phone=eq.${enc}&outcome=in.(${MISSED_OUTCOME},${MISSED_SMS})&created_at=gte.${since}&limit=1`);
  if (sent.length) return 'déjà prévenu';
  const waLang = /\[WA:([a-z-]+)\]/.exec(req.note || '')?.[1];
  const lang = waLang || langFromPhone(phone);
  const first = safeFirstName(req.name, lang);
  // Accord WhatsApp donné sur le site → modèle WhatsApp ; sinon SMS de service (hors États-Unis et Canada, qui exigent un enregistrement A2P).
  if (waLang) await sendTemplate('pia_callback_missed', waLang, phone, { 1: first });
  else if (!phone.startsWith('+1')) await sendMissedCallSms(lang, phone, first);
  else return 'pas de SMS vers +1';
  await dbInsert('call_events', { kind: waLang ? 'whatsapp' : 'sms', external_id: `missed-${Date.now()}`, customer_phone: phone, outcome: waLang ? MISSED_OUTCOME : MISSED_SMS, summary: `Message ${waLang ? 'WhatsApp' : 'SMS'} envoyé après un rappel sans réponse.` });
  return waLang ? 'WhatsApp envoyé' : 'SMS envoyé';
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
    // Autocalls envoie un UUID ; la colonne d’origine est un entier (BIGINT) : voir l’insertion ci-dessous.
    assistant_id: p.assistant_id == null ? null : String(p.assistant_id),
    assistant_name: p.assistant_name ?? null,
    customer_phone: p.customer_phone ?? null,
    duration_seconds: p.duration ?? null,
    status: p.status ?? null,
    outcome: vars.outcome ?? vars.request_type ?? null,
    summary: vars.summary ?? null,
    // UUID de l’agent aussi conservé dans les variables, lisible quel que soit le type de la colonne.
    variables: p.assistant_id == null ? vars : { ...vars, assistant_uuid: String(p.assistant_id) },
    transcript: p.formatted_transcript ?? null,
    recording_url: p.recording_url ?? null,
  };

  // Tant que la migration supabase/migrations/20261008_call_events_assistant_id_text.sql n’est pas passée,
  // la colonne BIGINT refuse l’UUID (22P02) : on réenregistre alors sans assistant_id plutôt que de perdre l’échange.
  try {
    await dbInsert('call_events', row).catch((e: Error) => {
      if (!/22P02/.test(e.message) || row.assistant_id == null) throw e;
      return dbInsert('call_events', { ...row, assistant_id: null });
    });
  } catch (e: any) { console.error('[autocalls-webhook] supabase:', e.message); }

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
    try { console.log('[autocalls-webhook] rappel manqué :', await messageAfterMissedCall(String(p.customer_phone))); }
    catch (e: any) { console.error('[autocalls-webhook] message rappel manqué:', e.message); }
  }
  return res.status(200).json({ received: true });
}
