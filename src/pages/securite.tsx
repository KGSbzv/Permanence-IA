import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section, Tick } from '@/components/ui';
import { FinalCTA, SecurityBlock } from '@/components/blocks';
import { useI18n } from '@/i18n';
import { RichText } from '@/i18n/rich';

export default function Securite() {
  const { c, market } = useI18n();
  const t = c.ui.pages.security;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description(market.brand)}>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.h1} intro={t.intro} />
        </div>
      </section>
      <Section><SecurityBlock /></Section>
      <Section tone="night">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Heading dark title={t.infraTitle} intro={t.infraIntro} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.infraItems.map((s) => <li key={s} className="rounded-2xl bg-white/5 p-4 text-[15px] text-white/85 ring-1 ring-white/10">{s}</li>)}
          </ul>
        </div>
      </Section>
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading title={t.settingsTitle} />
            <ul className="mt-8 space-y-3">
              {t.settings.map((s) => <Tick key={s}>{s}</Tick>)}
            </ul>
          </div>
          <div>
            <Heading title={t.commitmentsTitle} />
            <ul className="mt-8 space-y-3">
              {t.commitments.map((s) => <Tick key={s}>{s}</Tick>)}
            </ul>
            <p className="mt-8 text-[15px]"><RichText value={t.rights} linkClassName="font-semibold text-signal-deep hover:underline" /></p>
          </div>
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}
