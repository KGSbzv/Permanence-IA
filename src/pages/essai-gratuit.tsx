import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import Layout from '@/components/Layout';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, PhoneCall, Calendar, Lock, ExternalLink, Bot } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';

export default function EssaiGratuit() {
  const router = useRouter();
  const { plan: queryPlan } = router.query;
  const { openCallbackModal } = useCallbackModal();

  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    sector: 'plombiers',
    primaryGoal: 'leads',
    selectedAgent: 'receptionniste',
    selectedPlan: 'gratuit',
    crm: 'google-calendar',
    termsAccepted: false,
    wantTestCall: true,
  });

  useEffect(() => {
    if (queryPlan && typeof queryPlan === 'string') {
      setFormData((prev) => ({ ...prev, selectedPlan: queryPlan }));
    }
  }, [queryPlan]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.phone) {
      setStep(2);
    }
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) return;

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ECDC4', '#A8D5D5', '#1A2332', '#5FE0DB'],
      });
    } catch {
      // safe fallback
    }

    setStep(4);
  };

  return (
    <Layout
      title="Créer votre compte gratuit (0€) | Permanence IA"
      description="Activez votre équipe d'agents IA en moins de 5 minutes. Plan Découverte sans carte bancaire, sans engagement et sans numéro public."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Visuel d'authentification (desktop) */}
          <div className="hidden lg:block sticky top-24 rounded-3xl overflow-hidden border border-gray-200 dark:border-navy-light/60 shadow-brand">
            <img src="/logo/auth-light.jpg" alt="" aria-hidden="true" className="block dark:hidden w-full h-auto" />
            <img src="/logo/auth-dark.jpg" alt="" aria-hidden="true" className="hidden dark:block w-full h-auto" />
          </div>
          <div className="w-full max-w-2xl mx-auto">
          
          {/* Progress Header */}
          <div className="mb-10 text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Onboarding Guidé • Zéro Carte Bancaire • Zéro Numéro Public
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white">
              {step === 4 ? 'Votre espace d’agents IA est prêt !' : 'Activez votre équipe d’agents IA'}
            </h1>
            {step < 4 && (
              <p className="text-xs sm:text-sm text-navy/70 dark:text-gray-400">
                Étape {step} sur 3 &bull; Configuration en moins de 3 minutes
              </p>
            )}

            {/* Stepper bar */}
            {step < 4 && (
              <div className="pt-3 max-w-xs mx-auto">
                <div className="grid grid-cols-3 gap-2">
                  <div className={`h-2 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-navy-light'}`} />
                  <div className={`h-2 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-navy-light'}`} />
                  <div className={`h-2 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-navy-light'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Step 1: Contact info */}
          {step === 1 && (
            <div className="rounded-3xl border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] p-6 sm:p-10 shadow-brand">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">
                1. Vos coordonnées professionnelles
              </h2>

              <form onSubmit={handleNextStep1} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                    Nom de votre entreprise ou cabinet
                  </label>
                  <input
                    type="text"
                    placeholder="Cabinet Dentaire Dupont, Plomberie Express..."
                    value={formData.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                      Email professionnel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@monentreprise.fr"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                      Téléphone pour le rappel de test <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                    Secteur d&apos;activité
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => updateField('sector', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="plombiers">Plomberie, Chauffage &amp; Dépannage</option>
                    <option value="dentaire">Cabinet Dentaire &amp; Médical</option>
                    <option value="immobilier">Agence Immobilière</option>
                    <option value="cliniques">Clinique, Soins &amp; Santé</option>
                    <option value="auto">Garage &amp; Concession Automobile</option>
                    <option value="autre">Autre entreprise de services B2B</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-sm shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continuer vers le choix des agents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Agent preferences */}
          {step === 2 && (
            <div className="rounded-3xl border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] p-6 sm:p-10 shadow-brand">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">
                2. Configuration des agents &amp; Objectifs
              </h2>

              <form onSubmit={handleNextStep2} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-2">
                    Premier agent que vous souhaitez tester :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'receptionniste', name: 'Réceptionniste IA Vocale' },
                      { id: 'capture', name: 'Agent Capture Web' },
                      { id: 'commercial', name: 'Agent Commercial Rappel' },
                    ].map((ag) => (
                      <button
                        type="button"
                        key={ag.id}
                        onClick={() => updateField('selectedAgent', ag.id)}
                        className={`p-3 text-center rounded-xl border transition-colors ${
                          formData.selectedAgent === ag.id
                            ? 'bg-primary text-navy border-primary font-bold'
                            : 'bg-gray-50 dark:bg-[#111722] border-gray-200 dark:border-navy-light/60 text-navy/70 dark:text-gray-300'
                        }`}
                      >
                        {ag.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                    Forfait sélectionné pour l&apos;accès :
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-center">
                    {[
                      { id: 'gratuit', name: 'Gratuit (0€)' },
                      { id: 'essentiel', name: 'Essentiel (49€)' },
                      { id: 'croissance', name: 'Croissance (149€)' },
                      { id: 'pro', name: 'Pro (299€)' },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => updateField('selectedPlan', p.id)}
                        className={`py-3 px-2 rounded-xl border transition-colors ${
                          formData.selectedPlan === p.id
                            ? 'bg-primary text-navy border-primary'
                            : 'bg-gray-50 dark:bg-[#111722] border-gray-200 dark:border-navy-light/60 text-navy/70 dark:text-gray-300'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-gray-300 mb-1.5">
                    Outil d&apos;agenda ou CRM à synchroniser (optionnel) :
                  </label>
                  <select
                    value={formData.crm}
                    onChange={(e) => updateField('crm', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="google-calendar">Google Calendar</option>
                    <option value="doctolib">Doctolib</option>
                    <option value="outlook">Microsoft Outlook 365</option>
                    <option value="calendly">Calendly</option>
                    <option value="hubspot">HubSpot</option>
                    <option value="aucun">Je configurerai plus tard</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-gray-300 dark:border-navy-light text-navy dark:text-white text-xs font-semibold hover:bg-gray-100 dark:hover:bg-navy-light/40 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-4 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-sm shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
                  >
                    <span>Valider et finaliser</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="rounded-3xl border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] p-6 sm:p-10 shadow-brand">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">
                3. Récapitulatif &amp; Accès Immédiat
              </h2>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/40 space-y-3 text-xs mb-6">
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-navy-light/40">
                  <span className="text-navy/60 dark:text-gray-400">Nom &amp; Contact :</span>
                  <span className="font-semibold text-navy dark:text-white">{formData.fullName} ({formData.phone})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-navy-light/40">
                  <span className="text-navy/60 dark:text-gray-400">Email professionnel :</span>
                  <span className="font-semibold text-navy dark:text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-navy-light/40">
                  <span className="text-navy/60 dark:text-gray-400">Formule choisie :</span>
                  <span className="font-bold text-primary dark:text-accent-glow uppercase">{formData.selectedPlan}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-navy/60 dark:text-gray-400">Carte bancaire :</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0 € • Aucune carte requise</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy/70 dark:text-gray-300">
                  <input
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) => updateField('termsAccepted', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
                  />
                  <span>
                    J&apos;accepte les{' '}
                    <Link href="/cgu" target="_blank" className="text-primary underline">
                      Conditions Générales d&apos;Utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link href="/confidentialite" target="_blank" className="text-primary underline">
                      Politique de Confidentialité
                    </Link>
                    . Je comprends que l&apos;accès au plan Découverte est 100% gratuit et sans engagement.
                  </span>
                </label>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-xl border border-gray-300 dark:border-navy-light text-navy dark:text-white text-xs font-semibold hover:bg-gray-100 dark:hover:bg-navy-light/40 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.termsAccepted}
                    className="flex-grow py-4 rounded-xl bg-primary hover:bg-[#3dbbb2] disabled:opacity-50 text-navy font-bold text-sm shadow-brand hover:shadow-brand-hover transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Créer mon accès gratuit</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="rounded-3xl border border-primary/40 bg-white dark:bg-[#161F2B] p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white">
                  Bienvenue dans l’écosystème Permanence IA !
                </h2>
                <p className="text-sm text-navy/70 dark:text-gray-300 max-w-md mx-auto">
                  Votre espace a été configuré avec succès. Un email contenant vos accès directs vient d&apos;être envoyé à <strong>{formData.email}</strong>.
                </p>
              </div>

              {/* Status info card */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-navy-light/40 text-left space-y-3 text-xs max-w-md mx-auto">
                <div className="font-bold text-navy dark:text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span>Statut de vos agents IA :</span>
                </div>
                <div className="text-navy/80 dark:text-gray-300 space-y-1 pl-6">
                  <div>✓ Agent {formData.selectedAgent === 'receptionniste' ? 'Réceptionniste IA Vocale' : formData.selectedAgent} prêt à être testé</div>
                  <div>✓ Formulaire de rappel sans numéro public disponible</div>
                  <div>✓ Tableau de bord sandbox actif sur app.permanenceia.com</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://app.permanenceia.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-sm shadow flex items-center justify-center gap-2"
                >
                  <span>Accéder à mon portail client</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => openCallbackModal({ type: 'commercial' })}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl border border-gray-300 dark:border-navy-light text-navy dark:text-white text-sm font-semibold hover:bg-gray-100 dark:hover:bg-navy-light/40 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-primary" />
                  <span>Tester le rappel vocal IA</span>
                </button>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
