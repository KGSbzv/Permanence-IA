// Copie de l’échange envoyée par email à la personne qui l’a demandée à l’assistant IA (widget du site, écrit ou
// vocal, WhatsApp, Messenger, espace client, appel). Appelée par le webhook de fin d’échange
// (src/pages/api/webhooks/autocalls.ts) ; voir docs/copie-conversation.md.
// - Déclencheur : variable post-appel `copy_email`, que l’agent ne remplit que si la personne a donné ET confirmé
//   son adresse et n’a pas refusé la copie. Absente ou invalide : rien n’est envoyé. Une issue de refus
//   (STOP_OUTCOMES) bloque tout envoi ; copie demandée explicitement : le registre d’opposition téléphonique n’est
//   consulté que depuis le début de l’échange (opposition reçue entre deux passages WhatsApp ou Messenger, ou par
//   l’outil d’opposition pendant l’échange) : rien ne part alors.
// - Contenu : seulement les paroles et messages écrits, dans l’ordre (jamais les appels d’outils, leurs résultats ni
//   le texte interne), étiquetés avec le prénom de la persona et « Vous » dans la langue de la personne ; date dans le
//   fuseau du marché ; version texte ; mention « si vous n’êtes pas à l’origine de cette demande » après la
//   transcription ; pied de page légal commun (sendMail, catégorie essential).
// - Liens : dans les messages de l’agent, toute adresse ou tout domaine hors permanenceia.com est remplacé par
//   « [lien retiré] » ; dans ceux de la personne, ils sont désactivés (exemple[.]com, hxxps://) ; caractères de
//   contrôle bidirectionnel retirés partout. Aucun texte n’est transformé en lien.
// - Une seule fois par échange : envoi tracé dans call_events (kind 'email', outcome 'copie_conversation',
//   external_id 'copy-<call|conversation>-<id>', status en_cours → envoyee | echec | doublon | plafond). WhatsApp et
//   Messenger renvoient la même conversation après chaque nouveau message : la copie part au premier passage avec
//   copy_email.
// - Plafonds sur 24 h : 5 copies par adresse, 100 pour tout le site. Vérifiés avant la réservation, puis après (les
//   réservations les plus anciennes passent : des webhooks simultanés ne peuvent pas les dépasser). Au-delà, rien ne
//   part et l’équipe est prévenue.
// Textes : src/i18n/content/<langue>/ui/email.ts (copyMail). Accès réseau passés en paramètre (faux en test).
import { createHash } from 'crypto';
import type { Gender } from '@/data/personas';
import { LANG_OF, isRtl, type Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';
import { findRequester, requesterName } from './callbackPersona';
import { CALL_TZ } from './callHours';
import { normalizeAgentLang } from './contacts';
import { emailText } from './emailFooter';
import { emailKey, isValidEmail, normEmail } from './emailPrefs';
import { OPTOUT_KIND, STOP_OUTCOMES } from './optout';
import { dbInsert, dbSelect, dbUpdate, langFromPhone, sendMail, toE164, type MailOptions } from './server';

export const COPY_KIND = 'email';
export const COPY_OUTCOME = 'copie_conversation';
/** Au-delà, la copie s’arrête avec une note (échange anormalement long). */
export const MAX_TURNS = 400;
/** Longueur maximale d’un message reproduit ; au-delà, il est raccourci avec une mention. */
export const MAX_TURN_CHARS = 8000;
/** Au plus 5 copies par adresse sur 24 h : l’assistant ne doit pas servir à remplir la boîte d’un tiers. */
export const MAX_PER_ADDRESS_PER_DAY = 5;
/** Au plus 100 copies sur 24 h pour tout le site (abus du widget, boucle d’un agent) : au-delà, l’équipe est prévenue. */
export const MAX_COPIES_PER_DAY = 100;
/** Seul domaine dont les liens restent tels quels dans les messages de l’agent (sous-domaines compris). */
export const OUR_DOMAIN = 'permanenceia.com';

export interface Turn { from: 'agent' | 'person'; text: string }

const AGENT_ROLES = ['assistant', 'bot', 'ai', 'agent'];
const PERSON_ROLES = ['user', 'human', 'customer'];
// Entrées d’appel (post_call) : seules « transcript » sont des paroles. Les conversations n’ont pas de type.
const SPOKEN_TYPES = ['transcript', 'message', 'text'];

const obj = (v: unknown): Record<string, any> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, any> : {});

