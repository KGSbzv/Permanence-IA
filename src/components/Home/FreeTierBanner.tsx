import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function FreeTierBanner() {
  const { openCallbackModal } = useCallbackModal();

  const steps = [
    { num: '1', title: 'Votre Objectif', desc: 'Appels entrants, relance devis ou support' },
    { num: '2', title: 'Votre Secteur', desc: 'Vocabulaire métier et règles sur mesure' },
    { num: '3', title: 'Agent à Tester', desc: 'Réceptionniste, Commercial ou Support' },
    { num: '4', title: 'Rappel Test', desc: 'Vérifiez la voix et l’écoute en direct' },
    { num: '5', title: 'Connexion Outils', desc: 'Synchronisez votre agenda ou CRM' },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#0F3A48] via-[#164e63] to-[#0F3A48] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-primary border border-white/20 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Plan Découverte 0 € • Zéro Engagement</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Démarrez aujourd’hui sans carte bancaire
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-200">
            Créez votre compte en 60 secondes et parcourez notre onboarding guidé en 5 étapes pour découvrir l’impact des agents IA sur votre activité.
          </p>
        </div>

        {/* 5 Onboarding Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md relative"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-navy font-black text-sm flex items-center justify-center mb-3">
                {st.num}
              </div>
              <div className="font-bold text-sm text-white">{st.title}</div>
              <div className="text-xs text-gray-300 mt-1">{st.desc}</div>
            </div>
          ))}
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/essai-gratuit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-sm bg-primary hover:bg-[#3dbbb2] text-navy shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>Créer mon compte gratuit (0€)</span>
            <ArrowRight className="w-4 h-4 text-navy" />
          </Link>

          <button
            type="button"
            onClick={() => openCallbackModal({ type: 'commercial' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors"
          >
            <span>Demander une démo guidée par téléphone</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-300">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Aucun prélèvement automatique • Données protégées • Activation instantanée</span>
        </div>

      </div>
    </section>
  );
}
