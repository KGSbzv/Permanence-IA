import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, PhoneCall, ArrowRight, LogIn, HelpCircle } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function FAQCTASection() {
  const { openCallbackModal } = useCallbackModal();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Le plan Découverte est-il réellement 100% gratuit ?',
      a: 'Oui, absolument. L’inscription au plan Découverte ne nécessite aucune carte bancaire et ne comporte aucun engagement ni reconduction automatique. Vous accédez au portail app.permanenceia.com, à la configuration de vos agents et au mode bac à sable.',
    },
    {
      q: 'Pourquoi n’affichez-vous aucun numéro de téléphone public ?',
      a: 'C’est le principe fondateur de Permanence IA : la règle Zéro Numéro Public. Plutôt que de subir des appels non qualifiés, des spams ou d’obliger vos clients à patienter dans une file d’attente, vous leur offrez un rappel précis au créneau de leur choix.',
    },
    {
      q: 'Est-ce une personne humaine ou une intelligence artificielle qui appelle ?',
      a: 'Vos prospects et clients sont appelés par nos Agents IA vocaux, dotés d’un timbre naturel, chaleureux et professionnel. Si l’interlocuteur exprime une urgence critique ou demande expressément un humain, l’agent transfère le dossier vers votre équipe avec un résumé complet.',
    },
    {
      q: 'Que se passe-t-il immédiatement après mon inscription ?',
      a: 'Vous êtes guidé(e) à travers un onboarding en 5 étapes simples : définition de votre objectif prioritaire, choix de votre secteur d’activité, personnalisation des réponses clés, test d’un rappel sur votre propre téléphone et connexion éventuelle de votre calendrier.',
    },
    {
      q: 'Puis-je changer ou résilier mon package à tout moment ?',
      a: 'Oui. Depuis votre espace client, vous pouvez passer d’un plan à un autre (par exemple de Croissance à Pro) ou suspendre votre abonnement en un clic, sans préavis ni pénalités cachées.',
    },
    {
      q: 'Comment sont protégées mes données et celles de mes clients ?',
      a: 'Toutes les données sont hébergées sur des infrastructures sécurisées conformes au RGPD en Union Européenne. Les consentements aux rappels sont tracés et horodatés, et aucun numéro n’est cédé ou utilisé à des fins commerciales extérieures.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50 dark:bg-[#0F1419] border-t border-gray-100 dark:border-navy-light/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FAQ Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Transparence & Réponses
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Questions fréquentes sur nos Agents IA
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Tout ce que vous devez savoir avant de mettre en place votre équipe d’agents vocaux et digitaux.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/80 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-navy dark:text-white hover:text-primary dark:hover:text-accent-glow transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-navy/70 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-navy-light/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final High-Impact CTA Box */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-gray-50 dark:from-[#161F2B] dark:to-[#0F1419] border border-gray-200 dark:border-navy-light/60 text-center shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Passez à la vitesse supérieure</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white">
            Prêt à transformer chaque demande en opportunité ?
          </h3>
          <p className="mt-4 text-sm sm:text-base text-navy/70 dark:text-gray-300 max-w-xl mx-auto">
            Rejoignez les professionnels qui ne manquent plus aucun appel, automatisent leurs rendez-vous et offrent une disponibilité irréprochable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/essai-gratuit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-[#3dbbb2] text-navy shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-navy" />
              <span>Commencer gratuitement (0€)</span>
              <ArrowRight className="w-4 h-4 text-navy" />
            </Link>

            <button
              type="button"
              onClick={() => openCallbackModal({ type: 'commercial' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-navy-light text-navy dark:text-white border border-gray-200 dark:border-navy-light hover:bg-gray-50 transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>Demander un rappel IA immédiat</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-navy/60 dark:text-gray-400">
            <span>✓ Sans carte bancaire</span>
            <span>•</span>
            <span>✓ Sans engagement</span>
            <span>•</span>
            <span>✓ Prêt en 15 min</span>
          </div>
        </div>

      </div>
    </section>
  );
}