/** Texte d’un message : chaîne, ou parties { type: 'text', text } ; tout le reste (outils, images) est ignoré. */
function textOf(v: unknown): string {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map((part) => (part && part.type === 'text' && typeof part.text === 'string' ? part.text : '')).filter(Boolean).join('\n');
  return '';
}

/**
 * Tours de parole de la transcription, dans l’ordre : conversation ({ role: assistant | user, content }) ou appel
 * ({ type: 'transcript', sender: bot | human, text }). Appels de fonction, résultats d’outils, messages système et
 * entrées vides ne sont jamais repris (un message d’assistant ne garde que son texte, jamais ses tool_calls).
 */
export function extractTurns(transcript: unknown): Turn[] {
  if (!Array.isArray(transcript)) return [];
  const turns: Turn[] = [];
  for (const e of transcript) {
    const m = obj(e);
    if (m.type != null && !SPOKEN_TYPES.includes(String(m.type).toLowerCase())) continue;
    const who = String(m.role ?? m.sender ?? '').toLowerCase();
    const from = AGENT_ROLES.includes(who) ? 'agent' : PERSON_ROLES.includes(who) ? 'person' : null;
    if (!from) continue;
    const text = textOf(m.content ?? m.text).replace(/\r\n?/g, '\n').trim();
    if (text) turns.push({ from, text });
  }
  return turns;
}

/* ---------- Langue ---------- */

// Mots fréquents propres à chaque langue (les mots partagés entre deux langues du site sont exclus : je, non, ma…).
const WORDS: Record<'fr' | 'en' | 'it' | 'nl' | 'pl', string[]> = {
  fr: ['vous', 'est', 'les', 'des', 'une', 'pour', 'avec', 'pas', 'bonjour', 'merci', 'oui', 'mon', 'mes', 'nous', 'sur', 'dans', "c'est", "j'ai", 'votre', 'vos', 'être', 'mais', 'très', 'ça', 'aussi', 'du', 'au', 'suis', 'voudrais'],
  en: ['the', 'you', 'are', 'and', 'for', 'with', 'hello', 'hi', 'thanks', 'thank', 'yes', 'what', 'how', 'can', 'please', 'have', "i'm", "it's", 'your', 'this', 'that', 'would', 'like', 'need', 'about', 'want'],
  it: ['che', 'sono', 'per', 'una', 'buongiorno', 'grazie', 'sì', 'ciao', 'della', 'vorrei', 'anche', 'questo', 'mio', 'ho', 'è', 'sei', 'gli', 'di', 'salve', 'prego', 'buonasera', 'posso'],
  nl: ['het', 'een', 'ik', 'niet', 'hallo', 'dank', 'bedankt', 'voor', 'mijn', 'wij', 'zijn', 'graag', 'wat', 'hoe', 'jullie', 'van', 'goedemorgen', 'alstublieft', 'heb', 'wil', 'ook', 'maar', 'kunt', 'hebben'],
  pl: ['nie', 'jest', 'się', 'dzień', 'dobry', 'dziękuję', 'proszę', 'czy', 'tak', 'jak', 'mam', 'że', 'ale', 'chcę', 'co', 'w', 'z', 'na', 'jestem', 'chciałbym', 'chciałabym', 'dobrze', 'mój', 'moja'],
};
const WORD_SETS = Object.entries(WORDS).map(([lang, list]) => [lang, new Set(list)] as const);

