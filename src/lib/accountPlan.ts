// Forfait d’un client pour le dossier lu par Lucie et les agents de support (/api/agent/account, action lookup) :
// forfait, état de l’essai, date de renouvellement, annulation prévue, impayé (audit du 9 oct. 2026, action 12).
// Sources, de la plus sûre à la plus pauvre : API Stripe avec la clé restreinte en lecture STRIPE_ACCOUNT_KEY (même
// lecture que la page Mon compte, src/lib/stripeAccount.ts, sans carte ni factures), sinon tables remplies par le
// webhook Stripe signé (stripe_customers, stripe_subscriptions). Dernier paiement échoué : journal des paiements
// (call_events kind 'stripe_paiement', src/lib/relances/payments.ts). Aucune écriture, aucune donnée de carte.
// Le texte plan_status remplace l’ancienne règle « 0 minute = proposer l’essai » : il dit à l’agent ce qu’il peut
// proposer selon l’état réel de l’abonnement (jamais l’essai à un client déjà en essai, abonné ou ancien abonné).
import { OFFER_TEXT } from '@/i18n/content/fr/offers';
import { MARKETS } from '@/i18n/markets';
import { maskEmails } from './maskEmails';
import {
  findCustomers, loadSubscriptionFromDb, pickCustomer, toSubscriptionView, type BillingDb, type StripeGet, type SubscriptionView,
} from './stripeAccount';

/** Au-delà, la lecture Stripe est abandonnée au profit des tables du webhook (l’agent attend la réponse de l’outil). */
export const PLAN_STRIPE_TIMEOUT_MS = 6_000;

export interface AgentPlan {
  /** stripe : API Stripe ; base : tables du webhook ; aucune : aucun client ni abonnement ; indisponible : lecture en échec. */
  source: 'stripe' | 'base' | 'aucune' | 'indisponible';
  subscription: SubscriptionView | null;
  /** Dernier paiement échoué non suivi d’un paiement reçu (ISO), sinon null. */
  paymentFailedAt: string | null;
}

const errText = (e: any) => (e?.name === 'AbortError' ? 'délai dépassé' : maskEmails(String(e?.message ?? e)).replace(/\b[rs]k_(live|test)_\w+/g, '<clé>'));
const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object';
const idOf = (v: any) => (typeof v === 'string' ? v : typeof v?.id === 'string' ? v.id : null);
const CUS = /^cus_\w+$/;

/** Abonnement et clients Stripe de l’adresse par l’API (null : aucun client avec cette adresse). */
async function fromStripe(email: string, get: StripeGet): Promise<{ subscription: SubscriptionView | null; customerIds: string[] } | null> {
  const customers = await findCustomers(get, email);
  if (!customers.length) return null;
  const cands = await Promise.all(customers.map(async (customer) => {
    const r = await get<{ data?: any[] }>('/subscriptions', [['customer', customer.id], ['status', 'all'], ['limit', '10']]);
    // Contrôle de l’appartenance : jamais l’abonnement d’un autre client.
    return { customer, subscriptions: (Array.isArray(r?.data) ? r.data : []).filter((s) => isObj(s) && idOf(s.customer) === customer.id) };
  }));
  const chosen = pickCustomer(cands)!;
  return { subscription: chosen.subscription ? toSubscriptionView(chosen.subscription, null) : null, customerIds: customers.map((c) => c.id) };
}

/** Lecture bornée dans le temps (rejet au-delà du délai). */
function within<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([p, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error('délai dépassé')), ms); })]).finally(() => clearTimeout(timer));
}

/**
 * Dernier paiement échoué de ces clients, s’il n’a pas été suivi d’un paiement reçu (mode réel seulement). Lecture en
 * échec : null (le statut de l’abonnement, past_due ou unpaid, dit déjà l’impayé).
 */
async function lastPaymentFailure(db: BillingDb, customerIds: string[]): Promise<string | null> {
  const ids = customerIds.filter((id) => CUS.test(id));
  if (!ids.length) return null;
  const rows = await db.select<{ status: string | null; created_at: string; variables: Record<string, unknown> | null }>('call_events',
    `select=status,created_at,variables&kind=eq.stripe_paiement&variables->>customer=in.(${ids.join(',')})&order=created_at.desc&limit=30`).catch(() => []);
  const live = (Array.isArray(rows) ? rows : []).filter((r) => isObj(r) && (r.variables as any)?.livemode !== false && ids.includes(String((r.variables as any)?.customer)));
  const failed = live.find((r) => r.status === 'echec');
  if (!failed) return null;
  const paid = live.find((r) => r.status === 'recu');
  return paid && Date.parse(paid.created_at) > Date.parse(failed.created_at) ? null : failed.created_at;
}

