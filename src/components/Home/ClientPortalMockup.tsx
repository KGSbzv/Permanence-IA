import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, PhoneCall, Users, Headphones, Shield, Sparkles, 
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, LogIn 
} from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function ClientPortalMockup() {
  const { openCallbackModal } = useCallbackModal();
  const [activeTab, setActiveTab] = useState<'overview' | 'callbacks' | 'leads' | 'tickets'>('overview');

  return (
    <section className="py-24 bg-white dark:bg-[#121A24] border-t border-gray-100 dark:border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Espace Client Unifié
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Un portail complet pour piloter vos agents et vos leads
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Accessible depuis <code className="px-2 py-0.5 rounded bg-gray-100 dark:bg-navy-dark text-primary text-xs font-mono font-bold">app.permanentia.com</code> avec gestion fine des rôles (propriétaire, administrateur, opérateur, support).
          </p>
        </div>

        {/* Dashboard Mockup Card */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-navy-light/60 bg-gray-50/60 dark:bg-[#161F2B] p-4 sm:p-8 shadow-2xl">
          
          {/* Top Browser Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-200 dark:border-navy-light/50 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                https://app.permanentia.com/dashboard
              </span>
            </div>

            {/* Dashboard Submenu */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-navy-dark rounded-xl border border-gray-200 dark:border-navy-light/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'overview' ? 'bg-primary text-navy font-bold shadow-sm' : 'text-navy/70 dark:text-gray-400'
                }`}
              >
                Vue d’ensemble
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('callbacks')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'callbacks' ? 'bg-primary text-navy font-bold shadow-sm' : 'text-navy/70 dark:text-gray-400'
                }`}
              >
                Rappels IA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'leads' ? 'bg-primary text-navy font-bold shadow-sm' : 'text-navy/70 dark:text-gray-400'
                }`}
              >
                Leads CRM
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'tickets' ? 'bg-primary text-navy font-bold shadow-sm' : 'text-navy/70 dark:text-gray-400'
                }`}
              >
                Tickets Support
              </button>
            </div>
          </div>

          {/* Onboarding progress bar inside dashboard */}
          <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-[#121A24] border border-gray-200/80 dark:border-navy-light/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                80%
              </div>
              <div>
                <div className="text-xs font-bold text-navy dark:text-white">
                  Progression de configuration de votre permanence
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  Étape 4 sur 5 : Connecter votre agenda pour la confirmation de RDV.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openCallbackModal({ type: 'commercial' })}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Demander de l’aide à un expert</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab content bodies */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40">
                    <span className="text-xs text-navy/60 dark:text-gray-400">Appels & Rappels (30j)</span>
                    <div className="text-2xl font-black text-navy dark:text-white mt-1">142</div>
                    <span className="text-[11px] text-emerald-500 font-semibold">+18% ce mois</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40">
                    <span className="text-xs text-navy/60 dark:text-gray-400">Taux de Décroché</span>
                    <div className="text-2xl font-black text-primary mt-1">99.4%</div>
                    <span className="text-[11px] text-gray-500">Moyenne &lt; 3.2s</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40">
                    <span className="text-xs text-navy/60 dark:text-gray-400">RDV Confirmés Agenda</span>
                    <div className="text-2xl font-black text-navy dark:text-white mt-1">38</div>
                    <span className="text-[11px] text-emerald-500 font-semibold">Zéro no-show</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40">
                    <span className="text-xs text-navy/60 dark:text-gray-400">Tickets Résolus</span>
                    <div className="text-2xl font-black text-navy dark:text-white mt-1">29 / 31</div>
                    <span className="text-[11px] text-gray-500">SLA respecté à 100%</span>
                  </div>
                </div>

                {/* Recent Activities Table */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40">
                  <div className="text-xs font-bold text-navy dark:text-white mb-3">
                    Dernières Actions Exécutées par les Agents IA :
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-dark flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-navy dark:text-white">Agent Commercial :</span>
                        <span className="text-navy/70 dark:text-gray-300">Rappel exécuté avec M. Dubois (Devis validé)</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">Il y a 14 min</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-dark flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-navy dark:text-white">Réceptionniste IA :</span>
                        <span className="text-navy/70 dark:text-gray-300">Appel entrant qualifié en urgence fuite (Plombier transmis)</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">Il y a 32 min</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-dark flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-navy dark:text-white">Agent Support :</span>
                        <span className="text-navy/70 dark:text-gray-300">Ticket #1042 clôturé avec confirmation client</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">Il y a 1h</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'callbacks' && (
              <div className="p-6 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40 text-xs space-y-3">
                <div className="font-bold text-navy dark:text-white text-sm">File d’attente des rappels planifiés</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Chaque rappel est consigné avec son créneau choisi, le consentement RGPD vérifié et l’agent assigné.
                </p>
                <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy dark:text-white">Alexandre M. (06 ** ** 78)</span>
                    <div className="text-gray-400 text-[11px]">Créneau : Aujourd’hui 16h30 • Agent Commercial</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold">Programmé</span>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="p-6 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40 text-xs space-y-3">
                <div className="font-bold text-navy dark:text-white text-sm">Fiches Prospects CRM en temps réel</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Toutes les informations collectées lors des conversations orales ou écrites sont automatiquement synchronisées.
                </p>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-navy-light/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy dark:text-white">Cabinet Dentaire Dr Lefevre</span>
                    <div className="text-gray-400 text-[11px]">Intérêt : Plan Croissance • Budget validé</div>
                  </div>
                  <span className="px-2 py-0.5 bg-primary text-navy rounded text-[10px] font-bold">Chaud (Score 92)</span>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="p-6 rounded-xl bg-white dark:bg-[#121A24] border border-gray-200 dark:border-navy-light/40 text-xs space-y-3">
                <div className="font-bold text-navy dark:text-white text-sm">Tickets d'Assistance & Diagnostics</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Suivi des résolutions automatiques par l’Agent Support et des escalades vers vos techniciens.
                </p>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-navy-light/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy dark:text-white">Ticket #1043 — Changement de créneau RDV</span>
                    <div className="text-gray-400 text-[11px]">Client : Sophie D. • Résolu sans intervention humaine</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">Clôturé</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom link to actual app */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-navy-light/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-navy/70 dark:text-gray-400">
              Déjà client ou partenaire ? Accédez à votre interface de production.
            </span>
            <a
              href="https://app.permanentia.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy dark:bg-white text-white dark:text-navy text-xs font-bold hover:opacity-90 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ouvrir l’application app.permanentia.com</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
