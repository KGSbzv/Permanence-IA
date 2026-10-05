import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Photo, Section, Tick } from '@/components/ui';
import { AgentTeam } from '@/components/extras';
import { FinalCTA } from '@/components/blocks';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';

export default function About() {
  const { c, market } = useI18n();
  const t = c.ui.pages.about;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description(market.brand, SITE.company)}>
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-20">
          <Heading as="h1" title={t.h1} intro={t.intro(market.brand)} />
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-line">
            <Photo src="/photos/hero.jpg" alt={t.photoAlt} className="object-[50%_20%]" fallback={<div className="h-full w-full bg-signal-soft" />} />
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4 text-lg">
            {t.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">{t.principlesTitle}</h2>
            <ul className="mt-6 space-y-3">
              {t.principles.map((p) => <Tick key={p}>{p}</Tick>)}
            </ul>
            <p className="mt-8 text-sm text-slate-light">{t.legal(market.brand, SITE.company)}</p>
          </div>
        </div>
      </Section>
      <Section tone="paper"><AgentTeam /></Section>
      <FinalCTA />
    </Layout>
  );
}
