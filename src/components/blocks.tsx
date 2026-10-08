// Sections réutilisables des pages (docs 94, 95, 113, 114).
import React, { createContext, useContext, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowUpRight, BarChart3, Building2, HeartPulse, Landmark, ShoppingBag, CalendarDays, Car, Check, Database, Globe2, Home, KeyRound, Languages,
  Lock, Mail, MessageSquare, Minus, MonitorSmartphone, Network, PawPrint, Phone, X, Scale, Scissors, ScrollText, ShieldCheck, Sparkles, Stethoscope, UserCheck,
  UtensilsCrossed, Workflow, Wrench,
} from 'lucide-react';
import { MODULES as FR_MODULES } from '@/i18n/content/fr/modules';
import type { Sector } from '@/i18n/content/fr/sectors';
import type { Cell } from '@/i18n/content/fr/offers';
import { DEMO_URL, SIGNUP_URL, isActiveSector } from '@/data/site';
import { BRAND_MARKS } from '@/data/brandMarks';
import { getI18n, useI18n, type Offer } from '@/i18n';
import { CTAs, CallbackForm, FaqDark, Heading, Photo, Section, Tick, TrialBadges } from './ui';
import Mock from './Mock';
import { approx, useFx } from '@/lib/fx';
import LiveDemo from './LiveDemo';

/* ---------- Icônes ---------- */

// Icônes indexées sur les familles françaises (clés stables) : on retrouve la famille d’un module par son slug.
const FAMILY_ICON: Record<string, React.ElementType> = {
  'Téléphonie': Phone, Automatisation: Workflow, 'CRM et données': Database, Messages: MessageSquare, Agenda: CalendarDays, Pilotage: BarChart3,
};
const familyIcon = (slug: string) => FAMILY_ICON[FR_MODULES.find((m) => m.slug === slug)?.family ?? ''] || Sparkles;
export const SECTOR_ICON: Record<string, React.ElementType> = {
  'services-a-domicile': Wrench, 'dentaire-cliniques': Stethoscope, 'kines-paramedical': Activity, 'cliniques-veterinaires': PawPrint,
  immobilier: Home, automobile: Car, 'salons-de-coiffure': Scissors, 'beaute-bien-etre': Sparkles, 'restaurants-hotellerie': UtensilsCrossed,
  'avocats-experts-comptables': Scale, 'e-commerce': ShoppingBag, 'courtiers-assurance-credit': Landmark,
  'gestion-locative': Building2, 'medecine-esthetique': HeartPulse,
};

/* ---------- Ce que l’agent sait faire ---------- */

export function Benefits() {
  const { c } = useI18n();
  const t = c.ui.components.benefits;
  const items = t.items.map((i) => [i.title, i.text]);
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([t, d]) => (
        <div key={t} className="border-t-2 border-ink pt-4">
          <h3 className="text-h3 font-semibold">{t}</h3>
          <p className="mt-2 text-[15px]">{d}</p>
        </div>
      ))}
      <div className="flex items-end border-t-2 border-signal pt-4">
        <Link href="/fonctionnalites/receptionniste-ia" className="inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">{t.seeAgent}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ---------- Modules ---------- */

export function ModuleCards({ slugs, max }: { slugs?: string[]; max?: number }) {
  const { c } = useI18n();
  const list = (slugs ? slugs.map((s) => c.modules.find((m) => m.slug === s)!).filter(Boolean) : c.modules).slice(0, max);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((m) => {
        const Icon = familyIcon(m.slug);
        return (
          <Link key={m.slug} href={`/fonctionnalites/${m.slug}`} className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-soft"><Icon className="h-5 w-5 text-signal-deep" aria-hidden /></span>
            <h3 className="mt-4 text-h3 font-semibold">{m.name}</h3>
            <p className="mt-1.5 flex-1 text-[15px]">{m.short}</p>
            <span className="mt-4 text-sm font-semibold text-signal-deep group-hover:underline">{c.ui.components.moduleCards.seeIncluded}</span>
          </Link>
        );
      })}
    </div>
  );
}

/** Grand schéma « ce que ça inclut », organisé par familles (doc 95 §4). */
const INCLUDES_ICONS: React.ElementType[] = [Phone, Workflow, Database, MessageSquare, CalendarDays, BarChart3, ShieldCheck];

