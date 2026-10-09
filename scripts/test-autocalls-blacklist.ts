// Tests de l’ajout automatique à la liste de blocage Autocalls (aucun réseau, aucune base réelle, aucun envoi réel) :
//   npx tsx scripts/test-autocalls-blacklist.ts
// fetch remplacé (Supabase simulé et automatisation simulée, toute autre adresse refusée), SMTP retiré. Vérifie : rien
// n’est envoyé sans clé Autocalls ni avec AUTOCALLS_BLACKLIST=0, jeton HMAC attendu, corps envoyé, adresse par défaut
// et remplacée, numéro non international refusé, échec HTTP signalé, et dans registerOptOut : ajout demandé pour une
// opposition ou une désinscription appliquée, jamais pour un mauvais contact ni une demande sans jeton, opposition
// enregistrée et rappels annulés même si l’automatisation est en panne.
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'crypto';

const FAKE_DB = 'https://supabase.invalid';
const HOOK = 'https://automate.autocalls.ai/api/v1/webhooks/sclgGIM5NvGnGYWz7XOUy';
process.env.SUPABASE_URL = FAKE_DB;
process.env.SUPABASE_SERVICE_ROLE_KEY = `sb_secret_test_${randomBytes(8).toString('hex')}`;
for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'AUTOCALLS_API_KEY', 'AUTOCALLS_BLACKLIST', 'AUTOCALLS_BLACKLIST_WEBHOOK_URL']) delete process.env[k];

type Call = { url: string; method: string; body: any };
let calls: Call[] = [];
let hookStatus = 200;
globalThis.fetch = (async (input: unknown, init: RequestInit = {}) => {
  const url = String(input);
  const method = String(init.method || 'GET').toUpperCase();
  calls.push({ url, method, body: init.body ? JSON.parse(String(init.body)) : null });
  if (url.startsWith(`${FAKE_DB}/rest/v1/`)) {
    if (method === 'GET') return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
    return new Response(null, { status: method === 'POST' ? 201 : 204 });
  }
  if (url.startsWith('https://automate.autocalls.ai/')) return new Response('', { status: hookStatus });
  throw new Error(`réseau interdit pendant les tests : ${url}`);
}) as typeof fetch;

const hookCalls = () => calls.filter((c) => c.url.startsWith('https://automate.autocalls.ai/'));

