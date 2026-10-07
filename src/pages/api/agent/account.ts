// Dossier client pour Lucie (conseillère de mise en route, Messenger, support) : elle peut lire le compte
// d’un client — minutes, crédits, agents, numéros, derniers appels, demandes de rappel — après avoir vérifié
// son identité par un code à 6 chiffres envoyé à l’email du compte (personne ne peut lire le compte d’un autre).
//
// POST { action: 'send_code', email }        → envoie le code (réponse identique que le compte existe ou non)
// POST { action: 'lookup', email, code }      → renvoie le résumé du compte si le code est bon (code à usage unique)
import { createHmac, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbInsert, dbSelect, esc, sendMail } from '@/lib/server';

const API = 'https://app.autocalls.ai/api';
const WINDOW_MS = 10 * 60_000; // un code reste valable 10 à 20 minutes ; 6 chiffres, 5 essais par heure et par email

// Limites en mémoire (par instance), en complément des compteurs persistants plus bas.
const hits = new Map<string, number[]>();
function tooMany(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < 15 * 60_000);
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  // Éviction des plus anciennes entrées seulement (jamais de remise à zéro globale).
  while (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > max;
}

/** Compteurs persistants partagés par toutes les instances (table call_events), sur la dernière heure. */
const emailKey = (email: string) => createHmac('sha256', codeSecret()).update(`id|${email}`).digest('hex').slice(0, 32);
async function countEvents(kind: string, email: string, windowMs = 3600_000) {
  const since = new Date(Date.now() - windowMs).toISOString();
  const rows = await dbSelect<{ id: string }>('call_events', `select=id&kind=eq.${kind}&external_id=eq.${emailKey(email)}&created_at=gte.${since}&limit=20`);
  return rows.length;
}
const logEvent = (kind: string, email: string) => dbInsert('call_events', { kind, external_id: emailKey(email) }).catch(() => undefined);
/** Enregistre l’essai AVANT de vérifier le code ; si l’écriture échoue, l’erreur remonte et l’accès est refusé. */
const recordAttempt = (email: string) => dbInsert('call_events', { kind: 'otp_try', external_id: emailKey(email) });

/** Secret dédié aux codes, distinct du jeton des webhooks ; sans lui, la route refuse de fonctionner. */
function codeSecret() {
  const s = process.env.ACCOUNT_CODE_SECRET;
  if (!s || s.length < 32) throw new Error('ACCOUNT_CODE_SECRET absente ou trop courte');
  return s;
}

