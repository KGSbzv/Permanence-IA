import React from 'react';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Check, Minus } from 'lucide-react';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, FaqDark, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, LaunchBlock, ModuleCards, PricingCards, RechargeTables } from '@/components/blocks';
import { MATRIX, OFFERS, Offer, OfferSlug, euro } from '@/data/offers';
import { FAQ_PRICING } from '@/data/faq';
import { PRICE_NOTE, SIGNUP_URL } from '@/data/site';

const MODULES_BY_OFFER: Record<OfferSlug, string[]> = {
  decouverte: ['demo-live', 'widget-web', 'base-de-connaissances'],
  essentiel: ['receptionniste-ia', 'prise-de-rendez-vous', 'widget-web', 'editeur-de-prompts', 'base-de-connaissances', 'reporting'],
  croissance: ['flow-builder', 'qualification-des-leads', 'campagnes-sortantes', 'whatsapp-messages', 'sip-numeros', 'prise-de-rendez-vous'],
  pro: ['reporting', 'base-de-connaissances', 'flow-builder', 'support-client', 'campagnes-sortantes', 'sip-numeros'],
  'sur-mesure': ['sip-numeros', 'flow-builder', 'reporting', 'support-client', 'qualification-des-leads', 'campagnes-sortantes'],
};
const MOCK: Record<OfferSlug, 'call' | 'calendar' | 'flow' | 'report' | 'numbers'> = {
  decouverte: 'call', essentiel: 'calendar', croissance: 'flow', pro: 'report', 'sur-mesure': 'numbers',
};

export default function OfferPage({ slug }: { slug: OfferSlug }) {
  const o = OFFERS.find((x) => x.slug === slug) as Offer;
  const included = MATRIX.flatMap((g) => g.rows).map((r) => ({ label: r.label, v: r.cells[slug] }));
  const primaryHref = slug === 'sur-mesure' ? '/contact' : SIGNUP_URL;
  const price = o.launchPrice === null ? o.priceLabel : o.launchPrice === 0 ? '0 €' : euro(o.launchPrice);

  return (
    <Layout title={`Offre ${o.name} — ${price} HT · Permanence IA`} description={`${o.title}. ${o.minutes}. 14 jours d’essai gratuit, 30 minutes incluses, prix HT, sans engagement.`}>
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="font-display text-sm font-semibold text-signal-deep">Offre {o.name} · {o.audience}</p>
            <h1 className="mt-3 text-hero font-extrabold">{o.title}</h1>
            <p className="mt-5 max-w-prose text-lg">{o.pitch}</p>
            <TrialBadges className="mt-6" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={primaryHref} className="btn-primary">{o.cta}</Link>
              <Link href="/demo" className="btn-ghost">Essayer en live notre agent</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-7 shadow-card">
            <p className="font-display text-lg font-bold">{o.name}</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink">{price}<span className="ml-1 text-base font-medium text-slate">{o.launchPrice === 0 ? '' : 'HT / mois'}</span></p>
            {o.launchPrice ? <p className="mt-1 text-sm">Tarif de lancement · ensuite {euro(o.normalPrice!)} HT / mois</p> : null}
            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[15px]">
              <div className="flex justify-between gap-4"><dt>Minutes incluses</dt><dd className="font-semibold text-ink">{o.minutes}</dd></div>
              <div className="flex justify-between gap-4"><dt>Au-delà</dt><dd className="text-right font-semibold text-ink">{o.overage}</dd></div>
              <div className="flex justify-between gap-4"><dt>Engagement</dt><dd className="font-semibold text-ink">Aucun</dd></div>
            </dl>
            <p className="mt-5 text-xs text-slate-light">{PRICE_NOTE}</p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Heading title="Ce que vous trouvez dans votre interface" intro="La liste exacte des fonctions accessibles avec cette offre." />
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {included.map((i) => (
                <li key={i.label} className={`flex gap-2.5 text-[15px] ${i.v === false ? 'text-slate-light' : 'text-ink'}`}>
                  {i.v === false ? <Minus className="mt-1 h-4 w-4 shrink-0" aria-label="Non inclus" /> : <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-label="Inclus" />}
                  <span>{i.label}{typeof i.v === 'string' && <span className="text-slate"> — {i.v}</span>}</span>
                </li>
              ))}
            </ul>
            <Link href="/tarifs#comparatif" className="mt-8 inline-block font-semibold text-signal-deep hover:underline">Comparer avec les autres offres</Link>
          </div>
          <div className="lg:pt-24"><Mock kind={MOCK[slug]} /></div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title="Les modules au cœur de cette offre" />
        <div className="mt-10"><ModuleCards slugs={MODULES_BY_OFFER[slug]} /></div>
      </Section>

      {slug === 'pro' && <Section><LaunchBlock /></Section>}
      {(slug === 'essentiel' || slug === 'croissance' || slug === 'pro') && (
        <Section tone={slug === 'pro' ? 'paper' : 'white'}>
          <Heading title="Minutes supplémentaires" intro="Si votre volume augmente, ajoutez des minutes sans changer d’offre." />
          <div className="mt-10"><RechargeTables /></div>
        </Section>
      )}

      <Section>
        <Heading title="Les autres offres" />
        <div className="mt-10"><PricingCards only={OFFERS.filter((x) => x.slug !== slug).map((x) => x.slug)} /></div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div><Heading title="Questions fréquentes" /><CTAs className="mt-8" /></div>
          <FaqDark items={FAQ_PRICING} />
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({ paths: OFFERS.map((o) => ({ params: { slug: o.slug } })), fallback: false });
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
