import type { NextApiRequest, NextApiResponse } from 'next';
import { isLocale } from '@/i18n/locales';
import { safeFirstName, sendCallbackConfirmation, sendTemplate } from '@/lib/whatsapp';
import {
  agentMessage, callbackAgentReply, campaignRoleLine, decideCallback, defuseRoleMarker, needsPrev, parsePrev, readCallbackAsk, storedMarks,
  stripPersonaMarks, teamMailLines, type Kind, type Prev,
} from '@/lib/callbackPersona';
import { isOptedOut } from '@/lib/optout';
import { CONTACTS_DB, captureMeta, insertWithExtras, isYes, recordConsent, recordFormConsents, resolveLocale, upsertContact, type ContactOrigin } from '@/lib/contacts';
import { NOTIFY_TO, alertTeam, checkCallAt, clientIp, describeLocal, zoneFor, dbSelect, dbUpdate, isAuthorized, isAutoCallable, langFromPhone, resolveCallAt, sendMail, toE164, tooManyMessage } from '@/lib/server';

// Limite simple (par instance) : 20 demandes par tranche de 10 minutes, par adresse IP ; pour un outil d’agent
// authentifié par le jeton (tous les outils Autocalls partent des mêmes serveurs), par numéro ou par email.
const hits = new Map<string, number[]>();
function tooMany(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  while (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > 20;
}
/** Marqueur posé par le serveur : accord WhatsApp et langue du message (lu aussi après un appel manqué). */
const waMark = (lang: string) => `[WA:${lang}] confirmation WhatsApp demandée`;
/** Marqueur de la langue de la campagne (langue du site) : SMS de repli après un appel manqué dans cette langue,
 *  même si l’indicatif du numéro est celui d’un autre pays. */
const langMark = (lang: string) => `[LANG:${lang}]`;
/** Site d’où vient la demande (ou langue de l’agent) : choisit le numéro WhatsApp du message « rappel manqué ». */
const marketMark = (market: string) => `[MKT:${market}]`;
// Créneaux du formulaire (valeurs fixes en français) : en anglais pour les agents des autres pays, qui les résument dans leur langue.
const SLOT_EN: Record<string, string> = { 'Aujourd’hui après-midi': 'this afternoon', 'Demain matin': 'tomorrow morning', 'Demain après-midi': 'tomorrow afternoon' };
const clip = (v: unknown, max: number) => (v == null ? v : String(v).slice(0, max));
/** Texte libre recopié dans la note de campagne (créneau, fuseau, date du formulaire) : ni crochet ni saut de ligne,
 *  pour qu’aucune ligne de rôle « [ROLE: » ne puisse être imitée. */
const free = (v: unknown) => String(v).replace(/[\[\]\r\n]/g, ' ');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const ip = clientIp(req);
  const authed = isAuthorized(req);
  const who = String(req.body?.phone || '').replace(/\D/g, '') || String(req.body?.email || '').trim().toLowerCase();
  if (tooMany(authed && who ? `who:${who}` : `ip:${ip}`)) {
    return res.status(429).json({ error: 'Trop de demandes, réessayez dans quelques minutes.', message_for_agent: tooManyMessage(req.body?.language ?? req.body?.locale) });
  }
  // Champ piège invisible : rempli uniquement par les robots. On répond « succès » sans rien faire.
  if (req.body?.website) return res.status(200).json({ success: true });

  const b = req.body || {};
  const { consentCall, type, locale } = b;
  const name = clip(b.name, 120), phone = clip(b.phone, 32), email = clip(b.email, 160), company = clip(b.company, 160);
  const sector = clip(b.sector, 80), slot = clip(b.slot, 120), note = clip(b.note, 1500), agent = clip(b.agent, 120);
  // Accepte true ou "true" (les outils des agents envoient des chaînes).
  if (!(consentCall === true || consentCall === 'true')) return res.status(400).json({ error: 'Consentement au rappel requis.' });
  if (!name || !phone || String(phone).trim().length < 8) return res.status(400).json({ error: 'Nom et numéro valides requis.' });

  // Langue du site (fr, en-gb, en-au, it, pl, nl, he) ; « intl » = demande enregistrée par un agent pendant un appel.
  // Sans langue précisée (outils d’agents WhatsApp, lignes UK / Israël), la campagne suit l’indicatif du numéro.
  const lang = isLocale(locale) ? locale : 'intl';
  const e164 = toE164(String(phone), lang, typeof b.cc === 'string' ? b.cc : undefined);
  // Numéro illisible (lettres, trop court ou trop long) : rien n’est enregistré ni envoyé par email.
  if (!e164) {
    return res.status(400).json({
      error: 'Nom et numéro valides requis.',
      message_for_agent: `The phone number "${phone}" is not valid. Nothing was saved: ask the person to repeat the number digit by digit (with the country code if it is not local), then call this tool again.`,
    });
  }
  // Demande enregistrée par un agent (outil authentifié par le jeton secret) : campagne choisie d’après
  // l’indicatif du numéro, et reprogrammation permise. Sans jeton, les règles du site s’appliquent.
  const fromAgent = authed && (lang === 'intl' || Boolean(agent));
  const campaignLang = lang === 'intl' ? langFromPhone(e164) : lang;
  // Date fournie par un outil d’agent (champ call_at) : illisible, passée ou à plus de 30 jours → rien n’est
  // enregistré et l’agent reçoit la date du jour pour redemander, au lieu d’un appel immédiat non souhaité.
  const zone = zoneFor(b.tz, campaignLang);
  const agentCallAt = typeof b.call_at === 'string' ? b.call_at.trim() : '';
  if (agentCallAt) {
    const { problem } = checkCallAt(agentCallAt, zone);
    if (problem) {
      return res.status(200).json({
        success: false, error: `call_at ${problem}`,
        message_for_agent: `The callback time "${agentCallAt}" is ${problem === 'unreadable' ? 'not a valid ISO 8601 date-time' : problem === 'past' ? 'in the past' : 'more than 30 days away'}. Now it is ${describeLocal(new Date(), zone, 'en-gb')} (${zone}). Nothing was saved: ask the person again for the day and time, read it back, then call this tool again with a correct call_at.`,
      });
    }
  }
  // Date précise choisie dans le formulaire (callAt) : même contrôle, refus explicite plutôt qu’un appel immédiat
  // ou ramené à une autre date que celle choisie.
  const formCallAt = typeof b.callAt === 'string' ? b.callAt.trim() : '';
  if (!agentCallAt && (formCallAt || slot === 'precise')) {
    const problem = formCallAt ? checkCallAt(formCallAt, zone).problem : 'unreadable';
    if (problem) return res.status(400).json({ error: 'Date de rappel passée, trop lointaine ou invalide.', code: `call_at_${problem}` });
  }
  // Moment du rappel : date précise (formulaire ou agent), créneau du formulaire, sinon dès que possible.
  const callAt = resolveCallAt({ callAt: b.callAt ?? b.call_at, slot, tz: b.tz, lang: campaignLang });
  const scheduled = callAt.getTime() > Date.now() + 60_000;
  // Case WhatsApp du formulaire (accord séparé, décoché par défaut) : confirmation envoyée sur WhatsApp.
  const wantsWhatsApp = (b.whatsapp === true || b.whatsapp === 'true') && !fromAgent;
  // Langue des relances, toujours enregistrée avec sa provenance (src/lib/contacts.ts) : langue du site du
  // formulaire (pour la démo, celle du site, la langue de la démo est gardée à part), sinon langue déclarée par
  // l’agent (« en » tranché par l’indicatif), sinon indicatif non ambigu ; à défaut, à valider à la main.
  const siteLocale = fromAgent ? undefined : isLocale(b.siteLocale) ? b.siteLocale : locale;
  // Marché : le site d’où vient la demande (pas la langue d’une démo) ; pour un agent, la langue de la campagne.
  // Seul le site israélien envoie ses WhatsApp depuis le numéro israélien.
  const market = siteLocale ?? campaignLang;
  const resolved = resolveLocale({ siteLocale, agentLang: fromAgent ? b.language ?? locale : undefined, phone: e164 });
  // Cases marketing : seulement depuis un formulaire du site qui les affiche (booléen présent dans le corps).
  const siteForm = !fromAgent && typeof b.marketingEmail === 'boolean';
  const marketingEmail = siteForm && b.marketingEmail === true;
  const marketingWhatsApp = siteForm && b.marketingWhatsApp === true;
  // Agent : paramètre marketing_email_consent rempli seulement après une question explicite (oui ou non).
  const agentAnswered = fromAgent && b.marketing_email_consent != null && String(b.marketing_email_consent).trim() !== '';
  const meta = fromAgent ? null : captureMeta(b);
  // Colonnes ajoutées par la migration 20261008_relances_capture.sql : la demande est enregistrée sans elles tant
  // qu’elle n’est pas exécutée.
  const origin: ContactOrigin = type === 'support' ? 'contact' : agent === 'Démo live' ? 'demo' : agent === 'Accompagnement essai' ? 'trial_request' : 'callback';
  const extra = {
    origin, locale: resolved.locale, locale_source: resolved.locale_source, locale_needs_review: resolved.locale_needs_review,
    demo_lang: agent === 'Démo live' && isLocale(locale) ? locale : null, ...(meta || {}),
    marketing_email_consent: siteForm ? marketingEmail : agentAnswered ? isYes(b.marketing_email_consent) : null,
    marketing_whatsapp_consent: siteForm ? marketingWhatsApp : null,
  };

  // Qui rappelle (src/lib/callbackPersona.ts) : même persona, responsable IA de l’autre voix, ou personne de l’équipe.
  // Seulement pour un outil d’agent qui envoie callback_by ou aid (?aid={{assistant_id}}) ; sinon, comme avant :
  // voix choisie dans la démo ou champ statique voice=male de l’outil, seule la valeur exacte « male » comptant.
  const kind: Kind = type === 'support' ? 'support' : 'commercial';
  const ask = readCallbackAsk({ fromAgent, aid: req.query?.aid, callbackBy: b.callback_by });
  if (ask.active && !ask.requester) console.warn(`[callback] aid ${ask.aidGiven ? 'inconnu' : 'absent'} : agent non identifié, voix de repli`);
  let prev: Prev | undefined;
  let prevFailed = false;
  if (needsPrev(ask)) {
    // Dernière demande en file (même numéro, même type, 31 jours) : rôle gardé à la reprogrammation, voix reprise
    // pour « again », même responsable IA (R12), boucle coupée quand le responsable IA se voit redemander un responsable.
    // Lecture en échec : un responsable ou un humain demandé au responsable IA possible va à l’équipe (decideCallback).
    const since = new Date(Date.now() - 31 * 86_400_000).toISOString();
    const [p] = await dbSelect<{ note: string | null; slot: string | null }>('callbacks',
      `select=note,slot&phone=eq.${encodeURIComponent(e164)}&type=eq.${kind}&status=eq.scheduled&created_at=gte.${since}&order=created_at.desc&limit=1`)
      .catch((e) => { console.error('[callback] dernière demande:', e.message); prevFailed = true; return []; });
    if (p) prev = parsePrev(p.note, p.slot);
  }
  const persona = decideCallback(ask, { staticVoice: b.voice, lang: campaignLang, kind, prev, prevFailed });
  // Voix transmise à l’automatisation : 'male' bascule sur la campagne masculine, sinon voix féminine par défaut.
  const voice = persona.voice;

  const row = {
    name, phone: e164, email: email || null, company: company || null, sector: sector || null,
    slot: [slot || 'asap', scheduled && `→ ${callAt.toISOString()}`].filter(Boolean).join(' '),
    // Marqueurs [WA], [VOICE], [ROLE] et [ASKED] posés seulement par le serveur (crochets retirés du texte du visiteur
    // ou de l’agent) : plafond quotidien WhatsApp, et voix et rôle de cette demande pour la suivante.
    note: [note && String(note).replace(/[\[\]]/g, ''), wantsWhatsApp && waMark(campaignLang), langMark(campaignLang), marketMark(market), storedMarks(persona)].filter(Boolean).join(' — ') || null, type: kind,
    agent: agent ? `${agent}${isLocale(locale) && locale !== 'fr' ? ` [${locale}]` : ''}` : null, consent_call: true, status: 'pending',
  };

  // Rappel automatique : la demande rejoint la campagne d’appels de son pays et de son type (commercial ou support).
  let leadHook: string | undefined;
  if (campaignLang === 'fr') leadHook = kind === 'support' ? process.env.LEAD_WEBHOOK_SUPPORT : process.env.LEAD_WEBHOOK_COMMERCIAL;
  else {
    try { leadHook = JSON.parse(process.env.LEAD_WEBHOOKS_INTL || '{}')[campaignLang]?.[kind]; } catch { leadHook = undefined; }
  }
  // requestId : identifiant de la ligne enregistrée, renvoyé par l’automatisation à /api/callback/check
  // juste avant l’appel (une demande remplacée par une plus récente du même numéro n’est plus appelée).
  // Email transmis à la campagne seulement s’il a la forme d’une adresse (pas de texte libre ajouté à la note).
  const campaignEmail = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(String(email || '').trim()) ? String(email).trim() : '';
  const queueCall = async (requestId?: string) => {
    // Responsable IA à qui l’on redemande un responsable ou un humain : aucun nouvel appel IA (pas de boucle entre
    // deux voix), l’équipe reçoit « À rappeler à la main ».
    // Opposition « ne plus appeler » signalée d’abord, pour que l’e-mail le dise.
    if ((persona.role === 'human' || persona.personaMissing) && await isOptedOut(e164).catch(() => false)) throw new Error('opposition « ne plus appeler » enregistrée pour ce numéro');
    if (persona.role === 'human') throw new Error(persona.supportTeam ? 'responsable demandé au support : rappel par une personne de l’équipe' : 'personne de l’équipe demandée au responsable IA (pas de nouvel appel IA)');
    // Persona de rappel pas encore créée (support masculin) : jamais une autre voix sous un autre prénom.
    if (persona.personaMissing) throw new Error(`persona de rappel ${kind} ${persona.target === 'male' ? 'masculine' : 'féminine'} pas encore en place (${persona.targetName})`);
    if (!leadHook) throw new Error(`webhook de campagne non configuré pour ${campaignLang}/${kind}`);
    // Garde-fous contre les appels abusifs : numéros surtaxés et destinations à risque exclus, et au plus
    // 3 rappels par numéro sur 7 jours (la demande, puis jusqu’à deux reprogrammations par un agent).
    // Un outil d’agent authentifié par le jeton n’est pas limité.
    if (!isAutoCallable(e164)) throw new Error(`numéro hors zone d’appel automatique : ${phone}`);
    // Opposition « ne plus appeler » déjà reçue par un agent : plus aucun appel automatique, quelle que soit la source
    // (site ou agent). L’équipe reçoit « À rappeler à la main » et décide avec la personne.
    if (await isOptedOut(e164)) throw new Error('opposition « ne plus appeler » enregistrée pour ce numéro');
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
        ...(requestId ? { request_id: requestId } : {}),
        // Les automatisations Autocalls basculent sur la campagne de la voix masculine quand body.voice === 'male'.
        ...(voice ? { voice } : {}),
        // Email saisi sur le site (accompagnement à l’essai, rappel) : transmis à l’agent, qui n’a pas à le redemander.
        ...(campaignEmail ? { email: campaignEmail } : {}),
        // Avec callback_by ou aid : ligne de rôle en tête, seule à faire foi pour l’agent qui rappelle, et crochets
        // retirés du texte reçu (aucune ligne de rôle imitable). Sans eux : note d’avant, seule une fausse ligne
        // « [ROLE: » étant neutralisée. Créneau, fuseau et date du formulaire : crochets et sauts de ligne retirés.
        note: [campaignRoleLine(persona), [note && (persona.active ? String(note).replace(/[\[\]]/g, '') : defuseRoleMarker(String(note))), ticket && `Ticket : ${ticket}`,
          slot && slot !== 'asap' && `Créneau souhaité : ${free(slot === 'precise' ? clip(b.callAt, 40) : campaignLang === 'fr' ? slot : SLOT_EN[slot] || slot)}${b.tz ? ` (${free(b.tz)})` : ''}`,
          // Date précise reportée au prochain créneau d’appel du marché : l’agent annonce l’heure réelle de l’appel.
          slot === 'precise' && scheduled && `Appel prévu : ${describeLocal(callAt, zone, campaignLang)} (${zone})`, campaignEmail && !fromAgent && `Email : ${campaignEmail}`].filter(Boolean).join(' — ')].filter(Boolean).join('\n'),
      }),
    });
    if (!r.ok) throw new Error(`campagne ${r.status}`);
    // Statut « scheduled » = rappel réellement mis en file : seule une demande dans cet état remplace les précédentes
    // (une nouvelle demande refusée par les plafonds laisse l’ancienne valable). Échec sans effet sur l’appel.
    if (requestId) await dbUpdate('callbacks', `id=eq.${encodeURIComponent(requestId)}`, { status: 'scheduled' })
      .catch((e) => console.error('[callback] statut:', e.message));
  };

  const [db] = await Promise.allSettled([insertWithExtras(CONTACTS_DB, 'callbacks', row, extra, true)]);
  // Fiche contact et journal des accords (relances) : jamais bloquants, sautés tant que la migration n’est pas faite.
  const consentSource = fromAgent ? `agent:callback${agent ? `:${agent}` : ''}` : `site:${origin}:${meta?.origin_page || ''}`;
  const capture = Promise.all([
    upsertContact(CONTACTS_DB, { email, name, company, sector, phone: e164, resolved, origin, meta: meta || undefined }),
    siteForm && recordFormConsents(CONTACTS_DB, { email, phone: e164, locale: resolved.locale, marketingEmail, marketingWhatsApp, source: consentSource, ip }),
    // Accord (ou refus) donné oralement à un agent, après sa question explicite : enregistré avec l’identifiant de l’appel.
    agentAnswered && recordConsent(CONTACTS_DB, {
      email, channel: 'email', purpose: 'marketing', granted: isYes(b.marketing_email_consent), legal_basis: isYes(b.marketing_email_consent) ? 'consent' : null,
      notice_shown: false, locale: resolved.locale, source: consentSource, call_id: clip(b.call_id ?? b.conversation_id, 80) as string | undefined,
    }),
  ]).catch((e) => console.error('[callback] contacts:', e.message));
  // Numéro de ticket (demandes de support) : 8 premiers caractères de l’identifiant de la ligne, lu à la personne
  // par l’agent et repris dans l’email à l’équipe pour retrouver la demande dans la table callbacks.
  const ticket = kind === 'support' && db.status === 'fulfilled' && db.value ? `T-${db.value.replace(/-/g, '').slice(0, 8).toUpperCase()}` : undefined;
  // Appel automatique seulement une fois la demande enregistrée (le contrôle des doublons s’appuie sur la base).
  // Message WhatsApp : mêmes garde-fous que l’appel automatique (demande enregistrée, zone couverte,
  // 3 demandes par numéro sur 7 jours), plus un plafond de 30 messages par 24 h.
  const sendWhatsApp = async () => {
    if (!wantsWhatsApp) return null;
    if (db.status !== 'fulfilled') throw new Error('demande non enregistrée');
    if (!isAutoCallable(e164)) throw new Error(`numéro hors zone : ${e164}`);
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const recent = await dbSelect('callbacks', `select=id&phone=eq.${encodeURIComponent(e164)}&created_at=gte.${since}&limit=4`);
    if (recent.length > 3) throw new Error('trop de demandes pour ce numéro cette semaine');
    const day = await dbSelect('callbacks', `select=id&note=like.*${encodeURIComponent('[WA:')}*&created_at=gte.${new Date(Date.now() - 86_400_000).toISOString()}&limit=31`);
    if (day.length > 30) throw new Error('plafond quotidien de messages WhatsApp atteint');
    // Rappel programmé : date et heure confirmées ; « dès que possible » : message d’activation des notifications.
    return scheduled
      ? sendCallbackConfirmation({ lang: campaignLang, market, phone: e164, name: String(name), callAt, tz: b.tz, kind, voice, advisor: persona.targetName })
      : sendTemplate('pia_welcome_whatsapp', campaignLang, e164, { 1: safeFirstName(name, campaignLang) }, { market });
  };
  // L’appel est mis en file d’abord : la confirmation WhatsApp (« X vous appellera le … ») ne part que s’il l’est.
  const [call] = await Promise.allSettled([db.status === 'fulfilled' ? queueCall(db.value) : Promise.reject(new Error('demande non enregistrée'))]);
  const [wa] = await Promise.allSettled([call.status === 'fulfilled' ? sendWhatsApp() : Promise.resolve(null)]);
  // Email à l’équipe après la tentative de mise en file : il dit si l’appel automatique part ou s’il faut rappeler à la main.
  const callLine = call.status === 'fulfilled'
    ? `Appel automatique : en file${scheduled ? ` pour ${callAt.toISOString()}` : ' (dès que possible)'}`
    : `Appel automatique : NON (${call.reason?.message || 'motif inconnu'}) — À RAPPELER À LA MAIN`;
  const [, mail] = await Promise.allSettled([capture, sendMail({
    to: NOTIFY_TO, category: 'internal',
    subject: `${call.status === 'fulfilled' ? 'Nouvelle demande de rappel' : 'À rappeler à la main'} (${row.type}${ticket ? ` ${ticket}` : ''}) — ${row.name}`,
    // Avec callback_by ou aid : qui rappelle (prénom, voix, rôle) et quel agent a pris la demande. Les marqueurs de
    // persona de la note sont retirés de l’e-mail (lisibles dans la base).
    text: [callLine, ...teamMailLines(persona, kind),
      persona.role === 'human' && prev?.at && !prev.due && `Un rappel IA est encore prévu le ${prev.at} (UTC) pour ce numéro : si la personne est rappelée à la main, passer l’ancienne demande à cancelled dans la base.`, ticket ? `Ticket : ${ticket}` : false, db.status === 'rejected' && 'Demande NON enregistrée en base (voir journaux).', '',
      ...Object.entries({ ...row, note: stripPersonaMarks(row.note) }).map(([k, v]) => `${k}: ${v ?? ''}`),
      `langue (relances) : ${resolved.locale || 'À VALIDER'} (${resolved.locale_source})${extra.demo_lang ? ` — langue de la démo : ${extra.demo_lang}` : ''}`,
      extra.marketing_email_consent != null && `accord email marketing : ${extra.marketing_email_consent ? 'oui' : 'non'}${extra.marketing_whatsapp_consent ? ' — WhatsApp marketing : oui' : ''}`,
      meta?.origin_page && `page : ${meta.origin_page}${meta.utm_source ? ` (utm ${[meta.utm_source, meta.utm_medium, meta.utm_campaign].filter(Boolean).join(' / ')})` : ''}`,
    ].filter((x) => x !== false && x != null).join('\n'),
  })]);
  if (wa.status === 'rejected') console.error('[callback] whatsapp:', wa.reason?.message);
  if (db.status === 'rejected') console.error('[callback] supabase:', db.reason?.message);
  if (mail.status === 'rejected') console.error('[callback] email:', mail.reason?.message);
  if (call.status === 'rejected') console.error('[callback] campagne:', call.reason?.message);
  // Pannes (base, webhook de campagne absent ou en erreur) : alerte limitée à une par heure. Les refus voulus
  // (numéro hors zone, plafonds) restent signalés par l’email « À rappeler à la main » seulement.
  if (db.status === 'rejected') await alertTeam('callback-db', 'demande de rappel non enregistrée en base', String(db.reason?.message));
  const callError = call.status === 'rejected' ? String(call.reason?.message || '') : '';
  if (/^(webhook de campagne|campagne \d)/.test(callError)) await alertTeam(`callback-campaign-${campaignLang}-${kind}`, `campagne d’appels ${campaignLang}/${kind} injoignable`, callError);
  // Succès seulement si la demande est conservée quelque part.
  if (db.status === 'rejected' && mail.status === 'rejected') {
    return res.status(502).json({ error: 'Impossible d’enregistrer la demande pour le moment.' });
  }
  // Date relue par l’agent pour confirmer le rendez-vous (dans la langue et le fuseau de la personne).
  const scheduledFor = scheduled ? `${describeLocal(callAt, zone, campaignLang)} (${zone})` : 'as soon as possible, during calling hours';
  const queued = call.status === 'fulfilled';
  // Rappel automatique non mis en file : l’agent ne promet ni appel ni horaire, l’équipe a reçu « À rappeler à la main ».
  // Ticket de support : l’agent le lit à la personne (une lettre ou un chiffre à la fois).
  const ticketMessage = ticket && `Support ticket number: ${ticket}. Read it to the person one character at a time so they can quote it later.`;
  const notQueuedMessage = 'The request was passed on to the team, but no automatic callback could be scheduled. Do not promise a call at a given time: say that a team member will get back to the person as soon as possible.';
  // Avec callback_by ou aid : qui annoncer (prénom, IA, rôle) ; personne de l’équipe demandée au responsable IA : le
  // seul message « équipe », sans le message générique.
  const personaMessages = [ticketMessage, !queued && persona.role !== 'human' && notQueuedMessage, agentMessage(persona, { queued, scheduledFor })].filter(Boolean);
  return res.status(200).json({
    success: true, scheduled_for: queued ? scheduledFor : 'not scheduled', stored: db.status === 'fulfilled', notified: mail.status === 'fulfilled', queued,
    whatsapp: wantsWhatsApp ? wa.status === 'fulfilled' : undefined,
    ...(ticket ? { ticket } : {}),
    ...(persona.active
      ? { ...(personaMessages.length ? { message_for_agent: personaMessages.join(' ') } : {}), callback_agent: callbackAgentReply(persona, queued) }
      : queued && !ticket ? {} : { message_for_agent: [ticketMessage, !queued && notQueuedMessage].filter(Boolean).join(' ') }),
  });
}
