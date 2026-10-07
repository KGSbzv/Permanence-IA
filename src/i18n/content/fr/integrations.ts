// Intégrations présentées comme des bénéfices (doc 95). Liste limitée aux connexions réellement disponibles
// via la plateforme (agendas via Cal.com ou Calendly, automatisations no-code, canaux, téléphonie).
export interface Integration { name: string; category: string; text: string; mark: string; color: string }

export const INTEGRATIONS: Integration[] = [
  { name: 'Google Agenda', category: 'Agenda', text: 'Créneaux libres et réservations, via Cal.com ou Calendly.', mark: 'G', color: '#4285F4' },
  { name: 'Outlook', category: 'Agenda', text: 'Agenda Microsoft, synchronisé via Cal.com ou Calendly.', mark: 'O', color: '#0A64AD' },
  { name: 'Cal.com', category: 'Agenda', text: 'Types de rendez-vous et équipes.', mark: 'C', color: '#111827' },
  { name: 'Calendly', category: 'Agenda', text: 'Réservation sur vos événements.', mark: 'C', color: '#006BFF' },
  { name: 'HubSpot', category: 'CRM', text: 'Contacts et transactions mis à jour.', mark: 'H', color: '#FF7A59' },
  { name: 'Zoho CRM', category: 'CRM', text: 'Fiches prospects créées après chaque appel.', mark: 'Z', color: '#E42527' },
  { name: 'GoHighLevel', category: 'CRM', text: 'LeadConnector et pipelines.', mark: 'HL', color: '#188BF6' },
  { name: 'Google Sheets', category: 'Données', text: 'Une ligne par demande, sans ressaisie.', mark: 'S', color: '#0F9D58' },
  { name: 'WhatsApp', category: 'Messages', text: 'Confirmations et réponses écrites.', mark: 'W', color: '#25D366' },
  { name: 'Instagram', category: 'Messages', text: 'Messages directs centralisés.', mark: 'I', color: '#C13584' },
  { name: 'Messenger', category: 'Messages', text: 'Conversations Facebook.', mark: 'M', color: '#0084FF' },
  { name: 'SIP', category: 'Téléphonie', text: 'Votre standard et vos numéros.', mark: 'SIP', color: '#0E1B4D' },
  { name: 'Twilio', category: 'Téléphonie', text: 'Import de vos numéros.', mark: 'T', color: '#F22F46' },
  { name: 'Telnyx', category: 'Téléphonie', text: 'Import de vos numéros.', mark: 'Tx', color: '#00C08B' },
  { name: 'Webhooks', category: 'Développeurs', text: 'Événements envoyés à vos systèmes.', mark: '{ }', color: '#0FA3C4' },
  { name: '+300 outils', category: 'Automatisations', text: 'Via les scénarios automatisés sans code.', mark: '+', color: '#22306A' },
];
