import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Hospital, PhoneCall, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, Lock, Headphones } from 'lucide-react';

export default function Cliniques() {
  return (
    <Layout
      title="Standard Téléphonique IA pour Cliniques & Maisons de Santé | Permanence IA"
      description="Aucun rendez-vous perdu. Humain en backup si urgence. La solution d'accueil téléphonique IA pour cliniques, centres médicaux et polycliniques conforme RGPD."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Hero */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 text-xs font-bold uppercase tracking-wider">
              <Hospital className="w-3.5 h-3.5" /> Établissements de Santé &bull; Cliniques &bull; Centres Médicaux
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy dark:text-white tracking-tight">
              Aucun rendez-vous perdu.{' '}
              <span className="text-primary dark:text-accent-glow block mt-1">
                Humain en backup si urgence.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-navy/70 dark:text-gray-300 max-w-2xl mx-auto">
              Fluidifiez l&apos;accueil téléphonique de vos patients avec un agent vocal empathique, capable de basculer instantanément vers vos équipes médicales dès qu&apos;une urgence vitale ou complexe est détectée.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/essai-gratuit?plan=pro&coupon=CLINIQUE5"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
              >
                <span>Essai gratuit 7 jours &bull; Code CLINIQUE5</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Code avantage établissement de santé : <strong>CLINIQUE5</strong> &bull; Accompagnement dédié
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Escalade humaine à chaud</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Dès que des mots-clés d&apos;urgence médicale ou de détresse sont prononcés, l&apos;IA transfère l&apos;appel immédiatement vers l&apos;infirmier d&apos;astreinte ou la ligne directe du médecin avec récapitulatif vocal contextuel.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Conformité RGPD stricte</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Données hébergées en Europe (AWS Dublin / Francfort). Chiffrement TLS 1.3 et AES-256. Purge programmable des transcriptions médicales selon la politique de votre DPO.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Multi-spécialités &amp; Praticiens</h3>
              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                Routage par spécialité : radiologie, cardiologie, ophtalmologie, soins infirmiers. Gestion des consignes pré-opératoires et préparation des consultations.
              </p>
            </div>
          </div>

          {/* Enterprise Healthcare Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-navy text-white border border-primary/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase">Audit technique &amp; Sécurité</span>
                <h2 className="text-3xl font-extrabold">Besoin d&apos;un audit de conformité pour votre établissement ?</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Nos ingénieurs sécurité et spécialistes de la voix interviennent pour intégrer la solution sur vos PABX / IPBX existants (Alcatel, Cisco, 3CX, Teams Phone) avec signature d&apos;accord de traitement de données (DPA).
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>DPA &amp; Clauses contractuelles UE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Compatibilité PABX / IPBX &amp; SIP Trunk</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/10 rounded-2xl p-6 border border-white/15 text-center space-y-4">
                <div className="text-sm font-semibold text-gray-300">Formule Clinique &amp; Centre</div>
                <div className="text-2xl font-black text-white">Pack Pro Santé (299€/m)</div>
                <p className="text-xs text-gray-300">
                  Volumétrie illimitée disponible &bull; SLA 99.98% &bull; Support 24/7
                </p>
                <Link
                  href="/essai-gratuit?plan=pro&coupon=CLINIQUE5"
                  className="block w-full text-center py-3 rounded-xl bg-primary text-navy font-bold text-sm hover:bg-[#3dbbb2] transition-colors"
                >
                  Demander l&apos;audit gratuit
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
