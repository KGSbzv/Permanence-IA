import React, { useId, useState } from 'react';
import { track } from '@/lib/analytics';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowUpRight, Check, ChevronDown, Mic, PhoneCall, Play, Sparkles } from 'lucide-react';
import { DEMO_URL, SIGNUP_URL, SITE, whatsappUrl } from '@/data/site';
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

/** Petite bannière « Parlez à notre agent maintenant » : mène à la démo live de la page (ancre). */
export function TalkNowPill({ href = '#demo', className = '' }: { href?: string; className?: string }) {
  const { c } = useI18n();
  return (
    <div className={className}>
    <a
      href={href}
      className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-signal/30 bg-white py-1.5 ps-1.5 pe-4 text-sm shadow-sm ring-4 ring-signal/10 transition hover:border-signal hover:ring-signal/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
    >
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal text-white">
        <span className="absolute inset-0 animate-ping rounded-full bg-signal/40" aria-hidden />
        <Mic className="relative h-3.5 w-3.5" aria-hidden />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-semibold text-ink">{c.site.talkNow}</span>
        <span className="block truncate text-xs text-slate">{c.site.talkNowSub}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 rotate-90 text-signal-deep transition group-hover:translate-y-0.5" aria-hidden />
    </a>
    </div>
  );
}

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

/** Champs facultatifs de contexte (site web, priorités) : libellés par langue, envoyés à l’agent de rappel en clair. */
const PROFILE_TEXT: Record<string, { website: string; websiteHint: string; goals: string; options: string[] }> = {
  fr: { website: 'Site web', websiteHint: 'pour que l’agent prépare l’appel', goals: 'Vos priorités', options: ['Ne plus manquer d’appels', 'Prise de rendez-vous', 'Qualifier les prospects', 'Support client', 'Appels sortants et relances', 'Autre'] },
  en: { website: 'Website', websiteHint: 'so the agent can prepare the call', goals: 'Your priorities', options: ['Stop missing calls', 'Appointment booking', 'Lead qualification', 'Customer support', 'Outbound calls and follow-ups', 'Other'] },
  it: { website: 'Sito web', websiteHint: 'per preparare la chiamata', goals: 'Le Sue priorità', options: ['Non perdere più chiamate', 'Prenotazione degli appuntamenti', 'Qualificare i contatti', 'Assistenza clienti', 'Chiamate in uscita e ricontatti', 'Altro'] },
  pl: { website: 'Strona internetowa', websiteHint: 'aby agent przygotował rozmowę', goals: 'Priorytety', options: ['Koniec z nieodebranymi połączeniami', 'Umawianie wizyt', 'Kwalifikacja leadów', 'Obsługa klienta', 'Połączenia wychodzące', 'Inne'] },
  nl: { website: 'Website', websiteHint: 'zodat de agent het gesprek kan voorbereiden', goals: 'Uw prioriteiten', options: ['Geen gemiste oproepen meer', 'Afspraken inplannen', 'Leads kwalificeren', 'Klantenservice', 'Uitgaande gesprekken en opvolging', 'Anders'] },
  he: { website: 'אתר אינטרנט', websiteHint: 'כדי שהסוכנת תתכונן לשיחה', goals: 'מה חשוב לכם', options: ['לא לפספס שיחות', 'קביעת תורים', 'סינון לידים', 'שירות לקוחות', 'שיחות יוצאות ומעקב', 'אחר'] },
};
const profileText = (locale: string) => PROFILE_TEXT[locale.startsWith('en') ? 'en' : locale] || PROFILE_TEXT.en;

/** Adresse de site lisible (sans protocole ni espaces), ou rien si ce n’est pas une adresse plausible. */
export const cleanWebsite = (v: FormDataEntryValue | null) => {
  const s = String(v || '').trim().replace(/^https?:\/\//i, '').replace(/\/$/, '').slice(0, 120);
  return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s) ? s : '';
};

