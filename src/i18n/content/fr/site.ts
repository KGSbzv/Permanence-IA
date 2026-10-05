// Messages transverses (bandeau d’essai, badges, note de prix). Les chiffres viennent du marché.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} jours d’essai gratuit — ${minutes} minutes incluses — prix HT — sans engagement`,
  trialBadges: (days: number, minutes: number) => [`${days} jours d’essai gratuit`, `${minutes} minutes incluses`, 'Prix HT', 'Sans engagement'],
  growthLines: ['Ajoutez des minutes à tout moment', 'Passez à l’offre supérieure quand votre volume grandit'],
  priceNote: 'Prix en dollars US (USD), hors taxes — taxes locales en sus si applicables. Numéro de téléphone dédié en option, facturé au mois.',
  skipToContent: 'Aller au contenu',
  languageLabel: 'Langue',
};
