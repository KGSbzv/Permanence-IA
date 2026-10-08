// Guides pratiques de l’espace client (interface en anglais) : une fiche par tâche, publiée sous /aide/guides/<slug>.
// Les libellés anglais de l’interface restent entre guillemets, l’explication est dans la langue du lecteur.
// Variables remplacées à l’affichage : {brand} (marque du marché), {numberFrom} (prix d’entrée d’un numéro dédié).
// Mêmes slugs, mêmes catégories et même structure dans toutes les langues (typage `typeof` côté traductions).

export type GuideCategory = 'start' | 'assistant' | 'tools' | 'phone' | 'channels' | 'outbound' | 'results' | 'billing';

export interface GuideSection {
  title: string;
  /** Paragraphe d’introduction de la section. */
  text?: string;
  /** Étapes numérotées. */
  steps?: string[];
  /** Liste à puces. */
  list?: string[];
  /** Conseil mis en avant. */
  tip?: string;
}

export interface Guide {
  slug: string;
  category: GuideCategory;
  title: string;
  /** Résumé d’une phrase : liste des guides et meta description. */
  summary: string;
  /** Disponibilité selon le forfait, si utile. */
  plan?: string;
  sections: GuideSection[];
  /** Slugs des guides liés. */
  related: string[];
}

export const GUIDE_CATEGORIES: GuideCategory[] = ['start', 'assistant', 'tools', 'phone', 'channels', 'outbound', 'results', 'billing'];

export const GUIDES_UI = {
  categories: {
    start: 'Premiers pas',
    assistant: 'Régler votre agent',
    tools: 'Connaissances, agenda et outils',
    phone: 'Numéros et téléphonie',
    channels: 'Site web et messageries',
    outbound: 'Campagnes et contacts',
    results: 'Suivi des appels et automatisations',
    billing: 'Minutes et facturation',
  } as Record<GuideCategory, string>,
  indexTitle: 'Guides pas à pas',
  indexIntro: 'Une fiche par tâche, avec les libellés exacts de l’interface (en anglais) et leur explication en français.',
  breadcrumb: 'Guides',
  meta: {
    title: (title: string, brand: string) => `${title} · Guide ${brand}`,
  },
  eyebrow: (category: string) => `Guide · ${category}`,
  planLabel: 'Disponibilité',
  tipLabel: 'Conseil',
  relatedTitle: 'Guides liés',
  allGuides: 'Tous les guides',
  openSpace: 'Ouvrir mon espace',
  helpBefore: 'Besoin d’aide ? Dans votre espace, l’assistante d’aide (bulle en bas à droite) répond dans votre langue. Vous pouvez aussi écrire à ',
  helpAfter: '.',
};

