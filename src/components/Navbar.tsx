import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { MODULES } from '@/data/modules';
import { SECTORS } from '@/data/sectors';
import { LOGIN_URL, SIGNUP_URL, TRIAL_LINE } from '@/data/site';

type Item = { href: string; label: string; text?: string };
const MENUS: { label: string; items: Item[]; wide?: boolean }[] = [
  { label: 'Fonctionnalités', wide: true, items: MODULES.map((m) => ({ href: `/fonctionnalites/${m.slug}`, label: m.name, text: m.short })) },
  { label: 'Secteurs', items: [...SECTORS.map((s) => ({ href: `/secteurs/${s.slug}`, label: s.name })), { href: '/secteurs', label: 'Tous les secteurs' }] },
  {
    label: 'Ressources',
    items: [
      { href: '/demo', label: 'Démo live' }, { href: '/integrations', label: 'Intégrations' },
      { href: '/securite', label: 'Sécurité et conformité' }, { href: '/faq', label: 'Questions fréquentes' },
      { href: '/blog', label: 'Blog' }, { href: '/contact', label: 'Contact et rappel' },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(null); setMobile(false); }, [router.asPath]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <p className="bg-ink px-4 py-1.5 text-center text-[13px] font-medium text-white">{TRIAL_LINE}</p>
      <div ref={ref} className="wrap flex h-16 items-center gap-6">
        <Logo height={40} />
        <nav aria-label="Navigation principale" className="hidden flex-1 items-center gap-1 lg:flex">
          {MENUS.map((m) => (
            <div key={m.label} className="relative">
              <button
                type="button" aria-expanded={open === m.label} onClick={() => setOpen(open === m.label ? null : m.label)}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-ink hover:bg-paper"
              >
                {m.label}<ChevronDown className={`h-4 w-4 transition-transform ${open === m.label ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              {open === m.label && (
                <div className={`absolute left-0 top-full mt-2 rounded-2xl border border-line bg-white p-3 shadow-float ${m.wide ? 'grid w-[680px] grid-cols-2 gap-1' : 'w-64'}`}>
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
          <Link href="/tarifs" className="rounded-md px-3 py-2 text-[15px] font-medium text-ink hover:bg-paper">Tarifs</Link>
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <a href={LOGIN_URL} className="rounded-md px-3 py-2 text-[15px] font-medium text-ink hover:bg-paper">Connexion</a>
          <Link href={SIGNUP_URL} className="btn-primary py-2.5">Commencer gratuitement</Link>
        </div>
        <button type="button" className="ml-auto rounded-md p-2 text-ink lg:hidden" aria-expanded={mobile} aria-label={mobile ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMobile(!mobile)}>
          {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobile && (
        <nav aria-label="Navigation mobile" className="max-h-[75vh] overflow-y-auto border-t border-line bg-white px-4 pb-6 lg:hidden">
          {MENUS.map((m) => (
            <details key={m.label} className="border-b border-line py-2">
              <summary className="cursor-pointer py-2 font-display font-semibold text-ink">{m.label}</summary>
              <ul className="pb-2">{m.items.map((it) => <li key={it.href}><Link href={it.href} className="block py-1.5 pl-3 text-ink">{it.label}</Link></li>)}</ul>
            </details>
          ))}
          <Link href="/tarifs" className="block border-b border-line py-4 font-display font-semibold text-ink">Tarifs</Link>
          <div className="mt-4 grid gap-2">
            <Link href={SIGNUP_URL} className="btn-primary">Commencer gratuitement</Link>
            <a href={LOGIN_URL} className="btn-ghost">Connexion</a>
          </div>
        </nav>
      )}
    </header>
  );
}
