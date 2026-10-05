import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, RechargeTables, Steps } from '@/components/blocks';
import { PRICE_NOTE } from '@/data/site';

export default function Recharges() {
  return (
    <Layout title="Recharges de minutes — Permanence IA" description="Recharges ponctuelles dès 19 € HT les 100 minutes et add-ons mensuels dès 39 € HT. Ajoutez des minutes sans changer d’offre.">
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title="Ajoutez des minutes quand votre activité accélère" intro="Recharges ponctuelles pour un pic, add-ons mensuels pour un volume durable. Sans changer d’offre, sans engagement." />
          <TrialBadges className="mt-6" />
        </div>
      </section>
      <Section><RechargeTables /><p className="mt-4 text-sm text-slate-light">{PRICE_NOTE}</p></Section>
      <Section tone="paper">
        <Heading title="Comment ça fonctionne" />
        <div className="mt-10">
          <Steps steps={[
            { title: 'Suivez votre usage', text: 'Votre tableau de bord affiche les minutes consommées et restantes.' },
            { title: 'Ajoutez des minutes', text: 'Une recharge ponctuelle ou un add-on mensuel, en un clic.' },
            { title: 'Continuez sans coupure', text: 'Les minutes s’ajoutent immédiatement à votre quota.' },
          ]} />
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}
