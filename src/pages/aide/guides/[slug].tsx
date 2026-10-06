// Guide pratique de l’espace client : une tâche expliquée pas à pas, libellés de l’interface en anglais.
import React from 'react';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { Section } from '@/components/ui';
import { GuideBody, guideHref, useGuideText } from '@/components/Guides';
import type { Guide } from '@/i18n/content/fr/guides';
import { LOGIN_URL, SITE } from '@/data/site';
import { useI18n } from '@/i18n';
import { fr } from '@/i18n/content/fr';

// Slugs identiques dans toutes les langues : la liste vient du contenu français.
const SLUGS = fr.guides.list.map((g) => g.slug);

export default function GuidePage({ slug }: { slug: string }) {
  const { c, market } = useI18n();
  const t = c.guides.ui;
  const help = c.ui.pages.help;
  const home = c.ui.components.layout.home;
  const fill = useGuideText();
  const g = c.guides.list.find((x) => x.slug === slug) as Guide;
  const title = fill(g.title);
  const category = t.categories[g.category];
  const related = g.related.map((s) => c.guides.list.find((x) => x.slug === s)).filter((x): x is Guide => Boolean(x));
  const crumbs = [
    { name: help.breadcrumb, path: '/aide' },
    { name: t.breadcrumb, path: '/aide#guides' },
    { name: title, path: guideHref(g.slug) },
  ];

  return (
    <Layout
      title={t.meta.title(title, market.brand)}
      description={fill(g.summary).slice(0, 158)}
      breadcrumbs={crumbs}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'HowTo', name: title, description: fill(g.summary),
        step: g.sections.map((s) => ({ '@type': 'HowToSection', name: fill(s.title), itemListElement: [...(s.steps ?? []), ...(s.list ?? [])].map((x) => ({ '@type': 'HowToStep', text: fill(x) })) })).filter((s) => s.itemListElement.length),
      }}
    >
      <section className="bg-paper">
        <div className="wrap py-12 lg:py-16">
          <nav aria-label={t.breadcrumb} className="text-sm">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-light">
              <li><Link href="/" className="hover:text-ink hover:underline">{home}</Link></li>
              {crumbs.map((b, i) => (
                <li key={b.path} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === crumbs.length - 1
                    ? <span aria-current="page" className="text-ink">{b.name}</span>
                    : <Link href={b.path} className="hover:text-ink hover:underline">{b.name}</Link>}
                </li>
              ))}
            </ol>
          </nav>
          <p className="mt-8 font-display text-sm font-semibold text-signal-deep">{t.eyebrow(category)}</p>
          <h1 className="mt-3 max-w-3xl text-hero font-extrabold">{title}</h1>
          <p className="mt-5 max-w-prose text-lg">{fill(g.summary)}</p>
          {g.plan && (
            <p className="mt-6 inline-flex flex-wrap gap-x-2 rounded-full bg-signal-soft px-4 py-2 text-[15px] text-ink">
              <b>{t.planLabel}</b><span>{fill(g.plan)}</span>
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={LOGIN_URL} className="btn-primary">{t.openSpace}</a>
            <Link href="/aide#guides" className="btn-ghost">{t.allGuides}</Link>
          </div>
        </div>
      </section>

      <Section>
        <GuideBody guide={g} />
        <p className="mt-14 max-w-prose">{t.helpBefore}<a href={`mailto:${SITE.email}`} className="font-semibold text-signal-deep underline">{SITE.email}</a>{t.helpAfter}</p>
      </Section>

      {related.length > 0 && (
        <Section tone="paper">
          <h2 className="font-display text-2xl font-bold">{t.relatedTitle}</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={guideHref(r.slug)} className="group block h-full rounded-2xl border border-line bg-white p-5 transition hover:border-signal">
                  <span className="font-semibold text-ink group-hover:text-signal-deep">{fill(r.title)}</span>
                  <span className="mt-1 block text-[15px]">{fill(r.summary)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => ({
  paths: (locales ?? ['fr']).flatMap((locale) => SLUGS.map((slug) => ({ params: { slug }, locale }))),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { slug: params!.slug } });
