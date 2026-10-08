// Textes des relances commerciales et des messages de cycle de vie (séries P, I, C, F, U et suivi mensuel M),
// conception du 8 oct. 2026 (docs/relances/conception-2026-10-08.md). Le français est la source : chaque autre
// langue fournit un objet du type `RelancesContent` exporté ici.
//
// Règles :
// - aucun chiffre du produit n’est écrit en dur : prix, minutes et essai arrivent par `RelanceFacts`, calculés depuis
//   le marché (src/i18n/markets.ts) et les offres (offers.ts) par `buildRelanceFacts` ;
// - les données du contact restent des variables {entre accolades}, remplacées à l’envoi : {first_name}, {company},
//   {source_line} (qui peut contenir {request_date}), {sector_name}, {sector_problem}, {sector_handles},
//   {trial_end_date}, {minutes_left}, {plan_name}, {plan_price} (déjà formaté avec la devise), {topic_title},
//   {topic_paragraph}. Variable obligatoire absente : l’étape est sautée, jamais de valeur inventée ;
// - les messages « essential » (I1, C1 à C5, F1, U1) ne contiennent aucun argument de vente : sinon ils deviennent
//   de la prospection soumise au consentement ;
// - le lien principal n’est pas dans le texte : `cta.target` désigne la page, l’adresse (avec UTM) est construite à l’envoi ;
// - le pied de page légal et la désinscription sont ajoutés par sendMail (src/lib/emailFooter.ts).
import type { Market, PlanSlug } from '../../../markets';
import { MATRIX } from '../offers';

/** Séries : prospects, inscrits sans essai, essai en cours, essai terminé, comptes à l’usage, suivi mensuel. */
export type RelanceSequence = 'P' | 'I' | 'C' | 'F' | 'U' | 'M';
/** « essential » : message de service (envoyé même après désinscription des e-mails non essentiels). */
export type RelanceCategory = 'essential' | 'marketing';
/** Page visée par le lien principal : essai, demande d’accompagnement de la page Essai, espace client, facturation, tarifs. */
export type RelanceCtaTarget = 'trial' | 'trial_assist' | 'app' | 'billing' | 'pricing';
/** Provenance du contact (contacts.origin), qui choisit la première phrase de P1 ; `callback_done` = rappel effectué. */
export type RelanceOrigin = 'callback_done' | 'callback' | 'trial_request' | 'agent_lead' | 'demo' | 'contact';
/** Étapes e-mail de la conception ; P3_generic remplace P3 quand le secteur est inconnu (jamais de version santé). */
export type RelanceKey =
  | 'P1' | 'P2' | 'P3' | 'P3_generic' | 'P4' | 'P5' | 'P6' | 'P7'
  | 'I1' | 'I2' | 'I3' | 'I4' | 'I5' | 'I6' | 'I7'
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5'
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7'
  | 'U1' | 'U2' | 'U3' | 'U4' | 'U5' | 'U6';

/** Bloc du corps : paragraphe (un « \n » = retour à la ligne), liste numérotée ou liste à puces. */
export type RelanceBlock = string | { ol: string[] } | { ul: string[] };

export interface RelanceMessage {
  category: RelanceCategory;
  /** C2 et C3 : envoyés en « essential », mais sautés si la préférence est « essential_only ». */
  skipIfEssentialOnly?: boolean;
  subject: string;
  /** Objet à utiliser quand le prénom manque (seulement si `subject` contient {first_name}). */
  subjectNoName?: string;
  /** Texte d’aperçu affiché après l’objet dans la boîte de réception. */
  preheader: string;
  /** Corps, après la formule d’appel. */
  body: RelanceBlock[];
  /** Lien principal ; null = réponse directe à l’e-mail (Reply-To contact@permanenceia.com). */
  cta: { label: string; target: RelanceCtaTarget } | null;
  /** Blocs placés après le lien, avant la signature. */
  after?: RelanceBlock[];
  /** Formule placée juste avant la signature (ex. « Merci pour votre attention, »). */
  closing?: string;
}

/** Un message se construit avec les chiffres du marché ; null = un chiffre vérifié manque, l’étape est sautée. */
export type RelanceBuilder = (f: RelanceFacts) => RelanceMessage | null;

/** Conseil du suivi mensuel, tiré d’un guide publié du site (`slug` = guide de /aide/guides). */
export interface RelanceTopic {
  slug: string;
  /** Repris dans l’objet « Le conseil du mois : … » (minuscule initiale). */
  title: string;
  /** 2 ou 3 phrases reprises du guide. */
  paragraph: string;
}

/** Forme commune à toutes les langues. */
export interface RelancesContent {
  shared: {
    greeting: { named: string; anonymous: string };
    /** Remplace {company} quand l’entreprise n’est pas connue. */
    companyFallback: string;
    /** Valeur de {source_line} selon la provenance ; `callback_done` exige {request_date}, sinon prendre `callback`. */
    sourceLine: Record<RelanceOrigin, string>;
    signature: (brand: string) => string;
    /** Ligne du lien dans la version texte. */
    ctaLine: (label: string, url: string) => string;
    /** Énumération naturelle (ex. {sector_handles} à partir de sectors[].handles). */
    list: (items: string[]) => string;
    /** Phrase insérée après « : » (ex. {sector_problem}) : minuscule initiale. */
    clause: (sentence: string) => string;
  };
  messages: Record<RelanceKey, RelanceBuilder>;
  /** Suivi mensuel M : 4 envois au plus, un conseil par mois dans l’ordre de `topics`. */
  monthly: {
    topics: RelanceTopic[];
    /** Contacts issus de P : lien vers l’essai. */
    prospect: RelanceBuilder;
    /** Contacts issus de I, F et U : lien vers l’espace client. */
    account: RelanceBuilder;
  };
}

