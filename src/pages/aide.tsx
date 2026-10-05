// Aide de l’espace client : l’interface est en anglais, cette page la traduit et guide pas à pas.
import React from 'react';
import Layout from '@/components/Layout';
import { Heading, Section } from '@/components/ui';
import { LOGIN_URL, SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import { RichText } from '@/i18n/rich';

// Aperçu d’un échange avec l’assistante d’aide : ce que le client voit dans son espace.
function HelpChatPreview() {
  const { c, market } = useI18n();
  const t = c.ui.pages.help;
  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-float" aria-label={t.chatLabel}>
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="font-display font-semibold text-ink">{t.chatTitle(market.brand)}</p>
        <span className="text-xs text-slate-light">{t.chatMode}</span>
      </div>
      <div className="mt-4 space-y-3">
        {t.chat.map((l, i) => (
          <p key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] ${l.me ? 'ml-auto bg-signal text-white' : 'bg-paper text-ink'}`}><RichText value={l.text} /></p>
        ))}
      </div>
    </div>
  );
}

export default function Aide() {
  const { c, market } = useI18n();
  const t = c.ui.pages.help;
  const { menu, tasks, glossary } = c.help;
  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description}
      breadcrumbs={[{ name: t.breadcrumb, path: '/aide' }]}
    >
      <section className="bg-paper">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-20">
          <div>
          <Heading
            as="h1"
            title={t.h1}
            intro={t.intro}
          />
          <a href={LOGIN_URL} className="btn-primary mt-8">{t.openSpace}</a>
          </div>
          <HelpChatPreview />
        </div>
      </section>

      <Section>
        <h2 className="font-display text-2xl font-bold">{t.tasksTitle}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {tasks.map((task) => (
            <article key={task.title} className="rounded-2xl border border-line p-6">
              <h3 className="font-display text-lg font-bold">{task.title}</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                {task.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="font-display text-2xl font-bold">{t.menuTitle}</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-ink">
              <tr><th className="p-4">{t.colMenu}</th><th className="p-4">{t.colLabel}</th><th className="p-4">{t.colText}</th></tr>
            </thead>
            <tbody>
              {menu.map((m) => (
                <tr key={m.en} className="border-b border-line last:border-0">
                  <td className="p-4 font-semibold text-ink">{m.en}</td><td className="p-4">{m.label}</td><td className="p-4">{m.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-bold">{t.glossaryTitle}</h2>
        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          {glossary.map((g) => (
            <div key={g.en}><dt className="font-semibold text-ink">{g.en} — {g.label}</dt><dd className="mt-1">{g.text}</dd></div>
          ))}
        </dl>
        <p className="mt-10">{t.moreBefore}<a href={`mailto:${SITE.email}`} className="font-semibold text-signal-deep underline">{SITE.email}</a>{t.moreAfter}</p>
      </Section>
    </Layout>
  );
}
