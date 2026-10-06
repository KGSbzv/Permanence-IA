import React from 'react';
import Layout from '@/components/Layout';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import { RichBlocks } from '@/i18n/rich';

// Politique de confidentialité : reflète les traitements réels (site, agents IA, widgets, espace client, facturation).
export default function Confidentialite() {
  const { c, market } = useI18n();
  const t = c.ui.pages.privacy;
  const sections = t.sections({ brand: market.brand, company: SITE.company, email: SITE.email, appHost: SITE.appUrl.replace('https://', ''), legal: market.legal });
  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description(market.brand)}
      breadcrumbs={[{ name: t.breadcrumb, path: '/confidentialite' }]}
    >
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <h1 className="text-hero font-extrabold">{t.h1}</h1>
          <p className="mt-4 max-w-prose text-lg">{t.intro}</p>
          <p className="mt-3 text-sm text-slate-light">{t.updated}</p>
        </div>
      </section>
      <section className="bg-white">
        <div className="wrap max-w-3xl space-y-10 py-14 lg:py-20 [&_a]:font-semibold [&_a]:text-signal-deep [&_a]:underline [&_li]:mt-2 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:ps-5">
          {sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="font-display text-2xl font-bold text-ink">{i + 1}. {s.title}</h2>
              <div className="mt-4"><RichBlocks blocks={s.body} /></div>
            </section>
          ))}
        </div>
      </section>
    </Layout>
  );
}
