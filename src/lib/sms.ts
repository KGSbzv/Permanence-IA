// SMS sortants depuis le numéro britannique Autocalls (+44 7367 090106, id 11791), compatible SMS.
// Seulement des messages de service liés à une demande de la personne (jamais de prospection).
import { whatsappLink } from '@/data/site';

const API = 'https://app.autocalls.ai/api/user/sms';
export const SMS_FROM_ID = 11791;

/**
 * « Nous avons essayé de vous rappeler » : court, sans lien raccourci, avec l’alternative WhatsApp du marché
 * (numéro israélien en hébreu, numéro français ailleurs).
 */
const MISSED: Record<string, (name: string, wa: string) => string> = {
  fr: (n, wa) => `Bonjour ${n}, ici Permanence IA : nous avons essayé de vous rappeler suite à votre demande. Nous réessayons plus tard. Vous pouvez aussi nous écrire sur WhatsApp : ${wa}`,
  'en-gb': (n, wa) => `Hello ${n}, it's PermanenceAI: we tried to call you back about your request and will try again later. You can also message us on WhatsApp: ${wa}`,
  'en-au': (n, wa) => `Hi ${n}, it's PermanenceAI: we tried to call you back about your request and will try again later. You can also message us on WhatsApp: ${wa}`,
  it: (n, wa) => `Buongiorno ${n}, sono PermanenceIA: abbiamo provato a richiamarLa per la Sua richiesta e riproveremo più tardi. Può anche scriverci su WhatsApp: ${wa}`,
  pl: (n, wa) => `Dzień dobry, ${n}! Tu PermanenceAI: próbowaliśmy oddzwonić w sprawie Państwa zgłoszenia i spróbujemy ponownie później. Można też napisać na WhatsApp: ${wa}`,
  nl: (n, wa) => `Beste ${n}, hier PermanenceAI: we hebben geprobeerd u terug te bellen over uw aanvraag en proberen het later opnieuw. U kunt ons ook een WhatsApp sturen: ${wa}`,
  he: (n, wa) => `שלום ${n}, כאן PermanenceAI: ניסינו לחזור אליכם בעקבות הפנייה שלכם וננסה שוב בהמשך. אפשר גם לכתוב לנו בוואטסאפ: ${wa}`,
};

export async function sendSms(to: string, body: string) {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) throw new Error('AUTOCALLS_API_KEY non configurée');
  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: SMS_FROM_ID, to, body: body.slice(0, 300) }),
  });
  if (!res.ok) throw new Error(`SMS ${res.status}`);
  return res.json();
}

/** SMS après un rappel sans réponse ; `firstName` doit déjà être filtré (safeFirstName). */
/** `market` : site d’origine ; le lien WhatsApp suit le site (israélien : 03-382-7709), le texte suit la langue. */
export const sendMissedCallSms = (lang: string, to: string, firstName: string, market = lang) => sendSms(to, (MISSED[lang] || MISSED['en-gb'])(firstName, whatsappLink(market)));
