import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, IncludesSchema, ModuleCards } from '@/components/blocks';

export default function Fonctionnalites() {
  return (
    <Layout title="Fonctionnalités — plateforme d’appels IA · Permanence IA" description="Réceptionniste IA, prise de rendez-vous, support, qualification, campagnes, WhatsApp, base de connaissances, flow builder, SIP, reporting et widget web.">
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title="Tout ce qu’il faut pour automatiser vos appels" intro="Treize modules, activés selon votre offre, depuis votre espace client." />
          <TrialBadges className="mt-6" />
          <CTAs className="mt-8" />
        </div>
      </section>
      <Section><ModuleCards /></Section>
      <Section tone="paper"><Heading title="Vue d’ensemble" /><div className="mt-10"><IncludesSchema /></div></Section>
      <FinalCTA />
    </Layout>
  );
}
