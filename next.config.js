/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() {
    return [
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
