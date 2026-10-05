// Sections réutilisables des pages (docs 94, 95, 113, 114).
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BarChart3, CalendarDays, Car, Check, Database, Globe2, Home, KeyRound, Languages,
  Lock, MessageSquare, Minus, Phone, ScrollText, ShieldCheck, Sparkles, Stethoscope, UserCheck,
  UtensilsCrossed, Workflow, Wrench,
} from 'lucide-react';
import { MODULES as FR_MODULES } from '@/i18n/content/fr/modules';
import type { Sector } from '@/i18n/content/fr/sectors';
import type { Cell } from '@/i18n/content/fr/offers';
import { DEMO_URL, SIGNUP_URL } from '@/data/site';
import { getI18n, useI18n, type Offer } from '@/i18n';
import { CTAs, CallbackForm, FaqDark, Heading, Photo, Section, Tick, TrialBadges } from './ui';
import Mock from './Mock';

/* ---------- Icônes ---------- */

// Icônes indexées sur les familles françaises (clés stables) : on retrouve la famille d’un module par son slug.
const FAMILY_ICON: Record<string, React.ElementType> = {
  'Téléphonie': Phone, Automatisation: Workflow, 'CRM et données': Database, Messages: MessageSquare, Agenda: CalendarDays, Pilotage: BarChart3,
};
const familyIcon = (slug: string) => FAMILY_ICON[FR_MODULES.find((m) => m.slug === slug)?.family ?? ''] || Sparkles;
export const SECTOR_ICON: Record<string, React.ElementType> = {
  'services-a-domicile': Wrench, 'dentaire-cliniques': Stethoscope, immobilier: Home, automobile: Car, 'beaute-bien-etre': Sparkles, 'restaurants-hotellerie': UtensilsCrossed,
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
          <span className="font-display text-sm font-bold text-signal">{c.ui.components.steps.step(i + 1)}</span>
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
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <Heading dark title={t.title} intro={t.intro} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link href={DEMO_URL} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 hover:bg-white/10">
              <Phone className="h-6 w-6 text-signal-glow" aria-hidden />
              <p className="mt-3 font-display font-semibold text-white">{t.launchTitle}</p>
              <p className="mt-1 text-sm">{t.launchText}</p>
            </Link>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <UserCheck className="h-6 w-6 text-signal-glow" aria-hidden />
              <p className="mt-3 font-display font-semibold text-white">{t.callbackTitle}</p>
              <p className="mt-1 text-sm">{t.callbackText}</p>
            </div>
          </div>
          <TrialBadges dark className="mt-8" />
        </div>
        <div className="rounded-3xl bg-white p-6 text-slate sm:p-8">
          <p className="font-display text-xl font-bold">{t.formTitle}</p>
          <p className="mb-5 mt-1 text-[15px]">{t.formText}</p>
          <CallbackForm type="demo" sector={sector} compact submitLabel={t.submit} />
        </div>
      </div>
    </Section>
  );
}

/* ---------- Secteurs ---------- */

