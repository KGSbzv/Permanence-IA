// Sections réutilisables des pages (docs 94, 95, 113, 114).
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BarChart3, CalendarDays, Car, Check, Database, Globe2, Home, KeyRound, Languages,
  Lock, MessageSquare, Minus, Phone, ScrollText, ShieldCheck, Sparkles, Stethoscope, UserCheck,
  UtensilsCrossed, Workflow, Wrench,
} from 'lucide-react';
import { MODULES, Module } from '@/data/modules';
import { SECTORS, Sector } from '@/data/sectors';
import { Cell, MATRIX, OFFERS, Offer, RECHARGES, euro, money } from '@/data/offers';
import { INTEGRATIONS } from '@/data/integrations';
import { DEMO_URL, GROWTH_LINES, PRICE_NOTE, SIGNUP_URL, TRIAL_LINE } from '@/data/site';
import { CTAs, CallbackForm, FaqDark, Heading, Photo, Section, Tick, TrialBadges } from './ui';
import Mock from './Mock';

/* ---------- Icônes ---------- */

const FAMILY_ICON: Record<Module['family'], React.ElementType> = {
  'Téléphonie': Phone, Automatisation: Workflow, 'CRM et données': Database, Messages: MessageSquare, Agenda: CalendarDays, Pilotage: BarChart3,
};
export const SECTOR_ICON: Record<string, React.ElementType> = {
  'services-a-domicile': Wrench, 'dentaire-cliniques': Stethoscope, immobilier: Home, automobile: Car, 'beaute-bien-etre': Sparkles, 'restaurants-hotellerie': UtensilsCrossed,
};

/* ---------- Ce que l’agent sait faire ---------- */

export function Benefits() {
  const items = [
    ['Répondez même hors horaires', 'Soirs, week-ends, pendant vos rendez-vous : chaque appel reçoit une réponse.'],
    ['Qualifiez automatiquement', 'L’agent pose vos questions et vous transmet une demande complète.'],
    ['Réservez des rendez-vous', 'Directement dans votre agenda, avec confirmation et rappel.'],
    ['Rappelez les leads plus vite', 'Un formulaire rempli devient un appel en quelques minutes.'],
    ['Gardez l’humain pour l’important', 'Transfert vers votre équipe quand la situation l’exige.'],
  ];
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([t, d]) => (
        <div key={t} className="border-t-2 border-ink pt-4">
          <h3 className="text-h3 font-semibold">{t}</h3>
          <p className="mt-2 text-[15px]">{d}</p>
        </div>
      ))}
      <div className="flex items-end border-t-2 border-signal pt-4">
        <Link href="/fonctionnalites/receptionniste-ia" className="inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">Voir l’agent en détail<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ---------- Modules ---------- */

export function ModuleCards({ slugs, max }: { slugs?: string[]; max?: number }) {
  const list = (slugs ? slugs.map((s) => MODULES.find((m) => m.slug === s)!).filter(Boolean) : MODULES).slice(0, max);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((m) => {
        const Icon = FAMILY_ICON[m.family];
        return (
          <Link key={m.slug} href={`/fonctionnalites/${m.slug}`} className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-soft"><Icon className="h-5 w-5 text-signal-deep" aria-hidden /></span>
            <h3 className="mt-4 text-h3 font-semibold">{m.name}</h3>
            <p className="mt-1.5 flex-1 text-[15px]">{m.short}</p>
            <span className="mt-4 text-sm font-semibold text-signal-deep group-hover:underline">Voir ce que ça inclut</span>
          </Link>
        );
      })}
    </div>
  );
}

