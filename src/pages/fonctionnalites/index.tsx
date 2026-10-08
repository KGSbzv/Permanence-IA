import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, IncludesSchema, ModuleCards } from '@/components/blocks';
import { AgentOrbit } from '@/components/extras';
import { useI18n } from '@/i18n';

export default function Fonctionnalites() {
  const { c, market } = useI18n();
  const t = c.ui.commerce.featuresIndex;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-paper">
        <div className="wrap grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-20">
          <div>
            <Heading as="h1" title={t.hero.title} intro={t.hero.intro} />
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" />
          </div>
          {/* Visuel : les agents du marché autour de la plateforme (un rôle par fonction). */}
          <AgentOrbit />
        </div>
      </section>
      <Section><ModuleCards /></Section>
      <Section tone="paper"><Heading title={t.overview.title} /><div className="mt-10"><IncludesSchema /></div></Section>
      <FinalCTA />
    </Layout>
  );
}
