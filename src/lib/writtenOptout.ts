// « Ne plus me contacter » sur les canaux sans numéro d’appelant : Messenger (21297), assistante de l’espace client
// (21205) et widgets du site, écrits ou vocaux (audit du 9 oct. 2026, action 18). Leur outil « ne plus appeler » (6244)
// n’envoie pas le jeton : /api/agent/optout ne peut rien appliquer (n’importe qui pourrait bloquer le numéro d’un
// autre). Le webhook de fin d’échange, lui, est authentifié (relais Autocalls) : il applique l’opposition ici.
// - Signal : issue ne_plus_appeler ou desinscription, ou appel de l’outil d’opposition dans la transcription.
// - Numéros : variable post-échange optout_phone (à ajouter dans Autocalls), numéro passé à l’outil d’opposition,
//   sinon numéros des demandes de rappel enregistrées pendant l’échange.
// - Garde-fou : un numéro n’est bloqué que si une demande de rappel a été enregistrée pour lui pendant ce même échange :
//   appel de l’outil de rappel dans la transcription, ou ligne callbacks portant le marqueur [CONV:<identifiant de
//   l’échange>] (posé par /api/callback quand l’outil envoie conversation_id ou call_id). Jamais une demande d’un autre
//   échange, même récente : la personne ne peut faire bloquer que le numéro qu’elle a elle-même donné. Sinon l’équipe
//   est prévenue, rien n’est appliqué. Effets : ceux de registerOptOut (rappels annulés, registre, liste de blocage
//   Autocalls, e-mail à l’équipe).
// - desinscription avec une adresse e-mail dans l’échange (variable email) : préférence « e-mails essentiels seulement »
//   aussi enregistrée (plus aucun e-mail commercial).
// Une opposition déjà enregistrée pour ce numéro depuis le début de l’échange n’est pas refaite (WhatsApp et Messenger
// renvoient la conversation à chaque message). Accès réseau passés en paramètre (faux en test).
import { exchangeStart } from './conversationCopy';
import { EMAIL_PREF_KIND, emailKey, isValidEmail, normEmail, saveEmailPref, type PrefDb } from './emailPrefs';
import { OPTOUT_KIND, registerOptOut } from './optout';
import { NOTIFY_TO, PREF_DB, dbInsert, dbSelect, esc, sendMail, toE164 } from './server';

export interface WrittenOptoutDeps {
  select: <T>(table: string, query: string) => Promise<T[]>;
  insert: (table: string, row: Record<string, unknown>) => Promise<unknown>;
  register: typeof registerOptOut;
  prefDb: PrefDb;
  notify: (subject: string, text: string) => Promise<unknown>;
  now: () => Date;
}

export const writtenOptoutDeps: WrittenOptoutDeps = {
  select: dbSelect, insert: (table, row) => dbInsert(table, row), register: registerOptOut, prefDb: PREF_DB, now: () => new Date(),
  notify: (subject, text) => sendMail({ to: NOTIFY_TO, category: 'internal', subject, text, html: `<p>${text.split('\n').map(esc).join('<br>')}</p>` }),
};

/** Trace d’une opposition écrite non appliquée (une alerte par échange et par numéro). */
export const UNVERIFIED_KIND = 'optout_a_verifier';
const OPTOUT_TOOL = /ne_?plus|opt_?out|do_?not_?call|stop_?call|no_?call|blacklist/i;
const CALLBACK_TOOL = /rappel|callback/i;
const obj = (v: unknown): Record<string, any> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, any> : {});

function parseArgs(raw: unknown): Record<string, any> {
  if (raw && typeof raw === 'object') return obj(raw);
  if (typeof raw !== 'string') return {};
  try { return obj(JSON.parse(raw)); } catch { return {}; }
}

export interface ToolCall { name: string; args: Record<string, any> }

/**
 * Appels d’outils de la transcription : messages d’assistant avec tool_calls ou function_call (conversations), entrées
 * { type: 'function', text: 'nom({…})' } (appels), ou entrées { name, arguments }. Le reste est ignoré.
 */
export function toolCalls(transcript: unknown): ToolCall[] {
  if (!Array.isArray(transcript)) return [];
  const out: ToolCall[] = [];
  const push = (name: unknown, args: unknown) => { if (typeof name === 'string' && name) out.push({ name, args: parseArgs(args) }); };
  for (const e of transcript.slice(0, 2000)) {
    const m = obj(e);
    for (const tc of Array.isArray(m.tool_calls) ? m.tool_calls : []) {
      const f = obj(obj(tc).function ?? tc);
      push(f.name, f.arguments ?? f.args ?? f.parameters);
    }
    if (m.function_call) push(obj(m.function_call).name, obj(m.function_call).arguments);
    if (String(m.type ?? '').toLowerCase() === 'function' && typeof m.text === 'string') {
      const call = /^\s*([\w.-]+)\s*\(([\s\S]*)\)\s*$/.exec(m.text.slice(0, 4000));
      if (call) push(call[1], call[2]);
    } else if (typeof m.name === 'string' && (m.arguments != null || m.args != null) && m.role !== 'tool') push(m.name, m.arguments ?? m.args);
  }
  return out;
}

