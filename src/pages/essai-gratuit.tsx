// Essai gratuit : création du compte sur l’app (essai natif 14 j / 30 min), ou demande d’accompagnement.
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Heading, PhoneField, ProfileFields, TrialBadges, dialCode, profileNote } from '@/components/ui';
import { LOGIN_URL, REGISTER_URL } from '@/data/site';
import { useI18n } from '@/i18n';
import { RichText } from '@/i18n/rich';

export default function EssaiGratuit() {
  const { c, market, offers, money, locale } = useI18n();
  const t = c.ui.pages.trial;
  const { days, minutes } = market.trial;
  const { query } = useRouter();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const planQuery = typeof query.plan === 'string' ? query.plan : 'decouverte';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('terms')) { setError(t.termsRequired); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        // Champs destinés à l’équipe (back-office) : restent en français quelle que soit la langue du site.
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), cc: dialCode(f.get('cc')), email: f.get('email'), company: f.get('company'),
          sector: f.get('sector'), consentCall: true, website: f.get('website') || undefined, type: 'commercial', agent: 'Accompagnement essai', locale,
          note: [`Trial onboarding request — plan: ${f.get('plan')} — company: ${f.get('company') || ''}`, profileNote(f)].filter(Boolean).join(' — '),
        }),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error((locale === 'fr' && data.error) || t.sendError); }
      setState('sent');
    } catch (err: any) { setState('error'); setError(err.message); }
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
            <ol className="mt-4 space-y-2 text-ink">
              {t.createSteps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <a href={REGISTER_URL} className="btn-primary mt-6 w-full">{t.createCta}</a>
            <p className="mt-3 text-center text-sm">{t.already} <a href={LOGIN_URL} className="font-semibold text-signal-deep hover:underline">{t.login}</a></p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            {state === 'sent' ? (
              <div role="status">
                <p className="font-display text-2xl font-bold">{t.sentTitle}</p>
                <p className="mt-3">{t.sentText}</p>
                <a href={REGISTER_URL} className="btn-primary mt-6">{t.sentCta}</a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
        {/* Champ piège invisible pour les robots (ne pas remplir) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <p className="font-display text-xl font-bold">{t.formTitle}</p>
                <p className="-mt-2 text-sm">{t.formIntro}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="su-name" className="mb-1.5 block text-sm font-semibold text-ink">{t.name}</label><input id="su-name" name="name" required autoComplete="name" className="field" /></div>
                  <div><label htmlFor="su-company" className="mb-1.5 block text-sm font-semibold text-ink">{t.company}</label><input id="su-company" name="company" required autoComplete="organization" className="field" /></div>
                  <div><label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold text-ink">{t.email}</label><input id="su-email" name="email" type="email" required autoComplete="email" className="field" /></div>
                  <PhoneField id="su-phone" label={t.phone} labelClassName="mb-1.5 block text-sm font-semibold text-ink" />
                  <div>
                    <label htmlFor="su-sector" className="mb-1.5 block text-sm font-semibold text-ink">{t.sector}</label>
                    <select id="su-sector" name="sector" className="field" defaultValue="">
                      <option value="">{t.sectorPlaceholder}</option>
                      {c.sectors.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
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
                <label className="flex items-start gap-2.5 text-sm">
                  <input type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-[#0FA3C4]" />
                  <span><RichText value={t.terms} linkClassName="font-semibold text-signal-deep underline" /></span>
                </label>
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
