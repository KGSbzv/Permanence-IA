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
    cta: 'Démarrer l’essai de 14 jours',
    highlights: ['14 jours sur le forfait de votre choix', '30 minutes d’appels incluses', 'Carte demandée, rien n’est débité pendant l’essai', 'Annulation sans frais avant la fin de l’essai'],
  },
  receptionniste: {
    name: 'Réceptionniste',
    audience: 'Indépendants et petites structures',
    title: 'Une réceptionniste IA qui répond à chaque appel, 24 h/24',
    pitch: 'Le forfait Réceptionniste capte vos appels, répond aux questions fréquentes, prend les rendez-vous et vous transmet un résumé clair de chaque demande. Simple à mettre en place, sans complexité.',
    cta: 'Choisir Réceptionniste',
    highlights: ['1 agent vocal IA qui répond 24 h/24', '2 appels simultanés', '1 numéro et 1 base de connaissances', 'Agenda connecté et widget web', 'Transfert d’appel vers votre équipe', 'SMS, WhatsApp et Messenger (crédits de messages en option)'],
  },
  assistant: {
    name: 'Assistant',
    audience: 'Entreprises locales à volume régulier',
    title: 'Un assistant IA qui qualifie, relance et automatise vos demandes',
    pitch: 'Le forfait Assistant ajoute trois agents, les rappels et confirmations automatiques, les scénarios automatisés reliés à plus de 300 outils et une voix clonée, pour convertir plus de demandes.',
    cta: 'Choisir Assistant',
    highlights: ['Tout Réceptionniste, et en plus :', '3 agents, 5 appels simultanés', '3 numéros, 3 bases de connaissances, 3 outils en appel', '3 campagnes de relance', 'Scénarios automatisés (5 000 exécutions / mois)', '1 voix clonée', '1 000 crédits de messages par mois (≈ 500 réponses écrites)'],
  },
  'centre-appels': {
    name: 'Centre d’appels',
    audience: 'Équipes, multi-services et gros volumes',
    title: 'Un centre d’appels IA complet pour structurer accueil, rendez-vous et support',
    pitch: 'Le forfait Centre d’appels lève les limites : agents et campagnes illimités, 20 appels simultanés, tableaux de bord personnalisés, support prioritaire et le meilleur prix à la minute.',
    cta: 'Choisir Centre d’appels',
    highlights: ['Tout Assistant, et en plus :', 'Agents, campagnes et bases illimités', '20 appels simultanés, 10 numéros', '3 voix clonées, 50 000 automatisations / mois', 'Tableaux de bord personnalisés', 'Support prioritaire', '3 000 crédits de messages par mois (≈ 1 500 réponses écrites)'],
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
const paid = (v: Cell): Record<PlanSlug, Cell> => ({ ...all(v), decouverte: false });

// Limites relevées dans l’admin de l’espace client (forfaits Receptionist 1646, Assistant 1647, Call Centre 1650
// et essai) : toute modification d’un forfait dans l’admin doit être reportée ici, et inversement.
export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents et appels',
    rows: [
      { label: 'Agents vocaux IA', detail: 'Nombre d’agents que vous pouvez créer, entrants ou sortants.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Illimités', 'sur-mesure': 'Illimités' } },
      { label: 'Appels simultanés', detail: 'Appels traités en même temps : personne n’attend, même aux heures de pointe.', cells: { decouverte: '1', receptionniste: '2', assistant: '5', 'centre-appels': '20', 'sur-mesure': 'Sur mesure' } },
      { label: 'Historique des appels', detail: 'Enregistrements, transcriptions et résumés de chaque appel.', cells: all(true) },
      { label: 'Transfert vers un humain', detail: 'L’agent bascule l’appel vers votre équipe quand c’est nécessaire.', cells: all(true) },
      { label: 'Langues secondaires', detail: 'L’agent détecte la langue de l’appelant et lui répond dans sa langue.', cells: all(true) },
      { label: 'Voix clonées', detail: 'Une voix créée à partir d’un enregistrement de la vôtre.', cells: { decouverte: false, receptionniste: false, assistant: '1', 'centre-appels': '3', 'sur-mesure': 'Sur mesure' } },
    ],
  },
  {
    group: 'Configuration de l’agent',
    rows: [
      { label: 'Consignes de l’agent', detail: 'Un assistant de rédaction règle le comportement, le ton et les règles de l’agent.', cells: all(true) },
      { label: 'Bases de connaissances', detail: 'PDF, pages web et procédures que l’agent consulte pendant l’appel.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Illimitées', 'sur-mesure': 'Illimitées' } },
      { label: 'Outils pendant l’appel', detail: 'Actions déclenchées en direct : vérifier une disponibilité, consulter un dossier, interroger votre logiciel.', cells: { decouverte: '1', receptionniste: false, assistant: '3', 'centre-appels': 'Illimités', 'sur-mesure': 'Illimités' } },
      { label: 'Scénarios automatisés', detail: 'Scénarios visuels sans code : déclencheurs, conditions et actions.', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Plateforme d’automatisation', detail: 'Plus de 300 outils connectables : CRM, Google Sheets, Slack, email…', cells: { decouverte: false, receptionniste: false, assistant: '5 000 exécutions / mois', 'centre-appels': '50 000 exécutions / mois', 'sur-mesure': 'Sur mesure' } },
      { label: 'Connecteur IA', detail: 'Pilotez votre espace depuis ChatGPT ou Claude : créer un agent, lire vos appels, lancer une action.', cells: all(true) },
    ],
  },
  {
    group: 'Agenda et capture',
    rows: [
      { label: 'Intégration calendrier', detail: 'Google, Outlook, Cal.com, Calendly : l’agent réserve dans votre agenda.', cells: all(true) },
      { label: 'Widget web', detail: 'Bouton d’appel et de rappel à poser sur votre site.', cells: all(true) },
      { label: 'Fiches prospects', detail: 'Fiches créées à partir des appels.', cells: all(true) },
    ],
  },
  {
    group: 'Messages et campagnes',
    rows: [
      { label: 'Rappels et confirmations', detail: 'Relances, confirmations et rappels appelés automatiquement.', cells: { decouverte: false, receptionniste: false, assistant: '3', 'centre-appels': 'Illimitées', 'sur-mesure': 'Illimitées' } },
      { label: 'SMS et WhatsApp', detail: 'Échanges écrits centralisés, payés avec les crédits de messages.', cells: all(true) },
      { label: 'Messenger et Instagram', detail: 'Messages des réseaux sociaux dans la même boîte.', cells: all(true) },
      { label: 'Crédits de messages inclus', detail: 'Crédits offerts chaque mois pour les échanges écrits (WhatsApp, SMS, Messenger, chat). 100 crédits = 1 $, une réponse de l’IA ≈ 2 crédits. Sans crédits inclus, vous rechargez selon votre usage.', cells: { decouverte: false, receptionniste: 'À la demande', assistant: '1 000 / mois (≈ 500 réponses)', 'centre-appels': '3 000 / mois (≈ 1 500 réponses)', 'sur-mesure': 'Sur mesure' } },
    ],
  },
  {
    group: 'Téléphonie',
    rows: [
      { label: 'Numéros de téléphone', detail: 'Numéros dédiés achetés depuis votre espace, facturés au mois selon le pays.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': '10', 'sur-mesure': 'Sur mesure' } },
      { label: 'Connexion SIP', detail: 'Gardez vos numéros et votre standard : connexion SIP, import Twilio ou Telnyx.', cells: all(true) },
      { label: 'Votre propre mobile en présentation', detail: 'Vérifiez votre numéro pour qu’il s’affiche lors des appels sortants.', cells: paid(true) },
      { label: 'Liste de blocage', detail: 'Numéros que l’agent n’appelle jamais.', cells: all(true) },
    ],
  },
  {
    group: 'Pilotage et intégrations',
    rows: [
      { label: 'Statistiques des appels', detail: 'Volumes, durées et résultats sur votre tableau de bord.', cells: all(true) },
      { label: 'Tableaux de bord personnalisés', detail: 'Vos propres indicateurs, composés à partir des données de vos appels.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API et webhooks', detail: 'Recevez chaque fin d’appel dans vos systèmes, ou pilotez l’agent depuis votre logiciel.', cells: all(true) },
      { label: 'Règles multi-sites et SLA', detail: 'Plusieurs établissements, engagements de service.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Accompagnement par notre équipe.', cells: { decouverte: 'Ressources', receptionniste: 'Standard', assistant: 'Standard', 'centre-appels': 'Prioritaire', 'sur-mesure': 'Dédié' } },
    ],
  },
];
