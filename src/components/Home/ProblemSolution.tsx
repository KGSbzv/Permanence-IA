import React from 'react';
import { PhoneMissed, FilterX, CalendarX, PhoneCall, CheckSquare, CalendarCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProblemSolution() {
  const problems = [
    {
      icon: PhoneMissed,
      title: 'Appels perdus = Chiffre d’affaires envolé',
      desc: '67% des clients tombant sur un répondeur raccrochent sans laisser de message et appellent immédiatement votre concurrent direct.',
    },
    {
      icon: FilterX,
      title: 'Leads non qualifiés & Démarchages',
      desc: 'Vous perdez 15h par mois à répondre à des demandes hors zone d’intervention, hors budget ou à des démarcheurs indésirables.',
    },
    {
      icon: CalendarX,
      title: 'Rendez-vous manqués & No-shows',
      desc: 'Agenda désynchronisé, créneaux vides et absences de confirmation qui pénalisent la rentabilité de vos journées.',
    },
  ];

  const solutions = [
    {
      icon: PhoneCall,
      title: 'Reçoit tous les appels en direct 24/7',
      desc: 'Aucune tonalité d’attente. L’IA décroche au bout de 2 sonneries, jour et nuit, week-ends et jours fériés avec une diction irréprochable.',
    },
    {
      icon: CheckSquare,
      title: 'Qualifie automatiquement vos prospects',
      desc: 'Collecte nom, motif précis, urgence, localisation et budget. Elle transmet les fiches prêtes à traiter par SMS, email ou CRM.',
    },
    {
      icon: CalendarCheck,
      title: 'Place les RDV direct dans votre agenda',
      desc: 'Connectée à Google Calendar, Outlook, Doctolib ou Calendly. Elle propose vos créneaux réels et envoie les rappels anti-oubli.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#111722] border-y border-gray-200 dark:border-navy-light/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Problème */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
              Le constat actuel
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white mt-3">
              Ce que vous coûtent vos appels non décrochés
            </h2>
            <p className="text-navy/70 dark:text-gray-400 mt-2 text-base">
              Pendant que vous travaillez, que vous êtes en rendez-vous ou que vous dormez, votre entreprise perd des opportunités.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((prob, i) => {
              const Icon = prob.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-white dark:bg-[#161F2B] border border-red-100 dark:border-red-950/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{prob.title}</h3>
                  <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">{prob.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Solution */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/25">
              La solution Permanence IA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white mt-3">
              Un standard téléphonique infatigable et sur-mesure
            </h2>
            <p className="text-navy/70 dark:text-gray-400 mt-2 text-base">
              Une technologie d&apos;agent vocal conversationnel calquée sur les spécificités de votre métier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((sol, i) => {
              const Icon = sol.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-white dark:bg-[#161F2B] border border-primary/20 dark:border-primary/25 shadow-sm hover:shadow-brand transition-all relative overflow-hidden group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 dark:bg-primary/25 text-navy dark:text-accent-glow flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary dark:text-accent-glow" />
                  </div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{sol.title}</h3>
                  <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed">{sol.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/essai-gratuit"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-accent-glow hover:underline"
            >
              <span>Découvrez comment configurer votre agent vocal en 3 étapes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
