import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section } from '@/components/ui';
import { SITE } from '@/data/site';

export default function Cookies() {
  return (
    <Layout title="Politique cookies — Permanence IA" description="Cookies et traceurs utilisés sur le site Permanence IA.">
      <section className="bg-paper"><div className="wrap py-14"><Heading as="h1" title="Politique cookies" /></div></section>
      <Section>
        <div className="max-w-prose space-y-5">
          <p>Le site {SITE.url.replace('https://', '')} utilise uniquement les cookies strictement nécessaires à son fonctionnement (sécurité, équilibrage de charge). Aucun cookie publicitaire ni de mesure d’audience tiers n’est déposé à ce jour.</p>
          <p>Si des outils de mesure d’audience ou de publicité sont ajoutés, un bandeau vous demandera votre consentement avant tout dépôt, et cette page sera mise à jour avec la liste des cookies, leur finalité et leur durée.</p>
          <p>L’espace client (app.permanenceia.com) utilise des cookies de session nécessaires à la connexion.</p>
          <p>Questions : <a className="font-semibold text-signal-deep hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </Section>
    </Layout>
  );
}
