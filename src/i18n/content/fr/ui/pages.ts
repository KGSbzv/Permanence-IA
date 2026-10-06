// Textes d'interface des pages non commerciales (démo, contact, FAQ, essai, aide, à propos, sécurité,
// 404, pages légales, blog). Les variables (marque, société, email, durée d’essai…) sont passées
// par fonctions : la marque vient du marché, la société et l’email de SITE.

/** Morceau de texte enrichi : texte simple, gras (<b> ou <strong>) ou lien (interne si href commence par « / »). */
export type Span = string | { b: string } | { strong: string } | { a: string; href: string };
/** Paragraphe ou élément de liste : texte simple ou suite de morceaux. */
export type Rich = string | Span[];
/** Bloc d’une section légale : paragraphe, liste à puces ou note discrète. */
export type Block = { p: Rich } | { ul: Rich[] } | { note: Rich };
export interface LegalSection { title: string; body: Block[] }
export interface LegalVars {
  brand: string;
  company: string;
  email: string;
  /** Hôte de l’espace client, ex. app.permanenceia.com. */
  appHost: string;
  /** Cadre juridique du pays visé (droit applicable, tribunal, autorité…), voir src/i18n/markets.ts. */
  legal: import('../../../markets').MarketLegal;
}
export interface ChatLine { me?: boolean; text: Rich }

