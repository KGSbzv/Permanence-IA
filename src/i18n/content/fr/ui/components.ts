// Textes d'interface des composants partagés (src/components). Les chiffres (prix, minutes, jours
// d’essai) et la marque sont passés en paramètres : ils viennent du marché (src/i18n/markets.ts).
export const UI_COMPONENTS = {
  layout: {
    home: 'Accueil',
    freeTrial: 'Essai gratuit',
    callMeBack: 'Être rappelé',
  },

  navbar: {
    menus: {
      features: 'Fonctionnalités',
      allFeatures: 'Toutes les fonctionnalités',
      allFeaturesText: 'Vue d’ensemble des modules et des forfaits.',
      sectors: 'Secteurs',
      allSectors: 'Tous les secteurs',
      resources: 'Ressources',
    },
    resources: {
      demo: 'Démo en direct',
      integrations: 'Intégrations',
      security: 'Sécurité et conformité',
      faq: 'Questions fréquentes',
      help: 'Aide de l’espace client',
      about: 'À propos',
      contact: 'Contact et rappel',
    },
    pricing: 'Tarifs',
    login: 'Connexion',
    startFree: 'Essai gratuit 14 jours',
    mainNav: 'Navigation principale',
    mobileNav: 'Navigation mobile',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },

  footer: {
    tagline: 'Agents vocaux IA qui répondent, qualifient, réservent et rappellent pour votre entreprise, 24 h/24.',
    startFree: 'Essai gratuit 14 jours',
    login: 'Connexion',
    gdpr: 'Outils RGPD intégrés',
    encryption: 'Chiffrement en transit',
    cols: {
      platform: 'Plateforme',
      allFeatures: 'Toutes les fonctionnalités',
      offers: 'Forfaits',
      recharges: 'Recharges de minutes',
      compare: 'Comparer les forfaits',
      sectors: 'Secteurs',
      resources: 'Ressources',
    },
    resources: {
      demo: 'Démo en direct',
      integrations: 'Intégrations',
      faq: 'Questions fréquentes',
      help: 'Aide de l’espace client',
      about: 'À propos',
      security: 'Sécurité et conformité',
      contact: 'Contact',
    },
    copyright: (year: number, brand: string, company: string) => `© ${year} ${brand} — marque de ${company}. Prix affichés HT.`,
    legal: {
      notice: 'Mentions légales',
      terms: 'CGU / CGV',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
      accessibility: 'Accessibilité',
    },
  },

  callbackModal: {
    titleSupport: 'Demander un rappel du support',
    titleCommercial: 'Laissez votre numéro, nous vous rappelons',
    intro: 'Choisissez votre créneau : c’est nous qui vous rappelons.',
    close: 'Fermer',
  },

  // Pop-up de relance (TrialNudge) : titre court et vendeur, minutes offertes juste dessous ; la ligne de texte
  // rappelle aussitôt les vraies conditions (essai gratuit, sans engagement, carte demandée, rien n’est débité).
  trialNudge: {
    title: 'Votre agent IA gratuit',
    subtitle: (minutes: string) => `${minutes} minutes offertes`,
    close: 'Fermer',
    text: (days: number) => `Essai gratuit de ${days} jours, sans engagement : carte demandée à l’activation, rien n’est débité pendant l’essai. Annulation sans frais avant la fin.`,
    points: [
      'Répond à vos clients 24 h/24, 7 j/7, dans plus de 80 langues',
      'Prend vos rendez-vous et qualifie vos prospects',
      'Vous envoie le résumé de chaque appel',
      'Prêt en quelques minutes, et vous gardez votre numéro',
    ],
    claim: 'Créer mon agent gratuitement',
    callMeBack: 'Être rappelé',
  },

  liveCall: {
    title: 'Agent d’accueil',
    leadTitle: 'Demande créée',
    ariaLabel: 'Exemple d’appel traité par l’agent',
    ended: 'Appel terminé · résumé envoyé',
    ongoing: 'Appel en cours',
  },

  trialBadges: {
    ariaLabel: 'Conditions de l’essai',
  },

  ctas: {
    primary: 'Démarrer l’essai de 14 jours',
    demo: 'Essayer notre agent en direct',
    callback: 'Être rappelé',
  },

  callbackForm: {
    submit: 'Être rappelé',
    consentRequired: 'Cochez la case pour accepter d’être rappelé.',
    sendFailed: 'La demande n’a pas pu être envoyée.',
    retry: (email: string) => `Réessayez ou écrivez à ${email}.`,
    sentTitle: 'Demande de rappel envoyée',
    sentText: 'Nous vous rappelons au créneau choisi. Si vous avez coché WhatsApp, la confirmation y arrive.',
    name: 'Nom',
    phone: 'Téléphone',
    sector: 'Secteur',
    choose: 'Choisir…',
    otherSector: 'Autre activité',
    when: 'Quand vous rappeler ?',
    slots: {
      asap: 'Dès que possible',
      todayAfternoon: 'Aujourd’hui après-midi',
      tomorrowMorning: 'Demain matin',
      tomorrowAfternoon: 'Demain après-midi',
      precise: 'À un jour et une heure précis',
    },
    preciseLabel: 'Date et heure (votre heure locale)',
    email: 'Email',
    emailHint: '(pour vous écrire si besoin)',
    need: 'Votre besoin',
    needPlaceholder: 'Ex. : je rate des appels le soir, je veux automatiser les rendez-vous…',
    consent: (brand: string) => `J’accepte d’être rappelé au numéro indiqué, y compris par un agent vocal IA de ${brand}. Mes données sont traitées selon la politique de confidentialité et ne sont jamais vendues.`,
    sending: 'Envoi…',
    company: 'Entreprise',
    optional: '(facultatif)',
    volume: 'Appels reçus par mois',
    volumeOptions: ['Moins de 200', '200 à 1 000', 'Plus de 1 000'],
    phoneInvalid: 'Indiquez un numéro de téléphone valide, par exemple 06 39 98 12 34.',
  },

  // Accords marketing (relances) : case NON cochée, séparée de l’accord de rappel ; mention d’information sous le
  // champ email. Toute modification de ces textes impose de changer MARKETING_TEXT_VERSION (src/lib/contacts.ts).
  // Textes à faire valider par un avocat.
  marketingConsent: {
    email: (brand: string, company: string) => `J’accepte de recevoir par e-mail des conseils et offres de ${brand} : quelques e-mails les premières semaines, puis un par mois au plus. Désinscription en un clic dans chaque e-mail.`,
    whatsapp: (brand: string) => `Recevoir aussi ces conseils et offres de ${brand} sur WhatsApp (facultatif ; répondez STOP à tout moment pour arrêter).`,
    notice: (brand: string, company: string, email: string) => [
      'Votre e-mail sert d’abord à traiter votre demande. En tant que professionnel, vous pourrez aussi recevoir de ', brand,
      ' quelques e-mails sur des services similaires, même sans cocher la case : vous pouvez vous y opposer dès maintenant ou à tout moment, gratuitement, en écrivant à ', email,
      ' ou par le lien de désinscription présent dans chaque e-mail. Responsable du traitement : ', company, '. Voir la ',
      { a: 'politique de confidentialité', href: '/confidentialite' }, '.',
    ],
    emailPlaceholder: 'Votre email (facultatif)',
  },

  benefits: {
    items: [
      { title: 'Répondez même hors horaires', text: 'Soirs, week-ends, pendant vos rendez-vous : chaque appel reçoit une réponse.' },
      { title: 'Qualifiez automatiquement', text: 'L’agent pose vos questions et vous transmet une demande complète.' },
      { title: 'Réservez des rendez-vous', text: 'Directement dans votre agenda ; confirmation et rappel par SMS ou WhatsApp dès le forfait Assistant.' },
      { title: 'Rappelez vos prospects plus vite', text: 'Un formulaire rempli devient un appel en quelques minutes.' },
      { title: 'Gardez l’humain pour l’important', text: 'Transfert vers votre équipe quand la situation l’exige.' },
    ],
    seeAgent: 'Voir l’agent en détail',
  },

  moduleCards: {
    seeIncluded: 'Voir ce que ça inclut',
  },

  includesSchema: {
    // Même ordre que les icônes du composant : téléphonie, automatisation, CRM, messages, agenda, pilotage, sécurité.
    families: [
      { name: 'Téléphonie', items: ['Appels entrants et sortants', 'Numéro dédié en option', 'Intégration SIP', 'Transfert vers un humain', 'Identification de l’appelant'] },
      { name: 'Automatisation', items: ['Consignes de l’agent', 'Scénarios automatisés sans code', 'Assistant d’automatisation', 'Plus de 300 outils connectables'] },
      { name: 'CRM et données', items: ['Tri et qualification des demandes', 'Base de connaissances', 'Historique des appels', 'Webhooks et API'] },
      { name: 'Messages', items: ['SMS', 'WhatsApp et modèles de messages', 'Messenger et Instagram', 'Widget web'] },
      { name: 'Agenda', items: ['Prise de rendez-vous', 'Confirmations et rappels', 'Reports et annulations'] },
      { name: 'Pilotage', items: ['Tableau de bord', 'Rapports détaillés', 'Rôles et permissions'] },
      { name: 'Sécurité', items: ['Consentement et droit d’opposition', 'Durée de conservation configurable', 'Chiffrement en transit', 'Journal des actions'] },
    ],
    centerTitle: 'Votre agent vocal IA',
    centerText: 'Au centre : un agent configuré pour votre activité. Autour : tout ce qu’il peut utiliser.',
    perOffer: 'Voir ce qui est inclus dans chaque forfait',
  },

  steps: {
    step: (n: number) => `Étape ${n}`,
  },

  // Parcours d’un appel en 4 étapes (src/components/CallFlow.tsx, même ordre que les icônes)
  callFlow: {
    title: 'Un appel, du premier « allô » au résumé',
    intro: 'Ce qui se passe quand un client appelle alors que vous êtes occupé.',
    steps: [
      { title: 'Le client appelle', text: 'L’agent décroche dès la première sonnerie, de jour comme de nuit, et précise qu’il est une IA.' },
      { title: 'L’agent comprend la demande', text: 'Il répond avec vos informations et pose les questions utiles : nom, besoin, urgence.' },
      { title: 'Le rendez-vous est pris', text: 'Il propose un créneau libre et l’inscrit dans votre agenda, via Cal.com ou Calendly.' },
      { title: 'Vous recevez le résumé', text: 'Le résumé de l’appel arrive par e-mail et dans votre tableau de bord, ou sur WhatsApp si vous l’avez configuré.' },
    ],
  },

  demoBlock: {
    title: 'Essayez notre agent en direct, dès maintenant',
    intro: 'Parlez à l’agent depuis votre navigateur, ou faites-le sonner sur votre propre téléphone : 30 secondes suffisent pour juger la voix et la façon dont il traite une demande de votre secteur.',
    launchTitle: 'Lancer la démo en direct',
    launchText: 'Une conversation réelle, sans installation.',
    callbackTitle: 'Être rappelé',
    callbackText: 'L’agent vous appelle au créneau choisi.',
    formTitle: 'Recevoir un appel de démonstration',
    formText: 'Gratuit, sans engagement. Vous entendez la voix et la façon dont l’agent qualifie une demande.',
    submit: 'Être rappelé',
  },

  sectorCards: {
    seePage: (sectorLower: string) => `Voir la page « ${sectorLower.charAt(0).toUpperCase()}${sectorLower.slice(1)} »`,
  },

  pricingCards: {
    daysFree: (days: number) => `${days} jours offerts`,
    negotiated: 'Prix à la minute négocié',
    mostChosen: 'Recommandé',
    perMinute: (label: string) => `soit ${label}`,
    details: 'Détail du forfait',
    billing: 'Période de facturation',
    monthly: 'Mensuel',
    annual: 'Annuel',
    twoMonthsFree: '2 mois offerts',
    billedYearly: (price: string) => `facturé ${price} HT par an`,
    save: (amount: string) => `soit ${amount} d’économie`,
    phoneNumber: (price: string) => `+ numéro dédié dès ${price} / mois`,
  },

  matrix: {
    included: 'Inclus',
    notIncluded: 'Non inclus',
    caption: 'Fonctions incluses dans chaque forfait',
    inYourInterface: 'Dans votre interface',
    pricePerMonthAnnual: 'Prix HT / mois (facturation annuelle)',
    pricePerMonth: 'Prix HT / mois',
    includedMinutes: 'Minutes incluses',
    extraMinute: 'Minute supplémentaire',
    phoneNumber: 'Numéro dédié (en option)',
    phoneNumberFrom: (price: string) => `dès ${price} / mois`,
    showAll: (n: number) => `Voir le comparatif complet (${n} lignes)`,
    showLess: 'Réduire le comparatif',
    legendIncluded: 'Inclus',
    legendNotIncluded: 'Non inclus',
    legendLimit: 'Chiffre = limite du forfait',
  },

  includedStack: {
    title: 'Tout est inclus, zéro clé API',
    intro: 'Les meilleurs modèles d’IA, voix et transcriptions sont déjà branchés dans votre espace. Pas de compte à ouvrir chez chaque fournisseur, pas de clé à copier, une seule facture.',
    groups: [
      { key: 'llm', title: 'Modèles de langage', text: 'Le cerveau de l’agent : il comprend la demande et décide quoi répondre.' },
      { key: 's2s', title: 'Voix en temps réel', text: 'Modèles qui écoutent et parlent directement, pour les conversations les plus naturelles.' },
      { key: 'tts', title: 'Synthèse vocale', text: 'Des centaines de voix naturelles, dans plus de 80 langues.' },
      { key: 'stt', title: 'Transcription', text: 'Reconnaissance de la parole rapide, même au téléphone.' },
      { key: 'channels', title: 'Canaux', text: 'Le même agent répond partout où vos clients vous écrivent ou vous appellent.' },
    ],
    noKeys: ['Aucune clé API à gérer', 'Changez de modèle ou de voix en un clic', 'Une seule facture, en dollars US hors taxes'],
    note: 'Marques citées à titre descriptif : elles appartiennent à leurs propriétaires et désignent les technologies disponibles dans l’espace client, sans partenariat avec ces sociétés. La liste évolue avec la plateforme.',
    channelNames: { phone: 'Téléphone', sip: 'SIP', widget: 'Widget web', email: 'Email' },
  },

  recharges: {
    title: 'Recharges de crédit',
    text: 'Le crédit paie les minutes au-delà de votre forfait. Il ne périme pas et s’ajoute immédiatement.',
    rechargeCol: 'Recharge HT',
    approxMinutes: (n: string) => `≈ ${n} min`,
    cheaperTitle: 'Le forfait reste plus économique',
    cheaperText: 'Une minute incluse coûte toujours moins cher qu’une minute supplémentaire.',
    included: 'Incluse :',
    extra: (price: string) => ` · supplémentaire : ${price} HT / min`,
  },

  growthBlock: {
    rules: [
      { title: 'Dépassement léger, une fois', text: 'Une recharge suffit pour finir le mois.' },
      { title: 'Dépassements répétés', text: 'Notre équipe vous conseille le forfait supérieur.' },
      { title: 'Recharges fréquentes', text: 'Une alerte de solde bas vous prévient ; comparez les forfaits dans Change plan.' },
    ],
    ruleCustom: (minutes: string) => `Au-delà de ${minutes} min par mois, de façon régulière`,
    ruleCustomText: 'Nous construisons une offre sur mesure.',
    case1Minutes: (minutes: string) => `${minutes} min ce mois-ci`,
    case1Plan: (plan: string) => `${plan} + une recharge de crédit`,
    case1Note: (price: string, extraMinutes: string, extraPrice: string, total: string) =>
      `${price} + ${extraMinutes} min × ${extraPrice} ≈ ${total} HT. Un dépassement ponctuel : la recharge suffit.`,
    case2Minutes: (minutes: string) => `${minutes} min chaque mois`,
    case2Plan: (plan: string) => `Passez au forfait ${plan}`,
    case2Note: (price: string, minutes: string, total: string, smallerPlan: string) =>
      `${price} HT pour ${minutes} min, contre ≈ ${total} HT avec ${smallerPlan} et des minutes supplémentaires. Moins cher, et de la marge.`,
    case3Minutes: (minutes: string) => `${minutes} min chaque mois`,
    case3Plan: 'Offre sur mesure',
    case3Note: (plan: string) => `Au-delà du forfait ${plan}, nous négocions un prix à la minute adapté à votre volume.`,
    title: 'Ajoutez des minutes ou changez de forfait, au bon moment',
    intro: 'Nous vous indiquons quand une recharge suffit et quand le forfait supérieur devient plus avantageux.',
    customerAt: 'Un client à',
  },

  planFor: {
    oneOffRecharge: ' + recharge ponctuelle',
    rechargeOrCustom: ' + recharge, ou sur mesure si régulier',
  },

  economy: {
    title: 'Calculez votre retour sur investissement',
    intro: 'Entrez votre volume d’appels : le calculateur choisit le forfait le moins cher pour ce volume, affiche le prix réel à la minute et le compare au coût d’un accueil humain.',
    calculator: 'Calculateur de retour sur investissement',
    yourCalls: 'Vos appels',
    yourCosts: 'Votre accueil aujourd’hui',
    callsPerMonth: 'Appels par mois',
    avgDuration: 'Durée moyenne d’un appel',
    hourlyCost: 'Coût horaire d’un employé (charges comprises)',
    missedRate: 'Appels manqués aujourd’hui',
    customerValue: 'Valeur moyenne d’un nouveau client',
    min: ' min',
    perHour: ' / h',
    minutesMonth: 'Minutes par mois',
    bestPlan: 'Forfait le moins cher pour ce volume',
    planCost: (plan: string) => `Coût ${plan}`,
    withExtra: (minutes: string, price: string) => `dont ${minutes} min supplémentaires à ${price}`,
    customAbove: (minutes: string) => `Au-delà de ${minutes} min par mois de façon régulière, demandez une offre sur mesure.`,
    effectivePerMinute: 'Prix réel par minute',
    humanCost: 'Coût d’un accueil humain',
    savings: 'Économie mensuelle',
    noSavings: 'À ce volume, l’agent coûte un peu plus qu’une personne, mais il répond 24 h/24 et prend plusieurs appels à la fois.',
    recovered: 'Chiffre d’affaires récupéré (estimation)',
    recoveredDetail: (calls: string) => `${calls} appels manqués rattrapés par mois`,
    netBenefit: 'Bénéfice mensuel estimé',
    roi: (x: string) => `Retour : ${x} fois le prix du forfait`,
    perMonth: ' / mois',
    missedYesterday: 'Combien d’appels avez-vous manqués hier ?',
    workingDaysNote: (days: number) => `Multiplié par ${days} jours ouvrés, ce nombre règle le curseur des appels manqués.`,
    perWeek: ' / semaine',
    perYear: ' / an',
    assumptions: (wrapUp: number, conversion: number) =>
      `Hypothèses : ${wrapUp} min de traitement après chaque appel pour un employé, ${conversion} % des appels manqués deviennent clients. Prix HT en dollars US ; numéro de téléphone en sus. Estimation indicative, à comparer avec vos chiffres.`,
    cta: 'Essayer gratuitement',
  },

  humanVsAi: {
    title: 'La comparaison honnête avec un poste d’accueil',
    intro: 'Une personne à l’accueil est précieuse. Elle a aussi un coût, des horaires, et ne prend qu’un appel à la fois. Voici la comparaison, ligne par ligne.',
    caption: 'Comparaison entre un poste d’accueil à temps plein et l’agent IA',
    human: 'Poste d’accueil à temps plein',
    ai: 'Agent IA',
    rows: [
      { label: 'Coût mensuel', human: 'Au moins le coût d’un salarié au SMIC, cotisations patronales comprises', ai: 'Dès {from} HT par mois (350 min), ou {payg} la minute sans abonnement' },
      { label: 'Heures couvertes', human: '35 h par semaine', ai: '24 h/24, 7 j/7 (168 h par semaine)' },
      { label: 'Appels en même temps', human: 'Un seul', ai: 'Plusieurs en parallèle' },
      { label: 'Langues', human: 'Une, parfois deux', ai: 'Plus de 80, avec des voix natives' },
      { label: 'Mise en route', human: 'Recrutement, puis plusieurs semaines de formation', ai: 'Quelques minutes ; consignes modifiables à tout moment' },
      { label: 'Congés et absences', human: 'À remplacer', ai: 'Aucun' },
      { label: 'Régularité', human: 'Variable selon la charge et l’heure', ai: 'Les mêmes règles à chaque appel' },
      { label: 'Notes après l’appel', human: 'Manuelles, quand on a le temps', ai: 'Résumé, transcription et données extraites automatiquement' },
    ],
    note: 'Un humain reste indispensable pour les cas sensibles : l’agent lui transmet un résumé et organise le rappel. Vous pouvez aussi garder votre accueil et confier à l’agent les débordements, la pause déjeuner, le soir et le week-end. Sans frais de mise en service, sans engagement.',
  },

  security: {
    items: [
      { title: 'Consentement et droit d’opposition', text: 'Consentement au rappel, gestion des refus, plages d’appel autorisées et liste d’exclusion.' },
      { title: 'Protection des données', text: 'Chiffrement en transit, accès protégé par compte et durée de conservation configurable.' },
      { title: 'Traçabilité', text: 'Historique des appels, transcriptions et journal des actions pour chaque compte.' },
      { title: 'Contrôle des accès', text: 'Chaque client dispose de son espace sécurisé ; l’agent n’accède qu’aux informations que vous lui donnez.' },
      { title: 'Préparation réglementaire', text: 'Outils pour appliquer le RGPD : information, droit d’accès, suppression des appels et enregistrements, rétention. Accord de traitement des données (DPA) intégré aux Conditions (article 8) ; version signée sur demande.' },
      { title: 'Infrastructure', text: 'Plateforme hébergée chez des fournisseurs cloud reconnus, avec sauvegardes et surveillance.' },
    ],
    title: 'Sécurité et conformité pour vos appels IA',
    intro: 'Vos appels contiennent des informations sur vos clients. La plateforme vous donne les réglages pour les protéger et respecter leurs choix.',
    approach: 'Notre approche sécurité',
    privacy: 'Politique de confidentialité',
  },

  voicesNumbers: {
    langs: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Néerlandais', 'Arabe', 'Polonais', 'Roumain', 'Turc', 'Suédois'],
    others: '+ 70 autres',
    voicesTitle: 'Des voix naturelles dans votre langue',
    voicesText: 'Plus de 80 langues et de nombreux accents. L’agent détecte la langue de l’appelant et lui répond dans la même langue.',
    numbersTitle: 'Votre numéro ou un numéro dédié',
    numbersText: 'Gardez votre numéro (renvoi d’appel, import Twilio ou Telnyx, connexion SIP à votre standard) ou prenez un numéro dédié en option, facturé au mois en plus du forfait.',
    telephonyOptions: 'Voir les options téléphonie',
  },

  finalCta: {
    title: 'Prêt à automatiser vos appels ?',
    primary: 'Démarrer l’essai de 14 jours',
    demo: 'Voir la démo en direct',
    advisorTitle: 'Parler à un conseiller',
    advisorText: 'Laissez votre numéro : nous vous rappelons pour répondre à vos questions.',
  },

  liveDemo: {
    title: 'Parlez à l’agent, maintenant',
    intro: 'Choisissez un rôle et une langue, puis essayez-le dans votre navigateur ou recevez son appel sur votre téléphone.',
    roleLabel: 'Rôle de l’agent',
    // Même ordre que les orbes du composant.
    roles: [
      { name: 'Réceptionniste', text: 'Répond aux appels, renseigne et prend les rendez-vous.' },
      { name: 'Commercial', text: 'Qualifie les demandes et repère les projets à rappeler.' },
      { name: 'Support', text: 'Répond aux questions de vos clients et transmet à un humain si besoin.' },
    ],
    langLabel: 'Langue',
    accents: { fr: 'Français de Paris', 'en-gb': 'Anglais britannique', 'en-au': 'Anglais australien', it: 'Italien', pl: 'Polonais', nl: 'Néerlandais', he: 'Hébreu israélien' },
    sector: 'Votre métier',
    modeLabel: 'Comment essayer',
    modeBrowser: 'Dans ce navigateur',
    modePhone: 'Sur mon téléphone',
    stageLabel: 'Votre agent de démo',
    voiceTag: (name: string) => `Voix de ${name}`,
    browserText: 'En cliquant, une fenêtre s’ouvre sur cette page : parlez à l’agent au micro ou écrivez-lui. Il connaît déjà le rôle et le métier choisis.',
    browserCta: (name: string) => `Parler à ${name}`,
    browserOpening: 'Ouverture…',
    browserLegal: 'Votre navigateur vous demandera l’accès au micro pour la conversation vocale.',
    browserError: 'L’assistante n’a pas pu s’ouvrir. Réessayez, ou choisissez « Sur mon téléphone ».',
    dialogTitle: (name: string) => `Conversation avec ${name}`,
    close: 'Fermer',
    firstName: 'Votre prénom',
    phone: 'Votre téléphone',
    consent: 'J’accepte d’être appelé par l’agent vocal IA de démonstration.',
    consentRequired: 'Cochez la case pour recevoir l’appel.',
    sendFailed: 'La demande n’a pas pu être envoyée.',
    sending: 'Envoi…',
    phoneCta: 'Faire sonner mon téléphone',
    phoneLegal: 'Appel gratuit, sans engagement. Votre numéro sert à cette démonstration ; nous ne vous recontactons ensuite que si vous l’acceptez ci-dessous.',
    sentTitle: 'C’est noté',
    sentText: (name: string) => `${name} vous appelle dans les minutes qui suivent, aux heures d’ouverture (du lundi au samedi, de 9 h à 12 h 30 et de 14 h à 19 h, heure de Paris). Gardez votre téléphone à portée de main.`,
    again: 'Faire un autre essai',
    portraitAlt: (name: string, accent: string, male = false) => `${name}, ${male ? 'agent vocal' : 'agente vocale'} IA (${accent})`,
    voiceLabel: 'Voix',
    voiceOption: (name: string, male: boolean) => `${name}, voix ${male ? 'masculine' : 'féminine'}`,
  },

  industryMarquee: ['Plombiers', 'Électriciens', 'Agences immobilières', 'Gestion locative', 'Garages', 'Carrosseries', 'Salons de coiffure', 'Barbiers', 'Instituts de beauté', 'Restaurants', 'Hôtels', 'Avocats', 'Experts-comptables', 'E-commerce', 'Courtiers', 'Syndics', 'Vétérinaires'],

  // Même ordre que les drapeaux du composant.
  languageMarquee: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Néerlandais', 'Français de Belgique', 'Français de Suisse', 'Français du Québec', 'Arabe', 'Polonais', 'Roumain', 'Turc', 'Suédois', 'Hébreu'],

  agentTeam: {
    // Même ordre que les icônes et liens du composant.
    agents: [
      { name: 'Réceptionniste IA', role: 'Répond à chaque appel, filtre et transfère ce qui compte.' },
      { name: 'Agent rendez-vous', role: 'Réserve, confirme, rappelle et gère les reports.' },
      { name: 'Agent qualification', role: 'Pose vos questions et prépare des fiches prêtes à traiter.' },
      { name: 'Agent support', role: 'Répond depuis vos documents, transmet les cas sensibles à votre équipe.' },
      { name: 'Agent relance', role: 'Confirme, relance les devis et réactive vos contacts.' },
      { name: 'Agent messages', role: 'Répond et confirme par SMS, WhatsApp et Instagram.' },
    ],
    title: 'Construisez votre équipe d’agents IA',
    intro: 'Chaque agent a un rôle précis. Activez ceux dont votre entreprise a besoin ; ils partagent le même historique et les mêmes informations.',
    custom: 'Besoin d’un scénario particulier ? Nous configurons un agent sur mesure.',
    virtualNote: 'Nos agents sont des agents IA virtuels : leurs visages sont des illustrations générées, pas des personnes réelles.',
  },

  sectorShowcase: {
    chooseSector: 'Choisir un secteur',
    agentFor: (sectorLower: string) => `Agent · ${sectorLower.charAt(0).toUpperCase()}${sectorLower.slice(1)}`,
    seeSolution: (sectorLower: string) => `Voir la solution « ${sectorLower.charAt(0).toUpperCase()}${sectorLower.slice(1)} »`,
  },

  scenarioExplorer: {
    chooseTrade: 'Choisir un métier',
    answering: (agentName: string) => `${agentName} décroche`,
    replay: 'Rejouer l’appel',
    benefitsTitle: 'Ce que ça change pour vous',
    planLabel: 'Forfait conseillé',
    tryLive: 'Essayer ce scénario en direct',
  },

  useCaseTabs: {
    ariaLabel: 'Types d’usage',
    // Même ordre que les icônes du composant.
    tabs: {
      entrants: {
        label: 'Appels entrants',
        items: [
          { title: 'Accueil 24/7', text: 'Chaque appel reçoit une réponse, même la nuit et le week-end.' },
          { title: 'Prise de rendez-vous', text: 'Réservation directe dans votre agenda, avec confirmation.' },
          { title: 'Support client', text: 'Réponses à partir de vos documents, sans file d’attente.' },
          { title: 'Qualification', text: 'Les bonnes questions posées avant de transmettre.' },
          { title: 'Transfert humain', text: 'Bascule vers votre équipe quand c’est important.' },
          { title: 'Urgences', text: 'Tri selon vos règles et alerte immédiate.' },
        ],
      },
      sortants: {
        label: 'Appels sortants',
        items: [
          { title: 'Rappel des demandes web', text: 'Un formulaire rempli devient un appel en quelques minutes.' },
          { title: 'Confirmations', text: 'Rendez-vous et réservations confirmés la veille.' },
          { title: 'Relance des devis', text: 'Les devis en attente relancés aux bons horaires.' },
          { title: 'Préqualification', text: 'Contacts filtrés avant l’appel de votre équipe.' },
          { title: 'Renouvellements', text: 'Clients recontactés pour renouveler ou compléter.' },
          { title: 'Enquêtes de satisfaction', text: 'Avis collectés après la prestation.' },
        ],
      },
      messages: {
        label: 'Messages',
        items: [
          { title: 'WhatsApp', text: 'Confirmations, rappels et réponses écrites.' },
          { title: 'SMS', text: 'Récapitulatif après chaque appel.' },
          { title: 'Instagram et Messenger', text: 'Messages directs centralisés.' },
          { title: 'Widget web', text: 'Parler à l’agent ou être rappelé depuis votre site.' },
          { title: 'Liste d’attente', text: 'Prévenir quand un créneau se libère.' },
          { title: 'Historique unique', text: 'Appels et messages au même endroit.' },
        ],
      },
    },
  },

  platformGrid: {
    simultaneousTitle: 'Appels simultanés',
    simultaneousText: 'Pas de file d’attente : l’agent traite plusieurs appels en même temps sur la même ligne.',
    knowledgeTitle: 'Base de connaissances',
    knowledgeText: 'PDF, pages de votre site, procédures : l’agent répond avec vos informations.',
    promptTitle: 'Rédaction des consignes',
    promptText: 'Décrivez l’objectif de l’appel : un assistant pas à pas règle le comportement de l’agent.',
    transferTitle: 'Transfert vers un humain',
    transferText: 'Quand le client le demande ou quand la situation l’exige, l’appel bascule vers votre équipe.',
    aiAgent: 'Agent IA',
    yourTeam: 'Votre équipe',
    reportsTitle: 'Rapports détaillés',
    reportsText: 'Enregistrements, transcriptions, résumés et graphiques pour chaque appel.',
    campaignsTitle: 'Rappels et confirmations',
    campaignsText: 'Importez vos contacts consentants ou déclenchez des appels depuis vos outils et formulaires.',
  },

  lifecycle: {
    title: 'Tout le parcours client, au même endroit',
    intro: 'De la première demande au client fidèle : une seule plateforme, un seul historique.',
    ariaLabel: 'Étapes du parcours',
    // Même ordre que les icônes et maquettes du composant.
    stages: [
      { key: 'Attirer', title: 'Captez chaque demande', items: ['Pages d’atterrissage par secteur', 'Widget web : parler ou être rappelé', 'Renvoi de votre ligne ou numéro dédié', 'Réponse 24/7 aux appels et messages'] },
      { key: 'Convertir', title: 'Transformez les demandes en clients', items: ['Qualification selon vos critères', 'Rappel des prospects en quelques minutes', 'Prise de rendez-vous dans votre agenda', 'Fiche CRM créée automatiquement'] },
      { key: 'Fidéliser', title: 'Gardez le lien avec vos clients', items: ['Confirmations et rappels', 'Support répondant depuis vos documents', 'Relances, renouvellements et enquêtes', 'WhatsApp, SMS, Instagram'] },
      { key: 'Mesurer', title: 'Pilotez avec des chiffres réels', items: ['Volumes, durées et résultats', 'Rendez-vous pris et transferts', 'Usage des minutes et alertes', 'Écoute des appels et transcriptions'] },
    ],
  },

  portalPreview: {
    // Même ordre que les couleurs d’étiquette du composant.
    calls: [
      { who: 'Nouveau client', what: 'Rendez-vous mardi 9 h 30', tag: 'Réservé' },
      { who: 'Fuite d’eau', what: 'Rappel prioritaire demandé', tag: 'Urgent' },
      { who: 'Acheteur T3', what: 'Visite samedi 11 h', tag: 'Qualifié' },
      { who: 'Question horaires', what: 'Réponse donnée', tag: 'Résolu' },
    ],
    title: 'Votre espace client, clair dès la première connexion',
    intro: 'Appels, rendez-vous, demandes, messages et minutes : tout est visible au même endroit, sur ordinateur comme sur mobile.',
    points: ['Résumé de chaque appel et prochaine action', 'Écoute des enregistrements et transcriptions', 'Suivi des minutes et alertes de consommation', 'Configuration de vos agents sans code'],
    roles: 'Un espace sécurisé par client, avec ses propres agents, numéros et données.',
    dashboard: 'Tableau de bord',
    sampleData: 'Données d’exemple · 30 derniers jours',
    stats: [['Appels', '412'], ['Rendez-vous', '96'], ['Demandes', '183'], ['Minutes', '62 %']],
    notification: 'Notification',
    notifBooking: 'Nouveau rendez-vous réservé par l’agent : mardi 9 h 30.',
    notifMinutes: 'Minutes : 62 % utilisées.',
  },

  beforeAfter: {
    without: 'Sans agent IA',
    with: (brand: string) => `Avec ${brand}`,
  },

  mock: {
    call: {
      agent: 'Agent d’accueil',
      meta: 'Appel entrant · 01:24',
      client: 'Bonjour, je voudrais prendre rendez-vous.',
      reply: 'Bien sûr. C’est pour une première visite ?',
    },
    calendar: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
      week: 'Semaine 42',
      added: 'Rendez-vous ajouté par l’agent',
      slot: 'Mardi · 9 h 30 – 10 h 00',
    },
    transcript: {
      label: 'Transcription',
      question: 'Puis-je avoir votre budget approximatif ?',
      answer: 'Autour de 300 000 euros.',
      summaryLabel: 'Résumé :',
      summary: ' achat, budget 300 k€, visite souhaitée samedi.',
    },
    knowledge: {
      title: 'Base de connaissances',
      rows: [
        { name: 'procedures-accueil.pdf', meta: 'PDF · 1,2 Mo' },
        { name: 'Pages de votre site', meta: '18 pages indexées' },
        { name: 'Tarifs et horaires', meta: 'Mis à jour aujourd’hui' },
      ],
    },
    prompt: {
      title: 'Objectif de l’appel',
      hint: 'Décrivez ce que l’agent doit accomplir.',
      text: 'Accueillir le client, identifier s’il est nouveau, proposer deux créneaux et confirmer par SMS.',
      tags: ['Ton : chaleureux', 'Vouvoiement', 'Pas de prix sans devis'],
    },
    flow: {
      title: 'Scénario : demande web',
      steps: [
        { title: 'Nouveau formulaire', source: 'Site web' },
        { title: 'Rappeler le prospect', source: 'Agent commercial' },
        { title: 'Créer la fiche', source: 'CRM' },
        { title: 'Envoyer la confirmation', source: 'WhatsApp' },
      ],
    },
    numbers: {
      title: 'Vos lignes',
      rows: [
        { country: 'Votre numéro', kind: 'Renvoi d’appel', agent: 'Agent d’accueil' },
        { country: 'Royaume-Uni', kind: 'Numéro dédié', agent: 'Agent rendez-vous' },
        { country: 'Votre standard', kind: 'Trunk SIP', agent: 'Renvoi hors horaires' },
      ],
    },
    report: {
      handled: 'Appels traités · exemple',
      demo: 'Démo',
      stats: [['Rendez-vous', '96'], ['Qualifiés', '183'], ['Transferts', '27']],
    },
    widget: {
      question: 'Une question ? Parlons-en.',
      talk: 'Parler à l’agent',
      callback: 'Être rappelé',
    },
    whatsapp: {
      title: 'WhatsApp · Confirmation',
      confirmation: 'Votre rendez-vous est confirmé pour mardi à 9 h 30. Répondez 2 pour le déplacer.',
      reply: 'Parfait, merci !',
    },
    campaign: {
      title: 'Campagnes',
      rows: [['Confirmations semaine 42', 'En cours', '68 %'], ['Relance devis septembre', 'Terminée', '41 %'], ['Clients inactifs', 'Planifiée', '—']],
      note: 'Chiffres d’exemple · appels uniquement vers des contacts consentants',
    },
    lead: {
      title: 'Demande qualifiée',
      interest: 'Intérêt fort',
      fields: [['Besoin', 'Devis rénovation'], ['Zone', 'Lyon 3e'], ['Budget', '8 – 12 k€'], ['Délai', 'Sous 1 mois']],
      next: 'Prochaine action : rappel demain 9 h',
    },
    support: {
      client: 'Ma commande n’est pas arrivée.',
      agent: 'Je vérifie. Pouvez-vous me donner le numéro de commande ?',
      found: 'Réponse trouvée dans « conditions-livraison.pdf »',
    },
  },
};