/**
 * Forfait de cette adresse (déjà en minuscules). `get` : lecteur Stripe (stripeReader(), undefined sans clé) ; `db` :
 * lecture de la base. Ne lève jamais : une panne donne la source « indisponible ».
 */
export async function loadAgentPlan(email: string, o: { get?: StripeGet; db: BillingDb; timeoutMs?: number }): Promise<AgentPlan> {
  let customerIds: string[] = [];
  let subscription: SubscriptionView | null = null;
  let source: AgentPlan['source'] = 'aucune';
  let read = false;
  if (o.get) {
    try {
      const r = await within(fromStripe(email, o.get), o.timeoutMs ?? PLAN_STRIPE_TIMEOUT_MS);
      read = true;
      if (r) { customerIds = r.customerIds; subscription = r.subscription; source = 'stripe'; }
    } catch (e) { console.error('[dossier] stripe :', errText(e)); }
  }
  if (!read) {
    try {
      const customers = await o.db.select<{ customer_id: string }>('stripe_customers', `select=customer_id&email=eq.${encodeURIComponent(email)}&livemode=eq.true&limit=10`);
      customerIds = (Array.isArray(customers) ? customers : []).map((c) => c?.customer_id).filter((id): id is string => typeof id === 'string' && CUS.test(id));
      subscription = customerIds.length ? await loadSubscriptionFromDb(email, o.db) : null;
      source = subscription ? 'base' : 'aucune';
    } catch (e) {
      console.error('[dossier] base :', errText(e));
      return { source: 'indisponible', subscription: null, paymentFailedAt: null };
    }
  }
  return { source, subscription, paymentFailedAt: await lastPaymentFailure(o.db, customerIds) };
}

const day = (iso: string | null) => (iso ? iso.slice(0, 10) : null);

/** Nom du forfait : produit Stripe, sinon forfait du site reconnu au prix. */
function planName(s: SubscriptionView) {
  if (s.planName) return s.planName;
  return s.planSlug ? OFFER_TEXT[s.planSlug].name : null;
}

/**
 * Réponse lue par l’agent : `plan` (données) et `plan_status` (consigne en une phrase ou deux). `minutes` : solde de
 * l’espace client. Jamais « proposez l’essai » quand un abonnement, même terminé, existe : un seul essai par entreprise
 * ou moyen de paiement (conditions générales, essai réservé à la première souscription), et changer de forfait pendant
 * l’essai peut déclencher un débit immédiat. Boutons nommés comme dans l’espace client : « Choose a plan » (en haut à
 * gauche) tant qu’aucun forfait n’est affiché, « Change plan » ensuite.
 */
