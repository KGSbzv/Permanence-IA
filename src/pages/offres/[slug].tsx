import React from 'react';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Check, Minus } from 'lucide-react';
import Layout from '@/components/Layout';
import Mock from '@/components/Mock';
import { CTAs, FaqDark, Heading, Section, TrialBadges } from '@/components/ui';
import { FinalCTA, GrowthBlock, ModuleCards, PricingCards, RechargeTables } from '@/components/blocks';
import { MATRIX, OFFERS, Offer, OfferSlug, euro } from '@/data/offers';
import { FAQ_PRICING } from '@/data/faq';
import { PRICE_NOTE, SIGNUP_URL } from '@/data/site';

const MODULES_BY_OFFER: Record<OfferSlug, string[]> = {
  decouverte: ['demo-live', 'widget-web', 'base-de-connaissances'],
  receptionniste: ['receptionniste-ia', 'prise-de-rendez-vous', 'widget-web', 'editeur-de-prompts', 'base-de-connaissances', 'reporting'],
  assistant: ['flow-builder', 'qualification-des-leads', 'campagnes-sortantes', 'whatsapp-messages', 'sip-numeros', 'prise-de-rendez-vous'],
  'centre-appels': ['reporting', 'base-de-connaissances', 'flow-builder', 'support-client', 'campagnes-sortantes', 'sip-numeros'],
  'sur-mesure': ['sip-numeros', 'flow-builder', 'reporting', 'support-client', 'qualification-des-leads', 'campagnes-sortantes'],
};
const MOCK: Record<OfferSlug, 'call' | 'calendar' | 'flow' | 'report' | 'numbers'> = {
  decouverte: 'call', receptionniste: 'calendar', assistant: 'flow', 'centre-appels': 'report', 'sur-mesure': 'numbers',
};

export default function OfferPage({ slug }: { slug: OfferSlug }) {
  const o = OFFERS.find((x) => x.slug === slug) as Offer;
  const included = MATRIX.flatMap((g) => g.rows).map((r) => ({ label: r.label, v: r.cells[slug] }));
  const primaryHref = slug === 'sur-mesure' ? '/contact' : `${SIGNUP_URL}?plan=${slug}`;
  const price = o.price === null ? o.priceLabel! : euro(o.price);

  return (
    <Layout title={`Forfait ${o.name} — ${price}${o.price ? ' HT / mois' : ''} · Permanence IA`} description={`${o.title}. ${o.minutes}. 14 jours d’essai gratuit, 30 minutes incluses, prix HT, sans engagement.`}>
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="font-display text-sm font-semibold text-signal-deep">Forfait {o.name} · {o.audience}</p>
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
            <p className="mt-3 font-display text-4xl font-bold text-ink">{price}<span className="ml-1 text-base font-medium text-slate">{o.price ? 'HT / mois' : ''}</span></p>
            {o.perMinute && <p className="mt-1 text-sm">soit {o.perMinute} dans le forfait</p>}
            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[15px]">
              <div className="flex justify-between gap-4"><dt>Minutes incluses</dt><dd className="font-semibold text-ink">{o.minutes}</dd></div>
              <div className="flex justify-between gap-4"><dt>Besoin de plus ?</dt><dd className="text-right font-semibold text-ink">{o.slug === 'sur-mesure' ? 'Volume négocié' : 'Recharge à tout moment'}</dd></div>
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

      {o.perMinute && (
        <>
          <Section>
            <Heading title="Minutes supplémentaires" intro="Un mois plus chargé ? Ajoutez une recharge. Un volume qui grandit ? Passez au forfait supérieur." />
            <div className="mt-10"><RechargeTables /></div>
          </Section>
          <Section tone="paper"><GrowthBlock /></Section>
        </>
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
