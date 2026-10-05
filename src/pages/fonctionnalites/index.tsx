import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, IncludesSchema, ModuleCards } from '@/components/blocks';
import { useI18n } from '@/i18n';

export default function Fonctionnalites() {
  const { c, market } = useI18n();
  const t = c.ui.commerce.featuresIndex;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.hero.title} intro={t.hero.intro} />
          <TrialBadges className="mt-6" />
          <CTAs className="mt-8" />
        </div>
      </section>
      <Section><ModuleCards /></Section>
      <Section tone="paper"><Heading title={t.overview.title} /><div className="mt-10"><IncludesSchema /></div></Section>
      <FinalCTA />
    </Layout>
  );
}
