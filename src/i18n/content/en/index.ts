// English content (shared by the United Kingdom and Australia). Mirrors the French structure
// exactly: the `typeof fr` annotation checks it.
import type { fr } from '../fr';
import { FAQ_GENERAL, FAQ_PRICING } from './faq';
import { GUIDES, GUIDES_UI } from './guides';
import { HELP_GLOSSARY, HELP_MENU, HELP_TASKS } from './help';
import { INTEGRATIONS } from './integrations';
import { MODULES } from './modules';
import { MATRIX, OFFER_LABELS, OFFER_TEXT } from './offers';
import { SECTORS } from './sectors';
import { SITE_TEXT } from './site';
import { UI_ACCOUNT } from './ui/account';
import { UI_COMMERCE } from './ui/commerce';
import { UI_COMPONENTS } from './ui/components';
import { UI_EMAIL } from './ui/email';
import { UI_PAGES } from './ui/pages';
import { UI_RELANCES } from './ui/relances';

export const en: typeof fr = {
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
  ui: { components: UI_COMPONENTS, commerce: UI_COMMERCE, pages: UI_PAGES, email: UI_EMAIL, account: UI_ACCOUNT },
};

// Relances commerciales : hors de `en` comme en français (voir src/i18n/content/fr/index.ts), communes à en-gb et en-au.
export const RELANCES_EN = UI_RELANCES;
