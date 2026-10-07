import type { NextApiRequest, NextApiResponse } from 'next';
import { safeFirstName, sendCallbackConfirmation, sendTemplate } from '@/lib/whatsapp';
import { NOTIFY_TO, dbInsert, dbSelect, isAuthorized, isAutoCallable, langFromPhone, resolveCallAt, sendMail, toE164 } from '@/lib/server';

// Limite simple par adresse IP (par instance) : 20 demandes par tranche de 10 minutes.
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 20;
}
/** Marqueur posé par le serveur : accord WhatsApp et langue du message (lu aussi après un appel manqué). */
const waMark = (lang: string) => `[WA:${lang}] confirmation WhatsApp demandée`;
// Créneaux du formulaire (valeurs fixes en français) : en anglais pour les agents des autres pays, qui les résument dans leur langue.
const SLOT_EN: Record<string, string> = { 'Aujourd’hui après-midi': 'this afternoon', 'Demain matin': 'tomorrow morning', 'Demain après-midi': 'tomorrow afternoon' };
const clip = (v: unknown, max: number) => (v == null ? v : String(v).slice(0, max));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (tooMany(ip)) return res.status(429).json({ error: 'Trop de demandes, réessayez dans quelques minutes.' });
  // Champ piège invisible : rempli uniquement par les robots. On répond « succès » sans rien faire.
  if (req.body?.website) return res.status(200).json({ success: true });

  const b = req.body || {};
  const { consentCall, type, locale } = b;
  const name = clip(b.name, 120), phone = clip(b.phone, 32), email = clip(b.email, 160), company = clip(b.company, 160);
  // Voix choisie dans la démo : seule la valeur exacte « male » est transmise (sinon voix féminine par défaut).
  const voice = b.voice === 'male' ? 'male' as const : undefined;
  const sector = clip(b.sector, 80), slot = clip(b.slot, 120), note = clip(b.note, 1500), agent = clip(b.agent, 120);
  // Accepte true ou "true" (les outils des agents envoient des chaînes).
  if (!(consentCall === true || consentCall === 'true')) return res.status(400).json({ error: 'Consentement au rappel requis.' });
  if (!name || !phone || String(phone).trim().length < 8) return res.status(400).json({ error: 'Nom et numéro valides requis.' });

  // Langue du site (fr, en-gb, en-au, it, pl, nl) ; « intl » = demande enregistrée par un agent pendant un appel.
  const lang = typeof locale === 'string' ? locale : 'fr';
  const e164 = toE164(String(phone), lang, typeof b.cc === 'string' ? b.cc : undefined);
  // Demande enregistrée par un agent (outil authentifié par le jeton secret) : campagne choisie d’après
  // l’indicatif du numéro, et reprogrammation permise. Sans jeton, les règles du site s’appliquent.
  const fromAgent = isAuthorized(req) && (lang === 'intl' || Boolean(agent));
  const campaignLang = lang === 'intl' ? langFromPhone(e164 || '') : lang;
  // Moment du rappel : date précise (formulaire ou agent), créneau du formulaire, sinon dès que possible.
  const callAt = resolveCallAt({ callAt: b.callAt ?? b.call_at, slot, tz: b.tz, lang: campaignLang });
  const scheduled = callAt.getTime() > Date.now() + 60_000;
  // Case WhatsApp du formulaire (accord séparé, décoché par défaut) : confirmation envoyée sur WhatsApp.
  const wantsWhatsApp = (b.whatsapp === true || b.whatsapp === 'true') && !fromAgent && Boolean(e164);
  const row = {
    name, phone: e164 || String(phone).trim(), email: email || null, company: company || null, sector: sector || null,
    slot: [slot || 'asap', scheduled && `→ ${callAt.toISOString()}`].filter(Boolean).join(' '),
    // Marqueur [WA] posé seulement par le serveur (crochets retirés du texte du visiteur) : sert au plafond quotidien.
    note: [note && String(note).replace(/[\[\]]/g, ''), wantsWhatsApp && waMark(campaignLang)].filter(Boolean).join(' — ') || null, type: type === 'support' ? 'support' : 'commercial',
    agent: agent ? `${agent}${locale && locale !== 'fr' ? ` [${locale}]` : ''}` : null, consent_call: true, status: 'pending',
  };

  // Rappel automatique : la demande rejoint la campagne d’appels de son pays et de son type (commercial ou support).
  const kind = row.type === 'support' ? 'support' : 'commercial';
  let leadHook: string | undefined;
  if (campaignLang === 'fr') leadHook = kind === 'support' ? process.env.LEAD_WEBHOOK_SUPPORT : process.env.LEAD_WEBHOOK_COMMERCIAL;
  else {
    try { leadHook = JSON.parse(process.env.LEAD_WEBHOOKS_INTL || '{}')[campaignLang]?.[kind]; } catch { leadHook = undefined; }
  }
  const queueCall = async () => {
    if (!leadHook) throw new Error(`webhook de campagne non configuré pour ${campaignLang}/${kind}`);
    // Garde-fous contre les appels abusifs : numéros surtaxés et destinations à risque exclus, et au plus
    // 3 rappels par numéro sur 7 jours (la demande, puis jusqu’à deux reprogrammations par un agent).
    // Un outil d’agent authentifié par le jeton n’est pas limité.
    if (!e164 || !isAutoCallable(e164)) throw new Error(`numéro hors zone d’appel automatique : ${phone}`);
    if (!fromAgent) {
      const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const recent = await dbSelect('callbacks', `select=id&phone=eq.${encodeURIComponent(e164)}&created_at=gte.${since}&limit=4`);
      if (recent.length > 3) throw new Error('trop de demandes pour ce numéro cette semaine');
    }
    // Plafond global : au-delà de 50 demandes en 24 h, plus d’appel automatique (l’équipe reste prévenue par email).
    const day = await dbSelect('callbacks', `select=id&created_at=gte.${new Date(Date.now() - 86_400_000).toISOString()}&limit=51`);
    if (day.length > 50) throw new Error('plafond quotidien d’appels automatiques atteint');
    const r = await fetch(leadHook, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      // call_at (UTC) : l’automatisation attend ce moment avant d’ajouter le contact à la campagne.
      body: JSON.stringify({
        name, phone: e164, company: company || '', sector: sector || '', call_at: callAt.toISOString(),
        // Les automatisations Autocalls basculent sur la campagne de la voix masculine quand body.voice === 'male'.
        ...(voice ? { voice } : {}),
        note: [note, slot && slot !== 'asap' && `Créneau souhaité : ${slot === 'precise' ? clip(b.callAt, 40) : campaignLang === 'fr' ? slot : SLOT_EN[slot] || slot}${b.tz ? ` (${b.tz})` : ''}`].filter(Boolean).join(' — '),
      }),
    });
    if (!r.ok) throw new Error(`campagne ${r.status}`);
  };

  const [db, mail] = await Promise.allSettled([
    dbInsert('callbacks', row),
    sendMail(NOTIFY_TO, `Nouvelle demande de rappel (${row.type}) — ${row.name}`, Object.entries(row).map(([k, v]) => `${k}: ${v ?? ''}`).join('\n')),
  ]);
  // Appel automatique seulement une fois la demande enregistrée (le contrôle des doublons s’appuie sur la base).
  // Message WhatsApp : mêmes garde-fous que l’appel automatique (demande enregistrée, zone couverte,
  // 3 demandes par numéro sur 7 jours), plus un plafond de 30 messages par 24 h.
  const sendWhatsApp = async () => {
    if (!wantsWhatsApp) return null;
    if (db.status !== 'fulfilled') throw new Error('demande non enregistrée');
    if (!isAutoCallable(e164 as string)) throw new Error(`numéro hors zone : ${e164}`);
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const recent = await dbSelect('callbacks', `select=id&phone=eq.${encodeURIComponent(e164 as string)}&created_at=gte.${since}&limit=4`);
    if (recent.length > 3) throw new Error('trop de demandes pour ce numéro cette semaine');
    const day = await dbSelect('callbacks', `select=id&note=like.*${encodeURIComponent('[WA:')}*&created_at=gte.${new Date(Date.now() - 86_400_000).toISOString()}&limit=31`);
    if (day.length > 30) throw new Error('plafond quotidien de messages WhatsApp atteint');
    // Rappel programmé : date et heure confirmées ; « dès que possible » : message d’activation des notifications.
    return scheduled
      ? sendCallbackConfirmation({ lang: campaignLang, phone: e164 as string, name: String(name), callAt, tz: b.tz, kind, voice })
      : sendTemplate('pia_welcome_whatsapp', campaignLang, e164 as string, { 1: safeFirstName(name, campaignLang) });
  };
  const [call, wa] = await Promise.allSettled([
    db.status === 'fulfilled' ? queueCall() : Promise.reject(new Error('demande non enregistrée')),
    sendWhatsApp(),
  ]);
  if (wa.status === 'rejected') console.error('[callback] whatsapp:', wa.reason?.message);
  if (db.status === 'rejected') console.error('[callback] supabase:', db.reason?.message);
  if (mail.status === 'rejected') console.error('[callback] email:', mail.reason?.message);
  if (call.status === 'rejected') console.error('[callback] campagne:', call.reason?.message);
  // Succès seulement si la demande est conservée quelque part.
  if (db.status === 'rejected' && mail.status === 'rejected') {
    return res.status(502).json({ error: 'Impossible d’enregistrer la demande pour le moment.' });
  }
  return res.status(200).json({ success: true, stored: db.status === 'fulfilled', notified: mail.status === 'fulfilled', queued: call.status === 'fulfilled', whatsapp: wantsWhatsApp ? wa.status === 'fulfilled' : undefined });
}
