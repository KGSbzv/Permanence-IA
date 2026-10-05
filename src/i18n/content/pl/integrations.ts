// Integracje przedstawione jako korzyści. Lista ograniczona do połączeń faktycznie dostępnych
// na platformie (natywne kalendarze, automatyzacje bez kodu, kanały, telefonia).
import type { Integration } from '../fr/integrations';

export const INTEGRATIONS: Integration[] = [
  { name: 'Kalendarz Google', category: 'Kalendarz', text: 'Wolne terminy i rezerwacje na bieżąco.', mark: 'G', color: '#4285F4' },
  { name: 'Outlook', category: 'Kalendarz', text: 'Zsynchronizowany kalendarz Microsoft.', mark: 'O', color: '#0A64AD' },
  { name: 'Cal.com', category: 'Kalendarz', text: 'Typy spotkań i zespoły.', mark: 'C', color: '#111827' },
  { name: 'Calendly', category: 'Kalendarz', text: 'Rezerwacje w Twoich wydarzeniach.', mark: 'C', color: '#006BFF' },
  { name: 'HubSpot', category: 'CRM', text: 'Aktualne kontakty i transakcje.', mark: 'H', color: '#FF7A59' },
  { name: 'Zoho CRM', category: 'CRM', text: 'Leady tworzone po każdej rozmowie.', mark: 'Z', color: '#E42527' },
  { name: 'GoHighLevel', category: 'CRM', text: 'Lead Connector i lejki sprzedaży.', mark: 'HL', color: '#188BF6' },
  { name: 'Google Sheets', category: 'Dane', text: 'Jeden wiersz na zgłoszenie, bez przepisywania.', mark: 'S', color: '#0F9D58' },
  { name: 'WhatsApp', category: 'Wiadomości', text: 'Potwierdzenia i odpowiedzi na piśmie.', mark: 'W', color: '#25D366' },
  { name: 'Instagram', category: 'Wiadomości', text: 'Wiadomości prywatne w jednym miejscu.', mark: 'I', color: '#C13584' },
  { name: 'Messenger', category: 'Wiadomości', text: 'Rozmowy z Facebooka.', mark: 'M', color: '#0084FF' },
  { name: 'SIP', category: 'Telefonia', text: 'Twoja centrala i Twoje numery.', mark: 'SIP', color: '#0E1B4D' },
  { name: 'Twilio', category: 'Telefonia', text: 'Import Twoich numerów.', mark: 'T', color: '#F22F46' },
  { name: 'Telnyx', category: 'Telefonia', text: 'Import Twoich numerów.', mark: 'Tx', color: '#00C08B' },
  { name: 'Webhooks', category: 'Dla programistów', text: 'Zdarzenia wysyłane do Twoich systemów.', mark: '{ }', color: '#0FA3C4' },
  { name: '300+ narzędzi', category: 'Automatyzacje', text: 'Przez flow builder, bez kodowania.', mark: '+', color: '#22306A' },
];
