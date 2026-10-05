import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, CheckCircle, ShieldCheck, Zap, Star } from 'lucide-react';
import CallDemoPlayer from './CallDemoPlayer';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Bandeau d'en-tête de marque */}
      <div className="absolute inset-x-0 top-0 h-48 sm:h-56 -z-10 pointer-events-none overflow-hidden opacity-60 dark:opacity-50 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
        <img src="/logo/header-light.jpg" alt="" aria-hidden="true" className="block dark:hidden w-full h-full object-cover" />
        <img src="/logo/header-dark.jpg" alt="" aria-hidden="true" className="hidden dark:block w-full h-full object-cover" />
      </div>
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 dark:opacity-20 blur-3xl -z-10 bg-gradient-to-b from-primary/30 via-accent/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Sector / Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 text-xs font-semibold text-navy dark:text-accent-glow">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Agent vocal disponible &bull; 24 h/24 &bull; 7 j/7</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy dark:text-white leading-[1.15]">
              Réceptionniste IA 24/7.{' '}
              <span className="text-primary dark:text-accent-glow block mt-1">
                Zéro réceptionniste à payer.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-navy/75 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Reçois tes appels, qualifie tes leads, prends tes RDV directement dans ton agenda. Même le week-end, même la nuit.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/essai-gratuit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow-brand hover:shadow-brand-hover transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Essai gratuit 7 jours</span>
                <ArrowRight className="w-5 h-5 text-navy" />
              </Link>

              <a
                href="#demo-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-navy dark:text-white border border-gray-300 dark:border-navy-light hover:bg-gray-50 dark:hover:bg-navy-light/40 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                <span>Écouter une démo</span>
              </a>
            </div>

            {/* Value Guarantees */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-navy-light/40 text-xs text-navy/70 dark:text-gray-400">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Setup en 5 minutes</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Sans engagement</span>
              </div>
            </div>

            {/* Social proof badge */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0F1419] bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0F1419] bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">ML</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0F1419] bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold">FB</div>
              </div>
              <div className="text-xs text-navy/70 dark:text-gray-300">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-navy dark:text-white ml-1 text-xs">4.9/5</span>
                </div>
                <span>Déjà plus de 250 professionnels équipés</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Call Player Mockup */}
          <div id="demo-section" className="lg:col-span-6 relative">
            <CallDemoPlayer />
          </div>

        </div>
      </div>
    </section>
  );
}
