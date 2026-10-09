// Tests de la page Mon compte (aucun réseau, aucune base réelle, aucun envoi réel) :
//   npx tsx scripts/test-mon-compte.ts
// fetch remplacé : Supabase en mémoire (table call_events), Autocalls et Stripe simulés, toute autre adresse refusée ;
// secret de test aléatoire, SMTP et clés retirés. Vérifie : cookie de session signé (aller-retour, falsifications,
// expiration, sans secret, drapeaux du cookie, préfixe __Host-), codes (formule de Lucie inchangée, code du site
// distinct, génération après un code accepté), envoi et vérification du code (compte inconnu, 3 envois par heure,
// aucun essai sans code envoyé, usage unique, verrou au 6e essai de l’heure et au 16e de la journée, base en panne,
// adresse masquée dans le journal), choix du client et du statut Stripe, lecture Stripe (sans clé, erreur, délai, GET
// seulement, factures du seul client choisi, recherche en second recours, aucun client, lectures secondaires en échec,
// devise, éléments au compteur), forfait d’après les tables du webhook, pagination Autocalls commune, emails du code
// dans les 7 langues, la route /api/account (dont 20 vérifications par jour et par IP), et Lucie (/api/agent/account) :
// messages, marqueur de code utilisé, verrou au 6e essai.
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const SECRET = randomBytes(32).toString('hex');
const FAKE_DB = 'https://supabase.invalid';
process.env.ACCOUNT_CODE_SECRET = SECRET;
process.env.SUPABASE_URL = FAKE_DB;
process.env.SUPABASE_SERVICE_ROLE_KEY = `sb_secret_test_${randomBytes(8).toString('hex')}`;
for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'AUTOCALLS_API_KEY', 'STRIPE_ACCOUNT_KEY', 'STRIPE_READ_KEY']) delete process.env[k];

// --- Faux services --------------------------------------------------------------------------------------------
type Row = { kind: string; external_id: string; created_at: string };
let events: Row[] = [];
let dbFail = false;
type Call = { url: string; method: string; headers: Record<string, string> };
let stripeCalls: Call[] = [];
let autocallsCalls: string[] = [];
let autocallsPages: any[] = [];
let stripeRoute: (url: URL) => Response | Promise<Response> = () => json({ data: [] });
// Tables remplies par le webhook Stripe (stripe_customers, stripe_subscriptions).
let webhookCustomers: any[] = [];
let webhookSubs: any[] = [];

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const dbSelectRows = (query: string) => {
  const q = new URLSearchParams(query);
  const kind = (q.get('kind') || '').replace(/^eq\./, '');
  const id = (q.get('external_id') || '').replace(/^eq\./, '');
  const since = (q.get('created_at') || '').replace(/^gte\./, '');
  return events.filter((r) => r.kind === kind && r.external_id === id && (!since || r.created_at >= since)).slice(0, 20).map((_, i) => ({ id: String(i) }));
};
const dbInsertRow = (row: any) => {
  if (dbFail) throw new Error('Supabase call_events 500');
  events.push({ kind: row.kind, external_id: row.external_id, created_at: new Date().toISOString() });
};
/** Base en mémoire au format PrefDb (déroulés appelés directement). */
const memDb = {
  select: async <T,>(_table: string, query: string) => dbSelectRows(query) as unknown as T[],
  insert: async (_table: string, row: Record<string, unknown>) => { dbInsertRow(row); },
};

globalThis.fetch = (async (input: unknown, init: RequestInit = {}) => {
  const url = String(input);
  const method = String(init.method || 'GET').toUpperCase();
  if (url.startsWith(`${FAKE_DB}/rest/v1/call_events`)) {
    if (method === 'GET') return json(dbSelectRows(url.split('?')[1] || ''));
    try { dbInsertRow(JSON.parse(String(init.body))); return new Response(null, { status: 201 }); } catch { return new Response('erreur', { status: 500 }); }
  }
  if (url.startsWith(`${FAKE_DB}/rest/v1/stripe_customers`) || url.startsWith(`${FAKE_DB}/rest/v1/stripe_subscriptions`)) {
    if (dbFail) return new Response('erreur', { status: 500 });
    const u = new URL(url);
    const q = u.searchParams;
    let rows = u.pathname.endsWith('stripe_customers') ? webhookCustomers : webhookSubs;
    const email = (q.get('email') || '').replace(/^eq\./, '');
    if (email) rows = rows.filter((r) => r.email === email);
    if (q.get('livemode') === 'eq.true') rows = rows.filter((r) => r.livemode === true);
    const ids = /^in\.\((.*)\)$/.exec(q.get('customer_id') || '')?.[1]?.split(',');
    if (ids) rows = rows.filter((r) => ids.includes(r.customer_id));
    return json(rows);
  }
  if (url.startsWith('https://app.autocalls.ai/api/white-label/users')) {
    autocallsCalls.push(url);
    const page = Number(new URL(url).searchParams.get('page') || 1);
    return json(autocallsPages[page - 1] ?? { data: [], last_page: autocallsPages.length });
  }
  if (url.startsWith('https://api.stripe.com/')) {
    const headers = Object.fromEntries(Object.entries((init.headers || {}) as Record<string, string>));
    stripeCalls.push({ url, method, headers });
    // Requête qui ne répond jamais (sauf abandon par le délai d’attente).
    if (url.includes('/customers') && new URL(url).searchParams.get('email') === 'lent@example.com') {
      return new Promise<Response>((_, reject) => init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
    }
    return stripeRoute(new URL(url));
  }
  throw new Error(`réseau interdit pendant les tests : ${url}`);
}) as typeof fetch;

const hmacHex = (data: string) => createHmac('sha256', SECRET).update(data).digest('hex');
const quickSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, Math.min(ms, 20)));

function mockReq(o: { method: string; body?: unknown; cookie?: string; origin?: string; host?: string }) {
  return {
    method: o.method, body: o.body, query: {}, socket: { remoteAddress: '127.0.0.1' },
    headers: { host: o.host ?? 'www.permanenceia.com', 'x-forwarded-for': '203.0.113.5, 10.0.0.1', ...(o.cookie ? { cookie: o.cookie } : {}), ...(o.origin ? { origin: o.origin } : {}) },
  } as unknown as NextApiRequest;
}
function mockRes() {
  const r = {
    statusCode: 200, headers: {} as Record<string, unknown>, body: undefined as any,
    setHeader(k: string, v: unknown) { r.headers[k.toLowerCase()] = v; return r; },
    status(code: number) { r.statusCode = code; return r; },
    json(b: unknown) { r.body = b; return r; },
  };
  return r;
}

