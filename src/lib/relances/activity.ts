// Mise en route des comptes de l’espace client (audit du 9 oct., § 7) : une fois par jour, pour chaque compte en essai,
// abonné ou payant à la minute, nombre d’agents, agents reliés à un numéro, agents mis en pause par la conformité et
// dernier appel réel. Lecture seule, avec un jeton temporaire du client (POST /white-label/token, comme le dossier de
// Lucie dans src/pages/api/agent/account.ts), révoqué aussitôt (POST /white-label/logout avec token_id : jamais les
// autres jetons du client). Appels « réels » : entrants ou sortants (GET /user/calls, type inbound ou outbound) ; les
// tests dans le navigateur (type web) ne comptent pas. Une lecture des agents en échec lève une erreur : elle n’est
// jamais enregistrée comme « 0 agent ». Cache du jour : call_events kind 'activite_compte' (src/lib/relances/store.ts).
// Solde de l’agence : GET /user/me avec la clé de la plateforme (total_balance, en US$), s’il répond.
import { autocallsApi } from '../autocallsAccount';
import { A_CALLS_WINDOW_DAYS } from './sequences';
import type { AccountActivity } from './types';

/** Lignes du cache de mise en route dans call_events (une par compte et par jour). */
export const ACTIVITY_KIND = 'activite_compte';

const DAY = 86_400_000;
const TIMEOUT_MS = 8_000;
const items = (b: any): any[] => (Array.isArray(b) ? b : Array.isArray(b?.data) ? b.data : []);

/** Date Autocalls (« 2025-08-04 14:30:00 », en UTC) ou ISO → ISO ; null si illisible. */
export function apiDate(v: unknown): string | null {
  if (typeof v !== 'string' || !v.trim()) return null;
  const s = v.trim();
  const t = Date.parse(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s) ? `${s.replace(' ', 'T')}Z` : s);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/** Appel réel : au téléphone (entrant ou sortant), jamais un test dans le navigateur (type web). */
export const isRealCall = (call: any) => !/web|test|browser/i.test(String(call?.type ?? ''));

/**
 * Résumé d’une lecture. `assistants` : réponse de /user/assistants/get (obligatoire) ; `numbers` et `calls` : null si
 * illisibles. Appels : seulement ceux de la fenêtre (depuis `since`) ; page pleine sans appel réel → inconnu (null),
 * jamais « 0 appel » par défaut.
 */
export function summarizeActivity(userId: string, o: { assistants: any; numbers: any | null; calls: any | null; now: Date; since: Date }): AccountActivity {
  const agents = items(o.assistants).filter((a) => a && !a.deleted_at);
  const total = Number(o.assistants?.total);
  const linked = (v: unknown) => v != null && v !== '' && v !== 0 && v !== '0';
  let realCalls: number | null = null;
  let lastCallAt: string | null = null;
  if (o.calls) {
    const page = items(o.calls);
    const real = page.filter(isRealCall).map((c) => apiDate(c?.created_at)).filter((d): d is string => Boolean(d) && Date.parse(d as string) >= o.since.getTime());
    const more = Number(o.calls?.total) > page.length;
    realCalls = real.length || (more ? null : 0);
    lastCallAt = real.sort().pop() ?? null;
  }
  return {
    userId,
    readAt: o.now.toISOString(),
    agents: Number.isFinite(total) && total >= agents.length ? total : agents.length,
    agentsWithNumber: agents.filter((a) => linked(a.phone_number_id)).length,
    phoneNumbers: o.numbers ? items(o.numbers).length : null,
    paused: agents.filter((a) => a.compliance_blocked_at).map((a) => ({
      name: String(a.name ?? `agent ${a.id ?? ''}`).slice(0, 80),
      since: apiDate(a.compliance_blocked_at) ?? String(a.compliance_blocked_at).slice(0, 40),
    })),
    realCalls,
    lastCallAt,
    callsSince: o.since.toISOString(),
  };
}

/** Lecteur de la mise en route d’un compte ; absent sans AUTOCALLS_API_KEY (série A en attente, rien n’est inventé). */
export function accountActivityFetcher(key = process.env.AUTOCALLS_API_KEY): ((userId: string, now: Date) => Promise<AccountActivity>) | undefined {
  if (!key) return undefined;
  return async (userId, now) => {
    const id = /^\d+$/.test(userId) ? Number(userId) : userId;
    const since = new Date(now.getTime() - A_CALLS_WINDOW_DAYS * DAY);
    const created = await autocallsApi<{ token?: string }>('/white-label/token', key, { method: 'POST', body: JSON.stringify({ user_id: id, token_name: 'relances-lecture' }) }, TIMEOUT_MS);
    const token = created?.token;
    if (!token) throw new Error('jeton temporaire absent');
    try {
      // Agents : lecture obligatoire (une erreur remonte, jamais « 0 agent »). Numéros et appels : facultatifs.
      const assistants = await autocallsApi<any>('/user/assistants/get?per_page=100', token, {}, TIMEOUT_MS);
      const [numbers, calls] = await Promise.all([
        autocallsApi<any>('/user/phone-numbers', token, {}, TIMEOUT_MS).catch(() => null),
        autocallsApi<any>(`/user/calls?per_page=100&date_from=${since.toISOString().slice(0, 10)}`, token, {}, TIMEOUT_MS).catch(() => null),
      ]);
      return summarizeActivity(userId, { assistants, numbers, calls, now, since });
    } finally {
      // Jeton au format « id|secret » : on ne révoque que celui-ci, jamais les clés API du client.
      const tokenId = Number(String(token).split('|')[0]);
      if (tokenId) await autocallsApi('/white-label/logout', key, { method: 'POST', body: JSON.stringify({ user_id: id, token_id: tokenId }) }, TIMEOUT_MS).catch(() => undefined);
      else console.warn('[relances] jeton temporaire sans identifiant : non révoqué');
    }
  };
}

/** Solde de l’agence Autocalls (US$) ; null si la réponse ne le donne pas. Absent sans AUTOCALLS_API_KEY. */
export function agencyBalanceFetcher(key = process.env.AUTOCALLS_API_KEY): (() => Promise<number | null>) | undefined {
  if (!key) return undefined;
  return async () => {
    const me = await autocallsApi<any>('/user/me', key, {}, TIMEOUT_MS);
    const raw = me?.total_balance ?? me?.data?.total_balance ?? me?.user?.total_balance;
    // Valeur absente ou vide : illisible (jamais un solde de 0 inventé, qui déclencherait une fausse alerte).
    const v = typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '') ? Number(raw) : NaN;
    return Number.isFinite(v) ? v : null;
  };
}
