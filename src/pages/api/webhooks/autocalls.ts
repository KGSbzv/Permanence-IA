// Webhook Autocalls : fin d’appel (post_call) et fin de conversation (widget, WhatsApp…).
// Enregistre chaque échange et alerte l’équipe quand un prospect demande une démo ou un rappel.
import type { NextApiRequest, NextApiResponse } from 'next';
import { NOTIFY_TO, alertTeam, dbInsert, dbSelect, dbUpdate, esc, isAuthorized, langFromPhone, sendMail, toE164 } from '@/lib/server';
import { isOptedOut, registerOptOut } from '@/lib/optout';
import { CONTACTS_DB, recordConsent } from '@/lib/contacts';
import { sendMissedCallSms } from '@/lib/sms';
import { safeFirstName, sendTemplate } from '@/lib/whatsapp';

const HOT = ['rappel', 'rappel_commercial', 'demo', 'demo_planifiee', 'essai_gratuit', 'ticket_cree', 'ticket_support'];
// « failed » (numéro invalide, erreur opérateur) n’est pas un appel manqué : pas de message.
const MISSED = ['no-answer', 'busy', 'voicemail'];
const MISSED_OUTCOME = 'whatsapp_rappel_manque';
const MISSED_SMS = 'sms_rappel_manque';
// Refus d’être rappelé (opposition), désinscription demandée sur WhatsApp (fin de conversation de l’agent 21358)
// ou mauvais numéro : rappels en attente annulés, équipe prévenue.
const STOP = ['ne_plus_appeler', 'desinscription', 'mauvais_contact'] as const;

