// Comptes de l’espace client white-label (GET /white-label/users, même clé que src/pages/api/agent/account.ts) :
// minutes et crédits de chaque compte, pour l’instantané quotidien (C2, C4 et série U). Pagination commune avec
// Lucie et la page Mon compte : src/lib/autocallsAccount.ts.
import { eachPlatformUserPage } from '../autocallsAccount';
import type { PlatformUser } from './types';

/** Lecteur de la liste complète des comptes ; absent si AUTOCALLS_API_KEY n’est pas configurée (source ignorée). */
export function platformUsersFetcher(): (() => Promise<PlatformUser[]>) | undefined {
  const key = process.env.AUTOCALLS_API_KEY;
  if (!key) return undefined;
  return async () => {
    const out: PlatformUser[] = [];
    await eachPlatformUserPage(key, (users) => { out.push(...users); }, { timeoutMs: 15_000 });
    return out;
  };
}
