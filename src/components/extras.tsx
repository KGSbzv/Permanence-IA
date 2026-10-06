// Sections inspirées des références (autocalls.ai, vendasta.com), en version honnête :
// démo réelle par rappel, équipe d’agents, onglets d’usages, parcours client, aperçu de l’espace client.
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BarChart3, BellRing, Bot, CalendarCheck, Check, Clock, FileText, Headphones, Layers,
  MessageCircle, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneOutgoing, RefreshCw, Search,
  ShieldCheck, Sparkles, Target, UserCheck, Users, Wand2,
} from 'lucide-react';
import LiveCall from './LiveCall';
import Mock, { Wave } from './Mock';
import { Heading, Photo } from './ui';
import { SECTOR_ICON } from './blocks';
import { useI18n } from '@/i18n';

/* ---------- Bandeau défilant ---------- */

export function Marquee({ items, className = '' }: { items: React.ReactNode[]; className?: string }) {
  return (
    <div className={`marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}>
      <div className="marquee-track flex w-max animate-marquee gap-3 motion-reduce:animate-none">
        {[...items, ...items].map((it, i) => <div key={i} aria-hidden={i >= items.length}>{it}</div>)}
      </div>
    </div>
  );
}

export function IndustryMarquee() {
  const { c } = useI18n();
  const names = c.ui.components.industryMarquee;
  return <Marquee items={names.map((n) => <span key={n} className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 font-display text-sm font-semibold text-ink">{n}</span>)} />;
}

const LANGUAGE_FLAGS = ['🇫🇷', '🇬🇧', '🇪🇸', '🇩🇪', '🇮🇹', '🇵🇹', '🇳🇱', '🇧🇪', '🇨🇭', '🇨🇦', '🇲🇦', '🇵🇱', '🇷🇴', '🇹🇷', '🇸🇪'];

export function LanguageMarquee() {
  const { c } = useI18n();
  const langs = c.ui.components.languageMarquee.map((n, i) => [LANGUAGE_FLAGS[i] ?? '', n]);
  return <Marquee items={langs.map(([f, n]) => <span key={n} className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card"><span aria-hidden>{f}</span>{n}</span>)} />;
}

/* ---------- Votre équipe d’agents IA (inspiré de l’« AI workforce ») ---------- */

// Apparence et liens des agents ; noms et rôles dans le contenu (même ordre).
const AGENT_STYLE = [
  { icon: PhoneIncoming, href: '/fonctionnalites/receptionniste-ia', color: 'from-signal to-signal-deep' },
  { icon: CalendarCheck, href: '/fonctionnalites/prise-de-rendez-vous', color: 'from-[#6C8CFF] to-[#3B5BDB]' },
  { icon: Target, href: '/fonctionnalites/qualification-des-leads', color: 'from-[#22C3A6] to-[#0E8F78]' },
  { icon: Headphones, href: '/fonctionnalites/support-client', color: 'from-[#F59E0B] to-[#C2410C]' },
  { icon: RefreshCw, href: '/fonctionnalites/campagnes-sortantes', color: 'from-[#A78BFA] to-[#6D28D9]' },
  { icon: MessageCircle, href: '/fonctionnalites/whatsapp-messages', color: 'from-[#34D399] to-[#059669]' },
];

function useAgents() {
  const { c } = useI18n();
  return AGENT_STYLE.map((st, i) => ({ ...st, ...c.ui.components.agentTeam.agents[i] }));
}

export function AgentOrbit() {
  const AGENTS = useAgents();
  const r = 42; // rayon en %
  return (
    <div className="relative mx-auto aspect-square w-[82%] max-w-md sm:w-full" aria-hidden>
      <div className="absolute inset-[14%] rounded-full border border-dashed border-signal/30" />
      <div className="absolute inset-[30%] rounded-full border border-line" />
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-float">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="" className="h-20 w-20 rounded-full" />
      </div>
      {AGENTS.map((a, i) => {
        const angle = (i / AGENTS.length) * 2 * Math.PI - Math.PI / 2;
        return (
          <div key={a.name} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${50 + r * Math.cos(angle)}%`, top: `${50 + r * Math.sin(angle)}%` }}>
            <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white shadow-card ring-4 ring-white`}><a.icon className="h-6 w-6" /></span>
            <span className="mx-auto mt-1.5 block w-max max-w-[7rem] whitespace-normal sm:max-w-[8rem] rounded-xl bg-white px-2 py-0.5 text-center text-[11px] font-semibold leading-tight text-ink shadow-card">{a.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export function AgentTeam() {
  const { c } = useI18n();
  const t = c.ui.components.agentTeam;
  const AGENTS = useAgents();
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
      <AgentOrbit />
      <div>
        <Heading title={t.title} intro={t.intro} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {AGENTS.map((a) => (
            <Link key={a.name} href={a.href} className="group flex gap-3 rounded-2xl border border-line bg-white p-4 hover:border-ink">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white`}><a.icon className="h-5 w-5" aria-hidden /></span>
              <span><span className="block font-display font-semibold text-ink group-hover:underline">{a.name}</span><span className="block text-[14px] leading-snug">{a.role}</span></span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-light">{t.custom}</p>
      </div>
    </div>
  );
}

