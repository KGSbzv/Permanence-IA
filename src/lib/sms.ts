// SMS sortants depuis le numéro britannique Autocalls (+44 7367 090106, id 11791), compatible SMS.
// Seulement des messages de service liés à une demande de la personne (jamais de prospection).

const API = 'https://app.autocalls.ai/api/user/sms';
export const SMS_FROM_ID = 11791;

/** « Nous avons essayé de vous rappeler » : court, sans lien raccourci, avec l’alternative WhatsApp. */
const MISSED: Record<string, (name: string) => string> = {
  fr: (n) => `Bonjour ${n}, ici Permanence IA : nous avons essayé de vous rappeler suite à votre demande. Nous réessayons plus tard. Vous pouvez aussi nous écrire sur WhatsApp : https://wa.me/33745460446`,
  'en-gb': (n) => `Hello ${n}, it's PermanenceAI: we tried to call you back about your request and will try again later. You can also message us on WhatsApp: https://wa.me/33745460446`,
  'en-au': (n) => `Hi ${n}, it's PermanenceAI: we tried to call you back about your request and will try again later. You can also message us on WhatsApp: https://wa.me/33745460446`,
  it: (n) => `Buongiorno ${n}, sono PermanenceIA: abbiamo provato a richiamarLa per la Sua richiesta e riproveremo più tardi. Può anche scriverci su WhatsApp: https://wa.me/33745460446`,
  pl: (n) => `Dzień dobry, ${n}! Tu PermanenceAI: próbowaliśmy oddzwonić w sprawie Państwa zgłoszenia i spróbujemy ponownie później. Można też napisać na WhatsApp: https://wa.me/33745460446`,
  nl: (n) => `Beste ${n}, hier PermanenceAI: we hebben geprobeerd u terug te bellen over uw aanvraag en proberen het later opnieuw. U kunt ons ook een WhatsApp sturen: https://wa.me/33745460446`,
  he: (n) => `שלום ${n}, כאן PermanenceAI: ניסינו לחזור אליכם בעקבות הפנייה שלכם וננסה שוב בהמשך. אפשר גם לכתוב לנו בוואטסאפ: https://wa.me/33745460446`,
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
export const sendMissedCallSms = (lang: string, to: string, firstName: string) => sendSms(to, (MISSED[lang] || MISSED['en-gb'])(firstName));
