// Maquettes produit codées (cartes d’interface) : la « preuve visuelle » de chaque fonction.
import React from 'react';
import {
  CalendarCheck, CheckCircle2, FileText, Globe, Link2, MessageCircle, Mic, Phone,
  PhoneForwarded, PhoneOutgoing, Send, Sparkles, User, Workflow, Zap,
} from 'lucide-react';
import type { MockKind } from '@/i18n/content/fr/modules';
import { useI18n } from '@/i18n';

const useT = () => useI18n().c.ui.components.mock;

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-line bg-white p-5 shadow-card ${className}`}>{children}</div>
);

export function Wave({ bars = 18, className = '' }: { bars?: number; className?: string }) {
  return (
    <div className={`flex h-6 items-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} className="w-[3px] origin-center animate-wave rounded-full bg-signal" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 0.12}s` }} />
      ))}
    </div>
  );
}

/** Portrait rond de l’agent IA du marché (visage illustratif, décoratif : le nom est écrit à côté). */
export function AgentFace({ className = 'h-7 w-7' }: { className?: string }) {
  const { persona } = useI18n();
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={persona.photo} alt="" width={40} height={40} loading="lazy" className={`shrink-0 rounded-full object-cover ${className}`} />;
}

export function Bubble({ who, children }: { who: 'agent' | 'client'; children: React.ReactNode }) {
  const agent = who === 'agent';
  return (
    <div className={`flex gap-2 ${agent ? '' : 'flex-row-reverse'}`}>
      {agent ? <AgentFace className="mt-0.5 h-7 w-7" /> : (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper text-slate"><User className="h-3.5 w-3.5" aria-hidden /></span>
      )}
      <p className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug ${agent ? 'rounded-ss-sm bg-signal-soft text-ink' : 'rounded-se-sm bg-paper text-ink'}`}>{children}</p>
    </div>
  );
}

function CallMock() {
  const t = useT().call;
  const { persona } = useI18n();
  return (
    <Card>
      <div className="flex items-center justify-between rounded-xl bg-night px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 animate-pulsering rounded-full motion-reduce:animate-none"><AgentFace className="h-9 w-9" /></span>
          <div><p className="text-sm font-semibold">{persona.name} <span className="font-normal text-white/70">{t.agent}</span></p><p className="text-xs text-white/60">{t.meta}</p></div>
        </div>
        <Wave bars={12} />
      </div>
      <div className="mt-4 space-y-2.5">
        <Bubble who="client">{t.client}</Bubble>
        <Bubble who="agent">{t.reply}</Bubble>
      </div>
    </Card>
  );
}

