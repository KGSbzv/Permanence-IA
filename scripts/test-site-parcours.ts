// Tests des petits défauts du site corrigés après l’audit des parcours du 9 oct. 2026 (action 32) :
//   npx tsx scripts/test-site-parcours.ts
// Aucun réseau, aucune base, aucun envoi : adresses et requêtes simulées. Vérifie :
// - provenance de la visite (src/lib/attribution.ts) : UTM et site d’origine de la page d’arrivée gardés en mémoire
//   jusqu’au formulaire et jusqu’au lien d’inscription ; ceux de la page affichée priment ; page du formulaire inchangée ;
// - pop-up d’essai (src/lib/trialNudgePages.ts) : absent de l’aide, des guides, des bases, de la désinscription, des
//   pages légales et d’erreur, présent ailleurs ;
// - action des formulaires (src/pages/api/form-fallback.ts) : corps jamais lu, retour (303) sur la page du formulaire,
//   jamais vers un autre site, avec « envoi=interrompu » pour que la page dise que rien n’est parti (Layout), paramètre
//   relu puis retiré de l’adresse sans toucher au reste de la requête ;
// - x-default (src/i18n/locales.ts, plan du site) : version anglaise, comme la redirection des langues non proposées.
import assert from 'node:assert/strict';
import type { NextApiRequest, NextApiResponse } from 'next';
import { captureLanding, externalReferrer, resetLanding, utmOf, visitContext, visitSearch, visitUtm } from '@/lib/attribution';
import { nudgeSkipped } from '@/lib/trialNudgePages';
import { FORM_INTERRUPTED, readInterruptedNotice, registerUrl, withInterruptedNotice } from '@/data/site';
import { CONTENT } from '@/i18n/content';
import { DEFAULT_LOCALE, X_DEFAULT_LOCALE, detectLocale } from '@/i18n/locales';

let passed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.log(`ÉCHEC  ${name}`); throw e; }
}

const HOST = 'www.permanenceia.com';
const at = (pathname: string, search = '') => ({ pathname, search, host: HOST });

