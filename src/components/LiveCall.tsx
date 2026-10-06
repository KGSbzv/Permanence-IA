// Élément signature du site : un appel qui se déroule puis devient une fiche exploitable.
// Une seule animation orchestrée ; tout est affiché d’emblée si l’utilisateur réduit les animations.
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AgentFace, Bubble, Wave } from './Mock';
import { useI18n } from '@/i18n';

interface Props {
  title?: string;
  call: { who: 'agent' | 'client'; text: string }[];
  lead: { label: string; value: string }[];
  leadTitle?: string;
}

export default function LiveCall({ title, call, lead, leadTitle }: Props) {
  const { c, persona } = useI18n();
  const t = c.ui.components.liveCall;
  const total = call.length + 1; // les répliques puis la fiche
  const [step, setStep] = useState(total);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation seulement si la carte est visible et l’onglet actif ; sinon tout reste affiché.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden || !root.current) return;
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || id) return;
      setStep(1);
      id = window.setInterval(() => setStep((s) => (s >= total ? s : s + 1)), 1100);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(root.current);
    const show = () => { if (document.hidden) setStep(total); };
    document.addEventListener('visibilitychange', show);
    return () => { io.disconnect(); window.clearInterval(id); document.removeEventListener('visibilitychange', show); };
  }, [total]);

  const done = step >= total;
  return (
    <div ref={root} className="relative" role="figure" aria-label={t.ariaLabel}>
      <div className="rounded-3xl border border-line bg-white p-5 shadow-float">
        <div className="flex items-center justify-between rounded-2xl bg-night px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 shrink-0 rounded-full ${done ? '' : 'animate-pulsering'}`}><AgentFace className="h-10 w-10 ring-2 ring-signal" /></span>
            <div>
              <p className="text-sm font-semibold">{title ?? t.title}</p>
              <p className="text-xs text-white/60"><span className="font-medium text-white/85">{persona.name}</span> · {done ? t.ended : t.ongoing}</p>
            </div>
          </div>
          {!done && <Wave bars={14} />}
        </div>
        <div className="mt-4 min-h-[188px] space-y-2.5">
          {call.map((l, i) => (
            <div key={i} className={i < step ? 'animate-rise' : 'invisible'}>
              <Bubble who={l.who}>{l.text}</Bubble>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`relative -mt-6 ms-6 me-[-0.5rem] rounded-2xl border border-signal/30 bg-white p-4 shadow-card sm:ms-16 ${done ? 'animate-rise' : 'invisible'}`}
        aria-hidden={!done}
      >
        <p className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
          <CheckCircle2 className="h-4 w-4 text-ok" aria-hidden /> {leadTitle ?? t.leadTitle}
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          {lead.map((f) => (
            <div key={f.label}><dt className="text-xs text-slate-light">{f.label}</dt><dd className="font-medium text-ink">{f.value}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  );
}
