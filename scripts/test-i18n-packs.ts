// Tests du chargement des langues, un pack par langue (audit du 9 oct. 2026, action 22 : site plus léger) :
//   npx tsx scripts/test-i18n-packs.ts
// Aucun réseau, aucune base, aucun envoi. Vérifie :
// - navigateur simulé : aucune langue chargée d’avance ; charger une langue n’en charge aucune autre (en-au ne charge pas
//   en-gb) ; getI18n refuse une langue absente au lieu de rendre une page vide ; un rendu qui attend son pack reprend
//   une fois le pack arrivé, dans la bonne langue ; un pack introuvable (fichier retiré par un déploiement) est
//   redemandé toutes les RETRY_MS au plus, la page se recharge une seule fois au 3e échec (jamais hors ligne, ni sans
//   stockage), et de nouveau après un retour à la normale ;
// - chaque pack (src/i18n/packs) porte exactement le contenu rendu par le serveur, sinon le HTML et le navigateur
//   différeraient à l’hydratation : mêmes textes, fonctions qui donnent le même résultat, typographie française appliquée
//   des deux côtés ; en-au a sa variante australienne, en-gb l’anglais du Royaume-Uni ;
// - rendu serveur de I18nProvider (fr, en-gb, en-au, he) : texte de la bonne langue, rien d’ajouté au HTML par le pack ;
// - icônes des familles de modules (src/lib/moduleFamilies.ts) : même famille qu’en français, dans toutes les langues ;
// - catégories des guides (src/i18n/content/guideCategories.ts) : celles du contenu de chaque langue.
// Facultatif, après un `next build` : NEXT_BUILD_DIR=<chemin du dossier .next> vérifie aussi le poids de _app
// (moins de 150 Ko compressés), qu’aucun pack n’y entre et qu’aucun texte de langue n’y figure.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Writable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import React from 'react';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { I18nProvider, RELOAD_KEY, RETRY_MS, contentFor, getI18n, loadLocaleContent, useI18n } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/locales';
import { CONTENT_KEYS, contentKey, loadedContent } from '@/i18n/packs/registry';
import { CONTENT } from '@/i18n/content';
import { GUIDE_CATEGORIES } from '@/i18n/content/guideCategories';
import { FAMILY_MODULES, moduleFamily } from '@/lib/moduleFamilies';

let passed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.log(`ÉCHEC  ${name}`); throw e; }
}

const g = globalThis as { window?: unknown };
/** Simule le navigateur : `typeof window` vaut alors « object », comme dans le code compilé pour le navigateur. */
const asBrowser = () => { g.window = globalThis; };
const asServer = () => { delete g.window; };

/** Affiche la langue et un libellé du contenu : de quoi reconnaître la langue rendue. */
function Probe() {
  const { locale, c } = useI18n();
  return React.createElement('p', null, `${locale}:${c.site.languageLabel}`);
}
const tree = (locale: Locale) => React.createElement(I18nProvider, { locale, children: React.createElement(Probe) });

/** Rendu en flux : contrairement à renderToString, il attend un composant suspendu (ici, un pack en chargement). */
function renderStream(el: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = '';
    const out = new Writable({ write(chunk, _enc, cb) { html += String(chunk); cb(); } });
    out.on('finish', () => resolve(html));
    const stream = renderToPipeableStream(el, { onAllReady: () => stream.pipe(out), onShellError: reject, onError: reject });
  });
}

/**
 * Navigateur simulé pour un pack introuvable : minuteries immédiates (délais notés), rechargements comptés, stockage de
 * l’onglet en mémoire (`blocked` : accès refusé, comme en navigation privée stricte), réseau en ligne ou non.
 */
