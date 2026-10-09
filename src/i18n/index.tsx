// Point d’entrée i18n : contenu de la langue + fiche marché (prix, marque) + formats.
// Côté composant : `const { c, market, money, offers } = useI18n();`
// Côté getStaticProps / API : `getI18n(locale)`.
//
// Poids des pages (audit du 9 oct., action 22) : le navigateur ne reçoit que le contenu de la langue de la page.
// Chaque langue est un « pack » (src/i18n/packs) rendu par next/dynamic dans I18nProvider : au rendu serveur, Next note
// le pack utilisé, ajoute son script au HTML et attend qu’il soit chargé avant l’hydratation (même texte des deux côtés,
// aucun écart). Le serveur, lui, lit toutes les langues d’un coup : getI18n reste synchrone (relances, plan du site, API).
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { fr } from './content/fr';
import { DEFAULT_LOCALE, asLocale, type Locale } from './locales';
import { MARKETS, type Market, type PlanSlug } from './markets';
import type { OfferText } from './content/fr/offers';
import { PERSONAS } from '@/data/personas';
import { withFrenchTypography } from './typography';
import { contentKey, loadedContent, type ContentKey } from './packs/registry';

/** Séparateur de milliers toujours affiché (le type TypeScript ne connaît pas encore la valeur « always »). */
export const GROUP = 'always' as unknown as boolean;
export type Content = typeof fr;
export type { Locale, Market, PlanSlug };

export interface Offer extends OfferText {
  slug: PlanSlug;
  /** Prix mensuel HT ; 0 = essai, null = sur devis. */
  price: number | null;
  /** Prix affiché quand il n’est pas un montant mensuel (essai, sur devis). */
  priceLabel?: string;
  /** Libellé des minutes (ex. « 350 min / mois »). */
  minutes: string;
  minutesCount: number;
  /** Coût réel d’une minute du forfait, libellé (ex. « 0,28 $ HT / min »). */
  perMinute?: string;
  extraMinute?: number;
  featured?: boolean;
  /** Facturation annuelle (payée d’avance) ; absente pour l’essai et le sur-mesure. */
  annual?: {
    /** Prix annuel HT. */
    price: number;
    /** Équivalent mensuel (prix annuel / 12). */
    monthly: number;
    /** Économie sur un an par rapport à 12 mensualités. */
    saving: number;
    /** Coût réel d’une minute du forfait en annuel, libellé. */
    perMinute: string;
  };
}

const PLAN_ORDER: PlanSlug[] = ['decouverte', 'receptionniste', 'assistant', 'centre-appels', 'sur-mesure'];

/** Toutes les langues côté serveur, lues au premier besoin puis gardées en mémoire. */
let SERVER_CONTENT: Record<ContentKey, Content> | undefined;

/**
 * Contenu d’une langue. Serveur : toutes les langues, toujours disponibles. Navigateur : seulement les packs déjà
 * chargés (`undefined` sinon). Le `require` est dans la branche `typeof window === 'undefined'`, que Next remplace à la
 * compilation : elle disparaît du code envoyé au navigateur, avec les 7 langues qu’elle charge.
 */
export function contentFor(rawLocale: unknown): Content | undefined {
  const key = contentKey(asLocale(rawLocale));
  if (typeof window === 'undefined') {
    if (!SERVER_CONTENT) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { CONTENT, CONTENT_EN_AU } = require('./content') as typeof import('./content');
      SERVER_CONTENT = {
        // Français avec espaces insécables (src/i18n/typography.ts), comme le pack du navigateur (packs/fr.ts).
        fr: withFrenchTypography(CONTENT.fr),
        en: CONTENT.en,
        // Australie : contenu anglais adapté (A$, lieux et vocabulaire locaux) au lieu de celui du Royaume-Uni.
        'en-au': CONTENT_EN_AU,
        it: CONTENT.it,
        pl: CONTENT.pl,
        nl: CONTENT.nl,
        he: CONTENT.he,
      };
    }
    return SERVER_CONTENT[key];
  }
  return loadedContent(key);
}

