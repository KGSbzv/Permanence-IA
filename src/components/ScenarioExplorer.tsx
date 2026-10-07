// Explorateur de scénarios : « choisissez votre métier, écoutez votre agent ».
// À gauche, les métiers comme des lignes d’un standard ; à droite, la ligne choisie « décroche » :
// photo du métier, agent du marché qui répond (extrait s.call), bénéfices, offre conseillée et deux actions.
// Une seule transition orchestrée au changement de métier ; tout s’affiche d’emblée si les animations sont réduites.
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowUpRight, Check, CheckCircle2, PhoneCall, RotateCcw, Sparkles } from 'lucide-react';
import { Wave } from './Mock';
import { SECTOR_ICON } from './blocks';
import { useI18n } from '@/i18n';
import { isActiveSector } from '@/data/site';
import type { Sector } from '@/i18n/content/fr/sectors';

const STEP_MS = 950;
/** Ancre de la démo live en haut des pages qui l’affichent avec l’explorateur. */
export const LIVE_DEMO_ID = 'demo-live';

/**
 * Relie l’explorateur à la démo live de la page : secteur présélectionné (lu aussi dans ?sector=… à l’arrivée),
 * et action « Essayer ce scénario » qui le présélectionne puis ramène à la démo.
 */
export function useLiveDemoSector() {
  const router = useRouter();
  const [sector, setSector] = useState<string>();
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.sector;
    if (typeof q === 'string') setSector(q);
  }, [router.isReady, router.query.sector]);
  const trySector = useCallback((slug: string) => {
    setSector(slug);
    const el = document.getElementById(LIVE_DEMO_ID);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }, []);
  return { sector, trySector };
}

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Secteur sans photo : grande icône du métier sur fond doux (même principe que la vitrine des secteurs). */
function StageFallback({ slug }: { slug: string }) {
  const Icon = SECTOR_ICON[slug] || Sparkles;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-signal-soft via-white to-paper">
      <Icon className="absolute -start-10 -top-10 h-72 w-72 text-signal/10" aria-hidden />
      <Icon className="relative h-24 w-24 text-signal/40 md:-translate-x-1/2 lg:-translate-x-3/4" aria-hidden />
    </div>
  );
}

/** Photo du métier (ou illustration) avec sa légende ; le voile sombre n’existe que sur une vraie photo. */
function Stage({ s, Icon }: { s: Sector; Icon: React.ElementType }) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // Image en échec avant l’hydratation : onError n’a pas été reçu, on le constate au montage.
  useEffect(() => { const el = img.current; if (el && el.complete && el.naturalWidth === 0) setFailed(true); }, []);
  const photo = !!s.photo && !failed;
  return (
    <div className="relative h-56 overflow-hidden rounded-[18px] bg-paper sm:h-72 md:absolute md:inset-0 md:h-auto">
      <div className="h-full w-full animate-stage motion-reduce:animate-none">
        {photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img ref={img} src={s.photo} alt={s.photoAlt} onError={() => setFailed(true)} className="h-full w-full object-cover" />
          : <StageFallback slug={s.slug} />}
      </div>
      {photo && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent md:bg-gradient-to-r md:from-night/75 md:via-night/25" aria-hidden />}
      <p className={`absolute bottom-8 start-4 end-4 max-w-sm text-[15px] font-medium leading-snug md:bottom-6 md:start-6 md:end-auto md:max-w-[17rem] ${photo ? 'text-white' : 'text-ink'}`}>
        <span className="mb-2 flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink"><Icon className="h-3.5 w-3.5 text-signal-deep" aria-hidden />{s.name}</span>
        {s.caption}
      </p>
    </div>
  );
}

