import React, { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowUpRight, Check, ChevronDown, PhoneCall, Play, Sparkles } from 'lucide-react';
import { DEMO_URL, SIGNUP_URL, SITE } from '@/data/site';
import { useCallbackModal } from '@/context/CallbackContext';
import { useI18n } from '@/i18n';

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

/** Au plus trois pastilles sur mobile ; les suivantes apparaissent à partir de sm. */
const MOBILE_BADGES = 3;

export function TrialBadges({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const { c, market } = useI18n();
  const badges = c.site.trialBadges(market.trial.days, market.trial.minutes);
  const hideOnMobile = (n: number) => (n >= MOBILE_BADGES ? 'hidden sm:inline-flex' : 'inline-flex');
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={c.ui.components.trialBadges.ariaLabel}>
      {badges.map((b, n) => (
        <li key={b} className={`${hideOnMobile(n)} items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${dark ? 'bg-white/10 text-white' : 'bg-signal-soft text-ink'}`}>
          <Check className="h-3.5 w-3.5 text-signal" aria-hidden /> {b}
        </li>
      ))}
      {c.site.growthLines.map((g, n) => (
        <li key={g} className={`${hideOnMobile(badges.length + n)} items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${dark ? 'border-white/15 text-white/85' : 'border-line text-ink'}`}>
          <ArrowUpRight className="h-3.5 w-3.5 text-signal" aria-hidden /> {g}
        </li>
      ))}
    </ul>
  );
}

/** Les trois actions de conversion imposées par le design system (doc 100). */
export function CTAs({
  primary, demo, callback = true,
  dark = false, sector, className = '',
}: { primary?: string; demo?: string; callback?: boolean; dark?: boolean; sector?: string; className?: string }) {
  const { openCallbackModal } = useCallbackModal();
  const { c } = useI18n();
  const t = c.ui.components.ctas;
  // Sur la page de démo elle-même, le bouton « démo » renverrait vers la page courante : on ne l’affiche pas.
  const showDemo = useRouter().pathname !== DEMO_URL;
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={SIGNUP_URL} className={dark ? 'btn-signal' : 'btn-primary'}>
          <Sparkles className="h-4 w-4" aria-hidden /> {primary ?? t.primary}
        </Link>
        {showDemo && (
          <Link href={DEMO_URL} className={dark ? 'btn-light' : 'btn-ghost'}>
            <Play className="h-4 w-4" aria-hidden /> {demo ?? t.demo}
          </Link>
        )}
      </div>
      {callback && (
        <button
          type="button"
          onClick={() => openCallbackModal({ type: 'commercial', sector })}
          className={`inline-flex items-center gap-2 self-start text-[15px] font-semibold underline-offset-4 hover:underline ${dark ? 'text-signal-glow' : 'text-signal-deep'}`}
        >
          <PhoneCall className="h-4 w-4" aria-hidden /> {t.callback}
        </button>
      )}
    </div>
  );
}

/* ---------- Formulaire de rappel (doc 94 : nom, téléphone, secteur, besoin) ---------- */

