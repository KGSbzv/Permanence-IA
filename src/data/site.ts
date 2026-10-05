// Constantes techniques communes à toutes les langues (URLs, routes). Les textes sont dans
// src/i18n/content/<langue>/ et la marque, les prix et le widget dans src/i18n/markets.ts.
export const SITE = {
  url: 'https://www.permanenceia.com',
  appUrl: 'https://app.permanenceia.com',
  email: 'contact@permanenceia.com',
  company: 'SINAY STRATEGIC LLC',
};

// Inscription : la page /essai-gratuit explique l’essai puis envoie vers la création de compte sur l’app.
export const SIGNUP_URL = '/essai-gratuit';
export const REGISTER_URL = `${SITE.appUrl}/register`;
export const LOGIN_URL = `${SITE.appUrl}/login`;
export const DEMO_URL = '/demo';

// Widget Autocalls (assistante commerciale voix + chat) ; l’assistant dépend du marché.
export const WIDGET_SRC = `${SITE.appUrl}/embed.js`;