// ---------- Chiffres injectés dans les textes ----------

type PaidPlan = 'receptionniste' | 'assistant' | 'centre-appels';
const PAID_PLANS: PaidPlan[] = ['receptionniste', 'assistant', 'centre-appels'];

/** Durées d’appel prises en exemple dans les textes (« un appel de 3 minutes », « un appel de 5 minutes »). */
export const RELANCE_SHORT_CALL_MINUTES = 3;
export const RELANCE_EXAMPLE_CALL_MINUTES = 5;

export interface RelancePlanFacts {
  name: string;
  /** Prix mensuel HT, formaté avec la devise (ex. « 99 $US »). */
  price: string;
  minutes: string;
  /** Prix réel d’une minute du forfait (prix ÷ minutes). */
  perMinute: string;
  /** Nombre approximatif d’appels courts couverts (arrondi à 5 près, par défaut). */
  shortCalls: string;
}

/** Valeurs déjà formatées pour la langue et la devise du marché. */
export interface RelanceFacts {
  brand: string;
  trialDays: string;
  trialMinutes: string;
  /** Appels courts couverts par les minutes d’essai. */
  trialShortCalls: string;
  shortCallMinutes: string;
  exampleCallMinutes: string;
  plans: Record<PaidPlan, RelancePlanFacts>;
  /** Prix de la minute sans forfait (paiement à l’usage). */
  paygMinute: string;
  /** Prix minimum d’un numéro dédié, par mois HT. */
  phoneNumberFrom: string;
  /** Mois offerts et mois payés en facturation annuelle (Réceptionniste). */
  annualFreeMonths: string;
  annualPaidMonths: string;
  /** Coût d’un appel d’exemple à l’usage, et fourchette dans un forfait (arrondie à 0,10). */
  exampleCallPayg: string;
  exampleCallPlanLow: string;
  exampleCallPlanHigh: string;
  /** Minutes par mois au-delà desquelles Réceptionniste coûte moins cher que l’usage. */
  breakEvenMinutes: string;
  /** Ce qu’ajoute le forfait Assistant, lu dans la matrice des offres ; null si illisible (U5 sauté). */
  assistantExtras: { agents: string; clonedVoices: string; messageCredits: string; writtenReplies: string } | null;
}

/** Ce qu’il faut pour calculer les chiffres : `getI18n(locale)` convient tel quel. */
export interface RelanceFactsSource {
  market: Market;
  money: (n: number, digits?: number) => string;
  num: (n: number, digits?: number) => string;
  c: { offers: Record<PlanSlug, { name: string }> };
}

/** Nombres d’une cellule de la matrice des offres française (« 1 000 / mois (≈ 330 réponses) » → [1000, 330]). */
function matrixNumbers(label: string, slug: PlanSlug): number[] {
  for (const g of MATRIX) {
    const row = g.rows.find((r) => r.label === label);
    if (!row) continue;
    const cell = row.cells[slug];
    if (typeof cell !== 'string') return [];
    return (cell.match(/\d[\d\s  ]*/g) ?? []).map((s) => Number(s.replace(/\D/g, ''))).filter((n) => n > 0);
  }
  return [];
}

/**
 * Chiffres des relances pour un marché, lus dans markets.ts (prix, minutes, essai, usage, numéro, annuel)
 * et dans la matrice des offres (agents, voix clonées, crédits de messages d’Assistant).
 * Renvoie null si un forfait payant n’a pas de prix : aucune relance chiffrée ne doit partir.
 */
export function buildRelanceFacts({ market, money, num, c }: RelanceFactsSource): RelanceFacts | null {
  const short = RELANCE_SHORT_CALL_MINUTES;
  const example = RELANCE_EXAMPLE_CALL_MINUTES;
  const aboutCalls = (minutes: number) => num(Math.floor(minutes / short / 5) * 5);
  const plans = {} as Record<PaidPlan, RelancePlanFacts>;
  const perMinutes: number[] = [];
  for (const slug of PAID_PLANS) {
    const p = market.plans[slug];
    if (!p || !p.price || !p.minutes) return null;
    perMinutes.push(p.price / p.minutes);
    plans[slug] = { name: c.offers[slug].name, price: money(p.price), minutes: num(p.minutes), perMinute: money(p.price / p.minutes, 2), shortCalls: aboutCalls(p.minutes) };
  }
  const r = market.plans.receptionniste;
  if (!r.price || !r.annualPrice || !market.paygMinute) return null;
  const tenth = (n: number) => Math.round(n * 10) / 10;
  const [agents] = matrixNumbers('Agents vocaux IA', 'assistant');
  const [voices] = matrixNumbers('Voix clonées', 'assistant');
  const [credits, replies] = matrixNumbers('Crédits de messages inclus', 'assistant');
  return {
    brand: market.brand,
    trialDays: num(market.trial.days),
    trialMinutes: num(market.trial.minutes),
    trialShortCalls: num(Math.round(market.trial.minutes / short)),
    shortCallMinutes: num(short),
    exampleCallMinutes: num(example),
    plans,
    paygMinute: money(market.paygMinute, 2),
    phoneNumberFrom: money(market.phoneNumberFrom, 2),
    annualFreeMonths: num(Math.round((r.price * 12 - r.annualPrice) / r.price)),
    annualPaidMonths: num(Math.round(r.annualPrice / r.price)),
    exampleCallPayg: money(market.paygMinute * example, 2),
    exampleCallPlanLow: money(tenth(Math.min(...perMinutes) * example), 2),
    exampleCallPlanHigh: money(tenth(Math.max(...perMinutes) * example), 2),
    breakEvenMinutes: num(Math.round(r.price / market.paygMinute)),
    assistantExtras: agents && voices && credits && replies
      ? { agents: num(agents), clonedVoices: num(voices), messageCredits: num(credits), writtenReplies: num(replies) }
      : null,
  };
}