const phoneArg = (a: Record<string, any>) => a.phone ?? a.customer_phone ?? a.phone_number ?? a.numero ?? a.number ?? null;

/** Numéro au format international, sans pays supposé (« intl ») sauf indicatif fourni avec l’outil. */
function e164(raw: unknown, cc?: unknown): string | null {
  const s = String(raw ?? '').slice(0, 32).trim();
  if (!s || /[{}]/.test(s)) return null;
  return toE164(s, 'intl', typeof cc === 'string' ? cc : undefined);
}
/**
 * Identifiant d’échange (conversation_id ou call_id) utilisable dans le marqueur [CONV:…] des demandes de rappel :
 * lettres, chiffres, « _ . : - », 80 caractères au plus ; null s’il est vide, trop court ou resté en gabarit ({{…}}).
 */
export function exchangeId(raw: unknown): string | null {
  const s = String(raw ?? '').trim();
  if (!s || /[{}]/.test(s)) return null;
  const id = s.replace(/[^\w.:-]/g, '').slice(0, 80);
  return id.length >= 4 ? id : null;
}
/** Marqueur posé par le serveur dans la note d’une demande de rappel enregistrée par un agent pendant un échange. */
export const exchangeMark = (id: string) => `[CONV:${id}]`;

/** Même numéro, quelle que soit l’écriture (international, national avec 0, espaces) : 8 derniers chiffres identiques. */
const same = (a: string, b: string) => a.replace(/\D/g, '').slice(-8) === b.replace(/\D/g, '').slice(-8);

export type WrittenOptoutResult =
  | { status: 'none' }
  | { status: 'applied'; phones: string[]; emailPref: boolean }
  | { status: 'unverified'; phones: string[]; emailPref: boolean }
  | { status: 'email_only'; emailPref: boolean };

/**
 * Applique « ne plus me contacter » reçu sur un canal sans numéro d’appelant (écrit, ou widget vocal). `p` : corps du
 * webhook de fin d’échange ; `outcome` : issue de l’échange. Ne lève pas : les erreurs sont journalisées.
 */
