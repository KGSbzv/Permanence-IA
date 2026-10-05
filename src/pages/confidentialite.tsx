import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Lock, ShieldCheck, Mail } from 'lucide-react';

export default function Confidentialite() {
  return (
    <Layout
      title="Politique de Confidentialité (RGPD) | Permanence IA"
      description="Découvrez comment Permanence IA protège vos données personnelles et garantit la conformité RGPD de vos communications téléphoniques."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Protection des données personnelles
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white">
              Politique de Confidentialité &amp; RGPD
            </h1>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Conforme au Règlement (UE) 2016/679 du Parlement européen &bull; Révision Septembre 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base text-navy/80 dark:text-gray-300 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                1. Données collectées
              </h2>
              <p>
                Dans le cadre de l&apos;utilisation des services de <strong>Permanence IA</strong>, nous sommes amenés à traiter différentes catégories de données à caractère personnel :
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Données de compte client :</strong> Nom complet, raison sociale, adresse email professionnelle, numéro de téléphone, informations de facturation (gérées de manière sécurisée par Stripe).</li>
                <li><strong>Données relatives aux appels :</strong> Horodatage de l&apos;appel, numéro de téléphone de l&apos;appelant, durée de la communication, retranscription textuelle du dialogue, extraction des entités métier (adresse de dépannage, motif de consultation, budget prévisionnel).</li>
                <li><strong>Données techniques de navigation :</strong> Adresse IP, type de navigateur, préférences d&apos;affichage (mode clair / mode sombre stocké localement sans tracker tiers).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                2. Rôles et responsabilités RGPD
              </h2>
              <p>
                Aux termes de la réglementation européenne :
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Permanence IA</strong> agit en qualité de <strong>Sous-traitant</strong> pour le compte de ses clients professionnels en ce qui concerne le traitement des appels téléphoniques entrants et de leurs retranscriptions.</li>
                <li><strong>Le client professionnel</strong> de Permanence IA agit en qualité de <strong>Responsable du traitement</strong> vis-à-vis de ses propres appelants et patients. Il lui appartient de s&apos;assurer de la licéité des données qu&apos;il demande à l&apos;IA de collecter.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                3. Sous-traitants ultérieurs et transferts de données
              </h2>
              <p>
                Pour exécuter ses engagements contractuels, Permanence IA s&apos;appuie sur des partenaires techniques de premier ordre, tous soumis à des obligations strictes de sécurité et de confidentialité :
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Autocalls :</strong> plateforme technique des agents vocaux (traitement des appels, transcription, synthèse vocale, espace client).</li>
                <li><strong>Stripe :</strong> gestion des abonnements, des paiements et des taxes (norme PCI-DSS niveau 1).</li>
                <li><strong>Supabase :</strong> base de données des demandes de rappel et des inscriptions, hébergée aux États-Unis (AWS, Virginie).</li>
                <li><strong>Google Cloud (Firebase App Hosting) :</strong> hébergement du site, aux États-Unis.</li>
                <li><strong>Zoho Mail :</strong> envoi des emails de confirmation et de suivi.</li>
                <li><strong>Opérateurs télécoms et fournisseurs de voix et d&apos;IA</strong> utilisés par la plateforme pour acheminer les appels et générer les réponses.</li>
                <li><strong>Transferts hors Union européenne :</strong> certains de ces prestataires sont situés aux États-Unis ; les transferts sont encadrés par les clauses contractuelles types de la Commission européenne ou un mécanisme équivalent.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                4. Durée de conservation et purge
              </h2>
              <p>
                Les données de facturation sont conservées pendant les durées légales obligatoires (10 ans). Les transcriptions d&apos;appels sont conservées par défaut pendant une durée de 12 mois à compter de l&apos;appel, et peuvent être purgées ou exportées à tout moment par le client depuis son tableau de bord.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                5. Exercice de vos droits &amp; Délégué à la protection des données
              </h2>
              <p>
                Conformément aux articles 15 à 22 du RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation et d&apos;opposition au traitement de vos données.
              </p>
              <p className="flex items-center gap-2 font-medium text-primary">
                <Mail className="w-4 h-4" />
                <span>Pour toute demande, adressez un email à : <strong>contact@permanenceia.com</strong></span>
              </p>
            </section>

          </div>

        </div>
      </div>
    </Layout>
  );
}
