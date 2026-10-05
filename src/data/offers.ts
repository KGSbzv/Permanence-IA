// Offres HT (doc 92) et fonctions incluses, alignées sur les pages et fonctions
// réellement activables dans l’interface client white-label (admin Autocalls).

export type OfferSlug = 'decouverte' | 'essentiel' | 'croissance' | 'pro' | 'sur-mesure';

export interface Offer {
  slug: OfferSlug;
  name: string;
  audience: string;
  launchPrice: number | null; // € HT / mois au lancement
  normalPrice: number | null; // € HT / mois ensuite
  priceLabel?: string; // pour Découverte et Sur mesure
  minutes: string;
  overage: string;
  title: string; // titre de la page offre
  pitch: string;
  cta: string;
  highlights: string[]; // résumé carte tarif
  featured?: boolean;
}

export const OFFERS: Offer[] = [
  {
    slug: 'decouverte',
    name: 'Découverte',
    audience: 'Pour tester l’agent sur votre activité',
    launchPrice: 0,
    normalPrice: 0,
    priceLabel: '0 €',
    minutes: '30 minutes sur 14 jours',
    overage: 'Passage à une offre payante',
    title: 'Testez l’agent gratuitement pendant 14 jours',
    pitch:
      'Découvrez la plateforme, configurez un premier agent, essayez la démo live et utilisez jusqu’à 30 minutes d’appels pour valider le potentiel sur votre activité.',
    cta: 'Réclamer mes 30 minutes',
    highlights: ['1 agent de test', 'Démo live de l’agent', 'Widget web et formulaire de rappel', 'Aperçu de la base de connaissances'],
  },
  {
    slug: 'essentiel',
    name: 'Essentiel',
    audience: 'Indépendants et petites structures',
    launchPrice: 59,
    normalPrice: 79,
    minutes: '150 min / mois',
    overage: '0,19 € HT / min ou recharge',
    title: 'L’offre simple pour ne plus perdre les demandes importantes',
    pitch:
      'Essentiel capte les appels, qualifie les demandes et organise les rappels, sans complexité. Votre réceptionniste IA répond 24/7 et vous transmet un résumé clair de chaque demande.',
    cta: 'Démarrer Essentiel',
    highlights: ['Réceptionniste IA 24/7', 'Agenda connecté', 'Widget web de rappel', 'Transfert vers un humain'],
  },
  {
    slug: 'croissance',
    name: 'Croissance',
    audience: 'Entreprises locales à volume régulier',
    launchPrice: 129,
    normalPrice: 179,
    minutes: '500 min / mois',
    overage: '0,156 à 0,138 € HT / min selon le lot',
    title: 'La meilleure offre pour automatiser vos demandes à volume régulier',
    pitch:
      'Croissance combine capture, qualification, rappels, agenda, messages et scénarios automatisés pour les entreprises qui veulent convertir plus de demandes.',
    cta: 'Choisir Croissance',
    highlights: ['Tout Essentiel', 'Flow builder et automatisations', 'Campagnes et leads', 'SMS, WhatsApp et Instagram', 'Vos numéros via SIP'],
    featured: true,
  },
  {
    slug: 'pro',
    name: 'Pro',
    audience: 'Équipes et activités multiservices',
    launchPrice: 249,
    normalPrice: 349,
    minutes: '1 500 min / mois',
    overage: '0,129 € HT / min ou add-on',
    title: 'L’offre la plus complète pour structurer l’accueil, les rendez-vous et le support',
    pitch:
      'Pro ajoute le reporting détaillé, les rôles, plusieurs agents et plusieurs métiers, la base de connaissances avancée et les connexions API pour professionnaliser votre réception IA.',
    cta: 'Profiter du tarif de lancement',
    highlights: ['Tout Croissance', 'Rapports détaillés', 'Multi-agents et rôles', 'API, webhooks et outils MCP', 'Support prioritaire'],
  },
  {
    slug: 'sur-mesure',
    name: 'Sur mesure',
    audience: 'Réseaux, multi-sites et intégrations avancées',
    launchPrice: null,
    normalPrice: null,
    priceLabel: 'À partir de 399 €',
    minutes: 'À partir de 2 500 min / mois',
    overage: 'Contractuel',
    title: 'Une configuration adaptée à vos règles, vos sites et vos intégrations',
    pitch:
      'Pour les réseaux et les organisations multi-sites : quotas personnalisés, règles par établissement, intégrations avancées, SLA et déploiement accompagné.',
    cta: 'Parler à un expert',
    highlights: ['Tout Pro', 'Règles multi-sites', 'Quotas personnalisés', 'SLA et déploiement guidé'],
  },
];

export const offer = (slug: OfferSlug) => OFFERS.find((o) => o.slug === slug)!;

// Matrice des fonctions : chaque ligne correspond à une page ou une fonction de l’interface client.
// Valeurs : true = inclus, false = non inclus, texte = niveau.
export type Cell = boolean | string;
export interface MatrixRow { label: string; detail: string; cells: Record<OfferSlug, Cell> }
export interface MatrixGroup { group: string; rows: MatrixRow[] }

