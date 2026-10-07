// Fiches internes « processus » lues par les bases de connaissances des agents vocaux (non référencées).
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';

// Une fiche par fichier de src/data/kb : processus (fr.txt…) et parcours / situations (fr-situations.txt…).
const DOCS = fs.readdirSync(path.join(process.cwd(), 'src/data/kb')).filter((f) => f.endsWith('.txt')).map((f) => f.replace(/\.txt$/, ''));

export default function KbDoc({ text, rtl }: { text: string; rtl: boolean }) {
  const [title, ...rest] = text.split('\n');
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {/* Sens d’écriture du document lui-même (hébreu = droite à gauche), quelle que soit la langue de l’URL. */}
      <main className="wrap max-w-prose py-12" dir={rtl ? 'rtl' : 'ltr'}>
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
  props: {
    text: fs.readFileSync(path.join(process.cwd(), 'src/data/kb', `${params!.doc}.txt`), 'utf8'),
    rtl: String(params!.doc).startsWith('he'),
  },
});
