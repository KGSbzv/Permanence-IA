import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Laurent B.',
      role: 'Artisan Plombier Chauffagiste',
      company: 'Lyon Dépannage Express',
      imageBg: 'from-blue-600 to-cyan-500',
      initials: 'LB',
      quote:
        'Quand je suis sous un évier ou sur un toit, je ne peux pas décrocher. Permanence IA prend les appels d’urgence, note l’adresse et cale l’intervention. En un mois, j’ai sauvé 4 800 € de chantiers qui partaient chez le confrère d’à côté.',
      metric: '+4 800 €',
      metricLabel: 'de CA sauvé dès le 1er mois',
    },
    {
      name: 'Dr Claire V.',
      role: 'Chirurgien-Dentiste',
      company: 'Cabinet Dentaire Saint-Félix (Nantes)',
      imageBg: 'from-teal-600 to-emerald-500',
      initials: 'CV',
      quote:
        'Mon assistante passait ses journées à répondre au téléphone au lieu d’aider au fauteuil. L’IA gère les urgences, filtre les démarcheurs et cale les créneaux directement sur notre planning. Le taux de no-show a chuté de 35%.',
      metric: '-35%',
      metricLabel: 'de rendez-vous non honorés',
    },
    {
      name: 'Marc D.',
      role: 'Directeur d’Agence',
      company: 'Cabinet Immobilier Nova (Bordeaux)',
      imageBg: 'from-amber-600 to-orange-500',
      initials: 'MD',
      quote:
        'Un acheteur qui appelle à 20h veut une réponse immédiate. L’agent vocal qualifie son budget, ses critères et lui propose un créneau de visite le lendemain. On a doublé notre réactivité commerciale sans embaucher.',
      metric: 'x2',
      metricLabel: 'visites qualifiées / semaine',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#111722] border-t border-gray-200 dark:border-navy-light/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
            Retour d&apos;expérience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white mt-3">
            Ils ne perdent plus un seul client au téléphone
          </h2>
          <p className="text-navy/70 dark:text-gray-400 mt-2 text-base">
            Découvrez comment des professionnels de terrain augmentent leur chiffre d&apos;affaires grâce à la réception IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 shadow-sm hover:shadow-brand transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-primary/30 mb-2" />

                <p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed italic">
                  &laquo; {item.quote} &raquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-navy-light/60">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-tr ${item.imageBg} text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-navy dark:text-white">{item.name}</div>
                    <div className="text-xs text-navy/60 dark:text-gray-400">{item.role}</div>
                    <div className="text-[11px] font-semibold text-primary dark:text-accent-glow">{item.company}</div>
                  </div>
                </div>

                {/* Key Metric Pill */}
                <div className="mt-4 p-2.5 rounded-xl bg-gray-50 dark:bg-navy-light/40 border border-gray-100 dark:border-navy-light/60 flex items-center justify-between">
                  <span className="text-xs text-navy/60 dark:text-gray-400">{item.metricLabel}</span>
                  <span className="text-base font-extrabold text-primary dark:text-accent-glow">{item.metric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
