// Paiements Stripe suivis pour l’équipe, appelés par applyStripeEvent (src/lib/relances/stripe.ts) :
// - journal des paiements reçus et échoués, sans changement de schéma, dans call_events (kind 'stripe_paiement', comme
//   email_pref ou optout) : external_id = facture (in_…, « in_…#tentative » pour un échec) ou paiement (pi_…), status
//   'recu' ou 'echec', variables = montant (plus petite unité de la devise), devise, client, mode réel. Stripe peut
//   renvoyer un événement : les doublons sont écartés à la lecture (résumé hebdomadaire, src/lib/relances/weekly.ts) ;
// - alertes à l’équipe : paiement échoué (une par facture et par tentative) ; impayé définitif (dernière tentative
//   échouée, abonnement passé en « unpaid » ou résilié après impayé), une seule par facture quel que soit l’événement
//   arrivé le premier. Verrou posé AVANT l’envoi : ligne stripe_events « alerte:… » (insertIfNew). Un envoi en échec
//   est journalisé, jamais remonté : le webhook répond 200 et Stripe ne renvoie pas l’événement.
// Le passage en « past_due » n’a pas d’alerte à part : il arrive avec le premier échec, déjà signalé.
import { esc } from '@/lib/server';

export const PAYMENT_KIND = 'stripe_paiement';
/** Compte Stripe Permanence IA (liens vers le tableau de bord), docs/relances/conception-2026-10-08.md. */
export const STRIPE_ACCOUNT = 'acct_1UNBLcBjFUxnZPfW';
const PARIS = 'Europe/Paris';

/** Équipe prévenue (NOTIFY_TO, email interne) ; texte et HTML déjà échappé. */
export type TeamNotify = (subject: string, text: string, html: string) => Promise<void>;

export interface PaymentDb {
  insertIfNew: (table: string, row: Record<string, unknown>, onConflict: string) => Promise<boolean>;
  select: <T>(table: string, query: string) => Promise<T[]>;
  /** Journal des paiements (call_events) ; absent : rien n’est journalisé. */
  insert?: (table: string, row: Record<string, unknown>) => Promise<unknown>;
}

interface Ctx { db: PaymentDb; notify?: TeamNotify; livemode: boolean; account?: string }

// Devises sans décimale ou à trois décimales chez Stripe (montants de l’API dans la plus petite unité).
const ZERO_DECIMAL = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'];
const THREE_DECIMAL = ['bhd', 'jod', 'kwd', 'omr', 'tnd'];

/** Montant Stripe (plus petite unité) lisible : 9900 usd → « 99,00 $US », 1500 jpy → « 1 500 JPY ». */
export function formatAmount(minor: number, currency: string | null | undefined) {
  const cur = String(currency ?? '').toLowerCase();
  const digits = ZERO_DECIMAL.includes(cur) ? 0 : THREE_DECIMAL.includes(cur) ? 3 : 2;
  const value = (Number(minor) || 0) / 10 ** digits;
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur.toUpperCase(), minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  } catch {
    // Devise absente ou inconnue : montant brut et code tel quel, jamais d’erreur.
    return `${value.toFixed(digits).replace('.', ',')} ${cur.toUpperCase() || '(devise inconnue)'}`;
  }
}

/** Date et heure à Paris (« vendredi 16 octobre 2026 à 14:30 »). */
export const parisDateTime = (at: Date) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: PARIS, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).format(at);

/** Fiche du client dans le tableau de bord du compte Permanence IA (mode test : préfixe /test). */
export const dashboardCustomerUrl = (customer: string, livemode: boolean, account = STRIPE_ACCOUNT) =>
  `https://dashboard.stripe.com/${account}/${livemode ? '' : 'test/'}customers/${encodeURIComponent(customer)}`;

