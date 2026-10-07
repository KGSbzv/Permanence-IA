import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section } from '@/components/ui';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';

// Déclaration d’accessibilité (obligatoire en Israël : תקנה 35 ; bonne pratique WCAG / European Accessibility Act ailleurs).
export default function Accessibilite() {
  const { c, market } = useI18n();
  const t = c.ui.pages.accessibility;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description(market.brand)}>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.h1} intro={t.intro(market.brand, SITE.company)} />
          <p className="mt-4 text-sm text-slate-light">{t.updated}</p>
        </div>
      </section>
      <Section>
        <div className="max-w-prose space-y-10">
          {t.sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-h3 font-bold">{s.title}</h2>
              <ul className="mt-4 list-disc space-y-2 ps-5 marker:text-signal">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
          <div className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="text-h3 font-bold">{t.contactTitle}</h2>
            <p className="mt-3">{t.contact(SITE.company, SITE.email)}</p>
            {market.phone && <p className="mt-2 font-semibold"><a href={`tel:${market.phone.e164}`} className="text-signal-deep hover:underline"><bdi dir="ltr">{market.phone.display}</bdi></a></p>}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
