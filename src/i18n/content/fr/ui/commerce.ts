// Textes d'interface des pages commerciales : accueil, tarifs, offres, recharges, secteurs,
// fonctionnalités, intégrations. Les chiffres (prix, minutes, jours d’essai) et la marque
// arrivent en paramètres depuis le marché (src/i18n/markets.ts) : ne jamais les écrire ici.
//
// Les titres avec mot-clé surligné sont découpés en { before, kw, after } : `kw` est affiché en couleur.

// Mots-clés SEO (voir docs/seo/keywords-fr.md) : titre et description par secteur et par module,
// retrouvés à partir du nom affiché. Si un nom change, la page retombe sur le titre générique.
const SECTOR_SEO: Record<string, { title: string; description: (days: number) => string }> = {
  'E-commerce': { title: 'Service client IA pour boutique en ligne', description: (days) => `Service client IA pour e-commerce : suivi de commande, retours et questions produit traités à toute heure, au téléphone et par message. Testez ${days} jours gratuitement.` },
  'Courtiers en assurance et en crédit': { title: 'Accueil téléphonique IA pour courtiers', description: (days) => `Accueil téléphonique IA pour courtiers en assurance et en crédit : demandes de devis rappelées vite, pièces relancées, rendez-vous posés. Testez ${days} jours gratuitement.` },
  'Gestion locative et syndics': { title: 'Permanence téléphonique gestion locative', description: (days) => `Permanence téléphonique pour gestion locative et syndics : incidents des locataires triés jour et nuit, visites qualifiées. Testez ${days} jours gratuitement.` },
  'Médecine et chirurgie esthétiques': { title: 'Secrétariat IA pour médecine esthétique', description: (days) => `Secrétariat téléphonique IA pour médecine esthétique : consultations réservées, rendez-vous confirmés la veille, aucun conseil médical. Testez ${days} jours gratuitement.` },
  'Services à domicile': {
    title: 'Permanence téléphonique pour artisans 24/7',
    description: (days) => `Permanence téléphonique pour plombiers, électriciens et chauffagistes : urgences filtrées et demandes qualifiées. Testez ${days} jours gratuitement.`,
  },
  'Dentaire et cliniques': {
    title: 'Secrétariat dentaire et médical par IA',
    description: (days) => `Secrétariat dentaire par IA : rendez-vous, confirmations et reports gérés sans interrompre les soins. Testez ${days} jours gratuitement.`,
  },
  Immobilier: {
    title: 'Accueil téléphonique agence immobilière IA',
    description: (days) => `Accueil téléphonique d’agence immobilière : acheteurs, vendeurs et locataires qualifiés pendant vos visites. Testez ${days} jours gratuitement.`,
  },
  'Garages et automobile': {
    title: 'Standard téléphonique IA pour garage auto',
    description: (days) => `Standard téléphonique pour garage : rendez-vous atelier et demandes de devis préparés sans interrompre le comptoir. Testez ${days} jours gratuitement.`,
  },
  'Kinés et paramédical': {
    title: 'Secrétariat kiné et paramédical par IA',
    description: (days) => `Secrétariat téléphonique pour kinés, ostéopathes et paramédicaux : rendez-vous et reports gérés pendant vos séances. Testez ${days} jours gratuitement.`,
  },
  'Cliniques vétérinaires': {
    title: 'Standard téléphonique vétérinaire IA',
    description: (days) => `Standard téléphonique pour clinique vétérinaire : urgences orientées, rendez-vous pris, rappels de vaccins. Testez ${days} jours gratuitement.`,
  },
  'Salons de coiffure et barbiers': {
    title: 'Prise de RDV coiffeur et barbier 24/7',
    description: (days) => `Prise de rendez-vous par téléphone pour salon de coiffure et barbier : l’agent IA réserve pendant que vous coupez. Testez ${days} jours gratuitement.`,
  },
  'Beauté et bien-être': {
    title: 'Prise de RDV institut de beauté et spa',
    description: (days) => `Prise de rendez-vous pour institut de beauté, spa et onglerie : soins réservés par téléphone pendant vos soins. Testez ${days} jours gratuitement.`,
  },
  'Restaurants et hôtellerie': {
    title: 'Réservation restaurant par téléphone 24/7',
    description: (days) => `Réservation restaurant par téléphone, même en plein service : tables, allergies et questions clients gérées. Testez ${days} jours gratuitement.`,
  },
  'Avocats et experts-comptables': {
    title: 'Permanence téléphonique avocat et comptable',
    description: (days) => `Permanence téléphonique pour cabinet d’avocats et d’expertise comptable : appels filtrés, dossiers qualifiés. Testez ${days} jours gratuitement.`,
  },
};

