// Tests du journal structuré pour Google Cloud Logging (src/lib/log.ts ; audit du 9 oct. 2026, action 16) :
//   npx tsx scripts/test-journal.ts
// Aucun réseau, aucune base, aucun envoi : sorties et console simulées. Vérifie : gravité ERROR / WARNING / INFO selon
// la méthode de console ; ligne JSON { severity, message, component, source } ; adresses e-mail, numéros (y compris avec
// tirets ou parenthèses) et adresses IPv4 longues masqués, identifiants et dates intacts, limites connues documentées ; activation seulement sur Cloud Run (K_SERVICE) ou avec LOG_FORMAT ;
// installation unique ; logError en JSON (Cloud Run) ou en texte (local), champs fixes jamais écrasés.
import assert from 'node:assert/strict';
import {
  formatArgs, installStructuredConsole, logError, logLine, logWarn, maskPhones, scrub, setupServerLogging, structuredLogsWanted,
} from '@/lib/log';

let passed = 0;
const realLog = console.log;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; realLog(`ok  ${name}`); } catch (e) { realLog(`ÉCHEC  ${name}`); throw e; }
}

/** Console factice : mêmes méthodes que la vraie, rien n’est écrit. */
function fakeConsole() {
  const calls: { m: string; args: unknown[] }[] = [];
  const c = {
    error: (...args: unknown[]) => calls.push({ m: 'error', args }),
    warn: (...args: unknown[]) => calls.push({ m: 'warn', args }),
    info: (...args: unknown[]) => calls.push({ m: 'info', args }),
    log: (...args: unknown[]) => calls.push({ m: 'log', args }),
  } as unknown as Console;
  return { c, calls };
}

