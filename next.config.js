/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Langues : français par défaut (sans préfixe), autres langues sous /en-gb, /en-au, /it, /pl, /nl, /he.
  // La détection se fait dans src/middleware.ts (langue du navigateur + choix mémorisé).
  i18n: { locales: ['fr', 'en-gb', 'en-au', 'it', 'pl', 'nl', 'he'], defaultLocale: 'fr', localeDetection: false },
  images: { unoptimized: true },
  // Pas d’en-tête « X-Powered-By: Next.js ».
  poweredByHeader: false,
  async headers() {
    // En-têtes de sécurité de toutes les pages. Micro autorisé pour le site et pour app.permanenceia.com :
    // la bulle de l’assistante (embed.js) et la démo dans le navigateur s’ouvrent dans un iframe de ce domaine.
    // CSP limitée à frame-ancestors (aucune règle sur les scripts) : le site ne peut être intégré que par
    // lui-même et par l’espace client white-label.
    const security = [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(self "https://app.permanenceia.com")' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://app.permanenceia.com https://app.autocalls.ai" },
    ];
    // Autorise l’interface white-label à récupérer les logos et icônes du site.
    const cors = [{ key: 'Access-Control-Allow-Origin', value: 'https://app.autocalls.ai' }];
    // Polices du dépôt (public/fonts) gardées un an par le navigateur, comme celles de next/font auparavant :
    // renommer le fichier si une police change.
    const fontCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
    return [
      { source: '/:path*', headers: security },
      { source: '/fonts/:path*', headers: fontCache },
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
      // Secteurs santé en pause : vers la liste des secteurs (redirection temporaire, ils pourront revenir).
      { source: '/dentaire', destination: '/secteurs', permanent: false },
      { source: '/cliniques', destination: '/secteurs', permanent: false },
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
