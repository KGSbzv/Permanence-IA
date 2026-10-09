// Contrôle du script Google Analytics de l’espace client (docs/autocalls-scripts/ga-consentement-espace-client.html ;
// audit du 9 oct. 2026, action 21), exécuté dans un faux navigateur (node:vm) : aucun réseau, rien n’est envoyé.
//   npx tsx scripts/test-ga-espace-client.ts
// Vérifie : sans accord (aucun cookie, ou pia_consent=denied) rien n’est chargé et ga-disable est posé ; avec l’accord,
// gtag.js est chargé une seule fois, signaux publicitaires refusés, même identifiant et même « linker » que le site ;
// sign_up une seule fois par onglet, jamais sur /register ou /login ; rien hors de permanenceia.com ; adresse des pages
// et page d’origine envoyées sans paramètres (recherche et filtres des listes) ; aucune note interne dans le fichier,
// servi tel quel dans le code source des pages de l’espace client.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { GA_ID } from '@/lib/analytics';

const html = readFileSync(join(__dirname, '..', 'docs', 'autocalls-scripts', 'ga-consentement-espace-client.html'), 'utf8');
const scripts = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g), (m) => m[1]);
const code = scripts[0];

interface Page {
  hostname?: string; pathname?: string; search?: string; cookie?: string; referrer?: string;
  session?: Map<string, string>;
}

/** Exécute le script dans une page simulée ; renvoie la fenêtre, les scripts ajoutés et la file dataLayer. */
function run(page: Page, win: Record<string, unknown> = {}) {
  const added: { src: string; async: boolean }[] = [];
  const session = page.session ?? new Map<string, string>();
  const window = win;
  const document = {
    cookie: page.cookie ?? '',
    referrer: page.referrer ?? '',
    createElement: () => ({ src: '', async: false }),
    head: { appendChild: (el: { src: string; async: boolean }) => { added.push(el); return el; } },
  };
  const sandbox = {
    window, document,
    location: {
      hostname: page.hostname ?? 'app.permanenceia.com', origin: `https://${page.hostname ?? 'app.permanenceia.com'}`,
      pathname: page.pathname ?? '/dashboard', search: page.search ?? '',
    },
    sessionStorage: { getItem: (k: string) => session.get(k) ?? null, setItem: (k: string, v: string) => { session.set(k, v); } },
  };
  vm.runInNewContext(code, sandbox);
  // Objets créés dans le faux navigateur : recopiés (JSON) pour les comparer à ceux du test.
  const dl = Array.from((window.dataLayer as ArrayLike<unknown>[] | undefined) ?? [], (a) => JSON.parse(JSON.stringify(Array.from(a))) as unknown[]);
  return { window, added, dl, session };
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.log(`ÉCHEC  ${name}`); throw e; }
}

test('le fichier contient un seul script, avec le même identifiant que le site', () => {
  assert.equal(scripts.length, 1);
  assert.ok(code.includes(`'${GA_ID}'`));
  assert.ok(!/fbq|facebook/i.test(code), 'pas de pixel Meta dans ce script');
});

test('fichier servi tel quel dans les pages : une ligne de commentaire neutre, puis le script', () => {
  const before = html.slice(0, html.indexOf('<script>')).trim();
  assert.equal(before.split('\n').length, 1, 'une seule ligne avant le script');
  assert.match(before, /^<!--[^\n]*-->$/);
  for (const word of [/autocalls/i, /avocat/i, /Avant,/, /administration/i]) assert.ok(!word.test(html), `pas de « ${word.source} »`);
});

test('aucun cookie (arrivée directe sur l’espace client) : rien de chargé, ga-disable posé', () => {
  const r = run({ pathname: '/register' });
  assert.equal(r.added.length, 0);
  assert.equal(r.dl.length, 0);
  assert.equal(r.window[`ga-disable-${GA_ID}`], true);
});

test('refus sur le site (pia_consent=denied) : rien de chargé, ga-disable posé', () => {
  const r = run({ cookie: 'pia_lang=fr; pia_consent=denied' });
  assert.equal(r.added.length, 0);
  assert.equal(r.window.gtag, undefined);
  assert.equal(r.window[`ga-disable-${GA_ID}`], true);
});

