// Messages transverses (bandeau d’essai, badges, note de prix). Les chiffres viennent du marché.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} jours d’essai gratuit — ${minutes} minutes incluses — prix HT — sans engagement ni frais de mise en service`,
  trialBadges: (days: number, minutes: number) => [`${days} jours d’essai gratuit`, `${minutes} minutes incluses`, 'Rien n’est débité pendant l’essai', 'Sans engagement', 'Sans frais de mise en service'],
  growthLines: ['Ajoutez des minutes à tout moment', 'Passez au forfait supérieur quand votre volume grandit'],
  priceNote: (numberFrom: string) => `Prix en dollars US (USD), hors taxes — taxes en sus le cas échéant. Numéro dédié en option, à partir de ${numberFrom} HT par mois selon le pays.`,
  skipToContent: 'Aller au contenu',
  languageLabel: 'Langue',
  payg: (rate: string) => `Pas encore prêt pour un forfait ? Payez à la consommation : ${rate} HT la minute, sans abonnement. Vous ajoutez du crédit quand vous voulez (Add credits) ; il n’expire pas. Un forfait revient moins cher dès que vos appels sont réguliers.`,
  talkNow: 'Parlez à notre agent maintenant',
  talkNowSub: 'Démo en direct, gratuite, sans inscription',
  rechargeFreeAmount: 'Le montant est libre, à partir de 5 $ : saisissez-le dans votre espace (Add credits). Les montants ci-dessus sont des exemples.',
  consent: { title: 'Cookies de mesure', text: 'Avec votre accord, nous utilisons des cookies pour mesurer l’audience du site (Google Analytics) et l’efficacité de nos publicités sur Facebook et Instagram (pixel Meta). Rien n’est déposé sans votre accord, et refuser n’empêche pas d’utiliser le site.', accept: 'Accepter', reject: 'Refuser', policy: 'En savoir plus', manage: 'Gérer les cookies' },
  keepNumber: { title: 'Vous gardez votre numéro', text: 'Aucun changement d’opérateur ni de matériel : un simple renvoi d’appel, permanent ou seulement quand vous ne répondez pas, et l’agent prend le relais.' },
  fxNote: (date: string) => `Montants en devise locale donnés à titre indicatif, au taux de référence de la BCE du ${date}. Les forfaits sont facturés en dollars US : le montant débité dépend du taux de change de votre banque le jour du paiement.`,
  whatsapp: { cta: 'Écrire sur WhatsApp', note: 'Notre agent IA répond tout de suite, 24 h/24, dans votre langue.', prefill: 'Bonjour, je souhaite en savoir plus sur Permanence IA.', optIn: 'Recevoir aussi la confirmation du rappel sur WhatsApp', tryTitle: 'Testez-le maintenant sur WhatsApp', tryText: 'Écrivez-nous : c’est notre propre agent IA qui vous répond, exactement comme le vôtre répondra à vos clients. Posez-lui vos questions ou demandez un rappel.', startersIntro: 'Choisissez un sujet : la conversation démarre sur WhatsApp, notre agent IA vous répond aussitôt.', starters: [{ label: 'Découvrir le service', text: 'Bonjour, je découvre Permanence IA et j’aimerais savoir comment ça marche pour mon activité.' }, { label: 'Choisir un forfait', text: 'Bonjour, j’aimerais un conseil pour choisir le bon forfait.' }, { label: 'Essai ou démo', text: 'Bonjour, j’aimerais essayer l’agent ou recevoir une démo.' }, { label: 'Je suis client', text: 'Bonjour, je suis déjà client et j’ai besoin d’aide.' }] },
};
