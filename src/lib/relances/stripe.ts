// Webhook Stripe du compte Permanence IA : vérification de la signature (en-tête Stripe-Signature, HMAC-SHA256 du
// corps brut avec STRIPE_WEBHOOK_SECRET, tolérance de 5 minutes) et enregistrement de l’état des abonnements par
// client (essai, fin d’essai, annulation, paiement), rapproché par email. Aucun événement non signé n’est lu.
// Paiements reçus et échoués : journal et alertes à l’équipe (src/lib/relances/payments.ts), dont « essai annulé » et
// les moments clés (essai démarré, abonnement payant, résiliation, premier achat de crédit) ; essai converti annoncé au
// paiement de sa première facture (invoice.paid), jamais au passage en « active » qui précède le prélèvement.
// Achat de crédit : facture hors abonnement (Add credits, facture « manual ») ou Checkout en mode paiement ; jamais un
// payment_intent seul (depuis l’API 2025-03-31, il ne cite plus sa facture : un paiement d’abonnement y ressemblerait).
// Les accès à la base sont passés en paramètre (helpers de src/lib/server.ts en production, faux en test).
import { createHmac, timingSafeEqual } from 'crypto';
import type { Locale } from '@/i18n/locales';
import {
  onCreditPurchase, onLifecycle, onPaymentFailed, onSubscriptionChange, onSubscriptionInvoicePaid, onTrialCancelled, recordPayment,
  type PaymentDb, type TeamNotify,
} from './payments';

export const SIGNATURE_TOLERANCE_S = 300;

/** Signature Stripe valide pour ce corps brut (une des signatures v1 de l’en-tête, horodatage récent). */
export function verifyStripeSignature(rawBody: string | Buffer, header: unknown, secret: string | undefined, nowS = Math.floor(Date.now() / 1000)) {
  if (!secret || typeof header !== 'string') return false;
  const parts = header.split(',').map((p) => p.trim().split('='));
  const t = Number(parts.find(([k]) => k === 't')?.[1]);
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v).filter(Boolean);
  if (!Number.isFinite(t) || !sigs.length || Math.abs(nowS - t) > SIGNATURE_TOLERANCE_S) return false;
  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const want = Buffer.from(createHmac('sha256', secret).update(`${t}.${body}`).digest('hex'));
  return sigs.some((s) => {
    const got = Buffer.from(s);
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

export interface StripeDb extends PaymentDb {
  update: (table: string, query: string, patch: Record<string, unknown>) => Promise<void>;
}

/** Client Stripe (email, langue) lu avec la clé restreinte en lecture STRIPE_READ_KEY, si elle existe. */
export type CustomerFetcher = (id: string) => Promise<{ email?: string | null; preferred_locales?: string[] } | null>;

export function stripeCustomerFetcher(key = process.env.STRIPE_READ_KEY): CustomerFetcher | undefined {
  if (!key) return undefined;
  return async (id) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4_000);
    try {
      const res = await fetch(`https://api.stripe.com/v1/customers/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` }, signal: ctrl.signal });
      return res.ok ? res.json() : null;
    } catch { return null; } finally { clearTimeout(timer); }
  };
}

/** Langue des factures, reçus et e-mails Stripe pour chaque langue du site (pas d’hébreu chez Stripe : anglais). */
export const STRIPE_INVOICE_LOCALE: Record<Locale, string> = { fr: 'fr', 'en-gb': 'en-GB', 'en-au': 'en-GB', it: 'it', pl: 'pl', nl: 'nl', he: 'en' };

/** Langue du client enregistrée par le site (formulaire, agent, indicatif), retrouvée par son email. */
export type ContactLocaleLookup = (email: string) => Promise<Locale | null>;
/** Pose la langue d’un client Stripe ; vrai si Stripe a accepté. */
export type CustomerLocaleSetter = (id: string, stripeLocale: string) => Promise<boolean>;