async function main() {
  const { addToAutocallsBlacklist, blacklistToken } = await import('@/lib/autocallsBlacklist');
  const { registerOptOut } = await import('@/lib/optout');
  const tests: Array<[string, () => Promise<void>]> = [];
  const test = (name: string, fn: () => Promise<void>) => tests.push([name, fn]);
  const reset = () => { calls = []; hookStatus = 200; delete process.env.AUTOCALLS_BLACKLIST; delete process.env.AUTOCALLS_BLACKLIST_WEBHOOK_URL; process.env.AUTOCALLS_API_KEY = 'cle-de-test'; };

  test('sans clé Autocalls : rien n’est envoyé', async () => {
    reset(); delete process.env.AUTOCALLS_API_KEY;
    assert.equal(await addToAutocallsBlacklist('+33612345678', 'test'), 'off');
    assert.equal(calls.length, 0);
  });

  test('coupé par AUTOCALLS_BLACKLIST=0 : rien n’est envoyé', async () => {
    reset(); process.env.AUTOCALLS_BLACKLIST = '0';
    assert.equal(await addToAutocallsBlacklist('+33612345678', 'test'), 'off');
    assert.equal(calls.length, 0);
  });

  test('jeton HMAC-SHA256 de la clé, en base64url', async () => {
    const expected = createHmac('sha256', 'cle-de-test').update('permanenceia-blacklist-v1').digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    assert.equal(blacklistToken('cle-de-test'), expected);
    assert.notEqual(blacklistToken('autre-cle'), expected);
  });

  test('envoi : adresse par défaut, jeton, numéro et motif tronqué à 200 caractères', async () => {
    reset();
    assert.equal(await addToAutocallsBlacklist('+972548055770', 'm'.repeat(300)), 'sent');
    const [c] = hookCalls();
    assert.equal(c.url, HOOK);
    assert.equal(c.method, 'POST');
    assert.deepEqual(Object.keys(c.body).sort(), ['phone_number', 'reason', 'token']);
    assert.equal(c.body.token, blacklistToken('cle-de-test'));
    assert.equal(c.body.phone_number, '+972548055770');
    assert.equal(c.body.reason.length, 200);
  });

  test('adresse remplacée par AUTOCALLS_BLACKLIST_WEBHOOK_URL', async () => {
    reset(); process.env.AUTOCALLS_BLACKLIST_WEBHOOK_URL = 'https://automate.autocalls.ai/api/v1/webhooks/autre';
    await addToAutocallsBlacklist('+33612345678', 'test');
    assert.equal(hookCalls()[0].url, 'https://automate.autocalls.ai/api/v1/webhooks/autre');
  });

  test('numéro non international refusé, sans envoi', async () => {
    reset();
    for (const p of ['0612345678', '+0612345678', '+33 6 12 34 56 78', '', '+1234']) {
      await assert.rejects(addToAutocallsBlacklist(p, 'test'), /non international/);
    }
    assert.equal(calls.length, 0);
  });

  test('automatisation en erreur : échec signalé', async () => {
    reset(); hookStatus = 500;
    await assert.rejects(addToAutocallsBlacklist('+33612345678', 'test'), /HTTP 500/);
  });

  test('opposition appliquée : enregistrée, rappels annulés, ajout demandé', async () => {
    reset();
    const r = await registerOptOut({ phone: '+33612345678', outcome: 'ne_plus_appeler', source: 'test' });
    assert.equal(r.blacklisted, true);
    assert.equal(r.recorded, true);
    assert.equal(r.cancelled, true);
    assert.equal(hookCalls().length, 1);
    assert.equal(hookCalls()[0].body.phone_number, '+33612345678');
    assert.match(hookCalls()[0].body.reason, /^Opposition « ne plus appeler » \(test\)$/);
  });

  test('désinscription WhatsApp : ajout demandé aussi', async () => {
    reset();
    const r = await registerOptOut({ phone: '+33612345679', outcome: 'desinscription', source: 'test' });
    assert.equal(r.blacklisted, true);
    assert.match(hookCalls()[0].body.reason, /^Désinscription WhatsApp/);
  });

  test('mauvais contact : jamais ajouté', async () => {
    reset();
    const r = await registerOptOut({ phone: '+33612345670', outcome: 'mauvais_contact', source: 'test' });
    assert.equal(r.blacklisted, false);
    assert.equal(hookCalls().length, 0);
  });

  test('demande sans jeton (apply: false) : rien n’est ajouté', async () => {
    reset();
    const r = await registerOptOut({ phone: '+33612345671', outcome: 'ne_plus_appeler', source: 'test', apply: false });
    assert.equal(r.blacklisted, false);
    assert.equal(hookCalls().length, 0);
  });

  test('automatisation en panne : opposition enregistrée quand même, pas d’erreur levée', async () => {
    reset(); hookStatus = 503;
    const r = await registerOptOut({ phone: '+33612345672', outcome: 'ne_plus_appeler', source: 'test' });
    assert.equal(r.blacklisted, false);
    assert.equal(r.recorded, true);
    assert.equal(r.cancelled, true);
    assert.ok(calls.some((c) => c.method === 'POST' && c.url.includes('/rest/v1/call_events') && c.body.kind === 'optout'));
  });

  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log(`ok   ${name}`); } catch (e: any) { failed++; console.log(`ÉCHEC ${name}\n     ${e.message}`); }
  }
  console.log(`\n${tests.length - failed}/${tests.length} tests réussis`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
