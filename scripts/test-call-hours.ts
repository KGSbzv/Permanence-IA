// Tests des plages d’appel et des numéros (aucun réseau, aucune base, aucun envoi) :
//   npx tsx scripts/test-call-hours.ts
// Horloge simulée (paramètre `now` de resolveCallAt) : une date précise un jour non ouvré ou hors des plages du
// marché est reportée au prochain créneau ouvré ; un numéro national reçu d’un agent sans indicatif n’est pas
// converti au hasard ; seuls les indicatifs d’Afrique francophone partent vers la campagne française.
import assert from 'node:assert/strict';

for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[k];

async function main() {
  const { resolveCallAt, toE164, langFromPhone } = await import('@/lib/server');
  const { isCallTime, nextCallTime } = await import('@/lib/callHours');

  let passed = 0;
  const test = (name: string, fn: () => void) => {
    try { fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
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

  console.log(`\n${passed} tests réussis`);
}

main().catch((e) => { console.error(e); process.exit(1); });
