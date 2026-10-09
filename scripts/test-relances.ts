// Tests du moteur des relances (aucun réseau, aucune base réelle, aucun envoi réel) :
//   npx tsx scripts/test-relances.ts
// Base en mémoire, sendMail et alertes remplacés par des faux qui enregistrent les appels. Vérifie : coupé → rien ;
// mode test → journalisé sans envoi ; désinscription, opposition, réponse, inscription, abonnement → arrêt ;
// fenêtre locale et plafonds ; idempotence ; langue jamais remplacée par une autre ; préfixe « פרסומת » en Israël ;
// signature Stripe ; accès à la route planifiée ; lecture IMAP. Audit du 9 oct. : boutons vers /plans et /credits ;
// messages de service dans les 7 langues (anglais si la langue est inconnue) ; essai annulé (C2 à C4 arrêtés, C5 « rien
// ne sera débité ») ; C5 annuel ; F1 après paiement refusé ; C4 sur le solde du passage ; inscription non terminée
// (série P, base légale par marché) ; rapport « relances coupées » et rapport renvoyé après un échec ; achat de crédit.
// Relecture du 9 oct. : un inscrit n’est jamais « inscription non terminée » ; C4 sur un instantané trop proche du début
// de l’essai ; C4_exhausted à 0 minute ; textes (C4 sans accord, P1_signup en deux étapes, libellés I6 et I7, pl).
// Mise en route (9 oct., § 7) : lecture quotidienne des agents (cache du jour, lecture en échec jamais « 0 agent »,
// jeton temporaire révoqué, fetch simulé) ; série A (A1 à A4, A3 essai ou compte actif, suivi mensuel des abonnés) ;
// C2 et C3 seulement si un agent existe ; arrêts (agent créé, appel réel, réponse, annulation, impayé, désinscription) ;
// série S (minutes basses puis épuisées, une fois par baisse) ; alertes à l’équipe une seule fois (sans agent, risque de
// résiliation, renouvellement, minutes, crédits, agent en pause, solde de l’agence, jamais un compte de test) ;
// rubrique « À faire aujourd’hui » du rapport ; textes A et S dans les 7 langues (service, sans prix).
// Relecture du 9 oct. (lot B) : tables Stripe illisibles (aucune série close, rien décidé) ; abonné sans agent (suivi
// mensuel sauté, renouvellement « sans agent ») ; compte à la minute à 0 minute (S2 stable) ; solde de 0,6 minute (S2) ;
// alertes plafonnées par passage ; adresse masquée dans les erreurs ; seuil de l’agence à 0 ; « Être rappelé » vers le
// support ; appel de l’équipe réservé aux clients payants ; textes relus (C2, A1, A4, en, nl, pl).
import assert from 'node:assert/strict';
import { createHmac, generateKeyPairSync, randomBytes, sign } from 'crypto';

// Secret de test aléatoire (jamais celui de production) ; SMTP et base retirés : rien ne peut partir pour de vrai.
process.env.ACCOUNT_CODE_SECRET = randomBytes(32).toString('hex');
for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'AUTOCALLS_API_KEY', 'STRIPE_READ_KEY', 'STRIPE_CUSTOMERS_KEY', 'RELANCES_IMAP_USER', 'RELANCES_IMAP_PASS', 'CRON_SECRET', 'RELANCES_OIDC_AUDIENCE', 'RELANCES_OIDC_EMAIL']) delete process.env[k];

