import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section, Tick } from '@/components/ui';
import { FinalCTA } from '@/components/blocks';
import { SITE } from '@/data/site';

export default function About() {
  return (
    <Layout title="À propos — Permanence IA" description="Permanence IA aide les entreprises à répondre à chaque appel grâce à des agents vocaux IA. Une marque de SINAY STRATEGIC LLC.">
      <section className="bg-paper"><div className="wrap py-14 lg:py-20"><Heading as="h1" title="Chaque appel mérite une réponse" intro="Permanence IA est née d’un constat simple : les petites entreprises perdent des clients parce que personne ne peut décrocher au bon moment." /></div></section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4 text-lg">
            <p>Artisans, cabinets, agences, garages, salons, restaurants : vos équipes sont occupées à servir vos clients. Pendant ce temps, le téléphone sonne.</p>
            <p>Nous mettons à votre disposition des agents vocaux IA qui répondent, qualifient, réservent et rappellent, configurés pour votre métier, avec des prix clairs et sans engagement.</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Nos principes</h2>
            <ul className="mt-6 space-y-3">
              <Tick>L’agent se présente honnêtement comme une IA</Tick>
              <Tick>L’humain garde la main sur les cas importants</Tick>
              <Tick>Des prix HT affichés, sans frais cachés</Tick>
              <Tick>Pas de chiffre ni de promesse que nous ne pouvons pas prouver</Tick>
            </ul>
            <p className="mt-8 text-sm text-slate-light">Permanence IA est une marque de {SITE.company}, société enregistrée dans l’État du Wyoming (États-Unis) sous le numéro 2026-001905061.</p>
          </div>
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}
