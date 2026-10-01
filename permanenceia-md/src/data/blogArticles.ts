export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Productivité' | 'Conformité' | 'Cas Client' | 'Technique';
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: '5-raisons-perte-leads-telephone',
    title: '5 raisons pour lesquelles vous perdez des leads par téléphone (et comment y remédier)',
    excerpt: '67% des prospects raccrochent immédiatement dès qu’ils tombent sur un répondeur. Analyse chiffrée de la friction téléphonique et leviers d’optimisation immédiats.',
    category: 'Productivité',
    date: '15 Septembre 2026',
    readTime: '6 min',
    author: {
      name: 'Thomas Morel',
      role: 'Head of Voice AI & Conversion',
    },
    content: [
      "Dans un monde où les consommateurs exigent l'immédiateté, le téléphone demeure le canal avec le taux de conversion le plus élevé du commerce moderne. Pourtant, paradoxalement, c'est aussi le point de rupture le plus coûteux pour les entreprises de services et les professionnels libéraux.",
      "1. Le gouffre du répondeur vocal : Plus de deux tiers des appelants refusent catégoriquement de laisser un message vocal. Lorsqu'un artisan, un cabinet médical ou un commercial ne décroche pas, le prospect clique sur le lien suivant de sa recherche Google.",
      "2. Les heures creuses et les week-ends : Près de 41% des appels d'urgence ou de recherche de prestataires interviennent entre 18h et 22h, ainsi que le samedi matin. Fermer son standard à 18h équivaut à fermer sa vitrine au moment où vos clients ont le temps d'appeler.",
      "3. L'incapacité à qualifier dès le premier contact : Même lorsqu'un standard décroche, si la personne qui répond ne peut que 'prendre un message', la valeur perçue est minimale. L'interlocuteur souhaite savoir si son problème peut être résolu et obtenir une estimation ou un rendez-vous ferme.",
      "4. La surcharge cognitive en pic d'activité : Lorsque deux appels sonnent en simultané, l'un des deux sonne dans le vide ou tombe sur une musique d'attente insupportable.",
      "5. L'absence de synchronisation avec l'agenda métier : Devoir rappeler un client 4 heures plus tard pour convenir d'une date multiplie les allers-retours et le risque d'abandon.",
      "La solution moderne réside dans le déploiement d'un agent vocal IA conversationnel capable de comprendre le contexte, de rassurer l'appelant et de clore la réservation sans attente."
    ],
  },
  {
    slug: 'rdv-automatise-vs-humain',
    title: 'Comment choisir entre un RDV automatisé par IA et un secrétariat humain',
    excerpt: 'Coûts réels, disponibilité horaire, empathie, gestion des exceptions : notre comparatif exhaustif pour faire le bon choix stratégique.',
    category: 'Productivité',
    date: '08 Septembre 2026',
    readTime: '5 min',
    author: {
      name: 'Élodie Laurent',
      role: 'Consultante Opérations & Téléphonie',
    },
    content: [
      "Faut-il confier son standard à une secrétaire interne, à un centre d'appels délocalisé ou à un agent vocal d'intelligence artificielle ? Cette question taraude chaque dirigeant soucieux de sa rentabilité.",
      "Un secrétariat physique en France représente un coût mensuel moyen de 2 800 € à 3 600 € charges comprises, avec une plage horaire limitée à 35 heures par semaine et des interruptions lors des congés ou maladies.",
      "À l'inverse, l'agent vocal IA fonctionne 168 heures par semaine (24h/24, 7j/7), absorbe des dizaines d'appels simultanés pour un forfait mensuel débutant à 99 € HT, soit une économie de plus de 90%.",
      "Le modèle hybride idéal : Pour la majorité des cabinets médicaux et entreprises spécialisées, la meilleure stratégie consiste à décharger le secrétariat humain des appels répétitifs (prise de RDV, annulation, horaires, localisation) pour lui permettre de se consacrer à l'accueil sur place et aux cas complexes."
    ],
  },
  {
    slug: 'cas-client-agence-immobiliere',
    title: 'Cas client : comment cette agence immobilière a doublé ses RDV en 3 mois',
    excerpt: 'Découvrez les coulisses de la mise en place de Permanence IA au sein du Cabinet Nova à Bordeaux : +112% de visites qualifiées et zéro appel du week-end manqué.',
    category: 'Cas Client',
    date: '28 Août 2026',
    readTime: '4 min',
    author: {
      name: 'Marc Duprès',
      role: 'Directeur de Cabinet Immobilier',
    },
    content: [
      "Marc Duprès dirige une agence de 6 collaborateurs à Bordeaux. Face à un marché immobilier exigeant, la rapidité de traitement des contacts est le premier facteur de succès.",
      "'Nous recevions près de 35 appels le samedi et le dimanche sur nos annonces de biens exclusifs. Nos négociateurs étaient saturés et ne pouvaient pas être en visite et au téléphone en même temps.',",
      "En connectant Permanence IA à leur passerelle de biens et à leur agenda partagé, l'agent vocal a pris le relais en qualifiant le profil d'acquéreur, le budget d'emprunt et en réservant automatiquement des créneaux de visite groupée.",
      "Résultat après 90 jours : 112% d'augmentation des visites planifiées, 5 mandats exclusifs supplémentaires captés auprès de propriétaires impressionnés par la réactivité du standard, et une sérénité retrouvée pour les équipes le week-end."
    ],
  },
  {
    slug: 'rgpd-assistants-vocaux-ia',
    title: 'RGPD et assistants téléphoniques IA : ce que vous devez impérativement savoir',
    excerpt: 'Enregistrement vocal, consentement de l’appelant, hébergement des données de santé en Europe : le guide pratique pour rester 100% conforme.',
    category: 'Conformité',
    date: '19 Août 2026',
    readTime: '7 min',
    author: {
      name: 'Maître Alexandre V.',
      role: 'Avocat spécialisé Droit du Numérique & Data',
    },
    content: [
      "L'intégration de l'intelligence artificielle dans les flux téléphoniques des entreprises soulève d'importantes questions réglementaires au regard du Règlement Général sur la Protection des Données (RGPD).",
      "1. L'obligation d'information préalable : L'appelant doit être informé dès les premières secondes que l'appel fait l'objet d'un traitement automatisé et, le cas échéant, d'une transcription textuelle.",
      "2. La localisation des serveurs : Dans le cadre de l'invalidation répétée des transferts de données transatlantiques sans garanties strictes, il est impératif que les voix et textes soient hébergés au sein de centres de données européens certifiés.",
      "3. La minimisation des données collectées : Un standard ne doit enregistrer que les données strictement indispensables à l'exécution de la mission (nom, prénom, coordonnées, motif de l'appel).",
      "Chez Permanence IA, toutes les architectures sont auditées, garantissent un chiffrement de niveau bancaire et permettent aux utilisateurs d'exercer instantanément leur droit d'accès ou d'effacement."
    ],
  },
  {
    slug: 'integrations-calendly-hubspot-stripe',
    title: 'Intégrations Permanence IA : Calendly, Google Calendar, HubSpot, Stripe & Zapier',
    excerpt: 'Tutoriel pas-à-pas pour brancher votre standard intelligent à vos outils quotidiens en moins de 10 minutes, sans écrire une seule ligne de code.',
    category: 'Technique',
    date: '10 Août 2026',
    readTime: '5 min',
    author: {
      name: 'Thomas Morel',
      role: 'Head of Voice AI & Integrations',
    },
    content: [
      "Un assistant téléphonique qui fonctionne en vase clos n'a que peu d'intérêt. La vraie puissance d'un standard IA se révèle lorsqu'il s'interface harmonieusement avec votre écosystème logiciel existant.",
      "Étape 1 : Synchronisation du calendrier. Grâce aux protocoles CalDAV et aux API officielles de Google et Microsoft, l'agent lit vos créneaux d'indisponibilité et insère les rendez-vous pris au téléphone avec notification par SMS.",
      "Étape 2 : Transmission des leads dans votre CRM. Dès la fin de la communication téléphonique, le webhook génère un payload JSON contenant le transcript complet, l'analyse de sentiment (satisfait, neutre, agacé) et la liste des tâches à accomplir.",
      "Étape 3 : Paiement d'acomptes par SMS. Pour les prestations nécessitant une réservation garantie ou un acompte, l'agent vocal peut déclencher l'envoi immédiat d'un lien de paiement Stripe sécurisé sur le mobile de l'appelant."
    ],
  },
];
