// Interface text for the sales pages: home, pricing, plans, top-ups, sectors,
// features, integrations. Figures (prices, minutes, trial days) and the brand
// come in as parameters from the market (src/i18n/markets.ts): never write them here.
//
// Titles with a highlighted keyword are split into { before, kw, after }: `kw` is shown in colour.

// SEO title per sector (see docs/seo/keywords-en.md), found from the display name. Keep it at
// 45 characters or fewer so the " · Brand" suffix stays within 60. Unknown names fall back to a generic title.
const SECTOR_SEO_TITLE: Record<string, string> = {
  'Home services': 'AI receptionist for trades, 24/7',
  'Dental practices and clinics': 'AI receptionist for dental practices',
  'Physio and allied health': 'AI receptionist for physios & allied health',
  'Veterinary practices': 'AI receptionist for vet clinics',
  'Real estate': 'AI receptionist for estate agents',
  'Garages and automotive': 'AI receptionist for garages',
  'Hair salons and barbers': 'AI receptionist for hair salons & barbers',
  'Beauty and wellbeing': 'AI receptionist for beauty salons & spas',
  'Restaurants and hospitality': 'AI phone bookings for restaurants',
  'Law firms and accountants': 'AI receptionist for law firms & accountants',
};

/** Workplace per sector, for "What it changes for your …". */
const SECTOR_PLACE: Record<string, string> = {
  immobilier: 'agency', 'dentaire-cliniques': 'practice', 'kines-paramedical': 'clinic', 'cliniques-veterinaires': 'practice',
  automobile: 'garage', 'salons-de-coiffure': 'salon', 'beaute-bien-etre': 'salon', 'restaurants-hotellerie': 'venue',
  'avocats-experts-comptables': 'firm', 'e-commerce': 'shop', 'courtiers-assurance-credit': 'brokerage',
  'gestion-locative': 'agency', 'medecine-esthetique': 'clinic',
};

