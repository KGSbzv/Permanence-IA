// Textes d'interface des pages non commerciales (démo, contact, FAQ, essai, aide, à propos, sécurité,
// 404, pages légales, blog). Les variables (marque, société, email, durée d’essai…) sont passées
// par fonctions : la marque vient du marché, la société et l’email de SITE.
import { SITE } from '@/data/site';

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

const ADDRESS = '1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `Démo agent vocal IA : essayez-le en direct · ${brand}`,
      description: 'Démo gratuite de notre agent vocal IA : parlez-lui ou recevez un appel adapté à votre secteur. Sans engagement, laissez votre numéro.',
    },
    h1: 'Essayez notre agent vocal IA en direct',
    intro: 'Laissez votre numéro et choisissez votre secteur : l’agent vous appelle et joue un scénario de votre métier. Vous entendez sa voix, son rythme et la façon dont il qualifie une demande.',
    widgetHint: 'Vous voulez essayer tout de suite ? Cliquez sur la bulle en bas à droite de l’écran : notre assistante vous répond à l’oral ou par écrit.',
    formTitle: 'Recevoir mon appel de démonstration',
    formIntro: 'Appel gratuit, au créneau de votre choix.',
    submit: 'Recevoir l’appel de démo',
    hearTitle: 'Ce que vous allez entendre',
    hearIntro: 'Un exemple d’appel chez un plombier : l’agent identifie l’urgence, organise l’intervention et prépare la fiche pour l’équipe.',
    steps: [
      { title: 'Vous laissez votre numéro', text: 'Avec votre secteur et votre créneau.' },
      { title: 'L’agent vous appelle', text: 'Il joue un scénario de votre métier.' },
      { title: 'Vous testez librement', text: 'Posez vos questions, changez d’avis, interrompez-le.' },
    ],
    liveCallTitle: 'Accueil plomberie',
    scenariosTitle: 'Choisissez votre scénario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contact : un conseiller vous rappelle · ${brand}`,
      description: 'Une question sur le standard téléphonique IA ? Laissez votre numéro, nous vous rappelons au créneau choisi : démo, devis sur mesure ou support.',
    },
    h1: 'Laissez votre numéro, nous vous rappelons',
    intro: 'Choisissez votre créneau et nous vous rappelons, ou écrivez-nous sur WhatsApp (messages écrits uniquement) ou par email. Sur WhatsApp, notre agent IA répond 24 h/24.',
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
      description: (brand: string) => `Fonctionnement, SIP, agenda, WhatsApp, RGPD, essai et tarifs : toutes les réponses sur le standard téléphonique IA de ${brand}. Consultez la FAQ.`,
    },
    h1: 'Questions fréquentes sur le standard téléphonique IA',
    intro: 'Vous ne trouvez pas votre réponse ? Laissez votre numéro, un conseiller vous rappelle.',
    general: 'La plateforme',
    pricing: 'Tarifs et essai',
  },

  trial: {
    meta: {
      title: (days: number, minutes: number, brand: string) => `Essai gratuit agent vocal IA, ${days} jours · ${brand}`,
      description: (days: number, minutes: number, brand: string) => `Essai gratuit de l’agent vocal IA ${brand} : ${days} jours, ${minutes} minutes incluses, rien n’est débité pendant l’essai. Créez votre compte.`,
    },
    h1: (minutes: number) => `Profitez de vos ${minutes} minutes offertes`,
    intro: (days: number) => `Créez votre compte, choisissez le forfait à tester et essayez votre agent vocal IA sur votre activité pendant ${days} jours.`,
    points: (days: number) => [
      `Carte demandée à l’activation, rien n’est débité pendant ${days} jours`,
      'Annulez depuis votre espace avant la fin de l’essai : vous ne payez rien',
      'Démo en direct et widget web inclus',
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
    formTitle: 'Vous préférez être accompagné ?',
    formIntro: 'Laissez vos coordonnées : un conseiller vous rappelle pour démarrer l’essai avec vous.',
    name: 'Nom et prénom',
    company: 'Entreprise',
    email: 'Email professionnel',
    phone: 'Téléphone',
    sector: 'Secteur',
    sectorPlaceholder: 'Choisir…',
    sectorOther: 'Autre activité',
    plan: 'Forfait souhaité',
    planPrice: (price: string) => ` — ${price} HT/mois`,
    planFree: ' — gratuit',
    planQuote: ' — sur devis',
    terms: [
      'J’accepte les ',
      { a: 'conditions générales', href: '/cgu' },
      ' et d’être rappelé pour la mise en place de mon compte. Mes données sont traitées selon la ',
      { a: 'politique de confidentialité', href: '/confidentialite' },
      '.',
    ] as Rich,
    termsRequired: 'Acceptez les conditions pour être rappelé.',
    // Deux cases distinctes (RGPD art. 7(2)) : CGU et confidentialité d’un côté, accord de rappel de l’autre.
    termsOnly: [
      'J’accepte les ',
      { a: 'conditions générales', href: '/cgu' },
      '. Mes données sont traitées selon la ',
      { a: 'politique de confidentialité', href: '/confidentialite' },
      '.',
    ] as Rich,
    termsOnlyRequired: 'Acceptez les conditions générales pour continuer.',
    consentCall: 'J’accepte d’être rappelé(e) au numéro indiqué pour la mise en place de mon compte, par une assistante vocale IA ou par un conseiller. Je peux retirer cet accord à tout moment.',
    consentCallRequired: 'Cochez l’accord de rappel pour que nous puissions vous appeler.',
    sendError: 'Votre demande n’a pas pu être envoyée.',
    sending: 'Envoi…',
    submit: 'Être rappelé',
  },

  help: {
    meta: {
      title: (brand: string) => `Aide de l’espace client · ${brand}`,
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
      title: (brand: string) => `À propos : agents vocaux IA pour TPE et PME · ${brand}`,
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
      'Pas de chiffre ni de promesse que nous ne puissions prouver',
    ],
    legal: (brand: string, company: string) => `${brand} est une marque de ${company}, société enregistrée dans l’État du Wyoming (États-Unis) sous le numéro 2026-001905061.`,
  },

  security: {
    meta: {
      title: (brand: string) => `Sécurité et RGPD de l’agent vocal IA · ${brand}`,
      description: (brand: string) => `Consentement, droit d’opposition, chiffrement en transit, conservation configurable : comment ${brand} protège les données de vos appels (RGPD).`,
    },
    h1: 'Sécurité et conformité de vos appels IA',
    intro: 'Vos appels contiennent des données personnelles. Voici les protections en place et les réglages dont vous disposez pour respecter le RGPD.',
    settingsTitle: 'Vos réglages',
    settings: [
      'Durée de conservation des enregistrements et transcriptions',
      'Suppression d’un appel ou d’un contact à la demande',
      'Liste d’exclusion pour les appels sortants',
      'Plages horaires d’appel autorisées',
      'Annonce « assistant IA » en début d’appel (toujours active, formulation personnalisable)',
      'Enregistrement activable ou non, annoncé à l’appelant en début d’appel',
      'Mots ou sujets que l’agent ne doit jamais aborder (devis chiffrés, diagnostic, conseil)',
    ],
    infraTitle: 'Une solution construite sur une infrastructure certifiée',
    infraIntro: 'Notre solution (agents, rappels programmés, routage, site et espace client) fonctionne sur l’infrastructure d’un prestataire technique certifié. Ces certifications sont les siennes ; nous l’avons choisi pour vous garantir ce niveau d’exigence.',
    infraItems: ['Prestataire certifié ISO/IEC 27001:2022 (sécurité de l’information) et ISO 9001:2015 (qualité)', 'Chiffrement AES-256 des données au repos et TLS en transit', 'Contrôle des accès par rôle, double authentification et journaux d’audit', 'Sauvegardes automatiques et reprise d’activité sur plusieurs zones', 'Outils de conformité RGPD, durées de conservation configurables et suppression automatique', 'Paiements traités par Stripe, certifié PCI-DSS niveau 1'],
    // Badges neutres (icône + libellé, sans logo ISO ni d’organisme certificateur) ; l’id choisit l’icône.
    badges: [{ id: 'iso27001', label: 'ISO/IEC 27001:2022 (prestataire)' }, { id: 'iso9001', label: 'ISO 9001:2015 (prestataire)' }, { id: 'encryption', label: 'TLS + AES-256' }, { id: 'gdpr', label: 'Outils RGPD' }, { id: 'pci', label: 'Stripe PCI-DSS niveau 1' }] as { id: 'iso27001' | 'iso9001' | 'encryption' | 'gdpr' | 'pci'; label: string }[],
    badgesNote: 'Les certifications ISO sont celles de notre prestataire technique ; la certification PCI-DSS est celle de Stripe.',
    commitmentsTitle: 'Nos engagements',
    commitments: [
      'L’agent se présente comme une IA et ne se fait pas passer pour un humain',
      'Vos campagnes ne doivent appeler que des contacts qui y ont consenti ; une liste d’exclusion intégrée écarte ceux qui s’y opposent',
      'Aucun diagnostic médical, juridique ou financier par l’agent',
      'Vos données ne sont jamais vendues : elles servent à fournir le service ; seules des données agrégées ou anonymisées servent à l’améliorer',
      'Accompagnement pour adapter vos mentions d’information',
      'Accord de traitement des données (DPA) intégré aux Conditions (article 8) ; version signée sur demande',
      'Droit à l’effacement : un appel, son enregistrement et sa transcription sont supprimés sur demande',
      'L’agent annonce l’enregistrement de l’appel ; une personne qui refuse peut demander à être recontactée par écrit',
      'Rappels et confirmations (appels sortants) : vous gardez la preuve de la base légale (relation client ou consentement) ; en France, le démarchage téléphonique des consommateurs exige leur consentement préalable depuis le 11 août 2026',
    ],
    rights: ['Pour toute question ou demande d’exercice de droits : ', { a: 'politique de confidentialité', href: '/confidentialite' }, '.'] as Rich,
  },

  accessibility: {
    meta: {
      title: (brand: string) => `Déclaration d’accessibilité · ${brand}`,
      description: (brand: string) => `Niveau d’accessibilité du site ${brand}, aménagements réalisés, limites connues et contact pour signaler une difficulté.`,
    },
    h1: 'Déclaration d’accessibilité',
    updated: 'Dernière mise à jour : 7 octobre 2026',
    intro: (brand: string, company: string) => `${brand} est un service de ${company}, société enregistrée dans l’État du Wyoming (États-Unis). Nous voulons que chacun puisse utiliser ce site, y compris les personnes en situation de handicap.`,
    sections: [
      { title: 'Niveau visé', items: ['Le site vise la conformité au niveau AA des règles WCAG 2.1 (et, pour Israël, à la norme IS 5568).', 'Statut : partiellement conforme. Les points non conformes connus sont listés plus bas et sont en cours de correction.'] },
      { title: 'Aménagements réalisés', items: ['Langue et sens de lecture déclarés sur chaque page (dont l’hébreu, de droite à gauche).', 'Navigation complète au clavier, lien d’accès direct au contenu, focus visible.', 'Titres hiérarchisés, textes alternatifs sur les images informatives, formulaires étiquetés.', 'Contrastes améliorés (quelques textes secondaires sont en cours de correction), texte agrandissable jusqu’à 200 % sans perte d’information, mise en page adaptée au mobile.', 'Animations réduites quand le système le demande (préférence « réduire les animations »).'] },
      { title: 'Limites connues', items: ['La fenêtre de discussion et de démonstration vocale est fournie par notre prestataire technique : son accessibilité au clavier et aux lecteurs d’écran peut être incomplète. Le formulaire de rappel et l’adresse email restent toujours disponibles.', 'L’espace client (app.permanenceia.com) est en anglais et relève de la plateforme de notre prestataire.', 'Certains documents PDF (présentation commerciale) ne sont pas entièrement balisés.'] },
      { title: 'Évaluation', items: ['Évaluation interne réalisée le 7 octobre 2026 sur l’ensemble des pages publiques, avec des outils automatiques et une vérification manuelle (clavier, contrastes, lecteur d’écran).'] },
      { title: 'Voies de recours', items: ['Si vous nous avez signalé une difficulté d’accès et que vous n’avez pas obtenu de réponse satisfaisante, vous pouvez saisir le Défenseur des droits :', 'par le formulaire en ligne sur le site du Défenseur des droits (defenseurdesdroits.fr) ;', 'auprès de l’un de ses délégués, présents dans chaque département ;', 'par courrier gratuit, sans affranchissement : Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07.'] },
    ],
    contactTitle: 'Signaler une difficulté',
    contact: (company: string, email: string) => `Responsable accessibilité : ${company}. Écrivez-nous à ${email} en décrivant la page et la difficulté rencontrée : nous vous répondons sous 5 jours ouvrés et vous proposons une solution adaptée (information dans un autre format, aide par email ou par téléphone).`,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Page introuvable · ${brand}`,
      description: 'Cette page n’existe pas ou a été déplacée.',
    },
    h1: 'Cette page n’existe pas ou a été déplacée',
    text: 'Revenez à l’accueil ou consultez nos offres.',
    home: 'Retour à l’accueil',
    pricing: 'Voir les tarifs',
  },

  terms: {
    meta: {
      title: (brand: string) => `Conditions générales (CGU/CGV) · ${brand}`,
      description: (brand: string) => `Consultez les conditions générales d’utilisation et de vente applicables aux forfaits et services de standard téléphonique IA ${brand}.`,
    },
    h1: 'Conditions générales d’utilisation et de vente (CGU/CGV)',
    updated: 'Applicables aux professionnels et entreprises • Dernière mise à jour : 7 octobre 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Article 1 — Définitions et acceptation',
          body: [
            { p: ['Les présentes conditions générales d’utilisation et de vente (les « Conditions ») régissent l’accès et l’utilisation des services commercialisés sous la marque ', { strong: brand }, ` par ${company}, Limited Liability Company de l’État du Wyoming (États-Unis), ${ADDRESS} (« nous »).`] },
            {
              ul: [
                [{ strong: 'Service :' }, ` la plateforme logicielle, l’espace client ${appHost}, les agents vocaux et conversationnels d’intelligence artificielle, le widget web, la messagerie (WhatsApp, SMS, Messenger, Instagram), les campagnes, les automatisations, les numéros de téléphone, la connexion SIP et toute fonctionnalité associée.`],
                [{ strong: 'Client :' }, ' l’entreprise ou le professionnel qui crée un compte ou souscrit un forfait.'],
                [{ strong: 'Utilisateur :' }, ' toute personne que le Client autorise à accéder à son compte.'],
                [{ strong: 'Contenu Client :' }, ' les données, instructions (prompts), bases de connaissances, fichiers, échantillons de voix, listes de contacts, enregistrements et messages fournis au Service ou générés pour le compte du Client.'],
                [{ strong: 'Destinataires :' }, ' les personnes qui appellent l’agent du Client, sont appelées ou reçoivent des messages par son intermédiaire.'],
                [{ strong: 'Crédits :' }, ' les minutes, crédits de messages et recharges prépayés.'],
              ],
            },
            { p: 'Le Service est réservé aux professionnels agissant à des fins professionnelles ; il n’est pas proposé aux consommateurs. En créant un compte, en cochant la case d’acceptation ou en utilisant le Service, le Client accepte les Conditions. La personne qui les accepte déclare avoir au moins 18 ans et être habilitée à engager l’entité qu’elle représente.' },
          ],
        },
        {
          title: 'Article 2 — Compte et sécurité',
          body: [
            {
              ul: [
                'Le Client fournit des informations exactes et complètes (dénomination, identifiants légaux, coordonnées) et les tient à jour.',
                'Il garde confidentiels ses identifiants et clés d’API, active les protections disponibles (dont la double authentification) et répond de toute activité réalisée depuis son compte, y compris par ses Utilisateurs, comme de la sienne propre.',
                ['Il nous signale sans délai, à ', mail, ', tout accès non autorisé ou incident de sécurité suspecté.'],
                'Nous pouvons demander des justificatifs d’identité, d’adresse ou d’activité (notamment pour l’attribution de numéros) et refuser, restreindre ou suspendre un compte qui ne les fournit pas.',
              ],
            },
          ],
        },
        {
          title: 'Article 3 — Essai gratuit, absence de rétractation et de remboursement',
          body: [
            { p: 'Lors de sa première souscription à un forfait payant, le Client bénéficie d’un essai gratuit de quatorze (14) jours calendaires consécutifs, incluant 30 minutes d’appels, limité à un seul essai par entité juridique, numéro d’immatriculation ou moyen de paiement :' },
            {
              ul: [
                [{ strong: 'Moyen de paiement :' }, ' une carte bancaire est demandée à l’activation de l’essai. Aucune somme n’est débitée pendant les 14 jours d’essai.'],
                [{ strong: 'Plafond d’usage :' }, ' les appels sont limités à 30 minutes pendant l’essai ; au-delà, ils sont suspendus jusqu’au démarrage de l’abonnement. Certaines fonctions (numéros, campagnes sortantes, messagerie) peuvent être restreintes pendant l’essai.'],
                [{ strong: 'Fin de l’essai :' }, ' à l’issue des 14 jours, l’abonnement au forfait choisi démarre et la première période (mensuelle ou annuelle) est prélevée, sauf annulation depuis l’espace client avant cette date, auquel cas aucune somme n’est débitée. Un email de rappel est envoyé au Client 7 jours avant la fin de l’essai.'],
              ],
            },
            { p: 'Les contrats conclus entre professionnels n’ouvrent pas de droit de rétractation. L’essai gratuit permet de tester le Service avant tout paiement et de l’annuler sans frais avant son terme.' },
            { p: [{ strong: 'Toute période payée est définitivement acquise et n’est pas remboursable' }, ', même partiellement, y compris en cas de résiliation, de non-utilisation, de passage à un forfait inférieur, de suspension ou de clôture du compte, et pour la partie non écoulée d’une période annuelle. Les Crédits ne sont ni remboursables, ni cessibles, ni convertibles en espèces ; le crédit acheté ne périme pas tant que le compte reste ouvert et il est perdu à sa clôture.'] },
          ],
        },
        {
          title: 'Article 4 — Prix, facturation, renouvellement et taxes',
          body: [
            {
              ul: [
                'Les prix sont exprimés en dollars US (USD), hors taxes. Les taxes applicables sont calculées au paiement selon le pays du Client et sa situation fiscale (avec ou sans numéro de TVA) et sont à sa charge. Si une retenue à la source s’impose au Client, il majore son paiement afin que nous recevions le montant facturé.',
                'Les forfaits sont payables d’avance, mensuellement ou annuellement au choix du Client (deux mois offerts en facturation annuelle), via notre prestataire de paiement Stripe. L’abonnement est reconduit tacitement pour une période de même durée, et le Client autorise les prélèvements correspondants. En facturation annuelle, les minutes incluses sont attribuées chaque mois et le Service est identique.',
                'Les usages au-delà du forfait (minutes supplémentaires, messages, numéros de téléphone, frais facturés par les opérateurs ou par Meta) sont débités sur le crédit ou facturés aux tarifs en vigueur indiqués sur la page Tarifs ou dans l’espace client.',
                [{ strong: 'Crédits de messages :' }, ' ils couvrent les échanges écrits du Service : réponses écrites de l’IA (chat du site, WhatsApp, Messenger, Instagram), messages WhatsApp et SMS. Chaque usage est décompté du solde de crédits du Client : 3 crédits par réponse écrite de l’IA ; 1,4 crédit par message WhatsApp reçu ou envoyé en session ; 2 crédits par SMS envoyé, ce montant pouvant varier selon l’opérateur ou le pays ; pour un message modèle WhatsApp (template), le tarif de Meta selon le pays et la catégorie, majoré. Les appels WhatsApp sont facturés en minutes. Les crédits sont inclus chaque mois selon le forfait ou obtenus en convertissant des minutes depuis l’espace client (1 minute = 9 crédits). Le solde est consultable dans l’espace client ; lorsqu’il atteint 0, les réponses écrites et les envois de SMS ou WhatsApp sont interrompus jusqu’à la recharge.'],
                ['Le Client peut résilier à tout moment, sans préavis, depuis son espace client ', { strong: appHost }, ', rubrique Billing info (facturation), avec le bouton « Cancel subscription ». Pendant l’essai, une résiliation avant la fin des 14 jours n’entraîne aucun débit. Après l’essai, la résiliation prend effet au terme de la période déjà payée (le mois ou, en facturation annuelle, l’année en cours), sans remboursement (article 3). Le Client peut changer de forfait ou recharger son crédit à tout moment ; les modalités du changement sont indiquées dans l’espace client.'],
                'Nous pouvons modifier nos prix moyennant un préavis de 30 jours par email ou dans l’espace client ; le nouveau prix s’applique à compter du renouvellement suivant. Le Client qui le refuse résilie avant cette date. Les frais de tiers répercutés (opérateurs, Meta) peuvent évoluer dans les délais imposés par ces tiers.',
                'En cas d’échec ou de retard de paiement, nous pouvons suspendre tout ou partie du Service jusqu’à régularisation, sans prolongation de la période. Les sommes impayées portent intérêt au taux de 1,5 % par mois ou, s’il est inférieur, au taux maximal autorisé, auxquels s’ajoutent l’indemnité forfaitaire légale pour frais de recouvrement lorsqu’elle s’applique et les frais de recouvrement réellement exposés.',
                'Toute contestation de paiement (rétrofacturation ou « chargeback ») sans réclamation préalable auprès de nous entraîne la suspension immédiate du compte ; toutes les sommes dues deviennent exigibles, augmentées des frais de contestation et de recouvrement.',
                'Les réclamations relatives à une facture doivent nous parvenir dans les 30 jours de son émission ; à défaut, la facture est réputée acceptée.',
              ],
            },
          ],
        },
        {
          title: 'Article 5 — Usage acceptable et contenus interdits',
          body: [
            { p: 'Le Client utilise le Service dans le respect des lois applicables et des Conditions. Sont notamment interdits :' },
            {
              ul: [
                'toute activité illicite, frauduleuse, trompeuse ou abusive, dont l’hameçonnage (phishing, vishing), l’escroquerie et l’usurpation de l’identité d’une personne, d’une entreprise ou d’une autorité ;',
                'le harcèlement, les menaces et les contenus haineux, discriminatoires, diffamatoires, violents ou portant atteinte aux droits de tiers ;',
                'les appels et messages non sollicités ou envoyés en masse sans consentement, ainsi que tout contournement d’une demande d’opposition ;',
                'les usages à haut risque : remplacer ou appeler les services d’urgence ; fonder des décisions médicales, juridiques, financières, d’assurance, de crédit, d’emploi ou de logement sur l’agent sans contrôle humain qualifié ; le recouvrement de créances hors du cadre légal applicable ; les appels ou messages automatisés à caractère politique ou électoral ; les contenus pour adultes ou sexuels et tout contenu impliquant des mineurs ; les jeux d’argent, armes, stupéfiants ou produits réglementés sans autorisation ;',
                'la collecte par l’agent de données sensibles, de numéros de carte de paiement complets ou d’identifiants officiels sans base légale ni mesures adaptées ;',
                'l’usage d’échantillons de voix (clonage de voix) sans le consentement préalable, documenté et révocable de la personne dont la voix est reproduite ;',
                'toute atteinte à la sécurité ou à l’intégrité du Service : code malveillant, tests d’intrusion ou de charge non autorisés, contournement des limites, accès aux comptes de tiers ;',
                'l’ingénierie inverse, la décompilation ou le désassemblage (sauf dans la mesure où la loi l’autorise expressément), l’extraction automatisée (scraping), la copie du Service, son usage pour créer un service concurrent ou entraîner des modèles ;',
                'la revente, la sous-licence, la location, la mise à disposition de tiers ou la commercialisation en marque blanche du Service sans notre accord écrit préalable.',
              ],
            },
            { p: 'Sans obligation de surveillance, nous pouvons examiner l’usage du Service, retirer un contenu, bloquer un numéro, une campagne ou un message, suspendre le compte (article 13) et coopérer avec les opérateurs, les plateformes et les autorités.' },
          ],
        },
        {
          title: 'Article 6 — Conformité des appels et des messages',
          body: [
            { p: [{ strong: 'Le Client est seul responsable de la conformité de ses appels, campagnes et messages' }, ' au droit de chaque pays où se trouvent les Destinataires, notamment le RGPD, les règles sur la prospection et les communications électroniques (ePrivacy), et, s’il contacte des personnes aux États-Unis, le Telephone Consumer Protection Act (TCPA) et la Telemarketing Sales Rule (TSR). En particulier :'] },
            {
              ul: [
                [{ strong: 'Consentement :' }, ' il obtient, avant tout appel ou message automatisé, sortant ou commercial (voix, SMS, WhatsApp), les consentements exigés par la loi, en conserve la preuve et respecte immédiatement toute opposition (mot STOP, demande orale ou écrite).'],
                [{ strong: 'Listes d’opposition :' }, ' il respecte les règles et registres applicables : en France, consentement préalable des consommateurs au démarchage téléphonique depuis le 11 août 2026 (article L223-1 du Code de la consommation), TPS et CTPS (Royaume-Uni), Do Not Call Register (Australie), Registro pubblico delle opposizioni (Italie), règles polonaises exigeant le consentement préalable au démarchage téléphonique, règles néerlandaises (consentement préalable ou relation client existante, Bel-me-niet Register).'],
                [{ strong: 'Horaires et fréquence :' }, ' il respecte les jours, heures et fréquences d’appel autorisés.'],
                [{ strong: 'Identification :' }, ' il présente un numéro valide qui lui est attribué, n’usurpe aucun numéro et s’identifie clairement.'],
                [{ strong: 'Transparence :' }, ' il informe clairement les Destinataires, dès le début de l’échange, qu’ils interagissent avec un système d’intelligence artificielle (conformément notamment au règlement européen sur l’IA) et, lorsque la loi l’exige, que l’appel est enregistré ou transcrit, et recueille leur accord lorsqu’il est requis.'],
                [{ strong: 'Plateformes :' }, ' il respecte les politiques de Meta (WhatsApp Business, Messenger, Instagram), dont l’approbation des modèles et les fenêtres de conversation, ainsi que les règles des opérateurs (enregistrement des expéditeurs, identifiants alphanumériques). Ces tiers peuvent restreindre un compte ou un numéro sans que notre responsabilité soit engagée.'],
              ],
            },
            { p: 'Les numéros de téléphone sont mis à disposition par des opérateurs (tels que Twilio) : le Client n’en devient pas propriétaire. Leur attribution peut exiger des documents d’identité, d’adresse ou d’activité ; l’opérateur ou le régulateur peut les modifier ou les reprendre. Un numéro peut être libéré, et définitivement perdu, en cas de résiliation, de suspension prolongée ou d’impayé. La portabilité sortante dépend de sa faisabilité technique et réglementaire.' },
            { p: [{ strong: 'Pas d’appels d’urgence.' }, ' Le Service ne permet pas de joindre les services d’urgence (112, 15, 17, 18, 999, 000, 911…) et ne remplace pas une ligne téléphonique. Le Client en informe ses Utilisateurs.'] },
          ],
        },
        {
          title: 'Article 7 — Fonctionnalités d’intelligence artificielle',
          body: [
            {
              ul: [
                'Les réponses, transcriptions, résumés et voix sont générés automatiquement et peuvent être inexacts, incomplets ou inappropriés. Le Client les vérifie avant de s’y fier.',
                'Le Client configure les instructions, bases de connaissances, voix, outils et automatisations de ses agents : il répond de tout ce que son agent dit, promet ou fait en son nom (rendez-vous, prix, engagements).',
                'Le Service ne fournit aucun conseil médical, juridique, financier, fiscal ou professionnel, et le Client ne doit pas présenter son agent comme tel.',
                'Les modèles, voix, langues et fournisseurs d’IA peuvent évoluer, être remplacés ou retirés ; la disponibilité d’un modèle ou d’une voix donnés n’est pas garantie.',
                'Entre les parties, les contenus générés pour le Client lui reviennent, sous réserve des droits des tiers et de nos droits sur le Service ; ils peuvent ne pas être uniques.',
              ],
            },
          ],
        },
        {
          title: 'Article 8 — Données du Client et protection des données',
          body: [
            { p: ['Pour les données personnelles des Destinataires traitées via le Service, le Client est responsable du traitement et nous agissons comme sous-traitant (article 28 du RGPD et textes équivalents). Le présent article et la ', { a: 'politique de confidentialité', href: '/confidentialite' }, ' constituent l’accord de traitement des données (DPA) ; une version signée est fournie sur demande. Nous :'] },
            {
              ul: [
                'traitons les données uniquement sur les instructions documentées du Client (les Conditions et ses réglages), sauf obligation légale, et l’informons si une instruction nous paraît illicite ;',
                'soumettons les personnes autorisées à une obligation de confidentialité ;',
                'mettons en œuvre des mesures techniques et organisationnelles appropriées ;',
                'faisons appel à des sous-traitants ultérieurs, dont la liste figure dans la politique de confidentialité, que le Client autorise de manière générale ; nous l’informons de tout changement au moins 15 jours à l’avance, et le Client peut s’y opposer pour un motif légitime, son seul recours étant alors de résilier ;',
                'aidons le Client, dans une mesure raisonnable, à répondre aux demandes d’exercice de droits, à réaliser ses analyses d’impact et à gérer les violations de données, que nous lui notifions dans les meilleurs délais ;',
                'supprimons les données à la fin du contrat selon l’article 13, sauf conservation imposée par la loi ;',
                'mettons à sa disposition les informations nécessaires pour démontrer notre conformité ; tout audit a lieu au plus une fois par an, avec un préavis raisonnable, à ses frais et sous engagement de confidentialité.',
              ],
            },
            { p: 'Le Client garantit qu’il dispose d’une base légale pour chaque traitement, qu’il informe les Destinataires (agent IA, enregistrement, finalités), qu’il recueille les consentements requis, qu’il ne fait traiter de données sensibles que si c’est nécessaire et licite, et que ses listes de contacts ont été constituées légalement. L’enregistrement des appels et sa durée de conservation sont paramétrés par le Client.' },
            { p: 'Nous pouvons utiliser des données agrégées ou anonymisées et des métadonnées d’usage pour exploiter, sécuriser et améliorer le Service. Nous n’utilisons pas le contenu des appels et messages du Client pour entraîner nos propres modèles.' },
          ],
        },
        {
          title: 'Article 9 — Services tiers et intégrations',
          body: [
            { p: 'Le Service s’appuie sur des tiers ou s’y connecte : opérateurs télécoms, Meta (WhatsApp, Messenger, Instagram), agendas, CRM, outils d’automatisation, fournisseurs d’IA et de paiement. Leurs conditions s’appliquent et le Client les accepte lorsqu’elles l’exigent. En activant une intégration, le Client nous autorise à échanger avec elle les données nécessaires. Nous ne contrôlons pas ces services et ne répondons ni de leur disponibilité, ni de leurs modifications, ni de leur traitement des données qui leur sont transmises à la demande du Client.' },
          ],
        },
        {
          title: 'Article 10 — Propriété intellectuelle',
          body: [
            {
              ul: [
                `Le Service, ses logiciels, interfaces, documentation, la marque ${brand} et ses logos nous appartiennent ou appartiennent à nos concédants et sont protégés notamment par le ${legal.copyrightLaw}. Aucun droit n’est cédé au Client en dehors de la licence ci-dessous.`,
                'Nous concédons au Client, pour la durée de son abonnement, une licence limitée, non exclusive, non cessible, sans droit de sous-licence et révocable d’utiliser le Service pour ses besoins professionnels internes.',
                'Le Client conserve ses droits sur le Contenu Client. Il nous concède, pour le monde entier et à titre gratuit, une licence non exclusive pour l’héberger, le reproduire, le traiter, le transmettre et l’afficher, et le faire traiter par nos sous-traitants, dans la seule mesure nécessaire pour fournir, sécuriser et assister le Service et respecter la loi. Il garantit détenir les droits nécessaires.',
                'Les suggestions et retours du Client peuvent être utilisés librement, gratuitement et sans limite de durée.',
                'Le Client n’utilise pas nos marques sans accord écrit. Nous pouvons citer son nom et son logo comme référence, sauf opposition de sa part par email.',
                ['Pour signaler un contenu illicite ou une atteinte à des droits d’auteur, écrivez à ', mail, ' en indiquant l’œuvre concernée, l’emplacement du contenu, vos coordonnées et une déclaration de bonne foi. Nous pouvons retirer le contenu et suspendre les comptes en infraction répétée.'],
              ],
            },
          ],
        },
        {
          title: 'Article 11 — Confidentialité',
          body: [
            { p: 'Chaque partie garde confidentielles les informations non publiques reçues de l’autre, ne les utilise que pour l’exécution des Conditions et les protège avec un soin raisonnable, pendant le contrat et trois ans après (aussi longtemps qu’elles le restent pour les secrets d’affaires). Ne sont pas confidentielles les informations publiques, déjà connues, développées indépendamment ou reçues licitement d’un tiers. Une partie peut divulguer une information exigée par la loi ou une autorité, en prévenant l’autre lorsque c’est permis.' },
          ],
        },
        {
          title: 'Article 12 — Évolution du Service, fonctions bêta et disponibilité',
          body: [
            {
              ul: [
                'Nous pouvons faire évoluer le Service, ajouter, modifier ou retirer des fonctions et changer de prestataires. Lorsque c’est raisonnablement possible, nous informons le Client à l’avance du retrait d’une fonction essentielle d’un forfait payant.',
                'Les fonctions bêta, en avant-première ou expérimentales sont fournies en l’état, sans engagement, et peuvent être arrêtées à tout moment.',
                'Nous sommes tenus d’une obligation de moyens. Aucun niveau de service garanti (SLA) ne s’applique, sauf stipulation écrite dans un contrat Sur mesure. Le Service dépend d’internet, des opérateurs et de nos prestataires ; des maintenances, annoncées si possible, ou urgentes, peuvent l’interrompre.',
                'Des limites d’usage raisonnable (appels simultanés, débits, volumes) peuvent s’appliquer.',
              ],
            },
          ],
        },
        {
          title: 'Article 13 — Suspension et résiliation',
          body: [
            { p: 'Nous pouvons suspendre ou clôturer tout ou partie du compte, à tout moment, avec ou sans préavis et sans indemnité, en cas de : manquement aux Conditions, impayé ou rétrofacturation, plainte d’un opérateur, de Meta, d’une autorité ou de Destinataires, soupçon de fraude, risque pour la sécurité, risque juridique ou réputationnel, demande d’une autorité, ou exigence de l’un de nos prestataires. Les sommes restent dues pendant la suspension. Une telle clôture ne donne lieu à aucun remboursement, y compris des périodes prépayées non écoulées.' },
            {
              ul: [
                'Le Client peut résilier à tout moment ; la résiliation prend effet au terme de la période payée (article 4).',
                'Nous pouvons aussi mettre fin au contrat sans motif, avec un préavis de 30 jours ; dans ce seul cas, nous remboursons la part non écoulée d’une période prépayée.',
                'À la fin du contrat, l’accès cesse, les sommes dues deviennent exigibles, les numéros peuvent être libérés et les Crédits sont perdus. Le Client peut exporter ses données depuis son espace pendant 30 jours ; elles sont ensuite supprimées dans un délai de 90 jours après la fin du contrat, sous réserve des obligations légales de conservation et du cycle normal des sauvegardes.',
                'Les comptes gratuits ou d’essai sans abonnement payant, inactifs depuis 90 jours, peuvent être clôturés et leurs données supprimées après un avertissement par email.',
                'Les stipulations qui, par nature, survivent à la fin du contrat (sommes dues, données, propriété intellectuelle, confidentialité, garanties, responsabilité, indemnisation, litiges) restent applicables.',
              ],
            },
          ],
        },
        {
          title: 'Article 14 — Exclusion de garanties',
          body: [
            { p: 'Dans les limites permises par la loi, le Service est fourni « en l’état » et « selon disponibilité ». Nous excluons toute garantie, expresse ou implicite, notamment de qualité marchande, d’adéquation à un usage particulier, d’absence de contrefaçon, de fonctionnement ininterrompu ou sans erreur, d’exactitude des contenus générés par l’IA, d’acheminement des appels et messages ou d’obtention d’un résultat commercial.' },
          ],
        },
        {
          title: 'Article 15 — Limitation de responsabilité',
          body: [
            {
              ul: [
                'Nous ne répondons pas des dommages indirects, consécutifs, spéciaux ou punitifs, ni des pertes de bénéfices, de chiffre d’affaires, de clientèle, d’opportunités ou d’image, de la perte ou de l’altération de données, des appels ou rendez-vous manqués ou du coût d’un service de remplacement, même si leur éventualité a été signalée.',
                'Nous ne répondons pas des dommages résultant du Contenu Client, de la configuration des agents, des services tiers, des opérateurs, de Meta, d’internet, d’un cas de force majeure ou d’un manquement du Client.',
                [{ strong: 'Plafond :' }, ' notre responsabilité totale, toutes causes confondues, est limitée au montant hors taxes effectivement payé par le Client pour son abonnement au titre du mois précédant le fait générateur (en facturation annuelle, un douzième du prix annuel), et ne peut en aucun cas dépasser 1 000 USD.'],
                'Le Client reconnaît que les prix reflètent cette répartition des risques.',
              ],
            },
            { p: 'Rien dans les Conditions n’exclut ni ne limite une responsabilité ou un droit qui ne peut l’être en vertu de la loi impérative applicable (notamment en cas de fraude ou de faute lourde ou intentionnelle, ou de dommage corporel).' },
            ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
          ],
        },
        {
          title: 'Article 16 — Indemnisation par le Client',
          body: [
            { p: `Le Client nous défend, nous indemnise et nous garantit, ainsi que nos dirigeants, salariés, sous-traitants et prestataires, contre toute réclamation, perte, amende, sanction, condamnation et tous frais (y compris des honoraires d’avocat raisonnables) résultant : de son Contenu Client et de la configuration de ses agents ; de ses appels, messages et campagnes ; de l’absence de consentement, du non-respect d’une opposition ou d’une liste d’opposition ; de toute violation du droit des télécommunications, de la prospection, de l’IA ou des données personnelles ; d’un manquement aux Conditions ; de toute réclamation d’un Destinataire, d’un Utilisateur, d’un opérateur, de Meta, de notre prestataire de plateforme technique ou d’une autorité liée à son usage. Le Client reconnaît que ${company} peut être tenue envers ses propres prestataires des manquements de ses clients. Nous informons le Client de la réclamation ; il ne peut conclure de transaction mettant une obligation à notre charge sans notre accord.` },
          ],
        },
        {
          title: 'Article 17 — Délai pour agir',
          body: [
            { p: 'Dans la mesure permise par la loi, toute action contre nous doit être engagée dans un délai de trois (3) mois à compter du fait qui la fonde ou du jour où le Client l’a connu ou aurait dû le connaître ; à défaut, elle est prescrite.' },
          ],
        },
        {
          title: 'Article 18 — Droit applicable, arbitrage et renonciation aux actions collectives',
          body: [
            {
              ul: [
                `Les Conditions sont régies par le ${legal.governingLaw}, à l’exclusion de ses règles de conflit de lois et de la Convention des Nations unies sur la vente internationale de marchandises.`,
                ['Avant toute procédure, la partie qui se plaint adresse une réclamation écrite (pour nous : ', mail, ') ; les parties recherchent une solution amiable pendant 30 jours.'],
                `À défaut, tout litige né des Conditions ou du Service est tranché définitivement par un arbitrage confidentiel et contraignant, administré par l’American Arbitration Association (AAA) selon son Règlement d’arbitrage commercial (ou, pour un litige international, par son International Centre for Dispute Resolution), devant un arbitre unique, siégeant à Cheyenne (Wyoming), en langue anglaise. La sentence pourra être confirmée et exécutée par les ${legal.court} ou par toute juridiction compétente.`,
                [{ strong: 'Renonciation aux actions collectives :' }, ' les litiges sont tranchés uniquement à titre individuel, à l’exclusion de toute action de groupe, collective ou représentative et de tout arbitrage consolidé. Si cette renonciation est jugée inapplicable à une demande, celle-ci est portée devant les juridictions ci-dessous et non en arbitrage.'],
                'Chaque partie peut demander à toute juridiction compétente des mesures urgentes ou conservatoires (notamment pour protéger sa propriété intellectuelle ou ses informations confidentielles ou faire cesser un usage abusif du Service), sans constitution de garantie dans la mesure permise. Chaque partie peut saisir une juridiction des petits litiges pour une demande individuelle relevant de sa compétence, et nous pouvons agir en recouvrement des sommes impayées devant toute juridiction compétente.',
                `Tout litige non soumis à l’arbitrage relève de la compétence exclusive des ${legal.court}.`,
              ],
            },
          ],
        },
        {
          title: 'Article 19 — Force majeure',
          body: [
            { p: 'Aucune partie ne répond d’un retard ou d’une inexécution dû à un événement échappant à son contrôle raisonnable : catastrophe naturelle, épidémie, guerre, terrorisme, émeute, grève, décision d’une autorité, défaillance d’un opérateur, d’internet, du réseau électrique, d’un centre de données, d’un fournisseur cloud ou d’IA, cyberattaque ou décision de Meta ou d’un opérateur. Les obligations de paiement ne sont pas suspendues. Si l’événement dure plus de 30 jours, chaque partie peut résilier l’abonnement concerné par notification.' },
          ],
        },
        {
          title: 'Article 20 — Cession et changement de contrôle',
          body: [
            { p: 'Nous pouvons céder ou transférer tout ou partie des Conditions, notamment en cas de fusion, d’acquisition, de réorganisation ou de cession d’actifs, sans l’accord du Client et après l’en avoir informé, et sous-traiter tout ou partie de nos obligations. Le Client ne peut céder les Conditions sans notre accord écrit préalable ; il nous informe de tout changement de contrôle, et nous pouvons alors résilier si le nouvel actionnaire est un concurrent ou ne satisfait pas à nos vérifications.' },
          ],
        },
        {
          title: 'Article 21 — Dispositions générales',
          body: [
            {
              ul: [
                [{ strong: 'Intégralité :' }, ' les Conditions, la page Tarifs, le détail du forfait souscrit, la ', { a: 'politique de confidentialité', href: '/confidentialite' }, ' et, le cas échéant, un contrat Sur mesure signé forment l’intégralité de l’accord et remplacent tout échange antérieur. Les conditions générales d’achat du Client ne s’appliquent pas.'],
                [{ strong: 'Ordre de priorité :' }, ' le contrat Sur mesure signé, puis les Conditions, puis la politique de confidentialité, puis la page Tarifs et la documentation.'],
                [{ strong: 'Divisibilité et non-renonciation :' }, ' une stipulation invalide est remplacée par la stipulation valide la plus proche, les autres restant applicables ; ne pas exercer un droit n’emporte pas renonciation.'],
                [{ strong: 'Notifications :' }, ' nous écrivons à l’adresse email du compte ou dans l’espace client ; le Client nous écrit à ', mail, '. Le Client accepte les communications et factures électroniques.'],
                [{ strong: 'Modifications :' }, ' nous pouvons modifier les Conditions ; les changements importants sont annoncés par email ou sur le site au moins 15 jours avant leur entrée en vigueur, sauf exigence légale ou de sécurité. La poursuite de l’utilisation vaut acceptation ; le Client qui refuse résilie avant cette date.'],
                [{ strong: 'Langue :' }, ' les Conditions sont publiées en plusieurs langues. En cas de divergence, la version anglaise prévaut.'],
                [{ strong: 'Sanctions et exportations :' }, ' le Client déclare ne pas faire l’objet de sanctions économiques et ne pas utiliser le Service dans un pays ou au profit d’une personne visés par de telles sanctions.'],
                [{ strong: 'Indépendance :' }, ' les parties sont des cocontractants indépendants ; les Conditions ne créent aucun droit au profit de tiers.'],
                [{ strong: 'Contact :' }, ` ${company}, ${ADDRESS}, États-Unis — `, mail, '.'],
              ],
            },
          ],
        },
      ];
    },
  },

  privacy: {
    meta: {
      title: (brand: string) => `Politique de confidentialité · ${brand}`,
      description: (brand: string) => `Comment ${brand} traite vos données : demandes de rappel, agents IA et enregistrements, compte client, facturation Stripe, prestataires et vos droits.`,
    },
    breadcrumb: 'Confidentialité',
    h1: 'Politique de confidentialité',
    intro: 'Ce que nous collectons, pourquoi, avec qui, combien de temps, et comment exercer vos droits.',
    updated: 'Dernière mise à jour : 8 octobre 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Qui nous sommes et notre rôle',
          body: [
            { p: [`${brand} est une marque de ${company}, Limited Liability Company immatriculée dans l’État du Wyoming (États-Unis), ${ADDRESS}. Contact : `, mail, `. Nous traitons les données personnelles conformément au ${legal.privacyLaw}, ainsi qu’aux autres lois applicables.`] },
            {
              ul: [
                [{ strong: 'Responsable du traitement :' }, ` pour le site, les formulaires et demandes de rappel, les échanges avec nos propres assistantes IA, les comptes clients, la facturation et notre prospection, ${company} est responsable du traitement.`],
                [{ strong: 'Sous-traitant :' }, ' pour les appels, messages et contacts traités par les agents de nos clients, le client est responsable du traitement vis-à-vis de ses propres interlocuteurs ; nous agissons pour son compte et sur ses instructions. Si vous avez été contacté par l’agent d’une entreprise cliente, adressez-vous d’abord à elle ; nous lui transmettrons toute demande reçue.'],
              ],
            },
          ],
        },
        {
          title: 'Les données que nous collectons',
          body: [
            {
              ul: [
                [{ strong: 'Formulaires du site' }, ' (rappel, démo, accompagnement à l’essai) : nom, téléphone, email, entreprise, secteur, créneau souhaité, message et consentement.'],
                [{ strong: 'Échanges avec nos assistantes IA' }, ' (bulle du site, réceptionniste, appels de démonstration, rappels commerciaux et support, aide de l’espace client) : contenu écrit, enregistrement audio des conversations vocales, transcription, résumé et informations extraites (besoin, forfait envisagé, problème signalé).'],
                [{ strong: 'Compte client' }, ' : identité et coordonnées des utilisateurs, informations sur l’entreprise, identifiants, réglages et instructions des agents, bases de connaissances, listes de contacts, historique des appels et messages, consommation de minutes et de crédits, demandes de support.'],
                [{ strong: 'Données traitées pour nos clients' }, ' : numéros et noms des appelants ou contacts, contenu des appels, messages, enregistrements, transcriptions, rendez-vous et fiches de prospects.'],
                [{ strong: 'Facturation' }, ' : forfait, factures, adresse de facturation, numéro de TVA, statut des paiements. Les données de carte sont saisies et conservées par Stripe ; nous n’y avons jamais accès.'],
                [{ strong: 'Données techniques' }, ' : adresse IP, appareil et navigateur, journaux de connexion et de sécurité, cookies.'],
                [{ strong: 'Données reçues de tiers' }, ' : intégrations activées par le client (agendas, CRM, WhatsApp, Messenger, Instagram), métadonnées d’appels et de messages transmises par les opérateurs, informations de paiement et de prévention de la fraude transmises par Stripe, informations publiques sur les entreprises utilisées pour vérifier un compte.'],
              ],
            },
          ],
        },
        {
          title: 'Finalités et bases légales',
          body: [
            {
              ul: [
                [{ strong: 'Vous rappeler et répondre à votre demande' }, ', y compris par un appel de notre agent vocal IA : votre consentement, donné au moment de la demande et révocable à tout moment.'],
                [{ strong: 'Fournir le Service, l’essai gratuit et le support' }, ' : exécution du contrat ou mesures précontractuelles.'],
                [{ strong: 'Traiter les données de nos clients pour leur compte' }, ' : leurs instructions, sur la base légale qu’ils déterminent.'],
                [{ strong: 'Facturer, tenir la comptabilité, respecter nos obligations fiscales et répondre aux autorités' }, ' : obligation légale.'],
                [{ strong: 'Sécuriser la plateforme, prévenir la fraude et les abus, faire respecter nos conditions, nous défendre en justice, améliorer nos assistantes à partir de nos propres échanges et de statistiques agrégées' }, ' : intérêt légitime.'],
                [{ strong: 'Prospection auprès de professionnels' }, ' : intérêt légitime ou consentement lorsque la loi l’exige ; vous pouvez vous y opposer à tout moment.'],
                [{ strong: 'Cookies de mesure d’audience et de mesure publicitaire (pixel Meta)' }, ' : votre consentement.'],
              ],
            },
          ],
        },
        {
          title: 'Intelligence artificielle, enregistrements et transcriptions',
          body: [
            { p: 'Nos assistantes sont des intelligences artificielles et se présentent comme telles. Les conversations vocales sont enregistrées et transcrites ; des fournisseurs d’IA en produisent des résumés et en extraient les informations utiles au suivi de votre demande. Aucune décision produisant des effets juridiques ou vous affectant de manière significative n’est prise sur le seul fondement d’un traitement automatisé.' },
            { p: 'Nous ne vendons pas vos données et ne les partageons pas à des fins de publicité ciblée. Nous n’utilisons pas le contenu des appels et messages de nos clients pour entraîner nos propres modèles. Nos fournisseurs d’IA traitent les données sous contrat, pour notre compte.' },
            { p: 'Les clients qui utilisent la plateforme doivent informer leurs propres interlocuteurs qu’ils échangent avec un système d’IA et, lorsque la loi l’exige, que l’appel est enregistré. Ils paramètrent l’enregistrement et sa durée de conservation.' },
          ],
        },
        {
          title: 'Partage des données et sous-traitants',
          body: [
            { p: 'Nous ne communiquons vos données qu’aux destinataires nécessaires, liés par des engagements de confidentialité et de protection des données :' },
            {
              ul: [
                [{ strong: 'Notre prestataire de plateforme technique' }, ' : agents vocaux, widgets, espace client, transcription, synthèse vocale et automatisations. Ce prestataire est établi dans l’Union européenne (Roumanie), certifié ISO 27001, et héberge les données dans l’Espace économique européen et/ou aux États-Unis.'],
                [{ strong: 'Twilio et autres opérateurs télécoms' }, ' : acheminement des appels et SMS, numéros de téléphone.'],
                [{ strong: 'Meta' }, ' (WhatsApp, Messenger, Instagram) : lorsque le client utilise ces canaux.'],
                [{ strong: 'Fournisseurs d’IA, de voix et de transcription' }, ' : compréhension, réponse, synthèse vocale et transcription.'],
                [{ strong: 'Stripe' }, ' : abonnements, paiements, factures et calcul des taxes (certifié PCI-DSS niveau 1).'],
                [{ strong: 'Supabase' }, ' : base de données des demandes, inscriptions et comptes rendus d’échanges (États-Unis).'],
                [{ strong: 'Google Cloud (Firebase)' }, ' : hébergement du site (États-Unis).'],
                [{ strong: 'Google (Google Analytics 4)' }, ' : mesure d’audience, uniquement avec votre consentement ; transfert vers les États-Unis encadré par le Cadre de protection des données UE-États-Unis (Data Privacy Framework).'],
                [{ strong: 'Meta Platforms Ireland Ltd (pixel Meta)' }, ' : mesure de l’efficacité de nos publicités sur Facebook et Instagram, uniquement avec votre consentement ; transfert possible vers les États-Unis encadré par le Cadre de protection des données UE-États-Unis (Data Privacy Framework).'],
                [{ strong: 'Zoho' }, ' : envoi des emails de service et de suivi.'],
                [{ strong: 'Intégrations activées par le client' }, ' (agendas, CRM, outils d’automatisation), nos conseils professionnels, les autorités lorsque la loi l’exige, et un éventuel acquéreur en cas de fusion ou de cession.'],
              ],
            },
          ],
        },
        {
          title: 'Transferts internationaux',
          body: [
            { p: 'Notre société et plusieurs prestataires sont situés aux États-Unis ; notre prestataire de plateforme technique est établi dans l’Union européenne et héberge les données dans l’EEE et/ou aux États-Unis. Les transferts sont chiffrés et encadrés :' },
            {
              ul: [
                'Union européenne et EEE : Cadre de protection des données UE-États-Unis lorsque le destinataire y adhère, à défaut clauses contractuelles types de la Commission européenne, avec des mesures complémentaires si nécessaire.',
                'Royaume-Uni : extension britannique de ce cadre ou addendum britannique aux clauses contractuelles types.',
                'Suisse : cadre Suisse-États-Unis ou clauses contractuelles types reconnues par le Préposé fédéral (PFPDT).',
                'Australie : nous prenons des mesures raisonnables, notamment contractuelles, pour que les destinataires à l’étranger traitent les informations conformément aux Australian Privacy Principles (APP 8).',
              ],
            },
            { p: ['Une copie des garanties applicables peut être obtenue à ', mail, '.'] },
          ],
        },
        {
          title: 'Durées de conservation',
          body: [
            {
              ul: [
                'Demandes de rappel et échanges avec nos assistantes : 24 mois après le dernier contact.',
                'Appels, enregistrements, transcriptions, conversations écrites et SMS traités pour nos clients : 90 jours par défaut à compter de l’appel (durée appliquée par notre prestataire technique) ; chaque client peut modifier cette durée (jusqu’à 12 mois) et supprimer ses données.',
                'Prospects et contacts recueillis par les agents de nos clients : 24 mois par défaut, réductibles par le client.',
                'Données du compte : pendant la relation contractuelle, puis 3 ans pour la prospection, sauf opposition. Le contenu du compte est supprimé dans les 90 jours suivant la fin du contrat.',
                'Factures et pièces comptables : 10 ans.',
                'Journaux techniques et de sécurité : durée limitée nécessaire à la sécurité.',
              ],
            },
            { p: 'À l’issue de ces durées, les données sont supprimées ou anonymisées.' },
          ],
        },
        {
          title: 'Sécurité',
          body: [
            { p: 'Notre prestataire de plateforme technique, certifié ISO 27001, chiffre les données en transit (TLS) et au repos (AES-256), limite les accès selon les rôles et les trace dans des journaux d’audit ; nos autres hébergeurs (Google Cloud, Supabase) chiffrent également les données au repos. L’espace client propose la double authentification (application d’authentification ou code par e-mail), que chaque client peut activer dans Profil > Sécurité. De notre côté, les clés techniques sont conservées dans des coffres-forts de secrets et les accès sont réservés aux personnes qui en ont besoin. Aucun système n’étant infaillible, nous notifions les violations de données aux autorités et aux personnes concernées lorsque la loi l’exige.' },
          ],
        },
        {
          title: 'Vos droits selon votre pays',
          body: [
            {
              ul: [
                [{ strong: 'Union européenne et EEE' }, ' (dont France, Italie, Pologne, Pays-Bas) : accès, rectification, effacement, limitation, portabilité, opposition (sans condition pour la prospection), retrait du consentement et droit de ne pas faire l’objet d’une décision entièrement automatisée. En France, vous pouvez aussi définir des directives sur le sort de vos données après votre décès.'],
                [{ strong: 'Royaume-Uni' }, ' : les mêmes droits au titre du UK GDPR et du Data Protection Act 2018.'],
                [{ strong: 'Suisse' }, ' : les droits prévus par la loi fédérale sur la protection des données (nLPD).'],
                [{ strong: 'Australie' }, ' : droits d’accès et de correction prévus par les Australian Privacy Principles, et possibilité d’interagir avec nous de façon anonyme ou sous pseudonyme lorsque c’est possible.'],
                [{ strong: 'Ailleurs' }, ' : les droits prévus par votre loi locale.'],
              ],
            },
          ],
        },
        {
          title: 'Exercer vos droits et réclamations',
          body: [
            { p: ['Écrivez à ', mail, ` ou à ${company}, ${ADDRESS}, États-Unis. Nous pouvons vous demander de justifier de votre identité. Nous répondons dans un délai de 30 jours, prolongeable de deux mois pour les demandes complexes (vous en serez informé). La démarche est gratuite, sauf demande manifestement infondée ou excessive. Si nous traitons vos données pour le compte d’un client, nous lui transmettons votre demande.`] },
            { p: `Vous pouvez introduire une réclamation auprès de ${legal.dataAuthority}, ou de l’autorité de protection des données de votre pays de résidence ou de travail  : notamment l’Autorité de protection des données (Belgique), le PFPDT (Suisse), le Garante per la protezione dei dati personali (Italie), l’UODO (Pologne), l’Autoriteit Persoonsgegevens (Pays-Bas) ou l’ICO (Royaume-Uni). En Australie, adressez-nous d’abord votre plainte : nous répondons sous 30 jours ; vous pouvez ensuite saisir l’OAIC.` },
          ],
        },
        {
          title: 'Mineurs',
          body: [
            { p: 'Le Service est réservé aux professionnels âgés d’au moins 18 ans. Il ne s’adresse pas aux mineurs et nous ne collectons pas sciemment leurs données ; si nous apprenons qu’un mineur nous a transmis des données, nous les supprimons.' },
          ],
        },
        {
          title: 'Prospection, appels et désinscription',
          body: [
            { p: ['Nous ne vous appelons qu’à votre demande ou avec votre accord, et notre agent se présente comme une IA. Vous pouvez à tout moment dire que vous ne souhaitez plus être appelé, répondre STOP à un SMS, utiliser le lien de désinscription d’un email ou écrire à ', mail, ' : nous vous inscrivons sur notre liste d’opposition interne. Pour notre propre prospection, nous respectons les listes d’opposition au démarchage applicables (consentement préalable des consommateurs en France, TPS/CTPS, Do Not Call Register, Registro delle opposizioni…).'] },
            { p: 'Les appels et messages envoyés par nos clients relèvent de leur responsabilité : adressez-leur votre opposition ; nous la leur transmettrons si vous nous contactez.' },
          ],
        },
        {
          title: 'Cookies et « Do Not Track »',
          body: [
            { p: ['Le site utilise des cookies essentiels à son fonctionnement et à sa sécurité et, uniquement avec votre consentement, des cookies de mesure d’audience (Google Analytics) et de mesure publicitaire (pixel Meta). Les détails et le réglage de vos choix figurent sur la page ', { a: 'cookies', href: '/cookies' }, '. Faute de norme commune, nous ne répondons pas différemment aux signaux « Do Not Track » ; nous ne suivons pas nous-mêmes votre navigation sur d’autres sites. Si vous acceptez le pixel Meta, Meta peut en revanche relier votre visite à votre compte Facebook ou Instagram pour mesurer et diffuser nos publicités.'] },
          ],
        },
        // À RELIRE PAR UN JURISTE avant validation définitive : responsabilité conjointe avec Meta (art. 26 RGPD, CJUE C-40/17 Fashion ID)
        {
          title: 'Pixel Meta : responsabilité conjointe avec Meta',
          body: [
            { p: [`Lorsque le RGPD s’applique et que vous acceptez le pixel Meta, ${company} et Meta Platforms Ireland Ltd sont responsables conjoints du traitement (article 26 du RGPD ; Cour de justice de l’UE, 29 juillet 2019, Fashion ID, C-40/17) pour la collecte de vos données par le pixel sur notre site et leur transmission à Meta. Cette responsabilité conjointe est régie par l’addendum de Meta relatif aux responsables conjoints du traitement : `, { a: 'facebook.com/legal/controller_addendum', href: 'https://www.facebook.com/legal/controller_addendum' }, '.'] },
            { p: 'Nous vous informons de ce traitement et recueillons votre consentement ; Meta fournit les informations sur ses propres traitements et répond aux demandes d’exercice de droits qui les concernent. Meta est seule responsable des traitements ultérieurs, une fois les données reçues (par exemple la diffusion et la personnalisation de publicités) ; sa propre politique de confidentialité s’y applique.' },
            { p: ['Vous pouvez exercer vos droits auprès de nous (', mail, ') comme auprès de Meta ; nous transmettons à Meta toute demande qui la concerne.'] },
          ],
        },
        {
          title: 'Liens vers des sites tiers',
          body: [
            { p: 'Le site et le Service peuvent renvoyer vers des sites ou services tiers (Stripe, Meta, agendas, CRM…). Leurs propres politiques de confidentialité s’appliquent ; nous n’en sommes pas responsables.' },
          ],
        },
        {
          title: 'Modifications de cette politique',
          body: [
            { p: 'Nous pouvons mettre à jour cette politique ; la date de mise à jour figure en haut de page. Les changements importants sont annoncés par email aux clients ou par un avis sur le site.' },
          ],
        },
        {
          title: 'Nous contacter',
          body: [
            { p: [`${company}, ${ADDRESS}, États-Unis — `, mail, '.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Mentions légales · ${brand}`,
      description: (brand: string) => `Mentions légales, informations sur l’éditeur, l’hébergement et les droits d’auteur de la plateforme ${brand}.`,
    },
    h1: 'Mentions légales',
    updated: 'Dernière mise à jour : 8 octobre 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Éditeur du site',
        body: [
          { p: ['Le site internet accessible à l’adresse ', { strong: 'https://permanenceia.com' }, ' est édité par la société ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Nom commercial :' }, ` ${brand}`],
              [{ strong: 'Statut :' }, ' Limited Liability Company (LLC), État du Wyoming, États-Unis'],
              [{ strong: 'Numéro d’enregistrement :' }, ' 2026-001905061'],
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
          { p: 'Le site et les services sont hébergés par :' },
          {
            ul: [
              [{ strong: 'Site vitrine :' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis, tél. +1 650-253-0000. Région d’hébergement : us-east4 (Virginie du Nord, États-Unis).'],
              [{ strong: 'Bases de données et stockage du site :' }, ' Supabase Inc., infrastructures situées aux États-Unis (région AWS us-east-1, Virginie).'],
              [{ strong: 'Espace client et agents vocaux :' }, ` l’espace client (${appHost}), les agents et leurs données sont hébergés par notre prestataire de plateforme technique, établi dans l’Union européenne (Roumanie), sur des serveurs situés dans l’Espace économique européen et/ou aux États-Unis.`],
            ],
          },
        ],
      },
      {
        title: '3. Propriété intellectuelle',
        body: [
          { p: ['La marque ', { strong: brand }, `, le logo (la bulle en veille, les ondes vocales et le point de disponibilité), ainsi que l’ensemble des chartes graphiques, textes, scripts conversationnels, infographies et codes source figurant sur le site sont la propriété exclusive de ${company}.`] },
          { p: 'Toute reproduction, distribution, modification ou utilisation sans accord écrit préalable est formellement interdite et constitue une contrefaçon sanctionnée par le ' + legal.copyrightLaw + '.' },
        ],
      },
      {
        title: '4. Limitation de responsabilité',
        body: [
          { p: `${brand} s’efforce d’assurer au mieux de ses possibilités l’exactitude des informations diffusées sur le site. Toutefois, ${brand} ne saurait être tenue responsable des interruptions de service réseau, des pannes inhérentes aux opérateurs de télécommunication tiers ou des inexactitudes ponctuelles dans les réponses générées par l’intelligence artificielle lors des conversations.` },
          { p: 'Le client professionnel demeure seul responsable des consignes et règles métier qu’il programme pour son standard téléphonique.' },
        ],
      },
    ],
  },

  cookies: {
    meta: {
      title: (brand: string) => `Politique cookies · ${brand}`,
      description: (brand: string) => `Liste des cookies et traceurs du site ${brand} : finalités, durées de conservation et gestion de votre consentement.`,
    },
    h1: 'Politique cookies',
    paragraphs: (siteHost: string, appHost: string) => [
      `Responsable : ${SITE.company}, ${ADDRESS}, États-Unis, éditeur du site ${siteHost}.`,
      `Cookies strictement nécessaires : le site ${siteHost} dépose les cookies indispensables à son fonctionnement (sécurité, équilibrage de charge). Ils ne demandent pas votre consentement.`,
      `Cookie de consentement : le cookie pia_consent mémorise votre choix (accepter ou refuser) pendant 6 mois, sur le domaine permanenceia.com et sur l’espace client (${appHost}).`,
      'Mesure d’audience, avec votre accord seulement : Google Analytics 4 (Google Ireland Ltd / Google LLC) mesure l’audience du site et l’efficacité de nos campagnes, sous forme de statistiques agrégées. Cookies déposés : _ga et _ga_<ID>, conservés 13 mois au plus. Un transfert de données vers les États-Unis est possible ; il est encadré par le Cadre de protection des données UE-États-Unis (Data Privacy Framework).',
      'Mesure publicitaire, avec votre accord seulement : le pixel Meta (Meta Platforms Ireland Ltd) mesure l’efficacité de nos publicités sur Facebook et Instagram (visites, demandes de rappel, clics vers WhatsApp ou le téléphone). Il dépose notamment le cookie _fbp, conservé 3 mois au plus. Aucune donnée saisie dans nos formulaires (nom, email, téléphone) n’est transmise à Meta. Meta peut transférer des données vers les États-Unis (Meta Platforms, Inc.) ; ce transfert est encadré par le Cadre de protection des données UE-États-Unis (Data Privacy Framework).',
      // À RELIRE PAR UN JURISTE : responsabilité conjointe avec Meta pour le pixel
      'Pour la collecte et la transmission des données par le pixel Meta, nous sommes responsables conjoints avec Meta Platforms Ireland Ltd (article 26 du RGPD, addendum de Meta : https://www.facebook.com/legal/controller_addendum). Meta est seule responsable des traitements ultérieurs. Vous pouvez exercer vos droits auprès de nous comme auprès de Meta.',
      'Sans votre accord, aucun de ces cookies n’est déposé et le pixel Meta n’est pas chargé.',
      'Vous pouvez changer d’avis et retirer votre consentement à tout moment avec le lien « Gérer les cookies » en bas de chaque page. Refuser n’empêche pas d’utiliser le site.',
      `Le widget de notre assistante, chargé depuis ${appHost}, peut utiliser un stockage technique nécessaire à la conversation. L’espace client (${appHost}) utilise des cookies de session nécessaires à la connexion.`,
    ],
    questions: 'Questions : ',
  },

  blog: {
    meta: {
      title: (brand: string) => `Blog accueil téléphonique et agents IA · ${brand}`,
      description: 'Guides et retours d’expérience sur l’accueil téléphonique, la prise de rendez-vous et les agents vocaux IA en entreprise. Lisez nos articles.',
    },
    eyebrow: 'Ressources et analyses',
    h1: 'Le journal de l’accueil téléphonique IA',
    intro: 'Stratégies de conversion téléphonique, analyses réglementaires et retours d’expérience concrets de professionnels.',
    searchPlaceholder: 'Rechercher un article…',
    all: 'Tous les articles',
    categories: {
      productivite: 'Productivité',
      conformite: 'Conformité',
      'cas-client': 'Cas clients',
      technique: 'Technique',
    },
    read: 'Lire',
    notFound: {
      title: (brand: string) => `Article introuvable · ${brand}`,
      description: 'Cet article n’existe pas ou a été déplacé.',
      h1: 'Article introuvable',
      text: 'L’article que vous cherchez n’existe pas ou a été déplacé.',
      back: 'Retour aux articles',
    },
    articleTitle: (title: string, brand: string) => `${title} · Blog ${brand}`,
    backToList: 'Retour à la liste des articles',
    readTime: (t: string) => `${t} de lecture`,
    publisher: (brand: string) => `${brand}`,
    ctaEyebrow: 'Passez à l’action',
    ctaTitle: 'Prêt à équiper votre entreprise d’un standard IA ?',
    ctaText: (days: number, minutes: number) => `Testez dès aujourd’hui notre agent vocal en conditions réelles pendant ${days} jours, avec ${minutes} minutes incluses et sans engagement.`,
    ctaButton: 'Démarrer l’essai de 14 jours',
  },
};
