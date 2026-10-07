// Interface text for shared components (src/components). Figures (prices, minutes, trial days)
// and the brand are passed as parameters: they come from the market (src/i18n/markets.ts).

/** Some callers pass names already lowercased: restore the initial capital where a label starts with them. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const UI_COMPONENTS = {
  layout: {
    home: 'Home',
    freeTrial: 'Start for free',
    callMeBack: 'Get a call back',
  },

  navbar: {
    menus: {
      features: 'Features',
      allFeatures: 'All features',
      allFeaturesText: 'Overview of the modules and plans.',
      sectors: 'Sectors',
      allSectors: 'All sectors',
      resources: 'Resources',
    },
    resources: {
      demo: 'Live demo',
      integrations: 'Integrations',
      security: 'Security and compliance',
      faq: 'FAQs',
      help: 'Customer area help',
      about: 'About',
      contact: 'Contact and callback',
    },
    pricing: 'Pricing',
    login: 'Log in',
    startFree: 'Start for free',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  footer: {
    tagline: 'AI voice agents that answer, qualify, book and call back for your business, 24/7.',
    startFree: 'Start for free',
    login: 'Log in',
    gdpr: 'Built-in data protection tools',
    encryption: 'Encryption in transit',
    cols: {
      platform: 'Platform',
      allFeatures: 'All features',
      offers: 'Plans',
      recharges: 'Minute top-ups',
      compare: 'Compare plans',
      sectors: 'Sectors',
      resources: 'Resources',
    },
    resources: {
      demo: 'Live demo',
      integrations: 'Integrations',
      faq: 'FAQs',
      help: 'Customer area help',
      about: 'About',
      security: 'Security and compliance',
      contact: 'Contact',
    },
    copyright: (year: number, brand: string, company: string) => `© ${year} ${brand} — a brand of ${company}. Prices shown excl. tax.`,
    legal: {
      notice: 'Legal notice',
      terms: 'Terms and conditions',
      privacy: 'Privacy',
      cookies: 'Cookies',
      accessibility: 'Accessibility',
    },
  },

  callbackModal: {
    titleSupport: 'Request a support callback',
    titleCommercial: 'Leave your number and we’ll call you back',
    intro: 'Choose a time and we call you back.',
    close: 'Close',
  },

  trialNudge: {
    title: (minutes: string) => `Your first ${minutes} minutes are free`,
    close: 'Close',
    text: (days: number) => `Test your voice agent on your real calls for ${days} days before you decide.`,
    points: ['Card requested at activation, nothing charged during the trial', 'Cancel from your customer area', 'First agent ready in a few minutes'],
    claim: (_minutes: string) => 'Start for free',
    callMeBack: 'Get a call back',
  },

  liveCall: {
    title: 'Reception agent',
    leadTitle: 'Request created',
    ariaLabel: 'Example of a call handled by the agent',
    ended: 'Call ended · summary sent',
    ongoing: 'Call in progress',
  },

  trialBadges: {
    ariaLabel: 'Trial terms',
  },

  ctas: {
    primary: 'Start for free',
    demo: 'Try our agent live',
    callback: 'Get a call back',
  },

  callbackForm: {
    submit: 'Get a call back',
    consentRequired: 'Tick the box to agree to be called back.',
    sendFailed: 'Your request could not be sent.',
    retry: (email: string) => `Please try again or email ${email}.`,
    sentTitle: 'Callback request sent',
    sentText: 'We will call you back at the time you chose. If you ticked WhatsApp, the confirmation will arrive there.',
    name: 'Name',
    phone: 'Phone',
    sector: 'Sector',
    choose: 'Choose…',
    otherSector: 'Other business',
    when: 'When should we call you?',
    slots: {
      asap: 'As soon as possible',
      todayAfternoon: 'This afternoon',
      tomorrowMorning: 'Tomorrow morning',
      tomorrowAfternoon: 'Tomorrow afternoon',
      precise: 'At a specific day and time',
    },
    preciseLabel: 'Date and time (your local time)',
    email: 'Email',
    emailHint: '(optional)',
    need: 'What you need',
    needPlaceholder: 'E.g. I miss calls in the evening, I want to automate bookings…',
    consent: (brand: string) => `I agree to be called back on the number provided, including by a ${brand} AI voice agent. My data is used only to handle my request.`,
    sending: 'Sending…',
    company: 'Company',
    optional: '(optional)',
    volume: 'Calls received per month',
    volumeOptions: ['Fewer than 200', '200 to 1,000', 'More than 1,000'],
    phoneInvalid: 'Please enter a valid phone number, e.g. 07700 900123 (UK) or 0412 345 678 (Australia).',
  },

  benefits: {
    items: [
      { title: 'Answer even out of hours', text: 'Evenings, weekends, during your appointments: every call gets an answer.' },
      { title: 'Qualify automatically', text: 'The agent asks your questions and sends you a complete request.' },
      { title: 'Book appointments', text: 'Straight into your calendar, with confirmation and a reminder.' },
      { title: 'Call leads back faster', text: 'A completed form becomes a call within minutes.' },
      { title: 'Keep people for what matters', text: 'Transfer to your team when the situation calls for it.' },
    ],
    seeAgent: 'See the agent in detail',
  },

  moduleCards: {
    seeIncluded: 'See what’s included',
  },

  includesSchema: {
    // Same order as the component's icons: telephony, automation, CRM, messages, calendar, management, security.
    families: [
      { name: 'Telephony', items: ['Inbound and outbound calls', 'Optional dedicated number', 'SIP integration', 'Transfer to a person', 'Caller identification'] },
      { name: 'Automation', items: ['Prompt editor', 'No-code automated workflows', 'Automation assistant', '300+ tools you can connect'] },
      { name: 'CRM and data', items: ['Leads and pre-qualification', 'Knowledge base', 'Call history', 'Webhooks and API'] },
      { name: 'Messages', items: ['SMS', 'WhatsApp and templates', 'Messenger and Instagram', 'Web widget'] },
      { name: 'Calendar', items: ['Appointment booking', 'Confirmations and reminders', 'Rescheduling and cancellations'] },
      { name: 'Management', items: ['Dashboard', 'Detailed reports', 'Roles and permissions'] },
      { name: 'Security', items: ['Consent and opt-out', 'Configurable retention', 'Encryption', 'Activity log'] },
    ],
    centerTitle: 'Your AI voice agent',
    centerText: 'At the centre: an agent set up for your business. Around it: everything it can use.',
    perOffer: 'See what’s included in each plan',
  },

  steps: {
    step: (n: number) => `Step ${n}`,
  },

  demoBlock: {
    title: 'Try our agent live now',
    intro: 'Talk to the agent from your browser, or have it ring your own phone: 30 seconds is enough to judge the voice and how it handles an enquiry from your sector.',
    launchTitle: 'Start the live demo',
    launchText: 'A real conversation, nothing to install.',
    callbackTitle: 'Call me back',
    callbackText: 'The agent calls you at the time you choose.',
    formTitle: 'Get a demo call',
    formText: 'Free, no commitment. You hear the voice and how the agent qualifies a request.',
    submit: 'Call me back',
  },

  sectorCards: {
    seePage: (sectorLower: string) => `See the ${sectorLower} page`,
  },

  pricingCards: {
    daysFree: (days: number) => `${days} days free`,
    negotiated: 'Negotiated per-minute price',
    mostChosen: 'Recommended',
    perMinute: (label: string) => `that’s ${label}`,
    details: 'Plan details',
    billing: 'Billing period',
    monthly: 'Monthly',
    annual: 'Annual',
    twoMonthsFree: '2 months free',
    billedYearly: (price: string) => `billed ${price} per year, excl. tax`,
    save: (amount: string) => `save ${amount}`,
    phoneNumber: (price: string) => `+ dedicated number from ${price} / month`,
  },

  matrix: {
    included: 'Included',
    notIncluded: 'Not included',
    caption: 'Features included in each plan',
    inYourInterface: 'In your interface',
    pricePerMonthAnnual: 'Price excl. tax / month (billed annually)',
    pricePerMonth: 'Price excl. tax / month',
    includedMinutes: 'Included minutes',
    extraMinute: 'Extra minute',
    phoneNumber: 'Dedicated phone number',
    phoneNumberFrom: (price: string) => `from ${price} / month`,
    showAll: (n: number) => `Show all features (${n})`,
    showLess: 'Collapse the comparison',
    legendIncluded: 'Included',
    legendNotIncluded: 'Not included',
    legendLimit: 'Number = plan limit',
  },

  includedStack: {
    title: 'Everything included, zero API keys',
    intro: 'The best AI models, voices and transcription engines are already plugged into your customer area. No account to open with each provider, no keys to copy, just one invoice.',
    groups: [
      { key: 'llm', title: 'Language models', text: 'The agent’s brain: it understands the request and decides how to respond.' },
      { key: 's2s', title: 'Real-time voice', text: 'Models that listen and speak directly, for the most natural conversations.' },
      { key: 'tts', title: 'Text-to-speech', text: 'Hundreds of natural voices, in more than 80 languages.' },
      { key: 'stt', title: 'Transcription', text: 'Fast speech recognition, even over the phone.' },
      { key: 'channels', title: 'Channels', text: 'The same agent answers wherever your customers message or call you.' },
    ],
    noKeys: ['No API keys to manage', 'Switch model or voice in one click', 'One invoice, in US dollars excl. tax'],
    note: 'Brands are mentioned for descriptive purposes only: they belong to their respective owners and refer to the technologies available in the customer area, with no partnership with these companies. The list evolves with the platform.',
    channelNames: { phone: 'Phone', sip: 'SIP', widget: 'Web widget', email: 'Email' },
  },

  recharges: {
    title: 'Credit top-ups',
    text: 'Credit pays for minutes beyond your plan. It never expires and is added immediately.',
    rechargeCol: 'Top-up excl. tax',
    approxMinutes: (n: string) => `≈ ${n} min`,
    cheaperTitle: 'A plan is still cheaper',
    cheaperText: 'An included minute always costs less than an extra minute.',
    included: 'Included:',
    extra: (price: string) => ` · extra: ${price} excl. tax / min`,
  },

  growthBlock: {
    rules: [
      { title: 'Slightly over, once', text: 'A top-up is enough to finish the month.' },
      { title: 'Over again and again', text: 'We suggest the next plan up.' },
      { title: 'Frequent top-ups', text: 'Your dashboard shows you that you are paying too much for your usage.' },
    ],
    ruleCustom: (minutes: string) => `Over ${minutes} min regularly`,
    ruleCustomText: 'We build a custom plan.',
    case1Minutes: (minutes: string) => `${minutes} min this month`,
    case1Plan: (plan: string) => `${plan} + a credit top-up`,
    case1Note: (price: string, extraMinutes: string, extraPrice: string, total: string) =>
      `${price} + ${extraMinutes} min × ${extraPrice} ≈ ${total} excl. tax. A one-off overage: a top-up is enough.`,
    case2Minutes: (minutes: string) => `${minutes} min every month`,
    case2Plan: (plan: string) => `Move up to the ${plan} plan`,
    case2Note: (price: string, minutes: string, total: string, smallerPlan: string) =>
      `${price} excl. tax for ${minutes} min, compared with ≈ ${total} with ${smallerPlan} + extra minutes. Cheaper, with room to spare.`,
    case3Minutes: (minutes: string) => `${minutes} min regularly`,
    case3Plan: 'Custom plan',
    case3Note: (plan: string) => `Beyond the ${plan} plan, we negotiate a per-minute price suited to your volume.`,
    title: 'Add minutes or change plan, at the right time',
    intro: 'We tell you when a top-up is enough and when the next plan up becomes cheaper.',
    customerAt: 'A customer at',
  },

  planFor: {
    oneOffRecharge: ' + one-off top-up',
    rechargeOrCustom: ' + top-up, or custom if regular',
  },

  economy: {
    title: 'Work out your return on investment',
    intro: 'Enter your call volume: the calculator picks the cheapest plan for that volume, shows the real per-minute price and compares it with the cost of a human receptionist.',
    calculator: 'Return on investment calculator',
    yourCalls: 'Your calls',
    yourCosts: 'Your reception today',
    callsPerMonth: 'Calls per month',
    avgDuration: 'Average call length',
    hourlyCost: 'Hourly cost of an employee (incl. employer costs)',
    missedRate: 'Calls missed today',
    customerValue: 'Average value of a new customer',
    min: ' min',
    perHour: ' / hr',
    minutesMonth: 'Minutes per month',
    bestPlan: 'Cheapest plan for this volume',
    planCost: (plan: string) => `${plan} cost`,
    withExtra: (minutes: string, price: string) => `including ${minutes} extra min at ${price}`,
    customAbove: (minutes: string) => `Above ${minutes} min regularly, ask us for a custom plan.`,
    effectivePerMinute: 'Real price per minute',
    humanCost: 'Cost of a human receptionist',
    savings: 'Monthly saving',
    noSavings: 'At this volume, the agent costs slightly more than a person, but it answers 24/7 and handles calls in parallel.',
    recovered: 'Revenue recovered (estimate)',
    recoveredDetail: (calls: string) => `${calls} missed calls recovered per month`,
    netBenefit: 'Estimated monthly benefit',
    roi: (x: string) => `Return: ${x} times the plan price`,
    perMonth: ' / month',
    assumptions: (wrapUp: number, conversion: number) =>
      `Assumptions: ${wrapUp} min of wrap-up work after each call for an employee, ${conversion}% of missed calls become customers. Prices excl. tax in US dollars; phone number extra. Indicative estimate, to compare with your own figures.`,
    cta: 'Try it free',
  },

  humanVsAi: {
    title: 'An honest comparison with a receptionist',
    intro: 'A person on reception is valuable. They also come with a cost and set hours, and they can only take one call at a time. Here is the comparison, line by line.',
    caption: 'Comparison between a full-time receptionist and the AI agent',
    human: 'Full-time receptionist',
    ai: 'AI agent',
    rows: [
      { label: 'Monthly cost', human: 'At least the national minimum wage, plus employer costs', ai: 'From {from} excl. tax per month (350 min), or {payg} per minute with no subscription' },
      { label: 'Hours covered', human: 'Around 35 to 40 hours a week', ai: '24/7 (168 hours a week)' },
      { label: 'Simultaneous calls', human: 'One', ai: 'Several in parallel' },
      { label: 'Languages', human: 'One, sometimes two', ai: 'Over 80, with native voices' },
      { label: 'Getting started', human: 'Recruitment, then several weeks of training', ai: 'A few minutes; instructions can be changed at any time' },
      { label: 'Holidays and absences', human: 'Need cover', ai: 'None' },
      { label: 'Consistency', human: 'Varies with workload and time of day', ai: 'The same rules on every call' },
      { label: 'Notes after the call', human: 'Written by hand, when there is time', ai: 'Summary, transcript and extracted data, automatically' },
    ],
    note: 'A person is still essential for sensitive cases: the agent passes them a summary and arranges the callback. Many customers keep their receptionist and hand the agent overflow calls, lunch breaks, evenings and weekends. No setup fee, no commitment.',
  },

  security: {
    items: [
      { title: 'Consent and opt-out', text: 'Consent to callbacks, handling of refusals, permitted calling hours and an exclusion list.' },
      { title: 'Data protection', text: 'Encryption in transit, account-protected access and configurable retention periods.' },
      { title: 'Traceability', text: 'Call history, transcripts and an activity log for every account.' },
      { title: 'Access control', text: 'Each customer has their own secure area; the agent only accesses the information you give it.' },
      { title: 'Regulatory readiness', text: 'Tools to apply data protection law: information, right of access, deletion of calls and recordings, retention. Data processing agreement (DPA) built into the Terms (Article 8); signed version on request.' },
      { title: 'Infrastructure', text: 'Platform hosted with established cloud providers, with backups and monitoring.' },
    ],
    title: 'Security and compliance for your AI calls',
    intro: 'Your calls contain information about your customers. The platform gives you the settings to protect it and respect their choices.',
    approach: 'Our approach to security',
    privacy: 'Privacy policy',
  },

  voicesNumbers: {
    langs: ['French', 'English', 'Spanish', 'German', 'Italian', 'Portuguese', 'Dutch', 'Arabic', 'Polish', 'Romanian', 'Turkish', 'Swedish'],
    others: '+ 70 more',
    voicesTitle: 'Natural voices in your language',
    voicesText: 'More than 80 languages and many accents. The agent detects the caller’s language and replies in the same language.',
    numbersTitle: 'Your number or a dedicated number',
    numbersText: 'Keep your number (call forwarding, Twilio or Telnyx import, SIP connection to your phone system) or add a dedicated number as an option, billed monthly on top of your plan.',
    telephonyOptions: 'See telephony options',
  },

  finalCta: {
    title: 'Ready to automate your calls?',
    primary: 'Start for free',
    demo: 'See the live demo',
    advisorTitle: 'Talk to an adviser',
    advisorText: 'Leave your number: we will call you back to answer your questions.',
  },

  liveDemo: {
    title: 'Talk to the agent right now',
    intro: 'Pick a role and a language, then try it in your browser or get a call on your phone.',
    roleLabel: 'Agent role',
    // Same order as the component's orbs.
    roles: [
      { name: 'Receptionist', text: 'Answers calls, gives information and books appointments.' },
      { name: 'Sales', text: 'Qualifies enquiries and flags the projects worth calling back.' },
      { name: 'Support', text: 'Answers your customers’ questions and escalates when needed.' },
    ],
    langLabel: 'Language',
    accents: { fr: 'Parisian French', 'en-gb': 'British English', 'en-au': 'Australian English', it: 'Italian', pl: 'Polish', nl: 'Dutch', he: 'Israeli Hebrew' },
    sector: 'Your trade',
    modeLabel: 'How to try it',
    modeBrowser: 'In this browser',
    modePhone: 'Ring my phone',
    stageLabel: 'Your demo agent',
    voiceTag: (name: string) => `${name}’s voice`,
    browserText: 'Click and a window opens on this page: talk to the agent through your microphone or type to it. It already knows the role and trade you picked.',
    browserCta: (name: string) => `Talk to ${name}`,
    browserOpening: 'Opening…',
    browserLegal: 'Your browser will ask for microphone access for the voice conversation.',
    browserError: 'The assistant could not open. Try again, or choose “Ring my phone”.',
    dialogTitle: (name: string) => `Conversation with ${name}`,
    close: 'Close',
    firstName: 'Your first name',
    phone: 'Your phone number',
    consent: 'I agree to be called by the demo AI voice agent.',
    consentRequired: 'Tick the box to receive the call.',
    sendFailed: 'Your request could not be sent.',
    sending: 'Sending…',
    phoneCta: 'Ring my phone',
    phoneLegal: 'Free, no commitment. Your number is only used for this demo.',
    sentTitle: 'Request received',
    sentText: (name: string) => `${name} calls you within minutes during opening hours (Monday to Saturday, 9am to 7pm). Keep your phone close.`,
    again: 'Try again',
    portraitAlt: (name: string, accent: string, male = false) => `${name}, ${male ? 'male' : 'female'} AI voice agent (${accent})`,
    voiceLabel: 'Voice',
    voiceOption: (name: string, male: boolean) => `${name}, ${male ? 'male' : 'female'} voice`,
  },

  industryMarquee: ['Plumbers', 'Electricians', 'Dental practices', 'Clinics', 'Estate agents', 'Property management', 'Garages', 'Body shops', 'Hair salons', 'Barbers', 'Beauty salons', 'Restaurants', 'Hotels', 'Law firms', 'Accountants', 'E-commerce', 'Brokers', 'Block management', 'Aesthetic clinics', 'Physios', 'Osteopaths', 'Vets'],

  // Same order as the component's flags.
  languageMarquee: ['French', 'English', 'Spanish', 'German', 'Italian', 'Portuguese', 'Dutch', 'Belgian French', 'Swiss French', 'Québécois', 'Arabic', 'Polish', 'Romanian', 'Turkish', 'Swedish', 'Hebrew'],

  agentTeam: {
    // Same order as the component's icons and links.
    agents: [
      { name: 'AI receptionist', role: 'Answers every call, filters and transfers what matters.' },
      { name: 'Booking agent', role: 'Books, confirms, reminds and handles rescheduling.' },
      { name: 'Qualification agent', role: 'Asks your questions and prepares records ready to act on.' },
      { name: 'Support agent', role: 'Answers from your documents, escalates sensitive cases.' },
      { name: 'Follow-up agent', role: 'Confirms, follows up quotes and re-engages your contacts.' },
      { name: 'Messaging agent', role: 'Replies and confirms by SMS, WhatsApp and Instagram.' },
    ],
    title: 'Build your team of AI agents',
    intro: 'Each agent has a specific role. Turn on the ones your business needs; they share the same history and the same information.',
    custom: 'Need a particular scenario? We set up a custom agent.',
    virtualNote: 'Our agents are virtual AI agents: their faces are generated illustrations, not real people.',
  },

  sectorShowcase: {
    chooseSector: 'Choose a sector',
    agentFor: (sectorLower: string) => `${cap(sectorLower)} agent`,
    seeSolution: (sectorLower: string) => `See the ${sectorLower} solution`,
  },

  scenarioExplorer: {
    chooseTrade: 'Choose a trade',
    answering: (agentName: string) => `${agentName} picks up`,
    replay: 'Replay the call',
    benefitsTitle: 'What changes for you',
    planLabel: 'Recommended plan',
    tryLive: 'Try this scenario live',
  },

  useCaseTabs: {
    ariaLabel: 'Types of use',
    // Same order as the component's icons.
    tabs: {
      entrants: {
        label: 'Inbound calls',
        items: [
          { title: '24/7 reception', text: 'Every call gets an answer, even at night and at weekends.' },
          { title: 'Appointment booking', text: 'Booked straight into your calendar, with confirmation.' },
          { title: 'Customer support', text: 'Answers from your documents, with no queue.' },
          { title: 'Qualification', text: 'The right questions asked before passing on.' },
          { title: 'Transfer to a person', text: 'Hand over to your team when it matters.' },
          { title: 'Emergencies', text: 'Sorted according to your rules, with an immediate alert.' },
        ],
      },
      sortants: {
        label: 'Outbound calls',
        items: [
          { title: 'Calling back web leads', text: 'A completed form becomes a call within minutes.' },
          { title: 'Confirmations', text: 'Appointments and bookings confirmed the day before.' },
          { title: 'Quote follow-ups', text: 'Pending quotes followed up at the right times.' },
          { title: 'Pre-qualification', text: 'Contacts screened before your team calls.' },
          { title: 'Renewals', text: 'Customers contacted again to renew or add services.' },
          { title: 'Satisfaction surveys', text: 'Feedback collected after the service.' },
        ],
      },
      messages: {
        label: 'Messages',
        items: [
          { title: 'WhatsApp', text: 'Confirmations, reminders and written replies.' },
          { title: 'SMS', text: 'A summary after every call.' },
          { title: 'Instagram and Messenger', text: 'Direct messages in one place.' },
          { title: 'Web widget', text: 'Talk to the agent or get a callback from your website.' },
          { title: 'Waiting list', text: 'Let people know when a slot opens up.' },
          { title: 'Single history', text: 'Calls and messages in the same place.' },
        ],
      },
    },
  },

  platformGrid: {
    simultaneousTitle: 'Simultaneous calls',
    simultaneousText: 'No queue: the agent handles several calls at once on the same line.',
    knowledgeTitle: 'Knowledge base',
    knowledgeText: 'PDFs, pages from your website, procedures: the agent answers with your information.',
    promptTitle: 'Prompt assistant',
    promptText: 'Describe the purpose of the call: a step-by-step assistant sets up how the agent behaves.',
    transferTitle: 'Transfer to a person',
    transferText: 'When the customer asks or the situation calls for it, the call is handed over to your team.',
    aiAgent: 'AI agent',
    yourTeam: 'Your team',
    reportsTitle: 'Detailed reports',
    reportsText: 'Recordings, transcripts, summaries and charts for every call.',
    campaignsTitle: 'Outbound campaigns',
    campaignsText: 'Import contacts who have given consent, or trigger calls from your tools and forms.',
  },

  lifecycle: {
    title: 'The whole customer journey, in one place',
    intro: 'From the first enquiry to a loyal customer: one platform, one history.',
    ariaLabel: 'Journey stages',
    // Same order as the component's icons and mock-ups.
    stages: [
      { key: 'Attract', title: 'Capture every enquiry', items: ['Landing pages by sector', 'Web widget: talk or get a callback', 'Local numbers and forwarding of your line', '24/7 answers to calls and messages'] },
      { key: 'Convert', title: 'Turn enquiries into customers', items: ['Qualification on your criteria', 'Leads called back within minutes', 'Appointments booked in your calendar', 'CRM record created automatically'] },
      { key: 'Retain', title: 'Stay in touch with your customers', items: ['Confirmations and reminders', 'Support that answers from your documents', 'Follow-ups, renewals and surveys', 'WhatsApp, SMS, Instagram'] },
      { key: 'Measure', title: 'Manage with real figures', items: ['Volumes, durations and outcomes', 'Appointments booked and transfers', 'Minute usage and alerts', 'Call recordings and transcripts'] },
    ],
  },

  portalPreview: {
    // Same order as the component's tag colours.
    calls: [
      { who: 'New patient', what: 'Appointment Tuesday 9:30 am', tag: 'Booked' },
      { who: 'Water leak', what: 'Priority callback requested', tag: 'Urgent' },
      { who: 'Two-bed flat buyer', what: 'Viewing Saturday 11 am', tag: 'Qualified' },
      { who: 'Opening hours question', what: 'Answer given', tag: 'Resolved' },
    ],
    title: 'Your customer area, clear from the first login',
    intro: 'Calls, appointments, leads, messages and minutes: everything is visible in one place, on desktop and mobile.',
    points: ['Summary of every call and next action', 'Listen to recordings and read transcripts', 'Minute tracking and usage alerts', 'Set up your agents without code'],
    roles: 'One secure area per customer, with its own agents, numbers and data.',
    dashboard: 'Dashboard',
    sampleData: 'Sample data · last 30 days',
    stats: [['Calls', '412'], ['Appointments', '96'], ['Leads', '183'], ['Minutes', '62%']],
    notification: 'Notification',
    notifBooking: 'New appointment booked by the agent: Tuesday 9:30 am.',
    notifMinutes: 'Minutes: 62% used.',
  },

  beforeAfter: {
    without: 'Without an AI agent',
    with: (brand: string) => `With ${brand}`,
  },

  mock: {
    call: {
      agent: 'Reception agent',
      meta: 'Inbound call · 01:24',
      client: 'Hello, I’d like to book an appointment.',
      reply: 'Of course. Is this for a first visit?',
    },
    calendar: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      week: 'Week 42',
      added: 'Appointment added by the agent',
      slot: 'Tuesday · 9:30 – 10:00 am',
    },
    transcript: {
      label: 'Transcript',
      question: 'Could I have your approximate budget?',
      answer: 'Around £300,000.',
      summaryLabel: 'Summary:',
      summary: ' purchase, budget £300k, viewing requested Saturday.',
    },
    knowledge: {
      title: 'Knowledge base',
      rows: [
        { name: 'reception-procedures.pdf', meta: 'PDF · 1.2 MB' },
        { name: 'Your website pages', meta: '18 pages indexed' },
        { name: 'Prices and opening hours', meta: 'Updated today' },
      ],
    },
    prompt: {
      title: 'Purpose of the call',
      hint: 'Describe what the agent needs to achieve.',
      text: 'Greet the patient, find out whether they are new, offer two slots and confirm by SMS.',
      tags: ['Tone: warm', 'Polite, formal address', 'No medical advice'],
    },
    flow: {
      title: 'Scenario: web lead',
      steps: [
        { title: 'New form', source: 'Website' },
        { title: 'Call the lead', source: 'Sales agent' },
        { title: 'Create the record', source: 'CRM' },
        { title: 'Send the confirmation', source: 'WhatsApp' },
      ],
    },
    numbers: {
      title: 'Your lines',
      rows: [
        { country: 'United Kingdom', kind: 'Local number', agent: 'Reception agent' },
        { country: 'Australia', kind: 'Local number', agent: 'Booking agent' },
        { country: 'Your phone system', kind: 'SIP trunk', agent: 'Out-of-hours forwarding' },
      ],
    },
    report: {
      handled: 'Calls handled · example',
      demo: 'Demo',
      stats: [['Appointments', '96'], ['Qualified', '183'], ['Transfers', '27']],
    },
    widget: {
      question: 'Got a question? Let’s talk.',
      talk: 'Talk to the agent',
      callback: 'Get a call back',
    },
    whatsapp: {
      title: 'WhatsApp · Confirmation',
      confirmation: 'Your appointment is confirmed for Tuesday at 9:30 am. Reply 2 to move it.',
      reply: 'Perfect, thank you!',
    },
    campaign: {
      title: 'Campaigns',
      rows: [['Week 42 confirmations', 'In progress', '68%'], ['September quote follow-up', 'Completed', '41%'], ['Inactive customers', 'Scheduled', '—']],
      note: 'Sample figures · campaigns must only call contacts who have agreed',
    },
    lead: {
      title: 'Qualified request',
      interest: 'High interest',
      fields: [['Need', 'Renovation quote'], ['Area', 'North London'], ['Budget', '£8k – £12k'], ['Timescale', 'Within 1 month']],
      next: 'Next action: callback tomorrow 9 am',
    },
    support: {
      client: 'My order hasn’t arrived.',
      agent: 'Let me check. Could you give me your order number?',
      found: 'Answer found in “delivery-terms.pdf”',
    },
  },
};
