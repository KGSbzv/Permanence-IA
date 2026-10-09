// Contenus de langue chargés dans le navigateur (audit du 9 oct., action 22 : site plus léger). Chaque langue est un
// « pack » (src/i18n/packs/<clé>.ts) chargé seul, à la demande : en se chargeant, il s’inscrit ici. Le serveur, lui,
// lit toutes les langues directement (getI18n, src/i18n/index.tsx) et n’a pas besoin de ce registre.
import type { fr } from '../content/fr';
import { LANG_OF, type Locale } from '../locales';

type Content = typeof fr;

/** Clé de contenu : la langue du texte, sauf l’Australie qui a sa variante de l’anglais (src/i18n/content/en/au.ts). */
export type ContentKey = 'fr' | 'en' | 'en-au' | 'it' | 'pl' | 'nl' | 'he';
export const CONTENT_KEYS: readonly ContentKey[] = ['fr', 'en', 'en-au', 'it', 'pl', 'nl', 'he'];

export const contentKey = (locale: Locale): ContentKey => (locale === 'en-au' ? 'en-au' : LANG_OF[locale]);

const LOADED: Partial<Record<ContentKey, Content>> = {};

export function registerContent(key: ContentKey, content: Content) {
  LOADED[key] = content;
}

/** Contenu d’une langue déjà chargée dans le navigateur ; `undefined` tant que son pack n’est pas arrivé. */
export const loadedContent = (key: ContentKey): Content | undefined => LOADED[key];
