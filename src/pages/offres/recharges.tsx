import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, GrowthBlock, RechargeTables, Steps } from '@/components/blocks';
import { PRICE_NOTE } from '@/data/site';

export default function Recharges() {
  return (
    <Layout title="Recharges de minutes — Permanence IA" description="Recharges de crédit dès 39 $ HT pour 100 minutes supplémentaires. Ajoutez des minutes à tout moment ; passez au forfait supérieur quand votre volume grandit.">
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
            { title: 'Ajoutez du crédit', text: 'Une recharge de 39 $ à 725 $, en un clic depuis votre espace.' },
            { title: 'Continuez sans coupure', text: 'Le crédit paie les minutes au-delà du forfait et ne périme pas.' },
          ]} />
        </div>
      </Section>
      <Section><GrowthBlock /></Section>
      <FinalCTA />
    </Layout>
  );
}