/**
 * Rappel sortant sans réponse : un seul message « nous avons essayé de vous joindre » par demande (7 jours) :
 * WhatsApp si la personne a coché la case sur le site (marqueur [WA:langue]), sinon (ou si WhatsApp échoue) SMS depuis le numéro britannique.
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
  // La liste de blocage Autocalls ne filtre pas les WhatsApp et SMS envoyés par l’API : notre registre d’opposition, si.
  if (await isOptedOut(phone)) return 'opposition enregistrée, aucun message';
  const waLang = /\[WA:([a-z-]+)\]/.exec(req.note || '')?.[1];
  // Langue de la campagne posée par /api/callback ([LANG:xx], langue du site) avant l’indicatif : un visiteur du site
  // français avec un numéro +44 reçoit le message en français.
  const siteLang = /\[LANG:([a-z-]+)\]/.exec(req.note || '')?.[1];
  const lang = waLang || siteLang || langFromPhone(phone);
  // Marché d’origine ([MKT:xx], site ou langue de l’agent) : numéro WhatsApp du modèle et du lien dans le SMS.
  const market = /\[MKT:([a-z-]+)\]/.exec(req.note || '')?.[1] || lang;
  const first = safeFirstName(req.name, lang);
  // Accord WhatsApp donné sur le site → modèle WhatsApp ; s’il échoue (modèle pas encore approuvé par Meta…),
  // SMS de service comme pour les autres (hors États-Unis et Canada, qui exigent un enregistrement A2P).
  let channel: 'whatsapp' | 'sms' | null = null;
  let waError = '';
  if (waLang) {
    try { await sendTemplate('pia_callback_missed', waLang, phone, { 1: first }, { market }); channel = 'whatsapp'; }
    catch (e: any) { waError = e.message; console.error('[autocalls-webhook] WhatsApp rappel manqué, repli SMS :', waError); }
  }
  if (!channel) {
    if (phone.startsWith('+1')) return waError ? `WhatsApp en échec (${waError}), pas de SMS vers +1` : 'pas de SMS vers +1';
    await sendMissedCallSms(lang, phone, first, market);
    channel = 'sms';
  }
  const label = channel === 'whatsapp' ? 'WhatsApp' : 'SMS';
  await dbInsert('call_events', {
    kind: channel, external_id: `missed-${Date.now()}`, customer_phone: phone, outcome: channel === 'whatsapp' ? MISSED_OUTCOME : MISSED_SMS,
    summary: `Message ${label} envoyé après un rappel sans réponse.${waError ? ` WhatsApp en échec (${waError}).` : ''}`,
  });
  return waError ? `SMS envoyé (WhatsApp en échec)` : `${label} envoyé`;
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
  const insertRow = (r: typeof row) => dbInsert('call_events', r).catch((e: Error) => {
    if (!/22P02/.test(e.message) || r.assistant_id == null) throw e;
    return dbInsert('call_events', { ...r, assistant_id: null });
  });
  // Conversations (WhatsApp 21358, Messenger 21297) : conversation_ended_retrigger renvoie la même conversation à
  // chaque nouveau message ; la ligne existante (kind conversation, même external_id) est mise à jour au lieu
  // d’en créer une autre.
  let repeat = false;
  try {
    if (kind === 'conversation' && row.external_id) {
      const filter = `kind=eq.conversation&external_id=eq.${encodeURIComponent(row.external_id)}`;
      const [existing] = await dbSelect<{ id: string; outcome: string | null }>('call_events', `select=id,outcome&${filter}&order=created_at.asc&limit=1`);
      if (existing) {
        // Même résultat qu’au passage précédent : pas de nouvel email « À traiter » ni de nouvelle opposition.
        repeat = String(existing.outcome ?? '') === String(row.outcome ?? '');
        const { kind: _k, external_id: _e, ...patch } = row;
        await dbUpdate('call_events', `id=eq.${encodeURIComponent(existing.id)}`, patch).catch((e: Error) => {
          if (!/22P02|\b400\b/.test(e.message) || patch.assistant_id == null) throw e;
          return dbUpdate('call_events', `id=eq.${encodeURIComponent(existing.id)}`, { ...patch, assistant_id: null });
        });
      } else await insertRow(row);
    } else await insertRow(row);
  } catch (e: any) {
    console.error('[autocalls-webhook] supabase:', e.message);
    // Réponse 200 gardée (un renvoi par Autocalls doublerait l’email « À traiter » et le SMS) : l’équipe est prévenue.
    await alertTeam('autocalls-webhook-db', 'échange Autocalls non enregistré', `${e.message}\n\nÉchange ${row.kind} ${row.external_id} (${row.customer_phone || 'site web'}), outcome ${row.outcome ?? '—'}.\nRésumé : ${row.summary ?? '—'}`);
  }

  if (row.outcome && HOT.includes(String(row.outcome)) && !repeat) {
    const lines = Object.entries(vars).map(([k, v]) => `<li><b>${esc(k)}</b> : ${esc(typeof v === 'object' ? JSON.stringify(v) : v)}</li>`).join('');
    try {
      await sendMail({
        to: NOTIFY_TO, category: 'internal',
        subject: `À traiter : ${row.outcome} — ${row.assistant_name || 'agent'} (${row.customer_phone || 'site web'})`,
        text: `${row.summary || ''}\n\n${JSON.stringify(vars, null, 2)}`,
        html: `<p>${esc(row.summary)}</p><ul>${lines}</ul>${row.recording_url ? `<p><a href="${esc(row.recording_url)}">Écouter l’enregistrement</a></p>` : ''}`,
      });
    } catch (e: any) { console.error('[autocalls-webhook] email:', e.message); }
  }
  // Opposition : traitée avant le message « rappel manqué » (jamais de SMS à une personne qui a refusé).
  const stop = STOP.find((o) => o === String(row.outcome));
  if (stop && p.customer_phone && !repeat) {
    const phone = toE164(String(p.customer_phone), langFromPhone(String(p.customer_phone))) || String(p.customer_phone);
    try {
      const r = await registerOptOut({ phone, outcome: stop, source: `fin d’appel ${row.assistant_name || 'agent'} (${row.kind} ${row.external_id})`, reason: row.summary ?? undefined });
      if (r.problems.length) console.error('[autocalls-webhook] opposition:', r.problems.join(' ; '));
      // Désinscription WhatsApp : retrait de l’accord marketing WhatsApp inscrit au journal des accords.
      if (stop === 'desinscription') {
        await recordConsent(CONTACTS_DB, {
          phone, channel: 'whatsapp', purpose: 'marketing', granted: false, legal_basis: null, notice_shown: false, locale: null,
          source: `agent:desinscription:${row.assistant_name || 'WhatsApp'}`, call_id: row.external_id || null,
        });
      }
    } catch (e: any) { console.error('[autocalls-webhook] opposition:', e.message); }
  }
  const missed = !stop && kind === 'call' && p.type === 'outbound' && p.customer_phone
    && (MISSED.includes(String(p.status)) || /voicemail/i.test(String(p.ended_by || '')));
  if (missed) {
    try { console.log('[autocalls-webhook] rappel manqué :', await messageAfterMissedCall(String(p.customer_phone))); }
    catch (e: any) { console.error('[autocalls-webhook] message rappel manqué:', e.message); }
  }
  return res.status(200).json({ received: true });
}
