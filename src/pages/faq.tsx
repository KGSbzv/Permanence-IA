import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, FaqDark, Heading, Section } from '@/components/ui';
import { FinalCTA } from '@/components/blocks';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';

export default function Faq() {
  const { c, market, path } = useI18n();
  const t = c.ui.pages.faq;
  const { general, pricing } = c.faq;
  const all = [...general, ...pricing];
  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description(market.brand)}
      jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', url: `${SITE.url}${path('/faq')}`, mainEntity: all.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }}
    >
      <section className="bg-paper"><div className="wrap py-14 lg:py-20"><Heading as="h1" title={t.h1} intro={t.intro} /><CTAs className="mt-8" /></div></section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div><h2 className="mb-6 font-display text-2xl font-bold">{t.general}</h2><FaqDark items={general} /></div>
          <div><h2 className="mb-6 font-display text-2xl font-bold">{t.pricing}</h2><FaqDark items={pricing} /></div>
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}
