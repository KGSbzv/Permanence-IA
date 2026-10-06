// Messages transverses (bandeau d’essai, badges, note de prix). Les chiffres viennent du marché.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} jours d’essai gratuit — ${minutes} minutes incluses — prix HT — sans engagement`,
  trialBadges: (days: number, minutes: number) => [`${days} jours d’essai gratuit`, `${minutes} minutes incluses`, 'Rien n’est débité pendant l’essai', 'Sans engagement'],
  growthLines: ['Ajoutez des minutes à tout moment', 'Passez à l’offre supérieure quand votre volume grandit'],
  priceNote: (numberFrom: string) => `Prix en dollars US (USD), hors taxes — taxes locales en sus si applicables. Acquisition d’un numéro dédié à partir de ${numberFrom} HT par mois, selon le pays.`,
  skipToContent: 'Aller au contenu',
  languageLabel: 'Langue',
  rechargeFreeAmount: 'Le montant est libre : saisissez-le dans votre espace (Add credits). Les montants ci-dessus sont des exemples.',
};
