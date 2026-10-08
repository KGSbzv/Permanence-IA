// Interface text for the non-sales pages (demo, contact, FAQ, trial, help, about, security,
// 404, legal pages, blog). Variables (brand, company, email, trial length…) are passed
// through functions: the brand comes from the market, the company and email from SITE.
import type { ChatLine, LegalSection, LegalVars, Rich } from '../../fr/ui/pages';
import { SITE } from '@/data/site';

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
    hearIntro: 'An example call to a plumber: the agent identifies the emergency, arranges the visit and prepares the record for the team.',
    steps: [
      { title: 'You leave your number', text: 'With your sector and preferred time.' },
      { title: 'The agent calls you', text: 'It plays out a scenario from your trade.' },
      { title: 'You test it freely', text: 'Ask questions, change your mind, interrupt it.' },
    ],
    liveCallTitle: 'Plumbing agent',
    scenariosTitle: 'Choose your scenario',
  },

  contact: {
    meta: {
      title: (brand: string) => `Contact us — request a callback · ${brand}`,
      description: 'Questions about our AI receptionist? Leave your number and we’ll call you back for sales, a demo or support, at the time you choose.',
    },
    h1: 'Leave your number and we’ll call you back',
    intro: 'Choose a time and we call you back, or reach us in writing on WhatsApp or by email. Our AI agent answers 24/7.',
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
      '“AI assistant” statement at the start of the call: always on (wording can be customised)',
      'Recording on or off, announced to the caller at the start of the call',
      'Words or topics the agent must never raise (priced quotes, diagnosis, advice)',
    ],
    infraTitle: 'A solution built on certified infrastructure',
    infraIntro: 'Our solution (agents, scheduled callbacks, routing, website and customer area) runs on the infrastructure of a certified technical provider. These certifications are the provider’s; we chose it so you get the same standard.',
    infraItems: ['Provider certified ISO/IEC 27001:2022 (information security) and ISO 9001:2015 (quality)', 'AES-256 encryption at rest and TLS in transit', 'Role-based access control, two-factor authentication and audit logs', 'Automated backups and disaster recovery across several zones', 'GDPR compliance, configurable retention and automatic deletion', 'Payments processed by Stripe, PCI-DSS Level 1 certified'],
    // Badges neutres (icône + libellé, sans logo ISO ni d’organisme certificateur) ; l’id choisit l’icône.
    badges: [{ id: 'iso27001', label: 'ISO/IEC 27001:2022 (provider)' }, { id: 'iso9001', label: 'ISO 9001:2015 (provider)' }, { id: 'encryption', label: 'TLS + AES-256' }, { id: 'gdpr', label: 'GDPR tools' }, { id: 'pci', label: 'Stripe PCI-DSS Level 1' }] as { id: 'iso27001' | 'iso9001' | 'encryption' | 'gdpr' | 'pci'; label: string }[],
    badgesNote: 'The ISO certifications belong to our technical provider; the PCI-DSS certification belongs to Stripe.',
    commitmentsTitle: 'Our commitments',
    commitments: [
      'The agent introduces itself as an AI and does not pretend to be a person',
      'Your campaigns must only call contacts who have agreed; a built-in exclusion list excludes the others',
      'No medical, legal or financial diagnosis by the agent',
      'Your data is never sold; it is used to provide and improve the service',
      'Help adapting your privacy notices',
      'Data processing agreement (DPA) built into the Terms (Article 8); signed version on request',
      'Right to erasure: a call, its recording and its transcript are deleted on request',
      'The agent announces that the call is recorded; anyone who objects can write to us instead',
      'Outbound campaigns: you only call people who have agreed to be contacted, keep proof of their consent and screen numbers against the TPS and CTPS in the UK or the Do Not Call Register in Australia',
    ],
    rights: ['For any question or to exercise your rights: ', { a: 'privacy policy', href: '/confidentialite' }, '.'] as Rich,
  },

  accessibility: {
    meta: {
      title: (brand: string) => `Accessibility statement — ${brand}`,
      description: (brand: string) => `Accessibility level of the ${brand} website, measures taken, known limitations and how to report a problem.`,
    },
    h1: 'Accessibility statement',
    updated: 'Last updated: 7 October 2026',
    intro: (brand: string, company: string) => `${brand} is a service of ${company}, a company registered in the State of Wyoming (United States). We want everyone to be able to use this website, including people with disabilities.`,
    sections: [
      { title: 'Target level', items: ['This website aims to conform to level AA of the Web Content Accessibility Guidelines (WCAG) 2.1.', 'Status: partially conformant. Known non-conformities are listed below and are being fixed.'] },
      { title: 'Measures taken', items: ['Language and reading direction declared on every page (including Hebrew, right to left).', 'Full keyboard navigation, a skip-to-content link and a visible focus indicator.', 'Structured headings, text alternatives for informative images, labelled forms.', 'Stronger colour contrast, text that can be enlarged to 200% without loss of information, mobile-friendly layout.', 'Reduced animations when your system asks for it (“reduce motion” setting).'] },
      { title: 'Known limitations', items: ['The chat and voice demo window is provided by our technology provider: its keyboard and screen reader support may be incomplete. The callback form and our email address are always available instead.', 'The customer area (app.permanenceia.com) runs on our provider’s platform.', 'Some PDF documents (sales presentation) are not fully tagged.'] },
      { title: 'Assessment', items: ['Internal assessment carried out on 7 October 2026 across all public pages, using automated tools and manual checks (keyboard, contrast, screen reader).'] },
    ],
    contactTitle: 'Report a problem',
    contact: (company: string, email: string) => `Accessibility contact: ${company}. Email us at ${email}, describing the page and the problem you encountered: we reply within 5 working days and offer a suitable solution (information in another format, help by email or by phone).`,
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
    updated: 'Applicable to professionals and businesses • Last updated: 8 October 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Article 1 — Definitions and acceptance',
          body: [
            { p: ['These terms and conditions of use and sale (the “Terms”) govern access to and use of the services marketed under the ', { strong: brand }, ` brand by ${company}, a Wyoming limited liability company (United States), ${ADDRESS} (“we”, “us”).`] },
            {
              ul: [
                [{ strong: 'Service:' }, ` the software platform, the customer area at ${appHost}, the AI voice and chat agents, the web widget, messaging (WhatsApp, SMS, Messenger, Instagram), campaigns, automations, phone numbers, SIP connectivity and any related feature.`],
                [{ strong: 'Customer:' }, ' the business or professional that creates an account or subscribes to a plan.'],
                [{ strong: 'User:' }, ' any person the Customer authorises to access its account.'],
                [{ strong: 'Customer Content:' }, ' the data, instructions (prompts), knowledge bases, files, voice samples, contact lists, recordings and messages supplied to the Service or generated on the Customer’s behalf.'],
                [{ strong: 'Recipients:' }, ' the people who call the Customer’s agent, or who are called or messaged through it.'],
                [{ strong: 'Credits:' }, ' prepaid minutes, message credits and top-ups.'],
              ],
            },
            { p: 'The Service is reserved for businesses and professionals acting for business purposes; it is not offered to consumers. By creating an account, ticking the acceptance box or using the Service, the Customer accepts these Terms. The person accepting them represents that they are at least 18 years old and authorised to bind the entity they represent.' },
          ],
        },
        {
          title: 'Article 2 — Account and security',
          body: [
            {
              ul: [
                'The Customer provides accurate and complete information (legal name, registration details, contact details) and keeps it up to date.',
                'It keeps its login details and API keys confidential, enables the protections available (including two-factor authentication) and is responsible for all activity on its account, including by its Users, as if it were its own.',
                ['It notifies us without delay at ', mail, ' of any unauthorised access or suspected security incident.'],
                'We may request proof of identity, address or business activity (in particular to assign phone numbers) and may refuse, restrict or suspend an account that does not provide it.',
              ],
            },
          ],
        },
        {
          title: 'Article 3 — Free trial, no cancellation right and no refunds',
          body: [
            { p: 'On its first subscription to a paid plan, the Customer receives a free trial of fourteen (14) consecutive calendar days, including 30 minutes of calls, limited to one trial per legal entity, company registration number or payment method:' },
            {
              ul: [
                [{ strong: 'Payment method:' }, ' a card is required to activate the trial. Nothing is charged during the 14-day trial.'],
                [{ strong: 'Usage cap:' }, ' calls are limited to 30 minutes during the trial; beyond that they are paused until the subscription starts. Some features (numbers, outbound campaigns, messaging) may be restricted during the trial.'],
                [{ strong: 'End of trial:' }, ' after 14 days, the chosen plan starts and the first period (monthly or annual) is charged, unless the Customer has cancelled from the customer area before then, in which case nothing is charged. A reminder email is sent to the Customer 7 days before the trial ends.'],
              ],
            },
            { p: 'Business-to-business contracts carry no statutory cancellation (cooling-off) right. The free trial lets the Customer test the Service before paying anything and cancel free of charge before it ends.' },
            { p: [{ strong: 'Every paid period is earned in full and is non-refundable' }, ', in whole or in part, including on cancellation, non-use, downgrade, suspension or account closure, and for the unexpired part of an annual period. Credits are non-refundable, non-transferable and have no cash value; purchased credit does not expire while the account remains open and is forfeited when it is closed.'] },
          ],
        },
        {
          title: 'Article 4 — Prices, billing, renewal and taxes',
          body: [
            {
              ul: [
                'Prices are in US dollars (USD), excluding taxes. Applicable taxes are calculated at checkout according to the Customer’s country and tax status (with or without a VAT number) and are payable by the Customer. If the Customer must withhold tax, it grosses up its payment so that we receive the invoiced amount.',
                'Plans are payable in advance, monthly or annually at the Customer’s choice (annual billing gives two months free), through our payment provider Stripe. The subscription renews automatically for a period of the same length, and the Customer authorises the corresponding recurring charges. With annual billing, included minutes are allocated each month and the Service is identical.',
                'Usage beyond the plan (extra minutes, messages, phone numbers, fees charged by carriers or Meta) is deducted from credit or charged at the current rates shown on the Pricing page or in the customer area.',
                [{ strong: 'Message credits:' }, ' they cover the written exchanges of the Service: written AI replies (website chat, WhatsApp, Messenger, Instagram), WhatsApp messages and SMS. Each use is deducted from the Customer’s credit balance: 3 credits per written AI reply; 1.4 credits per WhatsApp message received or sent within a session; 2 credits per SMS sent, an amount that may vary by carrier or country; for a WhatsApp template message, Meta’s rate by country and category, plus a margin. WhatsApp calls are billed in minutes. Credits are included each month according to the plan or obtained by converting minutes from the customer area (1 minute = 9 credits). The balance can be checked in the customer area; when it reaches 0, written replies and SMS or WhatsApp sending are suspended until the balance is topped up.'],
                ['The Customer may cancel at any time, without notice, from its customer area at ', { strong: appHost }, ', under Billing info, using the "Cancel subscription" button. During the trial, cancelling before the 14 days are up results in no charge. After the trial, cancellation takes effect at the end of the period already paid (the current month or, with annual billing, the current year), with no refund (Article 3). The Customer may change plan or top up credit at any time; the terms of the change are shown in the customer area.'],
                'We may change our prices on 30 days’ notice by email or in the customer area; the new price applies from the next renewal. A Customer who does not accept it cancels before that date. Third-party fees passed through to the Customer (carriers, Meta) may change on the timescales those third parties impose.',
                'If a payment fails or is late, we may suspend all or part of the Service until it is settled, without extending the period. Unpaid sums bear interest at 1.5% per month or, if lower, the maximum lawful rate, plus any statutory fixed compensation for recovery costs and the recovery costs actually incurred.',
                'Any payment dispute (chargeback) raised without first contacting us leads to immediate suspension of the account; all sums owed become due at once, together with chargeback and recovery costs.',
                'Invoice queries must reach us within 30 days of the invoice date; otherwise the invoice is deemed accepted.',
              ],
            },
          ],
        },
        {
          title: 'Article 5 — Acceptable use and prohibited content',
          body: [
            { p: 'The Customer uses the Service in compliance with applicable law and these Terms. The following are prohibited in particular:' },
            {
              ul: [
                'any unlawful, fraudulent, deceptive or abusive activity, including phishing and vishing, scams and impersonating a person, business or public authority;',
                'harassment, threats and hateful, discriminatory, defamatory or violent content, or content that infringes third-party rights;',
                'unsolicited calls and messages or bulk sending without consent, and any circumvention of an opt-out;',
                'high-risk uses: replacing or calling emergency services; basing medical, legal, financial, insurance, credit, employment or housing decisions on the agent without qualified human review; debt collection outside the applicable legal framework; automated political or election calls or messages; adult or sexual content and any content involving minors; gambling, weapons, drugs or regulated products without authorisation;',
                'collection by the agent of special-category data, full payment card numbers or government identifiers without a lawful basis and appropriate safeguards;',
                'use of voice samples (voice cloning) without the prior, documented and revocable consent of the person whose voice is reproduced;',
                'any attack on the security or integrity of the Service: malicious code, unauthorised penetration or load testing, circumventing limits, accessing other customers’ accounts;',
                'reverse engineering, decompiling or disassembling (except to the extent the law expressly allows), automated extraction (scraping), copying the Service, or using it to build a competing service or train models;',
                'reselling, sublicensing, renting, making available to third parties or white-labelling the Service without our prior written agreement.',
              ],
            },
            { p: 'Without any duty to monitor, we may review use of the Service, remove content, block a number, campaign or message, suspend the account (Article 13) and cooperate with carriers, platforms and authorities.' },
          ],
        },
        {
          title: 'Article 6 — Call and messaging compliance',
          body: [
            { p: [{ strong: 'The Customer is solely responsible for the compliance of its calls, campaigns and messages' }, ' with the law of every country where Recipients are located, including the GDPR, direct marketing and electronic communications (ePrivacy) rules and, if it contacts people in the United States, the Telephone Consumer Protection Act (TCPA) and the Telemarketing Sales Rule (TSR). In particular:'] },
            {
              ul: [
                [{ strong: 'Consent:' }, ' before any automated, outbound or marketing call or message (voice, SMS, WhatsApp), it obtains the consents required by law, keeps proof of them and honours any opt-out immediately (STOP keyword, spoken or written request).'],
                [{ strong: 'Do-not-call registers:' }, ' it respects the applicable rules and registers: in France, the person’s prior express consent to telephone marketing since 11 August 2026 (Article L223-1 of the French Consumer Code), TPS and CTPS (United Kingdom), the Do Not Call Register (Australia), the Registro pubblico delle opposizioni (Italy), Polish rules requiring prior consent to telephone marketing, and Dutch rules (prior consent or an existing customer relationship, Bel-me-niet Register).'],
                [{ strong: 'Hours and frequency:' }, ' it respects the permitted calling days, hours and frequency.'],
                [{ strong: 'Caller ID:' }, ' it presents a valid number assigned to it, does not spoof numbers and identifies itself clearly.'],
                [{ strong: 'Transparency:' }, ' it clearly informs Recipients, from the start of the interaction, that they are dealing with an artificial intelligence system (in particular under the EU AI Act) and, where the law requires, that the call is recorded or transcribed, and obtains their agreement where required.'],
                [{ strong: 'Platforms:' }, ' it complies with Meta’s policies (WhatsApp Business, Messenger, Instagram), including template approval and conversation windows, and with carrier rules (sender registration, alphanumeric sender IDs). These third parties may restrict an account or number without any liability on our part.'],
              ],
            },
            { p: 'Phone numbers are provided by carriers (such as Twilio): the Customer leases them and does not own them. Assigning a number may require proof of identity, address or business; the carrier or regulator may change or reclaim it. A number may be released, and permanently lost, on cancellation, prolonged suspension or non-payment. Porting out depends on technical and regulatory feasibility.' },
            { p: [{ strong: 'No emergency calls.' }, ' The Service cannot be used to reach emergency services (999, 112, 000, 911, etc.) and does not replace a telephone line. The Customer informs its Users accordingly.'] },
          ],
        },
        {
          title: 'Article 7 — Artificial intelligence features',
          body: [
            {
              ul: [
                'Answers, transcripts, summaries and voices are generated automatically and may be inaccurate, incomplete or inappropriate. The Customer reviews them before relying on them.',
                'The Customer configures its agents’ instructions, knowledge bases, voices, tools and automations: it is responsible for everything its agent says, promises or does on its behalf (appointments, prices, commitments).',
                'The Service does not provide medical, legal, financial, tax or other professional advice, and the Customer must not present its agent as doing so.',
                'AI models, voices, languages and providers may change, be replaced or withdrawn; the availability of any particular model or voice is not guaranteed.',
                'As between the parties, output generated for the Customer belongs to it, subject to third-party rights and our rights in the Service; output may not be unique.',
              ],
            },
          ],
        },
        {
          title: 'Article 8 — Customer data and data protection',
          body: [
            { p: ['For Recipients’ personal data processed through the Service, the Customer is the controller and we act as its processor (Article 28 GDPR and equivalent laws). This Article and the ', { a: 'privacy policy', href: '/confidentialite' }, ' form the data processing agreement; a signed version is available on request. We:'] },
            {
              ul: [
                'process the data only on the Customer’s documented instructions (these Terms and its settings), unless the law requires otherwise, and tell it if an instruction appears unlawful;',
                'bind authorised personnel to confidentiality;',
                'implement appropriate technical and organisational measures;',
                'use sub-processors, listed in the privacy policy, which the Customer authorises generally; we give at least 15 days’ notice of any change, and the Customer may object on reasonable grounds, its sole remedy then being to cancel;',
                'assist the Customer, to a reasonable extent, with data subject requests, impact assessments and personal data breaches, which we notify without undue delay;',
                'delete the data at the end of the contract in accordance with Article 13, unless the law requires retention;',
                'make available the information needed to demonstrate our compliance; any audit takes place at most once a year, on reasonable notice, at the Customer’s cost and under confidentiality.',
              ],
            },
            { p: 'The Customer warrants that it has a lawful basis for each processing operation, informs Recipients (AI agent, recording, purposes), obtains the required consents, has special-category data processed only where necessary and lawful, and that its contact lists were lawfully compiled. Call recording and its retention period are configured by the Customer.' },
            { p: 'We may use aggregated or anonymised data and usage metadata to operate, secure and improve the Service. We do not use the content of the Customer’s calls and messages to train our own models.' },
          ],
        },
        {
          title: 'Article 9 — Third-party services and integrations',
          body: [
            { p: 'The Service relies on or connects to third parties: telecoms carriers, Meta (WhatsApp, Messenger, Instagram), calendars, CRMs, automation tools, AI and payment providers. Their terms apply and the Customer accepts them where they so require. By enabling an integration, the Customer authorises us to exchange the necessary data with it. We do not control these services and are not responsible for their availability, their changes or their handling of data sent to them at the Customer’s request.' },
          ],
        },
        {
          title: 'Article 10 — Intellectual property',
          body: [
            {
              ul: [
                `The Service, its software, interfaces and documentation, the ${brand} brand and its logos belong to us or our licensors and are protected in particular by ${legal.copyrightLaw}. No rights are granted to the Customer other than the licence below.`,
                'We grant the Customer, for the term of its subscription, a limited, non-exclusive, non-transferable, non-sublicensable and revocable licence to use the Service for its internal business purposes.',
                'The Customer retains its rights in Customer Content. It grants us a worldwide, royalty-free, non-exclusive licence to host, copy, process, transmit and display it, and have it processed by our sub-processors, solely as needed to provide, secure and support the Service and comply with the law. It warrants that it holds the necessary rights.',
                'Suggestions and feedback from the Customer may be used freely, without charge and without time limit.',
                'The Customer may not use our trade marks without written consent. We may name the Customer and show its logo as a reference unless it objects by email.',
                ['To report unlawful content or copyright infringement, email ', mail, ' identifying the work, where the content is located, your contact details and a statement of good faith. We may remove the content and suspend repeat infringers.'],
              ],
            },
          ],
        },
        {
          title: 'Article 11 — Confidentiality',
          body: [
            { p: 'Each party keeps confidential the non-public information received from the other, uses it only to perform these Terms and protects it with reasonable care, during the contract and for three years afterwards (and for as long as it remains a trade secret, for trade secrets). Information that is public, already known, independently developed or lawfully received from a third party is not confidential. A party may disclose information required by law or by an authority, notifying the other where permitted.' },
          ],
        },
        {
          title: 'Article 12 — Service changes, beta features and availability',
          body: [
            {
              ul: [
                'We may develop the Service, add, change or remove features and change providers. Where reasonably possible, we give notice before removing an essential feature of a paid plan.',
                'Beta, preview or experimental features are provided as is, without commitment, and may be discontinued at any time.',
                'We use reasonable efforts. No service level agreement (SLA) applies unless agreed in writing in a Custom contract. The Service depends on the internet, carriers and our providers; scheduled maintenance (announced where possible) or urgent maintenance may interrupt it.',
                'Fair-use limits (concurrent calls, throughput, volumes) may apply.',
              ],
            },
          ],
        },
        {
          title: 'Article 13 — Suspension and termination',
          body: [
            { p: 'We may suspend or close all or part of the account at any time, with or without notice and without compensation, in the event of: breach of these Terms, non-payment or chargeback, a complaint from a carrier, Meta, an authority or Recipients, suspected fraud, a security risk, a legal or reputational risk, a request from an authority, or a requirement of one of our providers. Fees remain payable during suspension. Such closure gives rise to no refund, including of unexpired prepaid periods.' },
            {
              ul: [
                'The Customer may cancel at any time; cancellation takes effect at the end of the paid period (Article 4).',
                'We may also end the contract without cause on 30 days’ notice; in that case only, we refund the unexpired part of a prepaid period.',
                'When the contract ends, access stops, sums owed become due, numbers may be released and Credits are forfeited. The Customer may export its data from its customer area for 30 days; the data is then deleted within 90 days of the end of the contract, subject to statutory retention obligations and the normal backup cycle.',
                'Free or trial accounts without a paid subscription that have been inactive for 90 days may be closed and their data deleted after an email warning.',
                'Provisions which by their nature survive termination (sums owed, data, intellectual property, confidentiality, warranties, liability, indemnity, disputes) continue to apply.',
              ],
            },
          ],
        },
        {
          title: 'Article 14 — Disclaimer of warranties',
          body: [
            { p: 'To the extent permitted by law, the Service is provided “as is” and “as available”. We exclude all warranties, express or implied, including of merchantability or satisfactory quality, fitness for a particular purpose, non-infringement, uninterrupted or error-free operation, accuracy of AI-generated content, delivery of calls and messages or achievement of any business result.' },
          ],
        },
        {
          title: 'Article 15 — Limitation of liability',
          body: [
            {
              ul: [
                'We are not liable for indirect, consequential, special or punitive damages, or for loss of profits, revenue, customers, opportunities or goodwill, loss or corruption of data, missed calls or appointments, or the cost of substitute services, even if advised of their possibility.',
                'We are not liable for damage resulting from Customer Content, the configuration of agents, third-party services, carriers, Meta, the internet, force majeure or a breach by the Customer.',
                [{ strong: 'Cap:' }, ' our total aggregate liability, for all causes, is limited to the amount (excluding taxes) actually paid by the Customer for its subscription for the month preceding the event giving rise to liability (with annual billing, one twelfth of the annual fee), and shall in no case exceed USD 1,000.'],
                'The Customer acknowledges that our prices reflect this allocation of risk.',
              ],
            },
            { p: 'Nothing in these Terms excludes or limits any liability or right that cannot be excluded or limited under applicable mandatory law (including for fraud, gross negligence or wilful misconduct, or death or personal injury caused by negligence).' },
            ...(legal.mandatoryNote ? [{ p: legal.mandatoryNote }] : []),
          ],
        },
        {
          title: 'Article 16 — Indemnity by the Customer',
          body: [
            { p: `The Customer shall defend, indemnify and hold harmless us and our officers, employees, subcontractors and providers against any claim, loss, fine, penalty, award and cost (including reasonable legal fees) arising from: its Customer Content and the configuration of its agents; its calls, messages and campaigns; lack of consent, failure to honour an opt-out or do-not-call register; any breach of telecoms, marketing, AI or data protection law; any breach of these Terms; any claim by a Recipient, a User, a carrier, Meta, our technical platform provider or an authority relating to its use. The Customer acknowledges that ${company} may be liable to its own providers for its customers’ breaches. We notify the Customer of the claim; it may not settle in a way that imposes any obligation on us without our consent.` },
          ],
        },
        {
          title: 'Article 17 — Time limit for claims',
          body: [
            { p: 'To the extent permitted by law, any claim against us must be brought within three (3) months of the event giving rise to it, or of the date the Customer knew or ought to have known of it; otherwise it is time-barred.' },
          ],
        },
        {
          title: 'Article 18 — Governing law, arbitration and class action waiver',
          body: [
            {
              ul: [
                `These Terms are governed by ${legal.governingLaw}, excluding its conflict-of-laws rules and the United Nations Convention on Contracts for the International Sale of Goods.`,
                ['Before any proceedings, the complaining party sends a written claim (to us: ', mail, '); the parties seek an amicable solution for 30 days.'],
                `Failing that, any dispute arising out of or relating to these Terms or the Service shall be finally resolved by confidential, binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules (or, for an international dispute, by its International Centre for Dispute Resolution), before a single arbitrator, seated in Cheyenne, Wyoming, and conducted in English. Judgment on the award may be entered by ${legal.court} or any court of competent jurisdiction.`,
                [{ strong: 'Class action waiver:' }, ' disputes are resolved on an individual basis only, excluding any class, collective or representative action and any consolidated arbitration. If this waiver is held unenforceable for a claim, that claim is heard by the courts below and not in arbitration.'],
                'Each party may seek urgent or interim relief from any competent court (in particular to protect its intellectual property or confidential information or to stop misuse of the Service), without posting a bond to the extent permitted. Either party may bring an individual claim within the jurisdiction of a small claims court, and we may sue to recover unpaid sums before any competent court.',
                `Any dispute not subject to arbitration falls within the exclusive jurisdiction of ${legal.court}.`,
              ],
            },
          ],
        },
        {
          title: 'Article 19 — Force majeure',
          body: [
            { p: 'Neither party is liable for delay or failure caused by an event beyond its reasonable control: natural disaster, epidemic, war, terrorism, riot, strike, government action, failure of a carrier, the internet, the power grid, a data centre or a cloud or AI provider, cyber-attack, or a decision by Meta or a carrier. Payment obligations are not suspended. If the event lasts more than 30 days, either party may terminate the affected subscription by notice.' },
          ],
        },
        {
          title: 'Article 20 — Assignment and change of control',
          body: [
            { p: 'We may assign or transfer all or part of these Terms, including on a merger, acquisition, reorganisation or sale of assets, without the Customer’s consent and after informing it, and may subcontract any of our obligations. The Customer may not assign these Terms without our prior written consent; it informs us of any change of control, and we may then terminate if the new owner is a competitor or does not pass our checks.' },
          ],
        },
        {
          title: 'Article 21 — General provisions',
          body: [
            {
              ul: [
                [{ strong: 'Entire agreement:' }, ' these Terms, the Pricing page, the details of the plan subscribed, the ', { a: 'privacy policy', href: '/confidentialite' }, ' and, where applicable, a signed Custom contract form the entire agreement and supersede all prior discussions. The Customer’s purchasing terms do not apply.'],
                [{ strong: 'Order of precedence:' }, ' a signed Custom contract, then these Terms, then the privacy policy, then the Pricing page and documentation.'],
                [{ strong: 'Severability and waiver:' }, ' an invalid provision is replaced by the closest valid provision and the others remain in force; failure to exercise a right is not a waiver of it.'],
                [{ strong: 'Notices:' }, ' we write to the account email address or in the customer area; the Customer writes to ', mail, '. The Customer accepts electronic communications and invoices.'],
                [{ strong: 'Changes:' }, ' we may amend these Terms; material changes are announced by email or on the website at least 15 days before they take effect, unless legal or security requirements dictate otherwise. Continued use constitutes acceptance; a Customer who does not accept cancels before that date.'],
                [{ strong: 'Language:' }, ' these Terms are published in several languages. In the event of any discrepancy, the English version prevails.'],
                [{ strong: 'Sanctions and export:' }, ' the Customer represents that it is not subject to economic sanctions and will not use the Service in a sanctioned country or for the benefit of a sanctioned person.'],
                [{ strong: 'Independence:' }, ' the parties are independent contractors; these Terms create no rights for third parties.'],
                [{ strong: 'Contact:' }, ` ${company}, ${ADDRESS}, United States — `, mail, '.'],
              ],
            },
          ],
        },
      ];
    },
  },

  privacy: {
    meta: {
      title: (brand: string) => `Privacy policy — ${brand}`,
      description: (brand: string) => `How ${brand} handles your data: callback requests, AI agents and recordings, customer account, Stripe billing, service providers and your rights.`,
    },
    breadcrumb: 'Privacy',
    h1: 'Privacy policy',
    intro: 'What we collect, why, who with, for how long, and how to exercise your rights.',
    updated: 'Last updated: 6 October 2026',
    sections: ({ brand, company, email, legal }: LegalVars): LegalSection[] => {
      const mail = { a: email, href: `mailto:${email}` };
      return [
        {
          title: 'Who we are and our role',
          body: [
            { p: [`${brand} is a brand of ${company}, a limited liability company registered in the State of Wyoming (United States), ${ADDRESS}. Contact: `, mail, `. We process personal data in accordance with ${legal.privacyLaw} and other applicable laws.`] },
            {
              ul: [
                [{ strong: 'Controller:' }, ` for the website, forms and callback requests, conversations with our own AI assistants, customer accounts, billing and our own marketing, ${company} is the controller.`],
                [{ strong: 'Processor:' }, ' for calls, messages and contacts handled by our customers’ agents, the customer is the controller with respect to its own callers and contacts; we act on its behalf and on its instructions. If you were contacted by a customer’s agent, please contact that business first; we will pass on any request we receive.'],
              ],
            },
          ],
        },
        {
          title: 'The data we collect',
          body: [
            {
              ul: [
                [{ strong: 'Website forms' }, ' (callback, demo, trial assistance): name, phone number, email, company, sector, preferred time slot, message and consent.'],
                [{ strong: 'Conversations with our AI assistants' }, ' (website bubble, receptionist, demo calls, sales and support callbacks, in-app help): written content, audio recordings of voice conversations, transcripts, summaries and extracted information (need, plan considered, issue reported).'],
                [{ strong: 'Customer account' }, ': users’ identity and contact details, business information, login details, agent settings and instructions, knowledge bases, contact lists, call and message history, minutes and credit usage, support requests.'],
                [{ strong: 'Data processed for our customers' }, ': callers’ or contacts’ numbers and names, call content, messages, recordings, transcripts, appointments and lead records.'],
                [{ strong: 'Billing' }, ': plan, invoices, billing address, VAT number, payment status. Card details are entered into and stored by Stripe; we never have access to them.'],
                [{ strong: 'Technical data' }, ': IP address, device and browser, connection and security logs, cookies.'],
                [{ strong: 'Data received from third parties' }, ': integrations enabled by the customer (calendars, CRMs, WhatsApp, Messenger, Instagram), call and message metadata from carriers, payment and fraud-prevention information from Stripe, and public business information used to verify an account.'],
              ],
            },
          ],
        },
        {
          title: 'Purposes and legal bases',
          body: [
            {
              ul: [
                [{ strong: 'Calling you back and answering your request' }, ', including by a call from our AI voice agent: your consent, given when you make the request and revocable at any time.'],
                [{ strong: 'Providing the Service, the free trial and support' }, ': performance of the contract or pre-contractual steps.'],
                [{ strong: 'Processing our customers’ data on their behalf' }, ': their instructions, on the legal basis they determine.'],
                [{ strong: 'Billing, accounting, tax compliance and responding to authorities' }, ': legal obligation.'],
                [{ strong: 'Securing the platform, preventing fraud and abuse, enforcing our terms, defending legal claims, improving our assistants from our own conversations and aggregated statistics' }, ': legitimate interests.'],
                [{ strong: 'Marketing to businesses' }, ': legitimate interests, or consent where the law requires it; you can object at any time.'],
                [{ strong: 'Analytics and advertising measurement cookies (Meta Pixel)' }, ': your consent.'],
              ],
            },
          ],
        },
        {
          title: 'Artificial intelligence, recordings and transcripts',
          body: [
            { p: 'Our assistants are artificial intelligence systems and say so. Voice conversations are recorded and transcribed; AI providers produce summaries and extract the information needed to follow up your request. No decision producing legal effects or similarly significantly affecting you is taken solely by automated means.' },
            { p: 'We do not sell your data or share it for targeted advertising. We do not use the content of our customers’ calls and messages to train our own models. Our AI providers process data under contract, on our behalf.' },
            { p: 'Customers using the platform must tell their own callers and contacts that they are interacting with an AI system and, where the law requires, that the call is recorded. They configure recording and its retention period.' },
          ],
        },
        {
          title: 'Data sharing and sub-processors',
          body: [
            { p: 'We share your data only with the recipients who need it, bound by confidentiality and data protection commitments:' },
            {
              ul: [
                [{ strong: 'Our technical platform provider' }, ': voice agents, widgets, customer area, transcription, speech synthesis and automations. This provider is established in the European Union (Romania), is ISO 27001 certified and hosts data in the European Economic Area and/or the United States.'],
                [{ strong: 'Twilio and other telecoms carriers' }, ': routing calls and SMS, phone numbers.'],
                [{ strong: 'Meta' }, ' (WhatsApp, Messenger, Instagram): when the customer uses these channels.'],
                [{ strong: 'AI, voice and transcription providers' }, ': understanding, answering, speech synthesis and transcription.'],
                [{ strong: 'Stripe' }, ': subscriptions, payments, invoices and tax calculation (PCI DSS Level 1 certified).'],
                [{ strong: 'Supabase' }, ': database of requests, sign-ups and conversation summaries (United States).'],
                [{ strong: 'Google Cloud (Firebase)' }, ': website hosting (United States).'],
                [{ strong: 'Google (Google Analytics 4)' }, ': website audience measurement, only with your consent; transfers to the United States are covered by the Data Privacy Framework.'],
                [{ strong: 'Meta Platforms Ireland Ltd (Meta Pixel)' }, ': measuring how our ads perform on Facebook and Instagram, only with your consent; transfers to the United States are covered by the Data Privacy Framework.'],
                [{ strong: 'Zoho' }, ': sending service and follow-up emails.'],
                [{ strong: 'Integrations enabled by the customer' }, ' (calendars, CRMs, automation tools), our professional advisers, authorities where the law requires, and any acquirer in a merger or sale.'],
              ],
            },
          ],
        },
        {
          title: 'International transfers',
          body: [
            { p: 'Our company and several providers are located in the United States; our technical platform provider is established in the European Union and hosts data in the EEA and/or the United States. Transfers are encrypted and safeguarded:' },
            {
              ul: [
                'European Union and EEA: the EU-US Data Privacy Framework where the recipient is certified, otherwise the European Commission’s standard contractual clauses, with supplementary measures where needed.',
                'United Kingdom: the UK Extension to that framework or the UK Addendum to the standard contractual clauses.',
                'Switzerland: the Swiss-US framework or standard contractual clauses recognised by the Federal Data Protection and Information Commissioner (FDPIC).',
                'Australia: we take reasonable steps, including contractual ones, to ensure overseas recipients handle information consistently with the Australian Privacy Principles (APP 8).',
              ],
            },
            { p: ['A copy of the relevant safeguards is available from ', mail, '.'] },
          ],
        },
        {
          title: 'How long we keep data',
          body: [
            {
              ul: [
                'Callback requests and conversations with our assistants: 24 months after the last contact.',
                'Calls, recordings, transcripts, chats and SMS processed for our customers: 90 days by default from the date of the call (the period applied by our technical provider); each customer can change this period (up to 12 months) and delete its data.',
                'Leads and contacts collected by our customers’ agents: 24 months by default, which the customer can shorten.',
                'Account data: for the duration of the contract, then 3 years for marketing unless you object. Account content is deleted within 90 days of the end of the contract.',
                'Invoices and accounting records: 10 years.',
                'Technical and security logs: for the limited period needed for security.',
              ],
            },
            { p: 'After these periods, data is deleted or anonymised.' },
          ],
        },
        {
          title: 'Security',
          body: [
            { p: 'Our technical platform provider, which is ISO 27001 certified, encrypts data in transit (TLS) and at rest (AES-256), restricts access by role and records it in audit logs; our other hosting providers (Google Cloud, Supabase) also encrypt data at rest. The customer area offers two-factor authentication (authenticator app or email code), which each customer can turn on under Profile > Security. On our side, technical keys are kept in secret vaults and access is limited to the people who need it. As no system is infallible, we notify personal data breaches to the authorities and to the people affected where the law requires.' },
          ],
        },
        {
          title: 'Your rights by country',
          body: [
            {
              ul: [
                [{ strong: 'European Union and EEA' }, ' (including France, Italy, Poland and the Netherlands): access, rectification, erasure, restriction, portability, objection (unconditional for direct marketing), withdrawal of consent and the right not to be subject to a solely automated decision. In France, you may also give instructions about your data after your death.'],
                [{ strong: 'United Kingdom' }, ': the same rights under the UK GDPR and the Data Protection Act 2018.'],
                [{ strong: 'Switzerland' }, ': the rights under the Federal Act on Data Protection (FADP).'],
                [{ strong: 'Australia' }, ': rights of access and correction under the Australian Privacy Principles, and the option of dealing with us anonymously or under a pseudonym where practicable.'],
                [{ strong: 'Elsewhere' }, ': the rights provided by your local law.'],
              ],
            },
          ],
        },
        {
          title: 'Exercising your rights and complaints',
          body: [
            { p: ['Email ', mail, ` or write to ${company}, ${ADDRESS}, United States. We may ask you to verify your identity. We reply within 30 days, extendable by two months for complex requests (we will tell you if so). This is free of charge unless a request is manifestly unfounded or excessive. If we process your data on behalf of a customer, we pass your request on to that customer.`] },
            { p: `You may lodge a complaint with ${legal.dataAuthority}, or with the data protection authority of the country where you live or work: in particular the ICO (United Kingdom), the CNIL (France), the Garante per la protezione dei dati personali (Italy), the UODO (Poland), the Autoriteit Persoonsgegevens (Netherlands) or the FDPIC (Switzerland). In Australia, please complain to us first: we respond within 30 days, after which you may contact the OAIC.` },
          ],
        },
        {
          title: 'Minors',
          body: [
            { p: 'The Service is reserved for professionals aged 18 or over. It is not directed at minors and we do not knowingly collect their data; if we learn that a minor has provided us with data, we delete it.' },
          ],
        },
        {
          title: 'Marketing, calls and opting out',
          body: [
            { p: ['We only call you at your request or with your agreement, and our agent introduces itself as an AI. At any time you can say you no longer wish to be called, reply STOP to an SMS, use the unsubscribe link in an email or write to ', mail, ': we will add you to our internal suppression list. For our own marketing, we respect the applicable do-not-call registers (TPS/CTPS in the UK, the Do Not Call Register in Australia and the equivalent rules in other countries).'] },
            { p: 'Calls and messages sent by our customers are their responsibility: please send your objection to them; if you contact us, we will pass it on.' },
          ],
        },
        {
          title: 'Cookies and “Do Not Track”',
          body: [
            { p: ['The website uses cookies that are essential to its operation and security and, only with your consent, analytics cookies (Google Analytics) and advertising measurement cookies (Meta Pixel). Details and your choices are on the ', { a: 'cookies', href: '/cookies' }, ' page. As there is no common standard, we do not respond differently to “Do Not Track” signals; we do not track your browsing on other websites ourselves. If you accept the Meta Pixel, however, Meta may link your visit to your Facebook or Instagram account to measure and deliver our ads.'] },
          ],
        },
        {
          title: 'Links to third-party websites',
          body: [
            { p: 'The website and the Service may link to third-party websites or services (Stripe, Meta, calendars, CRMs, etc.). Their own privacy policies apply and we are not responsible for them.' },
          ],
        },
        {
          title: 'Changes to this policy',
          body: [
            { p: 'We may update this policy; the date of the latest update appears at the top of the page. Material changes are announced by email to customers or by a notice on the website.' },
          ],
        },
        {
          title: 'Contact us',
          body: [
            { p: [`${company}, ${ADDRESS}, United States — `, mail, '.'] },
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
    updated: 'Last updated: 8 October 2026',
    sections: ({ brand, company, email, appHost, legal }: LegalVars): LegalSection[] => [
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
          { p: 'The website and the services are hosted by:' },
          {
            ul: [
              [{ strong: 'Front-end platform:' }, ' Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA, tel. +1 650-253-0000. Hosting region: us-east4 (Northern Virginia, United States).'],
              [{ strong: 'Databases and storage:' }, ' Supabase Inc., infrastructure located in the United States (AWS region us-east-1, Virginia).'],
              [{ strong: 'Customer area and voice agents:' }, ` the customer area (${appHost}), the agents and their data are hosted by our technical platform provider, established in the European Union (Romania), on servers located in the European Economic Area and/or the United States.`],
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
      `Controller: ${SITE.company}, ${ADDRESS}, United States, publisher of the ${siteHost} website.`,
      `Strictly necessary cookies: the ${siteHost} website and the customer area (${appHost}) use cookies that are essential for them to work (security, load balancing, logging in). They do not require your consent.`,
      `Your choice: the pia_consent cookie remembers whether you accepted or declined measurement cookies. It lasts 6 months and applies to ${siteHost} and the customer area.`,
      'Only with your consent: Google Analytics 4 (Google Ireland Ltd / Google LLC) sets the _ga and _ga_<ID> cookies, for no more than 13 months, to measure visits to the site and how well our campaigns perform (aggregated statistics). Data may be transferred to the United States under the EU–US Data Privacy Framework.',
      'Only with your consent: the Meta Pixel (Meta Platforms Ireland Ltd) measures how well our ads perform on Facebook and Instagram (visits, callback requests, clicks to WhatsApp or to call us). It sets cookies such as _fbp, for no more than 3 months. Nothing you enter in our forms (name, email, phone number) is sent to Meta. Meta may transfer data to the United States (Meta Platforms, Inc.) under the EU–US Data Privacy Framework.',
      'Without your consent, none of these cookies is set and the Meta Pixel is not loaded.',
      'You can change your mind and withdraw your consent at any time using the “Manage cookies” link at the bottom of every page. Declining won’t stop you using the site.',
      `The assistant widget, loaded from ${appHost}, may use technical storage needed for the conversation to work.`,
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
