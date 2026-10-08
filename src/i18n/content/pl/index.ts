// Treści w języku polskim: dokładnie ta sama struktura co wersja francuska (sprawdza to typ `typeof fr`).
import type { fr } from '../fr';
import { FAQ_GENERAL, FAQ_PRICING } from './faq';
import { GUIDES, GUIDES_UI } from './guides';
import { HELP_GLOSSARY, HELP_MENU, HELP_TASKS } from './help';
import { INTEGRATIONS } from './integrations';
import { MODULES } from './modules';
import { MATRIX, OFFER_LABELS, OFFER_TEXT } from './offers';
import { SECTORS } from './sectors';
import { SITE_TEXT } from './site';
import { UI_COMMERCE } from './ui/commerce';
import { UI_COMPONENTS } from './ui/components';
import { UI_EMAIL } from './ui/email';
import { UI_PAGES } from './ui/pages';

export const pl: typeof fr = {
  site: SITE_TEXT,
  offers: OFFER_TEXT,
  offerLabels: OFFER_LABELS,
  matrix: MATRIX,
  sectors: SECTORS,
  modules: MODULES,
  faq: { general: FAQ_GENERAL, pricing: FAQ_PRICING },
  help: { menu: HELP_MENU, tasks: HELP_TASKS, glossary: HELP_GLOSSARY },
  guides: { ui: GUIDES_UI, list: GUIDES },
  integrations: INTEGRATIONS,
  ui: { components: UI_COMPONENTS, commerce: UI_COMMERCE, pages: UI_PAGES, email: UI_EMAIL },
};
