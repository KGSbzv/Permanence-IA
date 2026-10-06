// Textes des offres et de la matrice des fonctions. Les prix et minutes viennent du marché
// (src/i18n/markets.ts) : ce fichier ne contient que des mots.
import type { PlanSlug } from '../../markets';

export interface OfferText {
  name: string;
  audience: string;
  title: string; // titre de la page offre
  pitch: string;
  cta: string;
  highlights: string[];
}

export const OFFER_TEXT: Record<PlanSlug, OfferText> = {
  decouverte: {
    name: 'Découverte',
    audience: 'Pour tester l’agent sur votre activité',
    title: 'Testez l’agent gratuitement pendant 14 jours',
    pitch: 'Découvrez la plateforme, configurez un premier agent, essayez la démo live et utilisez jusqu’à 30 minutes d’appels pour valider le potentiel sur votre activité.',
    cta: 'Commencer gratuitement',
    highlights: ['14 jours sur le forfait de votre choix', '30 minutes d’appels incluses', 'Carte demandée, rien n’est débité pendant l’essai', 'Annulation sans frais avant la fin de l’essai'],
  },
  receptionniste: {
    name: 'Réceptionniste',
    audience: 'Indépendants et petites structures',
    title: 'Une réceptionniste IA qui répond à chaque appel, 24 h/24',
    pitch: 'Le forfait Réceptionniste capte vos appels, répond aux questions fréquentes, prend les rendez-vous et vous transmet un résumé clair de chaque demande. Simple à mettre en place, sans complexité.',
    cta: 'Choisir Réceptionniste',
    highlights: ['Réceptionniste IA 24/7', 'Agenda connecté', 'Widget web de rappel', 'Transfert vers un humain'],
  },
  assistant: {
    name: 'Assistant',
    audience: 'Entreprises locales à volume régulier',
    title: 'Un assistant IA qui qualifie, relance et automatise vos demandes',
    pitch: 'Le forfait Assistant ajoute la qualification des leads, les campagnes de relance, les messages SMS et WhatsApp, le flow builder et vos propres numéros via SIP, pour convertir plus de demandes.',
    cta: 'Choisir Assistant',
    highlights: ['Tout Réceptionniste', 'Flow builder et automatisations', 'Campagnes et leads', 'SMS, WhatsApp et Instagram', 'Vos numéros via SIP'],
  },
  'centre-appels': {
    name: 'Centre d’appels',
    audience: 'Équipes, multi-services et gros volumes',
    title: 'Un centre d’appels IA complet pour structurer accueil, rendez-vous et support',
    pitch: 'Le forfait Centre d’appels réunit plusieurs agents, les rapports détaillés, les rôles, la base de connaissances avancée, les API et le support prioritaire, avec le meilleur prix à la minute.',
    cta: 'Choisir Centre d’appels',
    highlights: ['Tout Assistant', 'Multi-agents et rôles', 'Rapports détaillés', 'API, webhooks et outils MCP', 'Support prioritaire', '3 000 crédits de messages inclus (30 $)'],
  },
  'sur-mesure': {
    name: 'Sur mesure',
    audience: 'Au-delà de 2 500 minutes régulières',
    title: 'Une configuration adaptée à vos volumes, vos sites et vos intégrations',
    pitch: 'Pour les réseaux, les organisations multi-sites et les volumes réguliers au-delà de 2 500 minutes : prix à la minute négocié, règles par établissement, intégrations avancées et déploiement accompagné.',
    cta: 'Parler à un expert',
    highlights: ['Tout Centre d’appels', 'Prix à la minute négocié', 'Règles multi-sites', 'SLA et déploiement guidé'],
  },
};

/** Libellés construits à partir des chiffres du marché. `n` est déjà formaté (ex. « 1 000 »). */
export const OFFER_LABELS = {
  free: '0 $',
  onQuote: 'Sur devis',
  minutesPerMonth: (n: string) => `${n} min / mois`,
  trialMinutes: (n: string, days: number) => `${n} minutes sur ${days} jours`,
  customVolume: 'Volume adapté à votre activité',
  perMinute: (price: string) => `${price} HT / min`,
  exclTax: 'HT',
  perMonth: 'HT / mois',
};

// Matrice des fonctions : chaque ligne correspond à une page ou une fonction de l’interface client.
// Valeurs : true = inclus, false = non inclus, texte = niveau.
export type Cell = boolean | string;
export interface MatrixRow { label: string; detail: string; cells: Record<PlanSlug, Cell> }
export interface MatrixGroup { group: string; rows: MatrixRow[] }

const all = (v: Cell): Record<PlanSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents et appels',
    rows: [
      { label: 'Assistants vocaux IA', detail: 'Agents entrants et sortants', cells: { decouverte: '1 de test', receptionniste: '1', assistant: '3', 'centre-appels': 'Multi-agents', 'sur-mesure': 'Sur mesure' } },
      { label: 'Historique des appels', detail: 'Enregistrements, transcriptions, résumés', cells: { ...all(true), decouverte: 'Limité' } },
      { label: 'Conversations', detail: 'Échanges écrits et vocaux centralisés', cells: all(true) },
      { label: 'Transfert vers un humain', detail: 'Bascule vers votre équipe', cells: all(true) },
      { label: 'Voix multilingues', detail: 'Langues secondaires détectées', cells: all(true) },
    ],
  },
  {
    group: 'Configuration de l’agent',
    rows: [
      { label: 'Éditeur de prompts IA', detail: 'Comportement, ton, règles', cells: { decouverte: 'Aperçu', receptionniste: 'Simplifié', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Base de connaissances', detail: 'PDF, pages web, procédures', cells: { decouverte: 'Basique', receptionniste: 'Basique', assistant: true, 'centre-appels': 'Avancée', 'sur-mesure': 'Avancée' } },
      { label: 'Flow builder', detail: 'Scénarios visuels sans code', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': 'Avancé', 'sur-mesure': 'Avancé' } },
      { label: 'Automatisations', detail: 'Plus de 300 outils connectables', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Agenda et capture',
    rows: [
      { label: 'Intégration calendrier', detail: 'Google, Outlook, Cal.com, Calendly', cells: all(true) },
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
