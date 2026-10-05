import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LiveCall from '@/components/LiveCall';
import Mock from '@/components/Mock';
import { CTAs, FaqDark, Heading, Photo, Section, TrialBadges } from '@/components/ui';
import {
  Benefits, DemoBlock, EconomyBlock, FeatureRow, FinalCTA, IncludesSchema, IntegrationsGrid, LaunchBlock,
  PricingCards, SectorCards, SecurityBlock, Steps, VoicesNumbers,
} from '@/components/blocks';
import { FAQ_GENERAL } from '@/data/faq';
import { SITE } from '@/data/site';

const HERO_CALL = [
  { who: 'client' as const, text: 'Bonjour, vous êtes ouverts samedi ? J’aimerais un rendez-vous.' },
  { who: 'agent' as const, text: 'Oui, de 9 h à 13 h. C’est pour une première visite ?' },
  { who: 'client' as const, text: 'Oui. Le matin si possible.' },
  { who: 'agent' as const, text: 'Je vous réserve samedi à 10 h et je vous envoie la confirmation.' },
];
const HERO_LEAD = [
  { label: 'Type', value: 'Nouveau client' }, { label: 'Rendez-vous', value: 'Samedi 10 h' },
  { label: 'Confirmation', value: 'SMS envoyé' }, { label: 'Équipe', value: 'Résumé reçu' },
];

