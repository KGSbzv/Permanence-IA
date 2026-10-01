import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingPreview() {
  const plans = [
    {
      name: 'Réceptionniste',
      price: '99',
      tagline: 'Idéal pour artisans et indépendants qui ne veulent plus rater de chantiers.',
      highlight: false,
      badge: null,
      features: [
        '300 minutes d’appels par mois',
        '1 Agent vocal IA personnalisé',
        'Prise de coordonnées & motif d’appel',
        'Retranscription écrite par email & SMS',
        'Support réactif par email sous 4h',
      ],
    },
    {
      name: 'Assistant',
      price: '249',
      tagline: 'Le choix n°1 des cabinets médicaux, dentaires et agences immobilières.',
      highlight: true,
      badge: 'Le plus populaire',
      features: [
        '800 minutes d’appels par mois',
        '2 Agents vocaux configurables',
        'Prise de RDV connectée (Google, Doctolib, Calendly)',
        'Qualification poussée & escalade d’urgence',
        'Envoi de SMS de confirmation au patient / client',
        'Filtrage des démarchages indésirables',
      ],
    },
    {
      name: 'Centre d’appels',
      price: '499',
      tagline: 'Pour cliniques, concessions et structures à fort volume d’appels.',
      highlight: false,
      badge: 'Entreprise & Volume',
      features: [
        '2 000 minutes d’appels par mois',
        'Jusqu’à 5 agents vocaux spécialisés',
        'Intégration CRM complète (HubSpot, Salesforce, etc.)',
        'Routage multi-lignes & transferts à chaud vers l’humain',
        'Support téléphonique dédié & Account Manager',
        'Tableaux de bord d’analytics avancés',
      ],
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0F1419] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
            Tarifs clairs &amp; sans surprise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white mt-3">
            Des packages conçus pour rentabiliser chaque sonnerie
          </h2>
          <p className="text-navy/70 dark:text-gray-400 mt-3 text-base">
            Tous les forfaits incluent 7 jours d&apos;essai gratuit. Sans engagement de durée, résiliable en 1 clic.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#1A2332] to-[#111722] text-white shadow-brand-hover border-2 border-primary ring-2 ring-primary/20 lg:-translate-y-2'
                  : 'bg-gray-50 dark:bg-[#161F2B] text-navy dark:text-white border border-gray-200 dark:border-navy-light/60 hover:shadow-brand'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-primary text-navy shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge}</span>
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className={`text-xs mt-2 min-h-[36px] ${plan.highlight ? 'text-gray-300' : 'text-navy/70 dark:text-gray-400'}`}>
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price} €</span>
                  <span className={`text-sm ${plan.highlight ? 'text-gray-300' : 'text-navy/60 dark:text-gray-400'}`}>
                    / mois HT
                  </span>
                </div>

                <div className={`my-6 border-t ${plan.highlight ? 'border-navy-subtle' : 'border-gray-200 dark:border-navy-light/60'}`} />

                <div className="text-xs font-semibold uppercase tracking-wider mb-4 text-primary dark:text-accent-glow">
                  Ce qui est inclus :
                </div>

                <ul className="space-y-3 text-sm">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-primary dark:text-accent-glow" />
                      </div>
                      <span className={plan.highlight ? 'text-gray-200' : 'text-navy/80 dark:text-gray-300'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  href="/essai-gratuit"
                  className={`w-full py-3.5 px-4 rounded-xl text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-primary hover:bg-[#3dbbb2] text-navy shadow-md'
                      : 'bg-navy dark:bg-primary text-white dark:text-navy hover:bg-navy-light dark:hover:bg-[#3dbbb2]'
                  }`}
                >
                  <span>Tester 7 jours gratuitement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center mt-2.5">
                  <Link
                    href="/tarifs"
                    className={`text-xs hover:underline ${plan.highlight ? 'text-gray-400 hover:text-white' : 'text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white'}`}
                  >
                    Comparer tous les détails &rarr;
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Coupon Teaser */}
        <div className="mt-12 text-center text-xs text-navy/70 dark:text-gray-400 flex flex-wrap items-center justify-center gap-3">
          <span>Offre de lancement : utilisez le code</span>
          <span className="font-mono font-bold px-2 py-1 rounded bg-primary/10 border border-primary/30 text-navy dark:text-accent-glow">
            EARLY25
          </span>
          <span>pour bénéficier de 25% de remise sur le premier mois.</span>
        </div>

      </div>
    </section>
  );
}
