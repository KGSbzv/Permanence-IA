import React from 'react';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, Heading, Section, TrialBadges } from '@/components/ui';
import { FeatureRow, FinalCTA, IntegrationsGrid } from '@/components/blocks';

export default function Integrations() {
  return (
    <Layout title="Intégrations — agenda, CRM, WhatsApp, SIP · Permanence IA" description="Connectez l’agent vocal IA à Google Agenda, Outlook, Cal.com, Calendly, HubSpot, Zoho, WhatsApp, Instagram, SIP et plus de 300 outils sans code.">
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title="Connecté aux outils que vous utilisez déjà" intro="Agenda, CRM, messageries, téléphonie : l’agent s’intègre à votre organisation, et le flow builder relie plus de 300 outils sans code." />
          <TrialBadges className="mt-6" />
          <CTAs className="mt-8" />
        </div>
      </section>
      <Section><IntegrationsGrid /></Section>
      <Section tone="paper">
        <FeatureRow
          title={<>Construisez vos automatisations <span className="kw">sans code</span></>}
          text="Un formulaire rempli, un appel terminé, un nouveau lead : chaque événement peut déclencher une suite d’actions dans vos outils, comme dans Zapier ou Make, directement depuis votre espace."
          points={['Plus de 300 outils disponibles', 'Glisser-déposer, aucun développement', 'Tests avant activation']}
          mock={<Mock kind="flow" />}
          link={{ href: '/fonctionnalites/flow-builder', label: 'Voir le flow builder' }}
        />
      </Section>
      <Section>
        <FeatureRow
          reverse
          title={<>Webhooks et API pour <span className="kw">vos systèmes</span></>}
          text="Avec le forfait Centre d’appels, recevez chaque fin d’appel et ses données extraites dans vos propres systèmes, ou pilotez l’agent depuis votre logiciel."
          points={['Webhook après chaque appel', 'Variables extraites : résultat, intérêt, créneau', 'Outils MCP pour vos assistants']}
          mock={<Mock kind="report" />}
        />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
