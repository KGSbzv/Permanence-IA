import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, PhoneCall, Bot, CheckCircle2, Shield, Calendar, Users, Zap } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function HeroAgents() {
  const { openCallbackModal } = useCallbackModal();

  const orbitAgents = [
    { name: 'Agent Capture', role: 'Web & Formulaires', color: 'border-blue-400', badge: 'Lead capturé • 2s' },
    { name: 'Agent Commercial', role: 'Rappels & Vente', color: 'border-emerald-400', badge: 'Rappel qualifié' },
    { name: 'Agent Support', role: 'Tickets & Diagnostic', color: 'border-amber-400', badge: 'Ticket résolu' },
    { name: 'Agent Agenda', role: 'Prise de rendez-vous', color: 'border-purple-400', badge: 'RDV confirmé' },
  ];

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0B0F14] dark:via-[#0F1419] dark:to-[#0B0F14]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/15 dark:bg-primary/20 text-[#0F3A48] dark:text-accent-glow border border-primary/30 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Architecture IA Inspirée • Modèle Zéro Numéro Public</span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F3A48] dark:text-white tracking-tight leading-[1.15]">
            Une équipe d’agents IA pour{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E9E98] to-[#4ECDC4] dark:from-[#5FE0DB] dark:to-[#4ECDC4]">
              attirer, convertir et fidéliser
            </span>{' '}
            vos clients.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-navy/70 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Capturez chaque demande, qualifiez vos prospects, planifiez des rappels intelligents et gardez vos conversations unifiées —{' '}
            <strong className="text-navy dark:text-white font-semibold">sans carte bancaire</strong>,{' '}
            <strong className="text-navy dark:text-white font-semibold">sans engagement</strong> et{' '}
            <strong className="text-navy dark:text-white font-semibold">sans numéro public exposé</strong>.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16">
          <Link
            href="/essai-gratuit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-[#3dbbb2] text-navy shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-navy" />
            <span>Commencer gratuitement (0€)</span>
            <ArrowRight className="w-4 h-4 text-navy" />
          </Link>

          <a
            href="#agents"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-navy-light text-navy dark:text-white border border-gray-200 dark:border-navy-light hover:bg-gray-50 dark:hover:bg-navy-light/80 transition-all shadow-sm"
          >
            <Bot className="w-4 h-4 text-primary" />
            <span>Découvrir les 10 Agents</span>
          </a>

          <button
            type="button"
            onClick={() => openCallbackModal({ type: 'commercial' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#0F3A48] dark:text-accent-glow hover:bg-primary/10 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Choisir l’heure de mon rappel</span>
          </button>
        </div>

        {/* Visual Showcase: Orbit of Agents around CRM Core */}
        <div className="relative max-w-5xl mx-auto mt-6">
          <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-[#161F2B]/90 dark:to-[#0F1419]/90 border border-gray-200/80 dark:border-navy-light/60 shadow-2xl backdrop-blur-xl">
            
            {/* Visual Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-gray-100 dark:border-navy-light/40">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Système Opérationnel 24h/24 & 7j/7
                </span>
              </div>
              <div className="text-xs text-navy/60 dark:text-gray-400 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Escalade humaine sécurisée • Conformité RGPD</span>
              </div>
            </div>

            {/* Central Graphic: Core Receptionist + Orbiting Agents */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Central AI Receptionist Card */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-teal-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white dark:border-[#161F2B] shadow-xl bg-navy">
                    <img
                      src="/images/receptionniste-1.png"
                      alt="Réceptionniste IA Permanence IA"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute bottom-1 right-3 bg-white dark:bg-[#161F2B] px-3 py-1 rounded-full shadow-md border border-gray-200 dark:border-navy-light flex items-center gap-1.5 text-xs font-bold text-navy dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Agent IA Dédié</span>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-navy dark:text-white">
                  Réceptionniste IA Vocale
                </h3>
                <p className="mt-1 text-xs text-navy/60 dark:text-gray-400 max-w-xs">
                  Accueil chaleureux sans numéro public, écoute active, compréhension du besoin et création immédiate de lead.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Décroché en &lt; 3s
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    Sans attente
                  </span>
                </div>
              </div>

              {/* Orbiting Specialist Agents Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orbitAgents.map((agent, i) => (
                  <div
                    key={agent.name}
                    className="p-4 rounded-2xl bg-white dark:bg-[#121A24] border border-gray-100 dark:border-navy-light/40 shadow-sm hover:shadow-md transition-all hover:border-primary/40 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-navy dark:text-white">
                            {agent.name}
                          </h4>
                          <span className="text-[11px] text-navy/50 dark:text-gray-400">
                            {agent.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-navy-light/30 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        {agent.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => openCallbackModal({ agent: agent.name })}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Tester &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Proof Strip */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-navy-light/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-navy dark:text-white">0 €</div>
                <div className="text-xs text-navy/60 dark:text-gray-400 mt-0.5">Plan Découverte sans CB</div>
              </div>
              <div>
                <div className="text-2xl font-black text-primary">100%</div>
                <div className="text-xs text-navy/60 dark:text-gray-400 mt-0.5">Rappels exécutés à l'heure</div>
              </div>
              <div>
                <div className="text-2xl font-black text-navy dark:text-white">&lt; 15 min</div>
                <div className="text-xs text-navy/60 dark:text-gray-400 mt-0.5">Configuration & Activation</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-500">Zéro</div>
                <div className="text-xs text-navy/60 dark:text-gray-400 mt-0.5">Numéro surtaxé ou public</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