/** Grand schéma « ce que ça inclut », organisé par familles (doc 95 §4). */
export function IncludesSchema() {
  const families: { name: string; icon: React.ElementType; items: string[] }[] = [
    { name: 'Téléphonie', icon: Phone, items: ['Appels entrants et sortants', 'Numéro dédié en option', 'Intégration SIP', 'Transfert vers un humain', 'Identification de l’appelant'] },
    { name: 'Automatisation', icon: Workflow, items: ['Éditeur de prompts', 'Flow builder sans code', 'Assistant d’automatisation', '300+ outils connectables'] },
    { name: 'CRM et données', icon: Database, items: ['Leads et préqualification', 'Base de connaissances', 'Historique des appels', 'Webhooks et API'] },
    { name: 'Messages', icon: MessageSquare, items: ['SMS', 'WhatsApp et templates', 'Messenger et Instagram', 'Widget web'] },
    { name: 'Agenda', icon: CalendarDays, items: ['Prise de rendez-vous', 'Confirmations et rappels', 'Reports et annulations'] },
    { name: 'Pilotage', icon: BarChart3, items: ['Tableau de bord', 'Rapports détaillés', 'Rôles et permissions'] },
    { name: 'Sécurité', icon: ShieldCheck, items: ['Consentement et opt-out', 'Rétention configurable', 'Chiffrement', 'Journal des actions'] },
  ];
  return (
    <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-white">
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal"><Sparkles className="h-6 w-6" aria-hidden /></span>
          <p className="mt-5 font-display text-2xl font-bold leading-tight text-white">Votre agent vocal IA</p>
          <p className="mt-2 text-[15px] text-white/70">Au centre : un agent configuré pour votre activité. Autour : tout ce qu’il peut utiliser.</p>
        </div>
        <Link href="/tarifs#comparatif" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-signal-glow hover:underline">Voir ce qui est inclus par offre<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
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
  return (
    <ol className={`grid gap-6 sm:grid-cols-2 ${steps.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-2xl border border-line bg-white p-6">
          <span className="font-display text-sm font-bold text-signal">Étape {i + 1}</span>
          <h3 className="mt-2 text-h3 font-semibold">{s.title}</h3>
          <p className="mt-1.5 text-[15px]">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Démo live ---------- */

export function DemoBlock({ sector }: { sector?: string }) {
  return (
    <Section tone="night" id="demo">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <Heading dark title="Essayez en live notre agent maintenant" intro="Parlez à l’agent depuis votre navigateur, ou laissez votre numéro pour recevoir un appel de démonstration adapté à votre secteur." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link href={DEMO_URL} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 hover:bg-white/10">
              <Phone className="h-6 w-6 text-signal-glow" aria-hidden />
              <p className="mt-3 font-display font-semibold text-white">Lancer la démo live</p>
              <p className="mt-1 text-sm">Une conversation réelle, sans installation.</p>
            </Link>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <UserCheck className="h-6 w-6 text-signal-glow" aria-hidden />
              <p className="mt-3 font-display font-semibold text-white">Me faire rappeler</p>
              <p className="mt-1 text-sm">L’agent vous appelle au créneau choisi.</p>
            </div>
          </div>
          <TrialBadges dark className="mt-8" />
        </div>
        <div className="rounded-3xl bg-white p-6 text-slate sm:p-8">
          <p className="font-display text-xl font-bold">Recevoir un appel de démonstration</p>
          <p className="mb-5 mt-1 text-[15px]">Gratuit, sans engagement. Vous entendez la voix et la façon dont l’agent qualifie une demande.</p>
          <CallbackForm type="demo" sector={sector} compact submitLabel="Me faire rappeler" />
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
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SECTORS.filter((s) => s.slug !== exclude).map((s) => {
        const Icon = SECTOR_ICON[s.slug];
        return (
          <Link key={s.slug} href={`/secteurs/${s.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white hover:border-ink">
            <SectorVisual s={s} className="aspect-[3/2]" />
            <div className="p-5">
              <h3 className="flex items-center gap-2 text-h3 font-semibold"><Icon className="h-5 w-5 text-signal" aria-hidden />{s.name}</h3>
              <p className="mt-1.5 text-[15px]">{s.short}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-signal-deep group-hover:underline">Voir la page {s.name.toLowerCase()}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ---------- Tarifs ---------- */

function PriceTag({ o, light = false }: { o: Offer; light?: boolean }) {
  const amount = o.price === null ? o.priceLabel : euro(o.price);
  return (
    <div>
      <p className={`font-display text-[2rem] font-bold leading-none ${light ? 'text-white' : 'text-ink'}`}>{amount}</p>
      <p className={`mt-1.5 text-sm ${light ? 'text-white/70' : 'text-slate'}`}>
        {o.price === 0 ? '14 jours offerts' : o.price === null ? 'Prix à la minute négocié' : 'HT / mois'}
      </p>
    </div>
  );
}

export function PricingCards({ only }: { only?: Offer['slug'][] }) {
  const list = only ? OFFERS.filter((o) => only.includes(o.slug)) : OFFERS;
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${list.length >= 5 ? 'xl:grid-cols-5' : list.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {list.map((o) => (
        <div key={o.slug} className={`relative flex flex-col rounded-2xl border p-6 ${o.featured ? 'border-ink bg-ink text-white/80' : 'border-line bg-white'}`}>
          {o.featured && <span className="absolute -top-3 left-6 rounded-full bg-signal px-3 py-1 text-xs font-semibold text-white">Le plus choisi</span>}
          <p className={`font-display text-lg font-bold ${o.featured ? 'text-white' : 'text-ink'}`}>{o.name}</p>
          <p className="mt-1 min-h-[2.5rem] text-sm">{o.audience}</p>
          <div className="mt-4"><PriceTag o={o} light={o.featured} /></div>
          <p className={`mt-3 text-sm font-semibold ${o.featured ? 'text-signal-glow' : 'text-signal-deep'}`}>{o.minutes}</p>
          {o.perMinute && <p className={`text-xs ${o.featured ? 'text-white/60' : 'text-slate-light'}`}>soit {o.perMinute}</p>}
          <ul className="mt-4 flex-1 space-y-2 text-[14px]">
            {o.highlights.map((h) => <li key={h} className="flex gap-2"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden /><span className={o.featured ? 'text-white' : 'text-ink'}>{h}</span></li>)}
          </ul>
          <Link href={o.slug === 'sur-mesure' ? '/contact' : `${SIGNUP_URL}?plan=${o.slug}`} className={`mt-6 ${o.featured ? 'btn-signal' : 'btn-ghost'} text-sm`}>{o.cta}</Link>
          <Link href={`/offres/${o.slug}`} className={`mt-2 text-center text-xs font-semibold hover:underline ${o.featured ? 'text-white/70' : 'text-slate'}`}>Détail de l’offre</Link>
        </div>
      ))}
    </div>
  );
}

export function GrowthLines({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium ${dark ? 'text-white/80' : 'text-ink'} ${className}`}>
      {GROWTH_LINES.map((l) => <li key={l} className="flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-signal" aria-hidden />{l}</li>)}
    </ul>
  );
}

function CellView({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-signal" aria-label="Inclus" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-line" aria-label="Non inclus" />;
  return <span className="text-[13px] font-medium text-ink">{v}</span>;
}

export function MatrixTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
        <caption className="sr-only">Fonctions incluses dans chaque forfait</caption>
        <thead className="bg-white">
          <tr className="border-b border-line">
            <th scope="col" className="p-4 font-display text-sm font-semibold text-ink">Dans votre interface</th>
            {OFFERS.map((o) => <th key={o.slug} scope="col" className={`p-4 text-center font-display text-sm font-semibold ${o.featured ? 'bg-signal-soft text-ink' : 'text-ink'}`}>{o.name}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line bg-paper/60">
            <th scope="row" className="p-4 font-medium text-ink">Prix HT / mois</th>
            {OFFERS.map((o) => <td key={o.slug} className="p-4 text-center text-[13px] font-semibold text-ink">{o.price === null ? o.priceLabel : euro(o.price)}</td>)}
          </tr>
          <tr className="border-b border-line bg-paper/60">
            <th scope="row" className="p-4 font-medium text-ink">Minutes incluses</th>
            {OFFERS.map((o) => <td key={o.slug} className="p-4 text-center text-[13px] font-semibold text-ink">{o.minutes}{o.perMinute && <span className="block font-normal text-slate-light">{o.perMinute}</span>}</td>)}
          </tr>
          {MATRIX.map((g) => (
            <React.Fragment key={g.group}>
              <tr><th colSpan={6} scope="colgroup" className="bg-paper px-4 pb-2 pt-5 font-display text-sm font-semibold text-ink">{g.group}</th></tr>
              {g.rows.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <th scope="row" className="p-4 font-normal"><span className="block font-medium text-ink">{r.label}</span><span className="text-[13px] text-slate-light">{r.detail}</span></th>
                  {OFFERS.map((o) => <td key={o.slug} className={`p-4 text-center ${o.featured ? 'bg-signal-soft/40' : ''}`}><CellView v={r.cells[o.slug]} /></td>)}
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
  const plans = OFFERS.filter((o) => o.extraMinute);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white p-6">
        <h3 className="text-h3 font-semibold">Recharges de crédit</h3>
        <p className="mt-1 text-[15px]">Le crédit paie les minutes au-delà de votre forfait. Il ne périme pas et s’ajoute immédiatement.</p>
        <table className="mt-4 w-full min-w-[460px] text-[15px]">
          <thead>
            <tr className="border-b border-line text-left text-sm text-slate">
              <th className="py-2 font-medium">Recharge HT</th>
              {plans.map((o) => <th key={o.slug} className="py-2 text-right font-medium">{o.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {RECHARGES.map((amount) => (
              <tr key={amount} className="border-b border-line last:border-0">
                <td className="py-2.5 font-semibold text-ink">{money(amount)}</td>
                {plans.map((o) => <td key={o.slug} className="py-2.5 text-right text-slate">≈ {Math.floor(amount / o.extraMinute!).toLocaleString('fr-FR')} min</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-2xl bg-ink p-6 text-white/80">
        <h3 className="text-h3 font-semibold text-white">Le forfait reste plus économique</h3>
        <p className="mt-1 text-[15px]">Une minute incluse coûte toujours moins cher qu’une minute supplémentaire.</p>
        <ul className="mt-5 space-y-3">
          {plans.map((o) => (
            <li key={o.slug} className="border-b border-white/10 pb-3 last:border-0">
              <p className="font-display font-semibold text-white">{o.name}</p>
              <p className="text-sm">Incluse : <span className="font-semibold text-signal-glow">{o.perMinute}</span> · supplémentaire : {money(o.extraMinute!, 2)} HT / min</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Règles d’évolution : recharge pour un dépassement ponctuel, forfait supérieur pour un usage régulier. */
export function GrowthBlock() {
  const rules = [
    { t: 'Dépassement léger, une fois', d: 'Une recharge suffit pour finir le mois.' },
    { t: 'Dépassements répétés', d: 'Nous vous proposons le forfait supérieur.' },
    { t: 'Recharges fréquentes', d: 'Votre tableau de bord vous indique que vous payez trop cher pour votre usage.' },
    { t: 'Au-delà de 2 500 min régulières', d: 'Nous construisons une offre sur mesure.' },
  ];
  const cases = [
    { m: '400 min ce mois-ci', plan: 'Réceptionniste + une recharge de crédit', note: '99 $ + 50 min × 0,39 $ ≈ 119 $ HT. Un dépassement ponctuel : la recharge suffit.' },
    { m: '900 min chaque mois', plan: 'Passez au forfait Assistant', note: '249 $ HT pour 1 000 min, contre ≈ 314 $ avec Réceptionniste + minutes supplémentaires. Moins cher, et de la marge.' },
    { m: '2 500 min régulières', plan: 'Offre sur mesure', note: 'Au-delà du forfait Centre d’appels, nous négocions un prix à la minute adapté à votre volume.' },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Heading title="Ajoutez des minutes ou changez de forfait, au bon moment" intro="Vous ne payez jamais une minute plus cher que nécessaire : nous vous indiquons quand une recharge suffit et quand le forfait supérieur devient plus avantageux." />
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
        {cases.map((c) => (
          <div key={c.m} className="rounded-2xl border border-line bg-white p-6">
            <p className="text-sm text-slate">Un client à</p>
            <p className="font-display text-2xl font-bold text-ink">{c.m}</p>
            <p className="mt-2 font-semibold text-signal-deep">{c.plan}</p>
            <p className="mt-1 text-[15px]">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Comparatif économique (prudent, doc 87) avec calculateur ---------- */

/** Forfait recommandé pour un volume mensuel, selon les règles d’évolution. */
export function planFor(minutes: number) {
  const [, rec, asst, centre, custom] = OFFERS;
  // Seuils : le forfait supérieur devient moins cher que forfait + minutes supplémentaires.
  if (minutes > 2500) return { offer: custom, extra: '' };
  if (minutes <= rec.minutesCount) return { offer: rec, extra: '' };
  if (minutes <= 735) return { offer: rec, extra: ' + recharge ponctuelle' };
  if (minutes <= asst.minutesCount) return { offer: asst, extra: '' };
  if (minutes <= 1690) return { offer: asst, extra: ' + recharge ponctuelle' };
  if (minutes <= centre.minutesCount) return { offer: centre, extra: '' };
  return { offer: centre, extra: ' + recharge, ou sur mesure si régulier' };
}

export function EconomyBlock() {
  const [calls, setCalls] = useState(200);
  const [cost, setCost] = useState(1.7);
  const [duration, setDuration] = useState(2);
  const human = calls * cost;
  const minutes = calls * duration;
  const { offer: plan, extra } = useMemo(() => planFor(minutes), [minutes]);
  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div>
        <Heading title="Un coût plus prévisible qu’un accueil humain" intro="Dans certaines configurations, un accueil humain revient autour de 1,70 $ par appel, soit plus de 300 $ pour 200 appels. Le forfait Réceptionniste à 99 $ HT couvre 350 minutes par mois, avec une disponibilité 24/7. Comparez avec vos propres chiffres." />
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="font-display font-semibold text-ink">Accueil humain</p>
            <ul className="mt-3 space-y-1.5 text-[14px]"><li>Horaires de bureau</li><li>Coût variable : salaire, charges, remplacements</li><li>Appels manqués aux pics</li></ul>
          </div>
          <div className="rounded-2xl border border-ink bg-ink p-5 text-white/80">
            <p className="font-display font-semibold text-white">Permanence IA</p>
            <ul className="mt-3 space-y-1.5 text-[14px]"><li>Disponible 24/7</li><li>Forfait clair, prix HT</li><li>Plusieurs appels en parallèle</li></ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-light">Hypothèse indicative, en dollars US : les coûts d’accueil varient fortement selon le pays, les horaires et les charges. Un appel n’équivaut pas à une minute.</p>
      </div>

      <form className="rounded-3xl border border-line bg-paper p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Calculateur de coût">
        <p className="font-display text-xl font-bold">Calculez votre cas</p>
        {[
          { id: 'calls', label: 'Appels par mois', v: calls, set: setCalls, min: 20, max: 2000, step: 10, unit: '' },
          { id: 'cost', label: 'Coût humain estimé par appel', v: cost, set: setCost, min: 0.5, max: 5, step: 0.1, unit: ' $' },
          { id: 'dur', label: 'Durée moyenne d’un appel', v: duration, set: setDuration, min: 1, max: 8, step: 0.5, unit: ' min' },
        ].map((f) => (
          <div key={f.id} className="mt-5">
            <label htmlFor={f.id} className="flex justify-between text-sm font-semibold text-ink"><span>{f.label}</span><output htmlFor={f.id}>{f.v.toLocaleString('fr-FR')}{f.unit}</output></label>
            <input id={f.id} type="range" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.set(Number(e.target.value))} className="mt-2 w-full accent-[#0FA3C4]" />
          </div>
        ))}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4"><p className="text-xs text-slate">Coût humain estimé</p><p className="font-display text-2xl font-bold text-ink">{fmt(human)} $</p></div>
          <div className="rounded-xl bg-white p-4"><p className="text-xs text-slate">Volume d’appels</p><p className="font-display text-2xl font-bold text-ink">{fmt(minutes)} min</p></div>
        </div>
        <div className="mt-3 rounded-xl bg-ink p-4 text-white">
          <p className="text-xs text-white/60">Forfait adapté à ce volume</p>
          <p className="font-display text-lg font-bold">{plan.name}{plan.price ? ` — ${euro(plan.price)} HT / mois` : ''}{extra}</p>
          <p className="text-xs text-white/60">{plan.minutes}</p>
        </div>
      </form>
    </div>
  );
}

/* ---------- Sécurité et conformité (formulation vérifiable) ---------- */

export function SecurityBlock() {
  const items = [
    { icon: UserCheck, t: 'Consentement et opt-out', d: 'Consentement au rappel, gestion des refus, plages d’appel autorisées et liste d’exclusion.' },
    { icon: Lock, t: 'Protection des données', d: 'Chiffrement en transit et au repos, accès par rôle et durée de conservation configurable.' },
    { icon: ScrollText, t: 'Traçabilité', d: 'Historique des appels, transcriptions et journal des actions pour chaque compte.' },
    { icon: KeyRound, t: 'Contrôle des accès', d: 'Rôles et permissions par membre de l’équipe avec le forfait Centre d’appels.' },
    { icon: ShieldCheck, t: 'Préparation réglementaire', d: 'Outils pour appliquer le RGPD : information, droit d’accès, suppression, rétention.' },
    { icon: Globe2, t: 'Infrastructure', d: 'Plateforme hébergée chez des fournisseurs cloud reconnus, avec sauvegardes et surveillance.' },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
      <div>
        <Heading title="Sécurité et conformité pour vos appels IA" intro="Vos appels contiennent des informations sur vos clients. La plateforme vous donne les réglages pour les protéger et respecter leurs choix." />
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/securite" className="text-signal-deep hover:underline">Notre approche sécurité</Link>
          <Link href="/confidentialite" className="text-signal-deep hover:underline">Politique de confidentialité</Link>
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
  const langs = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Néerlandais', 'Arabe', 'Polonais', 'Roumain', 'Turc', 'Suédois'];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-line bg-white p-8">
        <Languages className="h-7 w-7 text-signal" aria-hidden />
        <h3 className="mt-4 font-display text-[1.6rem] font-bold leading-tight">Des voix naturelles dans votre langue</h3>
        <p className="mt-2">Plus de 80 langues et de nombreux accents. L’agent détecte la langue de l’appelant et lui répond dans la même langue.</p>
        <ul className="mt-5 flex flex-wrap gap-2">{langs.map((l) => <li key={l} className="rounded-full bg-paper px-3 py-1 text-sm text-ink">{l}</li>)}<li className="rounded-full bg-signal-soft px-3 py-1 text-sm font-semibold text-ink">+ 70 autres</li></ul>
      </div>
      <div className="rounded-3xl bg-paper p-8">
        <Phone className="h-7 w-7 text-signal" aria-hidden />
        <h3 className="mt-4 font-display text-[1.6rem] font-bold leading-tight">Votre numéro ou un numéro dédié</h3>
        <p className="mt-2">Gardez votre numéro (renvoi d’appel, import Twilio ou Telnyx, connexion SIP à votre standard) ou prenez un numéro dédié en option, facturé au mois en plus du forfait.</p>
        <Link href="/fonctionnalites/sip-numeros" className="mt-5 inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">Voir les options téléphonie<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ---------- Intégrations ---------- */

export function IntegrationsGrid({ max }: { max?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {INTEGRATIONS.slice(0, max).map((i) => (
        <li key={i.name} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: i.color }} aria-hidden>{i.mark}</span>
          <div className="min-w-0"><p className="font-semibold text-ink">{i.name}</p><p className="truncate text-[13px] text-slate">{i.text}</p></div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- CTA final ---------- */

export function FinalCTA({ title = 'Prêt à automatiser vos appels ?', sector }: { title?: string; sector?: string }) {
  return (
    <Section tone="paper">
      <div className="grid gap-10 rounded-3xl bg-white p-8 shadow-card sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-h2 font-bold">{title}</h2>
          <p className="mt-3 font-semibold text-ink">{TRIAL_LINE}</p>
          <CTAs className="mt-8" primary="Démarrer mon essai gratuit" demo="Voir la démo live" sector={sector} />
        </div>
        <div className="rounded-2xl bg-paper p-6">
          <p className="font-display text-lg font-bold">Parler à un conseiller</p>
          <p className="mb-4 mt-1 text-[15px]">Laissez votre numéro : nous vous rappelons pour répondre à vos questions.</p>
          <CallbackForm compact sector={sector} />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-slate-light">{PRICE_NOTE}</p>
    </Section>
  );
}

export { FaqDark, Mock };
