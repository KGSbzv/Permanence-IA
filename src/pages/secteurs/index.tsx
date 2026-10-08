import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, Heading, Section, TalkNowPill, TrialBadges } from '@/components/ui';
import { FinalCTA, SectorCards } from '@/components/blocks';
import { DEMO_URL } from '@/data/site';
import { useI18n } from '@/i18n';

export default function Secteurs() {
  const { c, market } = useI18n();
  const t = c.ui.commerce.sectorsIndex;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          {/* Pas de démo live sur cette page : la pastille mène à la page de démo. */}
          <TalkNowPill href={DEMO_URL} className="mb-5" />
          <Heading as="h1" title={t.hero.title} intro={t.hero.intro} />
          <TrialBadges className="mt-6" />
          <CTAs className="mt-8" />
        </div>
      </section>
      <Section><SectorCards /></Section>
      <Section tone="paper">
        <Heading title={t.other.title} intro={t.other.intro} />
        <CTAs className="mt-8" primary={t.other.primary} demo={t.other.demo} />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
