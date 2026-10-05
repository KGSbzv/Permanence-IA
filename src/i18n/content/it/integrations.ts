// Integrazioni presentate come vantaggi. Elenco limitato ai collegamenti realmente disponibili
// tramite la piattaforma (calendari nativi, automazioni no-code, canali, telefonia).
import type { Integration } from '../fr/integrations';

export type { Integration } from '../fr/integrations';

export const INTEGRATIONS: Integration[] = [
  { name: 'Google Calendar', category: 'Calendario', text: 'Orari liberi e prenotazioni in tempo reale.', mark: 'G', color: '#4285F4' },
  { name: 'Outlook', category: 'Calendario', text: 'Calendario Microsoft sincronizzato.', mark: 'O', color: '#0A64AD' },
  { name: 'Cal.com', category: 'Calendario', text: 'Tipi di appuntamento e team.', mark: 'C', color: '#111827' },
  { name: 'Calendly', category: 'Calendario', text: 'Prenotazione sui Suoi eventi.', mark: 'C', color: '#006BFF' },
  { name: 'HubSpot', category: 'CRM', text: 'Contatti e trattative aggiornati.', mark: 'H', color: '#FF7A59' },
  { name: 'Zoho CRM', category: 'CRM', text: 'Lead creati dopo ogni chiamata.', mark: 'Z', color: '#E42527' },
  { name: 'GoHighLevel', category: 'CRM', text: 'Lead Connector e pipeline.', mark: 'HL', color: '#188BF6' },
  { name: 'Google Sheets', category: 'Dati', text: 'Una riga per richiesta, senza reinserimenti.', mark: 'S', color: '#0F9D58' },
  { name: 'WhatsApp', category: 'Messaggi', text: 'Conferme e risposte scritte.', mark: 'W', color: '#25D366' },
  { name: 'Instagram', category: 'Messaggi', text: 'Messaggi diretti centralizzati.', mark: 'I', color: '#C13584' },
  { name: 'Messenger', category: 'Messaggi', text: 'Conversazioni Facebook.', mark: 'M', color: '#0084FF' },
  { name: 'SIP', category: 'Telefonia', text: 'Il Suo centralino e i Suoi numeri.', mark: 'SIP', color: '#0E1B4D' },
  { name: 'Twilio', category: 'Telefonia', text: 'Importazione dei Suoi numeri.', mark: 'T', color: '#F22F46' },
  { name: 'Telnyx', category: 'Telefonia', text: 'Importazione dei Suoi numeri.', mark: 'Tx', color: '#00C08B' },
  { name: 'Webhook', category: 'Sviluppatori', text: 'Eventi inviati ai Suoi sistemi.', mark: '{ }', color: '#0FA3C4' },
  { name: '+300 strumenti', category: 'Automazioni', text: 'Tramite il flow builder senza codice.', mark: '+', color: '#22306A' },
];
