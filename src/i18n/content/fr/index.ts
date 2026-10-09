// Contenu français : source de toutes les traductions. Chaque autre langue reproduit exactement
// cette structure (le typage `Content` le vérifie).
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
import { withFrenchTypography } from '../../typography';

export const fr = {
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

// Relances commerciales et messages de cycle de vie : gardés hors de `fr` tant que toutes les langues n’ont pas
// leur version (le typage `Content` l’exigerait partout). Chaque langue exporte un `RelancesContent` ; ici, la
// typographie française (espaces insécables) est déjà appliquée.
export type { RelancesContent, RelanceFacts, RelanceMessage, RelanceKey } from './ui/relances';
export { buildRelanceFacts } from './ui/relances';
// Appel marqué « pur » : le navigateur, qui n’envoie pas d’e-mails, n’en garde rien (pack de langue, src/i18n/packs/fr.ts).
export const RELANCES_FR = /*#__PURE__*/ withFrenchTypography(UI_RELANCES);
