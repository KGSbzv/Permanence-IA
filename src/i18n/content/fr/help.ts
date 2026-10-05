// Guide de l’espace client (interface en anglais) : lexique des menus et tâches pas à pas.
// Sert aussi de base de connaissances à l’assistante d’aide intégrée à l’espace client.

/** en : libellé exact dans l’interface (anglais) ; label : traduction affichée ; text : à quoi ça sert. */
export interface MenuEntry { en: string; label: string; text: string }
export interface HelpTask { title: string; steps: string[] }

export const HELP_MENU: MenuEntry[] = [
  { en: 'Dashboard', label: 'Tableau de bord', text: 'Vue d’ensemble : appels du mois, minutes consommées, résultats.' },
  { en: 'Assistants', label: 'Agents vocaux', text: 'Créer, modifier et tester vos agents (accueil, rappel, support).' },
  { en: 'Calls history', label: 'Historique des appels', text: 'Chaque appel avec enregistrement, transcription, résumé et données extraites.' },
  { en: 'Knowledge base', label: 'Base de connaissances', text: 'Documents et pages web que l’agent consulte pendant l’appel.' },
  { en: 'Mid call tools / MCP', label: 'Outils pendant l’appel', text: 'Actions que l’agent déclenche en direct : envoyer une demande à votre CRM, vérifier une info…' },
  { en: 'Blacklist', label: 'Liste de blocage', text: 'Numéros qui ne doivent jamais être appelés.' },
  { en: 'Campaigns', label: 'Campagnes', text: 'Appels sortants vers une liste de contacts (rappels, relances, prise de rendez-vous).' },
  { en: 'Leads', label: 'Contacts / prospects', text: 'Les contacts importés ou créés, avec leur statut.' },
  { en: 'Inbox', label: 'Messagerie', text: 'Conversations écrites centralisées : widget web, WhatsApp, SMS, Messenger, Instagram.' },
  { en: 'Channels → WhatsApp / Messenger & Instagram', label: 'Canaux', text: 'Connecter vos comptes de messagerie.' },
  { en: 'Get new phone number', label: 'Obtenir un numéro', text: 'Acheter un numéro dédié (option payée chaque mois, prix affiché avant l’achat).' },
  { en: 'Your phone numbers', label: 'Vos numéros', text: 'Vos numéros, l’import Twilio / Telnyx et la connexion SIP.' },
  { en: 'Automate platform', label: 'Automatisations', text: 'Flow builder sans code relié à plus de 300 outils (forfait Assistant et plus).' },
  { en: 'Change plan', label: 'Changer de forfait', text: 'Passer au forfait supérieur ou inférieur.' },
  { en: 'Add credits', label: 'Ajouter du crédit', text: 'Acheter une recharge de minutes ; le crédit ne périme pas.' },
  { en: 'Billing info', label: 'Facturation', text: 'Moyen de paiement, factures, abonnement et annulation.' },
  { en: 'Limits', label: 'Limites', text: 'Ce que votre forfait autorise : agents, appels simultanés, fonctions.' },
  { en: 'API Keys', label: 'Clés API', text: 'Connecter vos propres logiciels (forfait Centre d’appels).' },
  { en: 'My profile / Security', label: 'Profil / Sécurité', text: 'Vos informations, mot de passe et double authentification.' },
];

