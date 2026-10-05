import React from 'react';
import Layout from '@/components/Layout';
import { CTAs, FaqDark, Heading, Section } from '@/components/ui';
import { FinalCTA } from '@/components/blocks';
import { FAQ_GENERAL, FAQ_PRICING } from '@/data/faq';
import { SITE } from '@/data/site';

export default function Faq() {
  const all = [...FAQ_GENERAL, ...FAQ_PRICING];
  return (
    <Layout
      title="Questions fréquentes — Permanence IA"
      description="Fonctionnement, téléphonie, SIP, calendrier, WhatsApp, RGPD, essai gratuit et tarifs : toutes les réponses sur l’agent vocal IA Permanence IA."
      jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', url: `${SITE.url}/faq`, mainEntity: all.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }}
    >
      <section className="bg-paper"><div className="wrap py-14 lg:py-20"><Heading as="h1" title="Questions fréquentes" intro="Vous ne trouvez pas votre réponse ? Laissez votre numéro, un conseiller vous rappelle." /><CTAs className="mt-8" /></div></section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div><h2 className="mb-6 font-display text-2xl font-bold">La plateforme</h2><FaqDark items={FAQ_GENERAL} /></div>
          <div><h2 className="mb-6 font-display text-2xl font-bold">Tarifs et essai</h2><FaqDark items={FAQ_PRICING} /></div>
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}
