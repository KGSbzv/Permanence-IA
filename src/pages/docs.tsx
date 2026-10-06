// Bouton « Docs » de l’espace client : renvoie vers l’aide et les guides dans la langue du client
// (langue du site mémorisée dans le cookie pia_lang, sinon langue du navigateur).
import type { GetServerSideProps } from 'next';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales';

const BY_LANG: Record<string, string> = { fr: 'fr', en: 'en-gb', it: 'it', pl: 'pl', nl: 'nl', he: 'he', iw: 'he' };

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = /(?:^|;\s*)pia_lang=([^;]+)/.exec(req.headers.cookie || '')?.[1];
  let locale = cookie && (LOCALES as readonly string[]).includes(cookie) ? cookie : '';
  if (!locale) {
    const langs = String(req.headers['accept-language'] || '').toLowerCase().split(',').map((l) => l.trim().split(';')[0]);
    for (const l of langs) {
      if (l === 'en-au') { locale = 'en-au'; break; }
      const hit = BY_LANG[l.slice(0, 2)];
      if (hit) { locale = hit; break; }
    }
  }
  if (!locale) locale = 'en-gb';
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return { redirect: { destination: `${prefix}/aide`, permanent: false } };
};

export default function Docs() {
  return null;
}
