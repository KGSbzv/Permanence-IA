import React from 'react';
import Link from 'next/link';
import { Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { OPEN_CONSENT_EVENT } from './ConsentBanner';
import { SITE, LOGIN_URL, SIGNUP_URL } from '@/data/site';
import { useI18n } from '@/i18n';

export default function Footer() {
  const { c, market, offers } = useI18n();
  const t = c.ui.components.footer;
  const r = t.resources;
  const COLS = [
    { title: t.cols.platform, links: [...c.modules.slice(0, 7).map((m) => ({ href: `/fonctionnalites/${m.slug}`, label: m.name })), { href: '/fonctionnalites', label: t.cols.allFeatures }] },
    { title: t.cols.offers, links: [...offers.map((o) => ({ href: `/offres/${o.slug}`, label: o.name })), { href: '/offres/recharges', label: t.cols.recharges }, { href: '/tarifs', label: t.cols.compare }] },
    { title: t.cols.sectors, links: c.sectors.map((s) => ({ href: `/secteurs/${s.slug}`, label: s.name })) },
    {
      title: t.cols.resources,
      links: [
        { href: '/demo', label: r.demo }, { href: '/integrations', label: r.integrations }, { href: '/faq', label: r.faq }, { href: '/aide', label: r.help },
        { href: '/about', label: r.about }, { href: '/securite', label: r.security }, { href: '/contact', label: r.contact },
      ],
    },
  ];
  return (
    <footer className="bg-night text-white/70">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.2fr_3fr]">
        <div className="space-y-5">
          <Logo height={44} dark />
          <p className="max-w-xs text-[15px]">{t.tagline}</p>
          <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-[15px] text-white hover:text-signal-glow"><Mail className="h-4 w-4" aria-hidden />{SITE.email}</a>
          {market.phone && <a href={`tel:${market.phone.e164}`} className="flex items-center gap-2 text-[15px] text-white hover:text-signal-glow"><Phone className="h-4 w-4" aria-hidden /><bdi dir="ltr">{market.phone.display}</bdi><span className="text-white/60">· {market.phone.label}</span></a>}
          <div className="flex gap-2 pt-1">
            <Link href={SIGNUP_URL} className="btn-signal py-2.5 text-sm">{t.startFree}</Link>
            <a href={LOGIN_URL} className="btn-light py-2.5 text-sm">{t.login}</a>
          </div>
          <ul className="flex flex-wrap gap-2 pt-2 text-xs">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1"><ShieldCheck className="h-3.5 w-3.5 text-signal-glow" aria-hidden />{t.gdpr}</li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1"><Lock className="h-3.5 w-3.5 text-signal-glow" aria-hidden />{t.encryption}</li>
          </ul>
          <LanguageSwitcher dark id="lang-footer" className="block pt-1" />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {col.links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>{t.copyright(new Date().getFullYear(), market.brand, SITE.company)}</p>
          <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="hover:text-white">{c.site.consent.manage}</button>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link href="/mentions-legales" className="hover:text-white">{t.legal.notice}</Link></li>
            <li><Link href="/cgu" className="hover:text-white">{t.legal.terms}</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">{t.legal.privacy}</Link></li>
            <li><Link href="/cookies" className="hover:text-white">{t.legal.cookies}</Link></li>
            <li><Link href="/accessibilite" className="hover:text-white">{t.legal.accessibility}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
