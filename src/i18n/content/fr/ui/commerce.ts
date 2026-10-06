// Textes d'interface des pages commerciales : accueil, tarifs, offres, recharges, secteurs,
// fonctionnalités, intégrations. Les chiffres (prix, minutes, jours d’essai) et la marque
// arrivent en paramètres depuis le marché (src/i18n/markets.ts) : ne jamais les écrire ici.
//
// Les titres avec mot-clé surligné sont découpés en { before, kw, after } : `kw` est affiché en couleur.

// Mots-clés SEO (voir docs/seo/keywords-fr.md) : titre et description par secteur et par module,
// retrouvés à partir du nom affiché. Si un nom change, la page retombe sur le titre générique.
const SECTOR_SEO: Record<string, { title: string; description: (days: number) => string }> = {
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
  'Beauté et bien-être': {
    title: 'Prise de RDV salon de coiffure et institut',
    description: (days) => `Prise de rendez-vous par téléphone pour salon de coiffure et institut, même en pleine prestation. Testez ${days} jours gratuitement.`,
  },
  'Restaurants et hôtellerie': {
    title: 'Réservation restaurant par téléphone 24/7',
    description: (days) => `Réservation restaurant par téléphone, même en plein service : tables, allergies et questions clients gérées. Testez ${days} jours gratuitement.`,
  },
};

