import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { HeartPulse, PhoneCall, CalendarCheck, ShieldAlert, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export default function Dentaire() {
  return (
    <Layout
      title="Standard Téléphonique IA pour Cabinets Dentaires | Permanence IA"
      description="Cabinet plein, zéro appel manqué, zéro oubli. Libérez votre secrétariat médical : prise de RDV automatique, gestion des urgences dentaires et réduction des no-shows."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Hero */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" /> Santé &bull; Chirurgiens-Dentistes &bull; Orthodontie
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy dark:text-white tracking-tight">
              Cabinet plein. Zéro appel manqué.{' '}
              <span className="text-primary dark:text-accent-glow block mt-1">
                Zéro rendez-vous oublié.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-navy/70 dark:text-gray-300 max-w-2xl mx-auto">
              Pendant que vous soignez vos patients au fauteuil, votre assistante reste concentrée. L&apos;IA accueille avec tact, gère les urgences et remplit votre agenda.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/essai-gratuit?plan=croissance&coupon=DENTALCARE10"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
              >
                <span>Essai gratuit 7 jours &bull; Code DENTALCARE10</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Offre spéciale cabinet dentaire : -10% avec le code <strong>DENTALCARE10</strong>
            </p>
          </div>

          {/* Key Medical Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-500 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Triage des urgences dentaires</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                L&apos;IA évalue la douleur (rage de dent, traumatisme, expulsion dentaire) et oriente le patient vers votre créneau d&apos;urgence du jour ou vous transfère directement.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Prise de rendez-vous synchronisée</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Interfaçable avec Doctolib, Google Calendar ou votre planning interne. L&apos;IA vérifie si le patient est déjà connu du cabinet et réserve selon vos motifs prédéfinis.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">-30% de rendez-vous manqués</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Confirmation immédiate par SMS et rappel vocal automatisé la veille. Les créneaux libérés sont réattribués aux patients sur liste d&apos;attente.
              </p>
            </div>
          </div>

          {/* Testimonial / Compliance Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-navy text-white border border-primary/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase">Conformité Médicale &amp; Secret Professionnel</span>
                <h2 className="text-3xl font-extrabold">Une technologie conçue pour la rigueur du milieu médical</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Toutes les données sont chiffrées de bout en bout et hébergées au sein de l&apos;Union Européenne en conformité stricte avec le RGPD et les recommandations de l&apos;Ordre des Chirurgiens-Dentistes.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Hébergement UE souverain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Zéro revente de données de santé</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/10 rounded-2xl p-6 border border-white/15 text-center space-y-4">
                <div className="text-sm font-semibold text-gray-300">Équiper votre cabinet</div>
                <div className="text-2xl font-black text-white">Pack Croissance (149€/m)</div>
                <p className="text-xs text-gray-300">
                  800 min/mois &bull; Calendrier synchronisé &bull; SMS de rappel inclus
                </p>
                <Link
                  href="/essai-gratuit?plan=croissance&coupon=DENTALCARE10"
                  className="block w-full text-center py-3 rounded-xl bg-primary text-navy font-bold text-sm hover:bg-[#3dbbb2] transition-colors"
                >
                  Démarrer l&apos;essai dentaire
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
