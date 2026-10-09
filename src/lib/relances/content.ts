// Textes des relances par langue (l’anglais sert au Royaume-Uni et à l’Australie). Une langue absente ici n’envoie
// rien : jamais de repli d’une langue connue vers une autre (mieux vaut ne rien envoyer qu’écrire dans la mauvaise
// langue). Seule exception : langue du contact inconnue → messages de service en anglais (moteur, audit du 9 oct.).
// RELANCES_LOCALES n’ouvre que les e-mails commerciaux (it, pl, nl, he après la case de consentement) ; les messages
// de service partent dans les 7 langues.
import { RELANCES_EN } from '@/i18n/content/en';
import { RELANCES_FR, type RelancesContent } from '@/i18n/content/fr';
import { RELANCES_HE } from '@/i18n/content/he';
import { RELANCES_IT } from '@/i18n/content/it';
import { RELANCES_NL } from '@/i18n/content/nl';
import { RELANCES_PL } from '@/i18n/content/pl';
import { LANG_OF, type Lang, type Locale } from '@/i18n/locales';

const BY_LANG: Partial<Record<Lang, RelancesContent>> = {
  fr: RELANCES_FR, en: RELANCES_EN, it: RELANCES_IT, pl: RELANCES_PL, nl: RELANCES_NL, he: RELANCES_HE,
};

export const relancesContent = (locale: Locale): RelancesContent | null => BY_LANG[LANG_OF[locale]] ?? null;
