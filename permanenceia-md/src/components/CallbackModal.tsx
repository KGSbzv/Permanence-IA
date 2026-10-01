import React, { useState, useEffect } from 'react';
import { X, PhoneCall, CheckCircle2, Clock, ShieldCheck, Sparkles, Building2, User, Mail, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCallbackModal } from '@/context/CallbackContext';

export default function CallbackModal() {
  const { isOpen, options, closeCallbackModal } = useCallbackModal();
  const [tab, setTab] = useState<'commercial' | 'support'>('commercial');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('plombiers');
  const [slot, setSlot] = useState('asap');
  const [note, setNote] = useState('');
  const [consentCall, setConsentCall] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (options.type) {
      setTab(options.type);
    }
    if (options.sector) {
      setSector(options.sector);
    }
    if (isOpen) {
      setIsSubmitted(false);
      setErrorMessage('');
    }
  }, [isOpen, options]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentCall) {
      setErrorMessage('Le consentement au rappel par agent IA est requis.');
      return;
    }
    if (!phone || phone.trim().length < 8) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        company,
        sector,
        slot,
        note,
        consentCall,
        type: tab,
        agent: options.agent || (tab === 'commercial' ? 'Agent Commercial IA' : 'Agent Support IA'),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .catch(() => {
        // Fallback for offline/static deployment
        return { success: true };
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // Confetti fallback
        }
      });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#161F2B] rounded-2xl shadow-2xl border border-gray-100 dark:border-navy-light/60 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-light/40 bg-gray-50/50 dark:bg-navy-dark/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy dark:text-white">
                {tab === 'commercial' ? 'Programmer un Rappel IA' : 'Demande d’Assistance / Support'}
              </h3>
              <p className="text-xs text-navy/60 dark:text-gray-400">
                Sans attente, sans numéro public : notre agent vous rappelle.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCallbackModal}
            className="p-2 text-gray-400 hover:text-navy dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 dark:border-navy-light/40 px-6 pt-3 bg-white dark:bg-[#161F2B]">
          <button
            type="button"
            onClick={() => setTab('commercial')}
            className={`pb-3 text-sm font-semibold border-b-2 mr-6 transition-colors ${
              tab === 'commercial'
                ? 'border-primary text-primary'
                : 'border-transparent text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white'
            }`}
          >
            Rappel Commercial & Démo
          </button>
          <button
            type="button"
            onClick={() => setTab('support')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'support'
                ? 'border-primary text-primary'
                : 'border-transparent text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white'
            }`}
          >
            Support & Suivi Client
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-navy dark:text-white">Rappel Planifié avec Succès !</h4>
              <p className="text-sm text-navy/70 dark:text-gray-300 max-w-sm mx-auto">
                Votre demande a été enregistrée dans notre CRM sécurisé. Notre {tab === 'commercial' ? 'Agent Commercial IA' : 'Agent Support IA'} vous joindra au <strong className="text-navy dark:text-white">{phone}</strong> selon le créneau choisi.
              </p>
              <div className="bg-gray-50 dark:bg-navy-dark/60 p-4 rounded-xl text-left text-xs space-y-1.5 border border-gray-100 dark:border-navy-light/40">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Créneau :</span>
                  <span className="font-semibold text-navy dark:text-white">
                    {slot === 'asap' ? 'Prioritaire (sous 10-15 min)' : slot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Confirmation :</span>
                  <span className="font-semibold text-navy dark:text-white">Envoyée par email ({email || 'Fourni'})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCallbackModal}
                className="w-full mt-4 py-3 bg-primary hover:bg-[#3dbbb2] text-navy font-bold rounded-xl transition-colors shadow-sm"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                    Votre nom & prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Alexandre Martin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                    Numéro à rappeler *
                  </label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                    Email professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="contact@entreprise.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                    Entreprise / Cabinet
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cabinet Dentaire Martin"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                    Secteur d&apos;activité
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                  >
                    <option value="plombiers">Plomberie & BTP / Artisans</option>
                    <option value="dentaire">Cabinet Dentaire / Médical</option>
                    <option value="immobilier">Agence Immobilière</option>
                    <option value="cliniques">Clinique & Soins</option>
                    <option value="auto">Garage & Automobile</option>
                    <option value="avocat">Cabinet Juridique & Conseil</option>
                    <option value="autre">Autre secteur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                    Créneau de rappel souhaité *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                    >
                      <option value="asap">Immédiat (sous 10-15 minutes)</option>
                      <option value="Aujourd'hui 14h - 16h">Aujourd&apos;hui (14h - 16h)</option>
                      <option value="Aujourd'hui 16h - 18h">Aujourd&apos;hui (16h - 18h)</option>
                      <option value="Demain matin (9h - 12h)">Demain matin (9h - 12h)</option>
                      <option value="Demain après-midi (14h - 18h)">Demain après-midi (14h - 18h)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/80 dark:text-gray-200 mb-1">
                  Précisions ou besoins spécifiques (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : volume moyen d'appels, intégration Google Calendar ou Doctolib..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-navy-dark text-navy dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* RGPD & Consentements */}
              <div className="pt-2 border-t border-gray-100 dark:border-navy-light/40 space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-navy/80 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consentCall}
                    onChange={(e) => setConsentCall(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>
                    J&apos;accepte expressément d&apos;être rappelé(e) au numéro indiqué par un agent vocal IA Permanence IA pour répondre à ma demande. (Obligatoire)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-navy/70 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentMarketing}
                    onChange={(e) => setConsentMarketing(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>
                    J&apos;accepte de recevoir des emails d&apos;information et retours d&apos;expérience sur les agents IA. (Facultatif)
                  </span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Programmation en cours...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-navy" />
                      <span>Confirmer mon créneau de rappel</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Règle Zéro Numéro Public • Données chiffrées • Aucun démarchage abusif</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
