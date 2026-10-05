// Constantes partagées par toutes les pages : une seule source pour le message d'essai et les liens.
export const SITE = {
  name: 'Permanence IA',
  url: 'https://www.permanenceia.com',
  appUrl: 'https://app.permanenceia.com',
  email: 'contact@permanenceia.com',
  company: 'SINAY STRATEGIC LLC',
};

// Formulation imposée par la documentation (doc 90) : identique partout.
export const TRIAL_LINE = '14 jours d’essai gratuit — 30 minutes incluses — prix HT — sans engagement';
export const TRIAL_BADGES = ['14 jours d’essai gratuit', '30 minutes incluses', 'Prix HT', 'Sans engagement'];
// Messages d’évolution à afficher partout avec l’essai.
export const GROWTH_LINES = ['Ajoutez des minutes à tout moment', 'Passez à l’offre supérieure quand votre volume grandit'];
export const PRICE_NOTE = 'Prix en dollars US (USD), hors taxes — taxes locales en sus si applicables.';

// Inscription : page interne tant que l’inscription sur l’app white-label n’est pas câblée (phase 6).
export const SIGNUP_URL = '/essai-gratuit';
export const LOGIN_URL = `${SITE.appUrl}/login`;
export const DEMO_URL = '/demo';

// Widget Autocalls (assistante commerciale voix + chat, assistant 21203).
// À remplacer par https://app.permanenceia.com/embed.js une fois le domaine white-label activé.
export const WIDGET_SRC = 'https://app.autocalls.ai/embed.js';
export const WIDGET_ASSISTANT_ID = '2841fa2d-1fed-4fbc-b832-28b954d049a6';
