// Tests du contrôle du jeton des webhooks (aucun réseau, aucune base, aucun envoi) :
//   npx tsx scripts/test-webhook-auth.ts
// Jetons de test aléatoires (jamais ceux de production). Vérifie : en-tête avec WEBHOOK_TOKEN_NEXT accepté ;
// WEBHOOK_ALLOW_QUERY_TOKEN=0 refuse ?token= sur une route ordinaire ; l’inscription accepte alors ?token= avec
// SIGNUP_WEBHOOK_TOKEN seulement ; sans la variable (ou à 1), comportement d’origine ; aucune valeur dans le journal.
import assert from 'node:assert/strict';
import { randomBytes } from 'crypto';
import type { NextApiRequest } from 'next';

const KEYS = ['WEBHOOK_TOKEN', 'WEBHOOK_TOKEN_NEXT', 'SIGNUP_WEBHOOK_TOKEN', 'WEBHOOK_ALLOW_QUERY_TOKEN'] as const;
for (const k of [...KEYS, 'ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[k];

const OLD = randomBytes(32).toString('hex');
const NEXT = randomBytes(32).toString('hex');
const SIGNUP = randomBytes(32).toString('hex');
const SIGNUP_ROUTE = { querySecret: 'SIGNUP_WEBHOOK_TOKEN' } as const;

function setEnv(env: Partial<Record<(typeof KEYS)[number], string>>) {
  for (const k of KEYS) delete process.env[k];
  Object.assign(process.env, env);
}

function req(route: string, { header, query }: { header?: string; query?: string } = {}) {
  return {
    url: query === undefined ? route : `${route}?token=${query}`,
    headers: header === undefined ? {} : { 'x-webhook-token': header },
    query: query === undefined ? {} : { token: query },
  } as unknown as NextApiRequest;
}

async function main() {
  const { isAuthorized } = await import('@/lib/server');

  // Journal capturé : on vérifie le format et l’absence de toute valeur de jeton.
  const logs: string[] = [];
  const realInfo = console.info;
  console.info = (...args: unknown[]) => { logs.push(args.map(String).join(' ')); };

  let passed = 0;
  const test = (name: string, fn: () => void) => {
    try { fn(); passed++; realInfo(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };
  const lastLog = () => logs[logs.length - 1];

  try {
    // --- Variable absente : comportement d’origine. ---
    setEnv({ WEBHOOK_TOKEN: OLD, WEBHOOK_TOKEN_NEXT: NEXT });
    test('sans variable : en-tête avec WEBHOOK_TOKEN_NEXT accepté', () => {
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: NEXT })), true);
      assert.equal(lastLog(), '[auth] /api/webhooks/autocalls mode=header ok=true');
    });
    test('sans variable : en-tête avec WEBHOOK_TOKEN accepté', () => assert.equal(isAuthorized(req('/api/callback', { header: OLD })), true));
    test('sans variable : ?token= avec WEBHOOK_TOKEN accepté (route ordinaire)', () => {
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { query: OLD })), true);
      assert.equal(lastLog(), '[auth] /api/webhooks/autocalls mode=query ok=true');
    });
    test('sans variable : ?token= avec WEBHOOK_TOKEN_NEXT accepté', () => assert.equal(isAuthorized(req('/api/agent/optout', { query: NEXT })), true));
    test('sans variable : inscription par ?token= avec WEBHOOK_TOKEN acceptée (aucun secret dédié)', () => {
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: OLD }), SIGNUP_ROUTE), true);
    });
    test('sans variable : mauvais jeton ou aucun jeton refusés', () => {
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { query: SIGNUP })), false);
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: SIGNUP })), false);
      assert.equal(isAuthorized(req('/api/webhooks/autocalls')), false);
      assert.equal(lastLog(), '[auth] /api/webhooks/autocalls mode=none ok=false');
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: SIGNUP }), SIGNUP_ROUTE), false);
    });
    test('sans variable : l’en-tête prime sur ?token=', () => {
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: 'faux', query: OLD })), false);
    });
    test('variable à 1 : identique à l’absence de variable', () => {
      setEnv({ WEBHOOK_TOKEN: OLD, WEBHOOK_TOKEN_NEXT: NEXT, WEBHOOK_ALLOW_QUERY_TOKEN: '1' });
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { query: OLD })), true);
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: OLD }), SIGNUP_ROUTE), true);
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: NEXT })), true);
    });
    test('secret absent ou vide : aucun jeton vide accepté', () => {
      setEnv({ WEBHOOK_TOKEN: '', SIGNUP_WEBHOOK_TOKEN: '' });
      assert.equal(isAuthorized(req('/api/webhooks/ping')), false);
      assert.equal(isAuthorized(req('/api/webhooks/ping', { query: '' })), false);
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: '' }), SIGNUP_ROUTE), false);
      setEnv({ WEBHOOK_ALLOW_QUERY_TOKEN: '0', SIGNUP_WEBHOOK_TOKEN: '' });
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: '' }), SIGNUP_ROUTE), false);
    });

    // --- WEBHOOK_ALLOW_QUERY_TOKEN=0 : jeton dans l’adresse coupé, sauf l’inscription avec son secret. ---
    setEnv({ WEBHOOK_TOKEN: OLD, WEBHOOK_TOKEN_NEXT: NEXT, SIGNUP_WEBHOOK_TOKEN: SIGNUP, WEBHOOK_ALLOW_QUERY_TOKEN: '0' });
    test('variable à 0 : en-tête avec WEBHOOK_TOKEN_NEXT accepté', () => {
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: NEXT })), true);
      assert.equal(isAuthorized(req('/api/agent/account', { header: OLD })), true);
    });
    test('variable à 0 : ?token= refusé sur une route ordinaire, même avec un bon jeton', () => {
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { query: OLD })), false);
      assert.equal(lastLog(), '[auth] /api/webhooks/autocalls mode=query ok=false query=off');
      assert.equal(isAuthorized(req('/api/callback/check', { query: NEXT })), false);
      assert.equal(isAuthorized(req('/api/webhooks/ping', { query: SIGNUP })), false);
    });
    test('variable à 0 : inscription par ?token= avec SIGNUP_WEBHOOK_TOKEN acceptée', () => {
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: SIGNUP }), SIGNUP_ROUTE), true);
      assert.equal(lastLog(), '[auth] /api/webhooks/signup mode=query ok=true');
    });
    test('variable à 0 : inscription par ?token= avec les jetons communs refusée', () => {
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: OLD }), SIGNUP_ROUTE), false);
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: NEXT }), SIGNUP_ROUTE), false);
    });
    test('variable à 0 : inscription par en-tête avec WEBHOOK_TOKEN_NEXT acceptée, pas avec le secret dédié', () => {
      assert.equal(isAuthorized(req('/api/webhooks/signup', { header: NEXT }), SIGNUP_ROUTE), true);
      assert.equal(isAuthorized(req('/api/webhooks/signup', { header: SIGNUP }), SIGNUP_ROUTE), false);
    });
    test('variable à 0 sans SIGNUP_WEBHOOK_TOKEN : inscription par ?token= refusée', () => {
      setEnv({ WEBHOOK_TOKEN: OLD, WEBHOOK_TOKEN_NEXT: NEXT, WEBHOOK_ALLOW_QUERY_TOKEN: '0' });
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: OLD }), SIGNUP_ROUTE), false);
    });

    // --- Scénario de la rotation (docs/autocalls-webhooks-migration.md, « Retrait de l'ancien jeton »). ---
    test('rotation : après copie de l’ancien jeton dans SIGNUP_WEBHOOK_TOKEN et de NEXT dans WEBHOOK_TOKEN', () => {
      setEnv({ WEBHOOK_TOKEN: NEXT, WEBHOOK_TOKEN_NEXT: NEXT, SIGNUP_WEBHOOK_TOKEN: OLD, WEBHOOK_ALLOW_QUERY_TOKEN: '0' });
      assert.equal(isAuthorized(req('/api/webhooks/signup', { query: OLD }), SIGNUP_ROUTE), true, 'adresse de l’administration inchangée');
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: NEXT })), true, 'relais et outils');
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { query: OLD })), false, 'ancien jeton dans l’adresse');
      assert.equal(isAuthorized(req('/api/webhooks/autocalls', { header: OLD })), false, 'ancien jeton en en-tête');
    });

    test('journal : route, mode et résultat, jamais de valeur', () => {
      assert.ok(logs.length > 20);
      for (const line of logs) {
        assert.match(line, /^\[auth\] \/api\/[\w/]+ mode=(header|query|none) ok=(true|false)( query=off)?$/, line);
        for (const v of [OLD, NEXT, SIGNUP]) assert.ok(!line.includes(v), 'valeur de jeton dans le journal');
      }
    });
  } finally {
    console.info = realInfo;
    for (const k of KEYS) delete process.env[k];
  }

  console.log(`\n${passed} tests réussis`);
}

main().catch((e) => { console.error(e); process.exit(1); });
