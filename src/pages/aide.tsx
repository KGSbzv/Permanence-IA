// Aide de l’espace client : l’interface est en anglais, cette page la traduit et guide pas à pas.
import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section } from '@/components/ui';
import { HELP_GLOSSARY, HELP_MENU, HELP_TASKS } from '@/data/help';
import { LOGIN_URL, SITE } from '@/data/site';

// Aperçu d’un échange avec l’assistante d’aide : ce que le client voit dans son espace.
function HelpChatPreview() {
  const lines: { me?: boolean; text: React.ReactNode }[] = [
    { me: true, text: 'Où est-ce que j’ajoute des minutes ?' },
    { text: <>En haut à droite, ouvrez le menu de votre profil puis cliquez sur <b>Add credits</b> (ajouter du crédit). Choisissez une recharge : le crédit ne périme pas.</> },
    { me: true, text: 'Et pour mettre l’agent sur mon site ?' },
    { text: <>Ouvrez votre agent dans <b>Assistants</b>, section <b>Web widget</b> (widget web) : activez-le, puis copiez le code fourni. On le fait ensemble ?</> },
  ];
  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-float" aria-label="Exemple d’échange avec l’assistante d’aide">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="font-display font-semibold text-ink">Aide Permanence IA</p>
        <span className="text-xs text-slate-light">En français · écrit ou voix</span>
      </div>
      <div className="mt-4 space-y-3">
        {lines.map((l, i) => (
          <p key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] ${l.me ? 'ml-auto bg-signal text-white' : 'bg-paper text-ink'}`}>{l.text}</p>
        ))}
      </div>
    </div>
  );
}

export default function Aide() {
  return (
    <Layout
      title="Aide de l’espace client — Permanence IA"
      description="Guide en français de votre espace client : traduction des menus, création d’un agent, numéros, agenda, widget, minutes et facturation."
      breadcrumbs={[{ name: 'Aide', path: '/aide' }]}
    >
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-20">
          <div>
          <Heading
            as="h1"
            title="Aide de votre espace client"
            intro="Votre espace client s’affiche en anglais. Ce guide traduit chaque menu et vous accompagne pas à pas. Dans l’espace, l’assistante d’aide (bulle en bas à droite) répond aussi en français, par écrit ou à voix haute."
          />
          <a href={LOGIN_URL} className="btn-primary mt-8">Ouvrir mon espace</a>
          </div>
          <HelpChatPreview />
        </div>
      </section>

      <Section>
        <h2 className="font-display text-2xl font-bold">Les tâches courantes, pas à pas</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {HELP_TASKS.map((t) => (
            <article key={t.title} className="rounded-2xl border border-line p-6">
              <h3 className="font-display text-lg font-bold">{t.title}</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                {t.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="font-display text-2xl font-bold">Les menus de l’espace, traduits</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-ink">
              <tr><th className="p-4">Menu (anglais)</th><th className="p-4">En français</th><th className="p-4">À quoi ça sert</th></tr>
            </thead>
            <tbody>
              {HELP_MENU.map((m) => (
                <tr key={m.en} className="border-b border-line last:border-0">
                  <td className="p-4 font-semibold text-ink">{m.en}</td><td className="p-4">{m.fr}</td><td className="p-4">{m.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-bold">Petit lexique</h2>
        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          {HELP_GLOSSARY.map((g) => (
            <div key={g.en}><dt className="font-semibold text-ink">{g.en} — {g.fr}</dt><dd className="mt-1">{g.text}</dd></div>
          ))}
        </dl>
        <p className="mt-10">Une question qui n’est pas ici ? Écrivez à <a href={`mailto:${SITE.email}`} className="font-semibold text-signal-deep underline">{SITE.email}</a> ou demandez un rappel depuis la page contact.</p>
      </Section>
    </Layout>
  );
}
