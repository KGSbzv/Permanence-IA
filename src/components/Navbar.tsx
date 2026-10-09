import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown, Menu, UserRound, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { LOGIN_URL, SIGNUP_URL, isActiveSector } from '@/data/site';
import { useI18n } from '@/i18n';
import { WhatsAppLink } from './ui';

type Item = { href: string; label: string; text?: string };

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { c, market } = useI18n();
  const t = c.ui.components.navbar;
  const r = t.resources;
  const MENUS: { label: string; items: Item[]; wide?: boolean }[] = [
    { label: t.menus.features, wide: true, items: [...c.modules.map((m) => ({ href: `/fonctionnalites/${m.slug}`, label: m.name, text: m.short })), { href: '/fonctionnalites', label: t.menus.allFeatures, text: t.menus.allFeaturesText }] },
    { label: t.menus.sectors, items: [...c.sectors.filter(isActiveSector).map((s) => ({ href: `/secteurs/${s.slug}`, label: s.name })), { href: '/secteurs', label: t.menus.allSectors }] },
    {
      label: t.menus.resources,
      items: [
        { href: '/demo', label: r.demo }, { href: '/integrations', label: r.integrations },
        { href: '/securite', label: r.security }, { href: '/faq', label: r.faq }, { href: '/aide', label: r.help },
        { href: '/about', label: r.about }, { href: '/contact', label: r.contact },
      ],
    },
  ];

  useEffect(() => { setOpen(null); setMobile(false); }, [router.asPath]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-ink px-4 py-1.5 text-[12px] font-medium text-white sm:text-[13px]">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4">
          <p className="text-center">
            {/* Version courte sur mobile (deux badges), phrase complète à partir de la tablette. */}
            <span className="sm:hidden">{c.site.trialBadges(market.trial.days, market.trial.minutes).slice(0, 2).join(' — ')}</span>
            <span className="hidden sm:inline">{c.site.trialLine(market.trial.days, market.trial.minutes)}</span>
          </p>
          {/* Accès client bien visible dès le bandeau (ordinateur) ; sur mobile et tablette, bouton dans la barre ci-dessous. */}
          <a href={LOGIN_URL} className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 hover:bg-white/20 xl:inline-flex">
            <span className="text-white/75">{t.alreadyClient}</span>
            <span className="font-semibold underline underline-offset-2">{t.clientArea}</span>
          </a>
        </div>
      </div>
      {/* Ligne un peu plus large que le contenu (7xl) et écarts réduits : menus, langue, WhatsApp, connexion et essai
          tiennent sur une ligne dès 1 280 px, dans toutes les langues. */}
      <div ref={ref} className="wrap flex h-16 max-w-7xl items-center gap-4 2xl:gap-6">
        <Logo height={40} />
        <nav aria-label={t.mainNav} className="hidden flex-1 items-center gap-1 xl:flex">
          {MENUS.map((m) => (
            <div key={m.label} className="relative">
              <button
                type="button" aria-expanded={open === m.label} onClick={() => setOpen(open === m.label ? null : m.label)}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-ink hover:bg-paper"
              >
                {m.label}<ChevronDown className={`h-4 w-4 transition-transform ${open === m.label ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              {open === m.label && (
                <div className={`absolute start-0 top-full mt-2 rounded-2xl border border-line bg-white p-3 shadow-float ${m.wide ? 'grid w-[680px] grid-cols-2 gap-1' : 'w-64'}`}>
                  {m.items.map((it) => (
                    <Link key={it.href} href={it.href} className="block rounded-lg px-3 py-2 hover:bg-paper">
                      <span className="block text-[15px] font-semibold text-ink">{it.label}</span>
                      {it.text && <span className="block text-[13px] leading-snug text-slate">{it.text}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/tarifs" className="rounded-md px-3 py-2 text-[15px] font-medium text-ink hover:bg-paper">{t.pricing}</Link>
        </nav>
        <div className="ms-auto hidden items-center gap-2 xl:flex">
          <LanguageSwitcher id="lang-desktop" />
          <WhatsAppLink variant="icon" place="header" />
          <a href={LOGIN_URL} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line px-3 py-2 text-[15px] font-semibold text-ink hover:border-ink"><UserRound className="h-4 w-4" aria-hidden />{t.login}</a>
          <Link href={SIGNUP_URL} className="btn-primary py-2.5">{t.startFree}</Link>
        </div>
        {/* Mobile et tablette : la connexion reste visible à côté du menu, sans l’ouvrir. */}
        {/* Sous 430 px, icône seule (le libellé reste lu par les lecteurs d’écran) pour que la ligne tienne. */}
        <a href={LOGIN_URL} className="ms-auto inline-flex h-10 items-center gap-1.5 rounded-lg border border-line px-2.5 text-sm font-semibold text-ink hover:border-ink min-[430px]:px-3 xl:hidden">
          <UserRound className="h-5 w-5 min-[430px]:h-4 min-[430px]:w-4" aria-hidden /><span className="sr-only min-[430px]:not-sr-only">{t.login}</span>
        </a>
        <button type="button" className="rounded-md p-2 text-ink xl:hidden" aria-expanded={mobile} aria-label={mobile ? t.closeMenu : t.openMenu} onClick={() => setMobile(!mobile)}>
          {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobile && (
        <nav aria-label={t.mobileNav} className="max-h-[75vh] overflow-y-auto border-t border-line bg-white px-4 pb-6 xl:hidden">
          {MENUS.map((m) => (
            <details key={m.label} className="border-b border-line py-2">
              <summary className="disclosure flex cursor-pointer items-center justify-between py-2 font-display font-semibold text-ink">
                {m.label}<ChevronDown className="disclosure-icon h-4 w-4 transition-transform" aria-hidden />
              </summary>
              <ul className="pb-2">{m.items.map((it) => <li key={it.href}><Link href={it.href} className="block py-1.5 ps-3 text-ink">{it.label}</Link></li>)}</ul>
            </details>
          ))}
          <Link href="/tarifs" className="block border-b border-line py-4 font-display font-semibold text-ink">{t.pricing}</Link>
          <div className="mt-4 grid gap-2">
            <Link href={SIGNUP_URL} className="btn-primary">{t.startFree}</Link>
            <a href={LOGIN_URL} className="btn-ghost">{t.login}</a>
          </div>
          <LanguageSwitcher id="lang-mobile" className="mt-4 block" />
        </nav>
      )}
    </header>
  );
}