const all = (v: Cell): Record<OfferSlug, Cell> => ({ decouverte: v, essentiel: v, croissance: v, pro: v, 'sur-mesure': v });

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents et appels',
    rows: [
      { label: 'Assistants vocaux IA', detail: 'Agents entrants et sortants', cells: { decouverte: '1 de test', essentiel: '1', croissance: '3', pro: 'Multi-agents', 'sur-mesure': 'Sur mesure' } },
      { label: 'Historique des appels', detail: 'Enregistrements, transcriptions, résumés', cells: { ...all(true), decouverte: 'Limité' } },
      { label: 'Conversations', detail: 'Échanges écrits et vocaux centralisés', cells: all(true) },
      { label: 'Transfert vers un humain', detail: 'Bascule vers votre équipe', cells: { ...all(true), decouverte: false } },
      { label: 'Voix multilingues', detail: 'Langues secondaires détectées', cells: { ...all(true), decouverte: 'Aperçu' } },
    ],
  },
  {
    group: 'Configuration de l’agent',
    rows: [
      { label: 'Éditeur de prompts IA', detail: 'Comportement, ton, règles', cells: { decouverte: 'Aperçu', essentiel: 'Simplifié', croissance: true, pro: true, 'sur-mesure': true } },
      { label: 'Base de connaissances', detail: 'PDF, pages web, procédures', cells: { decouverte: 'Aperçu', essentiel: 'Basique', croissance: true, pro: 'Avancée', 'sur-mesure': 'Avancée' } },
      { label: 'Flow builder', detail: 'Scénarios visuels sans code', cells: { decouverte: false, essentiel: false, croissance: true, pro: 'Avancé', 'sur-mesure': 'Avancé' } },
      { label: 'Automatisations', detail: 'Plus de 300 outils connectables', cells: { decouverte: false, essentiel: false, croissance: true, pro: true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Agenda et capture',
    rows: [
      { label: 'Intégration calendrier', detail: 'Google, Outlook, Cal.com, Calendly', cells: { ...all(true), decouverte: 'Aperçu' } },
      { label: 'Widget web', detail: 'Rappel et appel depuis votre site', cells: all(true) },
      { label: 'Identification de l’appelant', detail: 'Bouton caller ID', cells: { ...all(true), decouverte: false } },
      { label: 'Leads et préqualification', detail: 'Fiches prospects structurées', cells: { decouverte: false, essentiel: 'Basique', croissance: true, pro: true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Messages et campagnes',
    rows: [
      { label: 'Campagnes sortantes', detail: 'Relances, confirmations, rappels', cells: { decouverte: false, essentiel: false, croissance: 'Encadrées', pro: true, 'sur-mesure': true } },
      { label: 'Historique SMS', detail: 'Envois et réponses', cells: { decouverte: false, essentiel: false, croissance: true, pro: true, 'sur-mesure': true } },
      { label: 'WhatsApp', detail: 'Expéditeurs et templates', cells: { decouverte: false, essentiel: false, croissance: true, pro: true, 'sur-mesure': true } },
      { label: 'Messenger et Instagram', detail: 'Canaux de messagerie', cells: { decouverte: false, essentiel: false, croissance: true, pro: true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Téléphonie',
    rows: [
      { label: 'Numéros internationaux', detail: 'Dans plus de 150 pays', cells: { decouverte: false, essentiel: 'En option', croissance: true, pro: true, 'sur-mesure': true } },
      { label: 'Intégration SIP', detail: 'Vos numéros et votre standard', cells: { decouverte: false, essentiel: false, croissance: true, pro: true, 'sur-mesure': true } },
      { label: 'Liste de blocage', detail: 'Numéros exclus des appels', cells: { ...all(true), decouverte: false } },
    ],
  },
  {
    group: 'Pilotage et équipe',
    rows: [
      { label: 'Rapports détaillés', detail: 'Volumes, durées, conversions', cells: { decouverte: false, essentiel: 'Tableau de bord', croissance: 'Tableau de bord', pro: true, 'sur-mesure': true } },
      { label: 'Rôles et permissions', detail: 'Accès par membre de l’équipe', cells: { decouverte: false, essentiel: false, croissance: false, pro: true, 'sur-mesure': true } },
      { label: 'API, webhooks et outils MCP', detail: 'Connexion à vos systèmes', cells: { decouverte: false, essentiel: false, croissance: false, pro: true, 'sur-mesure': true } },
      { label: 'Règles multi-sites et SLA', detail: 'Plusieurs établissements', cells: { decouverte: false, essentiel: false, croissance: false, pro: false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Accompagnement', cells: { decouverte: 'Ressources', essentiel: 'Standard', croissance: 'Standard', pro: 'Prioritaire', 'sur-mesure': 'Dédié' } },
    ],
  },
];

export const RECHARGES = [
  { minutes: '100 min', launch: 19, normal: 29 },
  { minutes: '250 min', launch: 39, normal: 59 },
  { minutes: '500 min', launch: 69, normal: 99 },
  { minutes: '1 000 min', launch: 129, normal: 179 },
  { minutes: '2 500 min', launch: 279, normal: 399 },
];

export const ADDONS = [
  { minutes: '+300 min / mois', launch: 39, normal: 59 },
  { minutes: '+800 min / mois', launch: 89, normal: 119 },
  { minutes: '+1 500 min / mois', launch: 149, normal: 219 },
];

export const euro = (n: number) => `${n.toLocaleString('fr-FR')} €`;