/**
 * Écriture de la langue avec la clé restreinte STRIPE_CUSTOMERS_KEY (droit « Customers : écriture » seulement), si
 * elle existe. Le paiement Autocalls suit la langue du navigateur et ne la transmet pas au client Stripe : sans cela,
 * factures et reçus partent en anglais.
 */
export function stripeCustomerLocaleSetter(key = process.env.STRIPE_CUSTOMERS_KEY): CustomerLocaleSetter | undefined {
  if (!key) return undefined;
  return async (id, stripeLocale) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4_000);
    try {
      const res = await fetch(`https://api.stripe.com/v1/customers/${encodeURIComponent(id)}`, {
        method: 'POST', signal: ctrl.signal,
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'preferred_locales[0]': stripeLocale }).toString(),
      });
      // Refus de la clé (droit manquant, clé révoquée) : visible dans les journaux, sinon factures en anglais sans le savoir.
      if (!res.ok) console.warn(`[stripe] langue des factures non posée pour ${id} : Stripe a répondu ${res.status}`);
      return res.ok;
    } catch (e: any) {
      console.warn(`[stripe] langue des factures non posée pour ${id} : ${e?.message}`);
      return false;
    } finally { clearTimeout(timer); }
  };
}

const iso = (s: unknown) => (typeof s === 'number' && s > 0 ? new Date(s * 1000).toISOString() : null);
const str = (v: unknown) => (typeof v === 'string' && v ? v : null);
const idOf = (v: any) => (typeof v === 'string' ? v : str(v?.id));
const enc = encodeURIComponent;

/** Colonnes ajoutées par supabase/migrations/20261009_relances_annulation.sql et 20261009_relances_mise_en_route.sql
 *  (lues si elles existent). */
const NEW_SUBSCRIPTION_COLUMNS = ['cancel_at', 'cancellation_reason', 'start_date'];
/** Colonne inconnue de la base (migration pas encore exécutée) : PostgREST répond 400 (PGRST204). */
const missingColumn = (e: unknown) => /PGRST204|42703|column|schema cache|\b400\b/i.test(String((e as Error)?.message ?? e));
let warnedColumns = false;

/**
 * Enregistre l’abonnement : création, sinon remplacement si l’événement est plus récent que le dernier appliqué. Sans
 * une migration du 9 oct., la même écriture repart sans la colonne inconnue (nommée dans l’erreur PGRST204), sinon sans
 * toutes les colonnes ajoutées ce jour-là : jamais d’événement Stripe perdu, et une migration faite sert tout de suite.
 */
async function saveSubscription(db: StripeDb, row: Record<string, unknown>, at: string) {
  const write = async (r: Record<string, unknown>) => {
    if (await db.insertIfNew('stripe_subscriptions', r, 'subscription_id')) return;
    // Événements reçus dans le désordre : seul un événement plus récent remplace l’état enregistré.
    await db.update('stripe_subscriptions', `subscription_id=eq.${enc(String(r.subscription_id))}&or=(last_event_at.is.null,last_event_at.lte.${enc(`"${at}"`)})`, { ...r, updated_at: new Date().toISOString() });
  };
  let current = row;
  for (;;) {
    try {
      await write(current);
      return;
    } catch (e) {
      const named = /'([a-z_]+)' column/.exec(String((e as Error)?.message ?? e))?.[1];
      const drop = named && named in current && NEW_SUBSCRIPTION_COLUMNS.includes(named) ? [named] : NEW_SUBSCRIPTION_COLUMNS.filter((k) => k in current);
      if (!missingColumn(e) || !drop.length) throw e;
      if (!warnedColumns) { warnedColumns = true; console.warn('[stripe] colonnes cancel_at / cancellation_reason / start_date absentes — exécuter supabase/migrations/20261009_relances_annulation.sql et 20261009_relances_mise_en_route.sql'); }
      current = Object.fromEntries(Object.entries(current).filter(([k]) => !drop.includes(k)));
    }
  }
}

/** Facture hors abonnement payée (achat de minutes ou de crédits dans Add credits) : facture « manual ». */
const oneOffInvoice = (inv: any) => inv?.billing_reason === 'manual' && !inv?.subscription && !inv?.parent?.subscription_details;

