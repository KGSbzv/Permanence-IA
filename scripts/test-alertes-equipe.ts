// Tests des alertes de paiement et du résumé hebdomadaire à l’équipe (aucun réseau, aucune base réelle, aucun envoi) :
//   npx tsx scripts/test-alertes-equipe.ts
// Base en mémoire, envoi remplacé par un faux qui enregistre les messages. Vérifie : une seule alerte par facture et
// par tentative (événement renvoyé, autre événement pour la même tentative), une seule alerte « impayé » quel que soit
// l’ordre des événements, pas d’alerte au passage en past_due ni pour une résiliation demandée par le client, première
// facture refusée ou facture à régler annoncée « paiement refusé » (jamais « impayé définitif »), email en échec sans
// erreur remontée ; montant et devise
// formatés ; journal des paiements compté une fois ; fenêtre « lundi 8 h, heure de Paris » avec changements d’heure ;
// envoi unique du résumé (deux passages, deux instances, nouvel essai après échec ou réservation interrompue, 3 au plus) ;
// section manquante tolérée ;
// routes (fetch simulé) : webhook Stripe en 200 malgré un email impossible, résumé examiné même relances coupées ;
// essai annulé (fin programmée ou résiliation avant la fin) : une seule alerte, texte selon ce que reçoit le client
// (C5 ou F1) ; e-mails laissés sur /essai-gratuit sans inscription comptés dans le résumé (inscrits de longue date exclus).
// Moments clés (9 oct., action 7) : essai démarré, essai converti ou abonnement payant, résiliation demandée ou effective,
// premier achat de crédit, une alerte chacun ; compléments du résumé du lundi (conversions, résiliations, mise en route).
// Relecture du 9 oct. (lot B) : moments clés sur un changement réel seulement (création, « incomplete » → « active »,
// première facture payée après l’essai), jamais au renouvellement d’un abonné déjà là ni avant le prélèvement ; résumé :
// conversions = abonnements actifs, résiliations hors impayé (motif lu s’il existe, sinon dates).
import assert from 'node:assert/strict';
import { randomUUID } from 'crypto';

for (const k of ['ZOHO_SMTP_USER', 'ZOHO_SMTP_PASS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_READ_KEY', 'STRIPE_CUSTOMERS_KEY']) delete process.env[k];

type Any = Record<string, any>;
const sp = (s: string) => s.replace(/[  ]/g, ' '); // espaces insécables d’Intl (fr-FR)

/** Base en mémoire : filtres PostgREST utilisés par le code (eq, neq, gte, lt, in), tri, limite et décalage. */
function memoryDb(clock: () => number, failing: Set<string> = new Set()) {
  const tables: Record<string, Any[]> = {};
  const rows = (name: string) => (tables[name] ??= []);
  const parse = (query: string) => query.split('&').map((p) => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)] as [string, string]; });
  const test = (row: Any, k: string, v: string) => {
    const [op, ...rest] = v.split('.');
    const arg = decodeURIComponent(rest.join('.')).replace(/^"|"$/g, '');
    const cell = row[k] == null ? null : String(row[k]);
    if (op === 'eq') return cell === arg;
    if (op === 'neq') return cell !== arg;
    if (op === 'gte') return cell != null && cell >= arg;
    if (op === 'lt') return cell != null && cell < arg;
    if (op === 'in') return arg.replace(/^\(|\)$/g, '').split(',').includes(String(cell));
    return true; // or=(…) et autres : non simulés
  };
  const filter = (all: Any[], query: string) => {
    let out = all;
    let order: string[] = [];
    let limit = Infinity;
    let offset = 0;
    for (const [k, v] of parse(query)) {
      if (k === 'select' || k === 'or') continue;
      if (k === 'order') order = v.split(',').map((o) => o.split('.')[0]);
      else if (k === 'limit') limit = Number(v);
      else if (k === 'offset') offset = Number(v);
      else out = out.filter((r) => test(r, k, v));
    }
    if (order.length) out = [...out].sort((a, b) => { for (const c of order) { const x = String(a[c] ?? ''), y = String(b[c] ?? ''); if (x !== y) return x < y ? -1 : 1; } return 0; });
    return out.slice(offset, offset + limit);
  };
  const guard = (table: string) => { if (failing.has(table)) throw new Error(`Supabase ${table} 404`); };
  return {
    tables,
    rows,
    select: async <T,>(table: string, query: string) => { guard(table); return filter(rows(table), query).map((r) => ({ ...r })) as T[]; },
    insertIfNew: async (table: string, row: Any, onConflict: string) => {
      guard(table);
      if (rows(table).some((r) => r[onConflict] === row[onConflict])) return false;
      rows(table).push({ ...row });
      return true;
    },
    insert: async (table: string, row: Any) => {
      guard(table);
      const r = { id: randomUUID(), created_at: new Date(clock()).toISOString(), ...row };
      rows(table).push(r);
      return r.id as string;
    },
    update: async (table: string, query: string, patch: Any) => { guard(table); filter(rows(table), query).forEach((r) => Object.assign(r, patch)); },
  };
}

