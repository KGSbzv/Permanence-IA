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
  consent: { title: 'Measurement cookies', text: 'With your consent, we use cookies to measure visits to the site (Google Analytics) and how well our ads perform on Facebook and Instagram (Meta Pixel). Nothing is set without your consent, and declining won’t stop you using the site.', accept: 'Accept', reject: 'Decline', policy: 'Learn more', manage: 'Manage cookies' },
  keepNumber: { title: 'You keep your number', text: 'No change of provider or equipment: a simple call forward, permanent or only when you don’t answer, and the agent takes over.' },
  fxNote: (date: string) => `Local-currency amounts are indicative, at the ECB reference rate of ${date}. Plans are billed in US dollars: the amount charged depends on your bank’s exchange rate on the day of payment.`,
  whatsapp: { cta: 'Message us on WhatsApp', note: 'Our AI agent replies instantly, 24/7, in your language.', prefill: 'Hello, I’d like to know more about PermanenceAI.', optIn: 'Also send me the callback confirmation on WhatsApp', tryTitle: 'Try it now on WhatsApp', tryText: 'Send us a message: our own AI agent replies, exactly as yours will reply to your customers. Ask it anything or request a callback.', startersIntro: 'Pick a topic: the chat opens in WhatsApp and our AI agent replies right away.', starters: [{ label: 'Discover the service', text: 'Hello, I’m looking into PermanenceAI and would like to know how it works for my business.' }, { label: 'Choose a plan', text: 'Hello, I’d like some advice on choosing the right plan.' }, { label: 'Trial or demo', text: 'Hello, I’d like to try the agent or get a demo.' }, { label: 'I’m a customer', text: 'Hello, I’m already a customer and I need some help.' }] },
};
