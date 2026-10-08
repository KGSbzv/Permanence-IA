// Langues du site. Le code de locale apparaît dans l’URL (/it/tarifs, /en-gb/tarifs…) ;
// le français est la langue par défaut, sans préfixe.

export const LOCALES = ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl', 'he'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

/** Langue de contenu : l’anglais est partagé entre le Royaume-Uni et l’Australie. */
export type Lang = 'fr' | 'en' | 'it' | 'pl' | 'nl' | 'he';
export const LANG_OF: Record<Locale, Lang> = { fr: 'fr', 'en-gb': 'en', 'en-au': 'en', it: 'it', pl: 'pl', nl: 'nl', he: 'he' };

/** Langues écrites de droite à gauche. */
export const RTL_LOCALES: readonly Locale[] = ['he'];
export const isRtl = (l: Locale) => RTL_LOCALES.includes(l);

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
export const asLocale = (v: unknown): Locale => (isLocale(v) ? v : DEFAULT_LOCALE);

/**
 * Choisit la locale à partir de l’en-tête Accept-Language du navigateur.
 * Toute autre langue que celles proposées reçoit la version anglaise (Royaume-Uni).
 */
export function detectLocale(acceptLanguage: string | null): Locale {
  // Sans en-tête (robots, outils) : anglais (Royaume-Uni), comme pour toute langue non proposée.
  if (!acceptLanguage) return 'en-gb';
  const tags = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((t) => t.tag && t.tag !== '*')
    .sort((a, b) => b.q - a.q);
  for (const { tag } of tags) {
    const [lang, region] = tag.split('-');
    if (lang === 'fr') return 'fr';
    if (lang === 'it') return 'it';
    if (lang === 'pl') return 'pl';
    if (lang === 'nl') return 'nl';
    if (lang === 'he' || lang === 'iw') return 'he';
    if (lang === 'en') return region === 'au' || region === 'nz' ? 'en-au' : 'en-gb';
  }
  return 'en-gb';
}
