// Tests des oppositions et arrêts (audit du 9 oct. 2026, actions 15 et 18 ; aucun réseau, aucune base réelle, aucun
// envoi réel) :
//   npx tsx scripts/test-oppositions.ts
// Supabase simulé en mémoire (fetch remplacé : toute autre adresse est refusée, sauf l’automatisation « liste noire »
// d’Autocalls, simulée et enregistrée) ; transport SMTP remplacé par un faux qui garde les messages préparés (pied de
// page compris) ; hôte SMTP local : rien ne peut partir. Vérifie : lien signé « Arrêter les relances de ce contact »
// (jeton, page de confirmation sans effet, arrêt enregistré une seule fois, lien invalide refusé) ; moteur : arrêt
// manuel (commercial arrêté, service maintenu), désinscription reçue par e-mail (préférence enregistrée une seule fois,
// équipe prévenue avec l’objet du message, commercial arrêté), lien d’arrêt dans l’alerte « réponse » ; objets de
// désinscription dans les 7 langues (mots de résiliation d’abonnement exclus, demande marquée automatique reconnue) ;
// « ne plus me contacter » sur Messenger, l’espace client et les widgets écrits ou vocaux (opposition appliquée
// seulement pour un numéro dont le rappel a été demandé pendant ce même échange : transcription ou marqueur
// [CONV:…] posé par /api/callback, jamais une demande d’un autre échange ; une seule fois ; sinon une seule alerte
// « À vérifier » ; désinscription e-mail avec l’adresse de l’échange), WhatsApp inchangé.
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

const FAKE_DB = 'https://supabase.invalid';
const TOKEN = randomBytes(24).toString('hex');
process.env.SUPABASE_URL = FAKE_DB;
process.env.SUPABASE_SERVICE_ROLE_KEY = `sb_secret_test_${randomBytes(8).toString('hex')}`;
process.env.WEBHOOK_TOKEN = TOKEN;
process.env.ACCOUNT_CODE_SECRET = randomBytes(32).toString('hex');
// Faux identifiants SMTP sur un hôte local : le transport est remplacé ci-dessous, rien ne sort même s’il ne l’était pas.
process.env.ZOHO_SMTP_USER = 'test@permanenceia.invalid';
process.env.ZOHO_SMTP_PASS = randomBytes(8).toString('hex');
process.env.ZOHO_SMTP_HOST = '127.0.0.1';
process.env.AUTOCALLS_API_KEY = `cle-de-test-${randomBytes(6).toString('hex')}`;
process.env.AUTOCALLS_BLACKLIST_WEBHOOK_URL = 'https://blacklist.invalid/hook';
for (const k of ['WEBHOOK_TOKEN_NEXT', 'WEBHOOK_ALLOW_QUERY_TOKEN', 'CONVERSATION_COPY', 'NOTIFY_EMAIL', 'AUTOCALLS_BLACKLIST', 'TICKET_CONFIRMATION']) delete process.env[k];

type Row = Record<string, any>;

/* ---------- Faux SMTP ---------- */
const mails: Row[] = [];
(nodemailer as any).createTransport = () => ({ sendMail: async (m: Row) => { mails.push(m); return { messageId: randomUUID() }; } });

/* ---------- Supabase en mémoire (PostgREST : eq, neq, gt, gte, lt, lte, in, is, like, ->>, order, limit) ---------- */
const tables = new Map<string, Row[]>();
let clock = Date.now();
const blacklist: Row[] = [];
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
  if (url.origin === 'https://blacklist.invalid') { blacklist.push(JSON.parse(String(init.body))); return json({ ok: true }); }
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
const quiet = async <T,>(fn: () => Promise<T>) => {
  const saved = { log: console.log, error: console.error, info: console.info, warn: console.warn };
  console.log = console.error = console.info = console.warn = () => undefined;
  try { return await fn(); } finally { Object.assign(console, saved); }
};