export function CallbackForm({
  type = 'commercial', sector = '', compact = false, dark = false, submitLabel, onDone,
}: { type?: 'commercial' | 'support' | 'demo'; sector?: string; compact?: boolean; dark?: boolean; submitLabel?: string; onDone?: () => void }) {
  const { c, market, locale } = useI18n();
  const t = c.ui.components.callbackForm;
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [slot, setSlot] = useState('asap');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('consent')) { setError(t.consentRequired); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), email: f.get('email'),
          sector: f.get('sector'), note: f.get('note'), slot: f.get('slot') || 'asap',
          // Créneau précis : date et heure locales du visiteur, avec son fuseau horaire (rappel programmé).
          callAt: f.get('slot') === 'precise' ? f.get('callAt') : undefined,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          consentCall: true, website: f.get('website') || undefined, type: type === 'support' ? 'support' : 'commercial',
          agent: type === 'demo' ? 'Démo live' : undefined, locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((locale === 'fr' && data.error) || t.sendFailed);
      setState('sent'); onDone?.();
    } catch (err: any) {
      setState('error'); setError(`${err.message} ${t.retry(SITE.email)}`);
    }
  }

  const label = `block text-sm font-semibold ${dark ? 'text-white' : 'text-ink'} mb-1.5`;
  if (state === 'sent') {
    return (
      <div role="status" className={`rounded-xl p-6 ${dark ? 'bg-white/10 text-white' : 'bg-signal-soft text-ink'}`}>
        <p className="font-display text-lg font-semibold">{t.sentTitle}</p>
        <p className="mt-1 text-[15px]">{t.sentText}</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-4" noValidate={false}>
        {/* Champ piège invisible pour les robots (ne pas remplir) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div><label htmlFor="cb-name" className={label}>{t.name}</label><input id="cb-name" name="name" required autoComplete="name" className="field" /></div>
        <div><label htmlFor="cb-phone" className={label}>{t.phone}</label><input id="cb-phone" name="phone" type="tel" required minLength={8} autoComplete="tel" className="field" /></div>
        <div>
          <label htmlFor="cb-sector" className={label}>{t.sector}</label>
          <select id="cb-sector" name="sector" defaultValue={sector} className="field">
            <option value="">{t.choose}</option>
            {c.sectors.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            <option value="autre">{t.otherSector}</option>
          </select>
        </div>
        <div>
          <label htmlFor="cb-slot" className={label}>{t.when}</label>
          <select id="cb-slot" name="slot" className="field" value={slot} onChange={(e) => setSlot(e.target.value)}>
            {/* Les valeurs envoyées à l’API restent fixes ; seuls les libellés changent selon la langue. */}
            <option value="asap">{t.slots.asap}</option>
            <option value="Aujourd’hui après-midi">{t.slots.todayAfternoon}</option>
            <option value="Demain matin">{t.slots.tomorrowMorning}</option>
            <option value="Demain après-midi">{t.slots.tomorrowAfternoon}</option>
            <option value="precise">{t.slots.precise}</option>
          </select>
        </div>
        {slot === 'precise' && (
          <div className={compact ? '' : 'sm:col-span-2'}>
            <label htmlFor="cb-callat" className={label}>{t.preciseLabel}</label>
            <input id="cb-callat" name="callAt" type="datetime-local" required className="field" />
          </div>
        )}
      </div>
      {!compact && (
        <div><label htmlFor="cb-email" className={label}>{t.email} <span className="font-normal opacity-70">{t.emailHint}</span></label><input id="cb-email" name="email" type="email" autoComplete="email" className="field" /></div>
      )}
      <div><label htmlFor="cb-note" className={label}>{t.need}</label><textarea id="cb-note" name="note" rows={compact ? 2 : 3} className="field" placeholder={t.needPlaceholder} /></div>
      <label className={`flex items-start gap-2.5 text-sm ${dark ? 'text-white/80' : ''}`}>
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[#0FA3C4]" />
        <span>{t.consent(market.brand)}</span>
      </label>
      {error && <p role="alert" className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>}
      <button type="submit" disabled={state === 'sending'} className={dark ? 'btn-signal' : 'btn-primary'}>
        <PhoneCall className="h-4 w-4" aria-hidden /> {state === 'sending' ? t.sending : submitLabel ?? t.submit}
      </button>
    </form>
  );
}

/* ---------- FAQ en accordéon sombre ---------- */

export function FaqDark({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  const base = useId().replace(/:/g, '');
  return (
    <div className="overflow-hidden rounded-2xl bg-night">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-white/10 last:border-0">
            <h3 className="font-display">
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[17px] font-semibold text-white hover:text-signal-glow"
              >
                {it.q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-signal-glow transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
            </h3>
            <div id={`${base}-a${i}`} hidden={!isOpen}>
              <p className="px-6 pb-6 text-[15px] leading-relaxed text-white/70">{it.a}</p>
            </div>
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
