// Fiches internes « processus » lues par les bases de connaissances des agents vocaux (non référencées).
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';

const DOCS = ['fr', 'en', 'it', 'pl', 'nl', 'he'];

export default function KbDoc({ text }: { text: string }) {
  const [title, ...rest] = text.split('\n');
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="wrap max-w-prose py-12">
        <h1 className="text-h3 font-bold">{title}</h1>
        <pre className="mt-6 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-ink">{rest.join('\n').trim()}</pre>
      </main>
    </>
  );
}

// Toutes les langues : le robot d’indexation peut être redirigé selon sa langue par le middleware.
export const getStaticPaths: GetStaticPaths = async ({ locales }) => ({
  paths: (locales ?? ['fr']).flatMap((locale) => DOCS.map((doc) => ({ params: { doc }, locale }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { text: fs.readFileSync(path.join(process.cwd(), 'src/data/kb', `${params!.doc}.txt`), 'utf8') },
});
