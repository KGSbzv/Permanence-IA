// Interface text for the non-sales pages (demo, contact, FAQ, trial, help, about, security,
// 404, legal pages, blog). Variables (brand, company, email, trial length…) are passed
// through functions: the brand comes from the market, the company and email from SITE.
import type { ChatLine, LegalSection, LegalVars, Rich } from '../../fr/ui/pages';

export type { Block, ChatLine, LegalSection, LegalVars, Rich, Span } from '../../fr/ui/pages';

const ADDRESS = '1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001';

export const UI_PAGES = {
  demo: {
    meta: {
      title: (brand: string) => `AI receptionist demo — try it live · ${brand}`,
      description: 'Hear our AI receptionist live: talk to it or get a demo call tailored to your trade. Free, with no commitment. Book your demo call now.',
    },
    h1: 'Try our AI receptionist live now',
    intro: 'Leave your number and choose your sector: the agent calls you and plays out a scenario from your trade. You hear its voice, its pace and how it qualifies a request.',
    widgetHint: 'Prefer to start straight away? Click the bubble at the bottom right of the screen: our assistant answers by voice or in writing.',
    formTitle: 'Get my demo call',
    formIntro: 'Free call, at a time that suits you.',
    submit: 'Get the demo call',
    hearTitle: 'What you will hear',
    hearIntro: 'An example call to a dental practice: the agent identifies the request, offers a slot and prepares the record for the team.',
    steps: [
      { title: 'You leave your number', text: 'With your sector and preferred time.' },
      { title: 'The agent calls you', text: 'It plays out a scenario from your trade.' },
      { title: 'You test it freely', text: 'Ask questions, change your mind, interrupt it.' },
    ],
    liveCallTitle: 'Dental agent',
    scenariosTitle: 'Choose your scenario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contact us — request a callback · ${brand}`,
      description: 'Questions about our AI receptionist? Leave your number and we’ll call you back for sales, a demo or support, at the time you choose.',
    },
    h1: 'Leave your number and we’ll call you back',
    intro: 'We don’t publish a phone number: we call you back at the time you choose. You can also email us.',
    commercialTitle: 'Sales callback',
    commercialText: 'Questions about plans, demos, custom quotes.',
    supportTitle: 'Support callback',
    supportText: 'Customers: setup, numbers, integrations.',
    emailTitle: 'Email',
    legal: (brand: string, company: string) => `${brand} is a brand of ${company}, ${ADDRESS}, United States.`,
    tabsLabel: 'Type of request',
    tabCommercial: 'Sales and demo',
    tabSupport: 'Customer support',
  },

  faq: {
    meta: {
      title: (brand: string) => `AI receptionist FAQ — questions answered · ${brand}`,
      description: (brand: string) => `How the ${brand} AI receptionist works: telephony, SIP, calendar, WhatsApp, data protection, free trial and pricing. Find your answer here.`,
    },
    h1: 'AI receptionist: frequently asked questions',
    intro: 'Can’t find your answer? Leave your number and an adviser will call you back.',
    general: 'The platform',
    pricing: 'Pricing and trial',
  },

  trial: {
    meta: {
      title: (days: number, minutes: number, brand: string) => `Free AI receptionist trial — ${days} days · ${brand}`,
      description: (days: number, minutes: number, brand: string) => `Try the ${brand} AI receptionist free for ${days} days, ${minutes} minutes included. Nothing charged during the trial, cancel at any time.`,
    },
    h1: (minutes: number) => `Claim your ${minutes} free minutes`,
    intro: (days: number) => `Create your account, choose the plan you want to try and test your AI receptionist on your business for ${days} days.`,
    points: (days: number) => [
      `Card required on activation, nothing charged for ${days} days`,
      'Cancel from your customer area before the trial ends and you pay nothing',
      'Live demo and web widget included',
      'Help with your first setup',
    ],
    createTitle: 'Create my account',
    createSteps: [
      '1. Create your account with your work email.',
      '2. Choose the plan to try in your customer area.',
      '3. Set up your agent and make your first calls.',
    ],
    createCta: 'Create my free account',
    already: 'Already a customer?',
    login: 'Log in',
    sentTitle: 'Your request has been received',
    sentText: 'An adviser will call you back to set up your first agent with you.',
    sentCta: 'Create my account now',
    formTitle: 'Would you rather have some help?',
    formIntro: 'Leave your details: an adviser will call you back to start the trial with you.',
    name: 'Full name',
    company: 'Company',
    email: 'Work email',
    phone: 'Phone',
    sector: 'Sector',
    sectorPlaceholder: 'Choose…',
    sectorOther: 'Other business',
    plan: 'Preferred plan',
    planPrice: (price: string) => ` — ${price} excl. tax/month`,
    planFree: ' — free',
    planQuote: ' — on quote',
    terms: [
      'I accept the ',
      { a: 'terms and conditions', href: '/cgu' },
      ' and the ',
      { a: 'privacy policy', href: '/confidentialite' },
      ', and agree to be called back to set up my account.',
    ] as Rich,
    termsRequired: 'Accept the terms to be called back.',
    sendError: 'Your sign-up could not be sent.',
    sending: 'Sending…',
    submit: 'Get a call back',
  },

  help: {
    meta: {
      title: (brand: string) => `Customer area help — ${brand}`,
      description: 'Guide to your AI receptionist customer area: what each menu does, creating an agent, numbers, calendar, widget, minutes and billing.',
    },
    breadcrumb: 'Help',
    h1: 'Help with your customer area',
    intro: 'Your customer area is in English. This guide explains each menu and walks you through it step by step. Inside the customer area, the help assistant (bubble at the bottom right) also answers your questions in your language, in writing or out loud.',
    openSpace: 'Open my customer area',
    chatLabel: 'Example conversation with the help assistant',
    chatTitle: (brand: string) => `${brand} help`,
    chatMode: 'In your language · text or voice',
    chat: [
      { me: true, text: 'Where do I add minutes?' },
      { text: ['At the top right, open your profile menu and click ', { b: 'Add credits' }, '. Choose a top-up: credit never expires.'] },
      { me: true, text: 'And how do I put the agent on my website?' },
      { text: ['Open your agent in ', { b: 'Assistants' }, ', under ', { b: 'Web widget' }, ': turn it on, then copy the code provided. Shall we do it together?'] },
    ] as ChatLine[],
    tasksTitle: 'Common tasks, step by step',
    menuTitle: 'The customer area menus, explained',
    colMenu: 'Menu',
    colLabel: 'In plain terms',
    colText: 'What it’s for',
    glossaryTitle: 'Short glossary',
    moreBefore: 'A question that isn’t covered here? Email ',
    moreAfter: ' or request a callback from the contact page.',
  },

  about: {
    meta: {
      title: (brand: string) => `About — AI receptionists for small business · ${brand}`,
      description: (brand: string, company: string) => `${brand} helps small businesses answer every call with an AI receptionist: 24/7 call answering set up for your trade. A brand of ${company}.`,
    },
    h1: 'Every call deserves an answer',
    intro: (brand: string) => `${brand} started from a simple observation: small businesses lose customers because nobody can pick up at the right moment.`,
    photoAlt: 'A business owner checking her phone in her office',
    paragraphs: [
      'Tradespeople, practices, agencies, garages, salons, restaurants: your teams are busy serving your customers. Meanwhile, the phone keeps ringing.',
      'We provide AI receptionists that answer, qualify, book and call back, set up for your trade, with clear prices and no commitment.',
    ],
    principlesTitle: 'Our principles',
    principles: [
      'The agent honestly introduces itself as an AI',
      'People stay in charge of the important cases',
      'Prices shown excl. tax, with no hidden fees',
      'No figure or promise we cannot back up',
    ],
    legal: (brand: string, company: string) => `${brand} is a brand of ${company}, a company registered in the State of Wyoming (United States) under number 2026-001905061.`,
  },

  security: {
    meta: {
      title: (brand: string) => `AI call security and data protection · ${brand}`,
      description: (brand: string) => `Consent, opt-out, encryption, configurable retention, roles and traceability: how the ${brand} AI receptionist protects your call data.`,
    },
    h1: 'Security and compliance for your AI calls',
    intro: 'Your calls contain personal data. Here are the protections in place and the settings available to help you comply with data protection law.',
    settingsTitle: 'Your settings',
    settings: [
      'Retention period for recordings and transcripts',
      'Deletion of a call or contact on request',
      'Exclusion list for outbound calls',
      'Permitted calling hours',
      '“AI assistant” statement at the start of the call',
      'Recording on or off, with the caller informed',
    ],
    commitmentsTitle: 'Our commitments',
    commitments: [
      'The agent introduces itself as an AI and does not pretend to be a person',
      'Your campaigns must only call contacts who have agreed; a built-in blocklist excludes the others',
      'No medical, legal or financial diagnosis by the agent',
      'Your data is never sold; it is used to provide and improve the service',
      'Help adapting your privacy notices',
    ],
    rights: ['For any question or to exercise your rights: ', { a: 'privacy policy', href: '/confidentialite' }, '.'] as Rich,
  },

  notFound: {
    meta: {
      title: (brand: string) => `Page not found — ${brand}`,
      description: 'This page doesn’t exist or has been moved.',
    },
    h1: 'This page doesn’t exist or has been moved',
    text: 'Go back to the home page or have a look at our plans.',
    home: 'Back to home',
    pricing: 'See pricing',
  },

  terms: {
    meta: {
      title: (brand: string) => `Terms and conditions — ${brand}`,
      description: (brand: string) => `The terms and conditions of use and sale that apply to ${brand} AI receptionist and phone answering plans and services.`,
    },
    h1: 'Terms and Conditions of Use and Sale',
    updated: 'Applicable to professionals and businesses • Last updated: 29 September 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
      {
        title: 'Article 1 — Purpose of the service',
        body: [
          { p: ['These Terms and Conditions govern access to and use of the software platform and the telephone services provided by an artificial intelligence conversational agent, marketed under the ', { strong: brand }, ` brand by ${company}.`] },
          { p: 'The service allows businesses to delegate inbound call answering, caller qualification and synchronised appointment booking, 24 hours a day, 7 days a week.' },
        ],
      },
      {
        title: 'Article 2 — Terms of the 14-day free trial',
        body: [
          { p: 'When first subscribing to a plan, each new customer receives a free trial period of fourteen (14) consecutive calendar days, including 30 minutes of calls:' },
          {
            ul: [
              [{ strong: 'Payment method:' }, ' A bank card is required to activate the trial. No amount is charged during the 14-day trial. All prices are stated excluding tax.'],
              [{ strong: 'Usage cap:' }, ' Calls are limited to 30 minutes during the trial; beyond that, they are suspended until the subscription starts.'],
              [{ strong: 'End of the trial:' }, ' At the end of the 14 days, the subscription to the chosen plan starts and the first monthly payment is taken, unless the customer has cancelled it before that date from their customer area, in which case nothing is charged.'],
              [{ strong: 'Fair use:' }, ' The free trial is limited to one per legal entity / registration number.'],
            ],
          },
        ],
      },
      {
        title: 'Article 3 — 14-day Peace of Mind Guarantee',
        body: [
          { p: [`In addition to any rights you have by law, ${brand} offers, as a commercial gesture, a `, { strong: 'full refund guarantee within 14 days' }, ' of the first paid subscription.'] },
          { p: ['On simple notification by email to ', { strong: email }, ' within 14 days of the first payment, the full monthly fee is refunded with no reason required.'] },
        ],
      },
      {
        title: 'Article 4 — Billing, prices and termination',
        body: [
          { p: 'Prices are stated in US dollars (USD), excluding tax. Applicable taxes are calculated automatically at payment based on the customer’s country and status (individual or business, with or without a VAT number). Payments are made monthly through our secure payment provider Stripe; the subscription renews automatically each month.' },
          { p: ['The customer may cancel their subscription at any time and without notice from their dashboard at ', { strong: appHost }, '. Cancellation takes effect at the end of the monthly period already paid for. The customer may change plan at any time and add minutes with a credit top-up; credit purchased never expires and is used to pay for minutes beyond the plan, at the extra-minute rate shown on the Pricing page.'] },
        ],
      },
      {
        title: 'Article 5 — Liability and nature of the obligation',
        body: [
          { p: [`${brand} is bound by an `, { strong: 'obligation of means' }, ' (best-efforts obligation) regarding the availability and technical processing of call traffic. The user acknowledges that generative artificial intelligence and speech synthesis models may occasionally produce approximate or inaccurate answers.'] },
          { p: `Under no circumstances shall ${brand} be liable for indirect operating losses, loss of profit or commercial damage. In all cases, the maximum compensation is expressly limited to the amount, excluding tax, paid by the customer during the month preceding the event giving rise to the claim.` },
        ],
      },
      {
        title: 'Article 6 — Prohibited uses and suspension',
        body: [
          { p: `The following are strictly prohibited: unsolicited telemarketing campaigns (abusive voice spam), fraudulent activities, and defamatory, discriminatory or unlawful statements. If abusive use is found, ${brand} reserves the right to suspend access to the dedicated line without compensation.` },
        ],
      },
      {
        title: 'Article 7 — Governing law and jurisdiction',
        body: [
          { p: `These Terms and Conditions are governed by ${legal.governingLaw}. Any dispute relating to their interpretation or performance shall be subject to the exclusive jurisdiction of ${legal.court}.` },
          ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
        ],
      },
    ],
  },

  privacy: {
    meta: {
      title: (brand: string) => `Privacy policy — ${brand}`,
      description: (brand: string) => `How ${brand} handles your data: callback requests, AI agents and recordings, customer account, Stripe billing, service providers and your rights.`,
    },
    breadcrumb: 'Privacy',
    h1: 'Privacy policy',
    intro: 'What we collect, why, who with, for how long, and how to exercise your rights.',
    updated: 'Updated: October 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Who is responsible for your data',
          body: [
            { p: [`${brand} is a brand of ${company}, a limited liability company registered in Wyoming (United States), ${ADDRESS}. Contact: `, mail, '.'] },
            {
              ul: [
                [{ strong: 'For the website, callback requests, conversations with our assistants and the management of customer accounts' }, `, ${company} is the data controller.`],
                [{ strong: 'For calls and messages handled by our customers’ agents' }, ', the customer is the data controller for their own callers, and we act as a processor on their behalf. The customer decides what information their agent collects and how it is used.'],
              ],
            },
          ],
        },
        {
          title: 'The data we process',
          body: [
            {
              ul: [
                [{ strong: 'Website forms' }, ' (callback, demo, trial support): name, phone, email, company, sector, preferred time and your message.'],
                [{ strong: 'Conversations with our AI assistants' }, ' (website bubble, receptionist, sales and support callbacks, customer area help): written content, audio recording of voice conversations, transcript, summary and useful information extracted (need, plan considered, issue reported).'],
                [{ strong: 'Customer account' }, ': identity, email, company, your agents’ settings, call and message history, minute usage.'],
                [{ strong: 'Billing' }, ': plan, invoices and payment method. Card details are entered and stored by Stripe; we never have access to them.'],
                [{ strong: 'Technical data' }, ': IP address and browser information needed for the website to work and stay secure.'],
              ],
            },
          ],
        },
        {
          title: 'Why, and on what basis',
          body: [
            {
              ul: [
                [{ strong: 'Calling you back and responding to your request' }, ', including through a call from our AI voice agent: based on your consent, given when you make the request. You can withdraw it at any time, and the agent respects any request not to be called again.'],
                [{ strong: 'Providing the service, the free trial and support' }, ': performance of the contract.'],
                [{ strong: 'Billing and meeting our accounting and tax obligations' }, ': legal obligation.'],
                [{ strong: 'Improving our assistants and securing the platform' }, ': legitimate interest, using our own conversations only.'],
              ],
            },
          ],
        },
        {
          title: 'AI agents and recordings',
          body: [
            { p: 'Our assistants are artificial intelligences and introduce themselves as such. Voice conversations are recorded and transcribed to follow up your request and ensure the quality of the service. No decision producing legal effects concerning you is made in a fully automated way.' },
            { p: 'Our customers who use the platform must inform their own callers that an AI agent is used and that calls are recorded, in line with the rules that apply to their business.' },
          ],
        },
        {
          title: 'Our service providers',
          body: [
            {
              ul: [
                [{ strong: 'Autocalls' }, ': technical platform for the voice agents, widgets and customer area (calls, transcription, speech synthesis, automations).'],
                [{ strong: 'AI, voice and telephony providers' }, ' used by this platform to understand, respond to and route calls.'],
                [{ strong: 'Stripe' }, ': subscriptions, payments, invoices and tax calculation (PCI-DSS Level 1 certified).'],
                [{ strong: 'Supabase' }, ': database for callback requests, sign-ups and conversation reports (United States).'],
                [{ strong: 'Google Cloud (Firebase App Hosting)' }, ': website hosting (United States).'],
                [{ strong: 'Zoho Mail' }, ': sending service and follow-up emails.'],
              ],
            },
          ],
        },
        {
          title: 'Transfers outside your country',
          body: [
            { p: 'Several of these providers, as well as our company, are based in the United States, so your data may be processed outside your country or region. These transfers rely on appropriate safeguards, such as standard contractual clauses (with the UK addendum where applicable), and we take reasonable steps to ensure that recipients protect your data to the standard required by the law that applies to you.' },
          ],
        },
        {
          title: 'How long we keep it',
          body: [
            {
              ul: [
                'Callback requests and conversations with our assistants: 24 months after the last contact.',
                'Recordings and transcripts of calls handled for our customers: 12 months by default; each customer can shorten this period and delete their data from their customer area.',
                'Account data: for the whole relationship, then 3 years for possible marketing, unless you object.',
                'Invoices and accounting data: the legal period (up to 10 years).',
              ],
            },
          ],
        },
        {
          title: 'Security',
          body: [
            { p: 'Exchanges are encrypted in transit, access to data is limited to the people who need it and protected by authentication, and technical keys are kept in secret vaults. Customers can turn on two-factor authentication for their customer area.' },
          ],
        },
        {
          title: 'Your rights',
          body: [
            { p: [`Under ${legal.privacyLaw}, you can ask for access to your data, its correction, erasure or portability, the restriction of processing, object to marketing and withdraw your consent to be called back. Email `, mail, ': we reply within one month.'] },
            { p: `You can also lodge a complaint with ${legal.dataAuthority}.` },
          ],
        },
        {
          title: 'Cookies',
          body: [
            { p: ['The website does not use advertising cookies. Details are on the ', { a: 'cookies', href: '/cookies' }, ' page.'] },
          ],
        },
      ];
    },
  },

  legalNotice: {
    meta: {
      title: (brand: string) => `Legal notice — ${brand}`,
      description: (brand: string) => `Legal notice for the ${brand} AI receptionist platform: publisher, hosting and copyright information.`,
    },
    h1: 'Legal Notice',
    updated: 'Last updated: 29 September 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => [
      {
        title: '1. Website publisher',
        body: [
          { p: ['The website available at ', { strong: 'https://permanenceia.com' }, ' is published by ', { strong: company }, '.'] },
          {
            ul: [
              [{ strong: 'Trading name:' }, ` ${brand}`],
              [{ strong: 'Legal form:' }, ' Limited Liability Company (LLC), State of Wyoming, United States'],
              [{ strong: 'Registration number:' }, ' 2026-001905061'],
              [{ strong: 'Registered office:' }, ' 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, United States'],
              [{ strong: 'Contact email:' }, ` ${email}`],
              [{ strong: 'Publication director:' }, ` the legal representative of ${company}.`],
            ],
          },
        ],
      },
      {
        title: '2. Platform hosting',
        body: [
          { p: 'The marketing website and the application are hosted by:' },
          {
            ul: [
              [{ strong: 'Front-end platform:' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Hosting region: us-east4 (Northern Virginia, United States).'],
              [{ strong: 'Databases and storage:' }, ' Supabase Inc., infrastructure located in the United States (AWS region us-east-1, Virginia).'],
            ],
          },
        ],
      },
      {
        title: '3. Intellectual property',
        body: [
          { p: ['The ', { strong: brand }, ` brand, the logo (the standby bubble, the sound waves and the availability dot), and all visual identity, text, conversation scripts, infographics and source code on the website are the exclusive property of ${company}.`] },
          { p: `Any reproduction, distribution, modification or use without prior written consent is strictly prohibited and constitutes infringement under ${legal.copyrightLaw}.` },
        ],
      },
      {
        title: '4. Limitation of liability',
        body: [
          { p: `${brand} makes every effort to ensure the accuracy of the information published on the website. However, ${brand} cannot be held liable for network service interruptions, outages inherent to third-party telecommunications operators, or occasional contextual inaccuracies produced by automatic speech processing models during live conversations.` },
          { p: 'The professional customer remains solely responsible for the instructions and business rules they program into their phone answering service.' },
        ],
      },
    ],
  },

  cookies: {
    meta: {
      title: (brand: string) => `Cookie policy — ${brand}`,
      description: (brand: string) => `Which cookies and trackers the ${brand} AI receptionist website uses, and why.`,
    },
    h1: 'Cookie policy',
    paragraphs: (siteHost: string, appHost: string) => [
      `The ${siteHost} website only uses cookies that are strictly necessary for it to work (security, load balancing). No advertising or third-party analytics cookies are set at present.`,
      'If analytics or advertising tools are added, a banner will ask for your consent before any cookie is set, and this page will be updated with the list of cookies, their purpose and their duration.',
      `The customer area (${appHost}) uses session cookies needed to log in.`,
    ],
    questions: 'Questions: ',
  },

  blog: {
    meta: {
      title: (brand: string) => `AI receptionist blog — guides and tips · ${brand}`,
      description: 'Guides, case studies and practical tips to help your small business answer and convert more phone calls with an AI receptionist.',
    },
    eyebrow: 'Resources and insights',
    h1: 'The AI Reception Journal',
    intro: 'Phone conversion strategies, regulatory analysis and practical feedback from professionals.',
    searchPlaceholder: 'Search articles...',
    all: 'All articles',
    categories: {
      productivite: 'Productivity',
      conformite: 'Compliance',
      'cas-client': 'Customer stories',
      technique: 'Technical',
    },
    read: 'Read',
    notFound: {
      title: (brand: string) => `Article not found | ${brand}`,
      description: 'This article doesn’t exist or has been moved.',
      h1: 'Article not found',
      text: 'The article you are looking for doesn’t exist or has been moved.',
      back: 'Back to articles',
    },
    articleTitle: (title: string, brand: string) => `${title} | ${brand} Blog`,
    backToList: 'Back to the list of articles',
    readTime: (t: string) => `${t} read`,
    publisher: (brand: string) => `${brand} Publications`,
    ctaEyebrow: 'Take action',
    ctaTitle: 'Ready to give your business an AI receptionist?',
    ctaText: (days: number, minutes: number) => `Test our voice agent in real conditions from today, for ${days} days, with ${minutes} minutes included and no commitment.`,
    ctaButton: 'Start for free',
  },
};
