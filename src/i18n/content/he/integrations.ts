// Integrations presented as benefits (Hebrew). Limited to connections actually available
// through the platform (native calendars, no-code automations, channels, telephony).
import type { Integration } from '../fr/integrations';

export type { Integration } from '../fr/integrations';

export const INTEGRATIONS: Integration[] = [
  { name: 'Google Calendar', category: 'יומן', text: 'זמנים פנויים וקביעת תורים בזמן אמת.', mark: 'G', color: '#4285F4' },
  { name: 'Outlook', category: 'יומן', text: 'יומן Microsoft מסונכרן תמיד.', mark: 'O', color: '#0A64AD' },
  { name: 'Cal.com', category: 'יומן', text: 'סוגי פגישות וצוותים.', mark: 'C', color: '#111827' },
  { name: 'Calendly', category: 'יומן', text: 'קביעת פגישות לפי סוגי האירועים שלכם.', mark: 'C', color: '#006BFF' },
  { name: 'HubSpot', category: 'CRM', text: 'אנשי קשר ועסקאות מעודכנים.', mark: 'H', color: '#FF7A59' },
  { name: 'Zoho CRM', category: 'CRM', text: 'ליד חדש אחרי כל שיחה.', mark: 'Z', color: '#E42527' },
  { name: 'GoHighLevel', category: 'CRM', text: 'Lead Connector ומשפכי מכירה.', mark: 'HL', color: '#188BF6' },
  { name: 'Google Sheets', category: 'נתונים', text: 'שורה לכל פנייה, בלי הקלדה חוזרת.', mark: 'S', color: '#0F9D58' },
  { name: 'WhatsApp', category: 'הודעות', text: 'אישורים ותשובות בכתב.', mark: 'W', color: '#25D366' },
  { name: 'Instagram', category: 'הודעות', text: 'הודעות ישירות במקום אחד.', mark: 'I', color: '#C13584' },
  { name: 'Messenger', category: 'הודעות', text: 'הודעות פייסבוק.', mark: 'M', color: '#0084FF' },
  { name: 'SIP', category: 'טלפוניה', text: 'המרכזייה והמספרים שלכם.', mark: 'SIP', color: '#0E1B4D' },
  { name: 'Twilio', category: 'טלפוניה', text: 'ייבוא המספרים שלכם.', mark: 'T', color: '#F22F46' },
  { name: 'Telnyx', category: 'טלפוניה', text: 'ייבוא המספרים שלכם.', mark: 'Tx', color: '#00C08B' },
  { name: 'Webhooks', category: 'מפתחים', text: 'אירועים שנשלחים למערכות שלכם.', mark: '{ }', color: '#0FA3C4' },
  { name: '300+ כלים', category: 'אוטומציות', text: 'דרך בונה התהליכים ללא קוד.', mark: '+', color: '#22306A' },
];