/** Adresse du client : avant-dernière valeur de X-Forwarded-For (la dernière est ajoutée par le répartiteur Google). */
function clientIp(req: NextApiRequest) {
  const parts = String(req.headers['x-forwarded-for'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || req.socket.remoteAddress || '';
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function codeFor(email: string, slot: number) {
  const n = createHmac('sha256', codeSecret()).update(`lucie|${email}|${slot}`).digest().readUInt32BE(0) % 1_000_000;
  return String(n).padStart(6, '0');
}
function codeIsValid(email: string, code: string) {
  const slot = Math.floor(Date.now() / WINDOW_MS);
  const got = Buffer.from(code.replace(/\D/g, ''));
  return [slot, slot - 1].some((s) => {
    const want = Buffer.from(codeFor(email, s));
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

async function api<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`Autocalls ${path} ${res.status}`);
  return res.json();
}

interface PlatformUser { id: number; name: string; email: string; minutes_balance: number; credits_balance: number; created_at: string }

async function findUser(email: string): Promise<PlatformUser | undefined> {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) throw new Error('AUTOCALLS_API_KEY non configurée');
  const body = await api<{ data?: PlatformUser[] } | PlatformUser[]>('/white-label/users', key);
  const list = Array.isArray(body) ? body : body.data || [];
  return list.find((u) => u.email.toLowerCase() === email);
}

const items = (b: any): any[] => (Array.isArray(b) ? b : Array.isArray(b?.data) ? b.data : []);

/** Lit le compte avec un jeton temporaire du client, révoqué aussitôt après. */
async function accountSummary(user: PlatformUser) {
  const key = process.env.AUTOCALLS_API_KEY as string;
  const created = await api<{ token: string }>('/white-label/token', key, {
    method: 'POST', body: JSON.stringify({ user_id: user.id, token_name: 'lucie-lecture' }),
  });
  const token = created.token;
  try {
    const [assistants, numbers, calls] = await Promise.all([
      api<any>('/user/assistants/get?per_page=20', token).catch(() => null),
      api<any>('/user/phone-numbers', token).catch(() => null),
      api<any>('/user/calls?per_page=5', token).catch(() => null),
    ]);
    return {
      agents: items(assistants).map((a) => ({ name: a.name, type: a.type, has_phone_number: Boolean(a.phone_number_id), has_knowledgebase: Boolean(a.knowledgebase_id) })),
      phone_numbers: items(numbers).map((n) => ({ number: n.phone_number || n.number, assigned_agent: n.assistant_id ? 'oui' : 'non' })),
      last_calls: items(calls).slice(0, 5).map((c) => ({ date: c.created_at, duration_seconds: c.duration, status: c.status, agent: c.assistant_name })),
    };
  } finally {
    // Jeton au format « id|secret » : on ne révoque que celui-ci, jamais les clés API du client.
    const tokenId = Number(String(token).split('|')[0]);
    if (tokenId) {
      await api('/white-label/logout', key, { method: 'POST', body: JSON.stringify({ user_id: user.id, token_id: tokenId }) }).catch(() => undefined);
    }
  }
}

/** Email du code de vérification, dans la langue de la conversation (français + anglais si inconnue). */
const CODE_MAIL: Record<string, { dir?: 'rtl'; subject: string; hello: string; line: string; valid: string; ignore: string }> = {
  fr: { subject: 'Votre code de vérification', hello: 'Bonjour,', line: 'Votre code pour que votre conseillère Permanence IA consulte votre compte :', valid: 'Il est valable 10 minutes.', ignore: 'Si vous n’avez rien demandé, ignorez cet email.' },
  en: { subject: 'Your verification code', hello: 'Hello,', line: 'Your code so your PermanenceAI adviser can look at your account:', valid: 'It is valid for 10 minutes.', ignore: 'If you didn’t ask for it, please ignore this email.' },
  it: { subject: 'Il Suo codice di verifica', hello: 'Buongiorno,', line: 'Il Suo codice per permettere alla consulente PermanenceIA di consultare il Suo account:', valid: 'È valido 10 minuti.', ignore: 'Se non lo ha richiesto, ignori questa email.' },
  pl: { subject: 'Kod weryfikacyjny', hello: 'Dzień dobry,', line: 'Kod, dzięki któremu doradczyni PermanenceAI może sprawdzić Państwa konto:', valid: 'Kod jest ważny 10 minut.', ignore: 'Jeśli to nie Państwo o niego prosili, prosimy zignorować tę wiadomość.' },
  nl: { subject: 'Uw verificatiecode', hello: 'Hallo,', line: 'Uw code waarmee uw PermanenceAI-adviseur uw account kan bekijken:', valid: 'De code is 10 minuten geldig.', ignore: 'Heeft u hier niet om gevraagd? Dan kunt u deze e-mail negeren.' },
  he: { dir: 'rtl', subject: 'קוד האימות שלכם', hello: 'שלום,', line: 'הקוד שמאפשר ליועצת של PermanenceAI לעיין בחשבון שלכם:', valid: 'הקוד בתוקף ל-10 דקות.', ignore: 'אם לא ביקשתם קוד, אפשר להתעלם מהודעה זו.' },
};
function codeMail(lang: string, code: string) {
  const key = lang.toLowerCase().slice(0, 2);
  const list = CODE_MAIL[key] ? [CODE_MAIL[key]] : [CODE_MAIL.fr, CODE_MAIL.en];
  const block = (t: (typeof list)[number]) => `<div dir="${t.dir || 'ltr'}" style="text-align:${t.dir ? 'right' : 'left'}"><p>${t.hello}</p><p>${t.line}</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px" dir="ltr">${esc(code)}</p><p>${t.valid} ${t.ignore}</p></div>`;
  return {
    // Espace avant les deux-points seulement en français.
    subject: `${list.map((t) => t.subject).join(' · ')}${key === 'fr' || !CODE_MAIL[key] ? ' :' : ':'} ${code}`,
    // Nom d’expéditeur = marque du marché (Permanence IA, PermanenceIA en Italie, PermanenceAI ailleurs).
    from: key === 'it' ? 'PermanenceIA' : key !== 'fr' && CODE_MAIL[key] ? 'PermanenceAI' : 'Permanence IA',
    text: list.map((t) => `${t.hello}\n\n${t.line} ${code}\n${t.valid} ${t.ignore}`).join('\n\n—\n\n'),
    html: list.map(block).join('<hr>'),
  };
}

/** Assistants autorisés à reconnaître un numéro : UUID non publiés (aucun widget public), qui servent de clé partagée
 *  avec l’outil Autocalls « identifier_contact ». Jamais d’identifiant numérique, devinable. */
const IDENTIFY_ASSISTANTS = new Set(['798c2ab1-b454-40fb-b16c-711fc68eff50', '6b50ad79-6c28-4950-afc2-e1fafd152def', '78f36e5d-1c24-45c5-ac69-fb20b641b02e']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  const ip = clientIp(req);

  const b = req.body || {};

  // Reconnaissance d’un contact par son numéro (premier message WhatsApp, appel entrant) : seulement pour nos
  // assistants non publics (pas les widgets du site), et réponse minimale : prénom, profil, langue, dernière demande.
  if (b.action === 'identify') {
    if (!IDENTIFY_ASSISTANTS.has(String(b.assistant || ''))) {
      console.warn('[agent-account] identify refusé (assistant non autorisé, format :', /^\d+$/.test(String(b.assistant)) ? 'numérique' : 'autre', ')');
      return res.status(403).json({ known: false });
    }
    // Plafonds : par adresse et global (toutes adresses confondues) sur chaque instance.
    if (tooMany(`identify:${ip}`, 60) || tooMany('identify:all', 300)) return res.status(429).json({ known: false });
    const phone = String(b.phone || '').replace(/[^\d+]/g, '');
    if (!/^\+\d{8,15}$/.test(phone)) return res.status(200).json({ known: false, profile: 'inconnu', message: 'Numéro non reconnu : identifie le besoin à partir du message.' });
    const rows = await dbSelect<{ name: string; email: string | null; type: string; agent: string | null; created_at: string; note: string | null }>(
      'callbacks', `select=name,email,type,agent,created_at,note&phone=eq.${encodeURIComponent(phone)}&order=created_at.desc&limit=5`).catch(() => []);
    if (!rows.length) return res.status(200).json({ known: false, profile: 'inconnu', message: 'Numéro inconnu : nouvelle personne. Pars de son message pour comprendre ce qu’elle veut, sans lui demander si elle est cliente.' });
    const emails = Array.from(new Set(rows.map((r) => r.email).filter(Boolean))) as string[];
    const signedUp = emails.length
      ? (await dbSelect('signups', `select=email&email=in.(${emails.map((e) => encodeURIComponent(e.toLowerCase())).join(',')})&limit=1`).catch(() => [])).length > 0
      : false;
    const last = rows[0];
    const lang = /\[(fr|en-gb|en-au|it|pl|nl|he)\]/.exec(rows.map((r) => r.agent || '').join(' '))?.[1] || /\[WA:([a-z-]+)\]/.exec(rows.map((r) => r.note || '').join(' '))?.[1] || null;
    return res.status(200).json({
      known: true,
      first_name: String(last.name || '').trim().split(/\s+/)[0] || null,
      profile: signedUp || rows.some((r) => r.type === 'support') ? 'client' : 'prospect',
      language: lang,
      last_request: { date: last.created_at.slice(0, 10), type: last.type === 'support' ? 'support' : 'rappel commercial ou démo' },
      message: 'Contact connu : salue-le par son prénom. Ne donne aucune autre information de son dossier sans le code envoyé par email.',
    });
  }

  if (tooMany(`ip:${ip}`, 10)) return res.status(429).json({ message: 'Trop de demandes : réessayez dans quelques minutes.' });
  const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ message: 'Adresse email invalide : demandez à la personne de la vérifier.' });

  try {
    if (b.action === 'send_code') {
      // Réponse identique et en temps constant, que l’adresse ait un compte ou non (pas d’énumération).
      const started = Date.now();
      const work = (async () => {
        if (tooMany(`mail:${email}`, 3) || (await countEvents('otp_send', email)) >= 3) return;
        const user = await findUser(email);
        if (!user) return;
        await logEvent('otp_send', email);
        const code = codeFor(email, Math.floor(Date.now() / WINDOW_MS));
        const m = codeMail(String(b.lang || ''), code);
        await sendMail(email, m.subject, m.text, m.html, m.from);
      })().catch((e) => console.error('[agent-account] send_code:', e.message));
      await Promise.race([work, sleep(6000)]);
      await sleep(Math.max(0, 6000 - (Date.now() - started)));
      return res.status(200).json({ message: 'Si cette adresse correspond à un compte, un code à 6 chiffres vient d’y être envoyé (vérifier aussi les spams). Demandez-le à la personne.' });
    }

    if (b.action === 'lookup') {
      // Verrou persistant, toutes instances confondues : l’essai est compté avant la vérification (au plus 5 par heure),
      // et un code déjà utilisé avec succès ne resservira pas.
      if (tooMany(`try:${email}`, 5)) return res.status(429).json({ verified: false, message: 'Trop d’essais : réessayez dans une heure, ou créez un ticket.' });
      await recordAttempt(email);
      if ((await countEvents('otp_try', email)) > 5) {
        return res.status(429).json({ verified: false, message: 'Trop d’essais : le dossier est verrouillé pendant une heure. Continuez sans dossier ou créez un ticket.' });
      }
      // Marqueur propre à ce code : un même code ne sert qu’une fois, un nouveau code reste utilisable.
      const usedKey = `${email}|code:${String(b.code || '').replace(/\D/g, '')}`;
      if (!codeIsValid(email, String(b.code || '')) || (await countEvents('otp_ok', usedKey, 2 * WINDOW_MS)) > 0) {
        return res.status(200).json({ verified: false, message: 'Code incorrect, expiré ou déjà utilisé : proposez d’envoyer un nouveau code.' });
      }
      await dbInsert('call_events', { kind: 'otp_ok', external_id: emailKey(usedKey) });
      const user = await findUser(email);
      if (!user) return res.status(200).json({ verified: false, message: 'Aucun compte avec cette adresse : demandez l’email utilisé à l’inscription.' });

      const [summary, requests] = await Promise.all([
        accountSummary(user).catch(() => null),
        dbSelect<any>('callbacks', `select=created_at,type,slot,note,status&email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=5`).catch(() => []),
      ]);
      const hasMinutes = Number(user.minutes_balance) > 0;
      return res.status(200).json({
        verified: true,
        name: user.name,
        account_created: user.created_at,
        minutes_left: user.minutes_balance,
        message_credits_left: user.credits_balance,
        plan_status: hasMinutes
          ? 'Forfait ou essai actif (minutes disponibles). Pour le nom exact du forfait et la date de fin d’essai, demandez-lui de regarder Billing info.'
          : 'Aucune minute : aucun forfait choisi (essai pas démarré) ou minutes épuisées. Proposez Change plan pour démarrer l’essai de 14 jours.',
        agents: summary?.agents ?? 'indisponible',
        phone_numbers: summary?.phone_numbers ?? 'indisponible',
        last_calls: summary?.last_calls ?? 'indisponible',
        previous_requests: requests,
      });
    }
    return res.status(400).json({ message: 'Action inconnue.' });
  } catch (e: any) {
    console.error('[agent-account]', e.message);
    return res.status(200).json({ verified: false, message: 'Le dossier est momentanément indisponible : continuez sans, ou créez un ticket.' });
  }
}
