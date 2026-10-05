// Offres HT (doc 92) et fonctions incluses, alignées sur les pages et fonctions
// réellement activables dans l’interface client white-label (admin Autocalls).

export type OfferSlug = 'decouverte' | 'receptionniste' | 'assistant' | 'centre-appels' | 'sur-mesure';

export interface Offer {
  slug: OfferSlug;
  name: string;
  audience: string;
  price: number | null; // $ HT / mois (null = sur devis)
  priceLabel?: string;
  minutes: string;
  minutesCount: number; // pour le calculateur et le prix par minute
  perMinute?: string; // coût réel par minute du forfait
  extraMinute?: number; // $ HT par minute supplémentaire (crédit), toujours > perMinute
  title: string; // titre de la page offre
  pitch: string;
  cta: string;
  highlights: string[];
  featured?: boolean;
}

export const OFFERS: Offer[] = [
  {
    slug: 'decouverte',
    name: 'Découverte',
    audience: 'Pour tester l’agent sur votre activité',
    price: 0,
    priceLabel: '0 $',
    minutes: '30 minutes sur 14 jours',
    minutesCount: 30,
    title: 'Testez l’agent gratuitement pendant 14 jours',
    pitch:
      'Découvrez la plateforme, configurez un premier agent, essayez la démo live et utilisez jusqu’à 30 minutes d’appels pour valider le potentiel sur votre activité.',
    cta: 'Réclamer mes 30 minutes',
    highlights: ['1 agent de test', 'Démo live de l’agent', 'Widget web et formulaire de rappel', 'Aperçu de la base de connaissances'],
  },
  {
    slug: 'receptionniste',
    name: 'Réceptionniste',
    audience: 'Indépendants et petites structures',
    price: 99,
    minutes: '350 min / mois',
    minutesCount: 350,
    perMinute: '0,28 $ HT / min',
    extraMinute: 0.39,
    title: 'Une réceptionniste IA qui répond à chaque appel, 24 h/24',
    pitch:
      'Le forfait Réceptionniste capte vos appels, répond aux questions fréquentes, prend les rendez-vous et vous transmet un résumé clair de chaque demande. Simple à mettre en place, sans complexité.',
    cta: 'Choisir Réceptionniste',
    highlights: ['Réceptionniste IA 24/7', 'Agenda connecté', 'Widget web de rappel', 'Transfert vers un humain'],
  },
  {
    slug: 'assistant',
    name: 'Assistant',
    audience: 'Entreprises locales à volume régulier',
    price: 249,
    minutes: '1 000 min / mois',
    minutesCount: 1000,
    perMinute: '0,25 $ HT / min',
    extraMinute: 0.36,
    title: 'Un assistant IA qui qualifie, relance et automatise vos demandes',
    pitch:
      'Le forfait Assistant ajoute la qualification des leads, les campagnes de relance, les messages SMS et WhatsApp, le flow builder et vos propres numéros via SIP, pour convertir plus de demandes.',
    cta: 'Choisir Assistant',
    highlights: ['Tout Réceptionniste', 'Flow builder et automatisations', 'Campagnes et leads', 'SMS, WhatsApp et Instagram', 'Vos numéros via SIP'],
    featured: true,
  },
  {
    slug: 'centre-appels',
    name: 'Centre d’appels',
    audience: 'Équipes, multi-services et gros volumes',
    price: 499,
    minutes: '2 200 min / mois',
    minutesCount: 2200,
    perMinute: '0,23 $ HT / min',
    extraMinute: 0.32,
    title: 'Un centre d’appels IA complet pour structurer accueil, rendez-vous et support',
    pitch:
      'Le forfait Centre d’appels réunit plusieurs agents, les rapports détaillés, les rôles, la base de connaissances avancée, les API et le support prioritaire, avec le meilleur prix à la minute.',
    cta: 'Choisir Centre d’appels',
    highlights: ['Tout Assistant', 'Multi-agents et rôles', 'Rapports détaillés', 'API, webhooks et outils MCP', 'Support prioritaire'],
  },
  {
    slug: 'sur-mesure',
    name: 'Sur mesure',
    audience: 'Au-delà de 2 500 minutes régulières',
    price: null,
    priceLabel: 'Sur devis',
    minutes: 'Volume adapté à votre activité',
    minutesCount: 2500,
    title: 'Une configuration adaptée à vos volumes, vos sites et vos intégrations',
    pitch:
      'Pour les réseaux, les organisations multi-sites et les volumes réguliers au-delà de 2 500 minutes : prix à la minute négocié, règles par établissement, intégrations avancées et déploiement accompagné.',
    cta: 'Parler à un expert',
    highlights: ['Tout Centre d’appels', 'Prix à la minute négocié', 'Règles multi-sites', 'SLA et déploiement guidé'],
  },
];

