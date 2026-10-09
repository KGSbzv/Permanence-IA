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
// - essai annulé par le client (ajouté le 9 oct.) : fin programmée pendant l’essai, ou résiliation immédiate avant la
//   fin de l’essai ; une seule alerte par abonnement (verrou « alerte:essai_annule:… »), motif saisi s’il existe ;
// - moments clés (audit du 9 oct., action 7) : essai démarré, abonnement payant (essai converti ou abonnement direct),
//   résiliation demandée par un abonné (fin programmée) ou résiliation sans fin programmée, premier achat de crédit ;
//   une seule alerte par abonnement et par moment (par client pour l’achat), jamais pour un impayé ni un essai annulé.
//   Sur un changement réel seulement (relecture du 9 oct.) : Stripe envoie customer.subscription.updated à chaque
//   renouvellement, et les abonnés déjà là au déploiement n’ont jamais eu d’alerte. Essai démarré : création de
//   l’abonnement en essai ; abonnement direct : création « active » ou passage d’« incomplete » à « active » (attributs
//   précédents de l’événement) ; essai converti : paiement de la première facture qui suit l’essai (invoice.paid), car
//   Stripe passe l’abonnement en « active » environ une heure avant le prélèvement, qui peut encore échouer.
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
export type Row = [label: string, value: string, href?: string | null];

/** Lignes « libellé : valeur » en texte, et la même liste en HTML échappé (liens cliquables). Partagé avec les alertes
 *  de mise en route (src/lib/relances/onboarding.ts). */
