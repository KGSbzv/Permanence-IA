import React, { useId, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { CallbackForm, Heading, keepPhone, WhatsAppIcon, WhatsAppStarters } from '@/components/ui';
import Mock from '@/components/Mock';
import { tabKeyTarget } from '@/components/tabs';
import { SITE } from '@/data/site';
import { BRAND_MARKS } from '@/data/brandMarks';
import { useI18n } from '@/i18n';
import { Mail, MessageSquare, Phone, PhoneCall } from 'lucide-react';

export default function Contact() {
  const { c, market } = useI18n();
  const t = c.ui.pages.contact;
  const [type, setType] = useState<'commercial' | 'support'>('commercial');
  // Onglets accessibles au clavier : ←/→ (inversées en RTL), Début/Fin, un seul onglet dans l’ordre de tabulation.
  const base = useId().replace(/:/g, '');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const kinds = ['commercial', 'support'] as const;
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = tabKeyTarget(e, i, kinds.length);
    if (next === undefined) return;
    setType(kinds[next]);
    tabs.current[next]?.focus();
  };
  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description}>
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr] lg:py-20">
          <div>
            <Heading as="h1" title={t.h1} intro={keepPhone(t.intro, market.phone?.display)} />
            <ul className="mt-10 space-y-5">
              {market.phone && <li className="flex gap-4"><Phone className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{market.phone.label}</p><a href={`tel:${market.phone.e164}`} className="text-lg font-semibold text-signal-deep hover:underline"><bdi dir="ltr">{market.phone.display}</bdi></a><p className="text-[15px]">{market.phone.note}</p></div></li>}
              <li className="flex gap-4"><WhatsAppIcon className="h-6 w-6 shrink-0 text-[#25D366]" /><div><p className="font-display font-semibold text-ink">WhatsApp · <bdi dir="ltr">{market.whatsapp.display}</bdi></p><p className="text-[15px]">{c.site.whatsapp.note}</p><WhatsAppStarters place="contact" className="mt-3" /></div></li>
              <li className="flex gap-4"><svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-[#0866FF]" aria-hidden><path d={BRAND_MARKS.messenger.path} /></svg><div><p className="font-display font-semibold text-ink">Messenger</p><p className="text-[15px]">{t.messengerNote}</p><a href={SITE.messenger} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-signal-deep hover:underline"><bdi dir="ltr">m.me/permanenceia</bdi></a></div></li>
              <li className="flex gap-4"><PhoneCall className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{t.commercialTitle}</p><p className="text-[15px]">{t.commercialText}</p></div></li>
              <li className="flex gap-4"><MessageSquare className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{t.supportTitle}</p><p className="text-[15px]">{t.supportText}</p></div></li>
              <li className="flex gap-4"><Mail className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">{t.emailTitle}</p><a href={`mailto:${SITE.email}`} className="text-[15px] font-semibold text-signal-deep hover:underline">{SITE.email}</a></div></li>
            </ul>
            <p className="mt-10 text-sm text-slate-light">{t.legal(market.brand, SITE.company)}</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8 lg:row-span-2 lg:self-start">
            <div role="tablist" aria-label={t.tabsLabel} className="mb-6 grid grid-cols-2 rounded-xl bg-paper p-1">
              {kinds.map((k, i) => (
                <button key={k} ref={(el) => { tabs.current[i] = el; }} role="tab" id={`${base}-tab-${k}`} aria-selected={type === k} aria-controls={`${base}-panel`}
                  tabIndex={type === k ? 0 : -1} type="button" onClick={() => setType(k)} onKeyDown={(e) => onKey(e, i)} className={`rounded-lg py-2.5 text-sm font-semibold ${type === k ? 'bg-white text-ink shadow-card' : 'text-slate'}`}>
                  {k === 'commercial' ? t.tabCommercial : t.tabSupport}
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${type}`}><CallbackForm key={type} type={type} /></div>
          </div>
          {/* Visuel : l’agent du marché décroche (décoratif, le formulaire reste l’action principale). */}
          <div className="max-w-md lg:col-start-1" aria-hidden><Mock kind="call" /></div>
        </div>
      </section>
    </Layout>
  );
}
