// Mon compte : le client se connecte avec un code à 6 chiffres reçu par email (même mécanisme que Lucie), puis voit
// son forfait, son solde de minutes et de crédits de messages, sa carte et ses factures, dans la langue du site et en
// lecture seule. Les changements (carte, forfait, résiliation, achats) renvoient vers l’espace client (en anglais).
// Session : cookie HttpOnly de 30 minutes (src/lib/accountSession.ts) ; aucune donnée personnelle dans l’URL ; page
// non indexée et jamais mise en cache. Données : /api/account (Autocalls white-label et Stripe, src/lib/stripeAccount.ts).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Heading } from '@/components/ui';
import { APP_BILLING_URL, APP_CREDITS_URL, APP_PLANS_URL, LOGIN_URL, SIGNUP_URL, SITE } from '@/data/site';
import { GROUP, useI18n } from '@/i18n';
import type { AccountSummary, CardView, InvoiceView, StatusGroup, SubscriptionView } from '@/lib/stripeAccount';

interface Props {
  /** Adresse de la session en cours (cookie signé valide), sinon null. */
  email: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const { readSessionFromCookieHeader } = await import('@/lib/accountSession');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  // Aucun appel externe ici : la page s’affiche tout de suite, le résumé est chargé ensuite par le navigateur.
  return { props: { email: readSessionFromCookieHeader(req.headers.cookie)?.email ?? null } };
};

const post = (body: Record<string, unknown>) => fetch('/api/account', {
  method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

// Devises sans décimales chez Stripe (montants en unités entières).
const ZERO_DECIMAL = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'];

/** Mise en forme dans la langue du marché (rendu dans le navigateur seulement : pas d’écart d’hydratation).
 *  Séparateur de milliers toujours affiché, comme money() (« 1.000 » en italien et en polonais). */
function formatters(numberLocale: string) {
  const amount = (minor: number, currency: string) => {
    const value = ZERO_DECIMAL.includes(currency.toLowerCase()) ? minor : minor / 100;
    const digits = Number.isInteger(value) ? 0 : 2;
    const out = new Intl.NumberFormat(numberLocale, { style: 'currency', currency: currency.toUpperCase(), currencyDisplay: 'symbol', minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: GROUP }).format(value);
    // en-AU : Intl écrit « USD 99 » ; le site écrit « US$99 » (même forme que money()).
    return numberLocale === 'en-AU' ? out.replace(/^USD\s?/, 'US$') : out;
  };
  const date = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat(numberLocale, { dateStyle: 'long' }).format(d);
  };
  const count = (n: number) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2, useGrouping: GROUP }).format(n);
  return { amount, date, count };
}
type Formatters = ReturnType<typeof formatters>;

const PILL: Record<StatusGroup, string> = {
  trial: 'bg-signal-soft text-signal-deep',
  active: 'bg-ok/10 text-ok-deep',
  past_due: 'bg-red-50 text-red-700',
  canceled: 'bg-paper text-slate',
  paused: 'bg-amber-50 text-amber-800',
};
const INVOICE_PILL: Record<InvoiceView['status'], string> = {
  paid: 'bg-ok/10 text-ok-deep',
  open: 'bg-amber-50 text-amber-800',
  void: 'bg-paper text-slate',
  uncollectible: 'bg-red-50 text-red-700',
};

