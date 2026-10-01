import React from 'react';
import { Users, PhoneIncoming, ThumbsUp, Clock } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '250+',
      label: 'Entreprises & cabinets actifs',
      sub: 'En France et Belgique',
    },
    {
      icon: PhoneIncoming,
      value: '180 000+',
      label: 'Appels traités avec succès',
      sub: 'Zéro interruption technique',
    },
    {
      icon: ThumbsUp,
      value: '94%',
      label: 'Taux de satisfaction des appelants',
      sub: 'Perception humaine et bienveillante',
    },
    {
      icon: Clock,
      value: '42h',
      label: 'Temps économisé par mois',
      sub: 'Concentrez-vous sur vos clients',
    },
  ];

  return (
    <section className="py-16 bg-navy text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 mx-auto flex items-center justify-center text-primary mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white">{stat.label}</div>
                <div className="text-xs text-gray-300">{stat.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
