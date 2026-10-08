// Messages WhatsApp sortants : modèles validés par Meta, envoyés seulement aux personnes qui l’ont demandé
// (case WhatsApp du formulaire de rappel). Expéditeur Autocalls 521 (+33 7 45 46 04 46) pour toutes les langues,
// 529 (+972 3-382-7709) pour l’hébreu, avec repli sur le 521 tant que ses modèles ne sont pas approuvés.
import { TZ, validTz } from './server';
import { availableGender, callbackName } from './callbackPersona';

const API = 'https://app.autocalls.ai/api/user/whatsapp';
/** Expéditeur français : toutes les langues, et repli de l’hébreu. */
export const WHATSAPP_SENDER_ID = 521;
/** Expéditeur israélien (même numéro que la ligne 03-382-7709) : site en hébreu seulement, entrant et sortant. */
export const WHATSAPP_SENDER_ID_IL = 529;

/**
 * Expéditeurs essayés dans l’ordre pour un marché (le site d’où vient la demande, pas la langue d’une démo) :
 * le site israélien part d’abord du numéro israélien, puis du français (modèles hébreux déjà approuvés) si le
 * modèle n’y est pas approuvé ou si l’envoi y est clairement refusé.
 */
export const sendersFor = (market: string) => (market === 'he' ? [WHATSAPP_SENDER_ID_IL, WHATSAPP_SENDER_ID] : [WHATSAPP_SENDER_ID]);

/** Langue du site → langue du modèle WhatsApp (l’anglais australien utilise les modèles en_GB). */
const TEMPLATE_LANG: Record<string, string> = { fr: 'fr', 'en-gb': 'en_GB', 'en-au': 'en_GB', it: 'it', pl: 'pl', nl: 'nl', he: 'he' };
/** Code Intl pour écrire la date et l’heure dans la langue du message. */
const INTL: Record<string, string> = { fr: 'fr-FR', 'en-gb': 'en-GB', 'en-au': 'en-AU', it: 'it-IT', pl: 'pl-PL', nl: 'nl-NL', he: 'he-IL' };

/** Formule neutre quand le prénom saisi n’est pas un simple prénom (« Bonjour {{1}}, … »). */
const NEUTRAL: Record<string, string> = { fr: 'Madame, Monsieur', 'en-gb': 'there', 'en-au': 'there', it: 'gentile cliente', pl: 'Szanowni Państwo', nl: 'klant', he: 'לכם' };

/**
 * Prénom sûr pour un message envoyé depuis notre numéro : lettres, espaces, apostrophes et traits d’union
 * seulement (ni chiffres, ni liens, ni @), 30 caractères au plus ; sinon formule neutre.
 */
export function safeFirstName(raw: unknown, lang: string) {
  const first = String(raw ?? '').trim().split(/\s+/)[0] || '';
  return new RegExp("^\\p{L}[\\p{L}\\p{M}'’-]{0,29}$", 'u').test(first) ? first : NEUTRAL[lang] || NEUTRAL['en-gb'];
}