const MODULE_SEO_TITLE: Record<string, string> = {
  'Réceptionniste IA': 'Réceptionniste virtuelle IA 24/7',
  'Démo live de l’agent': 'Démo agent vocal IA en direct',
  'Prise de rendez-vous': 'Prise de rendez-vous téléphonique par IA',
  'Support client': 'Service client téléphonique par IA',
  'Qualification des leads': 'Qualification de leads par téléphone',
  'Campagnes sortantes': 'Appels sortants automatisés par IA',
  'WhatsApp et messages': 'Messages WhatsApp et SMS automatisés',
  'Base de connaissances': 'Base de connaissances pour agent vocal IA',
  'Éditeur de prompts': 'Éditeur de prompts pour agent vocal IA',
  'Flow builder': 'Flow builder : automatisations sans code',
  'SIP et numéros': 'Trunk SIP, numéros et renvoi d’appel',
  Reporting: 'Statistiques et transcriptions d’appels',
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
      title: { before: 'Automatisez vos appels avec une IA qui ', kw: 'répond, qualifie et réserve', after: ' pour vous' },
      intro: 'Votre standard téléphonique IA : des agents vocaux qui décrochent à chaque appel, posent les bonnes questions, prennent les rendez-vous et vous transmettent un résumé clair. Disponibles 24/7, configurés pour votre métier, en ligne en quelques minutes.',
      photoAlt: 'Dirigeante consultant le résumé d’un appel sur son téléphone',
    },
    showcase: { title: 'Voyez l’agent en action dans votre métier', intro: 'Choisissez un secteur : l’appel se déroule, puis la demande arrive prête à traiter.' },
    benefits: { title: 'Ce que l’agent fait pour votre entreprise', intro: 'Une réceptionniste virtuelle formée à votre activité, qui travaille quand votre équipe ne peut pas décrocher.' },
    features: {
      booking: {
        title: { before: 'Automatisez la prise de ', kw: 'rendez-vous et les rappels', after: '' },
        text: 'Cabinets, salons, garages, agences : l’agent se connecte à votre agenda, propose les créneaux libres, réserve et confirme. Reports et annulations compris.',
        points: ['Agenda en direct : Google, Outlook, Cal.com, Calendly', 'Confirmation par SMS ou WhatsApp, dès le forfait Assistant', 'Rappel la veille du rendez-vous, dès le forfait Assistant'],
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
        link: 'Voir la qualification des leads',
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
        { title: 'Testez l’agent', text: 'Écoutez-le en démo live et ajustez le ton et les réponses.' },
        { title: 'Branchez vos appels', text: 'Renvoi de votre ligne, nouveau numéro ou SIP, et widget sur votre site.' },
      ],
    },
    sectors: {
      title: 'Des agents adaptés à votre métier',
      intro: 'Six secteurs où chaque appel manqué coûte un client. L’agent pose les bonnes questions pour chacun.',
      link: 'Tous les secteurs',
    },
    integrations: {
      title: 'Connecté à vos outils',
      intro: 'Agenda, CRM, messageries, téléphonie : l’agent s’intègre à ce que vous utilisez déjà. Le flow builder relie plus de 300 outils sans code, à la manière de Zapier ou Make.',
      link: 'Voir toutes les intégrations',
    },
    pricing: {
      title: 'Des forfaits clairs, en prix HT',
      intro: 'Choisissez votre standard téléphonique IA selon votre volume d’appels. Plus le forfait est grand, plus la minute coûte moins cher.',
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
      plan: (name: string, price: string, minutes: string) => `${name} ${price}`,
      description: (plans: string[], days: number, minutes: number) =>
        `Standard téléphonique IA : ${plans.join(', ')} HT/mois, sans engagement. Testez ${days} jours gratuitement.`,
    },
    hero: {
      title: 'Choisissez le forfait adapté à votre volume d’appels',
      intro: (days: number, minutes: number) =>
        `Les tarifs de notre standard téléphonique IA sont affichés hors taxes. Plus le forfait est grand, plus la minute coûte moins cher. L’essai gratuit comprend ${days} jours et ${minutes} minutes d’appels incluses.`,
      moreMinutes: 'Besoin de plus de minutes ? Ajoutez une recharge à tout moment.',
    },
    matrix: {
      title: 'Ce qui est inclus dans votre interface',
      intro: 'Chaque ligne correspond à une page ou une fonction que vous retrouvez dans votre espace client. Rien d’autre n’est caché derrière un bouton.',
    },
    recharges: {
      title: 'Besoin de plus de minutes ?',
      intro: 'La recharge dépanne un mois chargé. Pour un volume régulier, le forfait supérieur reste la meilleure solution économique.',
      link: 'Comment fonctionnent les recharges',
    },
    faq: {
      title: 'Questions sur les tarifs',
      intro: 'Un doute sur le forfait de votre agent vocal IA ? Faites-vous rappeler, ou essayez l’agent en live.',
      primary: 'Commencer gratuitement',
      demo: 'Voir la démo live',
    },
    finalCta: (minutes: number) => `Démarrez avec ${minutes} minutes offertes`,
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `Agent vocal IA gratuit ${days} jours, ${minutes} min · ${brand}`,
    /** `monthly` : ajoute « HT / mois » quand le prix est un montant mensuel. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) =>
      monthly ? `Forfait ${name} IA — ${price} HT / mois · ${brand}` : `Standard IA ${name.toLowerCase()} — ${price} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. Essai gratuit ${days} jours, ${minutes} min incluses : démarrez sans engagement.`,
    breadcrumb: 'Tarifs',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `Forfait ${name} · ${audience}`,
    demo: 'Essayer en live notre agent',
    perMonth: 'HT / mois',
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
      intro: 'La liste exacte des fonctions accessibles avec cette offre.',
      notIncluded: 'Non inclus',
      includedLabel: 'Inclus',
      compare: 'Comparer avec les autres offres',
    },
    modules: { title: 'Les modules au cœur de cette offre' },
    extra: {
      title: 'Minutes supplémentaires',
      intro: 'Un mois plus chargé ? Ajoutez une recharge. Un volume qui grandit ? Passez au forfait supérieur.',
    },
    others: { title: 'Les autres offres' },
    faq: { title: 'Questions fréquentes' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `Recharges de minutes agent vocal IA · ${brand}`,
      description: (price: string, minutes: string) =>
        `Recharges dès ${price} HT pour ${minutes} minutes de plus sur votre agent vocal IA, sans changer de forfait. Ajoutez du crédit en un clic.`,
    },
    hero: {
      title: 'Ajoutez des minutes à tout moment',
      intro: 'La recharge dépanne un mois plus chargé. Si vous rechargez souvent, le forfait supérieur devient plus économique : nous vous le signalons.',
    },
    how: {
      title: 'Comment ça fonctionne',
      steps: (min: string, max: string) => [
        { title: 'Suivez votre usage', text: 'Votre tableau de bord affiche les minutes consommées et restantes.' },
        { title: 'Ajoutez du crédit', text: `Une recharge de ${min} à ${max}, en un clic depuis votre espace.` },
        { title: 'Continuez sans coupure', text: 'Le crédit paie les minutes au-delà du forfait et ne périme pas.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `Secrétariat téléphonique IA par métier · ${brand}`,
      description: 'Artisans, cabinets dentaires, agences immobilières, garages, salons, restaurants : un secrétariat téléphonique IA pour votre métier. Trouvez le vôtre.',
    },
    hero: {
      title: 'Un secrétariat téléphonique IA adapté à votre métier',
      intro: 'Nous avons retenu six secteurs où les appels arrivent quand les équipes sont occupées, et où chaque demande manquée coûte un client. De la permanence téléphonique d’un artisan au secrétariat d’un cabinet dentaire, l’agent pose les bonnes questions.',
    },
    other: {
      title: 'Votre activité n’est pas dans la liste ?',
      intro: 'Cabinets juridiques, e-commerce, recrutement, tourisme : l’agent se configure pour tout métier qui reçoit des appels. Parlons de votre cas.',
      primary: 'Commencer gratuitement',
      demo: 'Essayer en live notre agent',
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
    liveCallTitle: (name: string) => `Agent ${name.toLowerCase()}`,
    change: {
      title: 'Ce qui change quand l’agent répond à votre place',
      intro: (targets: string) => `${targets}. Dans votre métier, chaque appel sans réponse est une demande qui part ailleurs.`,
    },
    handles: {
      title: 'Ce que l’agent prend en charge pour votre activité',
      intro: 'Il pose les questions que vous poseriez, dans un ordre naturel, et vous transmet une demande complète.',
    },
    /** Titre des bénéfices : « agence » pour l’immobilier, « activité » ailleurs. */
    benefitsTitle: (slug: string) => `Ce que ça change pour votre ${slug === 'immobilier' ? 'agence' : 'activité'}`,
    how: { title: 'Comment ça fonctionne' },
    includes: { title: 'Ce que ça inclut', intro: 'Les modules les plus utiles pour votre métier, tous disponibles dans votre espace.' },
    integrations: {
      title: 'Intégrations utiles',
      intro: 'Votre agenda, votre CRM, vos messageries et votre téléphonie restent les mêmes : l’agent s’y connecte.',
    },
    pricing: {
      title: 'Prix HT, sans engagement',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `Pour ${sectorName.toLowerCase()}, nous recommandons le forfait ${offerName}. Commencez par l’essai gratuit : ${days} jours et ${minutes} minutes incluses.`,
      link: (offerName: string) => `Voir le détail du forfait ${offerName}`,
    },
    faq: { title: (name: string) => `Questions fréquentes — ${name}` },
    callback: {
      title: 'Contactez-nous, laissez votre numéro, on vous rappelle',
      text: 'Un conseiller vous rappelle pour étudier votre cas.',
    },
    others: { title: 'Autres secteurs' },
    finalCta: 'Prêt à ne plus manquer un appel ?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `Fonctionnalités de l’agent vocal IA · ${brand}`,
      description: 'Réceptionniste virtuelle, prise de rendez-vous, qualification, WhatsApp, flow builder, SIP, reporting : votre agent vocal IA. Découvrez les modules.',
    },
    hero: {
      title: 'Tout ce qu’il faut pour automatiser vos appels',
      intro: 'Treize modules pour votre agent vocal IA, activés selon votre offre, depuis votre espace client.',
    },
    overview: { title: 'Vue d’ensemble' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${MODULE_SEO_TITLE[name] ?? `${name} — agent vocal IA`} · ${brand}`,
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
      offerLink: (offerName: string) => `Voir l’offre ${offerName}`,
      compare: 'Comparer les offres',
    },
    how: { title: 'Comment ça marche' },
    cases: { title: 'Cas d’usage' },
    integrations: { title: 'Intégrations liées', link: 'Toutes les intégrations' },
    more: { title: 'À découvrir aussi' },
  },

  integrations: {
    meta: {
      title: (brand: string) => `Intégrations agent vocal IA : agenda et CRM · ${brand}`,
      description: 'Connectez votre agent vocal IA à Google Agenda, Outlook, Calendly, HubSpot, Zoho, WhatsApp, SIP et plus de 300 outils sans code. Voyez la liste.',
    },
    hero: {
      title: 'Connecté aux outils que vous utilisez déjà',
      intro: 'Agenda, CRM, messageries, téléphonie : votre agent vocal IA s’intègre à votre organisation, et le flow builder relie plus de 300 outils sans code.',
    },
    flow: {
      title: { before: 'Construisez vos automatisations ', kw: 'sans code', after: '' },
      text: 'Un formulaire rempli, un appel terminé, un nouveau lead : chaque événement peut déclencher une suite d’actions dans vos outils, à la manière de Zapier ou Make, directement depuis votre espace.',
      points: ['Plus de 300 outils disponibles', 'Glisser-déposer, aucun développement', 'Tests avant activation'],
      link: 'Voir le flow builder',
    },
    api: {
      title: { before: 'Webhooks et API pour ', kw: 'vos systèmes', after: '' },
      text: 'Avec le forfait Centre d’appels, recevez chaque fin d’appel et ses données extraites dans vos propres systèmes, ou pilotez l’agent depuis votre logiciel.',
      points: ['Webhook après chaque appel', 'Variables extraites : résultat, intérêt, créneau', 'Outils MCP pour vos assistants'],
    },
  },
};
