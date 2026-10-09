// Tests du dossier client de Lucie, des tickets de support, de la ligne Israël et des petits défauts des agents
// (audit du 9 oct. 2026, actions 12, 14, 19 et 34 ; aucun réseau, aucune base réelle, aucun envoi réel) :
//   npx tsx scripts/test-dossier-tickets.ts
// fetch remplacé : Supabase en mémoire, automatisations de rappel, espace client (Autocalls) et Stripe simulés, toute
// autre adresse refusée ; transport SMTP remplacé par un faux qui garde les messages préparés (pied de page compris),
// hôte SMTP local. Vérifie : forfait lu dans Stripe ou dans les tables du webhook (essai, abonné, annulation prévue,
// impayé, résilié, aucun abonnement, lecture en échec ou trop lente) et consigne plan_status (jamais « proposez
// l’essai » à un client en essai ou abonné) ; dossier renvoyé par /api/agent/account ; confirmation écrite du ticket
// (langue du client, anglais si inconnue, hébreu de droite à gauche, heure australienne avec son fuseau, sans prix,
// plafond par adresse, coupure ; aucune seconde confirmation quand un agent de rappel du support reprogramme) ; ticket
// clos sur « resolu » d’un agent de rappel du support (et seulement lui), plus appelé ensuite ; « non_resolu » et
// « a_rappeler » signalés à l’équipe ; appelant non client de la ligne Israël ni rappelé ni enregistré (marqueur
// hébreu ou [NON_CLIENT] seulement) ; langue de l’échange écrit pour choisir la campagne ; copie de l’échange des
// lignes UK et Israël prête côté site ; limite du contrôle avant appel par adresse IP et numéro.
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

const FAKE_DB = 'https://supabase.invalid';
const TOKEN = randomBytes(24).toString('hex');
const IDENTIFY = randomBytes(16).toString('hex');
const LANGS = ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl', 'he'] as const;
Object.assign(process.env, {
  SUPABASE_URL: FAKE_DB, SUPABASE_SERVICE_ROLE_KEY: `sb_secret_test_${randomBytes(8).toString('hex')}`, WEBHOOK_TOKEN: TOKEN, IDENTIFY_KEY: IDENTIFY,
  ACCOUNT_CODE_SECRET: randomBytes(32).toString('hex'),
  // Faux identifiants SMTP sur un hôte local : le transport est remplacé ci-dessous, rien ne sort même s’il ne l’était pas.
  ZOHO_SMTP_USER: 'test@permanenceia.invalid', ZOHO_SMTP_PASS: randomBytes(8).toString('hex'), ZOHO_SMTP_HOST: '127.0.0.1',
  AUTOCALLS_API_KEY: `cle-de-test-${randomBytes(6).toString('hex')}`, AUTOCALLS_BLACKLIST: '0',
  LEAD_WEBHOOK_COMMERCIAL: 'https://hooks.invalid/fr/commercial', LEAD_WEBHOOK_SUPPORT: 'https://hooks.invalid/fr/support',
  LEAD_WEBHOOKS_INTL: JSON.stringify(Object.fromEntries(LANGS.filter((l) => l !== 'fr').map((l) => [l, { commercial: `https://hooks.invalid/${l}/commercial`, support: `https://hooks.invalid/${l}/support` }]))),
});
for (const k of ['WEBHOOK_TOKEN_NEXT', 'WEBHOOK_ALLOW_QUERY_TOKEN', 'CONVERSATION_COPY', 'NOTIFY_EMAIL', 'TICKET_CONFIRMATION', 'STRIPE_ACCOUNT_KEY', 'STRIPE_READ_KEY']) delete process.env[k];

type Row = Record<string, any>;

/* ---------- Faux SMTP ---------- */
const mails: Row[] = [];
(nodemailer as any).createTransport = () => ({ sendMail: async (m: Row) => { mails.push(m); return { messageId: randomUUID() }; } });

