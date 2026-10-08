// Tests du moteur des relances (aucun réseau, aucune base réelle, aucun envoi réel) :
//   npx tsx scripts/test-relances.ts
// Base en mémoire, sendMail et alertes remplacés par des faux qui enregistrent les appels. Vérifie : coupé → rien ;
// mode test → journalisé sans envoi ; désinscription, opposition, réponse, inscription, abonnement → arrêt ;
// fenêtre locale et plafonds ; idempotence ; langue jamais remplacée par une autre ; préfixe « פרסומת » en Israël ;
// signature Stripe ; accès à la route planifiée ; lecture IMAP.
import assert from 'node:assert/strict';
import { createHmac, generateKeyPairSync, randomBytes, sign } from 'crypto';

// Secret de test aléatoire (jamais celui de production) ; SMTP et base retirés : rien ne peut partir pour de vrai.
process.env.ACCOUNT_CODE_SECRET = randomBytes(32).toString('hex');
for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'AUTOCALLS_API_KEY', 'STRIPE_READ_KEY', 'STRIPE_CUSTOMERS_KEY', 'RELANCES_IMAP_USER', 'RELANCES_IMAP_PASS', 'CRON_SECRET', 'RELANCES_OIDC_AUDIENCE', 'RELANCES_OIDC_EMAIL']) delete process.env[k];

type Any = Record<string, any>;

