// Webhook Stripe du compte Permanence IA : vérification de la signature (en-tête Stripe-Signature, HMAC-SHA256 du
// corps brut avec STRIPE_WEBHOOK_SECRET, tolérance de 5 minutes) et enregistrement de l’état des abonnements par
// client (essai, fin d’essai, annulation, paiement), rapproché par email. Aucun événement non signé n’est lu.
// Les accès à la base sont passés en paramètre (helpers de src/lib/server.ts en production, faux en test).
import { createHmac, timingSafeEqual } from 'crypto';

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

export interface StripeDb {
  insertIfNew: (table: string, row: Record<string, unknown>, onConflict: string) => Promise<boolean>;
  update: (table: string, query: string, patch: Record<string, unknown>) => Promise<void>;
  select: <T>(table: string, query: string) => Promise<T[]>;
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

const iso = (s: unknown) => (typeof s === 'number' && s > 0 ? new Date(s * 1000).toISOString() : null);
const str = (v: unknown) => (typeof v === 'string' && v ? v : null);
const idOf = (v: any) => (typeof v === 'string' ? v : str(v?.id));
const enc = encodeURIComponent;

/** Crée la fiche client si besoin, puis complète les champs fournis (jamais d’écrasement par une valeur vide). */
async function upsertCustomer(db: StripeDb, id: string, patch: Record<string, unknown>, livemode: boolean) {
  const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== null && v !== undefined));
  const created = await db.insertIfNew('stripe_customers', { customer_id: id, livemode, ...clean }, 'customer_id');
  if (!created && Object.keys(clean).length) await db.update('stripe_customers', `customer_id=eq.${enc(id)}`, { ...clean, updated_at: new Date().toISOString() });
}

/**
 * Applique un événement Stripe déjà vérifié. Idempotent : les écritures sont des remplacements, et un abonnement
 * n’est mis à jour que par un événement plus récent que le dernier appliqué.
 */
export async function applyStripeEvent(event: any, db: StripeDb, fetchCustomer?: CustomerFetcher) {
  const type = String(event?.type || '');
  const obj = event?.data?.object ?? {};
  const livemode = Boolean(event?.livemode);
  const at = iso(event?.created) ?? new Date().toISOString();
  let handled = true;

  if (type === 'customer.created' || type === 'customer.updated') {
    if (obj.id) await upsertCustomer(db, obj.id, { email: str(obj.email)?.toLowerCase(), preferred_locale: str(obj.preferred_locales?.[0]) }, livemode);
  } else if (type.startsWith('customer.subscription.')) {
    const customer = idOf(obj.customer);
    const item = obj.items?.data?.[0];
    const price = item?.price ?? obj.plan ?? {};
    const row = {
      subscription_id: obj.id, customer_id: customer, status: str(obj.status),
      trial_start: iso(obj.trial_start), trial_end: iso(obj.trial_end), current_period_end: iso(item?.current_period_end ?? obj.current_period_end),
      cancel_at_period_end: Boolean(obj.cancel_at_period_end), canceled_at: iso(obj.canceled_at), ended_at: iso(obj.ended_at),
      price_amount: typeof price.unit_amount === 'number' ? price.unit_amount : typeof price.amount === 'number' ? price.amount : null,
      currency: str(price.currency), billing_interval: str(price.recurring?.interval ?? price.interval), price_id: str(price.id),
      product_id: idOf(price.product), livemode, last_event_at: at,
    };
    if (!row.subscription_id) return { handled: false };
    const created = await db.insertIfNew('stripe_subscriptions', row, 'subscription_id');
    if (!created) {
      // Événements reçus dans le désordre : seul un événement plus récent remplace l’état enregistré.
      await db.update('stripe_subscriptions', `subscription_id=eq.${enc(row.subscription_id)}&or=(last_event_at.is.null,last_event_at.lte.${enc(`"${at}"`)})`, { ...row, updated_at: new Date().toISOString() });
    }
    if (customer) {
      const known = await db.select<{ email: string | null }>('stripe_customers', `select=email&customer_id=eq.${enc(customer)}`).catch(() => []);
      if (!known[0]?.email && fetchCustomer) {
        const c = await fetchCustomer(customer);
        await upsertCustomer(db, customer, { email: str(c?.email)?.toLowerCase(), preferred_locale: str(c?.preferred_locales?.[0]) }, livemode);
      } else if (!known.length) await upsertCustomer(db, customer, {}, livemode);
    }
  } else if (type === 'invoice.paid' || type === 'invoice.payment_succeeded') {
    const customer = idOf(obj.customer);
    if (customer) await upsertCustomer(db, customer, { email: str(obj.customer_email)?.toLowerCase(), has_paid: Number(obj.amount_paid) > 0 ? true : undefined }, livemode);
  } else if (type === 'checkout.session.completed') {
    const customer = idOf(obj.customer);
    const paidPurchase = obj.mode === 'payment' && obj.payment_status === 'paid';
    if (customer) {
      await upsertCustomer(db, customer, {
        email: str(obj.customer_details?.email ?? obj.customer_email)?.toLowerCase(),
        has_paid: paidPurchase ? true : undefined, has_credit_purchase: paidPurchase ? true : undefined,
      }, livemode);
    }
  } else if (type === 'payment_intent.succeeded') {
    // Achat de crédit (paiement sans facture d’abonnement).
    const customer = idOf(obj.customer);
    if (customer && !obj.invoice && Number(obj.amount_received) > 0) await upsertCustomer(db, customer, { has_paid: true, has_credit_purchase: true }, livemode);
  } else {
    handled = false;
  }
  if (event?.id) await db.insertIfNew('stripe_events', { event_id: event.id, type, livemode, created_at: at }, 'event_id');
  return { handled };
}
