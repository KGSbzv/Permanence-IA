import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { ShieldCheck, Zap, Sparkles, HeartHandshake, PhoneCall, ArrowRight, Award } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Fiabilité absolue',
      desc: 'Votre standard ne doit jamais faillir. Nous garantissons une disponibilité de 99,98% et une redondance multi-serveurs sur le territoire européen.',
    },
    {
      icon: Zap,
      title: 'Simplicité radicale',
      desc: 'Pas de jargon informatique ni de paramétrages interminables. Votre agent vocal est opérationnel en 5 minutes chrono avec votre numéro habituel.',
    },
    {
      icon: HeartHandshake,
      title: 'Transformation & Empathie',
      desc: 'L’IA ne remplace pas le lien humain : elle le préserve en supprimant le filtre désagréable du répondeur ou de l’attente interminable.',
    },
  ];

  const team = [
    {
      name: 'Alexandre Renoir',
      role: 'Co-fondateur & CEO',
      bio: 'Ancien dirigeant d’agence de services, passionné par la résolution des frictions d’acquisition client et l’automatisation vocale.',
      initials: 'AR',
    },
    {
      name: 'Dr Sonia Kaci',
      role: 'Directrice Technique & IA Vocale',
      bio: 'Docteure en traitement automatique du langage naturel (NLP/LLM), experte en latence temps réel et modèles conversationnels.',
      initials: 'SK',
    },
    {
      name: 'Julien Lefebvre',
      role: 'Responsable Expérience Client & Succès',
      bio: '10 ans d’accompagnement auprès des artisans, cliniques et professions libérales sur leurs outils de relation client.',
      initials: 'JL',
    },
  ];

  return (
    <Layout
      title="À propos de Permanence IA | Notre Mission & Notre Équipe"
      description="Découvrez l'histoire et la mission de Permanence IA : démocratiser les réceptionnistes vocaux d'intelligence artificielle de pointe pour toutes les entreprises."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Notre Mission
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy dark:text-white tracking-tight leading-tight">
              Permanence IA transforme vos appels en revenus
            </h1>
            <p className="text-lg text-navy/70 dark:text-gray-300 leading-relaxed">
              Nous avons fondé Permanence IA avec une conviction simple : chaque sonnerie téléphonique sans réponse est une opportunité commerciale perdue et une déception pour le client.
            </p>
          </div>

          {/* Mission statement 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="p-8 sm:p-10 rounded-3xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 space-y-4">
              <h2 className="text-2xl font-bold text-navy dark:text-white">
                Rendre le standard d&apos;élite accessible à toutes les PME
              </h2>
              <p className="text-sm sm:text-base text-navy/70 dark:text-gray-300 leading-relaxed">
                Jusqu&apos;à récemment, disposer d&apos;une permanence téléphonique disponible 24h/24, 7j/7 avec un décroché instantané et une qualification sans faille était un luxe réservé aux multinationales ou aux services d&apos;urgence dotés de budgets colossaux.
              </p>
              <p className="text-sm sm:text-base text-navy/70 dark:text-gray-300 leading-relaxed">
                Grâce aux avancées des modèles d&apos;intelligence artificielle conversationnelle vocale, nous offrons désormais à tout artisan, dentiste, agence immobilière ou PME un réceptionniste infatigable, bienveillant et parfaitement formé à son métier.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-navy text-white space-y-6 border border-primary/30">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold">Nos engagements clés</h3>
              </div>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span><strong>100% Souveraineté Européenne :</strong> Chiffrement TLS et stockage de vos données sur des infrastructures situées en UE.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span><strong>Zéro latence :</strong> Temps de réponse inférieur à 800ms pour un échange indistinguable d&apos;un interlocuteur physique.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span><strong>Sans engagement :</strong> Nous croyons en notre valeur ajoutée, pas aux contrats qui enferment les clients.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3 Values */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-navy dark:text-white">Nos 3 Piliers Fondateurs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="p-8 rounded-2xl bg-white dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 shadow-sm text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary mx-auto flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-navy dark:text-white">{v.title}</h3>
                    <p className="text-sm text-navy/70 dark:text-gray-300 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold text-primary uppercase">Les humains derrière l&apos;IA</span>
              <h2 className="text-3xl font-extrabold text-navy dark:text-white mt-2">L&apos;équipe Permanence IA</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((m, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-navy to-navy-light text-primary mx-auto flex items-center justify-center font-extrabold text-lg border border-primary/30 shadow">
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy dark:text-white">{m.name}</h3>
                    <div className="text-xs text-primary dark:text-accent-glow font-semibold">{m.role}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-10 rounded-3xl bg-navy text-white text-center space-y-6 border border-primary/30">
            <h3 className="text-3xl font-extrabold">Rejoignez les entreprises qui ne perdent plus d&apos;appels</h3>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
              Testez notre technologie gratuitement pendant 7 jours sans engagement.
            </p>
            <div>
              <Link
                href="/essai-gratuit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-primary hover:bg-[#3dbbb2] text-navy shadow"
              >
                <span>Démarrer l&apos;essai gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
