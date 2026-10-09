// Préférences email : liens signés (gestion des préférences, désinscription) et choix enregistré par adresse.
// - Jeton = HMAC de l’adresse (minuscules), clé dérivée d’ACCOUNT_CODE_SECRET avec un libellé propre :
//   seul le destinataire de l’email a le lien, personne ne peut changer les préférences d’un autre.
// - Choix stocké sans changement de schéma dans call_events (kind 'email_pref') : external_id = HMAC de
//   l’adresse (jamais l’adresse en clair), outcome = 'essential_only' ou 'all' ; la ligne la plus récente fait foi.
// Les accès à la base sont passés en paramètre (helpers de src/lib/server.ts en production, faux en test).
import { createHmac, timingSafeEqual } from 'crypto';
import { SITE } from '@/data/site';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

/** essential : codes, confirmations, réponses aux demandes (toujours envoyés) ; marketing : sautés après
 *  désinscription ; internal : notifications de l’équipe (NOTIFY_TO), toujours envoyées. */
export type MailCategory = 'essential' | 'marketing' | 'internal';
export type EmailPref = 'essential_only' | 'all';
export const EMAIL_PREF_KIND = 'email_pref';
export const isEmailPref = (v: unknown): v is EmailPref => v === 'essential_only' || v === 'all';

export interface PrefDb {
  select: <T>(table: string, query: string) => Promise<T[]>;
  insert: (table: string, row: Record<string, unknown>) => Promise<unknown>;
}

/** Clé dérivée du secret des codes de compte avec un libellé propre à chaque usage (jamais affichée) ; null si le
 *  secret manque. Utilisée aussi par la session de la page Mon compte (src/lib/accountSession.ts). */
export function deriveKey(label: string) {
  const s = process.env.ACCOUNT_CODE_SECRET;
  if (!s || s.length < 32) return null;
  return createHmac('sha256', s).update(`permanenceia|${label}`).digest();
}

export const normEmail = (raw: unknown) => String(raw ?? '').trim().toLowerCase();
export const isValidEmail = (e: string) => e.length <= 160 && /^[^@\s<>()",;]+@[^@\s<>()",;]+\.[^@\s<>()",;]+$/.test(e);

/** Jeton du lien de préférences de cette adresse (null sans secret configuré). */
export function emailToken(email: string) {
  const key = deriveKey('email-pref-link');
  return key ? createHmac('sha256', key).update(normEmail(email)).digest('base64url').slice(0, 32) : null;
}

export function verifyEmailToken(email: string, token: unknown) {
  const want = emailToken(email);
  const got = String(token ?? '');
  return !!want && got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

/** Identifiant de l’adresse en base (HMAC, irréversible sans le secret). */
export function emailKey(email: string) {
  const key = deriveKey('email-pref-id');
  if (!key) throw new Error('ACCOUNT_CODE_SECRET absente ou trop courte');
  return createHmac('sha256', key).update(normEmail(email)).digest('hex').slice(0, 32);
}

// Adresse encodée en base64url dans les liens : pas d’adresse lisible dans les journaux ni d’ennui avec « + ».
export const encodeEmail = (email: string) => Buffer.from(normEmail(email)).toString('base64url');
export function decodeEmail(raw: unknown): string | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  const email = s.includes('@') ? normEmail(s) : normEmail(Buffer.from(s, 'base64url').toString('utf8'));
  return isValidEmail(email) ? email : null;
}

const prefix = (locale: Locale) => (locale === DEFAULT_LOCALE ? '' : `/${locale}`);
/** Page des préférences sans jeton (formulaire qui envoie un lien signé) : lien du modèle Autocalls. */
export const genericPrefsUrl = (locale: Locale = DEFAULT_LOCALE) => `${SITE.url}${prefix(locale)}/preferences-email`;
export const legalUrl = (locale: Locale, page: 'cgu' | 'confidentialite') => `${SITE.url}${prefix(locale)}/${page}`;

const signedQuery = (email: string, token: string, locale: Locale) =>
  `e=${encodeEmail(email)}&t=${encodeURIComponent(token)}&l=${locale}`;

/** Lien personnel vers la page des préférences (lien générique si le secret manque). */
export function prefsUrl(email: string, locale: Locale = DEFAULT_LOCALE) {
  const t = emailToken(email);
  return t ? `${genericPrefsUrl(locale)}?${signedQuery(email, t, locale)}` : genericPrefsUrl(locale);
}

/** Lien de désinscription : GET mène à la page de confirmation, POST (RFC 8058) désinscrit en un clic. Null sans secret. */
export function unsubscribeUrl(email: string, locale: Locale = DEFAULT_LOCALE) {
  const t = emailToken(email);
  return t ? `${SITE.url}/api/email/unsubscribe?${signedQuery(email, t, locale)}` : null;
}

/** Dernier choix enregistré pour cette adresse (null : aucun choix, tous les emails). */
export async function getEmailPref(email: string, db: PrefDb): Promise<EmailPref | null> {
  const rows = await db.select<{ outcome: string | null }>(
    'call_events', `select=outcome,created_at&kind=eq.${EMAIL_PREF_KIND}&external_id=eq.${emailKey(email)}&order=created_at.desc&limit=1`);
  return isEmailPref(rows[0]?.outcome) ? rows[0].outcome as EmailPref : null;
}

export const emailOptedOut = async (email: string, db: PrefDb) => (await getEmailPref(email, db)) === 'essential_only';

/** Enregistre un choix (nouvelle ligne : l’historique reste, la plus récente fait foi). */
export const saveEmailPref = (email: string, pref: EmailPref, source: string, db: PrefDb) => db.insert('call_events', {
  kind: EMAIL_PREF_KIND, external_id: emailKey(email), outcome: pref,
  summary: `Préférence email : ${pref === 'essential_only' ? 'emails essentiels seulement' : 'tous les emails'} (${source})`,
});