async function main() {
  const { emailKey, emailToken } = await import('@/lib/emailPrefs');
  const { stopRelancesUrl, stopRelancesLine, verifyStopToken, stopToken } = await import('@/lib/relances/stopLink');
  const stopRoute = (await import('@/pages/api/relances/stop')).default;
  const webhook = (await import('@/pages/api/webhooks/autocalls')).default;
  const callbackRoute = (await import('@/pages/api/callback/index')).default;
  const { runRelances } = await import('@/lib/relances/engine');
  const { readConfig } = await import('@/lib/relances/config');
  const { relancesContent } = await import('@/lib/relances/content');
  const { parseMessage, isUnsubscribeSubject } = await import('@/lib/relances/imap');
  const { toolCalls, applyWrittenOptout, writtenOptoutDeps, exchangeId } = await import('@/lib/writtenOptout');
  const { REQUESTERS } = await import('@/lib/callbackPersona');
  type Store = import('@/lib/relances/types').RelanceStore;
  type Deps = import('@/lib/relances/types').EngineDeps;
  const uuid = (id: number) => REQUESTERS.find((r) => r.id === id)!.uuid;

  let passed = 0;
  const test = async (name: string, fn: () => Promise<void> | void) => {
    try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };
  const reset = () => { tables.clear(); mails.length = 0; blacklist.length = 0; };

  /* ---------- Lien « Arrêter les relances de ce contact » ---------- */

  const BOB = 'bob.durand@exemple.fr';
  const url = stopRelancesUrl(BOB)!;
  const params = new URL(url).searchParams;
  const callStop = (method: string, q: Record<string, string>) => quiet(async () => {
    const res = mockRes();
    await stopRoute({ method, query: q, headers: {}, body: {} } as unknown as NextApiRequest, res as unknown as NextApiResponse);
    return res;
  });

  await test('lien d’arrêt : adresse du site, jeton propre (différent du lien de désinscription), vérifié à temps constant', () => {
    assert.match(url, /^https:\/\/www\.permanenceia\.com\/api\/relances\/stop\?e=[\w-]+&t=[\w-]+$/);
    assert.ok(!url.includes('@'), 'adresse encodée, jamais en clair');
    assert.equal(verifyStopToken(BOB, params.get('t')), true);
    assert.equal(verifyStopToken('autre@exemple.fr', params.get('t')), false);
    assert.notEqual(stopToken(BOB), emailToken(BOB));
    assert.equal(verifyStopToken(BOB, emailToken(BOB)), false, 'le lien de désinscription du client ne sert pas ici');
    assert.match(stopRelancesLine(BOB), /^Arrêter les relances de ce contact : https:/);
    assert.equal(stopRelancesLine('pas-une-adresse'), '');
    assert.equal(stopRelancesUrl(null), null);
  });

  await test('lien d’arrêt : la page (GET) ne change rien ; le bouton (POST) enregistre l’arrêt une seule fois ; lien abîmé refusé', async () => {
    reset();
    const q = { e: params.get('e')!, t: params.get('t')! };
    const page = await callStop('GET', q);
    assert.equal(page.statusCode, 200);
    assert.match(String(page.body), /<form method="post"/);
    assert.match(String(page.headers['x-robots-tag']), /noindex/);
    assert.equal(rowsOf('relance_stops').length, 0, 'GET sans effet (antivirus des messageries)');
    const done = await callStop('POST', q);
    assert.equal(done.statusCode, 200);
    assert.match(String(done.body), /Relances arrêtées/);
    assert.deepEqual(rowsOf('relance_stops').map((r) => [r.email_key, r.reason, r.scope, r.source]), [[emailKey(BOB), 'manual', 'marketing', 'lien équipe']]);
    await callStop('POST', q);
    assert.equal(rowsOf('relance_stops').length, 1, 'jamais en double');
    const bad = await callStop('POST', { e: q.e, t: `${q.t.slice(0, -2)}xx` });
    assert.equal(bad.statusCode, 403);
    const other = await callStop('POST', { e: Buffer.from('autre@exemple.fr').toString('base64url'), t: q.t });
    assert.equal(other.statusCode, 403);
    assert.equal(rowsOf('relance_stops').length, 1);
  });

  /* ---------- Moteur des relances : arrêt manuel et désinscription par e-mail ---------- */

  const NOW = new Date('2026-10-13T07:30:00Z'); // mardi 9 h 30 à Paris : fenêtre commerciale ouverte
  const ALICE = 'alice.martin@exemple.fr';
  const K = (e: string) => emailKey(e);
  const consent = (email: string) => ({ email_key: K(email), channel: 'email', purpose: 'marketing', granted: true, legal_basis: 'consent', created_at: '2026-10-11T10:00:00Z' });
  const callback = (email: string) => ({
    id: `cb-${email}`, name: 'Alice Martin', phone: '+33612345678', email, company: 'Plomberie Martin', sector: 'services-a-domicile',
    slot: null, note: null, type: 'commercial', agent: 'Accompagnement essai', status: 'pending', created_at: '2026-10-11T10:00:00Z', locale: 'fr',
  });
  function memoryStore(init: { callbacks?: Row[]; signups?: Row[]; consents?: Row[]; stops?: Row[]; prefs?: Map<string, string> } = {}) {
    const t = { log: [] as Row[], state: [] as Row[], stops: init.stops ?? [], runs: [] as Row[] };
    const lk = (r: Row) => `${r.email_key}|${r.sequence}|${r.step}|${r.dry_run}`;
    const sk = (r: Row) => `${r.email_key}|${r.sequence}|${r.dry_run}`;
    const store: Store = {
      settings: async () => ({ enabled: true, last_report_on: NOW.toISOString().slice(0, 10) }),
      updateSettings: async () => true,
      callbacks: async () => (init.callbacks ?? []) as any,
      signups: async () => (init.signups ?? []) as any,
      contacts: async () => [],
      emailPrefs: async () => init.prefs ?? new Map(),
      phoneOptouts: async () => new Set(),
      consents: async () => (init.consents ?? []) as any,
      stripe: async () => ({ customers: [], subscriptions: [], eventsSeen: false }),
      snapshots: async () => [],
      saveSnapshots: async () => true,
      logs: async (dry) => t.log.filter((l) => l.dry_run === dry).map((l) => ({ ...l })) as any,
      logPreviews: async () => [],
      insertLogIfNew: async (row) => { if (t.log.some((l) => lk(l) === lk(row))) return false; t.log.push({ ...row }); return true; },
      updateLog: async (k, p) => { const r = t.log.find((l) => lk(l) === lk(k)); if (r) Object.assign(r, p); },
      states: async (dry) => t.state.filter((s) => s.dry_run === dry).map((s) => ({ ...s })) as any,
      insertStateIfNew: async (row) => { if (t.state.some((s) => sk(s) === sk(row))) return false; t.state.push({ ...row }); return true; },
      updateState: async (k, p) => { const r = t.state.find((s) => sk(s) === sk(k)); if (r) Object.assign(r, p); },
      stops: async () => t.stops.map((s) => ({ ...s })) as any,
      addStop: async (row) => { t.stops.push({ ...row, created_at: NOW.toISOString() }); },
      runs: async () => t.runs as any,
      saveRun: async (row) => { t.runs.push(row); },
      recheck: async (email) => ({ signedUp: (init.signups ?? []).some((s) => s.email === email), subscriptions: [] }),
    };
    return { store, t };
  }
  function deps(store: Store, over: Partial<Deps> = {}) {
    const sent: Row[] = [];
    const team: Row[] = [];
    const d: Deps = {
      store,
      sendMail: async (m) => { sent.push(m); return true; },
      notifyTeam: async (subject, text) => { team.push({ subject, text }); },
      inbound: async () => [],
      content: relancesContent,
      emailKey,
      now: () => NOW,
      sleep: async () => undefined,
      config: readConfig({ RELANCES_ENABLED: '1', RELANCES_DRY_RUN: '0' }),
      log: () => undefined,
      logError: () => undefined,
      ...over,
    };
    return { d, sent, team };
  }
  const manual = (email: string) => ({ email_key: K(email), reason: 'manual', scope: 'marketing', source: 'lien équipe', created_at: '2026-10-12T12:00:00Z' });

  await test('moteur : arrêt manuel (lien de l’équipe) → aucun commercial, série close « manual »', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], stops: [manual(ALICE)] });
    const { d, sent } = deps(store);
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.manual_stop, 1);
    assert.equal(t.state.find((s) => s.sequence === 'P')?.stop_reason, 'manual');
  });

  await test('moteur : arrêt manuel → les messages de service liés au compte continuent (I1)', async () => {
    const { store } = memoryStore({
      callbacks: [callback(ALICE)], consents: [consent(ALICE)], stops: [manual(ALICE)],
      signups: [{ email: ALICE, name: 'Alice Martin', signed_up_at: '2026-10-12T06:00:00Z' }],
    });
    const { d, sent } = deps(store);
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].category, 'essential');
  });

  const unsubMail = (from: string, subject = 'unsubscribe') => ({ from, subject, date: 'Mon, 12 Oct 2026 18:00:00 +0200', automatic: false, bounce: false, bodyEmails: [], unsubscribe: true });

  await test('moteur : désinscription reçue par e-mail → préférence enregistrée, équipe prévenue, aucun commercial ; une seule fois', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const prefs: [string, string][] = [];
    const { d, sent, team } = deps(store, {
      inbound: async () => [unsubMail(ALICE), unsubMail('inconnu@exemple.fr', 'Re: Désinscription')],
      saveEmailPref: async (email, source) => { prefs.push([email, source]); },
    });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.opted_out, 1);
    assert.deepEqual(prefs.map(([e]) => e), [ALICE, 'inconnu@exemple.fr']);
    assert.match(prefs[0][1], /désinscription reçue par e-mail/);
    assert.deepEqual(t.stops.map((s) => s.reason), ['unsubscribed', 'unsubscribed']);
    assert.ok(!t.stops.some((s) => s.reason === 'replied'), 'pas traitée comme une simple réponse');
    const alert = team.find((m) => /désinscription\(s\) reçue\(s\) par e-mail/.test(m.subject));
    assert.ok(alert, 'équipe prévenue');
    assert.match(alert!.text, /alice\.martin@exemple\.fr — « unsubscribe » — préférence enregistrée/);
    assert.match(alert!.text, /inconnu@exemple\.fr \(adresse inconnue des relances\) — « Re: Désinscription »/);
    assert.match(alert!.text, /résiliation de l’abonnement, la traiter dans Stripe/, 'objet repris et résiliation à vérifier');
    // Passage suivant, même boîte relue (3 jours) : rien de plus.
    await runRelances(d);
    assert.equal(prefs.length, 2);
    assert.equal(t.stops.length, 2);
    assert.equal(team.filter((m) => /désinscription/.test(m.subject)).length, 1);
    assert.equal(sent.length, 0);
  });

  await test('moteur : préférence non enregistrée (base en panne) → commercial arrêté quand même, équipe invitée à la poser', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent, team } = deps(store, { inbound: async () => [unsubMail(ALICE)], saveEmailPref: async () => { throw new Error('base indisponible'); } });
    await runRelances(d);
    assert.equal(sent.length, 0);
    assert.ok(team.some((m) => /préférence NON enregistrée/.test(m.text)));
  });

  await test('moteur : réinscription après une désinscription par e-mail (préférence « all ») → commercial de nouveau permis', async () => {
    const stop = { email_key: K(ALICE), reason: 'unsubscribed', scope: 'marketing', source: 'imap:x', created_at: '2026-10-12T12:00:00Z' };
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], stops: [stop], prefs: new Map([[K(ALICE), 'all']]) });
    const { d, sent } = deps(store);
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].category, 'marketing');
  });

  await test('moteur : alerte « réponse reçue » avec le lien « Arrêter les relances de ce contact »', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, team } = deps(store, { inbound: async () => [{ from: ALICE, subject: 'Re: votre demande', date: 'x', automatic: false, bounce: false, bodyEmails: [] }] });
    await runRelances(d);
    const alert = team.find((m) => /réponse/.test(m.subject));
    assert.ok(alert);
    assert.ok(alert!.text.includes(stopRelancesUrl(ALICE)!), 'lien signé de ce contact');
  });

  await test('moteur : objet « ביטול מנוי » ou « Rezygnacja » (résiliation) → réponse avec son objet dans l’alerte, aucune préférence posée', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const prefs: string[] = [];
    const h = (subject: string) => `From: Alice <${ALICE}>\r\nSubject: ${subject}\r\nDate: Mon, 12 Oct 2026 18:00:00 +0200\r\n`;
    const { d, team } = deps(store, {
      inbound: async () => [parseMessage(h('=?utf-8?B?15HXmdeY15XXnCDXnteg15XXmQ==?='), '', 'contact@permanenceia.com')],
      saveEmailPref: async (email) => { prefs.push(email); },
    });
    await runRelances(d);
    assert.equal(prefs.length, 0);
    assert.deepEqual(t.stops.map((x) => x.reason), ['replied']);
    const alert = team.find((m) => /réponse/.test(m.subject));
    assert.ok(alert && alert.text.includes('« ביטול מנוי »'), 'objet repris dans l’alerte');
  });

  /* ---------- Objets de désinscription ---------- */

  await test('objet « unsubscribe » et équivalents dans les 7 langues ; jamais une phrase qui contient le mot', () => {
    for (const s of ['unsubscribe', 'Unsubscribe', 'Re: unsubscribe', 'RE: Fwd: Unsubscribe me', 'STOP', 'stop.', 'désinscription', 'Désinscrivez-moi',
      'disiscrizione', 'Annulla iscrizione', 'Disiscrivetemi', 'rimuovimi', 'wypisz mnie', 'Odp: wypisanie', 'Proszę o wypisanie', 'wypisanie z listy',
      'afmelden', 'Afmelding', 'Uitschrijven', 'uitschrijving', 'הסרה', 'הסירו אותי', 'ביטול הרשמה', '[unsubscribe]']) {
      assert.equal(isUnsubscribeSubject(s), true, s);
    }
    for (const s of ['Re: votre essai', 'Je ne veux pas me désinscrire, juste une question', 'Stop au répondeur ?', 'unsubscribe link broken', '', 'Re: Relance P1']) {
      assert.equal(isUnsubscribeSubject(s), false, s);
    }
    // Résiliation d’un abonnement payant : une réponse (objet dans l’alerte), jamais une simple désinscription des e-mails.
    for (const s of ['Rezygnacja', 'Odp: rezygnacja', 'rezygnuję', 'rezygnuje', 'ביטול מנוי', 'Cancellazione', 'Désabonnement', 'me désabonner']) {
      assert.equal(isUnsubscribeSubject(s), false, s);
    }
    const h = (subject: string, extra = '') => `From: Alice <alice.martin@exemple.fr>\r\nSubject: ${subject}\r\nDate: Mon, 12 Oct 2026 18:00:00 +0200\r\n${extra}`;
    assert.equal(parseMessage(h('unsubscribe'), '', 'contact@permanenceia.com').unsubscribe, true);
    assert.equal(parseMessage(h('=?utf-8?B?15TXodeo15Q=?='), '', 'contact@permanenceia.com').unsubscribe, true, 'objet encodé (הסרה)');
    assert.equal(parseMessage(h('Re: votre demande'), '', 'contact@permanenceia.com').unsubscribe, false);
    // Demande générée par la messagerie depuis l’en-tête List-Unsubscribe, marquée automatique : reconnue quand même.
    const generated = parseMessage(h('unsubscribe', 'Auto-Submitted: auto-generated\r\n'), '', 'contact@permanenceia.com');
    assert.equal(generated.automatic, true);
    assert.equal(generated.unsubscribe, true, 'demande List-Unsubscribe marquée automatique');
    assert.equal(parseMessage(h('unsubscribe', 'Precedence: bulk\r\n'), '', 'contact@permanenceia.com').unsubscribe, true);
    const ooo = parseMessage(h('Automatic reply: unsubscribe', 'Auto-Submitted: auto-replied\r\n'), '', 'contact@permanenceia.com');
    assert.equal(ooo.unsubscribe, false, 'vraie réponse automatique');
    assert.equal(parseMessage(h('Réponse automatique : Re: votre essai', 'X-Autoreply: yes\r\n'), '', 'contact@permanenceia.com').unsubscribe, false);
    assert.equal(parseMessage('From: MAILER-DAEMON@zoho.com\r\nSubject: unsubscribe\r\n', 'alice.martin@exemple.fr', 'contact@permanenceia.com').unsubscribe, false, 'rebond');
  });

  /* ---------- « Ne plus me contacter » sur les canaux écrits ---------- */

  const T0 = '2026-10-09T09:00:00Z';
  async function hook(body: Row) {
    const req = { method: 'POST', headers: { 'x-webhook-token': TOKEN }, query: {}, url: '/api/webhooks/autocalls', body } as unknown as NextApiRequest;
    const res = mockRes();
    await quiet(() => webhook(req, res as unknown as NextApiResponse));
    return res;
  }
  const conv = (o: { id?: string; aid: number; outcome?: string; transcript: Row[]; vars?: Row; phone?: string | null; created?: string }) => ({
    conversation_id: o.id ?? randomUUID(), assistant_id: uuid(o.aid), assistant_name: `Agent ${o.aid}`, type: 'widget', message_count: o.transcript.length, status: 'ended',
    extracted_variables: { summary: 'Résumé de test', outcome: o.outcome ?? 'information', ...(o.vars || {}) },
    transcript: o.transcript, customer_phone: o.phone ?? null, created_at: o.created ?? T0, ended_at: new Date().toISOString(),
  });
  const callTool = (name: string, args: Row) => ({ role: 'assistant', content: null, tool_calls: [{ type: 'function', function: { name, arguments: JSON.stringify(args) } }] });
  const seedCallback = (phone: string, status: string, created = '2026-10-09T09:05:00Z', type = 'commercial', note: string | null = null) =>
    rowsOf('callbacks').push({ id: randomUUID(), name: 'Marc', phone, email: null, type, status, created_at: created, note });
  const optouts = () => rowsOf('call_events').filter((r) => r.kind === 'optout');

  await test('Messenger : rappel demandé puis « ne plus me contacter » dans le même échange → rappel annulé, opposition et liste noire, une seule fois', async () => {
    reset();
    seedCallback('+33612345678', 'scheduled');
    seedCallback('+33699999999', 'scheduled'); // autre numéro : intact
    const id = randomUUID();
    const body = conv({ id, aid: 21297, transcript: [
      { role: 'user', content: 'Rappelez-moi au 06 12 34 56 78' },
      callTool('enregistrer_demande_rappel', { phone: '+33612345678', name: 'Marc' }),
      { role: 'tool', content: '{"success":true}' },
      { role: 'user', content: 'Finalement ne me contactez plus' },
      callTool('ne_plus_appeler_numero', { phone: '+33 6 12 34 56 78' }),
      { role: 'assistant', content: 'C’est noté.' },
    ] });
    const r = await hook(body);
    assert.equal(r.statusCode, 200);
    assert.deepEqual(rowsOf('callbacks').map((c) => [c.phone, c.status]), [['+33612345678', 'cancelled'], ['+33699999999', 'scheduled']]);
    assert.equal(optouts().length, 1);
    assert.equal(optouts()[0].customer_phone, '+33612345678');
    assert.match(optouts()[0].summary, /fin d’échange écrit/);
    assert.deepEqual(blacklist.map((b) => b.phone_number), ['+33612345678']);
    assert.ok(mails.some((m) => /Opposition : ne plus appeler — \+33612345678/.test(m.subject)));
    // La conversation revient après un nouveau message : rien de plus.
    await hook({ ...body, message_count: 8 });
    assert.equal(optouts().length, 1);
    assert.equal(blacklist.length, 1);
  });

  await test('widget : numéro cité sans rappel demandé pendant l’échange → rien appliqué, une seule alerte « À vérifier »', async () => {
    reset();
    seedCallback('+447700900123', 'scheduled', '2026-10-01T10:00:00Z'); // demande plus ancienne que l’échange
    const id = randomUUID();
    const body = conv({ id, aid: 21206, transcript: [callTool('ne_plus_appeler_numero', { phone: '+447700900123' })] });
    await hook(body);
    assert.equal(rowsOf('callbacks')[0].status, 'scheduled');
    assert.equal(optouts().length, 0);
    assert.equal(blacklist.length, 0);
    const alerts = mails.filter((m) => /À vérifier : « ne plus me contacter » par écrit, non appliqué — \+447700900123/.test(m.subject));
    assert.equal(alerts.length, 1);
    await hook({ ...body, message_count: 3 });
    assert.equal(mails.filter((m) => /À vérifier/.test(m.subject)).length, 1, 'une seule alerte par échange et par numéro');
  });

  await test('espace client : issue « desinscription » avec optout_phone et adresse → rappel créé pendant l’échange annulé, e-mails commerciaux coupés', async () => {
    reset();
    const exchange = randomUUID();
    seedCallback('+33612345678', 'pending', '2026-10-09T09:10:00Z', 'support', `[LANG:fr] — [MKT:fr] — [CONV:${exchange}]`);
    // Numéro écrit sans indicatif : reconnu parce qu’il correspond à la demande enregistrée pendant CET échange (marqueur).
    await hook(conv({ id: exchange, aid: 21205, outcome: 'desinscription', vars: { optout_phone: '06 12 34 56 78', email: 'Client@Exemple.fr' }, transcript: [{ role: 'user', content: 'stop' }] }));
    assert.equal(rowsOf('callbacks')[0].status, 'cancelled');
    assert.equal(optouts()[0].outcome, 'desinscription');
    assert.equal(optouts()[0].customer_phone, '+33612345678');
    const pref = rowsOf('call_events').find((r) => r.kind === 'email_pref');
    assert.ok(pref, 'préférence enregistrée');
    assert.equal(pref!.outcome, 'essential_only');
    assert.equal(pref!.external_id, emailKey('client@exemple.fr'));
    // Sans demande pendant l’échange : rien appliqué sur le téléphone, alerte avec le numéro tel qu’écrit ; l’e-mail est
    // quand même désinscrit (aucun risque pour un tiers : seuls les e-mails commerciaux s’arrêtent).
    reset();
    seedCallback('+33612345678', 'pending', '2026-10-01T09:10:00Z', 'support');
    await hook(conv({ aid: 21205, outcome: 'desinscription', vars: { optout_phone: '06 12 34 56 78', email: 'client@exemple.fr' }, transcript: [{ role: 'user', content: 'stop' }] }));
    assert.equal(rowsOf('callbacks')[0].status, 'pending');
    assert.equal(optouts().length, 0);
    assert.ok(mails.some((m) => /À vérifier : « ne plus me contacter » par écrit, non appliqué — 06 12 34 56 78/.test(m.subject)));
    assert.ok(rowsOf('call_events').some((r) => r.kind === 'email_pref'));
  });

  await test('garde-fou : demande de rappel d’un autre échange (formulaire public, autre conversation) créée pendant la fenêtre → « unverified », aucune opposition', async () => {
    reset();
    // Conversation Messenger ouverte depuis deux jours (renvoyée à chaque message) ; le numéro cité a demandé un rappel
    // hier par le formulaire public, et un autre échange a enregistré une demande pour lui ce matin.
    const id = randomUUID();
    const opened = new Date(Date.now() - 2 * 86_400_000).toISOString();
    seedCallback('+33612345678', 'scheduled', new Date(Date.now() - 86_400_000).toISOString(), 'commercial', '[LANG:fr] — [MKT:fr]');
    seedCallback('+33612345678', 'scheduled', new Date(Date.now() - 3_600_000).toISOString(), 'commercial', `[LANG:fr] — [CONV:${randomUUID()}]`);
    // Demande de CET échange, mais pour un autre numéro : ne prouve rien pour le numéro cité.
    seedCallback('+33677777777', 'scheduled', new Date(Date.now() - 1_800_000).toISOString(), 'commercial', `[CONV:${id}]`);
    const registered: Row[] = [];
    const optDeps = { ...writtenOptoutDeps, register: (async (o: Row) => { registered.push(o); return { problems: [] }; }) as any };
    const body = conv({ id, aid: 21297, outcome: 'ne_plus_appeler', created: opened, transcript: [
      { role: 'user', content: 'Ne plus appeler le +33 6 12 34 56 78' }, callTool('ne_plus_appeler_numero', { phone: '+33 6 12 34 56 78' }),
    ] });
    const r = await quiet(() => applyWrittenOptout(body, 'ne_plus_appeler', optDeps));
    assert.equal(r.status, 'unverified');
    assert.equal(registered.length, 0, 'aucun registerOptOut');
    // Par le webhook : rien d’annulé, aucune opposition ni liste noire, une alerte « À vérifier ».
    reset();
    seedCallback('+33612345678', 'scheduled', new Date(Date.now() - 86_400_000).toISOString(), 'commercial', '[LANG:fr] — [MKT:fr]');
    await hook(body);
    assert.equal(rowsOf('callbacks')[0].status, 'scheduled');
    assert.equal(optouts().length, 0);
    assert.equal(blacklist.length, 0);
    assert.ok(mails.some((m) => /À vérifier : « ne plus me contacter » par écrit, non appliqué — \+33612345678/.test(m.subject)));
    // La même demande, marquée de CET échange : preuve suffisante.
    seedCallback('+33612345678', 'pending', new Date(Date.now() - 600_000).toISOString(), 'commercial', `[LANG:fr] — [CONV:${id}]`);
    const ok = await quiet(() => applyWrittenOptout(body, 'ne_plus_appeler', optDeps));
    assert.equal(ok.status, 'applied');
    assert.deepEqual(registered.map((o) => o.phone), ['+33612345678']);
  });

  await test('chaîne : demande prise par l’outil d’un widget (conversation_id) → marqueur [CONV:…] ; « ne plus me contacter » du même échange avec un numéro écrit sans indicatif → appliqué', async () => {
    reset();
    const id = randomUUID();
    const cb = (body: Row) => quiet(async () => {
      const res = mockRes();
      const req = { method: 'POST', headers: { 'x-webhook-token': TOKEN, 'x-forwarded-for': '10.9.9.9' }, query: { aid: uuid(21203) }, url: '/api/callback', socket: { remoteAddress: '127.0.0.1' }, body };
      await callbackRoute(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
      return res;
    });
    const started = new Date(Date.now() - 300_000).toISOString();
    const r = await cb({ name: 'Marc', phone: '+33612345678', consentCall: 'true', type: 'commercial', agent: 'Widget Jade', language: 'fr', conversation_id: id });
    assert.equal(r.statusCode, 200);
    assert.ok(String(rowsOf('callbacks')[0].note).includes(`[CONV:${id}]`), 'marqueur posé par le serveur');
    // Gabarit non remplacé, identifiant trop court ou formulaire du site (sans jeton) : aucun marqueur.
    await cb({ name: 'Marc', phone: '+33612345679', consentCall: 'true', type: 'commercial', agent: 'Widget Jade', conversation_id: '{{conversation_id}}' });
    assert.ok(!String(rowsOf('callbacks')[1].note).includes('[CONV:'));
    assert.equal(exchangeId('{{call_id}}'), null);
    assert.equal(exchangeId('ab'), null);
    assert.equal(exchangeId(`${id}<script>`), `${id}script`);
    await hook(conv({ id, aid: 21203, outcome: 'ne_plus_appeler', created: started, vars: { optout_phone: '06 12 34 56 78' }, transcript: [{ role: 'user', content: 'Finalement, ne m’appelez plus.' }] }));
    assert.equal(rowsOf('callbacks')[0].status, 'cancelled');
    assert.equal(rowsOf('callbacks')[1].status === 'cancelled', false, 'autre numéro intact');
    assert.deepEqual(optouts().map((o) => o.customer_phone), ['+33612345678']);
  });

  await test('widget vocal (fin d’appel « web », sans conversation_id ni numéro d’appelant) : rappel demandé puis « ne plus m’appeler » → rappel annulé, opposition une seule fois', async () => {
    reset();
    seedCallback('+33612345678', 'scheduled');
    seedCallback('+33699999999', 'scheduled'); // autre numéro : intact
    const body = {
      id: 880001, type: 'web', assistant_id: uuid(21203), assistant_name: 'Jade', duration: 90, status: 'completed',
      extracted_variables: { outcome: 'ne_plus_appeler', summary: 'Résumé de test' },
      transcript: [
        { type: 'transcript', text: 'Rappelez-moi au 06 12 34 56 78.', sender: 'human' },
        { type: 'function', text: 'enregistrer_demande_rappel({"phone":"+33612345678","name":"Marc"})', sender: 'bot' },
        { type: 'transcript', text: 'Finalement, ne m’appelez plus.', sender: 'human' },
      ],
      created_at: T0, finished_at: new Date().toISOString(),
    };
    const r = await hook(body);
    assert.equal(r.statusCode, 200);
    assert.deepEqual(rowsOf('callbacks').map((c) => [c.phone, c.status]), [['+33612345678', 'cancelled'], ['+33699999999', 'scheduled']]);
    assert.equal(optouts().length, 1);
    assert.equal(optouts()[0].customer_phone, '+33612345678');
    assert.deepEqual(blacklist.map((b) => b.phone_number), ['+33612345678']);
    // Fin d’appel renvoyée : rien de plus.
    await hook(body);
    assert.equal(optouts().length, 1);
    assert.equal(blacklist.length, 1);
    // Appel téléphonique avec numéro d’appelant : jamais ce chemin (opposition par le numéro de l’appelant).
    reset();
    await hook({ ...body, id: 880002, type: 'inbound', customer_phone: '+447700900123', transcript: [{ type: 'function', text: 'ne_plus_appeler({"phone":"+33612345678"})', sender: 'bot' }] });
    assert.ok(!rowsOf('call_events').some((e) => e.kind === 'optout_a_verifier'));
    assert.deepEqual(optouts().map((o) => o.customer_phone), ['+447700900123']);
  });

  await test('WhatsApp (numéro connu) : chemin habituel, pas d’alerte « À vérifier »', async () => {
    reset();
    seedCallback('+33612345678', 'scheduled');
    await hook(conv({ aid: 21358, outcome: 'desinscription', phone: '+33612345678', transcript: [{ role: 'user', content: 'STOP' }] }));
    assert.equal(rowsOf('callbacks')[0].status, 'cancelled');
    assert.equal(optouts().length, 1);
    assert.ok(!rowsOf('call_events').some((r) => r.kind === 'optout_a_verifier'));
  });

  await test('appels d’outils lus dans les deux formats de transcription', () => {
    const calls = toolCalls([
      callTool('enregistrer_demande_rappel', { phone: '+33612345678' }),
      { type: 'function', text: 'ne_plus_appeler({"phone":"+447700900123"})', sender: 'bot' },
      { role: 'assistant', function_call: { name: 'register_callback_request', arguments: '{"phone":"+972501234567"}' } },
      { role: 'tool', name: 'ne_plus_appeler', content: 'résultat' },
      'texte',
    ]);
    assert.deepEqual(calls.map((c) => [c.name, c.args.phone]), [
      ['enregistrer_demande_rappel', '+33612345678'], ['ne_plus_appeler', '+447700900123'], ['register_callback_request', '+972501234567'],
    ]);
  });

  console.log(`\n${passed} tests réussis (aucun envoi réel).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
