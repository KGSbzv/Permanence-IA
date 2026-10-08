// Tests des plages d’appel et des numéros (aucun réseau, aucune base, aucun envoi) :
//   npx tsx scripts/test-call-hours.ts
// Horloge simulée (paramètre `now` de resolveCallAt) : une date précise un jour non ouvré ou hors des plages du
// marché est reportée au prochain créneau ouvré ; un numéro national reçu d’un agent sans indicatif n’est pas
// converti au hasard ; seuls les indicatifs d’Afrique francophone partent vers la campagne française.
// Numéros WhatsApp : l’israélien (expéditeur 529) pour l’hébreu seulement, avec repli sur le 521 (fetch simulé).
import assert from 'node:assert/strict';

for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[k];

async function main() {
  const { resolveCallAt, toE164, langFromPhone } = await import('@/lib/server');
  const { isCallTime, nextCallTime } = await import('@/lib/callHours');

  let passed = 0;
  const test = (name: string, fn: () => void) => {
    try { fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };
  const atest = async (name: string, fn: () => Promise<void>) => {
    try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };
  // Jeudi 8 octobre 2026, 10:00 à Paris.
  const NOW = Date.parse('2026-10-08T08:00:00Z');
  const at = (callAt: string, lang: string, tz?: string, now = NOW) => resolveCallAt({ callAt, lang, tz: tz ?? undefined, now }).toISOString();

  test('fr : créneau ouvré gardé tel quel', () => assert.equal(at('2026-10-09T10:15', 'fr', 'Europe/Paris'), '2026-10-09T08:15:00.000Z'));
  test('fr : pause de midi → 14:00', () => assert.equal(at('2026-10-09T13:00', 'fr', 'Europe/Paris'), '2026-10-09T12:00:00.000Z'));
  test('fr : samedi 20:00 → lundi 9:00', () => assert.equal(at('2026-10-10T20:00', 'fr', 'Europe/Paris'), '2026-10-12T07:00:00.000Z'));
  test('fr : dimanche → lundi 9:00', () => assert.equal(at('2026-10-11T10:00', 'fr', 'Europe/Paris'), '2026-10-12T07:00:00.000Z'));
  test('fr : 19:00 pile → lendemain 9:00', () => assert.equal(at('2026-10-09T19:00', 'fr', 'Europe/Paris'), '2026-10-10T07:00:00.000Z'));
  test('fr : date ISO avec décalage (samedi 20:00 à Paris)', () => assert.equal(at('2026-10-10T18:00:00Z', 'fr'), '2026-10-12T07:00:00.000Z'));
  test('fr : heure du visiteur (Londres 8:00 = Paris 9:00) gardée', () => assert.equal(at('2026-10-09T08:00', 'fr', 'Europe/London'), '2026-10-09T07:00:00.000Z'));
  test('fr : changement d’heure (samedi 24 oct. 20:00 → lundi 26 9:00 heure d’hiver)', () => assert.equal(at('2026-10-24T20:00', 'fr', 'Europe/Paris'), '2026-10-26T08:00:00.000Z'));
  test('it : 13:30 → 14:30', () => assert.equal(at('2026-10-09T13:30', 'it', 'Europe/Rome'), '2026-10-09T12:30:00.000Z'));
  test('it : 12:45 gardé (plage 9:00–13:00)', () => assert.equal(at('2026-10-09T12:45', 'it', 'Europe/Rome'), '2026-10-09T10:45:00.000Z'));
  test('pl : 18:00 → samedi 9:00', () => assert.equal(at('2026-10-09T18:00', 'pl', 'Europe/Warsaw'), '2026-10-10T07:00:00.000Z'));
  test('nl : samedi 17:30 → lundi 9:00', () => assert.equal(at('2026-10-10T17:30', 'nl', 'Europe/Amsterdam'), '2026-10-12T07:00:00.000Z'));
  test('en-gb : 12:45 → 14:00', () => assert.equal(at('2026-10-09T12:45', 'en-gb', 'Europe/London'), '2026-10-09T13:00:00.000Z'));
  test('en-au : samedi 19:30 → lundi 9:00 (Sydney)', () => assert.equal(at('2026-10-10T19:30', 'en-au', 'Australia/Sydney'), '2026-10-11T22:00:00.000Z'));
  test('he : vendredi → dimanche 9:00', () => assert.equal(at('2026-10-09T10:00', 'he', 'Asia/Jerusalem'), '2026-10-11T06:00:00.000Z'));
  test('he : dimanche gardé', () => assert.equal(at('2026-10-11T15:00', 'he', 'Asia/Jerusalem'), '2026-10-11T12:00:00.000Z'));
  test('he : 12:45 gardé (plage 9:00–13:00, comme les campagnes)', () => assert.equal(at('2026-10-11T12:45', 'he', 'Asia/Jerusalem'), '2026-10-11T09:45:00.000Z'));
  test('he : 13:30 → 14:00', () => assert.equal(at('2026-10-11T13:30', 'he', 'Asia/Jerusalem'), '2026-10-11T11:00:00.000Z'));
  test('he : veille de fête au soir → lendemain de la fête 9:00', () => {
    // Dimanche 20 sept. 2026 20:00 ; lundi 21 sept. chômé (src/lib/relances/calendar.ts) → mardi 22 sept. 9:00.
    assert.equal(at('2026-09-20T20:00', 'he', 'Asia/Jerusalem', Date.parse('2026-09-15T08:00:00Z')), '2026-09-22T06:00:00.000Z');
  });
  test('date passée → maintenant', () => assert.equal(at('2026-10-01T10:00', 'fr', 'Europe/Paris'), new Date(NOW).toISOString()));
  test('créneau du formulaire inchangé (« Demain matin » = vendredi 9:30)', () => {
    assert.equal(resolveCallAt({ slot: 'Demain matin', lang: 'fr', tz: 'Europe/Paris', now: NOW }).getTime() > NOW, true);
  });
  test('isCallTime / nextCallTime cohérents', () => {
    const sat = new Date('2026-10-10T18:00:00Z');
    assert.equal(isCallTime(sat, 'fr'), false);
    assert.equal(isCallTime(nextCallTime(sat, 'fr'), 'fr'), true);
  });

  test('toE164 : numéro national sans indicatif reçu d’un agent (intl) → null', () => assert.equal(toE164('050-123-4567', 'intl'), null));
  test('toE164 : même numéro sur le site israélien → +972', () => assert.equal(toE164('050-123-4567', 'he'), '+972501234567'));
  test('toE164 : intl avec + gardé', () => assert.equal(toE164('+972 50-123-4567', 'intl'), '+972501234567'));
  test('toE164 : intl avec 00 gardé', () => assert.equal(toE164('0044 7700 900123', 'intl'), '+447700900123'));
  test('toE164 : intl avec indicatif choisi', () => assert.equal(toE164('050-123-4567', 'intl', '972'), '+972501234567'));
  test('toE164 : site français inchangé', () => assert.equal(toE164('06 12 34 56 78', 'fr'), '+33612345678'));

  test('langFromPhone : Égypte, Nigeria, Kenya, Afrique du Sud → en-gb', () => {
    for (const p of ['+201001234567', '+2348012345678', '+254712345678', '+27821234567']) assert.equal(langFromPhone(p), 'en-gb', p);
  });
  test('langFromPhone : Afrique francophone et outre-mer → fr', () => {
    for (const p of ['+212612345678', '+221771234567', '+2250701234567', '+237612345678', '+243812345678', '+261321234567', '+262692123456', '+33612345678']) assert.equal(langFromPhone(p), 'fr', p);
  });

  /* ---------- WhatsApp : numéro et expéditeur selon la langue (aucun réseau : fetch simulé) ---------- */

  const { whatsappFor, whatsappLink, whatsappUrl } = await import('@/data/site');
  const { sendersFor, sendTemplate, clearTemplateCache, WHATSAPP_SENDER_ID, WHATSAPP_SENDER_ID_IL } = await import('@/lib/whatsapp');
  const { sendMissedCallSms } = await import('@/lib/sms');

  test('WhatsApp : numéro israélien pour l’hébreu seulement', () => {
    assert.equal(whatsappFor('he').e164, '+97233827709');
    for (const l of ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl', 'xx']) assert.equal(whatsappFor(l).e164, '+33745460446', l);
    assert.equal(whatsappLink('he'), 'https://wa.me/97233827709');
    assert.equal(whatsappUrl('שלום', 'he'), `https://wa.me/97233827709?text=${encodeURIComponent('שלום')}`);
    assert.equal(whatsappUrl('Bonjour', 'fr'), 'https://wa.me/33745460446?text=Bonjour');
  });
  test('WhatsApp : expéditeurs par langue (hébreu : 529 puis 521)', () => {
    assert.deepEqual([WHATSAPP_SENDER_ID, WHATSAPP_SENDER_ID_IL], [521, 529]);
    assert.deepEqual(sendersFor('he'), [529, 521]);
    for (const l of ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl']) assert.deepEqual(sendersFor(l), [521], l);
  });

  // Faux Autocalls : modèles par expéditeur (liste, ou code d’erreur HTTP) et envois refusés par expéditeur.
  const realFetch = globalThis.fetch;
  const realWarn = console.warn;
  let calls: { url: string; body?: any }[] = [];
  let lists: Record<number, unknown[] | number> = {};
  let refused = new Set<number>();
  let failing = new Set<number>();
  const warns: string[] = [];
  const json = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  globalThis.fetch = (async (input: unknown, init?: { body?: string }) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(init.body) : undefined;
    calls.push({ url, body });
    const m = /\/whatsapp\/templates\?sender_id=(\d+)$/.exec(url);
    if (m) { const l = lists[Number(m[1])]; return typeof l === 'number' ? json(l, {}) : json(200, { data: l ?? [] }); }
    if (url.endsWith('/whatsapp/send')) return refused.has(body.sender_id) ? json(400, { error: 'refusé' }) : failing.has(body.sender_id) ? json(503, { error: 'indisponible' }) : json(200, { ok: true, sender: body.sender_id });
    if (url.endsWith('/user/sms')) return json(200, { ok: true });
    throw new Error(`réseau interdit dans les tests : ${url}`);
  }) as typeof fetch;
  console.warn = (...a: unknown[]) => { warns.push(a.join(' ')); };
  process.env.AUTOCALLS_API_KEY = 'cle-de-test-sans-reseau';
  const tpl = (id: number, language: string, status = 'APPROVED') => ({ id, name: 'pia_callback_missed', language, status });
  const reset = (l: typeof lists, r: number[] = [], f: number[] = []) => { clearTemplateCache(); calls = []; lists = l; refused = new Set(r); failing = new Set(f); warns.length = 0; };
  const sentFrom = () => calls.filter((c) => c.url.endsWith('/send')).map((c) => c.body.sender_id);
  const listed = () => calls.map((c) => /sender_id=(\d+)/.exec(c.url)?.[1]).filter(Boolean).map(Number);
  const send = (lang: string, market?: string) => sendTemplate('pia_callback_missed', lang, '+972501234567', { 1: 'דנה' }, { market });

  try {
    await atest('WhatsApp he : modèle pas encore approuvé sur le 529 → envoi par le 521', async () => {
      reset({ 529: [tpl(9, 'he', 'PENDING')], 521: [tpl(1, 'he')] });
      await send('he');
      assert.deepEqual(listed(), [529, 521]);
      assert.deepEqual(sentFrom(), [521]);
      assert.equal(calls.at(-1)!.body.template_id, 1);
      assert.equal(warns.length, 1);
    });
    await atest('WhatsApp he : modèle approuvé sur le 529 → envoi par le 529, le 521 n’est pas consulté', async () => {
      reset({ 529: [tpl(9, 'he')], 521: [tpl(1, 'he')] });
      await send('he');
      assert.deepEqual(listed(), [529]);
      assert.deepEqual(sentFrom(), [529]);
      assert.equal(calls.at(-1)!.body.template_id, 9);
    });
    await atest('WhatsApp he : liste du 529 en erreur (500) → repli sur le 521', async () => {
      reset({ 529: 500, 521: [tpl(1, 'he')] });
      await send('he');
      assert.deepEqual(sentFrom(), [521]);
    });
    await atest('WhatsApp he : envoi refusé par le 529 → nouvel essai par le 521', async () => {
      reset({ 529: [tpl(9, 'he')], 521: [tpl(1, 'he')] }, [529]);
      await send('he');
      assert.deepEqual(sentFrom(), [529, 521]);
    });
    await atest('WhatsApp he : erreur 5xx à l’envoi par le 529 → pas de second envoi (doublon possible)', async () => {
      reset({ 529: [tpl(9, 'he')], 521: [tpl(1, 'he')] }, [], [529]);
      await assert.rejects(send('he'), /503/);
      assert.deepEqual(sentFrom(), [529]);
    });
    await atest('WhatsApp he : échec de la liste du 529 gardé en mémoire (pas de nouvelle requête au 2e envoi)', async () => {
      reset({ 529: 500, 521: [tpl(1, 'he')] });
      await send('he');
      await send('he');
      assert.deepEqual(listed(), [529, 521]);
      assert.deepEqual(sentFrom(), [521, 521]);
    });
    await atest('WhatsApp : démo en hébreu sur le site français → expéditeur 521 seulement (le marché décide)', async () => {
      reset({ 529: [tpl(9, 'he')], 521: [tpl(1, 'he')] });
      await send('he', 'fr');
      assert.deepEqual(listed(), [521]);
      assert.deepEqual(sentFrom(), [521]);
    });
    await atest('WhatsApp he : modèles mis en cache par expéditeur', async () => {
      reset({ 529: [], 521: [tpl(1, 'he')] });
      await send('he');
      await send('he');
      assert.deepEqual(listed(), [529, 521]);
      assert.deepEqual(sentFrom(), [521, 521]);
    });
    await atest('WhatsApp he : approuvé nulle part → erreur du 521', async () => {
      reset({ 529: [], 521: [] });
      await assert.rejects(send('he'), /non approuvé \(expéditeur 521\)/);
      assert.deepEqual(sentFrom(), []);
    });
    await atest('WhatsApp fr : 521 seulement, le 529 n’est jamais consulté', async () => {
      reset({ 529: [tpl(9, 'fr')], 521: [tpl(1, 'fr')] });
      await send('fr');
      assert.deepEqual(listed(), [521]);
      assert.deepEqual(sentFrom(), [521]);
    });
    await atest('SMS après appel manqué : lien WhatsApp israélien en hébreu, français ailleurs', async () => {
      reset({});
      await sendMissedCallSms('he', '+972501234567', 'דנה');
      await sendMissedCallSms('fr', '+33612345678', 'Marie');
      await sendMissedCallSms('xx', '+447700900123', 'Sam');
      const [he, fr, other] = calls.map((c) => String(c.body.body));
      assert.ok(he.endsWith('https://wa.me/97233827709'), he);
      assert.ok(fr.endsWith('https://wa.me/33745460446'), fr);
      assert.ok(other.endsWith('https://wa.me/33745460446'), other);
      reset({});
      await sendMissedCallSms('he', '+972501234567', 'דנה', 'fr');
      assert.ok(String(calls[0].body.body).endsWith('https://wa.me/33745460446'), 'site français : lien +33 même en hébreu');
    });
  } finally {
    globalThis.fetch = realFetch;
    console.warn = realWarn;
    delete process.env.AUTOCALLS_API_KEY;
    clearTemplateCache();
  }

  console.log(`\n${passed} tests réussis`);
}

main().catch((e) => { console.error(e); process.exit(1); });