async function main() {
  const saved = { K_SERVICE: process.env.K_SERVICE, LOG_FORMAT: process.env.LOG_FORMAT };
  delete process.env.K_SERVICE; delete process.env.LOG_FORMAT;

  // --- Masquage des données personnelles ---
  await test('numéros masqués (international, national avec espaces, avec points), 2 derniers chiffres gardés', () => {
    assert.equal(maskPhones('appel +33612345678 refusé'), 'appel [numéro …78] refusé');
    assert.equal(maskPhones('tél 06 12 34 56 78.'), 'tél [numéro …78].');
    assert.equal(maskPhones('(+44 7367 090106)'), '([numéro …06])');
    assert.equal(maskPhones('ip 203.0.113.42'), 'ip [numéro …42]');
  });
  await test('numéros avec tirets ou parenthèses commençant par « + », « ( » ou « 0 » masqués, parenthèses autour gardées', () => {
    assert.equal(maskPhones('tél 050-123-4567 rappel'), 'tél [numéro …67] rappel');
    assert.equal(maskPhones('06-12-34-56-78'), '[numéro …78]');
    assert.equal(maskPhones('(020) 7946 0958'), '[numéro …58]');
    assert.equal(maskPhones('+972-50-123-4567'), '[numéro …67]');
    assert.equal(maskPhones('+44 (0)20 7946 0958'), '[numéro …58]');
    assert.equal(maskPhones('tél (050-123-4567).'), 'tél ([numéro …67]).');
    assert.equal(maskPhones('Key (phone)=(+33-6-12-34-56-78) dup'), 'Key (phone)=([numéro …78]) dup');
    assert.equal(maskPhones('le 09-10-2026 à 0612345678'), 'le 09-10-2026 à [numéro …78]');
  });
  await test('limites connues (docs/journaux-et-alertes.md) : IPv4 courte, IPv6, tirets sans « + » ni « 0 » au début', () => {
    for (const s of ['dns 8.8.8.8', 'ip 2001:db8::1', 'tél 972-50-123-4567']) assert.equal(maskPhones(s), s, s);
  });
  await test('identifiants, dates, montants et numéros d’appel intacts', () => {
    for (const s of [
      'evt_1PxYz12345678901', 'sub_12345678901234', '2026-10-09T12:03:00Z', 'appel 9255457', '55ef9801-8e5a-4e37-8a34-cf6d16c5dbe2',
      'solde 3488.74', 'agent 21314', '2026-10-09', 'le 2026-10-09 12:03', '09-10-2026', '09/10/2026 14:00', 'INV-0001-2026',
      '/api/x/0123-4567-89', 'durée 00:12:34', 'at Object.<anonymous> (/app/.next/server/chunks/123.js:45:67)',
      'trace 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    ]) {
      assert.equal(maskPhones(s), s, s);
    }
  });
  await test('scrub : adresse e-mail et numéro masqués, texte trop long tronqué', () => {
    assert.equal(scrub('550 5.1.1 <client@exemple.fr> inconnu, tél +33612345678'), '550 5.1.1 <[adresse]> inconnu, tél [numéro …78]');
    const long = scrub('x'.repeat(5000));
    assert.ok(long.length < 4100 && long.endsWith('… [tronqué]'));
  });

  // --- Mise en forme ---
  await test('formatArgs : arguments séparés par une espace, %s et %d remplacés, objet en JSON, erreur avec sa trace', () => {
    assert.equal(formatArgs(['[mail] email:', 'SMTP 535']), '[mail] email: SMTP 535');
    assert.equal(formatArgs(['[x] %s a %d essais, %%', 'Stripe', '3']), '[x] Stripe a 3 essais, %');
    assert.equal(formatArgs(['[x]', { status: 500 }]), '[x] {"status":500}');
    const e = new Error('Supabase callbacks 401');
    assert.match(formatArgs(['[callback] supabase:', e]), /^\[callback\] supabase: Error: Supabase callbacks 401\n\s+at /);
    assert.equal(formatArgs([]), '');
  });
  await test('logLine : JSON avec gravité, message nettoyé, partie du site et source « site »', () => {
    const line = JSON.parse(logLine('ERROR', ['[autocalls-webhook] supabase:', 'Key (email)=(a@b.fr) 22P02']));
    assert.deepEqual(line, { severity: 'ERROR', message: '[autocalls-webhook] supabase: Key [adresse] 22P02', component: 'autocalls-webhook', source: 'site' });
    const plain = JSON.parse(logLine('INFO', ['▲ Next.js 14.2.35']));
    assert.equal(plain.component, undefined);
    assert.equal(plain.severity, 'INFO');
  });
  await test('logLine : les champs ne remplacent jamais severity, message ni source ; textes des champs nettoyés', () => {
    const line = JSON.parse(logLine('WARNING', ['[x] y'], { severity: 'DEBUG', message: 'autre', source: 'faux', status: 'halted', count: 3, who: 'jo@ex.fr' }));
    assert.equal(line.severity, 'WARNING');
    assert.equal(line.message, '[x] y');
    assert.equal(line.source, 'site');
    assert.equal(line.status, 'halted');
    assert.equal(line.count, 3);
    assert.equal(line.who, '[adresse]');
  });

  // --- Activation ---
  await test('activé seulement sur Cloud Run (K_SERVICE) ou avec LOG_FORMAT=json ; LOG_FORMAT=text le coupe', () => {
    assert.equal(structuredLogsWanted({}), false);
    assert.equal(structuredLogsWanted({ K_SERVICE: 'voiceia' }), true);
    assert.equal(structuredLogsWanted({ K_SERVICE: 'voiceia', LOG_FORMAT: 'text' }), false);
    assert.equal(structuredLogsWanted({ LOG_FORMAT: ' JSON ' }), true);
    assert.equal(setupServerLogging({}), false, 'hors Cloud Run : la console n’est pas touchée');
  });

  // --- Console remplacée ---
  await test('console : error → ERROR et warn → WARNING sur la sortie d’erreur, log et info → INFO sur la sortie standard', () => {
    const { c } = fakeConsole();
    const out: string[] = []; const err: string[] = [];
    assert.equal(installStructuredConsole(c, { stdout: (l) => out.push(l), stderr: (l) => err.push(l) }), true);
    c.error('[stripe] enregistrement:', 'Supabase stripe_events 500');
    c.warn('[whatsapp] repli sur 521');
    c.log('[relances] done');
    c.info('[auth] /api/callback mode=header ok=true');
    assert.equal(err.length, 2); assert.equal(out.length, 2);
    assert.ok(err.every((l) => l.endsWith('\n')) && out.every((l) => l.endsWith('\n')), 'une entrée par ligne');
    const e0 = JSON.parse(err[0]);
    assert.deepEqual(e0, { severity: 'ERROR', message: '[stripe] enregistrement: Supabase stripe_events 500', component: 'stripe', source: 'site' });
    assert.equal(JSON.parse(err[1]).severity, 'WARNING');
    assert.equal(JSON.parse(out[0]).severity, 'INFO');
    assert.equal(JSON.parse(out[1]).component, 'auth');
  });
  await test('console : installation unique, et une sortie en panne n’interrompt jamais l’appelant', () => {
    const { c } = fakeConsole();
    const sink = { stdout: () => { throw new Error('EPIPE'); }, stderr: () => { throw new Error('EPIPE'); } };
    assert.equal(installStructuredConsole(c, sink), true);
    assert.equal(installStructuredConsole(c, sink), false);
    assert.doesNotThrow(() => c.error('[mail] boum'));
  });

  // --- logError / logWarn explicites ---
  await test('logError hors Cloud Run : texte lisible sur console.error, données masquées, champs à part', () => {
    const real = console.error;
    const got: unknown[][] = [];
    console.error = (...args: unknown[]) => { got.push(args); };
    try { logError('relances', 'passage terminé en « not_installed » pour a@b.fr', { status: 'not_installed', dry_run: false }); }
    finally { console.error = real; }
    assert.equal(got.length, 1);
    assert.equal(got[0][0], '[relances] passage terminé en « not_installed » pour [adresse]');
    assert.deepEqual(got[0][1], { status: 'not_installed', dry_run: false });
  });
  await test('logError et logWarn sur Cloud Run : une ligne JSON sur la sortie d’erreur, avec les champs', () => {
    process.env.K_SERVICE = 'voiceia';
    const real = process.stderr.write.bind(process.stderr);
    const lines: string[] = [];
    (process.stderr as unknown as { write: (s: string) => boolean }).write = (s: string) => { lines.push(String(s)); return true; };
    try {
      logError('relances', 'passage terminé en « halted » (taux de rejet)', { status: 'halted', dry_run: false });
      logWarn('stripe', 'langue des factures non posée');
    } finally {
      (process.stderr as unknown as { write: typeof real }).write = real;
      delete process.env.K_SERVICE;
    }
    assert.equal(lines.length, 2);
    const a = JSON.parse(lines[0]);
    assert.equal(a.severity, 'ERROR');
    assert.equal(a.component, 'relances');
    assert.equal(a.status, 'halted');
    assert.equal(a.dry_run, false);
    assert.equal(a.source, 'site');
    assert.equal(JSON.parse(lines[1]).severity, 'WARNING');
  });

  Object.assign(process.env, Object.fromEntries(Object.entries(saved).filter(([, v]) => v !== undefined)));
  realLog(`\n${passed} tests réussis.`);
}

main().catch((e) => { realLog(e); process.exit(1); });
