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
    highlights: ['1 AI voice agent answering 24/7', '2 concurrent calls', '1 knowledge base; 1 dedicated number possible (optional, from US$3.99 excl. tax / month)', 'Connected calendar and web widget', 'Call transfer to your team', 'SMS, WhatsApp and Messenger, 200 message credits a month (≈ 65 written replies)'],
  },
  assistant: {
    name: 'Assistant',
    audience: 'Local businesses with steady call volume',
    title: 'An AI assistant that qualifies, follows up and automates your enquiries',
    pitch: 'The Assistant plan adds three agents, follow-up campaigns, no-code automations connected to over 300 tools and a cloned voice, so you convert more enquiries.',
    cta: 'Choose Assistant',
    highlights: ['Everything in Receptionist, plus:', '3 agents, 5 concurrent calls', '3 knowledge bases, 3 in-call tools; up to 3 dedicated numbers (optional, from US$3.99 excl. tax / month)', '3 follow-up campaigns', 'No-code automations (5,000 runs / month)', '1 cloned voice', '1,000 message credits a month (≈ 330 written replies)'],
  },
  'centre-appels': {
    name: 'Call Centre',
    audience: 'Teams, multiple departments and high volumes',
    title: 'A complete AI call centre to organise reception, bookings and support',
    pitch: 'The Call Centre plan removes the limits: unlimited agents and campaigns, 20 concurrent calls, custom dashboards, priority support and the best per-minute price.',
    cta: 'Choose Call Centre',
    highlights: ['Everything in Assistant, plus:', 'Unlimited agents, campaigns and knowledge bases', '20 concurrent calls; up to 10 dedicated numbers (optional, from US$3.99 excl. tax / month)', '3 cloned voices, 50,000 automations / month', 'Custom dashboards', 'Priority support', '3,000 message credits a month (≈ 1,000 written replies)'],
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
const paid = (v: Cell): Record<PlanSlug, Cell> => ({ ...all(v), decouverte: false });

// Limits taken from the customer-area admin (Receptionist 1646, Assistant 1647, Call Centre 1650 plans
// and the trial): any change to a plan in the admin must be reflected here, and vice versa.
export const MATRIX: MatrixGroup[] = [
  {
    group: 'Agents and calls',
    rows: [
      { label: 'AI voice agents', detail: 'Number of agents you can create, inbound or outbound.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Unlimited', 'sur-mesure': 'Unlimited' } },
      { label: 'Concurrent calls', detail: 'Calls handled at the same time: nobody waits, even at peak hours.', cells: { decouverte: '1', receptionniste: '2', assistant: '5', 'centre-appels': '20', 'sur-mesure': 'Custom' } },
      { label: 'Call history', detail: 'Recordings, transcripts and summaries of every call.', cells: all(true) },
      { label: 'Transfer to a person', detail: 'The agent hands the call over to your team when needed.', cells: all(true) },
      { label: 'Secondary languages', detail: 'The agent detects the caller’s language and replies in it.', cells: all(true) },
      { label: 'Cloned voices', detail: 'A voice created from a recording of your own.', cells: { decouverte: false, receptionniste: false, assistant: '1', 'centre-appels': '3', 'sur-mesure': 'Custom' } },
    ],
  },
  {
    group: 'Agent setup',
    rows: [
      { label: 'AI prompt editor', detail: 'A writing assistant sets the agent’s behaviour, tone and rules.', cells: all(true) },
      { label: 'Knowledge bases', detail: 'PDFs, web pages and procedures the agent refers to during the call.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': 'Unlimited', 'sur-mesure': 'Unlimited' } },
      { label: 'Mid-call tools', detail: 'Live actions: check availability, look up a record, query your software.', cells: { decouverte: '1', receptionniste: false, assistant: '3', 'centre-appels': 'Unlimited', 'sur-mesure': 'Unlimited' } },
      { label: 'Automated workflows', detail: 'Visual no-code scenarios: triggers, conditions and actions.', cells: { decouverte: false, receptionniste: false, assistant: true, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'Automation platform', detail: 'Over 300 tools you can connect: CRM, Google Sheets, Slack, email…', cells: { decouverte: false, receptionniste: false, assistant: '5,000 runs / month', 'centre-appels': '50,000 runs / month', 'sur-mesure': 'Custom' } },
      { label: 'AI connector', detail: 'Run your account from ChatGPT or Claude: create an agent, review calls, trigger actions.', cells: all(true) },
    ],
  },
  {
    group: 'Calendar and capture',
    rows: [
      { label: 'Calendar integration', detail: 'Google Calendar, Outlook and more through Cal.com or Calendly: the agent books straight into your calendar.', cells: all(true) },
      { label: 'Web widget', detail: 'Call and callback button to add to your website.', cells: all(true) },
      { label: 'Leads', detail: 'Prospect records created from your calls.', cells: all(true) },
    ],
  },
  {
    group: 'Messages and campaigns',
    rows: [
      { label: 'Outbound campaigns', detail: 'Follow-ups, confirmations and reminders called automatically.', cells: { decouverte: false, receptionniste: false, assistant: '3', 'centre-appels': 'Unlimited', 'sur-mesure': 'Unlimited' } },
      { label: 'SMS and WhatsApp', detail: 'Written conversations in one place, paid for with message credits.', cells: all(true) },
      { label: 'Messenger and Instagram', detail: 'Social media messages in the same inbox.', cells: all(true) },
      { label: 'Message credits included', detail: 'Credits allocated every month for written exchanges (website chat, WhatsApp, Messenger, Instagram, SMS). A written AI reply costs 3 credits. For more, buy them in your customer area (Add credits): 100 credits for US$1, from 100 credits. You can also convert minutes: 1 minute = 9 credits.', cells: { decouverte: false, receptionniste: '200 / month (≈ 65 replies)', assistant: '1,000 / month (≈ 330 replies)', 'centre-appels': '3,000 / month (≈ 1,000 replies)', 'sur-mesure': 'On quote' } },
    ],
  },
  {
    group: 'Telephony',
    rows: [
      { label: 'Phone numbers', detail: 'Maximum number of dedicated numbers. Optional, bought from your customer area, from US$3.99 excl. tax / month depending on the country.', cells: { decouverte: '1', receptionniste: '1', assistant: '3', 'centre-appels': '10', 'sur-mesure': 'Custom' } },
      { label: 'SIP connection', detail: 'Keep your numbers and phone system: SIP connection, Twilio or Telnyx import.', cells: all(true) },
      { label: 'Your own mobile as caller ID', detail: 'Verify your number so it is displayed on outbound calls.', cells: paid(true) },
      { label: 'Exclusion list', detail: 'Numbers the agent never calls.', cells: all(true) },
    ],
  },
  {
    group: 'Management and integrations',
    rows: [
      { label: 'Call statistics', detail: 'Volumes, durations and outcomes on your dashboard.', cells: all(true) },
      { label: 'Custom dashboards', detail: 'Your own KPIs, built from your call data.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': true, 'sur-mesure': true } },
      { label: 'API and webhooks', detail: 'Receive every completed call in your systems, or drive the agent from your software.', cells: all(true) },
      { label: 'Multi-site rules and SLA', detail: 'Several locations, service-level commitments.', cells: { decouverte: false, receptionniste: false, assistant: false, 'centre-appels': false, 'sur-mesure': true } },
      { label: 'Support', detail: 'Help and guidance from our team.', cells: { decouverte: 'Resources', receptionniste: 'Standard', assistant: 'Standard', 'centre-appels': 'Priority', 'sur-mesure': 'Dedicated' } },
    ],
  },
];