async function main() {
  const { applyStripeEvent } = await import('@/lib/relances/stripe');
  const { formatAmount, dashboardCustomerUrl, PAYMENT_KIND } = await import('@/lib/relances/payments');
  const { countPayments, periodLabel, sendWeeklyIfDue, weeklyWindow, WEEKLY_KIND } = await import('@/lib/relances/weekly');

  let passed = 0;
  const test = async (name: string, fn: () => Promise<void> | void) => {
    try { await fn(); passed++; console.log(`ok  ${name}`); } catch (e) { console.error(`ÉCHEC  ${name}`); throw e; }
  };

  /* ---------- Montant et devise ---------- */

  await test('montant : plus petite unité de la devise, devise lisible, jamais d’erreur', () => {
    assert.equal(sp(formatAmount(9900, 'usd')), '99,00 $US');
    assert.equal(sp(formatAmount(4900, 'EUR')), '49,00 €');
    assert.equal(sp(formatAmount(123456, 'gbp')), '1 234,56 £GB');
    assert.equal(sp(formatAmount(1999, 'ils')), '19,99 ₪');
    assert.equal(sp(formatAmount(150000, 'jpy')), '150 000 JPY', 'yen : sans décimale chez Stripe');
    assert.equal(sp(formatAmount(1234, 'kwd')), '1,234 KWD', 'dinar koweïtien : trois décimales');
    assert.equal(sp(formatAmount(990, null)), '9,90 (devise inconnue)');
    assert.equal(sp(formatAmount(5, 'x$')), '0,05 X$', 'code invalide : montant brut');
  });

  /* ---------- Alertes de paiement (webhook Stripe) ---------- */

  let clock = Date.parse('2026-10-14T09:00:00Z');
  const db = memoryDb(() => clock);
  const mails: { subject: string; text: string; html: string }[] = [];
  const notify = async (subject: string, text: string, html: string) => { mails.push({ subject, text, html }); };
  const failed = (id: string, invoice: string, attempt: number, next: number | null, extra: Any = {}) => ({
    id, type: 'invoice.payment_failed', created: 1_800_000_000 + attempt, livemode: true,
    data: { object: { id: invoice, number: 'PIA-0012', customer: 'cus_1', customer_email: 'Alice@Exemple.fr', customer_name: 'Alice Martin', amount_due: 9900, amount_remaining: 9900, currency: 'usd', attempt_count: attempt, next_payment_attempt: next, hosted_invoice_url: `https://invoice.stripe.com/i/${invoice}`, ...extra } },
  });
  const subEvent = (id: string, type: string, status: string, extra: Any = {}) => ({
    id, type, created: 1_800_000_100, livemode: true,
    data: { object: { id: 'sub_1', customer: 'cus_1', status, latest_invoice: 'in_1', items: { data: [{ price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' } } }] }, ...extra } },
  });
  const nextTry = Date.parse('2026-10-16T12:30:00Z') / 1000;

  await test('paiement échoué : alerte complète (client, montant, tentative, prochaine tentative, liens)', async () => {
    await applyStripeEvent(failed('evt_1', 'in_1', 1, nextTry), db, undefined, undefined, notify);
    assert.equal(mails.length, 1);
    const m = mails[0];
    assert.equal(sp(m.subject), 'Paiement échoué : 99,00 $US — Alice Martin (tentative 1)');
    const text = sp(m.text);
    assert.match(text, /Client : Alice Martin — alice@exemple\.fr/);
    assert.match(text, /Montant : 99,00 \$US/);
    assert.match(text, /Tentative : n° 1/);
    assert.match(text, /Prochaine tentative : vendredi 16 octobre 2026 à 14:30 \(heure de Paris\)/);
    assert.match(text, /Facture PIA-0012 : https:\/\/invoice\.stripe\.com\/i\/in_1/);
    assert.match(text, /Client dans Stripe : https:\/\/dashboard\.stripe\.com\/acct_1UNBLcBjFUxnZPfW\/customers\/cus_1/);
    assert.match(text, /Stripe relance automatiquement le client ; rien à faire sauf si cela se répète\./);
    assert.match(m.html, /<a href="https:\/\/invoice\.stripe\.com\/i\/in_1">/);
    assert.ok(db.rows('stripe_events').some((r) => r.event_id === 'evt_1'), 'événement enregistré');
    assert.equal(db.rows('stripe_customers')[0].email, 'alice@exemple.fr');
  });

  await test('idempotence : événement renvoyé, ou autre événement pour la même facture et la même tentative → aucune 2e alerte', async () => {
    await applyStripeEvent(failed('evt_1', 'in_1', 1, nextTry), db, undefined, undefined, notify);
    await applyStripeEvent(failed('evt_1_bis', 'in_1', 1, nextTry), db, undefined, undefined, notify);
    assert.equal(mails.length, 1);
    await applyStripeEvent(failed('evt_2', 'in_1', 2, nextTry + 86_400), db, undefined, undefined, notify);
    assert.equal(mails.length, 2, 'nouvelle tentative : nouvelle alerte');
    assert.match(mails[1].subject, /tentative 2/);
  });

  await test('impayé définitif : une seule alerte, que la résiliation arrive avant ou après la dernière tentative', async () => {
    await applyStripeEvent(failed('evt_3', 'in_1', 3, null), db, undefined, undefined, notify);
    assert.equal(mails.length, 3);
    assert.equal(sp(mails[2].subject), 'Impayé définitif : 99,00 $US — Alice Martin');
    assert.match(mails[2].text, /Prochaine tentative : aucune/);
    assert.doesNotMatch(mails[2].text, /rien à faire/);
    await applyStripeEvent(subEvent('evt_4', 'customer.subscription.deleted', 'canceled', { cancellation_details: { reason: 'payment_failed' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, 3, 'résiliation de la même facture : pas de doublon');

    // Ordre inverse sur une autre facture : abonnement passé en impayé d’abord, puis dernière tentative.
    await applyStripeEvent(subEvent('evt_5', 'customer.subscription.updated', 'unpaid', { id: 'sub_2', latest_invoice: 'in_2' }), db, undefined, undefined, notify);
    assert.equal(mails.length, 4);
    assert.match(mails[3].subject, /^Abonnement impayé — alice@exemple\.fr/);
    assert.match(sp(mails[3].text), /Prix du forfait : 99,00 \$US/);
    await applyStripeEvent(failed('evt_6', 'in_2', 4, null), db, undefined, undefined, notify);
    await applyStripeEvent(subEvent('evt_7', 'customer.subscription.updated', 'unpaid', { id: 'sub_2', latest_invoice: 'in_2' }), db, undefined, undefined, notify);
    assert.equal(mails.length, 4);
  });

  await test('past_due : pas d’alerte ; résiliation d’un abonnement impayé : une alerte « après impayé » ; abonné qui résilie : « résilié »', async () => {
    await applyStripeEvent(subEvent('evt_8', 'customer.subscription.updated', 'past_due', { id: 'sub_3', latest_invoice: 'in_3' }), db, undefined, undefined, notify);
    assert.equal(mails.length, 4, 'past_due arrive avec le premier échec, déjà signalé');
    await applyStripeEvent(subEvent('evt_9', 'customer.subscription.deleted', 'canceled', { id: 'sub_3', latest_invoice: 'in_3' }), db, undefined, undefined, notify);
    assert.equal(mails.length, 5, 'statut enregistré past_due avant la résiliation');
    assert.match(mails[4].subject, /^Abonnement résilié après impayé/);
    // Abonnement payant sans essai (créé « active » : premier paiement reçu), puis résilié par le client : « Nouvel
    // abonnement payant », puis « Abonnement résilié » (audit du 9 oct., action 7), jamais « après impayé ».
    await applyStripeEvent(subEvent('evt_10', 'customer.subscription.created', 'active', { id: 'sub_4', latest_invoice: 'in_4' }), db, undefined, undefined, notify);
    assert.equal(mails.length, 6);
    assert.equal(mails[5].subject, 'Nouvel abonnement payant — alice@exemple.fr');
    await applyStripeEvent(subEvent('evt_11', 'customer.subscription.deleted', 'canceled', { id: 'sub_4', latest_invoice: 'in_4', ended_at: 1_800_000_150, cancellation_details: { reason: 'cancellation_requested' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, 7);
    assert.equal(mails[6].subject, 'Abonnement résilié — alice@exemple.fr');
    assert.doesNotMatch(mails[6].subject, /après impayé/);
  });

  await test('première facture refusée à l’inscription ou facture à régler : « Paiement refusé », jamais « impayé définitif »', async () => {
    const before = mails.length;
    await applyStripeEvent(failed('evt_12', 'in_12', 1, null, { billing_reason: 'subscription_create' }), db, undefined, undefined, notify);
    await applyStripeEvent(failed('evt_13', 'in_13', 1, null, { collection_method: 'send_invoice' }), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 2);
    for (const m of mails.slice(before)) {
      assert.equal(sp(m.subject), 'Paiement refusé : 99,00 $US — Alice Martin');
      assert.match(m.text, /Prochaine tentative : aucune tentative automatique/);
      assert.doesNotMatch(m.text, /Impayé définitif|dernière tentative/);
    }
    const logged = db.rows('call_events').filter((r) => r.kind === PAYMENT_KIND && ['in_12', 'in_13'].includes(r.variables?.invoice));
    assert.equal(logged.length, 2);
    assert.ok(logged.every((r) => r.variables.final === false), 'pas compté comme impayé définitif dans le résumé');
  });

  await test('résiliation demandée par le client d’un abonnement en retard de paiement : « résilié », jamais « après impayé »', async () => {
    const before = mails.length;
    await applyStripeEvent(subEvent('evt_14', 'customer.subscription.updated', 'past_due', { id: 'sub_5', latest_invoice: 'in_5' }), db, undefined, undefined, notify);
    await applyStripeEvent(subEvent('evt_15', 'customer.subscription.deleted', 'canceled', { id: 'sub_5', latest_invoice: 'in_5', cancellation_details: { reason: 'cancellation_requested' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 1);
    assert.match(mails[before].subject, /^Abonnement résilié — /);
  });

  await test('email en échec : journalisé, jamais remonté ; événement et journal enregistrés quand même', async () => {
    const errors: string[] = [];
    const real = console.error;
    console.error = (...a: unknown[]) => { errors.push(a.map(String).join(' ')); };
    try {
      const r = await applyStripeEvent(failed('evt_12', 'in_5', 1, nextTry), db, undefined, undefined, async () => { throw new Error('SMTP 535'); });
      assert.equal(r.handled, true);
    } finally { console.error = real; }
    assert.ok(errors.some((e) => /non envoyée.*SMTP 535/.test(e)));
    assert.ok(db.rows('stripe_events').some((r) => r.event_id === 'evt_12'));
    assert.ok(db.rows('call_events').some((r) => r.external_id === 'in_5#1' && r.status === 'echec'));
    const again: string[] = [];
    await applyStripeEvent(failed('evt_12', 'in_5', 1, nextTry), db, undefined, undefined, async (s) => { again.push(s); });
    assert.equal(again.length, 0, 'verrou posé avant l’envoi : pas d’alerte en boucle');
  });

  await test('essai annulé : une alerte (fin programmée ou résiliation avant la fin), jamais en double ni pour un impayé', async () => {
    const before = mails.length;
    const trial = (id: string, type: string, status: string, extra: Any = {}) => subEvent(id, type, status, { id: 'sub_t', latest_invoice: 'in_t', trial_start: 1_799_000_000, trial_end: 1_800_200_000, ...extra });
    await applyStripeEvent(trial('evt_t0', 'customer.subscription.created', 'trialing'), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 1, 'essai en cours sans annulation : seulement « Essai démarré »');
    assert.equal(mails[before].subject, 'Essai démarré — alice@exemple.fr');
    await applyStripeEvent(trial('evt_t1', 'customer.subscription.updated', 'trialing', { cancel_at_period_end: true, cancellation_details: { feedback: 'too_expensive', comment: 'Trop cher pour moi' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 2);
    const m = mails[before + 1];
    assert.equal(m.subject, 'Essai annulé — alice@exemple.fr');
    assert.match(sp(m.text), /Fin de l’essai : .*2027/);
    assert.match(m.text, /Motif indiqué : too_expensive — Trop cher pour moi/);
    assert.match(m.text, /Rien ne sera débité/);
    assert.match(m.text, /C5 confirme au client/, 'fin programmée : le client recevra C5');
    assert.match(sp(m.text), /Forfait : 99,00 \$US par mois/);
    // Renvoi de l’événement, puis résiliation à la fin de l’essai : pas de seconde alerte.
    await applyStripeEvent(trial('evt_t1', 'customer.subscription.updated', 'trialing', { cancel_at_period_end: true }), db, undefined, undefined, notify);
    await applyStripeEvent(trial('evt_t2', 'customer.subscription.deleted', 'canceled', { ended_at: 1_800_200_000, cancellation_details: { reason: 'cancellation_requested' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 2, 'fin de l’essai annulé : ni seconde alerte, ni « Abonnement résilié »');
    // Résiliation immédiate d’un autre essai.
    await applyStripeEvent(trial('evt_t3', 'customer.subscription.deleted', 'canceled', { id: 'sub_u', ended_at: 1_799_500_000, cancellation_details: { reason: 'cancellation_requested' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 3);
    assert.match(mails[before + 2].text, /Fin de l’essai : immédiate/);
    // Abonnement déjà résilié : le client reçoit F1, pas C5.
    assert.match(mails[before + 2].text, /Rien n’a été débité\. L’abonnement est déjà résilié : le client reçoit F1/);
    assert.doesNotMatch(mails[before + 2].text, /C5 confirme/);
    // Résiliation constatée à la fin de l’essai, sans événement de fin programmée reçu avant : même texte « F1 ».
    await applyStripeEvent(trial('evt_t5', 'customer.subscription.deleted', 'canceled', { id: 'sub_w', ended_at: 1_800_200_000, cancellation_details: { reason: 'cancellation_requested' } }), db, undefined, undefined, notify);
    assert.equal(mails.length, before + 4);
    assert.doesNotMatch(mails[before + 3].text, /Fin de l’essai : immédiate/);
    assert.match(mails[before + 3].text, /le client reçoit F1/);
    // Fin d’essai sur un paiement refusé : pas une annulation du client.
    const n = mails.length;
    await applyStripeEvent(trial('evt_t4', 'customer.subscription.deleted', 'canceled', { id: 'sub_v', latest_invoice: 'in_v', ended_at: 1_800_500_000, cancellation_details: { reason: 'payment_failed' } }), db, undefined, undefined, notify);
    assert.ok(mails.slice(n).every((x) => !/Essai annulé/.test(x.subject)));
  });

  await test('moments clés : essai démarré, essai converti, résiliation demandée puis effective — une alerte chacun', async () => {
    const life = memoryDb(() => clock);
    const out: { subject: string; text: string }[] = [];
    const tell = async (subject: string, text: string) => { out.push({ subject, text }); };
    // `prev` : data.previous_attributes de l’événement (seulement les champs changés).
    const ev = (id: string, type: string, status: string, extra: Any = {}, prev?: Any) => ({
      id, type, created: 1_800_000_300, livemode: true,
      data: { object: { id: 'sub_k', customer: 'cus_k', status, trial_start: 1_799_000_000, trial_end: 1_800_200_000, items: { data: [{ current_period_end: 1_802_800_000, price: { unit_amount: 24900, currency: 'usd', recurring: { interval: 'month' } } }] }, ...extra }, ...(prev ? { previous_attributes: prev } : {}) },
    });
    // Facture d’abonnement payée : `start` = début de la période facturée (ligne de la facture).
    const paidInvoice = (id: string, invoice: string, start: number, extra: Any = {}) => ({
      id, type: 'invoice.paid', created: 1_800_200_400, livemode: true,
      data: { object: { id: invoice, customer: 'cus_k', amount_paid: 24900, currency: 'usd', billing_reason: 'subscription_cycle', parent: { subscription_details: { subscription: 'sub_k' } }, lines: { data: [{ period: { start, end: start + 2_600_000 } }] }, ...extra } },
    });
    await life.insertIfNew('stripe_customers', { customer_id: 'cus_k', email: 'karim@exemple.fr' }, 'customer_id');
    // Essai démarré (événement de création, puis renvoi et mise à jour) : une seule alerte.
    await applyStripeEvent(ev('k1', 'customer.subscription.created', 'trialing'), life, undefined, undefined, tell);
    await applyStripeEvent(ev('k1', 'customer.subscription.created', 'trialing'), life, undefined, undefined, tell);
    await applyStripeEvent(ev('k2', 'customer.subscription.updated', 'trialing', {}, { cancel_at_period_end: true }), life, undefined, undefined, tell);
    assert.equal(out.length, 1);
    assert.equal(out[0].subject, 'Essai démarré — karim@exemple.fr');
    assert.match(sp(out[0].text), /Forfait : 249,00 \$US par mois/);
    assert.match(sp(out[0].text), /Fin de l’essai : .*2027/);
    assert.match(out[0].text, /A2 à J\+3 \(avec une alerte pour vous\)/);
    assert.match(out[0].text, /C1 \(début d’essai\) au premier passage horaire entre 8 h et 20 h \(heure locale du client\)/);
    // Fin de l’essai : passage en « active » AVANT le prélèvement → aucune alerte ; facture de la première période
    // payée → « Essai converti », une seule fois (renvoi, invoice.payment_succeeded, repassage par past_due puis active).
    await applyStripeEvent(ev('k3', 'customer.subscription.updated', 'active', {}, { status: 'trialing' }), life, undefined, undefined, tell);
    assert.equal(out.length, 1, 'statut « active » avant le prélèvement : pas encore converti');
    await applyStripeEvent(paidInvoice('k3i', 'in_k1', 1_800_200_000), life, undefined, undefined, tell);
    await applyStripeEvent({ ...paidInvoice('k3j', 'in_k1', 1_800_200_000), type: 'invoice.payment_succeeded' }, life, undefined, undefined, tell);
    await applyStripeEvent(ev('k4', 'customer.subscription.updated', 'past_due', {}, { status: 'active' }), life, undefined, undefined, tell);
    await applyStripeEvent(ev('k5', 'customer.subscription.updated', 'active', {}, { status: 'past_due' }), life, undefined, undefined, tell);
    assert.equal(out.length, 2);
    assert.equal(out[1].subject, 'Essai converti : nouvel abonné payant — karim@exemple.fr');
    assert.match(sp(out[1].text), /Prochain renouvellement : .*2027/);
    assert.match(out[1].text, /la première facture du forfait est payée/);
    assert.match(out[1].text, /Risque de résiliation » dès le prochain passage \(J\+14 compté depuis le début de l’essai\)/);
    // Renouvellement du mois suivant (facture payée, événement de mise à jour) : aucune alerte.
    await applyStripeEvent(paidInvoice('k5i', 'in_k2', 1_802_800_000), life, undefined, undefined, tell);
    await applyStripeEvent(ev('k5r', 'customer.subscription.updated', 'active', {}, { current_period_end: 1_802_800_000 }), life, undefined, undefined, tell);
    assert.equal(out.length, 2, 'renouvellement : pas d’alerte');
    // Résiliation demandée (fin programmée) avec motif, puis résiliation effective à la fin de la période : une alerte.
    await applyStripeEvent(ev('k6', 'customer.subscription.updated', 'active', { cancel_at_period_end: true, cancellation_details: { feedback: 'unused', comment: 'Je ne l’utilise pas' } }, { cancel_at_period_end: false }), life, undefined, undefined, tell);
    assert.equal(out.length, 3);
    assert.equal(out[2].subject, 'Résiliation demandée — karim@exemple.fr');
    assert.match(out[2].text, /Motif indiqué : unused — Je ne l’utilise pas/);
    assert.match(sp(out[2].text), /Fin de l’abonnement : .*2027/);
    assert.match(out[2].text, /Personne ne lui a encore demandé pourquoi/);
    await applyStripeEvent(ev('k7', 'customer.subscription.deleted', 'canceled', { ended_at: 1_802_800_000, cancellation_details: { reason: 'cancellation_requested' } }), life, undefined, undefined, tell);
    assert.equal(out.length, 3, 'résiliation effective après la demande : pas de seconde alerte');
    // Essai annulé : jamais « Résiliation demandée » (alerte « Essai annulé » à part), ni « Essai démarré » sur une
    // mise à jour d’un essai déjà en cours.
    await applyStripeEvent(ev('k8', 'customer.subscription.updated', 'trialing', { id: 'sub_l', cancel_at_period_end: true }, { cancel_at_period_end: false }), life, undefined, undefined, tell);
    assert.ok(out.slice(3).every((m) => !/Résiliation demandée|Abonnement résilié|Essai démarré/.test(m.subject)));
    assert.ok(out.slice(3).some((m) => /^Essai annulé/.test(m.subject)));
    // Sans destinataire (notify absent) : aucun verrou posé, l’alerte pourra partir plus tard.
    const n = life.rows('stripe_events').length;
    await applyStripeEvent(ev('k9', 'customer.subscription.created', 'active', { id: 'sub_m', trial_end: null }), life);
    assert.equal(life.rows('stripe_events').filter((r) => String(r.event_id).startsWith('alerte:')).length, life.rows('stripe_events').slice(0, n).filter((r) => String(r.event_id).startsWith('alerte:')).length);
    // Abonnement sans essai : premier paiement réussi (passage d’« incomplete » à « active »).
    await applyStripeEvent(ev('k10', 'customer.subscription.updated', 'active', { id: 'sub_m', trial_end: null }, { status: 'incomplete' }), life, undefined, undefined, tell);
    assert.equal(out[out.length - 1].subject, 'Nouvel abonnement payant — karim@exemple.fr', 'abonnement sans essai');
  });

  await test('moments clés après le déploiement : renouvellement d’un abonné existant, essai déjà en cours, premier prélèvement refusé → aucune alerte à tort', async () => {
    const old = memoryDb(() => clock);
    const out: string[] = [];
    const tell = async (subject: string) => { out.push(subject); };
    const sub = (id: string, type: string, status: string, object: Any, prev?: Any) => ({
      id, type, created: 1_800_000_500, livemode: true,
      data: { object: { customer: 'cus_o', items: { data: [{ current_period_end: 1_802_800_000, price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' } } }] }, status, ...object }, ...(prev ? { previous_attributes: prev } : {}) },
    });
    await old.insertIfNew('stripe_customers', { customer_id: 'cus_o', email: 'olga@exemple.fr' }, 'customer_id');
    // Abonné depuis l’été (essai converti avant le déploiement) : renouvellement mensuel, facture du cycle payée.
    await applyStripeEvent(sub('o1', 'customer.subscription.updated', 'active', { id: 'sub_o', trial_start: 1_790_000_000, trial_end: 1_791_200_000 }, { current_period_end: 1_800_000_000 }), old, undefined, undefined, tell);
    await applyStripeEvent({ id: 'o1i', type: 'invoice.paid', created: 1_800_000_600, livemode: true, data: { object: { id: 'in_o1', customer: 'cus_o', amount_paid: 9900, currency: 'usd', billing_reason: 'subscription_cycle', subscription: 'sub_o', period_end: 1_800_000_000, lines: { data: [{ period: { start: 1_800_000_000, end: 1_802_600_000 } }] } } } }, old, undefined, undefined, tell);
    // Essai commencé avant le déploiement : rappel de fin d’essai (trial_will_end), puis mise à jour.
    await applyStripeEvent(sub('o2', 'customer.subscription.trial_will_end', 'trialing', { id: 'sub_p', trial_start: 1_799_000_000, trial_end: 1_800_200_000 }), old, undefined, undefined, tell);
    // Fin d’essai, passage en « active », puis premier prélèvement refusé : jamais « Essai converti ».
    await applyStripeEvent(sub('o3', 'customer.subscription.updated', 'active', { id: 'sub_p', trial_start: 1_799_000_000, trial_end: 1_800_200_000 }, { status: 'trialing' }), old, undefined, undefined, tell);
    await applyStripeEvent({ id: 'o3f', type: 'invoice.payment_failed', created: 1_800_204_000, livemode: true, data: { object: { id: 'in_p1', customer: 'cus_o', amount_due: 9900, amount_remaining: 9900, currency: 'usd', attempt_count: 1, next_payment_attempt: 1_800_400_000, billing_reason: 'subscription_cycle' } } }, old, undefined, undefined, tell);
    await applyStripeEvent(sub('o4', 'customer.subscription.updated', 'past_due', { id: 'sub_p', trial_start: 1_799_000_000, trial_end: 1_800_200_000 }, { status: 'active' }), old, undefined, undefined, tell);
    assert.deepEqual(out.map(sp), ['Paiement échoué : 99,00 $US — olga@exemple.fr (tentative 1)'], 'seule l’alerte de paiement échoué');
  });

  await test('premier achat de crédit : une alerte par client (facture « manual » ou Checkout), jamais pour un abonnement', async () => {
    const buy = memoryDb(() => clock);
    const out: string[] = [];
    const tell = async (subject: string) => { out.push(subject); };
    const ev = (id: string, type: string, object: Any) => ({ id, type, created: 1_800_000_400, livemode: true, data: { object } });
    await applyStripeEvent(ev('p1', 'invoice.paid', { id: 'in_p1', customer: 'cus_p', customer_email: 'Paul@Exemple.fr', amount_paid: 2000, currency: 'usd', billing_reason: 'manual' }), buy, undefined, undefined, tell);
    await applyStripeEvent(ev('p2', 'invoice.paid', { id: 'in_p2', customer: 'cus_p', customer_email: 'paul@exemple.fr', amount_paid: 5000, currency: 'usd', billing_reason: 'manual' }), buy, undefined, undefined, tell);
    await applyStripeEvent(ev('p3', 'invoice.paid', { id: 'in_p3', customer: 'cus_q', amount_paid: 9900, currency: 'usd', billing_reason: 'subscription_cycle', subscription: 'sub_q' }), buy, undefined, undefined, tell);
    await applyStripeEvent(ev('p4', 'checkout.session.completed', { id: 'cs_1', customer: 'cus_r', mode: 'payment', payment_status: 'paid', amount_total: 1000, currency: 'usd', customer_details: { email: 'rita@exemple.fr' }, payment_intent: 'pi_r' }), buy, undefined, undefined, tell);
    assert.deepEqual(out.map(sp), ['Premier achat de crédit : 20,00 $US — paul@exemple.fr', 'Premier achat de crédit : 10,00 $US — rita@exemple.fr']);
  });

  await test('alerte : HTML échappé, mode test signalé, lien du tableau de bord en /test', async () => {
    const before = mails.length;
    await applyStripeEvent({ ...failed('evt_13', 'in_6', 1, nextTry, { customer: 'cus_t', customer_name: '<b>Eve</b> & Co' }), livemode: false }, db, undefined, undefined, notify);
    const m = mails[before];
    assert.match(m.subject, /\[mode test Stripe\]$/);
    assert.match(m.html, /&lt;b&gt;Eve&lt;\/b&gt; &amp; Co/);
    assert.doesNotMatch(m.html, /<b>Eve/);
    assert.match(m.text, /acct_1UNBLcBjFUxnZPfW\/test\/customers\/cus_t/);
    assert.equal(dashboardCustomerUrl('cus_x', true), 'https://dashboard.stripe.com/acct_1UNBLcBjFUxnZPfW/customers/cus_x');
  });

  await test('journal des paiements : chaque paiement compté une fois (renvoi, facture et son paiement, Checkout)', async () => {
    const pay = memoryDb(() => clock);
    const ev = (id: string, type: string, object: Any) => ({ id, type, created: 1_800_000_200, livemode: true, data: { object } });
    clock = Date.parse('2026-10-14T10:00:00Z');
    await applyStripeEvent(ev('e1', 'invoice.paid', { id: 'in_9', customer: 'cus_9', amount_paid: 9900, currency: 'usd' }), pay);
    await applyStripeEvent(ev('e2', 'invoice.payment_succeeded', { id: 'in_9', customer: 'cus_9', amount_paid: 9900, currency: 'usd' }), pay);
    await applyStripeEvent(ev('e1', 'invoice.paid', { id: 'in_9', customer: 'cus_9', amount_paid: 9900, currency: 'usd' }), pay);
    clock += 30_000; // paiement de cette facture (l’API ne cite plus la facture)
    await applyStripeEvent(ev('e3', 'payment_intent.succeeded', { id: 'pi_9', customer: 'cus_9', amount_received: 9900, currency: 'usd' }), pay);
    clock += 3_600_000; // achat de crédit, vu deux fois
    await applyStripeEvent(ev('e4', 'payment_intent.succeeded', { id: 'pi_10', customer: 'cus_9', amount_received: 2000, currency: 'usd' }), pay);
    await applyStripeEvent(ev('e5', 'checkout.session.completed', { id: 'cs_10', mode: 'payment', payment_status: 'paid', payment_intent: 'pi_10', customer: 'cus_9', amount_total: 2000, currency: 'usd' }), pay);
    await applyStripeEvent(ev('e6', 'invoice.paid', { id: 'in_0', customer: 'cus_9', amount_paid: 0, currency: 'usd' }), pay);
    const journal = pay.rows('call_events').filter((r) => r.kind === PAYMENT_KIND);
    assert.equal(journal.length, 6, 'facture à 0 non journalisée');
    const { paid } = countPayments(journal as any);
    assert.deepEqual(paid.map((r) => r.external_id).sort(), ['in_9', 'pi_10']);
    assert.equal(paid.reduce((n, r) => n + Number(r.variables?.amount), 0), 11900);
    // Ancienne base de test sans insert : rien ne casse (tests de test-relances.ts).
    const legacy = memoryDb(() => clock);
    await applyStripeEvent(ev('e7', 'invoice.paid', { id: 'in_8', customer: 'cus_8', amount_paid: 100, currency: 'usd' }), { insertIfNew: legacy.insertIfNew, update: legacy.update, select: legacy.select });
    assert.equal(legacy.rows('call_events').length, 0);
  });

  /* ---------- Fenêtre « lundi 8 h, heure de Paris » ---------- */

  await test('fenêtre : lundi à partir de 8 h à Paris, heure d’été comme d’hiver, jamais un autre jour', () => {
    const due = (iso: string) => weeklyWindow(new Date(iso)).due;
    assert.equal(due('2026-10-19T05:59:00Z'), false, 'lundi 7:59 (heure d’été)');
    assert.equal(due('2026-10-19T06:00:00Z'), true, 'lundi 8:00 (heure d’été, UTC+2)');
    assert.equal(due('2026-10-26T06:30:00Z'), false, 'lendemain du passage à l’heure d’hiver : 7:30 à Paris');
    assert.equal(due('2026-10-26T07:00:00Z'), true, 'lundi 8:00 (heure d’hiver, UTC+1)');
    assert.equal(due('2027-03-29T05:59:00Z'), false, 'lendemain du passage à l’heure d’été : 7:59');
    assert.equal(due('2027-03-29T06:00:00Z'), true);
    assert.equal(due('2026-10-19T21:30:00Z'), true, 'lundi 23:30 à Paris');
    assert.equal(due('2026-10-18T22:30:00Z'), false, 'lundi 0:30 à Paris (dimanche en UTC)');
    assert.equal(due('2026-10-19T22:30:00Z'), false, 'mardi 0:30 à Paris (encore lundi en UTC)');
    assert.equal(due('2026-10-25T10:00:00Z'), false, 'dimanche');
    assert.equal(due('2026-10-20T07:00:00Z'), false, 'mardi');
  });

  await test('fenêtre : semaine écoulée de minuit à minuit (Paris), 169 h ou 167 h aux changements d’heure', () => {
    const w = weeklyWindow(new Date('2026-10-26T07:00:00Z'));
    assert.equal(w.monday, '2026-10-26');
    assert.equal(w.start.toISOString(), '2026-10-18T22:00:00.000Z', 'lundi 19 octobre 0 h (UTC+2)');
    assert.equal(w.end.toISOString(), '2026-10-25T23:00:00.000Z', 'lundi 26 octobre 0 h (UTC+1)');
    assert.equal((w.end.getTime() - w.start.getTime()) / 3_600_000, 169);
    assert.equal(w.prevStart.toISOString(), '2026-10-11T22:00:00.000Z');
    const spring = weeklyWindow(new Date('2027-03-29T06:00:00Z'));
    assert.equal((spring.end.getTime() - spring.start.getTime()) / 3_600_000, 167);
    assert.equal(periodLabel(w.from, w.to), 'du lundi 19 au dimanche 25 octobre 2026');
    assert.equal(periodLabel('2026-09-28', '2026-10-04'), 'du lundi 28 septembre au dimanche 4 octobre 2026');
    assert.equal(periodLabel('2026-12-28', '2027-01-03'), 'du lundi 28 décembre 2026 au dimanche 3 janvier 2027');
  });

  /* ---------- Résumé hebdomadaire ---------- */

  /** Base d’une semaine type (semaine du 12 au 18 octobre 2026, envoi le lundi 19 octobre). */
  function seeded(failing: Set<string> = new Set()) {
    let now = Date.parse('2026-10-19T06:05:00Z'); // lundi 8:05 à Paris
    const d = memoryDb(() => now, failing);
    const cur = (day: number, h = 10) => new Date(Date.UTC(2026, 9, 12 + day, h)).toISOString(); // 12 → 18 oct.
    const prev = (day: number) => new Date(Date.UTC(2026, 9, 5 + day, 10)).toISOString();
    d.rows('signups').push({ signed_up_at: cur(0) }, { signed_up_at: cur(3) }, { signed_up_at: cur(6) }, { signed_up_at: prev(1) }, { signed_up_at: '2026-10-19T05:00:00Z' });
    d.rows('stripe_subscriptions').push({ trial_start: cur(1), livemode: true }, { trial_start: cur(2), livemode: false }, { trial_start: prev(2), livemode: true });
    // Cycle des abonnements (9 oct.) : essai converti cette semaine, abonné qui demande la résiliation, essai annulé,
    // essai converti en mode test Stripe (écarté). Débuts d’essai avant les deux semaines : « Essais démarrés » inchangé.
    // Relecture du 9 oct. : essai dont le premier prélèvement a échoué (past_due : pas une conversion), abonnement
    // résilié après impayé (motif payment_failed) et essai résilié après les nouvelles tentatives, sans motif enregistré
    // (aucun des deux n’est une résiliation d’abonné).
    d.rows('stripe_subscriptions').push(
      { subscription_id: 'sub_conv', trial_start: '2026-09-28T10:00:00Z', trial_end: cur(3), status: 'active', livemode: true },
      { subscription_id: 'sub_res', trial_start: null, trial_end: null, status: 'active', cancel_at_period_end: true, canceled_at: cur(4), livemode: true },
      { subscription_id: 'sub_ann', trial_start: '2026-09-30T10:00:00Z', trial_end: cur(5), status: 'trialing', cancel_at_period_end: true, canceled_at: cur(2), livemode: true },
      { subscription_id: 'sub_tst', trial_start: '2026-09-28T10:00:00Z', trial_end: cur(3), status: 'active', livemode: false },
      { subscription_id: 'sub_pd', trial_start: '2026-09-29T10:00:00Z', trial_end: cur(4), status: 'past_due', livemode: true },
      { subscription_id: 'sub_imp', trial_start: null, trial_end: null, status: 'canceled', cancel_at_period_end: false, canceled_at: cur(5), cancellation_reason: 'payment_failed', livemode: true },
      { subscription_id: 'sub_imq', trial_start: '2026-09-21T10:00:00Z', trial_end: '2026-10-05T10:00:00Z', status: 'canceled', cancel_at_period_end: false, canceled_at: cur(1), livemode: true },
    );
    // Mise en route : dernières lectures des agents (un compte sans agent, un agent sans numéro ni appel, un compte actif).
    const act = (userId: string, agents: number, withNumber: number, realCalls: number | null, lastCallAt: string | null, readAt = '2026-10-18T03:00:00Z') =>
      ({ id: randomUUID(), kind: 'activite_compte', external_id: `${userId}:${readAt.slice(0, 10)}`, created_at: readAt, variables: { userId, readAt, agents, agentsWithNumber: withNumber, phoneNumbers: withNumber, paused: [], realCalls, lastCallAt, callsSince: '2026-09-03T03:00:00Z' } });
    d.rows('call_events').push(act('1', 1, 1, 3, '2026-10-10T10:00:00Z', '2026-10-17T03:00:00Z'), act('1', 0, 0, null, null), act('2', 1, 0, 0, null), act('3', 2, 1, 5, '2026-10-17T10:00:00Z'));
    // E-mails des séries A et S (envoi réel) ; un envoi simulé écarté.
    d.rows('relance_log').push(
      { id: randomUUID(), sequence: 'A', step: 'A1', status: 'sent', dry_run: false, created_at: cur(1) },
      { id: randomUUID(), sequence: 'A', step: 'A2', status: 'sent', dry_run: false, created_at: prev(1) },
      { id: randomUUID(), sequence: 'S', step: 'S1@2026-10-10', status: 'sent', dry_run: false, created_at: cur(2) },
      { id: randomUUID(), sequence: 'A', step: 'A3', status: 'dry_run', dry_run: true, created_at: cur(2) },
    );
    const pay = (external_id: string, status: string, at: string, v: Any, outcome = 'invoice.paid') =>
      ({ id: randomUUID(), kind: PAYMENT_KIND, external_id, status, outcome, created_at: at, variables: { livemode: true, customer: 'cus_1', ...v } });
    d.rows('call_events').push(
      pay('in_a', 'recu', cur(1), { amount: 9900, currency: 'usd' }), pay('in_a', 'recu', cur(1), { amount: 9900, currency: 'usd' }),
      pay('pi_b', 'recu', cur(2), { amount: 4900, currency: 'eur', customer: 'cus_2' }, 'payment_intent.succeeded'),
      pay('in_c', 'recu', prev(3), { amount: 9900, currency: 'usd' }),
      pay('in_d#1', 'echec', cur(4), { amount: 24900, currency: 'usd', customer: 'cus_3', final: false }, 'invoice.payment_failed'),
      pay('in_d#2', 'echec', cur(5), { amount: 24900, currency: 'usd', customer: 'cus_3', final: true }, 'invoice.payment_failed'),
      { id: randomUUID(), kind: 'call', assistant_name: 'Jade', customer_phone: '+33612345678', status: 'completed', duration_seconds: 180, created_at: cur(2, 14) },
      { id: randomUUID(), kind: 'call', assistant_name: '<script>x</script>', customer_phone: '+447700900123', status: 'no-answer', duration_seconds: 0, created_at: cur(3) },
      { id: randomUUID(), kind: 'call', assistant_name: 'Hugo', customer_phone: '+33700000000', status: 'completed', duration_seconds: 120, created_at: prev(2) },
      { id: randomUUID(), kind: 'conversation', assistant_name: 'Lucie', customer_phone: null, status: null, created_at: cur(4) },
      { id: randomUUID(), kind: 'optout', customer_phone: '+33611111111', outcome: 'ne_plus_appeler', created_at: cur(5) },
      { id: randomUUID(), kind: 'email', outcome: 'copie_conversation', status: 'envoyee', created_at: cur(5) },
      { id: randomUUID(), kind: 'email', outcome: 'copie_conversation', status: 'echec', created_at: cur(5) },
      { id: randomUUID(), kind: 'email_pref', outcome: 'essential_only', created_at: cur(5) },
    );
    // E-mails laissés sur /essai-gratuit : un sans inscription, un inscrit lundi matin (après la semaine), un la semaine d’avant.
    d.rows('contacts').push(
      { id: randomUUID(), email: 'leo@exemple.fr', origin: 'trial_signup', last_interaction_at: cur(1) },
      { id: randomUUID(), email: 'Zoe@Exemple.fr', origin: 'trial_signup', last_interaction_at: cur(6) },
      { id: randomUUID(), email: 'max@exemple.fr', origin: 'trial_signup', last_interaction_at: prev(2) },
      { id: randomUUID(), email: 'eva@exemple.fr', origin: 'callback', last_interaction_at: cur(2) },
      // Cliente inscrite en septembre, revenue retaper son e-mail sur /essai-gratuit : jamais « sans inscription ».
      { id: randomUUID(), email: 'ana@exemple.fr', origin: 'trial_signup', last_interaction_at: cur(4) },
    );
    d.rows('signups').push({ email: 'zoe@exemple.fr', signed_up_at: '2026-10-19T05:30:00Z' }, { email: 'Ana@Exemple.fr', signed_up_at: '2026-09-01T10:00:00Z' });
    d.rows('callbacks').push(
      { phone: '+33612345678', type: 'commercial', status: 'scheduled', created_at: cur(2, 9) }, // rappelée à 14 h : faite
      { phone: '+447700900123', type: 'commercial', status: 'pending', created_at: cur(2) }, // pas décroché : en attente
      { phone: '+33622222222', type: 'support', status: 'done', created_at: cur(3) },
      { phone: '+33633333333', type: 'commercial', status: 'cancelled', created_at: cur(4) },
      { phone: '+33644444444', type: 'commercial', status: 'lead', created_at: cur(4) },
      { phone: '+33655555555', type: 'commercial', status: 'pending', created_at: prev(4) },
    );
    const sent: { subject: string; text: string; html: string }[] = [];
    let failNext = 0;
    const deps = {
      select: d.select, insert: d.insert, update: d.update, log: () => undefined,
      notifyTeam: async (subject: string, text: string, html: string) => { if (failNext > 0) { failNext--; throw new Error('SMTP indisponible'); } sent.push({ subject, text, html }); },
      now: () => new Date(now),
    };
    return { d, deps, sent, setNow: (iso: string) => { now = Date.parse(iso); }, failTimes: (n: number) => { failNext = n; } };
  }

  await test('résumé : chiffres de la semaine, semaine précédente entre parenthèses, HTML échappé', async () => {
    const { deps, sent } = seeded();
    assert.equal(await sendWeeklyIfDue(deps), 'sent');
    assert.equal(sent.length, 1);
    const { subject, html } = sent[0];
    const text = sp(sent[0].text);
    assert.equal(subject, 'Résumé de la semaine du lundi 12 au dimanche 18 octobre 2026');
    assert.match(text, /Nouveaux comptes \(inscriptions\) : 3 \(1\)/, 'inscription du lundi matin hors semaine');
    assert.match(text, /Essais démarrés : 1 \(1\)/, 'essai du mode test Stripe écarté');
    assert.match(text, /E-mails laissés sur \/essai-gratuit sans inscription à ce jour : 1 \(1\)/, 'inscrit depuis, ou avant la période : non compté');
    assert.match(text, /Paiements reçus : 2 \(1\) — total 49,00 € \+ 99,00 \$US \(99,00 \$US\)/);
    assert.match(text, /Paiements échoués : 2 \(0\) — 1 client, dont impayé définitif \(dernière tentative\) : 1/);
    assert.match(text, /Appels téléphoniques : 2 \(1\) — 3 min au total/);
    assert.match(text, /Conversations écrites \(widget, WhatsApp, Messenger, espace client\) : 1 \(0\)/);
    assert.match(text, /Créées : 4 \(1\), dont support : 1/);
    assert.match(text, /Faites : 2 ; en attente : 1 ; annulées : 1/);
    assert.match(text, /Fiches prospect enregistrées par les agents : 1 \(0\)/);
    assert.match(text, /Oppositions « ne plus appeler » : 1 \(0\)/);
    assert.match(text, /Copies de conversation envoyées : 1 \(0\)/);
    // Compléments du 9 oct. : cycle des abonnements et mise en route.
    assert.match(text, /Essais devenus payants : 1 \(0\)/, 'premier prélèvement refusé (past_due) : pas une conversion');
    assert.match(text, /Résiliations d’abonnés \(demandées ou effectives\) : 1 \(0\)/, 'résiliations après impayé écartées');
    assert.match(text, /Essais annulés : 1 \(0\)/);
    assert.match(text, /Abonnés payants à ce jour : 3 \(dont résiliation programmée : 1\)/, 'impayé en cours compris');
    assert.match(text, /MISE EN ROUTE \(À CE JOUR\)/);
    assert.match(text, /Comptes suivis \(essai, abonné, paiement à la minute\) : 3 ; sans agent : 1 ; agent sans numéro relié : 1 ; sans appel réel depuis 30 jours : 1 ; agents en pause \(conformité\) : 0/);
    assert.match(text, /E-mails de mise en route envoyés \(A1 à A4, suivi mensuel\) : 1 \(1\)/);
    assert.match(text, /Alertes de solde envoyées aux clients \(minutes basses ou épuisées\) : 1 \(0\)/);
    assert.doesNotMatch(text, /indisponible/);
    assert.match(html, /&lt;script&gt;x&lt;\/script&gt; 1/);
    assert.doesNotMatch(html, /<script>/);
  });

  await test('envoi unique : passages suivants du lundi, mardi, puis semaine suivante', async () => {
    const { d, deps, sent, setNow } = seeded();
    assert.equal(await sendWeeklyIfDue(deps), 'sent');
    setNow('2026-10-19T07:05:00Z');
    assert.equal(await sendWeeklyIfDue(deps), 'already_sent');
    setNow('2026-10-20T06:05:00Z');
    assert.equal(await sendWeeklyIfDue(deps), 'not_due');
    setNow('2026-10-19T05:05:00Z');
    assert.equal(await sendWeeklyIfDue(deps), 'not_due', 'lundi 7:05 : trop tôt');
    assert.equal(sent.length, 1);
    const row = d.rows('call_events').find((r) => r.kind === WEEKLY_KIND);
    assert.equal(row?.external_id, 'semaine-2026-10-19');
    assert.equal(row?.status, 'envoye');
    setNow('2026-10-26T07:05:00Z'); // lundi suivant, heure d’hiver
    assert.equal(await sendWeeklyIfDue(deps), 'sent');
    assert.equal(sent[1].subject, 'Résumé de la semaine du lundi 19 au dimanche 25 octobre 2026');
  });

  await test('envoi unique : deux instances en même temps → un seul résumé', async () => {
    const { d, deps, sent } = seeded();
    // Une autre instance a réservé juste avant (ligne plus ancienne) pendant que celle-ci vérifiait.
    const insert = deps.insert;
    const racing = {
      ...deps,
      insert: async (table: string, row: Any) => {
        d.rows('call_events').push({ id: '00000000-0000-0000-0000-000000000000', kind: WEEKLY_KIND, external_id: row.external_id, status: 'en_cours', created_at: '2026-10-19T06:04:59.000Z' });
        return insert(table, row);
      },
    };
    assert.equal(await sendWeeklyIfDue(racing), 'duplicate');
    assert.equal(sent.length, 0);
    assert.equal(d.rows('call_events').filter((r) => r.kind === WEEKLY_KIND && r.status === 'doublon').length, 1);
  });

  await test('envoi en échec : nouvel essai au passage suivant, 3 essais au plus, jamais en boucle', async () => {
    const { d, deps, sent, setNow, failTimes } = seeded();
    failTimes(1);
    assert.equal(await sendWeeklyIfDue(deps), 'failed');
    setNow('2026-10-19T07:05:00Z');
    assert.equal(await sendWeeklyIfDue(deps), 'sent', 'deuxième passage du lundi');
    assert.equal(sent.length, 1);
    const other = seeded();
    other.failTimes(10);
    for (const h of ['06', '07', '08']) { other.setNow(`2026-10-19T${h}:05:00Z`); assert.equal(await sendWeeklyIfDue(other.deps), 'failed'); }
    other.setNow('2026-10-19T09:05:00Z');
    assert.equal(await sendWeeklyIfDue(other.deps), 'gave_up');
    assert.equal(other.d.rows('call_events').filter((r) => r.kind === WEEKLY_KIND && r.status === 'echec').length, 3);
    assert.ok(d.rows('call_events').some((r) => r.kind === WEEKLY_KIND && r.status === 'echec'));
  });

  await test('réservation restée « en_cours » (instance arrêtée pendant l’envoi) : nouvel essai après 30 min', async () => {
    const { d, deps, sent, setNow } = seeded();
    d.rows('call_events').push({ id: randomUUID(), kind: WEEKLY_KIND, external_id: 'semaine-2026-10-19', status: 'en_cours', created_at: '2026-10-19T06:05:00.000Z' });
    setNow('2026-10-19T06:20:00Z');
    assert.equal(await sendWeeklyIfDue(deps), 'already_sent', 'moins de 30 min : envoi peut-être encore en cours');
    setNow('2026-10-19T07:05:00Z');
    assert.equal(await sendWeeklyIfDue(deps), 'sent');
    assert.equal(sent.length, 1);
    assert.equal(d.rows('call_events').filter((r) => r.kind === WEEKLY_KIND && r.status === 'echec').length, 1, 'réservation interrompue comptée comme un essai');
  });

  await test('section manquante : table absente → « donnée indisponible », le reste part', async () => {
    const { d, deps, sent } = seeded(new Set(['signups', 'callbacks']));
    assert.equal(await sendWeeklyIfDue(deps), 'sent');
    const text = sp(sent[0].text);
    assert.match(text, /Nouveaux comptes \(inscriptions\) : donnée indisponible/);
    assert.match(text, /Demandes de rappel : donnée indisponible/);
    assert.match(text, /E-mails laissés sur \/essai-gratuit sans inscription à ce jour : donnée indisponible/, 'inscriptions illisibles : pas de chiffre faux');
    assert.match(text, /Essais démarrés : 1 \(1\)/);
    assert.match(text, /Paiements reçus : 2 \(1\)/);
    assert.match(String(d.rows('call_events').find((r) => r.kind === WEEKLY_KIND)?.summary), /3 donnée\(s\) indisponible\(s\)/);
  });

  await test('résumé sans la colonne cancellation_reason (migration pas encore exécutée) : relu sans elle, impayé reconnu à ses dates', async () => {
    const { d, deps, sent } = seeded();
    // La colonne absente fait échouer la lecture qui la cite (PostgREST 400) : seconde lecture sans elle.
    const select = d.select;
    const ask: string[] = [];
    // (La base en mémoire ignore select= : la colonne est retirée des lignes renvoyées, comme sur une base sans migration.)
    const quiet = {
      ...deps,
      select: async <T,>(table: string, query: string) => {
        if (table === 'stripe_subscriptions') ask.push(query);
        if (query.includes('cancellation_reason')) throw new Error('Supabase stripe_subscriptions 400: column stripe_subscriptions.cancellation_reason does not exist');
        return (await select<Any>(table, query)).map(({ cancellation_reason: _, ...r }) => r) as T[];
      },
    };
    const logs: string[] = [];
    assert.equal(await sendWeeklyIfDue({ ...quiet, log: (m: string) => logs.push(m) }), 'sent');
    const text = sp(sent[0].text);
    assert.ok(ask.some((q) => q.includes('cancellation_reason')) && ask.some((q) => q.startsWith('select=status,trial_end,canceled_at,cancel_at_period_end,livemode')));
    assert.ok(!logs.some((m) => /stripe_subscriptions illisible/.test(m)), 'échec attendu : non journalisé');
    // Sans motif, l’abonné résilié après impayé (sans essai) compte encore ; l’essai résilié après les tentatives non.
    assert.match(text, /Résiliations d’abonnés \(demandées ou effectives\) : 2 \(0\)/);
    assert.match(text, /Abonnés payants à ce jour : 3/);
  });

  await test('base illisible pour la réservation : rien n’est envoyé (pas de résumé en boucle)', async () => {
    const { deps, sent } = seeded(new Set(['call_events']));
    assert.equal(await sendWeeklyIfDue(deps), 'unavailable');
    assert.equal(sent.length, 0);
  });

  /* ---------- Routes (fetch simulé : aucune requête ne sort, SMTP non configuré) ---------- */

  const { Readable } = await import('node:stream');
  const { createHmac, randomBytes } = await import('crypto');
  const realFetch = globalThis.fetch;
  const requests: string[] = [];
  process.env.SUPABASE_URL = 'https://base.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_test';
  globalThis.fetch = (async (url: unknown, init: Any = {}) => {
    const method = init.method || 'GET';
    requests.push(`${method} ${url}`);
    if (!String(url).startsWith('https://base.invalid/')) throw new Error(`réseau interdit en test : ${url}`);
    // Supabase : insertion « si nouvelle » → ligne créée ; lectures → vide.
    const body = method === 'POST' && String(url).includes('on_conflict') ? [JSON.parse(init.body)] : [];
    return new Response(JSON.stringify(body), { status: method === 'POST' ? 201 : 200 });
  }) as typeof fetch;
  const mockRes = () => {
    const r: Any = { code: 0, body: null, headers: {} };
    r.status = (c: number) => { r.code = c; return r; };
    r.json = (b: unknown) => { r.body = b; return r; };
    r.setHeader = (k: string, v: string) => { r.headers[k] = v; };
    return r;
  };
  const errors: string[] = [];
  const realError = console.error;
  console.error = (...a: unknown[]) => { errors.push(a.map(String).join(' ')); };
  try {
    await test('webhook Stripe : email d’alerte impossible → réponse 200 quand même, erreur journalisée', async () => {
      process.env.STRIPE_WEBHOOK_SECRET = `whsec_${randomBytes(16).toString('hex')}`;
      const { default: stripeHook } = await import('@/pages/api/webhooks/stripe');
      const body = JSON.stringify(failed('evt_route', 'in_route', 1, nextTry));
      const t = Math.floor(Date.now() / 1000);
      const sig = createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET).update(`${t}.${body}`).digest('hex');
      const req = Object.assign(Readable.from([Buffer.from(body)]), { method: 'POST', headers: { 'stripe-signature': `t=${t},v1=${sig}` } });
      const res = mockRes();
      await stripeHook(req as any, res as any);
      assert.equal(res.code, 200);
      assert.deepEqual(res.body, { received: true, handled: true });
      assert.ok(errors.some((e) => /alerte « Paiement échoué.*non envoyée.*SMTP Zoho non configuré/.test(e)));
      assert.ok(requests.some((r) => /POST https:\/\/base\.invalid\/rest\/v1\/stripe_events\?on_conflict=event_id/.test(r)), 'verrou d’alerte posé');
      assert.ok(requests.some((r) => r === 'POST https://base.invalid/rest/v1/call_events'), 'journal des paiements');
    });

    await test('route planifiée : relances coupées → le résumé hebdomadaire est quand même examiné, réponse 200', async () => {
      process.env.CRON_SECRET = randomBytes(24).toString('hex');
      delete process.env.RELANCES_ENABLED;
      const { default: cron } = await import('@/pages/api/cron/relances');
      const res = mockRes();
      await cron({ method: 'POST', headers: { 'x-cron-token': process.env.CRON_SECRET }, body: {} } as any, res as any);
      assert.equal(res.code, 200);
      assert.equal(res.body.status, 'disabled');
      // Selon le jour où le test tourne : pas encore dû, ou dû mais email impossible (SMTP non configuré).
      assert.ok(['not_due', 'failed'].includes(res.body.weekly), `résumé : ${res.body.weekly}`);
    });
  } finally {
    console.error = realError;
    globalThis.fetch = realFetch;
  }

  console.log(`\n${passed} tests réussis, aucun envoi réel.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
