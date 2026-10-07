// Customer area guide (English interface): menu glossary and step-by-step tasks.
// Also serves as the knowledge base for the help assistant built into the customer area.
import type { HelpTask, MenuEntry } from '../fr/help';

export type { HelpTask, MenuEntry } from '../fr/help';

export const HELP_MENU: MenuEntry[] = [
  { en: 'Dashboard', label: 'Dashboard', text: 'Overview: calls this month, minutes used, results.' },
  { en: 'Assistants', label: 'Voice agents', text: 'Create, edit and test your agents (reception, callbacks, support).' },
  { en: 'Calls history', label: 'Call history', text: 'Every call with its recording, transcript, summary and extracted data.' },
  { en: 'Knowledge base', label: 'Knowledge base', text: 'Documents and web pages the agent refers to during calls.' },
  { en: 'Mid call tools / MCP', label: 'In-call tools', text: 'Actions the agent triggers live: send a request to your CRM, check a piece of information…' },
  { en: 'Blacklist', label: 'Exclusion list', text: 'Numbers that must never be called.' },
  { en: 'Campaigns', label: 'Campaigns', text: 'Outbound calls to a contact list (reminders, follow-ups, booking appointments).' },
  { en: 'Leads', label: 'Contacts / prospects', text: 'Imported or created contacts, with their status.' },
  { en: 'Inbox', label: 'Inbox', text: 'All written conversations in one place: web widget, WhatsApp, SMS, Messenger, Instagram.' },
  { en: 'Channels → WhatsApp / Messenger & Instagram', label: 'Channels', text: 'Connect your messaging accounts.' },
  { en: 'Get new phone number', label: 'Get a number', text: 'Buy a dedicated number (optional, paid monthly, price shown before you buy).' },
  { en: 'Your phone numbers', label: 'Your numbers', text: 'Your numbers, Twilio / Telnyx import and SIP connection.' },
  { en: 'Automate platform', label: 'Automations', text: 'No-code automated workflows connected to over 300 tools (Assistant plan and above).' },
  { en: 'Change plan', label: 'Change plan', text: 'Move up or down a plan.' },
  { en: 'Add credits', label: 'Add credit', text: 'Buy a minute top-up; credit never expires.' },
  { en: 'Billing info', label: 'Billing', text: 'Payment method, invoices, subscription and cancellation.' },
  { en: 'Limits', label: 'Limits', text: 'What your plan allows: agents, simultaneous calls, features.' },
  { en: 'API Keys', label: 'API keys', text: 'Connect your own software (all plans).' },
  { en: 'My profile / Security', label: 'Profile / Security', text: 'Your details, password and two-factor authentication.' },
];

export const HELP_TASKS: HelpTask[] = [
  {
    title: 'Create your first voice agent',
    steps: [
      'Go to Assistants, then Create.',
      'General: choose Receive phone calls or Make phone calls, then enter a name and the time zone.',
      'Voice & speech: set the language to English, then choose a voice and listen to it.',
      'Brain & prompt: describe your business and what the agent should and should not do. The writing assistant (AI Prompt Editor) can write it for you.',
      'Greeting: the first sentence the agent says.',
      'Click Create assistant, then Test assistant to chat with it from your browser (a voice test is also available).',
    ],
  },
  {
    title: 'Add your information (knowledge base)',
    steps: [
      'Go to Knowledge base, then create a base.',
      'Add a document: a PDF, a text file or the address of a page on your website.',
      'In your agent, under Knowledgebase, select this base.',
    ],
  },
  {
    title: 'Receive calls on your number',
    steps: [
      'The simplest way: buy a number in Get new phone number, then select it in the agent (General → Phone number).',
      'To keep your current number: ask your carrier to forward calls to this new number.',
      'If you already have Twilio, Telnyx or a SIP phone system: go to Your phone numbers, then import or SIP (all plans).',
    ],
  },
  {
    title: 'Let the agent book appointments',
    steps: [
      'In the agent, go to Tools & actions.',
      'Add the calendar integration (Cal.com or Calendly, which are themselves linked to your Google or Outlook calendar) and connect your account.',
      'State in the prompt when the agent should offer an appointment.',
    ],
  },
  {
    title: 'Transfer a call to yourself',
    steps: [
      'In the agent, under Tools & actions, add Call transfer.',
      'Enter your number and when to transfer (emergency, caller asks for a person…).',
    ],
  },
  {
    title: 'Put the agent on your website (widget)',
    steps: [
      'In the agent, under Web widget: turn on the widget, choose voice and/or chat, colours and text.',
      'Copy the code provided and paste it before the </body> tag of your website (or ask your web developer).',
    ],
  },
  {
    title: 'Run an outbound call campaign',
    steps: [
      'Create an agent in Make phone calls mode.',
      'Go to Leads: import your contacts (CSV file); only call people who have given their consent.',
      'Go to Campaigns: create the campaign, choose the agent, the contacts and the calling hours, then start it.',
    ],
  },
  {
    title: 'Send call results to your tools',
    steps: [
      'In the agent, under Webhooks & channels: enter the address that should receive each completed call.',
      'Or use Automate platform to send summaries to Google Sheets, your CRM, Slack, an email… (Assistant plan and above).',
    ],
  },
  {
    title: 'Add minutes or change plan',
    steps: [
      'For a one-off need: Add credits and choose a top-up. Credit never expires.',
      'If you often go over: Change plan; the next plan up is cheaper per minute.',
    ],
  },
  {
    title: 'Manage your trial, billing and invoices',
    steps: [
      'The trial starts when you choose your first plan in Change plan: 14 days free, 30 minutes included, nothing charged during the trial.',
      'Billing info: payment method, downloadable invoices and subscription management.',
      'To pay nothing, cancel from Billing info before the 14 days are up.',
    ],
  },
];

export const HELP_GLOSSARY: MenuEntry[] = [
  { en: 'Inbound / Outbound', label: 'Inbound / outbound', text: 'Calls received / calls made by the agent.' },
  { en: 'Prompt', label: 'Prompt', text: 'The text that describes the agent’s role and rules.' },
  { en: 'Pipeline / Speech-to-speech / Dualplex', label: 'Engine', text: 'The voice technology. Leave it on Pipeline if you are unsure: it is the recommended setting.' },
  { en: 'Post-call evaluation', label: 'Post-call analysis', text: 'The information automatically extracted from each call (name, need, appointment…).' },
  { en: 'Variables', label: 'Variables', text: 'Custom fields such as {{customer_name}}, filled in for each contact.' },
  { en: 'Voicemail', label: 'Voicemail', text: 'What the agent does if it reaches a voicemail.' },
  { en: 'Credits', label: 'Credit', text: 'Your credit balance. Used for extra minutes and written messages (AI replies, WhatsApp, SMS); the cost of each use is shown on the Pricing page.' },
];
