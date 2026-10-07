// Fiche texte « modules » par langue, lue par les bases de connaissances des agents (non référencée) :
// le détail des 14 modules (usages, étapes, cas, forfait minimal), sans la mise en page du site.
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { CONTENT } from '@/i18n/content';
import type { Lang } from '@/i18n/locales';

const LANGS = Object.keys(CONTENT) as Lang[];
const TITLE: Record<string, string> = {
  fr: 'Fonctionnalités — détail des modules', en: 'Features — module details', it: 'Funzionalità — dettaglio dei moduli',
  pl: 'Funkcje — szczegóły modułów', nl: 'Functies — details van de modules', he: 'פיצ׳רים – פירוט המודולים',
};

// htmlLang : langue de la fiche pour <html lang dir> dans _document.
interface Props { lang: string; text: string; htmlLang: string }

export default function KbModules({ lang, text }: Props) {
  return (
    <>
      <Head><title>{TITLE[lang]}</title><meta name="robots" content="noindex, nofollow" /></Head>
      <main className="wrap max-w-prose py-12" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <h1 className="text-h3 font-bold">{TITLE[lang]}</h1>
        <pre className="mt-6 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-ink">{text}</pre>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: LANGS.map((lang) => ({ params: { lang }, locale: 'fr' })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const lang = String(params!.lang) as Lang;
  const c = CONTENT[lang];
  const offerName = (slug: string) => (c.offers as Record<string, { name: string }>)[slug]?.name ?? slug;
  const text = c.modules.map((m) => [
    `## ${m.name} (${m.family})`,
    m.title, m.intro,
    `• ${m.uses.join('\n• ')}`,
    m.steps.map((s, i) => `${i + 1}. ${s.title} : ${s.text}`).join('\n'),
    `Cas : ${m.cases.join(' ; ')}`,
    `Intégrations : ${m.integrations.join(', ')}`,
    `À partir de : ${offerName(m.from)}`,
  ].join('\n')).join('\n\n');
  return { props: { lang, text, htmlLang: lang } };
};
