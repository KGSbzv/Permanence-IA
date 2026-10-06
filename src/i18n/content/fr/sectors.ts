// Six landings sectorielles (docs 80-89 et 106-111).
import type { PlanSlug as OfferSlug } from '../../markets';

export interface Sector {
  slug: string;
  name: string;
  short: string; // carte secteur
  targets: string;
  title: string; // hero
  subtitle: string;
  problems: string[];
  handles: string[]; // ce que l’agent prend en charge
  benefits: string[];
  photo: string; // /photos/<slug>.jpg — remplacé par une illustration si absent
  photoAlt: string;
  caption: string;
  modules: string[]; // slugs de modules mis en avant
  steps: { title: string; text: string }[];
  offer: OfferSlug; // offre recommandée
  ctas: [string, string];
  call: { who: 'agent' | 'client'; text: string }[]; // extrait de conversation
  lead: { label: string; value: string }[]; // fiche créée
  faq: { q: string; a: string }[];
}

export const SECTORS: Sector[] = [
  {
    slug: 'services-a-domicile',
    name: 'Services à domicile',
    short: 'Urgences filtrées et demandes qualifiées pendant que vos équipes sont sur le terrain.',
    targets: 'Plombiers, électriciens, chauffagistes, climatisation, toiture, rénovation, nettoyage',
    title: 'Ne perdez plus les urgences pendant que vos équipes sont sur le terrain',
    subtitle: 'Permanence IA assure la permanence téléphonique de votre entreprise : les demandes sont captées, l’urgence filtrée et les rappels organisés pour intervenir plus vite — y compris hors horaires.',
    problems: [
      'Vos techniciens ne peuvent pas décrocher en intervention.',
      'Les appels du soir et du week-end partent chez un concurrent.',
      'Les devis arrivent incomplets et demandent un second appel.',
    ],
    handles: ['Type de panne ou de travaux', 'Adresse et zone d’intervention', 'Niveau d’urgence', 'Dépannage, devis ou entretien', 'Type de bâtiment', 'Créneau souhaité', 'Résumé prêt pour le rappel'],
    benefits: ['Aucun appel important laissé à la messagerie', 'Urgences triées selon un script que vous validez', 'Moins de déplacements inutiles', 'Devis mieux préparés', 'Rappels planifiés selon la zone et vos disponibilités'],
    photo: '/photos/services-a-domicile.jpg',
    photoAlt: 'Technicien en intervention sous un évier dans un appartement',
    caption: 'Pendant que votre équipe intervient, l’agent IA recueille les informations utiles, filtre l’urgence et prépare le prochain rappel.',
    modules: ['receptionniste-ia', 'qualification-des-leads', 'prise-de-rendez-vous', 'widget-web', 'flow-builder', 'reporting'],
    steps: [
      { title: 'Le client appelle', text: 'À toute heure, même pendant vos interventions.' },
      { title: 'L’agent qualifie', text: 'Panne, adresse, urgence, créneau.' },
      { title: 'Vous recevez la fiche', text: 'Résumé par email et dans votre tableau de bord.' },
      { title: 'Vous rappelez ou intervenez', text: 'Avec toutes les informations en main.' },
    ],
    offer: 'assistant',
    ctas: ['Tester gratuitement pendant 14 jours', 'Voir comment les demandes sont qualifiées'],
    call: [
      { who: 'client', text: 'Bonjour, j’ai une fuite sous l’évier, ça coule beaucoup.' },
      { who: 'agent', text: 'Je comprends. Avez-vous pu couper l’arrivée d’eau ?' },
      { who: 'client', text: 'Oui, c’est coupé. Je suis au 12 rue des Lilas.' },
      { who: 'agent', text: 'Merci. Je transmets votre demande en priorité au technicien de garde.' },
    ],
    lead: [{ label: 'Demande', value: 'Fuite sous évier' }, { label: 'Urgence', value: 'Élevée' }, { label: 'Zone', value: 'Secteur nord' }, { label: 'Action', value: 'Rappel prioritaire' }],
    faq: [
      { q: 'Comment l’agent gère-t-il les urgences ?', a: 'Vous définissez ce qu’est une urgence pour votre métier, qu’il s’agisse d’une fuite pour un plombier ou d’une panne de chauffage. L’agent pose les questions prévues, donne les consignes de sécurité que vous avez validées et vous alerte immédiatement par email ou par transfert.' },
      { q: 'Puis-je limiter la zone d’intervention ?', a: 'Oui. Indiquez vos communes ou codes postaux : l’agent informe poliment les demandes hors zone et ne crée que les demandes que vous pouvez traiter.' },
      { q: 'Est-ce que je reçois un résumé avant de rappeler ?', a: 'Oui. Chaque appel produit une fiche avec la demande, l’adresse, l’urgence et le créneau souhaité, consultable dans votre tableau de bord.' },
    ],
  },
  {
    slug: 'dentaire-cliniques',
    name: 'Dentaire et cliniques',
    short: 'Rendez-vous, confirmations et reports gérés sans interrompre les soins.',
    targets: 'Cabinets dentaires, centres de santé, cliniques non urgentes, kinésithérapie',
    title: 'Réservez et confirmez les rendez-vous sans interrompre les soins',
    subtitle: 'Un secrétariat dentaire par IA : Permanence IA aide votre équipe à gérer les appels administratifs, les nouveaux patients, les confirmations et les reports.',
    problems: [
      'L’accueil est interrompu en pleine consultation.',
      'Les nouveaux patients appellent hors horaires.',
      'Les annulations tardives laissent des créneaux vides.',
    ],
    handles: ['Nouveau patient ou patient existant', 'Prise de rendez-vous', 'Report et annulation', 'Questions administratives', 'Orientation des demandes urgentes', 'Confirmations et rappels'],
    benefits: ['Nouveaux patients captés hors horaires', 'Moins d’interruptions à l’accueil', 'Reports et annulations gérés', 'Créneaux mieux remplis', 'Résumés transmis à l’équipe'],
    photo: '/photos/dentaire-cliniques.jpg',
    photoAlt: 'Assistante dentaire à l’accueil d’un cabinet lumineux',
    caption: 'Votre équipe soigne les patients. L’agent IA prend en charge les demandes administratives répétitives et prépare les rendez-vous.',
    modules: ['prise-de-rendez-vous', 'receptionniste-ia', 'base-de-connaissances', 'campagnes-sortantes', 'whatsapp-messages', 'reporting'],
    steps: [
      { title: 'Le patient appelle', text: 'Pendant les soins ou après la fermeture.' },
      { title: 'L’agent identifie la demande', text: 'Nouveau patient, report, question administrative.' },
      { title: 'Le rendez-vous est posé', text: 'Dans votre agenda, selon vos règles.' },
      { title: 'La veille, l’agent confirme', text: 'Par appel ou message, et libère le créneau si besoin.' },
    ],
    offer: 'assistant',
    ctas: ['Démarrer l’essai gratuit', 'Demander une démonstration'],
    call: [
      { who: 'client', text: 'Bonjour, je voudrais un rendez-vous pour un détartrage.' },
      { who: 'agent', text: 'Avec plaisir. Êtes-vous déjà patient du cabinet ?' },
      { who: 'client', text: 'Non, c’est la première fois.' },
      { who: 'agent', text: 'Je vous propose mardi 9 h 30 ou jeudi 14 h. Lequel vous convient ?' },
    ],
    lead: [{ label: 'Patient', value: 'Nouveau' }, { label: 'Motif', value: 'Détartrage' }, { label: 'Créneau', value: 'Mardi 9 h 30' }, { label: 'Confirmation', value: 'Envoyée' }],
    faq: [
      { q: 'L’agent donne-t-il des conseils médicaux ?', a: 'Non. L’agent reste administratif : il ne pose aucun diagnostic et ne donne aucun conseil médical. Pour une situation urgente, il applique la consigne d’orientation que vous avez définie.' },
      { q: 'Peut-il gérer plusieurs praticiens ?', a: 'Oui. Chaque praticien du cabinet dentaire ou médical peut avoir ses types de rendez-vous, ses durées et ses disponibilités dans l’agenda connecté.' },
      { q: 'Où sont conservées les données des appels ?', a: 'Les enregistrements et transcriptions sont conservés selon la durée de rétention que vous choisissez, et peuvent être supprimés à tout moment.' },
    ],
  },
  {
    slug: 'immobilier',
    name: 'Immobilier',
    short: 'Acheteurs, vendeurs et locataires qualifiés même quand vos agents sont en visite.',
    targets: 'Agences immobilières, réseaux, gestion locative, syndics',
    title: 'Qualifiez acheteurs, vendeurs et locataires même quand vos agents sont en visite',
    subtitle: 'L’accueil téléphonique de votre agence immobilière, même pendant les visites : chaque demande arrive avec les informations nécessaires pour agir plus vite — budget, zone, délai, bien concerné.',
    problems: [
      'Vos agents sont en visite quand les prospects appellent.',
      'Les leads des portails attendent trop longtemps une réponse.',
      'La gestion locative mélange incidents et demandes commerciales.',
    ],
    handles: ['Achat, vente ou location', 'Budget, zone et délai', 'Référence du bien', 'Financement', 'Planification de visite', 'Routage vers le bon agent', 'Incidents locatifs et tickets'],
    benefits: ['Qualification budget, zone, délai', 'Visites mieux planifiées', 'Routage vers le bon agent ou immeuble', 'Leads captés hors horaires', 'Suivi après visite'],
    photo: '/photos/immobilier.jpg',
    photoAlt: 'Agent immobilier faisant visiter un appartement lumineux',
    caption: 'Chaque demande arrive avec les informations nécessaires pour qu’un agent puisse agir plus vite.',
    modules: ['qualification-des-leads', 'prise-de-rendez-vous', 'receptionniste-ia', 'campagnes-sortantes', 'flow-builder', 'reporting'],
    steps: [
      { title: 'Le prospect appelle', text: 'Depuis une annonce, un portail ou votre site.' },
      { title: 'L’agent qualifie', text: 'Projet, budget, zone, délai, financement.' },
      { title: 'La visite est proposée', text: 'Dans l’agenda de l’agent concerné.' },
      { title: 'Le suivi est automatique', text: 'Relance après visite et mise à jour du CRM.' },
    ],
    offer: 'assistant',
    ctas: ['Tester l’agent immobilier', 'Réclamer mes 30 minutes'],
    call: [
      { who: 'client', text: 'J’appelle pour le T3 avec balcon, il est toujours disponible ?' },
      { who: 'agent', text: 'Oui. Vous cherchez pour habiter ou pour investir ?' },
      { who: 'client', text: 'Pour habiter, budget autour de 320 000 euros.' },
      { who: 'agent', text: 'Parfait. Je peux vous proposer une visite samedi à 11 h.' },
    ],
    lead: [{ label: 'Projet', value: 'Achat résidence principale' }, { label: 'Budget', value: '≈ 320 000 €' }, { label: 'Bien', value: 'T3 avec balcon' }, { label: 'Visite', value: 'Samedi 11 h' }],
    faq: [
      { q: 'Peut-on router vers l’agent responsable du bien ?', a: 'Oui. Selon la référence ou le secteur, la demande est attribuée à l’agent concerné et la visite posée dans son agenda.' },
      { q: 'L’agent connaît-il nos biens ?', a: 'Il s’appuie sur les informations que vous chargez dans la base de connaissances ou fournissez via votre outil, et ne donne aucune information non vérifiée.' },
      { q: 'Et la gestion locative ?', a: 'L’agent distingue locataire, propriétaire et candidat, crée un ticket pour les incidents et transmet les urgences selon vos règles.' },
    ],
  },
  {
    slug: 'automobile',
    name: 'Garages et automobile',
    short: 'Rendez-vous atelier et devis préparés sans interrompre l’équipe au comptoir.',
    targets: 'Garages indépendants, centres d’entretien, carrosseries, concessions',
    title: 'Remplissez l’atelier sans interrompre vos équipes au comptoir',
    subtitle: 'Un standard téléphonique pour votre garage : l’agent IA recueille les détails du véhicule et prépare la demande pendant que votre équipe reste concentrée sur l’atelier.',
    problems: [
      'Le téléphone sonne pendant que les mécaniciens travaillent.',
      'Les demandes de devis arrivent sans les infos du véhicule.',
      'Les devis envoyés restent sans relance.',
    ],
    handles: ['Marque, modèle, kilométrage', 'Type d’intervention', 'Symptômes décrits', 'Entretien ou contrôle technique', 'Demande de devis', 'Créneau atelier', 'Relance des devis'],
    benefits: ['Rendez-vous atelier capturés', 'Demandes mieux préparées', 'Moins d’interruptions au comptoir', 'Devis relancés', 'Créneaux mieux organisés'],
    photo: '/photos/automobile.jpg',
    photoAlt: 'Mécanicien contrôlant un véhicule sur un pont dans un atelier moderne',
    caption: 'L’agent IA recueille les détails du véhicule et prépare la demande pendant que votre équipe reste concentrée sur l’atelier.',
    modules: ['prise-de-rendez-vous', 'receptionniste-ia', 'campagnes-sortantes', 'whatsapp-messages', 'qualification-des-leads', 'reporting'],
    steps: [
      { title: 'Le client appelle', text: 'Pour un entretien, une panne ou un devis.' },
      { title: 'L’agent collecte', text: 'Véhicule, symptôme, intervention souhaitée.' },
      { title: 'Le créneau est réservé', text: 'Selon la charge de l’atelier.' },
      { title: 'Le client est relancé', text: 'Confirmation et rappel avant le rendez-vous.' },
    ],
    offer: 'assistant',
    ctas: ['Voir la démo garage', 'Optimiser mon atelier'],
    call: [
      { who: 'client', text: 'J’ai un bruit au freinage depuis deux jours.' },
      { who: 'agent', text: 'Je note. Quel est le modèle et l’année du véhicule ?' },
      { who: 'client', text: 'Une citadine de 2019, environ 60 000 km.' },
      { who: 'agent', text: 'Je vous propose un contrôle des freins jeudi à 8 h 30.' },
    ],
    lead: [{ label: 'Véhicule', value: 'Citadine 2019 · 60 000 km' }, { label: 'Symptôme', value: 'Bruit au freinage' }, { label: 'Intervention', value: 'Contrôle freins' }, { label: 'Créneau', value: 'Jeudi 8 h 30' }],
    faq: [
      { q: 'L’agent fait-il un diagnostic ?', a: 'Non. Il note les symptômes décrits par le client et prépare la demande de rendez-vous au garage : le diagnostic reste celui de votre atelier.' },
      { q: 'Peut-il annoncer des prix ?', a: 'Uniquement les tarifs que vous lui fournissez, par exemple un forfait vidange. Pour le reste, il propose un devis.' },
      { q: 'Et les relances de devis ?', a: 'Avec le forfait Assistant, une campagne peut rappeler les clients dont le devis est en attente, aux horaires que vous choisissez.' },
    ],
  },
  {
    slug: 'beaute-bien-etre',
    name: 'Beauté et bien-être',
    short: 'Un agenda rempli pendant que vous êtes avec vos clients.',
    targets: 'Salons de coiffure, instituts, spas, onglerie, massage',
    title: 'Remplissez votre agenda pendant que vous êtes déjà avec vos clients',
    subtitle: 'Prise de rendez-vous par téléphone pour votre salon de coiffure ou institut : votre équipe reste concentrée sur l’expérience client, l’agent IA s’occupe des demandes et de l’agenda.',
    problems: [
      'Impossible de répondre au téléphone en pleine prestation.',
      'Les annulations de dernière minute laissent des trous.',
      'Les clientes réservent ailleurs quand personne ne décroche.',
    ],
    handles: ['Choix du soin ou de la prestation', 'Durée et praticien', 'Première visite ou suivi', 'Date et heure', 'Demandes particulières', 'Annulations et reports', 'Relance des réservations non finalisées'],
    benefits: ['Réservations pendant les prestations', 'Moins de créneaux vides', 'Annulations gérées', 'Orientation vers le bon soin', 'Relances automatiques'],
    photo: '/photos/beaute-bien-etre.jpg',
    photoAlt: 'Esthéticienne préparant une cabine de soin dans un institut',
    caption: 'Votre équipe reste concentrée sur l’expérience client. L’agent IA s’occupe des demandes et de l’agenda.',
    modules: ['prise-de-rendez-vous', 'whatsapp-messages', 'widget-web', 'campagnes-sortantes', 'receptionniste-ia', 'base-de-connaissances'],
    steps: [
      { title: 'La cliente appelle ou écrit', text: 'Par téléphone, WhatsApp ou depuis votre site.' },
      { title: 'L’agent oriente', text: 'Soin, durée, praticienne.' },
      { title: 'Le rendez-vous est réservé', text: 'Dans votre agenda en ligne.' },
      { title: 'Le rappel part la veille', text: 'Par message, avec possibilité de reporter.' },
    ],
    offer: 'receptionniste',
    ctas: ['Remplir mon agenda', 'Commencer gratuitement'],
    call: [
      { who: 'client', text: 'Bonjour, je voudrais une coupe et un brushing samedi.' },
      { who: 'agent', text: 'Avec plaisir. Avez-vous une préférence de coiffeuse ?' },
      { who: 'client', text: 'Avec Léa si possible.' },
      { who: 'agent', text: 'Léa est disponible samedi à 10 h. Je réserve ?' },
    ],
    lead: [{ label: 'Prestation', value: 'Coupe + brushing' }, { label: 'Durée', value: '1 h' }, { label: 'Praticienne', value: 'Léa' }, { label: 'Créneau', value: 'Samedi 10 h' }],
    faq: [
      { q: 'Peut-on gérer plusieurs praticiennes ?', a: 'Oui. Chaque personne a ses prestations, durées et disponibilités dans l’agenda connecté.' },
      { q: 'Les clientes peuvent-elles réserver par WhatsApp ?', a: 'Oui, avec le forfait Assistant : l’agent répond aussi par écrit et envoie les confirmations sur WhatsApp ou par SMS.' },
      { q: 'L’agent promet-il des résultats ?', a: 'Non. Il reste sur l’organisation : prestations, durées, disponibilités. Il ne fait aucune promesse esthétique ou médicale.' },
    ],
  },
  {
    slug: 'restaurants-hotellerie',
    name: 'Restaurants et hôtellerie',
    short: 'Réservations et questions clients gérées sans interrompre le service.',
    targets: 'Restaurants, brasseries, hôtels, chambres d’hôtes, résidences',
    title: 'Gérez les réservations et les demandes clients sans interrompre le service',
    subtitle: 'La réservation par téléphone de votre restaurant ou hôtel, même en plein service : l’agent IA répond, collecte les détails et transmet uniquement les demandes qui nécessitent votre équipe.',
    problems: [
      'Le téléphone sonne en plein coup de feu.',
      'Les mêmes questions reviennent : horaires, parking, menu.',
      'Les clients étrangers n’obtiennent pas de réponse claire.',
    ],
    handles: ['Date, heure et nombre de couverts', 'Allergies et demandes particulières', 'Liste d’attente', 'Modifications et annulations', 'Dates de séjour et type de chambre', 'Questions fréquentes', 'Réponses en plusieurs langues'],
    benefits: ['Réservations prises pendant le service', 'Liste d’attente mieux gérée', 'Questions fréquentes traitées', 'Moins d’appels à la réception', 'Accueil multilingue si activé'],
    photo: '/photos/restaurants-hotellerie.jpg',
    photoAlt: 'Serveur pendant le service du soir dans une brasserie',
    caption: 'Pendant le service, l’agent IA répond, collecte les détails et transmet uniquement les demandes qui nécessitent votre équipe.',
    modules: ['prise-de-rendez-vous', 'base-de-connaissances', 'whatsapp-messages', 'receptionniste-ia', 'widget-web', 'reporting'],
    steps: [
      { title: 'Le client appelle', text: 'Pour réserver, modifier ou poser une question.' },
      { title: 'L’agent vérifie', text: 'Disponibilités, couverts, demandes particulières.' },
      { title: 'La réservation est confirmée', text: 'Avec un message récapitulatif.' },
      { title: 'Votre équipe est prévenue', text: 'Seulement quand une intervention est nécessaire.' },
    ],
    offer: 'receptionniste',
    ctas: ['Automatiser mes réservations', 'Demander une démonstration'],
    call: [
      { who: 'client', text: 'Avez-vous une table pour quatre ce soir vers 20 h ?' },
      { who: 'agent', text: 'Oui, à 20 h 15 en terrasse ou 20 h 30 en salle.' },
      { who: 'client', text: 'En salle. Une personne est allergique aux fruits à coque.' },
      { who: 'agent', text: 'C’est noté, je l’indique à l’équipe. Réservation confirmée.' },
    ],
    lead: [{ label: 'Couverts', value: '4 personnes' }, { label: 'Heure', value: 'Ce soir 20 h 30' }, { label: 'Note', value: 'Allergie fruits à coque' }, { label: 'Statut', value: 'Confirmée' }],
    faq: [
      { q: 'L’agent connaît-il nos disponibilités ?', a: 'Oui, s’il est relié à votre agenda ou outil de réservation de restaurant. Sinon, il prend la demande et votre équipe confirme.' },
      { q: 'Peut-il répondre en anglais ?', a: 'Oui. Ajoutez des langues secondaires : l’agent détecte la langue de l’appelant et répond dans celle-ci.' },
      { q: 'Et les groupes ou privatisations ?', a: 'L’agent collecte les détails (date, nombre, budget) et transmet la demande à votre équipe pour un devis.' },
    ],
  },
];

export const sectorBySlug = (slug: string) => SECTORS.find((s) => s.slug === slug);
