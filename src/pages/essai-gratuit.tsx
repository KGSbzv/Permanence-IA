// Essai gratuit : création du compte sur l’app (essai natif 14 j / 30 min), ou demande d’accompagnement.
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Heading, TrialBadges } from '@/components/ui';
import { OFFERS } from '@/data/offers';
import { SECTORS } from '@/data/sectors';
import { LOGIN_URL, REGISTER_URL } from '@/data/site';

export default function EssaiGratuit() {
  const { query } = useRouter();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const planQuery = typeof query.plan === 'string' ? query.plan : 'decouverte';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get('terms')) { setError('Acceptez les conditions pour être rappelé.'); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), email: f.get('email'), company: f.get('company'),
          sector: f.get('sector'), consentCall: true, type: 'commercial', agent: 'Accompagnement essai',
          note: `Demande d’accompagnement à l’essai — offre ${f.get('plan')} — ${f.get('company') || ''}`,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'L’inscription n’a pas pu être envoyée.');
      setState('sent');
    } catch (err: any) { setState('error'); setError(err.message); }
  }

  return (
    <Layout title="Essai gratuit 14 jours — 30 minutes incluses · Permanence IA" description="Créez votre compte Permanence IA : 14 jours d’essai gratuit, 30 minutes incluses, prix HT, rien n’est débité pendant l’essai, annulable à tout moment.">
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-20">
          <div>
            <Heading as="h1" title="Réclamez vos 30 minutes gratuites" intro="Créez votre compte, choisissez le forfait à tester et essayez votre agent sur votre activité pendant 14 jours." />
            <TrialBadges className="mt-6" />
            <ul className="mt-8 space-y-3 text-ink">
              {['Carte demandée à l’activation, rien n’est débité pendant 14 jours', 'Annulez depuis votre espace avant la fin de l’essai : vous ne payez rien', 'Démo live et widget web inclus', 'Accompagnement pour la première configuration'].map((t) => (
                <li key={t} className="flex gap-3"><Check className="mt-1 h-4 w-4 text-signal" aria-hidden />{t}</li>
              ))}
            </ul>
            <div className="mt-10 hidden overflow-hidden rounded-3xl border border-line lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/auth-light.jpg" alt="" aria-hidden className="w-full" />
            </div>
          </div>
          <div className="grid content-start gap-6">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <p className="font-display text-xl font-bold">Créer mon compte</p>
            <ol className="mt-4 space-y-2 text-ink">
              <li>1. Créez votre compte avec votre email professionnel.</li>
              <li>2. Choisissez le forfait à tester dans votre espace.</li>
              <li>3. Configurez votre agent et passez vos premiers appels.</li>
            </ol>
            <a href={REGISTER_URL} className="btn-primary mt-6 w-full">Créer mon compte gratuit</a>
            <p className="mt-3 text-center text-sm">Déjà client ? <a href={LOGIN_URL} className="font-semibold text-signal-deep hover:underline">Connexion</a></p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            {state === 'sent' ? (
              <div role="status">
                <p className="font-display text-2xl font-bold">Votre demande est enregistrée</p>
                <p className="mt-3">Un conseiller vous rappelle pour configurer votre premier agent avec vous.</p>
                <a href={REGISTER_URL} className="btn-primary mt-6">Créer mon compte maintenant</a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <p className="font-display text-xl font-bold">Préférez être accompagné ?</p>
                <p className="-mt-2 text-sm">Laissez vos coordonnées : un conseiller vous rappelle pour démarrer l’essai avec vous.</p>
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
                  <span>J’accepte les <a href="/cgu" className="font-semibold text-signal-deep underline">conditions générales</a> et la <a href="/confidentialite" className="font-semibold text-signal-deep underline">politique de confidentialité</a>, et d’être rappelé pour la mise en place de mon compte.</span>
                </label>
                {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
                <button type="submit" disabled={state === 'sending'} className="btn-primary">{state === 'sending' ? 'Envoi…' : 'Être rappelé'}</button>
              </form>
            )}
          </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