function CalendarMock() {
  const t = useT().calendar;
  const days = t.days;
  return (
    <Card>
      <p className="font-display text-sm font-semibold text-ink">{t.week}</p>
      <div className="mt-3 grid grid-cols-5 gap-1.5 text-center text-xs">
        {days.map((d, i) => (
          <div key={d} className="space-y-1.5">
            <p className="text-slate-light">{d}</p>
            {[0, 1, 2].map((r) => (
              <div key={r} className={`h-7 rounded-md ${i === 1 && r === 0 ? 'bg-signal' : (i + r) % 3 === 0 ? 'bg-ink/10' : 'bg-paper'}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-signal/30 bg-signal-soft px-3.5 py-2.5">
        <CalendarCheck className="h-5 w-5 text-signal-deep" aria-hidden />
        <div><p className="text-sm font-semibold text-ink">{t.added}</p><p className="text-xs text-slate">{t.slot}</p></div>
      </div>
    </Card>
  );
}

function TranscriptMock() {
  const t = useT().transcript;
  return (
    <Card>
      <div className="flex items-center gap-3 rounded-lg bg-paper px-3 py-2"><Phone className="h-4 w-4 text-signal" aria-hidden /><Wave bars={26} className="flex-1" /><span className="text-xs text-slate">02:41</span></div>
      <p className="mt-4 text-xs font-semibold text-slate-light">{t.label}</p>
      <div className="mt-2 space-y-2.5">
        <Bubble who="agent">{t.question}</Bubble>
        <Bubble who="client">{t.answer}</Bubble>
      </div>
      <div className="mt-3 rounded-lg bg-ink px-3 py-2 text-xs text-white"><span className="text-signal-glow">{t.summaryLabel}</span>{t.summary}</div>
    </Card>
  );
}

const KNOWLEDGE_ICONS = [FileText, Globe, Link2];

function KnowledgeMock() {
  const t = useT().knowledge;
  const rows = t.rows.map((r, i) => ({ ...r, icon: KNOWLEDGE_ICONS[i] || FileText }));
  return (
    <Card>
      <p className="font-display text-sm font-semibold text-ink">{t.title}</p>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
            <r.icon className="h-5 w-5 text-signal" aria-hidden />
            <div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{r.name}</p><p className="text-xs text-slate-light">{r.meta}</p></div>
            <CheckCircle2 className="ms-auto h-4 w-4 text-ok" aria-hidden />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PromptMock() {
  const t = useT().prompt;
  return (
    <Card>
      <p className="font-display text-sm font-semibold text-ink">{t.title}</p>
      <p className="mt-1 text-xs text-slate-light">{t.hint}</p>
      <div className="mt-3 rounded-lg border border-line bg-paper p-3 text-sm text-ink">
        {t.text}
        <span className="ms-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-signal" aria-hidden />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {t.tags.map((t) => <span key={t} className="rounded-full bg-signal-soft px-2.5 py-1 font-medium text-ink">{t}</span>)}
      </div>
    </Card>
  );
}

const FLOW_ICONS = [Zap, PhoneOutgoing, FileText, Send];

function FlowMock() {
  const tx = useT().flow;
  const steps = tx.steps.map((st, i) => ({ icon: FLOW_ICONS[i] || Zap, t: st.title, s: st.source }));
  return (
    <Card>
      <div className="flex items-center gap-2"><Workflow className="h-4 w-4 text-signal" aria-hidden /><p className="font-display text-sm font-semibold text-ink">{tx.title}</p></div>
      <ol className="mt-3">
        {steps.map((st, i) => (
          <li key={st.t} className="relative flex items-center gap-3 pb-3 last:pb-0">
            {i < steps.length - 1 && <span className="absolute start-[17px] top-9 h-[calc(100%-24px)] w-px bg-line" aria-hidden />}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white"><st.icon className="h-4 w-4 text-ink" aria-hidden /></span>
            <div><p className="text-sm font-medium text-ink">{st.t}</p><p className="text-xs text-slate-light">{st.s}</p></div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function NumbersMock() {
  const tx = useT().numbers;
  const nums = tx.rows.map((r) => ({ c: r.country, n: r.kind, t: r.agent }));
  return (
    <Card>
      <p className="font-display text-sm font-semibold text-ink">{tx.title}</p>
      <ul className="mt-3 divide-y divide-line">
        {nums.map((x) => (
          <li key={x.c} className="flex items-center gap-3 py-2.5">
            <PhoneForwarded className="h-4 w-4 text-signal" aria-hidden />
            <div><p className="text-sm font-medium text-ink">{x.c}</p><p className="text-xs text-slate-light">{x.n}</p></div>
            <span className="ms-auto rounded-full bg-paper px-2.5 py-1 text-xs text-ink">{x.t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ReportMock() {
  const t = useT().report;
  const bars = [38, 52, 44, 70, 64, 82, 58];
  return (
    <Card>
      <div className="flex items-end justify-between">
        <div><p className="text-xs text-slate-light">{t.handled}</p><p className="font-display text-2xl font-bold text-ink">412</p></div>
        <span className="rounded-full bg-ok/10 px-2.5 py-1 text-xs font-semibold text-ok-deep">{t.demo}</span>
      </div>
      <div className="mt-4 flex h-24 items-end gap-2" aria-hidden>
        {bars.map((b, i) => <span key={i} className={`flex-1 rounded-t-md ${i === 5 ? 'bg-signal' : 'bg-ink/15'}`} style={{ height: `${b}%` }} />)}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        {t.stats.map(([k, v]) => (
          <div key={k} className="rounded-lg bg-paper py-2"><p className="font-display text-sm font-bold text-ink">{v}</p><p className="text-slate-light">{k}</p></div>
        ))}
      </div>
    </Card>
  );
}

function WidgetMock() {
  const t = useT().widget;
  return (
    <div className="relative">
      <Card className="pb-16">
        <div className="h-3 w-24 rounded bg-paper" /><div className="mt-2 h-3 w-40 rounded bg-paper" /><div className="mt-2 h-3 w-32 rounded bg-paper" />
        <div className="mt-6 grid grid-cols-3 gap-2"><div className="h-14 rounded-lg bg-paper" /><div className="h-14 rounded-lg bg-paper" /><div className="h-14 rounded-lg bg-paper" /></div>
      </Card>
      <div className="absolute -bottom-4 end-4 w-60 rounded-2xl bg-night p-4 text-white shadow-float">
        <p className="text-sm font-semibold">{t.question}</p>
        <div className="mt-3 grid gap-2">
          <span className="flex items-center justify-center gap-2 rounded-lg bg-signal-deep py-2 text-sm font-semibold"><Mic className="h-4 w-4" aria-hidden />{t.talk}</span>
          <span className="flex items-center justify-center gap-2 rounded-lg border border-white/20 py-2 text-sm"><Phone className="h-4 w-4" aria-hidden />{t.callback}</span>
        </div>
      </div>
    </div>
  );
}

function WhatsAppMock() {
  const t = useT().whatsapp;
  return (
    <Card className="bg-[#F3F7F5]">
      <div className="flex items-center gap-2 border-b border-line pb-3"><MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden /><p className="text-sm font-semibold text-ink">{t.title}</p></div>
      <div className="mt-3 space-y-2">
        <p className="ms-auto max-w-[85%] rounded-xl rounded-se-sm bg-[#DCF8C6] px-3 py-2 text-[14px] text-ink">{t.confirmation}</p>
        <p className="max-w-[60%] rounded-xl rounded-ss-sm bg-white px-3 py-2 text-[14px] text-ink">{t.reply}</p>
      </div>
    </Card>
  );
}

function CampaignMock() {
  const t = useT().campaign;
  const rows = t.rows;
  return (
    <Card>
      <p className="font-display text-sm font-semibold text-ink">{t.title}</p>
      <ul className="mt-3 space-y-2">
        {rows.map(([n, s, r]) => (
          <li key={n} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm">
            <PhoneOutgoing className="h-4 w-4 text-signal" aria-hidden /><span className="text-ink">{n}</span>
            <span className="ms-auto text-xs text-slate-light">{s}</span><span className="w-10 text-end text-xs font-semibold text-ink">{r}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-light">{t.note}</p>
    </Card>
  );
}

function LeadMock() {
  const t = useT().lead;
  return (
    <Card>
      <div className="flex items-center justify-between"><p className="font-display text-sm font-semibold text-ink">{t.title}</p><span className="rounded-full bg-signal-soft px-2.5 py-1 text-xs font-semibold text-signal-deep">{t.interest}</span></div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {t.fields.map(([k, v]) => (
          <div key={k}><dt className="text-xs text-slate-light">{k}</dt><dd className="font-medium text-ink">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs text-white"><Sparkles className="h-3.5 w-3.5 text-signal-glow" aria-hidden />{t.next}</div>
    </Card>
  );
}

function SupportMock() {
  const t = useT().support;
  return (
    <Card>
      <div className="space-y-2.5">
        <Bubble who="client">{t.client}</Bubble>
        <Bubble who="agent">{t.agent}</Bubble>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-slate">
        <FileText className="h-4 w-4 text-signal" aria-hidden />{t.found}
      </div>
    </Card>
  );
}

const MAP: Record<MockKind, () => JSX.Element> = {
  call: CallMock, calendar: CalendarMock, transcript: TranscriptMock, knowledge: KnowledgeMock, prompt: PromptMock,
  flow: FlowMock, numbers: NumbersMock, report: ReportMock, widget: WidgetMock, whatsapp: WhatsAppMock,
  campaign: CampaignMock, lead: LeadMock, support: SupportMock,
};

export default function Mock({ kind, className = '' }: { kind: MockKind; className?: string }) {
  const C = MAP[kind];
  return <div className={className}><C /></div>;
}
