import React from 'react';
import Layout from '@/components/Layout';
import LiveCall from '@/components/LiveCall';
import { CallbackForm, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, SectorCards, Steps, VoicesNumbers } from '@/components/blocks';
import { SECTORS } from '@/data/sectors';

export default function Demo() {
  const s = SECTORS[1];
  return (
    <Layout title="Démo live — essayez l’agent vocal IA · Permanence IA" description="Essayez en live notre agent : parlez-lui ou recevez un appel de démonstration adapté à votre secteur. Gratuit et sans engagement.">
      <section className="bg-night text-white/75">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <h1 className="text-hero font-extrabold text-white">Essayez en live notre agent maintenant</h1>
            <p className="mt-5 max-w-prose text-lg">Laissez votre numéro et choisissez votre secteur : l’agent vous appelle et joue un scénario de votre métier. Vous entendez sa voix, son rythme et la façon dont il qualifie une demande.</p>
            <TrialBadges dark className="mt-6" />
          </div>
          <div className="rounded-3xl bg-white p-6 text-slate sm:p-8">
            <p className="font-display text-xl font-bold">Recevoir mon appel de démonstration</p>
            <p className="mb-5 mt-1 text-[15px]">Appel gratuit, au créneau de votre choix.</p>
            <CallbackForm type="demo" submitLabel="Recevoir l’appel de démo" />
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading title="Ce que vous allez entendre" intro="Un exemple d’appel dans un cabinet dentaire : l’agent identifie la demande, propose un créneau et prépare la fiche pour l’équipe." />
            <div className="mt-10"><Steps steps={[
              { title: 'Vous laissez votre numéro', text: 'Avec votre secteur et votre créneau.' },
              { title: 'L’agent vous appelle', text: 'Il joue un scénario de votre métier.' },
              { title: 'Vous testez librement', text: 'Posez vos questions, changez d’avis, interrompez-le.' },
            ]} /></div>
          </div>
          <LiveCall title="Agent dentaire" call={s.call} lead={s.lead} />
        </div>
      </Section>
      <Section tone="paper"><VoicesNumbers /></Section>
      <Section><Heading title="Choisissez votre scénario" /><div className="mt-10"><SectorCards /></div></Section>
      <FinalCTA />
    </Layout>
  );
}