test('accord (pia_consent=granted) : gtag.js chargé, publicité refusée, mesure accordée, même linker que le site', () => {
  const r = run({ cookie: 'pia_consent=granted; pia_lang=he' });
  assert.equal(r.added.length, 1);
  assert.equal(r.added[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  assert.equal(r.added[0].async, true);
  const consent = r.dl.find((a) => a[0] === 'consent');
  assert.deepEqual(consent, ['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' }]);
  const config = r.dl.find((a) => a[0] === 'config');
  assert.deepEqual(config, ['config', GA_ID, {
    page_location: 'https://app.permanenceia.com/dashboard', page_referrer: '',
    linker: { domains: ['permanenceia.com', 'app.permanenceia.com'] },
  }]);
  assert.ok(r.dl.findIndex((a) => a[0] === 'consent') < r.dl.findIndex((a) => a[0] === 'config'), 'consentement avant la configuration');
  assert.equal(r.window[`ga-disable-${GA_ID}`], false);
  assert.ok(!r.dl.some((a) => a[0] === 'event'), 'pas de sign_up sans venir de /register');
});

test('bloc collé dans deux champs : chargé une seule fois par page', () => {
  const win: Record<string, unknown> = {};
  const a = run({ cookie: 'pia_consent=granted' }, win);
  const b = run({ cookie: 'pia_consent=granted' }, win);
  assert.equal(a.added.length + b.added.length, 1);
  assert.equal(b.dl.filter((x) => x[0] === 'config').length, 1);
});

test('sign_up : première page après /register, une seule fois par onglet ; jamais sur /register ou /login', () => {
  const session = new Map<string, string>();
  const first = run({ cookie: 'pia_consent=granted', referrer: 'https://app.permanenceia.com/register?lang=fr', pathname: '/plans', session });
  assert.deepEqual(first.dl.filter((a) => a[0] === 'event'), [['event', 'sign_up', { method: 'app' }]]);
  const reload = run({ cookie: 'pia_consent=granted', referrer: 'https://app.permanenceia.com/register?lang=fr', pathname: '/plans', session });
  assert.equal(reload.dl.filter((a) => a[0] === 'event').length, 0, 'rechargement : pas de second sign_up');
  const onRegister = run({ cookie: 'pia_consent=granted', referrer: 'https://app.permanenceia.com/register', pathname: '/login' });
  assert.equal(onRegister.dl.filter((a) => a[0] === 'event').length, 0);
});

test('recherche dans une liste : ni paramètres ni ancre dans page_location et page_referrer', () => {
  const r = run({
    cookie: 'pia_consent=granted', pathname: '/leads', search: '?tableSearch=jean%40exemple.fr&tableFilters[phone]=0612345678',
    referrer: 'https://app.permanenceia.com/calls?tableSearch=%2B33612345678#liste',
  });
  const opts = r.dl.find((a) => a[0] === 'config')?.[2] as { page_location: string; page_referrer: string };
  assert.equal(opts.page_location, 'https://app.permanenceia.com/leads');
  assert.equal(opts.page_referrer, 'https://app.permanenceia.com/calls');
  const sent = JSON.stringify(r.dl);
  for (const bit of ['?', '%40', 'exemple', '0612345678', '%2B33', '#']) assert.ok(!sent.includes(bit), `rien de « ${bit} » envoyé`);
});

test('sign_up sans accord : jamais envoyé', () => {
  const r = run({ referrer: 'https://app.permanenceia.com/register', pathname: '/plans' });
  assert.equal(r.dl.length, 0);
});

test('hors de permanenceia.com (aperçu de l’admin, app.autocalls.ai) : rien', () => {
  const r = run({ hostname: 'app.autocalls.ai', cookie: 'pia_consent=granted' });
  assert.equal(r.added.length, 0);
  assert.equal(r.window[`ga-disable-${GA_ID}`], undefined);
});

console.log(`\n${passed} tests réussis.`);
