import React, { useState } from 'react';
import { 
  Bot, PhoneCall, Calendar, Headphones, Star, RefreshCw, FileText, 
  BarChart3, Search, Sparkles, Check, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

interface AgentInfo {
  id: string;
  name: string;
  category: 'attract' | 'convert' | 'engage' | 'measure';
  role: string;
  result: string;
  capabilities: string[];
  limits: string;
  packageRequired: string;
  icon: any;
  highlight?: boolean;
}

export default function AgentCatalogue() {
  const { openCallbackModal } = useCallbackModal();
  const [filter, setFilter] = useState<'all' | 'attract' | 'convert' | 'engage' | 'measure'>('all');

  const agents: AgentInfo[] = [
    {
      id: 'capture',
      name: 'Agent Capture',
      category: 'attract',
      role: 'Réception formulaires web & capture immédiate de leads',
      result: '100% des demandes web traitées en temps réel',
      capabilities: ['Validation des coordonnées', 'Création instantanée du lead CRM', 'Notification immédiate de l’équipe'],
      limits: 'Ne déclenche pas d’appel vocal direct sans accord',
      packageRequired: 'Essentiel (dès 49€/m)',
      icon: Search,
    },
    {
      id: 'receptionniste',
      name: 'Réceptionniste IA Vocale',
      category: 'convert',
      role: 'Accueil téléphonique & standard intelligent 24/7',
      result: 'Zéro appel manqué, décroché sous 3 secondes',
      capabilities: ['Compréhension du besoin naturel', 'Gestion des urgences & filtrage', 'Prise de coordonnées & confirmation'],
      limits: 'Ne remplace pas un conseil médical ou juridique expert',
      packageRequired: 'Croissance (dès 149€/m)',
      icon: PhoneCall,
      highlight: true,
    },
    {
      id: 'commercial',
      name: 'Agent Commercial',
      category: 'convert',
      role: 'Rappels planifiés & qualification active des opportunités',
      result: '+35% de taux de transformation prospect-en-client',
      capabilities: ['Rappels aux créneaux demandés', 'Présentation des offres & tarifs', 'Mise à jour du statut opportunité CRM'],
      limits: 'Appels exécutés uniquement sur consentement explicite',
      packageRequired: 'Croissance (dès 149€/m)',
      icon: Sparkles,
    },
    {
      id: 'agenda',
      name: 'Agent Agenda',
      category: 'convert',
      role: 'Planification synchronisée de rendez-vous dans vos plannings',
      result: '-70% de no-shows grâce aux rappels et confirmations',
      capabilities: ['Sync Google Calendar, Outlook, Doctolib', 'Proposition des créneaux libres réels', 'Envoi de rappels SMS / Email'],
      limits: 'Nécessite la connexion préalable d’un agenda compatible',
      packageRequired: 'Croissance (dès 149€/m)',
      icon: Calendar,
    },
    {
      id: 'support',
      name: 'Agent Support & Tickets',
      category: 'engage',
      role: 'Rappels d’assistance, premier diagnostic & suivi de tickets',
      result: 'Résolution au premier contact en &lt; 5 minutes',
      capabilities: ['Création & qualification de ticket support', 'Rappels d’assistance aux clients actifs', 'Escalade avec résumé complet vers un technicien'],
      limits: 'Escalade obligatoire en cas d’anomalie critique',
      packageRequired: 'Pro (dès 299€/m)',
      icon: Headphones,
    },
    {
      id: 'reputation',
      name: 'Agent Réputation',
      category: 'engage',
      role: 'Collecte et préparation des demandes d’avis clients vérifiés',
      result: '+40% de retours clients 5 étoiles Google / Trustpilot',
      capabilities: ['Détection des clients satisfaits', 'Préparation des messages d’invitation', 'Soumission des demandes sous validation humaine'],
      limits: 'Aucun envoi sans validation de votre part',
      packageRequired: 'Pro (dès 299€/m)',
      icon: Star,
    },
    {
      id: 'relance',
      name: 'Agent Relance',
      category: 'engage',
      role: 'Réactivation ciblée de devis non signés et prospects dormants',
      result: '+20% de devis clôturés sans effort manuel',
      capabilities: ['Suivi des devis à J+3, J+7', 'Rappels programmés des contacts autorisés', 'Consignation des objections dans le CRM'],
      limits: 'Limité aux règles anti-spam et consentements actifs',
      packageRequired: 'Croissance (dès 149€/m)',
      icon: RefreshCw,
    },
    {
      id: 'contenu',
      name: 'Agent Contenu',
      category: 'attract',
      role: 'Génération de FAQ sectorielles & fiches services pour votre site',
      result: 'Gain de 10h/mois de rédaction technique',
      capabilities: ['Création de réponses aux questions récurrentes', 'Adaptation au vocabulaire de votre secteur', 'Export prêt pour publication'],
      limits: 'Validation éditoriale humaine requise',
      packageRequired: 'Pro (dès 299€/m)',
      icon: FileText,
    },
    {
      id: 'donnees',
      name: 'Agent Données & Analytics',
      category: 'measure',
      role: 'Reporting opérationnel, taux de décroché & rentabilité',
      result: 'Tableau de bord hebdomadaire automatique',
      capabilities: ['Analyse des motifs d’appels fréquents', 'Calcul du délai moyen de rappel (SLA)', 'Recommandations d’optimisation des horaires'],
      limits: 'Données anonymisées et agrégées uniquement',
      packageRequired: 'Pro & Agence',
      icon: BarChart3,
    },
  ];

  const filteredAgents = filter === 'all' 
    ? agents 
    : agents.filter(a => a.category === filter);

  return (
    <section id="agents" className="py-24 bg-gray-50 dark:bg-[#0F1419] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Catalogue Spécialisé
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Construisez votre équipe d’agents IA
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Chaque agent résout un problème précis dans votre cycle commercial ou opérationnel. Choisissez les profils adaptés à votre activité.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'Tous les Agents (10)' },
              { id: 'attract', label: 'Attract (Attirer)' },
              { id: 'convert', label: 'Convert (Convertir)' },
              { id: 'engage', label: 'Engage (Fidéliser)' },
              { id: 'measure', label: 'Measure (Mesurer)' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter === btn.id
                    ? 'bg-primary text-navy shadow-md font-bold'
                    : 'bg-white dark:bg-navy-light text-navy/70 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-light/60 border border-gray-200/80 dark:border-navy-light/60'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className={`relative rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between ${
                  agent.highlight
                    ? 'bg-white dark:bg-[#161F2B] border-2 border-primary shadow-xl shadow-primary/10'
                    : 'bg-white dark:bg-[#161F2B] border border-gray-200/80 dark:border-navy-light/60 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-navy-light'
                }`}
              >
                {agent.highlight && (
                  <div className="absolute -top-3 right-6 bg-primary text-navy text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Agent Phare
                  </div>
                )}

                <div>
                  {/* Top: Icon + Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 dark:bg-primary/20 flex items-center justify-center text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy dark:text-white">
                        {agent.name}
                      </h3>
                      <span className="text-xs font-medium text-primary">
                        Plan requis : {agent.packageRequired}
                      </span>
                    </div>
                  </div>

                  {/* Role description */}
                  <p className="text-sm font-medium text-navy/80 dark:text-gray-200 mb-3">
                    {agent.role}
                  </p>

                  {/* Result pill */}
                  <div className="mb-5 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    🎯 Résultat : {agent.result}
                  </div>

                  {/* Capabilities */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-bold text-navy/60 dark:text-gray-400 uppercase tracking-wider">
                      Capacités clés :
                    </div>
                    {agent.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-navy/70 dark:text-gray-300">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  <div className="pt-3 border-t border-gray-100 dark:border-navy-light/40 text-[11px] text-gray-500 dark:text-gray-400">
                    <strong className="text-navy/70 dark:text-gray-300">Règle de sécurité :</strong> {agent.limits}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-navy-light/40">
                  <button
                    type="button"
                    onClick={() => openCallbackModal({ agent: agent.name })}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-50 dark:bg-navy-dark hover:bg-primary hover:text-navy text-navy dark:text-white border border-gray-200 dark:border-navy-light transition-all flex items-center justify-center gap-1.5 group"
                  >
                    <span>Tester cet agent dans ma démo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