// ---------- Textes ----------

const lowerFirst = (s: string) => (s ? s.charAt(0).toLocaleLowerCase('fr-FR') + s.slice(1) : s);
const SERIES_END_UNSUBSCRIBE = 'Nous vous écrirons au plus une fois par mois. Pour ne plus rien recevoir, cliquez sur le lien de désinscription en bas de cet e-mail.';

export const UI_RELANCES: RelancesContent = {
  shared: {
    greeting: { named: 'Bonjour {first_name},', anonymous: 'Bonjour,' },
    companyFallback: 'votre entreprise',
    sourceLine: {
      callback_done: 'Suite à notre échange du {request_date}',
      callback: 'Suite à votre demande de rappel',
      trial_request: 'Vous nous avez demandé un coup de main pour démarrer votre essai',
      agent_lead: 'Suite à votre échange avec notre assistante',
      demo: 'Vous avez essayé notre démo en direct',
      contact: 'Suite à votre message',
    },
    signature: (brand) => `L’équipe ${brand}`,
    ctaLine: (label, url) => `${label} : ${url}`,
    list: (items) => {
      const l = items.map((s) => lowerFirst(s.trim().replace(/\.$/, '')));
      return l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} et ${l[l.length - 1]}`;
    },
    clause: (sentence) => lowerFirst(sentence.trim()),
  },

  messages: {
    // ---------- P : prospects non inscrits (marketing) ----------
    P1: (f) => ({
      category: 'marketing',
      subject: '{first_name}, testez l’agent sur vos vrais appels',
      subjectNoName: 'Testez l’agent sur vos vrais appels',
      preheader: `${f.trialDays} jours d’essai, ${f.trialMinutes} minutes d’appels, rien débité pendant l’essai.`,
      body: [
        `{source_line}, merci de votre intérêt pour ${f.brand}.`,
        'Le plus simple pour vous faire un avis : tester l’agent sur les appels de {company}.',
        {
          ol: [
            `Créez votre compte et choisissez le forfait à tester : l’essai de ${f.trialDays} jours démarre, avec ${f.trialMinutes} minutes d’appels.`,
            'Une carte est demandée, mais rien n’est débité pendant l’essai.',
            'Si ce n’est pas pour vous, annulez avant la fin depuis Billing info : vous ne payez rien.',
          ],
        },
      ],
      cta: { label: 'Démarrer mon essai', target: 'trial' },
      after: ['Une question ? Répondez à cet e-mail, c’est l’équipe qui le lit.'],
    }),
    P2: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'Combien vous coûtent les appels sans réponse ?',
        preheader: 'Un calcul simple, avec vos propres chiffres.',
        body: [
          'Un appel sans réponse, c’est souvent un client qui compose le numéro suivant de sa liste.',
          'Faites le calcul avec vos chiffres :\nappels manqués par semaine × 4,3 × valeur moyenne d’un nouveau client = ce que {company} peut laisser filer chaque mois.',
          `En face : le forfait ${r.name}, ${r.price} HT par mois pour ${r.minutes} minutes. L’agent répond 24 h/24, prend le message ou le rendez-vous, et vous envoie un résumé de chaque appel. Le calculateur de notre page Tarifs fait la comparaison pour vous.`,
          `Le mieux reste de le mesurer sur vos appels : ${f.trialDays} jours d’essai, ${f.trialMinutes} minutes incluses, rien débité pendant l’essai.`,
        ],
        cta: { label: 'Démarrer mon essai', target: 'trial' },
      };
    },
    P3: (f) => ({
      category: 'marketing',
      subject: '{sector_name} : ce que l’agent prend en charge pour vous',
      preheader: 'Ce que l’agent recueille pour vous sur ces appels.',
      body: [
        'Dans votre métier, une situation revient souvent : {sector_problem}',
        'Sur ces appels, l’agent recueille ce qu’il vous faut : {sector_handles}. Vous recevez une fiche claire et vous rappelez quand vous êtes disponible, ou le rendez-vous est déjà dans votre agenda (Google Agenda ou Outlook, via Cal.com ou Calendly).',
        'Vous partez d’un modèle de consignes que vous adaptez à {company}, puis vous le testez par chat, dans le navigateur et par un vrai appel.',
      ],
      cta: { label: `Essayer pendant ${f.trialDays} jours`, target: 'trial' },
    }),
    P3_generic: (f) => ({
      category: 'marketing',
      subject: 'Ce que l’agent prend en charge pour vous',
      preheader: 'Ce que l’agent recueille pour vous sur ces appels.',
      body: [
        'Dans votre métier, une situation revient souvent : les appels qui arrivent pendant que vous êtes occupé.',
        'Sur ces appels, l’agent recueille ce qu’il vous faut : qui appelle, pour quelle demande et quand vous rappeler. Vous recevez une fiche claire et vous rappelez quand vous êtes disponible, ou le rendez-vous est déjà dans votre agenda (Google Agenda ou Outlook, via Cal.com ou Calendly).',
        'Vous partez d’un modèle de consignes que vous adaptez à {company}, puis vous le testez par chat, dans le navigateur et par un vrai appel.',
      ],
      cta: { label: `Essayer pendant ${f.trialDays} jours`, target: 'trial' },
    }),
    P4: () => ({
      category: 'marketing',
      subject: 'Vos clients sauront qu’ils parlent à une IA, et c’est voulu',
      preheader: 'Vous écrivez ses consignes, ses interdits et quand il vous passe l’appel.',
      body: [
        'Dès le début de l’appel, l’agent annonce qu’il est une IA. C’est une obligation du règlement européen sur l’IA, et surtout une question de confiance. Sa voix est naturelle, dans la langue de l’appelant.',
        'Et c’est vous qui gardez la main :',
        {
          ul: [
            'vous écrivez ses consignes : horaires, prix, façon de répondre ;',
            'vous listez ce qu’il ne doit jamais faire : devis chiffré, diagnostic, promesse de délai ;',
            'il transfère l’appel à votre équipe quand vous l’avez prévu, ou organise un rappel avec un résumé. Le transfert est inclus dans tous les forfaits.',
          ],
        },
      ],
      cta: { label: 'Jugez sur vos propres appels', target: 'trial' },
    }),
    P5: (f) => ({
      category: 'marketing',
      subject: 'Vous gardez votre numéro actuel',
      preheader: 'Un simple renvoi d’appel, sans frais d’installation.',
      body: [
        'Pas besoin de changer de numéro ni de prévenir vos clients.',
        'Vous activez un renvoi d’appel chez votre opérateur, par exemple seulement quand vous ne décrochez pas, ou le soir et le week-end. Vos clients composent le numéro habituel de {company}, et l’agent prend le relais quand vous ne pouvez pas répondre. Votre opérateur peut facturer le renvoi vers un numéro étranger : vérifiez votre offre.',
        `Aucun frais d’installation ni de mise en service. Vous préférez un numéro dédié ? C’est une option, dès ${f.phoneNumberFrom} HT par mois selon le pays.`,
      ],
      cta: { label: 'Démarrer l’essai', target: 'trial' },
    }),
    P6: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Nos prix, sans astérisque',
        preheader: 'Trois forfaits, le paiement à l’usage, sans engagement.',
        body: [
          'Voici nos prix, hors taxes :',
          {
            ul: [
              `${r.name} : ${r.price} par mois, ${r.minutes} minutes ;`,
              `${a.name} : ${a.price} par mois, ${a.minutes} minutes ;`,
              `${c.name} : ${c.price} par mois, ${c.minutes} minutes ;`,
              `sans forfait : ${f.paygMinute} la minute, crédit sans date d’expiration.`,
            ],
          },
          `Concrètement, un appel de ${f.exampleCallMinutes} minutes revient à environ ${f.exampleCallPayg} à l’usage, et entre ${f.exampleCallPlanLow} et ${f.exampleCallPlanHigh} dans un forfait.`,
          `Sans engagement : vous résiliez quand vous voulez depuis Billing info. En annuel, ${f.annualFreeMonths} mois sont offerts. Et pendant les ${f.trialDays} jours d’essai, rien n’est débité.`,
        ],
        cta: { label: 'Commencer l’essai', target: 'trial' },
      };
    },
    P7: (f) => ({
      category: 'marketing',
      subject: 'Le bon moment pour {company} ?',
      preheader: 'Dernier e-mail de cette série : répondez simplement « plus tard » ou « non ».',
      body: [
        'C’est le dernier e-mail de cette série : nous ne voulons pas encombrer votre boîte.',
        'Si le moment n’est pas le bon, répondez simplement « plus tard » ou « non », nous en tiendrons compte. Sinon, vous recevrez au plus un e-mail par mois, avec un conseil pratique ; le lien en bas de ce message vous désinscrit en un clic.',
        `Et le jour où vous voudrez essayer : ${f.trialDays} jours, ${f.trialMinutes} minutes d’appels, rien débité pendant l’essai.`,
      ],
      cta: { label: 'Démarrer mon essai', target: 'trial' },
      closing: 'Merci pour votre attention,',
    }),

    // ---------- I : inscrits sans essai (I1 essential, puis marketing) ----------
    I1: (f) => ({
      category: 'essential',
      subject: 'Votre compte est créé : une étape pour démarrer l’essai',
      preheader: 'L’essai démarre quand vous choisissez un forfait dans votre espace.',
      body: [
        `Votre espace ${f.brand} est prêt.`,
        `Pour information, l’essai gratuit de ${f.trialDays} jours (${f.trialMinutes} minutes d’appels) démarre quand vous choisissez un forfait dans votre espace. Une carte est demandée, mais rien n’est débité pendant l’essai ; si vous annulez avant la fin depuis Billing info, vous ne payez rien.`,
        'L’espace client est en anglais, mais son assistante d’aide intégrée vous guide en français, par écrit ou à voix haute.',
      ],
      cta: { label: 'Choisir mon forfait', target: 'billing' },
    }),
    I2: () => ({
      category: 'marketing',
      subject: 'Appelez votre propre agent',
      preheader: 'Chat, navigateur, vrai appel : vérifiez tout avant de lui confier un client.',
      body: [
        'La meilleure démonstration, c’est votre agent à vous : il répond au nom de {company}, avec vos horaires et vos services.',
        'Vous pouvez tout vérifier avant de lui confier un seul client :',
        { ol: ['le chat de test, pour ajuster ses consignes ;', 'l’appel dans le navigateur, pour entendre sa voix ;', 'un vrai appel depuis votre portable.'] },
        'Vous ne renvoyez vos appels que lorsque le résultat vous convient. Le guide « Tester votre agent » détaille chaque étape.',
      ],
      cta: { label: 'Démarrer l’essai et tester', target: 'billing' },
    }),
    I3: (f) => ({
      category: 'marketing',
      subject: 'On configure votre agent ensemble ?',
      preheader: 'Nous vous rappelons pour configurer l’agent avec vous.',
      body: [
        'Pas eu le temps de vous lancer ? Nous pouvons le faire avec vous.',
        `Répondez à cet e-mail avec un créneau et le numéro où vous joindre, ou laissez une demande d’accompagnement sur notre page Essai. Nous vous rappelons pour configurer l’agent de {company} avec vous (consignes, agenda, renvoi d’appel) et démarrer votre essai de ${f.trialDays} jours dans de bonnes conditions.`,
      ],
      cta: { label: 'Demander un accompagnement', target: 'trial_assist' },
    }),
    I4: (f) => ({
      category: 'marketing',
      subject: `${f.trialMinutes} minutes d’essai : où les utiliser ?`,
      preheader: 'Placez-les sur les appels que vous manquez aujourd’hui.',
      body: [
        `${f.trialMinutes} minutes, c’est environ ${f.trialShortCalls} appels de ${f.shortCallMinutes} minutes. Assez pour juger, à condition de les placer au bon endroit.`,
        'Notre conseil : ne renvoyez pas tout. Activez le renvoi seulement quand vous ne décrochez pas, ou le soir et le week-end. Ce sont les appels que {company} perd aujourd’hui, et ceux où l’agent vous sera le plus utile.',
        'Vous lirez le résumé de chaque appel dans votre espace et verrez tout de suite si cela vous sert.',
      ],
      cta: { label: 'Choisir mon forfait et démarrer l’essai', target: 'billing' },
    }),
    I5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Quel forfait choisir pour démarrer ?',
        preheader: 'Un repère simple selon votre volume d’appels.',
        body: [
          'Si vous hésitez, voici un repère simple (prix HT par mois) :',
          {
            ul: [
              `${r.name}, ${r.price} : ${r.minutes} minutes, soit environ ${r.shortCalls} appels de ${f.shortCallMinutes} minutes ;`,
              `${a.name}, ${a.price} : ${a.minutes} minutes, plus des crédits pour répondre par écrit (chat du site, WhatsApp) ;`,
              `${c.name}, ${c.price} : ${c.minutes} minutes.`,
            ],
          },
          `Pas besoin de viser juste du premier coup : vous changez de forfait à tout moment, sans engagement, et le changement s’affiche avant confirmation. Pendant les ${f.trialDays} jours d’essai, rien n’est débité.`,
        ],
        cta: { label: 'Choisir mon forfait', target: 'billing' },
      };
    },
    I6: (f) => ({
      category: 'marketing',
      subject: 'Pas prêt pour un abonnement ? Payez à la minute',
      preheader: `${f.paygMinute} HT la minute, crédit sans expiration.`,
      body: [
        `Un abonnement ne convient pas à tout le monde. Vous pouvez aussi utiliser votre agent sans forfait : vous ajoutez du crédit quand vous voulez (Add credits), la minute est à ${f.paygMinute} HT et le crédit n’expire pas.`,
        `Vous avez alors les mêmes fonctions que le forfait ${f.plans.receptionniste.name}. Ce mode ne comprend pas l’essai gratuit : vous payez seulement ce que vous ajoutez. Dès que vos appels deviennent réguliers, un forfait revient moins cher à la minute.`,
      ],
      cta: { label: 'Ajouter du crédit ou choisir un forfait', target: 'billing' },
    }),
    I7: (f) => ({
      category: 'marketing',
      subject: 'Votre espace reste ouvert',
      preheader: 'Dernier e-mail de cette série : l’essai reste disponible.',
      body: [
        `C’est notre dernier e-mail de cette série. Votre espace ${f.brand} reste ouvert : l’essai de ${f.trialDays} jours (${f.trialMinutes} minutes, rien débité pendant l’essai) démarre dès que vous choisissez un forfait.`,
        'Si quelque chose vous a bloqué, répondez-nous en une ligne : cela nous aide vraiment.',
        'Ensuite, nous vous écrirons au plus une fois par mois. Pour ne plus rien recevoir, cliquez sur le lien de désinscription en bas de cet e-mail.',
      ],
      cta: { label: 'Démarrer quand vous serez prêt', target: 'billing' },
    }),

    // ---------- C : essai en cours (essential, purement informatif) ----------
    C1: (f) => ({
      category: 'essential',
      subject: 'Votre essai a commencé : 3 étapes pour en profiter',
      preheader: 'Votre essai dure jusqu’au {trial_end_date}.',
      body: [
        `Votre essai ${f.brand} a commencé. Il dure jusqu’au {trial_end_date}, avec ${f.trialMinutes} minutes d’appels.`,
        'Pour en profiter :',
        {
          ol: [
            'Créez votre agent à partir d’un modèle et adaptez ses consignes à {company}.',
            'Connectez votre agenda (Cal.com ou Calendly) si vous voulez qu’il prenne des rendez-vous.',
            'Appelez-le vous-même, puis activez le renvoi d’appel quand le résultat vous convient.',
          ],
        },
        'Pendant l’essai, rien n’est débité. Vous pouvez annuler avant le {trial_end_date} depuis Billing info.',
      ],
      cta: { label: 'Ouvrir mon espace', target: 'app' },
    }),
    C2: (f) => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Votre agent attend son premier appel',
      preheader: 'Deux étapes courtes pour son premier appel.',
      body: [
        'Votre agent n’a pas encore reçu d’appel. C’est souvent la dernière marche, et elle est courte :',
        {
          ol: [
            'Appelez-le depuis votre portable et posez-lui une question qu’un client poserait.',
            'Si la réponse vous convient, activez chez votre opérateur le renvoi quand vous ne décrochez pas.',
          ],
        },
        `Vous gardez votre numéro et pouvez désactiver le renvoi à tout moment. Il vous reste ${f.trialMinutes} minutes d’essai, jusqu’au {trial_end_date}.`,
      ],
      cta: { label: 'Ouvrir mon espace', target: 'app' },
    }),
    C3: () => ({
      category: 'essential',
      skipIfEssentialOnly: true,
      subject: 'Améliorez votre agent avec ses premiers appels',
      preheader: 'Relisez les résumés et complétez ses consignes.',
      body: [
        'Vos premiers appels sont la meilleure source pour améliorer votre agent. Dans votre espace, relisez les résumés et repérez :',
        {
          ul: [
            'les questions mal traitées : ajoutez l’information dans ses consignes ;',
            'ce qu’il ne doit jamais promettre : listez-le, il renverra ces sujets vers vous ;',
            'les appels à vous passer directement : réglez le transfert dans « Tools & actions ».',
          ],
        },
        'Le guide « Rédiger les consignes de l’agent » donne les 5 blocs d’une bonne consigne, et l’assistant de rédaction (AI Prompt Editor) vous aide à les écrire.',
      ],
      cta: { label: 'Ouvrir mon espace', target: 'app' },
    }),
    C4: (f) => ({
      category: 'essential',
      subject: 'Il vous reste {minutes_left} minutes d’essai',
      preheader: `Ce qui se passe une fois les ${f.trialMinutes} minutes atteintes.`,
      body: [
        `Il vous reste {minutes_left} minutes sur les ${f.trialMinutes} de votre essai.`,
        `Pour information, une fois les ${f.trialMinutes} minutes atteintes, les appels s’arrêtent jusqu’à la fin de l’essai, le {trial_end_date}, ou jusqu’à ce que vous démarriez votre abonnement {plan_name} depuis Billing info. Sans action de votre part, il démarre de lui-même à la fin de l’essai, sauf si vous l’annulez avant.`,
        'C’est vous qui choisissez.',
      ],
      cta: { label: 'Voir mon abonnement', target: 'billing' },
    }),
    C5: () => ({
      category: 'essential',
      subject: 'Votre essai se termine le {trial_end_date}',
      preheader: 'Ce qui se passe à cette date, et comment annuler sans débit.',
      body: [
        'Votre essai se termine le {trial_end_date}.',
        {
          ul: [
            'Vous souhaitez continuer : rien à faire. Votre forfait {plan_name} démarre ce jour-là, et le premier mois ({plan_price} HT, taxes selon votre pays) est prélevé sur votre carte.',
            'Vous ne souhaitez pas continuer : annulez avant cette date depuis Billing info, bouton « Cancel subscription ». Rien ne sera débité.',
          ],
        },
        'Une question sur votre forfait ou vos minutes ? Répondez à cet e-mail.',
      ],
      cta: { label: 'Gérer mon abonnement', target: 'billing' },
    }),

    // ---------- F : essai terminé sans forfait (F1 essential, puis marketing) ----------
    F1: (f) => ({
      category: 'essential',
      subject: 'Votre essai est terminé, rien n’a été débité',
      preheader: 'Une question : une ligne de réponse suffit.',
      body: [
        'Votre essai a pris fin sans abonnement : rien n’a été débité, et c’est tout à fait votre droit.',
        'Pouvez-vous nous dire en une ligne ce qui a manqué ? La voix, les réponses, la mise en place, le prix, le moment… Répondez simplement à cet e-mail : c’est l’équipe qui lit chaque réponse, et si un réglage peut changer les choses, nous vous le dirons.',
        `Merci d’avoir essayé ${f.brand}.`,
      ],
      cta: null,
    }),
    F2: (f) => ({
      category: 'marketing',
      subject: 'Gardez votre agent, sans abonnement',
      preheader: 'Le paiement à l’usage, sans abonnement.',
      body: [
        'Si c’est l’abonnement qui vous a freiné, il existe une autre formule : le paiement à l’usage.',
        `Votre espace reste accessible. Vous ajoutez du crédit quand vous voulez (Add credits), la minute est à ${f.paygMinute} HT, sans abonnement, et le crédit n’expire pas. Vous gardez les mêmes fonctions que le forfait ${f.plans.receptionniste.name}. Un appel de ${f.exampleCallMinutes} minutes revient à environ ${f.exampleCallPayg} HT.`,
      ],
      cta: { label: 'Ajouter du crédit', target: 'billing' },
    }),
    F3: () => ({
      category: 'marketing',
      subject: 'Et si l’agent ne répondait que le soir et le week-end ?',
      preheader: 'En complément de votre équipe, pas à sa place.',
      body: [
        'Beaucoup d’entreprises n’utilisent pas l’agent pour tout. Elles le gardent en complément de leur équipe : il prend le relais le soir, le week-end, à la pause déjeuner ou quand toutes les lignes sont occupées.',
        'Vous réglez simplement le renvoi d’appel chez votre opérateur pour ces moments-là. Le reste du temps, rien ne change pour {company}, et les appels qui tombaient sur la messagerie reçoivent enfin une réponse, avec un résumé pour vous.',
      ],
      cta: { label: 'Reprendre avec un forfait', target: 'billing' },
    }),
    F4: () => ({
      category: 'marketing',
      subject: 'Les 3 réglages qui changent le plus vos appels',
      preheader: 'Le plus souvent, il manque une information dans ses consignes.',
      body: [
        'Quand un agent déçoit pendant l’essai, c’est le plus souvent une information qui manque dans ses consignes. Les trois réglages qui changent le plus le résultat :',
        {
          ol: [
            'Des informations pratiques complètes : horaires, zone, prix indicatifs, délais.',
            'La liste de ce qu’il ne doit jamais faire, pour qu’il renvoie ces sujets vers vous.',
            'Le transfert vers votre équipe pour les cas sensibles, inclus dans tous les forfaits.',
          ],
        },
        'L’assistant de rédaction de votre espace (AI Prompt Editor) vous aide à les écrire.',
      ],
      cta: { label: 'Reprendre avec ces réglages', target: 'billing' },
    }),
    F5: (f) => {
      const { receptionniste: r, assistant: a, 'centre-appels': c } = f.plans;
      return {
        category: 'marketing',
        subject: 'Plus vous avez d’appels, moins la minute coûte',
        preheader: 'Le prix réel de la minute, forfait par forfait.',
        body: [
          'Dans un forfait, le prix réel de la minute baisse avec le volume :',
          {
            ul: [
              `${r.name}, ${r.price} HT/mois pour ${r.minutes} minutes : environ ${r.perMinute} la minute ;`,
              `${a.name}, ${a.price} HT/mois pour ${a.minutes} minutes : environ ${a.perMinute} ;`,
              `${c.name}, ${c.price} HT/mois pour ${c.minutes} minutes : environ ${c.perMinute}.`,
            ],
          },
          `En mensuel, c’est sans engagement : vous résiliez à tout moment depuis Billing info. En annuel, vous payez ${f.annualPaidMonths} mois pour 12. Le calculateur de notre page Tarifs choisit le moins cher selon vos appels.`,
        ],
        cta: { label: 'Comparer et choisir', target: 'pricing' },
      };
    },
    F6: () => ({
      category: 'marketing',
      subject: 'On vous aide à le mettre en place ?',
      preheader: 'Un membre de l’équipe vous rappelle, sans engagement.',
      body: [
        'Souvent, ce n’est pas l’agent qui déçoit, c’est une consigne qui manque ou un renvoi d’appel mal réglé.',
        'Répondez à cet e-mail avec un créneau et le numéro où vous joindre : un membre de l’équipe vous rappelle pour régler l’agent de {company} avec vous (consignes, transfert, renvoi d’appel), avant que vous choisissiez un forfait. Pas d’engagement, c’est un simple échange.',
      ],
      cta: null,
    }),
    F7: (f) => ({
      category: 'marketing',
      subject: 'Nous arrêtons là, merci d’avoir essayé',
      preheader: 'Dernier e-mail de cette série.',
      body: [
        `C’est notre dernier e-mail de cette série. Merci d’avoir essayé ${f.brand}.`,
        `Votre espace reste accessible : vous pouvez reprendre avec un forfait, sans engagement, ou à l’usage, à ${f.paygMinute} HT la minute.`,
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Mon espace', target: 'billing' },
    }),

    // ---------- U : comptes à l’usage peu actifs (U1 essential, puis marketing) ----------
    U1: () => ({
      category: 'essential',
      subject: 'Votre agent reçoit-il bien vos appels ?',
      preheader: 'Une vérification d’une minute.',
      body: [
        'Votre agent a reçu peu d’appels ces 30 derniers jours. C’est peut-être voulu, mais c’est parfois un renvoi d’appel désactivé ou mal réglé.',
        'Vérification en une minute :',
        {
          ol: [
            'Appelez votre numéro habituel au moment où le renvoi doit s’activer.',
            'Si l’agent ne répond pas, vérifiez le renvoi chez votre opérateur, ou le numéro relié dans votre espace.',
          ],
        },
        'Si tout fonctionne, ne changez rien.',
      ],
      cta: { label: 'Ouvrir mon espace', target: 'app' },
    }),
    U2: () => ({
      category: 'marketing',
      subject: 'Ne lui confiez que les appels que vous manquez',
      preheader: 'Le renvoi seulement quand vous ne décrochez pas.',
      body: [
        'Vous n’êtes pas obligé de tout confier à l’agent. Avec un renvoi en cas de non-réponse ou d’occupation (si votre opérateur le propose), vous décrochez quand vous pouvez, et l’agent prend le relais seulement quand vous ne pouvez pas.',
        'Résultat : moins d’appels perdus pour {company}, et vous ne payez que les minutes réellement utilisées.',
      ],
      cta: { label: 'Mon espace', target: 'app' },
    }),
    U3: (f) => {
      const r = f.plans.receptionniste;
      return {
        category: 'marketing',
        subject: 'À partir de quand un forfait revient moins cher ?',
        preheader: 'Le calcul, avec le prix de la minute à l’usage.',
        body: [
          `Le calcul est simple : à ${f.paygMinute} HT la minute, ${r.price} correspondent à environ ${f.breakEvenMinutes} minutes.`,
          {
            ul: [
              `Moins de ${f.breakEvenMinutes} minutes par mois : restez à l’usage, c’est le plus économique.`,
              `Plus de ${f.breakEvenMinutes} minutes : le forfait ${r.name} (${r.minutes} minutes pour ${r.price} HT) revient moins cher, environ ${r.perMinute} la minute.`,
            ],
          },
          'Vous suivez votre consommation dans votre espace, et un forfait se résilie à tout moment depuis Billing info.',
        ],
        cta: { label: 'Voir ma consommation', target: 'billing' },
      };
    },
    U4: () => ({
      category: 'marketing',
      subject: 'Deux fonctions déjà incluses dans votre compte',
      preheader: 'Le transfert et l’agenda, sans frais à l’acte.',
      body: [
        'Deux fonctions sont déjà incluses, sans frais à l’acte :',
        {
          ul: [
            'le transfert : l’agent passe à votre équipe les appels importants (client mécontent, urgence), selon vos règles, dans « Tools & actions » ; la durée transférée est décomptée de vos minutes ;',
            'l’agenda : connecté via Cal.com ou Calendly, il réserve vos créneaux libres pendant l’appel.',
          ],
        },
        'Enfin, pour ne jamais tomber à zéro crédit, vous pouvez activer la recharge automatique ; une alerte par e-mail vous prévient déjà quand le solde devient bas.',
      ],
      cta: { label: 'Mon espace', target: 'app' },
    }),
    U5: (f) => {
      const x = f.assistantExtras;
      if (!x) return null;
      const a = f.plans.assistant;
      return {
        category: 'marketing',
        subject: 'Répondre aussi par écrit, avec votre voix',
        preheader: `Ce que le forfait ${a.name} ajoute, sans engagement.`,
        body: [
          `À l’usage, vous avez les fonctions du forfait ${f.plans.receptionniste.name}, sans crédits de messages inclus. Le forfait ${a.name} (${a.price} HT par mois) ajoute :`,
          {
            ul: [
              `${a.minutes} minutes d’appels et ${x.agents} agents ;`,
              `${x.messageCredits} crédits de messages par mois, soit environ ${x.writtenReplies} réponses écrites de l’IA (chat du site, WhatsApp) ;`,
              `${x.clonedVoices} voix clonée : la vôtre, ou celle d’une personne qui vous a donné son accord écrit. L’agent annonce toujours qu’il est une IA.`,
            ],
          },
          'Sans engagement, résiliation à tout moment depuis Billing info.',
        ],
        cta: { label: 'Voir les forfaits', target: 'billing' },
      };
    },
    U6: (f) => ({
      category: 'marketing',
      subject: 'Votre formule, votre rythme',
      preheader: 'Dernier e-mail de cette série.',
      body: [
        'C’est notre dernier e-mail de cette série. En résumé :',
        {
          ul: [
            `peu d’appels : l’usage, à ${f.paygMinute} HT la minute, reste le plus adapté, et votre crédit n’expire pas ;`,
            `appels réguliers : un forfait revient moins cher, sans engagement en mensuel, avec ${f.annualFreeMonths} mois offerts en annuel.`,
          ],
        },
        SERIES_END_UNSUBSCRIBE,
      ],
      cta: { label: 'Mon espace', target: 'billing' },
    }),
  },

  // ---------- M : suivi mensuel (marketing, base légale de la série d’origine) ----------
  monthly: {
    // Rotation fixe, tirée des guides publiés (src/i18n/content/fr/guides.ts) : jamais de nouveauté absente du site.
    topics: [
      {
        slug: 'tester-son-agent',
        title: 'tester votre agent de 3 façons',
        paragraph: 'Avant de confier un seul client à votre agent, testez-le de trois façons : le chat de test pour vérifier ses consignes, l’appel dans le navigateur pour entendre sa voix, puis un vrai appel téléphonique, le seul qui valide tous les outils, dont le transfert. Les tests vocaux consomment des minutes comme de vrais appels.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'les 5 blocs d’une bonne consigne',
        paragraph: 'De bonnes consignes tiennent en cinq blocs : le rôle de l’agent (il dit dès le début qu’il est une IA), son style, les informations clés (services, horaires, tarifs, adresse), les règles (quand transférer, ce qu’il ne faut jamais promettre) et le déroulé des situations fréquentes. Relisez régulièrement les transcriptions de vos appels et ajoutez les cas mal traités.',
      },
      {
        slug: 'consignes-system-prompt',
        title: 'ce que votre agent ne doit jamais faire',
        paragraph: 'Vous décidez de ce que votre agent ne doit jamais faire : donner un devis chiffré, poser un diagnostic, promettre un délai. Listez-le dans ses consignes : il renverra ces sujets vers votre équipe, avec un résumé de la demande.',
      },
      {
        slug: 'renvoi-d-appel',
        title: 'garder votre numéro grâce au renvoi d’appel',
        paragraph: 'Vous gardez votre numéro sur vos cartes de visite, votre site et vos annonces : chez votre opérateur, vous activez un renvoi vers le numéro de l’agent, pour tous vos appels ou seulement ceux que vous ne prenez pas. Rien ne change pour vos clients. Le renvoi est facturé par votre opérateur : vérifiez votre forfait.',
      },
    ],
    prospect: (f) => ({
      category: 'marketing',
      subject: 'Le conseil du mois : {topic_title}',
      preheader: 'Un conseil pratique tiré de nos guides.',
      body: ['{topic_paragraph}'],
      cta: { label: `Essayer pendant ${f.trialDays} jours`, target: 'trial' },
      after: ['C’est un e-mail mensuel ; vous pouvez vous désinscrire en un clic en bas de ce message.'],
    }),
    account: () => ({
      category: 'marketing',
      subject: 'Le conseil du mois : {topic_title}',
      preheader: 'Un conseil pratique tiré de nos guides.',
      body: ['{topic_paragraph}'],
      cta: { label: 'Ouvrir mon espace', target: 'billing' },
      after: ['C’est un e-mail mensuel ; vous pouvez vous désinscrire en un clic en bas de ce message.'],
    }),
  },
};
