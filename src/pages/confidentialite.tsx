import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { SITE } from '@/data/site';

// Politique de confidentialité : reflète les traitements réels (site, agents IA, widgets, espace client, facturation).
const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Qui est responsable de vos données',
    body: (
      <>
        <p>Permanence IA est une marque de {SITE.company}, société à responsabilité limitée immatriculée dans le Wyoming (États-Unis), 1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001. Contact : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <ul>
          <li><strong>Pour le site, les demandes de rappel, les échanges avec nos assistantes et la gestion des comptes clients</strong>, {SITE.company} est responsable du traitement.</li>
          <li><strong>Pour les appels et messages traités par les agents de nos clients</strong>, le client est responsable du traitement vis-à-vis de ses propres appelants, et nous agissons comme sous-traitant pour son compte. Le client décide des informations que son agent collecte et de leur usage.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Les données que nous traitons',
    body: (
      <ul>
        <li><strong>Formulaires du site</strong> (rappel, démo, accompagnement à l’essai) : nom, téléphone, email, entreprise, secteur, créneau souhaité et votre message.</li>
        <li><strong>Échanges avec nos assistantes IA</strong> (bulle du site, réceptionniste, rappels commerciaux et support, aide de l’espace client) : contenu écrit, enregistrement audio des conversations vocales, transcription, résumé et informations utiles extraites (besoin, forfait envisagé, problème signalé).</li>
        <li><strong>Compte client</strong> : identité, email, entreprise, réglages de vos agents, historique des appels et messages, consommation de minutes.</li>
        <li><strong>Facturation</strong> : forfait, factures et moyen de paiement. Les données de carte sont saisies et conservées par Stripe ; nous n’y avons jamais accès.</li>
        <li><strong>Données techniques</strong> : adresse IP et informations du navigateur nécessaires au fonctionnement et à la sécurité du site.</li>
      </ul>
    ),
  },
  {
    title: 'Pourquoi et sur quelle base',
    body: (
      <ul>
        <li><strong>Vous rappeler et répondre à votre demande</strong>, y compris par un appel de notre agent vocal IA : sur la base de votre consentement, donné au moment de la demande. Vous pouvez le retirer à tout moment, et l’agent respecte toute demande de ne plus être appelé.</li>
        <li><strong>Fournir le service, l’essai gratuit et le support</strong> : exécution du contrat.</li>
        <li><strong>Facturer et respecter nos obligations comptables et fiscales</strong> : obligation légale.</li>
        <li><strong>Améliorer nos assistantes et sécuriser la plateforme</strong> : intérêt légitime, à partir de nos propres échanges uniquement.</li>
      </ul>
    ),
  },
  {
    title: 'Agents IA et enregistrements',
    body: (
      <>
        <p>Nos assistantes sont des intelligences artificielles et se présentent comme telles. Les conversations vocales sont enregistrées et transcrites pour assurer le suivi de votre demande et la qualité du service. Aucune décision produisant des effets juridiques à votre égard n’est prise de manière entièrement automatisée.</p>
        <p>Nos clients qui utilisent la plateforme doivent informer leurs propres appelants de l’usage d’un agent IA et de l’enregistrement, selon les règles applicables à leur activité.</p>
      </>
    ),
  },
  {
    title: 'Nos prestataires',
    body: (
      <ul>
        <li><strong>Autocalls</strong> : plateforme technique des agents vocaux, des widgets et de l’espace client (appels, transcription, synthèse vocale, automatisations).</li>
        <li><strong>Fournisseurs d’IA, de voix et de téléphonie</strong> utilisés par cette plateforme pour comprendre, répondre et acheminer les appels.</li>
        <li><strong>Stripe</strong> : abonnements, paiements, factures et calcul des taxes (certifié PCI-DSS niveau 1).</li>
        <li><strong>Supabase</strong> : base de données des demandes de rappel, inscriptions et comptes rendus d’échanges (États-Unis).</li>
        <li><strong>Google Cloud (Firebase App Hosting)</strong> : hébergement du site (États-Unis).</li>
        <li><strong>Zoho Mail</strong> : envoi des emails de service et de suivi.</li>
      </ul>
    ),
  },
  {
    title: 'Transferts hors de l’Union européenne',
    body: <p>Plusieurs de ces prestataires, ainsi que notre société, sont situés aux États-Unis. Les transferts reposent sur le Cadre de protection des données UE-États-Unis lorsque le prestataire y adhère, ou sur les clauses contractuelles types de la Commission européenne.</p>,
  },
  {
    title: 'Combien de temps nous les gardons',
    body: (
      <ul>
        <li>Demandes de rappel et échanges avec nos assistantes : 24 mois après le dernier contact.</li>
        <li>Enregistrements et transcriptions des appels traités pour nos clients : 12 mois par défaut ; chaque client peut réduire cette durée et supprimer ses données depuis son espace.</li>
        <li>Données du compte : pendant toute la relation, puis 3 ans pour la prospection éventuelle, sauf opposition.</li>
        <li>Factures et données comptables : durée légale (jusqu’à 10 ans).</li>
      </ul>
    ),
  },
  {
    title: 'Sécurité',
    body: <p>Les échanges sont chiffrés en transit, les accès aux données sont limités aux personnes qui en ont besoin et protégés par authentification, et les clés techniques sont conservées dans des coffres-forts de secrets. Les clients peuvent activer la double authentification sur leur espace.</p>,
  },
  {
    title: 'Vos droits',
    body: (
      <>
        <p>Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, leur portabilité, la limitation du traitement, vous opposer à la prospection et retirer votre consentement à être rappelé. Écrivez à <a href={`mailto:${SITE.email}`}>{SITE.email}</a> : nous répondons sous un mois.</p>
        <p>Si vous résidez dans l’Union européenne, vous pouvez aussi adresser une réclamation à l’autorité de protection des données de votre pays (en France, la CNIL).</p>
      </>
    ),
  },
  {
    title: 'Cookies',
    body: <p>Le site n’utilise pas de cookies publicitaires. Les détails figurent sur la page <Link href="/cookies">cookies</Link>.</p>,
  },
];

export default function Confidentialite() {
  return (
    <Layout
      title="Politique de confidentialité — Permanence IA"
      description="Comment Permanence IA traite vos données : demandes de rappel, agents IA et enregistrements, compte client, facturation Stripe, prestataires et vos droits."
      breadcrumbs={[{ name: 'Confidentialité', path: '/confidentialite' }]}
    >
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <h1 className="text-hero font-extrabold">Politique de confidentialité</h1>
          <p className="mt-4 max-w-prose text-lg">Ce que nous collectons, pourquoi, avec qui, combien de temps, et comment exercer vos droits.</p>
          <p className="mt-3 text-sm text-slate-light">Mise à jour : octobre 2026</p>
        </div>
      </section>
      <section className="bg-white">
        <div className="wrap max-w-3xl space-y-10 py-14 lg:py-20 [&_a]:font-semibold [&_a]:text-signal-deep [&_a]:underline [&_li]:mt-2 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {SECTIONS.map((s, i) => (
            <section key={s.title}>
              <h2 className="font-display text-2xl font-bold text-ink">{i + 1}. {s.title}</h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}
        </div>
      </section>
    </Layout>
  );
}
