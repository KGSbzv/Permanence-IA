import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section } from '@/components/ui';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';

export default function Cookies() {
  const { c, market } = useI18n();
  const t = c.ui.pages.cookies;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description(market.brand)}>
      <section className="bg-paper"><div className="wrap py-14"><Heading as="h1" title={t.h1} /></div></section>
      <Section>
        <div className="max-w-prose space-y-5">
          {t.paragraphs(SITE.url.replace('https://', ''), SITE.appUrl.replace('https://', '')).map((p) => <p key={p}>{p}</p>)}
          <p>{t.questions}<a className="font-semibold text-signal-deep hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </Section>
    </Layout>
  );
}
