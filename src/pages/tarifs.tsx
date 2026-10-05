import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Tag, Plus, CheckCircle2, PhoneCall, Bot } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function Tarifs() {
  const { openCallbackModal } = useCallbackModal();
  const [isAnnual, setIsAnnual] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const discountRate = isAnnual ? 0.8 : 1; // 20% discount for annual

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      badge: 'Découverte',
      basePriceMonthly: 0,
      period: 'Sans engagement',
      tagline: 'Pour tester le portail, auditer vos besoins et découvrir les agents sans CB.',
      highlight: false,
      isFree: true,
      agents: 'Aperçu 10 agents IA',
      minutes: 'Mode Sandbox',
      features: [
        'Accès portail client app.permanenceia.com',
        'Audit guidé de votre standard téléphonique',
        'Catalogue complet des 10 agents IA',
        'Formulaire callback en simulation sandbox',
        'Zéro moyen de paiement requis',
      ],
      limits: 'Aucun appel réel sortant sans capacité souscrite',
      cta: 'Créer un compte 0 €',
      link: '/essai-gratuit',
    },
    {
      id: 'essentiel',
      name: 'Essentiel',
      badge: 'Capture',
      basePriceMonthly: 49,
      period: '/mois HT',
      tagline: 'Pour indépendants et TPE voulant capter 100% des demandes web.',
      highlight: false,
      agents: 'Agent Capture + Notification',
      minutes: 'Leads illimités',
      features: [
        'Agent Capture (Web & formulaires)',
        'Formulaire de rappel intelligent sans numéro public',
        'CRM léger avec fiches prospects détaillées',
        'Notifications email immédiates à l’équipe',
        '1 verticale métier configurée',
        'Support standard sous 24h ouvrées',
      ],
      limits: 'Pas d’agent vocal téléphonique sortant',
      cta: 'Choisir Essentiel',
      link: '/essai-gratuit?plan=essentiel',
    },
    {
      id: 'croissance',
      name: 'Croissance',
      badge: 'Conversion • Le Plus Choisi',
      basePriceMonthly: 149,
      period: '/mois HT',
      tagline: 'Pour les entreprises actives voulant transformer chaque prospect en client.',
      highlight: true,
      agents: 'Réceptionniste IA + Commercial',
      minutes: '250 minutes vocales',
      features: [
        'Tout le plan Essentiel inclus',
        'Réceptionniste IA vocale 24h/24 & 7j/7',
        'Agent Commercial : rappels aux créneaux demandés',
        'Synchronisation agenda (Google, Doctolib, Outlook)',
        'Qualification immédiate et détection des urgences',
        'Séquences de relance autorisées',
      ],
      limits: 'Au-delà de 250 min : 0,25 € HT/min',
      cta: 'Essai gratuit 7 jours',
      link: '/essai-gratuit?plan=croissance',
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Engagement & Équipe',
      basePriceMonthly: 299,
      period: '/mois HT',
      tagline: 'Pour cabinets, cliniques et PME exigeant support réactif et multi-collaborateurs.',
      highlight: false,
      agents: 'Support + Réputation + Multi-rôles',
      minutes: '600 minutes vocales',
      features: [
        'Tout le plan Croissance inclus',
        'Agent Support & gestion des tickets d’assistance',
        'Base de connaissances entreprise entraînée',
        'Agent Réputation (collecte d’avis 5 étoiles)',
        'Gestion multi-rôles (admin, opérateur, lecture)',
        'Règles d’escalade humaine sur mesure',
      ],
      limits: 'Au-delà de 600 min : 0,22 € HT/min',
      cta: 'Choisir Pro',
      link: '/essai-gratuit?plan=pro',
    },
    {
      id: 'agence',
      name: 'Agence White-label',
      badge: 'Partenaires & Revendeurs',
      basePriceMonthly: 599,
      period: '/mois HT',
      tagline: 'Pour revendeurs, agences web et réseaux commercialisant sous leur marque.',
      highlight: false,
      agents: 'Multi-comptes White-Label',
      minutes: 'Volume mutualisé',
      features: [
        'Tout le plan Pro inclus',
        'Comptes clients illimités avec sous-domaines dédiés',
        'Branding 100% white-label (votre logo, vos couleurs)',
        'Facturation et marge libres auprès de vos clients',
        'Support prioritaire dédié 7j/7',
      ],
      limits: 'Validation technique d’activation requise',
      cta: 'Contacter l’équipe Partenaires',
      isCallback: true,
    },
    {
      id: 'workforce',
      name: 'Sur mesure — Workforce',
      badge: 'Grand Réseau',
      basePriceMonthly: 990,
      period: 'Sur devis',
      tagline: 'Pour franchises et grands comptes avec intégrations API complexes.',
      highlight: false,
      agents: 'Agents customisés',
      minutes: 'Sur mesure illimité',
      features: [
        'Agents IA personnalisés connectés à vos API métiers',
        'Routage multi-sites et multi-agences intelligent',
        'Ingénieur IA dédié et SLA garanti 99.9%',
        'Hébergement dédié et conformité stricte',
      ],
      limits: 'Étude de cadrage sur mesure',
      cta: 'Demander un devis sur mesure',
      isCallback: true,
    },
  ];

  const addOns = [
    {
      title: 'Agent Réputation (Avis Google)',
      price: '+49 € / mois',
      eligibility: 'Pack Croissance & Pro',
      desc: 'Préparation et sollicitation d’avis positifs auprès des clients après interaction réussie.',
    },
    {
      title: 'Agent Relance (Devis dormants)',
      price: '+79 € / mois',
      eligibility: 'Pack Croissance & Pro',
      desc: 'Rappels téléphoniques courtois programmés à J+3 et J+7 pour les devis en attente.',
    },
    {
      title: 'Langue supplémentaire (Anglais, Espagnol, Italien)',
      price: '+59 € / mois',
      eligibility: 'Tous les packages vocaux',
      desc: 'Bascule automatique de langue dès les premiers mots de l’interlocuteur.',
    },
    {
      title: 'Support dédié & SLA d’intervention 1h',
      price: '+99 € / mois',
      eligibility: 'Tous les packages',
      desc: 'Ligne directe ingénieur voix, audit mensuel des flux et optimisation des scripts d’accueil.',
    },
  ];

  const faqs = [
    {
      q: 'Qu’est-ce qui est inclus dans le forfait Gratuit 0 € ?',
      a: 'Le plan Gratuit vous donne un accès sans carte bancaire au portail app.permanenceia.com, à la configuration de vos agents IA, à l’audit guidé de votre standard et au mode bac à sable pour simuler le parcours callback sans frais.',
    },
    {
      q: 'Puis-je changer ou résilier mon package à tout moment ?',
      a: 'Absolument. Vous pouvez upgrader, downgrader ou suspendre votre abonnement en 1 clic depuis votre espace client, sans préavis ni pénalités.',
    },
    {
      q: 'Pourquoi n’affichez-vous aucun numéro public ?',
      a: 'Pour protéger nos clients et nos partenaires contre le spam téléphonique, et pour garantir que chaque appel est un rappel qualifié, planifié et consenti.',
    },
    {
      q: 'Que se passe-t-il si je dépasse mon quota de minutes vocales ?',
      a: 'Votre service n’est jamais interrompu. Les minutes excédentaires sont facturées au tarif clair indiqué (0,22€ à 0,25€ HT/min), ou vous pouvez basculer sur le forfait supérieur en un clic.',
    },
    {
      q: 'Proposez-vous un accompagnement à la configuration ?',
      a: 'Oui. Dès votre inscription, un onboarding interactif en 5 étapes vous guide, et notre équipe technique est disponible pour tester vos prompts et synchroniser vos agendas.',
    },
  ];

  return (
    <Layout
      title="Packages & Tarifs Révisés | Permanence IA"
      description="Découvrez nos 6 packages d'agents IA spécialisés : Gratuit (0€), Essentiel (49€), Croissance (149€), Pro (299€), Agence et Sur mesure. Zéro numéro public, zéro engagement."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Grille Tarifaire Révisée & Entitlements
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy dark:text-white tracking-tight">
              Des forfaits adaptés à chaque étape de votre croissance
            </h1>
            <p className="text-lg text-navy/70 dark:text-gray-300">
              Démarrez gratuitement sans carte bancaire, puis activez les agents vocaux selon vos besoins réels.
            </p>

            {/* Billing Toggle */}
            <div className="pt-6 flex items-center justify-center gap-3">
              <span className={`text-sm font-semibold ${!isAnnual ? 'text-navy dark:text-white' : 'text-navy/60 dark:text-gray-400'}`}>
                Facturation mensuelle
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isAnnual ? 'bg-primary' : 'bg-gray-300 dark:bg-navy-light'
                }`}
                aria-label="Basculer vers la facturation annuelle"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isAnnual ? 'text-navy dark:text-white' : 'text-navy/60 dark:text-gray-400'}`}>
                  Facturation annuelle
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  -20% d&apos;économie
                </span>
              </div>
            </div>
          </div>

          {/* 6 Pricing Cards Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((p) => {
              const displayPrice = p.basePriceMonthly === 0 
                ? '0 €' 
                : typeof p.basePriceMonthly === 'number' 
                  ? `${Math.round(p.basePriceMonthly * discountRate)} €` 
                  : p.basePriceMonthly;

              return (
                <div
                  key={p.id}
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                    p.highlight
                      ? 'bg-gradient-to-b from-[#1A2332] to-[#111722] text-white shadow-2xl border-2 border-primary ring-4 ring-primary/10 lg:-translate-y-2'
                      : 'bg-white dark:bg-[#161F2B] text-navy dark:text-white border border-gray-200 dark:border-navy-light/60 shadow-brand'
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`px-4 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 ${
                        p.highlight ? 'bg-primary text-navy' : 'bg-gray-100 dark:bg-navy-dark text-navy dark:text-white border border-gray-300 dark:border-navy-light'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{p.badge}</span>
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                    <p className={`text-xs mt-2 min-h-[36px] ${p.highlight ? 'text-gray-300' : 'text-navy/70 dark:text-gray-400'}`}>
                      {p.tagline}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight">{displayPrice}</span>
                      <span className={`text-xs ${p.highlight ? 'text-gray-300' : 'text-navy/60 dark:text-gray-400'}`}>
                        {p.period}
                      </span>
                    </div>
                    {isAnnual && p.basePriceMonthly > 0 && (
                      <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                        Facturé annuellement &bull; -20% appliqué
                      </div>
                    )}

                    <div className={`my-6 border-t ${p.highlight ? 'border-navy-subtle' : 'border-gray-100 dark:border-navy-light/60'}`} />

                    {/* Features list */}
                    <div className="space-y-2.5 text-xs">
                      <div className="font-bold uppercase tracking-wider text-[11px] opacity-70 mb-2">
                        Entitlements inclus :
                      </div>
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className={p.highlight ? 'text-gray-200' : 'text-navy/80 dark:text-gray-300'}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Limits */}
                    <div className={`mt-5 p-2.5 rounded-xl text-[11px] ${
                      p.highlight ? 'bg-navy-dark/80 text-gray-300' : 'bg-gray-100 dark:bg-navy-dark text-gray-500 dark:text-gray-400'
                    }`}>
                      <strong>Limite :</strong> {p.limits}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 dark:border-navy-light/40">
                    {p.isCallback ? (
                      <button
                        type="button"
                        onClick={() => openCallbackModal({ plan: p.name })}
                        className={`w-full py-3.5 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                          p.highlight
                            ? 'bg-primary hover:bg-[#3dbbb2] text-navy'
                            : 'bg-navy dark:bg-white text-white dark:text-navy hover:opacity-90'
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{p.cta}</span>
                      </button>
                    ) : (
                      <Link
                        href={p.link || '/essai-gratuit'}
                        className={`w-full py-3.5 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                          p.highlight
                            ? 'bg-primary hover:bg-[#3dbbb2] text-navy'
                            : 'bg-navy dark:bg-white text-white dark:text-navy hover:opacity-90'
                        }`}
                      >
                        <span>{p.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <div className="text-center mt-2.5 text-[11px] text-gray-400">
                      {p.isFree ? 'Sans carte bancaire • Sans engagement' : 'Activation guidée sous 15 min'}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Add-ons table */}
          <div className="mt-24">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white">
                Modules & Agents optionnels à la carte
              </h2>
              <p className="text-sm text-navy/70 dark:text-gray-400 mt-2">
                Activez des compétences spécifiques selon les besoins de votre standard.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-navy-light/60 overflow-hidden bg-white dark:bg-[#161F2B] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#111722] border-b border-gray-200 dark:border-navy-light/60 text-xs font-bold uppercase tracking-wider text-navy/70 dark:text-gray-300">
                      <th className="py-4 px-6">Module / Option</th>
                      <th className="py-4 px-6">Tarif</th>
                      <th className="py-4 px-6">Éligibilité</th>
                      <th className="py-4 px-6">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-navy-light/40">
                    {addOns.map((add, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-navy-light/20 transition-colors">
                        <td className="py-4 px-6 font-bold text-navy dark:text-white flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{add.title}</span>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-primary dark:text-accent-glow whitespace-nowrap">
                          {add.price}
                        </td>
                        <td className="py-4 px-6 text-xs text-navy/60 dark:text-gray-400 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-navy-light/60">
                            {add.eligibility}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-navy/70 dark:text-gray-300">
                          {add.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing FAQ Accordion */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white">
                Questions fréquentes sur la tarification
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = faqOpen === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : i)}
                      className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-navy dark:text-white hover:text-primary dark:hover:text-accent-glow transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-primary font-mono text-lg flex-shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-navy/70 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-navy-light/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 p-10 rounded-2xl bg-gradient-to-r from-navy to-[#111722] text-white text-center space-y-6 border border-primary/20">
            <h3 className="text-3xl font-extrabold">Toujours pas certain du bon choix ?</h3>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
              Testez gratuitement sur notre plan Découverte (0€ sans CB), ou demandez un rappel personnalisé par un de nos conseillers IA.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/essai-gratuit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow"
              >
                Créer un compte gratuit (0€)
              </Link>
              <button
                type="button"
                onClick={() => openCallbackModal({ type: 'commercial' })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-base border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                <span>Demander un rappel explicatif</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