async function main() {
  // --- Provenance de la visite ---
  await test('utmOf : 5 clés UTM, valeurs vides ignorées, 100 caractères au plus', () => {
    assert.deepEqual(utmOf('?utm_source=meta&utm_medium=&utm_campaign=fr-essai&utm_term=x&utm_content=c&gclid=1'),
      { utm_source: 'meta', utm_campaign: 'fr-essai', utm_term: 'x', utm_content: 'c' });
    assert.equal(utmOf(`?utm_source=${'a'.repeat(150)}`).utm_source?.length, 100);
    assert.deepEqual(utmOf(''), {});
  });
  await test('externalReferrer : autre site gardé sans requête ; le site lui-même, illisible ou non http : rien', () => {
    assert.equal(externalReferrer('https://www.google.com/search?q=standard', HOST), 'https://www.google.com/search');
    assert.equal(externalReferrer('https://www.permanenceia.com/tarifs', HOST), undefined);
    assert.equal(externalReferrer('', HOST), undefined);
    assert.equal(externalReferrer('android-app://com.google.android.gm/', HOST), undefined);
  });
  await test('sans navigateur ni page d’arrivée : aucune provenance inventée', () => {
    resetLanding();
    assert.equal(captureLanding(), null);
    assert.deepEqual(visitUtm(''), {});
    assert.equal(visitSearch(''), '');
  });
  await test('arrivée par une publicité sur une page secteur, puis /essai-gratuit sans UTM : la source suit', () => {
    resetLanding();
    const ad = '?utm_source=google&utm_medium=cpc&utm_campaign=fr-immobilier';
    const first = captureLanding(at('/secteurs/immobilier', ad), 'https://www.google.com/');
    assert.deepEqual(first, { page: '/secteurs/immobilier', utm: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'fr-immobilier' }, referrer: 'https://www.google.com/' });
    // Changement de page sans rechargement : le référent du document reste celui de l’arrivée.
    const ctx = visitContext(at('/essai-gratuit'), 'https://www.google.com/');
    assert.deepEqual(ctx, {
      originPage: '/essai-gratuit', referrer: 'https://www.google.com/',
      utm: { source: 'google', medium: 'cpc', campaign: 'fr-immobilier' },
    });
    // Lien de création du compte sur l’espace client : langue et UTM de la visite.
    const reg = new URL(registerUrl('fr', visitSearch('')));
    assert.equal(reg.searchParams.get('lang'), 'fr');
    assert.equal(reg.searchParams.get('utm_source'), 'google');
    assert.equal(reg.searchParams.get('utm_campaign'), 'fr-immobilier');
  });
  await test('page d’arrivée mémorisée une seule fois ; UTM de la page affichée prioritaires', () => {
    const again = captureLanding(at('/tarifs', '?utm_source=autre'), '');
    assert.equal(again?.page, '/secteurs/immobilier');
    const ctx = visitContext(at('/contact', '?utm_source=relance&utm_medium=email&utm_campaign=P2'), '');
    assert.deepEqual(ctx.utm, { source: 'relance', medium: 'email', campaign: 'P2' });
    assert.equal(ctx.originPage, '/contact', 'la page du formulaire (preuve de l’accord) ne change pas');
    assert.equal(ctx.referrer, 'https://www.google.com/', 'site d’origine repris de l’arrivée');
    assert.match(visitSearch('?utm_source=relance&utm_medium=email'), /^utm_source=relance&utm_medium=email$/);
  });
  await test('rechargement complet (référent = le site lui-même) : le site d’origine de l’arrivée reste', () => {
    const ctx = visitContext(at('/demo'), 'https://www.permanenceia.com/tarifs');
    assert.equal(ctx.referrer, 'https://www.google.com/');
  });
  await test('visite sans UTM : aucun champ utm envoyé (comme avant)', () => {
    resetLanding();
    captureLanding(at('/'), '');
    const ctx = visitContext(at('/essai-gratuit'), '');
    assert.deepEqual(ctx, { originPage: '/essai-gratuit', referrer: undefined });
    assert.equal('utm' in ctx, false);
    resetLanding();
  });

  // --- Pop-up d’essai ---
  await test('pop-up absent : aide, guides, bases, désinscription, pages légales et d’erreur, pages d’action', () => {
    for (const p of ['/aide', '/aide/guides/[slug]', '/kb/[doc]', '/kb/modules/[lang]', '/preferences-email', '/404', '/500', '/_error',
      '/essai-gratuit', '/contact', '/demo', '/mon-compte', '/cgu', '/confidentialite', '/mentions-legales', '/cookies', '/accessibilite', '/aide/']) {
      assert.equal(nudgeSkipped(p), true, p);
    }
  });
  await test('pop-up présent : accueil, tarifs, secteurs, offres, FAQ (pas de faux préfixe)', () => {
    for (const p of ['/', '/tarifs', '/secteurs/[slug]', '/offres/[slug]', '/faq', '/fonctionnalites', '/aidez-moi', '/demo-live', '/kbis']) {
      assert.equal(nudgeSkipped(p), false, p);
    }
  });

  // --- Action des formulaires ---
  const { backTo, config, default: handler } = await import('@/pages/api/form-fallback');
  await test('form-fallback : corps jamais analysé (bodyParser coupé)', () => {
    assert.deepEqual(config, { api: { bodyParser: false } });
  });
  await test('backTo : page du formulaire (chemin et requête) seulement si elle vient du site', () => {
    assert.equal(backTo('https://www.permanenceia.com/it/essai-gratuit?utm_source=meta', HOST), '/it/essai-gratuit?utm_source=meta');
    assert.equal(backTo('https://permanenceia.com/contact', undefined), '/contact');
    assert.equal(backTo('http://localhost:3000/demo', 'localhost:3000'), '/demo');
    assert.equal(backTo('https://evil.example/essai-gratuit', 'evil.example.org'), '/');
    assert.equal(backTo('https://evil.example/', HOST), '/');
    assert.equal(backTo(undefined, HOST), '/');
    assert.equal(backTo('pas une adresse', HOST), '/');
    assert.equal(backTo('javascript:alert(1)', HOST), '/');
  });
  await test('backTo : « //autre-site » ou « /\\autre-site » ramené à un chemin du site', () => {
    assert.equal(backTo('https://www.permanenceia.com//evil.example/x', HOST), '/evil.example/x');
    assert.equal(backTo('https://www.permanenceia.com/\\evil.example', HOST), '/evil.example');
  });

  function fakeRes() {
    const headers: Record<string, unknown> = {};
    const r = { statusCode: 0, ended: false, headers };
    const res = {
      setHeader(k: string, v: unknown) { headers[k.toLowerCase()] = v; return res; },
      status(code: number) { r.statusCode = code; return res; },
      end() { r.ended = true; return res; },
    };
    return { res: res as unknown as NextApiResponse, r };
  }
  /** Requête sans corps lisible : la route ne doit jamais le lire. */
  const req = (method: string, headers: Record<string, string>) => new Proxy({ method, headers }, {
    get(t, k) {
      if (k === 'method' || k === 'headers') return t[k as 'method' | 'headers'];
      if (k === 'body' || k === 'on' || k === 'read' || k === 'pipe') throw new Error(`corps lu (${String(k)})`);
      return undefined;
    },
  }) as unknown as NextApiRequest;

  await test('form-fallback : POST → 303 vers la page du formulaire avec « envoi=interrompu », sans cache, corps non lu', () => {
    const { res, r } = fakeRes();
    handler(req('POST', { referer: 'https://www.permanenceia.com/en-gb/contact?utm_source=li', 'x-forwarded-host': HOST }), res);
    assert.equal(r.statusCode, 303);
    assert.equal(r.headers.location, '/en-gb/contact?utm_source=li&envoi=interrompu');
    assert.equal(r.headers['cache-control'], 'no-store');
    assert.equal(r.ended, true);
    const home = fakeRes();
    handler(req('POST', {}), home.res);
    assert.equal(home.r.headers.location, '/?envoi=interrompu', 'sans référent : accueil, message quand même');
  });
  await test('withInterruptedNotice : « ? » ou « & » selon la requête, jamais deux fois', () => {
    assert.deepEqual(FORM_INTERRUPTED, { param: 'envoi', value: 'interrompu' });
    assert.equal(withInterruptedNotice('/essai-gratuit'), '/essai-gratuit?envoi=interrompu');
    assert.equal(withInterruptedNotice('/it/essai-gratuit?utm_source=meta'), '/it/essai-gratuit?utm_source=meta&envoi=interrompu');
    assert.equal(withInterruptedNotice('/preferences-email?l=nl&action=unsubscribe'), '/preferences-email?l=nl&action=unsubscribe&envoi=interrompu');
    assert.equal(withInterruptedNotice('/demo?'), '/demo?envoi=interrompu');
    assert.equal(withInterruptedNotice('/demo?envoi=interrompu'), '/demo?envoi=interrompu');
    assert.equal(withInterruptedNotice('/demo?a=1&envoi=interrompu'), '/demo?a=1&envoi=interrompu');
  });
  await test('readInterruptedNotice : message à afficher, et la requête sans le paramètre (le reste intact)', () => {
    assert.deepEqual(readInterruptedNotice('?envoi=interrompu'), { interrupted: true, search: '' });
    assert.deepEqual(readInterruptedNotice('?utm_source=li&envoi=interrompu'), { interrupted: true, search: '?utm_source=li' });
    assert.deepEqual(readInterruptedNotice('?envoi=interrompu&utm_source=li%20x'), { interrupted: true, search: '?utm_source=li%20x' });
    assert.deepEqual(readInterruptedNotice('?l=nl&envoi=interrompu&action=unsubscribe'), { interrupted: true, search: '?l=nl&action=unsubscribe' });
    assert.deepEqual(readInterruptedNotice('?envoi=interrompue'), { interrupted: false, search: '?envoi=interrompue' });
    assert.deepEqual(readInterruptedNotice(''), { interrupted: false, search: '' });
  });
  await test('message « envoi interrompu » présent et traduit dans chaque langue', () => {
    for (const [lang, content] of Object.entries(CONTENT)) {
      const text = content.ui.components.layout.formInterrupted;
      assert.ok(text.length > 30, lang);
      if (lang !== 'fr') assert.notEqual(text, CONTENT.fr.ui.components.layout.formInterrupted, lang);
    }
  });
  await test('form-fallback : autre méthode → 405 (Allow: POST)', () => {
    const { res, r } = fakeRes();
    handler(req('GET', {}), res);
    assert.equal(r.statusCode, 405);
    assert.equal(r.headers.allow, 'POST');
  });

  // --- x-default ---
  await test('langue non proposée ou absente : anglais (Royaume-Uni), x-default identique', () => {
    assert.equal(X_DEFAULT_LOCALE, 'en-gb');
    assert.equal(detectLocale('de-DE,de;q=0.9'), X_DEFAULT_LOCALE);
    assert.equal(detectLocale('es'), X_DEFAULT_LOCALE);
    assert.equal(detectLocale(null), X_DEFAULT_LOCALE);
    assert.equal(detectLocale('fr-FR'), DEFAULT_LOCALE);
  });
  await test('plan du site : chaque URL a un x-default vers la version anglaise de la même page', async () => {
    const { getServerSideProps } = await import('@/pages/sitemap.xml');
    let xml = '';
    const res = { setHeader() { return res; }, write(s: string) { xml += s; return true; }, end() { return res; } };
    await getServerSideProps({ res } as never);
    const urls = xml.match(/<url>/g)?.length ?? 0;
    const xDefaults = Array.from(xml.matchAll(/hreflang="x-default" href="([^"]+)"/g), (m) => m[1]);
    assert.ok(urls > 100, `${urls} URL`);
    assert.equal(xDefaults.length, urls);
    assert.ok(xDefaults.every((h) => h === 'https://www.permanenceia.com/en-gb' || h.startsWith('https://www.permanenceia.com/en-gb/')), 'x-default anglais');
    assert.ok(xDefaults.includes('https://www.permanenceia.com/en-gb'), 'accueil');
    assert.ok(xDefaults.includes('https://www.permanenceia.com/en-gb/tarifs'), 'tarifs');
  });

  console.log(`\n${passed} tests réussis.`);
}

main().catch((e) => { console.log(e); process.exit(1); });