export function IncludesSchema() {
  const { c } = useI18n();
  const t = c.ui.components.includesSchema;
  const families: { name: string; icon: React.ElementType; items: string[] }[] = t.families.map((f, i) => ({ ...f, icon: INCLUDES_ICONS[i] || Sparkles }));
  return (
    <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-white">
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal"><Sparkles className="h-6 w-6" aria-hidden /></span>
          <p className="mt-5 font-display text-2xl font-bold leading-tight text-white">{t.centerTitle}</p>
          <p className="mt-2 text-[15px] text-white/70">{t.centerText}</p>
        </div>
        <Link href="/tarifs#comparatif" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-signal-glow hover:underline">{t.perOffer}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      {families.map((f) => (
        <div key={f.name} className="rounded-2xl border border-line bg-white p-5">
          <p className="flex items-center gap-2 font-display font-semibold text-ink"><f.icon className="h-4 w-4 text-signal" aria-hidden />{f.name}</p>
          <ul className="mt-3 space-y-1.5 text-[14px]">{f.items.map((i) => <li key={i} className="flex gap-2"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden />{i}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

/** Rangée alternée texte / maquette, comme dans les références. */
export function FeatureRow({ title, text, points, mock, reverse = false, link }: { title: React.ReactNode; text: string; points?: string[]; mock: React.ReactNode; reverse?: boolean; link?: { href: string; label: string } }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? 'lg:order-2' : ''}>
        <h3 className="font-display text-[1.75rem] font-bold leading-tight">{title}</h3>
        <p className="mt-3 max-w-prose">{text}</p>
        {points && <ul className="mt-5 space-y-2.5">{points.map((p) => <Tick key={p}>{p}</Tick>)}</ul>}
        {link && <Link href={link.href} className="mt-6 inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">{link.label}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>}
      </div>
      <div className={`mx-auto w-full max-w-md ${reverse ? 'lg:order-1' : ''}`}>{mock}</div>
    </div>
  );
}

/* ---------- Comment ça marche (séquence réelle → étapes numérotées) ---------- */

export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  const { c } = useI18n();
  return (
    <ol className={`grid gap-6 sm:grid-cols-2 ${steps.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-2xl border border-line bg-white p-6">
          <span className="font-display text-sm font-bold text-signal-deep">{c.ui.components.steps.step(i + 1)}</span>
          <h3 className="mt-2 text-h3 font-semibold">{s.title}</h3>
          <p className="mt-1.5 text-[15px]">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Démo live ---------- */

export function DemoBlock({ sector }: { sector?: string }) {
  const { c } = useI18n();
  const t = c.ui.components.demoBlock;
  return (
    <Section tone="night" id="demo">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-12">
        <Heading dark title={t.title} />
        <div>
          <p className="max-w-prose text-lg text-white/70">{t.intro}</p>
          <TrialBadges dark className="mt-5" />
        </div>
      </div>
      {/* Démo live : le secteur de la page est présélectionné */}
      <div className="mt-10"><LiveDemo sector={sector} showHeader={false} /></div>
    </Section>
  );
}

/* ---------- Secteurs ---------- */

export function SectorVisual({ s, className = '' }: { s: Sector; className?: string }) {
  const Icon = SECTOR_ICON[s.slug] || Sparkles;
  const fallback = (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-signal-soft via-white to-paper">
      <Icon className="absolute -end-6 -top-6 h-40 w-40 text-signal/10" aria-hidden />
      <div className="relative w-56 rounded-xl bg-white p-3 shadow-card">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink"><Icon className="h-4 w-4 text-signal" aria-hidden />{s.name}</p>
        {s.lead.slice(0, 3).map((f) => <p key={f.label} className="mt-1.5 flex justify-between text-[12px]"><span className="text-slate-light">{f.label}</span><span className="font-medium text-ink">{f.value}</span></p>)}
      </div>
    </div>
  );
  return <div className={`overflow-hidden ${className}`}><Photo src={s.photo} alt={s.photoAlt} fallback={fallback} /></div>;
}

export function SectorCards({ exclude }: { exclude?: string }) {
  const { c } = useI18n();
  const list = c.sectors.filter((s) => s.slug !== exclude && isActiveSector(s));
  // Grille sans carte isolée : sur la page des secteurs, un nombre impair ajoute une carte « Votre activité
  // n’est pas dans la liste ? » (11 + 1 = 12 → 2, 3 ou 4 colonnes pleines) ; 10 (page d’un secteur) → 2 rangées de 5.
  const other = !exclude && list.length % 2 === 1 ? c.ui.commerce.sectorsIndex.other : null;
  const count = list.length + (other ? 1 : 0);
  const cols = count % 5 === 0 ? 'lg:grid-cols-5' : count % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${cols}`}>
      {list.map((s) => {
        const Icon = SECTOR_ICON[s.slug] || Sparkles;
        return (
          <Link key={s.slug} href={`/secteurs/${s.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white hover:border-ink">
            <SectorVisual s={s} className="aspect-[3/2]" />
            <div className="p-5">
              <h3 className="flex items-center gap-2 text-h3 font-semibold"><Icon className="h-5 w-5 text-signal" aria-hidden />{s.name}</h3>
              <p className="mt-1.5 text-[15px]">{s.short}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-signal-deep group-hover:underline">{c.ui.components.sectorCards.seePage(s.name.toLowerCase())}</span>
            </div>
          </Link>
        );
      })}
      {other && (
        <Link href="/contact" className="group flex flex-col overflow-hidden rounded-2xl border border-dashed border-signal/40 bg-signal-soft/40 hover:border-ink">
          <div className="flex aspect-[3/2] items-center justify-center bg-gradient-to-br from-signal-soft via-white to-paper">
            <MessageSquare className="h-14 w-14 text-signal/60" aria-hidden />
          </div>
          <div className="p-5">
            <h3 className="flex items-center gap-2 text-h3 font-semibold"><Sparkles className="h-5 w-5 text-signal" aria-hidden />{other.title}</h3>
            <p className="mt-1.5 text-[15px]">{other.intro}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-signal-deep group-hover:underline">{c.ui.components.navbar.resources.contact}</span>
          </div>
        </Link>
      )}
    </div>
  );
}

/* ---------- Tarifs ---------- */

/* Facturation mensuelle ou annuelle : état partagé entre les cartes et le comparatif d’une même page. */
export type Billing = 'monthly' | 'annual';
type BillingState = { billing: Billing; setBilling: (b: Billing) => void };
const BillingContext = createContext<BillingState | null>(null);

/** Partage le choix mensuel / annuel entre les blocs tarifaires de la page (cartes, comparatif). */
export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [billing, setBilling] = useState<Billing>('monthly');
  const value = useMemo(() => ({ billing, setBilling }), [billing]);
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

/** État partagé si un BillingProvider englobe le bloc, sinon état local (mensuel par défaut). */
function useBilling(): BillingState {
  const shared = useContext(BillingContext);
  const [billing, setBilling] = useState<Billing>('monthly');
  return shared ?? { billing, setBilling };
}

/** Sélecteur Mensuel / Annuel : groupe de boutons radio natifs (flèches du clavier, lecteurs d’écran). */
export function BillingToggle({ billing, setBilling, className = '' }: BillingState & { className?: string }) {
  const { c } = useI18n();
  const t = c.ui.components.pricingCards;
  const name = useId();
  const options: { value: Billing; label: string }[] = [{ value: 'monthly', label: t.monthly }, { value: 'annual', label: t.annual }];
  return (
    <fieldset className={`flex justify-center ${className}`}>
      <legend className="sr-only">{t.billing}</legend>
      <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-line bg-white p-1 shadow-card">
        {options.map((opt) => (
          <label key={opt.value} className="relative cursor-pointer">
            <input type="radio" name={name} value={opt.value} checked={billing === opt.value} onChange={() => setBilling(opt.value)} className="peer sr-only" />
            <span className="flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate transition peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-signal peer-focus-visible:ring-offset-2">
              {opt.label}
              {opt.value === 'annual' && <span className="rounded-full bg-signal-soft px-2 py-0.5 text-xs font-semibold text-signal-deep">{t.twoMonthsFree}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PriceTag({ o, light = false, billing = 'monthly' }: { o: Offer; light?: boolean; billing?: Billing }) {
  const { c, market, money } = useI18n();
  const t = c.ui.components.pricingCards;
  const annual = billing === 'annual' && o.annual ? o.annual : undefined;
  const amount = o.price === null ? o.priceLabel : annual ? money(annual.monthly, 2) : money(o.price);
  return (
    <div>
      {/* Montant chiffré en grand ; libellé textuel (« sur devis ») plus petit pour tenir sur une ligne. */}
      <p className={`font-display font-bold ${o.price === null ? 'text-2xl leading-8' : 'text-[2rem] leading-8'} ${light ? 'text-white' : 'text-ink'}`}>{amount}</p>
      <p className={`mt-1.5 text-sm ${light ? 'text-white/70' : 'text-slate'}`}>
        {o.price === 0 ? t.daysFree(market.trial.days) : o.price === null ? t.negotiated : c.offerLabels.perMonth}
      </p>
      {annual && (
        <>
          <p className={`text-xs ${light ? 'text-white/70' : 'text-slate'}`}>{t.billedYearly(money(annual.price))}</p>
          <p className={`mt-1 text-xs font-semibold ${light ? 'text-signal-glow' : 'text-signal-deep'}`}>{t.save(money(annual.saving))}</p>
        </>
      )}
    </div>
  );
}

export function PricingCards({ only }: { only?: Offer['slug'][] }) {
  const { c, market, offers, money } = useI18n();
  const t = c.ui.components.pricingCards;
  const { billing, setBilling } = useBilling();
  const fx = useFx();
  const list = only ? offers.filter((o) => only.includes(o.slug)) : offers;
  const hasAnnual = list.some((o) => o.annual);
  // Chaque carte est une sous-grille (7 rangées) : nom, public, prix, minutes, points forts, bouton et lien
  // restent alignés d’une carte à l’autre, même quand un libellé passe sur deux lignes (NL, PL).
  return (
    <div>
      {hasAnnual && <BillingToggle billing={billing} setBilling={setBilling} className="mb-8" />}
      <div className={`grid gap-4 md:grid-cols-2 ${list.length >= 5 ? 'xl:grid-cols-5' : list.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {list.map((o) => {
          const annual = billing === 'annual' && o.annual;
          const plan = o.slug === 'sur-mesure' ? '/contact' : `${SIGNUP_URL}?plan=${o.slug}${annual ? '&billing=annual' : ''}`;
          return (
            <div key={o.slug} className={`relative row-span-7 grid grid-rows-subgrid gap-y-0 rounded-2xl border p-6 ${o.featured ? 'border-ink bg-ink text-white/80' : 'border-line bg-white'}`}>
              {o.featured && <span className="absolute -top-3 start-6 rounded-full bg-signal-deep px-3 py-1 text-xs font-semibold text-white">{t.mostChosen}</span>}
              <p className={`font-display text-lg font-bold leading-snug ${o.featured ? 'text-white' : 'text-ink'}`}>{o.name}</p>
              <p className="mt-1 text-sm">{o.audience}</p>
              <div className="mt-4">
                <PriceTag o={o} light={o.featured} billing={billing} />
                {/* Repère en devise locale (facturation toujours en USD, voir la note sous les cartes). */}
                {/* Équivalents en devise locale : pastilles en gras sur fond teinté, lisibles dans toutes les monnaies. */}
                {fx && !!o.price && (
                  <p className="mt-2 flex flex-wrap gap-1.5">
                    {market.localCurrencies.filter((cur) => fx.rates[cur]).map((cur) => (
                      <span key={cur} className={`rounded-md px-2 py-0.5 text-sm font-bold tabular-nums ${o.featured ? 'bg-white/15 text-white' : 'bg-signal-soft text-signal-deep'}`}>
                        {approx(annual ? annual.monthly : o.price!, cur, fx.rates[cur], market.numberLocale)}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <div className="mt-3">
                <p className={`text-sm font-semibold ${o.featured ? 'text-signal-glow' : 'text-signal-deep'}`}>{o.minutes}</p>
                {o.perMinute && <p className={`text-xs ${o.featured ? 'text-white/60' : 'text-slate-light'}`}>{t.perMinute(annual ? annual.perMinute : o.perMinute)}</p>}
                {!!o.price && <p className={`text-xs ${o.featured ? 'text-white/60' : 'text-slate-light'}`}>{t.phoneNumber(money(market.phoneNumberFrom, 2))}</p>}
              </div>
              <ul className="mt-4 space-y-2 text-[14px]">
                {o.highlights.map((h) => <li key={h} className="flex gap-2"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden /><span className={o.featured ? 'text-white' : 'text-ink'}>{h}</span></li>)}
              </ul>
              <Link href={plan} className={`mt-6 self-end ${o.featured ? 'btn-signal' : 'btn-ghost'} whitespace-normal text-center text-sm leading-tight`}>{o.cta}</Link>
              <Link href={`/offres/${o.slug}`} className={`mt-2 text-center text-xs font-semibold hover:underline ${o.featured ? 'text-white/70' : 'text-slate'}`}>{t.details}</Link>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-slate">{c.site.payg(money(market.paygMinute, 2))}</p>
      {/* Date des taux (AAAA-MM-JJ, lue en UTC) : jamais affichée la veille à l’ouest de Greenwich. */}
      {fx && <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-slate-light">{c.site.fxNote(new Intl.DateTimeFormat(market.numberLocale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(fx.date)))}</p>}
    </div>
  );
}

export function GrowthLines({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const { c } = useI18n();
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium ${dark ? 'text-white/80' : 'text-ink'} ${className}`}>
      {c.site.growthLines.map((l) => <li key={l} className="flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-signal" aria-hidden />{l}</li>)}
    </ul>
  );
}

function CellView({ v, t }: { v: Cell; t: { included: string; notIncluded: string } }) {
  if (v === true) return <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-ok/10"><Check className="h-4 w-4 text-ok" strokeWidth={3} aria-label={t.included} /></span>;
  if (v === false) return <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-no/10"><X className="h-4 w-4 text-no" strokeWidth={3} aria-label={t.notIncluded} /></span>;
  return <span className="text-[13px] font-semibold text-ink">{v}</span>;
}

/**
 * Comparatif des forfaits : prix et minutes toujours visibles, puis le premier groupe de modules ;
 * le bouton déplie tous les modules. Les limites reprennent celles de l’admin de l’espace client.
 */
export function MatrixTable() {
  const { c, market, offers, money } = useI18n();
  const t = c.ui.components.matrix;
  const billedYearly = c.ui.components.pricingCards.billedYearly;
  const annualMode = useContext(BillingContext)?.billing === 'annual';
  const [open, setOpen] = useState(false);
  const groups = open ? c.matrix : c.matrix.slice(0, 1);
  const moduleCount = c.matrix.reduce((n, g) => n + g.rows.length, 0);
  const head = 'sticky start-0 z-10 bg-paper p-3 font-medium text-ink sm:p-4';
  const priceRows: { label: string; cell: (o: Offer) => React.ReactNode }[] = [
    {
      label: annualMode ? t.pricePerMonthAnnual : t.pricePerMonth,
      cell: (o) => (o.price === null ? o.priceLabel : annualMode && o.annual
        ? <>{money(o.annual.monthly, 2)}<span className="block font-normal text-slate">{billedYearly(money(o.annual.price))}</span></>
        : money(o.price)),
    },
    { label: t.includedMinutes, cell: (o) => <>{o.minutes}{o.perMinute && <span className="block font-normal text-signal-deep">{annualMode && o.annual ? o.annual.perMinute : o.perMinute}</span>}</> },
    { label: t.extraMinute, cell: (o) => (o.extraMinute ? money(o.extraMinute, 2) : '—') },
    { label: t.phoneNumber, cell: (o) => (o.price ? t.phoneNumberFrom(money(market.phoneNumberFrom, 2)) : '—') },
  ];
  return (
    <div>
      <div className={`${open ? 'max-h-[80vh]' : ''} overflow-auto rounded-2xl border border-line bg-white`}>
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-start text-[14px] [&_tbody_tr>*]:border-b [&_tbody_tr>*]:border-line">
          <caption className="sr-only">{t.caption}</caption>
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              <th scope="col" className="sticky start-0 z-10 w-36 border-b border-line bg-white p-3 font-display text-sm font-semibold text-ink sm:w-auto sm:p-4">{t.inYourInterface}</th>
              {offers.map((o) => <th key={o.slug} scope="col" className={`border-b border-line p-4 text-center font-display text-sm font-semibold ${o.featured ? 'bg-signal-soft text-ink' : 'bg-white text-ink'}`}>{o.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {priceRows.map((r) => (
              <tr key={r.label} className="bg-paper">
                <th scope="row" className={head}>{r.label}</th>
                {offers.map((o) => <td key={o.slug} className="p-4 text-center text-[13px] font-semibold text-ink">{r.cell(o)}</td>)}
              </tr>
            ))}
            {groups.map((g) => (
              <React.Fragment key={g.group}>
                <tr><th colSpan={offers.length + 1} scope="colgroup" className="bg-white px-4 pb-2 pt-6 text-start font-display text-sm font-semibold text-ink"><span className="sticky start-4">{g.group}</span></th></tr>
                {g.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="sticky start-0 z-10 max-w-[18rem] bg-white p-3 font-normal sm:p-4"><span className="block font-medium text-ink">{r.label}</span><span className="text-[13px] leading-snug text-slate-light">{r.detail}</span></th>
                    {offers.map((o) => <td key={o.slug} className={`p-4 text-center ${o.featured ? 'bg-signal-soft/40' : ''}`}><CellView v={r.cells[o.slug]} t={t} /></td>)}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate">
          <li className="flex items-center gap-2"><CellView v t={t} />{t.legendIncluded}</li>
          <li className="flex items-center gap-2"><CellView v={false} t={t} />{t.legendNotIncluded}</li>
          <li>{t.legendLimit}</li>
        </ul>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="btn-ghost text-sm">
          {open ? t.showLess : t.showAll(moduleCount)}
        </button>
      </div>
    </div>
  );
}

/* ---------- Tout est inclus : modèles, voix, transcription et canaux, sans clé API ---------- */

/**
 * `logo` : fichier officiel dans public/logos/providers, prioritaire sur `mark` (tracé simple-icons).
 * `crop` : logo horizontal (symbole + nom) dont on n’affiche que le symbole, à gauche.
 */
type StackItem = { name: string; logo?: string; crop?: boolean; mark?: keyof typeof BRAND_MARKS; icon?: React.ElementType };
const P = '/logos/providers/';
// Fournisseurs réellement disponibles dans l’espace client (listes de modèles, voix et transcriptions de la plateforme).
// ElevenLabs garde son symbole simple-icons (le fichier fourni est le nom en toutes lettres, déjà écrit à côté) ;
// Inworld et Soniox n’ont pas encore de logo officiel utilisable : initiale.
const STACK: Record<string, StackItem[]> = {
  llm: [{ name: 'OpenAI GPT-5', logo: `${P}openai.png`, mark: 'openai' }, { name: 'Anthropic Claude', logo: `${P}anthropic.svg`, mark: 'anthropic' }, { name: 'Google Gemini', logo: `${P}gemini.svg`, mark: 'gemini' }, { name: 'Meta Llama', logo: `${P}meta.svg`, mark: 'meta' }],
  s2s: [{ name: 'OpenAI Realtime', logo: `${P}openai.png`, mark: 'openai' }, { name: 'Gemini Live', logo: `${P}gemini.svg`, mark: 'gemini' }],
  tts: [{ name: 'ElevenLabs', mark: 'elevenlabs' }, { name: 'Cartesia', logo: `${P}cartesia.svg`, crop: true }, { name: 'Microsoft Azure', logo: `${P}azure.svg`, mark: 'azure' }, { name: 'Inworld' }],
  stt: [{ name: 'Deepgram', logo: `${P}deepgram.svg`, mark: 'deepgram' }, { name: 'ElevenLabs Scribe', mark: 'elevenlabs' }, { name: 'Gladia', logo: `${P}gladia.svg`, crop: true }, { name: 'Soniox' }, { name: 'Microsoft Azure', logo: `${P}azure.svg`, mark: 'azure' }],
  channels: [{ name: 'phone', icon: Phone }, { name: 'sip', icon: Network }, { name: 'WhatsApp', mark: 'whatsapp' }, { name: 'Messenger', mark: 'messenger' }, { name: 'Instagram', mark: 'instagram' }, { name: 'email', icon: Mail }, { name: 'widget', icon: MonitorSmartphone }],
};

function StackChip({ item, label }: { item: StackItem; label: string }) {
  const mark = item.mark ? BRAND_MARKS[item.mark] : undefined;
  const Icon = item.icon;
  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-line bg-white py-2 ps-2 pe-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.logo ? <img src={item.logo} alt="" width={20} height={20} loading="lazy" className={`h-5 w-5 mix-blend-multiply ${item.crop ? 'object-cover object-left' : 'object-contain'}`} />
          : mark ? <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={mark.hex}><path d={mark.path} /></svg>
          : Icon ? <Icon className="h-[18px] w-[18px] text-signal-deep" />
            : <span className="font-display text-sm font-bold text-ink">{label.charAt(0)}</span>}
      </span>
      <span className="text-[14px] font-medium text-ink">{label}</span>
    </li>
  );
}

export function IncludedStack() {
  const { c } = useI18n();
  const t = c.ui.components.includedStack;
  const names = t.channelNames as Record<string, string>;
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <Heading title={t.title} intro={t.intro} />
        <ul className="space-y-2">
          {t.noKeys.map((k) => <li key={k} className="flex items-center gap-2 font-medium text-ink"><Check className="h-4 w-4 text-ok" strokeWidth={3} aria-hidden />{k}</li>)}
        </ul>
      </div>
      <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {t.groups.map((g) => (
          <div key={g.key} className={g.key === 'channels' ? 'md:col-span-2' : ''}>
            <h3 className="font-display text-lg font-semibold text-ink">{g.title}</h3>
            <p className="mt-1 text-[15px]">{g.text}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(STACK[g.key] ?? []).map((it) => <StackChip key={it.name} item={it} label={names[it.name] ?? it.name} />)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-prose text-xs text-slate-light">{t.note}</p>
    </div>
  );
}

/** Recharges de crédit : dépannage ponctuel, la minute supplémentaire coûte plus cher que la minute incluse. */
export function RechargeTables() {
  const { c, market, offers, money, num } = useI18n();
  const t = c.ui.components.recharges;
  const plans = offers.filter((o) => o.extraMinute);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white p-6">
        <h3 className="text-h3 font-semibold">{t.title}</h3>
        <p className="mt-1 text-[15px]">{t.text}</p>
        <table className="mt-4 w-full min-w-[460px] text-[15px]">
          <thead>
            <tr className="border-b border-line text-start text-sm text-slate">
              <th className="py-2 font-medium">{t.rechargeCol}</th>
              {plans.map((o) => <th key={o.slug} className="py-2 text-end font-medium">{o.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {market.recharges.map((amount) => (
              <tr key={amount} className="border-b border-line last:border-0">
                <td className="py-2.5 font-semibold text-ink">{money(amount)}</td>
                {plans.map((o) => <td key={o.slug} className="py-2.5 text-end text-slate">{t.approxMinutes(num(Math.floor(amount / o.extraMinute!)))}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-slate-light">{c.site.rechargeFreeAmount}</p>
      </div>
      <div className="rounded-2xl bg-ink p-6 text-white/80">
        <h3 className="text-h3 font-semibold text-white">{t.cheaperTitle}</h3>
        <p className="mt-1 text-[15px]">{t.cheaperText}</p>
        <ul className="mt-5 space-y-3">
          {plans.map((o) => (
            <li key={o.slug} className="border-b border-white/10 pb-3 last:border-0">
              <p className="font-display font-semibold text-white">{o.name}</p>
              <p className="text-sm">{t.included} <span className="font-semibold text-signal-glow">{o.perMinute}</span>{t.extra(money(o.extraMinute!, 2))}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Crédits de messages inclus chaque mois, relevés dans la configuration des forfaits de l’espace client.
// Toute modification dans l’admin doit être reportée ici, dans la matrice (offers.ts), la FAQ et les bases de connaissances.
const MESSAGE_CREDITS: { slug: 'receptionniste' | 'assistant' | 'centre-appels'; credits: number; replies: number }[] = [
  { slug: 'receptionniste', credits: 200, replies: 65 },
  { slug: 'assistant', credits: 1000, replies: 330 },
  { slug: 'centre-appels', credits: 3000, replies: 1000 },
];

/** Messages écrits : coût de chaque usage en crédits, comment obtenir des crédits et ce qui se passe à 0. */
export function MessageCreditsBox() {
  const { c, offer, num } = useI18n();
  const t = c.ui.commerce.tarifs.messageCredits;
  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h3 className="text-h3 font-semibold">{t.title}</h3>
      <p className="mt-1 max-w-prose text-[15px]">{t.intro}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-line text-start text-sm text-slate">
                <th className="py-2 text-start font-medium">{t.usageCol}</th>
                <th className="w-2/5 py-2 text-end font-medium">{t.costCol}</th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={r.label} className="border-b border-line align-top last:border-0">
                  <td className="py-2.5 pe-4 text-ink">{r.label}</td>
                  <td className="py-2.5 text-end font-semibold text-ink">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-slate-light">{t.smsNote}</p>
        </div>
        <div className="rounded-xl bg-paper p-5">
          <h4 className="font-display font-semibold text-ink">{t.getTitle}</h4>
          <p className="mt-2 text-sm">{t.included}</p>
          <ul className="mt-2 space-y-2 text-[15px]">
            {MESSAGE_CREDITS.map((p) => (
              <li key={p.slug} className="flex flex-col sm:flex-row sm:justify-between sm:gap-3">
                <span className="text-ink">{offer(p.slug).name}</span>
                <span className="font-semibold text-ink sm:text-end">{t.includedValue(num(p.credits), num(p.replies))}</span>
              </li>
            ))}
            <li className="flex flex-col sm:flex-row sm:justify-between sm:gap-3">
              <span className="text-ink">{offer('sur-mesure').name}</span>
              <span className="font-semibold text-ink sm:text-end">{c.offerLabels.onQuote}</span>
            </li>
          </ul>
          <p className="mt-4 text-sm">{t.convert}</p>
        </div>
      </div>
      <p className="mt-6 border-t border-line pt-4 text-[15px]">{t.balance}</p>
    </div>
  );
}

/** Règles d’évolution : recharge pour un dépassement ponctuel, forfait supérieur pour un usage régulier. */
export function GrowthBlock({ visual = true }: { visual?: boolean }) {
  const { c, offer, money, num } = useI18n();
  const t = c.ui.components.growthBlock;
  const rec = offer('receptionniste'), asst = offer('assistant'), centre = offer('centre-appels'), custom = offer('sur-mesure');
  // Exemples chiffrés calculés sur la grille du marché : un dépassement ponctuel, puis un usage régulier.
  const overflow = 50; // minutes au-delà du forfait Réceptionniste ce mois-ci
  const regular = 900; // minutes régulières, entre Réceptionniste et Assistant
  const recPrice = rec.price ?? 0, recExtra = rec.extraMinute ?? 0;
  const rules = [
    ...t.rules.map((r) => ({ t: r.title, d: r.text })),
    { t: t.ruleCustom(num(custom.minutesCount)), d: t.ruleCustomText },
  ];
  const cases = [
    {
      m: t.case1Minutes(num(rec.minutesCount + overflow)), plan: t.case1Plan(rec.name),
      note: t.case1Note(money(recPrice), num(overflow), money(recExtra, 2), money(Math.round(recPrice + overflow * recExtra))),
    },
    {
      m: t.case2Minutes(num(regular)), plan: t.case2Plan(asst.name),
      note: t.case2Note(money(asst.price ?? 0), num(asst.minutesCount), money(Math.round(recPrice + (regular - rec.minutesCount) * recExtra)), rec.name),
    },
    { m: t.case3Minutes(num(custom.minutesCount)), plan: t.case3Plan, note: t.case3Note(centre.name) },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Heading title={t.title} intro={t.intro} />
        <ol className="mt-8 space-y-4">
          {rules.map((r, i) => (
            <li key={r.t} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal-soft font-display text-sm font-bold text-signal-deep">{i + 1}</span>
              <div><p className="font-display font-semibold text-ink">{r.t}</p><p className="text-[15px]">{r.d}</p></div>
            </li>
          ))}
        </ol>
        {/* Visuel : le suivi des appels traités, sauf si la page l’affiche déjà (recharges). */}
        {visual && <div className="mt-8 max-w-sm" aria-hidden><Mock kind="report" /></div>}
      </div>
      <div className="space-y-4">
        {cases.map((x) => (
          <div key={x.m} className="rounded-2xl border border-line bg-white p-6">
            <p className="text-sm text-slate">{t.customerAt}</p>
            <p className="font-display text-2xl font-bold text-ink">{x.m}</p>
            <p className="mt-2 font-semibold text-signal-deep">{x.plan}</p>
            <p className="mt-1 text-[15px]">{x.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Comparatif économique (prudent, doc 87) avec calculateur ---------- */

/** Seuil (en minutes) au-delà duquel le forfait supérieur coûte moins cher que forfait + minutes supplémentaires. */
const breakEven = (from: Offer, to: Offer) =>
  Math.round(from.minutesCount + ((to.price ?? 0) - (from.price ?? 0)) / (from.extraMinute || 1));

/** Forfait recommandé pour un volume mensuel, selon les règles d’évolution (grille du marché courant). */
export function planFor(minutes: number, i18n: Pick<ReturnType<typeof getI18n>, 'offer' | 'c'>) {
  const { offer, c } = i18n;
  const t = c.ui.components.planFor;
  const rec = offer('receptionniste'), asst = offer('assistant'), centre = offer('centre-appels'), custom = offer('sur-mesure');
  if (minutes > custom.minutesCount) return { offer: custom, extra: '' };
  if (minutes <= rec.minutesCount) return { offer: rec, extra: '' };
  if (minutes <= breakEven(rec, asst)) return { offer: rec, extra: t.oneOffRecharge };
  if (minutes <= asst.minutesCount) return { offer: asst, extra: '' };
  if (minutes <= breakEven(asst, centre)) return { offer: asst, extra: t.oneOffRecharge };
  if (minutes <= centre.minutesCount) return { offer: centre, extra: '' };
  return { offer: centre, extra: t.rechargeOrCustom };
}

// Hypothèses du calculateur, affichées sous les résultats.
const WRAP_UP = 1; // minutes de traitement après chaque appel pour un employé (notes, saisie)
const CONVERSION = 20; // % des appels manqués rattrapés qui deviennent clients
const WORKING_DAYS = 22; // jours ouvrés par mois : « manqués hier » × 22 = appels manqués par mois
// Valeur de départ d’un nouveau client par secteur : panier ou honoraire moyen volontairement prudent
// (le visiteur l’ajuste ; une valeur haute gonflerait le chiffre d’affaires « récupéré »).
const SECTOR_VALUE: Record<string, number> = {
  'services-a-domicile': 200, 'cliniques-veterinaires': 100, immobilier: 500, automobile: 250,
  'salons-de-coiffure': 50, 'beaute-bien-etre': 70, 'restaurants-hotellerie': 50, 'avocats-experts-comptables': 400,
  'e-commerce': 60, 'courtiers-assurance-credit': 300, 'gestion-locative': 300,
};
/** Textes facultatifs du calculateur : affichés dès que les fichiers de contenu les définissent. */
type EconomyExtra = { missedYesterday?: string; workingDaysNote?: (days: number) => string; perWeek?: string; perYear?: string };

/** Forfait le moins cher pour un volume donné : prix du forfait + minutes au-delà, au tarif de la minute supplémentaire. */
export function cheapestPlan(minutes: number, offers: Offer[]) {
  return offers
    .filter((o) => o.price && o.extraMinute)
    .map((o) => {
      const extra = Math.max(0, Math.ceil(minutes - o.minutesCount));
      return { offer: o, extra, total: (o.price ?? 0) + extra * (o.extraMinute ?? 0) };
    })
    .sort((a, b) => a.total - b.total)[0];
}

/** Calculateur de retour sur investissement : volume d’appels → forfait, prix réel à la minute, économie et bénéfice. */
export function EconomyBlock({ sector }: { sector?: string } = {}) {
  const { c, market, offers, offer, money, num, locale } = useI18n();
  const t = c.ui.components.economy;
  const ex = t as typeof t & EconomyExtra;
  const [calls, setCalls] = useState(300);
  const [duration, setDuration] = useState(3);
  const [hourly, setHourly] = useState(market.hourlyCost);
  const [missed, setMissed] = useState(20);
  const [value, setValue] = useState((sector && SECTOR_VALUE[sector]) || 150);
  const yId = useId();
  // « Combien d’appels avez-vous manqués hier ? » : fixe le taux de manqués (× 22 jours ouvrés, borné au curseur).
  const setYesterday = (n: number) => {
    if (!Number.isFinite(n) || n < 0) return;
    setMissed(Math.min(50, Math.round((n * WORKING_DAYS * 100) / Math.max(calls, 1))));
  };

  const minutes = Math.round(calls * duration);
  const best = useMemo(() => cheapestPlan(minutes, offers), [minutes, offers]);
  const custom = offer('sur-mesure');
  const perMinute = minutes > 0 ? best.total / minutes : 0;
  const human = (calls * (duration + WRAP_UP) / 60) * hourly;
  const savings = human - best.total;
  const missedCalls = Math.round((calls * missed) / 100);
  const recovered = missedCalls * (CONVERSION / 100) * value;
  const benefit = savings + recovered;
  const ratio = (human + recovered) / best.total;

  const fields = [
    { group: t.yourCalls, items: [
      { id: 'roi-calls', label: t.callsPerMonth, v: calls, set: setCalls, min: 20, max: 3000, step: 10, show: (n: number) => num(n) },
      { id: 'roi-dur', label: t.avgDuration, v: duration, set: setDuration, min: 1, max: 10, step: 0.5, show: (n: number) => `${num(n, n % 1 ? 1 : 0)}${t.min}` },
    ] },
    { group: t.yourCosts, items: [
      { id: 'roi-hourly', label: t.hourlyCost, v: hourly, set: setHourly, min: 10, max: 60, step: 1, show: (n: number) => `${money(n)}${t.perHour}` },
      { id: 'roi-missed', label: t.missedRate, v: missed, set: setMissed, min: 0, max: 50, step: 1, show: (n: number) => (locale === 'fr' ? `${n}\u00a0%` : `${n}%`) },
      { id: 'roi-value', label: t.customerValue, v: value, set: setValue, min: 0, max: 2000, step: 10, show: (n: number) => money(n) },
    ] },
  ];

  return (
    <div>
      <Heading title={t.title} intro={t.intro} />
      <form className="mt-10 grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-[1fr_1.1fr]" onSubmit={(e) => e.preventDefault()} aria-label={t.calculator}>
        <div className="space-y-8 p-6 sm:p-8">
          {fields.map((g) => (
            <fieldset key={g.group}>
              <legend className="font-display font-semibold text-ink">{g.group}</legend>
              {g.items.map((f) => (
                <div key={f.id} className="mt-4">
                  {f.id === 'roi-missed' && ex.missedYesterday && (
                    <div className="mb-4">
                      <label htmlFor={yId} className="flex items-center justify-between gap-4 text-sm text-slate">
                        <span>{ex.missedYesterday}</span>
                        <input id={yId} type="number" inputMode="numeric" min={0} max={500} placeholder="0" onChange={(e) => setYesterday(Number(e.target.value))}
                          className="w-20 rounded-lg border border-line px-2 py-1 text-end font-semibold text-ink focus:border-signal focus:outline-none" />
                      </label>
                      {ex.workingDaysNote && <p className="mt-1 text-xs text-slate-light">{ex.workingDaysNote(WORKING_DAYS)}</p>}
                    </div>
                  )}
                  <label htmlFor={f.id} className="flex justify-between gap-4 text-sm text-slate"><span>{f.label}</span><output htmlFor={f.id} className="font-semibold text-ink">{f.show(f.v)}</output></label>
                  <input id={f.id} type="range" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.set(Number(e.target.value))} className="mt-2 w-full accent-[#0A7690]" />
                </div>
              ))}
            </fieldset>
          ))}
        </div>

        <div className="bg-ink p-6 text-white/75 sm:p-8" aria-live="polite">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-white/10 pb-6">
            <div><p className="text-sm">{t.minutesMonth}</p><p className="font-display text-2xl font-bold text-white">{num(minutes)}</p></div>
            <div><p className="text-sm">{t.effectivePerMinute}</p><p className="font-display text-2xl font-bold text-signal-glow">{money(perMinute, 3)}</p></div>
            <div className="col-span-2">
              <p className="text-sm">{t.bestPlan}</p>
              <p className="font-display text-xl font-bold text-white">{best.offer.name} — {money(best.total)}{t.perMonth}</p>
              {best.extra > 0 && <p className="text-sm">{t.withExtra(num(best.extra), money(best.offer.extraMinute ?? 0, 2))}</p>}
              {minutes > custom.minutesCount && <p className="text-sm text-signal-glow">{t.customAbove(num(custom.minutesCount))}</p>}
            </div>
          </div>
          <dl className="space-y-3 py-6 text-[15px]">
            <div className="flex justify-between gap-4"><dt>{t.humanCost}</dt><dd className="font-semibold text-white">{money(human)}{t.perMonth}</dd></div>
            <div className="flex justify-between gap-4"><dt>{t.planCost(best.offer.name)}</dt><dd className="font-semibold text-white">− {money(best.total)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3"><dt>{t.savings}</dt><dd className="font-semibold text-white">{savings < 0 ? `− ${money(-savings)}` : money(savings)}</dd></div>
            <div className="flex justify-between gap-4"><dt>{t.recovered}<span className="block text-sm text-white/55">{t.recoveredDetail(num(missedCalls))}</span></dt><dd className="font-semibold text-white">+ {money(recovered)}</dd></div>
          </dl>
          {savings < 0 && <p className="-mt-3 mb-4 text-sm">{t.noSavings}</p>}
          <div className="rounded-2xl bg-white/[.06] p-5">
            <p className="text-sm">{t.netBenefit}</p>
            <p className="font-display text-[2.5rem] font-bold leading-tight text-white">{money(benefit)}<span className="text-lg font-semibold text-white/60">{t.perMonth}</span></p>
            {ratio > 1 && <p className="mt-1 text-sm text-signal-glow">{t.roi(num(ratio, 1))}</p>}
            {ex.perWeek && ex.perYear && (
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-3 text-sm">
                <span><span className="font-semibold text-white">{money((benefit * 12) / 52)}</span>{ex.perWeek}</span>
                <span><span className="font-semibold text-white">{money(benefit * 12)}</span>{ex.perYear}</span>
              </p>
            )}
          </div>
          <Link href={SIGNUP_URL} className="btn-signal mt-6 w-full justify-center">{t.cta}</Link>
        </div>
      </form>
      <p className="mt-4 max-w-prose text-sm text-slate-light">{t.assumptions(WRAP_UP, CONVERSION)}</p>
    </div>
  );
}

/* ---------- Comparaison honnête : poste d’accueil / agent IA ---------- */

export function HumanVsAi() {
  const { c, market, offer, money } = useI18n();
  const t = c.ui.components.humanVsAi;
  const fill = (text: string) => text
    .replace('{from}', money(offer('receptionniste').price ?? 0))
    .replace('{payg}', money(market.paygMinute, 2));
  return (
    <div>
      <Heading title={t.title} intro={t.intro} />
      <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-start text-[15px]">
          <caption className="sr-only">{t.caption}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-4"><span className="sr-only">{t.caption}</span></th>
              <th scope="col" className="p-4 font-display font-semibold text-slate">{t.human}</th>
              <th scope="col" className="bg-signal-soft p-4 font-display font-semibold text-ink">{t.ai}</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <th scope="row" className="p-4 font-medium text-ink">{r.label}</th>
                <td className="p-4">{fill(r.human)}</td>
                <td className="bg-signal-soft/60 p-4 font-semibold text-ink">{fill(r.ai)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-prose text-sm text-slate-light">{t.note}</p>
    </div>
  );
}

/* ---------- Sécurité et conformité (formulation vérifiable) ---------- */

const SECURITY_ICONS: React.ElementType[] = [UserCheck, Lock, ScrollText, KeyRound, ShieldCheck, Globe2];

/** Bloc sécurité ; `bare` (page /securite, qui a déjà son titre) : seulement la grille des garanties. */
export function SecurityBlock({ bare = false }: { bare?: boolean }) {
  const { c } = useI18n();
  const tx = c.ui.components.security;
  const items = tx.items.map((it, n) => ({ icon: SECURITY_ICONS[n] || ShieldCheck, t: it.title, d: it.text }));
  const grid = (
    <div className={`grid gap-x-8 gap-y-6 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2 sm:p-8 ${bare ? 'lg:grid-cols-3' : ''}`}>
      {items.map((i) => (
        <div key={i.t}><p className="flex items-center gap-2 font-display font-semibold text-ink"><i.icon className="h-4 w-4 text-signal" aria-hidden />{i.t}</p><p className="mt-1.5 text-[15px]">{i.d}</p></div>
      ))}
    </div>
  );
  if (bare) return grid;
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
      <div>
        <Heading title={tx.title} intro={tx.intro} />
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/securite" className="text-signal-deep hover:underline">{tx.approach}</Link>
          <Link href="/confidentialite" className="text-signal-deep hover:underline">{tx.privacy}</Link>
        </div>
      </div>
      {grid}
    </div>
  );
}

/* ---------- Langues et numéros ---------- */

export function VoicesNumbers() {
  const { c } = useI18n();
  const t = c.ui.components.voicesNumbers;
  const langs = t.langs;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-line bg-white p-8">
        <Languages className="h-7 w-7 text-signal" aria-hidden />
        <h3 className="mt-4 font-display text-[1.6rem] font-bold leading-tight">{t.voicesTitle}</h3>
        <p className="mt-2">{t.voicesText}</p>
        <ul className="mt-5 flex flex-wrap gap-2">{langs.map((l) => <li key={l} className="rounded-full bg-paper px-3 py-1 text-sm text-ink">{l}</li>)}<li className="rounded-full bg-signal-soft px-3 py-1 text-sm font-semibold text-ink">{t.others}</li></ul>
      </div>
      <div className="rounded-3xl bg-paper p-8">
        <Phone className="h-7 w-7 text-signal" aria-hidden />
        <h3 className="mt-4 font-display text-[1.6rem] font-bold leading-tight">{t.numbersTitle}</h3>
        <p className="mt-2">{t.numbersText}</p>
        <Link href="/fonctionnalites/sip-numeros" className="mt-5 inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">{t.telephonyOptions}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ---------- Intégrations ---------- */

// Logo de chaque intégration, dans l’ordre de la liste française (identique dans toutes les langues) :
// fichier officiel de public/logos quand il existe, sinon tracé simple-icons, sinon pastille de couleur.
const I = '/logos/integrations/';
const INTEGRATION_LOGO: (keyof typeof BRAND_MARKS | string | null)[] = [
  `${I}google-calendar.png`, 'outlook', 'caldotcom', `${I}calendly.png`, `${I}hubspot.png`, `${I}zoho-crm.png`, `${I}leadconnector.png`, `${I}google-sheets.png`,
  'whatsapp', 'instagram', 'messenger', null, `${I}twilio.png`, null, null, null,
];

export function IntegrationsGrid({ max }: { max?: number }) {
  const { c } = useI18n();
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {c.integrations.slice(0, max).map((i, idx) => {
        const key = INTEGRATION_LOGO[idx];
        const file = key?.startsWith('/') ? key : undefined;
        const logo = key && !file ? BRAND_MARKS[key as keyof typeof BRAND_MARKS] : undefined;
        return (
        <li key={i.name} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {file ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper" aria-hidden><img src={file} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 object-contain mix-blend-multiply" /></span>
            : logo
            ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper" aria-hidden><svg viewBox="0 0 24 24" className="h-5 w-5" fill={logo.hex}><path d={logo.path} /></svg></span>
            : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: i.color }} aria-hidden>{i.mark}</span>}
          <div className="min-w-0"><p className="break-words font-semibold text-ink">{i.name}</p><p className="line-clamp-2 break-words text-[13px] leading-snug text-slate" title={i.text}>{i.text}</p></div>
        </li>
        );
      })}
    </ul>
  );
}

/** Quelques-uns des outils connectables via la plateforme d’automatisation (plus de 300). */
const AUTOMATION_TOOLS: [keyof typeof BRAND_MARKS, string][] = [
  ['gmail', 'Gmail'], ['slack', 'Slack'], ['salesforce', 'Salesforce'], ['shopify', 'Shopify'], ['stripe', 'Stripe'],
  ['notion', 'Notion'], ['airtable', 'Airtable'], ['mailchimp', 'Mailchimp'], ['wordpress', 'WordPress'], ['zapier', 'Zapier'],
];

export function AutomationLogos() {
  return (
    <ul className="flex flex-wrap gap-2">
      {AUTOMATION_TOOLS.map(([k, name]) => (
        <li key={k} className="flex items-center gap-2 rounded-xl border border-line bg-white py-2 ps-2 pe-3.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-paper" aria-hidden><svg viewBox="0 0 24 24" className="h-4 w-4" fill={BRAND_MARKS[k].hex}><path d={BRAND_MARKS[k].path} /></svg></span>
          <span className="text-[14px] font-medium text-ink">{name}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- CTA final ---------- */

export function FinalCTA({ title, sector }: { title?: string; sector?: string }) {
  const { c, market, money } = useI18n();
  const t = c.ui.components.finalCta;
  return (
    <Section tone="paper">
      <div className="grid gap-10 rounded-3xl bg-white p-8 shadow-card sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-h2 font-bold">{title ?? t.title}</h2>
          <p className="mt-3 font-semibold text-ink">{c.site.trialLine(market.trial.days, market.trial.minutes)}</p>
          <CTAs className="mt-8" primary={t.primary} demo={t.demo} sector={sector} />
        </div>
        <div className="rounded-2xl bg-paper p-6">
          <p className="font-display text-lg font-bold">{t.advisorTitle}</p>
          <p className="mb-4 mt-1 text-[15px]">{t.advisorText}</p>
          <CallbackForm compact sector={sector} />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-slate-light">{c.site.priceNote(money(market.phoneNumberFrom, 2))}</p>
    </Section>
  );
}

export { FaqDark, Mock };
