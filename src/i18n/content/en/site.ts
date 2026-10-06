// Cross-site messages (trial banner, badges, price note). Figures come from the market.
export const SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days}-day free trial — ${minutes} minutes included — prices excl. tax — no commitment, no setup fee`,
  trialBadges: (days: number, minutes: number) => [`${days}-day free trial`, `${minutes} minutes included`, 'Nothing charged during the trial', 'No commitment', 'No setup fee'],
  growthLines: ['Add minutes at any time', 'Move up a plan when your volume grows'],
  priceNote: (numberFrom: string) => `Prices in US dollars (USD), excl. tax — local taxes added where applicable. Dedicated number from ${numberFrom} excl. tax per month, depending on the country.`,
  skipToContent: 'Skip to content',
  languageLabel: 'Language',
  payg: (rate: string) => `Not ready for a plan? Pay as you go: ${rate} excl. tax per minute, no subscription. Add credit whenever you like (Add credits); it never expires. A plan costs less as soon as your calls are regular.`,
  talkNow: 'Talk to our agent right now',
  talkNowSub: 'Live demo, free, no sign-up',
  rechargeFreeAmount: 'You choose the amount: enter it in your customer area (Add credits). The amounts above are examples.',
};