/* ---------- Supabase en mémoire (PostgREST : eq, neq, gt, gte, lt, lte, in, is, ->>, order, limit) ---------- */
const tables = new Map<string, Row[]>();
let clock = Date.now();
const hooks: { url: string; body: Row }[] = [];
let platformUsers: Row[] = [];
const rowsOf = (t: string) => { if (!tables.has(t)) tables.set(t, []); return tables.get(t)!; };
const RESERVED = new Set(['select', 'order', 'limit', 'on_conflict']);
const field = (r: Row, k: string) => { const [col, sub] = k.split('->>'); const v = r[col]; return sub ? (v && typeof v === 'object' ? v[sub] : undefined) : v; };
function keep(r: Row, k: string, cond: string) {
  const v = field(r, k);
  const s = v == null ? null : String(v);
  const dot = cond.indexOf('.');
  const op = cond.slice(0, dot), arg = cond.slice(dot + 1);
  if (op === 'eq') return s === arg;
  if (op === 'neq') return s !== arg;
  if (op === 'gt') return s != null && s > arg;
  if (op === 'gte') return s != null && s >= arg;
  if (op === 'lt') return s != null && s < arg;
  if (op === 'lte') return s != null && s <= arg;
  if (op === 'in') return s != null && arg.replace(/^\(|\)$/g, '').split(',').includes(s);
  if (op === 'is') return arg === 'null' ? v == null : s === arg;
  if (op === 'like') return s != null && new RegExp(`^${arg.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`).test(s);
  throw new Error(`filtre non géré par le faux Supabase : ${k}=${cond}`);
}
function query(table: string, params: URLSearchParams) {
  let out = rowsOf(table).filter((r) => Array.from(params).every(([k, v]) => RESERVED.has(k) || keep(r, k, v)));
  const order = params.get('order');
  if (order) {
    const keys = order.split(',').map((o) => o.split('.'));
    out = [...out].sort((a, b) => {
      for (const [col, dir] of keys) {
        const x = String(a[col] ?? ''), y = String(b[col] ?? '');
        if (x !== y) return (x < y ? -1 : 1) * (dir === 'desc' ? -1 : 1);
      }
      return 0;
    });
  }
  const limit = params.get('limit');
  return limit ? out.slice(0, Number(limit)) : out;
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

globalThis.fetch = (async (input: unknown, init: RequestInit = {}) => {
  const url = new URL(String(input));
  const method = String(init.method || 'GET').toUpperCase();
  if (url.origin === 'https://hooks.invalid') { hooks.push({ url: url.toString(), body: JSON.parse(String(init.body)) }); return json({ ok: true }); }
  if (url.origin === 'https://app.autocalls.ai') {
    if (url.pathname === '/api/white-label/users') return json({ data: platformUsers, last_page: 1 });
    return json({ error: 'simulé' }, 500); // jeton temporaire refusé : agents, numéros et appels « indisponible »
  }
  if (url.origin !== FAKE_DB || !url.pathname.startsWith('/rest/v1/')) throw new Error(`réseau interdit pendant les tests : ${url.origin}`);
  const table = url.pathname.slice('/rest/v1/'.length);
  const headers = (init.headers || {}) as Record<string, string>;
  if (method === 'GET') return json(query(table, url.searchParams));
  if (method === 'POST') {
    const body = JSON.parse(String(init.body));
    const created = (Array.isArray(body) ? body : [body]).map((r: Row) => ({ id: randomUUID(), created_at: new Date(clock++).toISOString(), ...r }));
    rowsOf(table).push(...created);
    return /return=representation/.test(headers.Prefer || '') ? json(created, 201) : new Response(null, { status: 201 });
  }
  if (method === 'PATCH') {
    const patch = JSON.parse(String(init.body));
    for (const r of query(table, url.searchParams)) Object.assign(r, patch);
    return new Response(null, { status: 204 });
  }
  throw new Error(`méthode non gérée : ${method}`);
}) as typeof fetch;

/* ---------- Requêtes simulées ---------- */
function mockRes() {
  const r = {
    statusCode: 0, headers: {} as Record<string, unknown>, body: undefined as any,
    setHeader(k: string, v: unknown) { r.headers[k.toLowerCase()] = v; return r; },
    status(c: number) { r.statusCode = c; return r; },
    json(b: unknown) { r.body = b; return r; },
    send(b: unknown) { r.body = b; return r; },
    end() { return r; },
  };
  return r;
}
let ipSeq = 0;
const nextIp = () => `10.1.${Math.floor(++ipSeq / 250)}.${ipSeq % 250}`;
async function call(handler: (req: NextApiRequest, res: NextApiResponse) => unknown, o: { method?: string; body?: Row; query?: Row; auth?: boolean; ip?: string }) {
  const req = {
    method: o.method ?? 'POST', body: o.body ?? {}, query: o.query ?? {}, url: '/api/test', socket: { remoteAddress: '127.0.0.1' },
    headers: { ...(o.auth ? { 'x-webhook-token': TOKEN } : {}), 'x-forwarded-for': `${o.ip ?? nextIp()}, 10.0.0.1` },
  } as unknown as NextApiRequest;
  const res = mockRes();
  const saved = { log: console.log, error: console.error, info: console.info, warn: console.warn };
  console.log = console.error = console.info = console.warn = () => undefined;
  try { await handler(req, res as unknown as NextApiResponse); } finally { Object.assign(console, saved); }
  return res;
}

async function main() {
  const plan = await import('@/lib/accountPlan');
  const { rowToSubscriptionView } = await import('@/lib/stripeAccount');
  const tickets = await import('@/lib/tickets');
  const code = await import('@/lib/accountCode');
  const { REQUESTERS } = await import('@/lib/callbackPersona');
  const { isNonClientNote } = await import('@/lib/nonClient');
  const { isCurrent, IP_CHECKS_PER_10_MIN } = await import('@/pages/api/callback/check');
  const checkRoute = (await import('@/pages/api/callback/check')).default;
  const callbackRoute = (await import('@/pages/api/callback/index')).default;
  const lucieRoute = (await import('@/pages/api/agent/account')).default;
  const webhook = (await import('@/pages/api/webhooks/autocalls')).default;
  const uuid = (id: number) => REQUESTERS.find((r) => r.id === id)!.uuid;

  let passed = 0;
  const test = async (name: string, fn: () => Promise<void> | void) => {
    try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };
  const reset = () => { tables.clear(); mails.length = 0; hooks.length = 0; platformUsers = []; delete process.env.TICKET_CONFIRMATION; };
  const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * 86_400_000).toISOString();
  const sub = (over: Row = {}) => rowToSubscriptionView({
    subscription_id: 'sub_1', customer_id: 'cus_1', status: 'active', trial_start: null, trial_end: null, current_period_end: '2026-11-09T10:00:00Z',
    cancel_at_period_end: false, canceled_at: null, ended_at: null, price_amount: 9900, currency: 'usd', billing_interval: 'month', last_event_at: null, updated_at: null, ...over,
  } as any);
  const PROPOSE_TRIAL = /Proposez Change plan pour démarrer l’essai/;

  /* ---------- Dossier de Lucie : forfait ---------- */

  await test('consigne : essai en cours à 0 minute → « essai », jamais « proposez l’essai », pas de changement de forfait', () => {
    const d = plan.describePlanForAgent({ source: 'base', subscription: sub({ status: 'trialing', trial_start: '2026-10-05T10:00:00Z', trial_end: '2026-10-19T10:00:00Z' }), paymentFailedAt: null }, 0);
    assert.equal(d.plan.status, 'essai');
    assert.equal(d.plan.trial_end, '2026-10-19');
    assert.equal(d.plan.name, 'Réceptionniste');
    assert.match(d.plan_status, /Ne proposez pas de démarrer l’essai/);
    assert.match(d.plan_status, /débit immédiat/);
    assert.match(d.plan_status, /minutes d’essai sont épuisées/);
    assert.doesNotMatch(d.plan_status, PROPOSE_TRIAL);
  });

  await test('consigne : abonné à 0 minute → renouvellement, Add credits, jamais l’essai ; annuel reconnu', () => {
    const d = plan.describePlanForAgent({ source: 'stripe', subscription: sub(), paymentFailedAt: null }, 0);
    assert.equal(d.plan.status, 'abonne');
    assert.equal(d.plan.renewal_date, '2026-11-09');
    assert.equal(d.plan.billing, 'mensuel');
    assert.equal(d.plan.monthly_minutes, 350);
    assert.match(d.plan_status, /renouvellement le 2026-11-09/);
    assert.match(d.plan_status, /Ne proposez pas l’essai gratuit/);
    const annual = plan.describePlanForAgent({ source: 'base', subscription: sub({ price_amount: 249000, billing_interval: 'year' }), paymentFailedAt: null }, 50);
    assert.equal(annual.plan.name, 'Assistant');
    assert.equal(annual.plan.billing, 'annuel');
    assert.doesNotMatch(annual.plan_status, /0 minute/);
  });

  await test('consigne : annulation prévue (essai ou abonnement), impayé, résilié, en pause', () => {
    const cancelledTrial = plan.describePlanForAgent({ source: 'base', subscription: sub({ status: 'trialing', trial_end: '2026-10-19T10:00:00Z', current_period_end: '2026-10-19T10:00:00Z', cancel_at_period_end: true }), paymentFailedAt: null }, 10);
    assert.equal(cancelledTrial.plan.status, 'essai_annule');
    assert.match(cancelledTrial.plan_status, /sans aucun débit/);
    const leaving = plan.describePlanForAgent({ source: 'base', subscription: sub({ cancel_at_period_end: true }), paymentFailedAt: null }, 0);
    assert.equal(leaving.plan.status, 'resiliation_programmee');
    assert.equal(leaving.plan.cancel_at, '2026-11-09');
    assert.equal(leaving.plan.renewal_date, null);
    const late = plan.describePlanForAgent({ source: 'base', subscription: sub({ status: 'past_due' }), paymentFailedAt: '2026-10-08T06:00:00Z' }, 0);
    assert.equal(late.plan.status, 'impaye');
    assert.equal(late.plan.payment_failed_at, '2026-10-08');
    assert.match(late.plan_status, /mettre à jour sa carte/);
    // Lien de l’espace client nommé dans chaque langue de l’agent (le libellé est traduit par le script de l’espace).
    for (const label of ['Factures et carte bancaire', 'Invoices and payment card', 'Fatture e carta di pagamento', 'Faktury i karta płatnicza', 'Facturen en betaalkaart', 'חשבוניות וכרטיס אשראי']) {
      assert.ok(late.plan_status.includes(label), label);
    }
    const gone = plan.describePlanForAgent({ source: 'base', subscription: sub({ status: 'canceled', ended_at: '2026-10-01T00:00:00Z' }), paymentFailedAt: null }, 0);
    assert.equal(gone.plan.status, 'resilie');
    assert.equal(gone.plan.ended_at, '2026-10-01');
    assert.match(gone.plan_status, /Ne proposez pas de nouvel essai gratuit \(un seul essai par entreprise ou moyen de paiement, selon les conditions générales\)/);
    assert.match(gone.plan_status, /« Choose a plan » \(ou « Change plan »\)/);
    assert.doesNotMatch(gone.plan_status, /plateforme/, 'règle des conditions générales, jamais attribuée à la plateforme');
    const paused = plan.describePlanForAgent({ source: 'base', subscription: sub({ status: 'paused' }), paymentFailedAt: null }, 0);
    assert.equal(paused.plan.status, 'en_pause');
    assert.match(paused.plan_status, /vérifier ou ajouter sa carte dans Billing info/);
    for (const d of [cancelledTrial, leaving, late, gone]) assert.doesNotMatch(d.plan_status, PROPOSE_TRIAL);
  });

  await test('consigne : aucun abonnement (essai seulement s’il n’en a jamais eu) ; lecture en échec → rien déduit des minutes', () => {
    const none = plan.describePlanForAgent({ source: 'aucune', subscription: null, paymentFailedAt: null }, 0);
    assert.equal(none.plan.status, 'aucun_abonnement');
    assert.match(none.plan_status, /n’a jamais démarré d’essai/);
    // Bouton réel d’un compte sans forfait (en haut à gauche), « Change plan » seulement si un forfait apparaît déjà.
    assert.match(none.plan_status, /« Choose a plan » \(en haut à gauche ; « Change plan » si un forfait apparaît déjà\), puis « Start 14-Day Free Trial »/);
    assert.match(none.plan_status, /ne proposez pas l’essai/);
    const payg = plan.describePlanForAgent({ source: 'aucune', subscription: null, paymentFailedAt: null }, 42);
    assert.match(payg.plan_status, /payé à la minute/);
    const down = plan.describePlanForAgent({ source: 'indisponible', subscription: null, paymentFailedAt: null }, 0);
    assert.equal(down.plan.status, 'inconnu');
    assert.match(down.plan_status, /Ne déduisez rien du solde de minutes/);
  });

  const seedStripe = (email: string, subOver: Row = {}) => {
    rowsOf('stripe_customers').push({ customer_id: 'cus_1', email, livemode: true });
    rowsOf('stripe_subscriptions').push({
      subscription_id: 'sub_1', customer_id: 'cus_1', status: 'trialing', trial_start: '2026-10-05T10:00:00Z', trial_end: '2026-10-19T10:00:00Z',
      current_period_end: '2026-10-19T10:00:00Z', cancel_at_period_end: false, canceled_at: null, ended_at: null, price_amount: 9900, currency: 'usd',
      billing_interval: 'month', livemode: true, last_event_at: '2026-10-05T10:00:00Z', updated_at: null, ...subOver,
    });
  };
  const PREF = { select: async <T,>(t: string, q: string) => query(t, new URLSearchParams(q)) as unknown as T[] };

  await test('lecture : tables du webhook sans clé Stripe ; dernier paiement échoué seulement s’il n’a pas été réglé depuis', async () => {
    reset();
    seedStripe('marie@exemple.fr', { status: 'past_due', trial_start: null, trial_end: null });
    rowsOf('call_events').push(
      { kind: 'stripe_paiement', status: 'recu', created_at: '2026-10-01T06:00:00Z', variables: { customer: 'cus_1', livemode: true } },
      { kind: 'stripe_paiement', status: 'echec', created_at: '2026-10-08T06:00:00Z', variables: { customer: 'cus_1', livemode: true } },
      { kind: 'stripe_paiement', status: 'echec', created_at: '2026-10-09T06:00:00Z', variables: { customer: 'cus_autre', livemode: true } },
    );
    const p = await plan.loadAgentPlan('marie@exemple.fr', { db: PREF });
    assert.equal(p.source, 'base');
    assert.equal(p.subscription?.group, 'past_due');
    assert.equal(p.paymentFailedAt, '2026-10-08T06:00:00Z');
    rowsOf('call_events').push({ kind: 'stripe_paiement', status: 'recu', created_at: '2026-10-09T08:00:00Z', variables: { customer: 'cus_1', livemode: true } });
    assert.equal((await plan.loadAgentPlan('marie@exemple.fr', { db: PREF })).paymentFailedAt, null);
    assert.equal((await plan.loadAgentPlan('inconnu@exemple.fr', { db: PREF })).source, 'aucune');
    const broken = await plan.loadAgentPlan('marie@exemple.fr', { db: { select: async () => { throw new Error('Supabase 503'); } } });
    assert.equal(broken.source, 'indisponible');
  });

  await test('lecture : API Stripe (client de cette adresse seulement) ; erreur ou délai dépassé → tables du webhook', async () => {
    reset();
    seedStripe('marie@exemple.fr');
    const calls: string[] = [];
    const get = (async (path: string) => {
      calls.push(path);
      if (path === '/customers') return { data: [{ id: 'cus_9', email: 'marie@exemple.fr', created: 2 }, { id: 'cus_x', email: 'autre@exemple.fr', created: 3 }] };
      if (path === '/subscriptions') return { data: [{ id: 'sub_9', customer: 'cus_9', status: 'active', items: { data: [{ price: { unit_amount: 49900, currency: 'usd', recurring: { interval: 'month' } }, current_period_end: 1794000000 }] } }] };
      throw new Error(`inattendu ${path}`);
    }) as any;
    const p = await plan.loadAgentPlan('marie@exemple.fr', { get, db: PREF });
    assert.equal(p.source, 'stripe');
    assert.equal(p.subscription?.planSlug, 'centre-appels');
    assert.deepEqual(calls, ['/customers', '/subscriptions'], 'un seul client (le bon), aucune lecture de carte ni de facture');
    const failing = await plan.loadAgentPlan('marie@exemple.fr', { get: (async () => { throw new Error('Stripe 401'); }) as any, db: PREF });
    assert.equal(failing.source, 'base');
    assert.equal(failing.subscription?.group, 'trial');
    const slow = await plan.loadAgentPlan('marie@exemple.fr', { get: (() => new Promise(() => undefined)) as any, db: PREF, timeoutMs: 30 });
    assert.equal(slow.source, 'base');
  });

  await test('/api/agent/account (lookup) : dossier avec forfait, essai et consigne corrigée à 0 minute', async () => {
    reset();
    const email = 'marie@exemple.fr';
    platformUsers = [{ id: 8, name: 'Marie Durand', email, minutes_balance: 0, credits_balance: 0, created_at: '2026-10-05' }];
    seedStripe(email);
    rowsOf('call_events').push({ kind: 'otp_send', external_id: code.otpKey(code.sentCodeKey(email, 'lucie')), created_at: new Date().toISOString() });
    const r = await call(lucieRoute, { body: { action: 'lookup', email, code: code.currentCode(email, 'lucie') } });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.verified, true);
    assert.equal(r.body.plan.status, 'essai');
    assert.equal(r.body.plan.trial_end, '2026-10-19');
    assert.equal(r.body.plan.name, 'Réceptionniste');
    assert.doesNotMatch(r.body.plan_status, PROPOSE_TRIAL);
    assert.equal(r.body.agents, 'indisponible');
  });

  /* ---------- Tickets de support ---------- */

  const toClient = (email: string) => mails.filter((m) => m.to === email);
  const supportForm = (o: Row = {}) => ({ name: 'Léa Petit', phone: '0612345680', consentCall: true, type: 'support', locale: 'fr', siteLocale: 'fr', email: 'lea@exemple.fr', note: 'Mon agent ne répond plus', slot: 'asap', ...o });

  await test('ticket : confirmation écrite au client (numéro, suite prévue), e-mail essentiel avec pied de page, sans prix', async () => {
    reset();
    const r = await call(callbackRoute, { body: supportForm() });
    assert.equal(r.statusCode, 200);
    assert.match(r.body.ticket, /^T-[0-9A-F]{8}$/);
    const [m] = toClient('lea@exemple.fr');
    assert.ok(m, 'confirmation envoyée');
    assert.equal(m.subject, `Votre demande d’assistance ${r.body.ticket} est enregistrée · Permanence IA`);
    assert.match(m.from, /^Permanence IA </);
    assert.match(m.text, /^Bonjour Léa,/);
    assert.ok(m.text.includes(`sous le numéro ${r.body.ticket}`));
    assert.match(m.text, /Nous vous rappelons dès que possible/);
    assert.match(m.text, /Si vous n’êtes pas à l’origine de cette demande/);
    assert.match(m.text, /SINAY/, 'pied de page légal');
    assert.doesNotMatch(m.text, /\$|€|US\$|offert|promo/i, 'aucun prix ni promotion');
    const trace = rowsOf('call_events').find((e) => e.outcome === 'confirmation_ticket');
    assert.equal(trace?.status, 'envoyee');
    assert.ok(!JSON.stringify(trace).includes('lea@exemple.fr'), 'adresse jamais en clair dans la trace');
    // E-mail à l’équipe : numéro du ticket et lien d’arrêt des relances.
    const team = mails.find((x) => /Nouvelle demande de rappel \(support T-/.test(x.subject));
    assert.ok(team);
    assert.match(team!.text, /Arrêter les relances de ce contact : https:\/\/www\.permanenceia\.com\/api\/relances\/stop\?e=/);
  });

  await test('ticket : langue du client (agent en italien), anglais si inconnue, hébreu de droite à gauche', async () => {
    reset();
    await call(callbackRoute, { auth: true, body: { name: 'Luca Bianchi', phone: '+393123456789', consentCall: 'true', type: 'support', agent: 'Lucie — espace client', language: 'it', email: 'luca@esempio.it', note: 'Problema' } });
    assert.match(toClient('luca@esempio.it')[0]?.subject ?? '', /^La Sua richiesta di assistenza T-/);
    // Indicatif ambigu (+32), aucune langue déclarée : anglais.
    await call(callbackRoute, { auth: true, body: { name: 'Jan Peeters', phone: '+32470123456', consentCall: 'true', type: 'support', agent: 'Outil', email: 'jan@voorbeeld.be', note: 'Probleem' } });
    assert.match(toClient('jan@voorbeeld.be')[0]?.subject ?? '', /^Your support request T-/);
    await call(callbackRoute, { body: supportForm({ name: 'דנה כהן', phone: '0501234567', locale: 'he', siteLocale: 'he', email: 'dana@example.co.il' }) });
    const he = toClient('dana@example.co.il')[0];
    assert.match(he?.subject ?? '', /^פניית התמיכה שלכם T-/);
    assert.match(he.html, /dir="rtl"/);
    assert.match(he.html, /<b dir="ltr">T-/);
  });

  await test('ticket : texte de chaque langue (date du rappel, équipe), sans prix', () => {
    const at = new Date('2026-10-16T12:30:00Z');
    for (const locale of LANGS) {
      const m = tickets.buildTicketMail({ locale, name: 'Alex', ticket: 'T-ABCD1234', queued: true, callAt: at, zone: 'Europe/Paris' });
      assert.ok(m.subject.includes('T-ABCD1234') && m.text.includes('T-ABCD1234'), locale);
      assert.ok(/2026/.test(m.text), `${locale} : date du rappel`);
      assert.doesNotMatch(m.text, /\$|€/);
      const team = tickets.buildTicketMail({ locale, name: null, ticket: 'T-ABCD1234', queued: false, callAt: null, zone: 'Europe/Paris' });
      assert.notEqual(team.text, m.text);
    }
    assert.match(tickets.buildTicketMail({ locale: 'pl', name: 'Alex', ticket: 'T-1', queued: true, callAt: null, zone: 'Europe/Warsaw' }).text, /^Dzień dobry,/);
    assert.match(tickets.buildTicketMail({ locale: 'fr', name: 'Prospect WhatsApp', ticket: 'T-1', queued: true, callAt: null, zone: 'Europe/Paris' }).text, /^Bonjour,/);
  });

  await test('ticket : heure du rappel en Australie sur 12 h avec le fuseau (Sydney par défaut, Perth si la demande le donne) ; autres marchés inchangés', () => {
    const at = new Date('2026-10-16T03:30:00Z');
    const au = tickets.buildTicketMail({ locale: 'en-au', name: 'Sam', ticket: 'T-ABCD1234', queued: true, callAt: at, zone: 'Australia/Sydney' });
    assert.ok(au.text.includes('We will call you back on Friday 16 October 2026 at 2:30 pm AEDT.'), au.text);
    assert.ok(tickets.ticketCallAtText(at, 'Australia/Perth', 'en-au').endsWith('11:30 am AWST'));
    const gb = tickets.buildTicketMail({ locale: 'en-gb', name: 'Sam', ticket: 'T-ABCD1234', queued: true, callAt: at, zone: 'Europe/London' });
    assert.ok(gb.text.includes('at 04:30.'), 'Royaume-Uni : un seul fuseau, format 24 h inchangé');
    assert.match(tickets.buildTicketMail({ locale: 'fr', name: 'Léa', ticket: 'T-1', queued: true, callAt: at, zone: 'Europe/Paris' }).text, /à 05:30\./);
  });

  await test('ticket : demande reprogrammée par un agent de rappel du support (adresse reçue de la campagne) → aucune seconde confirmation', async () => {
    reset();
    const body = { name: 'Léa Petit', phone: '+33612345690', consentCall: 'true', type: 'support', agent: 'Lucie — rappel support', email: 'reprog@exemple.fr', note: 'Rappel reprogrammé', call_at: '' };
    const r = await call(callbackRoute, { auth: true, query: { aid: uuid(21183) }, body });
    assert.equal(r.statusCode, 200);
    assert.match(r.body.ticket, /^T-/, 'la demande est enregistrée');
    assert.equal(toClient('reprog@exemple.fr').length, 0, 'pas de second numéro de ticket envoyé au client');
    assert.ok(!rowsOf('call_events').some((e) => e.outcome === 'confirmation_ticket'));
    // Agent de rappel du support d’une autre langue (UUID) : pareil ; Lucie (21205) : la confirmation part.
    await call(callbackRoute, { auth: true, query: { aid: uuid(21238) }, body: { ...body, phone: '+393123456780', language: 'it', email: 'riprog@esempio.it' } });
    assert.equal(toClient('riprog@esempio.it').length, 0);
    await call(callbackRoute, { auth: true, query: { aid: uuid(21205) }, body: { ...body, phone: '+33612345691', agent: 'Lucie — espace client', email: 'nouveau@exemple.fr' } });
    assert.equal(toClient('nouveau@exemple.fr').length, 1);
  });

  await test('ticket : au plus 3 confirmations par adresse sur 24 h ; coupure TICKET_CONFIRMATION=0', async () => {
    reset();
    for (const phone of ['0612345681', '0612345682', '0612345683', '0612345684']) await call(callbackRoute, { body: supportForm({ phone, email: 'flood@exemple.fr' }) });
    assert.equal(toClient('flood@exemple.fr').length, tickets.MAX_TICKET_MAILS_PER_ADDRESS);
    process.env.TICKET_CONFIRMATION = '0';
    await call(callbackRoute, { body: supportForm({ email: 'off@exemple.fr' }) });
    assert.equal(toClient('off@exemple.fr').length, 0);
  });

  const PHONE = '+33612345678';
  const seedTicket = (status: string, minutesAgo: number, type = 'support') => {
    const row = { id: randomUUID(), name: 'Léa', phone: PHONE, type, status, created_at: new Date(Date.now() - minutesAgo * 60_000).toISOString() };
    rowsOf('callbacks').push(row);
    return row;
  };
  const endOfCall = (aid: number, outcome: string) => ({
    id: `call-${randomUUID()}`, assistant_id: uuid(aid), assistant_name: `Agent ${aid}`, customer_phone: PHONE, duration: 300, status: 'completed', type: 'outbound',
    extracted_variables: { outcome, summary: 'Résumé de test' }, ended_at: new Date().toISOString(),
  });

  await test('ticket : « resolu » d’un agent de rappel du support → tickets ouverts antérieurs clos (et plus appelés) ; ni un autre agent, ni un ticket créé pendant l’appel', async () => {
    reset();
    const old = seedTicket('scheduled', 120);
    const pending = seedTicket('pending', 90);
    const during = seedTicket('scheduled', 2);
    const commercial = seedTicket('scheduled', 120, 'commercial');
    // Agent de rappel commercial : aucun effet.
    await call(webhook, { auth: true, body: endOfCall(21182, 'resolu') });
    assert.deepEqual([old, pending].map((r) => r.status), ['scheduled', 'pending']);
    await call(webhook, { auth: true, body: endOfCall(21183, 'resolu') });
    assert.deepEqual([old.status, pending.status, during.status, commercial.status], ['done', 'done', 'scheduled', 'scheduled']);
    // Ticket seul, encore attendu par son automatisation : appelé tant qu’il est ouvert, plus après sa clôture.
    reset();
    const alone = seedTicket('scheduled', 120);
    assert.equal(await isCurrent(alone.id, PHONE), true);
    await call(webhook, { auth: true, body: endOfCall(21236, 'resolu') });
    assert.equal(alone.status, 'done');
    assert.equal(await isCurrent(alone.id, PHONE), false, 'automatisation encore en attente : plus d’appel');
    assert.equal(tickets.ticketNumber(old.id), `T-${old.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`);
    // Agents de rappel du support des 7 langues reconnus, ni les lignes entrantes ni les widgets.
    for (const id of [21183, 21236, 21237, 21238, 21239, 21240, 21310]) assert.equal(tickets.isSupportCallbackAgent(uuid(id)), true, String(id));
    for (const id of [21182, 21376, 21314, 21205, 21358]) assert.equal(tickets.isSupportCallbackAgent(uuid(id)), false, String(id));
  });

  await test('« non_resolu » (Lucie) → alerte « À traiter » à l’équipe, avec le lien d’arrêt des relances', async () => {
    reset();
    await call(webhook, { auth: true, body: {
      conversation_id: randomUUID(), assistant_id: uuid(21205), assistant_name: 'Lucie', message_count: 4, status: 'ended', transcript: [],
      extracted_variables: { outcome: 'non_resolu', summary: 'La cliente n’arrive pas à relier son numéro.', email: 'cliente@exemple.fr' },
    } });
    const alert = mails.find((m) => /^À traiter : non_resolu — Lucie/.test(m.subject));
    assert.ok(alert, 'équipe prévenue');
    assert.match(alert!.text, /Arrêter les relances de ce contact : https:/);
  });

  await test('« a_rappeler » d’un agent de rappel du support → alerte « À traiter », ticket laissé ouvert', async () => {
    reset();
    const open = seedTicket('scheduled', 120);
    await call(webhook, { auth: true, body: endOfCall(21183, 'a_rappeler') });
    assert.equal(open.status, 'scheduled', 'ticket non réglé : reste ouvert');
    assert.ok(mails.some((m) => /^À traiter : a_rappeler — Agent 21183/.test(m.subject)), 'équipe prévenue');
  });

  /* ---------- Ligne Israël : appelants non clients ---------- */

  await test('ligne Israël : « לא לקוח – … » → ni demande enregistrée, ni appel, équipe prévenue, agent orienté vers contact@', async () => {
    reset();
    const r = await call(callbackRoute, { query: { aid: uuid(21314) }, body: { name: 'יוסי לוי', phone: '+972501234567', consentCall: 'true', type: 'commercial', agent: 'נועה — קו נכנס', locale: 'he', cc: '972', note: 'לא לקוח – ספק ציוד משרדי' } });
    assert.equal(r.statusCode, 200);
    assert.equal(r.body.non_client, true);
    assert.equal(r.body.queued, false);
    assert.match(r.body.message_for_agent, /contact@permanenceia\.com/);
    assert.equal(rowsOf('callbacks').length, 0);
    assert.equal(rowsOf('contacts').length, 0, 'aucune fiche, donc aucune relance');
    assert.equal(hooks.length, 0, 'aucun appel commercial');
    assert.ok(mails.some((m) => /^Message non commercial — יוסי לוי/.test(m.subject)));
  });

  await test('non client : seulement un marqueur en tête de note d’un outil d’agent (jamais un formulaire, jamais une phrase)', async () => {
    assert.equal(isNonClientNote('לא לקוח – עיתונאית'), true);
    assert.equal(isNonClientNote('[NON_CLIENT] démarchage'), true);
    assert.equal(isNonClientNote('NON_CLIENT – press'), true);
    // Formes françaises et anglaises : souvent un prospect (« Non client : question sur l’essai ») ; jamais filtrées.
    assert.equal(isNonClientNote('Non client : démarchage'), false);
    assert.equal(isNonClientNote('Non-client – question sur l’essai'), false);
    assert.equal(isNonClientNote('Not a customer - press'), false);
    assert.equal(isNonClientNote('הוא לא לקוח שלנו עדיין, רוצה הדגמה'), false);
    assert.equal(isNonClientNote('Prospect, pas encore client'), false);
    reset();
    const prospect = await call(callbackRoute, { auth: true, body: { name: 'Paul Martin', phone: '+33612345679', consentCall: 'true', type: 'commercial', agent: 'Widget Jade', language: 'fr', note: 'Non client : question sur l’essai' } });
    assert.equal(prospect.body.stored, true, 'outil d’agent : un prospect « non client » reste une demande de rappel');
    assert.equal(prospect.body.non_client, undefined);
    reset();
    const r = await call(callbackRoute, { body: { name: 'Paul Martin', phone: '0612345679', consentCall: true, type: 'commercial', locale: 'fr', note: 'Non client : je découvre', slot: 'asap' } });
    assert.equal(r.body.stored, true);
    assert.equal(r.body.queued, true, 'formulaire du site : jamais filtré');
    reset();
    const lead = await call(lucieRoute, { body: { action: 'save_lead', key: IDENTIFY, phone: '+972501234567', name: 'רונית', channel: 'phone', activity: 'לא לקוח – עיתונות', language: 'he' } });
    assert.equal(lead.body.saved, false);
    assert.equal(lead.body.non_client, true);
    assert.equal(rowsOf('callbacks').length, 0);
  });

  /* ---------- Petits défauts des agents (action 34) ---------- */

  await test('demande écrite : campagne dans la langue de l’échange (+33 en anglais → Royaume-Uni), indicatif sinon', async () => {
    const ask = async (language?: string) => {
      reset();
      await call(callbackRoute, { auth: true, body: { name: 'Sam Taylor', phone: '+33612345678', consentCall: 'true', type: 'commercial', agent: 'Messenger', note: 'Wants a demo', ...(language ? { language } : {}) } });
      return hooks[0]?.url;
    };
    assert.equal(await ask('en'), 'https://hooks.invalid/en-gb/commercial');
    assert.equal(await ask('English'), 'https://hooks.invalid/en-gb/commercial');
    assert.equal(await ask('he'), 'https://hooks.invalid/he/commercial');
    assert.equal(await ask(), 'https://hooks.invalid/fr/commercial');
    assert.equal(await ask('{{language}}'), 'https://hooks.invalid/fr/commercial');
  });

  await test('copie de l’échange sur les lignes UK et Israël : prête côté site dès que copy_email est ajoutée (Katie en anglais, נועה de droite à gauche)', async () => {
    reset();
    const inbound = (aid: number, phone: string, to: string, lines: [string, string]) => ({
      id: randomUUID(), type: 'inbound', assistant_id: uuid(aid), assistant_name: `Ligne ${aid}`, customer_phone: phone, status: 'completed', duration: 60,
      created_at: new Date(Date.now() - 120_000).toISOString(), extracted_variables: { copy_email: to, outcome: 'information', summary: 'Question' },
      transcript: [{ type: 'transcript', text: lines[0], sender: 'bot' }, { type: 'transcript', text: lines[1], sender: 'human' }],
    });
    await call(webhook, { auth: true, body: inbound(21376, '+447700900123', 'caller@example.co.uk', ['Hello, this is Katie.', 'Please email me a copy.']) });
    const uk = toClient('caller@example.co.uk')[0];
    assert.ok(uk, 'copie envoyée');
    assert.match(uk.subject, /Katie/);
    assert.match(uk.text, /Please email me a copy\./);
    await call(webhook, { auth: true, body: inbound(21314, '+972501234567', 'dana@example.co.il', ['שלום, כאן נועה.', 'אפשר עותק במייל?']) });
    const il = toClient('dana@example.co.il')[0];
    assert.ok(il, 'copie envoyée');
    assert.match(il.subject, /נועה/);
    assert.match(il.html, /dir="rtl"/);
  });

  await test('contrôle avant appel sans jeton : limite par adresse IP et numéro (plus de plafond commun aux 14 automatisations)', async () => {
    const ip = '198.51.100.7';
    const check = (phone: string) => call(checkRoute, { method: 'GET', query: { phone }, ip });
    for (let i = 0; i < 150; i++) assert.equal((await check(`+336${String(10000000 + i)}`)).statusCode, 200, `numéro ${i}`);
    let last = 0;
    for (let i = 0; i < 121; i++) last = (await check('+33699999999')).statusCode;
    assert.equal(last, 429, 'même numéro : 120 par 10 minutes');
    assert.ok(IP_CHECKS_PER_10_MIN >= 1000);
    reset();
    const done = seedTicket('done', 10);
    assert.equal(await isCurrent(done.id, PHONE), false);
  });

  console.log(`\n${passed} tests réussis (aucun envoi réel).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
