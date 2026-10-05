import React from 'react';
import Layout from '@/components/Layout';
import LiveCall from '@/components/LiveCall';
import { CallbackForm, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, SectorCards, Steps, VoicesNumbers } from '@/components/blocks';
import { useI18n } from '@/i18n';

export default function Demo() {
  const { c, market } = useI18n();
  const t = c.ui.pages.demo;
  const s = c.sectors[1];
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-night text-white/75">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <h1 className="text-hero font-extrabold text-white">{t.h1}</h1>
            <p className="mt-5 max-w-prose text-lg">{t.intro}</p>
            <p className="mt-3 max-w-prose">{t.widgetHint}</p>
            <TrialBadges dark className="mt-6" />
          </div>
          <div className="rounded-3xl bg-white p-6 text-slate sm:p-8">
            <p className="font-display text-xl font-bold">{t.formTitle}</p>
            <p className="mb-5 mt-1 text-[15px]">{t.formIntro}</p>
            <CallbackForm type="demo" submitLabel={t.submit} />
          </div>
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
