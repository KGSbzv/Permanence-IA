import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { CallbackForm, Heading, Section } from '@/components/ui';
import { SITE } from '@/data/site';
import { Mail, MessageSquare, PhoneCall } from 'lucide-react';

export default function Contact() {
  const [type, setType] = useState<'commercial' | 'support'>('commercial');
  return (
    <Layout title="Contact et rappel — Permanence IA" description="Laissez votre numéro, on vous rappelle. Rappel commercial, démonstration ou support : choisissez votre créneau.">
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr] lg:py-20">
          <div>
            <Heading as="h1" title="Laissez votre numéro, on vous rappelle" intro="Nous ne publions pas de numéro : c’est nous qui vous rappelons, au créneau que vous choisissez. Vous pouvez aussi nous écrire." />
            <ul className="mt-10 space-y-5">
              <li className="flex gap-4"><PhoneCall className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">Rappel commercial</p><p className="text-[15px]">Questions sur les offres, démonstration, devis sur mesure.</p></div></li>
              <li className="flex gap-4"><MessageSquare className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">Rappel support</p><p className="text-[15px]">Clients : configuration, numéros, intégrations.</p></div></li>
              <li className="flex gap-4"><Mail className="h-6 w-6 shrink-0 text-signal" aria-hidden /><div><p className="font-display font-semibold text-ink">Email</p><a href={`mailto:${SITE.email}`} className="text-[15px] font-semibold text-signal-deep hover:underline">{SITE.email}</a></div></li>
            </ul>
            <p className="mt-10 text-sm text-slate-light">Permanence IA est une marque de {SITE.company}, 1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001, États-Unis.</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div role="tablist" aria-label="Type de demande" className="mb-6 grid grid-cols-2 rounded-xl bg-paper p-1">
              {(['commercial', 'support'] as const).map((t) => (
                <button key={t} role="tab" aria-selected={type === t} type="button" onClick={() => setType(t)} className={`rounded-lg py-2.5 text-sm font-semibold ${type === t ? 'bg-white text-ink shadow-card' : 'text-slate'}`}>
                  {t === 'commercial' ? 'Commercial et démo' : 'Support client'}
                </button>
              ))}
            </div>
            <CallbackForm key={type} type={type} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
