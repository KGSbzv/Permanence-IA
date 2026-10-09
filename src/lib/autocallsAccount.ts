// Comptes de l’espace client white-label (Autocalls) : appels authentifiés, lecture de la liste paginée des comptes et
// recherche d’un compte par email, partagés par Lucie (/api/agent/account), la page Mon compte (/api/account) et
// l’instantané quotidien des relances (src/lib/relances/autocalls.ts). Lecture seule ici, sauf les jetons temporaires
// de Lucie (créés et révoqués par src/pages/api/agent/account.ts).
import type { PlatformUser } from './relances/types';

export type { PlatformUser };
export const AUTOCALLS_API = 'https://app.autocalls.ai/api';
/** Pages lues au plus dans la liste des comptes. */
const MAX_PAGES = 20;

/** Appel à l’API Autocalls (clé de la plateforme ou jeton d’un client), avec délai d’attente. */
export async function autocallsApi<T>(path: string, token: string, init: RequestInit = {}, timeoutMs = 8000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${AUTOCALLS_API}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers || {}) },
    });
    if (!res.ok) throw new Error(`Autocalls ${path} ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Parcourt la liste des comptes (GET /white-label/users, réponse Laravel : last_page) page par page, 20 pages au plus :
 * `onPage` reçoit les comptes de chaque page (ceux qui ont un email) et renvoie true pour arrêter. Lève une erreur en
 * cas de réponse en erreur, de délai dépassé par page (`timeoutMs`) ou au total (`totalMs`).
 */
export async function eachPlatformUserPage(key: string, onPage: (users: PlatformUser[]) => boolean | void, opts: { timeoutMs?: number; totalMs?: number } = {}) {
  const started = Date.now();
  for (let page = 1; page <= MAX_PAGES; page++) {
    if (opts.totalMs && Date.now() - started > opts.totalMs) throw new Error('Autocalls /white-label/users : délai dépassé');
    const body = await autocallsApi<any>(`/white-label/users?page=${page}`, key, {}, opts.timeoutMs);
    const list: any[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
    if (onPage(list.filter((u): u is PlatformUser => !!u && typeof u.email === 'string'))) return;
    // Réponse paginée : page suivante tant qu’il en reste ; sinon une seule page.
    const last = Number(body?.last_page ?? body?.meta?.last_page ?? 0);
    if (Array.isArray(body) || !last || page >= last || !list.length) return;
  }
}

/**
 * Compte de l’espace client dont l’email est `email` (déjà en minuscules) ; la lecture s’arrête dès que l’adresse est
 * trouvée. Lève une erreur sans AUTOCALLS_API_KEY, en cas de réponse en erreur ou si la recherche dépasse `totalMs`.
 */
export async function findPlatformUser(email: string, opts: { timeoutMs?: number; totalMs?: number } = {}): Promise<PlatformUser | undefined> {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) throw new Error('AUTOCALLS_API_KEY non configurée');
  let found: PlatformUser | undefined;
  await eachPlatformUserPage(key, (users) => {
    found = users.find((u) => u.email.trim().toLowerCase() === email);
    return !!found;
  }, opts);
  return found;
}
