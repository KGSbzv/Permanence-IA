import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <Layout
      title="Mentions Légales | Permanence IA"
      description="Mentions légales, informations sur l'éditeur, l'hébergement et les droits d'auteur de la plateforme Permanence IA."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Informations légales
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white">
              Mentions Légales
            </h1>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Dernière mise à jour : 29 Septembre 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base text-navy/80 dark:text-gray-300 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                1. Éditeur du site
              </h2>
              <p>
                Le site internet accessible à l&apos;adresse <strong>https://permanenceia.com</strong> est édité par la société <strong>Permanence IA SAS</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Statut :</strong> Société par Actions Simplifiée (SAS)</li>
                <li><strong>Siège social :</strong> 10 Rue de la Paix, 75002 Paris, France</li>
                <li><strong>Email de contact :</strong> legal@permanenceia.com</li>
                <li><strong>Directeur de la publication :</strong> Alexandre Renoir, en qualité de Président.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                2. Hébergement de la plateforme
              </h2>
              <p>
                Le site vitrine commercial et l&apos;application sont hébergés par :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Plateforme front-end :</strong> Vercel Inc., 340 S Lemon Ave #1142 Walnut, CA 91789, USA.</li>
                <li><strong>Bases de données &amp; Stockage :</strong> Supabase Inc., infrastructures situées au sein de l&apos;Union Européenne (Région AWS EU-WEST-1, Dublin, Irlande).</li>
                <li><strong>Réseau téléphonique &amp; Synthèse vocale :</strong> Infrastructure de téléphonie voix cloud certifiée conforme aux normes européennes de télécommunication.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                3. Propriété intellectuelle
              </h2>
              <p>
                La marque <strong>Permanence IA</strong>, le logo (la bulle en veille, les ondes vocales et le point de disponibilité), ainsi que l&apos;ensemble des chartes graphiques, textes, scripts conversationnels, infographies et codes sources figurant sur le site sont la propriété exclusive de Permanence IA SAS.
              </p>
              <p>
                Toute reproduction, distribution, modification ou utilisation sans accord écrit préalable est formellement interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </p>
              <p className="text-xs text-navy/60 dark:text-gray-400">
                La mention Autocalls White-Label Architecture relève de la licence technologique concédée par Autocalls Inc.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                4. Limitation de responsabilité
              </h2>
              <p>
                Permanence IA s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude des informations diffusées sur le site. Toutefois, Permanence IA ne saurait être tenue responsable des interruptions de service réseau, des pannes inhérentes aux opérateurs de télécommunication tiers ou des inexactitudes contextuelles ponctuelles formulées par les modèles de traitement automatique de la parole lors des conversations en direct.
              </p>
              <p>
                Le client professionnel demeure seul responsable des consignes et règles métier qu&apos;il programme pour son standard téléphonique.
              </p>
            </section>

          </div>

        </div>
      </div>
    </Layout>
  );
}
