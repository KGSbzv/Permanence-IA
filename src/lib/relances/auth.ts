// Accès à la route planifiée des relances : en-tête x-cron-token comparé à CRON_SECRET (32 caractères au moins,
// comparaison à temps constant), ou jeton OIDC Google de Cloud Scheduler (signature RS256 vérifiée avec les clés
// publiques de Google, audience et compte de service attendus : RELANCES_OIDC_AUDIENCE, RELANCES_OIDC_EMAIL).
import { createPublicKey, timingSafeEqual, verify } from 'crypto';
import type { NextApiRequest } from 'next';

export function cronTokenOk(got: unknown, expected = process.env.CRON_SECRET) {
  if (!expected || expected.length < 32 || typeof got !== 'string' || !got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const CERTS = 'https://www.googleapis.com/oauth2/v3/certs';
let keys: { at: number; list: Record<string, unknown>[] } | null = null;

async function googleKeys(fetcher: typeof fetch) {
  if (keys && Date.now() - keys.at < 3_600_000) return keys.list;
  const res = await fetcher(CERTS);
  if (!res.ok) throw new Error(`certificats Google ${res.status}`);
  const body = await res.json();
  keys = { at: Date.now(), list: Array.isArray(body?.keys) ? body.keys : [] };
  return keys.list;
}

const b64json = (s: string) => JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));

/** Jeton OIDC Google valide pour cette route (émetteur, audience, expiration, compte de service, signature). */
export async function oidcOk(authorization: unknown, opts: {
  audience?: string; email?: string; now?: number; fetcher?: typeof fetch; jwks?: Record<string, unknown>[];
} = {}) {
  const audience = opts.audience ?? process.env.RELANCES_OIDC_AUDIENCE;
  const email = opts.email ?? process.env.RELANCES_OIDC_EMAIL;
  if (!audience || !email) return false;
  const m = /^Bearer ([\w-]+)\.([\w-]+)\.([\w-]+)$/.exec(String(authorization ?? ''));
  if (!m) return false;
  try {
    const header = b64json(m[1]);
    const claims = b64json(m[2]);
    if (header.alg !== 'RS256' || typeof header.kid !== 'string') return false;
    const now = (opts.now ?? Date.now()) / 1000;
    if (!['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss)) return false;
    if (claims.aud !== audience || claims.email !== email || claims.email_verified !== true) return false;
    if (typeof claims.exp !== 'number' || claims.exp < now - 60 || (typeof claims.iat === 'number' && claims.iat > now + 300)) return false;
    const list = opts.jwks ?? await googleKeys(opts.fetcher ?? fetch);
    const jwk = list.find((k) => k.kid === header.kid);
    if (!jwk) return false;
    const key = createPublicKey({ key: jwk as any, format: 'jwk' });
    return verify('RSA-SHA256', Buffer.from(`${m[1]}.${m[2]}`), key, Buffer.from(m[3], 'base64url'));
  } catch {
    return false;
  }
}

/** Appel autorisé : jeton secret, ou jeton OIDC du planificateur. */
export async function isCronAuthorized(req: NextApiRequest) {
  if (cronTokenOk(req.headers['x-cron-token'])) return true;
  return oidcOk(req.headers.authorization);
}
