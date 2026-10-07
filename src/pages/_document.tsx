import { Html, Head, Main, NextScript, type DocumentProps } from 'next/document';
import { MARKETS } from '@/i18n/markets';
import { asLocale, isRtl } from '@/i18n/locales';
import { CONSENT_DEFAULT_SCRIPT, GA_ID } from '@/lib/analytics';

export default function Document({ __NEXT_DATA__ }: DocumentProps) {
  // Langue et sens d’écriture de la page (l’hébreu se lit de droite à gauche).
  const locale = asLocale(__NEXT_DATA__.locale);
  return (
    <Html lang={MARKETS[locale].hreflang} dir={isRtl(locale) ? 'rtl' : 'ltr'}>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0E1B4D" />
        {/* Google Analytics 4 en mode consentement : rien n’est stocké avant l’accord du visiteur. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
