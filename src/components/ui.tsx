import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, PhoneCall, Play, Sparkles } from 'lucide-react';
import { DEMO_URL, SIGNUP_URL, TRIAL_BADGES } from '@/data/site';
import { SECTORS } from '@/data/sectors';
import { useCallbackModal } from '@/context/CallbackContext';

/* ---------- Mise en page ---------- */

export function Section({
  id, tone = 'white', className = '', children,
}: { id?: string; tone?: 'white' | 'paper' | 'night'; className?: string; children: React.ReactNode }) {
  const bg = tone === 'paper' ? 'bg-paper' : tone === 'night' ? 'bg-night text-white/75' : 'bg-white';
  return (
    <section id={id} className={`${bg} py-16 sm:py-24 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Heading({
  title, intro, center = false, dark = false, as: Tag = 'h2',
}: { title: React.ReactNode; intro?: React.ReactNode; center?: boolean; dark?: boolean; as?: 'h1' | 'h2' }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <Tag className={`${Tag === 'h1' ? 'text-hero' : 'text-h2'} font-bold ${dark ? 'text-white' : ''}`}>{title}</Tag>
      {intro && <p className={`mt-4 text-lg ${dark ? 'text-white/70' : ''} ${center ? 'mx-auto' : ''} max-w-prose`}>{intro}</p>}
    </div>
  );
}

/* ---------- Conversion ---------- */

export function TrialBadges({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Conditions de l’essai">
      {TRIAL_BADGES.map((b) => (
        <li key={b} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${dark ? 'bg-white/10 text-white' : 'bg-signal-soft text-ink'}`}>
          <Check className="h-3.5 w-3.5 text-signal" aria-hidden /> {b}
        </li>
      ))}
    </ul>
  );
}

/** Les trois actions de conversion imposées par le design system (doc 100). */
export function CTAs({
  primary = 'Commencer gratuitement', demo = 'Essayer en live notre agent', callback = true,
  dark = false, sector, className = '',
}: { primary?: string; demo?: string; callback?: boolean; dark?: boolean; sector?: string; className?: string }) {
  const { openCallbackModal } = useCallbackModal();
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={SIGNUP_URL} className={dark ? 'btn-signal' : 'btn-primary'}>
          <Sparkles className="h-4 w-4" aria-hidden /> {primary}
        </Link>
        <Link href={DEMO_URL} className={dark ? 'btn-light' : 'btn-ghost'}>
          <Play className="h-4 w-4" aria-hidden /> {demo}
        </Link>
      </div>
      {callback && (
        <button
          type="button"
          onClick={() => openCallbackModal({ type: 'commercial', sector })}
          className={`inline-flex items-center gap-2 self-start text-[15px] font-semibold underline-offset-4 hover:underline ${dark ? 'text-signal-glow' : 'text-signal-deep'}`}
        >
          <PhoneCall className="h-4 w-4" aria-hidden /> Laissez votre numéro, on vous rappelle
        </button>
      )}
    </div>
  );
}

/* ---------- Formulaire de rappel (doc 94 : nom, téléphone, secteur, besoin) ---------- */

export function CallbackForm({
  type = 'commercial', sector = '', compact = false, dark = false, submitLabel = 'Faites-vous rappeler', onDone,
}: { type?: 'commercial' | 'support' | 'demo'; sector?: string; compact?: boolean; dark?: boolean; submitLabel?: string; onDone?: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('consent')) { setError('Cochez la case pour accepter d’être rappelé.'); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), email: f.get('email'),
          sector: f.get('sector'), note: f.get('note'), slot: f.get('slot') || 'asap',
          consentCall: true, type: type === 'support' ? 'support' : 'commercial',
          agent: type === 'demo' ? 'Démo live' : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'La demande n’a pas pu être envoyée.');
      setState('sent'); onDone?.();
    } catch (err: any) {
      setState('error'); setError(`${err.message} Réessayez ou écrivez à contact@permanenceia.com.`);
    }
  }

  const label = `block text-sm font-semibold ${dark ? 'text-white' : 'text-ink'} mb-1.5`;
  if (state === 'sent') {
    return (
      <div role="status" className={`rounded-xl p-6 ${dark ? 'bg-white/10 text-white' : 'bg-signal-soft text-ink'}`}>
        <p className="font-display text-lg font-semibold">Demande de rappel envoyée</p>
        <p className="mt-1 text-[15px]">Nous vous rappelons au créneau choisi. Un email de confirmation vous est envoyé si vous l’avez indiqué.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-4" noValidate={false}>
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div><label htmlFor="cb-name" className={label}>Nom</label><input id="cb-name" name="name" required autoComplete="name" className="field" /></div>
        <div><label htmlFor="cb-phone" className={label}>Téléphone</label><input id="cb-phone" name="phone" type="tel" required minLength={8} autoComplete="tel" className="field" /></div>
        <div>
          <label htmlFor="cb-sector" className={label}>Secteur</label>
          <select id="cb-sector" name="sector" defaultValue={sector} className="field">
            <option value="">Choisir…</option>
            {SECTORS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            <option value="autre">Autre activité</option>
          </select>
        </div>
        <div>
          <label htmlFor="cb-slot" className={label}>Quand vous rappeler ?</label>
          <select id="cb-slot" name="slot" className="field" defaultValue="asap">
            <option value="asap">Dès que possible</option>
            <option value="Aujourd’hui après-midi">Aujourd’hui après-midi</option>
            <option value="Demain matin">Demain matin</option>
            <option value="Demain après-midi">Demain après-midi</option>
          </select>
        </div>
      </div>
      {!compact && (
        <div><label htmlFor="cb-email" className={label}>Email <span className="font-normal opacity-70">(pour la confirmation)</span></label><input id="cb-email" name="email" type="email" autoComplete="email" className="field" /></div>
      )}
      <div><label htmlFor="cb-note" className={label}>Votre besoin</label><textarea id="cb-note" name="note" rows={compact ? 2 : 3} className="field" placeholder="Ex. : je rate des appels le soir, je veux automatiser les rendez-vous…" /></div>
      <label className={`flex items-start gap-2.5 text-sm ${dark ? 'text-white/80' : ''}`}>
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[#0FA3C4]" />
        <span>J’accepte d’être rappelé au numéro indiqué, y compris par un agent vocal IA de Permanence IA. Mes données servent uniquement à traiter ma demande.</span>
      </label>
      {error && <p role="alert" className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>}
      <button type="submit" disabled={state === 'sending'} className={dark ? 'btn-signal' : 'btn-primary'}>
        <PhoneCall className="h-4 w-4" aria-hidden /> {state === 'sending' ? 'Envoi…' : submitLabel}
      </button>
    </form>
  );
}

/* ---------- FAQ en accordéon sombre ---------- */

export function FaqDark({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="overflow-hidden rounded-2xl bg-night">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-white/10 last:border-0">
            <h3 className="font-display">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[17px] font-semibold text-white hover:text-signal-glow"
              >
                {it.q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-signal-glow transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
            </h3>
            {isOpen && <p className="px-6 pb-6 text-[15px] leading-relaxed text-white/70">{it.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Photo avec repli illustré ---------- */

export function Photo({ src, alt, className = '', fallback }: { src: string; alt: string; className?: string; fallback: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`h-full w-full object-cover ${className}`} />;
}

export function Tick({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/15"><Check className="h-3.5 w-3.5 text-signal" aria-hidden /></span>
      <span className={dark ? 'text-white/85' : 'text-ink'}>{children}</span>
    </li>
  );
}