/** Langue d’un texte : hébreu (alphabet), polonais (lettres propres), sinon mots fréquents ; null si incertain. */
export function guessLang(text: string): 'fr' | 'en' | 'it' | 'nl' | 'pl' | 'he' | null {
  const hebrew = (text.match(/[֐-׿]/g) || []).length;
  const latin = (text.match(/[a-z]/gi) || []).length;
  if (hebrew >= 3 && hebrew >= latin) return 'he';
  if ((text.match(/[ąćęłńśźż]/gi) || []).length >= 2) return 'pl';
  const words = text.toLowerCase().replace(/[’`]/g, "'").split(/[^a-zà-öø-ÿąćęłńśźż']+/).filter(Boolean);
  const scores = WORD_SETS.map(([lang, set]) => [lang, words.filter((w) => set.has(w)).length] as const).sort((a, b) => b[1] - a[1]);
  const [[best, n], [, second]] = scores;
  return n >= 2 && n > second ? best as 'fr' | 'en' | 'it' | 'nl' | 'pl' : null;
}

export interface CopyContext {
  locale: Locale;
  /** Prénom de la persona dans la langue de l’email ; null si l’agent n’est pas identifié. */
  agent: string | null;
  gender: Gender;
  /** D’où vient la langue : agent monolingue, variables de l’échange, transcription, indicatif, défaut. */
  source: 'agent' | 'variables' | 'transcript' | 'phone' | 'default';
}

/**
 * Langue et prénom de l’agent. Agent d’une seule langue (REQUESTERS, src/lib/callbackPersona.ts) : sa langue.
 * Agents multilingues (espace client, WhatsApp, Messenger) ou inconnus : langue déclarée dans les variables
 * (langue, language, lang, locale), puis langue des messages de la personne (puis de tout l’échange), puis indicatif
 * du numéro, sinon anglais (Royaume-Uni), comme pour toute langue non proposée par le site. Prénom : celui de la
 * persona dans cette langue (persona écrite de la langue pour les agents multilingues : Lucie, Katie, נועה…).
 */
export function copyContext(p: Record<string, any>, turns: Turn[]): CopyContext {
  const r = findRequester(p.assistant_id);
  const phone = typeof p.customer_phone === 'string' && p.customer_phone.startsWith('+') ? p.customer_phone : '';
  const named = (locale: Locale, source: CopyContext['source']): CopyContext =>
    ({ locale, agent: r ? requesterName(r, locale) : null, gender: r?.gender ?? 'female', source });
  if (r && r.lang !== 'multi') return named(r.lang, 'agent');
  const vars = obj(p.extracted_variables);
  const input = obj(p.input_variables);
  const declared = [vars.langue, vars.language, vars.lang, vars.locale, input.langue, input.language]
    .map((v) => normalizeAgentLang(typeof v === 'string' ? v : '', phone)).find(Boolean);
  if (declared) return named(declared, 'variables');
  const said = (who?: Turn['from']) => guessLang(turns.filter((t) => !who || t.from === who).map((t) => t.text).join('\n'));
  const lang = said('person') ?? said();
  if (lang) return named(lang === 'en' ? (/^\+(?:61|64)/.test(phone) ? 'en-au' : 'en-gb') : lang, 'transcript');
  if (phone) return named(langFromPhone(phone) as Locale, 'phone');
  return named('en-gb', 'default');
}

/* ---------- Liens ---------- */

// Contrôles bidirectionnels (U+202A–U+202E, U+2066–U+2069) : ils peuvent retourner l’affichage d’une adresse
// (« moc.live » lu « evil.com ») ; retirés de tous les messages, ainsi que les caractères invisibles (espace
// sans chasse, trait d’union conditionnel…) qui cachent un domaine. Le liant sans chasse (U+200D) n’est gardé
// que devant un pictogramme : il compose les émojis (famille, drapeaux…). Pictogrammes en plages explicites (blocs
// de symboles, et U+1F000–U+1FFFF en paires de substitution) : ni drapeau u ni \p{…}, refusés par la cible es5
// de tsconfig.json. Ces plages contiennent tous les pictogrammes et aucune lettre, aucun point ni caractère ASCII.
const BIDI = /[\u00AD\u200B\u200C\u2060\uFEFF\u202A-\u202E\u2066-\u2069]|\u200D(?![\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u21FF\u2300-\u23FF\u24C2\u25A0-\u27BF\u2900-\u297F\u2B00-\u2BFF\u3030\u303D\u3297\u3299]|[\uD83C-\uD83F][\uDC00-\uDFFF])/g;
// Point d’un nom de domaine, y compris les points idéographiques et pleine chasse que les navigateurs acceptent.
const DOTS = '.\\u3002\\uFF0E\\uFF61';
// Lettres d’un nom de domaine : latines (accentuées comprises), grecques et cyrilliques (homographes), chiffres.
// Une étiquette en hébreu (au moins une lettre hébraïque : une étiquette de chiffres n’a qu’une lecture) est prise
// entière, sans tiret : « ב-exemple.com » garde son préfixe « ב- ».
const CHARS = '\\p{Script=Latin}\\p{Script=Greek}\\p{Script=Cyrillic}\\p{N}';
const LABEL = `(?:[${CHARS}](?:[${CHARS}-]{0,61}[${CHARS}])?|(?=\\p{N}*\\p{Script=Hebrew})[\\p{Script=Hebrew}\\p{N}]{1,63})`;
// Extension en lettres latines (ou xn--) : « p.ex » ou « Merci.Bonne » sont aussi pris, par prudence.
const HOST = `(?:${LABEL}[${DOTS}])+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})`;
const TAIL = '[^\\s<>"«»“”]*';
/**
 * Adresse avec protocole (https://, hxxp://, ftp://…), adresse email, ou domaine nu (port et chemin compris).
 * Temps linéaire, même sur un message hostile : partie locale d’une adresse email de 64 caractères au plus (norme
 * SMTP ; au-delà, son domaine est pris comme domaine nu) ; un domaine nu ne part pas d’une étiquette précédée d’une
 * autre étiquette et d’un point (« b » dans « a.b.c ») : la recherche partie de « a » l’a déjà couverte. Une
 * étiquette précédée de « : » (port d’un lien précédent : « a.com:80.b.com ») ne compte pas : « b.com » est essayé.
 */
const LINK = new RegExp(
  `[a-z][a-z0-9+.-]{0,31}:\\/\\/${TAIL}`
  + `|(?<![${CHARS}._%+])[${CHARS}._%+][${CHARS}._%+-]{0,63}@${HOST}(?![${CHARS}-])`
  + `|(?<![${CHARS}])(?<!(?<![${CHARS}:])${LABEL}[${DOTS}])${HOST}(?![${CHARS}-])(?::\\d{1,5})?(?:[/?#]${TAIL})?`,
  'giu');
const SCHEME = /^([a-z][a-z0-9+.-]*):\/\//i;
// Ponctuation collée à la fin d’un lien (« voir exemple.com. ») : laissée hors du lien. Prise depuis le début de
// la dernière suite de ponctuation (jamais depuis le milieu d’une suite : temps linéaire).
const PUNCT = '.,;:!?…)\\]}\'’”»';
const TRAILING = new RegExp(`(?<![${PUNCT}])[${PUNCT}]+$`);
const ANY_DOT = new RegExp(`(?<!\\[)[${DOTS}](?!\\])`, 'gu');

/** Lien vers permanenceia.com ou un sous-domaine (https ou http, sans identifiant avant l’hôte). */
function isOurs(link: string) {
  const at = link.lastIndexOf('@');
  const email = !SCHEME.test(link) && at > 0;
  try {
    const u = new URL(email ? `https://${link.slice(at + 1)}` : SCHEME.test(link) ? link : `https://${link}`);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) return false;
    const host = u.hostname.replace(/\.$/, '');
    // Une autre adresse cachée dans le chemin (permanenceia.com/https://exemple.com) : refusée aussi.
    return (host === OUR_DOMAIN || host.endsWith(`.${OUR_DOMAIN}`)) && !/:\/\/|@/.test(u.pathname + u.search + u.hash);
  } catch { return false; }
}

/** Lien désactivé partout, chemin compris : http(s):// → hxxp(s)://, autre protocole « ftp[:]// », points en « [.] ». */
const defang = (link: string) => link
  .replace(/h(?:tt|xx)p(s?):\/\//gi, (_m, s: string) => `hxxp${s}://`)
  .replace(/(?<!hxxps?):\/\//gi, '[:]//')
  .replace(ANY_DOT, '[.]');

/**
 * Texte d’un message prêt à recopier : contrôles bidirectionnels retirés ; dans un message de l’agent, tout lien,
 * domaine ou adresse email hors permanenceia.com remplacé par `removed` (une réponse détournée ne doit pas porter
 * de lien au nom de la marque) ; dans un message de la personne, liens et domaines désactivés (exemple[.]com) pour
 * qu’aucune messagerie n’en fasse un lien (l’adresse a pu être donnée par un tiers).
 */
export function safeTurnText(turn: Turn, removed: string) {
  return turn.text.replace(BIDI, '').replace(LINK, (raw) => {
    const end = TRAILING.exec(raw);
    const link = end ? raw.slice(0, end.index) : raw;
    if (!link) return raw;
    const kept = turn.from === 'agent' ? (isOurs(link) ? link : removed) : defang(link);
    return kept + (end ? end[0] : '');
  });
}

/* ---------- Email ---------- */

const h = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const firstDate = (values: unknown[]) => {
  for (const v of values) {
    const t = Date.parse(String(v ?? ''));
    if (Number.isFinite(t)) return new Date(t);
  }
  return null;
};
/** Début de l’échange (created_at, started_at) ; null s’il n’est pas donné. */
export const exchangeStart = (p: Record<string, any>) => firstDate([p.created_at, p.started_at]);
/** Date de l’échange (début, sinon fin) ; à défaut, maintenant. */
export function exchangeAt(p: Record<string, any>, now = Date.now()) {
  return exchangeStart(p) ?? firstDate([p.ended_at, p.finished_at]) ?? new Date(now);
}

/** Jour (avec le jour de la semaine, sauf en polonais : « 9 października » s’accorde sans lui) et heure, fuseau du marché. */
function dayAndTime(at: Date, locale: Locale) {
  const timeZone = CALL_TZ[locale];
  const tag = MARKETS[locale].numberLocale;
  const day = new Intl.DateTimeFormat(tag, { timeZone, ...(locale === 'pl' ? {} : { weekday: 'long' as const }), day: 'numeric', month: 'long', year: 'numeric' }).format(at);
  const time = new Intl.DateTimeFormat(tag, { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(at);
  return { day, time };
}

/** Email de la copie (texte et HTML échappé, de droite à gauche en hébreu) ; le pied de page est ajouté par sendMail. */
export function buildCopyMail(o: { to: string; ctx: CopyContext; turns: Turn[]; at: Date }): MailOptions {
  const { locale, agent, gender } = o.ctx;
  const t = emailText(locale).copyMail;
  const brand = MARKETS[locale].brand;
  const rtl = isRtl(locale);
  const { day, time } = dayAndTime(o.at, locale);
  const intro = t.intro(agent, gender, brand, day, time);
  const colon = LANG_OF[locale] === 'fr' ? ' :' : ':';
  const lines = o.turns.slice(0, MAX_TURNS).map((turn) => {
    // Coupe avant le traitement des liens : tout le texte reproduit est traité, et le traitement reste borné.
    const long = turn.text.length > MAX_TURN_CHARS;
    const clean = safeTurnText(long ? { ...turn, text: turn.text.slice(0, MAX_TURN_CHARS) } : turn, t.linkRemoved);
    return {
      agent: turn.from === 'agent',
      label: turn.from === 'agent' ? agent ?? t.assistant : t.you,
      text: long ? `${clean}… ${t.cut}` : clean,
    };
  });
  const note = o.turns.length > MAX_TURNS ? t.truncated(MAX_TURNS, o.turns.length) : '';
  // Après la transcription : l’adresse a pu être donnée par quelqu’un d’autre que son titulaire.
  const text = [intro, ...lines.map((l) => `${l.label}${colon} ${l.text}`), note, t.notYou].filter(Boolean).join('\n\n');
  // Chaque message garde son propre sens d’écriture (dir="auto") : un message en anglais dans un email en hébreu.
  const html = `<div dir="${rtl ? 'rtl' : 'ltr'}" lang="${locale}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;text-align:${rtl ? 'right' : 'left'}">`
    + `<p style="margin:0 0 20px">${h(intro)}</p>`
    + lines.map((l) => `<div style="margin:0 0 12px;padding:10px 14px;border-radius:8px;background:${l.agent ? '#f3f4f6' : '#eef6ff'}">`
      + `<div style="font-weight:bold;margin:0 0 4px">${h(l.label)}</div><div dir="auto">${h(l.text).replace(/\n/g, '<br>')}</div></div>`).join('')
    + (note ? `<p style="margin:16px 0 0;color:#6b7280;font-size:13px">${h(note)}</p>` : '')
    + `<p style="margin:16px 0 0;color:#6b7280;font-size:13px">${h(t.notYou)}</p>`
    + '</div>';
  return { to: o.to, category: 'essential', locale, fromName: brand, subject: t.subject(agent, brand), text, html };
}

/* ---------- Envoi ---------- */

export interface CopyDeps {
  select: <T>(table: string, query: string) => Promise<T[]>;
  insert: (table: string, row: Record<string, unknown>, returnId?: boolean) => Promise<string | undefined>;
  update: (table: string, query: string, patch: Record<string, unknown>) => Promise<void>;
  sendMail: (m: MailOptions) => Promise<boolean>;
  now: () => number;
}
/** Accès réels (Supabase, Zoho) ; les tests remplacent sendMail. */
export const copyDeps: CopyDeps = { select: dbSelect, insert: dbInsert, update: dbUpdate, sendMail, now: () => Date.now() };

export interface CopyResult {
  sent: boolean;
  reason: string;
  alert?: boolean;
  /** Plafond atteint : par adresse, ou pour tout le site (alerte distincte côté webhook). */
  limit?: 'adresse' | 'global';
}

/**
 * Adresses email masquées avant d’enregistrer ou de journaliser une erreur d’envoi (réponse SMTP…). Une adresse
 * n’est cherchée qu’au début d’un mot (jamais depuis son milieu) : temps linéaire, même sur un long texte sans « @ ».
 */
export const maskEmails = (s: string) => s.replace(/(?<![^\s<>@])[^\s<>@]+@[^\s<>@]+/g, '[adresse]');

/** Forme de l’adresse pour le plafond : sans « +étiquette » ni point final, points ignorés chez Gmail (même boîte). */
function capAddress(email: string) {
  const at = email.lastIndexOf('@');
  let local = email.slice(0, at).replace(/\+.*$/, '');
  let domain = email.slice(at + 1).replace(/\.$/, '');
  if (domain === 'googlemail.com') domain = 'gmail.com';
  if (domain === 'gmail.com') local = local.replace(/\./g, '');
  return `${local}@${domain}`;
}

/** Identifiant de l’adresse en base (jamais l’adresse en clair) : HMAC du site, à défaut empreinte SHA-256. */
function addressKey(email: string) {
  try { return emailKey(email); } catch { return createHash('sha256').update(`permanenceia|copie|${email}`).digest('hex').slice(0, 32); }
}

// Copies en cours ou envoyées (un échec, un doublon ou un plafond ne compte pas : une copie en échec repart au
// passage suivant).
const LIVE = 'status=in.(en_cours,envoyee)';

/**
 * Envoie la copie si l’échange la demande. null : aucune copie demandée (cas courant, rien à journaliser).
 * Lève une erreur si la base ou l’envoi échoue (le webhook la journalise et prévient l’équipe, réponse 200 gardée).
 * Dans le doute, rien ne part : sans trace possible en base, pas d’envoi (jamais deux copies du même échange).
 */
export async function sendConversationCopy(p: Record<string, any>, o: { kind: 'call' | 'conversation'; externalId: string }, deps: CopyDeps = copyDeps): Promise<CopyResult | null> {
  const vars = obj(p.extracted_variables);
  const raw = vars.copy_email;
  if (raw == null || typeof raw === 'object' || String(raw).trim() === '') return null;
  // Interrupteur d’urgence (App Hosting) : CONVERSATION_COPY=0 coupe tous les envois.
  if (String(process.env.CONVERSATION_COPY ?? '').trim() === '0') return { sent: false, reason: 'copie coupée (CONVERSATION_COPY=0)' };
  const to = normEmail(raw);
  // Variable non substituée ({{copy_email}}), « non », « jean at gmail » : pas une adresse.
  if (!isValidEmail(to) || /[{}:]/.test(to)) return { sent: false, reason: 'copy_email n’est pas une adresse email valide' };
  const outcome = String(vars.outcome ?? vars.request_type ?? '');
  if ((STOP_OUTCOMES as readonly string[]).includes(outcome)) return { sent: false, reason: `issue « ${outcome} » (refus d’être contacté) : aucune copie` };
  if (!o.externalId) return { sent: false, reason: 'échange sans identifiant : copie impossible à dédoublonner, non envoyée', alert: true };
  const turns = extractTurns(p.transcript);
  if (!turns.length) return { sent: false, reason: 'copie demandée mais transcription vide : non envoyée', alert: true };

  // Opposition enregistrée depuis le début de l’échange pour ce numéro (issue de refus à un passage précédent de
  // WhatsApp ou Messenger, outil d’opposition pendant l’échange) : rien ne part. Début absent du webhook : 24 h.
  if (p.customer_phone != null && String(p.customer_phone).trim()) {
    const given = String(p.customer_phone);
    // Même forme que l’opposition enregistrée par le webhook (E.164).
    const phone = toE164(given, langFromPhone(given)) || given;
    const start = (exchangeStart(p) ?? new Date(deps.now() - 86_400_000)).toISOString();
    const optouts = await deps.select('call_events', `select=id&kind=eq.${OPTOUT_KIND}&customer_phone=eq.${encodeURIComponent(phone)}&created_at=gte.${start}&limit=1`);
    if (optouts.length) return { sent: false, reason: 'opposition enregistrée pendant l’échange : aucune copie' };
  }

  const ext = `copy-${o.kind}-${o.externalId}`;
  const byExt = `kind=eq.${COPY_KIND}&external_id=eq.${encodeURIComponent(ext)}&${LIVE}`;
  if ((await deps.select('call_events', `select=id&${byExt}&limit=1`)).length) return { sent: false, reason: 'copie déjà envoyée pour cet échange' };
  // Plafond compté sur la forme normalisée (cap+1@, c.a.p@gmail.com…) ; la copie part à l’adresse telle que donnée.
  const toKey = addressKey(capAddress(to));
  const since = new Date(deps.now() - 86_400_000).toISOString();
  const copies = `kind=eq.${COPY_KIND}&outcome=eq.${COPY_OUTCOME}&${LIVE}&created_at=gte.${since}`;
  const toAddress = `${copies}&variables->>to_key=eq.${toKey}`;
  const PER_ADDRESS: CopyResult = { sent: false, reason: `plafond atteint (${MAX_PER_ADDRESS_PER_DAY} copies en 24 h vers cette adresse) : non envoyée`, alert: true, limit: 'adresse' };
  const GLOBAL: CopyResult = { sent: false, reason: `plafond quotidien atteint (${MAX_COPIES_PER_DAY} copies en 24 h pour tout le site) : non envoyée`, alert: true, limit: 'global' };
  if ((await deps.select('call_events', `select=id&${toAddress}&limit=${MAX_PER_ADDRESS_PER_DAY}`)).length >= MAX_PER_ADDRESS_PER_DAY) return PER_ADDRESS;
  if ((await deps.select('call_events', `select=id&${copies}&limit=${MAX_COPIES_PER_DAY}`)).length >= MAX_COPIES_PER_DAY) return GLOBAL;

  // Réservation avant l’envoi, puis arbitrage : deux webhooks simultanés du même échange réservent tous les deux,
  // la réservation la plus ancienne envoie, l’autre s’efface. Même règle pour les plafonds : seules les N plus
  // anciennes réservations encore valables des dernières 24 h (par adresse, puis pour tout le site) envoient.
  const ctx = copyContext(p, turns);
  const claimId = await deps.insert('call_events', {
    kind: COPY_KIND, external_id: ext, outcome: COPY_OUTCOME, status: 'en_cours',
    assistant_name: p.assistant_name ?? null, customer_phone: p.customer_phone ?? null,
    summary: `Copie de l’échange en cours d’envoi (${turns.length} messages, ${ctx.locale}).`,
    variables: { to_key: toKey, locale: ctx.locale, locale_source: ctx.source, turns: turns.length, assistant_uuid: p.assistant_id == null ? null : String(p.assistant_id) },
  }, true);
  // Sans identifiant de réservation, ni doublon ni plafond ne peuvent être vérifiés : dans le doute, rien ne part.
  if (!claimId) return { sent: false, reason: 'réservation sans identifiant : copie non envoyée', alert: true };
  const mark = (patch: Record<string, unknown>) => deps.update('call_events', `id=eq.${encodeURIComponent(claimId)}`, patch)
    .catch((e: Error) => console.error('[copie] suivi:', e.message));
  /** La réservation est-elle parmi les `limit` plus anciennes de ce filtre ? */
  const among = async (filter: string, limit: number) =>
    (await deps.select<{ id: string }>('call_events', `select=id&${filter}&order=created_at.asc,id.asc&limit=${limit}`)).some((r) => String(r.id) === claimId);
  try {
    const [first] = await deps.select<{ id: string }>('call_events', `select=id&${byExt}&order=created_at.asc,id.asc&limit=1`);
    if (first && String(first.id) !== claimId) {
      await mark({ status: 'doublon', summary: 'Copie déjà en cours d’envoi par un autre passage du webhook.' });
      return { sent: false, reason: 'copie déjà en cours d’envoi (webhook simultané)' };
    }
    if (!(await among(toAddress, MAX_PER_ADDRESS_PER_DAY))) {
      await mark({ status: 'plafond', summary: `Copie non envoyée : plafond de ${MAX_PER_ADDRESS_PER_DAY} copies en 24 h vers cette adresse atteint.` });
      return PER_ADDRESS;
    }
    if (!(await among(copies, MAX_COPIES_PER_DAY))) {
      await mark({ status: 'plafond', summary: `Copie non envoyée : plafond de ${MAX_COPIES_PER_DAY} copies en 24 h pour tout le site atteint.` });
      return GLOBAL;
    }
  } catch (e: any) {
    // Vérification impossible (base en panne) : la réservation ne doit pas bloquer le prochain passage.
    await mark({ status: 'echec', summary: `Copie non envoyée : vérification impossible (${maskEmails(String(e?.message ?? e)).slice(0, 200)}).` });
    throw e;
  }

  const mail = buildCopyMail({ to, ctx, turns, at: exchangeAt(p, deps.now()) });
  let ok: boolean;
  try { ok = await deps.sendMail(mail); } catch (e: any) {
    // La réponse SMTP peut citer l’adresse : jamais en clair dans call_events.
    await mark({ status: 'echec', summary: `Copie non envoyée : ${maskEmails(String(e?.message ?? e)).slice(0, 300)}` });
    throw e;
  }
  if (!ok) {
    await mark({ status: 'echec', summary: 'Copie non envoyée (email sauté par sendMail).' });
    return { sent: false, reason: 'email sauté par sendMail', alert: true };
  }
  const shown = Math.min(turns.length, MAX_TURNS);
  await mark({ status: 'envoyee', summary: `Copie de l’échange envoyée par email (${shown}${turns.length > MAX_TURNS ? ` sur ${turns.length}` : ''} messages, ${ctx.locale}).` });
  return { sent: true, reason: `copie envoyée (${ctx.locale}, ${shown} messages)` };
}
