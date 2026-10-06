// Point d’entrée i18n : contenu de la langue + fiche marché (prix, marque) + formats.
// Côté composant : `const { c, market, money, offers } = useI18n();`
// Côté getStaticProps / API : `getI18n(locale)`.
import React, { createContext, useContext, useMemo } from 'react';
import { fr } from './content/fr';
import { CONTENT } from './content';
import { DEFAULT_LOCALE, LANG_OF, asLocale, type Locale } from './locales';
import { MARKETS, type Market, type PlanSlug } from './markets';
import type { OfferText } from './content/fr/offers';
import { PERSONAS } from '@/data/personas';

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

export function getI18n(rawLocale: unknown) {
  const locale = asLocale(rawLocale);
  const market = MARKETS[locale];
  const c = CONTENT[LANG_OF[locale]] as Content;

  const num = (n: number, digits = 0) => n.toLocaleString(market.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  /** Montant dans la devise du marché, au format local (ex. « 99 $ » en français, « $99 » en anglais). */
  const money = (n: number, digits = 0) =>
    new Intl.NumberFormat(market.numberLocale, { style: 'currency', currency: market.currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
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

export type I18n = ReturnType<typeof getI18n>;

const I18nContext = createContext<I18n>(getI18n(DEFAULT_LOCALE));

export function I18nProvider({ locale, children }: { locale: Locale | string | undefined; children: React.ReactNode }) {
  const value = useMemo(() => getI18n(locale), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