const str = (v: unknown) => (typeof v === 'string' && v ? v : null);
const idOf = (v: any) => (typeof v === 'string' ? v : str(v?.id));
const attr = (s: string) => esc(s).replace(/"/g, '&quot;');

export interface TeamMail { subject: string; text: string; html: string }
type Row = [label: string, value: string, href?: string | null];

/** Lignes « libellé : valeur » en texte, et la même liste en HTML échappé (liens cliquables). */
function teamMail(subject: string, rows: Row[], closing: string): TeamMail {
  return {
    subject,
    text: [...rows.map(([k, v]) => `${k} : ${v}`), '', closing].join('\n'),
    html: `<ul>${rows.map(([k, v, href]) => `<li><b>${esc(k)}</b> : ${href ? `<a href="${attr(href)}">${esc(v)}</a>` : esc(v)}</li>`).join('')}</ul><p>${esc(closing)}</p>`,
  };
}

interface Who { name?: string | null; email?: string | null; customer?: string | null; livemode: boolean; account?: string }
const whoLabel = (w: Who) => [w.name, w.email].filter(Boolean).join(' — ') || 'inconnu (voir la fiche Stripe)';
const whoShort = (w: Who) => w.name || w.email || w.customer || 'client inconnu';
const customerRow = (w: Who): Row[] => (w.customer ? [['Client dans Stripe', dashboardCustomerUrl(w.customer, w.livemode, w.account), dashboardCustomerUrl(w.customer, w.livemode, w.account)]] : []);
const testMark = (w: Who) => (w.livemode ? '' : ' [mode test Stripe]');

export interface FailedInvoice { id: string; number: string | null; amount: number; currency: string | null; attempt: number; next: Date | null; final?: boolean; url: string | null }

/** Alerte « paiement échoué » ; sans prochaine tentative : impayé définitif (`final`) ou paiement refusé jamais réessayé. */
export function paymentFailedMail(i: FailedInvoice, w: Who): TeamMail {
  const amount = formatAmount(i.amount, i.currency);
  const rows: Row[] = [
    ['Client', whoLabel(w)],
    ['Montant', amount],
    ['Tentative', `n° ${i.attempt}`],
    ['Prochaine tentative', i.next ? `${parisDateTime(i.next)} (heure de Paris)` : i.final ? 'aucune : Stripe ne réessaiera plus' : 'aucune tentative automatique'],
    i.url ? [`Facture${i.number ? ` ${i.number}` : ''}`, i.url, i.url] : ['Facture', `${i.number ?? i.id} (lien indisponible)`],
    ...customerRow(w),
  ];
  if (!i.next && !i.final) {
    return teamMail(`Paiement refusé : ${amount} — ${whoShort(w)}${testMark(w)}`, rows,
      'Stripe ne réessaie pas ce paiement (premier paiement à l’inscription, ou facture à régler par le client) : le client doit payer ou mettre à jour sa carte.');
  }
  return i.next
    ? teamMail(`Paiement échoué : ${amount} — ${whoShort(w)} (tentative ${i.attempt})${testMark(w)}`, rows,
      'Stripe relance automatiquement le client ; rien à faire sauf si cela se répète.')
    : teamMail(`Impayé définitif : ${amount} — ${whoShort(w)}${testMark(w)}`, rows,
      'C’était la dernière tentative automatique : selon le réglage Stripe, l’abonnement est résilié ou passe en impayé. Contacter le client.');
}

/** Alerte « abonnement impayé » (statut unpaid) ou « résilié après impayé ». */
export function subscriptionUnpaidMail(s: { id: string; deleted: boolean; amount: number | null; currency: string | null; invoice: string | null }, w: Who): TeamMail {
  const rows: Row[] = [
    ['Client', whoLabel(w)],
    ['Abonnement', s.id],
    ...(s.amount ? [['Prix du forfait', formatAmount(s.amount, s.currency)] as Row] : []),
    ...(s.invoice ? [['Facture impayée', s.invoice] as Row] : []),
    ...customerRow(w),
  ];
  return s.deleted
    ? teamMail(`Abonnement résilié après impayé — ${whoShort(w)}${testMark(w)}`, rows,
      'Stripe a résilié l’abonnement après des paiements échoués. Contacter le client si vous souhaitez le garder.')
    : teamMail(`Abonnement impayé — ${whoShort(w)}${testMark(w)}`, rows,
      'Stripe a arrêté les tentatives et l’abonnement est marqué impayé. Contacter le client pour qu’il mette à jour sa carte.');
}

/** Verrou d’alerte : vrai seulement la première fois pour cette clé. livemode null : jamais compté comme un
 *  événement Stripe reçu (stripe.eventsSeen du moteur des relances). */
const claim = (db: PaymentDb, key: string) =>
  db.insertIfNew('stripe_events', { event_id: `alerte:${key}`, type: 'alerte_equipe', livemode: null, created_at: new Date().toISOString() }, 'event_id');

/** Au-delà, la réponse au webhook n’attend plus l’email (réponse visée sous 10 s ; Stripe renverrait l’événement). */
export const NOTIFY_TIMEOUT_MS = 5_000;

async function send(notify: TeamNotify | undefined, m: TeamMail) {
  if (!notify) return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      notify(m.subject, m.text, m.html),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`délai de ${NOTIFY_TIMEOUT_MS / 1000} s dépassé, envoi peut-être encore en cours`)), NOTIFY_TIMEOUT_MS); }),
    ]);
  } catch (e: any) {
    console.error(`[stripe] alerte « ${m.subject} » non envoyée :`, e?.message);
  } finally { clearTimeout(timer); }
}

