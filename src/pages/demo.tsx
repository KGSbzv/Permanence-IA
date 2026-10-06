import React from 'react';
import Layout from '@/components/Layout';
import LiveCall from '@/components/LiveCall';
import LiveDemo from '@/components/LiveDemo';
import { Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, SectorCards, Steps, VoicesNumbers } from '@/components/blocks';
import { useI18n } from '@/i18n';

export default function Demo() {
  const { c, market } = useI18n();
  const t = c.ui.pages.demo;
  const s = c.sectors[1];
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-night text-white/75">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-12">
            <h1 className="text-hero font-extrabold text-white">{t.h1}</h1>
            <div>
              <p className="max-w-prose text-lg">{t.intro}</p>
              <TrialBadges dark className="mt-5" />
            </div>
          </div>
          <div className="mt-10 lg:mt-12"><LiveDemo /></div>
        </div>
      </section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading title={t.hearTitle} intro={t.hearIntro} />
            <div className="mt-10"><Steps steps={t.steps} /></div>
          </div>
          <LiveCall title={t.liveCallTitle} call={s.call} lead={s.lead} />
        </div>
      </Section>
      <Section tone="paper"><VoicesNumbers /></Section>
      <Section><Heading title={t.scenariosTitle} /><div className="mt-10"><SectorCards /></div></Section>
      <FinalCTA />
    </Layout>
  );
}