const ADDRESS = '1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `Démo agent vocal IA : essayez-le en live · ${brand}`,
      description: 'Démo gratuite de notre agent vocal IA : parlez-lui ou recevez un appel adapté à votre secteur. Sans engagement, laissez votre numéro.',
    },
    h1: 'Essayez en live notre agent vocal IA',
    intro: 'Laissez votre numéro et choisissez votre secteur : l’agent vous appelle et joue un scénario de votre métier. Vous entendez sa voix, son rythme et la façon dont il qualifie une demande.',
    widgetHint: 'Vous préférez tout de suite ? Cliquez sur la bulle en bas à droite de l’écran : notre assistante vous répond à l’oral ou par écrit.',
    formTitle: 'Recevoir mon appel de démonstration',
    formIntro: 'Appel gratuit, au créneau de votre choix.',
    submit: 'Recevoir l’appel de démo',
    hearTitle: 'Ce que vous allez entendre',
    hearIntro: 'Un exemple d’appel dans un cabinet dentaire : la réceptionniste virtuelle identifie la demande, propose un créneau et prépare la fiche pour l’équipe.',
    steps: [
      { title: 'Vous laissez votre numéro', text: 'Avec votre secteur et votre créneau.' },
      { title: 'L’agent vous appelle', text: 'Il joue un scénario de votre métier.' },
      { title: 'Vous testez librement', text: 'Posez vos questions, changez d’avis, interrompez-le.' },
    ],
    liveCallTitle: 'Agent dentaire',
    scenariosTitle: 'Choisissez votre scénario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contact : un conseiller vous rappelle · ${brand}`,
      description: 'Une question sur le standard téléphonique IA ? Laissez votre numéro, on vous rappelle au créneau choisi : démo, devis sur mesure ou support.',
    },
    h1: 'Laissez votre numéro, on vous rappelle',
    intro: 'Nous ne publions pas de numéro : c’est nous qui vous rappelons, au créneau que vous choisissez. Vous pouvez aussi nous écrire.',
    commercialTitle: 'Rappel commercial',
    commercialText: 'Questions sur les offres, démonstration, devis sur mesure.',
    supportTitle: 'Rappel support',
    supportText: 'Clients : configuration, numéros, intégrations.',
    emailTitle: 'Email',
    legal: (brand: string, company: string) => `${brand} est une marque de ${company}, ${ADDRESS}, États-Unis.`,
    tabsLabel: 'Type de demande',
    tabCommercial: 'Commercial et démo',
    tabSupport: 'Support client',
  },

  faq: {
    meta: {
      title: (brand: string) => `FAQ standard téléphonique IA et agent vocal · ${brand}`,
      description: (brand: string) => `Fonctionnement, SIP, agenda, WhatsApp, RGPD, essai et tarifs : toutes les réponses sur le standard téléphonique IA ${brand}. Consultez la FAQ.`,
    },
    h1: 'Questions fréquentes sur le standard téléphonique IA',
    intro: 'Vous ne trouvez pas votre réponse ? Laissez votre numéro, un conseiller vous rappelle.',
    general: 'La plateforme',
    pricing: 'Tarifs et essai',
  },

  trial: {
    meta: {
      title: (days: number, minutes: number, brand: string) => `Essai gratuit agent vocal IA — ${days} jours · ${brand}`,
      description: (days: number, minutes: number, brand: string) => `Essai gratuit de l’agent vocal IA ${brand} : ${days} jours, ${minutes} minutes incluses, rien n’est débité pendant l’essai. Créez votre compte.`,
    },
    h1: (minutes: number) => `Réclamez vos ${minutes} minutes gratuites`,
    intro: (days: number) => `Créez votre compte, choisissez le forfait à tester et essayez votre agent vocal IA sur votre activité pendant ${days} jours.`,
    points: (days: number) => [
      `Carte demandée à l’activation, rien n’est débité pendant ${days} jours`,
      'Annulez depuis votre espace avant la fin de l’essai : vous ne payez rien',
      'Démo live et widget web inclus',
      'Accompagnement pour la première configuration',
    ],
    createTitle: 'Créer mon compte',
    createSteps: [
      '1. Créez votre compte avec votre email professionnel.',
      '2. Choisissez le forfait à tester dans votre espace.',
      '3. Configurez votre agent et passez vos premiers appels.',
    ],
    createCta: 'Créer mon compte gratuit',
    already: 'Déjà client ?',
    login: 'Connexion',
    sentTitle: 'Votre demande est enregistrée',
    sentText: 'Un conseiller vous rappelle pour configurer votre premier agent avec vous.',
    sentCta: 'Créer mon compte maintenant',
    formTitle: 'Préférez être accompagné ?',
    formIntro: 'Laissez vos coordonnées : un conseiller vous rappelle pour démarrer l’essai avec vous.',
    name: 'Nom et prénom',
    company: 'Entreprise',
    email: 'Email professionnel',
    phone: 'Téléphone',
    sector: 'Secteur',
    sectorPlaceholder: 'Choisir…',
    sectorOther: 'Autre activité',
    plan: 'Offre souhaitée',
    planPrice: (price: string) => ` — ${price} HT/mois`,
    planFree: ' — gratuit',
    planQuote: ' — sur devis',
    terms: [
      'J’accepte les ',
      { a: 'conditions générales', href: '/cgu' },
      ' et la ',
      { a: 'politique de confidentialité', href: '/confidentialite' },
      ', et d’être rappelé pour la mise en place de mon compte.',
    ] as Rich,
    termsRequired: 'Acceptez les conditions pour être rappelé.',
    sendError: 'L’inscription n’a pas pu être envoyée.',
    sending: 'Envoi…',
    submit: 'Être rappelé',
  },

  help: {
    meta: {
      title: (brand: string) => `Aide de l’espace client — ${brand}`,
      description: 'Guide en français de votre espace client : traduction des menus, création d’un agent, numéros, agenda, widget, minutes et facturation.',
    },
    breadcrumb: 'Aide',
    h1: 'Aide de votre espace client',
    intro: 'Votre espace client s’affiche en anglais. Ce guide traduit chaque menu et vous accompagne pas à pas. Dans l’espace, l’assistante d’aide (bulle en bas à droite) répond dans votre langue, par écrit ou à voix haute.',
    openSpace: 'Ouvrir mon espace',
    chatLabel: 'Exemple d’échange avec l’assistante d’aide',
    chatTitle: (brand: string) => `Aide ${brand}`,
    chatMode: 'En français · écrit ou voix',
    chat: [
      { me: true, text: 'Où est-ce que j’ajoute des minutes ?' },
      { text: ['En haut à droite, ouvrez le menu de votre profil puis cliquez sur ', { b: 'Add credits' }, ' (ajouter du crédit). Choisissez une recharge : le crédit ne périme pas.'] },
      { me: true, text: 'Et pour mettre l’agent sur mon site ?' },
      { text: ['Ouvrez votre agent dans ', { b: 'Assistants' }, ', section ', { b: 'Web widget' }, ' (widget web) : activez-le, puis copiez le code fourni. On le fait ensemble ?'] },
    ] as ChatLine[],
    tasksTitle: 'Les tâches courantes, pas à pas',
    menuTitle: 'Les menus de l’espace, traduits',
    colMenu: 'Menu (anglais)',
    colLabel: 'En français',
    colText: 'À quoi ça sert',
    glossaryTitle: 'Petit lexique',
    moreBefore: 'Une question qui n’est pas ici ? Écrivez à ',
    moreAfter: ' ou demandez un rappel depuis la page contact.',
  },

  about: {
    meta: {
      title: (brand: string) => `À propos — agents vocaux IA pour TPE et PME · ${brand}`,
      description: (brand: string, company: string) => `${brand} aide les TPE et PME à répondre à chaque appel grâce à des agents vocaux IA. Une marque de ${company}. Découvrez notre approche.`,
    },
    h1: 'Chaque appel mérite une réponse',
    intro: (brand: string) => `${brand} est née d’un constat simple : les petites entreprises perdent des clients parce que personne ne peut décrocher au bon moment.`,
    photoAlt: 'Une dirigeante consulte son téléphone dans son bureau',
    paragraphs: [
      'Artisans, cabinets, agences, garages, salons, restaurants : vos équipes sont occupées à servir vos clients. Pendant ce temps, le téléphone sonne.',
      'Nous mettons à votre disposition des agents vocaux IA qui répondent, qualifient, réservent et rappellent, configurés pour votre métier, avec des prix clairs et sans engagement.',
    ],
    principlesTitle: 'Nos principes',
    principles: [
      'L’agent se présente honnêtement comme une IA',
      'L’humain garde la main sur les cas importants',
      'Des prix HT affichés, sans frais cachés',
      'Pas de chiffre ni de promesse que nous ne pouvons pas prouver',
    ],
    legal: (brand: string, company: string) => `${brand} est une marque de ${company}, société enregistrée dans l’État du Wyoming (États-Unis) sous le numéro 2026-001905061.`,
  },

  security: {
    meta: {
      title: (brand: string) => `Sécurité et RGPD de l’agent vocal IA · ${brand}`,
      description: (brand: string) => `Consentement, opt-out, chiffrement en transit, rétention configurable : comment ${brand} protège les données de vos appels, dans le respect du RGPD.`,
    },
    h1: 'Sécurité et conformité de vos appels IA',
    intro: 'Vos appels contiennent des données personnelles. Voici les protections en place et les réglages dont vous disposez pour respecter le RGPD.',
    settingsTitle: 'Vos réglages',
    settings: [
      'Durée de conservation des enregistrements et transcriptions',
      'Suppression d’un appel ou d’un contact à la demande',
      'Liste d’exclusion pour les appels sortants',
      'Plages horaires d’appel autorisées',
      'Mention « assistant IA » en début d’appel',
      'Enregistrement activable ou non, avec information de l’appelant',
    ],
    commitmentsTitle: 'Nos engagements',
    commitments: [
      'L’agent se présente comme une IA et ne se fait pas passer pour un humain',
      'Vos campagnes n’appellent que des contacts qui l’ont accepté ; une liste d’exclusion intégrée écarte les autres',
      'Aucun diagnostic médical, juridique ou financier par l’agent',
      'Vos données ne sont jamais vendues : elles servent à fournir et à améliorer le service',
      'Accompagnement pour adapter vos mentions d’information',
    ],
    rights: ['Pour toute question ou demande d’exercice de droits : ', { a: 'politique de confidentialité', href: '/confidentialite' }, '.'] as Rich,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Page introuvable — ${brand}`,
      description: 'Cette page n’existe pas ou a été déplacée.',
    },
    h1: 'Cette page n’existe pas ou a été déplacée',
    text: 'Revenez à l’accueil ou consultez nos offres.',
    home: 'Retour à l’accueil',
    pricing: 'Voir les tarifs',
  },

  terms: {
    meta: {
      title: (brand: string) => `Conditions générales (CGU / CGV) — ${brand}`,
      description: (brand: string) => `Consultez les conditions générales d’utilisation et de vente applicables aux forfaits et services de standard téléphonique IA ${brand}.`,
    },
    h1: 'Conditions Générales d’Utilisation & de Vente (CGU/CGV)',
    updated: 'Applicables aux professionnels et entreprises • Dernière mise à jour : 29 septembre 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
      {
        title: 'Article 1 — Objet du service',
        body: [
          { p: ["Les présentes Conditions Générales régissent l'accès et l'utilisation de la plateforme logicielle et des services de téléphonie par agent conversationnel d'intelligence artificielle commercialisés sous la marque ", { strong: brand }, ` par la société ${company}.`] },
          { p: "Le service permet aux entreprises de déléguer l'accueil téléphonique entrant, la qualification des interlocuteurs et la prise de rendez-vous synchronisée 24 heures sur 24 et 7 jours sur 7." },
        ],
      },
      {
        title: 'Article 2 — Modalités de l’essai gratuit de 14 jours',
        body: [
          { p: "Chaque nouveau client bénéficie, lors de sa première souscription à un forfait, d'une période d'essai gratuit de quatorze (14) jours calendaires consécutifs, incluant 30 minutes d'appels :" },
          {
            ul: [
              [{ strong: 'Moyen de paiement :' }, " Une carte bancaire est demandée à l'activation de l'essai. Aucune somme n'est débitée pendant les 14 jours d'essai. Tous les prix sont exprimés hors taxes."],
              [{ strong: "Plafond d'usage :" }, " Les appels sont limités à 30 minutes pendant l'essai ; au-delà, ils sont suspendus jusqu'au démarrage de l'abonnement."],
              [{ strong: "Fin de l'essai :" }, " À l'issue des 14 jours, l'abonnement au forfait choisi démarre et la première mensualité est prélevée, sauf si le client l'a annulé avant cette date depuis son espace client, auquel cas aucune somme n'est débitée."],
              [{ strong: 'Usage loyal :' }, " L'essai gratuit est limité à un seul par entité juridique / numéro d'immatriculation."],
            ],
          },
        ],
      },
      {
        title: 'Article 3 — Essai gratuit, absence de rétractation et de remboursement',
        body: [
          { p: "Les contrats conclus entre professionnels ne bénéficient pas du droit de rétractation prévu pour les consommateurs. L'essai gratuit de 14 jours permet au client de tester le service avant tout paiement et de l'annuler sans frais avant son terme." },
          { p: [{ strong: 'Une fois une période payée, celle-ci n’est pas remboursable' }, ", même partiellement, le service et les minutes étant mis à disposition dès le début de la période. Le crédit acheté (recharges) n'est pas remboursable non plus ; il ne périme pas. La résiliation reste possible à tout moment pour les périodes suivantes (article 4)."] },
        ],
      },
      {
        title: 'Article 4 — Facturation, Tarifs & Résiliation',
        body: [
          { p: "Les prix sont exprimés en dollars US (USD), hors taxes. Les taxes applicables sont calculées automatiquement au paiement selon le pays du client et sa situation fiscale (avec ou sans numéro de TVA). Les règlements sont opérés mensuellement via notre prestataire de paiement sécurisé Stripe ; l'abonnement est reconduit tacitement chaque mois." },
          { p: ['Le client peut résilier son abonnement à tout moment et sans préavis depuis son tableau de bord ', { strong: appHost }, '. La résiliation prendra effet au terme de la période mensuelle déjà acquittée. Le client peut changer de forfait à tout moment et ajouter des minutes par une recharge de crédit ; le crédit acheté ne périme pas et sert à payer les minutes au-delà du forfait, au tarif de minute supplémentaire indiqué sur la page Tarifs.'] },
        ],
      },
      {
        title: 'Article 5 — Responsabilité et nature de l’obligation',
        body: [
          { p: [`${brand} est tenue à une `, { strong: 'obligation de moyens' }, " quant à la disponibilité et au traitement technique des flux d'appels. L'utilisateur reconnaît que les modèles d'intelligence artificielle générative et de synthèse vocale peuvent occasionnellement produire des réponses approximatives ou inexactes."] },
          { p: `En aucun cas la responsabilité de ${brand} ne saurait être engagée pour des pertes d'exploitation indirectes, manques à gagner ou préjudices commerciaux. Dans tous les cas, le plafond maximal d'indemnisation est expressément limité au montant hors taxes versé par le client au cours du mois précédant le fait générateur.` },
        ],
      },
      {
        title: 'Article 6 — Usages interdits & Suspension',
        body: [
          { p: `Sont strictement prohibés : les campagnes de démarchage téléphonique non sollicité (spam vocal abusif), les activités frauduleuses, les propos diffamatoires, discriminatoires ou illicites. En cas de constat d'usage abusif, ${brand} se réserve le droit de suspendre l'accès à la ligne dédiée sans indemnité.` },
        ],
      },
      {
        title: 'Article 7 — Droit applicable et juridiction compétente',
        body: [
          { p: `Les présentes CGU/CGV sont soumises au ${legal.governingLaw}. En cas de litige relatif à leur interprétation ou exécution, compétence expresse est attribuée au ${legal.court}.` },
          ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
        ],
      },
    ],
  },

  privacy: {
    meta: {
      title: (brand: string) => `Politique de confidentialité — ${brand}`,
      description: (brand: string) => `Comment ${brand} traite vos données : demandes de rappel, agents IA et enregistrements, compte client, facturation Stripe, prestataires et vos droits.`,
    },
    breadcrumb: 'Confidentialité',
    h1: 'Politique de confidentialité',
    intro: 'Ce que nous collectons, pourquoi, avec qui, combien de temps, et comment exercer vos droits.',
    updated: 'Mise à jour : octobre 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Qui est responsable de vos données',
          body: [
            { p: [`${brand} est une marque de ${company}, société à responsabilité limitée immatriculée dans le Wyoming (États-Unis), ${ADDRESS}. Contact : `, mail, '.'] },
            {
              ul: [
                [{ strong: 'Pour le site, les demandes de rappel, les échanges avec nos assistantes et la gestion des comptes clients' }, `, ${company} est responsable du traitement.`],
                [{ strong: 'Pour les appels et messages traités par les agents de nos clients' }, ', le client est responsable du traitement vis-à-vis de ses propres appelants, et nous agissons comme sous-traitant pour son compte. Le client décide des informations que son agent collecte et de leur usage.'],
              ],
            },
          ],
        },
        {
          title: 'Les données que nous traitons',
          body: [
            {
              ul: [
                [{ strong: 'Formulaires du site' }, ' (rappel, démo, accompagnement à l’essai) : nom, téléphone, email, entreprise, secteur, créneau souhaité et votre message.'],
                [{ strong: 'Échanges avec nos assistantes IA' }, ' (bulle du site, réceptionniste, rappels commerciaux et support, aide de l’espace client) : contenu écrit, enregistrement audio des conversations vocales, transcription, résumé et informations utiles extraites (besoin, forfait envisagé, problème signalé).'],
                [{ strong: 'Compte client' }, ' : identité, email, entreprise, réglages de vos agents, historique des appels et messages, consommation de minutes.'],
                [{ strong: 'Facturation' }, ' : forfait, factures et moyen de paiement. Les données de carte sont saisies et conservées par Stripe ; nous n’y avons jamais accès.'],
                [{ strong: 'Données techniques' }, ' : adresse IP et informations du navigateur nécessaires au fonctionnement et à la sécurité du site.'],
              ],
            },
          ],
        },
        {
          title: 'Pourquoi et sur quelle base',
          body: [
            {
              ul: [
                [{ strong: 'Vous rappeler et répondre à votre demande' }, ', y compris par un appel de notre agent vocal IA : sur la base de votre consentement, donné au moment de la demande. Vous pouvez le retirer à tout moment, et l’agent respecte toute demande de ne plus être appelé.'],
                [{ strong: 'Fournir le service, l’essai gratuit et le support' }, ' : exécution du contrat.'],
                [{ strong: 'Facturer et respecter nos obligations comptables et fiscales' }, ' : obligation légale.'],
                [{ strong: 'Améliorer nos assistantes et sécuriser la plateforme' }, ' : intérêt légitime, à partir de nos propres échanges uniquement.'],
              ],
            },
          ],
        },
        {
          title: 'Agents IA et enregistrements',
          body: [
            { p: 'Nos assistantes sont des intelligences artificielles et se présentent comme telles. Les conversations vocales sont enregistrées et transcrites pour assurer le suivi de votre demande et la qualité du service. Aucune décision produisant des effets juridiques à votre égard n’est prise de manière entièrement automatisée.' },
            { p: 'Nos clients qui utilisent la plateforme doivent informer leurs propres appelants de l’usage d’un agent IA et de l’enregistrement, selon les règles applicables à leur activité.' },
          ],
        },
        {
          title: 'Nos prestataires',
          body: [
            {
              ul: [
                [{ strong: 'Autocalls' }, ' : plateforme technique des agents vocaux, des widgets et de l’espace client (appels, transcription, synthèse vocale, automatisations).'],
                [{ strong: 'Twilio' }, ' : opérateur téléphonique qui achemine nos appels, notamment les rappels sortants (numéro américain, États-Unis).'],
                [{ strong: 'Fournisseurs d’IA, de voix et de téléphonie' }, ' utilisés par cette plateforme pour comprendre, répondre et acheminer les appels.'],
                [{ strong: 'Stripe' }, ' : abonnements, paiements, factures et calcul des taxes (certifié PCI-DSS niveau 1).'],
                [{ strong: 'Supabase' }, ' : base de données des demandes de rappel, inscriptions et comptes rendus d’échanges (États-Unis).'],
                [{ strong: 'Google Cloud (Firebase App Hosting)' }, ' : hébergement du site (États-Unis).'],
                [{ strong: 'Zoho Mail' }, ' : envoi des emails de service et de suivi.'],
              ],
            },
          ],
        },
        {
          title: 'Transferts hors de l’Union européenne',
          body: [
            { p: 'Plusieurs de ces prestataires, ainsi que notre société, sont situés aux États-Unis. Les transferts reposent sur le Cadre de protection des données UE-États-Unis lorsque le prestataire y adhère, ou sur les clauses contractuelles types de la Commission européenne.' },
          ],
        },
        {
          title: 'Combien de temps nous les gardons',
          body: [
            {
              ul: [
                'Demandes de rappel et échanges avec nos assistantes : 24 mois après le dernier contact.',
                'Enregistrements et transcriptions des appels traités pour nos clients : 12 mois par défaut ; chaque client peut réduire cette durée et supprimer ses données depuis son espace.',
                'Données du compte : pendant toute la relation, puis 3 ans pour la prospection éventuelle, sauf opposition.',
                'Factures et données comptables : durée légale (jusqu’à 10 ans).',
              ],
            },
          ],
        },
        {
          title: 'Sécurité',
          body: [
            { p: 'Les échanges sont chiffrés en transit, les accès aux données sont limités aux personnes qui en ont besoin et protégés par authentification, et les clés techniques sont conservées dans des coffres-forts de secrets. Les clients peuvent activer la double authentification sur leur espace.' },
          ],
        },
        {
          title: 'Vos droits',
          body: [
            { p: ['Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, leur portabilité, la limitation du traitement, vous opposer à la prospection et retirer votre consentement à être rappelé. Écrivez à ', mail, ' : nous répondons sous un mois.'] },
            { p: `Vous pouvez aussi adresser une réclamation à ${legal.dataAuthority}, ou à l’autorité de protection des données de votre pays de résidence.` },
          ],
        },
        {
          title: 'Cookies',
          body: [
            { p: ['Le site n’utilise pas de cookies publicitaires. Les détails figurent sur la page ', { a: 'cookies', href: '/cookies' }, '.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Mentions légales — ${brand}`,
      description: (brand: string) => `Mentions légales, informations sur l’éditeur, l’hébergement et les droits d’auteur de la plateforme ${brand}.`,
    },
    h1: 'Mentions Légales',
    updated: 'Dernière mise à jour : 29 septembre 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Éditeur du site',
        body: [
          { p: ["Le site internet accessible à l'adresse ", { strong: 'https://permanenceia.com' }, ' est édité par la société ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Nom commercial :' }, ` ${brand}`],
              [{ strong: 'Statut :' }, ' Limited Liability Company (LLC), État du Wyoming, États-Unis'],
              [{ strong: "Numéro d'enregistrement :" }, ' 2026-001905061'],
              [{ strong: 'Siège social :' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, États-Unis'],
              [{ strong: 'Email de contact :' }, ` ${email}`],
              [{ strong: 'Directeur de la publication :' }, ` le représentant légal de ${company}.`],
            ],
          },
        ],
      },
      {
        title: '2. Hébergement de la plateforme',
        body: [
          { p: "Le site vitrine commercial et l'application sont hébergés par :" },
          {
            ul: [
              [{ strong: 'Plateforme front-end :' }, " Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Région d'hébergement : us-east4 (Virginie du Nord, États-Unis)."],
              [{ strong: 'Bases de données & Stockage :' }, ' Supabase Inc., infrastructures situées aux États-Unis (région AWS us-east-1, Virginie).'],
            ],
          },
        ],
      },
      {
        title: '3. Propriété intellectuelle',
        body: [
          { p: ['La marque ', { strong: brand }, `, le logo (la bulle en veille, les ondes vocales et le point de disponibilité), ainsi que l'ensemble des chartes graphiques, textes, scripts conversationnels, infographies et codes sources figurant sur le site sont la propriété exclusive de ${company}.`] },
          { p: 'Toute reproduction, distribution, modification ou utilisation sans accord écrit préalable est formellement interdite et constitue une contrefaçon sanctionnée par le ' + legal.copyrightLaw + '.' },
        ],
      },
      {
        title: '4. Limitation de responsabilité',
        body: [
          { p: `${brand} s'efforce d'assurer au mieux de ses possibilités l'exactitude des informations diffusées sur le site. Toutefois, ${brand} ne saurait être tenue responsable des interruptions de service réseau, des pannes inhérentes aux opérateurs de télécommunication tiers ou des inexactitudes contextuelles ponctuelles formulées par les modèles de traitement automatique de la parole lors des conversations en direct.` },
          { p: "Le client professionnel demeure seul responsable des consignes et règles métier qu'il programme pour son standard téléphonique." },
        ],
      },
    ],
  },

  cookies: {
    meta: {
      title: (brand: string) => `Politique cookies — ${brand}`,
      description: (brand: string) => `Cookies et traceurs utilisés sur le site ${brand}.`,
    },
    h1: 'Politique cookies',
    paragraphs: (siteHost: string, appHost: string) => [
      `Le site ${siteHost} utilise uniquement les cookies strictement nécessaires à son fonctionnement (sécurité, équilibrage de charge). Aucun cookie publicitaire ni de mesure d’audience tiers n’est déposé à ce jour.`,
      'Si des outils de mesure d’audience ou de publicité sont ajoutés, un bandeau vous demandera votre consentement avant tout dépôt, et cette page sera mise à jour avec la liste des cookies, leur finalité et leur durée.',
      `L’espace client (${appHost}) utilise des cookies de session nécessaires à la connexion.`,
    ],
    questions: 'Questions : ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog accueil téléphonique et agents IA · ${brand}`,
      description: 'Guides et retours d’expérience sur l’accueil téléphonique, la prise de rendez-vous et les agents vocaux IA en entreprise. Lisez nos articles.',
    },
    eyebrow: 'Ressources & Insights',
    h1: 'Le Journal de la Réception IA',
    intro: "Stratégies de conversion téléphonique, analyses réglementaires et retours d'expérience concrets de professionnels.",
    searchPlaceholder: 'Rechercher un article...',
    all: 'Tous les articles',
    categories: {
      productivite: 'Productivité',
      conformite: 'Conformité',
      'cas-client': 'Cas Client',
      technique: 'Technique',
    },
    read: 'Lire',
    notFound: {
      title: (brand: string) => `Article non trouvé | ${brand}`,
      description: 'Cet article n’existe pas ou a été déplacé.',
      h1: 'Article introuvable',
      text: "L'article que vous cherchez n'existe pas ou a été déplacé.",
      back: 'Retour aux articles',
    },
    articleTitle: (title: string, brand: string) => `${title} | Blog ${brand}`,
    backToList: 'Retour à la liste des articles',
    readTime: (t: string) => `${t} de lecture`,
    publisher: (brand: string) => `${brand} Publications`,
    ctaEyebrow: "Passez à l'action",
    ctaTitle: "Prêt à équiper votre entreprise d'un standard IA ?",
    ctaText: (days: number, minutes: number) => `Testez dès aujourd'hui notre agent vocal en conditions réelles pendant ${days} jours, avec ${minutes} minutes incluses et sans engagement.`,
    ctaButton: 'Commencer gratuitement',
  },
};
