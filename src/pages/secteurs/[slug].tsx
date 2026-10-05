import Link from 'next/link';
// Landing sectorielle type (doc 114) : hero métier, badges, CTA, rappel, ce que l’agent fait,
// ce que ça inclut, intégrations, économie, sécurité, FAQ métier, preuve visuelle, CTA final.
import React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import LiveCall from '@/components/LiveCall';
import { BeforeAfter, PortalPreview } from '@/components/extras';
import { CTAs, CallbackForm, FaqDark, Heading, Section, Tick, TrialBadges } from '@/components/ui';
import {
  DemoBlock, EconomyBlock, FinalCTA, GrowthLines, IntegrationsGrid, ModuleCards, PricingCards, SECTOR_ICON,
  SectorCards, SectorVisual, SecurityBlock, Steps,
} from '@/components/blocks';
import { SECTORS, Sector } from '@/data/sectors';
import { SITE } from '@/data/site';
import { offer } from '@/data/offers';

export default function SectorPage({ slug }: { slug: string }) {
  const s = SECTORS.find((x) => x.slug === slug) as Sector;
  const Icon = SECTOR_ICON[s.slug];
  return (
    <Layout
      title={`${s.name} : agent vocal IA 24/7 — Permanence IA`}
      description={`${s.name} : ${s.short.replace(/\.$/, '')}. Essai gratuit 14 jours, 30 minutes incluses, prix HT.`.slice(0, 158)}
      breadcrumbs={[{ name: 'Secteurs', path: '/secteurs' }, { name: s.name, path: `/secteurs/${s.slug}` }]}
      ogImage={s.photo}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'FAQPage', url: `${SITE.url}/secteurs/${s.slug}`,
        mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }}
    >
      {/* Hero métier */}
      <section className="overflow-hidden bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 font-display text-sm font-semibold text-signal-deep"><Icon className="h-4 w-4" aria-hidden />{s.name}</p>
            <h1 className="mt-3 text-hero font-extrabold">{s.title}</h1>
            <p className="mt-5 max-w-prose text-lg">{s.subtitle}</p>
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" primary={s.ctas[0]} sector={s.slug} />
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <SectorVisual s={s} className="absolute -right-10 top-0 hidden h-[80%] w-[70%] rounded-3xl sm:block" />
            <div className="relative pt-10 sm:mr-28 sm:pt-20"><LiveCall title={`Agent ${s.name.toLowerCase()}`} call={s.call} lead={s.lead} /></div>
          </div>
        </div>
      </section>

      {/* Problème métier : avant / après */}
      <Section>
        <Heading title="Ce qui change quand l’agent répond à votre place" intro={`${s.targets}. Dans votre métier, chaque appel sans réponse est une demande qui part ailleurs.`} />
        <div className="mt-10"><BeforeAfter before={s.problems} after={s.benefits.slice(0, 3)} /></div>
      </Section>

      {/* Ce que l’agent prend en charge + preuve visuelle */}
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading title="Ce que l’agent prend en charge pour votre activité" intro="Il pose les questions que vous poseriez, dans un ordre naturel, et vous transmet une demande complète." />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">{s.handles.map((h) => <Tick key={h}>{h}</Tick>)}</ul>
          </div>
          <figure>
            <SectorVisual s={s} className="aspect-[3/2] rounded-3xl" />
            <figcaption className="mt-4 text-[15px] italic">{s.caption}</figcaption>
          </figure>
        </div>
      </Section>

      {/* Bénéfices */}
      <Section>
        <Heading title={`Ce que ça change pour votre ${s.name === 'Immobilier' ? 'agence' : 'activité'}`} />
        <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {s.benefits.map((b) => <li key={b} className="border-t-2 border-ink pt-4 font-display text-lg font-semibold text-ink">{b}</li>)}
        </ul>
      </Section>

      {/* Comment ça fonctionne */}
      <Section tone="paper">
        <Heading title="Comment ça fonctionne" />
        <div className="mt-10"><Steps steps={s.steps} /></div>
      </Section>

      {/* Ce que ça inclut */}
      <Section>
        <Heading title="Ce que ça inclut" intro="Les modules les plus utiles pour votre métier, tous disponibles dans votre espace." />
        <div className="mt-10"><ModuleCards slugs={s.modules} /></div>
      </Section>

      <Section tone="paper"><PortalPreview /></Section>

      <DemoBlock sector={s.slug} />

      {/* Intégrations */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Heading title="Intégrations utiles" intro="Votre agenda, votre CRM, vos messageries et votre téléphonie restent les mêmes : l’agent s’y connecte." />
          <IntegrationsGrid max={8} />
        </div>
      </Section>

      <Section tone="paper"><EconomyBlock /></Section>

      {/* Prix HT */}
      <Section>
        <Heading title="Prix HT, sans engagement" intro={`Pour ${s.name.toLowerCase()}, nous recommandons le forfait ${offer(s.offer).name}. Commencez par l’essai gratuit : 14 jours et 30 minutes incluses.`} />
        <p className="mt-3"><Link href={`/offres/${s.offer}`} className="font-semibold text-signal-deep underline">Voir le détail du forfait {offer(s.offer).name}</Link></p>
        <div className="mt-10"><PricingCards only={['receptionniste', 'assistant', 'centre-appels']} /></div>
        <GrowthLines className="mt-6" />
      </Section>

      <Section tone="paper"><SecurityBlock /></Section>

      {/* FAQ métier + rappel */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading title={`Questions fréquentes — ${s.name}`} />
            <div className="mt-8"><FaqDark items={s.faq} /></div>
          </div>
          <div className="rounded-3xl bg-paper p-6 sm:p-8">
            <p className="font-display text-xl font-bold">Contactez-nous, laissez votre numéro, on vous rappelle</p>
            <p className="mb-5 mt-1 text-[15px]">Un conseiller vous rappelle pour étudier votre cas.</p>
            <CallbackForm sector={s.slug} />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title="Autres secteurs" />
        <div className="mt-10"><SectorCards exclude={s.slug} /></div>
      </Section>

      <FinalCTA title="Prêt à ne plus manquer un appel ?" sector={s.slug} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({ paths: SECTORS.map((s) => ({ params: { slug: s.slug } })), fallback: false });
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
