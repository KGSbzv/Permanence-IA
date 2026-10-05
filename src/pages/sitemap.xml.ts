import type { GetServerSideProps } from 'next';
import { MODULES } from '@/data/modules';
import { OFFERS } from '@/data/offers';
import { SECTORS } from '@/data/sectors';
import { SITE } from '@/data/site';

const STATIC = ['/', '/tarifs', '/demo', '/contact', '/integrations', '/securite', '/faq', '/aide', '/secteurs', '/fonctionnalites', '/offres/recharges', '/essai-gratuit', '/about', '/mentions-legales', '/cgu', '/confidentialite', '/cookies'];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const paths = [
    ...STATIC,
    ...OFFERS.map((o) => `/offres/${o.slug}`),
    ...SECTORS.map((s) => `/secteurs/${s.slug}`),
    ...MODULES.map((m) => `/fonctionnalites/${m.slug}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${SITE.url}${p === '/' ? '/' : p}</loc></url>`).join('')}</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.write(xml); res.end();
  return { props: {} };
};

export default function Sitemap() { return null; }
