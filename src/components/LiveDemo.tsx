// Démo live : on choisit un rôle, une langue (une vraie voix par marché) et un mode d'essai.
// « Dans ce navigateur » ouvre l'assistante Autocalls de la langue choisie (même page widget que embed.js,
// ouverte d'office) dans une fenêtre ; « Sur mon téléphone » envoie une demande de rappel à /api/callback.
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { Loader2, Mic, PhoneCall, X } from 'lucide-react';
import { SITE, isActiveSector } from '@/data/site';
import { PhoneField, dialCode } from './ui';
import { useI18n } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/locales';
import { GENDERS, VOICES, type Gender } from '@/data/personas';

/** Nom de chaque langue dans sa propre langue (identique sur toutes les versions du site). */
const NATIVE: Record<Locale, string> = { fr: 'Français', 'en-gb': 'English (UK)', 'en-au': 'English (AU)', it: 'Italiano', pl: 'Polski', nl: 'Nederlands', he: 'עברית' };
/** Libellés internes de la note (lus par l'équipe et l'agent de la campagne, en français). */
const ROLE_NOTE = ['Réceptionniste', 'Commercial / qualification', 'Support'];
/** Teintes des orbes, dans l'ordre des rôles : [reflet, cœur, bord]. */
const HUES: [string, string, string][] = [
  ['#9BE7F7', '#0FA3C4', '#0B5F78'],
  ['#C3CFFF', '#5B7BFF', '#2A3A9E'],
  ['#A6F3DE', '#1FB99C', '#0B6E5C'],
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/* ---------- Onde de voix (choix du rôle) ---------- */

/** Hauteurs relatives des barres : une voix qui parle, un profil propre à chaque rôle. */
const BARS = [[0.45, 0.8, 1, 0.7, 0.4], [0.6, 1, 0.55, 0.9, 0.5], [0.4, 0.65, 0.9, 1, 0.6]];

function VoiceWave({ hue, bars, active }: { hue: [string, string, string]; bars: number[]; active: boolean }) {
  const [hi, mid, edge] = hue;
  return (
    <span
      aria-hidden
      className={`relative flex h-14 w-14 items-center justify-center gap-[3px] rounded-2xl transition-all duration-300 ${active ? 'scale-105 shadow-[0_8px_24px_rgba(5,10,30,.45)]' : 'scale-95 opacity-60 group-hover:opacity-90'}`}
      style={{ background: `radial-gradient(circle at 30% 25%, ${hi}55 0%, ${mid} 55%, ${edge} 100%)` }}
    >
      {bars.map((h, i) => (
        <span
          key={i}
          className={`block w-[4px] origin-center rounded-full bg-white ${active ? 'animate-wave motion-reduce:animate-none' : ''}`}
          style={{ height: `${Math.round(h * 26)}px`, animationDelay: `${i * 0.12}s`, opacity: active ? 0.95 : 0.75 }}
        />
      ))}
    </span>
  );
}

/* ---------- Grande orbe animée (canvas) ---------- */

interface Particle { a: number; r: number; v: number; s: number }

function BigOrb({ hue, energy }: { hue: [string, string, string]; energy: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  // Valeurs lues par la boucle d'animation sans la relancer.
  const target = useRef({ hue, energy });
  target.current = { hue, energy };
  const still = useRef<() => void>();

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const t0 = performance.now();
    let w = 0, h = 0, raf = 0, visible = true;
    let level = target.current.energy;
    const parts: Particle[] = Array.from({ length: 46 }, () => ({ a: Math.random() * Math.PI * 2, r: 0.9 + Math.random() * 0.9, v: 0.0006 + Math.random() * 0.0012, s: 0.6 + Math.random() * 1.4 }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const { hue: [hi, mid, edge], energy } = target.current;
      level += (energy - level) * 0.04;
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.24;
      ctx.clearRect(0, 0, w, h);

      // Halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 2.6);
      halo.addColorStop(0, `${mid}55`);
      halo.addColorStop(1, `${mid}00`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Particules qui s'éloignent du centre
      for (const p of parts) {
        if (!reduced) { p.r += p.v * (1 + level * 2); p.a += 0.0008; }
        if (p.r > 2.4) { p.r = 1.05; p.a = Math.random() * Math.PI * 2; }
        const d = R * p.r;
        const alpha = Math.min(1, Math.max(0, 1 - (p.r - 1) / 1.4)) * 0.8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(214,246,253,${alpha.toFixed(3)})`;
        ctx.arc(cx + Math.cos(p.a) * d, cy + Math.sin(p.a) * d, p.s, 0, Math.PI * 2);
        ctx.fill();
      }

      // Anneau d'ondes radiales
      const bars = 96;
      const base = R * 1.16;
      ctx.lineCap = 'round';
      for (let i = 0; i < bars; i++) {
        const a = (i / bars) * Math.PI * 2;
        const n = Math.sin(a * 3 + t * 1.7) * 0.5 + Math.sin(a * 7 - t * 2.3) * 0.3 + Math.sin(a * 13 + t * 3.1) * 0.2;
        const len = R * (0.05 + (0.1 + level * 0.32) * (0.5 + 0.5 * n));
        ctx.strokeStyle = i % 2 ? `${hi}cc` : `${hi}77`;
        ctx.lineWidth = Math.max(1.5, R * 0.022);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * base, cy + Math.sin(a) * base);
        ctx.lineTo(cx + Math.cos(a) * (base + len), cy + Math.sin(a) * (base + len));
        ctx.stroke();
      }

      // Onde continue (pulsation)
      ctx.beginPath();
      for (let i = 0; i <= 180; i++) {
        const a = (i / 180) * Math.PI * 2;
        const r = R * (1.06 + 0.025 * Math.sin(a * 5 + t * 2) * (0.6 + level));
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `${hi}aa`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Sphère
      const pulse = 1 + Math.sin(t * 2.2) * 0.012 * (1 + level * 2);
      const r0 = R * pulse;
      const core = ctx.createRadialGradient(cx - r0 * 0.35, cy - r0 * 0.4, r0 * 0.05, cx, cy, r0);
      core.addColorStop(0, hi);
      core.addColorStop(0.5, mid);
      core.addColorStop(1, edge);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r0, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
      ctx.clip();
      // Volutes lumineuses à l'intérieur de la sphère
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 3; k++) {
        const ang = t * (0.35 + k * 0.17) + k * 2.1;
        const gx = cx + Math.cos(ang) * r0 * 0.45, gy = cy + Math.sin(ang * 1.3) * r0 * 0.4;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r0 * 0.75);
        g.addColorStop(0, `${hi}66`);
        g.addColorStop(1, `${hi}00`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - r0, cy - r0, r0 * 2, r0 * 2);
      }
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (now: number) => {
      draw(now);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const start = () => { cancelAnimationFrame(raf); if (reduced) draw(t0 + 1200); else raf = requestAnimationFrame(loop); };

    still.current = () => draw(t0 + 1200);
    resize();
    start();
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(t0 + 1200); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else cancelAnimationFrame(raf); });
    io.observe(el);
    const onVis = () => { if (!document.hidden && visible) start(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [reduced]);

  // En mouvement réduit, une seule image : on la redessine quand la teinte change.
  useEffect(() => { if (reduced) still.current?.(); }, [reduced, hue]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />;
}

/* ---------- Assistante dans le navigateur (page widget Autocalls) ---------- */

/** Reproduit l'URL que construit embed.js, avec ouverture immédiate et le contexte de la démo. */
function widgetUrl(assistantId: string, cfg: Record<string, any>, variables: Record<string, string>) {
  const enc = (v: unknown) => encodeURIComponent(String(v ?? ''));
  const p = new URLSearchParams({
    assistant_id: assistantId,
    position: cfg.position || 'bottom-right',
    color: enc(cfg.color || '#0FA3C4'),
    text: enc(cfg.text || ''),
    size: cfg.size || 'small',
    mode: cfg.mode || 'voice_chat',
    toggle_button_size: cfg.toggle_button_size || 'normal',
    toggle_button_style: cfg.toggle_button_style || 'animated',
    header_title: enc(cfg.header_title), header_subtitle: enc(cfg.header_subtitle),
    button_main_text: enc(cfg.button_main_text), button_sub_text: enc(cfg.button_sub_text),
    start_button_text: enc(cfg.start_button_text), modal_title: enc(cfg.modal_title), modal_description: enc(cfg.modal_description),
    pre_form_title: enc(cfg.pre_form_title), pre_form_description: enc(cfg.pre_form_description), pre_form_submit_text: enc(cfg.pre_form_submit_text),
    chat_placeholder: enc(cfg.chat_placeholder), chat_send_button_aria_label: enc(cfg.chat_send_button_aria_label),
    voice_connecting_text: enc(cfg.voice_connecting_text), voice_disconnect_text: enc(cfg.voice_disconnect_text), voice_error_text: enc(cfg.voice_error_text),
    voice_tab_label: enc(cfg.voice_tab_label), chat_tab_label: enc(cfg.chat_tab_label),
    layout: 'standard',
    auto_open: 'true',
    show_function_calls: 'false',
  });
  if (cfg.avatar_url) p.set('avatar_url', enc(cfg.avatar_url));
  if (Array.isArray(cfg.form_fields) && cfg.form_fields.length) p.set('form_fields', enc(JSON.stringify(cfg.form_fields)));
  p.set('variables', enc(JSON.stringify(variables)));
  return `${SITE.appUrl}/web-widget/widget.html?${p.toString()}`;
}

function AssistantDialog({ src, title, closeLabel, onClose }: { src: string; title: string; closeLabel: string; onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ width: '400px', height: '600px' });

  useEffect(() => {
    // Les messages de notre fenêtre ne doivent pas redimensionner la bulle globale (embed.js écoute aussi
    // « message » sur window) : on les intercepte en phase de capture, avant son écouteur.
    const onMessage = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      e.stopImmediatePropagation();
      const d = e.data;
      if (d?.type !== 'voice-assistant-widget' || d.action !== 'resize') return;
      if (d.size === 'small') onClose();
      // Jamais plus petit que la taille d'origine : un redimensionnement trop court coupait le bouton « Démarrer ».
      else if (d.size === 'expanded') setSize({ width: `max(${d.width || '400px'}, 380px)`, height: `max(${d.height || '600px'}, 600px)` });
    };
    window.addEventListener('message', onMessage, true);
    // La bulle globale est masquée le temps de la conversation, pour ne pas avoir deux assistantes à l'écran.
    const bubbles = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe[title="Voice Assistant Widget"]'));
    bubbles.forEach((b) => { b.style.visibility = 'hidden'; });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('message', onMessage, true);
      window.removeEventListener('keydown', onKey);
      bubbles.forEach((b) => { b.style.visibility = ''; });
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[80] flex items-center justify-center bg-night/80 p-4 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex max-h-full flex-col items-end gap-2">
        <button ref={closeBtn} type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-glow">
          <X className="h-4 w-4" aria-hidden />{closeLabel}
        </button>
        <iframe
          ref={frame}
          src={src}
          title={title}
          allow="microphone; autoplay"
          className="max-h-[calc(100dvh-5rem)] max-w-[calc(100vw-2rem)] rounded-2xl bg-transparent"
          style={{ width: size.width, height: size.height, colorScheme: 'light' }}
        />
      </div>
    </div>
  );
}

/* ---------- Widget ---------- */

export default function LiveDemo({ sector: initialSector, showHeader = true, headingLevel = 'h2' }: {
  /** Secteur présélectionné (pages secteur, explorateur de scénarios) ; un changement de valeur le resélectionne. */
  sector?: string;
  /** Titre et introduction dans la carte (masqués quand la section a déjà son titre). */
  showHeader?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const { c, locale } = useI18n();
  const t = c.ui.components.liveDemo;
  const uid = useId().replace(/:/g, '');
  const [role, setRole] = useState(0);
  const [lang, setLang] = useState<Locale>(locale);
  const [gender, setGender] = useState<Gender>('female');
  const [sector, setSector] = useState(initialSector && c.sectors.some((s) => s.slug === initialSector && isActiveSector(s)) ? initialSector : c.sectors.filter(isActiveSector)[0].slug);
  const [mode, setMode] = useState<'browser' | 'phone'>('browser');
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState<string | null>(null);

  useEffect(() => { setLang(locale); }, [locale]);
  // Présélection pilotée par la page (explorateur de scénarios, lien /demo?sector=…) : chaque nouveau secteur reçu est appliqué.
  useEffect(() => { if (initialSector && c.sectors.some((s) => s.slug === initialSector && isActiveSector(s))) setSector(initialSector); }, [initialSector, c.sectors]);

  // Deux voix réelles par langue (féminine et masculine), chacune avec son prénom, son portrait et son assistant.
  const persona = VOICES[lang][gender];
  const voice = persona.name;
  const sectorName = c.sectors.find((s) => s.slug === sector)?.name ?? '';
  const hue = HUES[role];
  const Heading = headingLevel;

  const switchMode = (m: 'browser' | 'phone') => { setMode(m); setState('idle'); setError(''); };
  const closeDialog = useCallback(() => setDialog(null), []);

  async function openBrowser() {
    setState('busy'); setError('');
    try {
      const id = persona.widgetAssistantId;
      const res = await fetch(`${SITE.appUrl}/api/widget-config?assistant_id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error();
      const cfg = await res.json();
      if (cfg.widget_enabled === false) throw new Error();
      setDialog(widgetUrl(id, cfg, { demo_role: ROLE_NOTE[role], demo_language: NATIVE[lang], demo_sector: sectorName }));
      track('demo_start', { mode: 'browser', demo_language: lang, sector, voice: gender });
      setState('idle');
    } catch {
      setState('error'); setError(t.browserError);
    }
  }

  async function submitPhone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('consent')) { setError(t.consentRequired); return; }
    setState('busy'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), cc: dialCode(f.get('cc')), sector, consentCall: true, website: f.get('website') || undefined,
          type: 'commercial', agent: 'Démo live', locale: lang, voice: gender,
          // Note lue par l’agent avant de rappeler : en anglais neutre (les agents de chaque langue la comprennent).
          note: `Live demo — role: ${['receptionist', 'sales / qualification', 'support'][role]} — language: ${NATIVE[lang]} — voice: ${voice} — sector: ${sectorName}`,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error((locale === 'fr' && data.error) || t.sendFailed); }
      setState('sent');
      track('generate_lead', { lead_type: 'demo_call', demo_language: lang, sector, voice: gender });
    } catch (err: any) { setState('error'); setError(err.message || t.sendFailed); }
  }

  const legend = 'mb-2 text-[13px] font-medium text-white/60';
  const focusRing = 'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal-glow';
  const field = 'w-full rounded-xl border border-white/15 bg-white/[.06] px-3.5 py-3 text-[15px] text-white placeholder:text-white/40 focus:border-signal-glow focus:outline-none focus:ring-2 focus:ring-signal-glow/30';

  return (
    <div className="overflow-hidden rounded-[28px] bg-night text-white shadow-float ring-1 ring-white/10">
      {/* Grand écran : réglages à gauche ; à droite, l’agent puis l’action (essai navigateur ou rappel). */}
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto]">
        {/* Scène : l'orbe de l'agent choisi */}
        <div className="relative order-first min-h-[300px] overflow-hidden bg-[radial-gradient(120%_90%_at_50%_40%,#141E47_0%,#0A1233_70%)] sm:min-h-[360px] lg:col-start-2 lg:row-start-1">
          {/* Cercles concentriques : la ligne qui reste ouverte */}
          <div aria-hidden className="absolute inset-0 opacity-40 [background:repeating-radial-gradient(circle_at_50%_44%,transparent_0_46px,rgba(90,211,236,.08)_47px,transparent_48px)]" />
          <div className="absolute inset-x-0 top-0 bottom-[30%] [container-type:size] sm:bottom-[26%]">
            <BigOrb hue={hue} energy={dialog || state === 'busy' ? 1 : state === 'sent' ? 0.7 : 0.25} />
            {/* Visage de l'agent au cœur de l'orbe : la sphère colorée en devient le liseré, les ondes l'entourent. */}
            <div className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-[0_10px_40px_rgba(5,10,30,.55)]" style={{ width: 'min(41cqw, 41cqh)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={persona.photo} src={persona.photo} alt={t.portraitAlt(voice, t.accents[lang], gender === 'male')} width={200} height={200} decoding="async"
                className="h-full w-full animate-rise object-cover motion-reduce:animate-none" />
              <span aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,.18),inset_0_-14px_28px_rgba(10,18,51,.35)]" />
            </div>
          </div>
          <p className="absolute start-5 top-5 flex items-center gap-2 text-[13px] text-white/70">
            <span className="relative flex h-2 w-2" aria-hidden><span className="absolute inset-0 animate-ping rounded-full bg-ok/70 motion-reduce:animate-none" /><span className="relative h-2 w-2 rounded-full bg-ok" /></span>
            {t.stageLabel}
          </p>
          <div className="absolute inset-x-0 bottom-0 px-5 pb-6 text-center" aria-live="polite">
            <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none tracking-tight">{voice}</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-1.5 text-[12.5px]">
              <li className="rounded-full bg-white/10 px-2.5 py-1 text-white/85">{t.accents[lang]}</li>
              <li className="rounded-full px-2.5 py-1 font-semibold text-night" style={{ background: hue[0] }}>{t.roles[role].name}</li>
              {sectorName && <li className="rounded-full bg-white/10 px-2.5 py-1 text-white/85">{sectorName}</li>}
            </ul>
          </div>
        </div>

        {/* Réglages */}
        <div className="p-5 sm:p-8 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          {showHeader && (
            <>
              <Heading className="font-display text-[1.6rem] font-bold leading-tight text-white sm:text-[1.9rem]">{t.title}</Heading>
              <p className="mt-2 max-w-prose text-[15px] text-white/70">{t.intro}</p>
            </>
          )}

          <fieldset className={showHeader ? 'mt-6' : ''}>
            <legend className={legend}>{t.roleLabel}</legend>
            <div className="grid grid-cols-3 gap-2">
              {t.roles.map((r, i) => (
                <label key={r.name} className="group cursor-pointer text-center">
                  <input type="radio" name={`${uid}-role`} value={i} checked={role === i} onChange={() => setRole(i)} className="peer sr-only" />
                  <span className={`flex flex-col items-center gap-2 rounded-2xl px-1 py-3 transition-colors ${role === i ? 'bg-white/[.07]' : 'hover:bg-white/[.04]'} ${focusRing}`}>
                    <VoiceWave hue={HUES[i]} bars={BARS[i]} active={role === i} />
                    <span className={`text-[13.5px] font-semibold leading-tight ${role === i ? 'text-white' : 'text-white/60'}`}>{r.name}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 min-h-[2.5rem] text-[13.5px] text-white/60">{t.roles[role].text}</p>
          </fieldset>

          <fieldset className="mt-3">
            <legend className={legend}>{t.langLabel}</legend>
            <div className="flex flex-wrap gap-1.5">
              {[locale, ...LOCALES.filter((x) => x !== locale)].map((l) => (
                <label key={l} className="cursor-pointer">
                  <input type="radio" name={`${uid}-lang`} value={l} checked={lang === l} onChange={() => setLang(l)} className="peer sr-only" />
                  <span className={`flex items-center gap-1.5 rounded-full py-1 ps-1 pe-3 text-[13.5px] font-medium ring-1 transition-colors ${lang === l ? 'bg-signal-glow text-night ring-signal-glow' : 'text-white/75 ring-white/15 hover:ring-white/40'} ${focusRing}`}>
                    <span aria-hidden className="flex shrink-0 -space-x-2 rtl:space-x-reverse">
                      {GENDERS.map((g) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={g} src={VOICES[l][g].photo} alt="" width={24} height={24} loading="lazy"
                          className={`h-6 w-6 rounded-full object-cover ring-2 ${lang === l ? 'ring-signal-glow' : 'opacity-80 ring-night'}`} />
                      ))}
                    </span>
                    {NATIVE[l]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className={legend}>{t.voiceLabel}</legend>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => {
                const p = VOICES[lang][g];
                const on = gender === g;
                return (
                  <label key={g} className="cursor-pointer">
                    <input type="radio" name={`${uid}-voice`} value={g} checked={on} onChange={() => setGender(g)} className="peer sr-only" />
                    <span className={`flex items-center gap-2 rounded-2xl p-1.5 pe-2.5 ring-1 sm:gap-3 sm:p-2 sm:pe-3 transition-colors ${on ? 'bg-white/[.09] ring-signal-glow' : 'ring-white/15 hover:bg-white/[.04] hover:ring-white/40'} ${focusRing}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.photo} alt="" width={44} height={44} loading="lazy"
                        className={`h-9 w-9 shrink-0 rounded-full object-cover ring-2 sm:h-11 sm:w-11 ${on ? 'ring-signal-glow' : 'opacity-75 ring-transparent'}`} />
                      <span className={`min-w-0 truncate text-[14.5px] font-semibold leading-tight sm:text-[15px] ${on ? 'text-white' : 'text-white/70'}`}>
                        <span aria-hidden>{p.name}</span>
                        <span className="sr-only">{t.voiceOption(p.name, g === 'male')}</span>
                      </span>
                      <span aria-hidden className={`ms-auto flex h-4 w-4 shrink-0 items-center sm:h-5 sm:w-5 justify-center rounded-full ring-2 ${on ? 'bg-signal-glow ring-signal-glow' : 'ring-white/30'}`}>
                        {on && <span className="h-2 w-2 rounded-full bg-night" />}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-5 block">
            <span className={`${legend} block`}>{t.sector}</span>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className={field}>
              {c.sectors.filter(isActiveSector).map((s) => <option key={s.slug} value={s.slug} className="text-ink">{s.name}</option>)}
            </select>
          </label>

        </div>

        {/* Action : essayer dans le navigateur ou recevoir l’appel */}
        <div className="px-5 pb-6 sm:px-8 sm:pb-8 lg:col-start-2 lg:row-start-2 lg:bg-[#0A1233] lg:pt-1">
          <fieldset>
            <legend className="sr-only">{t.modeLabel}</legend>
            <div className="grid grid-cols-2 rounded-xl bg-white/[.06] p-1 ring-1 ring-white/10">
              {(['browser', 'phone'] as const).map((m) => (
                <label key={m} className="cursor-pointer">
                  <input type="radio" name={`${uid}-mode`} value={m} checked={mode === m} onChange={() => switchMode(m)} className="peer sr-only" />
                  <span className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-center text-[14px] font-semibold transition-colors ${mode === m ? 'bg-white text-ink shadow-card' : 'text-white/70 hover:text-white'} ${focusRing}`}>
                    {m === 'browser' ? <Mic className="h-4 w-4 shrink-0" aria-hidden /> : <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />}
                    {m === 'browser' ? t.modeBrowser : t.modePhone}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'browser' ? (
            <div className="mt-4">
              <p className="text-[14px] text-white/70">{t.browserText}</p>
              <button type="button" onClick={openBrowser} disabled={state === 'busy'} className="btn mt-4 w-full whitespace-normal bg-signal-glow py-3.5 text-[16px] text-night hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-glow">
                {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Mic className="h-5 w-5" aria-hidden />}
                {state === 'busy' ? t.browserOpening : t.browserCta(voice)}
              </button>
              {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
              <p className="mt-3 text-[12px] text-white/65">{t.browserLegal}</p>
            </div>
          ) : state === 'sent' ? (
            <div role="status" className="mt-4 rounded-2xl bg-white/[.07] p-5 ring-1 ring-white/10">
              <p className="font-display text-lg font-semibold">{t.sentTitle}</p>
              <p className="mt-1 text-[14px] text-white/75">{t.sentText(voice)}</p>
              <button type="button" onClick={() => switchMode('phone')} className="mt-3 text-sm font-semibold text-signal-glow underline-offset-4 hover:underline">{t.again}</button>
            </div>
          ) : (
            <form onSubmit={submitPhone} className="mt-4 grid gap-3">
              {/* Champ piège invisible pour les robots (ne pas remplir) */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              <div className="grid gap-2">
                <input name="name" required placeholder={t.firstName} autoComplete="given-name" aria-label={t.firstName} className={field} />
                <PhoneField id="demo-phone" label={t.phone} placeholder={t.phone} hideLabel className={field} />
              </div>
              <label className="flex items-start gap-2 text-[13px] text-white/70"><input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0 accent-[#5AD3EC]" />{t.consent}</label>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={state === 'busy'} className="btn w-full whitespace-normal bg-signal-glow py-3.5 text-[16px] text-night hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-glow">
                {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <PhoneCall className="h-5 w-5" aria-hidden />}
                {state === 'busy' ? t.sending : t.phoneCta}
              </button>
              <p className="text-[12px] text-white/65">{t.phoneLegal}</p>
            </form>
          )}
        </div>
      </div>
      {dialog && <AssistantDialog src={dialog} title={t.dialogTitle(voice)} closeLabel={t.close} onClose={closeDialog} />}
    </div>
  );
}
