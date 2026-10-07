import Link from 'next/link';
// Landing sectorielle type (doc 114) : hero métier, badges, CTA, rappel, ce que l’agent fait,
// ce que ça inclut, intégrations, économie, sécurité, FAQ métier, preuve visuelle, CTA final.
import React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import LiveCall from '@/components/LiveCall';
import { AgentTeam, BeforeAfter, PortalPreview } from '@/components/extras';
import { CTAs, CallbackForm, FaqDark, Heading, Section, TalkNowPill, Tick, TrialBadges } from '@/components/ui';
import {
  BillingProvider, DemoBlock, EconomyBlock, FinalCTA, GrowthLines, IncludedStack, IntegrationsGrid, MatrixTable,
  ModuleCards, PricingCards, SECTOR_ICON,
  SectorCards, SectorVisual, SecurityBlock, Steps,
} from '@/components/blocks';
import type { Sector } from '@/i18n/content/fr/sectors';
import { SITE, isActiveSector } from '@/data/site';
import { useI18n } from '@/i18n';
import { fr } from '@/i18n/content/fr';

// Slugs identiques dans toutes les langues : la liste vient du contenu français.
const SLUGS = fr.sectors.map((s) => s.slug);

/** Avertissement des secteurs de santé en pause : accueil administratif seulement, aucune donnée de santé demandée. */
const HEALTH_NOTICE: Record<string, { title: string; text: string }> = {
  fr: { title: 'Accueil administratif uniquement', text: 'Pour les cabinets et établissements de santé, l’agent assure seulement l’accueil administratif : prise de rendez-vous, horaires, adresse et informations pratiques. Il ne demande aucune information de santé (symptômes, motif médical) et oriente vers le praticien ou les urgences. Nous ne proposons pas, à ce jour, d’hébergement certifié HDS : l’enregistrement et la transcription des appels peuvent être désactivés. Parlons de votre cas avant de démarrer.' },
  en: { title: 'Front-desk tasks only', text: 'For healthcare practices, the agent handles front-desk tasks only: appointments, opening hours, address and practical information. It never asks for health information (symptoms, medical reasons) and refers callers to the practitioner or emergency services. Call recording and transcription can be switched off. Let’s talk about your situation before you start.' },
  it: { title: 'Solo accoglienza amministrativa', text: 'Per studi e strutture sanitarie l’agente si occupa solo dell’accoglienza amministrativa: appuntamenti, orari, indirizzo e informazioni pratiche. Non chiede alcuna informazione sanitaria (sintomi, motivo medico) e indirizza al professionista o ai servizi di emergenza. La registrazione e la trascrizione delle chiamate si possono disattivare. Ne parliamo prima di iniziare?' },
  pl: { title: 'Wyłącznie obsługa administracyjna', text: 'W placówkach medycznych agent zajmuje się wyłącznie obsługą administracyjną: wizytami, godzinami otwarcia, adresem i informacjami praktycznymi. Nie pyta o żadne informacje o zdrowiu (objawy, powód medyczny) i kieruje do lekarza lub na numer alarmowy. Nagrywanie i transkrypcję rozmów można wyłączyć. Porozmawiajmy o Twojej sytuacji przed startem.' },
  nl: { title: 'Alleen administratieve ontvangst', text: 'Voor zorgpraktijken verzorgt de agent alleen de administratieve ontvangst: afspraken, openingstijden, adres en praktische informatie. Hij vraagt nooit naar gezondheidsinformatie (klachten, medische reden) en verwijst door naar de zorgverlener of de spoeddienst. Opname en transcriptie van gesprekken kunnen worden uitgeschakeld. Laten we uw situatie bespreken voordat u start.' },
  he: { title: 'קבלה מנהלית בלבד', text: 'במרפאות ובמוסדות בריאות הסוכנת מטפלת רק בקבלה המנהלית: קביעת תורים, שעות פעילות, כתובת ומידע מעשי. היא לא שואלת שום מידע רפואי (תסמינים, סיבה רפואית) ומפנה לרופא או לשירותי החירום. אפשר לכבות את ההקלטה ואת התמלול של השיחות. בואו נדבר על המקרה שלכם לפני שמתחילים.' },
};

