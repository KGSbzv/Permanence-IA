// Integrations presented as benefits. Limited to connections actually available
// through the platform (native calendars, no-code automations, channels, telephony).
import type { Integration } from '../fr/integrations';

export type { Integration } from '../fr/integrations';

export const INTEGRATIONS: Integration[] = [
  { name: 'Google Calendar', category: 'Calendar', text: 'Free slots and live bookings, through Cal.com or Calendly.', mark: 'G', color: '#4285F4' },
  { name: 'Outlook', category: 'Calendar', text: 'Microsoft calendar kept in sync, through Cal.com or Calendly.', mark: 'O', color: '#0A64AD' },
  { name: 'Cal.com', category: 'Calendar', text: 'Appointment types and teams.', mark: 'C', color: '#111827' },
  { name: 'Calendly', category: 'Calendar', text: 'Bookings on your events.', mark: 'C', color: '#006BFF' },
  { name: 'HubSpot', category: 'CRM', text: 'Contacts and deals kept up to date.', mark: 'H', color: '#FF7A59' },
  { name: 'Zoho CRM', category: 'CRM', text: 'Leads created after every call.', mark: 'Z', color: '#E42527' },
  { name: 'GoHighLevel', category: 'CRM', text: 'Lead Connector and pipelines.', mark: 'HL', color: '#188BF6' },
  { name: 'Google Sheets', category: 'Data', text: 'One row per enquiry, no retyping.', mark: 'S', color: '#0F9D58' },
  { name: 'WhatsApp', category: 'Messages', text: 'Confirmations and written replies.', mark: 'W', color: '#25D366' },
  { name: 'Instagram', category: 'Messages', text: 'Direct messages in one place.', mark: 'I', color: '#C13584' },
  { name: 'Messenger', category: 'Messages', text: 'Facebook conversations.', mark: 'M', color: '#0084FF' },
  { name: 'SIP', category: 'Telephony', text: 'Your phone system and your numbers.', mark: 'SIP', color: '#0E1B4D' },
  { name: 'Twilio', category: 'Telephony', text: 'Import your numbers.', mark: 'T', color: '#F22F46' },
  { name: 'Telnyx', category: 'Telephony', text: 'Import your numbers.', mark: 'Tx', color: '#00C08B' },
  { name: 'Webhooks', category: 'Developers', text: 'Events sent to your systems.', mark: '{ }', color: '#0FA3C4' },
  { name: '300+ tools', category: 'Automations', text: 'Through no-code automated workflows.', mark: '+', color: '#22306A' },
];
