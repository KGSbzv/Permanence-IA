import React, { useState } from 'react';
import { Magnet, TrendingUp, HeartHandshake, Gauge, ArrowRight, CheckCircle2, Bot } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function ArchitectureProcess() {
  const { openCallbackModal } = useCallbackModal();
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: 'attract',
      step: '01',
      title: 'Attract',
      subtitle: 'Capter l’attention & capter les coordonnées',
      icon: Magnet,
      color: 'from-blue-500/20 to-teal-500/20',
      agent: 'Agent Capture & Agent Contenu',
      deliverables: [
        'Landing pages sectorielles optimisées pour la conversion',
        'Formulaires intelligents sans numéro de téléphone exposé',
        'SEO local et structuration des réponses FAQ',
        'Validation instantanée de l’exactitude des emails et téléphones',
      ],
      result: 'Chaque visiteur anonyme devient un prospect identifié dans votre CRM.',
    },
    {
      id: 'convert',
      step: '02',
      title: 'Convert',
      subtitle: 'Rappeler au bon moment & signer plus vite',
      icon: TrendingUp,
      color: 'from-teal-500/20 to-emerald-500/20',
      agent: 'Réceptionniste IA & Agent Commercial',
      deliverables: [
        'Rappels automatiques déclenchés au créneau choisi par le client',
        'Qualification immédiate du budget, de l’urgence et du besoin',
        'Synchronisation temps réel avec Google Calendar ou Doctolib',
        'Transmission immédiate de la fiche prospect qualifiée',
      ],
      result: 'Multipliez par 3 votre réactivité commerciale sans surcharger vos équipes.',
    },
    {
      id: 'engage',
      step: '03',
      title: 'Engage',
      subtitle: 'Assister avec humanité & résoudre sans délai',
      icon: HeartHandshake,
      color: 'from-purple-500/20 to-indigo-500/20',
      agent: 'Agent Support & Agent Réputation',
      deliverables: [
        'Rappels d’assistance automatisés pour les clients sous contrat',
        'Diagnostic préliminaire précis et création de ticket structuré',
        'Collecte d’avis 5 étoiles auprès des clients satisfaits',
        'Escalade transparente avec résumé audio et textuel vers un expert',
      ],
      result: 'Une expérience client premium 24h/24 et une réputation en ligne renforcée.',
    },
    {
      id: 'measure',
      step: '04',
      title: 'Measure',
      subtitle: 'Visualiser le ROI & piloter par la donnée',
      icon: Gauge,
      color: 'from-amber-500/20 to-orange-500/20',
      agent: 'Agent Données & Portail Client',
      deliverables: [
        'Dashboard unifié accessible sur app.permanentia.com',
        'Taux de décroché, volume d’appels et délais moyens de réponse',
        'Attribution claire des canaux et chiffre d’affaires généré',
        'Historique complet des consentements et enregistrements RGPD',
      ],
      result: 'Une visibilité totale sur l’efficacité de votre permanence et vos coûts.',
    },
  ];

  return (
    <section id="process" className="py-24 bg-white dark:bg-[#121A24] border-t border-gray-100 dark:border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Architecture Métier Unifiée
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Le cycle complet : Attract, Convert, Engage, Measure
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Une approche inspirée des plus grandes plateformes B2B : chaque étape s’enchaîne sans couture de la découverte du prospect jusqu’à sa fidélisation.
          </p>
        </div>

        {/* 4 Steps Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-primary/10 dark:bg-primary/20 border-primary shadow-md'
                    : 'bg-gray-50 dark:bg-[#161F2B] border-gray-200/80 dark:border-navy-light/60 hover:bg-gray-100 dark:hover:bg-navy-light/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                    PHASE {p.step}
                  </span>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                </div>
                <div className="font-extrabold text-base text-navy dark:text-white">
                  {p.title}
                </div>
                <div className="text-xs text-navy/60 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {p.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tab Detailed View */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200/80 dark:border-navy-light/60 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-navy dark:text-accent-glow">
                <Bot className="w-3.5 h-3.5" />
                <span>Agents actifs : {pillars[activeTab].agent}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white">
                  {pillars[activeTab].title} — {pillars[activeTab].subtitle}
                </h3>
                <p className="mt-2 text-sm text-navy/70 dark:text-gray-300">
                  {pillars[activeTab].result}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-navy/60 dark:text-gray-400">
                  Fonctionnalités intégrées :
                </div>
                {pillars[activeTab].deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-navy/80 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => openCallbackModal({ type: 'commercial' })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-xs shadow-md transition-all"
                >
                  <span>Configurer cette étape dans ma démo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual preview card for this phase */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1419] border border-gray-200 dark:border-navy-light/60 shadow-inner space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-3 border-b border-gray-100 dark:border-navy-light/40">
                  <span className="font-mono">Flux Opérationnel</span>
                  <span className="text-emerald-500 font-semibold">Actif • Temps réel</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-navy-dark/70 border border-gray-100 dark:border-navy-light/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-navy dark:text-gray-200">Demande entrante</span>
                    <span className="font-mono text-primary">Web Callback</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-navy-dark/70 border border-gray-100 dark:border-navy-light/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-navy dark:text-gray-200">Traitement IA</span>
                    <span className="font-mono text-emerald-500">Qualification auto</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-navy-dark/70 border border-gray-100 dark:border-navy-light/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-navy dark:text-gray-200">Synchronisation</span>
                    <span className="font-mono text-navy dark:text-white">CRM & Agenda</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-gray-400">
                  Zéro perte de données • Journal d'audit horodaté
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
