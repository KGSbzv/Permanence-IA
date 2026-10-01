import React, { useState } from 'react';
import Link from 'next/link';
import { Wrench, Stethoscope, Home, Car, Utensils, Scissors, Building, ArrowRight, Check } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

interface SectorData {
  id: string;
  name: string;
  link: string;
  icon: any;
  leadProblem: string;
  aiSolution: string;
  metrics: string;
  sampleQuestions: string[];
}

export default function SectorsPreview() {
  const { openCallbackModal } = useCallbackModal();
  const [activeSector, setActiveSector] = useState<string>('plombiers');

  const sectors: SectorData[] = [
    {
      id: 'plombiers',
      name: 'Plombiers & Artisans',
      link: '/plombiers',
      icon: Wrench,
      leadProblem: 'Appels urgents manqués pendant les interventions sur chantier.',
      aiSolution: 'La Réceptionniste IA décroche en 3s, qualifie l’urgence (dégât des eaux, fuite), demande l’adresse et planifie le rappel du technicien.',
      metrics: '+45% d’interventions urgentes signées, zéro répondeur plein.',
      sampleQuestions: ['Où se situe la fuite ?', 'Avez-vous coupé l’arrivée générale ?', 'Êtes-vous disponible dans l’heure ?'],
    },
    {
      id: 'dentaire',
      name: 'Cabinets Dentaires',
      link: '/dentaire',
      icon: Stethoscope,
      leadProblem: 'Secrétariat débordé, no-shows fréquents et interruptions au fauteuil.',
      aiSolution: 'Prise de rendez-vous fluide, confirmation automatique et tri rigoureux entre urgence dentaire et consultation de contrôle.',
      metrics: '-65% de rendez-vous manqués et sérénité totale au fauteuil.',
      sampleQuestions: ['S’agit-il d’une douleur aiguë ou d’un contrôle ?', 'Avez-vous déjà un dossier chez le Dr Martin ?'],
    },
    {
      id: 'immobilier',
      name: 'Agences Immobilières',
      link: '/immobilier',
      icon: Home,
      leadProblem: 'Afflux d’appels pour des biens déjà sous offre ou acquéreurs non finançables.',
      aiSolution: 'Qualification immédiate du budget, statut d’emprunt et planification synchronisée des créneaux de visite groupée ou individuelle.',
      metrics: 'Gain de 15h de prospection/semaine pour chaque négociateur.',
      sampleQuestions: ['Quel est votre budget global ?', 'Avez-vous validé votre simulation bancaire ?'],
    },
    {
      id: 'auto',
      name: 'Garages & Automobile',
      link: '/#secteurs',
      icon: Car,
      leadProblem: 'Chef d’atelier constamment interrompu par les demandes d’avancement et devis.',
      aiSolution: 'L’agent renseigne sur l’état du véhicule, enregistre les demandes de rendez-vous révision et transmet les devis approuvés.',
      metrics: '+25% de révisions planifiées et accueil atelier 100% disponible.',
      sampleQuestions: ['Quelle est l’immatriculation du véhicule ?', 'Quel type d’intervention souhaitez-vous réaliser ?'],
    },
    {
      id: 'cliniques',
      name: 'Cliniques & Santé',
      link: '/cliniques',
      icon: Building,
      leadProblem: 'Pics d’appels le matin, files d’attente téléphoniques et besoin d’escalade humaine.',
      aiSolution: 'Orientation des patients, renseignements sur les horaires et les accès, transfert sécurisé en cas d’urgence vitale vers le SAMU.',
      metrics: 'Zéro temps d’attente au standard et conformité données de santé.',
      sampleQuestions: ['Pour quel praticien ou spécialité appelez-vous ?', 'Avez-vous une ordonnance récente ?'],
    },
    {
      id: 'restauration',
      name: 'Restauration & Hôtels',
      link: '/#secteurs',
      icon: Utensils,
      leadProblem: 'Coups de feu pendant le service : appels pour réservation non décrochés.',
      aiSolution: 'Gestion des réservations de tables et chambres 24/7 avec notification directe au logiciel de salle.',
      metrics: '+30 réservations de tables sauvées par semaine.',
      sampleQuestions: ['Pour combien de personnes et quelle heure ?', 'Avez-vous des restrictions alimentaires à signaler ?'],
    },
    {
      id: 'beaute',
      name: 'Salons & Beauté',
      link: '/#secteurs',
      icon: Scissors,
      leadProblem: 'Impossibilité de répondre en pleine prestation de soin ou de coiffure.',
      aiSolution: 'Prise de rendez-vous selon les disponibilités de chaque coiffeur/esthéticienne et envoi de SMS de confirmation.',
      metrics: 'Agenda plein et interruption zéro pendant les soins.',
      sampleQuestions: ['Quelle prestation désirez-vous réserver ?', 'Avez-vous une préférence de collaborateur ?'],
    },
  ];

  const current = sectors.find(s => s.id === activeSector) || sectors[0];
  const CurrentIcon = current.icon;

  return (
    <section id="secteurs" className="py-24 bg-gray-50 dark:bg-[#0F1419] border-t border-gray-100 dark:border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Expertise Verticale
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0F3A48] dark:text-white">
            Des Agents IA pré-entraînés pour votre métier
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy/70 dark:text-gray-300">
            Chaque métier a son propre vocabulaire, ses urgences et ses critères de qualification. Nos agents sont prêts à l’emploi dès le premier jour.
          </p>
        </div>

        {/* Sectors Grid / Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {sectors.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSector === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSector(sec.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary text-navy shadow-md scale-105'
                    : 'bg-white dark:bg-[#161F2B] text-navy/70 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-light/50 border border-gray-200/80 dark:border-navy-light/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sec.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sector Card */}
        <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#161F2B] border border-gray-200/80 dark:border-navy-light/60 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-navy-light/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-navy dark:text-white">
                  Configuration Spécialisée : {current.name}
                </h3>
                <span className="text-xs text-primary font-semibold">
                  Gain mesuré : {current.metrics}
                </span>
              </div>
            </div>

            {current.link.startsWith('/') && !current.link.includes('#') ? (
              <Link
                href={current.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span>Découvrir la page dédiée</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : null}
          </div>

          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-500 font-bold mb-1">
                  Le défi métier :
                </h4>
                <p className="text-sm text-navy/80 dark:text-gray-300">
                  {current.leadProblem}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-bold mb-1">
                  La réponse de l’Agent IA :
                </h4>
                <p className="text-sm text-navy/80 dark:text-gray-300">
                  {current.aiSolution}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#121A24] border border-gray-100 dark:border-navy-light/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy/70 dark:text-gray-400 mb-3">
                Exemples de questions posées par l’agent :
              </h4>
              <div className="space-y-2">
                {current.sampleQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-navy dark:text-gray-200">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>« {q} »</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-navy-light/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-navy/60 dark:text-gray-400">
              Prêt pour votre standard en moins de 15 minutes.
            </span>
            <button
              type="button"
              onClick={() => openCallbackModal({ sector: current.id })}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Tester la configuration {current.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