export function describePlanForAgent(p: AgentPlan, minutes: number) {
  const s = p.subscription;
  const noMinutes = !(Number(minutes) > 0);
  const failed = p.paymentFailedAt ? ` Dernier paiement échoué le ${day(p.paymentFailedAt)}.` : '';
  const base = {
    name: s ? planName(s) : null,
    billing: s?.interval === 'year' ? 'annuel' : s?.interval === 'month' ? 'mensuel' : null,
    monthly_minutes: s?.planSlug ? MARKETS.fr.plans[s.planSlug].minutes : null,
    trial_end: s?.group === 'trial' ? day(s.trialEnd) : null,
    renewal_date: s && (s.group === 'active' || s.group === 'past_due') && !s.cancelAt ? day(s.periodEnd) : null,
    cancel_at: s && s.group !== 'canceled' ? day(s.cancelAt) : null,
    ended_at: s?.group === 'canceled' ? day(s.endedAt) : null,
    payment_failed_at: day(p.paymentFailedAt),
    source: p.source,
  };
  const named = base.name ? `forfait ${base.name}` : 'forfait non reconnu (voir Billing info)';
  const plan = (status: string) => ({ status, ...base });

  if (p.source === 'indisponible') {
    return {
      plan: plan('inconnu'),
      plan_status: 'Forfait inconnu (lecture de la facturation indisponible). Ne déduisez rien du solde de minutes et ne proposez ni essai ni changement de forfait : demandez à la personne ce que montre Billing info, ou créez un ticket.',
    };
  }
  if (!s) {
    return {
      plan: plan('aucun_abonnement'),
      plan_status: noMinutes
        ? 'Aucun abonnement trouvé pour cette adresse et aucune minute. Si la personne n’a jamais démarré d’essai, elle peut le faire avec « Choose a plan » (en haut à gauche ; « Change plan » si un forfait apparaît déjà), puis « Start 14-Day Free Trial ». Si elle dit être déjà en essai ou abonnée, ne proposez pas l’essai : l’abonnement est peut-être à une autre adresse de facturation ; créez un ticket.'
        : 'Aucun abonnement trouvé pour cette adresse, mais des minutes disponibles : compte payé à la minute (Add credits), ou abonnement à une autre adresse de facturation. Ne proposez pas l’essai sans avoir demandé à la personne si elle en a déjà eu un.',
    };
  }
  switch (s.group) {
    case 'trial':
      if (s.cancelAt) {
        return {
          plan: plan('essai_annule'),
          plan_status: `Essai annulé par le client : il reste actif jusqu’au ${day(s.cancelAt) ?? day(s.trialEnd)}, puis s’arrête sans aucun débit. Ne proposez ni nouvel essai ni changement de forfait ; s’il veut finalement continuer, il peut réactiver l’abonnement dans Billing info avant cette date.`,
        };
      }
      return {
        plan: plan('essai'),
        plan_status: `Essai gratuit en cours (${named}) jusqu’au ${day(s.trialEnd) ?? 'date inconnue'} ; premier prélèvement à cette date sauf annulation avant. Ne proposez pas de démarrer l’essai et déconseillez de changer de forfait pendant l’essai (un changement peut déclencher un débit immédiat).${noMinutes ? ' À 0 minute : les minutes d’essai sont épuisées, l’essai continue sans minutes jusqu’à sa fin ; la personne peut ajouter des minutes dans Add credits si elle le souhaite.' : ''}`,
      };
    case 'past_due':
      return {
        plan: plan('impaye'),
        plan_status: `Paiement en retard sur le ${named} : la dernière tentative de prélèvement a échoué.${failed} Stripe réessaie automatiquement ; la personne doit mettre à jour sa carte dans Billing info (lien sous le forfait : « Factures et carte bancaire », en anglais « Invoices and payment card », en italien « Fatture e carta di pagamento », en polonais « Faktury i karta płatnicza », en néerlandais « Facturen en betaalkaart », en hébreu « חשבוניות וכרטיס אשראי »). Ne proposez ni essai ni changement de forfait ; si le problème persiste, créez un ticket.`,
      };
    case 'canceled':
      return {
        plan: plan('resilie'),
        plan_status: `Abonnement résilié${base.ended_at ? ` depuis le ${base.ended_at}` : ''} (${named}). Ne proposez pas de nouvel essai gratuit (un seul essai par entreprise ou moyen de paiement, selon les conditions générales) : pour reprendre, la personne choisit un forfait payant avec « Choose a plan » (ou « Change plan »), ou achète des minutes dans Add credits.`,
      };
    case 'paused':
      return {
        plan: plan('en_pause'),
        plan_status: 'Abonnement en pause dans Stripe : à la fin de l’essai, aucune carte utilisable n’était enregistrée (carte retirée pendant l’essai, par exemple). La personne doit vérifier ou ajouter sa carte dans Billing info pour le réactiver. Ne proposez pas de nouvel essai.',
      };
    default:
      if (s.cancelAt) {
        return {
          plan: plan('resiliation_programmee'),
          plan_status: [
            `Abonné (${named}), résiliation programmée : l’abonnement s’arrête le ${day(s.cancelAt)}, sans nouveau prélèvement.${failed}`,
            noMinutes && 'À 0 minute : les minutes de la période sont épuisées ; la personne peut en ajouter dans Add credits.',
            'S’il veut finalement continuer, il peut annuler la résiliation dans Billing info avant cette date. Ne proposez pas l’essai gratuit.',
          ].filter(Boolean).join(' '),
        };
      }
      return {
        plan: plan('abonne'),
        plan_status: `Abonné (${named}${base.billing ? `, ${base.billing}` : ''}), renouvellement le ${day(s.periodEnd) ?? 'date inconnue'}.${failed}${noMinutes ? ' À 0 minute : les minutes de la période sont épuisées ; elles reviennent au renouvellement, ou plus tôt avec Add credits.' : ''} Ne proposez pas l’essai gratuit.`,
      };
  }
}