export const offer = (slug: OfferSlug) => OFFERS.find((o) => o.slug === slug)!;

// Matrice des fonctions : chaque ligne correspond à une page ou une fonction de l’interface client.
// Valeurs : true = inclus, false = non inclus, texte = niveau.
export type Cell = boolean | string;
export interface MatrixRow { label: string; detail: string; cells: Record<OfferSlug, Cell> }
export interface MatrixGroup { group: string; rows: MatrixRow[] }

const all = (v: Cell): Record<OfferSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents et appels',
    rows: [
      { label: 'Assistants vocaux IA', detail: 'Agents entrants et sortants', cells: { decouverte: '1 de test', receptionniste: '1', assistant: '3', 'centre-appels': 'Multi-agents', 'sur-mesure': 'Sur mesure' } },
      { label: 'Historique des appels', detail: 'Enregistrements, transcriptions, résumés', cells: { ...all(true), decouverte: 'Limité' } },
      { label: 'Conversations', detail: 'Échanges écrits et vocaux centralisés', cells: all(true) },
      { label: 'Transfert vers un humain', detail: 'Bascule vers votre équipe', cells: { ...all(true), decouverte: false } },
      { label: 'Voix multilingues', detail: 'Langues secondaires détectées', cells: { ...all(true), decouverte: 'Aperçu' } },
    ],
  },
  {
    group: 'Configuration de l’agent',
    rows: [
      { label: 'Éditeur de prompts IA', detail: 'Comportement, ton, règles', cells: { decouverte: 'Aperçu', receptionniste: 'Simplifié', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Base de connaissances', detail: 'PDF, pages web, procédures', cells: { decouverte: 'Aperçu', receptionniste: 'Basique', assistant: true, 'centre-appels': 'Avancée', 'sur-mesure': 'Avancée' } },
      { label: 'Flow builder', detail: 'Scénarios visuels sans code', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': 'Avancé', 'sur-mesure': 'Avancé' } },
      { label: 'Automatisations', detail: 'Plus de 300 outils connectables', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Agenda et capture',
    rows: [
      { label: 'Intégration calendrier', detail: 'Google, Outlook, Cal.com, Calendly', cells: { ...all(true), decouverte: 'Aperçu' } },
      { label: 'Widget web', detail: 'Rappel et appel depuis votre site', cells: all(true) },
      { label: 'Identification de l’appelant', detail: 'Bouton caller ID', cells: { ...all(true), decouverte: false } },
      { label: 'Leads et préqualification', detail: 'Fiches prospects structurées', cells: { decouverte: false, receptionniste: 'Basique', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Messages et campagnes',
    rows: [
      { label: 'Campagnes sortantes', detail: 'Relances, confirmations, rappels', cells: { decouverte: false, receptionniste: false, assistant: 'Encadrées', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Historique SMS', detail: 'Envois et réponses', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'WhatsApp', detail: 'Expéditeurs et templates', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Messenger et Instagram', detail: 'Canaux de messagerie', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Téléphonie',
    rows: [
      { label: 'Numéro dédié', detail: 'Option facturée au mois, selon le pays', cells: { decouverte: false, receptionniste: 'En option', assistant: 'En option', 'centre-appels': 'En option', 'sur-mesure': 'En option' } },
      { label: 'Intégration SIP', detail: 'Vos numéros et votre standard', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Liste de blocage', detail: 'Numéros exclus des appels', cells: { ...all(true), decouverte: false } },
    ],
  },
  {
    group: 'Pilotage et équipe',
    rows: [
      { label: 'Rapports détaillés', detail: 'Volumes, durées, conversions', cells: { decouverte: false, receptionniste: 'Tableau de bord', assistant: 'Tableau de bord', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Rôles et permissions', detail: 'Accès par membre de l’équipe', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API, webhooks et outils MCP', detail: 'Connexion à vos systèmes', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Règles multi-sites et SLA', detail: 'Plusieurs établissements', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Accompagnement', cells: { decouverte: 'Ressources', receptionniste: 'Standard', assistant: 'Standard', 'centre-appels': 'Prioritaire', 'sur-mesure': 'Dédié' } },
    ],
  },
];

// Recharges de crédit (modèle Autocalls) : le crédit acheté paie les minutes au-delà du forfait,
// au tarif « minute supplémentaire » du forfait, toujours plus cher que la minute incluse.
export const RECHARGES = [39, 89, 159, 299, 725];

export const money = (n: number, digits = 0) => `${n.toLocaleString('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits })} $`;
export const euro = money; // compatibilité
export const perMin = (price: number, minutes: number) => money(price / minutes, 2);
