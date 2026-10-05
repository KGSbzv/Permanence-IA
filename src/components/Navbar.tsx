import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ChevronDown, PhoneCall, Sparkles, Bot, LogIn, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { useCallbackModal } from '@/context/CallbackContext';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const { openCallbackModal } = useCallbackModal();

  const isActive = (path: string) => router.pathname === path;

  const sectors = [
    { name: 'Plombiers & Artisans', path: '/plombiers', desc: 'Gestion des urgences et qualification fuite 24/7' },
    { name: 'Cabinets Dentaires', path: '/dentaire', desc: 'Prise de rendez-vous et réduction des no-shows' },
    { name: 'Agences Immobilières', path: '/immobilier', desc: 'Qualification acheteurs/locataires et plannings visites' },
    { name: 'Cliniques & Santé', path: '/cliniques', desc: 'Accueil des patients et escalade humaine sécurisée' },
    { name: 'Garages & Automobile', path: '/#secteurs', desc: 'Prise en charge ateliers et devis sans attente' },
    { name: 'Restauration & Salons', path: '/#secteurs', desc: 'Réservations et renseignements en temps réel' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#0F1419]/90 border-b border-gray-100 dark:border-navy-light/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Logo height={44} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary dark:text-accent-glow font-semibold'
                  : 'text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow'
              }`}
            >
              Accueil
            </Link>

            <a
              href="/#agents"
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow transition-colors"
            >
              Agents IA
            </a>

            <a
              href="/#process"
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow transition-colors"
            >
              Solutions
            </a>

            {/* Secteurs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSectorsOpen(true)}
              onMouseLeave={() => setSectorsOpen(false)}
            >
              <button
                type="button"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  ['/plombiers', '/dentaire', '/immobilier', '/cliniques'].includes(router.pathname)
                    ? 'text-primary dark:text-accent-glow font-semibold'
                    : 'text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow'
                }`}
                onClick={() => setSectorsOpen(!sectorsOpen)}
              >
                <span>Secteurs</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${sectorsOpen ? 'rotate-180' : ''}`} />
              </button>

              {sectorsOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50">
                  <div className="bg-white dark:bg-[#161F2B] rounded-xl shadow-xl border border-gray-100 dark:border-navy-light/60 p-2 space-y-1">
                    {sectors.map((sec) => (
                      <Link
                        key={sec.name}
                        href={sec.path}
                        onClick={() => setSectorsOpen(false)}
                        className={`block p-3 rounded-lg transition-colors ${
                          isActive(sec.path)
                            ? 'bg-primary/10 text-primary dark:text-accent-glow'
                            : 'hover:bg-gray-50 dark:hover:bg-navy-light/40 text-navy dark:text-gray-200'
                        }`}
                      >
                        <div className="font-semibold text-sm">{sec.name}</div>
                        <div className="text-xs text-navy/60 dark:text-gray-400 mt-0.5">{sec.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/tarifs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/tarifs')
                  ? 'text-primary dark:text-accent-glow font-semibold'
                  : 'text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow'
              }`}
            >
              Packages & Tarifs
            </Link>

            <Link
              href="/blog"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/blog') || router.pathname.startsWith('/blog/')
                  ? 'text-primary dark:text-accent-glow font-semibold'
                  : 'text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow'
              }`}
            >
              Ressources
            </Link>

            <Link
              href="/faq"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/faq')
                  ? 'text-primary dark:text-accent-glow font-semibold'
                  : 'text-navy/80 dark:text-gray-200 hover:text-primary dark:hover:text-accent-glow'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <DarkModeToggle />

            {/* Demander un rappel modal button */}
            <button
              type="button"
              onClick={() => openCallbackModal({ type: 'commercial' })}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-navy dark:text-gray-200 border border-gray-200 dark:border-navy-light hover:bg-gray-50 dark:hover:bg-navy-light/50 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-primary" />
              <span>Demander un rappel</span>
            </button>

            <a
              href="https://app.permanenceia.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-navy/80 dark:text-gray-300 hover:text-primary dark:hover:text-accent-glow transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </a>

            <Link
              href="/essai-gratuit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-primary hover:bg-[#3dbbb2] text-navy shadow-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-navy" />
              <span>Commencer gratuitement</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <DarkModeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-light/40 transition-colors"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-100 dark:border-navy-light/60 bg-white/95 dark:bg-[#0F1419]/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-navy-light/40"
            >
              Accueil
            </Link>
            <a
              href="/#agents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-navy-light/40"
            >
              Agents IA
            </a>
            <a
              href="/#process"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-navy-light/40"
            >
              Solutions & Parcours
            </a>
            <Link
              href="/tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-navy-light/40"
            >
              Packages & Tarifs
            </Link>

            <div className="pt-2 pb-1 px-3 text-xs font-semibold text-navy/50 dark:text-gray-400 uppercase tracking-wider">
              Secteurs d&apos;activité
            </div>
            {sectors.map((sec) => (
              <Link
                key={sec.name}
                href={sec.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-6 pr-3 py-2 rounded-lg text-sm text-navy/80 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-light/40"
              >
                {sec.name}
              </Link>
            ))}

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-navy-light/40"
            >
              Ressources
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-navy-light/40"
            >
              FAQ
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-navy-light/60 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCallbackModal({ type: 'commercial' });
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-navy dark:text-white border border-gray-200 dark:border-navy-light"
            >
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>Demander un rappel</span>
            </button>
            <a
              href="https://app.permanenceia.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-navy/80 dark:text-gray-300 hover:text-primary"
            >
              Connexion à l&apos;application
            </a>
            <Link
              href="/essai-gratuit"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-[#3dbbb2] text-navy shadow"
            >
              Commencer gratuitement (0€)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