interface Template { id: number; name: string; language: string; status: string }
/** Modèles par expéditeur (Autocalls les liste expéditeur par expéditeur). */
const cache = new Map<number, { at: number; list: Template[]; failed?: boolean }>();
/** Durée de mémoire d’un échec de la liste des modèles : évite de relancer à chaque envoi une requête vouée à l’échec. */
const FAILED_TTL = 120_000;
/** Vide le cache des modèles (tests). */
export const clearTemplateCache = () => cache.clear();

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) throw new Error('AUTOCALLS_API_KEY non configurée');
  const res = await fetch(`${API}${path}`, {
    ...init, headers: { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) throw Object.assign(new Error(`WhatsApp ${path} ${res.status}`), { status: res.status });
  return res.json();
}

/** Modèles de l’expéditeur (mis en cache 10 minutes, par expéditeur). */
async function templates(sender: number) {
  const hit = cache.get(sender);
  if (hit && Date.now() - hit.at < (hit.failed ? FAILED_TTL : 600_000)) {
    if (hit.failed) throw new Error(`liste des modèles indisponible (expéditeur ${sender})`);
    return hit.list;
  }
  try {
    const body = await call<any>(`/templates?sender_id=${sender}`);
    const list: Template[] = Array.isArray(body) ? body : body?.data || body?.templates || [];
    cache.set(sender, { at: Date.now(), list });
    return list;
  } catch (e) {
    cache.set(sender, { at: Date.now(), list: [], failed: true });
    throw e;
  }
}

/**
 * Envoie le modèle `name` dans la langue `lang`, depuis le premier expéditeur du marché où il est approuvé
 * (site israélien : 529 puis 521 ; autres sites : 521). On passe à l’expéditeur suivant seulement quand rien n’a pu
 * partir : liste des modèles indisponible, modèle absent ou non approuvé, ou envoi refusé net (4xx). Une erreur 5xx,
 * un délai dépassé ou une réponse illisible après l’envoi ne déclenchent pas de repli : le message est peut-être parti,
 * et un second envoi depuis l’autre numéro ferait doublon.
 */
export async function sendTemplate(name: string, lang: string, phone: string, variables: Record<string, string>, opts: { market?: string } = {}) {
  const language = TEMPLATE_LANG[lang];
  if (!language) throw new Error(`langue WhatsApp inconnue : ${lang}`);
  const senders = sendersFor(opts.market ?? lang);
  for (let i = 0; i < senders.length; i++) {
    const sender = senders[i], last = i === senders.length - 1;
    let tpl: Template | undefined;
    try {
      tpl = (await templates(sender)).find((t) => t.name === name && t.language === language && String(t.status).toLowerCase() === 'approved');
      if (!tpl) throw new Error(`modèle ${name}/${language} non approuvé (expéditeur ${sender})`);
    } catch (e: any) {
      if (last) throw e;
      console.warn(`[whatsapp] expéditeur ${sender} sans modèle ${name}/${language}, repli sur ${senders[i + 1]} : ${e?.message || e}`);
      continue;
    }
    try {
      return await call('/send', {
        method: 'POST',
        body: JSON.stringify({ sender_id: sender, template_id: tpl.id, recipient_phone: phone, recipient_name: variables[1], variables }),
      });
    } catch (e: any) {
      const refused = typeof e?.status === 'number' && e.status >= 400 && e.status < 500;
      if (last || !refused) throw e;
      console.warn(`[whatsapp] envoi refusé par l’expéditeur ${sender} (${e.status}), repli sur ${senders[i + 1]}`);
    }
  }
  throw new Error(`aucun expéditeur WhatsApp pour ${lang}`);
}

/**
 * Confirmation d’une demande de rappel faite sur le site : « {{2}}, de l’équipe, vous appellera le {{3}} à {{4}} ».
 * Date et heure écrites dans la langue du site et le fuseau du visiteur. {{2}} = prénom de la persona qui rappelle
 * (`advisor` calculé par la route, sinon d’après la langue, le type et la voix : src/lib/callbackPersona.ts).
 */
export function sendCallbackConfirmation(opts: { lang: string; market?: string; phone: string; name: string; callAt: Date; tz?: unknown; kind: 'commercial' | 'support'; voice?: 'male'; advisor?: string }) {
  const { lang } = opts;
  const zone = typeof opts.tz === 'string' && validTz(opts.tz) ? opts.tz : TZ[lang] || TZ.fr;
  const intl = INTL[lang] || 'fr-FR';
  const first = safeFirstName(opts.name, lang);
  const advisor = opts.advisor || callbackName(lang, opts.kind, availableGender(lang, opts.kind, opts.voice === 'male' ? 'male' : 'female'));
  // En hébreu, le modèle dit déjà « ביום » : pas de jour de la semaine, pour éviter « ביום יום שלישי ».
  const date = new Intl.DateTimeFormat(intl, { timeZone: zone, ...(lang === 'he' ? {} : { weekday: 'long' }), day: 'numeric', month: 'long' }).format(opts.callAt);
  const time = new Intl.DateTimeFormat(intl, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(opts.callAt);
  return sendTemplate('pia_callback_confirmed', lang, opts.phone, { 1: first, 2: advisor, 3: date, 4: time }, { market: opts.market });
}