async function withBrowserEnv(opts: { blocked?: boolean; online?: boolean }, fn: (env: { delays: number[]; reloads: number[]; store: Map<string, string>; tries: () => number }) => Promise<void>) {
  const env = { delays: [] as number[], reloads: [] as number[], store: new Map<string, string>(), tries: () => 0 };
  const glob = globalThis as Record<string, unknown>;
  const saved = { setTimeout: glob.setTimeout, location: glob.location, sessionStorage: glob.sessionStorage, navigator: Object.getOwnPropertyDescriptor(globalThis, 'navigator') };
  const realImmediate = setImmediate;
  const deny = () => { throw new Error('SecurityError'); };
  let calls = 0;
  env.tries = () => calls;
  glob.setTimeout = (fn: () => void, ms: number) => { env.delays.push(ms); return realImmediate(fn); };
  glob.location = { reload: () => { env.reloads.push(calls); } };
  glob.sessionStorage = opts.blocked
    ? { getItem: deny, setItem: deny, removeItem: deny }
    : { getItem: (k: string) => env.store.get(k) ?? null, setItem: (k: string, v: string) => { env.store.set(k, v); }, removeItem: (k: string) => { env.store.delete(k); } };
  Object.defineProperty(globalThis, 'navigator', { value: { onLine: opts.online ?? true }, configurable: true, writable: true });
  failingLoad = () => { calls++; return Promise.reject(new Error('ChunkLoadError: Loading chunk failed')); };
  try { await fn(env); } finally {
    glob.setTimeout = saved.setTimeout;
    if (saved.location === undefined) delete glob.location; else glob.location = saved.location;
    if (saved.sessionStorage === undefined) delete glob.sessionStorage; else glob.sessionStorage = saved.sessionStorage;
    if (saved.navigator) Object.defineProperty(globalThis, 'navigator', saved.navigator); else delete glob.navigator;
  }
}
/** Téléchargement d’un pack toujours en échec (remplacé par withBrowserEnv pour compter les essais). */
let failingLoad: () => Promise<unknown> = () => Promise.reject(new Error('ChunkLoadError'));

/** Image comparable d’un contenu : textes tels quels, fonctions remplacées par leurs résultats sur quelques arguments. */
const ARGS: unknown[][] = [[], ['Alex'], [3], ['Alex', 'Marque'], [3, 'Marque'], [{ name: 'Alex' }]];
function snapshot(value: unknown, calls = 0): unknown {
  if (typeof value === 'function') {
    if (calls > 2) return 'fonction';
    return ARGS.map((args) => {
      try { return snapshot((value as (...a: unknown[]) => unknown)(...args), calls + 1); } catch { return 'erreur'; }
    });
  }
  if (Array.isArray(value)) return value.map((v) => snapshot(v, calls));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, snapshot(v, calls)]));
  return value;
}

