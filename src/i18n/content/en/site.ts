// Cross-site messages (trial banner, badges, price note). Figures come from the market.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days}-day free trial — ${minutes} minutes included — prices excl. tax — no commitment`,
  trialBadges: (days: number, minutes: number) => [`${days}-day free trial`, `${minutes} minutes included`, 'Prices excl. tax', 'No commitment'],
  growthLines: ['Add minutes at any time', 'Move up a plan when your volume grows'],
  priceNote: 'Prices in US dollars (USD), excl. tax — local taxes added where applicable. A dedicated phone number is optional and billed monthly.',
  skipToContent: 'Skip to content',
  languageLabel: 'Language',
  rechargeFreeAmount: 'You choose the amount: enter it in your customer area (Add credits). The amounts above are examples.',
};
