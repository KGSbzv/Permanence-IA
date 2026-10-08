// Préférences email : lien personnel signé reçu par email (pied de page, désinscription) ou, sans lien valide,
// formulaire qui envoie ce lien à l’adresse saisie (personne ne peut changer les préférences d’un autre).
// Le lien signé est mis de côté dans un cookie HttpOnly puis retiré de l’adresse de la page : ni l’adresse
// email ni le jeton n’apparaissent dans l’historique, les statistiques de visite ou les journaux des pages.
import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { Heading, Section } from '@/components/ui';
import { SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import { DEFAULT_LOCALE, asLocale, isLocale } from '@/i18n/locales';
import type { EmailPref } from '@/lib/emailPrefs';

interface Props {
  email: string | null;
  /** Adresse encodée et jeton, renvoyés à /api/email/preferences pour enregistrer le choix. */
  e: string | null;
  t: string | null;
  current: EmailPref | null;
  invalid: boolean;
  unsubscribe: boolean;
}

const COOKIE = 'pia_email_pref';

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, query, locale }) => {
  const { PREF_DB } = await import('@/lib/server');
  const { decodeEmail, encodeEmail, getEmailPref, verifyEmailToken } = await import('@/lib/emailPrefs');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const here = asLocale(locale);
  const lang = isLocale(query.l) ? query.l : here;
  const unsubscribe = query.action === 'unsubscribe';

  if (query.e || query.t) {
    const email = decodeEmail(query.e);
    const token = String(query.t || '');
    const ok = !!email && verifyEmailToken(email, token);
    if (ok) res.setHeader('Set-Cookie', `${COOKIE}=${encodeEmail(email)}.${encodeURIComponent(token)}; Path=/; Max-Age=7200; HttpOnly; Secure; SameSite=Lax`);
    const prefix = lang === DEFAULT_LOCALE ? '' : `/${lang}`;
    const params = [`l=${lang}`, unsubscribe && 'action=unsubscribe', !ok && 'invalid=1'].filter(Boolean).join('&');
    return { redirect: { destination: `${prefix}/preferences-email?${params}`, permanent: false } };
  }

  const raw = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(req.headers.cookie || '')?.[1] || '';
  const [e = '', t = ''] = raw.split('.').map((x) => { try { return decodeURIComponent(x); } catch { return ''; } });
  const email = decodeEmail(e);
  const valid = !!email && verifyEmailToken(email, t);
  const current = valid ? await getEmailPref(email, PREF_DB).catch(() => null) : null;
  return {
    props: {
      email: valid ? email : null, e: valid ? e : null, t: valid ? t : null, current,
      invalid: query.invalid === '1', unsubscribe,
    },
  };
};

export default function PreferencesEmail({ email, e, t: token, current, invalid, unsubscribe }: Props) {
  const { c, market, locale } = useI18n();
  const t = c.ui.email.prefs;
  const [pref, setPref] = useState<EmailPref | null>(current);
  const [choice, setChoice] = useState<EmailPref>(current ?? 'all');
  const [status, setStatus] = useState<'idle' | 'busy' | 'saved' | 'error' | 'sent' | 'tooMany'>('idle');

  const save = async (value: EmailPref) => {
    setStatus('busy');
    try {
      const r = await fetch('/api/email/preferences', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set', e, t: token, choice: value }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setPref(value);
      setChoice(value);
      setStatus('saved');
    } catch { setStatus('error'); }
  };

  const requestLink = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    setStatus('busy');
    try {
      const r = await fetch('/api/email/preferences', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_link', email: form.get('email'), website: form.get('website'), locale }),
      });
      setStatus(r.status === 429 ? 'tooMany' : r.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
  };

  const options: EmailPref[] = ['essential_only', 'all'];
  const label = (p: EmailPref) => (p === 'essential_only' ? t.essential : t.all);
  const busy = status === 'busy';

  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description} noindex>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.h1} intro={t.intro(market.brand)} />
        </div>
      </section>
      <Section>
        <div className="max-w-prose space-y-8">
          {email ? (
            <>
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
                <dt className="font-semibold">{t.address}</dt>
                <dd><bdi dir="ltr" className="break-all">{email}</bdi></dd>
                <dt className="font-semibold">{t.current}</dt>
                <dd>{label(pref ?? 'all').title}</dd>
              </dl>

              {unsubscribe && pref !== 'essential_only' && (
                <div className="rounded-2xl border border-line bg-paper p-6">
                  <h2 className="text-h3 font-bold">{t.unsubscribeTitle}</h2>
                  <p className="mt-3">{t.unsubscribeText}</p>
                  <button type="button" className="btn-primary mt-5" disabled={busy} onClick={() => save('essential_only')}>
                    {busy ? t.saving : t.unsubscribeButton}
                  </button>
                </div>
              )}

              <form onSubmit={(ev) => { ev.preventDefault(); save(choice); }}>
                <fieldset className="space-y-3">
                  <legend className="sr-only">{t.h1}</legend>
                  {options.map((p) => (
                    <label key={p} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${choice === p ? 'border-signal bg-white' : 'border-line bg-white'}`}>
                      <input type="radio" name="choice" value={p} checked={choice === p} onChange={() => setChoice(p)} className="mt-1" />
                      <span>
                        <span className="block font-semibold">{label(p).title}</span>
                        <span className="block text-sm text-slate-light">{label(p).text}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
                <button type="submit" className="btn-primary mt-5" disabled={busy}>{busy ? t.saving : t.save}</button>
              </form>
            </>
          ) : (
            <div className="rounded-2xl border border-line bg-paper p-6">
              {invalid && <p className="mb-4 font-semibold text-red-700">{t.invalid}</p>}
              <h2 className="text-h3 font-bold">{t.askTitle}</h2>
              <p className="mt-3">{t.askText}</p>
              <form className="mt-5 space-y-3" onSubmit={requestLink}>
                <label htmlFor="pref-email" className="block text-sm font-semibold">{t.emailLabel}</label>
                <input id="pref-email" name="email" type="email" required autoComplete="email" dir="ltr" className="field" maxLength={160} />
                {/* Champ piège invisible pour les robots. */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                <button type="submit" className="btn-primary" disabled={busy || status === 'sent'}>{busy ? t.sending : t.send}</button>
              </form>
            </div>
          )}

          <p role="status" aria-live="polite" className="font-semibold">
            {status === 'saved' && pref && t.saved[pref]}
            {status === 'sent' && t.sent}
            {status === 'tooMany' && t.tooMany}
            {status === 'error' && t.error(SITE.email)}
          </p>

          <p className="text-sm text-slate-light">{t.always}</p>
        </div>
      </Section>
    </Layout>
  );
}