/** Crée la fiche client si besoin, puis complète les champs fournis (jamais d’écrasement par une valeur vide). */
async function upsertCustomer(db: StripeDb, id: string, patch: Record<string, unknown>, livemode: boolean) {
  const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== null && v !== undefined));
  const created = await db.insertIfNew('stripe_customers', { customer_id: id, livemode, ...clean }, 'customer_id');
  if (!created && Object.keys(clean).length) await db.update('stripe_customers', `customer_id=eq.${enc(id)}`, { ...clean, updated_at: new Date().toISOString() });
}

/**
 * Applique un événement Stripe déjà vérifié. Idempotent : les écritures sont des remplacements, et un abonnement
 * n’est mis à jour que par un événement plus récent que le dernier appliqué. `notify` : alertes de paiement à l’équipe
 * (une seule par facture et par tentative ; un envoi en échec est journalisé, jamais remonté).
 */
export async function applyStripeEvent(event: any, db: StripeDb, fetchCustomer?: CustomerFetcher, locale?: { lookup: ContactLocaleLookup; set: CustomerLocaleSetter }, notify?: TeamNotify) {
  const type = String(event?.type || '');
  const obj = event?.data?.object ?? {};
  const livemode = Boolean(event?.livemode);
  const at = iso(event?.created) ?? new Date().toISOString();
  const ctx = { db, notify, livemode, account: str(event?.account) ?? undefined };
  let handled = true;

  if (type === 'customer.created' || type === 'customer.updated') {
    const email = str(obj.email)?.toLowerCase();
    if (obj.id) await upsertCustomer(db, obj.id, { email, preferred_locale: str(obj.preferred_locales?.[0]) }, livemode);
    // Client sans langue : celle que le site a enregistrée pour cet email. Stripe renvoie ensuite customer.updated
    // avec la langue posée, qui s’enregistre ci-dessus ; une langue déjà choisie n’est jamais remplacée.
    if (obj.id && email && locale && !obj.preferred_locales?.length) {
      const lang = await locale.lookup(email).catch(() => null);
      if (lang) await locale.set(obj.id, STRIPE_INVOICE_LOCALE[lang]).catch(() => false);
    }
  } else if (type.startsWith('customer.subscription.')) {
    const customer = idOf(obj.customer);
    const item = obj.items?.data?.[0];
    const price = item?.price ?? obj.plan ?? {};
    const row = {
      subscription_id: obj.id, customer_id: customer, status: str(obj.status),
      trial_start: iso(obj.trial_start), trial_end: iso(obj.trial_end), current_period_end: iso(item?.current_period_end ?? obj.current_period_end),
      cancel_at_period_end: Boolean(obj.cancel_at_period_end), canceled_at: iso(obj.canceled_at), ended_at: iso(obj.ended_at),
      cancel_at: iso(obj.cancel_at), cancellation_reason: str(obj.cancellation_details?.reason), start_date: iso(obj.start_date),
      price_amount: typeof price.unit_amount === 'number' ? price.unit_amount : typeof price.amount === 'number' ? price.amount : null,
      currency: str(price.currency), billing_interval: str(price.recurring?.interval ?? price.interval), price_id: str(price.id),
      product_id: idOf(price.product), livemode, last_event_at: at,
    };
    if (!row.subscription_id) return { handled: false };
    // Statut enregistré avant une résiliation : « résilié après impayé » (alerte) si l’abonnement était impayé.
    const before = type === 'customer.subscription.deleted'
      ? (await db.select<{ status: string | null }>('stripe_subscriptions', `select=status&subscription_id=eq.${enc(row.subscription_id)}`).catch(() => []))[0]?.status ?? null
      : null;
    await saveSubscription(db, row, at);
    if (customer) {
      const known = await db.select<{ email: string | null }>('stripe_customers', `select=email&customer_id=eq.${enc(customer)}`).catch(() => []);
      if (!known[0]?.email && fetchCustomer) {
        const c = await fetchCustomer(customer);
        await upsertCustomer(db, customer, { email: str(c?.email)?.toLowerCase(), preferred_locale: str(c?.preferred_locales?.[0]) }, livemode);
      } else if (!known.length) await upsertCustomer(db, customer, {}, livemode);
    }
    await onSubscriptionChange(obj, type, before, { ...ctx, amount: row.price_amount, currency: row.currency });
    await onTrialCancelled(obj, type, { ...ctx, amount: row.price_amount, currency: row.currency, interval: row.billing_interval });
    // Attributs précédents (changement réel : création, passage d’« incomplete » à « active »…), jamais un renouvellement.
    const prev = event?.data?.previous_attributes && typeof event.data.previous_attributes === 'object' ? event.data.previous_attributes : null;
    await onLifecycle(obj, type, before, prev, { ...ctx, amount: row.price_amount, currency: row.currency, interval: row.billing_interval });
  } else if (type === 'invoice.paid' || type === 'invoice.payment_succeeded') {
    const customer = idOf(obj.customer);
    const paid = Number(obj.amount_paid) > 0;
    if (customer) {
      await upsertCustomer(db, customer, {
        email: str(obj.customer_email)?.toLowerCase(), has_paid: paid ? true : undefined, has_credit_purchase: paid && oneOffInvoice(obj) ? true : undefined,
      }, livemode);
    }
    if (paid && oneOffInvoice(obj)) await onCreditPurchase({ customer, email: str(obj.customer_email)?.toLowerCase() ?? null, amount: Number(obj.amount_paid), currency: str(obj.currency) }, ctx);
    // Première facture payée après l’essai : alerte « Essai converti » (une fois par abonnement).
    else if (paid) await onSubscriptionInvoicePaid(obj, ctx);
    await recordPayment(db, { id: str(obj.id), source: type, amount: Number(obj.amount_paid), currency: str(obj.currency), customer, livemode });
  } else if (type === 'invoice.payment_failed') {
    const customer = idOf(obj.customer);
    if (customer) await upsertCustomer(db, customer, { email: str(obj.customer_email)?.toLowerCase() }, livemode);
    await onPaymentFailed(obj, ctx);
  } else if (type === 'checkout.session.completed') {
    const customer = idOf(obj.customer);
    const paidPurchase = obj.mode === 'payment' && obj.payment_status === 'paid';
    if (customer) {
      await upsertCustomer(db, customer, {
        email: str(obj.customer_details?.email ?? obj.customer_email)?.toLowerCase(),
        has_paid: paidPurchase ? true : undefined, has_credit_purchase: paidPurchase ? true : undefined,
      }, livemode);
    }
    if (paidPurchase) await onCreditPurchase({ customer, email: str(obj.customer_details?.email ?? obj.customer_email)?.toLowerCase() ?? null, amount: Number(obj.amount_total), currency: str(obj.currency) }, ctx);
    // Même paiement que payment_intent.succeeded : même identifiant pi_… dans le journal (compté une fois).
    if (paidPurchase) await recordPayment(db, { id: idOf(obj.payment_intent) ?? str(obj.id), source: type, amount: Number(obj.amount_total), currency: str(obj.currency), customer, livemode });
  } else if (type === 'payment_intent.succeeded') {
    // Paiement reçu : abonnement ou achat, impossible à distinguer ici (l’API ne cite plus la facture). L’achat de
    // crédit est reconnu par sa facture (invoice.paid « manual ») ou par Checkout, jamais par ce seul événement.
    const customer = idOf(obj.customer);
    if (customer && !obj.invoice && Number(obj.amount_received) > 0) await upsertCustomer(db, customer, { has_paid: true }, livemode);
    if (!obj.invoice) await recordPayment(db, { id: str(obj.id), source: type, amount: Number(obj.amount_received), currency: str(obj.currency), customer, livemode });
  } else {
    handled = false;
  }
  if (event?.id) await db.insertIfNew('stripe_events', { event_id: event.id, type, livemode, created_at: at }, 'event_id');
  return { handled };
}
