// Session de la page Mon compte : cookie signé posé après un code à 6 chiffres correct (src/pages/api/account.ts).
// - Valeur : « v1.<email en base64url>.<expiration en secondes>.<signature> », signature HMAC-SHA256 avec une clé
//   dérivée d’ACCOUNT_CODE_SECRET par un libellé propre (« account-session ») : distincte des liens de préférences.
// - Durée fixe de 30 minutes, sans prolongation ; cookie HttpOnly, Secure, SameSite=Lax ; aucune donnée dans l’URL.
// - Path=/ : la page vit sous /mon-compte et /<langue>/mon-compte, l’API sous /api/account.
// - Préfixe __Host- : le navigateur refuse ce nom s’il est posé par un sous-domaine (app.permanenceia.com est l’espace
//   client d’un tiers) ou sans Secure / Path=/ ; aucun cookie de session ne peut donc être injecté depuis là.
import { createHmac, timingSafeEqual } from 'crypto';
import { deriveKey, isValidEmail, normEmail } from './emailPrefs';

export const SESSION_COOKIE = '__Host-pia_account';
export const SESSION_TTL_S = 30 * 60;

const sign = (key: Buffer, body: string) => createHmac('sha256', key).update(body).digest('base64url');

/** Valeur du cookie pour cette adresse (null si le secret manque ou si l’adresse est invalide). */
export function signSession(email: string, nowMs = Date.now()): string | null {
  const key = deriveKey('account-session');
  const e = normEmail(email);
  if (!key || !isValidEmail(e)) return null;
  const exp = Math.floor(nowMs / 1000) + SESSION_TTL_S;
  const body = `v1.${Buffer.from(e).toString('base64url')}.${exp}`;
  return `${body}.${sign(key, body)}`;
}

/** Session valide (signature, expiration, adresse) ou null. */
export function readSession(raw: unknown, nowMs = Date.now()): { email: string; exp: number } | null {
  if (typeof raw !== 'string' || raw.length > 600) return null;
  const parts = raw.split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return null;
  const [, b64, expRaw, sig] = parts;
  if (!/^[A-Za-z0-9_-]+$/.test(b64) || !/^\d{1,12}$/.test(expRaw)) return null;
  const exp = Number(expRaw);
  const nowS = Math.floor(nowMs / 1000);
  // Une expiration trop lointaine n’a pas été posée par ce site (durée fixe, 60 s de marge d’horloge).
  if (exp <= nowS || exp > nowS + SESSION_TTL_S + 60) return null;
  const key = deriveKey('account-session');
  if (!key) return null;
  const want = Buffer.from(sign(key, `v1.${b64}.${expRaw}`));
  const got = Buffer.from(sig);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  const email = normEmail(Buffer.from(b64, 'base64url').toString('utf8'));
  return isValidEmail(email) ? { email, exp } : null;
}

/** Session lue dans l’en-tête Cookie de la requête. */
export function readSessionFromCookieHeader(header: string | undefined, nowMs = Date.now()) {
  const raw = new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`).exec(header || '')?.[1];
  return raw ? readSession(raw.trim(), nowMs) : null;
}

export const sessionSetCookie = (value: string) => `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${SESSION_TTL_S}; HttpOnly; Secure; SameSite=Lax`;
export const sessionClearCookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
