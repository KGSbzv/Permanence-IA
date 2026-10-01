import React from 'react';
import { Target, Database, Activity, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function AgentDefinition() {
  const pillars = [
    {
      icon: Target,
      title: 'Un Rôle Précis & Métier',
      desc: 'Chaque agent est configuré pour une mission unique : qualification commerciale, support technique, gestion d’agenda ou relance proactive.',
    },
    {
      icon: Database,
      title: 'Données Métier Autorisées',
      desc: 'L’agent s’appuie exclusivement sur votre base de connaissances, vos tarifs et vos règles d’escalade. Aucune hallucination, aucune réponse hors cadre.',
    },
    {
      icon: Activity,
      title: 'Actions Concrètes & Automatisées',
      desc: 'Il ne se contente pas de discuter : il enregistre le lead dans votre CRM, synchronise votre agenda, déclenche des rappels et ouvre des tickets.',
    },
    {
      icon: ShieldCheck,
      title: 'Contrôle & Escalade Humaine',
      desc: 'Vous gardez la main complète. En cas d’urgence, d’anomalie ou de demande spécifique, l’agent transfère immédiatement le dossier à vos équipes.',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#121A24] border-y border-gray-100 dark:border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Comprendre la technologie
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Qu’est-ce qu’un Agent IA Permanence IA ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Ce n’est pas un simple chatbot, ni un répondeur vocal basique. C’est un collaborateur virtuel autonome, sécurisé et entraîné sur vos processus métier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, index) => {
            const Icon = p.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200/80 dark:border-navy-light/60 hover:border-primary/50 transition-all hover:shadow-lg group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/15 dark:bg-primary/20 text-[#0F3A48] dark:text-accent-glow flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-navy-light/40 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Check className="w-3.5 h-3.5" />
                  <span>Garanti sans dérive</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
