// Integraties gepresenteerd als voordelen. Alleen koppelingen die echt beschikbaar zijn
// via het platform (eigen agendakoppelingen, no-code automatiseringen, kanalen, telefonie).
import type { Integration } from '../fr/integrations';

export type { Integration };

export const INTEGRATIONS: Integration[] = [
  { name: 'Google Agenda', category: 'Agenda', text: 'Via Cal.com of Calendly: vrije tijdsloten en directe boekingen.', mark: 'G', color: '#4285F4' },
  { name: 'Outlook', category: 'Agenda', text: 'Via Cal.com of Calendly, gesynchroniseerd met uw Microsoft-agenda.', mark: 'O', color: '#0A64AD' },
  { name: 'Cal.com', category: 'Agenda', text: 'Afspraaktypen en teams.', mark: 'C', color: '#111827' },
  { name: 'Calendly', category: 'Agenda', text: 'Boekingen via uw afspraaktypen.', mark: 'C', color: '#006BFF' },
  { name: 'HubSpot', category: 'CRM', text: 'Contacten en deals bijgewerkt.', mark: 'H', color: '#FF7A59' },
  { name: 'Zoho CRM', category: 'CRM', text: 'Leads aangemaakt na elk gesprek.', mark: 'Z', color: '#E42527' },
  { name: 'GoHighLevel', category: 'CRM', text: 'Lead Connector en pipelines.', mark: 'HL', color: '#188BF6' },
  { name: 'Google Sheets', category: 'Gegevens', text: 'Eén rij per aanvraag, zonder overtypen.', mark: 'S', color: '#0F9D58' },
  { name: 'WhatsApp', category: 'Berichten', text: 'Bevestigingen en schriftelijke antwoorden.', mark: 'W', color: '#25D366' },
  { name: 'Instagram', category: 'Berichten', text: 'Directe berichten op één plek.', mark: 'I', color: '#C13584' },
  { name: 'Messenger', category: 'Berichten', text: 'Facebook-gesprekken.', mark: 'M', color: '#0084FF' },
  { name: 'SIP', category: 'Telefonie', text: 'Uw telefooncentrale en uw nummers.', mark: 'SIP', color: '#0E1B4D' },
  { name: 'Twilio', category: 'Telefonie', text: 'Import van uw nummers.', mark: 'T', color: '#F22F46' },
  { name: 'Telnyx', category: 'Telefonie', text: 'Import van uw nummers.', mark: 'Tx', color: '#00C08B' },
  { name: 'Webhooks', category: 'Ontwikkelaars', text: 'Gebeurtenissen naar uw systemen gestuurd.', mark: '{ }', color: '#0FA3C4' },
  { name: '300+ tools', category: 'Automatiseringen', text: 'Via no-code automatiseringen.', mark: '+', color: '#22306A' },
];