/* ---------- Voyez l’agent en action : un onglet par secteur ---------- */

// Secteur sans photo : grande icône du métier sur fond doux.
function ShowcaseFallback({ slug }: { slug: string }) {
  const Icon = SECTOR_ICON[slug] || Sparkles;
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-signal-soft via-white to-paper">
      <Icon className="h-24 w-24 text-signal/30" aria-hidden />
    </div>
  );
}

export function SectorShowcase() {
  const { c } = useI18n();
  const t = c.ui.components.sectorShowcase;
  const [active, setActive] = useState(c.sectors[0].slug);
  const s = c.sectors.find((x) => x.slug === active)!;
  const base = useId().replace(/:/g, '');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ left: false, right: false });
  // Indice de défilement : un dégradé signale qu’il reste des onglets hors de vue.
  const measure = useCallback(() => {
    const el = list.current;
    if (!el) return;
    setFade({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);
  // Flèches gauche/droite, Début/Fin : on change d’onglet et on y place le focus.
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = c.sectors.length;
    const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(c.sectors[next].slug);
    tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  return (
    <div>
      <div className="relative">
        <div ref={list} onScroll={measure} role="tablist" aria-label={t.chooseSector} className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {c.sectors.map((x, i) => {
            const Icon = SECTOR_ICON[x.slug] || Sparkles;
            const on = x.slug === active;
            return (
              <button key={x.slug} ref={(el) => { tabs.current[i] = el; }} role="tab" id={`${base}-tab-${x.slug}`} aria-selected={on} aria-controls={`${base}-panel`}
                tabIndex={on ? 0 : -1} type="button" onClick={() => setActive(x.slug)} onKeyDown={(e) => onKey(e, i)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? 'bg-ink text-white' : 'border border-line bg-white text-ink hover:border-ink'}`}>
                <Icon className="h-4 w-4" aria-hidden />{x.name}
              </button>
            );
          })}
        </div>
        {fade.left && <span className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-paper to-transparent" aria-hidden />}
        {fade.right && <span className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-transparent" aria-hidden />}
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${s.slug}`} className="mt-8 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="aspect-[3/2]"><Photo key={s.slug} src={s.photo} alt={s.photoAlt} fallback={<ShowcaseFallback slug={s.slug} />} /></div>
          <p className="absolute inset-x-4 bottom-4 rounded-xl bg-white/90 px-4 py-3 text-[14px] text-ink backdrop-blur">{s.caption}</p>
        </div>
        <div>
          <LiveCall key={s.slug} title={t.agentFor(s.name.toLowerCase())} call={s.call} lead={s.lead} />
          <Link href={`/secteurs/${s.slug}`} className="mt-6 inline-flex items-center gap-1 font-semibold text-signal-deep hover:underline">{t.seeSolution(s.name.toLowerCase())}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Usages : appels entrants / sortants / messages ---------- */

// Icônes des onglets d’usage ; libellés et textes dans le contenu (même ordre).
const USE_ICONS = {
  entrants: { icon: PhoneIncoming, items: [PhoneIncoming, CalendarCheck, Headphones, UserCheck, PhoneForwarded, BellRing] },
  sortants: { icon: PhoneOutgoing, items: [PhoneOutgoing, CalendarCheck, RefreshCw, Target, Users, BarChart3] },
  messages: { icon: MessageCircle, items: [MessageCircle, FileText, Sparkles, Layers, Clock, Search] },
};
type UseKey = keyof typeof USE_ICONS;

export function UseCaseTabs() {
  const { c } = useI18n();
  const tx = c.ui.components.useCaseTabs;
  const [tab, setTab] = useState<UseKey>('entrants');
  const USES = (Object.keys(USE_ICONS) as UseKey[]).reduce((acc, k) => {
    acc[k] = { label: tx.tabs[k].label, icon: USE_ICONS[k].icon, items: tx.tabs[k].items.map((it, n) => ({ icon: USE_ICONS[k].items[n] || Sparkles, t: it.title, d: it.text })) };
    return acc;
  }, {} as Record<UseKey, { label: string; icon: React.ElementType; items: { icon: React.ElementType; t: string; d: string }[] }>);
  return (
    <div>
      <div role="tablist" aria-label={tx.ariaLabel} className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-3xl bg-paper p-1">
        {(Object.keys(USES) as UseKey[]).map((k) => {
          const T = USES[k]; const on = tab === k;
          return (
            <button key={k} role="tab" aria-selected={on} type="button" onClick={() => setTab(k)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${on ? 'bg-ink text-white' : 'text-ink'}`}>
              <T.icon className="h-4 w-4" aria-hidden />{T.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USES[tab].items.map((i) => (
          <div key={i.t} className="rounded-2xl border border-line bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-soft"><i.icon className="h-5 w-5 text-signal-deep" aria-hidden /></span>
            <h3 className="mt-4 text-h3 font-semibold">{i.t}</h3>
            <p className="mt-1.5 text-[15px]">{i.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Plateforme complète (grille de fonctions avec mini-visuels) ---------- */

export function PlatformGrid() {
  const { c } = useI18n();
  const t = c.ui.components.platformGrid;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">{t.simultaneousTitle}</p>
        <p className="mt-1 text-[15px]">{t.simultaneousText}</p>
        <div className="mt-6 grid grid-cols-6 gap-2" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => <span key={i} className={`flex h-8 items-center justify-center rounded-full ${i % 4 === 0 ? 'bg-signal text-white' : 'bg-white text-signal'}`}><PhoneCall className="h-3.5 w-3.5" /></span>)}
        </div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">{t.knowledgeTitle}</p>
        <p className="mt-1 text-[15px]">{t.knowledgeText}</p>
        <div className="mt-4 scale-95"><Mock kind="knowledge" /></div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="flex items-center gap-2 font-display text-lg font-bold text-ink"><Wand2 className="h-5 w-5 text-signal" aria-hidden />{t.promptTitle}</p>
        <p className="mt-1 text-[15px]">{t.promptText}</p>
        <div className="mt-4 scale-95"><Mock kind="prompt" /></div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">{t.transferTitle}</p>
        <p className="mt-1 text-[15px]">{t.transferText}</p>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-card" aria-hidden>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink"><Bot className="h-5 w-5 text-signal" />{t.aiAgent}</span>
          <Wave bars={10} />
          <span className="flex items-center gap-2 text-sm font-semibold text-ink"><Users className="h-5 w-5 text-ok" />{t.yourTeam}</span>
        </div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">{t.reportsTitle}</p>
        <p className="mt-1 text-[15px]">{t.reportsText}</p>
        <div className="mt-4 scale-95"><Mock kind="report" /></div>
      </div>
      <div className="rounded-3xl bg-paper p-6">
        <p className="font-display text-lg font-bold text-ink">{t.campaignsTitle}</p>
        <p className="mt-1 text-[15px]">{t.campaignsText}</p>
        <div className="mt-4 scale-95"><Mock kind="campaign" /></div>
      </div>
    </div>
  );
}

/* ---------- Parcours client : Attirer, Convertir, Fidéliser, Mesurer ---------- */

// Icônes et maquettes des étapes ; libellés dans le contenu (même ordre).
const STAGE_STYLE = [
  { icon: Search, mock: 'widget' as const },
  { icon: Target, mock: 'lead' as const },
  { icon: Users, mock: 'whatsapp' as const },
  { icon: BarChart3, mock: 'report' as const },
];

export function Lifecycle() {
  const { c } = useI18n();
  const tx = c.ui.components.lifecycle;
  const STAGES = tx.stages.map((st, n) => ({ k: st.key, t: st.title, items: st.items, ...STAGE_STYLE[n] }));
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div>
      <Heading center title={tx.title} intro={tx.intro} />
      <div role="tablist" aria-label={tx.ariaLabel} className="mx-auto mt-10 grid max-w-3xl grid-cols-4 gap-2">
        {STAGES.map((x, n) => (
          <button key={x.k} role="tab" aria-selected={n === i} type="button" onClick={() => setI(n)}
            className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-sm font-semibold transition-colors ${n === i ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-signal-soft'}`}>
            <x.icon className="h-5 w-5" aria-hidden />{x.k}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-[1.75rem] font-bold">{s.t}</h3>
          <ul className="mt-5 space-y-3">{s.items.map((it) => <li key={it} className="flex gap-3 text-ink"><Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />{it}</li>)}</ul>
        </div>
        <div className="mx-auto w-full max-w-md"><Mock kind={s.mock} /></div>
      </div>
    </div>
  );
}

/* ---------- Aperçu de l’espace client (inspiré de la « Business App ») ---------- */

const TAG_COLORS = ['bg-ok/10 text-ok', 'bg-red-50 text-red-700', 'bg-signal-soft text-signal-deep', 'bg-paper text-slate'];

export function PortalPreview() {
  const { c } = useI18n();
  const t = c.ui.components.portalPreview;
  const calls = t.calls.map((x, n) => ({ ...x, c: TAG_COLORS[n] || 'bg-paper text-slate' }));
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <Heading title={t.title} intro={t.intro} />
        <ul className="mt-6 space-y-2.5">
          {t.points.map((t) => <li key={t} className="flex gap-3 text-ink"><Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />{t}</li>)}
        </ul>
        <p className="mt-6 flex items-center gap-2 text-sm text-slate-light"><ShieldCheck className="h-4 w-4 text-signal" aria-hidden />{t.roles}</p>
      </div>
      <div className="relative">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-float">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <p className="font-display font-semibold text-ink">{t.dashboard}</p>
            <span className="text-xs text-slate-light">{t.sampleData}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {t.stats.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-paper p-3"><p className="text-xs text-slate">{k}</p><p className="font-display text-lg font-bold text-ink">{v}</p></div>
            ))}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {calls.map((x) => (
              <li key={x.who} className="flex items-center gap-3 py-2.5 text-sm">
                <PhoneIncoming className="h-4 w-4 text-signal" aria-hidden />
                <span className="font-medium text-ink">{x.who}</span><span className="hidden text-slate sm:inline">{x.what}</span>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${x.c}`}>{x.tag}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute -bottom-8 -left-4 hidden w-44 rounded-[1.6rem] border-4 border-ink bg-white p-3 shadow-float sm:block" aria-hidden>
          <p className="text-[11px] font-semibold text-ink">{t.notification}</p>
          <p className="mt-1 rounded-lg bg-signal-soft p-2 text-[11px] text-ink">{t.notifBooking}</p>
          <p className="mt-1.5 rounded-lg bg-paper p-2 text-[11px] text-ink">{t.notifMinutes}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Avant / après (doc 96) ---------- */

export function BeforeAfter({ before, after }: { before: string[]; after: string[] }) {
  const { c, market } = useI18n();
  const t = c.ui.components.beforeAfter;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-line bg-white p-7">
        <p className="font-display text-lg font-bold text-slate">{t.without}</p>
        <ul className="mt-4 space-y-3">{before.map((b) => <li key={b} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-light" aria-hidden />{b}</li>)}</ul>
      </div>
      <div className="rounded-3xl bg-ink p-7 text-white/85">
        <p className="font-display text-lg font-bold text-white">{t.with(market.brand)}</p>
        <ul className="mt-4 space-y-3">{after.map((a) => <li key={a} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-signal-glow" aria-hidden />{a}</li>)}</ul>
      </div>
    </div>
  );
}