/** Lieu de travail par secteur, pour « Ce que ça change pour votre … ». */
const SECTOR_PLACE: Record<string, string> = {
  immobilier: 'agence', 'dentaire-cliniques': 'cabinet', 'kines-paramedical': 'cabinet', 'cliniques-veterinaires': 'clinique',
  automobile: 'garage', 'salons-de-coiffure': 'salon', 'beaute-bien-etre': 'institut', 'restaurants-hotellerie': 'établissement',
  'avocats-experts-comptables': 'cabinet', 'e-commerce': 'boutique', 'courtiers-assurance-credit': 'cabinet',
  'gestion-locative': 'agence', 'medecine-esthetique': 'cabinet',
};

const MODULE_SEO_TITLE: Record<string, string> = {
  'Réceptionniste IA': 'Réceptionniste virtuelle IA 24/7',
  'Démo en direct de l’agent': 'Démo agent vocal IA en direct',
  'Relance des anciens clients': 'Relance automatique de clients par IA',
  'Prise de rendez-vous': 'Prise de rendez-vous téléphonique par IA',
  'Support client': 'Service client téléphonique par IA',
  'Tri et qualification des demandes': 'Tri et qualification des demandes par téléphone',
  'Rappels et confirmations': 'Rappels et confirmations de rendez-vous par IA',
  'WhatsApp et messages': 'Messages WhatsApp et SMS automatisés',
  'Base de connaissances': 'Base de connaissances pour agent vocal IA',
  'Consignes de l’agent': 'Consignes de l’agent vocal IA, sans code',
  'Scénarios automatisés': 'Scénarios automatisés sans code',
  'SIP et numéros': 'Trunk SIP, numéros et renvoi d’appel',
  'Statistiques et suivi des appels': 'Statistiques et transcriptions d’appels',
  'Widget web': 'Widget d’appel et de rappel pour site web',
};