/** Site web et priorités (facultatifs) : contexte transmis à l’agent qui rappelle, pour préparer l’appel. */
export function ProfileFields({ labelClassName, dark = false, optional }: { labelClassName: string; dark?: boolean; optional: string }) {
  const { locale } = useI18n();
  const pt = profileText(locale);
  const label = labelClassName;
  const t = { optional };
  return (
    <>
          <div>
            <label htmlFor="cb-site" className={label}>{pt.website} <span className="font-normal text-slate-light">{t.optional}</span></label>
            {/* « site_url » et non « website » : ce dernier nom est réservé au champ piège anti-robots. */}
            <input id="cb-site" name="site_url" type="text" inputMode="url" autoComplete="url" placeholder="www.…" className="field" dir="ltr" aria-describedby="cb-site-hint" />
            <p id="cb-site-hint" className={`mt-1 text-xs ${dark ? 'text-white/60' : 'text-slate-light'}`}>{pt.websiteHint}</p>
          </div>
          <fieldset>
            <legend className={label}>{pt.goals} <span className="font-normal text-slate-light">{t.optional}</span></legend>
            <div className="flex flex-wrap gap-2">
              {pt.options.map((o) => (
                <label key={o} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm has-[:checked]:border-signal has-[:checked]:bg-signal-soft has-[:checked]:text-ink ${dark ? 'border-white/25 text-white/85' : 'border-line'}`}>
                  <input type="checkbox" name="goals" value={o} className="h-3.5 w-3.5 accent-[#0FA3C4]" />{o}
                </label>
              ))}
            </div>
          </fieldset>
        </>
  );
}

/** Ligne de contexte « Website: … — Priorities: … » ajoutée à la note de la demande. */
export const profileNote = (f: FormData) => [cleanWebsite(f.get('site_url')) && `Website: ${cleanWebsite(f.get('site_url'))}`,
  f.getAll('goals').length && `Priorities: ${f.getAll('goals').join(', ')}`].filter(Boolean).join(' — ');

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
          name: f.get('name'), phone: f.get('phone'), cc: dialCode(f.get('cc')), email: f.get('email'),
          sector: f.get('sector'),
          // Entreprise et volume (facultatifs) : ajoutés à la note lue par l’agent avant le rappel.
          // Contexte lu par l’agent de rappel avant l’appel (et conservé dans le dossier du client).
          note: [f.get('note'), f.get('company') && `Company: ${f.get('company')}`, profileNote(f), f.get('volume') && `Calls/month: ${f.get('volume')}`].filter(Boolean).join(' — ') || undefined,
          slot: f.get('slot') || 'asap',
          // Créneau précis : date et heure locales du visiteur, avec son fuseau horaire (rappel programmé).
          callAt: f.get('slot') === 'precise' ? f.get('callAt') : undefined,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          consentCall: true, whatsapp: Boolean(f.get('whatsapp')), website: f.get('website') || undefined, type: type === 'support' ? 'support' : 'commercial',
          agent: type === 'demo' ? 'Démo live' : undefined, locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((locale === 'fr' && data.error) || t.sendFailed);
      setState('sent'); onDone?.();
      track('generate_lead', { lead_type: type, language: locale, form: 'callback' });
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
        <div><label htmlFor="cb-company" className={label}>{t.company} <span className="font-normal text-slate-light">{t.optional}</span></label><input id="cb-company" name="company" autoComplete="organization" className="field" /></div>
        <PhoneField id="cb-phone" label={t.phone} labelClassName={label} />
        <div>
          <label htmlFor="cb-sector" className={label}>{t.sector}</label>
          <select id="cb-sector" name="sector" defaultValue={sector} className="field">
            <option value="">{t.choose}</option>
            {c.sectors.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            <option value="autre">{t.otherSector}</option>
          </select>
        </div>
        <div>
          <label htmlFor="cb-volume" className={label}>{t.volume} <span className="font-normal text-slate-light">{t.optional}</span></label>
          <select id="cb-volume" name="volume" defaultValue="" className="field">
            <option value="">{t.choose}</option>
            {t.volumeOptions.map((v) => <option key={v} value={v}>{v}</option>)}
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
            <input id="cb-callat" name="callAt" type="datetime-local" required className="field" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16)} />
          </div>
        )}
      </div>
      {!compact && (
        <div><label htmlFor="cb-email" className={label}>{t.email} <span className="font-normal opacity-70">{t.emailHint}</span></label><input id="cb-email" name="email" type="email" autoComplete="email" className="field" /></div>
      )}
      {!compact && type !== 'support' && <ProfileFields labelClassName={label} dark={dark} optional={t.optional} />}
      <div><label htmlFor="cb-note" className={label}>{t.need}</label><textarea id="cb-note" name="note" rows={compact ? 2 : 3} className="field" placeholder={t.needPlaceholder} /></div>
      <label className={`flex items-start gap-2.5 text-sm ${dark ? 'text-white/80' : ''}`}>
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[#0FA3C4]" />
        <span>{t.consent(market.brand)}</span>
      </label>
      {/* Accord séparé et facultatif (décoché) : confirmation du rappel envoyée par WhatsApp. */}
      <label className={`flex items-start gap-2.5 text-sm ${dark ? 'text-white/80' : ''}`}>
        <input type="checkbox" name="whatsapp" className="mt-1 h-4 w-4 accent-[#25D366]" />
        <span className="inline-flex items-start gap-1.5"><WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" />{c.site.whatsapp.optIn}</span>
      </label>
      {error && <p role="alert" className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>}
      <button type="submit" disabled={state === 'sending'} className={dark ? 'btn-signal' : 'btn-primary'}>
        <PhoneCall className="h-4 w-4" aria-hidden /> {state === 'sending' ? t.sending : submitLabel ?? t.submit}
      </button>
    </form>
  );
}

/* ---------- Téléphone : indicatif pays + numéro ---------- */

/** Indicatifs proposés (marchés servis et voisins). La valeur envoyée est l’indicatif sans « + ». */
const DIAL_CODES: { id: string; flag: string; cc: string; ex: string }[] = [
  { id: 'FR', flag: '🇫🇷', cc: '33', ex: '06 12 34 56 78' }, { id: 'BE', flag: '🇧🇪', cc: '32', ex: '0470 12 34 56' }, { id: 'CH', flag: '🇨🇭', cc: '41', ex: '078 123 45 67' },
  { id: 'LU', flag: '🇱🇺', cc: '352', ex: '621 123 456' }, { id: 'MC', flag: '🇲🇨', cc: '377', ex: '06 12 34 56 78' }, { id: 'CA', flag: '🇨🇦', cc: '1', ex: '514 555 0123' },
  { id: 'GB', flag: '🇬🇧', cc: '44', ex: '07123 456789' }, { id: 'IE', flag: '🇮🇪', cc: '353', ex: '085 123 4567' }, { id: 'AU', flag: '🇦🇺', cc: '61', ex: '0412 345 678' },
  { id: 'NZ', flag: '🇳🇿', cc: '64', ex: '021 123 4567' }, { id: 'IT', flag: '🇮🇹', cc: '39', ex: '312 345 6789' }, { id: 'PL', flag: '🇵🇱', cc: '48', ex: '512 345 678' },
  { id: 'NL', flag: '🇳🇱', cc: '31', ex: '06 12345678' }, { id: 'IL', flag: '🇮🇱', cc: '972', ex: '050-123-4567' }, { id: 'US', flag: '🇺🇸', cc: '1', ex: '212 555 0123' },
  { id: 'DE', flag: '🇩🇪', cc: '49', ex: '0151 23456789' }, { id: 'ES', flag: '🇪🇸', cc: '34', ex: '612 34 56 78' }, { id: 'PT', flag: '🇵🇹', cc: '351', ex: '912 345 678' },
];
const DEFAULT_COUNTRY: Record<string, string> = { fr: 'FR', 'en-gb': 'GB', 'en-au': 'AU', it: 'IT', pl: 'PL', nl: 'NL', he: 'IL' };
/** « par exemple » devant le format attendu, affiché dans le champ (le libellé reste dans aria-label ou au-dessus). */
const EXAMPLE: Record<string, string> = { fr: 'ex.', 'en-gb': 'e.g.', 'en-au': 'e.g.', it: 'es.', pl: 'np.', nl: 'bijv.', he: 'לדוגמה' };
const DIAL_LABEL: Record<string, string> = { fr: 'Indicatif pays', 'en-gb': 'Country code', 'en-au': 'Country code', it: 'Prefisso internazionale', pl: 'Numer kierunkowy kraju', nl: 'Landcode', he: 'קידומת מדינה' };
/** Motif valable aussi en mode « v » des navigateurs récents (parenthèses et tiret échappés). */
export const PHONE_PATTERN = '[+0-9\\(][0-9 .\\(\\)\\-]{7,}';

/**
 * Champ téléphone avec indicatif pays : un numéro saisi sans « + » est complété avec l’indicatif choisi
 * (un 0470… belge n’est plus pris pour un numéro français). Envoie `phone` et `cc` dans le formulaire.
 */
export function PhoneField({ id, label, className = 'field', placeholder, hideLabel = false, labelClassName = '' }: {
  id: string; label: string; className?: string; placeholder?: string; hideLabel?: boolean; labelClassName?: string;
}) {
  const { c, locale } = useI18n();
  const invalid = c.ui.components.callbackForm.phoneInvalid;
  const [country, setCountry] = useState(DEFAULT_COUNTRY[locale] || 'FR');
  const ex = DIAL_CODES.find((d) => d.id === country)?.ex;
  // Le sélecteur garde sa largeur naturelle : on retire un éventuel « w-full » hérité de la classe du champ.
  const selectClass = className.replace(/\bw-full\b/g, '');
  return (
    <div>
      {!hideLabel && <label htmlFor={id} className={labelClassName}>{label}</label>}
      <div className="flex gap-2" dir="ltr">
        <select name="cc" aria-label={DIAL_LABEL[locale] || DIAL_LABEL['en-gb']} value={country} onChange={(e) => setCountry(e.target.value)} className={`${selectClass} w-[5.75rem] shrink-0 pe-6 sm:w-[6.75rem] sm:pe-7`}>
          {DIAL_CODES.map((d) => <option key={d.id} value={d.id}>{d.flag} +{d.cc}</option>)}
        </select>
        <input id={id} name="phone" type="tel" inputMode="tel" required minLength={8} pattern={PHONE_PATTERN} autoComplete="tel-national"
          placeholder={ex ? `${EXAMPLE[locale] || 'e.g.'} ${ex}` : placeholder}
          aria-label={hideLabel ? label : undefined} className={`${className} min-w-0 flex-1`}
          onInvalid={(e) => e.currentTarget.setCustomValidity(invalid)} onInput={(e) => e.currentTarget.setCustomValidity('')} />
      </div>
    </div>
  );
}

/** Indicatif (chiffres) correspondant au pays choisi dans PhoneField. */
export const dialCode = (id: FormDataEntryValue | null) => DIAL_CODES.find((d) => d.id === id)?.cc;

/* ---------- WhatsApp : discuter avec l’agent IA (prérempli dans la langue du site) ---------- */

export function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/** Lien WhatsApp : « card » (carte claire avec la note), « dark » (pied de page), « button » (bouton plein). */
export function WhatsAppLink({ variant = 'card', place, className = '' }: { variant?: 'card' | 'dark' | 'button' | 'icon'; place: string; className?: string }) {
  const { c, locale } = useI18n();
  const t = c.site.whatsapp;
  const href = whatsappUrl(t.prefill);
  const onClick = () => track('whatsapp_click', { language: locale, place });
  if (variant === 'icon') {
    return <a href={href} target="_blank" rel="noopener" onClick={onClick} aria-label={t.cta} title={t.cta} className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white hover:bg-[#1FBF5B] ${className}`}><WhatsAppIcon className="h-5 w-5" /></a>;
  }
  if (variant === 'dark') {
    return <a href={href} target="_blank" rel="noopener" onClick={onClick} className={`flex items-center gap-2 text-[15px] text-white hover:text-signal-glow ${className}`}><WhatsAppIcon className="h-4 w-4 text-[#25D366]" /><span>{t.cta}</span></a>;
  }
  if (variant === 'button') {
    return <a href={href} target="_blank" rel="noopener" onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-[#0B3B24] hover:bg-[#1FBF5B] ${className}`}><WhatsAppIcon />{t.cta}</a>;
  }
  return (
    <a href={href} target="_blank" rel="noopener" onClick={onClick} className={`inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-ink shadow-card hover:border-[#25D366] ${className}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"><WhatsAppIcon /></span>
      <span><span className="block font-display font-semibold">{t.cta}</span><span className="block text-sm text-slate">{t.note}</span></span>
    </a>
  );
}

/** Raccourcis WhatsApp par intention : chaque bouton ouvre la conversation avec un premier message prérempli
 *  dans la langue du site, que l’agent WhatsApp reconnaît (découvrir, forfait, essai ou démo, client). */
export function WhatsAppStarters({ place, dark = false, className = '' }: { place: string; dark?: boolean; className?: string }) {
  const { c, locale } = useI18n();
  const t = c.site.whatsapp;
  return (
    <div className={className}>
      <p className={`text-sm ${dark ? 'text-white/75' : 'text-slate'}`}>{t.startersIntro}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {t.starters.map((s, i) => (
          <a key={s.label} href={whatsappUrl(s.text)} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { language: locale, place, topic: i })}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${dark ? 'border-white/25 text-white hover:border-[#25D366]' : 'border-line bg-white text-ink hover:border-[#25D366]'}`}>
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />{s.label}
          </a>
        ))}
      </div>
    </div>
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
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-[17px] font-semibold text-white hover:text-signal-glow"
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
  // Pas de photo (src vide) : l’illustration s’affiche directement, sans image cassée au premier rendu.
  if (failed || !src) return <>{fallback}</>;
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