export default function Home() {
  return (
    <Layout
      title="Permanence IA — Agents vocaux IA qui répondent, qualifient et réservent 24/7"
      description="Automatisez vos appels avec une IA qui répond, qualifie et réserve pour vous. 14 jours d’essai gratuit, 30 minutes incluses, prix HT, sans engagement."
      jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Permanence IA', url: SITE.url, email: SITE.email, logo: `${SITE.url}/icon-512.png`, legalName: SITE.company }}
    >
      {/* Hero */}
      <section className="overflow-hidden bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <h1 className="text-hero font-extrabold">Automatisez vos appels avec une IA qui <span className="kw">répond, qualifie et réserve</span> pour vous</h1>
            <p className="mt-6 max-w-prose text-lg">Permanence IA aide les entreprises à capter plus de demandes, mieux servir leurs clients et automatiser les appels entrants et sortants, avec une disponibilité 24/7.</p>
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" />
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-10 top-0 hidden h-[88%] w-[62%] overflow-hidden rounded-3xl sm:block">
              <Photo src="/photos/hero.jpg" alt="Dirigeante consultant le résumé d’un appel sur son téléphone" fallback={<div className="h-full w-full bg-gradient-to-br from-signal/25 via-signal-soft to-white" />} />
            </div>
            <div className="relative pt-10 sm:mr-24 sm:pt-16"><LiveCall call={HERO_CALL} lead={HERO_LEAD} /></div>
          </div>
        </div>
      </section>

      {/* Ce que l’agent sait faire */}
      <Section>
        <Heading title="Ce que l’agent fait pour votre entreprise" intro="Un agent vocal formé à votre activité qui travaille quand votre équipe ne peut pas décrocher." />
        <div className="mt-12"><Benefits /></div>
      </Section>

      {/* Fonctions en rangées alternées */}
      <Section tone="paper">
        <div className="space-y-20">
          <FeatureRow
            title={<>Automatisez la prise de <span className="kw">rendez-vous et les rappels</span></>}
            text="Cabinets, salons, garages, agences : l’agent se connecte à votre agenda, propose les créneaux libres, réserve et confirme. Reports et annulations compris."
            points={['Agenda en direct : Google, Outlook, Cal.com, Calendly', 'Confirmation par SMS ou WhatsApp', 'Rappel la veille du rendez-vous']}
            mock={<Mock kind="calendar" />}
            link={{ href: '/fonctionnalites/prise-de-rendez-vous', label: 'Voir la prise de rendez-vous' }}
          />
          <FeatureRow
            reverse
            title={<>Répondez aux <span className="kw">questions de vos clients</span> sans attente</>}
            text="L’agent s’appuie sur vos documents, vos pages web et vos procédures. Il répond juste, et transfère à votre équipe ce qui demande un humain."
            points={['Base de connaissances : PDF, site web, données', 'Plusieurs appels en même temps, sans file d’attente', 'Transfert vers un humain selon vos règles']}
            mock={<Mock kind="knowledge" />}
            link={{ href: '/fonctionnalites/support-client', label: 'Voir le support client' }}
          />
          <FeatureRow
            title={<>Qualifiez et <span className="kw">rappelez vos prospects</span> plus vite</>}
            text="Un formulaire rempli sur votre site devient un appel en quelques minutes. L’agent qualifie, relance et prépare une fiche que votre équipe peut traiter tout de suite."
            points={['Préqualification selon vos critères', 'Relances et confirmations automatiques', 'Campagnes vers des contacts consentants']}
            mock={<Mock kind="transcript" />}
            link={{ href: '/fonctionnalites/qualification-des-leads', label: 'Voir la qualification des leads' }}
          />
        </div>
      </Section>

      {/* Ce que ça inclut */}
      <Section>
        <Heading title="Ce que ça inclut" intro="Une plateforme complète pour automatiser vos appels. Vous activez les fonctions selon votre offre, depuis votre propre espace." />
        <div className="mt-12"><IncludesSchema /></div>
      </Section>

      <DemoBlock />

      {/* Comment ça marche */}
      <Section tone="paper">
        <Heading title="Opérationnel en quatre étapes" intro="Vous n’avez pas besoin d’expertise technique. Nous vous accompagnons à chaque étape." />
        <div className="mt-12">
          <Steps steps={[
            { title: 'Créez votre compte', text: 'Essai gratuit, sans carte bancaire pour l’offre Découverte.' },
            { title: 'Décrivez votre activité', text: 'Services, horaires, questions fréquentes, règles de transfert.' },
            { title: 'Testez l’agent', text: 'Écoutez-le en démo live et ajustez le ton et les réponses.' },
            { title: 'Branchez vos appels', text: 'Renvoi de votre ligne, nouveau numéro ou SIP, et widget sur votre site.' },
          ]} />
        </div>
      </Section>

      {/* Secteurs */}
      <Section>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Heading title="Des agents adaptés à votre métier" intro="Six secteurs où chaque appel manqué coûte un client. L’agent pose les bonnes questions pour chacun." />
          <Link href="/secteurs" className="btn-ghost shrink-0">Tous les secteurs</Link>
        </div>
        <div className="mt-12"><SectorCards /></div>
      </Section>

      {/* Langues et numéros */}
      <Section tone="paper"><VoicesNumbers /></Section>

      {/* Intégrations */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <Heading title="Connecté à vos outils" intro="Agenda, CRM, messageries, téléphonie : l’agent s’intègre à ce que vous utilisez déjà. Le flow builder relie plus de 300 outils sans code." />
            <Link href="/integrations" className="btn-ghost mt-8">Voir toutes les intégrations</Link>
          </div>
          <IntegrationsGrid max={8} />
        </div>
      </Section>

      {/* Tarifs */}
      <Section tone="paper" id="tarifs">
        <Heading center title="Des offres claires, en prix HT" intro="Choisissez selon votre volume d’appels. Changez d’offre quand vous voulez." />
        <div className="mt-12"><PricingCards /></div>
        <div className="mt-6 text-center"><Link href="/tarifs#comparatif" className="font-semibold text-signal-deep hover:underline">Comparer toutes les fonctions incluses</Link></div>
        <div className="mt-16"><LaunchBlock /></div>
      </Section>

      <Section><EconomyBlock /></Section>

      <Section tone="paper"><SecurityBlock /></Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Heading title="Questions fréquentes" intro="Vous ne trouvez pas votre réponse ? Laissez votre numéro, un conseiller vous rappelle." />
            <Link href="/faq" className="btn-ghost mt-8">Toutes les questions</Link>
          </div>
          <FaqDark items={FAQ_GENERAL.slice(0, 7)} />
        </div>
      </Section>

      <FinalCTA />
    </Layout>
  );
}
