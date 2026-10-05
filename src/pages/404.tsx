import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { c, market } = useI18n();
  const t = c.ui.pages.notFound;
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description} noindex>
      <section className="bg-paper">
        <div className="wrap py-24 text-center">
          <h1 className="text-h2 font-bold">{t.h1}</h1>
          <p className="mt-3">{t.text}</p>
          <div className="mt-8 flex justify-center gap-3"><Link href="/" className="btn-primary">{t.home}</Link><Link href="/tarifs" className="btn-ghost">{t.pricing}</Link></div>
        </div>
      </section>
    </Layout>
  );
}