export const UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `Standard téléphonique IA : agent vocal 24/7 · ${brand}`,
      description: (days: number, minutes: number) =>
        `Standard téléphonique IA qui répond, qualifie et prend vos rendez-vous 24/7. ${days} jours d’essai gratuit, ${minutes} minutes incluses : essayez-le.`,
    },
    hero: {
      title: { before: 'Ne perdez plus un client parce que ', kw: 'personne n’a décroché', after: '' },
      intro: 'Votre permanence téléphonique par IA répond 24 h/24, trie les demandes et prend les rendez-vous dans votre agenda. Sans matériel, sans engagement, sans frais de mise en service.',
      photoAlt: 'Dirigeante consultant le résumé d’un appel sur son téléphone',
    },
    showcase: { title: 'Voyez l’agent en action dans votre métier', intro: 'Choisissez un secteur : l’appel se déroule, puis la demande arrive prête à traiter.' },
    benefits: { title: 'Ce que l’agent fait pour votre entreprise', intro: 'Une réceptionniste virtuelle formée à votre activité, qui travaille quand votre équipe ne peut pas décrocher.' },
    features: {
      booking: {
        title: { before: 'Automatisez la prise de ', kw: 'rendez-vous et les rappels', after: '' },
        text: 'Cabinets, salons, garages, agences : l’agent se connecte à votre agenda, propose les créneaux libres, réserve et confirme. Reports et annulations compris.',
        points: ['Agenda synchronisé : Google Agenda, Outlook… via Cal.com ou Calendly', 'Confirmation par SMS ou WhatsApp, dès le forfait Assistant', 'Rappel la veille du rendez-vous, dès le forfait Assistant'],
        link: 'Voir la prise de rendez-vous',
      },
      support: {
        title: { before: 'Répondez aux ', kw: 'questions de vos clients', after: ' sans attente' },
        text: 'L’agent s’appuie sur vos documents, vos pages web et vos procédures. Il répond juste, et transfère à votre équipe ce qui demande un humain.',
        points: ['Base de connaissances : PDF, site web, données', 'Plusieurs appels en même temps, sans file d’attente', 'Transfert vers un humain selon vos règles'],
        link: 'Voir le support client',
      },
      leads: {
        title: { before: 'Qualifiez et ', kw: 'rappelez vos prospects', after: ' plus vite' },
        text: 'Un formulaire rempli sur votre site devient un appel en quelques minutes. L’agent qualifie, relance et prépare une fiche que votre équipe peut traiter tout de suite.',
        points: ['Préqualification selon vos critères', 'Relances et confirmations automatiques', 'Campagnes vers des contacts consentants'],
        link: 'Voir le tri et la qualification des demandes',
      },
    },
    useCases: { title: 'Un agent pour chaque type d’appel', intro: 'Entrants, sortants ou messages : activez les usages dont votre activité a besoin, de la permanence téléphonique du soir aux relances de devis.' },
    platform: {
      title: 'La plateforme complète pour automatiser vos appels',
      intro: 'Bien plus qu’un répondeur intelligent : voix, intelligence, téléphonie, automatisations et rapports sont inclus, dans un seul espace.',
      link: 'Toutes les fonctionnalités',
    },
    steps: {
      title: 'Opérationnel en quatre étapes',
      intro: 'Vous n’avez pas besoin d’expertise technique. Nous vous accompagnons à chaque étape.',
      items: (days: number, minutes: number) => [
        { title: 'Créez votre compte', text: `Choisissez votre forfait : ${days} jours gratuits, ${minutes} minutes incluses, rien n’est débité pendant l’essai.` },
        { title: 'Décrivez votre activité', text: 'Services, horaires, questions fréquentes, règles de transfert.' },
        { title: 'Testez l’agent', text: 'Écoutez-le en direct et ajustez le ton et les réponses.' },
        { title: 'Branchez vos appels', text: 'Renvoi de votre ligne, nouveau numéro ou SIP, et widget sur votre site.' },
      ],
    },
    sectors: {
      title: 'Des agents adaptés à votre métier',
      intro: 'Onze métiers où chaque appel manqué coûte un client. L’agent pose les bonnes questions pour chacun.',
      link: 'Tous les secteurs',
    },
    integrations: {
      title: 'Connecté à vos outils',
      intro: 'Agenda, CRM, messageries, téléphonie : l’agent s’intègre à ce que vous utilisez déjà. Les scénarios automatisés relient plus de 300 outils sans code, à la manière de Zapier ou Make.',
      link: 'Voir toutes les intégrations',
    },
    pricing: {
      title: 'Des forfaits clairs, en prix HT',
      intro: 'Choisissez votre standard téléphonique IA selon votre volume d’appels. Plus le forfait est important, moins la minute coûte cher.',
      compare: 'Comparer toutes les fonctions incluses',
    },
    faq: {
      title: 'Questions fréquentes',
      intro: 'Vous ne trouvez pas votre réponse ? Laissez votre numéro, un conseiller vous rappelle.',
      link: 'Toutes les questions',
    },
  },

  tarifs: {
    meta: {
      title: (brand: string) => `Tarifs standard téléphonique IA, prix HT · ${brand}`,
      /** Un plan dans la description : `price` et `minutes` déjà formatés. */
      annualOffer: (name: string) => `${name} (facturation annuelle)`,
      plan: (name: string, price: string, minutes: string) => `${name} ${price}`,
      description: (plans: string[], days: number, minutes: number) =>
        `Standard téléphonique IA : ${plans.join(', ')} HT/mois, sans engagement. Testez ${days} jours gratuitement.`,
    },
    hero: {
      title: 'Choisissez le forfait adapté à votre volume d’appels',
      intro: (days: number, minutes: number) =>
        `Les tarifs de notre standard téléphonique IA sont affichés hors taxes. Plus le forfait est important, moins la minute coûte cher. L’essai gratuit comprend ${days} jours et ${minutes} minutes d’appels incluses.`,
      moreMinutes: 'Besoin de plus de minutes ? Ajoutez une recharge à tout moment.',
    },
    matrix: {
      title: 'Ce qui est inclus dans votre interface',
      intro: 'Chaque ligne correspond à une page ou une fonction que vous retrouvez dans votre espace client. Rien d’autre n’est caché derrière un bouton.',
    },
    recharges: {
      title: 'Besoin de plus de minutes ?',
      intro: 'La recharge dépanne un mois chargé. Pour un volume régulier, le forfait supérieur reste la solution la plus économique.',
      link: 'Comment fonctionnent les recharges',
    },
    // Encadré « Messages écrits » : coûts relevés dans la configuration des crédits de l’espace client.
    messageCredits: {
      title: 'Messages écrits : prix en crédits',
      intro: 'Les réponses écrites de l’IA et les messages envoyés (chat du site, WhatsApp, Messenger, Instagram, SMS) sont décomptés de votre solde de crédits de messages.',
      usageCol: 'Usage',
      costCol: 'Coût en crédits',
      rows: [
        { label: 'Réponse écrite de l’IA (chat du site, WhatsApp, Messenger, Instagram)', cost: '3 crédits' },
        { label: 'Message WhatsApp reçu ou envoyé en session', cost: '1,4 crédit' },
        { label: 'Message modèle WhatsApp (template)', cost: 'Tarif de Meta selon le pays et la catégorie, majoré' },
        { label: 'SMS envoyé', cost: '2 crédits' },
        { label: 'Appel WhatsApp', cost: 'Facturé en minutes' },
      ],
      smsNote: 'Le coût d’un SMS peut varier selon l’opérateur ou le pays.',
      getTitle: 'Obtenir des crédits',
      included: 'Inclus chaque mois dans votre forfait :',
      includedValue: (credits: string, replies: string) => `${credits} crédits / mois (≈ ${replies} réponses)`,
      // Forfait sans crédits inclus (Réceptionniste tant que le plan Autocalls n’en attribue pas).
      notIncludedValue: 'Non inclus : convertissez des minutes',
      convert: 'Ou convertissez des minutes depuis votre espace client : 1 minute = 9 crédits.',
      balance: 'Votre solde se consulte dans l’espace client. À 0 crédit, les réponses écrites et les envois de SMS ou WhatsApp s’arrêtent jusqu’à la recharge.',
    },
    faq: {
      title: 'Questions sur les tarifs',
      intro: 'Un doute sur le forfait de votre agent vocal IA ? Faites-vous rappeler, ou essayez l’agent en direct.',
      primary: 'Démarrer l’essai de 14 jours',
      demo: 'Voir la démo en direct',
    },
    finalCta: (minutes: number) => `Démarrez avec ${minutes} minutes offertes`,
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `Agent vocal IA gratuit ${days} jours, ${minutes} min · ${brand}`,
    /** `monthly` : ajoute « HT / mois » quand le prix est un montant mensuel. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) =>
      monthly ? `Forfait ${name} IA, ${price} HT / mois · ${brand}` : `Standard IA ${name.toLowerCase()}, ${price} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. Essai gratuit ${days} jours, ${minutes} min incluses : démarrez sans engagement.`,
    breadcrumb: 'Tarifs',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `Forfait ${name} · ${audience}`,
    demo: 'Essayer notre agent en direct',
    perMonth: 'HT / mois',
    orAnnual: (price: string) => `ou ${price} HT / an (2 mois offerts)`,
    perMinuteLine: (perMinute: string) => `soit ${perMinute} dans le forfait`,
    facts: {
      minutes: 'Minutes incluses',
      more: 'Besoin de plus ?',
      moreCustom: 'Volume négocié',
      moreDefault: 'Recharge à tout moment',
      commitment: 'Engagement',
      commitmentValue: 'Aucun',
    },
    included: {
      title: 'Ce que vous trouvez dans votre interface',
      intro: 'La liste exacte des fonctions accessibles avec ce forfait.',
      notIncluded: 'Non inclus',
      includedLabel: 'Inclus',
      compare: 'Comparer avec les autres forfaits',
    },
    modules: { title: 'Les modules au cœur de ce forfait' },
    extra: {
      title: 'Minutes supplémentaires',
      intro: 'Un mois plus chargé ? Ajoutez une recharge. Un volume qui grandit ? Passez au forfait supérieur.',
    },
    others: { title: 'Les autres forfaits' },
    faq: { title: 'Questions fréquentes' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `Recharges de minutes agent vocal IA · ${brand}`,
      description: (price: string, minutes: string) =>
        `Rechargez le montant de votre choix, par exemple ${price} HT pour ${minutes} minutes de plus sur votre agent vocal IA, sans changer de forfait. Ajoutez du crédit en un clic.`,
    },
    hero: {
      title: 'Ajoutez des minutes à tout moment',
      intro: 'La recharge dépanne un mois plus chargé. Si vous rechargez souvent, le forfait supérieur devient plus économique : nous vous le signalons.',
    },
    how: {
      title: 'Comment ça fonctionne',
      steps: (min: string, max: string) => [
        { title: 'Suivez votre usage', text: 'Votre tableau de bord affiche les minutes consommées et restantes.' },
        { title: 'Ajoutez du crédit', text: `Le montant de votre choix (par exemple ${min}), en un clic depuis votre espace (Add credits).` },
        { title: 'Continuez sans coupure', text: 'Le crédit paie les minutes au-delà du forfait et ne périme pas.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `Secrétariat téléphonique IA par métier · ${brand}`,
      description: 'Artisans, vétérinaires, agences immobilières, garages, coiffeurs, instituts, restaurants, avocats : un secrétariat téléphonique IA par métier.',
    },
    hero: {
      title: 'Un secrétariat téléphonique IA adapté à votre métier',
      intro: 'Nous avons retenu onze métiers où les appels arrivent quand les équipes sont occupées, et où chaque demande manquée coûte un client. De la permanence téléphonique d’un artisan à l’accueil d’une clinique vétérinaire, du salon de coiffure au cabinet d’avocats, l’agent pose les bonnes questions.',
    },
    other: {
      title: 'Votre activité n’est pas dans la liste ?',
      intro: 'Auto-écoles, salles de sport, pressings, tourisme, formation : l’agent se configure pour tout métier qui reçoit des appels. Parlons de votre cas.',
      primary: 'Démarrer l’essai de 14 jours',
      demo: 'Essayer notre agent en direct',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${SECTOR_SEO[name]?.title ?? `${name} : agent vocal IA 24/7`} · ${brand}`,
      /** `short` est la phrase courte du secteur, sans point final. */
      description: (name: string, short: string, days: number, minutes: number) =>
        SECTOR_SEO[name]?.description(days) ?? `${name} : ${short}. Essai gratuit ${days} jours, ${minutes} minutes incluses, prix HT.`,
    },
    breadcrumb: 'Secteurs',
    liveCallTitle: (name: string) => `Agent · ${name}`,
    change: {
      title: 'Ce qui change quand l’agent répond à votre place',
      intro: (targets: string) => `${targets}. Dans votre métier, chaque appel sans réponse est une demande qui part ailleurs.`,
    },
    handles: {
      title: 'Ce que l’agent prend en charge pour votre activité',
      intro: 'Il pose les questions que vous poseriez, dans un ordre naturel, et vous transmet une demande complète.',
    },
    /** Titre des bénéfices : le lieu du métier (agence, cabinet, salon…), « activité » par défaut. */
    benefitsTitle: (slug: string) => `Ce que ça change pour votre ${SECTOR_PLACE[slug] ?? 'activité'}`,
    how: { title: 'Comment ça fonctionne' },
    includes: { title: 'Ce que ça inclut', intro: 'Les modules les plus utiles pour votre métier, tous disponibles dans votre espace.' },
    integrations: {
      title: 'Intégrations utiles',
      intro: 'Votre agenda, votre CRM, vos messageries et votre téléphonie restent les mêmes : l’agent s’y connecte.',
    },
    pricing: {
      title: 'Prix HT, sans engagement ni frais de mise en service',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `Pour votre activité (${sectorName}), nous recommandons le forfait ${offerName}. Commencez par l’essai gratuit : ${days} jours et ${minutes} minutes incluses.`,
      link: (offerName: string) => `Voir le détail du forfait ${offerName}`,
    },
    faq: { title: (name: string) => `Questions fréquentes — ${name}` },
    callback: {
      title: 'Laissez votre numéro, nous vous rappelons',
      text: 'Un conseiller vous rappelle pour étudier votre cas.',
    },
    others: { title: 'Autres secteurs' },
    finalCta: 'Prêt à ne plus manquer un appel ?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `Fonctionnalités de l’agent vocal IA · ${brand}`,
      description: 'Réceptionniste virtuelle, prise de rendez-vous, qualification, WhatsApp, scénarios automatisés, SIP, statistiques : les 14 modules de votre agent vocal IA.',
    },
    hero: {
      title: 'Tout ce qu’il faut pour automatiser vos appels',
      intro: 'Quatorze modules pour votre agent vocal IA, activés selon votre forfait, depuis votre espace client.',
    },
    overview: { title: 'Vue d’ensemble' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${MODULE_SEO_TITLE[name] ?? `${name} : agent vocal IA`} · ${brand}`,
      /** `short` est la phrase bénéfice du module, sans point final. */
      description: (short: string, offerName: string, days: number) => `${short}. Inclus dès le forfait ${offerName}, essai gratuit ${days} jours : testez-le.`,
    },
    breadcrumb: 'Fonctionnalités',
    eyebrow: (family: string, name: string) => `${family} · ${name}`,
    uses: { title: 'À quoi ça sert' },
    from: {
      title: (offerName: string) => `Inclus à partir du forfait ${offerName}`,
      /** `price` déjà formaté dans la devise du marché. */
      priceLine: (price: string, minutes: string) => `${price} HT / mois · ${minutes}`,
      offerLink: (offerName: string) => `Voir le forfait ${offerName}`,
      compare: 'Comparer les forfaits',
    },
    how: { title: 'Comment ça fonctionne' },
    cases: { title: 'Cas d’usage' },
    integrations: { title: 'Intégrations liées', link: 'Toutes les intégrations' },
    more: { title: 'À découvrir aussi' },
  },

  integrations: {
    tools: { title: 'Plus de 300 outils via les automatisations', intro: 'Avec la plateforme d’automatisation (dès le forfait Assistant), chaque appel peut alimenter vos outils : email, messagerie d’équipe, CRM, boutique, paiement, tableurs. En voici quelques-uns.' },
    meta: {
      title: (brand: string) => `Intégrations agent vocal IA : agenda et CRM · ${brand}`,
      description: 'Connectez votre agent vocal IA à votre agenda (via Cal.com ou Calendly), HubSpot, Zoho CRM, WhatsApp, SIP et plus de 300 outils sans code. Voyez la liste.',
    },
    hero: {
      title: 'Connecté aux outils que vous utilisez déjà',
      intro: 'Agenda, CRM, messageries, téléphonie : votre agent vocal IA s’intègre à votre organisation, et les scénarios automatisés relient plus de 300 outils sans code.',
    },
    flow: {
      title: { before: 'Construisez vos automatisations ', kw: 'sans code', after: '' },
      text: 'Un formulaire rempli, un appel terminé, une nouvelle demande : chaque événement peut déclencher une suite d’actions dans vos outils, à la manière de Zapier ou Make, directement depuis votre espace.',
      points: ['Plus de 300 outils disponibles', 'Glisser-déposer, aucun développement', 'Tests avant activation'],
      link: 'Voir les scénarios automatisés',
    },
    api: {
      title: { before: 'Webhooks et API pour ', kw: 'vos systèmes', after: '' },
      text: 'Sur tous les forfaits, recevez chaque fin d’appel et ses données extraites dans vos propres systèmes, ou pilotez l’agent depuis votre logiciel.',
      points: ['Webhook après chaque appel', 'Variables extraites : résultat, intérêt, créneau', 'Outils pendant l’appel, dès le forfait Assistant'],
    },
  },
};
