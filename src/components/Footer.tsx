import React from 'react';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { MODULES } from '@/data/modules';
import { SECTORS } from '@/data/sectors';
import { OFFERS } from '@/data/offers';
import { SITE, LOGIN_URL, SIGNUP_URL } from '@/data/site';

const COLS = [
  { title: 'Plateforme', links: [...MODULES.slice(0, 7).map((m) => ({ href: `/fonctionnalites/${m.slug}`, label: m.name })), { href: '/fonctionnalites', label: 'Toutes les fonctionnalités' }] },
  { title: 'Offres', links: [...OFFERS.map((o) => ({ href: `/offres/${o.slug}`, label: o.name })), { href: '/offres/recharges', label: 'Recharges de minutes' }, { href: '/tarifs', label: 'Comparer les offres' }] },
  { title: 'Secteurs', links: SECTORS.map((s) => ({ href: `/secteurs/${s.slug}`, label: s.name })) },
  {
    title: 'Ressources',
    links: [
      { href: '/demo', label: 'Démo live' }, { href: '/integrations', label: 'Intégrations' }, { href: '/faq', label: 'Questions fréquentes' }, { href: '/aide', label: 'Aide de l’espace client' },
      { href: '/about', label: 'À propos' }, { href: '/securite', label: 'Sécurité et conformité' }, { href: '/contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white/70">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.2fr_3fr]">
        <div className="space-y-5">
          <Logo height={44} dark />
          <p className="max-w-xs text-[15px]">Agents vocaux IA qui répondent, qualifient, réservent et rappellent pour votre entreprise, 24 h/24.</p>
          <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-[15px] text-white hover:text-signal-glow"><Mail className="h-4 w-4" aria-hidden />{SITE.email}</a>
          <div className="flex gap-2 pt-1">
            <Link href={SIGNUP_URL} className="btn-signal py-2.5 text-sm">Commencer gratuitement</Link>
            <a href={LOGIN_URL} className="btn-light py-2.5 text-sm">Connexion</a>
          </div>
          <ul className="flex flex-wrap gap-2 pt-2 text-xs">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1"><ShieldCheck className="h-3.5 w-3.5 text-signal-glow" aria-hidden />Outils RGPD intégrés</li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1"><Lock className="h-3.5 w-3.5 text-signal-glow" aria-hidden />Chiffrement en transit et au repos</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="font-display text-sm font-semibold text-white">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {c.links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Permanence IA — marque de {SITE.company}. Prix affichés HT.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
            <li><Link href="/cgu" className="hover:text-white">CGU / CGV</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
