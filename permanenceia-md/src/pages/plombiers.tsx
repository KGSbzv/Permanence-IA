import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Wrench, PhoneCall, AlertTriangle, CalendarCheck, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function Plombiers() {
  return (
    <Layout
      title="Standard Téléphonique IA pour Plombiers & Artisans | Permanence IA"
      description="Chaque fuite = un lead qualifié. L'agent vocal IA décroche 24h/24 et 7j/7 pendant vos interventions et vous envoie l'adresse d'urgence par SMS."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Hero */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-navy dark:text-accent-glow border border-primary/30 text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" /> Métiers du BTP, Plomberie &amp; Serrurerie
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy dark:text-white tracking-tight">
              Chaque fuite = lead qualifié.{' '}
              <span className="text-primary dark:text-accent-glow block mt-1">
                L&apos;IA reçoit. Vous intervenez.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-navy/70 dark:text-gray-300 max-w-2xl mx-auto">
              Ne perdez plus vos dépannages les plus rentables parce que vous avez les mains dans une canalisation ou que l&apos;appel tombe à 21h.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/essai-gratuit?plan=croissance&coupon=PLOMBIER10"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
              >
                <span>Essai gratuit 7 jours &bull; Code PLOMBIER10</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Profitez de -10% avec le code promo <strong>PLOMBIER10</strong> &bull; Sans engagement
            </p>
          </div>

          {/* Workflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">1. Décroché immédiat 24/7</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Dès la 2ème sonnerie, l&apos;agent vocal accueille le client avec le nom de votre entreprise, de jour comme de nuit ou le week-end.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">2. Qualification d&apos;urgence</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                L&apos;IA demande le type de panne (fuite, chauffe-eau, WC bouché), l&apos;adresse exacte avec digicode, et le degré d&apos;urgence de l&apos;intervention.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">3. Alerte SMS &amp; Créneau</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Vous recevez un SMS synthétique instantané avec le numéro du client cliquable. Si vous le souhaitez, l&apos;IA cale le créneau dans votre calendrier.
              </p>
            </div>
          </div>

          {/* ROI Simulator Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-navy text-white border border-primary/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase">Rentabilité immédiate</span>
                <h2 className="text-3xl font-extrabold">Combien vous coûte un appel manqué ?</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Un dépannage d&apos;urgence moyen en plomberie rapporte entre <strong>180 € et 450 € HT</strong>. En manquant seulement 3 appels par mois, vous perdez plus de 10 000 € de chiffre d&apos;affaires par an.
                </p>
                <div className="pt-2 flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-extrabold text-primary">+3 500 €</div>
                    <div className="text-xs text-gray-400">Gain moyen constaté / mois</div>
                  </div>
                  <div className="border-l border-white/20 pl-6">
                    <div className="text-3xl font-extrabold text-white">0</div>
                    <div className="text-xs text-gray-400">Appel d&apos;urgence perdu</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/10 rounded-2xl p-6 border border-white/15 space-y-4">
                <div className="text-sm font-bold text-primary">Offre recommandée : Pack Croissance</div>
                <div className="text-2xl font-black">149 € <span className="text-xs font-normal text-gray-300">/ mois</span></div>
                <p className="text-xs text-gray-300">
                  Avec le coupon <strong>PLOMBIER10</strong>, testez pendant 7 jours sans risque.
                </p>
                <Link
                  href="/essai-gratuit?plan=croissance&coupon=PLOMBIER10"
                  className="block w-full text-center py-3 rounded-xl bg-primary text-navy font-bold text-sm hover:bg-[#3dbbb2] transition-colors"
                >
                  Activer mon standard plombier
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
