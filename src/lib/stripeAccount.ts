// Forfait, carte et factures d’un client pour la page Mon compte, lus dans le compte Stripe « Permanence IA » (où
// sont les clients et abonnements des forfaits de l’espace client) avec la clé restreinte en LECTURE
// STRIPE_ACCOUNT_KEY (docs/mon-compte.md). Requêtes GET uniquement : aucune écriture, aucune session de portail.
// Le client est retrouvé par son email (correspondance exacte, jamais un autre client) ; s’il en existe plusieurs,
// celui qui a un abonnement en cours l’emporte, sinon le plus récent.
// Sans clé (ou si Stripe ne répond pas), le forfait vient des tables remplies par le webhook Stripe signé
// (stripe_customers, stripe_subscriptions : src/lib/relances/stripe.ts), sans carte ni factures ; sans ligne en base,
// la page renvoie vers Billing info de l’espace client.
import { MARKETS, type PlanSlug } from '@/i18n/markets';
import { maskEmails } from './accountCode';

export const STRIPE_API = 'https://api.stripe.com/v1';

/** essai, actif, impayé (paiement en retard), résilié, en pause (essai fini sans moyen de paiement). */
export type StatusGroup = 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';

export interface SubscriptionView {
  status: string;
  group: StatusGroup;
  /** Nom du produit Stripe (affiché si le forfait n’est pas reconnu). */
  planName: string | null;
  planSlug: PlanSlug | null;
  /** Montant par période en unités mineures (somme prix × quantité), avant remise. */
  amount: number | null;
  currency: string | null;
  interval: string | null;
  trialEnd: string | null;
  periodEnd: string | null;
  /** Date d’arrêt programmée (résiliation en fin de période ou à une date). */
  cancelAt: string | null;
  endedAt: string | null;
  hasDiscount: boolean;
}
export interface CardView { brand: string; last4: string; expMonth: number | null; expYear: number | null }
export interface InvoiceView {
  number: string | null;
  date: string;
  total: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  hostedUrl: string | null;
  pdfUrl: string | null;
}
/**
 * unconfigured : pas de clé et rien en base ; unavailable : Stripe en erreur ou trop lent, rien en base ;
 * no_customer : aucun client Stripe avec cette adresse (l’adresse de facturation peut être différente) ;
 * partial : forfait enregistré par le webhook (ni carte ni factures) ; ok : lecture Stripe complète (client trouvé).
 * Carte ou factures « unavailable » : lecture secondaire en échec, le forfait reste affiché.
 */
export type BillingView =
  | { state: 'unconfigured' }
  | { state: 'unavailable' }
  | { state: 'no_customer' }
  | { state: 'partial'; subscription: SubscriptionView }
  | { state: 'ok'; subscription: SubscriptionView | null; card: CardView | null | 'unavailable'; invoices: InvoiceView[] | 'unavailable' };

/** Réponse de GET /api/account. */
export interface AccountSummary {
  email: string;
  platform:
    | { state: 'ok'; name: string | null; createdAt: string | null; minutes: number; messageCredits: number }
    | { state: 'not_found' }
    | { state: 'unavailable' };
  billing: BillingView;
}

/** Lecture GET d’une ressource Stripe (paramètres répétables, ex. expand[]). */
export type StripeGet = <T = any>(path: string, params?: [string, string][]) => Promise<T>;

