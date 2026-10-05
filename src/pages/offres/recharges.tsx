import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, GrowthBlock, RechargeTables, Steps } from '@/components/blocks';
import { PRICE_NOTE } from '@/data/site';

export default function Recharges() {
  return (
    <Layout title="Recharges de minutes — Permanence IA" description="Recharges de minutes dès 39 € HT les 100 minutes. Ajoutez des minutes à tout moment ; passez au forfait supérieur quand votre volume grandit.">
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title="Ajoutez des minutes à tout moment" intro="La recharge dépanne un mois plus chargé. Si vous rechargez souvent, le forfait supérieur devient plus économique : nous vous le signalons." />
          <TrialBadges className="mt-6" />
        </div>
      </section>
      <Section><RechargeTables /><p className="mt-4 text-sm text-slate-light">{PRICE_NOTE}</p></Section>
      <Section tone="paper">
        <Heading title="Comment ça fonctionne" />
        <div className="mt-10">
          <Steps steps={[
            { title: 'Suivez votre usage', text: 'Votre tableau de bord affiche les minutes consommées et restantes.' },
            { title: 'Ajoutez des minutes', text: 'Une recharge de 100 à 2 500 minutes, en un clic.' },
            { title: 'Continuez sans coupure', text: 'Les minutes s’ajoutent immédiatement à votre quota.' },
          ]} />
        </div>
      </Section>
      <Section><GrowthBlock /></Section>
      <FinalCTA />
    </Layout>
  );
}
