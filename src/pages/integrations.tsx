import React from 'react';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, Heading, Section, TrialBadges } from '@/components/ui';
import { FeatureRow, FinalCTA, IntegrationsGrid } from '@/components/blocks';
import { useI18n } from '@/i18n';

const Kw = ({ t }: { t: { before: string; kw: string; after: string } }) => <>{t.before}<span className="kw">{t.kw}</span>{t.after}</>;

export default function Integrations() {
  const { c, market } = useI18n();
  const t = c.ui.commerce.integrations;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.hero.title} intro={t.hero.intro} />
          <TrialBadges className="mt-6" />
          <CTAs className="mt-8" />
        </div>
      </section>
      <Section><IntegrationsGrid /></Section>
      <Section tone="paper">
        <FeatureRow
          title={<Kw t={t.flow.title} />}
          text={t.flow.text}
          points={t.flow.points}
          mock={<Mock kind="flow" />}
          link={{ href: '/fonctionnalites/flow-builder', label: t.flow.link }}
        />
      </Section>
      <Section>
        <FeatureRow
          reverse
          title={<Kw t={t.api.title} />}
          text={t.api.text}
          points={t.api.points}
          mock={<Mock kind="report" />}
        />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