export default function SectorPage({ slug }: { slug: string }) {
  const { c, market, offer, path, money, locale } = useI18n();
  const t = c.ui.commerce.sector;
  const tm = c.ui.commerce.tarifs.matrix;
  const { days, minutes } = market.trial;
  const s = c.sectors.find((x) => x.slug === slug) as Sector;
  const paused = !isActiveSector(s);
  const notice = HEALTH_NOTICE[locale.startsWith('en') ? 'en' : locale] || HEALTH_NOTICE.en;
  const Icon = SECTOR_ICON[s.slug] || Sparkles;
  return (
    <Layout
      title={t.meta.title(s.name, market.brand)}
      description={t.meta.description(s.name, s.short.replace(/\.$/, ''), days, minutes).slice(0, 158)}
      breadcrumbs={[{ name: t.breadcrumb, path: '/secteurs' }, { name: s.name, path: `/secteurs/${s.slug}` }]}
      ogImage={s.photo || undefined}
      noindex={paused}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'FAQPage', url: `${SITE.url}${path(`/secteurs/${s.slug}`)}`,
        mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }}
    >
      {paused && (
        <div role="note" className="border-b border-amber-200 bg-amber-50">
          <div className="wrap py-4 text-[15px] text-ink"><strong className="font-display">{notice.title}.</strong> {notice.text}</div>
        </div>
      )}
      {/* Hero métier */}
      <section className="overflow-hidden bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <TalkNowPill className="mb-5" />
            <p className="inline-flex items-center gap-2 font-display text-sm font-semibold text-signal-deep"><Icon className="h-4 w-4" aria-hidden />{s.name}</p>
            <h1 className="mt-3 text-hero font-extrabold">{s.title}</h1>
            <p className="mt-5 max-w-prose text-lg">{s.subtitle}</p>
            <TrialBadges className="mt-6" />
            <CTAs className="mt-8" primary={s.ctas[0]} sector={s.slug} />
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <SectorVisual s={s} className="absolute -end-10 top-0 hidden h-[80%] w-[70%] rounded-3xl sm:block" />
            <div className="relative pt-10 sm:me-28 sm:pt-20"><LiveCall title={t.liveCallTitle(s.name)} call={s.call} lead={s.lead} /></div>
          </div>
        </div>
      </section>

      {/* Problème métier : avant / après */}
      <Section>
        <Heading title={t.change.title} intro={t.change.intro(s.targets)} />
        <div className="mt-10"><BeforeAfter before={s.problems} after={s.benefits.slice(0, 3)} /></div>
      </Section>

      {/* Ce que l’agent prend en charge + preuve visuelle */}
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading title={t.handles.title} intro={t.handles.intro} />
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
        <Heading title={t.benefitsTitle(s.slug)} />
        <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {s.benefits.map((b) => <li key={b} className="border-t-2 border-ink pt-4 font-display text-lg font-semibold text-ink">{b}</li>)}
        </ul>
      </Section>

      {/* Comment ça fonctionne */}
      <Section tone="paper">
        <Heading title={t.how.title} />
        <div className="mt-10"><Steps steps={s.steps} /></div>
      </Section>

      {/* Ce que ça inclut */}
      <Section>
        <Heading title={t.includes.title} intro={t.includes.intro} />
        <div className="mt-10"><ModuleCards slugs={s.modules} /></div>
      </Section>

      <Section tone="paper"><PortalPreview /></Section>

      <DemoBlock sector={s.slug} />

      {/* Les agents (visages et voix) : chaque landing est autonome, elle reçoit sa propre publicité. */}
      <Section tone="paper"><AgentTeam /></Section>

      {/* Intégrations */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Heading title={t.integrations.title} intro={t.integrations.intro} />
          <IntegrationsGrid max={8} />
        </div>
      </Section>

      <Section tone="paper"><EconomyBlock /></Section>

      {/* Prix HT */}
      {/* Le choix mensuel / annuel des cartes se répercute sur le comparatif. */}
      <BillingProvider>
      <Section>
        <Heading title={t.pricing.title} intro={t.pricing.intro(s.name, offer(s.offer).name, days, minutes)} />
        <p className="mt-3"><Link href={`/offres/${s.offer}`} className="font-semibold text-signal-deep underline">{t.pricing.link(offer(s.offer).name)}</Link></p>
        <div className="mt-10"><PricingCards only={['receptionniste', 'assistant', 'centre-appels']} /></div>
        <GrowthLines className="mt-6" />
        <p className="mt-4 text-sm text-slate-light">{c.site.priceNote(money(market.phoneNumberFrom, 2))}</p>
      </Section>

      <Section tone="paper" id="comparatif">
        <Heading title={tm.title} intro={tm.intro} />
        <div className="mt-10"><MatrixTable /></div>
      </Section>
      </BillingProvider>

      <Section><IncludedStack /></Section>

      <Section tone="paper"><SecurityBlock /></Section>

      {/* FAQ métier + rappel */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading title={t.faq.title(s.name)} />
            <div className="mt-8"><FaqDark items={s.faq} /></div>
          </div>
          <div className="rounded-3xl bg-paper p-6 sm:p-8">
            <p className="font-display text-xl font-bold">{t.callback.title}</p>
            <p className="mb-5 mt-1 text-[15px]">{t.callback.text}</p>
            <CallbackForm sector={s.slug} />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading title={t.others.title} />
        <div className="mt-10"><SectorCards exclude={s.slug} /></div>
      </Section>

      <FinalCTA title={t.finalCta} sector={s.slug} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => ({
  paths: (locales ?? ['fr']).flatMap((locale) => SLUGS.map((slug) => ({ params: { slug }, locale }))),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
