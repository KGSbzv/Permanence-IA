import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo/permanence-ia-icon-80.svg" />
        <meta name="theme-color" content="#1A2332" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="bg-white dark:bg-[#0F1419] text-[#1A2332] dark:text-white transition-colors duration-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
