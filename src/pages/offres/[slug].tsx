import React from 'react';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Check, X } from 'lucide-react';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, FaqDark, Heading, Section, TalkNowPill, TrialBadges } from '@/components/ui';
import {
  BillingProvider, DemoBlock, EconomyBlock, FinalCTA, GrowthBlock, IncludedStack, MatrixTable, ModuleCards, PricingCards,
  RechargeTables, SecurityBlock,
} from '@/components/blocks';
import { SIGNUP_URL, SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import type { PlanSlug as OfferSlug } from '@/i18n/markets';
import { fr } from '@/i18n/content/fr';

// Slugs identiques dans toutes les langues : la liste vient du contenu français.
const SLUGS = Object.keys(fr.offers) as OfferSlug[];

const MODULES_BY_OFFER: Record<OfferSlug, string[]> = {
  decouverte: ['demo-live', 'widget-web', 'base-de-connaissances'],
  receptionniste: ['receptionniste-ia', 'prise-de-rendez-vous', 'widget-web', 'editeur-de-prompts', 'base-de-connaissances', 'reporting'],
  assistant: ['flow-builder', 'qualification-des-leads', 'campagnes-sortantes', 'whatsapp-messages', 'sip-numeros', 'prise-de-rendez-vous'],
  'centre-appels': ['reporting', 'base-de-connaissances', 'flow-builder', 'support-client', 'campagnes-sortantes', 'sip-numeros'],
  'sur-mesure': ['sip-numeros', 'flow-builder', 'reporting', 'support-client', 'qualification-des-leads', 'campagnes-sortantes'],
};
const MOCK: Record<OfferSlug, 'call' | 'calendar' | 'flow' | 'report' | 'numbers'> = {
  decouverte: 'call', receptionniste: 'calendar', assistant: 'flow', 'centre-appels': 'report', 'sur-mesure': 'numbers',
};

export default function OfferPage({ slug }: { slug: OfferSlug }) {
  const { c, market, offers, offer, money, path } = useI18n();
  const t = c.ui.commerce.offer;
  const { days, minutes } = market.trial;
  const o = offer(slug);
  const included = c.matrix.flatMap((g) => g.rows).map((r) => ({ label: r.label, v: r.cells[slug] }));
  const primaryHref = slug === 'sur-mesure' ? '/contact' : `${SIGNUP_URL}?plan=${slug}`;
  const price = o.price === null ? o.priceLabel! : money(o.price);
  const url = `${SITE.url}${path(`/offres/${o.slug}`)}`;

  return (
    <Layout
      title={o.price === 0 ? t.metaTitleTrial(days, minutes, market.brand) : t.metaTitle(o.name, price, Boolean(o.price), market.brand)}
      description={t.metaDescription(o.title, days, minutes).slice(0, 158)}
      breadcrumbs={[{ name: t.breadcrumb, path: '/tarifs' }, { name: o.name, path: `/offres/${o.slug}` }]}
      jsonLd={{
        '@context': 'https://schema.org',
        '@graph': [
          ...(o.price !== null ? [{
            '@type': 'Product', name: t.productName(market.brand, o.name), description: o.pitch, brand: { '@type': 'Brand', name: market.brand },
            offers: [
              { '@type': 'Offer', name: o.name, price: o.price, priceCurrency: market.currency, url,
                priceSpecification: { '@type': 'UnitPriceSpecification', price: o.price, priceCurrency: market.currency, unitText: 'MONTH', valueAddedTaxIncluded: false } },
              ...(o.annual ? [{ '@type': 'Offer', name: c.ui.commerce.tarifs.meta.annualOffer(o.name), price: o.annual.price, priceCurrency: market.currency, url,
                priceSpecification: { '@type': 'UnitPriceSpecification', price: o.annual.price, priceCurrency: market.currency, unitText: 'YEAR', valueAddedTaxIncluded: false } }] : []),
            ],
          }] : []),
          { '@type': 'FAQPage', mainEntity: c.faq.pricing.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ],
      }}
    >
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-20">
          <div>
            <TalkNowPill className="mb-5" />
            <p className="font-display text-sm font-semibold text-signal-deep">{t.eyebrow(o.name, o.audience)}</p>
            <h1 className="mt-3 text-hero font-extrabold">{o.title}</h1>
            <p className="mt-5 max-w-prose text-lg">{o.pitch}</p>
            <TrialBadges className="mt-6" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={primaryHref} className="btn-primary">{o.cta}</Link>
              <Link href="/demo" className="btn-ghost">{t.demo}</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-7 shadow-card">
            <p className="font-display text-lg font-bold">{o.name}</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink">{price}<span className="ml-1 text-base font-medium text-slate">{o.price ? t.perMonth : ''}</span></p>
            {o.annual && <p className="mt-1 text-sm font-semibold text-signal-deep">{t.orAnnual(money(o.annual.price))}</p>}
            {o.perMinute && <p className="mt-1 text-sm">{t.perMinuteLine(o.perMinute)}</p>}
            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[15px]">
              <div className="flex justify-between gap-4"><dt>{t.facts.minutes}</dt><dd className="font-semibold text-ink">{o.minutes}</dd></div>
              <div className="flex justify-between gap-4"><dt>{t.facts.more}</dt><dd className="text-right font-semibold text-ink">{o.slug === 'sur-mesure' ? t.facts.moreCustom : t.facts.moreDefault}</dd></div>
              <div className="flex justify-between gap-4"><dt>{t.facts.commitment}</dt><dd className="font-semibold text-ink">{t.facts.commitmentValue}</dd></div>
            </dl>
            <p className="mt-5 text-xs text-slate-light">{c.site.priceNote(money(market.phoneNumberFrom, 2))}</p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Heading title={t.included.title} intro={t.included.intro} />
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {included.map((i) => (
                <li key={i.label} className={`flex gap-2.5 text-[15px] ${i.v === false ? 'text-slate-light' : 'text-ink'}`}>
                  {i.v === false ? <X className="mt-1 h-4 w-4 shrink-0 text-no" strokeWidth={3} aria-label={t.included.notIncluded} /> : <Check className="mt-1 h-4 w-4 shrink-0 text-ok" strokeWidth={3} aria-label={t.included.includedLabel} />}
                  <span>{i.label}{typeof i.v === 'string' && <span className="text-slate"> — {i.v}</span>}</span>
                </li>
              ))}
            </ul>
            <Link href="#comparatif" className="mt-8 inline-block font-semibold text-signal-deep hover:underline">{t.included.compare}</Link>
          </div>
          <div className="lg:pt-24"><Mock kind={MOCK[slug]} /></div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title={t.modules.title} />
        <div className="mt-10"><ModuleCards slugs={MODULES_BY_OFFER[slug]} /></div>
      </Section>

      {/* Chaque landing reçoit sa propre publicité : démo, comparatif, « tout inclus » et sécurité y sont présents. */}
      <DemoBlock />

      {o.perMinute && (
        <>
          <Section>
            <Heading title={t.extra.title} intro={t.extra.intro} />
            <div className="mt-10"><RechargeTables /></div>
          </Section>
          <Section tone="paper"><GrowthBlock /></Section>
        </>
      )}

      <Section><EconomyBlock /></Section>

      {/* Le choix mensuel / annuel des cartes se répercute sur le comparatif. */}
      <BillingProvider>
      <Section tone="paper">
        <Heading title={t.others.title} />
        <div className="mt-10"><PricingCards only={offers.filter((x) => x.slug !== slug).map((x) => x.slug)} /></div>
      </Section>

      <Section id="comparatif">
        <Heading title={c.ui.commerce.tarifs.matrix.title} intro={c.ui.commerce.tarifs.matrix.intro} />
        <div className="mt-10"><MatrixTable /></div>
      </Section>
      </BillingProvider>

      <Section tone="paper"><IncludedStack /></Section>

      <Section><SecurityBlock /></Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div><Heading title={t.faq.title} /><CTAs className="mt-8" /></div>
          <FaqDark items={c.faq.pricing} />
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => ({
  paths: (locales ?? ['fr']).flatMap((locale) => SLUGS.map((slug) => ({ params: { slug }, locale }))),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
