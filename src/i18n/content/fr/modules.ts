// Sous-pages modules (doc 112) : chaque module décrit une fonction réelle de l’interface client.
import type { PlanSlug as OfferSlug } from '../../markets';

export type MockKind =
  | 'call' | 'calendar' | 'transcript' | 'knowledge' | 'prompt' | 'flow'
  | 'numbers' | 'report' | 'widget' | 'whatsapp' | 'campaign' | 'lead' | 'support';

export interface Module {
  slug: string;
  name: string;
  family: string;
  short: string; // phrase bénéfice (cartes)
  title: string; // hero
  intro: string;
  uses: string[]; // « À quoi ça sert »
  steps: { title: string; text: string }[]; // « Comment ça marche »
  cases: string[]; // cas d’usage
  integrations: string[];
  from: OfferSlug; // offre minimale
  mock: MockKind;
}

export const MODULES: Module[] = [
  {
    slug: 'receptionniste-ia', name: 'Réceptionniste IA', family: 'Téléphonie',
    short: 'Répond à chaque appel, qualifie la demande et transfère ce qui compte.',
    title: 'Une réceptionniste qui décroche à chaque appel, de jour comme de nuit',
    intro: 'L’agent accueille vos appelants avec votre ton, comprend leur demande, collecte les informations utiles et décide de la suite : réponse, rendez-vous, rappel ou transfert vers votre équipe.',
    uses: ['Ne plus laisser partir d’appels vers la messagerie', 'Filtrer les demandes répétitives et le démarchage', 'Recevoir un résumé clair de chaque appel'],
    steps: [
      { title: 'Vous décrivez votre activité', text: 'Horaires, services, questions fréquentes et règles de transfert.' },
      { title: 'L’agent répond', text: 'Il accueille, pose les bonnes questions et vérifie les informations.' },
      { title: 'Vous recevez la demande', text: 'Résumé, coordonnées et prochaine action dans votre tableau de bord.' },
    ],
    cases: ['Appels hors horaires', 'Pics d’appels pendant les rendez-vous', 'Premier tri avant transfert'],
    integrations: ['Calendrier', 'Widget web', 'SIP', 'Webhooks'],
    from: 'receptionniste', mock: 'call',
  },
  {
    slug: 'demo-live', name: 'Démo live de l’agent', family: 'Téléphonie',
    short: 'Écoutez la voix, la langue et le ton de l’agent en direct.',
    title: 'Essayez l’agent en live avant de décider',
    intro: 'Testez une conversation réelle depuis votre navigateur ou recevez un appel de démonstration. Vous entendez la voix, le rythme et la façon dont l’agent qualifie une demande.',
    uses: ['Valider la qualité de la voix', 'Tester un scénario de votre métier', 'Montrer l’agent à votre équipe'],
    steps: [
      { title: 'Choisissez votre secteur', text: 'Le scénario de démonstration s’adapte à votre activité.' },
      { title: 'Lancez l’appel', text: 'Depuis le navigateur, ou laissez votre numéro pour être rappelé.' },
      { title: 'Recevez le résumé', text: 'Vous voyez ce que l’agent a compris et ce qu’il aurait transmis.' },
    ],
    cases: ['Avant l’essai gratuit', 'Présentation à un associé', 'Comparaison de voix'],
    integrations: ['Widget web', 'Formulaire de rappel'],
    from: 'decouverte', mock: 'call',
  },
  {
    slug: 'prise-de-rendez-vous', name: 'Prise de rendez-vous', family: 'Agenda',
    short: 'Réservations, confirmations, rappels et reports dans votre agenda.',
    title: 'Des rendez-vous réservés pendant que vous travaillez',
    intro: 'Connectez votre calendrier : l’agent propose les créneaux libres, réserve, confirme et gère les reports et annulations sans intervention de votre équipe.',
    uses: ['Remplir les créneaux libres', 'Réduire les rendez-vous manqués', 'Libérer l’accueil des appels de planning'],
    steps: [
      { title: 'Connectez votre agenda', text: 'Google, Outlook, Cal.com ou Calendly.' },
      { title: 'Fixez vos règles', text: 'Durées, délais, types de rendez-vous et praticiens.' },
      { title: 'L’agent réserve', text: 'Il propose, confirme et envoie le récapitulatif.' },
    ],
    cases: ['Cabinets et cliniques', 'Salons et instituts', 'Ateliers et garages'],
    integrations: ['Google Agenda', 'Outlook', 'Cal.com', 'Calendly'],
    from: 'receptionniste', mock: 'calendar',
  },
  {
    slug: 'support-client', name: 'Support client', family: 'Automatisation',
    short: 'Les questions répétitives traitées, les cas complexes transmis.',
    title: 'Un support qui répond tout de suite, sans file d’attente',
    intro: 'L’agent répond aux questions fréquentes à partir de vos documents, suit les demandes et transmet à votre équipe les situations qui demandent un humain.',
    uses: ['Supprimer l’attente au téléphone', 'Répondre de façon cohérente', 'Escalader les cas sensibles'],
    steps: [
      { title: 'Chargez vos contenus', text: 'FAQ, procédures, conditions et pages de votre site.' },
      { title: 'Définissez les escalades', text: 'Quels sujets transférer, à qui et quand.' },
      { title: 'L’agent répond', text: 'Il s’appuie uniquement sur vos contenus validés.' },
    ],
    cases: ['Suivi de commande ou de dossier', 'Questions horaires et tarifs', 'Premier niveau technique'],
    integrations: ['Base de connaissances', 'Transfert humain', 'Webhooks'],
    from: 'receptionniste', mock: 'support',
  },
  {
    slug: 'qualification-des-leads', name: 'Qualification des leads', family: 'CRM et données',
    short: 'Les bonnes informations collectées avant chaque rappel.',
    title: 'Chaque prospect arrive qualifié dans votre tableau de bord',
    intro: 'L’agent pose vos questions de qualification — besoin, budget, zone, délai — et crée une fiche structurée. Votre équipe rappelle en sachant déjà tout.',
    uses: ['Prioriser les prospects chauds', 'Écarter les demandes hors cible', 'Préparer les devis plus vite'],
    steps: [
      { title: 'Listez vos critères', text: 'Les informations indispensables avant de rappeler.' },
      { title: 'L’agent qualifie', text: 'Il pose les questions dans un ordre naturel.' },
      { title: 'La fiche est créée', text: 'Avec un score d’intérêt et la prochaine action.' },
    ],
    cases: ['Demandes de devis', 'Prospects immobiliers', 'Leads de campagnes'],
    integrations: ['HubSpot', 'Zoho CRM', 'Google Sheets', 'Webhooks'],
    from: 'assistant', mock: 'lead',
  },
  {
    slug: 'campagnes-sortantes', name: 'Campagnes sortantes', family: 'Automatisation',
    short: 'Relances, confirmations et suivis, dans un cadre maîtrisé.',
    title: 'Relancez, confirmez et suivez vos contacts automatiquement',
    intro: 'Programmez des appels sortants vers des contacts qui l’ont accepté : confirmations, rappels de rendez-vous, relances de devis, renouvellements. Avec plages horaires, limites et liste d’exclusion.',
    uses: ['Confirmer les rendez-vous de la semaine', 'Relancer les devis en attente', 'Recontacter les clients inactifs'],
    steps: [
      { title: 'Importez vos contacts', text: 'Fichier, CRM ou formulaire, avec leur consentement.' },
      { title: 'Réglez la campagne', text: 'Créneaux d’appel, rythme et message.' },
      { title: 'Suivez les résultats', text: 'Joignables, intéressés, à rappeler.' },
    ],
    cases: ['Confirmations', 'Relances de devis', 'Renouvellements et ventes additionnelles'],
    integrations: ['Leads', 'CRM', 'Liste de blocage'],
    from: 'assistant', mock: 'campaign',
  },
  {
    slug: 'whatsapp-messages', name: 'WhatsApp et messages', family: 'Messages',
    short: 'SMS, WhatsApp, Messenger et Instagram dans le même espace.',
    title: 'Répondez sur les canaux que vos clients utilisent vraiment',
    intro: 'Envoyez confirmations et récapitulatifs par SMS ou WhatsApp, répondez sur Messenger et Instagram, et retrouvez chaque échange dans l’historique de conversation.',
    uses: ['Confirmer par écrit après l’appel', 'Envoyer un lien de réservation', 'Centraliser les messages'],
    steps: [
      { title: 'Connectez vos canaux', text: 'Expéditeur WhatsApp, SMS, Messenger, Instagram.' },
      { title: 'Créez vos modèles', text: 'Templates validés pour les messages récurrents.' },
      { title: 'L’agent envoie', text: 'Au bon moment de la conversation.' },
    ],
    cases: ['Récapitulatif de rendez-vous', 'Liste d’attente', 'Réponses aux messages'],
    integrations: ['WhatsApp', 'SMS', 'Messenger', 'Instagram'],
    from: 'assistant', mock: 'whatsapp',
  },
  {
    slug: 'base-de-connaissances', name: 'Base de connaissances', family: 'CRM et données',
    short: 'Vos PDF, pages web et procédures deviennent les réponses de l’agent.',
    title: 'L’agent répond avec vos informations, pas des suppositions',
    intro: 'Chargez vos documents, ajoutez les pages de votre site ou connectez vos données. L’agent y cherche la réponse au moment où il en a besoin.',
    uses: ['Réponses justes et à jour', 'Moins d’escalades inutiles', 'Un seul endroit à mettre à jour'],
    steps: [
      { title: 'Ajoutez vos sources', text: 'PDF, URL de votre site, textes ou données.' },
      { title: 'Vérifiez', text: 'Testez les réponses dans la démo.' },
      { title: 'Mettez à jour', text: 'Une modification suffit pour tous les appels.' },
    ],
    cases: ['Tarifs et horaires', 'Procédures internes', 'Conditions et politiques'],
    integrations: ['PDF', 'Pages web', 'API'],
    from: 'receptionniste', mock: 'knowledge',
  },
  {
    slug: 'editeur-de-prompts', name: 'Éditeur de prompts', family: 'Automatisation',
    short: 'Le comportement de l’agent, réglé précisément et sans code.',
    title: 'Décidez exactement comment votre agent parle et agit',
    intro: 'Définissez l’objectif de l’appel, le ton, les questions et les limites. Un assistant d’écriture vous guide pas à pas, sans expertise technique.',
    uses: ['Adapter le ton à votre marque', 'Fixer les limites de l’agent', 'Ajuster après écoute des appels'],
    steps: [
      { title: 'Choisissez un modèle', text: 'Par secteur ou par type d’appel.' },
      { title: 'Personnalisez', text: 'Objectif, questions, règles et formulations.' },
      { title: 'Testez', text: 'Écoutez, corrigez, republiez.' },
    ],
    cases: ['Accueil', 'Qualification', 'Support'],
    integrations: ['Modèles de prompts', 'Démo live'],
    from: 'receptionniste', mock: 'prompt',
  },
  {
    slug: 'flow-builder', name: 'Flow builder', family: 'Automatisation',
    short: 'Des scénarios visuels, sans code, reliés à plus de 300 outils.',
    title: 'Construisez vos scénarios en glissant-déposant',
    intro: 'Enchaînez les étapes : nouveau lead, appel, mise à jour du CRM, message de confirmation. Le flow builder relie l’agent à plus de 300 outils.',
    uses: ['Automatiser l’après-appel', 'Relier l’agent à vos outils', 'Éviter les ressaisies'],
    steps: [
      { title: 'Choisissez un déclencheur', text: 'Formulaire, fin d’appel, nouveau lead.' },
      { title: 'Ajoutez les actions', text: 'CRM, tableur, message, appel.' },
      { title: 'Activez', text: 'Le scénario tourne à chaque événement.' },
    ],
    cases: ['Lead web rappelé en quelques minutes', 'Fiche CRM créée après l’appel', 'Alerte équipe sur urgence'],
    integrations: ['HubSpot', 'Zoho', 'Google Sheets', 'Cal.com'],
    from: 'assistant', mock: 'flow',
  },
  {
    slug: 'sip-numeros', name: 'SIP et numéros', family: 'Téléphonie',
    short: 'Gardez vos numéros, ou prenez un numéro dédié en option.',
    title: 'Gardez vos numéros ou obtenez-en de nouveaux',
    intro: 'Connectez votre standard ou votre opérateur par SIP, importez vos numéros Twilio ou Telnyx, ou prenez un numéro dédié en option (facturé au mois, selon le pays).',
    uses: ['Garder le numéro connu de vos clients', 'Ouvrir une ligne locale', 'Gérer plusieurs sites'],
    steps: [
      { title: 'Choisissez l’option', text: 'Numéro fourni, import ou trunk SIP.' },
      { title: 'Connectez', text: 'Nous vous guidons pour la configuration.' },
      { title: 'Attribuez', text: 'Chaque numéro à son agent.' },
    ],
    cases: ['Renvoi du standard', 'Lignes par établissement', 'Numéros internationaux'],
    integrations: ['SIP', 'Twilio', 'Telnyx'],
    from: 'assistant', mock: 'numbers',
  },
  {
    slug: 'reporting', name: 'Reporting', family: 'Pilotage',
    short: 'Volumes, durées, résultats et conversions en un coup d’œil.',
    title: 'Mesurez ce que l’agent fait pour votre activité',
    intro: 'Suivez le nombre d’appels, leur durée, les demandes qualifiées, les rendez-vous pris et les transferts. Écoutez les appels et lisez les transcriptions.',
    uses: ['Comprendre vos pics d’appels', 'Mesurer les conversions', 'Améliorer les scripts'],
    steps: [
      { title: 'Les appels sont enregistrés', text: 'Avec transcription et résumé.' },
      { title: 'Les données sont extraites', text: 'Résultat, intérêt, prochaine action.' },
      { title: 'Vous pilotez', text: 'Tableaux de bord et rapports détaillés.' },
    ],
    cases: ['Suivi hebdomadaire', 'Comparaison par agent', 'Usage des minutes'],
    integrations: ['Export', 'Webhooks', 'API'],
    from: 'receptionniste', mock: 'report',
  },
  {
    slug: 'widget-web', name: 'Widget web', family: 'Messages',
    short: 'Rappel et appel depuis votre site, en un clic.',
    title: 'Transformez les visiteurs de votre site en demandes',
    intro: 'Ajoutez un widget sur votre site : le visiteur parle à l’agent depuis son navigateur ou laisse son numéro pour être rappelé au créneau de son choix.',
    uses: ['Capter les visiteurs pressés', 'Proposer un rappel au bon moment', 'Éviter les formulaires oubliés'],
    steps: [
      { title: 'Copiez le code', text: 'Une ligne à coller sur votre site.' },
      { title: 'Personnalisez', text: 'Couleurs, texte et agent associé.' },
      { title: 'Recevez les demandes', text: 'Appels et rappels dans votre tableau de bord.' },
    ],
    cases: ['Pages services', 'Landing pages', 'Pages contact'],
    integrations: ['Tout site web', 'WordPress', 'Webflow'],
    from: 'decouverte', mock: 'widget',
  },
];

export const moduleBySlug = (slug: string) => MODULES.find((m) => m.slug === slug);