async function journal(db: PaymentDb, row: Record<string, unknown>) {
  if (!db.insert) return;
  try { await db.insert('call_events', { kind: PAYMENT_KIND, ...row }); } catch (e: any) { console.error('[stripe] journal des paiements :', e?.message); }
}

/** Email connu du client (fiche stripe_customers), pour l’alerte. */
async function knownEmail(db: PaymentDb, customer: string) {
  const rows = await db.select<{ email: string | null }>('stripe_customers', `select=email&customer_id=eq.${encodeURIComponent(customer)}`).catch(() => []);
  return rows[0]?.email ?? null;
}

/** Paiement reçu (facture payée, achat par Checkout, paiement hors facture) : ligne du journal, montant > 0 seulement. */
export async function recordPayment(db: PaymentDb, p: { id: string | null; source: string; amount: number; currency: string | null; customer: string | null; livemode: boolean }) {
  if (!p.id || !(p.amount > 0) || !p.currency) return;
  await journal(db, {
    external_id: p.id, status: 'recu', outcome: p.source, summary: `Paiement reçu : ${formatAmount(p.amount, p.currency)}`,
    variables: { amount: p.amount, currency: p.currency.toLowerCase(), customer: p.customer, livemode: p.livemode },
  });
}

/** invoice.payment_failed : journal, puis alerte (une par facture et par tentative ; dernière tentative = impayé définitif). */
export async function onPaymentFailed(inv: any, ctx: Ctx) {
  const id = str(inv?.id);
  if (!id) return;
  const attempt = Math.max(1, Number(inv.attempt_count) || 1);
  const next = typeof inv.next_payment_attempt === 'number' && inv.next_payment_attempt > 0 ? new Date(inv.next_payment_attempt * 1000) : null;
  // Sans nouvelle tentative, impayé définitif seulement pour un prélèvement automatique d’un abonnement déjà en place :
  // la première facture refusée à l’inscription et une facture à régler par le client ne sont jamais réessayées.
  const final = !next && inv.billing_reason !== 'subscription_create' && (inv.collection_method ?? 'charge_automatically') === 'charge_automatically';
  const amount = Number(inv.amount_remaining ?? inv.amount_due) || 0;
  const currency = str(inv.currency);
  const customer = idOf(inv.customer);
  await journal(ctx.db, {
    external_id: `${id}#${attempt}`, status: 'echec', outcome: 'invoice.payment_failed',
    summary: `Paiement échoué : ${formatAmount(amount, currency)} (tentative ${attempt}${final ? ', dernière' : ''})`,
    variables: { amount, currency: currency?.toLowerCase() ?? null, customer, invoice: id, attempt, final, livemode: ctx.livemode },
  });
  // Dernière tentative : clé partagée avec la résiliation ou le passage en impayé de l’abonnement, qui arrivent au
  // même moment dans un ordre quelconque (une seule alerte « impayé » par facture).
  if (!(await claim(ctx.db, final ? `impaye:${id}` : `paiement_echoue:${id}:${attempt}`))) return;
  const email = str(inv.customer_email)?.toLowerCase() ?? (customer ? await knownEmail(ctx.db, customer) : null);
  await send(ctx.notify, paymentFailedMail(
    { id, number: str(inv.number), amount, currency, attempt, next, final, url: str(inv.hosted_invoice_url) },
    { name: str(inv.customer_name), email, customer, livemode: ctx.livemode, account: ctx.account },
  ));
}

/**
 * customer.subscription.updated vers « unpaid », ou customer.subscription.deleted après impayé (motif payment_failed,
 * ou statut enregistré past_due / unpaid juste avant) : une alerte, sauf si la dernière tentative échouée de la même
 * facture l’a déjà donnée. `before` : statut enregistré avant cet événement.
 */
export async function onSubscriptionChange(sub: any, type: string, before: string | null, ctx: Ctx & { amount: number | null; currency: string | null }) {
  const id = str(sub?.id);
  if (!id) return;
  const deleted = type === 'customer.subscription.deleted'
    && (sub.cancellation_details?.reason === 'payment_failed'
      // Sans motif seulement : une résiliation demandée par le client (cancellation_requested) n’est pas un impayé.
      || (!sub.cancellation_details?.reason && (before === 'past_due' || before === 'unpaid')));
  const unpaid = type === 'customer.subscription.updated' && sub.status === 'unpaid';
  if (!deleted && !unpaid) return;
  const invoice = idOf(sub.latest_invoice);
  if (!(await claim(ctx.db, `impaye:${invoice ?? id}`))) return;
  const customer = idOf(sub.customer);
  const email = customer ? await knownEmail(ctx.db, customer) : null;
  await send(ctx.notify, subscriptionUnpaidMail(
    { id, deleted, amount: ctx.amount, currency: ctx.currency, invoice },
    { email, customer, livemode: ctx.livemode, account: ctx.account },
  ));
}