export const UI_COMMERCE = {
  home: {
    meta: {
      title: (brand: string) => `AI Receptionists that answer every call | ${brand}`,
      description: (days: number, minutes: number) =>
        `AI receptionist and 24/7 phone answering service for small businesses: calls answered, qualified and booked. Try it free for ${days} days, ${minutes} min included.`,
    },
    hero: {
      title: { before: 'AI Receptionists that ', kw: 'answer every call', after: '.' },
      intro: 'An AI phone answering service for small businesses: voice agents that pick up every call, ask the right questions, book appointments and send you a clear summary. Available 24/7, set up for your trade, live in a few minutes.',
      photoAlt: 'Business owner reading a call summary on her phone',
    },
    showcase: { title: 'See the agent at work in your trade', intro: 'Choose a sector: the call plays out, then the request arrives ready to handle.' },
    benefits: { title: 'What the agent does for your business', intro: 'A virtual receptionist trained on your business, working when your team can’t pick up.' },
    features: {
      booking: {
        title: { before: 'Automate ', kw: 'appointment booking and reminders', after: '' },
        text: 'Practices, salons, garages, agencies: the agent connects to your calendar, offers free slots, books and confirms. Rescheduling and cancellations included.',
        points: ['Live calendar: Google Calendar, Outlook and more, through Cal.com or Calendly', 'Confirmation by SMS or WhatsApp (from the Assistant plan)', 'Reminder the day before the appointment (from the Assistant plan)'],
        link: 'See appointment booking',
      },
      support: {
        title: { before: 'Answer ', kw: 'your customers’ questions', after: ' with no waiting' },
        text: 'The agent relies on your documents, web pages and procedures. It answers accurately, and transfers anything that needs a person to your team.',
        points: ['Knowledge base: PDFs, website, data', 'Several calls at once, with no queue', 'Transfer to a person based on your rules'],
        link: 'See customer support',
      },
      leads: {
        title: { before: 'Qualify and ', kw: 'call back your prospects', after: ' faster' },
        text: 'A form completed on your website becomes a call within minutes. The agent qualifies, follows up and prepares a record your team can act on straight away.',
        points: ['Pre-qualification on your criteria', 'Automatic follow-ups and confirmations', 'Campaigns to contacts who have given consent'],
        link: 'See lead qualification',
      },
    },
    useCases: { title: 'An agent for every type of call', intro: 'Inbound, outbound or messages: turn on the uses your business needs.' },
    platform: {
      title: 'The complete platform to automate your calls',
      intro: 'Everything is included: voice, intelligence, telephony, automations and reports, in one place.',
      link: 'All features',
    },
    steps: {
      title: 'Up and running in four steps',
      intro: 'You don’t need any technical expertise. We support you at every step.',
      items: (days: number, minutes: number) => [
        { title: 'Create your account', text: `Choose your plan: ${days} days free, ${minutes} minutes included, nothing charged during the trial.` },
        { title: 'Describe your business', text: 'Services, opening hours, common questions, transfer rules.' },
        { title: 'Test the agent', text: 'Listen to it in the live demo and adjust the tone and answers.' },
        { title: 'Connect your calls', text: 'Forward your line, get a new number or use SIP, and add the widget to your website.' },
      ],
    },
    sectors: {
      title: 'Agents tailored to your trade',
      intro: 'Fourteen trades where every missed call costs a customer. Your AI receptionist asks the right questions for each one.',
      link: 'All sectors',
    },
    integrations: {
      title: 'Connected to your tools',
      intro: 'Calendar, CRM, messaging, telephony: the agent works with what you already use. Our no-code automations connect over 300 tools, in the same way as Zapier or Make.',
      link: 'See all integrations',
    },
    pricing: {
      title: 'Clear plans, prices excl. tax',
      intro: 'Choose based on your call volume. The bigger the plan, the less each minute costs.',
      compare: 'Compare all included features',
    },
    faq: {
      title: 'Frequently asked questions',
      intro: 'Can’t find your answer? Leave your number and an adviser will call you back.',
      link: 'All questions',
    },
  },

  tarifs: {
    meta: {
      title: (brand: string) => `AI receptionist pricing — plans and top-ups · ${brand}`,
      /** One plan in the description: `price` and `minutes` already formatted. */
      annualOffer: (name: string) => `${name} (annual billing)`,
      plan: (name: string, price: string, minutes: string) => `${name} ${price}/${minutes} min`,
      description: (plans: string[], days: number, minutes: number) =>
        `AI receptionist plans excl. tax: ${plans.join(', ')}. Try it free for ${days} days, ${minutes} min included.`,
    },
    hero: {
      title: 'AI receptionist pricing: choose the plan that fits your call volume',
      intro: (days: number, minutes: number) =>
        `All prices are shown excluding tax. The bigger the plan, the less each minute costs. The free trial includes ${days} days and ${minutes} minutes of calls.`,
      moreMinutes: 'Need more minutes? Add a top-up at any time.',
    },
    matrix: {
      title: 'What’s included in your interface',
      intro: 'Each row matches a page or feature you will find in your customer area. Nothing else is hidden behind a button.',
    },
    recharges: {
      title: 'Need more minutes?',
      intro: 'A top-up covers a busy month. For regular volume, the next plan up is still the most economical option.',
      link: 'How top-ups work',
    },
    // "Written messages" box: costs taken from the credit settings of the customer area.
    messageCredits: {
      title: 'Written messages: prices in credits',
      intro: 'Written AI replies and messages sent (website chat, WhatsApp, Messenger, Instagram, SMS) are deducted from your message credit balance.',
      usageCol: 'Use',
      costCol: 'Cost in credits',
      rows: [
        { label: 'Written AI reply (website chat, WhatsApp, Messenger, Instagram)', cost: '3 credits' },
        { label: 'WhatsApp message received or sent within a session', cost: '1.4 credits' },
        { label: 'WhatsApp template message', cost: 'Meta rate by country and category, plus a margin' },
        { label: 'SMS sent', cost: '2 credits' },
        { label: 'WhatsApp call', cost: 'Billed in minutes' },
      ],
      smsNote: 'The cost of an SMS may vary by carrier or country.',
      getTitle: 'Getting credits',
      included: 'Included every month in your plan:',
      includedValue: (credits: string, replies: string) => `${credits} credits / month (≈ ${replies} replies)`,
      convert: 'Or convert minutes from your customer area: 1 minute = 9 credits.',
      balance: 'You can check your balance in the customer area. At 0 credits, written replies and SMS or WhatsApp sending stop until you top up.',
    },
    faq: {
      title: 'Questions about pricing',
      intro: 'Not sure which AI answering service plan suits you? Request a callback, or try the agent live.',
      primary: 'Start for free',
      demo: 'See the live demo',
    },
    finalCta: (_minutes: number) => 'Start for free',
  },

  offer: {
    metaTitleTrial: (days: number, minutes: number, brand: string) => `${days}-day free AI receptionist trial — ${minutes} min · ${brand}`,
    /** `monthly`: adds "excl. tax / month" when the price is a monthly amount. */
    metaTitle: (name: string, price: string, monthly: boolean, brand: string) => `${name} plan — ${price}${monthly ? ' excl. tax / month' : ''} · ${brand}`,
    metaDescription: (title: string, days: number, minutes: number) => `${title}. Prices excl. tax, no commitment. Try it free for ${days} days, ${minutes} min included.`,
    breadcrumb: 'Pricing',
    productName: (brand: string, name: string) => `${brand} ${name}`,
    eyebrow: (name: string, audience: string) => `${name} plan · ${audience}`,
    demo: 'Try our agent live',
    perMonth: 'excl. tax / month',
    orAnnual: (price: string) => `or ${price} / year excl. tax (2 months free)`,
    perMinuteLine: (perMinute: string) => `that’s ${perMinute} within the plan`,
    facts: {
      minutes: 'Included minutes',
      more: 'Need more?',
      moreCustom: 'Negotiated volume',
      moreDefault: 'Top up at any time',
      commitment: 'Commitment',
      commitmentValue: 'None',
    },
    included: {
      title: 'What you get in your interface',
      intro: 'The exact list of features available with this plan.',
      notIncluded: 'Not included',
      includedLabel: 'Included',
      compare: 'Compare with the other plans',
    },
    modules: { title: 'The core modules of this plan' },
    extra: {
      title: 'Extra minutes',
      intro: 'A busier month? Add a top-up. Growing volume? Move up a plan.',
    },
    others: { title: 'Other plans' },
    faq: { title: 'Frequently asked questions' },
  },

  recharges: {
    meta: {
      title: (brand: string) => `AI receptionist minute top-ups · ${brand}`,
      description: (price: string, minutes: string) =>
        `Extra minutes for your AI receptionist: top-ups from ${price} excl. tax for ${minutes} minutes. Add credit at any time from your customer area.`,
    },
    hero: {
      title: 'Add minutes at any time',
      intro: 'A top-up covers a busier month. If you top up often, the next plan up becomes more economical: we will let you know.',
    },
    how: {
      title: 'How it works',
      steps: (min: string, max: string) => [
        { title: 'Track your usage', text: 'Your dashboard shows the minutes used and remaining.' },
        { title: 'Add credit', text: `A top-up from ${min} to ${max}, in one click from your customer area.` },
        { title: 'Carry on without interruption', text: 'Credit pays for minutes beyond your plan and never expires.' },
      ],
    },
  },

  sectorsIndex: {
    meta: {
      title: (brand: string) => `AI receptionists by industry · ${brand}`,
      description: 'AI receptionist for trades, dentists, physios, vets, estate agents, garages, hair and beauty salons, restaurants, law firms and accountants.',
    },
    hero: {
      title: 'An AI receptionist tailored to your trade',
      intro: 'We have chosen fourteen trades where calls come in when teams are busy, and where every missed enquiry costs a customer. From a plumber’s emergency line to a physio clinic’s front desk, from the barber shop to the law firm, the agent asks the right questions.',
    },
    other: {
      title: 'Your business isn’t on the list?',
      intro: 'Driving schools, gyms, training providers, recruitment, tourism: the agent can be set up for any business that receives calls. Let’s talk about your case.',
      primary: 'Start for free',
      demo: 'Try our agent live',
    },
  },

  sector: {
    meta: {
      title: (name: string, brand: string) => `${SECTOR_SEO_TITLE[name] ?? `${name} AI receptionist`} · ${brand}`,
      /** `short` is the sector's short sentence (it already carries the sector keyword), without a final full stop. `name` is kept for the shared signature. */
      description: (name: string, short: string, days: number, minutes: number) =>
        `${short}. Try it free for ${days} days, ${minutes} min included.`,
    },
    breadcrumb: 'Sectors',
    liveCallTitle: (name: string) => `${name} agent`,
    change: {
      title: 'What changes when an AI receptionist answers for you',
      intro: (targets: string) => `${targets}. In your trade, every unanswered call is an enquiry that goes elsewhere.`,
    },
    handles: {
      title: 'What the agent handles for your business',
      intro: 'It asks the questions you would ask, in a natural order, and sends you a complete request.',
    },
    /** Benefits title: the trade's workplace (agency, practice, salon…), "business" by default. */
    benefitsTitle: (slug: string) => `What it changes for your ${SECTOR_PLACE[slug] ?? 'business'}`,
    how: { title: 'How it works' },
    includes: { title: 'What’s included', intro: 'The most useful modules for your trade, all available in your customer area.' },
    integrations: {
      title: 'Useful integrations',
      intro: 'Your calendar, CRM, messaging and telephony stay the same: the agent connects to them.',
    },
    pricing: {
      title: 'Prices excl. tax, no commitment, no setup fee',
      intro: (sectorName: string, offerName: string, days: number, minutes: number) =>
        `For the ${sectorName.toLowerCase()} sector, we recommend the ${offerName} plan. Start with the free trial: ${days} days and ${minutes} minutes included.`,
      link: (offerName: string) => `See the ${offerName} plan details`,
    },
    faq: { title: (name: string) => `Frequently asked questions — ${name}` },
    callback: {
      title: 'Get in touch: leave your number and we’ll call you back',
      text: 'An adviser will call you back to look at your case.',
    },
    others: { title: 'Other sectors' },
    finalCta: 'Ready to stop missing calls?',
  },

  featuresIndex: {
    meta: {
      title: (brand: string) => `AI receptionist software features · ${brand}`,
      description: 'AI receptionist software: call answering, appointment booking, lead qualification, WhatsApp, knowledge base, SIP, reporting and more. Try it free.',
    },
    hero: {
      title: 'Everything you need to automate your calls',
      intro: 'Fourteen modules of AI phone answering software, turned on according to your plan, from your customer area.',
    },
    overview: { title: 'Overview' },
  },

  feature: {
    meta: {
      title: (name: string, brand: string) => `${name} — AI phone answering · ${brand}`,
      /** `short` is the module's benefit sentence, without a final full stop. */
      description: (short: string, offerName: string, days: number) => `${short}. Included from the ${offerName} plan. Try it free for ${days} days.`,
    },
    breadcrumb: 'Features',
    eyebrow: (family: string, name: string) => `${family} · ${name}`,
    uses: { title: 'What it’s for' },
    from: {
      title: (offerName: string) => `Included from the ${offerName} plan`,
      /** `price` already formatted in the market currency. */
      priceLine: (price: string, minutes: string) => `${price} excl. tax / month · ${minutes}`,
      offerLink: (offerName: string) => `See the ${offerName} plan`,
      compare: 'Compare plans',
    },
    how: { title: 'How it works' },
    cases: { title: 'Use cases' },
    integrations: { title: 'Related integrations', link: 'All integrations' },
    more: { title: 'You might also like' },
  },

  integrations: {
    tools: { title: '300+ tools through automations', intro: 'With the automation platform (from the Assistant plan), every call can feed your tools: email, team chat, CRM, online shop, payments, spreadsheets. Here are a few.' },
    meta: {
      title: (brand: string) => `AI receptionist integrations: CRM, calendar · ${brand}`,
      description: 'Connect your AI receptionist to Google Calendar, Outlook, Calendly, HubSpot, Zoho, WhatsApp, SIP and over 300 tools without code. See all integrations.',
    },
    hero: {
      title: 'Connected to the tools you already use',
      intro: 'Calendar, CRM, messaging, telephony: your AI receptionist fits into the way you work, and no-code automations connect over 300 tools.',
    },
    flow: {
      title: { before: 'Build your automations ', kw: 'without code', after: '' },
      text: 'A completed form, a finished call, a new lead: each event can trigger a series of actions in your tools, in the same way as Zapier or Make, straight from your customer area.',
      points: ['Over 300 tools available', 'Drag and drop, no development', 'Tests before activation'],
      link: 'See automated workflows',
    },
    api: {
      title: { before: 'Webhooks and API for ', kw: 'your systems', after: '' },
      text: 'On every plan, receive every completed call and its extracted data in your own systems, or control the agent from your software.',
      points: ['Webhook after every call', 'Extracted variables: outcome, interest, time slot', 'Mid-call tools, from the Assistant plan'],
    },
  },
};
