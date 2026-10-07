// Sous-page module (doc 114) : hero, à quoi ça sert, comment ça marche, cas d’usage, intégrations, CTA.
import React from 'react';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, FaqDark, Heading, Section, TalkNowPill, Tick, TrialBadges, WhatsAppStarters } from '@/components/ui';
import {
  BillingProvider, DemoBlock, EconomyBlock, FinalCTA, IncludedStack, MatrixTable, ModuleCards, PricingCards, SecurityBlock, Steps,
} from '@/components/blocks';
import { AgentTeam } from '@/components/extras';
import type { Module } from '@/i18n/content/fr/modules';
import { useI18n } from '@/i18n';
import { fr } from '@/i18n/content/fr';

// Slugs identiques dans toutes les langues : la liste vient du contenu français.
const SLUGS = fr.modules.map((m) => m.slug);

export default function ModulePage({ slug }: { slug: string }) {
  const { c, market, offer, money } = useI18n();
  const t = c.ui.commerce.feature;
  const home = c.ui.commerce.home;
  const tm = c.ui.commerce.tarifs.matrix;
  const MODULES = c.modules;
  const m = MODULES.find((x) => x.slug === slug) as Module;
  const from = offer(m.from);
  const related = MODULES.filter((x) => x.slug !== m.slug && x.family === m.family).map((x) => x.slug);
  const more = [...related, ...MODULES.filter((x) => x.slug !== m.slug && x.family !== m.family).map((x) => x.slug)].slice(0, 3);

  return (
    <Layout
      title={t.meta.title(m.name, market.brand)}
      description={t.meta.description(m.short.replace(/\.$/, ''), from.name, market.trial.days).slice(0, 158)}
      breadcrumbs={[{ name: t.breadcrumb, path: '/fonctionnalites' }, { name: m.name, path: `/fonctionnalites/${m.slug}` }]}
    >
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-20">
          <div>
            <TalkNowPill className="mb-5" />
            <p className="font-display text-sm font-semibold text-signal-deep">{t.eyebrow(m.family, m.name)}</p>
            <h1 className="mt-3 text-hero font-extrabold">{m.title}</h1>
            <p className="mt-5 max-w-prose text-lg">{m.intro}</p>
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" />
            {m.slug === 'whatsapp-messages' && (
              <div className="mt-8 max-w-prose rounded-2xl border border-[#25D366]/40 bg-[#25D366]/5 p-5">
                <p className="font-display font-semibold text-ink">{c.site.whatsapp.tryTitle}</p>
                <p className="mt-1 text-[15px]">{c.site.whatsapp.tryText}</p>
                <WhatsAppStarters place="module_whatsapp" className="mt-4" />
              </div>
            )}
          </div>
          <div className="mx-auto w-full max-w-md"><Mock kind={m.mock} /></div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading title={t.uses.title} />
            <ul className="mt-8 space-y-4 text-lg">{m.uses.map((u) => <Tick key={u}>{u}</Tick>)}</ul>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-8">
            <p className="font-display text-lg font-bold">{t.from.title(from.name)}</p>
            <p className="mt-2 text-[15px]">{from.price ? t.from.priceLine(money(from.price), from.minutes) : from.minutes}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/offres/${from.slug}`} className="btn-primary text-sm">{t.from.offerLink(from.name)}</Link>
              <Link href="#comparatif" className="btn-ghost text-sm">{t.from.compare}</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title={t.how.title} />
        <div className="mt-10"><Steps steps={m.steps} /></div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading title={t.cases.title} />
            <ul className="mt-8 space-y-3">{m.cases.map((u) => <li key={u} className="rounded-xl border border-line bg-white px-5 py-4 font-medium text-ink">{u}</li>)}</ul>
          </div>
          <div>
            <Heading title={t.integrations.title} />
            <ul className="mt-8 flex flex-wrap gap-2">{m.integrations.map((i) => <li key={i} className="rounded-full bg-signal-soft px-4 py-2 font-medium text-ink">{i}</li>)}</ul>
            <Link href="/integrations" className="mt-6 inline-block font-semibold text-signal-deep hover:underline">{t.integrations.link}</Link>
          </div>
        </div>
      </Section>

      {/* Chaque landing reçoit sa propre publicité : démo, agents, prix, comparatif, « tout inclus », sécurité et FAQ y sont présents. */}
      <DemoBlock />

      <Section tone="paper"><AgentTeam /></Section>

      {/* Le choix mensuel / annuel des cartes se répercute sur le comparatif. */}
      <BillingProvider>
      <Section id="tarifs">
        <Heading center title={home.pricing.title} intro={home.pricing.intro} />
        <div className="mt-12"><PricingCards /></div>
        <p className="mt-6 text-center text-sm text-slate-light">{c.site.priceNote(money(market.phoneNumberFrom, 2))}</p>
      </Section>

      <Section tone="paper" id="comparatif">
        <Heading title={tm.title} intro={tm.intro} />
        <div className="mt-10"><MatrixTable /></div>
      </Section>
      </BillingProvider>

      <Section><EconomyBlock /></Section>

      <Section tone="paper"><IncludedStack /></Section>

      <Section><SecurityBlock /></Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div><Heading title={home.faq.title} intro={home.faq.intro} /><CTAs className="mt-8" /></div>
          <FaqDark items={[...c.faq.general.slice(0, 6), c.faq.pricing[2], c.faq.general[c.faq.general.length - 1]]} />
        </div>
      </Section>

      <Section>
        <Heading title={t.more.title} />
        <div className="mt-10"><ModuleCards slugs={more} /></div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => ({
  paths: (locales ?? ['fr']).flatMap((locale) => SLUGS.map((slug) => ({ params: { slug }, locale }))),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
