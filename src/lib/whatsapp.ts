// Messages WhatsApp sortants (expéditeur Autocalls 521, +33 7 45 46 04 46) : modèles validés par Meta,
// envoyés seulement aux personnes qui l’ont demandé (case WhatsApp du formulaire de rappel).
import { TZ, validTz } from './server';
import { VOICES } from '@/data/personas';
import type { Locale } from '@/i18n/locales';

const API = 'https://app.autocalls.ai/api/user/whatsapp';
export const WHATSAPP_SENDER_ID = 521;

/** Langue du site → langue du modèle WhatsApp (l’anglais australien utilise les modèles en_GB). */
const TEMPLATE_LANG: Record<string, string> = { fr: 'fr', 'en-gb': 'en_GB', 'en-au': 'en_GB', it: 'it', pl: 'pl', nl: 'nl', he: 'he' };
/** Code Intl pour écrire la date et l’heure dans la langue du message. */
const INTL: Record<string, string> = { fr: 'fr-FR', 'en-gb': 'en-GB', 'en-au': 'en-AU', it: 'it-IT', pl: 'pl-PL', nl: 'nl-NL', he: 'he-IL' };
/** Conseillère du rappel support dans chaque langue (mêmes prénoms que l’agent WhatsApp et l’espace client). */
const SUPPORT_NAME: Record<string, string> = { fr: 'Lucie', 'en-gb': 'Katie', 'en-au': 'Charlotte', it: 'Manuela', pl: 'Lena', nl: 'Emma', he: 'נועה' };

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
let cache: { at: number; list: Template[] } | null = null;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) throw new Error('AUTOCALLS_API_KEY non configurée');
  const res = await fetch(`${API}${path}`, {
    ...init, headers: { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`WhatsApp ${path} ${res.status}`);
  return res.json();
}

/** Modèles approuvés de l’expéditeur (mis en cache 10 minutes). */
async function templates() {
  if (cache && Date.now() - cache.at < 600_000) return cache.list;
  const body = await call<any>(`/templates?sender_id=${WHATSAPP_SENDER_ID}`);
  const list: Template[] = Array.isArray(body) ? body : body?.data || body?.templates || [];
  cache = { at: Date.now(), list };
  return list;
}

/** Envoie le modèle `name` dans la langue du site ; erreur si le modèle n’est pas (encore) approuvé. */
export async function sendTemplate(name: string, lang: string, phone: string, variables: Record<string, string>) {
  const language = TEMPLATE_LANG[lang];
  if (!language) throw new Error(`langue WhatsApp inconnue : ${lang}`);
  const tpl = (await templates()).find((t) => t.name === name && t.language === language && String(t.status).toLowerCase() === 'approved');
  if (!tpl) throw new Error(`modèle ${name}/${language} non approuvé`);
  return call('/send', {
    method: 'POST',
    body: JSON.stringify({ sender_id: WHATSAPP_SENDER_ID, template_id: tpl.id, recipient_phone: phone, recipient_name: variables[1], variables }),
  });
}

/**
 * Confirmation d’une demande de rappel faite sur le site : « {{2}}, de l’équipe, vous appellera le {{3}} à {{4}} ».
 * Date et heure écrites dans la langue du site et le fuseau du visiteur.
 */
export function sendCallbackConfirmation(opts: { lang: string; phone: string; name: string; callAt: Date; tz?: unknown; kind: 'commercial' | 'support'; voice?: 'male' }) {
  const { lang } = opts;
  const zone = typeof opts.tz === 'string' && validTz(opts.tz) ? opts.tz : TZ[lang] || TZ.fr;
  const intl = INTL[lang] || 'fr-FR';
  const first = safeFirstName(opts.name, lang);
  const voices = VOICES[(lang in VOICES ? lang : 'fr') as Locale];
  const advisor = opts.kind === 'support' ? SUPPORT_NAME[lang] || 'Lucie' : voices[opts.voice === 'male' ? 'male' : 'female'].name;
  // En hébreu, le modèle dit déjà « ביום » : pas de jour de la semaine, pour éviter « ביום יום שלישי ».
  const date = new Intl.DateTimeFormat(intl, { timeZone: zone, ...(lang === 'he' ? {} : { weekday: 'long' }), day: 'numeric', month: 'long' }).format(opts.callAt);
  const time = new Intl.DateTimeFormat(intl, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(opts.callAt);
  return sendTemplate('pia_callback_confirmed', lang, opts.phone, { 1: first, 2: advisor, 3: date, 4: time });
}
