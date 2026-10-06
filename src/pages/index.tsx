import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, FaqDark, Heading, Photo, Section, TrialBadges } from '@/components/ui';
import {
  Benefits, DemoBlock, EconomyBlock, FeatureRow, FinalCTA, GrowthBlock, IncludedStack, IntegrationsGrid, PricingCards,
  SectorCards, SecurityBlock, Steps, VoicesNumbers,
} from '@/components/blocks';
import {
  AgentTeam, HeroDemo, IndustryMarquee, LanguageMarquee, Lifecycle, PlatformGrid, PortalPreview, SectorShowcase, UseCaseTabs,
} from '@/components/extras';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';

const Kw = ({ t }: { t: { before: string; kw: string; after: string } }) => <>{t.before}<span className="kw">{t.kw}</span>{t.after}</>;

export default function Home() {
  const { c, market } = useI18n();
  const t = c.ui.commerce.home;
  const { days, minutes } = market.trial;
  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description(days, minutes)}
      jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: market.brand, url: SITE.url, email: SITE.email, logo: `${SITE.url}/icon-512.png`, legalName: SITE.company,
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: SITE.email, availableLanguage: ['French', 'English'] } }}
    >
      {/* Hero : promesse + démo live réelle (l’agent vous appelle) */}
      <section className="overflow-hidden bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <h1 className="text-hero font-extrabold"><Kw t={t.hero.title} /></h1>
            <p className="mt-6 max-w-prose text-lg">{t.hero.intro}</p>
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" />
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-12 -top-6 hidden h-[78%] w-[66%] overflow-hidden rounded-3xl sm:block">
              <Photo src="/photos/hero.jpg" alt={t.hero.photoAlt} fallback={<div className="h-full w-full bg-signal-soft" />} />
            </div>
            <div className="relative sm:mr-24 sm:pt-28"><HeroDemo /></div>
          </div>
        </div>
        <div className="pb-10"><IndustryMarquee /></div>
      </section>

      <Section><AgentTeam /></Section>

      {/* Voyez l’agent en action */}
      <Section tone="paper">
        <Heading title={t.showcase.title} intro={t.showcase.intro} />
        <div className="mt-10"><SectorShowcase /></div>
      </Section>

      <Section>
        <Heading title={t.benefits.title} intro={t.benefits.intro} />
        <div className="mt-12"><Benefits /></div>
      </Section>

      {/* Fonctions en rangées alternées */}
      <Section tone="paper">
        <div className="space-y-20">
          <FeatureRow
            title={<Kw t={t.features.booking.title} />}
            text={t.features.booking.text}
            points={t.features.booking.points}
            mock={<Mock kind="calendar" />}
            link={{ href: '/fonctionnalites/prise-de-rendez-vous', label: t.features.booking.link }}
          />
          <FeatureRow
            reverse
            title={<Kw t={t.features.support.title} />}
            text={t.features.support.text}
            points={t.features.support.points}
            mock={<Mock kind="support" />}
            link={{ href: '/fonctionnalites/support-client', label: t.features.support.link }}
          />
          <FeatureRow
            title={<Kw t={t.features.leads.title} />}
            text={t.features.leads.text}
            points={t.features.leads.points}
            mock={<Mock kind="transcript" />}
            link={{ href: '/fonctionnalites/qualification-des-leads', label: t.features.leads.link }}
          />
        </div>
      </Section>

      {/* Usages par type */}
      <Section>
        <Heading center title={t.useCases.title} intro={t.useCases.intro} />
        <div className="mt-10"><UseCaseTabs /></div>
      </Section>

      <DemoBlock />

      {/* Plateforme complète */}
      <Section>
        <Heading center title={t.platform.title} intro={t.platform.intro} />
        <div className="mt-12"><PlatformGrid /></div>
        <div className="mt-8 text-center"><Link href="/fonctionnalites" className="btn-ghost">{t.platform.link}</Link></div>
      </Section>

      <Section tone="paper"><Lifecycle /></Section>

      <Section><PortalPreview /></Section>

      {/* Comment ça marche */}
      <Section tone="paper">
        <Heading title={t.steps.title} intro={t.steps.intro} />
        <div className="mt-12">
          <Steps steps={t.steps.items(days, minutes)} />
        </div>
      </Section>

      {/* Secteurs */}
      <Section>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Heading title={t.sectors.title} intro={t.sectors.intro} />
          <Link href="/secteurs" className="btn-ghost shrink-0">{t.sectors.link}</Link>
        </div>
        <div className="mt-12"><SectorCards /></div>
      </Section>

      {/* Langues et numéros */}
      <Section tone="paper">
        <div className="mb-10"><LanguageMarquee /></div>
        <VoicesNumbers />
      </Section>

      {/* Intégrations */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <Heading title={t.integrations.title} intro={t.integrations.intro} />
            <Link href="/integrations" className="btn-ghost mt-8">{t.integrations.link}</Link>
          </div>
          <IntegrationsGrid max={8} />
        </div>
      </Section>

      {/* Tarifs */}
      <Section tone="paper" id="tarifs">
        <Heading center title={t.pricing.title} intro={t.pricing.intro} />
        <div className="mt-12"><PricingCards /></div>
        <div className="mt-6 text-center"><Link href="/tarifs#comparatif" className="font-semibold text-signal-deep hover:underline">{t.pricing.compare}</Link></div>
        <div className="mt-20"><GrowthBlock /></div>
      </Section>

      <Section><EconomyBlock /></Section>

      <Section tone="paper"><IncludedStack /></Section>

      <Section><SecurityBlock /></Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Heading title={t.faq.title} intro={t.faq.intro} />
            <Link href="/faq" className="btn-ghost mt-8">{t.faq.link}</Link>
          </div>
          <FaqDark items={[...c.faq.general.slice(0, 6), c.faq.pricing[2], c.faq.general[c.faq.general.length - 1]]} />
        </div>
      </Section>

      <FinalCTA />
    </Layout>
  );
}
