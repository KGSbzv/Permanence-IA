// Comptes de l’espace client white-label (GET /white-label/users, même clé que src/pages/api/agent/account.ts) :
// minutes et crédits de chaque compte, pour l’instantané quotidien (C2, C4 et série U).
import type { PlatformUser } from './types';

const API = 'https://app.autocalls.ai/api';
const MAX_PAGES = 20;

/** Lecteur de la liste complète des comptes ; absent si AUTOCALLS_API_KEY n’est pas configurée (source ignorée). */
export function platformUsersFetcher(): (() => Promise<PlatformUser[]>) | undefined {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) return undefined;
  return async () => {
    const out: PlatformUser[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15_000);
      try {
        const res = await fetch(`${API}/white-label/users?page=${page}`, {
          headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' }, signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`Autocalls /white-label/users ${res.status}`);
        const body = await res.json();
        const list: PlatformUser[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
        out.push(...list.filter((u) => u && typeof u.email === 'string'));
        // Réponse paginée (Laravel) : page suivante tant qu’il en reste ; sinon une seule page.
        const last = Number(body?.last_page ?? body?.meta?.last_page ?? 0);
        if (Array.isArray(body) || !last || page >= last || !list.length) break;
      } finally {
        clearTimeout(timer);
      }
    }
    return out;
  };
}
