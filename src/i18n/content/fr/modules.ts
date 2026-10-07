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
    short: 'Réceptionniste virtuelle : répond à chaque appel et transfère ce qui compte.',
    title: 'Une réceptionniste qui décroche à chaque appel, de jour comme de nuit',
    intro: 'Votre réceptionniste virtuelle accueille vos appelants avec votre ton, comprend leur demande, collecte les informations utiles et décide de la suite : réponse, rendez-vous, rappel ou transfert vers votre équipe.',
    uses: ['Ne plus laisser partir d’appels vers la messagerie', 'Filtrer les demandes répétitives et le démarchage', 'Recevoir un résumé clair de chaque appel'],
    steps: [
      { title: 'Vous décrivez votre activité', text: 'Horaires, services, questions fréquentes et règles de transfert.' },
      { title: 'L’agent répond', text: 'Il accueille, pose les bonnes questions et vérifie les informations.' },
      { title: 'Vous recevez la demande', text: 'Résumé, coordonnées et prochaine action dans votre tableau de bord.' },
    ],
    cases: ['Appels hors horaires', 'Pics d’appels pendant les rendez-vous', 'Premier tri avant transfert'],
    integrations: ['Agenda', 'Widget web', 'SIP', 'Webhooks'],
    from: 'receptionniste', mock: 'call',
  },
  {
    slug: 'demo-live', name: 'Démo en direct de l’agent', family: 'Téléphonie',
    short: 'Écoutez la voix, la langue et le ton de l’agent vocal IA en direct.',
    title: 'Essayez l’agent en direct avant de décider',
    intro: 'Testez une conversation réelle avec l’agent vocal IA depuis votre navigateur ou recevez un appel de démonstration. Vous entendez la voix, le rythme et la façon dont l’agent qualifie une demande.',
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
    short: 'Rendez-vous pris par téléphone, confirmés et rappelés dans votre agenda.',
    title: 'Des rendez-vous réservés pendant que vous travaillez',
    intro: 'Connectez votre agenda : l’agent prend les rendez-vous par téléphone, propose les créneaux libres, réserve, confirme et gère les reports et annulations sans intervention de votre équipe.',
    uses: ['Remplir les créneaux libres', 'Réduire les rendez-vous manqués', 'Libérer l’accueil des appels de planning'],
    steps: [
      { title: 'Connectez votre agenda', text: 'Cal.com ou Calendly, reliés à Google Agenda ou Outlook.' },
      { title: 'Fixez vos règles', text: 'Durées, délais, types de rendez-vous et praticiens.' },
      { title: 'L’agent réserve', text: 'Il propose, confirme et envoie le récapitulatif.' },
    ],
    cases: ['Cabinets et cliniques', 'Salons et instituts', 'Ateliers et garages'],
    integrations: ['Google Agenda', 'Outlook', 'Cal.com', 'Calendly'],
    from: 'receptionniste', mock: 'calendar',
  },
  {
    slug: 'support-client', name: 'Support client', family: 'Automatisation',
    short: 'Service client par IA : questions répétitives traitées, cas complexes transmis.',
    title: 'Un support qui répond tout de suite, sans file d’attente',
    intro: 'Un service client par téléphone sans attente : l’agent répond aux questions fréquentes à partir de vos documents, suit les demandes et transmet à votre équipe les situations qui demandent un humain.',
    uses: ['Supprimer l’attente au téléphone', 'Répondre de façon cohérente', 'Transmettre les cas sensibles à un humain'],
    steps: [
      { title: 'Chargez vos contenus', text: 'FAQ, procédures, conditions et pages de votre site.' },
      { title: 'Définissez les transferts', text: 'Quels sujets transférer, à qui et quand.' },
      { title: 'L’agent répond', text: 'Il s’appuie uniquement sur vos contenus validés.' },
    ],
    cases: ['Suivi de commande ou de dossier', 'Questions horaires et tarifs', 'Support technique de premier niveau'],
    integrations: ['Base de connaissances', 'Transfert humain', 'Webhooks'],
    from: 'receptionniste', mock: 'support',
  },
  {
    slug: 'qualification-des-leads', name: 'Tri et qualification des demandes', family: 'CRM et données',
    short: 'Demandes triées et qualifiées par téléphone, avec les bonnes informations avant chaque rappel.',
    title: 'Chaque prospect arrive qualifié dans votre tableau de bord',
    intro: 'L’agent qualifie vos demandes par téléphone : il pose vos questions de qualification — besoin, budget, zone, délai — et crée une fiche structurée. Votre équipe rappelle en sachant déjà tout.',
    uses: ['Prioriser les prospects chauds', 'Écarter les demandes hors cible', 'Préparer les devis plus vite'],
    steps: [
      { title: 'Listez vos critères', text: 'Les informations indispensables avant de rappeler.' },
      { title: 'L’agent qualifie', text: 'Il pose les questions dans un ordre naturel.' },
      { title: 'La fiche est créée', text: 'Avec un score d’intérêt et la prochaine action.' },
    ],
    cases: ['Demandes de devis', 'Prospects immobiliers', 'Prospects issus de vos publicités'],
    integrations: ['HubSpot', 'Zoho CRM', 'Google Sheets', 'Webhooks'],
    from: 'assistant', mock: 'lead',
  },
  {
    slug: 'campagnes-sortantes', name: 'Rappels et confirmations', family: 'Automatisation',
    short: 'Appels sortants de relance, confirmation et suivi, dans un cadre maîtrisé.',
    title: 'Relancez, confirmez et suivez vos contacts automatiquement',
    intro: 'Programmez des appels sortants automatisés vers des contacts qui l’ont accepté : confirmations, rappels de rendez-vous, relances de devis, renouvellements. Avec plages horaires, limites et liste d’exclusion.',
    uses: ['Confirmer les rendez-vous de la semaine', 'Relancer les devis en attente', 'Recontacter les clients inactifs'],
    steps: [
      { title: 'Importez vos contacts', text: 'Fichier, CRM ou formulaire, avec leur consentement.' },
      { title: 'Réglez la campagne', text: 'Créneaux d’appel, rythme et message.' },
      { title: 'Suivez les résultats', text: 'Joignables, intéressés, à rappeler.' },
    ],
    cases: ['Confirmations', 'Relances de devis', 'Renouvellements et ventes additionnelles'],
    integrations: ['Contacts', 'CRM', 'Liste d’exclusion'],
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
      { title: 'Créez vos modèles', text: 'Modèles validés par WhatsApp (Meta) pour les messages récurrents.' },
      { title: 'L’agent envoie', text: 'Au bon moment de la conversation.' },
    ],
    cases: ['Récapitulatif de rendez-vous', 'Liste d’attente', 'Réponses aux messages'],
    integrations: ['WhatsApp', 'SMS', 'Messenger', 'Instagram'],
    from: 'receptionniste', mock: 'whatsapp',
  },
  {
    slug: 'base-de-connaissances', name: 'Base de connaissances', family: 'CRM et données',
    short: 'Vos PDF, pages web et procédures deviennent les réponses de l’agent.',
    title: 'L’agent répond avec vos informations, pas des suppositions',
    intro: 'Chargez vos documents dans la base de connaissances de votre agent vocal IA, ajoutez les pages de votre site ou connectez vos données. L’agent y cherche la réponse au moment où il en a besoin.',
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
    slug: 'editeur-de-prompts', name: 'Consignes de l’agent', family: 'Automatisation',
    short: 'Le comportement de l’agent vocal, réglé précisément et sans code.',
    title: 'Décidez exactement comment votre agent parle et agit',
    intro: 'Dans les consignes de l’agent, définissez l’objectif de l’appel, le ton, les questions et les limites. Un assistant de rédaction vous guide pas à pas, sans expertise technique.',
    uses: ['Adapter le ton à votre marque', 'Fixer les limites de l’agent', 'Ajuster après écoute des appels'],
    steps: [
      { title: 'Choisissez un modèle', text: 'Par secteur ou par type d’appel.' },
      { title: 'Personnalisez', text: 'Objectif, questions, règles et formulations.' },
      { title: 'Testez', text: 'Écoutez, corrigez, republiez.' },
    ],
    cases: ['Accueil', 'Qualification', 'Support'],
    integrations: ['Modèles de consignes', 'Démo en direct'],
    from: 'receptionniste', mock: 'prompt',
  },
  {
    slug: 'flow-builder', name: 'Scénarios automatisés', family: 'Automatisation',
    short: 'Des automatisations visuelles, sans code, reliées à plus de 300 outils.',
    title: 'Construisez vos scénarios en glissant-déposant',
    intro: 'Automatisez sans code en enchaînant les étapes : nouvelle demande, appel, mise à jour du CRM, message de confirmation. Les scénarios automatisés relient l’agent à plus de 300 outils.',
    uses: ['Automatiser l’après-appel', 'Relier l’agent à vos outils', 'Éviter les ressaisies'],
    steps: [
      { title: 'Choisissez un déclencheur', text: 'Formulaire, fin d’appel, nouvelle demande.' },
      { title: 'Ajoutez les actions', text: 'CRM, tableur, message, appel.' },
      { title: 'Activez', text: 'Le scénario tourne à chaque événement.' },
    ],
    cases: ['Demande web rappelée en quelques minutes', 'Fiche CRM créée après l’appel', 'Alerte équipe sur urgence'],
    integrations: ['HubSpot', 'Zoho CRM', 'Google Sheets', 'Cal.com'],
    from: 'assistant', mock: 'flow',
  },
  {
    slug: 'sip-numeros', name: 'SIP et numéros', family: 'Téléphonie',
    short: 'Gardez vos numéros par renvoi d’appel ou SIP, ou prenez un numéro dédié en option.',
    title: 'Gardez vos numéros ou obtenez-en de nouveaux',
    intro: 'Connectez votre standard ou votre opérateur par trunk SIP, gardez votre numéro par renvoi d’appel, importez vos numéros Twilio ou Telnyx, ou prenez un numéro dédié en option (facturé au mois, selon le pays).',
    uses: ['Garder le numéro connu de vos clients', 'Ouvrir une ligne dans les pays proposés', 'Gérer plusieurs sites'],
    steps: [
      { title: 'Choisissez l’option', text: 'Numéro fourni, import ou trunk SIP.' },
      { title: 'Connectez', text: 'Nous vous guidons pour la configuration.' },
      { title: 'Attribuez', text: 'Chaque numéro à son agent.' },
    ],
    cases: ['Renvoi du standard', 'Lignes par établissement', 'Numéros internationaux'],
    integrations: ['SIP', 'Twilio', 'Telnyx'],
    from: 'receptionniste', mock: 'numbers',
  },
  {
    slug: 'reporting', name: 'Statistiques et suivi des appels', family: 'Pilotage',
    short: 'Statistiques d’appels : volumes, durées, résultats et conversions.',
    title: 'Mesurez ce que l’agent fait pour votre activité',
    intro: 'Des statistiques d’appels claires : suivez le nombre d’appels, leur durée, les demandes qualifiées, les rendez-vous pris et les transferts. Écoutez les appels et lisez les transcriptions.',
    uses: ['Comprendre vos pics d’appels', 'Mesurer les conversions', 'Améliorer les scripts'],
    steps: [
      { title: 'Les appels sont enregistrés', text: 'L’appelant en est informé dès le début ; transcription et résumé suivent.' },
      { title: 'Les données sont extraites', text: 'Résultat, intérêt, prochaine action.' },
      { title: 'Vous pilotez', text: 'Tableaux de bord et rapports détaillés.' },
    ],
    cases: ['Suivi hebdomadaire', 'Comparaison par agent', 'Usage des minutes'],
    integrations: ['Export', 'Webhooks', 'API'],
    from: 'receptionniste', mock: 'report',
  },
  {
    slug: 'widget-web', name: 'Widget web', family: 'Messages',
    short: 'Rappel et appel depuis votre site web, en un clic.',
    title: 'Transformez les visiteurs de votre site en demandes',
    intro: 'Ajoutez un widget d’appel sur votre site web : le visiteur parle à l’agent depuis son navigateur ou laisse son numéro pour être rappelé au créneau de son choix.',
    uses: ['Capter les visiteurs pressés', 'Proposer un rappel au bon moment', 'Éviter les formulaires abandonnés'],
    steps: [
      { title: 'Copiez le code', text: 'Une ligne à coller sur votre site.' },
      { title: 'Personnalisez', text: 'Couleurs, texte et agent associé.' },
      { title: 'Recevez les demandes', text: 'Appels et rappels dans votre tableau de bord.' },
    ],
    cases: ['Pages services', 'Pages d’atterrissage', 'Pages contact'],
    integrations: ['Tout site web', 'WordPress', 'Webflow'],
    from: 'decouverte', mock: 'widget',
  },
  {
    slug: 'relance-anciens-clients', name: 'Relance des anciens clients', family: 'Automatisation',
    short: 'Vos clients inactifs rappelés pour reprendre rendez-vous : un chiffre d’affaires qui dort déjà dans votre fichier.',
    title: 'Faites revenir les clients qui ne vous ont pas appelé depuis longtemps',
    intro: 'Votre fichier contient des clients satisfaits qui ont simplement oublié de revenir : contrôle annuel, entretien, révision, coupe, soin. L’agent les rappelle un par un, leur cite votre dernière prestation, propose deux créneaux précis et réserve. N’appelez que les clients qui ont accepté d’être contactés : auprès des particuliers, l’appel automatisé à visée commerciale exige leur accord préalable.',
    uses: ['Faire revenir les clients absents depuis 6 à 18 mois', 'Remplir les creux du planning', 'Relancer les devis restés sans réponse', 'Proposer l’entretien de saison'],
    steps: [
      { title: 'Choisissez les clients', text: 'Export de votre logiciel ou de votre agenda : nom, téléphone, dernière prestation.' },
      { title: 'Validez le message', text: 'Une raison réelle d’appeler, une offre éventuelle, deux créneaux proposés.' },
      { title: 'L’agent appelle', text: 'Aux horaires autorisés, avec relances limitées et liste d’exclusion.' },
      { title: 'Vous comptez les rendez-vous', text: 'Chaque résultat est noté : rendez-vous, à rappeler, pas intéressé.' },
    ],
    cases: ['Contrôle dentaire annuel', 'Entretien de chaudière ou de climatisation', 'Révision automobile', 'Clients d’un salon absents depuis trois mois', 'Devis sans réponse'],
    integrations: ['Import de contacts', 'Agenda', 'CRM', 'Liste d’exclusion'],
    from: 'assistant', mock: 'campaign',
  },
];

export const moduleBySlug = (slug: string) => MODULES.find((m) => m.slug === slug);
