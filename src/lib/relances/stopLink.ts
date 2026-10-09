// Lien signé « Arrêter les relances de ce contact », ajouté aux alertes internes (nouvelle demande, nouvelle
// inscription, « À traiter », fiche prospect, réponses reçues) : l’équipe arrête les relances d’un contact sans toucher
// à la base (audit du 9 oct. 2026, action 15 ; conception, « Lien Stop relances dans l’alerte interne »).
// - Jeton = HMAC de l’adresse (minuscules), clé dérivée d’ACCOUNT_CODE_SECRET avec un libellé propre : distinct du
//   lien de désinscription envoyé au client, il n’est jamais mis dans un email au client.
// - Le lien ouvre une page de confirmation (GET, sans effet : les antivirus des messageries ouvrent les liens) ; le
//   bouton enregistre l’arrêt (POST) : ligne relance_stops (reason 'manual', scope 'marketing', source « lien
//   équipe »). Effet dans le moteur : plus aucun e-mail commercial, les messages de service facultatifs (ceux qui sont
//   sautés après une désinscription) sont sautés aussi et la série A (mise en route) s’arrête ; les messages liés au
//   contrat (inscription, essai, fin d’essai, solde) continuent.
// Sans secret configuré : pas de lien (rien n’est ajouté à l’alerte).
import { createHmac, timingSafeEqual } from 'crypto';
import { SITE } from '@/data/site';
import { deriveKey, encodeEmail, isValidEmail, normEmail } from '@/lib/emailPrefs';

/** Jeton du lien pour cette adresse ; null sans secret. */
export function stopToken(email: string) {
  const key = deriveKey('relance-stop-link');
  return key ? createHmac('sha256', key).update(normEmail(email)).digest('base64url') : null;
}

export function verifyStopToken(email: string, token: unknown) {
  const want = stopToken(email);
  const got = String(token ?? '');
  return !!want && got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

/** Adresse du lien (page de confirmation) ; null sans secret ou adresse invalide. */
export function stopRelancesUrl(raw: unknown) {
  const email = normEmail(raw);
  if (!isValidEmail(email)) return null;
  const t = stopToken(email);
  return t ? `${SITE.url}/api/relances/stop?e=${encodeEmail(email)}&t=${encodeURIComponent(t)}` : null;
}

/** Ligne à ajouter au texte d’une alerte interne (chaîne vide sans lien). */
export function stopRelancesLine(raw: unknown) {
  const url = stopRelancesUrl(raw);
  return url ? `Arrêter les relances de ce contact : ${url}` : '';
}

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Même lien en HTML (paragraphe), chaîne vide sans lien. */
export function stopRelancesHtml(raw: unknown) {
  const url = stopRelancesUrl(raw);
  return url ? `<p><a href="${attr(url)}">Arrêter les relances de ce contact</a></p>` : '';
}
