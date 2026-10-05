import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <Layout
      title="Mentions légales — Permanence IA"
      description="Mentions légales, informations sur l'éditeur, l'hébergement et les droits d'auteur de la plateforme Permanence IA."
    >
      <div className="bg-white py-14 lg:py-20">
        <div className="wrap space-y-10">
          
          <div className="space-y-3">
            <h1 className="text-hero font-extrabold">
              Mentions Légales
            </h1>
            <p className="text-sm text-slate-light">
              Dernière mise à jour : 29 Septembre 2026
            </p>
          </div>

          <div className="max-w-3xl space-y-10 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                1. Éditeur du site
              </h2>
              <p>
                Le site internet accessible à l&apos;adresse <strong>https://permanenceia.com</strong> est édité par la société <strong>SINAY STRATEGIC LLC</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Nom commercial :</strong> Permanence IA</li>
                <li><strong>Statut :</strong> Limited Liability Company (LLC), État du Wyoming, États-Unis</li>
                <li><strong>Numéro d&apos;enregistrement :</strong> 2026-001905061</li>
                <li><strong>Siège social :</strong> 1603 Capitol Ave, Suite 413G-2408, Cheyenne, WY 82001, États-Unis</li>
                <li><strong>Email de contact :</strong> contact@permanenceia.com</li>
                <li><strong>Directeur de la publication :</strong> le représentant légal de SINAY STRATEGIC LLC.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                2. Hébergement de la plateforme
              </h2>
              <p>
                Le site vitrine commercial et l&apos;application sont hébergés par :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Plateforme front-end :</strong> Google LLC (Firebase App Hosting / Google Cloud), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Région d&apos;hébergement : us-east4 (Virginie du Nord, États-Unis).</li>
                <li><strong>Bases de données &amp; Stockage :</strong> Supabase Inc., infrastructures situées au sein de l&apos;Union Européenne (Région AWS EU-WEST-1, Dublin, Irlande).</li>
                <li><strong>Réseau téléphonique &amp; Synthèse vocale :</strong> Infrastructure de téléphonie voix cloud certifiée conforme aux normes européennes de télécommunication.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                3. Propriété intellectuelle
              </h2>
              <p>
                La marque <strong>Permanence IA</strong>, le logo (la bulle en veille, les ondes vocales et le point de disponibilité), ainsi que l&apos;ensemble des chartes graphiques, textes, scripts conversationnels, infographies et codes sources figurant sur le site sont la propriété exclusive de SINAY STRATEGIC LLC.
              </p>
              <p>
                Toute reproduction, distribution, modification ou utilisation sans accord écrit préalable est formellement interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </p>
              <p className="text-sm text-slate-light">
                La mention Autocalls White-Label Architecture relève de la licence technologique concédée par Autocalls Inc.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
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
