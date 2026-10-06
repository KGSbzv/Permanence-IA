import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { CTAs, FaqDark, Heading, Section, TrialBadges } from '@/components/ui';
import { EconomyBlock, FinalCTA, GrowthBlock, IncludedStack, MatrixTable, PricingCards, RechargeTables } from '@/components/blocks';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';

export default function Tarifs() {
  const { c, market, offers, offer, money, num, path } = useI18n();
  const t = c.ui.commerce.tarifs;
  const { days, minutes } = market.trial;
  const planLine = (slug: 'receptionniste' | 'assistant' | 'centre-appels') => {
    const o = offer(slug);
    return t.meta.plan(o.name, money(o.price ?? 0), num(o.minutesCount));
  };
  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description([planLine('receptionniste'), planLine('assistant'), planLine('centre-appels')], days, minutes)}
      jsonLd={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product', name: market.brand, brand: { '@type': 'Brand', name: market.brand }, url: `${SITE.url}${path('/tarifs')}`,
            offers: offers.filter((o) => o.price !== null).map((o) => ({
              '@type': 'Offer', name: o.name, price: o.price, priceCurrency: market.currency, url: `${SITE.url}${path(`/offres/${o.slug}`)}`,
              priceSpecification: { '@type': 'UnitPriceSpecification', price: o.price, priceCurrency: market.currency, unitText: 'MONTH', valueAddedTaxIncluded: false },
            })),
          },
          { '@type': 'FAQPage', mainEntity: c.faq.pricing.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ],
      }}
    >
      <section className="bg-paper">
        <div className="wrap py-14 text-center lg:py-20">
          <Heading as="h1" center title={t.hero.title} intro={t.hero.intro(days, minutes)} />
          <TrialBadges className="mt-6 justify-center" />
          <div className="mt-12 text-left"><PricingCards /></div>
          <p className="mt-6 text-sm text-slate-light">{c.site.priceNote(money(market.phoneNumberFrom, 2))} {t.hero.moreMinutes}</p>
        </div>
      </section>

      <Section id="comparatif">
        <Heading title={t.matrix.title} intro={t.matrix.intro} />
        <div className="mt-10"><MatrixTable /></div>
      </Section>

      <Section tone="paper"><IncludedStack /></Section>

      <Section><EconomyBlock /></Section>

      <Section tone="paper" id="recharges">
        <Heading title={t.recharges.title} intro={t.recharges.intro} />
        <div className="mt-10"><RechargeTables /></div>
        <Link href="/offres/recharges" className="mt-6 inline-block font-semibold text-signal-deep hover:underline">{t.recharges.link}</Link>
      </Section>

      <Section><GrowthBlock /></Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Heading title={t.faq.title} intro={t.faq.intro} />
            <CTAs className="mt-8" primary={t.faq.primary} demo={t.faq.demo} />
          </div>
          <FaqDark items={c.faq.pricing} />
        </div>
      </Section>

      <FinalCTA title={t.finalCta(minutes)} />
    </Layout>
  );
}
