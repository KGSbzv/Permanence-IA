// Sous-page module (doc 114) : hero, à quoi ça sert, comment ça marche, cas d’usage, intégrations, CTA.
import React from 'react';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, Heading, Section, Tick, TrialBadges } from '@/components/ui';
import { FinalCTA, ModuleCards, Steps } from '@/components/blocks';
import { MODULES, Module } from '@/data/modules';
import { offer } from '@/data/offers';

export default function ModulePage({ slug }: { slug: string }) {
  const m = MODULES.find((x) => x.slug === slug) as Module;
  const from = offer(m.from);
  const related = MODULES.filter((x) => x.slug !== m.slug && x.family === m.family).map((x) => x.slug);
  const more = [...related, ...MODULES.filter((x) => x.slug !== m.slug && x.family !== m.family).map((x) => x.slug)].slice(0, 3);

  return (
    <Layout title={`${m.name} — Permanence IA`} description={`${m.title}. ${m.intro.slice(0, 120)}…`}>
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="font-display text-sm font-semibold text-signal-deep">{m.family} · {m.name}</p>
            <h1 className="mt-3 text-hero font-extrabold">{m.title}</h1>
            <p className="mt-5 max-w-prose text-lg">{m.intro}</p>
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" />
          </div>
          <div className="mx-auto w-full max-w-md"><Mock kind={m.mock} /></div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading title="À quoi ça sert" />
            <ul className="mt-8 space-y-4 text-lg">{m.uses.map((u) => <Tick key={u}>{u}</Tick>)}</ul>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-8">
            <p className="font-display text-lg font-bold">Inclus à partir de l’offre {from.name}</p>
            <p className="mt-2 text-[15px]">{from.launchPrice ? `${from.launchPrice} € HT / mois au lancement · ${from.minutes}` : from.minutes}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/offres/${from.slug}`} className="btn-primary text-sm">Voir l’offre {from.name}</Link>
              <Link href="/tarifs#comparatif" className="btn-ghost text-sm">Comparer les offres</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title="Comment ça marche" />
        <div className="mt-10"><Steps steps={m.steps} /></div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading title="Cas d’usage" />
            <ul className="mt-8 space-y-3">{m.cases.map((c) => <li key={c} className="rounded-xl border border-line bg-white px-5 py-4 font-medium text-ink">{c}</li>)}</ul>
          </div>
          <div>
            <Heading title="Intégrations liées" />
            <ul className="mt-8 flex flex-wrap gap-2">{m.integrations.map((i) => <li key={i} className="rounded-full bg-signal-soft px-4 py-2 font-medium text-ink">{i}</li>)}</ul>
            <Link href="/integrations" className="mt-6 inline-block font-semibold text-signal-deep hover:underline">Toutes les intégrations</Link>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title="À découvrir aussi" />
        <div className="mt-10"><ModuleCards slugs={more} /></div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({ paths: MODULES.map((m) => ({ params: { slug: m.slug } })), fallback: false });
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
