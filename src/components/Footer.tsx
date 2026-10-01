import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { ShieldCheck, Lock, Activity, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#0A0E13] border-t border-gray-200 dark:border-navy-light/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo height={34} />
            <p className="text-sm text-navy/70 dark:text-gray-400 max-w-sm leading-relaxed">
              Standard téléphonique IA 24 h/24 &amp; 7 j/7. Réception d&apos;appels, qualification intelligente des leads, prise de rendez-vous automatique et escalade d&apos;urgence sans rupture de service.
            </p>
            
            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Système &amp; Agents vocaux opérationnels (99.98% uptime)</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-navy/60 dark:text-gray-400 pt-2">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Hébergement UE (AWS Ireland)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" /> Conforme RGPD
              </span>
            </div>
          </div>

          {/* Col 2: Produit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Produit</h4>
            <ul className="space-y-2 text-sm text-navy/75 dark:text-gray-400">
              <li>
                <Link href="/tarifs" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Tarifs &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/essai-gratuit" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Essai gratuit 7 jours
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Questions fréquentes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Blog &amp; Tutoriels
                </Link>
              </li>
              <li>
                <a
                  href="https://app.permanenceia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary dark:hover:text-accent-glow transition-colors"
                >
                  Dashboard Client <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Secteurs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Secteurs</h4>
            <ul className="space-y-2 text-sm text-navy/75 dark:text-gray-400">
              <li>
                <Link href="/plombiers" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Plombiers &amp; Artisans
                </Link>
              </li>
              <li>
                <Link href="/dentaire" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Cabinets Dentaires
                </Link>
              </li>
              <li>
                <Link href="/immobilier" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Agences Immobilières
                </Link>
              </li>
              <li>
                <Link href="/cliniques" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Cliniques &amp; Santé
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Légal & Entreprise */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Légal &amp; Contact</h4>
            <ul className="space-y-2 text-sm text-navy/75 dark:text-gray-400">
              <li>
                <Link href="/about" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  Confidentialité (RGPD)
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:text-primary dark:hover:text-accent-glow transition-colors">
                  CGU &amp; Conditions de vente
                </Link>
              </li>
              <li>
                <a href="mailto:contact@permanenceia.com" className="inline-flex items-center gap-1.5 hover:text-primary dark:hover:text-accent-glow transition-colors">
                  <Mail className="w-3.5 h-3.5" /> contact@permanenceia.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-navy-light/40 flex flex-col sm:flex-row items-center justify-between text-xs text-navy/60 dark:text-gray-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Permanence IA — Tous droits réservés. Architecture vocale Autocalls White-Label.
          </div>
          <div className="flex items-center space-x-6">
            <span className="font-mono">permanenceia.com</span>
            <span>&bull;</span>
            <span className="font-mono">app.permanenceia.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
