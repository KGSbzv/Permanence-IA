import React from 'react';
import { Check, X, Minus, Sparkles } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function ComparisonTable() {
  const { openCallbackModal } = useCallbackModal();

  const criteria = [
    {
      label: 'Disponibilité 24h/24 & 7j/7 sans interruption',
      permanence: true,
      chatbots: 'Partiel (texte seul)',
      freelance: false,
      internal: false,
    },
    {
      label: 'Prise d’appels vocaux naturels en français',
      permanence: true,
      chatbots: false,
      freelance: true,
      internal: true,
    },
    {
      label: 'Modèle « Zéro Numéro Public » (Rappels planifiés)',
      permanence: true,
      chatbots: false,
      freelance: false,
      internal: false,
    },
    {
      label: 'Actions CRM immédiates (Lead, opportunité, ticket)',
      permanence: true,
      chatbots: 'Selon config.',
      freelance: 'Manuel / Partiel',
      internal: 'Variable',
    },
    {
      label: 'Synchronisation d’agenda en direct (Doctolib, Cal)',
      permanence: true,
      chatbots: 'Partiel',
      freelance: true,
      internal: true,
    },
    {
      label: 'Absence d’attente ou de répondeur saturé',
      permanence: true,
      chatbots: true,
      freelance: false,
      internal: false,
    },
    {
      label: 'Coût mensuel prévisible sans heures supplémentaires',
      permanence: true,
      chatbots: true,
      freelance: false,
      internal: false,
    },
    {
      label: 'Mise en service en moins de 15 minutes',
      permanence: true,
      chatbots: 'Selon config.',
      freelance: 'Plusieurs jours',
      internal: 'Recrutement 2-3 mois',
    },
    {
      label: 'Option Marque Blanche / White-Label complète',
      permanence: true,
      chatbots: false,
      freelance: false,
      internal: false,
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0F1419] border-t border-gray-100 dark:border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Analyse Comparative
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Pourquoi choisir l’équipe d’Agents IA Permanence IA ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Comparez objectivement notre solution avec des chatbots isolés, un télésecrétariat externe ou le recrutement d’une équipe dédiée.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto shadow-xl rounded-3xl border border-gray-200/80 dark:border-navy-light/60 bg-white dark:bg-[#161F2B]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-light/60 bg-gray-50/80 dark:bg-navy-dark/60">
                <th className="p-5 text-sm font-bold text-navy dark:text-white w-1/3">
                  Critères de performance
                </th>
                <th className="p-5 text-sm font-extrabold text-primary bg-primary/10 text-center w-1/6 border-x border-primary/20">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Permanence IA</span>
                  </div>
                </th>
                <th className="p-5 text-xs font-semibold text-navy/70 dark:text-gray-300 text-center w-1/6">
                  Chatbots isolés
                </th>
                <th className="p-5 text-xs font-semibold text-navy/70 dark:text-gray-300 text-center w-1/6">
                  Télésecrétariat classique
                </th>
                <th className="p-5 text-xs font-semibold text-navy/70 dark:text-gray-300 text-center w-1/6">
                  Standard interne salarié
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-navy-light/30 text-xs">
              {criteria.map((c, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 dark:hover:bg-navy-dark/30 transition-colors"
                >
                  <td className="p-4 font-medium text-navy/90 dark:text-gray-200">
                    {c.label}
                  </td>
                  
                  {/* Permanence IA */}
                  <td className="p-4 text-center bg-primary/5 dark:bg-primary/10 border-x border-primary/20">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-bold">
                      <Check className="w-4 h-4" />
                    </span>
                  </td>

                  {/* Chatbots */}
                  <td className="p-4 text-center text-navy/60 dark:text-gray-400">
                    {typeof c.chatbots === 'boolean' ? (
                      c.chatbots ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400 mx-auto" />
                      )
                    ) : (
                      <span>{c.chatbots}</span>
                    )}
                  </td>

                  {/* Freelance / Télésecrétariat */}
                  <td className="p-4 text-center text-navy/60 dark:text-gray-400">
                    {typeof c.freelance === 'boolean' ? (
                      c.freelance ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400 mx-auto" />
                      )
                    ) : (
                      <span>{c.freelance}</span>
                    )}
                  </td>

                  {/* Internal staff */}
                  <td className="p-4 text-center text-navy/60 dark:text-gray-400">
                    {typeof c.internal === 'boolean' ? (
                      c.internal ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400 mx-auto" />
                      )
                    ) : (
                      <span>{c.internal}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => openCallbackModal({ type: 'commercial' })}
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
          >
            <span>Une question sur la comparaison ou un cas particulier ? Demander un rappel explicatif &rarr;</span>
          </button>
        </div>

      </div>
    </section>
  );
}