/** Lecteur Stripe avec la clé restreinte ; undefined sans clé. Les erreurs ne citent ni la clé ni l’email. */
export function stripeReader(key = process.env.STRIPE_ACCOUNT_KEY, fetchImpl?: typeof fetch, timeoutMs = 5000): StripeGet | undefined {
  if (!key) return undefined;
  const doFetch = fetchImpl ?? ((url: string, init: RequestInit) => fetch(url, init));
  return async (path, params = []) => {
    const qs = new URLSearchParams(params).toString();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await doFetch(`${STRIPE_API}${path}${qs ? `?${qs}` : ''}`, { method: 'GET', headers: { Authorization: `Bearer ${key}` }, signal: ctrl.signal });
      if (!res.ok) throw new Error(`Stripe ${path} ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  };
}

const iso = (s: unknown) => (typeof s === 'number' && s > 0 ? new Date(s * 1000).toISOString() : null);
const str = (v: unknown) => (typeof v === 'string' && v ? v : null);
const idOf = (v: any) => (typeof v === 'string' ? v : str(v?.id));
const created = (o: any) => (typeof o?.created === 'number' ? o.created : 0);
const newestFirst = (a: any, b: any) => created(b) - created(a);
const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object';

export const sameEmail = (v: unknown, email: string) => typeof v === 'string' && v.trim().toLowerCase() === email;
/** Message d’erreur sans adresse email ni clé (journal). */
const errText = (e: any) => (e?.name === 'AbortError' ? 'délai dépassé' : maskEmails(e?.message ?? e).replace(/\b[rs]k_(live|test)_\w+/g, '<clé>'));

const EXPAND_CUSTOMER_PM: [string, string] = ['expand[]', 'data.invoice_settings.default_payment_method'];

/** Clients Stripe de cette adresse (déjà en minuscules), les plus récents d’abord, 5 au plus. */
export async function findCustomers(get: StripeGet, email: string): Promise<any[]> {
  const byList = await get<{ data?: any[] }>('/customers', [['email', email], ['limit', '10'], EXPAND_CUSTOMER_PM]);
  let list = Array.isArray(byList?.data) ? byList.data : [];
  // Le filtre email de la liste est sensible à la casse : recherche en second recours (adresse saisie en majuscules).
  if (!list.length && !/["\\]/.test(email)) {
    const bySearch = await get<{ data?: any[] }>('/customers/search', [['query', `email:"${email}"`], ['limit', '10'], EXPAND_CUSTOMER_PM]);
    list = Array.isArray(bySearch?.data) ? bySearch.data : [];
  }
  return list
    .filter((c) => isObj(c) && !c.deleted && typeof c.id === 'string' && /^cus_\w+$/.test(c.id) && sameEmail(c.email, email))
    .sort(newestFirst)
    .slice(0, 5);
}

// Abonnements en cours, du plus utile à afficher au moins utile.
const LIVE = ['trialing', 'active', 'past_due', 'unpaid', 'incomplete', 'paused'];
const ENDED = ['canceled', 'incomplete_expired'];

/** Abonnement à afficher : le plus récent en cours (par ordre de statut), sinon le dernier terminé, sinon null. */
export function pickSubscription(subs: any[]): any | null {
  const list = (Array.isArray(subs) ? subs : []).filter(isObj);
  const live = list.filter((s) => LIVE.includes(s.status)).sort((a, b) => LIVE.indexOf(a.status) - LIVE.indexOf(b.status) || newestFirst(a, b));
  if (live.length) return live[0];
  return list.filter((s) => ENDED.includes(s.status)).sort(newestFirst)[0] ?? null;
}

/**
 * Client à afficher parmi ceux de l’adresse : 1. celui dont l’abonnement en cours est retenu, 2. sinon celui du
 * dernier abonnement terminé, 3. sinon le client le plus récent. null sans candidat.
 */
export function pickCustomer(cands: { customer: any; subscriptions: any[] }[]): { customer: any; subscription: any | null } | null {
  if (!cands.length) return null;
  const all = cands.flatMap((c) => (c.subscriptions || []).filter(isObj).map((s) => ({ ...s, __owner: c.customer })));
  const chosen = pickSubscription(all);
  if (chosen) {
    const { __owner, ...subscription } = chosen;
    return { customer: __owner, subscription };
  }
  return { customer: cands.map((c) => c.customer).sort(newestFirst)[0], subscription: null };
}

export function statusGroup(status: string): StatusGroup {
  if (status === 'trialing') return 'trial';
  if (status === 'past_due' || status === 'unpaid' || status === 'incomplete') return 'past_due';
  if (status === 'canceled' || status === 'incomplete_expired') return 'canceled';
  if (status === 'paused') return 'paused';
  return 'active';
}

/** Forfait du site d’après le prix, en dollars US (grille du site, mensuelle ou annuelle) : produit illisible ou inconnu. */
export function planSlugFromPrice(amount: number | null, currency: string | null, interval: string | null): PlanSlug | null {
  if (amount === null || String(currency).toLowerCase() !== 'usd') return null;
  for (const [slug, p] of Object.entries(MARKETS.fr.plans) as [PlanSlug, { price: number | null; annualPrice?: number }][]) {
    if (!p.price) continue;
    if ((interval === 'month' && amount === p.price * 100) || (interval === 'year' && p.annualPrice && amount === p.annualPrice * 100)) return slug;
  }
  return null;
}

/** Forfait du site d’après le produit Stripe : identifiant de forfait Autocalls en métadonnée, sinon le nom. */
export function planSlugFromProduct(p: { name?: unknown; metadata?: Record<string, unknown> } | null | undefined): PlanSlug | null {
  if (!p) return null;
  const ids = Object.entries(MARKETS.fr.autocallsPlanIds ?? {}) as [PlanSlug, number][];
  for (const v of Object.values(p.metadata ?? {})) {
    const n = Number(v);
    const hit = n ? ids.find(([, id]) => id === n) : undefined;
    if (hit) return hit[0];
  }
  const name = typeof p.name === 'string' ? p.name : '';
  if (/r[ée]cep/i.test(name)) return 'receptionniste';
  if (/call\s*cent|centre|center/i.test(name)) return 'centre-appels';
  if (/assist/i.test(name)) return 'assistant';
  return null;
}

export function toSubscriptionView(sub: any, product: any | null): SubscriptionView {
  const all: any[] = Array.isArray(sub?.items?.data) ? sub.items.data : [];
  // Éléments au compteur (consommation facturée après coup) : hors du prix du forfait.
  const items = all.filter((it) => it?.price?.recurring?.usage_type !== 'metered');
  const item = items[0] ?? all[0];
  const price = item?.price ?? sub?.plan ?? {};
  const prod = isObj(product) ? product : isObj(price.product) ? price.product : null;
  // Montant de la période : somme des éléments (prix unitaire × quantité) ; inconnu si un prix n’est pas unitaire.
  let amount: number | null = null;
  if (items.length && items.every((it) => typeof it?.price?.unit_amount === 'number')) {
    amount = items.reduce((s, it) => s + it.price.unit_amount * (typeof it.quantity === 'number' ? it.quantity : 1), 0);
  }
  // Abonnement facturé dans une autre devise que celle du prix (tarification locale) : montant inconnu ici, la
  // facture fait foi.
  const subCurrency = str(sub?.currency)?.toLowerCase() ?? null;
  if (subCurrency && items.some((it) => str(it?.price?.currency)?.toLowerCase() !== subCurrency)) amount = null;
  const currency = subCurrency ?? str(price.currency);
  const interval = str(price.recurring?.interval ?? price.interval);
  const status = String(sub?.status || '');
  // API Stripe récente : la période est portée par l’élément d’abonnement ; ancienne API : par l’abonnement.
  const periodEnd = iso(item?.current_period_end ?? sub?.current_period_end);
  return {
    status,
    group: statusGroup(status),
    planName: str(prod?.name) ?? str(price.nickname),
    planSlug: planSlugFromProduct(prod) ?? planSlugFromPrice(amount, currency, interval),
    amount,
    currency,
    interval,
    trialEnd: iso(sub?.trial_end),
    periodEnd,
    cancelAt: iso(sub?.cancel_at) ?? (sub?.cancel_at_period_end ? periodEnd : null),
    endedAt: iso(sub?.ended_at) ?? (ENDED.includes(status) ? iso(sub?.canceled_at) : null),
    hasDiscount: !!(sub?.discount || (Array.isArray(sub?.discounts) && sub.discounts.length)),
  };
}

const BRANDS: Record<string, string> = {
  visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', american_express: 'American Express',
  cartes_bancaires: 'CB', discover: 'Discover', diners: 'Diners Club', diners_club: 'Diners Club', jcb: 'JCB',
  unionpay: 'UnionPay', eftpos_au: 'eftpos', interac: 'Interac', link: 'Link',
};
const brandLabel = (raw: unknown) => {
  const k = String(raw || '').toLowerCase();
  return BRANDS[k] ?? (k ? k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) : '');
};
const intOrNull = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) ? v : null);

/** Carte (ou prélèvement SEPA, Link) d’un moyen de paiement Stripe ; null si inconnu. */
export function toCardView(pm: any): CardView | null {
  if (!isObj(pm)) return null;
  if (pm.type === 'card' && isObj(pm.card)) {
    return { brand: brandLabel(pm.card.display_brand ?? pm.card.brand) || 'Card', last4: str(pm.card.last4) ?? '', expMonth: intOrNull(pm.card.exp_month), expYear: intOrNull(pm.card.exp_year) };
  }
  if (pm.type === 'sepa_debit') return { brand: 'SEPA', last4: str(pm.sepa_debit?.last4) ?? '', expMonth: null, expYear: null };
  if (pm.type === 'link') return { brand: 'Link', last4: '', expMonth: null, expYear: null };
  return null;
}

/** Lien Stripe sûr (https, domaine stripe.com) ; null sinon. */
export function safeStripeUrl(u: unknown): string | null {
  if (typeof u !== 'string') return null;
  try {
    const url = new URL(u);
    return url.protocol === 'https:' && (url.hostname === 'stripe.com' || url.hostname.endsWith('.stripe.com')) ? url.toString() : null;
  } catch {
    return null;
  }
}

const INVOICE_STATUSES = ['paid', 'open', 'void', 'uncollectible'] as const;

/** Facture affichable (brouillons et statuts inconnus écartés). */
export function toInvoiceView(inv: any): InvoiceView | null {
  if (!isObj(inv) || !(INVOICE_STATUSES as readonly string[]).includes(inv.status)) return null;
  const date = iso(inv.status_transitions?.finalized_at) ?? iso(inv.created);
  if (!date) return null;
  return {
    number: str(inv.number),
    date,
    total: typeof inv.total === 'number' ? inv.total : typeof inv.amount_due === 'number' ? inv.amount_due : 0,
    currency: str(inv.currency) ?? 'usd',
    status: inv.status,
    hostedUrl: safeStripeUrl(inv.hosted_invoice_url),
    pdfUrl: safeStripeUrl(inv.invoice_pdf),
  };
}

// Noms des produits (forfaits) gardés une heure : ils ne sont pas personnels.
const PRODUCT_TTL_MS = 3_600_000;
const products = new Map<string, { at: number; product: any }>();
export const resetProductCache = () => products.clear();

async function loadProduct(get: StripeGet, sub: any | null) {
  const price = sub?.items?.data?.[0]?.price ?? sub?.plan;
  if (!price) return null;
  if (isObj(price.product)) return price.product;
  const id = str(price.product);
  if (!id || !/^prod_\w+$/.test(id)) return null;
  const hit = products.get(id);
  if (hit && Date.now() - hit.at < PRODUCT_TTL_MS) return hit.product;
  const product = await get(`/products/${id}`);
  products.set(id, { at: Date.now(), product });
  return product;
}

/** Moyen de paiement par défaut : celui de l’abonnement, sinon celui du client, sinon sa première carte. */
async function loadCard(get: StripeGet, customer: any, sub: any | null) {
  const pm = isObj(sub?.default_payment_method) ? sub.default_payment_method
    : isObj(customer?.invoice_settings?.default_payment_method) ? customer.invoice_settings.default_payment_method : null;
  if (pm) return toCardView(pm);
  const list = await get<{ data?: any[] }>('/payment_methods', [['customer', customer.id], ['type', 'card'], ['limit', '1']]);
  const first = (Array.isArray(list?.data) ? list.data : []).find((p) => isObj(p) && idOf(p.customer) === customer.id);
  return toCardView(first);
}

/** Lecture de la base (src/lib/server.ts en production, fausse base en test). */
export interface BillingDb { select: <T>(table: string, query: string) => Promise<T[]> }

/** Ligne de stripe_subscriptions (webhook signé, src/lib/relances/stripe.ts ; montants en unités mineures). */
export interface SubscriptionRow {
  subscription_id: string; customer_id: string | null; status: string | null;
  trial_start: string | null; trial_end: string | null; current_period_end: string | null;
  cancel_at_period_end: boolean | null; canceled_at: string | null; ended_at: string | null;
  price_amount: number | null; currency: string | null; billing_interval: string | null;
  last_event_at: string | null; updated_at: string | null;
}
const SUB_COLUMNS = 'subscription_id,customer_id,status,trial_start,trial_end,current_period_end,cancel_at_period_end,canceled_at,ended_at,price_amount,currency,billing_interval,last_event_at,updated_at';
const ms = (v: unknown) => { const t = typeof v === 'string' ? Date.parse(v) : NaN; return Number.isFinite(t) ? t : 0; };
const isoText = (v: unknown) => (ms(v) ? new Date(ms(v)).toISOString() : null);

/** Vue d’abonnement d’après une ligne enregistrée (nom du forfait d’après le prix, remise inconnue). */
export function rowToSubscriptionView(r: SubscriptionRow): SubscriptionView {
  const status = String(r.status || '');
  const periodEnd = isoText(r.current_period_end);
  const amount = typeof r.price_amount === 'number' ? r.price_amount : null;
  const currency = str(r.currency);
  const interval = str(r.billing_interval);
  return {
    status,
    group: statusGroup(status),
    planName: null,
    planSlug: planSlugFromPrice(amount, currency, interval),
    amount,
    currency,
    interval,
    trialEnd: isoText(r.trial_end),
    periodEnd,
    cancelAt: r.cancel_at_period_end ? periodEnd : null,
    endedAt: isoText(r.ended_at) ?? (ENDED.includes(status) ? isoText(r.canceled_at) : null),
    hasDiscount: false,
  };
}

/**
 * Forfait de cette adresse (déjà en minuscules) d’après les tables du webhook Stripe (mode réel seulement) ; null sans
 * ligne : abonnement créé avant la mise en service du webhook (8 oct. 2026) et sans événement depuis, ou aucun client.
 */
export async function loadSubscriptionFromDb(email: string, db: BillingDb): Promise<SubscriptionView | null> {
  const customers = await db.select<{ customer_id: string }>('stripe_customers', `select=customer_id&email=eq.${encodeURIComponent(email)}&livemode=eq.true&limit=10`);
  const ids = (Array.isArray(customers) ? customers : []).map((c) => c?.customer_id).filter((id): id is string => typeof id === 'string' && /^cus_\w+$/.test(id));
  if (!ids.length) return null;
  const rows = await db.select<SubscriptionRow>('stripe_subscriptions', `select=${SUB_COLUMNS}&customer_id=in.(${ids.join(',')})&livemode=eq.true&limit=20`);
  // Contrôle de l’appartenance (jamais l’abonnement d’un autre client), puis même choix que par l’API.
  const mine = (Array.isArray(rows) ? rows : []).filter((r) => isObj(r) && ids.includes(String(r.customer_id)));
  const chosen = pickSubscription(mine.map((r) => ({ ...r, created: Math.floor(ms(r.trial_start ?? r.last_event_at ?? r.updated_at) / 1000) })));
  return chosen ? rowToSubscriptionView(chosen) : null;
}

/** Forfait enregistré en base si possible, sinon l’état donné (message neutre de la page). */
async function fromDb(email: string, db: BillingDb | undefined, fallback: 'unconfigured' | 'unavailable'): Promise<BillingView> {
  if (!db) return { state: fallback };
  try {
    const subscription = await loadSubscriptionFromDb(email, db);
    return subscription ? { state: 'partial', subscription } : { state: fallback };
  } catch (e) {
    console.error('[mon-compte] stripe (base):', errText(e));
    return { state: fallback };
  }
}

/** Lecture secondaire (produit, carte, factures) : en cas d’échec, journalisée et remplacée, le forfait reste affiché. */
const soft = <T, F>(what: string, p: Promise<T>, fallback: F): Promise<T | F> => p.catch((e) => {
  console.error(`[mon-compte] stripe ${what}:`, errText(e));
  return fallback;
});

/**
 * Forfait, carte et 12 dernières factures du client de cette adresse (déjà en minuscules). Sans clé ou si Stripe ne
 * répond pas, forfait seul d’après la base (`db`), s’il y est.
 */
export async function loadStripeBilling(email: string, get: StripeGet | undefined = stripeReader(), db?: BillingDb): Promise<BillingView> {
  if (!get) return fromDb(email, db, 'unconfigured');
  try {
    const customers = await findCustomers(get, email);
    if (!customers.length) return { state: 'no_customer' };
    const cands = await Promise.all(customers.map(async (customer) => {
      const r = await get<{ data?: any[] }>('/subscriptions', [['customer', customer.id], ['status', 'all'], ['limit', '10'], ['expand[]', 'data.default_payment_method']]);
      // Contrôle de l’appartenance : jamais l’abonnement d’un autre client.
      const subscriptions = (Array.isArray(r?.data) ? r.data : []).filter((s) => isObj(s) && idOf(s.customer) === customer.id);
      return { customer, subscriptions };
    }));
    const chosen = pickCustomer(cands)!;
    const cid: string = chosen.customer.id;
    const [inv, product, card] = await Promise.all([
      soft('factures', get<{ data?: any[] }>('/invoices', [['customer', cid], ['limit', '15']]), 'unavailable' as const),
      soft('produit', loadProduct(get, chosen.subscription), null),
      soft('carte', loadCard(get, chosen.customer, chosen.subscription), 'unavailable' as const),
    ]);
    const invoices = inv === 'unavailable' ? inv : (Array.isArray(inv?.data) ? inv.data : [])
      .filter((i) => isObj(i) && idOf(i.customer) === cid && i.status !== 'draft')
      .map(toInvoiceView)
      .filter((i): i is InvoiceView => !!i)
      .slice(0, 12);
    return { state: 'ok', subscription: chosen.subscription ? toSubscriptionView(chosen.subscription, product) : null, card, invoices };
  } catch (e) {
    console.error('[mon-compte] stripe:', errText(e));
    return fromDb(email, db, 'unavailable');
  }
}
