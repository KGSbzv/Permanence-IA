import type { GetServerSideProps } from 'next';
import { SITE } from '@/data/site';
import { getI18n } from '@/i18n';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';

// Toutes les pages, dans toutes les langues : le français sans préfixe, les autres sous /<locale>/…
// Chaque URL liste ses variantes de langue (hreflang) et la version française en x-default.
// Le blog n’y figure pas : il renvoie vers la FAQ tant qu’aucun article n’est publié.
const STATIC = ['/', '/tarifs', '/demo', '/contact', '/integrations', '/securite', '/faq', '/aide', '/secteurs', '/fonctionnalites', '/offres/recharges', '/essai-gratuit', '/about', '/mentions-legales', '/cgu', '/confidentialite', '/cookies'];

const url = (locale: Locale, p: string) => `${SITE.url}${locale === DEFAULT_LOCALE ? p : `/${locale}${p === '/' ? '' : p}`}`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Les slugs sont ceux du contenu français, identiques dans toutes les langues.
  const { c, offers } = getI18n(DEFAULT_LOCALE);
  const paths = [
    ...STATIC,
    ...offers.map((o) => `/offres/${o.slug}`),
    ...c.sectors.map((s) => `/secteurs/${s.slug}`),
    ...c.modules.map((m) => `/fonctionnalites/${m.slug}`),
  ];
  const alternates = (p: string) =>
    LOCALES.map((l) => `<xhtml:link rel="alternate" hreflang="${MARKETS[l].hreflang}" href="${url(l, p)}"/>`).join('') +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LOCALE, p)}"/>`;
  const entries = paths.flatMap((p) => LOCALES.map((l) => `<url><loc>${url(l, p)}</loc>${alternates(p)}</url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.write(xml); res.end();
  return { props: {} };
};

export default function Sitemap() { return null; }