async function main() {
  // --- Navigateur simulé (en premier : le registre des packs doit être vide) ---
  asBrowser();

  await test('navigateur : aucune langue chargée d’avance, getI18n refuse une langue absente', () => {
    assert.deepEqual(CONTENT_KEYS.filter((k) => loadedContent(k)), []);
    assert.equal(contentFor('it'), undefined);
    assert.throws(() => getI18n('it'), /pas encore chargé/);
  });

  await test('navigateur : charger l’italien ne charge que l’italien, deux fois sans effet', async () => {
    await loadLocaleContent('it');
    assert.ok(loadedContent('it'));
    assert.deepEqual(CONTENT_KEYS.filter((k) => loadedContent(k)), ['it']);
    await loadLocaleContent('it');
    assert.equal(getI18n('it').c.site.languageLabel, 'Lingua');
  });

  await test('navigateur : en-au charge sa variante, sans le pack en-gb', async () => {
    await loadLocaleContent('en-au');
    assert.ok(loadedContent('en-au'));
    assert.equal(loadedContent('en'), undefined);
    assert.equal(contentFor('en-gb'), undefined);
  });

  await test('navigateur : un rendu qui attend son pack reprend une fois chargé, dans la bonne langue', async () => {
    assert.equal(loadedContent('nl'), undefined);
    const html = await renderStream(tree('nl'));
    assert.equal(html, '<p>nl:Taal</p>');
    assert.ok(loadedContent('nl'));
  });

  await test('navigateur : pack introuvable, essais espacés de RETRY_MS, un seul rechargement (au 3e échec)', async () => {
    await withBrowserEnv({}, async ({ delays, reloads, store, tries }) => {
      // Deux demandes en même temps : un seul téléchargement.
      await Promise.all([loadLocaleContent('pl', failingLoad), loadLocaleContent('pl', failingLoad)]);
      assert.equal(tries(), 1);
      for (let i = 0; i < 7; i++) await loadLocaleContent('pl', failingLoad);
      assert.equal(tries(), 8);
      assert.equal(delays.length, 8);
      assert.ok(delays.every((ms) => ms >= RETRY_MS), `délais : ${delays.join(', ')}`);
      assert.deepEqual(reloads, [3], 'un seul rechargement, au 3e échec');
      assert.equal(store.get(RELOAD_KEY), '1');
      assert.equal(loadedContent('pl'), undefined);
      // Retour à la normale (pack arrivé) : mémoire effacée, un prochain incident pourra recharger la page une fois.
      await loadLocaleContent('pl');
      assert.ok(loadedContent('pl'));
      assert.equal(store.has(RELOAD_KEY), false);
    });
  });

  await test('navigateur : page déjà rechargée, hors ligne ou stockage bloqué → aucun rechargement, essais espacés', async () => {
    // Page déjà rechargée dans cet onglet (le nouveau HTML n’a pas suffi) : pas de boucle.
    await withBrowserEnv({}, async ({ delays, reloads, store }) => {
      store.set(RELOAD_KEY, '1');
      for (let i = 0; i < 5; i++) await loadLocaleContent('he', failingLoad);
      assert.deepEqual(reloads, []);
      assert.ok(delays.length === 5 && delays.every((ms) => ms >= RETRY_MS));
    });
    // Hors ligne : le navigateur remplacerait la page par son écran d’erreur.
    await withBrowserEnv({ online: false }, async ({ delays, reloads, store }) => {
      for (let i = 0; i < 5; i++) await loadLocaleContent('he', failingLoad);
      assert.deepEqual(reloads, []);
      assert.equal(store.size, 0);
      assert.ok(delays.length === 5 && delays.every((ms) => ms >= RETRY_MS));
    });
    // Stockage bloqué : sans mémoire, un rechargement pourrait se répéter sans fin.
    await withBrowserEnv({ blocked: true }, async ({ delays, reloads }) => {
      for (let i = 0; i < 5; i++) await loadLocaleContent('he', failingLoad);
      assert.deepEqual(reloads, []);
      assert.ok(delays.length === 5 && delays.every((ms) => ms >= RETRY_MS));
    });
    assert.equal(loadedContent('he'), undefined);
  });

  asServer();

  // --- Serveur ---
  await test('serveur : getI18n donne toutes les langues sans chargement, clés de contenu attendues', () => {
    const keys = Object.fromEntries(LOCALES.map((l) => [l, contentKey(l)]));
    assert.deepEqual(keys, { fr: 'fr', 'en-gb': 'en', 'en-au': 'en-au', it: 'it', pl: 'pl', nl: 'nl', he: 'he' });
    for (const l of LOCALES) assert.equal(getI18n(l).locale, l);
    assert.equal(getI18n('he').c.site.languageLabel, 'שפה');
    assert.equal(getI18n('inconnue').locale, 'fr');
  });

  await test('chaque pack porte exactement le contenu rendu par le serveur (hydratation sans écart)', async () => {
    for (const l of LOCALES) {
      await loadLocaleContent(l);
      const pack = loadedContent(contentKey(l));
      assert.ok(pack, `pack ${l} chargé`);
      assert.deepEqual(snapshot(pack), snapshot(getI18n(l).c), `contenu ${l}`);
    }
  });

  await test('typographie française appliquée au pack fr comme au serveur ; autres langues inchangées', () => {
    const json = (v: unknown) => JSON.stringify(snapshot(v));
    const fr = json(loadedContent('fr'));
    assert.ok(fr.includes(' ?'), 'espace fine avant « ? »');
    assert.ok(!/[a-zé] \?/.test(fr), 'aucune espace ordinaire avant « ? »');
    assert.equal(json(loadedContent('en')), json(CONTENT.en));
    assert.equal(json(loadedContent('he')), json(CONTENT.he));
  });

  await test('en-au : variante australienne ; en-gb : anglais du Royaume-Uni', () => {
    const sector = (l: Locale) => JSON.stringify(getI18n(l).c.sectors.find((s) => s.slug === 'immobilier'));
    assert.ok(sector('en-gb').includes('£320,000') && !sector('en-gb').includes('A$650,000'));
    assert.ok(sector('en-au').includes('A$650,000') && !sector('en-au').includes('£320,000'));
    assert.equal(loadedContent('en'), CONTENT.en);
    assert.notEqual(loadedContent('en-au'), CONTENT.en);
  });

  await test('rendu serveur de I18nProvider : bonne langue, rien d’ajouté au HTML par le pack', () => {
    assert.equal(renderToString(tree('fr')), '<p>fr:Langue</p>');
    assert.equal(renderToString(tree('en-gb')), '<p>en-gb:Language</p>');
    assert.equal(renderToString(tree('en-au')), '<p>en-au:Language</p>');
    assert.equal(renderToString(tree('he')), '<p>he:שפה</p>');
  });

  await test('useI18n hors de I18nProvider : erreur claire', () => {
    assert.throws(() => renderToString(React.createElement(Probe)), /hors de I18nProvider/);
  });

  // --- Familles des modules (icônes) ---
  await test('familles des modules : même famille qu’en français dans toutes les langues', () => {
    const FR_FAMILY: Record<string, string> = {
      'Téléphonie': 'telephonie', Automatisation: 'automatisation', 'CRM et données': 'crm', Messages: 'messages', Agenda: 'agenda', Pilotage: 'pilotage',
    };
    for (const m of CONTENT.fr.modules) assert.equal(moduleFamily(CONTENT.fr.modules, m.slug), FR_FAMILY[m.family], `fr ${m.slug}`);
    for (const [lang, c] of Object.entries(CONTENT)) {
      for (const slug of Object.values(FAMILY_MODULES)) assert.ok(c.modules.some((m) => m.slug === slug), `${lang} : module représentatif ${slug}`);
      for (const m of CONTENT.fr.modules) assert.equal(moduleFamily(c.modules, m.slug), FR_FAMILY[m.family], `${lang} ${m.slug}`);
    }
    assert.equal(moduleFamily(CONTENT.fr.modules, 'inconnu'), undefined);
  });

  // --- Catégories des guides ---
  await test('catégories des guides : celles du contenu de chaque langue, chaque guide classé', () => {
    for (const [lang, c] of Object.entries(CONTENT)) {
      assert.deepEqual(Object.keys(c.guides.ui.categories).sort(), [...GUIDE_CATEGORIES].sort(), lang);
      for (const guide of c.guides.list) assert.ok(GUIDE_CATEGORIES.includes(guide.category), `${lang} ${guide.slug}`);
    }
  });

  // --- Construction (facultatif) ---
  const dir = process.env.NEXT_BUILD_DIR;
  if (dir) {
    await test(`construction (${dir}) : _app < 150 Ko compressés, sans pack ni texte de langue`, () => {
      const build = JSON.parse(readFileSync(join(dir, 'build-manifest.json'), 'utf8')) as { pages: Record<string, string[]> };
      const loadable = JSON.parse(readFileSync(join(dir, 'react-loadable-manifest.json'), 'utf8')) as Record<string, { files: string[] }>;
      const appFiles = build.pages['/_app'].filter((f) => f.endsWith('.js'));
      const app = appFiles.map((f) => readFileSync(join(dir, f)));
      const gz = app.reduce((n, b) => n + gzipSync(b, { level: 9 }).length, 0);
      assert.ok(gz < 150 * 1024, `_app : ${Math.round(gz / 1024)} Ko compressés`);
      for (const key of CONTENT_KEYS) {
        const entry = Object.entries(loadable).find(([k]) => k.endsWith(`./packs/${key}`));
        assert.ok(entry, `pack ${key} séparé`);
        for (const f of entry[1].files) assert.ok(!appFiles.includes(f), `pack ${key} hors de _app`);
      }
      const text = app.map(String).join('\n');
      for (const marker of [CONTENT.en.faq.general[0].q, CONTENT.en.faq.general[2].q]) assert.ok(!text.includes(marker), `texte absent de _app : ${marker}`);
    });
  } else {
    console.log('—   construction : NEXT_BUILD_DIR non défini, vérification du poids de _app non faite');
  }

  console.log(`\n${passed} tests réussis`);
}

main().catch((e) => { console.error(e); process.exit(1); });
