// Plan text and feature matrix. Prices and minutes come from the market
// (src/i18n/markets.ts): this file only contains words.
import type { PlanSlug } from '../../markets';
import type { Cell, MatrixGroup, OfferText } from '../fr/offers';

export type { Cell, MatrixGroup, MatrixRow, OfferText } from '../fr/offers';

export const OFFER_TEXT: Record<PlanSlug, OfferText> = {
  decouverte: {
    name: 'Free trial',
    audience: 'To test the agent on your business',
    title: 'Try the agent free for 14 days',
    pitch: 'Explore the platform, set up a first agent, try the live demo and use up to 30 minutes of calls to see what it can do for your business.',
    cta: 'Start for free',
    highlights: ['14 days on the plan of your choice', '30 call minutes included', 'Card requested, nothing charged during the trial', 'Cancel before the end at no cost'],
  },
  receptionniste: {
    name: 'Receptionist',
    audience: 'Sole traders and small businesses',
    title: 'An AI receptionist that answers every call, 24/7',
    pitch: 'The Receptionist plan picks up your calls, answers common questions, books appointments and sends you a clear summary of every request. Simple to set up, no complexity.',
    cta: 'Choose Receptionist',
    highlights: ['24/7 AI receptionist', 'Connected calendar', 'Web callback widget', 'Transfer to a person'],
  },
  assistant: {
    name: 'Assistant',
    audience: 'Local businesses with steady call volume',
    title: 'An AI assistant that qualifies, follows up and automates your enquiries',
    pitch: 'The Assistant plan adds lead qualification, follow-up campaigns, SMS and WhatsApp messages, the flow builder and your own numbers via SIP, so you convert more enquiries.',
    cta: 'Choose Assistant',
    highlights: ['Everything in Receptionist', 'Flow builder and automations', 'Campaigns and leads', 'SMS, WhatsApp and Instagram', 'Your numbers via SIP'],
  },
  'centre-appels': {
    name: 'Call Centre',
    audience: 'Teams, multiple departments and high volumes',
    title: 'A complete AI call centre to organise reception, bookings and support',
    pitch: 'The Call Centre plan brings together multiple agents, detailed reports, roles, the advanced knowledge base, APIs and priority support, with the best per-minute price.',
    cta: 'Choose Call Centre',
    highlights: ['Everything in Assistant', 'Multiple agents and roles', 'Detailed reports', 'API, webhooks and MCP tools', 'Priority support', '3,000 message credits included ($30)'],
  },
  'sur-mesure': {
    name: 'Custom',
    audience: 'Beyond 2,500 minutes a month, regularly',
    title: 'A setup built around your volumes, locations and integrations',
    pitch: 'For networks, multi-site organisations and regular volumes above 2,500 minutes: a negotiated per-minute price, rules for each location, advanced integrations and assisted roll-out.',
    cta: 'Talk to an expert',
    highlights: ['Everything in Call Centre', 'Negotiated per-minute price', 'Multi-site rules', 'SLA and guided roll-out'],
  },
};

/** Labels built from the market figures. `n` is already formatted (e.g. "1,000"). */
export const OFFER_LABELS = {
  free: '$0',
  onQuote: 'On quote',
  minutesPerMonth: (n: string) => `${n} min / month`,
  trialMinutes: (n: string, days: number) => `${n} minutes over ${days} days`,
  customVolume: 'Volume tailored to your business',
  perMinute: (price: string) => `${price} excl. tax / min`,
  exclTax: 'excl. tax',
  perMonth: 'excl. tax / month',
};

// Feature matrix: each row matches a page or feature in the customer interface.
// Values: true = included, false = not included, text = level.
const all = (v: Cell): Record<PlanSlug, Cell> => ({ decouverte: v, receptionniste: v, assistant: v, 'centre-appels': v, 'sur-mesure': v });

export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents and calls',
    rows: [
      { label: 'AI voice assistants', detail: 'Inbound and outbound agents', cells: { decouverte: '1 test agent', receptionniste: '1', assistant: '3', 'centre-appels': 'Multiple agents', 'sur-mesure': 'Custom' } },
      { label: 'Call history', detail: 'Recordings, transcripts, summaries', cells: { ...all(true), decouverte: 'Limited' } },
      { label: 'Conversations', detail: 'Written and voice exchanges in one place', cells: all(true) },
      { label: 'Transfer to a person', detail: 'Hand over to your team', cells: all(true) },
      { label: 'Multilingual voices', detail: 'Secondary languages detected', cells: all(true) },
    ],
  },
  {
    group: 'Agent setup',
    rows: [
      { label: 'AI prompt editor', detail: 'Behaviour, tone, rules', cells: { decouverte: 'Preview', receptionniste: 'Simplified', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Knowledge base', detail: 'PDFs, web pages, procedures', cells: { decouverte: 'Basic', receptionniste: 'Basic', assistant: true, 'centre-appels': 'Advanced', 'sur-mesure': 'Advanced' } },
      { label: 'Flow builder', detail: 'Visual no-code scenarios', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': 'Advanced', 'sur-mesure': 'Advanced' } },
      { label: 'Automations', detail: 'Over 300 tools you can connect', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Calendar and capture',
    rows: [
      { label: 'Calendar integration', detail: 'Google, Outlook, Cal.com, Calendly', cells: all(true) },
      { label: 'Web widget', detail: 'Callback and calls from your website', cells: all(true) },
      { label: 'Caller identification', detail: 'Caller ID button', cells: { ...all(true), decouverte: false } },
      { label: 'Leads and pre-qualification', detail: 'Structured prospect records', cells: { decouverte: false, receptionniste: 'Basic', assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Messages and campaigns',
    rows: [
      { label: 'Outbound campaigns', detail: 'Follow-ups, confirmations, reminders', cells: { decouverte: false, receptionniste: false, assistant: 'With limits', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'SMS history', detail: 'Messages sent and replies', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'WhatsApp', detail: 'Senders and templates', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Messenger and Instagram', detail: 'Messaging channels', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
    ],
  },
  {
    group: 'Telephony',
    rows: [
      { label: 'Dedicated number', detail: 'Optional, billed monthly, depends on the country', cells: { decouverte: false, receptionniste: 'Optional', assistant: 'Optional', 'centre-appels': 'Optional', 'sur-mesure': 'Optional' } },
      { label: 'SIP integration', detail: 'Your numbers and your phone system', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Block list', detail: 'Numbers excluded from calls', cells: { ...all(true), decouverte: false } },
    ],
  },
  {
    group: 'Management and team',
    rows: [
      { label: 'Detailed reports', detail: 'Volumes, durations, conversions', cells: { decouverte: false, receptionniste: 'Dashboard', assistant: 'Dashboard', 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Roles and permissions', detail: 'Access for each team member', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API, webhooks and MCP tools', detail: 'Connect to your systems', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Multi-site rules and SLA', detail: 'Several locations', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Help and guidance', cells: { decouverte: 'Resources', receptionniste: 'Standard', assistant: 'Standard', 'centre-appels': 'Priority', 'sur-mesure': 'Dedicated' } },
    ],
  },
];
