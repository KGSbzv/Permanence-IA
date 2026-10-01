import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Send, Sparkles } from 'lucide-react';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#111722] dark:to-[#0F1419] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-navy dark:bg-[#161F2B] text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-primary/20 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-glow/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Démarrage immédiat
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Prêt à transformer tes appels en revenus ?
            </h2>

            <p className="text-base sm:text-lg text-gray-300">
              Configurez votre réceptionniste IA en 5 minutes. Vos clients obtiennent une réponse instantanée, dès ce soir.
            </p>

            {/* Quick Action Box */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/essai-gratuit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow-brand hover:shadow-brand-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Démarrer l&apos;essai gratuit 7 jours</span>
                <ArrowRight className="w-5 h-5 text-navy" />
              </Link>
            </div>

            {/* Callback / Custom request */}
            <div className="pt-8 border-t border-white/10 text-left max-w-md mx-auto">
              <div className="text-xs font-semibold text-gray-300 mb-2 text-center">
                Un cas d&apos;usage spécifique ? Parlons de votre structure :
              </div>

              {submitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Merci ! Un spécialiste IA vous contacte sous 2 heures ouvrées.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Votre adresse email professionnelle"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 rounded-lg text-xs bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg text-xs font-bold bg-white text-navy hover:bg-gray-100 transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Être rappelé</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>&bull; Sans carte bancaire</span>
              <span>&bull; 7 jours d&apos;accès complet</span>
              <span>&bull; Support français</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