async function main() {
  const { emailKey } = await import('@/lib/emailPrefs');
  const { runRelances } = await import('@/lib/relances/engine');
  const { readConfig } = await import('@/lib/relances/config');
  const { relancesContent } = await import('@/lib/relances/content');
  const { RELANCES_FR } = await import('@/i18n/content/fr');
  const { verifyStripeSignature, applyStripeEvent } = await import('@/lib/relances/stripe');
  const { cronTokenOk, oidcOk } = await import('@/lib/relances/auth');
  const { parseMessage, findTagged, fetchLiterals } = await import('@/lib/relances/imap');
  const { isHoliday, isMarketBusinessDay, windowBlock } = await import('@/lib/relances/calendar');
  const { HE_AD_PREFIX } = await import('@/lib/relances/render');
  type Store = import('@/lib/relances/types').RelanceStore;
  type Deps = import('@/lib/relances/types').EngineDeps;

  let passed = 0;
  const test = async (name: string, fn: () => Promise<void> | void) => {
    try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };

  /* ---------- Base en mémoire ---------- */

  interface Init {
    callbacks?: Any[]; signups?: Any[]; contacts?: Any[]; consents?: Any[]; customers?: Any[]; subscriptions?: Any[]; snapshots?: Any[];
    log?: Any[]; state?: Any[]; stops?: Any[];
    settings?: { enabled: boolean; last_report_on?: string | null } | null; prefs?: Map<string, string>; optouts?: Set<string>; recheckSignedUp?: boolean;
  }
  function memoryStore(init: Init = {}) {
    const t = {
      callbacks: init.callbacks ?? [], signups: init.signups ?? [], contacts: init.contacts ?? [], consents: init.consents ?? [],
      customers: init.customers ?? [], subscriptions: init.subscriptions ?? [], snapshots: init.snapshots ?? [],
      log: init.log ?? [], state: init.state ?? [], stops: init.stops ?? [], runs: [] as Any[],
    };
    const settings = init.settings === undefined ? { enabled: true } : init.settings;
    const lk = (r: Any) => `${r.email_key}|${r.sequence}|${r.step}|${r.dry_run}`;
    const sk = (r: Any) => `${r.email_key}|${r.sequence}|${r.dry_run}`;
    const store: Store = {
      settings: async () => (settings ? { ...settings } : null),
      updateSettings: async (p) => { if (settings) Object.assign(settings, p); return Boolean(settings); },
      callbacks: async () => t.callbacks as any,
      signups: async () => t.signups as any,
      contacts: async () => t.contacts as any,
      emailPrefs: async () => init.prefs ?? new Map(),
      phoneOptouts: async () => init.optouts ?? new Set(),
      consents: async () => t.consents as any,
      stripe: async () => ({ customers: t.customers as any, subscriptions: t.subscriptions as any, eventsSeen: t.subscriptions.length > 0 || t.customers.length > 0 }),
      snapshots: async () => t.snapshots as any,
      saveSnapshots: async (rows) => { t.snapshots.push(...rows); return true; },
      logs: async (dry) => (settings ? t.log.filter((l) => l.dry_run === dry).map((l) => ({ ...l })) as any : null),
      logPreviews: async () => t.log.filter((l) => l.preview) as any,
      insertLogIfNew: async (row) => { if (t.log.some((l) => lk(l) === lk(row))) return false; t.log.push({ ...row }); return true; },
      updateLog: async (k, p) => { const r = t.log.find((l) => lk(l) === lk(k)); if (r) Object.assign(r, p); },
      states: async (dry) => (settings ? t.state.filter((s) => s.dry_run === dry).map((s) => ({ ...s })) as any : null),
      insertStateIfNew: async (row) => { if (t.state.some((s) => sk(s) === sk(row))) return false; t.state.push({ ...row }); return true; },
      updateState: async (k, p) => { const r = t.state.find((s) => sk(s) === sk(k)); if (r) Object.assign(r, p); },
      stops: async () => (settings ? t.stops.map((s) => ({ ...s })) as any : null),
      addStop: async (row) => { t.stops.push({ ...row, created_at: new Date().toISOString() }); },
      runs: async () => t.runs as any,
      saveRun: async (row) => { t.runs.push(row); },
      recheck: async (email) => ({
        signedUp: init.recheckSignedUp ?? t.signups.some((s) => s.email === email),
        subscriptions: t.subscriptions.filter((s) => t.customers.some((c) => c.email === email && c.customer_id === s.customer_id)) as any,
      }),
    };
    return { store, t, settings };
  }

  // Mardi 13 octobre 2026, 9 h 30 à Paris (7 h 30 UTC) : fenêtre marketing ouverte en France.
  const NOW = new Date('2026-10-13T07:30:00Z');
  const ALICE = 'alice.martin@exemple.fr';
  const K = (e: string) => emailKey(e);
  const consent = (email: string, basis = 'consent', granted: boolean | null = true) =>
    ({ email_key: K(email), channel: 'email', purpose: 'marketing', granted, legal_basis: basis, created_at: '2026-10-11T10:00:00Z' });
  const callback = (email: string, over: Any = {}) => ({
    id: `cb-${email}`, name: 'Alice Martin', phone: '+33612345678', email, company: 'Plomberie Martin', sector: 'services-a-domicile',
    slot: null, note: null, type: 'commercial', agent: 'Accompagnement essai', status: 'pending', created_at: '2026-10-11T10:00:00Z', locale: 'fr', ...over,
  });

  function deps(store: Store, over: Partial<Deps> & { env?: Record<string, string> } = {}) {
    const sent: Any[] = [];
    const team: Any[] = [];
    const env = { RELANCES_ENABLED: '1', ...over.env };
    const d: Deps = {
      store,
      sendMail: async (m) => { sent.push(m); return true; },
      notifyTeam: async (subject, text) => { team.push({ subject, text }); },
      inbound: async () => [],
      content: relancesContent,
      emailKey,
      now: () => NOW,
      sleep: async () => undefined,
      config: readConfig(env),
      log: () => undefined,
      ...over,
    };
    return { d, sent, team };
  }

  /* ---------- Interrupteurs ---------- */

  await test('réglages par défaut : coupé, mode test, marchés fr/en-gb/en-au', () => {
    const c = readConfig({});
    assert.equal(c.envEnabled, false);
    assert.equal(c.dryRun, true);
    assert.deepEqual(c.locales, ['fr', 'en-gb', 'en-au']);
    assert.equal(readConfig({ RELANCES_DRY_RUN: 'nimporte' }).dryRun, true);
    assert.equal(readConfig({ RELANCES_DRY_RUN: '0' }).dryRun, false);
    assert.equal(readConfig({ RELANCES_MAX_PER_RUN: '500' }).maxPerRun, 20);
    assert.equal(readConfig({ RELANCES_MAX_PER_DAY: '9999' }).maxPerDay, 150);
  });

  await test('RELANCES_ENABLED absent → rien (ni journal, ni envoi)', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent } = deps(store, { env: { RELANCES_ENABLED: '' } as any });
    const r = await runRelances(d);
    assert.equal(r.status, 'disabled');
    assert.equal(sent.length, 0);
    assert.equal(t.log.length, 0);
  });

  await test('relance_settings.enabled = false → rien', async () => {
    const { store, t } = memoryStore({ settings: { enabled: false }, callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    assert.equal((await runRelances(d)).status, 'disabled');
    assert.equal(sent.length + t.log.length, 0);
  });

  await test('tables absentes → not_installed, rien', async () => {
    const { store } = memoryStore({ settings: null });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    assert.equal((await runRelances(d)).status, 'not_installed');
    assert.equal(sent.length, 0);
  });

  /* ---------- Mode test et envoi réel ---------- */

  await test('mode test (par défaut) → P1 journalisé avec son texte, rien envoyé', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent } = deps(store);
    const r = await runRelances(d);
    assert.equal(r.status, 'done');
    assert.equal(r.dryRun, true);
    assert.equal(sent.length, 0);
    const row = t.log.find((l) => l.step === 'P1');
    assert.ok(row, 'P1 journalisé');
    assert.equal(row!.status, 'dry_run');
    assert.equal(row!.dry_run, true);
    assert.match(row!.subject, /^Alice, testez l’agent/);
    assert.match(row!.preview, /Vous nous avez demandé un coup de main/);
    assert.match(row!.preview, /14 jours/); // chiffre lu dans markets.ts
    assert.match(row!.preview, /utm_campaign=P1/);
  });

  await test('envoi réel → une fois par sendMail (catégorie marketing, langue, marque), puis jamais deux fois', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(r.counts.sent, 1);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, ALICE);
    assert.equal(sent[0].category, 'marketing');
    assert.equal(sent[0].locale, 'fr');
    assert.equal(sent[0].fromName, 'Permanence IA');
    assert.match(sent[0].html, /essai-gratuit\?utm_source=relance&amp;utm_medium=email&amp;utm_campaign=P1/);
    assert.equal(t.log.find((l) => l.step === 'P1')!.status, 'sent');
    // Second passage dans l’heure : rien de plus (étape journalisée, jamais deux messages le même jour).
    await runRelances(d);
    assert.equal(sent.length, 1);
  });

  await test('idempotence : ligne déjà « queued » (passage interrompu) → aucun renvoi', async () => {
    const { store } = memoryStore({
      callbacks: [callback(ALICE)], consents: [consent(ALICE)],
      log: [{ email_key: K(ALICE), sequence: 'P', step: 'P1', dry_run: false, status: 'queued', category: 'marketing', created_at: '2026-10-12T08:00:00Z' }],
    });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(d);
    assert.equal(sent.length, 0);
  });

  await test('mode test puis envoi réel : les lignes de test ne bloquent pas le vrai P1', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    await runRelances(deps(store).d);
    const live = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(live.d);
    assert.equal(live.sent.length, 1);
    assert.equal(t.log.filter((l) => l.step === 'P1').length, 2);
  });

  await test('échec SMTP → nouvelle tentative au passage suivant, 3 au plus, puis alerte', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    let tries = 0;
    const { d, team } = deps(store, { env: { RELANCES_DRY_RUN: '0' }, sendMail: async () => { tries++; throw new Error('SMTP 421'); } });
    for (let i = 0; i < 5; i++) await runRelances({ ...d, now: () => new Date(NOW.getTime() + i * 60_000) });
    assert.equal(tries, 3);
    assert.equal(t.log.find((l) => l.step === 'P1')!.status, 'failed');
    assert.ok(team.some((m) => /échec définitif P1/.test(m.subject)));
  });

  /* ---------- Arrêts ---------- */

  await test('désinscription (essential_only) → marketing sauté', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], prefs: new Map([[K(ALICE), 'essential_only']]) });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.opted_out, 1);
    assert.equal(t.log.length, 0);
  });

  await test('sans accord marketing enregistré → rien (aucun envoi rétroactif)', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)] });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.no_legal_basis, 1);
  });

  await test('base légale : intérêt légitime B2B admis en France, refusé en Italie ; adresse générique → case exigée', async () => {
    const { marketingBasis, buildContacts } = await import('@/lib/relances/selection');
    const mk = (email: string, basis: string) => buildContacts({
      callbacks: [callback(email)], signups: [], contacts: [], customers: [], subscriptions: [], snapshots: [], platformUsers: [],
      consents: [consent(email, basis, null)], prefs: new Map(), optouts: new Set(), stops: [],
    }, emailKey, NOW, [])[0];
    assert.deepEqual(marketingBasis(mk(ALICE, 'b2b_legit_interest'), 'fr', 'P'), { basis: 'b2b_legit_interest' });
    assert.deepEqual(marketingBasis(mk(ALICE, 'b2b_legit_interest'), 'it', 'P'), { reason: 'basis_not_valid_for_market' });
    assert.deepEqual(marketingBasis(mk('contact@exemple.fr', 'b2b_legit_interest'), 'fr', 'P'), { reason: 'generic_address_needs_consent' });
    assert.deepEqual(marketingBasis(mk(ALICE, 'b2b_legit_interest'), 'fr', 'U'), { reason: 'basis_not_valid_for_market' });
  });

  await test('opposition téléphonique → série arrêtée', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], optouts: new Set(['+33612345678']) });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(t.state.find((s) => s.sequence === 'P')?.stop_reason, 'phone_optout');
  });

  await test('réponse reçue (IMAP) → arrêt, équipe prévenue ; réponse automatique ignorée', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent, team } = deps(store, {
      env: { RELANCES_DRY_RUN: '0' },
      inbound: async () => [
        { from: ALICE, subject: 'Re: votre demande', date: 'Mon, 12 Oct 2026 18:00:00 +0200', automatic: false, bounce: false, bodyEmails: [] },
        { from: 'bob@exemple.fr', subject: 'Réponse automatique', date: null, automatic: true, bounce: false, bodyEmails: [] },
      ],
    });
    await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(t.stops.length, 1);
    assert.equal(t.stops[0].reason, 'replied');
    assert.ok(team.some((m) => /réponse/.test(m.subject) && m.text.includes(ALICE)));
  });

  await test('lecture des réponses non configurée → marketing bloqué en envoi réel (permis en mode test)', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const live = deps(store, { env: { RELANCES_DRY_RUN: '0' }, inbound: undefined });
    const r = await runRelances(live.d);
    assert.equal(live.sent.length, 0);
    assert.equal(r.counts.waiting.reply_check_unavailable, 1);
    const dry = deps(store, { inbound: undefined });
    assert.equal((await runRelances(dry.d)).counts.dry_run, 1);
  });

  await test('inscription → plus de série P (I1 de service à la place)', async () => {
    const { store, t } = memoryStore({
      callbacks: [callback(ALICE)], consents: [consent(ALICE)],
      signups: [{ email: ALICE, name: 'Alice Martin', signed_up_at: '2026-10-12T06:00:00Z' }],
    });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].category, 'essential');
    assert.match(sent[0].subject, /Votre compte est créé/);
    assert.ok(!t.log.some((l) => l.sequence === 'P'));
  });

  await test('inscription constatée juste avant l’envoi → P1 retenu', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], recheckSignedUp: true });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.stage_changed, 1);
  });

  const stripeSetup = (status: string, over: Any = {}) => ({
    customers: [{ customer_id: 'cus_1', email: ALICE, preferred_locale: 'fr', has_paid: false, has_credit_purchase: false, livemode: true }],
    subscriptions: [{
      subscription_id: 'sub_1', customer_id: 'cus_1', status, trial_start: '2026-10-13T06:00:00Z', trial_end: '2026-10-27T06:00:00Z',
      canceled_at: null, ended_at: null, price_amount: 9900, currency: 'usd', billing_interval: 'month', livemode: true, ...over,
    }],
  });

  await test('essai démarré (Stripe trialing) → C1 de service, plus de marketing P', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-10-12T06:00:00Z' }], ...stripeSetup('trialing') });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0', STRIPE_WEBHOOK_SECRET: 'whsec_test' } });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.match(sent[0].subject, /Votre essai a commencé/);
    assert.match(sent[0].text, /27 octobre 2026/);
    assert.ok(t.log.every((l) => l.sequence === 'C'));
  });

  await test('abonnement payé (active) → aucune relance', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)], signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-10-01T06:00:00Z' }], ...stripeSetup('active') });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0', STRIPE_WEBHOOK_SECRET: 'whsec_test' } });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.candidates, 0);
  });

  await test('C5 sans prix Stripe → étape sautée (jamais de valeur inventée)', async () => {
    const { store, t } = memoryStore({
      signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-10-01T06:00:00Z' }],
      ...stripeSetup('trialing', { trial_start: '2026-10-02T06:00:00Z', trial_end: '2026-10-16T06:00:00Z', price_amount: null }),
      log: ['C1', 'C2', 'C3'].map((step) => ({ email_key: K(ALICE), sequence: 'C', step, dry_run: false, status: 'sent', category: 'essential', created_at: '2026-10-05T08:00:00Z' })),
    });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0', STRIPE_WEBHOOK_SECRET: 'whsec_test' } });
    await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(t.log.find((l) => l.step === 'C5')?.skip_reason, 'missing_variable:plan_name');
  });

  await test('Stripe non branché → I2 à I7 en attente (I1 seul)', async () => {
    const { store } = memoryStore({
      signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-10-09T06:00:00Z', locale: 'fr' }], consents: [consent(ALICE)],
      log: [{ email_key: K(ALICE), sequence: 'I', step: 'I1', dry_run: false, status: 'sent', category: 'essential', created_at: '2026-10-10T08:00:00Z' }],
    });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.stripe_not_ready, 1);
  });

  await test('demande trop ancienne → aucune relance rétroactive (série close)', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE, { created_at: '2026-09-20T10:00:00Z' })], consents: [consent(ALICE)] });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(t.state.find((s) => s.sequence === 'P')?.stop_reason, 'stale_entry');
  });

  await test('secteur santé en pause et numéro +1 → pas de prospection', async () => {
    const a = memoryStore({ callbacks: [callback(ALICE, { sector: 'dentaire-cliniques' })], consents: [consent(ALICE)] });
    const ra = deps(a.store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(ra.d);
    assert.equal(ra.sent.length, 0);
    const b = memoryStore({ callbacks: [callback(ALICE, { phone: '+14155550100' })], consents: [consent(ALICE)] });
    const rb = deps(b.store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(rb.d);
    assert.equal(rb.sent.length, 0);
  });

  await test('suivi mensuel M : 30 jours après la fin de la série P, conseil du mois', async () => {
    const days = [1, 4, 9, 16, 25, 38, 55];
    const { store, t } = memoryStore({
      callbacks: [callback(ALICE, { created_at: '2026-07-19T10:00:00Z' })], consents: [consent(ALICE)],
      log: days.map((n, i) => ({ email_key: K(ALICE), sequence: 'P', step: `P${i + 1}`, dry_run: true, status: 'dry_run', category: 'marketing', created_at: new Date(Date.parse('2026-07-19T10:00:00Z') + n * 86_400_000).toISOString() })),
      state: [{ email_key: K(ALICE), sequence: 'P', dry_run: true, entered_at: '2026-07-19T10:00:00Z', status: 'active' }],
    });
    await runRelances(deps(store).d);
    const m1 = t.log.find((l) => l.step === 'M1');
    assert.ok(m1, 'M1 journalisé');
    assert.match(m1!.subject, /Le conseil du mois/);
    assert.match(m1!.preview, /utm_campaign=M1/);
    assert.equal(t.state.find((s) => s.sequence === 'P')?.status, 'done');
  });

  /* ---------- Fenêtre et plafonds ---------- */

  await test('fenêtre locale : hors 9 h–11 h, samedi, jour férié → en attente', async () => {
    const { store } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const at = async (iso: string) => {
      const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' }, now: () => new Date(iso) });
      const r = await runRelances(d);
      assert.equal(sent.length, 0, iso);
      return r.counts.waiting;
    };
    assert.equal((await at('2026-10-13T12:00:00Z')).outside_hours, 1); // 14 h à Paris
    assert.equal((await at('2026-10-17T07:30:00Z')).not_business_day, 1); // samedi
    assert.equal(windowBlock('fr', new Date('2026-11-11T08:30:00Z'), false), 'holiday'); // 11 novembre
    assert.equal(windowBlock('fr', new Date('2026-11-11T08:30:00Z'), true), null); // service : tous les jours
    assert.ok(isHoliday('en-gb', '2026-04-06')); // lundi de Pâques
    assert.ok(isMarketBusinessDay('he', '2026-10-11')); // dimanche ouvré en Israël
    assert.ok(!isMarketBusinessDay('he', '2026-10-16')); // vendredi
  });

  const crowd = (n: number) => Array.from({ length: n }, (_, i) => `client${i}@exemple.fr`);
  await test('plafonds : 20 par passage, montée progressive par jour, RELANCES_MAX_PER_DAY', async () => {
    const emails = crowd(25);
    const { store, t } = memoryStore({ callbacks: emails.map((e) => callback(e, { id: e })), consents: emails.map((e) => consent(e)) });
    const r = await runRelances(deps(store, { env: { RELANCES_MAX_PER_DAY: '150' } }).d);
    assert.equal(r.counts.dry_run, 20);
    assert.equal(r.counts.waiting.cap_run, 5);
    // Sans plafond imposé : montée progressive, 20 par jour la première semaine.
    const s3 = memoryStore({ callbacks: emails.map((e) => callback(e, { id: e })), consents: emails.map((e) => consent(e)) });
    assert.equal((await runRelances(deps(s3.store).d)).counts.waiting.cap_day, 5);
    const s2 = memoryStore({ callbacks: emails.map((e) => callback(e, { id: e })), consents: emails.map((e) => consent(e)) });
    const r2 = await runRelances(deps(s2.store, { env: { RELANCES_MAX_PER_DAY: '3' } }).d);
    assert.equal(r2.counts.dry_run, 3);
    assert.equal(r2.counts.waiting.cap_day, 22);
    assert.equal(t.log.length, 20);
  });

  await test('pression : pas de second marketing en moins de 3 jours', async () => {
    const { store } = memoryStore({
      callbacks: [callback(ALICE, { created_at: '2026-10-09T05:00:00Z' })], consents: [consent(ALICE)],
      log: [{ email_key: K(ALICE), sequence: 'P', step: 'P1', dry_run: false, status: 'sent', category: 'marketing', created_at: '2026-10-11T08:00:00Z' }],
    });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.pressure_3d, 1);
  });

  /* ---------- Langue ---------- */

  await test('langue : texte de la langue du contact, jamais de repli ; marché fermé ; indicatif ambigu → à valider', async () => {
    const UK = 'jane@example.co.uk';
    const BE = 'luc@exemple.be';
    const IT = 'marco@esempio.it';
    const fixtures = () => memoryStore({
      callbacks: [
        callback(UK, { id: 'uk', locale: 'en-gb', phone: '+447700900123', name: 'Jane Smith' }),
        callback(BE, { id: 'be', locale: null, phone: '+32470123456', agent: null }),
        callback(IT, { id: 'it', locale: 'it', phone: '+393331234567' }),
      ],
      consents: [consent(UK), consent(BE), consent(IT)],
    });
    // 9 h 30 à Londres, 10 h 30 à Paris et Rome.
    const at = () => new Date('2026-10-13T08:30:00Z');
    const a = fixtures();
    const ra = await runRelances(deps(a.store, { now: at }).d);
    assert.match(a.t.log.find((l) => l.email_key === K(UK))!.subject, /^Jane, /);
    assert.match(a.t.log.find((l) => l.email_key === K(UK))!.preview, /Hello Jane/);
    assert.equal(ra.counts.waiting.locale_closed, 1); // it : marché pas encore ouvert (RELANCES_LOCALES)
    assert.equal(ra.counts.waiting.locale_unknown, 1); // +32 : Belgique, langue à choisir
    // Traduction absente : rien, jamais le français à sa place.
    const b = fixtures();
    const rb = await runRelances(deps(b.store, { now: at, env: { RELANCES_LOCALES: 'fr,en-gb,it' }, content: (l) => (l === 'fr' ? RELANCES_FR : null) }).d);
    assert.equal(b.t.log.length, 0);
    assert.equal(rb.counts.waiting.content_missing, 2);
    assert.equal(a.settings!.last_report_on, '2026-10-13');
  });

  await test('rapport quotidien : contacts à valider et exemples rendus', async () => {
    const BE = 'luc@exemple.be';
    const { store } = memoryStore({ callbacks: [callback(ALICE), callback(BE, { id: 'be', locale: null, phone: '+32470123456', agent: null })], consents: [consent(ALICE), consent(BE)] });
    const { d, team } = deps(store);
    await runRelances(d);
    const report = team.find((m) => /rapport/.test(m.subject));
    assert.ok(report, 'rapport envoyé');
    assert.ok(report!.text.includes(BE), 'contact à valider listé');
    assert.match(report!.text, /Exemples rendus/);
    assert.match(report!.text, /TEST \(dry-run\)/);
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 3_600_000) });
    assert.equal(team.filter((m) => /rapport/.test(m.subject)).length, 1, 'un seul rapport par jour');
  });

  await test('Israël : objet marketing préfixé une seule fois par « פרסומת », message de service sans préfixe', async () => {
    const IL = 'dana@example.co.il';
    const { store, t } = memoryStore({ callbacks: [callback(IL, { locale: 'he', phone: '+972501234567', created_at: '2026-10-09T10:00:00Z' })], consents: [consent(IL)] });
    // Dimanche 11 octobre 2026, 9 h 30 à Jérusalem : jour ouvré en Israël.
    const sunday = () => new Date('2026-10-11T06:30:00Z');
    await runRelances(deps(store, { env: { RELANCES_LOCALES: 'he' }, now: sunday }).d);
    const row = t.log.find((l) => l.step === 'P1');
    assert.ok(row, 'P1 journalisé');
    assert.ok(row!.subject.startsWith(HE_AD_PREFIX), row!.subject);
    assert.ok(!row!.subject.slice(HE_AD_PREFIX.length).includes(HE_AD_PREFIX), 'préfixe en double');
    // Texte sans préfixe (version simulée par le français) : le moteur l’ajoute.
    const s1 = memoryStore({ callbacks: [callback(IL, { locale: 'he', phone: '+972501234567', created_at: '2026-10-09T10:00:00Z' })], consents: [consent(IL)] });
    await runRelances(deps(s1.store, { env: { RELANCES_LOCALES: 'he' }, now: sunday, content: (l) => (l === 'he' ? RELANCES_FR : null) }).d);
    assert.ok(s1.t.log.find((l) => l.step === 'P1')!.subject.startsWith(`${HE_AD_PREFIX}: `));
    const s2 = memoryStore({ signups: [{ email: IL, name: 'Dana', signed_up_at: '2026-10-10T05:00:00Z' }], callbacks: [callback(IL, { locale: 'he', phone: '+972501234567' })] });
    await runRelances(deps(s2.store, { env: { RELANCES_LOCALES: 'he' }, now: sunday }).d);
    const i1 = s2.t.log.find((l) => l.step === 'I1');
    assert.ok(i1 && !i1.subject.startsWith(HE_AD_PREFIX), 'I1 sans préfixe');
  });

  await test('compte de test et adresses internes exclus', async () => {
    const { store } = memoryStore({ callbacks: [callback('robby@permanenceia.com')], consents: [consent('robby@permanenceia.com')] });
    const r = await runRelances(deps(store).d);
    assert.equal(r.counts.waiting.test_account, 1);
  });

  /* ---------- Stripe ---------- */

  await test('signature Stripe : valide, falsifiée, trop ancienne, absente', () => {
    const secret = `whsec_${randomBytes(16).toString('hex')}`;
    const body = JSON.stringify({ id: 'evt_1', type: 'customer.subscription.created' });
    const t0 = 1_800_000_000;
    const sig = createHmac('sha256', secret).update(`${t0}.${body}`).digest('hex');
    assert.ok(verifyStripeSignature(body, `t=${t0},v1=${sig}`, secret, t0 + 10));
    assert.ok(!verifyStripeSignature(body.replace('created', 'deleted'), `t=${t0},v1=${sig}`, secret, t0 + 10));
    assert.ok(!verifyStripeSignature(body, `t=${t0},v1=${sig}`, secret, t0 + 3600));
    assert.ok(!verifyStripeSignature(body, `t=${t0},v1=${sig}`, undefined, t0));
    assert.ok(!verifyStripeSignature(body, undefined, secret, t0));
  });

  await test('événements Stripe : client, essai, ordre des événements, paiement', async () => {
    const tables: Record<string, Any[]> = { stripe_customers: [], stripe_subscriptions: [], stripe_events: [] };
    const pk: Record<string, string> = { stripe_customers: 'customer_id', stripe_subscriptions: 'subscription_id', stripe_events: 'event_id' };
    const db = {
      insertIfNew: async (table: string, row: Any) => { if (tables[table].some((r) => r[pk[table]] === row[pk[table]])) return false; tables[table].push({ ...row }); return true; },
      update: async (table: string, query: string, patch: Any) => {
        const id = decodeURIComponent(/=eq\.([^&]+)/.exec(query)![1]);
        const r = tables[table].find((x) => x[pk[table]] === id);
        const lte = /last_event_at\.lte\.([^)]+)\)/.exec(query);
        if (r && (!lte || !r.last_event_at || r.last_event_at <= decodeURIComponent(lte[1]).replace(/"/g, ''))) Object.assign(r, patch);
      },
      select: async <T,>(table: string, query: string) => tables[table].filter((x) => x[pk[table]] === decodeURIComponent(/=eq\.([^&]+)/.exec(query)![1])) as T[],
    };
    await applyStripeEvent({ id: 'evt_a', type: 'customer.created', created: 100, livemode: true, data: { object: { id: 'cus_9', email: 'Alice@Exemple.fr', preferred_locales: ['fr'] } } }, db);
    const sub = (status: string) => ({ id: 'sub_9', customer: 'cus_9', status, trial_start: 200, trial_end: 1400, items: { data: [{ price: { id: 'price_r', unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' }, product: 'prod_r' } }] } });
    await applyStripeEvent({ id: 'evt_b', type: 'customer.subscription.updated', created: 300, livemode: true, data: { object: sub('canceled') } }, db);
    await applyStripeEvent({ id: 'evt_c', type: 'customer.subscription.created', created: 200, livemode: true, data: { object: sub('trialing') } }, db); // en retard
    assert.equal(tables.stripe_customers[0].email, 'alice@exemple.fr');
    assert.equal(tables.stripe_subscriptions[0].status, 'canceled', 'un événement ancien ne remplace pas un plus récent');
    assert.equal(tables.stripe_subscriptions[0].price_amount, 9900);
    assert.equal(tables.stripe_subscriptions[0].trial_end, new Date(1400 * 1000).toISOString());
    await applyStripeEvent({ id: 'evt_d', type: 'invoice.paid', created: 400, livemode: true, data: { object: { customer: 'cus_9', amount_paid: 0 } } }, db);
    assert.equal(tables.stripe_customers[0].has_paid, undefined, 'facture à 0 : pas un paiement');
    await applyStripeEvent({ id: 'evt_e', type: 'invoice.paid', created: 500, livemode: true, data: { object: { customer: 'cus_9', amount_paid: 9900 } } }, db);
    assert.equal(tables.stripe_customers[0].has_paid, true);
    assert.equal(tables.stripe_events.length, 5);

    // Langue des factures : posée d’après la fiche contact, seulement si le client Stripe n’en a pas.
    const set: [string, string][] = [];
    const locale = { lookup: async (email: string) => (email === 'luca@esempio.it' ? 'it' as const : email === 'dana@example.co.il' ? 'he' as const : null), set: async (id: string, l: string) => { set.push([id, l]); return true; } };
    await applyStripeEvent({ id: 'evt_f', type: 'customer.created', created: 600, livemode: true, data: { object: { id: 'cus_it', email: 'Luca@Esempio.it' } } }, db, undefined, locale);
    await applyStripeEvent({ id: 'evt_g', type: 'customer.created', created: 601, livemode: true, data: { object: { id: 'cus_he', email: 'dana@example.co.il' } } }, db, undefined, locale);
    await applyStripeEvent({ id: 'evt_h', type: 'customer.updated', created: 602, livemode: true, data: { object: { id: 'cus_it', email: 'luca@esempio.it', preferred_locales: ['it'] } } }, db, undefined, locale);
    await applyStripeEvent({ id: 'evt_i', type: 'customer.created', created: 603, livemode: true, data: { object: { id: 'cus_x', email: 'inconnu@exemple.fr' } } }, db, undefined, locale);
    await applyStripeEvent({ id: 'evt_j', type: 'customer.created', created: 604, livemode: true, data: { object: { id: 'cus_de', email: 'luca@esempio.it', preferred_locales: ['de'] } } }, db, undefined, locale);
    assert.deepEqual(set, [['cus_it', 'it'], ['cus_he', 'en']], 'langue posée une fois, jamais devinée ni remplacée');
    assert.equal(tables.stripe_customers.find((c) => c.customer_id === 'cus_it')?.preferred_locale, 'it');
  });

  /* ---------- Accès à la route planifiée ---------- */

  await test('accès : jeton x-cron-token et OIDC Google', async () => {
    const secret = randomBytes(24).toString('hex');
    assert.ok(cronTokenOk(secret, secret));
    assert.ok(!cronTokenOk(`${secret.slice(0, -1)}x`, secret));
    assert.ok(!cronTokenOk('', secret));
    assert.ok(!cronTokenOk('court', 'court'), 'secret trop court refusé');
    assert.ok(!cronTokenOk(secret, undefined));
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256' } as Any;
    const b64 = (o: Any) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const now = 1_800_000_000_000;
    const claims = { iss: 'https://accounts.google.com', aud: 'https://www.permanenceia.com/api/cron/relances', email: 'relances-cron@projet.iam.gserviceaccount.com', email_verified: true, exp: now / 1000 + 600, iat: now / 1000 };
    const jwt = (c: Any) => { const h = b64({ alg: 'RS256', kid: 'k1' }); const p = b64(c); return `Bearer ${h}.${p}.${sign('RSA-SHA256', Buffer.from(`${h}.${p}`), privateKey).toString('base64url')}`; };
    const opts = { audience: claims.aud, email: claims.email, now, jwks: [jwk] };
    assert.ok(await oidcOk(jwt(claims), opts));
    assert.ok(!(await oidcOk(jwt({ ...claims, aud: 'https://ailleurs' }), opts)));
    assert.ok(!(await oidcOk(jwt({ ...claims, email: 'autre@x.com' }), opts)));
    assert.ok(!(await oidcOk(jwt({ ...claims, exp: now / 1000 - 3600 }), opts)));
    assert.ok(!(await oidcOk(jwt(claims), { now, jwks: [jwk] })), 'OIDC non configuré : refusé');
  });

  /* ---------- Lecture IMAP ---------- */

  await test('IMAP : littéraux, réponse, réponse automatique, rebond', () => {
    const hdr = 'From: Alice <alice.martin@exemple.fr>\r\nSubject: =?UTF-8?B?UmU6IHZvdHJlIGVzc2Fp?=\r\n\r\n';
    const resp = `* 1 FETCH (BODY[HEADER.FIELDS (FROM SUBJECT)] {${hdr.length}}\r\n${hdr} BODY[TEXT]<0> {5}\r\nBonjo)\r\nR4 OK FETCH completed\r\n`;
    assert.equal(findTagged(resp, 'R4'), resp.length);
    assert.equal(findTagged(resp.slice(0, 30), 'R4'), -1);
    const [[h, b]] = fetchLiterals(resp);
    const m = parseMessage(h, b, 'contact@permanenceia.com');
    assert.equal(m.from, 'alice.martin@exemple.fr');
    assert.equal(m.subject, 'Re: votre essai');
    assert.equal(m.automatic, false);
    const auto = parseMessage('From: bob@x.fr\r\nAuto-Submitted: auto-replied\r\nSubject: Absence\r\n', '', 'contact@permanenceia.com');
    assert.equal(auto.automatic, true);
    const bounce = parseMessage('From: MAILER-DAEMON@mx.zoho.com\r\nSubject: Undelivered Mail\r\n', 'Final-Recipient: rfc822; Alice.Martin@exemple.fr\r\nFrom contact@permanenceia.com', 'contact@permanenceia.com');
    assert.equal(bounce.bounce, true);
    assert.deepEqual(bounce.bodyEmails, ['alice.martin@exemple.fr']);
  });

  await test('rebonds : disjoncteur au-delà de 5 % → envois réels coupés en base', async () => {
    const emails = crowd(3);
    const { store, settings } = memoryStore({
      callbacks: emails.map((e) => callback(e, { id: e })), consents: emails.map((e) => consent(e)),
      stops: emails.slice(0, 2).map((e) => ({ email_key: K(e), reason: 'bounced', scope: 'all', source: 'imap:x', created_at: '2026-10-13T06:00:00Z' })),
    });
    const { d, sent, team } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    const r = await runRelances(d);
    assert.equal(r.status, 'halted');
    assert.equal(sent.length, 0);
    assert.equal(settings!.enabled, false);
    assert.ok(team.some((m) => /disjoncteur/.test(m.subject)));
  });

  console.log(`\n${passed} tests réussis, aucun envoi réel.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