export function teamMail(subject: string, rows: Row[], closing: string): TeamMail {
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

/**
 * Alerte « essai annulé » : fin d’essai, forfait, motif saisi dans le portail Stripe s’il existe. `ended` : abonnement
 * déjà résilié (résiliation immédiate, ou constatée à la fin de l’essai) ; le client passe alors en série F et reçoit
 * F1, jamais C5_cancelled. Sinon (fin programmée), C5 lui confirme qu’aucun débit n’aura lieu.
 */
export function trialCancelledMail(t: { id: string; trialEnd: Date | null; immediate: boolean; ended: boolean; amount: number | null; currency: string | null; interval: string | null; feedback: string | null; comment: string | null }, w: Who): TeamMail {
  const rows: Row[] = [
    ['Client', whoLabel(w)],
    ['Abonnement', t.id],
    ...(t.amount ? [['Forfait', `${formatAmount(t.amount, t.currency)}${t.interval === 'year' ? ' par an' : t.interval === 'month' ? ' par mois' : ''}`] as Row] : []),
    ['Fin de l’essai', t.immediate ? 'immédiate (résilié avant la fin)' : t.trialEnd ? `${parisDateTime(t.trialEnd)} (heure de Paris)` : 'inconnue'],
    ...(t.feedback || t.comment ? [['Motif indiqué', [t.feedback, t.comment].filter(Boolean).join(' — ')] as Row] : []),
    ...customerRow(w),
  ];
  return teamMail(`Essai annulé — ${whoShort(w)}${testMark(w)}`, rows, t.ended
    ? 'Rien n’a été débité. L’abonnement est déjà résilié : le client reçoit F1 (essai terminé sans abonnement), pas C5. Vous pouvez le contacter pour comprendre ce qui a manqué.'
    : 'Rien ne sera débité. Les e-mails d’aide à l’essai (C2 à C4) sont arrêtés ; C5 confirme au client qu’aucun débit n’aura lieu. Vous pouvez le contacter pour comprendre ce qui a manqué.');
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

/**
 * Essai annulé par le client : abonnement encore « trialing » avec une fin programmée (cancel_at_period_end, ou
 * cancel_at au plus tard un jour après la fin de l’essai), ou résilié au plus tard à la fin de l’essai pour un autre
 * motif qu’un paiement refusé. Une seule alerte par abonnement, quel que soit l’événement reçu le premier.
 */
export async function onTrialCancelled(sub: any, type: string, ctx: Ctx & { amount: number | null; currency: string | null; interval: string | null }) {
  const id = str(sub?.id);
  const trialEnd = typeof sub?.trial_end === 'number' && sub.trial_end > 0 ? new Date(sub.trial_end * 1000) : null;
  if (!id || !trialEnd) return;
  const cancelAt = typeof sub.cancel_at === 'number' && sub.cancel_at > 0 ? sub.cancel_at * 1000 : null;
  const scheduled = type !== 'customer.subscription.deleted' && sub.status === 'trialing'
    && (Boolean(sub.cancel_at_period_end) || (cancelAt != null && cancelAt <= trialEnd.getTime() + 86_400_000));
  // Résiliation au plus tard à la fin de l’essai (filet de sécurité si l’événement de fin programmée a manqué).
  const endedAt = typeof sub.ended_at === 'number' && sub.ended_at > 0 ? sub.ended_at * 1000 : null;
  const ended = type === 'customer.subscription.deleted' && sub.cancellation_details?.reason !== 'payment_failed'
    && endedAt != null && endedAt <= trialEnd.getTime() + 60_000;
  const immediate = ended && endedAt! < trialEnd.getTime() - 60_000;
  if (!scheduled && !ended) return;
  if (!(await claim(ctx.db, `essai_annule:${id}`))) return;
  const customer = idOf(sub.customer);
  const email = customer ? await knownEmail(ctx.db, customer) : null;
  await send(ctx.notify, trialCancelledMail(
    { id, trialEnd, immediate, ended, amount: ctx.amount, currency: ctx.currency, interval: ctx.interval, feedback: str(sub.cancellation_details?.feedback), comment: str(sub.cancellation_details?.comment)?.slice(0, 300) ?? null },
    { email, customer, livemode: ctx.livemode, account: ctx.account },
  ));
}

/* ---------- Moments clés du cycle client (audit du 9 oct., action 7) ---------- */

type Plan = { amount: number | null; currency: string | null; interval: string | null };
const planRow = (p: Plan): Row[] => (p.amount ? [['Forfait', `${formatAmount(p.amount, p.currency)}${p.interval === 'year' ? ' par an' : p.interval === 'month' ? ' par mois' : ''}`]] : []);
const secs = (v: unknown) => (typeof v === 'number' && v > 0 ? new Date(v * 1000) : null);
/** Fin de la période en cours (format récent : par article ; ancien : sur l’abonnement). */
const periodEnd = (sub: any) => secs(sub?.items?.data?.[0]?.current_period_end ?? sub?.current_period_end);

/** Alerte « essai démarré » : fin de l’essai et forfait choisi. */
export function trialStartedMail(t: Plan & { id: string; trialEnd: Date | null }, w: Who): TeamMail {
  return teamMail(`Essai démarré — ${whoShort(w)}${testMark(w)}`, [
    ['Client', whoLabel(w)], ['Abonnement', t.id], ...planRow(t),
    ['Fin de l’essai', t.trialEnd ? `${parisDateTime(t.trialEnd)} (heure de Paris)` : 'inconnue'], ...customerRow(w),
  ], 'Le site envoie C1 (début d’essai) au premier passage horaire entre 8 h et 20 h (heure locale du client), puis l’aide à la mise en route : A1 à J+1 si aucun agent n’est créé, A2 à J+3 (avec une alerte pour vous), A3 à J+7. Le rapport de 8 h liste ce client tant qu’il n’a pas d’agent.');
}

/** Alerte « abonnement payant » : essai converti (première facture payée après l’essai) ou abonnement souscrit sans essai. */
export function paidSubscriptionMail(t: Plan & { id: string; converted: boolean; renewal: Date | null }, w: Who): TeamMail {
  return teamMail(`${t.converted ? 'Essai converti : nouvel abonné payant' : 'Nouvel abonnement payant'} — ${whoShort(w)}${testMark(w)}`, [
    ['Client', whoLabel(w)], ['Abonnement', t.id], ...planRow(t),
    ['Prochain renouvellement', t.renewal ? `${parisDateTime(t.renewal)} (heure de Paris)` : 'inconnu'], ...customerRow(w),
  ], t.converted
    ? 'L’essai est terminé et la première facture du forfait est payée. S’il n’a encore aucun agent, ou aucun appel réel, vous recevrez « Risque de résiliation » dès le prochain passage (J+14 compté depuis le début de l’essai) ; il figure aussi dans « À faire aujourd’hui » du rapport de 8 h.'
    : 'Abonnement souscrit sans essai. La mise en route est suivie par le site (série A : aide si aucun agent n’est créé, alerte pour vous à J+3).');
}

/** Alerte « résiliation » d’un abonné payant : demandée (fin programmée) ou effective sans fin programmée. */
export function cancellationMail(t: Plan & { id: string; scheduled: boolean; endsAt: Date | null; feedback: string | null; comment: string | null }, w: Who): TeamMail {
  return teamMail(`${t.scheduled ? 'Résiliation demandée' : 'Abonnement résilié'} — ${whoShort(w)}${testMark(w)}`, [
    ['Client', whoLabel(w)], ['Abonnement', t.id], ...planRow(t),
    [t.scheduled ? 'Fin de l’abonnement' : 'Résilié le', t.endsAt ? `${parisDateTime(t.endsAt)} (heure de Paris)` : 'inconnue'],
    ...(t.feedback || t.comment ? [['Motif indiqué', [t.feedback, t.comment].filter(Boolean).join(' — ')] as Row] : []),
    ...customerRow(w),
  ], t.scheduled
    ? 'Le client a demandé la résiliation : son abonnement reste actif jusqu’à la date de fin, sans nouveau prélèvement ensuite. Personne ne lui a encore demandé pourquoi : appelez-le ou répondez-lui pour comprendre ce qui a manqué, et l’aider s’il s’agit d’un problème de mise en service.'
    : 'L’abonnement est résilié (sans impayé). Vous pouvez contacter le client pour comprendre ce qui a manqué.');
}

/** Alerte « premier achat de crédit » (Add credits : minutes ou crédits de messages, avec ou sans forfait). */
export function firstPurchaseMail(p: { amount: number; currency: string | null }, w: Who): TeamMail {
  return teamMail(`Premier achat de crédit : ${formatAmount(p.amount, p.currency)} — ${whoShort(w)}${testMark(w)}`, [
    ['Client', whoLabel(w)], ['Montant', formatAmount(p.amount, p.currency)], ...customerRow(w),
  ], 'Premier achat dans Add credits (minutes ou crédits de messages). S’il n’a pas de forfait, il paie à la minute : la mise en route est suivie par la série A, et une alerte arrive si son solde de minutes devient bas.');
}

/**
 * customer.subscription.* : essai démarré (création de l’abonnement en essai, ou passage d’« incomplete » à l’essai),
 * abonnement payant sans essai (création « active », ou passage d’« incomplete » à « active » : premier paiement reçu),
 * résiliation demandée par un abonné (fin programmée, hors essai) ou résiliation sans fin programmée (motif autre qu’un
 * paiement refusé, hors essai annulé et hors impayé). `before` : statut enregistré avant une résiliation ; `prev` :
 * attributs précédents de l’événement (data.previous_attributes), absents à la création. L’essai converti est annoncé
 * par onSubscriptionInvoicePaid. Une alerte par abonnement et par moment, quel que soit l’ordre des événements.
 */
export async function onLifecycle(sub: any, type: string, before: string | null, prev: Record<string, unknown> | null, ctx: Ctx & Plan) {
  const id = str(sub?.id);
  // Sans destinataire, aucun verrou n’est posé (l’alerte pourra partir quand l’envoi sera configuré).
  if (!id || !ctx.notify) return;
  const deleted = type === 'customer.subscription.deleted';
  const trialEnd = secs(sub.trial_end);
  const plan: Plan = { amount: ctx.amount, currency: ctx.currency, interval: ctx.interval };
  const who = async (): Promise<Who> => {
    const customer = idOf(sub.customer);
    return { email: customer ? await knownEmail(ctx.db, customer) : null, customer, livemode: ctx.livemode, account: ctx.account };
  };
  const created = type === 'customer.subscription.created';
  const prevStatus = typeof prev?.status === 'string' ? prev.status : null;
  // Jamais sur un événement ultérieur d’un essai ou d’un abonnement déjà en cours (renouvellement, trial_will_end).
  if (!deleted && sub.status === 'trialing' && trialEnd && (created || prevStatus === 'incomplete')) {
    if (await claim(ctx.db, `essai_demarre:${id}`)) await send(ctx.notify, trialStartedMail({ ...plan, id, trialEnd }, await who()));
  }
  // Abonnement souscrit sans essai et payé (l’essai qui passe à « active » attend le paiement de sa facture).
  if (!deleted && sub.status === 'active' && (created || prevStatus === 'incomplete')) {
    if (await claim(ctx.db, `abonne_payant:${id}`)) await send(ctx.notify, paidSubscriptionMail({ ...plan, id, converted: false, renewal: periodEnd(sub) }, await who()));
  }
  // Fin programmée d’un abonnement payant (l’essai annulé a sa propre alerte, onTrialCancelled).
  const cancelAt = secs(sub.cancel_at);
  const scheduled = !deleted && (sub.status === 'active' || sub.status === 'past_due') && (Boolean(sub.cancel_at_period_end) || cancelAt != null);
  const endedAt = secs(sub.ended_at);
  const reason = sub.cancellation_details?.reason ?? null;
  const ended = deleted && reason !== 'payment_failed' && !(!reason && (before === 'past_due' || before === 'unpaid'))
    && before !== 'incomplete' && sub.status !== 'incomplete_expired'
    // Essai annulé (résilié au plus tard à la fin de l’essai) : alerte « Essai annulé » à part.
    && !(trialEnd && (!endedAt || endedAt.getTime() <= trialEnd.getTime() + 60_000));
  if ((scheduled || ended) && await claim(ctx.db, `resiliation:${id}`)) {
    await send(ctx.notify, cancellationMail({
      ...plan, id, scheduled, endsAt: scheduled ? cancelAt ?? periodEnd(sub) : endedAt,
      feedback: str(sub.cancellation_details?.feedback), comment: str(sub.cancellation_details?.comment)?.slice(0, 300) ?? null,
    }, await who()));
  }
}

/**
 * invoice.paid d’un abonnement : « Essai converti » au paiement de la première facture qui suit l’essai (prélèvement
 * de fin d’essai, ou changement de forfait qui met fin à l’essai), reconnue à sa période : elle commence à la fin de
 * l’essai enregistrée (à un jour près). Jamais pour un renouvellement (période suivante) ni pour une facture à 0.
 * Même verrou que l’abonnement direct (« abonne_payant:<abonnement> ») : une seule alerte par abonnement.
 */
export async function onSubscriptionInvoicePaid(inv: any, ctx: Ctx) {
  if (!ctx.notify || !(Number(inv?.amount_paid) > 0)) return;
  if (inv.billing_reason !== 'subscription_cycle' && inv.billing_reason !== 'subscription_update') return;
  // Abonnement de la facture : champ d’origine, ou parent.subscription_details depuis l’API 2025-03-31.
  const id = idOf(inv.subscription) ?? idOf(inv.parent?.subscription_details?.subscription);
  if (!id) return;
  const rows = await ctx.db.select<{ trial_end: string | null; price_amount: number | null; currency: string | null; billing_interval: string | null; current_period_end: string | null }>(
    'stripe_subscriptions', `select=trial_end,price_amount,currency,billing_interval,current_period_end&subscription_id=eq.${encodeURIComponent(id)}`,
  ).catch(() => []);
  const row = rows[0];
  const trialEnd = row?.trial_end ? Date.parse(row.trial_end) : NaN;
  if (Number.isNaN(trialEnd)) return;
  // Période facturée : début de la ligne, sinon fin de la période précédente (champ period_end de la facture).
  const line = inv.lines?.data?.[0];
  const near = (d: Date | null) => Boolean(d && Math.abs(d.getTime() - trialEnd) <= 86_400_000);
  if (!near(secs(line?.period?.start)) && !near(secs(inv.period_end))) return;
  if (!(await claim(ctx.db, `abonne_payant:${id}`))) return;
  const customer = idOf(inv.customer);
  const email = str(inv.customer_email)?.toLowerCase() ?? (customer ? await knownEmail(ctx.db, customer) : null);
  const renewal = secs(line?.period?.end) ?? (row.current_period_end ? new Date(row.current_period_end) : null);
  await send(ctx.notify, paidSubscriptionMail(
    { amount: row.price_amount, currency: row.currency, interval: row.billing_interval, id, converted: true, renewal },
    { email, customer, livemode: ctx.livemode, account: ctx.account },
  ));
}

/** Premier achat de crédit d’un client (facture « manual » ou Checkout en mode paiement) : une alerte par client. */
export async function onCreditPurchase(p: { customer: string | null; email: string | null; amount: number; currency: string | null }, ctx: Ctx) {
  if (!p.customer || !(p.amount > 0) || !ctx.notify) return;
  if (!(await claim(ctx.db, `premier_achat:${p.customer}`))) return;
  const email = p.email ?? await knownEmail(ctx.db, p.customer);
  await send(ctx.notify, firstPurchaseMail({ amount: p.amount, currency: p.currency }, { email, customer: p.customer, livemode: ctx.livemode, account: ctx.account }));
}
