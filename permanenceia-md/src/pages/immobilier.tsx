import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Building2, PhoneCall, Key, Users, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Immobilier() {
  return (
    <Layout
      title="Standard Téléphonique IA pour Agences Immobilières | Permanence IA"
      description="Lead = visite demain. L'agent vocal IA qualifie les acheteurs et locataires, planifie les visites et relance vos estimations 24h/24 et 7j/7."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Hero */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" /> Immobilier &bull; Négociateurs &bull; Agences &amp; Mandataires
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy dark:text-white tracking-tight">
              Lead = visite demain.{' '}
              <span className="text-primary dark:text-accent-glow block mt-1">
                L&apos;IA qualifie. Vous convertissez.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-navy/70 dark:text-gray-300 max-w-2xl mx-auto">
              Un acquéreur sur SeLoger ou LeBonCoin appelle souvent le soir ou le samedi. Si vous ne décrochez pas, il visite le bien d&apos;une autre agence.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/essai-gratuit?plan=pro&coupon=IMMOBILIER10"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
              >
                <span>Essai gratuit 7 jours &bull; Code IMMOBILIER10</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Profitez de -10% avec le code promo <strong>IMMOBILIER10</strong> &bull; Sans engagement
            </p>
          </div>

          {/* Workflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Qualification précise du mandat</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                L&apos;IA demande la référence du bien, le profil (acheteur ou locataire), le budget, la situation bancaire et le secteur recherché.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Routage vers le négociateur</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Routage automatique selon le secteur géographique ou attribution directe au conseiller titulaire du mandat avec fiche pré-remplie.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">+5 mandats &amp; visites / semaine</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Prise de créneaux de visite groupée ou individuelle, et captation des demandes d&apos;estimation de propriétaires vendeurs 24h/24.
              </p>
            </div>
          </div>

          {/* Testimonial / Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-navy text-white border border-primary/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase">Performance commerciale</span>
                <h2 className="text-3xl font-extrabold">Une réactivité immédiate qui rassure les vendeurs</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Lorsque vos propriétaires découvrent que leur annonce est répondue instantanément, même un dimanche soir à 22h, votre mandat exclusif est protégé.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Synchronisation directe agenda Google / Outlook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Connexion webhook CRM (HubSpot, Pipedrive, Apimo)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/10 rounded-2xl p-6 border border-white/15 text-center space-y-4">
                <div className="text-sm font-semibold text-gray-300">Pack Recommandé Agence</div>
                <div className="text-2xl font-black text-white">Pack Pro (299€/m)</div>
                <p className="text-xs text-gray-300">
                  2 000 min &bull; Jusqu&apos;à 5 négociateurs &bull; Routage intelligent
                </p>
                <Link
                  href="/essai-gratuit?plan=pro&coupon=IMMOBILIER10"
                  className="block w-full text-center py-3 rounded-xl bg-primary text-navy font-bold text-sm hover:bg-[#3dbbb2] transition-colors"
                >
                  Tester mon standard immobilier
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