export const HELP_TASKS: HelpTask[] = [
  {
    title: 'Créer votre premier agent vocal',
    steps: [
      'Menu Assistants, puis Create (créer).',
      'General : choisissez Receive phone calls (recevoir des appels) ou Make phone calls (passer des appels), donnez un nom et le fuseau horaire.',
      'Voice & speech (voix) : langue French, puis choisissez une voix et écoutez-la.',
      'Brain & prompt (cerveau et consignes) : décrivez votre activité, ce que l’agent doit faire et ne pas faire. L’assistant de rédaction (AI Prompt Editor) peut l’écrire pour vous.',
      'Greeting (accueil) : la première phrase prononcée.',
      'Cliquez sur Create assistant, puis Test assistant pour lui parler depuis votre navigateur.',
    ],
  },
  {
    title: 'Ajouter vos informations (base de connaissances)',
    steps: [
      'Menu Knowledge base, puis créez une base.',
      'Ajoutez un document : PDF, fichier texte ou adresse d’une page de votre site.',
      'Dans votre agent, section Knowledgebase, sélectionnez cette base.',
    ],
  },
  {
    title: 'Recevoir les appels sur votre numéro',
    steps: [
      'Le plus simple : achetez un numéro dans Get new phone number, puis dans l’agent (General → Phone number) sélectionnez-le.',
      'Pour garder votre numéro actuel : activez chez votre opérateur un renvoi d’appel vers ce nouveau numéro.',
      'Vous avez déjà Twilio, Telnyx ou un standard SIP : Your phone numbers, puis import ou SIP (forfait Assistant et plus).',
    ],
  },
  {
    title: 'Faire prendre des rendez-vous à l’agent',
    steps: [
      'Dans l’agent, section Tools & actions (outils et actions).',
      'Ajoutez l’intégration calendrier (Cal.com ou Calendly, eux-mêmes reliés à votre agenda Google ou Outlook) et connectez votre compte.',
      'Précisez dans les consignes quand proposer un rendez-vous.',
    ],
  },
  {
    title: 'Transférer un appel vers vous',
    steps: [
      'Dans l’agent, section Tools & actions, ajoutez Call transfer (transfert d’appel).',
      'Indiquez votre numéro et dans quel cas transférer (urgence, demande d’un humain…).',
    ],
  },
  {
    title: 'Mettre l’agent sur votre site (widget)',
    steps: [
      'Dans l’agent, section Web widget : activez le widget, choisissez voix et/ou chat, couleurs et textes.',
      'Copiez le code fourni et collez-le avant la balise </body> de votre site (ou demandez-le à votre webmaster).',
    ],
  },
  {
    title: 'Lancer une campagne d’appels sortants',
    steps: [
      'Créez un agent en mode Make phone calls.',
      'Menu Leads : importez vos contacts (fichier CSV) ; n’appelez que des personnes qui ont donné leur accord.',
      'Menu Campaigns : créez la campagne, choisissez l’agent, les contacts, les horaires d’appel, puis démarrez.',
    ],
  },
  {
    title: 'Recevoir les résultats des appels dans vos outils',
    steps: [
      'Dans l’agent, section Webhooks & channels : indiquez l’adresse qui doit recevoir chaque fin d’appel.',
      'Ou utilisez Automate platform pour envoyer les résumés vers Google Sheets, votre CRM, Slack, un email… (forfait Assistant et plus).',
    ],
  },
  {
    title: 'Ajouter des minutes ou changer de forfait',
    steps: [
      'Ponctuellement : Add credits (ajouter du crédit) et choisissez une recharge. Le crédit ne périme pas.',
      'Si vous dépassez souvent : Change plan, le forfait supérieur revient moins cher à la minute.',
    ],
  },
  {
    title: 'Gérer l’essai, la facturation et les factures',
    steps: [
      'L’essai démarre quand vous choisissez votre premier forfait dans Change plan : 14 jours gratuits, 30 minutes incluses, rien n’est débité pendant l’essai.',
      'Billing info : moyen de paiement, factures téléchargeables et gestion de l’abonnement.',
      'Pour ne rien payer, annulez depuis Billing info avant la fin des 14 jours.',
    ],
  },
];

export const HELP_GLOSSARY: MenuEntry[] = [
  { en: 'Inbound / Outbound', label: 'Entrant / sortant', text: 'Appels reçus / appels passés par l’agent.' },
  { en: 'Prompt', label: 'Consignes', text: 'Le texte qui décrit le rôle et les règles de l’agent.' },
  { en: 'Pipeline / Speech-to-speech / Dualplex', label: 'Moteur', text: 'La technologie vocale. Laissez Pipeline si vous hésitez : c’est le réglage recommandé en français.' },
  { en: 'Post-call evaluation', label: 'Analyse après appel', text: 'Les informations extraites automatiquement de chaque appel (nom, besoin, rendez-vous…).' },
  { en: 'Variables', label: 'Variables', text: 'Champs personnalisés comme {{customer_name}}, remplis pour chaque contact.' },
  { en: 'Voicemail', label: 'Répondeur', text: 'Ce que fait l’agent s’il tombe sur une messagerie.' },
  { en: 'Credits', label: 'Crédit', text: '100 crédits = 1 $. Sert aux minutes en plus et aux messages (WhatsApp, SMS).' },
];