/** Mini-appel : l’agent du marché décroche, la conversation se déroule, puis la demande est créée. */
function AnswerCard({ s, armed }: { s: Sector; armed: boolean }) {
  const { c, persona, locale } = useI18n();
  const tc = c.ui.components.liveCall;
  const t = c.ui.components.scenarioExplorer;
  const total = s.call.length + 1; // les répliques puis la fiche
  const [step, setStep] = useState(total);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!armed || reducedMotion() || document.hidden) { setStep(total); return; }
    setStep(0);
    const id = window.setInterval(() => setStep((n) => (n >= total ? n : n + 1)), STEP_MS);
    return () => window.clearInterval(id);
  }, [armed, total, run]);

  const done = step >= total;
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/95 p-4 shadow-float backdrop-blur" role="figure" aria-label={tc.ariaLabel}>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={persona.photo} alt="" width={44} height={44} className={`h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-signal ${done ? '' : 'animate-pulsering'}`} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-ink">{t.answering(persona.name)}</p>
          <p className="truncate text-xs text-slate-light">{done ? tc.ended : tc.ongoing}</p>
        </div>
        {!done && <Wave bars={8} className="h-5" />}
      </div>

      <ol className="mt-3 space-y-2" aria-live="off">
        {s.call.map((l, i) => {
          const agent = l.who === 'agent';
          return (
            <li key={i} className={`flex ${agent ? '' : 'justify-end'} ${i < step ? 'animate-rise' : 'invisible'}`}>
              <p className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-[13.5px] leading-snug text-ink ${agent ? 'rounded-ss-sm bg-signal-soft' : 'rounded-se-sm bg-paper'}`}>{l.text}</p>
            </li>
          );
        })}
      </ol>

      <div className={`mt-auto pt-3 ${done ? 'animate-rise' : 'invisible'}`} aria-hidden={!done}>
        <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
          <p className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-ink">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" aria-hidden />
            <span className="min-w-0">{tc.leadTitle}{locale === 'fr' ? '\u00a0: ' : ': '}{s.lead[0]?.value}</span>
          </p>
          <button type="button" onClick={() => setRun((r) => r + 1)} tabIndex={done ? 0 : -1}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-signal-deep hover:bg-signal-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />{t.replay}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioExplorer({ onTry }: {
  /** « Essayer ce scénario en direct » : présélectionne le métier dans la démo live de la page. Sans fonction, renvoie vers /demo?sector=… */
  onTry?: (slug: string) => void;
}) {
  const { c, offer, money } = useI18n();
  const t = c.ui.components.scenarioExplorer;
  // Secteurs santé en pause : absents des onglets.
  const sectors = useMemo(() => c.sectors.filter(isActiveSector), [c.sectors]);
  const [active, setActive] = useState(sectors[0].slug);
  const s = sectors.find((x) => x.slug === active) ?? sectors[0];
  const o = offer(s.offer);
  const base = useId().replace(/:/g, '');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  // L’appel ne démarre qu’une fois l’explorateur visible ; ensuite chaque changement de métier le rejoue.
  const [armed, setArmed] = useState(false);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setArmed(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setVertical(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const select = useCallback((i: number, focus = false) => {
    setActive(sectors[i].slug);
    if (focus) {
      tabs.current[i]?.focus();
      tabs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  }, [sectors]);

  // Flèches (dans les deux sens, la liste est verticale sur grand écran et horizontale sur mobile), Début, Fin.
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = sectors.length;
    const rtl = document.documentElement.dir === 'rtl';
    const next = ({ ArrowRight: rtl ? i - 1 : i + 1, ArrowDown: i + 1, ArrowLeft: rtl ? i + 1 : i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select((next + n) % n, true);
  };

  const Icon = SECTOR_ICON[s.slug] || Sparkles;
  const tryHref = `/demo?sector=${encodeURIComponent(s.slug)}#${LIVE_DEMO_ID}`;
  const price = o.price === null ? o.priceLabel : o.price === 0 ? o.priceLabel : `${money(o.price)} ${c.offerLabels.perMonth}`;

  return (
    <div ref={root} className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[28px] bg-night p-2 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      {/* Standard : une ligne par métier */}
      <div className="px-2 pb-2 pt-3 lg:px-3 lg:py-5">
        <p id={`${base}-label`} className="px-1 text-sm text-white/55 lg:px-2">{t.chooseTrade}</p>
        <div role="tablist" aria-labelledby={`${base}-label`} aria-orientation={vertical ? 'vertical' : 'horizontal'}
          className="-mx-2 mt-3 flex gap-2 overflow-x-auto px-2 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {sectors.map((x, i) => {
            const XIcon = SECTOR_ICON[x.slug] || Sparkles;
            const on = x.slug === active;
            return (
              <button key={x.slug} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab"
                id={`${base}-tab-${x.slug}`} aria-selected={on} aria-controls={`${base}-panel`} tabIndex={on ? 0 : -1}
                onClick={() => select(i)} onKeyDown={(e) => onKey(e, i)}
                className={`group flex shrink-0 items-center gap-3 rounded-full py-1.5 ps-1.5 pe-4 text-start text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-glow lg:rounded-xl lg:pe-3 ${on ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${on ? 'bg-signal text-night' : 'bg-white/5 text-signal-glow'}`}>
                  <XIcon className="h-4 w-4" aria-hidden />
                </span>
                <span className="whitespace-nowrap lg:flex-1 lg:whitespace-normal lg:leading-tight">{x.name}</span>
                {on && <Wave bars={4} className="hidden h-4 lg:flex" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* La ligne choisie décroche */}
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${s.slug}`} tabIndex={0}
        className="rounded-[22px] bg-white p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-glow sm:p-3">
        <div key={s.slug}>
          <div className="relative md:h-[430px]">
            <Stage s={s} Icon={Icon} />
            <div className="relative -mt-4 px-2 animate-dock motion-reduce:animate-none md:absolute md:bottom-4 md:end-4 md:top-4 md:mt-0 md:w-[min(23rem,55%)] md:px-0">
              <AnswerCard s={s} armed={armed} />
            </div>
          </div>

          <div className="grid gap-6 px-3 pb-3 pt-6 sm:px-4 md:grid-cols-[1.25fr_1fr] md:gap-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">{t.benefitsTitle}</h3>
              <ul className="mt-3 space-y-2.5">
                {s.benefits.slice(0, 3).map((b, i) => (
                  <li key={b} className="flex gap-3 animate-rise motion-reduce:animate-none" style={{ animationDelay: `${250 + i * 90}ms` }}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/15"><Check className="h-3.5 w-3.5 text-signal-deep" aria-hidden /></span>
                    <span className="text-[15px] text-ink">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <Link href={`/offres/${o.slug}`} className="group rounded-2xl border border-line p-4 hover:border-ink">
                <p className="text-sm text-slate">{t.planLabel}</p>
                <p className="mt-0.5 flex items-baseline justify-between gap-3">
                  <span className="font-display text-xl font-bold text-ink">{o.name}</span>
                  <span className="text-sm font-medium text-slate">{price}</span>
                </p>
                <p className="mt-1 text-[13px] text-slate-light">{o.audience}</p>
              </Link>
              {onTry ? (
                <button type="button" onClick={() => onTry(s.slug)} className="btn-primary gap-2"><PhoneCall className="h-4 w-4" aria-hidden />{t.tryLive}</button>
              ) : (
                <Link href={tryHref} className="btn-primary gap-2"><PhoneCall className="h-4 w-4" aria-hidden />{t.tryLive}</Link>
              )}
              <Link href={`/secteurs/${s.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-signal-deep hover:underline">
                {c.ui.components.sectorCards.seePage(s.name.toLowerCase())}<ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
