import { Html, Head, Main, NextScript, type DocumentProps } from 'next/document';
import { MARKETS } from '@/i18n/markets';
import { asLocale, isRtl } from '@/i18n/locales';
import { CONSENT_DEFAULT_SCRIPT } from '@/lib/analytics';

// Fichiers latins de Figtree (texte) et de Poppins (titres), utiles dès le premier affichage de chaque page.
const FONT_PRELOADS = [
  '/fonts/figtree/figtree-latin-wght-normal.woff2',
  '/fonts/poppins/poppins-latin-600-normal.woff2',
  '/fonts/poppins/poppins-latin-700-normal.woff2',
  '/fonts/poppins/poppins-latin-800-normal.woff2',
];

export default function Document({ __NEXT_DATA__ }: DocumentProps) {
  // Langue et sens d’écriture de la page (l’hébreu se lit de droite à gauche).
  const locale = asLocale(__NEXT_DATA__.locale);
  // Fiches /kb : langue du document lui-même (prop htmlLang), quelle que soit la langue de l’URL.
  const docLang: unknown = __NEXT_DATA__.props?.pageProps?.htmlLang;
  const lang = typeof docLang === 'string' ? docLang : MARKETS[locale].hreflang;
  const rtl = typeof docLang === 'string' ? docLang === 'he' : isRtl(locale);
  return (
    <Html lang={lang} dir={rtl ? 'rtl' : 'ltr'}>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0E1B4D" />
        {/* Vérification du domaine permanenceia.com dans le portefeuille Meta « SINAY Strategic LLC » (pixel, publicités). */}
        <meta name="facebook-domain-verification" content="y391fpjod91dumruk22wu17s0sxm5b" />
        {/* Préchargement des polices latines du site (src/styles/fonts.css) ; Heebo (hébreu) se charge à la demande. */}
        {FONT_PRELOADS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        {/* Google Analytics 4 : consentement refusé par défaut. gtag.js n’est chargé qu’après l’accord du visiteur
            (loadGoogleAnalytics, src/lib/analytics.ts) : aucune requête vers Google avant le clic sur « Accepter ». */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
