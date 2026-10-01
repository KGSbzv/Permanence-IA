import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function PackagesCompare() {
  const { openCallbackModal } = useCallbackModal();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      badge: 'Découverte',
      priceMonthly: '0 €',
      priceAnnual: '0 €',
      period: 'Sans engagement',
      desc: 'Idéal pour tester l’interface, auditer vos besoins et découvrir les agents sans CB.',
      features: [
        'Accès portail app.permanenceia.com',
        'Audit guidé de votre standard',
        'Aperçu interactif des 10 agents IA',
        'Formulaire de rappel en mode sandbox',
        'Zéro carte bancaire requise',
      ],
      limits: 'Aucun appel réel exécuté sans capacité souscrite',
      cta: 'Créer un compte 0 €',
      link: '/essai-gratuit',
      highlight: false,
    },
    {
      id: 'essentiel',
      name: 'Essentiel',
      badge: 'Capture',
      priceMonthly: '49 €',
      priceAnnual: '39 €',
      period: '/mois HT',
      desc: 'Pour indépendants et TPE voulant capturer 100% des demandes entrantes.',
      features: [
        'Agent Capture (Web & formulaires)',
        'Formulaire callback intelligent',
        'Mini-CRM & gestion des leads',
        'Notifications email immédiates',
        '1 verticale métier configurée',
        'Support standard sous 24h',
      ],
      limits: 'Pas d’agent vocal téléphonique sortant',
      cta: 'Choisir Essentiel',
      link: '/essai-gratuit',
      highlight: false,
    },
    {
      id: 'croissance',
      name: 'Croissance',
      badge: 'Conversion Phare',
      priceMonthly: '149 €',
      priceAnnual: '119 €',
      period: '/mois HT',
      desc: 'Pour les entreprises en recherche active de nouveaux clients sans manquer d’appels.',
      features: [
        'Tout le plan Essentiel inclus',
        'Réceptionniste IA Vocale 24/7',
        'Agent Commercial & qualification',
        'Rappels planifiés exécutés à l’heure',
        'Synchronisation Calendrier & Agenda',
        'Séquences de relance autorisées',
      ],
      limits: 'Jusqu’à 250 minutes vocales / mois',
      cta: 'Essai gratuit 7 jours',
      link: '/essai-gratuit',
      highlight: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Engagement',
      priceMonthly: '299 €',
      priceAnnual: '239 €',
      period: '/mois HT',
      desc: 'Pour cabinets, cliniques et PME exigeant support réactif et multi-collaborateurs.',
      features: [
        'Tout le plan Croissance inclus',
        'Agent Support & gestion des tickets',
        'Base de connaissances entreprise',
        'Agent Réputation (avis Google)',
        'Gestion multi-rôles & collaborateurs',
        'Règles d’escalade avancées',
      ],
      limits: 'Jusqu’à 600 minutes vocales / mois',
      cta: 'Choisir Pro',
      link: '/essai-gratuit',
      highlight: false,
    },
    {
      id: 'agence',
      name: 'Agence White-label',
      badge: 'Partenaires',
      priceMonthly: 'Sur devis',
      priceAnnual: 'Sur devis',
      period: '',
      desc: 'Pour revendeurs, agences web et réseaux voulant commercialiser sous leur marque.',
      features: [
        'Tout le plan Pro inclus',
        'Multi-comptes clients illimités',
        'Branding 100% white-label (votre logo/domaine)',
        'Facturation et marges personnalisées',
        'Support prioritaire dédié 7j/7',
      ],
      limits: 'Validation technique préalable requise',
      cta: 'Contacter l’équipe Partenaires',
      isCallback: true,
      highlight: false,
    },
    {
      id: 'custom',
      name: 'Sur mesure',
      badge: 'Workforce',
      priceMonthly: 'Sur devis',
      priceAnnual: 'Sur devis',
      period: '',
      desc: 'Pour grands réseaux, franchises et structures avec intégrations complexes.',
      features: [
        'Agents IA personnalisés sur vos API',
        'Règles de routage multi-sites',
        'Accompagnement ingénieur IA dédié',
        'SLA 99.9% contractuel',
      ],
      limits: 'Étude de cadrage sur mesure',
      cta: 'Demander un devis sur mesure',
      isCallback: true,
      highlight: false,
    },
  ];

  return (
    <section id="tarifs" className="py-24 bg-white dark:bg-[#121A24] border-t border-gray-100 dark:border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Grille Tarifaire Révisée
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Des packages clairs, transparents et sans surprise
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Commencez sans frais sur notre plan Découverte, puis activez les agents vocaux au rythme de votre croissance.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-gray-100 dark:bg-navy-dark rounded-2xl border border-gray-200 dark:border-navy-light/60">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-[#161F2B] text-navy dark:text-white shadow-sm'
                  : 'text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white'
              }`}
            >
              Facturation mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-primary text-navy shadow-sm font-extrabold'
                  : 'text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white'
              }`}
            >
              <span>Facturation annuelle</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500 text-white font-mono">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isHighlighted = p.highlight;
            const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all ${
                  isHighlighted
                    ? 'bg-white dark:bg-[#161F2B] border-2 border-primary shadow-2xl shadow-primary/15'
                    : 'bg-gray-50/70 dark:bg-[#161F2B]/70 border border-gray-200/80 dark:border-navy-light/60 shadow-sm hover:shadow-md'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-navy text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow">
                    Le Plus Populaire
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-navy dark:text-white">
                      {p.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary">
                      {p.badge}
                    </span>
                  </div>

                  <p className="text-xs text-navy/60 dark:text-gray-400 min-h-[32px] mb-5">
                    {p.desc}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-gray-100 dark:border-navy-light/40">
                    <span className="text-4xl font-extrabold text-navy dark:text-white">
                      {price}
                    </span>
                    <span className="text-xs text-navy/60 dark:text-gray-400 font-medium">
                      {p.period}
                    </span>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-navy/60 dark:text-gray-400">
                      Entitlements inclus :
                    </div>
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-navy/80 dark:text-gray-300">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Transparent Limits */}
                  <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-navy-dark text-[11px] text-gray-500 dark:text-gray-400 mb-6">
                    <strong>Limite :</strong> {p.limits}
                  </div>
                </div>

                {/* Card CTA */}
                <div>
                  {p.isCallback ? (
                    <button
                      type="button"
                      onClick={() => openCallbackModal({ plan: p.name })}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-white dark:bg-navy-light hover:bg-gray-100 text-navy dark:text-white border border-gray-300 dark:border-navy-light transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={p.link || '/essai-gratuit'}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isHighlighted
                          ? 'bg-primary hover:bg-[#3dbbb2] text-navy shadow-md'
                          : 'bg-navy dark:bg-white text-white dark:text-navy hover:opacity-90'
                      }`}
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / billing notice */}
        <div className="mt-12 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>
            Paiement sécurisé par Stripe • Sans frais cachés • Changement ou résiliation de formule en 1 clic
          </span>
        </div>

      </div>
    </section>
  );
}
