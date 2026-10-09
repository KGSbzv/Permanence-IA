// Essai gratuit : création du compte sur l’app (essai natif 14 j / 30 min), ou demande d’accompagnement.
// Audit du 9 oct. 2026 (action 32) : UTM de la visite repris vers l’inscription, formulaires en POST, bouton de création
// du compte réactivé après un retour arrière.
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Heading, MarketingConsent, MarketingNotice, PhoneField, ProfileFields, TrialBadges, dialCode, marketingFields, profileNote } from '@/components/ui';
import { NOT_QUEUED } from '@/components/formTexts';
import { FORM_FALLBACK_ACTION, LOGIN_URL, TRIAL_ASSIST_ANCHOR, isActiveSector, registerUrl } from '@/data/site';
import { useI18n } from '@/i18n';
import { RichText } from '@/i18n/rich';
import { track } from '@/lib/analytics';
import { visitSearch } from '@/lib/attribution';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fiche contact avant la création du compte (/api/contact) : langue du site, page, UTM, case marketing.
 *  Jamais bloquant : au plus 2,5 s d’attente, la suite continue même en cas d’échec. */
async function saveContact(body: Record<string, unknown>) {
  await Promise.race([
    fetch('/api/contact', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null),
    sleep(2500),
  ]);
}

export default function EssaiGratuit() {
  const { c, market, offers, money, num, locale } = useI18n();
  const t = c.ui.pages.trial;
  const { days, minutes } = market.trial;
  // L’essai ne donne que des minutes : les réponses écrites de l’IA demandent des crédits (Add credits).
  const creditsNote = t.creditsNote(num(market.creditPack.credits), money(market.creditPack.price));
  const { query } = useRouter();
  // sent : demande de rappel enregistrée ; noCall : sans accord de rappel, rien n’est demandé à /api/callback.
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'noCall' | 'error'>('idle');
  const [queued, setQueued] = useState(true);
  const [error, setError] = useState('');
  const [going, setGoing] = useState(false);
  const planQuery = typeof query.plan === 'string' ? query.plan : 'decouverte';
  // Facturation annuelle choisie sur la grille des tarifs (lien ?billing=annual de PricingCards).
  const annual = query.billing === 'annual';
  // Lien de création de compte : langue du site, puis UTM une fois dans le navigateur (pas d’écart d’hydratation) :
  // ceux de la page, sinon ceux de la page d’arrivée de la visite (src/lib/attribution.ts).
  const [register, setRegister] = useState(() => registerUrl(locale));
  useEffect(() => { setRegister(registerUrl(locale, visitSearch(window.location.search))); }, [locale]);
  // Retour arrière depuis l’inscription : le navigateur peut restaurer la page telle quelle (cache de navigation),
  // bouton « Créer mon compte » grisé compris ; il redevient cliquable.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) setGoing(false); };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  /** Création du compte : l’email (et l’accord marketing) est enregistré avec la langue du site, puis redirection. */
  async function startSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setGoing(true);
    track('begin_trial_click', { link_url: register, language: locale, form: 'trial_signup' });
    if (!f.get('website')) await saveContact({ email: f.get('email'), locale, origin: 'trial_signup', ...marketingFields(f) });
    window.location.href = register;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('terms')) { setError(t.termsOnlyRequired); return; }
    setError('');
    // Accord de rappel facultatif (case distincte des conditions) : sans lui, aucune demande de rappel. L’email et
    // la langue sont gardés pour l’inscription, puis le bouton de création du compte est affiché.
    if (f.get('consentCall') !== 'on') {
      setState('sending');
      if (!f.get('website')) {
        await saveContact({ email: f.get('email'), name: f.get('name'), company: f.get('company'), sector: f.get('sector'), locale, origin: 'trial_signup', ...marketingFields(f) });
      }
      setState('noCall');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        // Champs destinés à l’équipe (back-office) : restent en français quelle que soit la langue du site.
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), cc: dialCode(f.get('cc')), email: f.get('email'), company: f.get('company'),
          sector: f.get('sector'), consentCall: f.get('consentCall') === 'on', website: f.get('website') || undefined, type: 'commercial', agent: 'Accompagnement essai', locale,
          note: [`Trial onboarding request — plan: ${f.get('plan')}${annual ? ' (annual billing)' : ''} — company: ${f.get('company') || ''}`, profileNote(f)].filter(Boolean).join(' — '),
          // Case marketing (décochée par défaut, distincte des conditions) et provenance : fiche contact et relances.
          ...marketingFields(f),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((locale === 'fr' && data.error) || t.sendError);
      // queued === false : demande enregistrée et équipe prévenue, mais aucun appel automatique en file.
      setQueued(data.queued !== false);
      setState('sent');
      track('generate_lead', { lead_type: 'trial_onboarding', language: locale, form: 'trial', plan: String(f.get('plan') || '') });
    } catch (err: any) {
      // Panne réseau : fetch lève un TypeError au message du navigateur (« Failed to fetch », en anglais) → texte traduit.
      setState('error'); setError((!(err instanceof TypeError) && err?.message) || t.sendError);
    }
  }

  return (
    <Layout title={t.meta.title(days, minutes, market.brand)} description={t.meta.description(days, minutes, market.brand)}>
      <section className="bg-paper">
        {/* Mobile : titre, puis création du compte, puis détails ; desktop : deux colonnes. */}
        <div className="wrap grid gap-x-12 gap-y-8 py-14 lg:grid-cols-[1fr_1.1fr] lg:grid-rows-[auto_1fr] lg:py-20">
          <div>
            <Heading as="h1" title={t.h1(minutes)} intro={t.intro(days)} />
            <TrialBadges className="mt-6" />
          </div>
          <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
            <ul className="space-y-3 text-ink">
              {t.points(days).map((p) => (
                <li key={p} className="flex gap-3"><Check className="mt-1 h-4 w-4 text-signal" aria-hidden />{p}</li>
              ))}
            </ul>
            <div className="mt-10 hidden overflow-hidden rounded-3xl border border-line lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/auth-light.jpg" alt="" aria-hidden className="w-full" />
            </div>
          </div>
          <div className="order-2 grid content-start gap-6 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <p className="font-display text-xl font-bold">{t.createTitle}</p>
            {/* Étapes réelles de l’app : l’étape 2 (choix d’un forfait) démarre l’essai et crédite les minutes. */}
            <ol className="mt-4 space-y-2 text-ink">
              {t.createSteps(days, minutes).map((s, i) => <li key={i}><RichText value={s} /></li>)}
            </ol>
            <p className="mt-3 rounded-xl bg-signal-soft px-4 py-3 text-sm text-ink">{t.createNote(minutes)}</p>
            <p className="mt-2 text-sm text-slate">{creditsNote}</p>
            {/* Email avant la redirection : fiche contact avec la langue du site (relances), case marketing décochée. */}
            {/* method="post" : un envoi avant le chargement du script ne met jamais l’adresse e-mail dans l’URL. */}
            <form method="post" action={FORM_FALLBACK_ACTION} onSubmit={startSignup} className="mt-5 grid gap-3">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              <div>
                <label htmlFor="su-start-email" className="mb-1.5 block text-sm font-semibold text-ink">{t.email}</label>
                <input id="su-start-email" name="email" type="email" required autoComplete="email" className="field" aria-describedby="su-start-email-notice" />
                <MarketingNotice id="su-start-email-notice" />
              </div>
              <MarketingConsent />
              <button type="submit" disabled={going} className="btn-primary mt-1 w-full">{t.createCta}</button>
            </form>
            <p className="mt-3 text-center text-sm">{t.already} <a href={LOGIN_URL} className="font-semibold text-signal-deep hover:underline">{t.login}</a></p>
          </div>
          {/* Ancre du lien « Être rappelé » des relances (inscription non terminée) : formulaire d’accompagnement. */}
          <div id={TRIAL_ASSIST_ANCHOR} className="scroll-mt-24 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            {state === 'sent' ? (
              <div role="status">
                <p className="font-display text-2xl font-bold">{t.sentTitle}</p>
                <p className="mt-3">{queued ? t.sentText : NOT_QUEUED[locale]}</p>
                <a href={register} className="btn-primary mt-6">{t.sentCta}</a>
              </div>
            ) : state === 'noCall' ? (
              <div role="status">
                <p className="font-display text-2xl font-bold">{t.createTitle}</p>
                <ol className="mt-4 space-y-2 text-ink">
                  {t.createSteps(days, minutes).map((s, i) => <li key={i}><RichText value={s} /></li>)}
                </ol>
                <p className="mt-3 rounded-xl bg-signal-soft px-4 py-3 text-sm text-ink">{t.createNote(minutes)}</p>
                <p className="mt-2 text-sm text-slate">{creditsNote}</p>
                <a href={register} className="btn-primary mt-6">{t.sentCta}</a>
              </div>
            ) : (
              <form method="post" action={FORM_FALLBACK_ACTION} onSubmit={submit} className="grid gap-4">
        {/* Champ piège invisible pour les robots (ne pas remplir) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <p className="font-display text-xl font-bold">{t.formTitle}</p>
                <p className="-mt-2 text-sm">{t.formIntro}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="su-name" className="mb-1.5 block text-sm font-semibold text-ink">{t.name}</label><input id="su-name" name="name" required autoComplete="name" className="field" /></div>
                  <div><label htmlFor="su-company" className="mb-1.5 block text-sm font-semibold text-ink">{t.company}</label><input id="su-company" name="company" required autoComplete="organization" className="field" /></div>
                  <div><label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold text-ink">{t.email}</label><input id="su-email" name="email" type="email" required autoComplete="email" className="field" aria-describedby="su-email-notice" /><MarketingNotice id="su-email-notice" /></div>
                  <PhoneField id="su-phone" label={t.phone} labelClassName="mb-1.5 block text-sm font-semibold text-ink" />
                  <div>
                    <label htmlFor="su-sector" className="mb-1.5 block text-sm font-semibold text-ink">{t.sector}</label>
                    <select id="su-sector" name="sector" className="field" defaultValue="">
                      <option value="">{t.sectorPlaceholder}</option>
                      {/* Secteurs en pause (santé) exclus de la liste. */}
                      {c.sectors.filter(isActiveSector).map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                      <option value="autre">{t.sectorOther}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="su-plan" className="mb-1.5 block text-sm font-semibold text-ink">{t.plan}</label>
                    <select id="su-plan" name="plan" className="field" defaultValue={offers.some((o) => o.slug === planQuery) ? planQuery : 'decouverte'}>
                      {offers.map((o) => <option key={o.slug} value={o.slug}>{o.name}{o.price ? t.planPrice(money(o.price)) : o.price === 0 ? t.planFree : t.planQuote}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 grid gap-4"><ProfileFields labelClassName="mb-1.5 block text-sm font-semibold text-ink" optional={c.ui.components.callbackForm.optional} /></div>
                </div>
                {/* Deux cases distinctes (RGPD art. 7(2)) : conditions obligatoires, accord de rappel facultatif. */}
                <label className="flex items-start gap-2.5 text-sm">
                  <input type="checkbox" name="terms" className="mt-1 h-4 w-4 shrink-0 accent-[#0FA3C4]" />
                  <span><RichText value={t.termsOnly} linkClassName="font-semibold text-signal-deep underline" /></span>
                </label>
                <label className="flex items-start gap-2.5 text-sm">
                  <input type="checkbox" name="consentCall" className="mt-1 h-4 w-4 shrink-0 accent-[#0FA3C4]" />
                  <span>{t.consentCall}</span>
                </label>
                <MarketingConsent />
                {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
                <button type="submit" disabled={state === 'sending'} className="btn-primary">{state === 'sending' ? t.sending : t.submit}</button>
              </form>
            )}
          </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