/** Formats, offres et chemins d’une locale, calculés à partir de son contenu. */
function buildI18n(locale: Locale, c: Content) {
  const market = MARKETS[locale];

  // useGrouping « always » : 1.000 en italien et en polonais, identique côté serveur et navigateur (sinon erreur d’hydratation).
  const num = (n: number, digits = 0) => n.toLocaleString(market.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: GROUP });
  /** Montant dans la devise du marché, au format local (ex. « 99 $US » en français, « US$99 » en anglais) : le symbole précise le dollar américain. */
  const money = (n: number, digits = 0) => {
    const out = new Intl.NumberFormat(market.numberLocale, { style: 'currency', currency: market.currency, currencyDisplay: 'symbol', minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: GROUP }).format(n);
    // en-AU : Intl écrit « USD 99 » ; les textes fixes du site écrivent « US$3.99 » → même forme partout.
    return market.numberLocale === 'en-AU' ? out.replace(/^USD\s?/, 'US$') : out;
  };
  const perMin = (price: number, minutes: number) => money(price / minutes, 2);

  const L = c.offerLabels;
  const offers: Offer[] = PLAN_ORDER.map((slug) => {
    const p = market.plans[slug];
    const text = c.offers[slug];
    const base = { ...text, slug, price: p.price, minutesCount: p.minutes, extraMinute: p.extraMinute, featured: slug === 'assistant' };
    if (p.price === 0) return { ...base, priceLabel: money(0), minutes: L.trialMinutes(num(p.minutes), market.trial.days) };
    if (p.price === null) return { ...base, priceLabel: L.onQuote, minutes: L.customVolume };
    const annual = p.annualPrice
      ? { price: p.annualPrice, monthly: p.annualPrice / 12, saving: p.price * 12 - p.annualPrice, perMinute: L.perMinute(perMin(p.annualPrice / 12, p.minutes)) }
      : undefined;
    return { ...base, minutes: L.minutesPerMonth(num(p.minutes)), perMinute: L.perMinute(perMin(p.price, p.minutes)), annual };
  });
  const offer = (slug: PlanSlug) => offers.find((o) => o.slug === slug)!;

  /** Chemin interne dans la langue courante (les <Link> de Next le font déjà ; utile pour <a href>). */
  const path = (p: string) => (locale === DEFAULT_LOCALE ? p : `/${locale}${p === '/' ? '' : p}`);

  // Agent IA du marché (prénom et portrait), utilisé partout où le site montre « l’agent ».
  const persona = PERSONAS[locale];
  return { locale, market, persona, c, num, money, perMin, offers, offer, path };
}

/**
 * Contenu, formats et offres d’une locale. Serveur (getStaticProps, API, relances, scripts) : toutes les langues.
 * Navigateur : seulement la langue de la page (les composants passent par useI18n).
 */
export function getI18n(rawLocale: unknown) {
  const locale = asLocale(rawLocale);
  const c = contentFor(locale);
  if (!c) throw new Error(`i18n : contenu « ${locale} » pas encore chargé dans le navigateur (utiliser useI18n)`);
  return buildI18n(locale, c);
}

export type I18n = ReturnType<typeof buildI18n>;

/* ---------- Packs de langue (navigateur) ---------- */

// Rien à afficher pendant un chargement : le pack ne rend rien, le texte vient du contexte ci-dessous.
const Nothing = () => null;

// Un appel next/dynamic par langue, écrit en toutes lettres : Next les repère à la compilation pour relier chaque pack
// à ses fichiers (script ajouté au HTML de la page, chargement attendu avant l’hydratation).
const PACKS: Record<ContentKey, React.ComponentType> = {
  fr: dynamic(() => import('./packs/fr'), { loading: Nothing }),
  en: dynamic(() => import('./packs/en'), { loading: Nothing }),
  'en-au': dynamic(() => import('./packs/en-au'), { loading: Nothing }),
  it: dynamic(() => import('./packs/it'), { loading: Nothing }),
  pl: dynamic(() => import('./packs/pl'), { loading: Nothing }),
  nl: dynamic(() => import('./packs/nl'), { loading: Nothing }),
  he: dynamic(() => import('./packs/he'), { loading: Nothing }),
};

