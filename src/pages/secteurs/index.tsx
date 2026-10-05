import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, SectorCards } from '@/components/blocks';

export default function Secteurs() {
  return (
    <Layout title="Secteurs — agents vocaux IA par métier · Permanence IA" description="Services à domicile, dentaire et cliniques, immobilier, garages, beauté, restaurants et hôtellerie : un agent vocal IA adapté à chaque métier.">
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title="Un agent vocal adapté à votre métier" intro="Nous avons retenu six secteurs où les appels arrivent quand les équipes sont occupées, et où chaque demande manquée coûte un client." />
          <TrialBadges className="mt-6" />
          <CTAs className="mt-8" />
        </div>
      </section>
      <Section><SectorCards /></Section>
      <Section tone="paper">
        <Heading title="Votre activité n’est pas dans la liste ?" intro="Cabinets juridiques, e-commerce, recrutement, tourisme : l’agent se configure pour tout métier qui reçoit des appels. Parlons de votre cas." />
        <CTAs className="mt-8" primary="Commencer gratuitement" demo="Essayer en live notre agent" />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