async function main() {
  const session = await import('@/lib/accountSession');
  const code = await import('@/lib/accountCode');
  const stripe = await import('@/lib/stripeAccount');
  const { findPlatformUser } = await import('@/lib/autocallsAccount');
  const { platformUsersFetcher } = await import('@/lib/relances/autocalls');
  const { deriveKey, emailToken } = await import('@/lib/emailPrefs');
  const { LOCALES } = await import('@/i18n/locales');
  const handler = (await import('@/pages/api/account')).default;

  const tests: Array<[string, () => Promise<void> | void]> = [];
  const test = (name: string, fn: () => Promise<void> | void) => tests.push([name, fn]);
  const reset = () => {
    events = []; dbFail = false; stripeCalls = []; autocallsCalls = []; autocallsPages = []; webhookCustomers = []; webhookSubs = [];
    stripeRoute = () => json({ data: [] });
    process.env.ACCOUNT_CODE_SECRET = SECRET;
    delete process.env.AUTOCALLS_API_KEY; delete process.env.STRIPE_ACCOUNT_KEY;
    stripe.resetProductCache();
  };
  const NOW = Date.UTC(2026, 9, 9, 12, 0, 0);
  /** Code réellement envoyé à cette adresse (marqueur posé par l’envoi), sans passer par le déroulé d’envoi. */
  const markSent = (email: string, purpose: 'lucie' | 'site') => events.push({ kind: 'otp_send', external_id: code.otpKey(code.sentCodeKey(email, purpose)), created_at: new Date().toISOString() });
  /** Envoi réel par le déroulé (compte existant) ; renvoie le code reçu. */
  const sendFor = async (email: string, purpose: 'lucie' | 'site', limiter = code.makeLimiter()) => {
    let got = '';
    await code.sendCodeFlow(email, purpose, { db: memDb, limiter, findUser: async (e) => ({ email: e }), mail: async (c) => { got = c; }, sleep: quickSleep });
    return got;
  };

  // 1. Session ----------------------------------------------------------------------------------------------------
  test('session : aller-retour, adresse normalisée, aucun « @ » dans la valeur', () => {
    reset();
    const v = session.signSession(' Client.Test+x@Example.com ', NOW)!;
    assert.ok(v && !v.includes('@'));
    assert.match(v, /^v1\.[A-Za-z0-9_-]+\.\d+\.[A-Za-z0-9_-]{43}$/);
    const s = session.readSession(v, NOW + 60_000);
    assert.deepEqual(s, { email: 'client.test+x@example.com', exp: Math.floor(NOW / 1000) + 1800 });
  });

  test('session : adresse, expiration ou signature modifiées → refusée', () => {
    reset();
    const v = session.signSession('a@example.com', NOW)!;
    const [p0, , exp, sig] = v.split('.');
    const other = Buffer.from('b@example.com').toString('base64url');
    assert.equal(session.readSession([p0, other, exp, sig].join('.'), NOW), null);
    const [, b64] = v.split('.');
    assert.equal(session.readSession([p0, b64, String(Number(exp) - 1), sig].join('.'), NOW), null);
    const flipped = sig.slice(0, -1) + (sig.endsWith('A') ? 'B' : 'A');
    assert.equal(session.readSession([p0, b64, exp, flipped].join('.'), NOW), null);
    assert.equal(session.readSession(`v2.${b64}.${exp}.${sig}`, NOW), null);
    assert.equal(session.readSession(`${v}.x`, NOW), null);
    assert.equal(session.readSession(undefined, NOW), null);
  });

  test('session : expirée après 30 min, expiration trop lointaine refusée même bien signée', () => {
    reset();
    const v = session.signSession('a@example.com', NOW)!;
    assert.ok(session.readSession(v, NOW + 29 * 60_000));
    assert.equal(session.readSession(v, NOW + 31 * 60_000), null);
    const b64 = Buffer.from('a@example.com').toString('base64url');
    const exp = Math.floor(NOW / 1000) + 1800 + 3600;
    const body = `v1.${b64}.${exp}`;
    const forged = `${body}.${createHmac('sha256', deriveKey('account-session')!).update(body).digest('base64url')}`;
    assert.equal(session.readSession(forged, NOW), null);
  });

  test('session : sans secret, ni signature ni lecture', () => {
    reset();
    const v = session.signSession('a@example.com', NOW)!;
    delete process.env.ACCOUNT_CODE_SECRET;
    assert.equal(session.signSession('a@example.com', NOW), null);
    assert.equal(session.readSession(v, NOW), null);
    process.env.ACCOUNT_CODE_SECRET = 'trop-court';
    assert.equal(session.readSession(v, NOW), null);
  });

  test('session : autre secret → cookie refusé ; clé dérivée distincte de celle des liens de préférences', () => {
    reset();
    const v = session.signSession('a@example.com', NOW)!;
    process.env.ACCOUNT_CODE_SECRET = randomBytes(32).toString('hex');
    assert.equal(session.readSession(v, NOW), null);
    reset();
    assert.ok(!deriveKey('account-session')!.equals(deriveKey('email-pref-link')!));
    assert.ok(!v.split('.')[3].startsWith(emailToken('a@example.com')!.slice(0, 20)));
  });

  test('session : cookie HttpOnly, Secure, SameSite=Lax, Path=/, 30 min ; effacement Max-Age=0', () => {
    const set = session.sessionSetCookie('VALEUR');
    for (const part of ['__Host-pia_account=VALEUR', 'Path=/', 'Max-Age=1800', 'HttpOnly', 'Secure', 'SameSite=Lax']) assert.ok(set.includes(part), part);
    // Préfixe __Host- : Secure, Path=/ et aucun Domain (sinon le navigateur refuse le cookie).
    assert.ok(set.startsWith('__Host-') && !/domain=/i.test(set + session.sessionClearCookie));
    assert.ok(session.sessionClearCookie.includes('Max-Age=0') && session.sessionClearCookie.includes('HttpOnly'));
  });

  test('session : lue parmi d’autres cookies, jamais sous un autre nom (ni sans le préfixe __Host-)', () => {
    reset();
    const v = session.signSession('a@example.com', NOW)!;
    assert.equal(session.readSessionFromCookieHeader(`NEXT_LOCALE=fr; __Host-pia_account=${v}; _ga=GA1.1`, NOW)?.email, 'a@example.com');
    assert.equal(session.readSessionFromCookieHeader(`__Host-pia_account=${v}`, NOW)?.email, 'a@example.com');
    assert.equal(session.readSessionFromCookieHeader(`x__Host-pia_account=${v}`, NOW), null);
    // Cookie du même nom sans préfixe (posé par exemple par un sous-domaine) : ignoré.
    assert.equal(session.readSessionFromCookieHeader(`pia_account=${v}`, NOW), null);
    assert.equal(session.readSessionFromCookieHeader(undefined, NOW), null);
  });

  // 2. Codes ------------------------------------------------------------------------------------------------------
  test('code de Lucie : formule inchangée (HMAC « lucie|email|créneau », 6 chiffres)', () => {
    reset();
    for (const slot of [0, 1, 2_900_000, 2_934_321]) {
      const n = createHmac('sha256', SECRET).update(`lucie|a@example.com|${slot}`).digest().readUInt32BE(0) % 1_000_000;
      assert.equal(code.codeFor('a@example.com', slot), String(n).padStart(6, '0'));
      assert.equal(code.codeFor('a@example.com', slot, 'lucie'), String(n).padStart(6, '0'));
    }
    assert.equal(code.otpKey('a@example.com'), hmacHex('id|a@example.com').slice(0, 32));
    assert.equal(code.usedCodeKey('a@example.com', '123456', 'lucie'), 'a@example.com|code:123456');
    assert.notEqual(code.usedCodeKey('a@example.com', '123456', 'site'), 'a@example.com|code:123456');
  });

  test('code du site : distinct de celui de Lucie, créneau en cours et précédent seulement', () => {
    reset();
    const slots = [10, 11, 12, 13, 14];
    assert.ok(slots.some((s) => code.codeFor('a@example.com', s, 'site') !== code.codeFor('a@example.com', s, 'lucie')));
    const now = 12 * code.CODE_WINDOW_MS + 1000;
    const cur = code.codeFor('a@example.com', 12, 'site');
    assert.ok(code.codeIsValid('a@example.com', cur, 'site', now));
    assert.ok(code.codeIsValid('a@example.com', code.codeFor('a@example.com', 11, 'site'), 'site', now));
    assert.ok(!code.codeIsValid('a@example.com', code.codeFor('a@example.com', 10, 'site'), 'site', now));
    const lucie = code.codeFor('a@example.com', 12, 'lucie');
    if (lucie !== cur && lucie !== code.codeFor('a@example.com', 11, 'site')) assert.ok(!code.codeIsValid('a@example.com', lucie, 'site', now));
    assert.ok(!code.codeIsValid('b@example.com', cur, 'site', now) || code.codeFor('b@example.com', 12, 'site') === cur);
  });

  // 3. Déroulés ---------------------------------------------------------------------------------------------------
  test('envoi : compte inconnu → aucun email, aucun compteur', async () => {
    reset();
    const sent: string[] = [];
    await code.sendCodeFlow('inconnu@example.com', 'site', {
      db: memDb, limiter: code.makeLimiter(), findUser: async () => undefined, mail: async (c) => { sent.push(c); }, sleep: quickSleep,
    });
    assert.equal(sent.length, 0);
    assert.equal(events.length, 0);
  });

  test('envoi : code du site envoyé, 3 au plus par heure (compteur persistant), temps minimal demandé', async () => {
    reset();
    const sent: string[] = [];
    const waits: number[] = [];
    for (let i = 0; i < 4; i++) {
      await code.sendCodeFlow('client@example.com', 'site', {
        db: memDb, limiter: code.makeLimiter(), findUser: async (e) => ({ email: e }), mail: async (c) => { sent.push(c); },
        sleep: (ms) => { waits.push(ms); return quickSleep(ms); },
      });
    }
    assert.equal(sent.length, 3);
    assert.equal(sent[0], code.currentCode('client@example.com', 'site'));
    assert.equal(events.filter((r) => r.kind === 'otp_send' && r.external_id === code.otpKey('client@example.com')).length, 3);
    // Un marqueur « code envoyé » par email réellement parti, hors du compteur des 3 envois.
    assert.equal(events.filter((r) => r.kind === 'otp_send' && r.external_id === code.otpKey(code.sentCodeKey('client@example.com', 'site'))).length, 3);
    assert.equal(waits[0], code.CODE_MIN_RESPONSE_MS);
  });

  test('envoi : limite en mémoire (3), erreur du mailer jamais remontée, adresse masquée dans le journal, aucun marqueur', async () => {
    reset();
    const limiter = code.makeLimiter();
    let tries = 0;
    const logs: string[] = [];
    const realError = console.error;
    console.error = (...a: unknown[]) => { logs.push(a.map(String).join(' ')); };
    try {
      for (let i = 0; i < 5; i++) {
        await code.sendCodeFlow(`m${i % 1}@example.com`, 'site', {
          db: { ...memDb, select: async () => [] }, limiter, findUser: async (e) => ({ email: e }),
          // Message de nodemailer : réponse du serveur SMTP, adresse du destinataire comprise.
          mail: async () => { tries++; throw new Error('Can\'t send mail - all recipients were rejected: 550 5.1.1 <m0@example.com>: Recipient address rejected'); }, sleep: quickSleep,
        });
      }
    } finally { console.error = realError; }
    assert.equal(tries, 3);
    assert.equal(logs.length, 3);
    assert.ok(logs.every((l) => !l.includes('@') && l.includes('<email>')), logs.join(' | '));
    assert.equal(events.filter((r) => r.external_id === code.otpKey(code.sentCodeKey('m0@example.com', 'site'))).length, 0);
  });

  test('envoi : envoi volontairement sauté (mail → false) → aucun marqueur, le code n’est pas accepté', async () => {
    reset();
    let got = '';
    await code.sendCodeFlow('ip@example.com', 'site', {
      db: memDb, limiter: code.makeLimiter(), findUser: async (e) => ({ email: e }), mail: async (c) => { got = c; return false; }, sleep: quickSleep,
    });
    assert.ok(got);
    assert.equal(await code.verifyCodeFlow('ip@example.com', got, 'site', { db: memDb, limiter: code.makeLimiter() }), 'invalid');
  });

  test('vérification : mauvais code invalide (essai compté), bon code accepté une seule fois', async () => {
    reset();
    const deps = { db: memDb, limiter: code.makeLimiter() };
    const good = await sendFor('v@example.com', 'site');
    assert.equal(good, code.currentCode('v@example.com', 'site'));
    const bad = good === '000000' ? '000001' : '000000';
    assert.equal(await code.verifyCodeFlow('v@example.com', bad, 'site', deps), 'invalid');
    assert.equal(events.filter((r) => r.kind === 'otp_try' && r.external_id === code.otpKey('v@example.com')).length, 1);
    assert.equal(await code.verifyCodeFlow('v@example.com', good, 'site', deps), 'ok');
    assert.equal(events.filter((r) => r.kind === 'otp_ok' && r.external_id === code.otpKey(code.usedCodeKey('v@example.com', good, 'site'))).length, 1);
    assert.equal(await code.verifyCodeFlow('v@example.com', good, 'site', deps), 'invalid');
    // Le code de Lucie n’ouvre pas la page (sauf collision improbable).
    const lucie = code.currentCode('v@example.com', 'lucie');
    if (lucie !== good) assert.equal(await code.verifyCodeFlow('v@example.com', lucie, 'site', { db: memDb, limiter: code.makeLimiter() }), 'invalid');
  });

  test('vérification : 6e essai dans l’heure → verrouillé (compteur persistant), 6e sur la même instance → busy', async () => {
    reset();
    for (let i = 0; i < 5; i++) assert.equal(await code.verifyCodeFlow('lock@example.com', '999999', 'site', { db: memDb, limiter: code.makeLimiter() }) === 'locked', false);
    assert.equal(await code.verifyCodeFlow('lock@example.com', code.currentCode('lock@example.com', 'site'), 'site', { db: memDb, limiter: code.makeLimiter() }), 'locked');
    const limiter = code.makeLimiter();
    for (let i = 0; i < 5; i++) await code.verifyCodeFlow('busy@example.com', '999999', 'site', { db: { ...memDb, select: async () => [] }, limiter });
    assert.equal(await code.verifyCodeFlow('busy@example.com', '999999', 'site', { db: memDb, limiter }), 'busy');
  });

  test('vérification : bon code sans code envoyé (aucun marqueur) → invalide, comme un mauvais code', async () => {
    reset();
    const good = code.currentCode('devine@example.com', 'site');
    assert.equal(await code.verifyCodeFlow('devine@example.com', good, 'site', { db: memDb, limiter: code.makeLimiter() }), 'invalid');
    // Marqueur de plus de 20 minutes : toujours refusé.
    events.push({ kind: 'otp_send', external_id: code.otpKey(code.sentCodeKey('devine@example.com', 'site')), created_at: new Date(Date.now() - 21 * 60_000).toISOString() });
    assert.equal(await code.verifyCodeFlow('devine@example.com', good, 'site', { db: memDb, limiter: code.makeLimiter() }), 'invalid');
    // Marqueur de Lucie : n’ouvre pas la page.
    markSent('devine@example.com', 'lucie');
    assert.equal(await code.verifyCodeFlow('devine@example.com', good, 'site', { db: memDb, limiter: code.makeLimiter() }), 'invalid');
    markSent('devine@example.com', 'site');
    assert.equal(await code.verifyCodeFlow('devine@example.com', good, 'site', { db: memDb, limiter: code.makeLimiter() }), 'ok');
  });

  test('vérification : 16e essai sur 24 h → verrouillé, même avec le bon code', async () => {
    reset();
    const key = code.otpKey('jour@example.com');
    // 15 essais étalés sur la journée (aucun dans l’heure : la limite horaire ne joue pas).
    for (let i = 0; i < 15; i++) events.push({ kind: 'otp_try', external_id: key, created_at: new Date(Date.now() - (2 + i) * 3_600_000).toISOString() });
    const good = await sendFor('jour@example.com', 'site');
    assert.equal(await code.verifyCodeFlow('jour@example.com', good, 'site', { db: memDb, limiter: code.makeLimiter() }), 'locked');
    // Essais de plus de 24 h : sans effet.
    reset();
    for (let i = 0; i < 15; i++) events.push({ kind: 'otp_try', external_id: key, created_at: new Date(Date.now() - (25 + i) * 3_600_000).toISOString() });
    const again = await sendFor('jour@example.com', 'site');
    assert.equal(await code.verifyCodeFlow('jour@example.com', again, 'site', { db: memDb, limiter: code.makeLimiter() }), 'ok');
  });

  test('vérification : après une connexion, nouveau code dans le même créneau → code différent, accepté ; ancien code refusé', async () => {
    reset();
    const now = 12 * code.CODE_WINDOW_MS + 1000;
    const deps = { db: memDb, limiter: code.makeLimiter(), now: () => now };
    const send = async () => {
      let got = '';
      await code.sendCodeFlow('gen@example.com', 'site', { db: memDb, limiter: code.makeLimiter(), findUser: async (e) => ({ email: e }), mail: async (c) => { got = c; }, sleep: quickSleep, now: () => now });
      return got;
    };
    const first = await send();
    assert.equal(first, code.codeFor('gen@example.com', 12, 'site'), 'génération 0 : formule d’origine');
    assert.equal(await code.verifyCodeFlow('gen@example.com', first, 'site', deps), 'ok');
    const second = await send();
    assert.notEqual(second, first);
    assert.equal(second, code.codeFor('gen@example.com', 12, 'site', 1));
    assert.equal(await code.verifyCodeFlow('gen@example.com', first, 'site', deps), 'invalid');
    assert.equal(await code.verifyCodeFlow('gen@example.com', second, 'site', deps), 'ok');
    // Code envoyé mais pas utilisé (créneau 12), puis connexion avec un code plus récent (créneau 13) : l’ancien,
    // encore dans sa fenêtre de validité, ne sert plus.
    const unused = code.codeFor('gen@example.com', 12, 'site', 2);
    const later = 13 * code.CODE_WINDOW_MS + 1000;
    const at = (t: number) => ({ db: memDb, limiter: code.makeLimiter(), now: () => t });
    assert.ok(code.codeIsValid('gen@example.com', unused, 'site', later, 2));
    assert.equal(await code.verifyCodeFlow('gen@example.com', code.codeFor('gen@example.com', 13, 'site', 2), 'site', at(later)), 'ok');
    assert.equal(await code.verifyCodeFlow('gen@example.com', unused, 'site', at(later)), 'invalid');
  });

  test('vérification : essai impossible à enregistrer → erreur (accès refusé)', async () => {
    reset();
    dbFail = true;
    await assert.rejects(code.verifyCodeFlow('x@example.com', code.currentCode('x@example.com', 'site'), 'site', { db: memDb, limiter: code.makeLimiter() }));
  });

  test('email du code : 7 langues, code dans l’objet et le corps, sens d’écriture, marque du marché', () => {
    reset();
    for (const l of LOCALES) {
      const m = code.buildAccountCodeMail(l, '048213');
      assert.ok(m.subject.includes('048213') && m.text.includes('048213') && m.html.includes('048213'), l);
      assert.ok(m.html.includes(`dir="${l === 'he' ? 'rtl' : 'ltr'}"`), l);
      assert.equal(m.fromName, l === 'fr' ? 'Permanence IA' : l === 'it' ? 'PermanenceIA' : 'PermanenceAI');
      assert.ok(!/undefined|\$\{/.test(m.subject + m.text + m.html), l);
    }
    assert.ok(code.buildAccountCodeMail('fr', '048213').subject.includes(' :'), 'espace insécable avant « : » en français');
  });

  // 4. Autocalls --------------------------------------------------------------------------------------------------
  test('Autocalls : recherche paginée, s’arrête dès que l’adresse est trouvée, sans clé → erreur', async () => {
    reset();
    await assert.rejects(findPlatformUser('a@example.com'), /AUTOCALLS_API_KEY/);
    process.env.AUTOCALLS_API_KEY = 'cle-de-test';
    autocallsPages = [
      { data: [{ id: 1, email: 'autre@example.com' }], last_page: 3 },
      { data: [{ id: 2, email: 'Client@Example.com', minutes_balance: 12 }], last_page: 3 },
      { data: [{ id: 3, email: 'encore@example.com' }], last_page: 3 },
    ];
    const u = await findPlatformUser('client@example.com');
    assert.equal(u?.id, 2);
    assert.equal(autocallsCalls.length, 2);
    autocallsCalls = [];
    assert.equal(await findPlatformUser('absent@example.com'), undefined);
    assert.equal(autocallsCalls.length, 3);
  });

  test('Autocalls : instantané des relances (même pagination) → tous les comptes avec email, jusqu’à la dernière page', async () => {
    reset();
    assert.equal(platformUsersFetcher(), undefined);
    process.env.AUTOCALLS_API_KEY = 'cle-de-test';
    autocallsPages = [
      { data: [{ id: 1, email: 'a@example.com' }, { id: 2 }], last_page: 2 },
      { data: [{ id: 3, email: 'b@example.com' }], last_page: 2 },
    ];
    const users = await platformUsersFetcher()!();
    assert.deepEqual(users.map((u) => u.id), [1, 3]);
    assert.equal(autocallsCalls.length, 2);
  });

  // 5. Stripe : fonctions pures -----------------------------------------------------------------------------------
  const sub = (o: Record<string, unknown>) => ({ id: `sub_${Math.random().toString(36).slice(2)}`, created: 100, ...o });
  test('Stripe : choix du client (abonnement en cours > abonnement terminé > plus récent)', () => {
    const oldC = { id: 'cus_old', created: 100 };
    const newC = { id: 'cus_new', created: 200 };
    assert.equal(stripe.pickCustomer([]), null);
    assert.equal(stripe.pickCustomer([{ customer: oldC, subscriptions: [] }])!.customer.id, 'cus_old');
    const a = stripe.pickCustomer([{ customer: oldC, subscriptions: [sub({ status: 'active', customer: 'cus_old' })] }, { customer: newC, subscriptions: [] }])!;
    assert.equal(a.customer.id, 'cus_old');
    assert.equal(a.subscription.status, 'active');
    assert.ok(!('__owner' in a.subscription));
    assert.equal(stripe.pickCustomer([{ customer: oldC, subscriptions: [] }, { customer: newC, subscriptions: [] }])!.customer.id, 'cus_new');
    const c = stripe.pickCustomer([{ customer: oldC, subscriptions: [sub({ status: 'canceled' })] }, { customer: newC, subscriptions: [] }])!;
    assert.equal(c.customer.id, 'cus_old');
    assert.equal(c.subscription.status, 'canceled');
    assert.equal(stripe.pickCustomer([{ customer: oldC, subscriptions: [sub({ status: 'canceled', created: 900 })] }, { customer: newC, subscriptions: [sub({ status: 'trialing', created: 300 })] }])!.customer.id, 'cus_new');
  });

  test('Stripe : choix de l’abonnement (essai > actif > impayé…, puis le plus récent ; sinon le dernier terminé)', () => {
    assert.equal(stripe.pickSubscription([]), null);
    assert.equal(stripe.pickSubscription([sub({ status: 'active', created: 500 }), sub({ status: 'trialing', created: 100 })]).status, 'trialing');
    assert.equal(stripe.pickSubscription([sub({ status: 'active', created: 100 }), sub({ status: 'active', created: 500, id: 'sub_new' })]).id, 'sub_new');
    assert.equal(stripe.pickSubscription([sub({ status: 'canceled', created: 100 }), sub({ status: 'canceled', created: 500, id: 'sub_last' })]).id, 'sub_last');
    assert.equal(stripe.pickSubscription([sub({ status: 'canceled', created: 900 }), sub({ status: 'past_due', created: 100 })]).status, 'past_due');
  });

  test('Stripe : groupes de statut', () => {
    const want: Record<string, string> = {
      trialing: 'trial', active: 'active', past_due: 'past_due', unpaid: 'past_due', incomplete: 'past_due',
      canceled: 'canceled', incomplete_expired: 'canceled', paused: 'paused', inconnu: 'active',
    };
    for (const [s, g] of Object.entries(want)) assert.equal(stripe.statusGroup(s), g, s);
  });

  test('Stripe : vue d’abonnement (période sur l’élément ou l’abonnement, montant × quantité, résiliation, remise)', () => {
    const recent = stripe.toSubscriptionView({
      status: 'trialing', trial_end: 1_800_000_000, cancel_at_period_end: true, discounts: ['di_1'],
      items: { data: [{ current_period_end: 1_800_000_000, quantity: 2, price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' }, product: 'prod_x' } }] },
    }, { name: 'Receptionist' });
    assert.equal(recent.group, 'trial');
    assert.equal(recent.amount, 19800);
    assert.equal(recent.interval, 'month');
    assert.equal(recent.planSlug, 'receptionniste');
    assert.equal(recent.periodEnd, new Date(1_800_000_000_000).toISOString());
    assert.equal(recent.cancelAt, recent.periodEnd);
    assert.equal(recent.hasDiscount, true);
    const old = stripe.toSubscriptionView({
      status: 'active', current_period_end: 1_700_000_000, cancel_at: 1_750_000_000,
      items: { data: [{ price: { unit_amount: 24900, currency: 'usd', recurring: { interval: 'year' }, product: { name: 'Call Centre' } } }] },
    }, null);
    assert.equal(old.periodEnd, new Date(1_700_000_000_000).toISOString());
    assert.equal(old.cancelAt, new Date(1_750_000_000_000).toISOString());
    assert.equal(old.amount, 24900);
    assert.equal(old.planSlug, 'centre-appels');
    assert.equal(old.hasDiscount, false);
    const ended = stripe.toSubscriptionView({ status: 'canceled', canceled_at: 1_600_000_000, items: { data: [] } }, null);
    assert.equal(ended.endedAt, new Date(1_600_000_000_000).toISOString());
    assert.equal(ended.amount, null);
  });

  test('Stripe : forfait reconnu (identifiant Autocalls en métadonnée, puis nom)', () => {
    assert.equal(stripe.planSlugFromProduct({ name: 'Receptionist' }), 'receptionniste');
    assert.equal(stripe.planSlugFromProduct({ name: 'Réceptionniste IA' }), 'receptionniste');
    assert.equal(stripe.planSlugFromProduct({ name: 'Call Centre' }), 'centre-appels');
    assert.equal(stripe.planSlugFromProduct({ name: 'Call Center Pro' }), 'centre-appels');
    assert.equal(stripe.planSlugFromProduct({ name: 'Assistant' }), 'assistant');
    assert.equal(stripe.planSlugFromProduct({ name: 'Mystère' }), null);
    assert.equal(stripe.planSlugFromProduct({ name: 'Plan', metadata: { plan_id: '1647' } }), 'assistant');
    assert.equal(stripe.planSlugFromProduct(null), null);
  });

  test('Stripe : factures (brouillon écarté, liens non Stripe refusés) et cartes', () => {
    assert.equal(stripe.toInvoiceView({ status: 'draft', created: 1 }), null);
    assert.equal(stripe.toInvoiceView({ status: 'bizarre', created: 1 }), null);
    const inv = stripe.toInvoiceView({
      status: 'paid', number: 'ABC-0001', created: 1_700_000_000, status_transitions: { finalized_at: 1_700_000_100 }, total: 9900, currency: 'usd',
      hosted_invoice_url: 'https://invoice.stripe.com/i/acct_1/test', invoice_pdf: 'javascript:alert(1)',
    })!;
    assert.equal(inv.date, new Date(1_700_000_100_000).toISOString());
    assert.equal(inv.hostedUrl, 'https://invoice.stripe.com/i/acct_1/test');
    assert.equal(inv.pdfUrl, null);
    assert.equal(stripe.safeStripeUrl('http://pay.stripe.com/x'), null);
    assert.equal(stripe.safeStripeUrl('https://evil.example/stripe.com'), null);
    assert.equal(stripe.safeStripeUrl('https://stripe.com.evil.example/x'), null);
    assert.equal(stripe.safeStripeUrl('https://pay.stripe.com/invoice/x/pdf'), 'https://pay.stripe.com/invoice/x/pdf');
    assert.deepEqual(stripe.toCardView({ type: 'card', card: { brand: 'visa', last4: '4242', exp_month: 8, exp_year: 2028 } }), { brand: 'Visa', last4: '4242', expMonth: 8, expYear: 2028 });
    assert.equal(stripe.toCardView({ type: 'card', card: { brand: 'visa', display_brand: 'cartes_bancaires', last4: '1' } })!.brand, 'CB');
    assert.equal(stripe.toCardView({ type: 'sepa_debit', sepa_debit: { last4: '3000' } })!.brand, 'SEPA');
    assert.equal(stripe.toCardView(null), null);
  });

  test('Stripe : forfait reconnu d’après le prix de la grille (USD, mensuel ou annuel) seulement', () => {
    assert.equal(stripe.planSlugFromPrice(9900, 'usd', 'month'), 'receptionniste');
    assert.equal(stripe.planSlugFromPrice(249000, 'usd', 'year'), 'assistant');
    assert.equal(stripe.planSlugFromPrice(49900, 'USD', 'month'), 'centre-appels');
    assert.equal(stripe.planSlugFromPrice(9900, 'eur', 'month'), null);
    assert.equal(stripe.planSlugFromPrice(9900, 'usd', 'year'), null);
    assert.equal(stripe.planSlugFromPrice(12300, 'usd', 'month'), null);
    assert.equal(stripe.planSlugFromPrice(null, 'usd', 'month'), null);
  });

  test('Stripe : devise de l’abonnement différente du prix → montant inconnu ; élément au compteur hors du montant', () => {
    const other = stripe.toSubscriptionView({ status: 'active', currency: 'eur', items: { data: [{ quantity: 1, price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' } } }] } }, { name: 'Receptionist' });
    assert.equal(other.amount, null);
    assert.equal(other.currency, 'eur');
    assert.equal(other.planSlug, 'receptionniste');
    const metered = stripe.toSubscriptionView({ status: 'active', currency: 'usd', items: { data: [
      { price: { unit_amount: 39, currency: 'usd', recurring: { interval: 'month', usage_type: 'metered' } } },
      { quantity: 1, price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month', usage_type: 'licensed' } } },
    ] } }, null);
    assert.equal(metered.amount, 9900);
    assert.equal(metered.interval, 'month');
    // Produit illisible : forfait d’après le prix.
    assert.equal(metered.planSlug, 'receptionniste');
  });

  test('Stripe : clients d’une autre adresse écartés, recherche en second recours', async () => {
    reset();
    const calls: [string, [string, string][]][] = [];
    const get = (async (path: string, params: [string, string][] = []) => {
      calls.push([path, params]);
      if (path === '/customers') return { data: [] };
      return { data: [{ id: 'cus_a', email: 'Client@Example.com', created: 1 }, { id: 'cus_b', email: 'autre@example.com', created: 2 }, { id: 'cus_c', email: 'client@example.com', deleted: true }] };
    }) as any;
    const list = await stripe.findCustomers(get, 'client@example.com');
    assert.deepEqual(list.map((c) => c.id), ['cus_a']);
    assert.deepEqual(calls.map(([p]) => p), ['/customers', '/customers/search']);
    assert.ok(calls[1][1].some(([k, v]) => k === 'query' && v === 'email:"client@example.com"'));
  });

  // 6. Stripe : lecture avec un fetch simulé ---------------------------------------------------------------------
  test('Stripe : sans clé → non configuré, aucun appel', async () => {
    reset();
    assert.deepEqual(await stripe.loadStripeBilling('client@example.com'), { state: 'unconfigured' });
    assert.equal(stripeCalls.length, 0);
  });

  test('Stripe : erreur HTTP ou délai dépassé → indisponible', async () => {
    reset();
    const realError = console.error;
    const logs: string[] = [];
    console.error = (...a: unknown[]) => { logs.push(a.map(String).join(' ')); };
    try {
      stripeRoute = () => json({ error: {} }, 500);
      assert.deepEqual(await stripe.loadStripeBilling('client@example.com', stripe.stripeReader('rk_test_cle')), { state: 'unavailable' });
      const started = Date.now();
      assert.deepEqual(await stripe.loadStripeBilling('lent@example.com', stripe.stripeReader('rk_test_cle', undefined, 50)), { state: 'unavailable' });
      assert.ok(Date.now() - started < 2000);
    } finally { console.error = realError; }
    assert.ok(logs.every((l) => !l.includes('rk_test_cle') && !l.includes('@')), 'ni clé ni email dans le journal');
  });

  test('Stripe : GET seulement, clé en Bearer, factures et carte du seul client choisi', async () => {
    reset();
    process.env.STRIPE_ACCOUNT_KEY = 'rk_test_cle';
    stripeRoute = (u) => {
      const p = u.pathname.replace('/v1', '');
      const q = u.searchParams;
      if (p === '/customers') {
        return json({ data: [
          { id: 'cus_new', email: 'client@example.com', created: 300, invoice_settings: {} },
          { id: 'cus_old', email: 'client@example.com', created: 100, invoice_settings: {} },
          { id: 'cus_evil', email: 'autre@example.com', created: 500 },
        ] });
      }
      if (p === '/subscriptions') {
        if (q.get('customer') === 'cus_old') {
          return json({ data: [{
            id: 'sub_1', customer: 'cus_old', status: 'active', created: 100,
            default_payment_method: { type: 'card', card: { brand: 'mastercard', last4: '5454', exp_month: 1, exp_year: 2030 } },
            items: { data: [{ current_period_end: 1_800_000_000, quantity: 1, price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' }, product: 'prod_recep' } }] },
          }, { id: 'sub_intrus', customer: 'cus_evil', status: 'trialing', created: 900 }] });
        }
        return json({ data: [] });
      }
      if (p === '/invoices') {
        return json({ data: [
          { id: 'in_1', customer: 'cus_old', status: 'paid', number: 'N-1', created: 1_700_000_000, total: 9900, currency: 'usd', hosted_invoice_url: 'https://invoice.stripe.com/i/1', invoice_pdf: 'https://pay.stripe.com/invoice/1/pdf' },
          { id: 'in_2', customer: 'cus_old', status: 'draft', created: 1_700_000_500, total: 9900, currency: 'usd' },
          { id: 'in_3', customer: 'cus_evil', status: 'paid', created: 1_700_000_600, total: 1, currency: 'usd' },
        ] });
      }
      if (p === '/products/prod_recep') return json({ id: 'prod_recep', name: 'Receptionist' });
      return json({ error: 'inattendu' }, 404);
    };
    const view = await stripe.loadStripeBilling('client@example.com');
    assert.equal(view.state, 'ok');
    if (view.state !== 'ok') return;
    assert.equal(view.subscription?.planSlug, 'receptionniste');
    assert.equal(view.subscription?.group, 'active');
    assert.equal(view.subscription?.amount, 9900);
    assert.deepEqual(view.card, { brand: 'Mastercard', last4: '5454', expMonth: 1, expYear: 2030 });
    assert.ok(Array.isArray(view.invoices));
    assert.deepEqual((view.invoices as import('@/lib/stripeAccount').InvoiceView[]).map((i) => i.number), ['N-1']);
    assert.ok(stripeCalls.length > 0);
    for (const c of stripeCalls) {
      assert.equal(c.method, 'GET', c.url);
      assert.equal(c.headers.Authorization, 'Bearer rk_test_cle');
    }
    const invoiceCalls = stripeCalls.filter((c) => new URL(c.url).pathname === '/v1/invoices');
    assert.equal(invoiceCalls.length, 1);
    assert.equal(new URL(invoiceCalls[0].url).searchParams.get('customer'), 'cus_old');
    assert.ok(!stripeCalls.some((c) => c.url.includes('cus_evil')), 'aucune lecture du client d’une autre adresse');
    // Nom du produit gardé en mémoire : un second chargement ne le redemande pas.
    stripeCalls = [];
    await stripe.loadStripeBilling('client@example.com');
    assert.ok(!stripeCalls.some((c) => c.url.includes('/products/')));
  });

  test('Stripe : aucun client avec cette adresse → no_customer (distinct d’un client sans abonnement)', async () => {
    reset();
    process.env.STRIPE_ACCOUNT_KEY = 'rk_test_cle';
    assert.deepEqual(await stripe.loadStripeBilling('nouveau@example.com'), { state: 'no_customer' });
    assert.deepEqual(stripeCalls.map((c) => new URL(c.url).pathname), ['/v1/customers', '/v1/customers/search']);
  });

  test('Stripe : produit en 403, carte et factures en erreur → forfait affiché quand même (sans nom), le reste « indisponible »', async () => {
    reset();
    process.env.STRIPE_ACCOUNT_KEY = 'rk_test_cle';
    stripeRoute = (u) => {
      const p = u.pathname.replace('/v1', '');
      if (p === '/customers') return json({ data: [{ id: 'cus_1', email: 'client@example.com', created: 1, invoice_settings: {} }] });
      if (p === '/subscriptions') {
        return json({ data: [{ id: 'sub_1', customer: 'cus_1', status: 'trialing', created: 1, trial_end: 1_800_000_000, currency: 'usd',
          items: { data: [{ quantity: 1, current_period_end: 1_800_000_000, price: { unit_amount: 12300, currency: 'usd', recurring: { interval: 'month' }, product: 'prod_inconnu' } }] } }] });
      }
      if (p.startsWith('/products/') || p === '/payment_methods') return json({ error: { type: 'invalid_request_error' } }, 403);
      if (p === '/invoices') return json({ error: {} }, 500);
      return json({}, 404);
    };
    const logs: string[] = [];
    const realError = console.error;
    console.error = (...a: unknown[]) => { logs.push(a.map(String).join(' ')); };
    let view: Awaited<ReturnType<typeof stripe.loadStripeBilling>>;
    try { view = await stripe.loadStripeBilling('client@example.com'); } finally { console.error = realError; }
    assert.equal(view.state, 'ok');
    if (view.state !== 'ok') return;
    assert.equal(view.subscription?.group, 'trial');
    assert.equal(view.subscription?.planName, null);
    assert.equal(view.subscription?.planSlug, null);
    assert.equal(view.subscription?.amount, 12300);
    assert.equal(view.subscription?.trialEnd, new Date(1_800_000_000_000).toISOString());
    assert.equal(view.card, 'unavailable');
    assert.equal(view.invoices, 'unavailable');
    assert.equal(logs.length, 3);
    assert.ok(logs.every((l) => !l.includes('@') && !l.includes('rk_test_cle')));
  });

  /** Fausse base pour les tables du webhook (requêtes notées ; lignes renvoyées telles quelles). */
  const fakeBillingDb = (customers: any[], subs: any[], queries: string[] = []) => ({
    select: async <T,>(table: string, query: string) => { queries.push(`${table}?${query}`); return (table === 'stripe_customers' ? customers : subs) as unknown as T[]; },
  });

  test('Base (webhook) : sans clé, forfait lu dans les tables du webhook (mode réel, client de l’adresse seulement)', async () => {
    reset();
    const queries: string[] = [];
    const db = fakeBillingDb([{ customer_id: 'cus_a' }, { customer_id: 'pas-un-id' }], [
      { subscription_id: 'sub_old', customer_id: 'cus_a', status: 'canceled', ended_at: '2026-09-01T00:00:00Z', last_event_at: '2026-09-01T00:00:00Z' },
      { subscription_id: 'sub_1', customer_id: 'cus_a', status: 'trialing', trial_start: '2026-10-08T10:00:00Z', trial_end: '2026-10-22T10:00:00+00:00', current_period_end: '2026-10-22T10:00:00Z', cancel_at_period_end: false, price_amount: 9900, currency: 'usd', billing_interval: 'month' },
      // Ligne d’un autre client (renvoyée par erreur) : jamais retenue.
      { subscription_id: 'sub_intrus', customer_id: 'cus_autre', status: 'trialing', trial_start: '2026-10-09T10:00:00Z', price_amount: 49900, currency: 'usd', billing_interval: 'month' },
    ], queries);
    const view = await stripe.loadStripeBilling('client+x@example.com', undefined, db);
    assert.equal(view.state, 'partial');
    if (view.state !== 'partial') return;
    assert.equal(view.subscription.group, 'trial');
    assert.equal(view.subscription.planSlug, 'receptionniste');
    assert.equal(view.subscription.amount, 9900);
    assert.equal(view.subscription.trialEnd, '2026-10-22T10:00:00.000Z');
    assert.equal(view.subscription.cancelAt, null);
    assert.ok(queries[0].startsWith('stripe_customers?') && queries[0].includes('email=eq.client%2Bx%40example.com') && queries[0].includes('livemode=eq.true'), queries[0]);
    assert.ok(queries[1].startsWith('stripe_subscriptions?') && queries[1].includes('customer_id=in.(cus_a)&') && queries[1].includes('livemode=eq.true'), queries[1]);
    assert.equal(stripeCalls.length, 0);
  });

  test('Base (webhook) : aucune ligne ou base en erreur → non configuré (journal sans adresse) ; résiliation programmée', async () => {
    reset();
    assert.deepEqual(await stripe.loadStripeBilling('x@example.com', undefined, fakeBillingDb([], [])), { state: 'unconfigured' });
    assert.deepEqual(await stripe.loadStripeBilling('x@example.com', undefined, fakeBillingDb([{ customer_id: 'cus_a' }], [])), { state: 'unconfigured' });
    const logs: string[] = [];
    const realError = console.error;
    console.error = (...a: unknown[]) => { logs.push(a.map(String).join(' ')); };
    try {
      const broken = { select: async () => { throw new Error('Supabase stripe_customers 404 pour x@example.com'); } };
      assert.deepEqual(await stripe.loadStripeBilling('x@example.com', undefined, broken), { state: 'unconfigured' });
    } finally { console.error = realError; }
    assert.ok(logs.length === 1 && !logs[0].includes('@'), logs.join(' | '));
    const v = stripe.rowToSubscriptionView({
      subscription_id: 's', customer_id: 'cus_a', status: 'active', trial_start: null, trial_end: null, current_period_end: '2026-11-01T00:00:00Z',
      cancel_at_period_end: true, canceled_at: null, ended_at: null, price_amount: 249000, currency: 'usd', billing_interval: 'year', last_event_at: null, updated_at: null,
    });
    assert.equal(v.cancelAt, '2026-11-01T00:00:00.000Z');
    assert.equal(v.planSlug, 'assistant');
    assert.equal(v.group, 'active');
  });

  test('Stripe en panne → forfait d’après la base s’il y est, sinon indisponible', async () => {
    reset();
    stripeRoute = () => json({ error: {} }, 500);
    const realError = console.error;
    console.error = () => undefined;
    try {
      const db = fakeBillingDb([{ customer_id: 'cus_a' }], [{ subscription_id: 'sub_1', customer_id: 'cus_a', status: 'past_due', price_amount: 9900, currency: 'usd', billing_interval: 'month', current_period_end: '2026-11-01T00:00:00Z' }]);
      const v = await stripe.loadStripeBilling('client@example.com', stripe.stripeReader('rk_test_cle'), db);
      assert.equal(v.state, 'partial');
      if (v.state === 'partial') assert.equal(v.subscription.group, 'past_due');
      assert.deepEqual(await stripe.loadStripeBilling('client@example.com', stripe.stripeReader('rk_test_cle'), fakeBillingDb([], [])), { state: 'unavailable' });
    } finally { console.error = realError; }
  });

  // 7. Route /api/account -----------------------------------------------------------------------------------------
  const call = async (o: Parameters<typeof mockReq>[0]) => {
    const res = mockRes();
    await handler(mockReq(o), res as unknown as NextApiResponse);
    return res;
  };

  test('route : GET sans cookie → 401, autre méthode → 405', async () => {
    reset();
    const r = await call({ method: 'GET' });
    assert.equal(r.statusCode, 401);
    assert.equal(r.headers['cache-control'], 'no-store');
    const d = await call({ method: 'DELETE' });
    assert.equal(d.statusCode, 405);
    assert.equal(d.headers.allow, 'GET, POST');
  });

  test('route : bon code → 200 et cookie de session ; mauvais code → 401 ; entrée invalide → 400', async () => {
    reset();
    const good = code.currentCode('route@example.com', 'site');
    markSent('route@example.com', 'site');
    const ok = await call({ method: 'POST', origin: 'https://www.permanenceia.com', body: { action: 'verify', email: 'Route@Example.com', code: good } });
    assert.equal(ok.statusCode, 200);
    const cookie = String(ok.headers['set-cookie']);
    assert.match(cookie, /^__Host-pia_account=v1\.[^;]+; Path=\/; Max-Age=1800; HttpOnly; Secure; SameSite=Lax$/);
    assert.equal(session.readSessionFromCookieHeader(cookie.split(';')[0])?.email, 'route@example.com');
    const bad = await call({ method: 'POST', body: { action: 'verify', email: 'route2@example.com', code: good === '123456' ? '654321' : '123456' } });
    assert.equal(bad.statusCode, 401);
    assert.equal(bad.headers['set-cookie'], undefined);
    assert.equal((await call({ method: 'POST', body: { action: 'verify', email: 'pas-une-adresse', code: '123456' } })).statusCode, 400);
    assert.equal((await call({ method: 'POST', body: { action: 'verify', email: 'route@example.com', code: '12' } })).statusCode, 400);
  });

  test('route : origine étrangère → 403, base en panne → 503 sans cookie', async () => {
    reset();
    const r = await call({ method: 'POST', origin: 'https://evil.example', body: { action: 'verify', email: 'a@example.com', code: '123456' } });
    assert.equal(r.statusCode, 403);
    assert.equal((await call({ method: 'POST', origin: 'null', body: { action: 'logout' } })).statusCode, 403);
    // Hôte interne de l’hébergeur différent : l’adresse officielle du site reste acceptée.
    assert.equal((await call({ method: 'POST', host: 'voiceia-abc.a.run.app', origin: 'https://www.permanenceia.com', body: { action: 'logout' } })).statusCode, 200);
    dbFail = true;
    const realError = console.error;
    console.error = () => undefined;
    try {
      const down = await call({ method: 'POST', body: { action: 'verify', email: 'panne@example.com', code: code.currentCode('panne@example.com', 'site') } });
      assert.equal(down.statusCode, 503);
      assert.equal(down.headers['set-cookie'], undefined);
    } finally { console.error = realError; }
  });

  test('route : GET avec session → seulement le compte de la session (Autocalls), Stripe non configuré', async () => {
    reset();
    process.env.AUTOCALLS_API_KEY = 'cle-de-test';
    autocallsPages = [{ data: [
      { id: 7, name: 'Autre Client', email: 'autre@example.com', minutes_balance: 999, credits_balance: 5, created_at: '2026-01-01T00:00:00Z' },
      { id: 8, name: 'Marie Durand', email: 'Marie@Example.com', minutes_balance: '30', credits_balance: 0, created_at: '2026-10-01T10:00:00.000000Z' },
    ], last_page: 1 }];
    const v = session.signSession('marie@example.com')!;
    const r = await call({ method: 'GET', cookie: `NEXT_LOCALE=fr; __Host-pia_account=${v}` });
    assert.equal(r.statusCode, 200);
    assert.deepEqual(r.body.summary.platform, { state: 'ok', name: 'Marie Durand', createdAt: '2026-10-01T10:00:00.000000Z', minutes: 30, messageCredits: 0 });
    assert.deepEqual(r.body.summary.billing, { state: 'unconfigured' });
    assert.equal(r.body.summary.email, 'marie@example.com');
    const out = JSON.stringify(r.body);
    assert.ok(!out.includes('autre@example.com') && !out.includes('Autre Client') && !out.includes('999'));
    assert.equal(stripeCalls.length, 0);
  });

  test('route : Autocalls indisponible (clé absente) → solde indisponible (pas d’erreur 5xx) ; compte absent → not_found', async () => {
    reset();
    const realError = console.error;
    console.error = () => undefined;
    try {
      const v = session.signSession('marie@example.com')!;
      const r = await call({ method: 'GET', cookie: `__Host-pia_account=${v}` });
      assert.equal(r.statusCode, 200);
      assert.deepEqual(r.body.summary.platform, { state: 'unavailable' });
    } finally { console.error = realError; }
    process.env.AUTOCALLS_API_KEY = 'cle-de-test';
    autocallsPages = [{ data: [{ id: 1, email: 'autre@example.com' }], last_page: 1 }];
    const r2 = await call({ method: 'GET', cookie: `__Host-pia_account=${session.signSession('absent@example.com')}` });
    assert.deepEqual(r2.body.summary.platform, { state: 'not_found' });
  });

  test('route : déconnexion → cookie effacé ; action inconnue → 400 ; robot (champ piège) → 200 sans envoi', async () => {
    reset();
    const r = await call({ method: 'POST', body: { action: 'logout' } });
    assert.equal(r.statusCode, 200);
    assert.ok(String(r.headers['set-cookie']).includes('Max-Age=0'));
    assert.equal((await call({ method: 'POST', body: { action: 'autre' } })).statusCode, 400);
    const bot = await call({ method: 'POST', body: { action: 'send_code', email: 'a@example.com', website: 'spam' } });
    assert.equal(bot.statusCode, 200);
    assert.equal(events.length, 0);
    assert.equal((await call({ method: 'POST', body: { action: 'send_code', email: 'pas-une-adresse' } })).statusCode, 400);
  });

  test('route : 21e vérification de la journée depuis une même IP → 429 (compteur persistant), sans cookie', async () => {
    reset();
    const ipKey = code.otpKey('ip|try|203.0.113.5');
    for (let i = 0; i < 20; i++) events.push({ kind: 'otp_ip', external_id: ipKey, created_at: new Date().toISOString() });
    markSent('ip-limite@example.com', 'site');
    const body = { action: 'verify', email: 'ip-limite@example.com', code: code.currentCode('ip-limite@example.com', 'site') };
    const r = await call({ method: 'POST', body });
    assert.equal(r.statusCode, 429);
    assert.equal(r.headers['set-cookie'], undefined);
    // 20e vérification : acceptée et comptée.
    reset();
    for (let i = 0; i < 19; i++) events.push({ kind: 'otp_ip', external_id: ipKey, created_at: new Date().toISOString() });
    markSent('ip-limite@example.com', 'site');
    const ok = await call({ method: 'POST', body });
    assert.equal(ok.statusCode, 200);
    assert.equal(events.filter((e) => e.kind === 'otp_ip' && e.external_id === ipKey).length, 20);
  });

  test('route : GET sans clé Stripe → forfait lu dans les tables du webhook (adresse de la session, mode réel)', async () => {
    reset();
    process.env.AUTOCALLS_API_KEY = 'cle-de-test';
    autocallsPages = [{ data: [{ id: 8, name: 'Marie', email: 'marie@example.com', minutes_balance: 30, credits_balance: 0, created_at: '2026-10-01' }], last_page: 1 }];
    webhookCustomers = [
      { customer_id: 'cus_m', email: 'marie@example.com', livemode: true },
      { customer_id: 'cus_t', email: 'marie@example.com', livemode: false },
      { customer_id: 'cus_o', email: 'autre@example.com', livemode: true },
    ];
    webhookSubs = [
      { subscription_id: 'sub_m', customer_id: 'cus_m', status: 'trialing', trial_end: '2026-10-22T10:00:00Z', price_amount: 9900, currency: 'usd', billing_interval: 'month', livemode: true },
      { subscription_id: 'sub_t', customer_id: 'cus_t', status: 'active', price_amount: 100, currency: 'usd', billing_interval: 'month', livemode: false },
      { subscription_id: 'sub_o', customer_id: 'cus_o', status: 'active', price_amount: 49900, currency: 'usd', billing_interval: 'month', livemode: true },
    ];
    const r = await call({ method: 'GET', cookie: `__Host-pia_account=${session.signSession('marie@example.com')}` });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.summary.billing.state, 'partial');
    assert.equal(r.body.summary.billing.subscription.group, 'trial');
    assert.equal(r.body.summary.billing.subscription.planSlug, 'receptionniste');
    assert.equal(r.body.summary.billing.subscription.amount, 9900);
    assert.equal(stripeCalls.length, 0);
  });

  // 8. Lucie (/api/agent/account) : comportement inchangé après la mise en commun du code -------------------------
  const lucie = (await import('@/pages/api/agent/account')).default;
  const callLucie = async (body: Record<string, unknown>) => {
    const res = mockRes();
    // Journal du contrôle des jetons de webhooks ([auth] …) : sans intérêt ici.
    const realInfo = console.info;
    console.info = () => undefined;
    try { await lucie(mockReq({ method: 'POST', body }), res as unknown as NextApiResponse); } finally { console.info = realInfo; }
    return res;
  };

  test('Lucie : mauvais code ou code du site → refusé (mêmes messages) ; bon code → dossier', async () => {
    reset();
    process.env.AUTOCALLS_API_KEY = 'cle-de-test';
    autocallsPages = [{ data: [{ id: 8, name: 'Marie Durand', email: 'marie@example.com', minutes_balance: 30, credits_balance: 0, created_at: '2026-10-01' }], last_page: 1 }];
    const good = code.currentCode('marie@example.com', 'lucie');
    const site = code.currentCode('marie@example.com', 'site');
    markSent('marie@example.com', 'lucie');
    const wrong = await callLucie({ action: 'lookup', email: 'marie@example.com', code: good === '111111' ? '222222' : '111111' });
    assert.equal(wrong.statusCode, 200);
    assert.deepEqual(wrong.body, { verified: false, message: 'Code incorrect, expiré ou déjà utilisé : proposez d’envoyer un nouveau code.' });
    if (site !== good) assert.equal((await callLucie({ action: 'lookup', email: 'marie@example.com', code: site })).body.verified, false);
    const realError = console.error;
    console.error = () => undefined;
    try {
      const ok = await callLucie({ action: 'lookup', email: 'Marie@example.com', code: good });
      assert.equal(ok.statusCode, 200);
      assert.equal(ok.body.verified, true);
      assert.equal(ok.body.minutes_left, 30);
      assert.equal(ok.body.name, 'Marie Durand');
      // Marqueur de code utilisé identique à l’ancien (« email|code:123456 ») : le même code ne resservira pas.
      assert.ok(events.some((r) => r.kind === 'otp_ok' && r.external_id === hmacHex(`id|marie@example.com|code:${good}`).slice(0, 32)));
      assert.equal((await callLucie({ action: 'lookup', email: 'marie@example.com', code: good })).body.verified, false);
    } finally { console.error = realError; }
  });

  test('Lucie : 6e essai dans l’heure → 429 « dossier verrouillé »', async () => {
    reset();
    // Essais déjà enregistrés par une autre instance (compteur persistant).
    for (let i = 0; i < 5; i++) events.push({ kind: 'otp_try', external_id: hmacHex('id|lock@example.com').slice(0, 32), created_at: new Date().toISOString() });
    const r = await callLucie({ action: 'lookup', email: 'lock@example.com', code: '123456' });
    assert.equal(r.statusCode, 429);
    assert.match(r.body.message, /verrouillé pendant une heure/);
  });

  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log(`ok   ${name}`); } catch (e: any) { failed++; console.log(`ÉCHEC ${name}\n     ${e.message}`); }
  }
  console.log(`\n${tests.length - failed}/${tests.length} tests réussis`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