// Mêmes packs, chargés directement : cas où la langue change sans rechargement de la page (voir I18nProvider).
const LOADERS: Record<ContentKey, () => Promise<unknown>> = {
  fr: () => import('./packs/fr'),
  en: () => import('./packs/en'),
  'en-au': () => import('./packs/en-au'),
  it: () => import('./packs/it'),
  pl: () => import('./packs/pl'),
  nl: () => import('./packs/nl'),
  he: () => import('./packs/he'),
};

/**
 * Pause avant un nouvel essai quand un pack n’a pas pu être téléchargé (réseau coupé, fichier retiré par un
 * déploiement). Au premier chargement, le premier échec peut arriver bien plus tard : le script du pack est déjà dans
 * le HTML, Next et webpack attendent son issue (jusqu’au délai de 120 s de webpack) avant de lancer l’hydratation.
 */
export const RETRY_MS = 3000;
/** Échecs de suite avant de recharger la page (une seule fois, voir reloadOnce). */
const RELOAD_AFTER = 3;
/** Mémoire de l’onglet (sessionStorage) : page déjà rechargée pour un pack introuvable. */
export const RELOAD_KEY = 'pia_pack_reload';
const PENDING: Partial<Record<ContentKey, Promise<void>>> = {};
const FAILS: Partial<Record<ContentKey, number>> = {};

/**
 * Recharge la page une fois, comme Next pour une page introuvable après un déploiement : le nouveau HTML désigne les
 * nouveaux fichiers. Pas de deuxième rechargement tant que les textes ne se sont pas affichés (pas de boucle), ni hors
 * ligne (le navigateur remplacerait la page par son écran d’erreur), ni sans stockage : on garde alors les essais espacés.
 */
function reloadOnce() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  try {
    if (window.sessionStorage.getItem(RELOAD_KEY)) return;
    window.sessionStorage.setItem(RELOAD_KEY, '1');
  } catch { return; }
  window.location.reload();
}

/** Textes affichés : un prochain incident pourra de nouveau recharger la page une fois. */
function allowReload() {
  try { window.sessionStorage.removeItem(RELOAD_KEY); } catch { /* serveur ou stockage bloqué : rien à effacer */ }
}

/**
 * Charge le pack d’une locale dans le navigateur (sans effet s’il est déjà là). La promesse se termine toujours :
 * après un échec, au bout de RETRY_MS, pour qu’un nouvel essai ne parte pas en rafale. Au 3e échec de suite, la page
 * est rechargée une fois (reloadOnce). `load` : téléchargement du pack, remplacé dans les tests.
 */
export function loadLocaleContent(rawLocale: unknown, load: (key: ContentKey) => Promise<unknown> = (k) => LOADERS[k]()): Promise<void> {
  const key = contentKey(asLocale(rawLocale));
  if (loadedContent(key)) return Promise.resolve();
  return (PENDING[key] ??= load(key).then(
    () => { delete PENDING[key]; FAILS[key] = 0; allowReload(); },
    () => {
      if ((FAILS[key] = (FAILS[key] ?? 0) + 1) >= RELOAD_AFTER) reloadOnce();
      return new Promise<void>((resolve) => setTimeout(() => { delete PENDING[key]; resolve(); }, RETRY_MS));
    },
  ));
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ locale: rawLocale, children }: { locale: Locale | string | undefined; children: React.ReactNode }) {
  const locale = asLocale(rawLocale);
  const key = contentKey(locale);
  const content = contentFor(locale);
  const value = useMemo(() => (content ? buildI18n(locale, content) : null), [locale, content]);
  // Page affichée avec ses textes (y compris après un rechargement pour pack introuvable) : rechargement de nouveau permis.
  useEffect(() => { if (value) allowReload(); }, [value]);
  // Contenu absent : navigateur seulement, cas rare (langue changée sans rechargement, pack non téléchargé). Le rendu
  // est suspendu ; sans limite <Suspense> au-dessus, React garde ce qui est à l’écran (HTML du serveur, ou page
  // précédente pendant une navigation) et reprend une fois le pack chargé (ou recharge la page, voir loadLocaleContent).
  if (!value) throw loadLocaleContent(locale);
  const Pack = PACKS[key];
  return (
    <I18nContext.Provider value={value}>
      <Pack />
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n : composant rendu hors de I18nProvider (src/pages/_app.tsx)');
  return value;
}