export function SectorVisual({ s, className = '' }: { s: Sector; className?: string }) {
  const Icon = SECTOR_ICON[s.slug] || Sparkles;
  const fallback = (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-signal-soft via-white to-paper">
      <Icon className="absolute -right-6 -top-6 h-40 w-40 text-signal/10" aria-hidden />
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
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {c.sectors.filter((s) => s.slug !== exclude).map((s) => {
        const Icon = SECTOR_ICON[s.slug];
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
    </div>
  );
}

/* ---------- Tarifs ---------- */

function PriceTag({ o, light = false }: { o: Offer; light?: boolean }) {
  const { c, market, money } = useI18n();
  const t = c.ui.components.pricingCards;
  const amount = o.price === null ? o.priceLabel : money(o.price);
  return (
    <div>
      <p className={`font-display text-[2rem] font-bold leading-none ${light ? 'text-white' : 'text-ink'}`}>{amount}</p>
      <p className={`mt-1.5 text-sm ${light ? 'text-white/70' : 'text-slate'}`}>
        {o.price === 0 ? t.daysFree(market.trial.days) : o.price === null ? t.negotiated : c.offerLabels.perMonth}
      </p>
    </div>
  );
}

export function PricingCards({ only }: { only?: Offer['slug'][] }) {
  const { c, offers } = useI18n();
  const t = c.ui.components.pricingCards;
  const list = only ? offers.filter((o) => only.includes(o.slug)) : offers;
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${list.length >= 5 ? 'xl:grid-cols-5' : list.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {list.map((o) => (
        <div key={o.slug} className={`relative flex flex-col rounded-2xl border p-6 ${o.featured ? 'border-ink bg-ink text-white/80' : 'border-line bg-white'}`}>
          {o.featured && <span className="absolute -top-3 left-6 rounded-full bg-signal px-3 py-1 text-xs font-semibold text-white">{t.mostChosen}</span>}
          <p className={`font-display text-lg font-bold ${o.featured ? 'text-white' : 'text-ink'}`}>{o.name}</p>
          <p className="mt-1 min-h-[2.5rem] text-sm">{o.audience}</p>
          <div className="mt-4"><PriceTag o={o} light={o.featured} /></div>
          <p className={`mt-3 text-sm font-semibold ${o.featured ? 'text-signal-glow' : 'text-signal-deep'}`}>{o.minutes}</p>
          {o.perMinute && <p className={`text-xs ${o.featured ? 'text-white/60' : 'text-slate-light'}`}>{t.perMinute(o.perMinute)}</p>}
          <ul className="mt-4 flex-1 space-y-2 text-[14px]">
            {o.highlights.map((h) => <li key={h} className="flex gap-2"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden /><span className={o.featured ? 'text-white' : 'text-ink'}>{h}</span></li>)}
          </ul>
          <Link href={o.slug === 'sur-mesure' ? '/contact' : `${SIGNUP_URL}?plan=${o.slug}`} className={`mt-6 ${o.featured ? 'btn-signal' : 'btn-ghost'} text-sm`}>{o.cta}</Link>
          <Link href={`/offres/${o.slug}`} className={`mt-2 text-center text-xs font-semibold hover:underline ${o.featured ? 'text-white/70' : 'text-slate'}`}>{t.details}</Link>
        </div>
      ))}
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
  if (v === true) return <Check className="mx-auto h-4 w-4 text-signal" aria-label={t.included} />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-line" aria-label={t.notIncluded} />;
  return <span className="text-[13px] font-medium text-ink">{v}</span>;
}

export function MatrixTable() {
  const { c, offers, money } = useI18n();
  const t = c.ui.components.matrix;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
        <caption className="sr-only">{t.caption}</caption>
        <thead className="bg-white">
          <tr className="border-b border-line">
            <th scope="col" className="p-4 font-display text-sm font-semibold text-ink">{t.inYourInterface}</th>
            {offers.map((o) => <th key={o.slug} scope="col" className={`p-4 text-center font-display text-sm font-semibold ${o.featured ? 'bg-signal-soft text-ink' : 'text-ink'}`}>{o.name}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line bg-paper/60">
            <th scope="row" className="p-4 font-medium text-ink">{t.pricePerMonth}</th>
            {offers.map((o) => <td key={o.slug} className="p-4 text-center text-[13px] font-semibold text-ink">{o.price === null ? o.priceLabel : money(o.price)}</td>)}
          </tr>
          <tr className="border-b border-line bg-paper/60">
            <th scope="row" className="p-4 font-medium text-ink">{t.includedMinutes}</th>
            {offers.map((o) => <td key={o.slug} className="p-4 text-center text-[13px] font-semibold text-ink">{o.minutes}{o.perMinute && <span className="block font-normal text-slate-light">{o.perMinute}</span>}</td>)}
          </tr>
          {c.matrix.map((g) => (
            <React.Fragment key={g.group}>
              <tr><th colSpan={6} scope="colgroup" className="bg-paper px-4 pb-2 pt-5 font-display text-sm font-semibold text-ink">{g.group}</th></tr>
              {g.rows.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <th scope="row" className="p-4 font-normal"><span className="block font-medium text-ink">{r.label}</span><span className="text-[13px] text-slate-light">{r.detail}</span></th>
                  {offers.map((o) => <td key={o.slug} className={`p-4 text-center ${o.featured ? 'bg-signal-soft/40' : ''}`}><CellView v={r.cells[o.slug]} t={t} /></td>)}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
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
            <tr className="border-b border-line text-left text-sm text-slate">
              <th className="py-2 font-medium">{t.rechargeCol}</th>
              {plans.map((o) => <th key={o.slug} className="py-2 text-right font-medium">{o.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {market.recharges.map((amount) => (
              <tr key={amount} className="border-b border-line last:border-0">
                <td className="py-2.5 font-semibold text-ink">{money(amount)}</td>
                {plans.map((o) => <td key={o.slug} className="py-2.5 text-right text-slate">{t.approxMinutes(num(Math.floor(amount / o.extraMinute!)))}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
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

/** Règles d’évolution : recharge pour un dépassement ponctuel, forfait supérieur pour un usage régulier. */
export function GrowthBlock() {
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

export function EconomyBlock() {
  const [calls, setCalls] = useState(200);
  const [cost, setCost] = useState(1.7);
  const [duration, setDuration] = useState(2);
  const i18n = useI18n();
  const { c, market, offer, money, num } = i18n;
  const t = c.ui.components.economy;
  const human = calls * cost;
  const minutes = calls * duration;
  const { offer: plan, extra } = useMemo(() => planFor(minutes, i18n), [minutes, i18n]);
  const rec = offer('receptionniste');
  // Montant sans décimales inutiles (ex. « 1,7 $ »), dans la devise et le format du marché.
  const amount = (n: number) => new Intl.NumberFormat(market.numberLocale, { style: 'currency', currency: market.currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
  const value = (n: number) => n.toLocaleString(market.numberLocale);
  // Hypothèse indicative d’accueil humain : 1,70 par appel, 200 appels par mois.
  const sampleCost = 1.7, sampleCalls = 200;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div>
        <Heading title={t.title} intro={t.intro(money(sampleCost, 2), money(Math.floor((sampleCost * sampleCalls) / 100) * 100), num(sampleCalls), rec.name, money(rec.price ?? 0), num(rec.minutesCount))} />
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="font-display font-semibold text-ink">{t.humanTitle}</p>
            <ul className="mt-3 space-y-1.5 text-[14px]">{t.humanPoints.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-ink bg-ink p-5 text-white/80">
            <p className="font-display font-semibold text-white">{market.brand}</p>
            <ul className="mt-3 space-y-1.5 text-[14px]">{t.aiPoints.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-light">{t.disclaimer}</p>
      </div>

      <form className="rounded-3xl border border-line bg-paper p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label={t.calculator}>
        <p className="font-display text-xl font-bold">{t.calculateTitle}</p>
        {[
          { id: 'calls', label: t.callsPerMonth, v: calls, set: setCalls, min: 20, max: 2000, step: 10, show: value },
          { id: 'cost', label: t.costPerCall, v: cost, set: setCost, min: 0.5, max: 5, step: 0.1, show: amount },
          { id: 'dur', label: t.avgDuration, v: duration, set: setDuration, min: 1, max: 8, step: 0.5, show: (n: number) => `${value(n)}${t.min}` },
        ].map((f) => (
          <div key={f.id} className="mt-5">
            <label htmlFor={f.id} className="flex justify-between text-sm font-semibold text-ink"><span>{f.label}</span><output htmlFor={f.id}>{f.show(f.v)}</output></label>
            <input id={f.id} type="range" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.set(Number(e.target.value))} className="mt-2 w-full accent-[#0FA3C4]" />
          </div>
        ))}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4"><p className="text-xs text-slate">{t.humanCost}</p><p className="font-display text-2xl font-bold text-ink">{money(human)}</p></div>
          <div className="rounded-xl bg-white p-4"><p className="text-xs text-slate">{t.callVolume}</p><p className="font-display text-2xl font-bold text-ink">{num(minutes)}{t.min}</p></div>
        </div>
        <div className="mt-3 rounded-xl bg-ink p-4 text-white">
          <p className="text-xs text-white/60">{t.suitedPlan}</p>
          <p className="font-display text-lg font-bold">{plan.name}{plan.price ? t.perMonth(money(plan.price)) : ''}{extra}</p>
          <p className="text-xs text-white/60">{plan.minutes}</p>
        </div>
      </form>
    </div>
  );
}

/* ---------- Sécurité et conformité (formulation vérifiable) ---------- */

const SECURITY_ICONS: React.ElementType[] = [UserCheck, Lock, ScrollText, KeyRound, ShieldCheck, Globe2];

export function SecurityBlock() {
  const { c } = useI18n();
  const tx = c.ui.components.security;
  const items = tx.items.map((it, n) => ({ icon: SECURITY_ICONS[n] || ShieldCheck, t: it.title, d: it.text }));
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
      <div>
        <Heading title={tx.title} intro={tx.intro} />
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/securite" className="text-signal-deep hover:underline">{tx.approach}</Link>
          <Link href="/confidentialite" className="text-signal-deep hover:underline">{tx.privacy}</Link>
        </div>
      </div>
      <div className="grid gap-x-8 gap-y-6 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2 sm:p-8">
        {items.map((i) => (
          <div key={i.t}><p className="flex items-center gap-2 font-display font-semibold text-ink"><i.icon className="h-4 w-4 text-signal" aria-hidden />{i.t}</p><p className="mt-1.5 text-[15px]">{i.d}</p></div>
        ))}
      </div>
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

export function IntegrationsGrid({ max }: { max?: number }) {
  const { c } = useI18n();
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {c.integrations.slice(0, max).map((i) => (
        <li key={i.name} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: i.color }} aria-hidden>{i.mark}</span>
          <div className="min-w-0"><p className="font-semibold text-ink">{i.name}</p><p className="truncate text-[13px] text-slate">{i.text}</p></div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- CTA final ---------- */

export function FinalCTA({ title, sector }: { title?: string; sector?: string }) {
  const { c, market } = useI18n();
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
      <p className="mt-6 text-center text-sm text-slate-light">{c.site.priceNote}</p>
    </Section>
  );
}

export { FaqDark, Mock };
