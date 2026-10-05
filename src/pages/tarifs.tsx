import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { CTAs, FaqDark, Heading, Section, TrialBadges } from '@/components/ui';
import { EconomyBlock, FinalCTA, LaunchBlock, MatrixTable, PricingCards, RechargeTables } from '@/components/blocks';
import { FAQ_PRICING } from '@/data/faq';
import { OFFERS } from '@/data/offers';
import { PRICE_NOTE, SITE } from '@/data/site';

export default function Tarifs() {
  return (
    <Layout
      title="Tarifs Permanence IA — offres HT, minutes incluses et recharges"
      description="Découverte 0 €, Essentiel 59 € HT, Croissance 129 € HT, Pro 249 € HT au lancement. 14 jours d’essai gratuit, 30 minutes incluses, sans engagement."
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'Product', name: 'Permanence IA', brand: 'Permanence IA', url: `${SITE.url}/tarifs`,
        offers: OFFERS.filter((o) => o.launchPrice !== null).map((o) => ({ '@type': 'Offer', name: o.name, price: o.launchPrice, priceCurrency: 'EUR', url: `${SITE.url}/offres/${o.slug}` })),
      }}
    >
      <section className="bg-paper">
        <div className="wrap py-14 text-center lg:py-20">
          <Heading as="h1" center title="Choisissez l’offre adaptée à votre volume d’appels" intro="Tous les tarifs sont affichés hors taxes. L’essai gratuit comprend 14 jours et 30 minutes d’appels incluses." />
          <TrialBadges className="mt-6 justify-center" />
          <div className="mt-12 text-left"><PricingCards /></div>
          <p className="mt-6 text-sm text-slate-light">{PRICE_NOTE} Dépassement facturé à la minute selon l’offre, ou recharge.</p>
        </div>
      </section>

      <Section id="comparatif">
        <Heading title="Ce qui est inclus dans votre interface" intro="Chaque ligne correspond à une page ou une fonction que vous retrouvez dans votre espace client. Rien d’autre n’est caché derrière un bouton." />
        <div className="mt-10"><MatrixTable /></div>
        <p className="mt-4 text-sm text-slate-light">Les dépassements : Essentiel 0,19 € HT/min · Croissance 0,156 à 0,138 € HT/min selon le lot · Pro 0,129 € HT/min · Sur mesure contractuel.</p>
      </Section>

      <Section tone="paper" id="recharges">
        <Heading title="Besoin de plus de minutes ?" intro="Ajoutez des minutes à la carte ou chaque mois, sans changer d’offre." />
        <div className="mt-10"><RechargeTables /></div>
        <Link href="/offres/recharges" className="mt-6 inline-block font-semibold text-signal-deep hover:underline">Comment fonctionnent les recharges</Link>
      </Section>

      <Section><LaunchBlock /></Section>

      <Section tone="paper"><EconomyBlock /></Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Heading title="Questions sur les tarifs" intro="Un doute sur l’offre qui vous convient ? Faites-vous rappeler, ou essayez l’agent en live." />
            <CTAs className="mt-8" primary="Commencer gratuitement" demo="Voir la démo live" />
          </div>
          <FaqDark items={FAQ_PRICING} />
        </div>
      </Section>

      <FinalCTA title="Démarrez avec 30 minutes offertes" />
    </Layout>
  );
}
