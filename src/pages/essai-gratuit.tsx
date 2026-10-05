// Inscription à l’essai. Phase 6 : remplacer l’envoi par la création du compte sur l’app white-label.
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Heading, TrialBadges } from '@/components/ui';
import { OFFERS } from '@/data/offers';
import { SECTORS } from '@/data/sectors';
import { LOGIN_URL } from '@/data/site';

export default function EssaiGratuit() {
  const { query } = useRouter();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const planQuery = typeof query.plan === 'string' ? query.plan : 'decouverte';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('terms')) { setError('Acceptez les conditions pour créer votre compte.'); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), email: f.get('email'), company: f.get('company'),
          sector: f.get('sector'), consentCall: true, type: 'commercial', agent: 'Inscription essai',
          note: `Demande d’essai — offre ${f.get('plan')} — ${f.get('company') || ''}`,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'L’inscription n’a pas pu être envoyée.');
      setState('sent');
    } catch (err: any) { setState('error'); setError(err.message); }
  }

  return (
    <Layout title="Essai gratuit 14 jours — 30 minutes incluses · Permanence IA" description="Créez votre compte Permanence IA : 14 jours d’essai gratuit, 30 minutes incluses, prix HT, sans engagement et sans carte bancaire pour l’offre Découverte.">
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-20">
          <div>
            <Heading as="h1" title="Réclamez vos 30 minutes gratuites" intro="Créez votre compte, configurez votre premier agent et testez-le sur votre activité pendant 14 jours." />
            <TrialBadges className="mt-6" />
            <ul className="mt-8 space-y-3 text-ink">
              {['Aucune carte bancaire pour l’offre Découverte', 'Aucun paiement déclenché automatiquement', 'Démo live et widget web inclus', 'Accompagnement pour la première configuration'].map((t) => (
                <li key={t} className="flex gap-3"><Check className="mt-1 h-4 w-4 text-signal" aria-hidden />{t}</li>
              ))}
            </ul>
            <div className="mt-10 hidden overflow-hidden rounded-3xl border border-line lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/auth-light.jpg" alt="" aria-hidden className="w-full" />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            {state === 'sent' ? (
              <div role="status">
                <p className="font-display text-2xl font-bold">Votre demande d’essai est enregistrée</p>
                <p className="mt-3">Vous recevez vos accès par email à l’adresse indiquée. Un conseiller peut vous appeler pour vous aider à configurer votre premier agent.</p>
                <a href={LOGIN_URL} className="btn-primary mt-6">Aller à la connexion</a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <p className="font-display text-xl font-bold">Créer mon compte</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="su-name" className="mb-1.5 block text-sm font-semibold text-ink">Nom et prénom</label><input id="su-name" name="name" required autoComplete="name" className="field" /></div>
                  <div><label htmlFor="su-company" className="mb-1.5 block text-sm font-semibold text-ink">Entreprise</label><input id="su-company" name="company" required autoComplete="organization" className="field" /></div>
                  <div><label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold text-ink">Email professionnel</label><input id="su-email" name="email" type="email" required autoComplete="email" className="field" /></div>
                  <div><label htmlFor="su-phone" className="mb-1.5 block text-sm font-semibold text-ink">Téléphone</label><input id="su-phone" name="phone" type="tel" required minLength={8} autoComplete="tel" className="field" /></div>
                  <div>
                    <label htmlFor="su-sector" className="mb-1.5 block text-sm font-semibold text-ink">Secteur</label>
                    <select id="su-sector" name="sector" className="field" defaultValue="">
                      <option value="">Choisir…</option>
                      {SECTORS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                      <option value="autre">Autre activité</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="su-plan" className="mb-1.5 block text-sm font-semibold text-ink">Offre souhaitée</label>
                    <select id="su-plan" name="plan" className="field" defaultValue={OFFERS.some((o) => o.slug === planQuery) ? planQuery : 'decouverte'}>
                      {OFFERS.map((o) => <option key={o.slug} value={o.slug}>{o.name}{o.price ? ` — ${o.price} $ HT/mois` : o.price === 0 ? ' — gratuit' : ' — sur devis'}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-start gap-2.5 text-sm">
                  <input type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-[#0FA3C4]" />
                  <span>J’accepte les <a href="/cgu" className="font-semibold text-signal-deep underline">conditions générales</a> et la <a href="/confidentialite" className="font-semibold text-signal-deep underline">politique de confidentialité</a>, et d’être contacté pour la mise en place de mon compte.</span>
                </label>
                {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
                <button type="submit" disabled={state === 'sending'} className="btn-primary">{state === 'sending' ? 'Envoi…' : 'Créer mon compte gratuit'}</button>
                <p className="text-center text-sm">Déjà client ? <a href={LOGIN_URL} className="font-semibold text-signal-deep hover:underline">Connexion</a></p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
