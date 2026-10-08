// Tests du pied de page des emails et des préférences (aucun envoi réel, aucune base réelle) :
//   npx tsx scripts/test-email.ts [dossier de sortie]
// Écrit le pied de page des 7 langues en fichiers HTML (et texte) dans le dossier de sortie, puis vérifie les
// jetons signés, l’enregistrement des choix et le saut des emails non essentiels après désinscription.
import assert from 'node:assert/strict';
import { randomBytes } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// Secret de test aléatoire (jamais celui de production) ; SMTP retiré : sendMail ne peut rien envoyer.
process.env.ACCOUNT_CODE_SECRET = randomBytes(32).toString('hex');
delete process.env.ZOHO_SMTP_USER;
delete process.env.ZOHO_SMTP_PASS;

async function main() {
  const { LOCALES } = await import('@/i18n/locales');
  const { buildEmailFooter, localeFromLang, textToHtml, appendHtmlFooter } = await import('@/lib/emailFooter');
  const prefs = await import('@/lib/emailPrefs');
  const { prepareMail, sendMail } = await import('@/lib/server');

  const out = process.argv[2] || join(tmpdir(), 'email-footer');
  mkdirSync(out, { recursive: true });
  const to = 'Client.Test+demo@example.com';

  // 1. Pied de page des 7 langues, dans un email d’exemple.
  for (const l of LOCALES) {
    const f = buildEmailFooter(to, l);
    const body = appendHtmlFooter(textToHtml('Exemple de corps d’email.\nSecond paragraphe.', l === 'he'), f.html);
    writeFileSync(join(out, `footer-${l}.html`), `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><title>Pied ${l}</title></head><body>${body}</body></html>`);
    writeFileSync(join(out, `footer-${l}.txt`), f.text);
    assert.match(f.text, /SINAY STRATEGIC LLC/);
    assert.match(f.text, /1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001, USA/);
    assert.ok(f.text.includes('client.test+demo@example.com'), `adresse dans le pied ${l}`);
    const prefix = l === 'fr' ? '' : `/${l}`;
    assert.ok(f.html.includes(`https://www.permanenceia.com${prefix}/cgu`), `CGU ${l}`);
    assert.ok(f.html.includes(`https://www.permanenceia.com${prefix}/confidentialite`), `confidentialité ${l}`);
    assert.ok(f.html.includes(`https://www.permanenceia.com${prefix}/preferences-email?e=`), `préférences ${l}`);
    assert.ok(f.html.includes('https://www.permanenceia.com/api/email/unsubscribe?e='), `désinscription ${l}`);
    assert.ok(f.html.includes(`dir="${l === 'he' ? 'rtl' : 'ltr'}"`), `sens d’écriture ${l}`);
    assert.ok(!/\{(year|company|brand|email)\}/.test(f.text + f.html), `variable non remplacée ${l}`);
  }
  // Email bilingue (langue inconnue) et pied générique sans jeton (modèle Autocalls).
  const bi = buildEmailFooter(to, ['fr', 'en-gb']);
  assert.match(bi.text, /tous droits réservés/);
  assert.match(bi.text, /All rights reserved/);
  writeFileSync(join(out, 'footer-fr+en-gb.html'), `<!doctype html><meta charset="utf-8"><body>${bi.html}</body>`);
  const generic = buildEmailFooter('', ['fr', 'en-gb'], { generic: true });
  assert.ok(!generic.html.includes('?e='), 'pied générique sans jeton');
  writeFileSync(join(out, 'footer-generique-fr+en.html'), `<!doctype html><meta charset="utf-8"><body>${generic.html}</body>`);
  writeFileSync(join(out, 'footer-generique-fr+en.txt'), generic.text);

  assert.equal(localeFromLang('en'), 'en-gb');
  assert.equal(localeFromLang('en-AU'), 'en-au');
  assert.equal(localeFromLang('he'), 'he');
  assert.equal(localeFromLang('de'), undefined);

  // 2. Jetons signés.
  const tok = prefs.emailToken(to)!;
  assert.ok(tok && tok.length === 32);
  assert.ok(prefs.verifyEmailToken(to, tok));
  assert.ok(prefs.verifyEmailToken('CLIENT.TEST+demo@example.com ', tok), 'adresse normalisée');
  assert.ok(!prefs.verifyEmailToken('autre@example.com', tok), 'jeton d’une autre adresse');
  assert.ok(!prefs.verifyEmailToken(to, tok.slice(0, -1) + (tok.endsWith('A') ? 'B' : 'A')), 'jeton modifié');
  assert.ok(!prefs.verifyEmailToken(to, ''), 'jeton vide');
  assert.equal(prefs.decodeEmail(prefs.encodeEmail(to)), to.toLowerCase());
  assert.equal(prefs.decodeEmail('pas-une-adresse'), null);
  assert.notEqual(prefs.emailKey(to), to, 'identifiant haché');
  assert.ok(!prefs.emailKey(to).includes('example'), 'pas d’adresse en clair en base');
  const saved = process.env.ACCOUNT_CODE_SECRET;
  delete process.env.ACCOUNT_CODE_SECRET;
  assert.equal(prefs.emailToken(to), null, 'sans secret : pas de jeton');
  assert.ok(!prefs.verifyEmailToken(to, tok), 'sans secret : rien n’est valide');
  assert.equal(prefs.prefsUrl(to), 'https://www.permanenceia.com/preferences-email', 'sans secret : lien générique');
  process.env.ACCOUNT_CODE_SECRET = saved;

  // 3. Fausse base : préférences et saut des emails non essentiels.
  const rows: Record<string, unknown>[] = [];
  let broken = false;
  const db: import('@/lib/emailPrefs').PrefDb = {
    async select<T>(table: string, query: string) {
      if (broken) throw new Error('base indisponible');
      assert.equal(table, 'call_events');
      const id = /external_id=eq\.([^&]+)/.exec(query)?.[1];
      const kind = /kind=eq\.([^&]+)/.exec(query)?.[1];
      return rows.filter((r) => r.external_id === id && r.kind === kind).slice(-1) as T[];
    },
    async insert(_table: string, row: Record<string, unknown>) { rows.push(row); },
  };
  const mail = (category: 'essential' | 'marketing' | 'internal', extra = {}) =>
    prepareMail({ to, subject: 'Test', text: 'Bonjour', category, ...extra }, db);

  assert.equal(await prefs.getEmailPref(to, db), null);
  assert.ok((await mail('marketing')).message, 'marketing envoyé sans choix enregistré');
  await prefs.saveEmailPref(to, 'essential_only', 'test', db);
  assert.ok(!JSON.stringify(rows).toLowerCase().includes('client.test'), 'aucune adresse en clair en base');
  assert.equal(rows[0].kind, 'email_pref');
  assert.equal(await prefs.emailOptedOut(to, db), true);
  assert.equal((await mail('marketing')).skipped, 'opted_out', 'marketing sauté après désinscription');
  assert.ok((await mail('essential')).message, 'essentiel toujours envoyé');
  assert.ok((await mail('internal')).message, 'interne toujours envoyé');
  await prefs.saveEmailPref(to, 'all', 'test', db);
  assert.ok((await mail('marketing')).message, 'la ligne la plus récente fait foi');
  broken = true;
  assert.equal((await mail('marketing')).skipped, 'pref_unavailable', 'base en panne : marketing non envoyé');
  assert.ok((await mail('essential')).message, 'base en panne : essentiel envoyé');
  broken = false;

  // 4. Message complet : pied, version HTML créée pour un email en texte seul, en-têtes de désinscription.
  const he = (await mail('essential', { locale: 'he' })).message!;
  assert.ok(he.html.includes('dir="rtl"'));
  assert.ok(he.html.includes('<a href="https://www.permanenceia.com/he/preferences-email?e='));
  assert.ok(he.text.startsWith('Bonjour\n\n-- \n'));
  assert.match(he.headers['List-Unsubscribe'], /^<mailto:contact@permanenceia\.com\?subject=unsubscribe>, <https:\/\/www\.permanenceia\.com\/api\/email\/unsubscribe\?e=/);
  assert.equal(he.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  const internal = (await mail('internal', { locale: 'it', html: '<p>Notification</p>' })).message!;
  assert.ok(internal.html.startsWith('<p>Notification</p>'), 'HTML de l’appelant conservé');
  assert.match(internal.text, /tous droits réservés/, 'emails de l’équipe en français');
  writeFileSync(join(out, 'message-he.html'), `<!doctype html><meta charset="utf-8"><body>${he.html}</body>`);

  // 5. Aucun envoi possible pendant les tests.
  await assert.rejects(sendMail({ to, subject: 'x', text: 'x', category: 'essential' }), /SMTP Zoho non configuré/);

  console.log(`OK : tous les tests passent. Fichiers : ${out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