export async function applyWrittenOptout(p: Record<string, any>, outcome: string | null, deps: WrittenOptoutDeps = writtenOptoutDeps): Promise<WrittenOptoutResult> {
  const vars = obj(p.extracted_variables);
  const calls = toolCalls(p.transcript);
  const optoutCalls = calls.filter((c) => OPTOUT_TOOL.test(c.name));
  const stopOutcome = outcome === 'ne_plus_appeler' || outcome === 'desinscription';
  if (!stopOutcome && !optoutCalls.length) return { status: 'none' };
  const kind: 'ne_plus_appeler' | 'desinscription' = outcome === 'desinscription' ? 'desinscription' : 'ne_plus_appeler';
  const where = `${p.assistant_name || 'agent'} (${p.conversation_id ? 'conversation' : 'échange'} ${String(p.conversation_id ?? p.id ?? '—').slice(0, 80)})`;

  // Adresse donnée pendant l’échange : désinscription des e-mails commerciaux (jamais pour un simple « ne plus appeler »).
  let emailPref = false;
  const email = normEmail(vars.email ?? vars.copy_email);
  if (kind === 'desinscription' && isValidEmail(email)) {
    try {
      const [last] = await deps.prefDb.select<{ outcome: string | null }>('call_events', `select=outcome&kind=eq.${EMAIL_PREF_KIND}&external_id=eq.${emailKey(email)}&order=created_at.desc&limit=1`);
      if (last?.outcome !== 'essential_only') await saveEmailPref(email, 'essential_only', `désinscription demandée par écrit à ${where}`, deps.prefDb);
      emailPref = true;
    } catch (e: any) { console.error('[opposition écrite] préférence e-mail :', e?.message); }
  }

  // Numéros : variable, outil d’opposition, sinon demandes de rappel de l’échange. Un numéro écrit sans indicatif
  // (« 06 12 34 56 78 ») n’est jamais converti en supposant un pays : il ne compte que s’il correspond à une demande de
  // rappel de l’échange, dont le numéro international est alors retenu.
  const callbackCalls = calls.filter((c) => CALLBACK_TOOL.test(c.name) && !OPTOUT_TOOL.test(c.name));
  const callbackPhones = callbackCalls.map((c) => e164(phoneArg(c.args), c.args.cc)).filter((x): x is string => Boolean(x));
  const asked = [{ raw: vars.optout_phone, cc: undefined as unknown }, ...optoutCalls.map((c) => ({ raw: phoneArg(c.args), cc: c.args.cc }))]
    .map(({ raw, cc }) => ({ raw: String(raw ?? '').slice(0, 32).trim(), e: e164(raw, cc) }))
    .filter((a) => a.raw.replace(/\D/g, '').length >= 8 && !/[{}]/.test(a.raw));
  if (!asked.length && !callbackPhones.length) return emailPref ? { status: 'email_only', emailPref } : { status: 'none' };

  // Garde-fou : demande de rappel pour ce numéro pendant CET échange (transcription, sinon lignes callbacks marquées
  // [CONV:<identifiant de l’échange>]) ; les demandes d’autres échanges, même créées entre-temps, ne comptent jamais.
  const start = exchangeStart(p);
  const since = start ? new Date(Math.min(start.getTime(), deps.now().getTime() - 60_000)).toISOString() : null;
  const convId = exchangeId(p.conversation_id ?? p.id);
  let stored: string[] = [];
  if (since && convId && asked.length) {
    const mark = encodeURIComponent(exchangeMark(convId));
    const rows = await deps.select<{ phone: string }>('callbacks', `select=phone&created_at=gte.${encodeURIComponent(since)}&note=like.*${mark}*&order=created_at.desc&limit=20`).catch(() => []);
    stored = (Array.isArray(rows) ? rows : []).map((r) => String(r?.phone ?? '')).filter((x) => /^\+\d{8,15}$/.test(x));
  }
  const known = [...callbackPhones, ...stored];
  const verified = new Set<string>(asked.length ? [] : callbackPhones);
  const unverified = new Set<string>();
  for (const a of asked) {
    const match = known.find((k) => same(k, a.raw));
    if (match) verified.add(match); else unverified.add(a.e ?? a.raw);
  }

  for (const phone of Array.from(verified)) {
    try {
      // Opposition déjà appliquée pour ce numéro pendant cet échange (passage précédent) : rien à refaire.
      if (since) {
        const done = await deps.select('call_events', `select=id&kind=eq.${OPTOUT_KIND}&customer_phone=eq.${encodeURIComponent(phone)}&created_at=gte.${encodeURIComponent(since)}&limit=1`).catch(() => []);
        if (done.length) continue;
      }
      const r = await deps.register({ phone, outcome: kind, source: `fin d’échange écrit ${where}`, reason: typeof vars.summary === 'string' ? vars.summary : undefined });
      if (r.problems.length) console.error('[opposition écrite]', r.problems.join(' ; '));
    } catch (e: any) { console.error('[opposition écrite]', e?.message); }
  }
  // Une seule alerte par échange et par numéro (la conversation revient à chaque nouveau message).
  const conv = String(p.conversation_id ?? p.id ?? '').slice(0, 80);
  const toAlert: string[] = [];
  for (const phone of Array.from(unverified)) {
    const marker = `${conv}:${phone}`;
    const seen = conv ? await deps.select('call_events', `select=id&kind=eq.${UNVERIFIED_KIND}&external_id=eq.${encodeURIComponent(marker)}&limit=1`).catch(() => []) : [];
    if (seen.length) continue;
    toAlert.push(phone);
    if (conv) await deps.insert('call_events', { kind: UNVERIFIED_KIND, external_id: marker, customer_phone: phone, outcome: kind, summary: `Opposition écrite non appliquée (${where})` }).catch(() => undefined);
  }
  if (toAlert.length) {
    await deps.notify(`À vérifier : « ne plus me contacter » par écrit, non appliqué — ${toAlert.join(', ')}`, [
      `Échange : ${where}`, `Numéro(s) cité(s) : ${toAlert.join(', ')}`,
      'Aucune demande de rappel n’a été enregistrée pour ce numéro pendant cet échange : l’opposition n’est pas appliquée automatiquement (la personne pourrait citer le numéro de quelqu’un d’autre).',
      'Si la personne est bien le titulaire du numéro (demande de rappel plus ancienne, par exemple) : annuler ses rappels en attente (callbacks → cancelled) et ajouter le numéro à la liste de blocage Autocalls.',
      typeof vars.summary === 'string' && vars.summary ? `Résumé : ${vars.summary.slice(0, 500)}` : '',
    ].filter(Boolean).join('\n')).catch((e: any) => console.error('[opposition écrite] e-mail :', e?.message));
  }
  return verified.size ? { status: 'applied', phones: Array.from(verified), emailPref } : { status: 'unverified', phones: Array.from(unverified), emailPref };
}