function Card({ title, className = '', children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7 ${className}`}>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function MonCompte({ email }: Props) {
  const { c, market } = useI18n();
  const t = c.ui.account;
  const [session, setSession] = useState<string | null>(email);
  // Message neutre affiché à l’écran de connexion après une déconnexion forcée (session expirée).
  const [notice, setNotice] = useState('');
  const [justSignedIn, setJustSignedIn] = useState(false);
  // Retour à l’écran de connexion depuis le tableau de bord : le focus va au champ email (pas au premier affichage).
  const [fromDashboard, setFromDashboard] = useState(false);
  const signedOut = useCallback((message?: string) => { setSession(null); setJustSignedIn(false); setFromDashboard(true); setNotice(message ?? ''); }, []);
  const signedIn = useCallback((address: string) => { setNotice(''); setJustSignedIn(true); setSession(address); }, []);

  return (
    <Layout title={t.meta.title(market.brand)} description={t.meta.description} noindex>
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title={t.h1} intro={t.intro(market.brand)} />
        </div>
      </section>
      <section className="bg-white py-12 sm:py-16">
        <div className="wrap">
          {session
            ? <Dashboard email={session} focusOnLoad={justSignedIn} onSignedOut={signedOut} />
            : <LoginPanel notice={notice} focusOnMount={fromDashboard} onSignedIn={signedIn} />}
        </div>
      </section>
    </Layout>
  );
}

function LoginPanel({ notice, focusOnMount, onSignedIn }: { notice: string; focusOnMount: boolean; onSignedIn: (email: string) => void }) {
  const { c, locale } = useI18n();
  const t = c.ui.account;
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  // Adresse à laquelle le code a été demandé : affichée et vérifiée, même si le champ a changé entre-temps.
  const [sentTo, setSentTo] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying'>('idle');
  const [error, setError] = useState('');
  // Erreur de saisie (adresse ou code) : seule celle-ci marque le champ comme invalide.
  const [fieldError, setFieldError] = useState(false);
  const [info, setInfo] = useState(notice);
  // Zone d’annonce permanente (lecteurs d’écran) : envoi en cours, puis nouveau code envoyé.
  const [live, setLive] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);

  // Après une déconnexion ou une session expirée, le focus revient au champ email (pas au premier affichage).
  useEffect(() => { if (focusOnMount) emailRef.current?.focus(); }, [focusOnMount]);
  // Focus sur le champ de l’étape affichée (pas au premier affichage de la page).
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    (step === 'code' ? codeRef : emailRef).current?.focus();
  }, [step]);

  const fail = (message: string, field = false) => { setError(message); setFieldError(field); };

  async function requestCode(website = '') {
    const address = step === 'code' ? sentTo : email;
    fail('');
    setInfo('');
    setStatus('sending');
    setLive(t.login.sending);
    try {
      const r = await post({ action: 'send_code', email: address, locale, website });
      if (r.status === 400) fail(t.errors.invalidEmail, true);
      else if (r.status === 429) fail(t.errors.tooMany);
      else if (!r.ok) fail(t.errors.unavailable(SITE.email));
      else {
        setCode('');
        setSentTo(address.trim());
        if (step === 'code') { codeRef.current?.focus(); setLive(t.login.codeSent); setStatus('idle'); return; }
        setStep('code');
      }
    } catch {
      fail(t.errors.network);
    }
    setLive('');
    setStatus('idle');
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 6) { fail(t.errors.invalidCode, true); codeRef.current?.focus(); return; }
    fail('');
    setLive('');
    setStatus('verifying');
    try {
      const r = await post({ action: 'verify', email: sentTo, code: digits });
      if (r.ok) { onSignedIn(sentTo.toLowerCase()); return; }
      if (r.status === 401 || r.status === 400) fail(t.errors.invalidCode, true);
      else fail(r.status === 429 ? t.errors.tooMany : t.errors.unavailable(SITE.email));
      codeRef.current?.focus();
    } catch {
      fail(t.errors.network);
    }
    setStatus('idle');
  }

  const busy = status !== 'idle';
  const errorId = 'acct-error';
  const helpId = 'acct-code-help';
  const errorLine = error ? <p id={errorId} role="alert" className="text-sm font-medium text-red-700">{error}</p> : null;
  const invalid = error && fieldError ? true : undefined;

  return (
    <div className="max-w-lg">
      {info && <p role="status" className="mb-5 rounded-xl bg-signal-soft px-4 py-3 text-[15px] text-ink">{info}</p>}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        {step === 'email' ? (
          <>
            <h2 className="font-display text-xl font-bold">{t.login.title}</h2>
            <p className="mt-2 text-[15px]">{t.login.text}</p>
            {/* method="post" : un envoi avant le chargement du script (réseau lent) repart vers la page elle-même, sans
                jamais mettre l’adresse dans l’URL. */}
            <form
              method="post"
              className="mt-5 grid gap-3"
              onSubmit={(e) => { e.preventDefault(); requestCode(String(new FormData(e.currentTarget).get('website') || '')); }}
            >
              <label htmlFor="acct-email" className="block text-sm font-semibold text-ink">{t.login.emailLabel}</label>
              {/* Lecture seule pendant l’envoi (pas « disabled », qui viderait la valeur du formulaire). */}
              <input
                ref={emailRef} id="acct-email" name="email" type="email" required autoComplete="email" dir="ltr" maxLength={160}
                readOnly={busy} className="field" value={email} onChange={(e) => setEmail(e.target.value)}
                aria-invalid={invalid} aria-describedby={error ? errorId : undefined}
              />
              {/* Champ piège invisible pour les robots. */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {errorLine}
              <button type="submit" className="btn-primary mt-1 min-h-[44px] w-full" disabled={busy}>{busy ? t.login.sending : t.login.send}</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold">{t.login.codeTitle}</h2>
            <p id={helpId} className="mt-2 text-[15px]">{t.login.codeSent}</p>
            <p className="mt-2 text-sm">{t.login.sentTo} <bdi dir="ltr" className="break-all font-semibold text-ink">{sentTo}</bdi></p>
            {/* Validation par verify() (message traduit) : pas de bulle du navigateur. */}
            <form method="post" noValidate className="mt-5 grid gap-3" onSubmit={verify}>
              <label htmlFor="acct-code" className="block text-sm font-semibold text-ink">{t.login.codeLabel}</label>
              {/* Pas de maxLength : un code collé avec des espaces ou du texte autour garde ses 6 chiffres. */}
              <input
                ref={codeRef} id="acct-code" name="code" inputMode="numeric" autoComplete="one-time-code" dir="ltr" required
                className="field max-w-[12rem] text-center font-display text-2xl tracking-[0.3em]"
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                aria-invalid={invalid} aria-describedby={error ? `${errorId} ${helpId}` : helpId}
              />
              {errorLine}
              <button type="submit" className="btn-primary mt-1 min-h-[44px] w-full" disabled={busy}>{status === 'verifying' ? t.login.verifying : t.login.verify}</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
              <button type="button" className="min-h-[44px] font-semibold text-signal-deep underline-offset-2 hover:underline disabled:opacity-60" disabled={busy} onClick={() => requestCode()}>
                {status === 'sending' ? t.login.sending : t.login.resend}
              </button>
              <button type="button" className="min-h-[44px] font-semibold text-signal-deep underline-offset-2 hover:underline disabled:opacity-60" disabled={busy} onClick={() => { fail(''); setLive(''); setCode(''); setStep('email'); }}>
                {t.login.changeEmail}
              </button>
            </div>
          </>
        )}
        {/* Envoi en temps constant (quelques secondes) : la patience est annoncée aux lecteurs d’écran. */}
        <p role="status" aria-live="polite" className="sr-only">{live}</p>
      </div>
      <div className="mt-6 space-y-2 text-[15px]">
        <p>{t.login.noAccount} <Link href={SIGNUP_URL} className="font-semibold text-signal-deep underline-offset-2 hover:underline">{t.login.trialLink}</Link></p>
        <p>{t.login.fullSpace} <a href={LOGIN_URL} className="font-semibold text-signal-deep underline-offset-2 hover:underline">{t.login.openSpace}</a></p>
      </div>
    </div>
  );
}

function Dashboard({ email, focusOnLoad, onSignedOut }: { email: string; focusOnLoad: boolean; onSignedOut: (message?: string) => void }) {
  const { c, market, money } = useI18n();
  const t = c.ui.account;
  const d = t.dashboard;
  const f = formatters(market.numberLocale);
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [leaving, setLeaving] = useState(false);
  const topRef = useRef<HTMLParagraphElement>(null);
  const signOutRef = useRef(onSignedOut);
  signOutRef.current = onSignedOut;
  const expired = t.errors.expired;

  const load = useCallback(async () => {
    setState('loading');
    try {
      const r = await fetch('/api/account', { credentials: 'same-origin', cache: 'no-store' });
      // Session expirée (30 minutes) : retour à l’écran de connexion.
      if (r.status === 401) { signOutRef.current(expired); return; }
      const data = await r.json().catch(() => null);
      if (!r.ok || !data?.ok) throw new Error(String(r.status));
      setSummary(data.summary as AccountSummary);
      setState('ready');
    } catch {
      setState('error');
    }
  }, [expired]);

  useEffect(() => { void load(); }, [load]);
  // Après la connexion, le focus passe en haut du tableau de bord (« Connecté avec … »).
  useEffect(() => { if (focusOnLoad) topRef.current?.focus(); }, [focusOnLoad]);

  async function logout() {
    setLeaving(true);
    try { await post({ action: 'logout' }); } catch { /* le cookie expire de toute façon au bout de 30 minutes */ }
    onSignedOut();
  }

  const logoutButton = (
    <button type="button" className="btn-ghost min-h-[44px] py-2" onClick={logout} disabled={leaving}>{d.logout}</button>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper px-5 py-4">
        <p ref={topRef} tabIndex={-1} className="text-[15px]">
          {d.signedInAs} <bdi dir="ltr" className="break-all font-semibold text-ink">{email}</bdi>
        </p>
        {logoutButton}
      </div>

      {/* Zone d’annonce permanente : chargement, puis « compte affiché » (une erreur a sa propre alerte). */}
      <p role="status" aria-live="polite" className="sr-only">{state === 'loading' ? d.loading : state === 'ready' ? d.loaded : ''}</p>

      {state === 'loading' && (
        <div aria-busy="true" className="grid gap-6 lg:grid-cols-3">
          <div className="h-48 animate-pulse rounded-3xl bg-paper lg:col-span-2" />
          <div className="h-48 animate-pulse rounded-3xl bg-paper" />
          <div className="h-32 animate-pulse rounded-3xl bg-paper" />
          <div className="h-32 animate-pulse rounded-3xl bg-paper lg:col-span-2" />
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-3xl border border-line p-6">
          <p role="alert" className="font-medium text-red-700">{t.errors.unavailable(SITE.email)}</p>
          <button type="button" className="btn-primary mt-4 min-h-[44px]" onClick={() => void load()}>{d.retry}</button>
        </div>
      )}

      {state === 'ready' && summary && (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card title={d.planTitle} className="lg:col-span-2">
              <PlanBlock summary={summary} f={f} />
            </Card>
            <Card title={d.balanceTitle}>
              {summary.platform.state === 'ok' ? (
                <>
                  {/* Une colonne à partir de 1024 px (carte étroite) : « 2 287,45 » ou « 10 000 » ne débordent pas. */}
                  <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                    <div className="min-w-0">
                      <dt className="text-sm">{d.minutes}</dt>
                      <dd className="mt-1 min-w-0 break-words font-display text-3xl font-bold tabular-nums text-ink sm:text-4xl">{f.count(summary.platform.minutes)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-sm">{d.credits}</dt>
                      <dd className="mt-1 min-w-0 break-words font-display text-3xl font-bold tabular-nums text-ink sm:text-4xl">{f.count(summary.platform.messageCredits)}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-slate-light">{d.creditsHint(money(1))}</p>
                </>
              ) : (
                <p className="text-[15px]">{summary.platform.state === 'not_found' ? d.notFound : d.balanceUnavailable}</p>
              )}
            </Card>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {summary.billing.state === 'ok' && (
              <Card title={d.cardTitle}>
                <CardLine card={summary.billing.card} />
                {actionsFor(summary.billing).includes('changeCard') && (
                  <>
                    <a href={APP_BILLING_URL} className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-signal-deep underline-offset-2 hover:underline">{d.actions.changeCard.title}</a>
                    <p className="text-sm text-slate-light">{d.actions.changeCard.hint}</p>
                  </>
                )}
              </Card>
            )}
            <Card title={d.identityTitle}>
              <dl className="grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-[auto_1fr]">
                {summary.platform.state === 'ok' && summary.platform.name && (
                  <><dt className="font-semibold text-ink">{d.name}</dt><dd>{summary.platform.name}</dd></>
                )}
                <dt className="font-semibold text-ink">{d.email}</dt>
                <dd><bdi dir="ltr" className="break-all">{summary.email}</bdi></dd>
                {summary.platform.state === 'ok' && summary.platform.createdAt && (
                  <><dt className="font-semibold text-ink">{d.since}</dt><dd>{f.date(summary.platform.createdAt)}</dd></>
                )}
              </dl>
            </Card>
          </div>

          {summary.billing.state === 'ok' && <Invoices invoices={summary.billing.invoices} f={f} />}

          <section aria-labelledby="acct-actions">
            <h2 id="acct-actions" className="font-display text-2xl font-bold">{d.actionsTitle}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {actionsFor(summary.billing).map((key) => ({
                key,
                href: key === 'openSpace' ? SITE.appUrl : key === 'changePlan' ? APP_PLANS_URL : key === 'buy' ? APP_CREDITS_URL : APP_BILLING_URL,
                title: d.actions[key].title,
                hint: key === 'buy' ? d.actions.buy.hint(money(5), money(1)) : d.actions[key].hint,
              })).map((a) => (
                <li key={a.key}>
                  <a href={a.href} className="block h-full rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink">
                    <span className="block font-semibold text-ink">{a.title}</span>
                    <span className="mt-1 block text-sm text-slate">{a.hint}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="max-w-prose text-[15px]">
              {d.readOnly} <Link href="/aide" className="font-semibold text-signal-deep underline underline-offset-2">{d.helpLink}</Link>.
            </p>
            {logoutButton}
          </div>
        </>
      )}
    </div>
  );
}

type ActionKey = 'openSpace' | 'changeCard' | 'invoices' | 'changePlan' | 'buy' | 'cancel';

/** Actions proposées : sans abonnement (Stripe le confirme) ou abonnement résilié, ni « Annuler », ni « Changer de
 *  carte » s’il n’y a pas de carte ; état inconnu (pas de clé, client introuvable) : liste complète. */
function actionsFor(billing: AccountSummary['billing']): ActionKey[] {
  const all: ActionKey[] = ['openSpace', 'changeCard', 'invoices', 'changePlan', 'buy', 'cancel'];
  if (billing.state !== 'ok') return all;
  const noPlan = !billing.subscription || billing.subscription.group === 'canceled';
  return all.filter((k) => !(noPlan && (k === 'cancel' || (k === 'changeCard' && billing.card === null))));
}

/**
 * Forfait : lecture Stripe (clé configurée), sinon forfait enregistré par le webhook Stripe, sinon renvoi vers
 * Billing info (avec l’aide « 0 minute »). « Aucun forfait » seulement si Stripe le confirme, ou si aucun client
 * Stripe n’a cette adresse et que le solde est à zéro (inscrit qui n’a pas choisi de forfait).
 */
function PlanBlock({ summary: s, f: fmt }: { summary: AccountSummary; f: Formatters }) {
  const { c, market, money, offer } = useI18n();
  const d = c.ui.account.dashboard;
  const { days, minutes: trialMinutes } = market.trial;
  const minutesLeft = s.platform.state === 'ok' ? s.platform.minutes : null;
  const zero = minutesLeft !== null && minutesLeft <= 0;
  const choosePlan = <a href={APP_PLANS_URL} className="btn-primary min-h-[44px]">{d.choosePlan}</a>;
  const openBilling = <a href={APP_BILLING_URL} className="btn-ghost min-h-[44px]">{d.openBilling}</a>;
  const b = s.billing;

  if (b.state === 'unconfigured' || b.state === 'unavailable' || (b.state === 'no_customer' && !zero)) {
    const text = b.state === 'unconfigured' ? d.billingUnconfigured : b.state === 'unavailable' ? d.billingUnavailable : d.billingNotFound;
    return (
      <>
        <p className="text-[15px]">{text}</p>
        {/* Solde à zéro : inscrit qui n’a pas encore choisi de forfait (essai pas démarré), ou minutes épuisées. */}
        {zero && <p className="mt-4 rounded-xl bg-signal-soft px-4 py-3 text-[15px] text-ink">{d.zeroMinutes(days, trialMinutes)}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          {zero && choosePlan}
          {zero && <a href={APP_CREDITS_URL} className="btn-ghost min-h-[44px]">{d.actions.buy.title}</a>}
          {openBilling}
        </div>
      </>
    );
  }

  const sub: SubscriptionView | null = b.state === 'ok' || b.state === 'partial' ? b.subscription : null;
  if (!sub) {
    return (
      <>
        <p className="font-display text-2xl font-bold text-ink">{d.noPlan}</p>
        <p className="mt-3 text-[15px]">{d.noPlanText(days, trialMinutes)}</p>
        {minutesLeft !== null && <p className="mt-2 text-[15px]">{minutesLeft > 0 ? d.noPlanPayg(money(market.paygMinute, 2)) : d.noMinutes}</p>}
        <div className="mt-5">{choosePlan}</div>
      </>
    );
  }

  const name = sub.planSlug ? offer(sub.planSlug).name : sub.planName;
  const price = sub.amount !== null && sub.currency ? fmt.amount(sub.amount, sub.currency) : null;
  const per = sub.interval === 'month' || sub.interval === 'year' ? d.perInterval[sub.interval] : null;
  const lines: string[] = [];
  if (sub.group === 'trial') {
    if (sub.trialEnd) lines.push(d.trialEnds(fmt.date(sub.trialEnd)));
    if (sub.cancelAt) lines.push(d.cancelScheduled(fmt.date(sub.cancelAt)));
    else if (price && sub.trialEnd) lines.push(d.firstCharge(price, fmt.date(sub.trialEnd)));
  } else if (sub.group === 'active') {
    if (sub.cancelAt) lines.push(d.cancelScheduled(fmt.date(sub.cancelAt)));
    else if (sub.periodEnd) lines.push(price ? d.nextCharge(price, fmt.date(sub.periodEnd)) : d.nextDate(fmt.date(sub.periodEnd)));
  } else if (sub.group === 'canceled' && sub.endedAt) {
    lines.push(d.canceledOn(fmt.date(sub.endedAt)));
  }
  // Forfait connu par le webhook seulement : remise inconnue, montant indicatif.
  const partial = b.state === 'partial';

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {name && <p className="font-display text-2xl font-bold text-ink">{name}</p>}
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${PILL[sub.group]}`}>{d.status[sub.group]}</span>
      </div>
      {price && per && sub.group !== 'canceled' && <p className="mt-1 text-[15px]">{price} {per}</p>}
      {lines.length > 0 && <ul className="mt-4 space-y-1.5 text-[15px] text-ink">{lines.map((l) => <li key={l}>{l}</li>)}</ul>}
      {(sub.hasDiscount || partial) && price && sub.group !== 'canceled' && <p className="mt-2 text-sm text-slate-light">{d.amountNote}</p>}
      {sub.group === 'past_due' && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-800">{d.pastDueText}</p>}
      {sub.group === 'paused' && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[15px] text-amber-900">{d.pausedText}</p>}
      {partial && <p className="mt-4 text-[15px]">{d.partialNote}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        {(sub.group === 'past_due' || sub.group === 'paused') && <a href={APP_BILLING_URL} className="btn-primary min-h-[44px]">{d.actions.changeCard.title}</a>}
        {sub.group === 'canceled' && choosePlan}
        {partial && sub.group !== 'past_due' && sub.group !== 'paused' && openBilling}
      </div>
    </>
  );
}

function CardLine({ card }: { card: CardView | null | 'unavailable' }) {
  const d = useI18n().c.ui.account.dashboard;
  if (card === 'unavailable') return <p className="text-[15px]">{d.detailUnavailable}</p>;
  if (!card) return <p className="text-[15px]">{d.noCard}</p>;
  const exp = card.expMonth && card.expYear ? `${String(card.expMonth).padStart(2, '0')}/${card.expYear}` : null;
  return (
    <>
      <p className="font-semibold text-ink">{card.last4 ? d.card(card.brand, card.last4) : card.brand}</p>
      {exp && <p className="mt-1 text-[15px]">{d.cardExpires(exp)}</p>}
    </>
  );
}

function Invoices({ invoices, f: fmt }: { invoices: InvoiceView[] | 'unavailable'; f: Formatters }) {
  const d = useI18n().c.ui.account.dashboard;
  const links = (inv: InvoiceView) => (
    <span className="flex flex-wrap gap-x-4 gap-y-1">
      {inv.hostedUrl && (
        <a href={inv.hostedUrl} target="_blank" rel="noopener noreferrer" aria-label={`${d.view} ${inv.number ?? ''}`.trim()} className="font-semibold text-signal-deep underline-offset-2 hover:underline">{d.view}</a>
      )}
      {inv.pdfUrl && (
        <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={`${d.pdf} ${inv.number ?? ''}`.trim()} className="font-semibold text-signal-deep underline-offset-2 hover:underline">{d.pdf}</a>
      )}
    </span>
  );
  const tag = (inv: InvoiceView) => <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-semibold ${INVOICE_PILL[inv.status]}`}>{d.invoiceStatus[inv.status]}</span>;
  return (
    <section aria-labelledby="acct-invoices">
      <h2 id="acct-invoices" className="font-display text-2xl font-bold">{d.invoicesTitle}</h2>
      {invoices === 'unavailable' ? <p className="mt-3 text-[15px]">{d.detailUnavailable}</p> : invoices.length === 0 ? <p className="mt-3 text-[15px]">{d.noInvoices}</p> : (
        <>
          {/* Mobile : une carte par facture ; à partir de 640 px : tableau. */}
          <ul className="mt-5 space-y-3 sm:hidden">
            {invoices.map((inv, i) => (
              <li key={`${inv.number}-${i}`} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{fmt.amount(inv.total, inv.currency)}</span>
                  {tag(inv)}
                </div>
                <p className="mt-1 text-sm">{fmt.date(inv.date)}{inv.number && <> · <bdi dir="ltr">{inv.number}</bdi></>}</p>
                <div className="mt-2">{links(inv)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-line sm:block">
            <table className="w-full text-start text-[15px]">
              <thead className="border-b border-line bg-paper text-ink">
                <tr>
                  {[d.invoiceCols.number, d.invoiceCols.date, d.invoiceCols.amount, d.invoiceCols.status, d.invoiceCols.documents].map((h) => (
                    <th key={h} scope="col" className="p-4 text-start font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={`${inv.number}-${i}`} className="border-b border-line last:border-0">
                    <td className="p-4"><bdi dir="ltr">{inv.number ?? '—'}</bdi></td>
                    <td className="p-4">{fmt.date(inv.date)}</td>
                    <td className="whitespace-nowrap p-4">{fmt.amount(inv.total, inv.currency)}</td>
                    <td className="p-4">{tag(inv)}</td>
                    <td className="p-4">{links(inv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