export const GUIDES: Guide[] = [
  // ---------- Premiers pas ----------
  {
    slug: 'agent-vocal-ia',
    category: 'start',
    title: 'Qu’est-ce qu’un agent vocal IA ?',
    summary: 'Le rôle d’un agent, ses composants et ce qu’il peut faire pour vous, en appel entrant comme sortant.',
    sections: [
      {
        title: 'Le principe',
        text: 'Un agent (appelé « Assistant » dans l’espace {brand}) est une IA que vous configurez pour parler au téléphone à vos clients ou prospects : quand ils vous appellent (appel entrant, « Receive phone calls ») ou quand c’est l’agent qui les appelle (appel sortant, « Make phone calls »).',
      },
      {
        title: 'Ce qu’il fait pour vous',
        list: [
          'Répondre aux questions fréquentes, prendre des messages et des rendez-vous, 24 h/24.',
          'Qualifier une demande et transférer l’appel à votre équipe quand c’est nécessaire.',
          'Traiter plusieurs appels en même temps (le nombre d’appels simultanés dépend de votre forfait).',
        ],
      },
      {
        title: 'Ses composants',
        list: [
          'Les consignes (« System prompt ») : le rôle, le ton et les règles de l’agent.',
          'Le message d’accueil (« Initial message ») : la première phrase prononcée.',
          'La voix (« Voice ») : une voix de la bibliothèque ou votre voix clonée.',
          'Les outils (« Tools ») : transfert, fin d’appel, prise de rendez-vous, outils sur mesure.',
          'La base de connaissances (« Knowledge base ») : vos documents et pages web.',
        ],
      },
    ],
    related: ['creer-un-agent', 'consignes-system-prompt', 'outils-de-l-agent'],
  },
  {
    slug: 'creer-un-agent',
    category: 'start',
    title: 'Créer et modifier un agent',
    summary: 'Créer votre premier agent en quelques minutes, puis le modifier à tout moment.',
    plan: 'Le nombre d’agents dépend de votre forfait (menu « Limits »).',
    sections: [
      {
        title: 'Créer l’agent',
        steps: [
          'Connectez-vous à app.permanenceia.com et ouvrez le menu « Assistants », puis « Create ».',
          'Choisissez le type : « Receive phone calls » pour répondre aux appels, « Make phone calls » pour appeler (campagnes, rappels).',
          'Donnez un nom interne (par exemple « Accueil cabinet ») et vérifiez le fuseau horaire.',
          'Choisissez la langue puis la voix (« Voice & speech ») et écoutez-la.',
          'Rédigez les consignes (« Brain & prompt ») et la phrase d’accueil (« Greeting »).',
          'Cliquez sur « Create assistant ».',
        ],
      },
      {
        title: 'Ajouter les outils utiles',
        text: 'Dans « Tools & actions », ajoutez ce dont l’agent a besoin : transfert d’appel, fin d’appel, prise de rendez-vous, outils sur mesure.',
      },
      {
        title: 'Brancher et tester',
        list: [
          'Agent entrant : attribuez-lui un numéro (section « General », champ « Phone number »).',
          'Agent sortant : rattachez-le à une campagne ou testez-le en vous faisant appeler.',
          'Dans tous les cas, testez-le avant de le mettre en service.',
        ],
      },
      {
        title: 'Modifier un agent',
        steps: [
          'Menu « Assistants », cliquez sur le nom de l’agent.',
          'Modifiez les consignes, la voix ou les outils.',
          'Cliquez sur « Save » : les appels suivants utilisent la nouvelle version.',
        ],
        tip: 'Après chaque modification, faites un appel de test pour vérifier le comportement.',
      },
    ],
    related: ['tester-son-agent', 'consignes-system-prompt', 'acheter-un-numero'],
  },
  {
    slug: 'tester-son-agent',
    category: 'start',
    title: 'Tester votre agent (chat, navigateur, téléphone)',
    summary: 'Les trois façons de tester un agent avant sa mise en service, et quand utiliser chacune.',
    sections: [
      {
        title: '1. Le chat de test : pour les consignes',
        text: 'Le plus rapide pour vérifier la logique de la conversation, sans voix.',
        steps: [
          'Ouvrez l’agent et cliquez sur « Test assistant » (icône de bulle).',
          'Écrivez comme le ferait un client : l’agent répond avec les mêmes consignes et les mêmes outils qu’au téléphone.',
          'Vérifiez qu’il comprend les demandes, collecte les bonnes informations et utilise ses outils.',
        ],
        tip: 'Chaque session de test est enregistrée dans « Inbox » avec un badge « Test », pratique pour relire l’échange.',
      },
      {
        title: '2. L’appel dans le navigateur : pour la voix',
        steps: [
          'Cliquez sur « Speak with your assistant » et autorisez le micro.',
          'Parlez à l’agent : vérifiez la voix, le rythme, les interruptions.',
        ],
        text: 'Le transfert d’appel ne fonctionne pas dans ce mode.',
      },
      {
        title: '3. Le vrai appel téléphonique : la validation finale',
        list: [
          'Agent sortant : cliquez sur « Speak to your assistant », choisissez l’appel téléphonique, saisissez votre numéro : l’agent vous appelle aussitôt.',
          'Agent entrant : appelez simplement le numéro attribué à l’agent.',
          'C’est le seul test qui valide tous les outils, dont le transfert d’appel.',
        ],
      },
      {
        title: 'Bon à savoir',
        list: [
          'Les tests vocaux consomment des minutes comme de vrais appels ; le chat de test consomme un peu de crédit.',
          'Enregistrez le numéro de l’agent dans vos contacts pour le rappeler facilement.',
        ],
      },
    ],
    related: ['creer-un-agent', 'historique-des-appels', 'minutes-et-facturation'],
  },

  // ---------- Régler l’agent ----------
  {
    slug: 'consignes-system-prompt',
    category: 'assistant',
    title: 'Rédiger les consignes de l’agent (system prompt)',
    summary: 'Structurer les consignes qui définissent le rôle, le ton et les règles de votre agent.',
    sections: [
      {
        title: 'À quoi servent les consignes',
        text: 'Les consignes (« System prompt », section « Brain & prompt ») sont le cerveau de l’agent : son identité, ce qu’il sait, comment il parle et ce qu’il ne doit jamais faire. Trois façons de les modifier : l’assistant de rédaction (« AI Prompt Editor »), l’éditeur visuel (« Flow Builder ») ou l’édition directe du texte.',
      },
      {
        title: 'Partir d’un modèle',
        steps: [
          'Dans l’agent, section des consignes, cliquez sur « Templates ».',
          'Choisissez le modèle le plus proche de votre usage (accueil, prise de rendez-vous, support, qualification…).',
          'Adaptez-le à votre activité.',
        ],
      },
      {
        title: 'Les 5 blocs d’une bonne consigne',
        list: [
          'Rôle et identité : « Tu es l’assistante IA du cabinet X, spécialisé en… Tu dis dès le début de l’appel que tu es une IA. »',
          'Style : ton, vouvoiement, phrases courtes, pas de jargon.',
          'Informations clés : services, horaires, tarifs, adresse.',
          'Règles : ce qu’il faut vérifier, quand transférer, ce qu’il ne faut jamais promettre.',
          'Déroulés : comment traiter les situations fréquentes (prise de rendez-vous, réclamation, urgence).',
        ],
      },
      {
        title: 'Langue des consignes',
        text: 'Vous pouvez écrire les consignes dans la langue de votre choix : la langue parlée par l’agent se règle à part, dans « Voice & speech ».',
      },
      {
        title: 'Erreurs fréquentes',
        list: [
          'Trop vague : « Sois serviable » ne suffit pas.',
          'Trop rigide : écrire chaque réplique rend la conversation artificielle.',
          'Trop long : les informations détaillées vont dans la base de connaissances.',
          'Situations oubliées : précisez quoi faire en cas d’urgence, de colère ou de question hors sujet.',
        ],
        tip: 'Vos consignes évoluent : relisez régulièrement les transcriptions d’appels et ajoutez les cas mal traités.',
      },
    ],
    related: ['editeur-de-prompt-ia', 'flow-builder', 'base-de-connaissances'],
  },
  {
    slug: 'editeur-de-prompt-ia',
    category: 'assistant',
    title: 'Utiliser l’assistant de rédaction (AI Prompt Editor)',
    summary: 'Modifier les consignes de votre agent en demandant simplement ce que vous voulez changer.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Ouvrir l’éditeur',
        steps: [
          'Menu « Assistants », ouvrez votre agent (il doit avoir été enregistré au moins une fois).',
          'Dans la section des consignes, onglet « AI Prompt Editor », cliquez sur « Launch AI Prompt Editor ».',
          'Choisissez de continuer avec vos consignes actuelles, de partir de zéro ou d’un modèle.',
        ],
      },
      {
        title: 'Demander une modification',
        text: 'Écrivez votre demande dans le chat à gauche, en langage courant. Exemples :',
        list: [
          '« Rends le ton plus chaleureux. »',
          '« Ajoute notre politique de retour : 30 jours sans justification. »',
          '« Ajoute des consignes pour gérer un client mécontent. »',
          'Les raccourcis « Make it more concise », « Improve clarity »… font les retouches courantes.',
        ],
      },
      {
        title: 'Relire et valider',
        list: [
          'Les changements proposés s’affichent en couleur : vert pour un ajout, rouge pour une suppression.',
          'Validez ou refusez chaque changement (« Accept » / « Reject »), ou tous d’un coup (« Accept All » / « Reject All »).',
          'Cliquez sur « Save » pour enregistrer.',
        ],
        tip: 'Une modification à la fois donne de meilleurs résultats. Relisez toujours avant d’accepter : vous connaissez votre activité mieux que l’IA.',
      },
      {
        title: 'Variables et données après appel',
        list: [
          'Onglet « Variables » : ajoutez des champs comme {{customer_name}} pour personnaliser chaque appel.',
          'Onglet « Post-Call » : définissez les informations à extraire de chaque appel (rendez-vous pris, niveau d’intérêt…). Vous pouvez demander à l’IA : « Quelles données devrais-je collecter ? »',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'donnees-apres-appel', 'tester-son-agent'],
  },
  {
    slug: 'message-d-accueil',
    category: 'assistant',
    title: 'Soigner le message d’accueil',
    summary: 'Écrire une première phrase courte et naturelle, ou utiliser un enregistrement audio.',
    sections: [
      {
        title: 'Le message d’accueil écrit',
        text: 'C’est la première phrase prononcée par l’agent (« Greeting » ou « Initial message »). Elle est lue exactement telle qu’écrite.',
        list: [
          'Visez 5 à 10 secondes : salutation, nom de l’entreprise, question.',
          'Utilisez la ponctuation pour les pauses (« … » marque un temps).',
          'Écrivez les nombres comme ils doivent être prononcés et gardez les accents.',
          'Annoncez que l’interlocuteur est une IA et, si c’est le cas, que l’appel est enregistré (obligation du règlement européen sur l’IA).',
          'Exemple : « Bonjour, cabinet Martin, Julie, l’assistante IA du cabinet… Que puis-je faire pour vous ? »',
        ],
      },
      {
        title: 'Le message d’accueil enregistré',
        text: 'Pour un rendu plus naturel, vous pouvez importer un fichier audio joué au décroché. L’accueil doit rester transparent : il indique que la suite de l’appel est assurée par un assistant IA.',
        steps: [
          'Enregistrez l’accueil au calme (moins de 10 secondes).',
          'Importez le fichier dans les réglages de l’agent et activez sa lecture.',
          'Pour une transition naturelle, clonez la même voix pour le reste de l’appel.',
        ],
      },
      {
        title: 'Vérifier',
        text: 'Appelez l’agent et écoutez : prononciation, pauses, volume et enchaînement avec la conversation. Prévoyez un accueil par langue si l’agent en parle plusieurs.',
      },
    ],
    related: ['choisir-la-voix', 'consignes-system-prompt', 'tester-son-agent'],
  },
  {
    slug: 'choisir-la-voix',
    category: 'assistant',
    title: 'Choisir ou cloner une voix',
    summary: 'Sélectionner une voix de la bibliothèque, en importer une ou cloner la vôtre.',
    plan: 'Voix de la bibliothèque : tous les forfaits. Voix clonées : à partir du forfait Assistant.',
    sections: [
      {
        title: 'Choisir une voix',
        steps: [
          'Ouvrez l’agent, section « Voice & speech ».',
          'Choisissez la langue, puis le fournisseur de voix (« TTS Provider »).',
          'Parcourez les voix (homme, femme, accent) et écoutez-les avant de valider.',
        ],
      },
      {
        title: 'Importer une voix de la bibliothèque du fournisseur',
        steps: [
          'Cliquez sur « Import voice » à côté de la liste des voix.',
          'Choisissez le fournisseur, trouvez une voix publique dans sa bibliothèque et copiez son lien ou son identifiant.',
          'Collez-le puis cliquez sur « Import » : la voix apparaît dans la liste dès qu’elle est prête.',
        ],
      },
      {
        title: 'Cloner une voix',
        steps: [
          'Cliquez sur « Clone voice ».',
          'Choisissez le fournisseur, la langue et un nom.',
          'Enregistrez ou importez un échantillon : une seule personne, sans bruit de fond (au moins 10 secondes, idéalement 1 minute ou plus).',
          'Après le traitement, sélectionnez la nouvelle voix.',
        ],
        tip: 'Ne clonez que votre voix ou une voix pour laquelle vous avez l’accord écrit de la personne.',
      },
    ],
    related: ['message-d-accueil', 'tester-son-agent', 'creer-un-agent'],
  },
  {
    slug: 'flow-builder',
    category: 'assistant',
    title: 'Concevoir un scénario avec le Flow Builder',
    summary: 'Dessiner une conversation en blocs reliés, avec plusieurs chemins selon les réponses.',
    plan: 'À partir du forfait Assistant.',
    sections: [
      {
        title: 'Quand l’utiliser',
        text: 'Le Flow Builder est idéal pour un script structuré avec plusieurs embranchements (qualification, prise de rendez-vous en plusieurs étapes). Pour une conversation simple et libre, les consignes écrites suffisent.',
      },
      {
        title: 'Ouvrir le Flow Builder',
        steps: [
          'Ouvrez l’agent, section des consignes, onglet « Flow Builder ».',
          'Cliquez sur « Launch Flow Builder ».',
          'Partez du scénario existant, d’une page vierge ou d’un modèle.',
        ],
      },
      {
        title: 'Les 5 types de blocs',
        list: [
          '« Start » : le début de l’appel et la phrase d’accueil (un seul par scénario).',
          '« Speak » : une phrase dite mot pour mot.',
          '« Prompt » : une consigne que l’IA reformule selon le contexte.',
          '« Action » : transférer l’appel, prendre un rendez-vous ou lancer un outil sur mesure.',
          '« End » : raccrocher, transférer, ou passer la main à un autre agent.',
        ],
      },
      {
        title: 'Créer des embranchements',
        steps: [
          'Ajoutez un bloc avec « + Add Node ».',
          'Dans un bloc « Speak » ou « Prompt », ajoutez des issues (« Add Outcome ») : « Intéressé », « Pas intéressé », « Rappeler plus tard »…',
          'Reliez chaque issue au bloc suivant en tirant un trait depuis son point de sortie.',
          'Cliquez sur « Save ».',
        ],
        tip: 'Exportez régulièrement votre scénario (« Export JSON ») pour en garder une copie. Testez chaque chemin avant la mise en service.',
      },
    ],
    related: ['consignes-system-prompt', 'editeur-de-prompt-ia', 'tester-son-agent'],
  },

  // ---------- Connaissances, agenda et outils ----------
  {
    slug: 'base-de-connaissances',
    category: 'tools',
    title: 'Créer une base de connaissances',
    summary: 'Donner à l’agent vos documents et pages web pour qu’il réponde avec vos informations.',
    plan: 'Le nombre de bases dépend de votre forfait (menu « Limits »).',
    sections: [
      {
        title: 'Créer la base',
        steps: [
          'Menu « Knowledge base », puis créez une base (nom et description).',
          'Ajoutez vos contenus : fichiers PDF, Word (.docx) ou texte (.txt), ou l’adresse de pages de votre site.',
          'Attendez le statut « Active » (« Processing » pendant l’analyse).',
          'Dans l’agent, section « Knowledgebase », sélectionnez la base et enregistrez.',
        ],
      },
      {
        title: 'Choisir le mode de consultation',
        list: [
          '« Function Call » (recommandé) : l’agent consulte la base seulement quand c’est utile. Plus rapide.',
          '« Prompt Injection » : la base est consultée après chaque phrase du client. Plus précis mais plus lent, adapté au support.',
        ],
      },
      {
        title: 'Bonnes pratiques',
        list: [
          'Des contenus courts, avec des titres clairs et des listes.',
          'Des pages web publiques : certains sites protégés bloquent la lecture (statut « Failed »). Dans ce cas, exportez le contenu en PDF et importez-le.',
          'Les 10 questions les plus fréquentes peuvent aussi aller directement dans les consignes.',
          'Relisez les transcriptions pour vérifier que l’agent cite correctement vos informations.',
        ],
      },
    ],
    related: ['consignes-system-prompt', 'outils-de-l-agent', 'historique-des-appels'],
  },
  {
    slug: 'rendez-vous-cal-com',
    category: 'tools',
    title: 'Prise de rendez-vous avec Cal.com',
    summary: 'Relier Cal.com pour que l’agent consulte vos disponibilités et réserve pendant l’appel.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Récupérer la clé Cal.com',
        steps: [
          'Dans Cal.com : « Settings » → « Developer » → « API Keys ».',
          'Créez une clé et copiez-la (elle commence par cal_live_).',
        ],
      },
      {
        title: 'Connecter Cal.com à l’agent',
        steps: [
          'Ouvrez l’agent, section « Tools & actions », puis « Appointment Scheduling ».',
          'Choisissez « Cal.com » et la région de votre compte (US par défaut, EU si votre compte est européen).',
          'Collez la clé et choisissez le type de rendez-vous (personnel ou d’équipe).',
          'Cliquez sur « Sync Event » : les champs de réservation (nom, email, téléphone, champs personnalisés) sont configurés automatiquement.',
          'Enregistrez l’agent.',
        ],
      },
      {
        title: 'Pour que l’invitation parte',
        list: [
          'Ajoutez une variable email à l’agent et renseignez-la pour vos contacts, ou demandez à l’agent de recueillir l’adresse.',
          'Plusieurs types de rendez-vous ? Cliquez sur « + » à côté de « Appointment Scheduling » pour en ajouter.',
          'Si vous modifiez les champs dans Cal.com, cliquez à nouveau sur « Sync Event ». En cas d’erreur, « Troubleshoot » réinitialise les champs.',
        ],
        tip: 'Votre agenda Google ou Outlook se relie à Cal.com : l’agent voit alors vos vraies disponibilités.',
      },
    ],
    related: ['rendez-vous-calendly', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'rendez-vous-calendly',
    category: 'tools',
    title: 'Prise de rendez-vous avec Calendly',
    summary: 'Relier Calendly pour que l’agent vérifie les créneaux et réserve directement pendant l’appel.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Connecter Calendly',
        steps: [
          'Ouvrez l’agent, section « Tools & actions », puis « Appointment Scheduling ».',
          'Choisissez « Calendly » puis « Connect to Calendly » et autorisez l’accès.',
          'Cliquez sur « Load Events » et choisissez le type de rendez-vous.',
          'Enregistrez l’agent.',
        ],
        tip: 'En cas de souci de connexion, réessayez dans une fenêtre de navigation privée.',
      },
      {
        title: 'Régler le lieu du rendez-vous dans Calendly',
        text: 'L’agent ne peut pas générer de lien de visioconférence. Dans Calendly, ouvrez le type de rendez-vous et réglez le lieu (« Location ») sur « Custom » (recommandé) ou « Phone Call ». Un rendez-vous uniquement en visio (Meet, Zoom, Teams) ferait échouer la réservation : ajoutez au moins une de ces options.',
      },
      {
        title: 'Plusieurs agendas',
        text: 'Cliquez sur « + » pour ajouter d’autres types de rendez-vous et décrivez dans « When to schedule » quand utiliser chacun. Un compte administrateur d’organisation Calendly voit aussi les rendez-vous d’équipe.',
      },
    ],
    related: ['rendez-vous-cal-com', 'outils-de-l-agent', 'tester-son-agent'],
  },
  {
    slug: 'outils-de-l-agent',
    category: 'tools',
    title: 'Les outils de l’agent : transfert, fin d’appel, clavier',
    summary: 'Les actions intégrées que l’agent peut déclencher pendant l’appel et comment les régler.',
    sections: [
      {
        title: 'Où les trouver',
        text: 'Ouvrez l’agent, section « Tools & actions ». Chaque outil s’active puis se déclenche selon ce que vous écrivez dans les consignes.',
      },
      {
        title: 'Les outils intégrés',
        list: [
          'Fin d’appel (« End call ») : l’agent raccroche poliment, par exemple quand le client dit au revoir.',
          'Transfert (« Call transfer ») : l’agent bascule l’appel vers un humain ou un autre numéro. Indiquez le numéro et quand transférer (urgence, demande d’un conseiller, client prêt à acheter).',
          'Prise de rendez-vous (« Appointment Scheduling ») : Cal.com ou Calendly, eux-mêmes reliés à Google ou Outlook.',
          'Touches du clavier (« DTMF ») : l’agent tape des chiffres pour naviguer dans un serveur vocal ou saisir un poste.',
        ],
      },
      {
        title: 'Aller plus loin',
        list: [
          'Les outils sur mesure interrogent votre logiciel en direct (stock, dossier client…).',
          'Après l’appel, les automatisations envoient les résultats vers votre CRM, Google Sheets ou par email.',
        ],
        tip: 'Les outils se combinent : vérifier une information, prendre un rendez-vous, puis transférer si besoin. Décrivez cet enchaînement dans les consignes.',
      },
    ],
    related: ['outils-sur-mesure', 'rendez-vous-cal-com', 'automatisations'],
  },
  {
    slug: 'outils-sur-mesure',
    category: 'tools',
    title: 'Créer un outil sur mesure (pendant l’appel)',
    summary: 'Permettre à l’agent d’interroger votre logiciel en direct : suivi de commande, vérification client, disponibilités.',
    plan: 'Le nombre d’outils dépend de votre forfait (menu « Limits »).',
    sections: [
      {
        title: 'Créer l’outil',
        steps: [
          'Menu « Mid call tools / MCP », puis « Create Mid-Call Tool ».',
          'Nom : lettres, chiffres et tirets bas (par exemple check_order_status).',
          'Description : quand et pourquoi l’agent doit l’utiliser.',
          'Type « HTTP request » : indiquez l’adresse de votre API (« Endpoint »), la méthode (GET, POST…), le délai maximal et les en-têtes (par exemple une clé d’autorisation).',
        ],
      },
      {
        title: 'Définir les informations à collecter',
        list: [
          'Ajoutez les paramètres que l’agent demandera au client : nom, type (texte, nombre, décimal, oui/non) et description avec le format attendu (« numéro de commande au format ORD-12345 »).',
          'Un paramètre peut figurer dans l’adresse : https://api.exemple.com/commandes/{order_id}.',
          'Les champs fixes (« Static fields ») sont envoyés à chaque appel sans que l’IA les modifie.',
          'Variables automatiques : {{customer_phone}} (numéro du client), {{current_date}}, {{current_time}}, {{assistant_name}}…',
        ],
      },
      {
        title: 'Tester et brancher',
        steps: [
          'Cliquez sur « Test tool » : une vraie requête part avec des données d’exemple et vous voyez la réponse.',
          'Attribuez l’outil à l’agent.',
          'Dans les consignes, précisez quand l’utiliser et comment expliquer le résultat au client.',
        ],
        tip: 'Le type « Automation Platform » crée automatiquement un scénario d’automatisation relié à l’outil, pour une logique en plusieurs étapes sans code (forfait Assistant et supérieurs).',
      },
    ],
    related: ['outils-de-l-agent', 'automatisations', 'consignes-system-prompt'],
  },

  // ---------- Numéros et téléphonie ----------
  {
    slug: 'acheter-un-numero',
    category: 'phone',
    title: 'Obtenir un numéro et l’attribuer à un agent',
    summary: 'Acheter un numéro dédié depuis votre espace, ou garder le vôtre, puis le relier à votre agent.',
    plan: 'Numéros dédiés à partir de {numberFrom} par mois selon le pays ; le nombre de numéros possibles dépend du forfait (les numéros ne sont pas inclus dans son prix).',
    sections: [
      {
        title: 'Acheter un numéro',
        steps: [
          'Menu « Get new phone number ».',
          'Choisissez le pays et le type (local, national, gratuit selon disponibilité) : le prix mensuel s’affiche avant l’achat.',
          'Validez : le numéro apparaît dans « Your phone numbers ».',
        ],
        text: 'Le numéro voulu n’est pas proposé ? Contactez-nous : nous pouvons le demander à l’opérateur (justificatifs selon le pays, 1 à 3 jours ouvrés en général).',
      },
      {
        title: 'Attribuer le numéro à l’agent',
        steps: [
          'Menu « Assistants », ouvrez l’agent, section « General ».',
          'Dans « Phone number », sélectionnez le numéro.',
          'Cliquez sur « Save ».',
        ],
      },
      {
        title: 'Garder votre numéro actuel',
        list: [
          'Le plus simple : activez chez votre opérateur un renvoi d’appel vers le nouveau numéro.',
          'Vous avez Twilio ou Telnyx : importez vos numéros.',
          'Vous avez un standard ou un opérateur SIP : connectez-le en SIP (tous les forfaits).',
        ],
        tip: 'Après chaque changement, appelez le numéro pour vérifier que l’agent répond.',
      },
    ],
    related: ['importer-twilio-telnyx', 'connexion-sip', 'numero-presente'],
  },
  {
    slug: 'importer-twilio-telnyx',
    category: 'phone',
    title: 'Importer vos numéros Twilio ou Telnyx',
    summary: 'Utiliser vos numéros Twilio ou Telnyx avec votre agent grâce à un trunk SIP.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Avant de commencer',
        text: 'Dans votre espace, ouvrez « Your phone numbers » puis « Integrate SIP trunk » : le formulaire affiche l’adresse SIP de réception à indiquer chez votre opérateur. Gardez cet écran ouvert.',
      },
      {
        title: 'Côté Twilio',
        steps: [
          'Console Twilio : « Elastic SIP Trunking » → « Create new SIP Trunk ».',
          '« Termination » : saisissez seulement un nom (par exemple votreentreprise) ; Twilio ajoute .pstn.twilio.com. Notez l’adresse complète.',
          'Dans « Authentication », configurez l’accès (liste d’adresses IP ou identifiants).',
          '« Origination » : ajoutez l’adresse SIP de réception affichée dans votre espace.',
          '« Numbers » : ajoutez les numéros à utiliser.',
        ],
      },
      {
        title: 'Côté Telnyx',
        steps: [
          'Portail Telnyx : « Voice » → « SIP Trunking » → « Create SIP Connection », type « FQDN ».',
          'Ajoutez l’adresse SIP de réception affichée dans votre espace (port 5060) et sélectionnez-la comme FQDN principal.',
          'Authentification sortante : « Credentials », avec un identifiant et un mot de passe à noter.',
          'Assignez vos numéros et autorisez les pays à appeler (« Outbound Voice Profiles » → « Allowed Destinations »).',
        ],
      },
      {
        title: 'Importer le numéro dans votre espace',
        steps: [
          '« Your phone numbers » → « Integrate SIP trunk ».',
          'Saisissez le numéro au format international, l’identifiant et le mot de passe.',
          'Adresse SIP : l’adresse Twilio notée (votreentreprise.pstn.twilio.com) ou sip.telnyx.com pour Telnyx.',
          'Choisissez le type d’autorisation et le pays, puis enregistrez.',
          'Attribuez le numéro à votre agent et testez un appel entrant et un appel sortant.',
        ],
        tip: 'Le trunk se crée une seule fois : pour chaque nouveau numéro, ajoutez-le au trunk puis importez-le. Mot de passe : 12 caractères minimum, avec majuscules, minuscules et chiffres.',
      },
    ],
    related: ['connexion-sip', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'connexion-sip',
    category: 'phone',
    title: 'Connecter votre standard ou opérateur en SIP',
    summary: 'Relier votre standard téléphonique (PBX) ou votre opérateur VoIP pour garder vos numéros.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Deux façons de se connecter',
        list: [
          '« SIP Extension » : l’agent devient un poste de votre standard (par exemple le poste 1011). Idéal pour tester ou router certains appels vers l’IA.',
          '« Phone Number (DID) » : un numéro complet est relié à l’agent, en entrant comme en sortant.',
        ],
      },
      {
        title: 'Configurer la connexion',
        steps: [
          'Menu « Your phone numbers », puis « Integrate SIP trunk ».',
          'Choisissez le type de trunk et saisissez le poste ou le numéro, l’identifiant et le mot de passe fournis par votre opérateur.',
          'Sortant : indiquez l’adresse du serveur SIP (sans le port) et activez l’IP fixe seulement si votre opérateur l’exige.',
          'Choisissez le format des numéros attendu par votre opérateur : international avec +, international sans +, ou national.',
          'Entrant : faites pointer votre opérateur vers l’adresse SIP de réception affichée dans le formulaire, avec authentification par adresses IP autorisées ou par identifiant et mot de passe.',
          'Choisissez le pays du trunk et enregistrez.',
        ],
      },
      {
        title: 'Vérifier',
        list: [
          'Appelez le numéro ou le poste : l’agent doit répondre.',
          'Lancez un appel de test sortant depuis l’agent.',
          'Si vous changez le mot de passe chez votre opérateur, changez-le aussi dans votre espace.',
        ],
        tip: 'Vous gardez la maîtrise de vos numéros : votre standard décide quels appels vont à l’agent et lesquels restent chez vous.',
      },
    ],
    related: ['importer-twilio-telnyx', 'acheter-un-numero', 'numero-presente'],
  },
  {
    slug: 'numero-presente',
    category: 'phone',
    title: 'Choisir le numéro affiché lors des appels sortants',
    summary: 'Afficher un numéro dédié, votre propre numéro vérifié ou celui de votre standard SIP.',
    sections: [
      {
        title: 'Trois possibilités',
        list: [
          'Un numéro dédié acheté dans votre espace : sélectionnez-le dans l’agent (« General » → « Phone number »). Aucune vérification nécessaire, et il peut aussi recevoir les rappels.',
          'Votre numéro existant (fixe ou mobile) : vérifiez-le par code reçu par SMS ou par appel. Il s’affiche chez vos contacts, mais les appels entrants sur ce numéro n’arrivent pas à l’agent. (Forfaits payants.)',
          'Votre standard SIP : le numéro présenté est celui autorisé par votre opérateur.',
        ],
      },
      {
        title: 'Règles à respecter',
        list: [
          'N’affichez que des numéros dont vous êtes titulaire ou que vous avez le droit d’utiliser.',
          'Certains pays interdisent d’afficher un numéro étranger ou non vérifié.',
        ],
        tip: 'Avant une grande campagne, appelez votre propre téléphone pour vérifier le numéro affiché.',
      },
    ],
    related: ['acheter-un-numero', 'campagnes-d-appels', 'connexion-sip'],
  },

  // ---------- Site web et messageries ----------
  {
    slug: 'widget-site-web',
    category: 'channels',
    title: 'Installer l’agent sur votre site (widget web)',
    summary: 'Ajouter un bouton de chat et d’appel vocal à votre site, aux couleurs de votre marque.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Configurer le widget',
        steps: [
          'Ouvrez l’agent et cliquez sur « Web widget ».',
          'Choisissez le mode : « Voice & Chat » (recommandé), « Chat Only » ou « Voice Only ».',
          'Réglez la position, la couleur, la taille et l’ouverture automatique.',
          'Personnalisez les textes du bouton (« Button ») et de l’en-tête (« Header & Modal »), et ajoutez votre avatar (image carrée, 512 Ko maximum).',
          'Optionnel : un formulaire avant la conversation (« Pre-Chat Form ») pour demander nom, email ou téléphone. Chaque champ alimente une variable de l’agent.',
        ],
      },
      {
        title: 'Tester puis installer',
        steps: [
          'Testez dans l’aperçu en direct en haut de la page (« Reset Data » simule un nouveau visiteur).',
          'Enregistrez, puis copiez le code de la section « Embed Code ».',
          'Collez-le juste avant la balise </body> de votre site, ou transmettez-le à votre webmaster.',
        ],
        tip: 'Enregistrez toujours avant de copier le code : le widget charge ses réglages depuis votre espace. La voix exige un site en HTTPS.',
      },
      {
        title: 'Au quotidien',
        list: [
          'Toutes les conversations du widget arrivent dans « Inbox ».',
          '« Enable Widget » permet de masquer le widget sans retirer le code.',
          'Pour des liens cliquables dans le chat, demandez dans les consignes de les écrire au format [texte](adresse).',
        ],
      },
    ],
    related: ['historique-des-appels', 'whatsapp', 'consignes-system-prompt'],
  },
  {
    slug: 'whatsapp',
    category: 'channels',
    title: 'Connecter WhatsApp à votre agent',
    summary: 'Laisser l’agent répondre sur WhatsApp, et envoyer des modèles de messages validés par Meta.',
    plan: 'Tous les forfaits. Les messages sont payés avec les crédits de messages.',
    sections: [
      {
        title: 'Créer l’expéditeur WhatsApp',
        steps: [
          'Menu « Channels » → « WhatsApp », puis créez un expéditeur.',
          'Choisissez un numéro acheté dans votre espace (vérification automatique) ou votre propre mobile (code reçu par SMS ou appel). Ce numéro ne doit pas déjà être utilisé sur WhatsApp.',
          'Saisissez le nom affiché aux clients, puis suivez la fenêtre Meta (« Login with Facebook ») en créant un nouveau compte WhatsApp Business.',
        ],
        tip: 'Pendant la vérification d’un numéro acheté, ses appels entrants sont interceptés quelques minutes : ne la lancez pas sur un numéro déjà en service.',
      },
      {
        title: 'Relier l’agent',
        steps: [
          'Quand l’expéditeur est « Online », modifiez-le et choisissez l’agent.',
          'Activez « AI Enabled » et enregistrez : l’agent répond désormais aux messages, transcrit les messages vocaux et peut analyser les images.',
        ],
      },
      {
        title: 'Les règles de WhatsApp',
        list: [
          'Quand un client vous écrit, vous pouvez lui répondre librement pendant 24 heures.',
          'Pour écrire en premier ou relancer après 24 heures, il faut un modèle de message (« Template ») approuvé par Meta : utilitaire, marketing ou authentification.',
          'Un nouvel expéditeur est limité à environ 250 conversations par jour ; la limite augmente si vos messages sont bien reçus (peu de blocages et de signalements).',
        ],
      },
    ],
    related: ['campagnes-d-appels', 'historique-des-appels', 'automatisations'],
  },

  // ---------- Campagnes et contacts ----------
  {
    slug: 'campagnes-d-appels',
    category: 'outbound',
    title: 'Lancer une campagne d’appels (ou de messages)',
    summary: 'Faire appeler une liste de contacts par votre agent, avec horaires, relances et objectifs.',
    plan: 'À partir du forfait Assistant.',
    sections: [
      {
        title: 'Avant de commencer',
        list: [
          'Appels : un agent « Make phone calls » avec un numéro, et des minutes disponibles.',
          'WhatsApp : un expéditeur connecté et un modèle approuvé. SMS : un numéro compatible SMS. Les deux utilisent les crédits de messages.',
          'Des contacts qui ont accepté d’être appelés (accord daté) ou, selon le pays, avec qui vous avez une relation client ; jamais de fichier acheté ou loué. Voir le guide « Qui pouvez-vous faire appeler par votre agent ? ».',
        ],
      },
      {
        title: 'Créer la campagne',
        steps: [
          'Menu « Campaigns », créez une campagne : nom, canal (« Call », « WhatsApp » ou « SMS ») et agent.',
          'Horaires : une ou plusieurs plages par jour (par exemple 10 h–13 h et 14 h–20 h en semaine, les plages autorisées en France pour le démarchage des consommateurs) et les jours autorisés.',
          'Relances : nombre de tentatives (1 à 5) et délai entre deux tentatives ; choisissez si un répondeur compte comme une tentative.',
          'Option « Retry until goal completed » : la campagne rappelle jusqu’à ce que l’objectif soit atteint (un champ oui/non des données après appel, par exemple rendez-vous pris).',
          'Ajoutez les contacts (saisie, import de fichier) puis cliquez sur « Start Campaign ».',
        ],
      },
      {
        title: 'Suivre et ajuster',
        list: [
          'Le tableau de bord de la campagne montre les appels en cours, terminés, les contacts restants et le prochain appel.',
          'Pour modifier les réglages : mettez la campagne en pause, modifiez, puis relancez. Rien n’est perdu.',
          'Option de repli : après le dernier essai d’appel, envoyer une fois un SMS ou un modèle WhatsApp.',
        ],
        tip: 'Commencez par 2 ou 3 tentatives aux heures autorisées dans le pays de vos contacts (en France : du lundi au vendredi, 10 h–13 h et 14 h–20 h), et respectez toujours les demandes d’opposition (menu « Blacklist »).',
      },
    ],
    related: ['contacts-leads', 'numero-presente', 'donnees-apres-appel', 'qui-peut-on-appeler'],
  },
  {
    slug: 'contacts-leads',
    category: 'outbound',
    title: 'Importer et gérer vos contacts (leads)',
    summary: 'Importer un fichier de contacts, personnaliser chaque appel et suivre les statuts.',
    sections: [
      {
        title: 'Préparer le fichier',
        list: [
          'Format CSV ou Excel, avec une colonne phone_number (obligatoire).',
          'Une colonne par variable de l’agent (par exemple customer_name, company) pour personnaliser l’appel.',
          'Numéros au format international sans espaces (+33639981234), ou format national avec un fichier par pays.',
          'Téléchargez le fichier d’exemple proposé à l’import pour partir du bon format.',
          'Base légale, avant chaque import : vérifiez que chaque contact a accepté d’être appelé ou est déjà client (selon les règles du pays), et notez la source et la date de cet accord, par exemple dans une colonne source_consentement. N’importez jamais de fichier acheté ou loué. Voir le guide « Qui pouvez-vous faire appeler par votre agent ? ».',
        ],
      },
      {
        title: 'Importer',
        steps: [
          'Menu « Leads » (ou onglet contacts de la campagne), puis « Import Leads ».',
          'Choisissez la campagne, le format des numéros et, si besoin, le nombre de numéros secondaires.',
          'Associez chaque colonne au bon champ (détection automatique), puis lancez l’import.',
          'Les lignes invalides ou en double sont ignorées et listées dans un rapport téléchargeable.',
        ],
      },
      {
        title: 'Gérer les contacts',
        list: [
          'Statuts : « Created » (à appeler), « Processing », « Rescheduled » (relance prévue), « Completed », « Max Retries ».',
          'Remettre un contact en « Created » le fait rappeler ; le passer en « Completed » arrête les appels.',
          'Numéros secondaires : appelés dans l’ordre si le principal ne répond pas (campagnes d’appels uniquement).',
          'Filtres, suppression groupée et export CSV sont disponibles dans la liste.',
        ],
        tip: 'Faites d’abord un petit import de test pour vérifier le format, puis importez le reste.',
      },
    ],
    related: ['campagnes-d-appels', 'donnees-apres-appel', 'editeur-de-prompt-ia', 'qui-peut-on-appeler'],
  },

  // ---------- Suivi et automatisations ----------
  {
    slug: 'historique-des-appels',
    category: 'results',
    title: 'Retrouver vos appels et conversations',
    summary: 'Écouter les enregistrements, lire les transcriptions et suivre les conversations écrites.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Les appels',
        steps: [
          'Menu « Calls history ».',
          'Filtrez par agent, par date ou par sens (entrant / sortant).',
          'Ouvrez un appel : enregistrement, transcription, résumé, données extraites et durée.',
        ],
      },
      {
        title: 'Les conversations écrites',
        text: 'Le menu « Inbox » regroupe les échanges écrits avec vos agents :',
        list: [
          '« Web widget » : les conversations depuis votre site, avec les données du formulaire.',
          '« WhatsApp » : les échanges WhatsApp, avec l’état de la fenêtre de 24 heures.',
          '« Test » : vos sessions de chat de test.',
          'Filtrez par type, agent ou date ; ouvrez une conversation pour voir messages, variables et coût.',
        ],
      },
      {
        title: 'En tirer parti',
        list: [
          'Écoutez quelques appels chaque semaine et ajoutez aux consignes les cas mal traités.',
          'Supprimez les conversations de test pour garder un historique propre (la suppression est définitive).',
        ],
      },
    ],
    related: ['donnees-apres-appel', 'automatisations', 'consignes-system-prompt'],
  },
  {
    slug: 'donnees-apres-appel',
    category: 'results',
    title: 'Extraire les informations de chaque appel',
    summary: 'Définir les données que l’IA extrait après chaque appel et les envoyer vers vos outils.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Définir les données à extraire',
        text: 'Après chaque appel, l’IA relit la conversation et remplit les champs que vous avez définis (« Post-call evaluation »). Deux champs existent par défaut : « status » (objectif atteint, oui/non) et « summary » (résumé).',
        steps: [
          'Ouvrez l’agent, section des données après appel.',
          'Ajoutez un champ : nom en minuscules sans espace (par exemple rdv_pris), type (texte, nombre, oui/non) et description précise.',
          'Exemples : budget (nombre), decideur (oui/non), motif_appel (texte), urgence (nombre de 1 à 10).',
        ],
        tip: 'Plus la description est précise, plus l’extraction est fiable. Alignez-la sur l’objectif décrit dans les consignes.',
      },
      {
        title: 'Envoyer les résultats vers vos outils',
        steps: [
          'Section « Webhooks & channels » : activez l’envoi et collez l’adresse de réception (webhook).',
          'Choisissez d’envoyer seulement les appels terminés ou tous, avec ou sans le lien de l’enregistrement.',
          'Enregistrez, puis cliquez sur « Make test request » pour vérifier la réception.',
        ],
        text: 'Chaque envoi contient le numéro, la durée, le statut, les données extraites, les variables d’origine et la transcription.',
      },
      {
        title: 'Utiliser ces données',
        list: [
          'Relancer automatiquement dans une campagne tant que l’objectif n’est pas atteint.',
          'Mettre à jour votre CRM, une feuille Google Sheets ou prévenir votre équipe grâce aux automatisations.',
        ],
      },
    ],
    related: ['automatisations', 'historique-des-appels', 'campagnes-d-appels'],
  },
  {
    slug: 'automatisations',
    category: 'results',
    title: 'Premiers pas avec les automatisations',
    summary: 'Envoyer automatiquement les résultats d’appels vers votre CRM, Google Sheets, Slack ou par email.',
    plan: 'À partir du forfait Assistant (5 000 exécutions par mois, 50 000 avec Centre d’appels).',
    sections: [
      {
        title: 'Le principe',
        text: 'Le menu « Automate platform » ouvre un éditeur de scénarios sans code relié à plus de 300 outils. Un scénario (« flow ») commence par un déclencheur, puis enchaîne des actions.',
      },
      {
        title: 'Les déclencheurs utiles',
        list: [
          'Fin d’appel (« Call Ended ») : se lance dès qu’un appel se termine, avec la transcription et les données extraites.',
          'Appel entrant : se lance avant que l’agent décroche, pour retrouver le client dans votre CRM et personnaliser l’accueil.',
          'Aussi : planification (tous les jours à 8 h…), webhook, événement WhatsApp.',
        ],
      },
      {
        title: 'Créer votre premier scénario',
        steps: [
          'Ouvrez « Automate platform » et créez un flow (ou partez d’un modèle).',
          'Choisissez le déclencheur « Call Ended ».',
          'Ajoutez une action : ligne dans Google Sheets, contact dans votre CRM, email ou message Slack à l’équipe.',
          'Insérez les données de l’appel (résumé, numéro, champs extraits) dans l’action.',
          'Testez chaque étape, puis publiez le flow.',
        ],
        tip: 'Exemples courants : mettre à jour HubSpot après chaque appel, ajouter un contact qualifié à une campagne de rappel, envoyer le résumé par email.',
      },
    ],
    related: ['donnees-apres-appel', 'outils-sur-mesure', 'historique-des-appels'],
  },

  // ---------- Minutes et facturation ----------
  {
    slug: 'minutes-et-facturation',
    category: 'billing',
    title: 'Comprendre les minutes, le crédit et la facturation',
    summary: 'Comment les minutes sont décomptées, à quoi sert le crédit et où gérer votre abonnement.',
    sections: [
      {
        title: 'Ce que vous payez',
        list: [
          'Votre forfait mensuel, avec des minutes d’appel incluses.',
          'Les minutes au-delà du forfait, payées avec votre crédit (« Credits »).',
          'Les messages WhatsApp, SMS et réponses écrites de l’IA, payés avec les crédits de messages.',
          'Les numéros dédiés, à partir de {numberFrom} par mois selon le pays.',
        ],
      },
      {
        title: 'Le décompte des minutes',
        list: [
          'Les minutes consommées par chaque appel apparaissent dans « Calls history ».',
          'Les minutes incluses se renouvellent chaque mois, à la date anniversaire de votre abonnement.',
          'Les appels de test (navigateur ou téléphone) consomment aussi des minutes.',
        ],
      },
      {
        title: 'Où gérer quoi',
        list: [
          '« Add credits » : acheter une recharge (montant libre, dès 5 $) ; le crédit ne périme pas. Vous pouvez aussi y acheter des crédits de messages : 100 crédits pour 1 $, dès 100 crédits.',
          '« Change plan » : changer de forfait. Si vous dépassez souvent vos minutes incluses, le forfait supérieur revient moins cher à la minute.',
          '« Billing info » : moyen de paiement, factures et abonnement.',
          '« Limits » : ce que votre forfait autorise (agents, appels simultanés, numéros…).',
        ],
        tip: 'Le tableau de bord (« Dashboard ») affiche votre consommation du mois. Avec les automatisations, vous pouvez recevoir une alerte quand vous approchez de la limite.',
      },
    ],
    related: ['tester-son-agent', 'acheter-un-numero', 'campagnes-d-appels'],
  },
  // ---------- Ajouts (playbook) : renvoi d’appel, règles d’appel sortant, vérifications, suivi mensuel ----------
  {
    slug: 'renvoi-d-appel',
    category: 'phone',
    title: 'Garder votre numéro avec le renvoi d’appel',
    summary: 'Faire décrocher l’agent seulement quand vous ne répondez pas, quand vous êtes occupé ou en dehors des horaires, sans changer de numéro.',
    plan: 'Tous les forfaits. Le renvoi est facturé par votre opérateur.',
    sections: [
      {
        title: 'Le principe',
        text: 'Vous gardez votre numéro sur vos cartes de visite, votre site et vos annonces. Chez votre opérateur, vous activez un renvoi vers le numéro de l’agent : tous vos appels, ou seulement ceux que vous ne prenez pas. Rien ne change pour vos clients.',
      },
      {
        title: 'Les codes de renvoi sur un mobile',
        text: 'Sur la plupart des mobiles et des opérateurs, tapez le code puis le numéro de l’agent au format international, terminé par # et la touche d’appel :',
        list: [
          'Si vous ne répondez pas : **61*numéro de l’agent# (vous pouvez souvent ajouter le délai avant renvoi, par exemple **61*numéro**20#).',
          'Si votre ligne est occupée : **67*numéro de l’agent#',
          'Si votre téléphone est éteint ou hors réseau : **62*numéro de l’agent#',
          'Tous les appels, tout le temps : **21*numéro de l’agent#',
          'Pour désactiver : ##61#, ##67#, ##62# ou ##21#, ou ##002# pour tout annuler.',
        ],
      },
      {
        title: 'Sur une ligne fixe ou une box',
        steps: [
          'Ouvrez l’espace client de votre opérateur (ou le menu de votre standard).',
          'Cherchez « renvoi d’appel » ou « transfert d’appel ».',
          'Choisissez le type de renvoi (sur non-réponse, sur occupation ou permanent) et saisissez le numéro de l’agent.',
          'Enregistrez, puis appelez votre numéro depuis un autre téléphone pour vérifier.',
        ],
      },
      {
        title: 'Le bon réglage selon votre activité',
        list: [
          'Vous voulez garder la main : renvoi sur non-réponse (après 15 à 20 secondes) et sur occupation.',
          'Le soir et le week-end : renvoi permanent à la fermeture, désactivé à l’ouverture (certains standards le programment).',
          'Pics d’appels : le renvoi sur occupation suffit, l’agent prend les appels en parallèle.',
        ],
        tip: 'Le renvoi est facturé par votre opérateur comme un appel vers le numéro de l’agent : vérifiez votre forfait, surtout si ce numéro est à l’étranger. Pour un numéro local, vous pouvez aussi importer vos numéros Twilio ou Telnyx ou connecter votre standard en SIP.',
      },
    ],
    related: ['acheter-un-numero', 'connexion-sip', 'importer-twilio-telnyx'],
  },
  {
    slug: 'qui-peut-on-appeler',
    category: 'outbound',
    title: 'Qui pouvez-vous faire appeler par votre agent ?',
    summary: 'Les règles à respecter avant une campagne d’appels sortants : consentement, relation client, horaires, opposition et transparence.',
    plan: 'Campagnes : à partir du forfait Assistant. Ce guide est informatif et ne remplace pas un conseil juridique.',
    sections: [
      {
        title: 'La règle d’or',
        text: 'Appelez uniquement des personnes avec qui vous avez une raison légitime et démontrable de parler : elles vous ont demandé un rappel, elles ont accepté d’être contactées, ou l’appel concerne un contrat ou un service en cours avec vous. Gardez la preuve de cette base (formulaire, date, canal).',
      },
      {
        title: 'En France',
        list: [
          'Depuis le 11 août 2026, la prospection téléphonique des consommateurs exige leur accord préalable, libre et explicite (opt-in, article L223-1 du Code de la consommation). C’est à vous de prouver ce consentement. Bloctel reste utile pour certains contrats conclus avant cette date : faites vérifier votre situation par un juriste.',
          'Un rappel demandé par la personne, un rendez-vous à confirmer ou un suivi lié à une prestation en cours ne sont pas du démarchage : ils restent possibles.',
          'Fichiers achetés ou récupérés sur des annuaires et des portails : à proscrire pour les particuliers sans consentement prouvé.',
          'Entre professionnels, informez la personne et respectez immédiatement toute demande d’opposition.',
        ],
      },
      {
        title: 'Dans les autres pays',
        list: [
          'Royaume-Uni : vérifiez les registres TPS et CTPS et appliquez le PECR et le UK GDPR.',
          'Australie : vérifiez le Do Not Call Register et le Spam Act pour les messages.',
          'Italie : Registro pubblico delle opposizioni. Pologne : consentement préalable au marketing téléphonique. Pays-Bas : consentement préalable ou relation client existante.',
          'En cas de doute, appliquez la règle la plus stricte.',
        ],
      },
      {
        title: 'Pendant l’appel',
        list: [
          'L’agent dit dès le début qu’il est une IA et que l’appel est enregistré.',
          'Il donne la raison réelle de l’appel (« vous nous aviez demandé un rappel le… »).',
          'Si la personne ne veut plus être appelée, ajoutez son numéro au menu « Blacklist » : il sera exclu de toutes les campagnes.',
          'En France, le démarchage des consommateurs n’est autorisé que du lundi au vendredi, de 10 h à 13 h et de 14 h à 20 h, hors jours fériés. Ailleurs, respectez les horaires locaux du contact.',
        ],
        tip: 'Avant d’importer un fichier, notez sa source, la date de la relation et la base légale. En cas de contrôle, c’est cette fiche qui vous protège.',
      },
    ],
    related: ['campagnes-d-appels', 'contacts-leads', 'numero-presente'],
  },
  {
    slug: 'verifier-avant-mise-en-ligne',
    category: 'start',
    title: 'Les 12 vérifications avant de mettre votre agent en ligne',
    summary: 'Une liste de contrôle à suivre avant d’ouvrir la ligne : elle évite la plupart des problèmes de la première semaine.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Testez sur un vrai téléphone',
        text: 'Appelez l’agent depuis votre mobile (pas depuis les haut-parleurs de l’ordinateur), comme le ferait un client. Faites tester aussi une personne qui ne connaît pas le projet.',
      },
      {
        title: 'La liste de contrôle',
        steps: [
          'Le message d’accueil cite votre entreprise, dit que c’est une IA et pose une seule question claire.',
          'Le nom de votre entreprise est bien prononcé (sinon, écrivez-le phonétiquement dans les consignes).',
          'Un rendez-vous pris au téléphone apparaît dans votre agenda en moins d’une minute.',
          'Vous recevez bien le résumé de l’appel (email ou tableau de bord).',
          'La demande « je veux parler à quelqu’un » déclenche le transfert ou la prise de rappel prévue.',
          'Un mot d’urgence de votre métier (fuite, douleur, panne) déclenche la consigne prévue.',
          'Le comportement hors horaires correspond à ce que vous voulez.',
          'L’agent ne donne ni prix, ni garantie, ni conseil que vous n’avez pas validés.',
          'Il répond correctement aux 5 questions qu’on vous pose le plus souvent.',
          'L’annonce de l’enregistrement est présente si les appels sont enregistrés.',
          'Les numéros à ne pas appeler sont dans la « Blacklist » avant toute campagne.',
          'Vous avez réécouté trois enregistrements complets et vous êtes d’accord avec le ton.',
        ],
        tip: 'Notez ce qui ne va pas, corrigez les consignes ou la base de connaissances, puis refaites seulement les tests concernés.',
      },
    ],
    related: ['tester-son-agent', 'message-d-accueil', 'consignes-system-prompt'],
  },
  {
    slug: 'point-mensuel',
    category: 'results',
    title: 'Faire le point chaque mois en 20 minutes',
    summary: 'Les quatre chiffres à regarder, les appels à réécouter et les réglages à revoir pour que votre agent reste bon dans la durée.',
    plan: 'Tous les forfaits.',
    sections: [
      {
        title: 'Les 4 chiffres qui comptent',
        list: [
          'Nombre d’appels traités par l’agent.',
          'Demandes qualifiées (avec un besoin réel et des coordonnées).',
          'Rendez-vous pris ou rappels programmés.',
          'Valeur estimée : rendez-vous × valeur moyenne d’un client.',
        ],
        text: 'Les minutes consommées servent à suivre votre forfait, pas à mesurer le résultat : regardez d’abord ce que les appels ont rapporté.',
      },
      {
        title: 'Réécoutez 10 appels',
        steps: [
          'Menu « Calls history » : prenez 10 appels au hasard du mois.',
          'Pour chacun : la demande a-t-elle été comprise ? la bonne action a-t-elle été faite ? le ton vous convient-il ?',
          'Ne corrigez les consignes que si le même problème revient au moins deux fois.',
        ],
      },
      {
        title: 'Vérifiez ce qui casse en silence',
        list: [
          'L’agenda est toujours connecté (un calendrier renommé ou supprimé coupe la réservation).',
          'Les automatisations et webhooks tournent sans erreur.',
          'Vos horaires, prix et congés sont à jour dans la base de connaissances.',
        ],
        tip: 'Bloquez 20 minutes le premier jour ouvré de chaque mois. Un agent revu régulièrement reste précis ; un agent oublié dérive.',
      },
    ],
    related: ['historique-des-appels', 'donnees-apres-appel', 'automatisations'],
  },
];
