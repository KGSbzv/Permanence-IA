import React from 'react';
import Layout from '@/components/Layout';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import { RichBlocks } from '@/i18n/rich';

export default function CGU() {
  const { c, market } = useI18n();
  const t = c.ui.pages.terms;
  const sections = t.sections({ brand: market.brand, company: SITE.company, email: SITE.email, appHost: SITE.appUrl.replace('https://', ''), legal: market.legal });
  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description(market.brand)}
    >
      <div className="bg-white py-14 lg:py-20">
        <div className="wrap space-y-10">

          <div className="space-y-3">
            <h1 className="text-hero font-extrabold">
              {t.h1}
            </h1>
            <p className="text-sm text-slate-light">
              {t.updated}
            </p>
          </div>

          <div className="max-w-3xl space-y-10 leading-relaxed">
            {sections.map((s) => (
              <section key={s.title} className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {s.title}
                </h2>
                <RichBlocks blocks={s.body} ulClassName="list-disc pl-5 space-y-1" />
              </section>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