type Any = Record<string, any>;
const sp = (s: string) => s.replace(/[\u00a0\u202f]/g, ' '); // espaces insécables d’Intl (fr-FR)

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
    log?: Any[]; state?: Any[]; stops?: Any[]; activity?: Any[];
    settings?: { enabled: boolean; last_report_on?: string | null } | null; prefs?: Map<string, string>; optouts?: Set<string>; recheckSignedUp?: boolean;
  }
  function memoryStore(init: Init = {}) {
    const t = {
      callbacks: init.callbacks ?? [], signups: init.signups ?? [], contacts: init.contacts ?? [], consents: init.consents ?? [],
      customers: init.customers ?? [], subscriptions: init.subscriptions ?? [], snapshots: init.snapshots ?? [],
      log: init.log ?? [], state: init.state ?? [], stops: init.stops ?? [], runs: [] as Any[],
      activity: init.activity ?? [], alerts: [] as string[],
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
      activity: async () => t.activity as any,
      saveActivity: async (row) => { t.activity.push({ ...row }); },
      claimAlert: async (key) => { if (t.alerts.includes(key)) return false; t.alerts.push(key); return true; },
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
      logError: () => undefined,
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

  /* ---------- Audit du 9 oct. 2026 : boutons, langues, essai annulé, C4, inscription non terminée ---------- */

  await test('boutons : /plans pour choisir un forfait, /credits pour ajouter du crédit, /billing seulement pour C4 et C5', async () => {
    const { ctaUrl } = await import('@/lib/relances/render');
    const { getI18n } = await import('@/i18n');
    const { buildRelanceFacts } = await import('@/i18n/content/fr');
    const { LOCALES } = await import('@/i18n/locales');
    assert.equal(ctaUrl('plans', 'fr', 'I1'), 'https://app.permanenceia.com/plans?utm_source=relance&utm_medium=email&utm_campaign=I1');
    assert.equal(ctaUrl('credits', 'en-gb', 'F2'), 'https://app.permanenceia.com/credits?utm_source=relance&utm_medium=email&utm_campaign=F2');
    assert.equal(ctaUrl('register', 'it', 'P1'), 'https://app.permanenceia.com/register?lang=it&utm_source=relance&utm_medium=email&utm_campaign=P1');
    // « Être rappelé » : ancre du formulaire d’accompagnement, après les UTM.
    assert.equal(ctaUrl('trial_assist', 'nl', 'P1'), 'https://www.permanenceia.com/nl/essai-gratuit?utm_source=relance&utm_medium=email&utm_campaign=P1&utm_content=accompagnement#accompagnement');
    // Client déjà en essai ou abonné (série A) : formulaire du support de /contact (onglet ouvert par ?type=support).
    assert.equal(ctaUrl('setup_assist', 'nl', 'A2'), 'https://www.permanenceia.com/nl/contact?type=support&utm_source=relance&utm_medium=email&utm_campaign=A2&utm_content=mise_en_route#rappel');
    assert.equal(ctaUrl('setup_assist', 'fr', 'A3'), 'https://www.permanenceia.com/contact?type=support&utm_source=relance&utm_medium=email&utm_campaign=A3&utm_content=mise_en_route#rappel');
    // Dans les 7 langues : /billing (carte, factures, résiliation) n’est jamais la cible d’un bouton de forfait ou de crédit.
    const billingOk = ['C4', 'C4_exhausted', 'C5', 'C5_annual', 'C5_cancelled', 'F1_payment_failed'];
    const want: Record<string, string> = { I1: 'plans', I2: 'plans', I4: 'plans', I5: 'plans', I6: 'credits', I7: 'plans', F2: 'credits', F3: 'plans', F4: 'plans', U5: 'plans', P1_signup: 'register' };
    for (const locale of LOCALES) {
      const content = relancesContent(locale)!;
      const facts = buildRelanceFacts(getI18n(locale))!;
      for (const [key, build] of Object.entries(content.messages)) {
        const m = build(facts);
        if (!m?.cta) continue;
        if (m.cta.target === 'billing') assert.ok(billingOk.includes(key), `${locale} ${key} mène encore à /billing`);
        if (want[key]) assert.equal(m.cta.target, want[key], `${locale} ${key}`);
      }
      assert.equal(content.monthly.account(facts)!.cta!.target, 'app', `${locale} M`);
    }
    // Rendu réel : I1 envoyé avec le lien /plans.
    const { store } = memoryStore({ signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-10-12T06:00:00Z', locale: 'fr' }] });
    const { d, sent } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.match(sent[0].text, /https:\/\/app\.permanenceia\.com\/plans\?utm_source=relance&utm_medium=email&utm_campaign=I1/);
    assert.doesNotMatch(sent[0].html, /\/billing/);
  });

  await test('messages de service dans les marchés fermés (it) ; commercial toujours fermé ; RELANCES_SERVICE_LOCALES', async () => {
    const IT = 'marco@esempio.it';
    const fixtures = () => memoryStore({ signups: [{ email: IT, name: 'Marco Rossi', signed_up_at: '2026-10-12T06:00:00Z', locale: 'it' }] });
    const a = fixtures();
    const ra = deps(a.store, { env: { RELANCES_DRY_RUN: '0' } }); // RELANCES_LOCALES par défaut : fr, en-gb, en-au
    await runRelances(ra.d);
    assert.equal(ra.sent.length, 1, 'I1 italien envoyé alors que le marché commercial italien est fermé');
    assert.equal(ra.sent[0].locale, 'it');
    assert.equal(ra.sent[0].category, 'essential');
    assert.match(ra.sent[0].subject, /^Il Suo account è stato creato/);
    assert.match(ra.sent[0].text, /\/plans\?/);
    const b = fixtures();
    const rb = deps(b.store, { env: { RELANCES_DRY_RUN: '0', RELANCES_SERVICE_LOCALES: 'fr,en-gb,en-au' } });
    const r = await runRelances(rb.d);
    assert.equal(rb.sent.length, 0);
    assert.equal(r.counts.waiting.locale_closed, 1);
    assert.deepEqual(readConfig({}).serviceLocales, ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl', 'he']);
  });

  await test('langue inconnue : messages de service en anglais (contact listé à valider), jamais de commercial', async () => {
    const X = 'kim@exemple.be';
    const { store } = memoryStore({ signups: [{ email: X, name: 'Kim', signed_up_at: '2026-10-12T06:00:00Z' }] });
    const { d, sent, team } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(d); // 8 h 30 à Londres : fenêtre de service ouverte
    assert.equal(sent.length, 1);
    assert.equal(sent[0].locale, 'en-gb');
    assert.match(sent[0].subject, /^Your account is ready/);
    assert.equal(sent[0].fromName, 'PermanenceAI');
    const report = team.find((m) => /rapport/.test(m.subject));
    assert.ok(report && report.text.includes(X), 'contact listé « langue à valider »');
  });

  // Essai d’Alice (compte Permanence IA, forfait Réceptionniste au mois).
  const trialSetup = (sub: Any = {}, customer: Any = {}) => ({
    signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-10-01T06:00:00Z', locale: 'fr' }],
    customers: [{ customer_id: 'cus_1', email: ALICE, preferred_locale: 'fr', has_paid: false, has_credit_purchase: false, livemode: true, ...customer }],
    subscriptions: [{
      subscription_id: 'sub_1', customer_id: 'cus_1', status: 'trialing', trial_start: '2026-10-11T06:00:00Z', trial_end: '2026-10-25T06:00:00Z',
      canceled_at: null, ended_at: null, price_amount: 9900, currency: 'usd', billing_interval: 'month', livemode: true, ...sub,
    }],
  });
  const sentLog = (steps: string[], at = '2026-10-11T08:00:00Z', seq = 'C') => steps.map((step) => ({ email_key: K(ALICE), sequence: seq, step, dry_run: false, status: 'sent', category: 'essential', created_at: at }));
  const STRIPE = { RELANCES_DRY_RUN: '0', STRIPE_WEBHOOK_SECRET: 'whsec_test' };
  const aliceLive = (minutes: number) => async () => [{ id: 7, name: 'Alice', email: ALICE, minutes_balance: minutes, credits_balance: 0, created_at: '2026-10-01T06:00:00Z' }];

  await test('essai annulé (fin programmée) : C2 sauté, jamais de C4, C5 « rien ne sera débité »', async () => {
    // T+2 : C2 serait dû (aucune minute consommée), mais l’essai est annulé.
    const a = memoryStore({ ...trialSetup({ cancel_at_period_end: true }), log: sentLog(['C1']) });
    const ra = deps(a.store, { env: STRIPE, platformUsers: aliceLive(2) });
    await runRelances(ra.d);
    assert.equal(ra.sent.length, 0);
    assert.equal(a.t.log.find((l) => l.step === 'C2')?.skip_reason, 'trial_cancel_scheduled');
    assert.ok(!a.t.log.some((l) => l.step === 'C4'), 'pas de C4 « minutes presque épuisées » après une annulation');
    // 3 jours avant la fin : C5 confirme qu’aucun débit n’aura lieu (fin programmée par cancel_at, facturation flexible).
    for (const cancel of [{ cancel_at_period_end: true }, { cancel_at_period_end: false, cancel_at: '2026-10-16T06:00:00Z' }]) {
      const b = memoryStore({ ...trialSetup({ trial_start: '2026-10-02T06:00:00Z', trial_end: '2026-10-16T06:00:00Z', ...cancel }), log: sentLog(['C1', 'C2', 'C3'], '2026-10-05T08:00:00Z') });
      const rb = deps(b.store, { env: STRIPE });
      await runRelances(rb.d);
      assert.equal(rb.sent.length, 1);
      assert.equal(sp(rb.sent[0].subject), 'Votre essai se termine le 16 octobre 2026 : rien ne sera débité');
      assert.doesNotMatch(rb.sent[0].text, /prélevé/);
      assert.equal(b.t.log.find((l) => l.step === 'C5')?.template_key, 'C5_cancelled');
    }
    // Sans annulation : le C5 habituel annonce le premier mois.
    const c = memoryStore({ ...trialSetup({ trial_start: '2026-10-02T06:00:00Z', trial_end: '2026-10-16T06:00:00Z' }), log: sentLog(['C1', 'C2', 'C3'], '2026-10-05T08:00:00Z') });
    const rc = deps(c.store, { env: STRIPE });
    await runRelances(rc.d);
    assert.match(sp(rc.sent[0].text), /le premier mois \(99 \$US HT/);
  });

  await test('annulation constatée juste avant l’envoi : le C5 prévu n’est pas envoyé', async () => {
    const { store, t } = memoryStore({ ...trialSetup({ trial_start: '2026-10-02T06:00:00Z', trial_end: '2026-10-16T06:00:00Z' }), log: sentLog(['C1', 'C2', 'C3'], '2026-10-05T08:00:00Z') });
    const recheck = store.recheck;
    store.recheck = async (email) => {
      const r = await recheck(email);
      return r && { ...r, subscriptions: r.subscriptions.map((x) => ({ ...x, cancel_at_period_end: true })) };
    };
    const { d, sent } = deps(store, { env: STRIPE });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.equal(r.counts.waiting.stage_changed, 1);
    assert.ok(!t.log.some((l) => l.step === 'C5'));
  });

  await test('C5 d’un forfait annuel : montant de l’année, jamais « premier mois »', async () => {
    const { store, t } = memoryStore({ ...trialSetup({ trial_start: '2026-10-02T06:00:00Z', trial_end: '2026-10-16T06:00:00Z', billing_interval: 'year', price_amount: 99000 }), log: sentLog(['C1', 'C2', 'C3'], '2026-10-05T08:00:00Z') });
    const { d, sent } = deps(store, { env: STRIPE });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.match(sp(sent[0].text), /la première année \(990 \$US HT/);
    assert.doesNotMatch(sent[0].text, /premier mois/);
    assert.equal(t.log.find((l) => l.step === 'C5')?.template_key, 'C5_annual');
  });

  await test('F1 après un paiement refusé : « mettez à jour votre carte », pas « c’est votre droit »', async () => {
    const ended = (over: Any) => memoryStore(trialSetup({ status: 'canceled', trial_start: '2026-09-25T06:00:00Z', trial_end: '2026-10-09T06:00:00Z', ...over }));
    // Fin 3 jours après la fin de l’essai (nouvelles tentatives de Stripe), sans motif enregistré (migration absente).
    const a = ended({ ended_at: '2026-10-12T06:00:00Z', canceled_at: '2026-10-12T06:00:00Z' });
    const ra = deps(a.store, { env: STRIPE });
    await runRelances(ra.d);
    assert.equal(ra.sent.length, 1);
    assert.equal(sp(ra.sent[0].subject), 'Votre essai est terminé : le paiement n’a pas abouti');
    assert.match(ra.sent[0].text, /app\.permanenceia\.com\/billing\?/);
    assert.doesNotMatch(ra.sent[0].text, /votre droit/);
    // Motif Stripe enregistré.
    const b = ended({ ended_at: '2026-10-09T06:00:00Z', canceled_at: '2026-10-09T06:00:00Z', cancellation_reason: 'payment_failed' });
    const rb = deps(b.store, { env: STRIPE, now: () => new Date('2026-10-10T08:30:00Z') });
    await runRelances(rb.d);
    assert.match(sp(rb.sent[0].subject), /le paiement n’a pas abouti/);
    // Essai annulé par le client : F1 habituel.
    const c = ended({ ended_at: '2026-10-12T06:00:00Z', canceled_at: '2026-10-05T06:00:00Z', trial_end: '2026-10-12T06:00:00Z', cancellation_reason: 'cancellation_requested' });
    const rc = deps(c.store, { env: STRIPE });
    await runRelances(rc.d);
    assert.equal(rc.sent[0].subject, 'Votre essai est terminé, rien n’a été débité');
  });

  await test('C4 (Australie) : solde lu au passage, jamais « 0 minute » juste après le début de l’essai', async () => {
    const AU = 'jack@example.com.au';
    const setup = (trialStart: string, snapshots: Any[] = []) => memoryStore({
      signups: [{ email: AU, name: 'Jack', signed_up_at: '2026-10-12T06:00:00Z', locale: 'en-au' }],
      customers: [{ customer_id: 'cus_au', email: AU, preferred_locale: 'en-AU', has_paid: false, has_credit_purchase: false, livemode: true }],
      subscriptions: [{ subscription_id: 'sub_au', customer_id: 'cus_au', status: 'trialing', trial_start: trialStart, trial_end: '2026-10-27T12:00:00Z', canceled_at: null, ended_at: null, price_amount: 9900, currency: 'usd', billing_interval: 'month', livemode: true }],
      log: [{ email_key: K(AU), sequence: 'C', step: 'C1', dry_run: false, status: 'sent', category: 'essential', created_at: '2026-10-13T12:30:00Z' }],
      snapshots,
    });
    const live = (minutes: number) => async () => [{ id: 9, name: 'Jack', email: AU, minutes_balance: minutes, credits_balance: 0, created_at: '2026-10-12T06:00:00Z' }];
    // Mercredi 14 octobre, 8 h 30 à Sydney (13 octobre 21 h 30 UTC) : essai démarré 9 h 30 plus tôt.
    const morning = () => new Date('2026-10-13T21:30:00Z');
    // Instantané du jour UTC pris avant le début de l’essai (0 minute), sans lecture du passage : pas de C4, même
    // 13 h 30 après le début (c’était le défaut : « il vous reste 0 minute » le soir même en Australie).
    const a = setup('2026-10-13T08:00:00Z', [{ user_id: '9', snap_date: '2026-10-13', email_key: K(AU), minutes_balance: 0, credits_balance: 0, platform_created_at: null }]);
    const ra = deps(a.store, { env: STRIPE, now: morning });
    await runRelances(ra.d);
    assert.ok(!a.t.log.some((l) => l.step === 'C4'), 'instantané d’avant l’essai : pas de C4');
    // Lecture du passage à 0 (minutes d’essai pas encore créditées), moins de 12 h après le début : pas de C4.
    const b = setup('2026-10-13T12:00:00Z');
    await runRelances(deps(b.store, { env: STRIPE, now: morning, platformUsers: live(0) }).d);
    assert.ok(!b.t.log.some((l) => l.step === 'C4'), 'premières heures de l’essai : pas de C4');
    // 13 h 30 après le début, 4 minutes lues à ce passage : C4 avec le vrai solde.
    const c = setup('2026-10-13T08:00:00Z');
    const rc = deps(c.store, { env: STRIPE, now: morning, platformUsers: live(4) });
    await runRelances(rc.d);
    assert.equal(rc.sent.length, 1);
    assert.equal(rc.sent[0].subject, 'Trial minutes left: 4 of 30');
    assert.equal(rc.sent[0].locale, 'en-au');
    // Essai démarré à 23 h 50 UTC, lecture du passage absente : l’instantané du lendemain (pris dès 0 h UTC, peut-être
    // avant que les minutes soient créditées) n’est pas retenu, même 21 h 40 après le début.
    const d = setup('2026-10-12T23:50:00Z', [{ user_id: '9', snap_date: '2026-10-13', email_key: K(AU), minutes_balance: 0, credits_balance: 0, platform_created_at: null }]);
    const rd = deps(d.store, { env: STRIPE, now: morning });
    await runRelances(rd.d);
    assert.equal(rd.sent.length, 0);
    assert.ok(!d.t.log.some((l) => l.step === 'C4'), 'instantané pris 10 minutes après le début : pas de C4');
    // Instantané pris au moins 12 h après le début : repli accepté.
    const e = setup('2026-10-12T08:00:00Z', [{ user_id: '9', snap_date: '2026-10-13', email_key: K(AU), minutes_balance: 3, credits_balance: 0, platform_created_at: null }]);
    const re = deps(e.store, { env: STRIPE, now: morning });
    await runRelances(re.d);
    assert.equal(re.sent.length, 1);
    assert.equal(re.sent[0].subject, 'Trial minutes left: 3 of 30');
    // Vrai solde de 0 minute, bien après le début : C4_exhausted (« vos minutes sont utilisées »), jamais « il reste 0 ».
    const f = setup('2026-10-13T08:00:00Z');
    const rf = deps(f.store, { env: STRIPE, now: morning, platformUsers: live(0) });
    await runRelances(rf.d);
    assert.equal(rf.sent.length, 1);
    assert.equal(rf.sent[0].subject, 'Your 30 trial minutes have been used');
    assert.match(rf.sent[0].text, /calls are paused until the end of the trial/);
    assert.doesNotMatch(rf.sent[0].text, /\b0 of 30\b|once the 30 minutes are used up/);
    assert.equal(f.t.log.find((l) => l.step === 'C4')?.template_key, 'C4_exhausted');
  });

  await test('C1 : l’essai ne donne pas de crédits de messages (dans les 6 langues, sans prix)', async () => {
    const { getI18n } = await import('@/i18n');
    const { buildRelanceFacts } = await import('@/i18n/content/fr');
    const words: Record<string, RegExp> = { fr: /crédit de messages/, 'en-gb': /no message credits/, it: /credito messaggi/, pl: /kredytów na wiadomości/, nl: /berichtcredits/, he: /קרדיטים להודעות/ };
    for (const [locale, re] of Object.entries(words)) {
      const c1 = relancesContent(locale as any)!.messages.C1(buildRelanceFacts(getI18n(locale as any))!)!;
      const text = c1.body.filter((b) => typeof b === 'string').join(' ');
      assert.match(text, re, locale);
      assert.match(text, /Add credits/, locale);
      assert.doesNotMatch(text, /\$|\d+\s?(crédits|credits)/, `${locale} : aucun prix dans un message de service`);
    }
  });

  await test('inscription non terminée : e-mail laissé sur /essai-gratuit → P1 « terminer mon inscription » 24 h après', async () => {
    const BOB = 'bob.durand@exemple.fr';
    const card = (email: string, locale: string, at = '2026-10-12T07:00:00Z') => ({ email_key: K(email), email, origin: 'trial_signup', locale, locale_source: 'site_form', first_seen_at: at, last_interaction_at: at });
    const a = memoryStore({ contacts: [card(BOB, 'fr')], consents: [consent(BOB, 'b2b_legit_interest', null)] });
    const ra = deps(a.store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(ra.d);
    assert.equal(ra.sent.length, 1);
    assert.equal(ra.sent[0].category, 'marketing');
    assert.equal(ra.sent[0].subject, 'Votre compte n’est pas encore créé');
    assert.match(ra.sent[0].html, /app\.permanenceia\.com\/register\?lang=fr&amp;utm_source=relance&amp;utm_medium=email&amp;utm_campaign=P1/);
    assert.match(ra.sent[0].html, /essai-gratuit\?utm_source=relance&amp;utm_medium=email&amp;utm_campaign=P1&amp;utm_content=accompagnement#accompagnement"/);
    assert.match(sp(ra.sent[0].text), /Être rappelé pour le faire ensemble : https:\/\/www\.permanenceia\.com\/essai-gratuit\?/);
    assert.equal(a.t.log.find((l) => l.step === 'P1')?.template_key, 'P1_signup');
    // Moins de 24 h : rien encore.
    const b = memoryStore({ contacts: [card(BOB, 'fr', '2026-10-13T01:00:00Z')], consents: [consent(BOB, 'b2b_legit_interest', null)] });
    assert.equal((await runRelances(deps(b.store, { env: { RELANCES_DRY_RUN: '0' } }).d)).counts.waiting.not_due, 1);
    // Inscrit entre-temps : plus de série P (I1 de service).
    const c = memoryStore({ contacts: [card(BOB, 'fr')], consents: [consent(BOB)], signups: [{ email: BOB, name: null, signed_up_at: '2026-10-12T07:05:00Z' }] });
    const rc = deps(c.store, { env: { RELANCES_DRY_RUN: '0' } });
    await runRelances(rc.d);
    assert.ok(!c.t.log.some((l) => l.sequence === 'P'));
    // Sans base légale : rien.
    const d1 = memoryStore({ contacts: [card(BOB, 'fr')] });
    assert.equal((await runRelances(deps(d1.store, { env: { RELANCES_DRY_RUN: '0' } }).d)).counts.waiting.no_legal_basis, 1);
  });

  await test('inscription non terminée : base légale par marché (fr/en-gb mention affichée ; en-au case cochée seulement)', async () => {
    const UK = 'sam@example.co.uk';
    const AU = 'mia@example.com.au';
    const card = (email: string, locale: string) => ({ email_key: K(email), email, origin: 'trial_signup', locale, locale_source: 'site_form', last_interaction_at: '2026-10-12T07:00:00Z' });
    const uk = memoryStore({ contacts: [card(UK, 'en-gb')], consents: [consent(UK, 'soft_opt_in', null)] });
    const ruk = deps(uk.store, { env: { RELANCES_DRY_RUN: '0' }, now: () => new Date('2026-10-13T08:30:00Z') }); // 9 h 30 à Londres
    await runRelances(ruk.d);
    assert.equal(ruk.sent.length, 1);
    assert.equal(ruk.sent[0].subject, 'Your account isn’t set up yet');
    // Australie, mardi 13 octobre 9 h 30 à Sydney (12 octobre 22 h 30 UTC) : consentement inféré refusé, case cochée admise.
    const sydney = () => new Date('2026-10-12T22:30:00Z');
    const au = memoryStore({ contacts: [{ ...card(AU, 'en-au'), last_interaction_at: '2026-10-11T20:00:00Z' }], consents: [consent(AU, 'inferred_consent', null)] });
    const rau = await runRelances(deps(au.store, { env: { RELANCES_DRY_RUN: '0' }, now: sydney }).d);
    assert.equal(rau.counts.waiting.basis_not_valid_for_market, 1);
    const au2 = memoryStore({ contacts: [{ ...card(AU, 'en-au'), last_interaction_at: '2026-10-11T20:00:00Z' }], consents: [consent(AU)] });
    const r2 = deps(au2.store, { env: { RELANCES_DRY_RUN: '0' }, now: sydney });
    await runRelances(r2.d);
    assert.equal(r2.sent.length, 1);
  });

  await test('inscrit venu par /essai-gratuit (fiche trial_signup) : série I avec sa base habituelle, jamais « inscription non terminée »', async () => {
    const { buildContacts, marketingBasis, stageOf } = await import('@/lib/relances/selection');
    const AU = 'mia@example.com.au';
    const card = { email_key: K(AU), email: AU, origin: 'trial_signup', locale: 'en-au', locale_source: 'site_form', last_interaction_at: '2026-10-09T19:55:00Z' };
    const signup = { email: AU, name: 'Mia', signed_up_at: '2026-10-09T20:00:00Z', locale: 'en-au' };
    const src = (o: Any = {}) => ({
      callbacks: [], signups: [], contacts: [card], customers: [], subscriptions: [], snapshots: [], platformUsers: [],
      consents: [consent(AU, 'inferred_consent', null)], prefs: new Map(), optouts: new Set<string>(), stops: [], ...o,
    }) as any;
    const signed = buildContacts(src({ signups: [signup] }), emailKey, NOW, [])[0];
    assert.equal(signed.origin, null, 'inscrit : pas de provenance « inscription non terminée »');
    assert.equal(stageOf(signed, true), 'signed_up');
    assert.deepEqual(marketingBasis(signed, 'en-au', 'I'), { basis: 'inferred_consent' });
    // Règle propre à l’inscription non terminée : série P seulement (et M après P, appelé avec 'P').
    const abandoned = buildContacts(src(), emailKey, NOW, [])[0];
    assert.equal(abandoned.origin, 'signup_abandoned');
    assert.deepEqual(marketingBasis(abandoned, 'en-au', 'P'), { reason: 'basis_not_valid_for_market' });
    assert.deepEqual(marketingBasis(abandoned, 'en-au', 'F'), { basis: 'inferred_consent' });
    // Compte vu seulement sur la plateforme (ni inscription, ni instantané) : pas « inscription non terminée » non plus.
    const platformOnly = buildContacts(src({ platformUsers: [{ id: 3, name: 'Mia', email: AU, minutes_balance: 0, credits_balance: 0, created_at: '2026-10-09T20:00:00Z' }] }), emailKey, NOW, [])[0];
    assert.equal(platformOnly.origin, null);
    assert.equal(stageOf(platformOnly, true), 'signed_up');
    // Moteur : I2 échu (J+3), accord inféré australien → I2 part (avant la correction : basis_not_valid_for_market).
    const { store, t } = memoryStore({
      contacts: [card], consents: [consent(AU, 'inferred_consent', null)], signups: [signup],
      customers: [{ customer_id: 'cus_mia', email: AU, preferred_locale: 'en-AU', has_paid: false, has_credit_purchase: false, livemode: true }],
      log: [{ email_key: K(AU), sequence: 'I', step: 'I1', dry_run: false, status: 'sent', category: 'essential', created_at: '2026-10-10T22:00:00Z' }],
    });
    const { d, sent } = deps(store, { env: STRIPE, now: () => new Date('2026-10-12T22:30:00Z') }); // mardi 9 h 30 à Sydney
    const r = await runRelances(d);
    assert.equal(r.counts.waiting.basis_not_valid_for_market ?? 0, 0);
    assert.equal(sent.length, 1);
    const i2 = t.log.find((l) => l.step === 'I2');
    assert.equal(i2?.status, 'sent');
    assert.equal(i2?.legal_basis, 'inferred_consent');
  });

  await test('compte sur la plateforme sans inscription ni instantané : jamais P1 « terminer mon inscription »', async () => {
    const BOB = 'bob.durand@exemple.fr';
    const { store, t } = memoryStore({
      contacts: [{ email_key: K(BOB), email: BOB, origin: 'trial_signup', locale: 'fr', locale_source: 'site_form', last_interaction_at: '2026-10-12T07:00:00Z' }],
      consents: [consent(BOB, 'b2b_legit_interest', null)],
    });
    store.snapshots = async () => null; // table des instantanés illisible : aucun instantané enregistré
    const { d, sent } = deps(store, {
      env: { RELANCES_DRY_RUN: '0' },
      platformUsers: async () => [{ id: 11, name: 'Bob', email: BOB, minutes_balance: 0, credits_balance: 0, created_at: '2026-10-12T07:10:00Z' }],
    });
    const r = await runRelances(d);
    assert.equal(sent.length, 0);
    assert.ok(!t.log.some((l) => l.sequence === 'P'), 'aucune étape P');
    assert.equal(r.counts.waiting.no_entry_date, 1, 'compte sans date d’entrée : I en attente');
  });

  await test('textes relus (9 oct.) : C4 sans accord du nom, P1_signup en deux étapes, libellés I6 et I7, formule polonaise', async () => {
    const { getI18n } = await import('@/i18n');
    const { buildRelanceFacts } = await import('@/i18n/content/fr');
    const { renderMessage } = await import('@/lib/relances/render');
    const { MARKETS } = await import('@/i18n/markets');
    const one: Record<string, RegExp> = { fr: /une seule étape|qu’une étape/, 'en-gb': /one step/, it: /un solo passaggio/, pl: /jeden krok/, nl: /één stap/, he: /צעד אחד/ };
    const two: Record<string, RegExp> = { fr: /deux étapes/, 'en-gb': /two steps/, it: /due passaggi/, pl: /dwa kroki/, nl: /twee stappen/, he: /שני צעדים/ };
    const plural1: Record<string, RegExp> = { fr: /1 minutes/, 'en-gb': /1 trial minutes|1 minutes/, it: /1 minuti/, pl: /1 minut\b/, nl: /1 proefminuten/, he: /1 דקות/ };
    const planWord: Record<string, RegExp> = { fr: /forfait/, 'en-gb': /plan/, it: /piano/, pl: /pakiet/, nl: /abonnement/, he: /מסלול/ };
    const vars = { first_name: 'Anna', company: 'Studio', minutes_left: '1', trial_end_date: '22', plan_name: 'X' };
    for (const locale of Object.keys(one) as import('@/i18n/locales').Locale[]) {
      const content = relancesContent(locale)!;
      const facts = buildRelanceFacts(getI18n(locale))!;
      const render = (key: keyof typeof content.messages) => {
        const r = renderMessage({ content, message: content.messages[key](facts)!, locale, brand: MARKETS[locale].brand, vars, campaign: 'T' });
        assert.ok(r.ok, `${locale} ${key}`);
        return (r as { ok: true; mail: { subject: string; preheader: string; text: string } }).mail;
      };
      const c4 = render('C4');
      assert.doesNotMatch(`${c4.subject}\n${c4.text}`, plural1[locale], `${locale} C4 : « 1 » + pluriel`);
      const ex = render('C4_exhausted');
      assert.doesNotMatch(ex.text, /\{minutes_left\}/);
      const p1 = render('P1_signup');
      assert.doesNotMatch(`${p1.preheader}\n${p1.text}`, one[locale], `${locale} P1_signup : « une seule étape »`);
      assert.match(p1.text, two[locale], `${locale} P1_signup : deux étapes`);
      const i6 = content.messages.I6(facts)!;
      assert.doesNotMatch(i6.cta!.label, planWord[locale], `${locale} I6 : le bouton mène à /credits`);
    }
    const pl = relancesContent('pl')!;
    const plFacts = buildRelanceFacts(getI18n('pl'))!;
    assert.equal(pl.messages.I7(plFacts)!.cta!.label, 'Rozpoczynam okres próbny');
    const r = renderMessage({ content: pl, message: pl.messages.I1(plFacts)!, locale: 'pl', brand: 'PermanenceAI', vars: { first_name: 'Anna' }, campaign: 'I1' });
    assert.ok(r.ok && r.mail.text.startsWith('Dzień dobry,\n'), 'formule polonaise sans prénom');
  });

  await test('relances coupées : rapport court « COUPÉES » une fois par jour (interrupteur en base ou variable absente)', async () => {
    const { store, t } = memoryStore({ settings: { enabled: false }, callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const { d, sent, team } = deps(store, { env: { RELANCES_DRY_RUN: '0' } });
    assert.equal((await runRelances(d)).status, 'disabled');
    assert.equal(sent.length + t.log.length, 0);
    assert.equal(team.length, 1);
    assert.match(team[0].subject, /^Relances COUPÉES — rapport du 2026-10-13$/);
    assert.match(team[0].text, /relance_settings\.enabled à true/);
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 3_600_000) });
    assert.equal(team.length, 1, 'un seul rapport par jour');
    const e = memoryStore({});
    const re = deps(e.store, { env: { RELANCES_ENABLED: '' } as any });
    await runRelances(re.d);
    assert.equal(re.team.length, 1);
    assert.match(re.team[0].text, /RELANCES_ENABLED à 1/);
    // Trop tôt (7 h 30 à Paris) : rien.
    const early = memoryStore({ settings: { enabled: false } });
    const rearly = deps(early.store, { now: () => new Date('2026-10-13T05:30:00Z') });
    await runRelances(rearly.d);
    assert.equal(rearly.team.length, 0);
  });

  await test('rapport quotidien en échec : nouvel essai au passage suivant ; erreurs du passage dans le journal d’erreurs', async () => {
    const { store, settings } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    let fail = true;
    const reports: string[] = [];
    const errors: string[] = [];
    const { d } = deps(store, {
      notifyTeam: async (subject) => { if (/rapport/.test(subject) && fail) { fail = false; throw new Error('SMTP 535'); } reports.push(subject); },
      logError: (m) => errors.push(m),
    });
    await runRelances(d);
    assert.equal(reports.length, 0);
    assert.equal(settings!.last_report_on ?? null, null, 'date du rapport remise');
    assert.ok(errors.some((m) => /rapport : SMTP 535/.test(m)), 'erreur journalisée');
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 3_600_000) });
    assert.equal(reports.filter((x) => /rapport/.test(x)).length, 1, 'rapport renvoyé au passage suivant');
    // Source illisible : erreur journalisée (gravité ERROR).
    const broken = memoryStore({ callbacks: [callback(ALICE)] });
    broken.store.callbacks = async () => null;
    const errs: string[] = [];
    await runRelances(deps(broken.store, { logError: (m) => errs.push(m) }).d);
    assert.ok(errs.some((m) => /callbacks illisible/.test(m)));
  });

  await test('Stripe : un paiement seul n’est pas un achat de crédit ; facture « manual » oui ; annulation et motif enregistrés', async () => {
    const tables: Record<string, Any[]> = { stripe_customers: [], stripe_subscriptions: [], stripe_events: [] };
    const pk: Record<string, string> = { stripe_customers: 'customer_id', stripe_subscriptions: 'subscription_id', stripe_events: 'event_id' };
    let schemaOld = false; // base sans la migration du 9 oct. : colonnes cancel_at et cancellation_reason inconnues
    const guard = (row: Any) => { if (schemaOld && ('cancel_at' in row || 'cancellation_reason' in row)) throw new Error('Supabase stripe_subscriptions 400: {"code":"PGRST204","message":"Could not find the \'cancel_at\' column"}'); };
    const db = {
      insertIfNew: async (table: string, row: Any) => { if (table === 'stripe_subscriptions') guard(row); if (tables[table].some((r) => r[pk[table]] === row[pk[table]])) return false; tables[table].push({ ...row }); return true; },
      update: async (table: string, query: string, patch: Any) => {
        if (table === 'stripe_subscriptions') guard(patch);
        const id = decodeURIComponent(/=eq\.([^&]+)/.exec(query)![1]);
        const r = tables[table].find((x) => x[pk[table]] === id);
        if (r) Object.assign(r, patch);
      },
      select: async <T,>(table: string, query: string) => tables[table].filter((x) => x[pk[table]] === decodeURIComponent(/=eq\.([^&]+)/.exec(query)![1])) as T[],
    };
    const ev = (id: string, type: string, object: Any, created = 100) => ({ id, type, created, livemode: true, data: { object } });
    await applyStripeEvent(ev('p1', 'payment_intent.succeeded', { id: 'pi_1', customer: 'cus_p', amount_received: 9900, currency: 'usd' }), db);
    const cus = () => tables.stripe_customers.find((c) => c.customer_id === 'cus_p')!;
    assert.equal(cus().has_paid, true);
    assert.ok(!cus().has_credit_purchase, 'paiement d’abonnement : pas un achat de crédit');
    await applyStripeEvent(ev('p2', 'invoice.paid', { id: 'in_s', customer: 'cus_p', amount_paid: 9900, currency: 'usd', billing_reason: 'subscription_cycle' }), db);
    assert.ok(!cus().has_credit_purchase);
    await applyStripeEvent(ev('p3', 'invoice.paid', { id: 'in_c', customer: 'cus_p', amount_paid: 1000, currency: 'usd', billing_reason: 'manual' }), db);
    assert.equal(cus().has_credit_purchase, true, 'facture Add credits');
    const trial = { id: 'sub_c', customer: 'cus_p', status: 'trialing', trial_start: 200, trial_end: 1400, cancel_at_period_end: true, cancel_at: 1400, cancellation_details: { reason: 'cancellation_requested' }, items: { data: [{ price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' } } }] } };
    await applyStripeEvent(ev('s1', 'customer.subscription.updated', trial, 300), db);
    const row = tables.stripe_subscriptions.find((x) => x.subscription_id === 'sub_c')!;
    assert.equal(row.cancel_at_period_end, true);
    assert.equal(row.cancel_at, new Date(1400 * 1000).toISOString());
    assert.equal(row.cancellation_reason, 'cancellation_requested');
    // Migration pas encore exécutée : l’abonnement est enregistré sans les nouvelles colonnes, jamais perdu.
    schemaOld = true;
    const warns: string[] = [];
    const realWarn = console.warn;
    console.warn = (...a: unknown[]) => { warns.push(a.map(String).join(' ')); };
    try {
      await applyStripeEvent(ev('s2', 'customer.subscription.created', { ...trial, id: 'sub_d' }, 400), db);
      await applyStripeEvent(ev('s3', 'customer.subscription.updated', { ...trial, id: 'sub_d', status: 'canceled', ended_at: 1400 }, 500), db);
    } finally { console.warn = realWarn; }
    const old = tables.stripe_subscriptions.find((x) => x.subscription_id === 'sub_d')!;
    assert.equal(old.status, 'canceled');
    assert.ok(!('cancel_at' in old));
    assert.ok(warns.some((w) => /20261009_relances_annulation\.sql/.test(w)));
    // Migration d’annulation faite, mais pas celle de la mise en route : seule start_date est retirée.
    schemaOld = false;
    let noStart = true;
    const insert = db.insertIfNew;
    db.insertIfNew = async (table: string, r: Any) => {
      if (table === 'stripe_subscriptions' && noStart && 'start_date' in r) throw new Error('Supabase stripe_subscriptions 400: {"code":"PGRST204","message":"Could not find the \'start_date\' column of \'stripe_subscriptions\' in the schema cache"}');
      return insert(table, r);
    };
    await applyStripeEvent(ev('s4', 'customer.subscription.created', { ...trial, id: 'sub_e', start_date: 250 }, 600), db);
    const partial = tables.stripe_subscriptions.find((x) => x.subscription_id === 'sub_e')!;
    assert.equal(partial.cancel_at, new Date(1400 * 1000).toISOString(), 'cancel_at gardée');
    assert.ok(!('start_date' in partial));
    noStart = false;
    await applyStripeEvent(ev('s5', 'customer.subscription.created', { ...trial, id: 'sub_f', start_date: 250 }, 700), db);
    assert.equal(tables.stripe_subscriptions.find((x) => x.subscription_id === 'sub_f')!.start_date, new Date(250 * 1000).toISOString());
  });

  /* ---------- Stripe ---------- */

  /* ---------- Mise en route (série A), solde (série S), alertes et « À faire aujourd’hui » (audit du 9 oct., § 7) ---------- */

  type Activity = import('@/lib/relances/types').AccountActivity;
  /** Lecture des agents d’Alice (compte 7) : `over` complète la lecture ; compteur des appels à la plateforme. */
  const reader = (over: Partial<Activity> | (() => Partial<Activity>) = {}) => {
    const calls: string[] = [];
    const fn = async (userId: string, now: Date): Promise<Activity> => {
      calls.push(userId);
      return { userId, readAt: now.toISOString(), agents: 0, agentsWithNumber: 0, phoneNumbers: 0, paused: [], realCalls: 0, lastCallAt: null, callsSince: new Date(now.getTime() - 45 * 86_400_000).toISOString(), ...(typeof over === 'function' ? over() : over) };
    };
    return { fn, calls };
  };
  const aliceDeps = (store: Store, over: Partial<Deps> & { env?: Record<string, string> } = {}) =>
    deps(store, { env: STRIPE, platformUsers: aliceLive(25), ...over });

  await test('série A : A1 à J+1 sans agent (guide « Créer un agent ») ; C2 sauté ; une seule lecture des agents par jour', async () => {
    const { store, t } = memoryStore({ ...trialSetup(), log: sentLog(['C1']) });
    const r = reader();
    const { d, sent } = aliceDeps(store, { accountActivity: r.fn });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'Votre agent n’est pas encore créé : une dizaine de minutes suffit');
    assert.equal(sent[0].category, 'essential');
    assert.match(sp(sent[0].text), /https:\/\/app\.permanenceia\.com\?utm_source=relance&utm_medium=email&utm_campaign=A1/);
    assert.match(sp(sent[0].text), /https:\/\/www\.permanenceia\.com\/aide\/guides\/creer-un-agent\?utm_source=relance/);
    assert.match(sp(sent[0].text), /bulle d’aide/);
    assert.doesNotMatch(sent[0].text, /\$|€|offre|promo/i, 'message de service : ni prix ni promotion');
    assert.equal(t.log.find((l) => l.step === 'C2')?.skip_reason, 'no_agent', 'C2 seulement si un agent existe');
    assert.deepEqual(r.calls, ['7']);
    assert.match(String(t.log.find((l) => l.step === 'A1')?.template_version), /:2026-10-09$/, 'version des textes du 9 oct.');
    assert.equal(t.activity.length, 1, 'lecture gardée en base (cache du jour)');
    // Passage suivant du même jour : lecture du cache, aucun nouvel envoi.
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 3_600_000) });
    assert.deepEqual(r.calls, ['7'], 'pas de seconde lecture le même jour');
    assert.equal(sent.length, 1);
  });

  await test('série A : A2 à J+3 (« Être rappelé ») et alerte « client sans agent » une seule fois ; A3 d’essai ou de compte actif', async () => {
    const at = new Date('2026-10-14T07:30:00Z'); // J+3 de l’essai démarré le 11 octobre
    const { store, t } = memoryStore({ ...trialSetup(), log: [...sentLog(['C1']), ...sentLog(['A1'], '2026-10-12T08:00:00Z', 'A')] });
    const r = reader();
    const { d, sent, team } = aliceDeps(store, { accountActivity: r.fn, now: () => at });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'On configure votre agent avec vous ?');
    // Client (essai, abonné) : rappel du support sur /contact, jamais la page de vente de l’essai (forfaits, prix, case marketing).
    assert.match(sp(sent[0].text), /Être rappelé pour configurer ensemble : https:\/\/www\.permanenceia\.com\/contact\?type=support&utm_source=relance&utm_medium=email&utm_campaign=A2&utm_content=mise_en_route#rappel/);
    assert.doesNotMatch(sent[0].text, /essai-gratuit/);
    const alert = team.filter((m) => /^Client sans agent/.test(m.subject));
    assert.equal(alert.length, 1);
    assert.equal(sp(alert[0].subject), 'Client sans agent depuis 3 jours — Alice');
    assert.match(sp(alert[0].text), /Client : Alice — alice\.martin@exemple\.fr/);
    assert.match(sp(alert[0].text), /Langue : fr/);
    assert.match(sp(alert[0].text), /Étape : essai jusqu’au 25 octobre 2026/);
    assert.match(sp(alert[0].text), /Agents : 0/);
    // Pendant l’essai : pas d’appel de l’équipe sans demande du client (base légale de la série A).
    assert.match(sp(alert[0].text), /Pendant l’essai, ne l’appelez que s’il a demandé à être rappelé \(bouton de A2 ou A3\)/);
    assert.doesNotMatch(alert[0].text, /appelez-le :/);
    assert.ok(t.alerts.some((k) => k.startsWith('sans_agent:')));
    await runRelances({ ...d, now: () => new Date(at.getTime() + 3_600_000) });
    assert.equal(team.filter((m) => /^Client sans agent/.test(m.subject)).length, 1, 'une seule alerte');
    // J+7 pendant l’essai : A3 avec la date de fin d’essai.
    const b = memoryStore({ ...trialSetup(), log: [...sentLog(['C1']), ...sentLog(['A1'], '2026-10-12T08:00:00Z', 'A'), ...sentLog(['A2'], '2026-10-14T08:00:00Z', 'A')] });
    const rb = aliceDeps(b.store, { accountActivity: reader().fn, now: () => new Date('2026-10-18T07:30:00Z') });
    await runRelances(rb.d);
    assert.equal(sp(rb.sent[0].subject), 'Votre essai dure jusqu’au 25 octobre 2026 : votre agent n’est pas encore créé');
    assert.match(sp(rb.sent[0].text), /rien ne sera débité/);
    // J+7 d’un abonné (abonnement sans essai, début lu dans start_date) : « votre compte est actif ».
    const c = memoryStore({ ...trialSetup({ status: 'active', trial_start: null, trial_end: null, start_date: '2026-10-06T06:00:00Z' }), log: sentLog(['A1', 'A2'], '2026-10-09T08:00:00Z', 'A') });
    const rc = aliceDeps(c.store, { accountActivity: reader().fn });
    await runRelances(rc.d);
    assert.equal(sp(rc.sent[0]?.subject ?? ''), 'Votre compte est actif, mais votre agent n’est pas encore créé');
    assert.equal(c.t.log.find((l) => l.step === 'A3')?.template_key, 'A3_active');
  });

  await test('série A : agent créé → A1 à A3 sautées et C2 envoyé ; A4 à J+10 sans appel réel ; rien après le premier appel', async () => {
    const a = memoryStore({ ...trialSetup(), log: sentLog(['C1']) });
    const ra = aliceDeps(a.store, { accountActivity: reader({ agents: 1, agentsWithNumber: 0, realCalls: 0 }).fn });
    await runRelances(ra.d);
    assert.equal(a.t.log.find((l) => l.step === 'A1')?.skip_reason, 'agent_created');
    assert.equal(ra.sent.length, 1);
    assert.equal(sp(ra.sent[0]?.subject ?? ''), 'Votre agent attend son premier appel', 'C2 : un agent existe, aucun appel réel');
    // J+10 : A4 (numéro et renvoi d’appel), avec les guides « Tester » et « Renvoi d’appel ».
    const at = new Date('2026-10-21T07:30:00Z');
    const b = memoryStore({ ...trialSetup(), log: [...sentLog(['C1', 'C2', 'C3']), ...['A1', 'A2', 'A3'].map((step) => ({ email_key: K(ALICE), sequence: 'A', step, dry_run: false, status: 'skipped', skip_reason: 'agent_created', category: null, created_at: '2026-10-12T08:00:00Z' }))] });
    const rb = aliceDeps(b.store, { accountActivity: reader({ agents: 1, agentsWithNumber: 0, realCalls: 0 }).fn, now: () => at });
    await runRelances(rb.d);
    assert.equal(rb.sent.length, 1);
    assert.equal(sp(rb.sent[0]?.subject ?? ''), 'Votre agent est créé : testez-le et activez le renvoi d’appel');
    assert.match(sp(rb.sent[0].text), /\/aide\/guides\/tester-son-agent\?utm_source=relance&utm_medium=email&utm_campaign=A4/);
    assert.match(sp(rb.sent[0].text), /\/aide\/guides\/renvoi-d-appel\?/);
    // Premier appel réel reçu : A4 sautée.
    const c = memoryStore({ ...trialSetup(), log: b.t.log.filter((l) => l.step !== 'A4').map((l) => ({ ...l })) });
    const rc = aliceDeps(c.store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 2, lastCallAt: '2026-10-20T10:00:00Z' }).fn, now: () => at });
    await runRelances(rc.d);
    assert.equal(rc.sent.length, 0);
    assert.equal(c.t.log.find((l) => l.step === 'A4')?.skip_reason, 'agent_in_use');
  });

  await test('C2 et C3 : lecture des agents en échec → attente (jamais « 0 agent »), erreur journalisée ; C3 sauté sans agent', async () => {
    const a = memoryStore({ ...trialSetup(), log: sentLog(['C1']) });
    const errs: string[] = [];
    const ra = aliceDeps(a.store, { accountActivity: async () => { throw new Error('Autocalls /user/assistants/get 500'); }, logError: (m) => errs.push(m) });
    const r = await runRelances(ra.d);
    assert.equal(ra.sent.length, 0);
    assert.ok(!a.t.log.some((l) => l.step === 'C2' || l.sequence === 'A'), 'rien de décidé sans lecture');
    assert.ok(r.counts.waiting.activity_unknown >= 2);
    assert.ok(errs.some((e) => /lecture des agents \(compte 7\)/.test(e)));
    // C3 (T+5) sans agent : sauté, la série A prend le relais.
    const b = memoryStore({ ...trialSetup(), log: [...sentLog(['C1', 'C2']), ...sentLog(['A1', 'A2'], '2026-10-12T08:00:00Z', 'A')] });
    const rb = aliceDeps(b.store, { accountActivity: reader().fn, now: () => new Date('2026-10-16T07:30:00Z') });
    await runRelances(rb.d);
    assert.equal(b.t.log.find((l) => l.step === 'C3')?.skip_reason, 'no_agent');
  });

  await test('série A : arrêt sur réponse, annulation, impayé, opposition ; après désinscription A1 et A2 partent, A3 est sauté', async () => {
    const stop = async (setup: Any, extra: Any = {}) => {
      const m = memoryStore({ ...setup, log: sentLog(['C1']), ...extra });
      const r = aliceDeps(m.store, { accountActivity: reader().fn });
      await runRelances(r.d);
      return { st: m.t.state.find((s) => s.sequence === 'A'), sent: r.sent };
    };
    const replied = await stop(trialSetup(), { stops: [{ email_key: K(ALICE), reason: 'replied', scope: 'marketing', source: 'imap:x', created_at: '2026-10-12T09:00:00Z' }] });
    assert.equal(replied.st?.status, 'stopped');
    assert.equal(replied.st?.stop_reason, 'replied');
    assert.equal(replied.sent.length, 0);
    assert.equal((await stop(trialSetup({ cancel_at_period_end: true }))).st?.stop_reason, 'cancel_scheduled');
    assert.equal((await stop(trialSetup({ status: 'past_due', trial_end: '2026-10-12T06:00:00Z' }))).st?.stop_reason, 'unpaid');
    const opposed = memoryStore({ ...trialSetup(), log: sentLog(['C1']), callbacks: [callback(ALICE)] });
    const ro = aliceDeps(opposed.store, { accountActivity: reader().fn });
    ro.d.store.phoneOptouts = async () => new Set(['+33612345678']);
    await runRelances(ro.d);
    assert.equal(opposed.t.state.find((s) => s.sequence === 'A')?.stop_reason, 'opposed');
    // Désinscription (« e-mails essentiels seulement ») : A2 part, A3 est sauté.
    const prefs = new Map([[K(ALICE), 'essential_only']]);
    const a2 = memoryStore({ ...trialSetup(), prefs, log: [...sentLog(['C1']), ...sentLog(['A1'], '2026-10-12T08:00:00Z', 'A')] });
    const r2 = aliceDeps(a2.store, { accountActivity: reader().fn, now: () => new Date('2026-10-14T07:30:00Z') });
    await runRelances(r2.d);
    assert.equal(sp(r2.sent[0]?.subject ?? ''), 'On configure votre agent avec vous ?');
    const a3 = memoryStore({ ...trialSetup(), prefs, log: [...sentLog(['C1']), ...sentLog(['A1'], '2026-10-12T08:00:00Z', 'A'), ...sentLog(['A2'], '2026-10-14T08:00:00Z', 'A')] });
    const r3 = aliceDeps(a3.store, { accountActivity: reader().fn, now: () => new Date('2026-10-18T07:30:00Z') });
    await runRelances(r3.d);
    assert.equal(r3.sent.length, 0);
    assert.equal(a3.t.log.find((l) => l.step === 'A3')?.skip_reason, 'essential_only');
  });

  await test('abonné payant sans appel : suivi mensuel à J+30, alertes « risque de résiliation » et « renouvellement » (une fois)', async () => {
    const setup = trialSetup({ status: 'active', trial_start: null, trial_end: null, start_date: '2026-09-13T06:00:00Z', current_period_end: '2026-10-16T06:00:00Z' });
    const { store, t } = memoryStore(setup);
    const { d, sent, team } = aliceDeps(store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 0 }).fn });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'Votre agent n’a reçu aucun appel ces 30 derniers jours');
    assert.equal(t.log.find((l) => l.step === 'AM1')?.template_key, 'A_monthly');
    assert.ok(['A1', 'A2', 'A3', 'A4'].every((s) => t.log.find((l) => l.step === s)?.skip_reason === 'stale'), 'jamais d’envoi rétroactif');
    assert.equal(team.filter((m) => /^Risque de résiliation : abonné sans appel réel/.test(m.subject)).length, 1);
    assert.equal(sp(team.find((m) => /^Renouvellement/.test(m.subject))!.subject), 'Renouvellement le 16 octobre 2026 sans appel sur 30 jours — Alice');
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 2 * 3_600_000) });
    assert.equal(team.filter((m) => /^Risque|^Renouvellement/.test(m.subject)).length, 2, 'une seule alerte de chaque');
    // Appels réels récents : ni suivi mensuel, ni alerte.
    const b = memoryStore(setup);
    const rb = aliceDeps(b.store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 4, lastCallAt: '2026-10-12T10:00:00Z' }).fn });
    await runRelances(rb.d);
    assert.equal(rb.sent.length, 0);
    assert.equal(b.t.log.find((l) => l.step === 'AM1')?.skip_reason, 'calls_ok');
    assert.ok(!rb.team.some((m) => /^Risque|^Renouvellement/.test(m.subject)));
  });

  await test('série S : minutes basses (S1) puis épuisées (S2) d’un abonné, une fois par baisse, alerte à l’équipe ; jamais pendant l’essai', async () => {
    const sub = { status: 'active', trial_start: null, trial_end: null, start_date: '2026-09-01T06:00:00Z', current_period_end: '2026-11-01T06:00:00Z' };
    const snaps = [
      { user_id: '7', snap_date: '2026-10-11', email_key: K(ALICE), minutes_balance: 200, credits_balance: 50, platform_created_at: null },
      { user_id: '7', snap_date: '2026-10-12', email_key: K(ALICE), minutes_balance: 120, credits_balance: 10, platform_created_at: null },
    ];
    const live = (minutes: number, credits = 0) => async () => [{ id: 7, name: 'Alice', email: ALICE, minutes_balance: minutes, credits_balance: credits, created_at: '2026-09-01T06:00:00Z' }];
    const { store, t } = memoryStore({ ...trialSetup(sub), snapshots: snaps });
    const { d, sent, team } = aliceDeps(store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 9, lastCallAt: '2026-10-12T10:00:00Z' }).fn, platformUsers: live(40) });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'Minutes d’appels restantes : 40');
    assert.match(sp(sent[0].text), /app\.permanenceia\.com\/credits\?utm_source=relance&utm_medium=email&utm_campaign=S1\n/, 'campagne sans l’épisode (S1, pas S1@date)');
    assert.ok(t.log.some((l) => l.sequence === 'S' && l.step === 'S1@2026-10-12'));
    assert.equal(team.filter((m) => /^Minutes basses \(40 min\)/.test(m.subject)).length, 1);
    assert.equal(team.filter((m) => /^Crédits de messages à 0/.test(m.subject)).length, 1, 'crédits tombés à 0 : alerte équipe');
    // Plus tard le même jour, encore plus bas : pas de second S1.
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 3_600_000), platformUsers: live(30) });
    assert.equal(sent.length, 1);
    // Le lendemain, solde à 0 : S2 (minutes épuisées), alerte équipe.
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 86_400_000), platformUsers: live(0) });
    assert.equal(sent.length, 2);
    assert.equal(sp(sent[1].subject), 'Votre solde de minutes est épuisé : votre agent ne prend plus d’appels');
    assert.equal(team.filter((m) => /^Minutes épuisées/.test(m.subject)).length, 1);
    // Pendant l’essai : jamais S (C4 s’en charge).
    const e = memoryStore({ ...trialSetup(), log: sentLog(['C1']), snapshots: snaps });
    const re = aliceDeps(e.store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 1, lastCallAt: '2026-10-12T10:00:00Z' }).fn, platformUsers: live(3) });
    await runRelances(re.d);
    assert.ok(!e.t.log.some((l) => l.sequence === 'S'));
    // Compte de test : ni e-mail, ni alerte.
    const f = memoryStore({ ...trialSetup(sub), snapshots: snaps, contacts: [{ email_key: K(ALICE), email: ALICE, locale: 'fr', locale_source: 'site_form', is_test: true }] });
    const rf = aliceDeps(f.store, { accountActivity: reader().fn, platformUsers: live(40) });
    await runRelances(rf.d);
    assert.equal(rf.sent.length, 0);
    assert.ok(!rf.team.some((m) => /^Minutes|^Client sans agent|^Crédits/.test(m.subject)));
  });

  await test('alertes : agent mis en pause par la conformité, solde de l’agence bas (une fois par jour)', async () => {
    const { store } = memoryStore({ ...trialSetup(), log: sentLog(['C1']) });
    const { d, team } = aliceDeps(store, {
      accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 1, lastCallAt: '2026-10-12T10:00:00Z', paused: [{ name: 'Accueil cabinet', since: '2026-10-12T09:00:00.000Z' }] }).fn,
      agencyBalance: async () => 120.5,
    });
    await runRelances(d);
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 3_600_000) });
    const paused = team.filter((m) => /^Agent mis en pause/.test(m.subject));
    assert.equal(paused.length, 1);
    assert.match(sp(paused[0].text), /Agent en pause : Accueil cabinet \(depuis 2026-10-12\)/);
    const low = team.filter((m) => /^Solde de l’agence Autocalls bas/.test(m.subject));
    assert.equal(low.length, 1);
    assert.match(sp(low[0].subject), /120,50 \$US/);
    const report = team.find((m) => /rapport/.test(m.subject))!;
    assert.match(sp(report.text), /Solde de l’agence Autocalls : 120,50 \$US \(seuil d’alerte : 300,00 \$US\)/);
    assert.match(report.text, /Agents mis en pause par la conformité Autocalls : 1/);
  });

  await test('verrou d’alerte illisible : aucune alerte, erreur journalisée, alerte au passage suivant (jamais en double)', async () => {
    const { store, t } = memoryStore({ ...trialSetup(), log: [...sentLog(['C1']), ...sentLog(['A1'], '2026-10-12T08:00:00Z', 'A')] });
    const claim = store.claimAlert!;
    let down = true;
    store.claimAlert = async (key) => { if (down) throw new Error('Supabase stripe_events 503'); return claim(key); };
    const errs: string[] = [];
    const { d, team } = aliceDeps(store, { accountActivity: reader().fn, now: () => new Date('2026-10-14T07:30:00Z'), logError: (m) => errs.push(m) });
    await runRelances(d);
    assert.ok(!team.some((m) => /^Client sans agent/.test(m.subject)));
    assert.ok(errs.some((e) => /alerte « sans_agent » : Supabase stripe_events 503/.test(e)));
    assert.ok(!errs.some((e) => e.includes(ALICE)), 'jamais l’adresse du client dans le journal');
    down = false;
    await runRelances({ ...d, now: () => new Date('2026-10-14T08:30:00Z') });
    await runRelances({ ...d, now: () => new Date('2026-10-14T09:30:00Z') });
    assert.equal(team.filter((m) => /^Client sans agent/.test(m.subject)).length, 1);
    assert.equal(t.alerts.filter((k) => k.startsWith('sans_agent:')).length, 1);
  });

  await test('rapport de 8 h : rubrique nominative « À faire aujourd’hui » (sans agent, essai qui finit, réponse, rappel à faire)', async () => {
    const BOB = 'bob@exemple.fr';
    const { store } = memoryStore({
      ...trialSetup({ trial_start: '2026-10-02T06:00:00Z', trial_end: '2026-10-15T06:00:00Z' }), log: sentLog(['C1', 'C2', 'C3'], '2026-10-05T08:00:00Z'),
      callbacks: [callback(ALICE, { type: 'support', status: 'done' }), callback(BOB, { id: 'bob', name: 'Bob Durand', phone: '+33699999999', status: 'pending', created_at: '2026-10-12T15:00:00Z' })],
      stops: [{ email_key: K(BOB), reason: 'replied', scope: 'marketing', source: 'imap:y', created_at: '2026-10-13T06:00:00Z' }],
    });
    const { d, team } = aliceDeps(store, { accountActivity: reader().fn });
    await runRelances(d);
    const report = team.find((m) => /rapport/.test(m.subject))!;
    const text = sp(report.text);
    assert.ok(text.startsWith('À FAIRE AUJOURD’HUI'), 'rubrique en tête du rapport');
    // Pendant l’essai : appel d’une personne de l’équipe seulement à la demande du client (pas d’accord sinon).
    assert.match(text, /Clients sans agent \(abonnés et paiement à la minute : à appeler à partir de J\+7\) : 1\n {2}- Alice — alice\.martin@exemple\.fr — \+33612345678 — fr — essai jusqu’au 15 octobre 2026 — J\+11 : rappel seulement à sa demande \(bouton de A2\/A3\)/);
    assert.doesNotMatch(text, /J\+11 : à appeler/);
    assert.match(text, /Essais qui finissent sous 3 jours sans usage : 1/);
    assert.match(text, /Réponses reçues \(24 h\) : l’équipe prend le relais : 1\n {2}- bob@exemple\.fr/);
    assert.match(text, /Rappels à faire à la main \(demandes non mises en file\) : 1\n {2}- Bob Durand — \+33699999999 — bob@exemple\.fr — commercial/);
    assert.match(text, /Lecture des agents : 1 compte\(s\) suivi\(s\)\./);
    assert.match(text, /— Relances —/);
  });

  await test('lecture des agents (fetch simulé) : jeton temporaire révoqué, appels « web » écartés, échec jamais « 0 agent »', async () => {
    const { accountActivityFetcher, agencyBalanceFetcher, summarizeActivity } = await import('@/lib/relances/activity');
    assert.equal(accountActivityFetcher(''), undefined, 'sans clé : pas de lecture');
    const realFetch = globalThis.fetch;
    const seen: string[] = [];
    let failAgents = false;
    globalThis.fetch = (async (url: unknown, init: Any = {}) => {
      const u = String(url);
      seen.push(`${init.method || 'GET'} ${u.replace('https://app.autocalls.ai/api', '')}${init.body ? ` ${init.body}` : ''}`);
      if (!u.startsWith('https://app.autocalls.ai/api/')) throw new Error(`réseau interdit en test : ${u}`);
      const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
      if (u.endsWith('/white-label/token')) return json({ token: '42|secret-de-test' });
      if (u.endsWith('/white-label/logout')) return json({ message: 'ok' });
      if (u.includes('/user/assistants/get')) return failAgents ? json({ error: 'x' }, 500) : json({ total: 2, data: [{ id: 1, name: 'Accueil', phone_number_id: 9 }, { id: 2, name: 'Rappels', phone_number_id: null, compliance_blocked_at: '2026-10-12 09:00:00' }] });
      if (u.includes('/user/phone-numbers')) return json({ data: [{ id: 9, phone_number: '+33100000000' }] });
      if (u.includes('/user/calls')) return json({ total: 2, data: [{ type: 'web', created_at: '2026-10-13 07:00:00' }, { type: 'inbound', created_at: '2026-10-12 10:00:00' }] });
      if (u.endsWith('/user/me')) return json({ name: 'Agence', total_balance: '3488.74' });
      return json({}, 404);
    }) as typeof fetch;
    try {
      const read = accountActivityFetcher('cle-de-test')!;
      const a = await read('7', NOW);
      assert.deepEqual({ agents: a.agents, withNumber: a.agentsWithNumber, numbers: a.phoneNumbers, calls: a.realCalls, last: a.lastCallAt, paused: a.paused.map((p) => p.name) },
        { agents: 2, withNumber: 1, numbers: 1, calls: 1, last: '2026-10-12T10:00:00.000Z', paused: ['Rappels'] });
      assert.ok(seen.some((x) => x.startsWith('POST /white-label/token') && x.includes('"user_id":7')));
      assert.ok(seen.some((x) => x.startsWith('GET /user/calls?per_page=100&date_from=2026-08-29')));
      assert.ok(seen.some((x) => x.startsWith('POST /white-label/logout') && x.includes('"token_id":42')), 'seul ce jeton est révoqué');
      failAgents = true;
      seen.length = 0;
      await assert.rejects(() => read('7', NOW), /assistants\/get\?per_page=100 500/);
      assert.ok(seen.some((x) => x.startsWith('POST /white-label/logout')), 'jeton révoqué même en cas d’échec');
      assert.equal(await agencyBalanceFetcher('cle-de-test')!(), 3488.74);
    } finally { globalThis.fetch = realFetch; }
    // Page pleine sans appel réel : inconnu, jamais « 0 appel ».
    const since = new Date('2026-09-01T00:00:00Z');
    const page = summarizeActivity('7', { assistants: { data: [{ id: 1 }] }, numbers: null, calls: { total: 300, data: [{ type: 'web', created_at: '2026-10-12 10:00:00' }] }, now: NOW, since });
    assert.equal(page.realCalls, null);
    assert.equal(page.phoneNumbers, null);
  });

  await test('abonné sans agent : suivi mensuel sauté (no_agent, jamais « aucun appel ») ; alertes « sans agent » à appeler, renouvellement « sans agent »', async () => {
    const setup = trialSetup({ status: 'active', trial_start: null, trial_end: null, start_date: '2026-09-13T06:00:00Z', current_period_end: '2026-10-16T06:00:00Z' });
    const { store, t } = memoryStore(setup);
    const { d, sent, team } = aliceDeps(store, { accountActivity: reader({ agents: 0, agentsWithNumber: 0, realCalls: 0 }).fn });
    await runRelances(d);
    assert.equal(sent.length, 0, 'aucun A_monthly « votre agent n’a reçu aucun appel » sans agent');
    assert.equal(t.log.find((l) => l.step === 'AM1')?.skip_reason, 'no_agent');
    const renewal = team.find((m) => /^Renouvellement/.test(m.subject))!;
    assert.equal(sp(renewal.subject), 'Renouvellement le 16 octobre 2026 sans agent — Alice');
    assert.match(sp(renewal.text), /n’a créé aucun agent .*A3 était le dernier.*appelez-le avant le renouvellement/);
    assert.doesNotMatch(renewal.text, /n’a reçu aucun appel réel depuis 30 jours/);
    assert.equal(team.filter((m) => /^Risque de résiliation : abonné sans agent/.test(m.subject)).length, 1, 'toujours couvert par « risque de résiliation »');
    // Client payant : l’équipe l’appelle (alerte et « À faire aujourd’hui »).
    assert.match(sp(team.find((m) => /^Client sans agent/.test(m.subject))!.text), /Appelez-le pour configurer l’agent avec lui/);
    assert.match(sp(team.find((m) => /rapport/.test(m.subject))!.text), /abonné \(Réceptionniste, 99,00 \$US par mois\) — J\+30 : à appeler/);
    // Mois suivant, toujours sans agent : AM2 sauté aussi.
    await runRelances({ ...d, now: () => new Date('2026-11-12T07:30:00Z'), accountActivity: reader({ agents: 0, agentsWithNumber: 0, realCalls: 0 }).fn });
    assert.equal(sent.length, 0);
    assert.equal(t.log.find((l) => l.step === 'AM2')?.skip_reason, 'no_agent');
  });

  await test('tables Stripe illisibles à un passage : aucune série close, rien envoyé ni alerté, rapport avec l’erreur ; A2 part au passage suivant', async () => {
    const { store, t } = memoryStore({ ...trialSetup(), log: [...sentLog(['C1']), ...sentLog(['A1'], '2026-10-12T08:00:00Z', 'A')] });
    const errs: string[] = [];
    const { d, sent, team } = aliceDeps(store, { accountActivity: reader().fn, logError: (m) => errs.push(m) });
    await runRelances(d); // J+2 : séries C et A ouvertes, C2 sauté (aucun agent)
    assert.ok(t.state.some((s) => s.sequence === 'A') && t.state.every((s) => s.status !== 'stopped'));
    const states = JSON.stringify(t.state);
    const stripe = store.stripe;
    store.stripe = async () => null; // erreur Supabase passagère
    const halted = await runRelances({ ...d, now: () => new Date('2026-10-14T06:30:00Z') });
    assert.equal(halted.status, 'error');
    assert.equal(JSON.stringify(t.state), states, 'aucun relance_state modifié (jamais « stage_changed:signed_up »)');
    assert.equal(sent.length, 0);
    assert.ok(!t.log.some((l) => l.step === 'I1'), 'jamais I1 « inscrit sans essai » pour un client en essai');
    assert.ok(errs.some((m) => /tables Stripe illisibles/.test(m)));
    const report = team.filter((m) => /rapport/.test(m.subject)).pop()!;
    assert.match(report.text, /indisponible \(tables Stripe illisibles/);
    assert.ok(!team.some((m) => /^Client sans agent/.test(m.subject)), 'aucune alerte décidée sans Stripe');
    store.stripe = stripe;
    await runRelances({ ...d, now: () => new Date('2026-10-14T07:30:00Z') });
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'On configure votre agent avec vous ?');
    assert.equal(team.filter((m) => /^Client sans agent/.test(m.subject)).length, 1);
  });

  await test('compte à la minute sans achat enregistré : solde 50 → 12 → 0 → S2 et « Minutes épuisées » une fois (étape « à la minute » stable)', async () => {
    const snaps = [
      { user_id: '7', snap_date: '2026-10-11', email_key: K(ALICE), minutes_balance: 50, credits_balance: 0, platform_created_at: null },
      { user_id: '7', snap_date: '2026-10-12', email_key: K(ALICE), minutes_balance: 12, credits_balance: 0, platform_created_at: null },
    ];
    const { store, t } = memoryStore({
      signups: [{ email: ALICE, name: 'Alice', signed_up_at: '2026-09-01T06:00:00Z', locale: 'fr' }],
      // Crédit acheté avant le 8 oct. : aucun achat enregistré par le webhook.
      customers: [{ customer_id: 'cus_1', email: ALICE, preferred_locale: 'fr', has_paid: true, has_credit_purchase: false, livemode: true }],
      snapshots: snaps,
    });
    const { d, sent, team } = aliceDeps(store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 3, lastCallAt: '2026-10-12T10:00:00Z' }).fn, platformUsers: aliceLive(0) });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'Votre solde de minutes est épuisé : votre agent ne prend plus d’appels');
    assert.ok(t.log.some((l) => l.sequence === 'S' && l.step === 'S2@2026-10-12'));
    assert.equal(team.filter((m) => /^Minutes épuisées/.test(m.subject)).length, 1);
    assert.ok(!t.state.some((s) => s.sequence === 'A' && s.status === 'stopped'), 'série A jamais close à 0 minute');
    await runRelances({ ...d, now: () => new Date(NOW.getTime() + 86_400_000) });
    assert.equal(sent.length, 1, 'une seule fois par épisode');
    assert.equal(team.filter((m) => /^Minutes épuisées/.test(m.subject)).length, 1);
  });

  await test('solde de 0,6 minute : S2 « épuisé » (arrondi comme {minutes_left}), jamais S1 « minutes restantes : 0 »', async () => {
    const { balanceEpisode, agentIdle } = await import('@/lib/relances/onboarding');
    const snap = (snap_date: string, minutes_balance: number) => ({ user_id: '7', snap_date, email_key: K(ALICE), minutes_balance, credits_balance: 0, platform_created_at: null });
    assert.deepEqual(balanceEpisode([snap('2026-10-11', 40), snap('2026-10-12', 0.6)], 0.6, 20), { step: 'S2', since: '2026-10-11' });
    assert.deepEqual(balanceEpisode([snap('2026-10-11', 40)], 1.2, 20), { step: 'S1', since: '2026-10-11' });
    assert.equal(balanceEpisode([snap('2026-10-12', 0.6)], 0.6, 20), null, 'un instantané sous 1 minute n’est pas une baisse observée');
    const sub = { status: 'active', trial_start: null, trial_end: null, start_date: '2026-09-01T06:00:00Z', current_period_end: '2026-11-01T06:00:00Z' };
    const { store } = memoryStore({ ...trialSetup(sub), snapshots: [snap('2026-10-11', 40), snap('2026-10-12', 0.6)] });
    const { d, sent, team } = aliceDeps(store, { accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 5, lastCallAt: '2026-10-12T10:00:00Z' }).fn, platformUsers: aliceLive(0.6) });
    await runRelances(d);
    assert.equal(sent.length, 1);
    assert.equal(sp(sent[0].subject), 'Votre solde de minutes est épuisé : votre agent ne prend plus d’appels');
    assert.equal(team.filter((m) => /^Minutes épuisées/.test(m.subject)).length, 1);
    assert.ok(!team.some((m) => /^Minutes basses/.test(m.subject)));
    // A4 : un agent sortant sans numéro relié mais avec des appels réels est en service.
    const act = { userId: '7', readAt: NOW.toISOString(), agents: 1, agentsWithNumber: 0, phoneNumbers: 0, paused: [], realCalls: 3, lastCallAt: '2026-10-12T10:00:00Z', callsSince: '2026-08-29T00:00:00Z' };
    assert.equal(agentIdle(act), false);
    assert.equal(agentIdle({ ...act, realCalls: 0, lastCallAt: null }), true);
    assert.equal(agentIdle({ ...act, realCalls: null, lastCallAt: null }), true, 'sans numéro et appels illisibles : A4 (« donnez-lui un numéro »)');
  });

  await test('alertes à l’équipe : 10 au plus par passage, 3 s entre deux envois ; le reste au passage suivant (jamais perdu)', async () => {
    const emails = Array.from({ length: 12 }, (_, i) => `client${i}@exemple.fr`);
    const { store, t } = memoryStore({
      signups: emails.map((email) => ({ email, name: 'Client', signed_up_at: '2026-10-01T06:00:00Z', locale: 'fr' })),
      customers: emails.map((email, i) => ({ customer_id: `cus_${i}`, email, preferred_locale: 'fr', has_paid: false, has_credit_purchase: false, livemode: true })),
      subscriptions: emails.map((_, i) => ({ subscription_id: `sub_${i}`, customer_id: `cus_${i}`, status: 'trialing', trial_start: '2026-10-11T06:00:00Z', trial_end: '2026-10-25T06:00:00Z', canceled_at: null, ended_at: null, price_amount: 9900, currency: 'usd', billing_interval: 'month', livemode: true })),
    });
    const sleeps: number[] = [];
    const users = async () => emails.map((email, i) => ({ id: 100 + i, name: 'Client', email, minutes_balance: 25, credits_balance: 0, created_at: '2026-10-01T06:00:00Z' }));
    const { d, sent, team } = deps(store, { env: STRIPE, platformUsers: users, accountActivity: reader().fn, now: () => new Date('2026-10-14T07:30:00Z'), sleep: async (ms) => { sleeps.push(ms); } });
    const r = await runRelances(d);
    assert.equal(sent.length, 12, 'A2 envoyé à chacun');
    assert.equal(team.filter((m) => /^Client sans agent/.test(m.subject)).length, 10);
    assert.equal(r.counts.alerts, 10);
    assert.equal(r.counts.waiting.alert_cap, 2);
    assert.equal(t.alerts.filter((k) => k.startsWith('sans_agent:')).length, 10, 'clés des alertes reportées non réservées');
    assert.equal(sleeps.filter((ms) => ms === 3_000).length, 11 + 10, '3 s entre deux relances, puis avant chaque alerte');
    await runRelances({ ...d, now: () => new Date('2026-10-14T08:30:00Z') });
    assert.equal(team.filter((m) => /^Client sans agent/.test(m.subject)).length, 12, 'les 2 dernières au passage suivant');
  });

  await test('échec SMTP qui cite l’adresse du client : adresse masquée dans le journal d’erreurs, relance_log et le passage', async () => {
    const { store, t } = memoryStore({ callbacks: [callback(ALICE)], consents: [consent(ALICE)] });
    const errs: string[] = [];
    const { d } = deps(store, { env: { RELANCES_DRY_RUN: '0' }, sendMail: async () => { throw new Error(`550 5.1.1 <${ALICE}>: Recipient address rejected`); }, logError: (m) => errs.push(m) });
    await runRelances(d);
    assert.ok(errs.some((m) => /envoi P1 : 550 5\.1\.1 <\[adresse\]>: Recipient address rejected/.test(m)));
    assert.ok(!errs.some((m) => m.includes(ALICE)), 'jamais l’adresse du client dans le journal d’erreurs');
    assert.equal(t.log.find((l) => l.step === 'P1')?.skip_reason, '550 5.1.1 <[adresse]>: Recipient address rejected');
    assert.ok(!JSON.stringify(t.runs.map((x) => x.errors)).includes(ALICE));
  });

  await test('solde de l’agence : RELANCES_AGENCY_BALANCE_MIN=0 coupe l’alerte, même solde négatif ; le rapport le dit', async () => {
    const { store } = memoryStore({ ...trialSetup(), log: sentLog(['C1']) });
    const { d, team } = aliceDeps(store, { env: { ...STRIPE, RELANCES_AGENCY_BALANCE_MIN: '0' }, accountActivity: reader({ agents: 1, agentsWithNumber: 1, realCalls: 1, lastCallAt: '2026-10-12T10:00:00Z' }).fn, agencyBalance: async () => -12.5 });
    await runRelances(d);
    assert.ok(!team.some((m) => /^Solde de l’agence/.test(m.subject)));
    assert.match(sp(team.find((m) => /rapport/.test(m.subject))!.text), /Solde de l’agence Autocalls : -12,50 \$US \(alerte coupée : RELANCES_AGENCY_BALANCE_MIN à 0\)/);
  });

  await test('textes A et S : 7 langues, service sans prix, boutons vers l’espace client, les guides ou « Être rappelé »', async () => {
    const { getI18n } = await import('@/i18n');
    const { LOCALES } = await import('@/i18n/locales');
    // « Être rappelé » d’un client : rappel du support (setup_assist), jamais le formulaire de vente de l’essai.
    const want: Record<string, string> = { A1: 'app', A2: 'setup_assist', A3: 'setup_assist', A3_active: 'setup_assist', A4: 'guide_test', A_monthly: 'setup_assist', S1: 'credits', S2: 'credits' };
    for (const locale of LOCALES) {
      const content = relancesContent(locale)!;
      const facts = (await import('@/i18n/content/fr')).buildRelanceFacts(getI18n(locale))!;
      for (const [key, target] of Object.entries(want)) {
        const m = content.messages[key as keyof typeof content.messages](facts)!;
        assert.equal(m.category, 'essential', `${locale} ${key}`);
        assert.equal(m.cta?.target, target, `${locale} ${key}`);
        const all = [m.subject, m.preheader, ...m.body.map((b) => (typeof b === 'string' ? b : JSON.stringify(b))), ...(m.after ?? []).map(String)].join(' ');
        assert.doesNotMatch(all, /\$|€|£|₪|\d+[,.]\d{2}/, `${locale} ${key} : aucun prix dans un message de service`);
        assert.equal(Boolean(m.skipIfEssentialOnly), ['A3', 'A3_active', 'A4', 'A_monthly'].includes(key), `${locale} ${key} : sauté après désinscription seulement pour A3, A4 et le suivi mensuel`);
      }
      assert.doesNotMatch(content.messages.A2(facts)!.subject, /פרסומת/, `${locale} : jamais de préfixe publicitaire sur un message de service`);
      // Aucun numéro n’est inclus : A1 et A4 disent où l’obtenir (option au mois) avant de le relier à l’agent.
      for (const key of ['A1', 'A4'] as const) {
        assert.match(JSON.stringify(content.messages[key](facts)!.body), /Get new phone number/, `${locale} ${key} : numéro à obtenir`);
      }
      // C2 : les tests dans le navigateur consomment des minutes sans compter comme appels réels : aucun solde annoncé.
      const c2 = JSON.stringify(content.messages.C2(facts)!.body);
      assert.doesNotMatch(c2, new RegExp(`\\b${facts.trialMinutes}\\b`), `${locale} C2 : pas de « ${facts.trialMinutes} minutes » restantes`);
      assert.match(c2, /\{trial_end_date\}/, `${locale} C2 : date de fin de l’essai`);
    }
    // Relecture des textes (9 oct.) : objet anglais de A2, boutons néerlandais, A3 polonais.
    const en = relancesContent('en-gb')!;
    const enFacts = (await import('@/i18n/content/fr')).buildRelanceFacts(getI18n('en-gb'))!;
    assert.equal(en.messages.A2(enFacts)!.subject, 'Want a hand setting up your agent?');
    const nl = relancesContent('nl')!;
    const nlFacts = (await import('@/i18n/content/fr')).buildRelanceFacts(getI18n('nl'))!;
    for (const key of ['A2', 'A3', 'A3_active'] as const) assert.equal(nl.messages[key](nlFacts)!.cta?.label, 'Bel mij terug om samen in te stellen');
    assert.equal(nl.messages.A_monthly(nlFacts)!.cta?.label, 'Bel mij terug om samen te controleren');
    const pl = relancesContent('pl')!;
    const plFacts = (await import('@/i18n/content/fr')).buildRelanceFacts(getI18n('pl'))!;
    assert.match(JSON.stringify(pl.messages.A3(plFacts)!.body), /okres próbny można anulować przed \{trial_end_date\}/);
  });

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
