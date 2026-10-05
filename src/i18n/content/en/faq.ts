// General FAQ and pricing FAQ.
import type { QA } from '../fr/faq';

export type { QA } from '../fr/faq';

export const FAQ_GENERAL: QA[] = [
  { q: 'How does the AI calling platform work?', a: 'You set up a voice agent with your information, your rules and your tone. It answers inbound calls, makes authorised outbound calls, qualifies enquiries, books appointments and sends you a summary of every conversation.' },
  { q: 'How long does it take to get started?', a: 'A first agent is ready in a few minutes from your information. For a full setup (calendar, numbers, transfers), allow one to two days in most cases, with our help.' },
  { q: 'Do I need technical skills?', a: 'No. You describe your business, the prompt assistant guides you, and we help with telephony and integrations.' },
  { q: 'What happens if the agent doesn’t know the answer?', a: 'It doesn’t make one up: it notes the request, offers a callback or transfers to your team, following the rules you have set.' },
  { q: 'Can the agent handle several calls at once?', a: 'Yes. Several calls are handled in parallel on the same line, so your customers no longer wait.' },
  { q: 'How is this different from voicemail or a traditional phone system?', a: 'Voicemail records, a phone system routes. The AI agent understands the request, asks the right questions, takes action (appointment, callback, answer) and sends you a record you can act on.' },
  { q: 'Can I use my existing phone system?', a: 'Yes. You can forward your current line to the agent, connect your phone system or carrier via SIP, or import your Twilio and Telnyx numbers.' },
  { q: 'Can I connect my calendar?', a: 'Yes: Google Calendar, Outlook, Cal.com and Calendly. The agent offers free slots and books directly.' },
  { q: 'Can I edit the prompts?', a: 'Yes. The prompt editor lets you set the agent’s goal, tone, questions and limits, step by step, with no technical expertise.' },
  { q: 'Can I build scenarios without code?', a: 'Yes, with the flow builder from the Assistant plan upwards: you chain triggers and actions by drag and drop, connected to over 300 tools.' },
  { q: 'Can I use WhatsApp and Instagram?', a: 'Yes, from the Assistant plan upwards: SMS, WhatsApp, Messenger and Instagram, with a single message history.' },
  { q: 'Do you provide phone numbers?', a: 'Yes, as an option: a dedicated number is bought from your customer area and paid monthly, on top of your plan (for example $3.99 excl. tax a month for a US, Canadian or UK number; the exact price is shown before you buy). Countries available to buy: United States, Canada, United Kingdom, Australia, Italy, Netherlands, Poland, Denmark, Finland, Romania, Israel, South Africa. For a country not listed, or to keep your own number: call forwarding, Twilio or Telnyx import, or a SIP connection.' },
  { q: 'Can I use SIP?', a: 'Yes, from the Assistant plan upwards. We guide you through connecting your SIP trunk or phone system.' },
  { q: 'How do you load my business information?', a: 'You add your PDF documents, website pages or procedures to the knowledge base. The agent refers to them during the call.' },
  { q: 'Is it GDPR compliant?', a: 'The platform provides the tools you need: consent, an exclusion list, configurable retention, data deletion and access control. Your setup and privacy notices still need to fit your business; we help you with that.' },
  { q: 'How does the free trial work?', a: 'You create your account, then choose the plan you want to try: the first 14 days are free, with 30 minutes of calls included. A card is required on activation but nothing is charged during the trial. Cancel before the 14 days are up and you pay nothing.' },
  { q: 'What language is the customer area in?', a: 'The customer area interface is in English. A built-in help assistant guides you in writing or out loud, and the Help page of the customer area explains each menu and walks you through common tasks step by step.' },
  { q: 'Who calls me back when I leave my number?', a: 'Our AI voice assistant calls you back during business hours to understand what you need and give you a demo; an adviser takes over if you wish. You can ask not to be called again at any time.' },
  { q: 'Does the agent say it is an AI?', a: 'Yes. The agent is honestly presented as an AI assistant, and can transfer to a person when you have set it up to do so.' },
];

export const FAQ_PRICING: QA[] = [
  { q: 'What happens after the 30 trial minutes?', a: 'The 30 minutes are the cap for the trial period: once reached, calls stop until the trial ends or until you start your subscription. At the end of the 14 days, your chosen plan starts, unless you have cancelled it from your customer area.' },
  { q: 'Are prices excl. tax?', a: 'Yes, all prices are shown excluding tax. Local taxes are added where they apply.' },
  { q: 'What happens if I go over my minutes?', a: 'You can add minutes at any time with a top-up, to cover a busy month. If you regularly go over, the next plan up works out cheaper per minute: we will let you know.' },
  { q: 'Is a phone number included in the plan?', a: 'No. The plan covers minutes and features; a dedicated number is an option paid monthly, at the price shown before you buy. You can also use your current number at no charge from us: call forwarding (your carrier may charge for forwarding to an overseas number), Twilio or Telnyx import, or SIP.' },
  { q: 'Can I use my own number?', a: 'Yes, with call forwarding, Twilio or Telnyx import, or a SIP connection from the Assistant plan upwards.' },
  { q: 'Do you have a live demo?', a: 'Yes. You can talk to the agent from your browser or ask for a callback for a demo.' },
  { q: 'Why does a top-up cost more per minute than a plan?', a: 'A top-up is there for occasional extra needs. A plan remains the most economical option for regular volume: the bigger the plan, the lower the price per minute.' },
  { q: 'How am I billed?', a: 'Your subscription is charged to your card every month, on the same date, and the invoice is available in your customer area (Billing info). Minute top-ups are billed when you buy them. Taxes are calculated automatically based on your country and status.' },
  { q: 'How do I cancel my subscription?', a: 'From your customer area (Billing info), at any time and free of charge. During the trial, cancelling avoids any charge. After the trial, your subscription stays active until the end of the period already paid for, then stops.' },
  { q: 'Can I change plan?', a: 'Yes, at any time and with no commitment. Move up a plan when your volume grows; the change is shown before you confirm.' },
];
