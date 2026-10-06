import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { CallbackForm, Heading, Section } from '@/components/ui';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import { Mail, MessageSquare, Phone, PhoneCall } from 'lucide-react';

export default function Contact() {
  const { c, market } = useI18n();
  const t = c.ui.pages.contact;
  const [type, setType] = useState<'commercial' | 'support'>('commercial');
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr] lg:py-20">
          <div>
            <Heading as="h1" title={t.h1} intro={t.intro} />
            <ul className="mt-10 space-y-5">
              {market.phone && <li className="flex gap-4"><Phone className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{market.phone.label}</p><a href={`tel:${market.phone.e164}`} className="text-lg font-semibold text-signal-deep hover:underline"><bdi dir="ltr">{market.phone.display}</bdi></a><p className="text-[15px]">{market.phone.note}</p></div></li>}
              <li className="flex gap-4"><PhoneCall className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{t.commercialTitle}</p><p className="text-[15px]">{t.commercialText}</p></div></li>
              <li className="flex gap-4"><MessageSquare className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{t.supportTitle}</p><p className="text-[15px]">{t.supportText}</p></div></li>
              <li className="flex gap-4"><Mail className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{t.emailTitle}</p><a href={`mailto:${SITE.email}`} className="text-[15px] font-semibold text-signal-deep hover:underline">{SITE.email}</a></div></li>
            </ul>
            <p className="mt-10 text-sm text-slate-light">{t.legal(market.brand, SITE.company)}</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div role="tablist" aria-label={t.tabsLabel} className="mb-6 grid grid-cols-2 rounded-xl bg-paper p-1">
              {(['commercial', 'support'] as const).map((k) => (
                <button key={k} role="tab" aria-selected={type === k} type="button" onClick={() => setType(k)} className={`rounded-lg py-2.5 text-sm font-semibold ${type === k ? 'bg-white text-ink shadow-card' : 'text-slate'}`}>
                  {k === 'commercial' ? t.tabCommercial : t.tabSupport}
                </button>
              ))}
            </div>
            <CallbackForm key={type} type={type} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
