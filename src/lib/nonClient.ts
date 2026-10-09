// Appelants qui ne sont pas des clients potentiels (fournisseur, partenaire, presse, démarchage) : ni demande de rappel
// commerciale, ni fiche prospect, ni relance (audit du 9 oct. 2026, action 19). La ligne Israël (agent 21314) les
// enregistrait par l’outil de rappel avec la note « לא לקוח – [נושא] » (« pas client – sujet ») : l’IA commerciale les
// rappelait. La consigne de l’agent est corrigée dans Autocalls (docs/audits/a-appliquer-autocalls-2026-10-09.md) ;
// ce filtre du site reste en seconde sécurité, pour les outils d’agents seulement (jamais le texte d’un formulaire).
import { NOTIFY_TO, esc, sendMail } from './server';

// Marqueur explicite EN TÊTE de la note, suivi d’un tiret, de deux-points ou de rien, comme le format de la consigne
// (« לא לקוח – נושא ») ; jamais un mot isolé ailleurs dans le texte (« הוא לא לקוח שלנו עדיין, רוצה הדגמה » reste un
// prospect). Seulement la forme hébraïque de la ligne Israël (21314, seule convention en place) et le marqueur
// « [NON_CLIENT] », sans ambiguïté, pour toute autre langue : « non client » ou « not a customer » désignent souvent un
// prospect (« Non client : question sur l’essai »), dont le rappel ne doit jamais être supprimé.
const MARKER = /^[\s"'«(\[]*(?:לא[\s-]*לקוח\s*(?:$|[–—:\]-])|NON_CLIENT\b)/i;

/** Note (ou champ libre) d’un agent qui signale un appelant non client. */
export const isNonClientNote = (...texts: unknown[]) => texts.some((t) => typeof t === 'string' && MARKER.test(t.slice(0, 2000)));

/** Réponse lue par l’agent : rien n’est programmé, il oriente vers l’adresse e-mail et termine poliment. */
export const NON_CLIENT_AGENT_MESSAGE = 'Not a customer request (supplier, partnership, press or sales offer): nothing was scheduled and nobody will call back. Thank the person, give them the email address contact@permanenceia.com for their request, and end the conversation politely. Do not promise a callback.';

/** Message à l’équipe (contact@) : demande non commerciale, aucun rappel programmé. */
export async function notifyNonClient(fields: Record<string, unknown>, source: string) {
  const lines = Object.entries(fields).filter(([, v]) => v != null && String(v).trim() !== '').map(([k, v]) => `${k} : ${String(v).slice(0, 600)}`);
  const text = [
    `Appelant non client (fournisseur, partenaire, presse ou démarchage), signalé par ${source}.`,
    'Aucun rappel programmé, aucune fiche prospect, aucune relance : la personne a été orientée vers contact@permanenceia.com.',
    '', ...lines,
  ].join('\n');
  await sendMail({
    to: NOTIFY_TO, category: 'internal',
    subject: `Message non commercial — ${String(fields.nom ?? fields.name ?? 'appelant').slice(0, 80)} (${String(fields.téléphone ?? fields.phone ?? '—').slice(0, 32)})`,
    text, html: `<p>${text.split('\n').map(esc).join('<br>')}</p>`,
  });
}
