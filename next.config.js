/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Langues : français par défaut (sans préfixe), autres langues sous /en-gb, /en-au, /it, /pl, /nl.
  // La détection se fait dans src/middleware.ts (langue du navigateur + choix mémorisé).
  i18n: { locales: ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl'], defaultLocale: 'fr', localeDetection: false },
  images: { unoptimized: true },
  // Autorise l’interface white-label à récupérer les logos et icônes du site.
  async headers() {
    const cors = [{ key: 'Access-Control-Allow-Origin', value: 'https://app.autocalls.ai' }];
    return [
      { source: '/logo/:path*', headers: cors },
      { source: '/agents/:path*', headers: cors },
      { source: '/icon-:size.png', headers: cors },
    ];
  },
  async redirects() {
    return [
      { source: '/offres', destination: '/tarifs', permanent: true },
      // Pas encore d’articles : le blog renvoie vers la FAQ.
      { source: '/blog', destination: '/faq', permanent: false },
      { source: '/blog/:slug*', destination: '/faq', permanent: false },
      { source: '/plombiers', destination: '/secteurs/services-a-domicile', permanent: true },
      { source: '/dentaire', destination: '/secteurs/dentaire-cliniques', permanent: true },
      { source: '/cliniques', destination: '/secteurs/dentaire-cliniques', permanent: true },
      { source: '/immobilier', destination: '/secteurs/immobilier', permanent: true },
      { source: '/industries', destination: '/secteurs', permanent: true },
      { source: '/demo-live', destination: '/demo', permanent: true },
      { source: '/offres/essentiel', destination: '/offres/receptionniste', permanent: true },
      { source: '/offres/croissance', destination: '/offres/assistant', permanent: true },
      { source: '/offres/pro', destination: '/offres/centre-appels', permanent: true },
    ];
  },
};

module.exports = nextConfig;
