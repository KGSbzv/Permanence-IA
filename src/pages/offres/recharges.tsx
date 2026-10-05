import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, GrowthBlock, RechargeTables, Steps } from '@/components/blocks';
import { useI18n } from '@/i18n';

export default function Recharges() {
  const { c, market, money, num } = useI18n();
  const t = c.ui.commerce.recharges;
  const first = market.recharges[0];
  const last = market.recharges[market.recharges.length - 1];
  // Minutes qu’achète la plus petite recharge au tarif « minute supplémentaire » du premier forfait payant.
  const firstMinutes = Math.round(first / (market.plans.receptionniste.extraMinute ?? 1));
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description(money(first), num(firstMinutes))}>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.hero.title} intro={t.hero.intro} />
          <TrialBadges className="mt-6" />
        </div>
      </section>
      <Section><RechargeTables /><p className="mt-4 text-sm text-slate-light">{c.site.priceNote}</p></Section>
      <Section tone="paper">
        <Heading title={t.how.title} />
        <div className="mt-10">
          <Steps steps={t.how.steps(money(first), money(last))} />
        </div>
      </Section>
      <Section><GrowthBlock /></Section>
      <FinalCTA />
    </Layout>
  );
}
