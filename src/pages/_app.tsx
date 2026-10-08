import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { I18nProvider } from '@/i18n';
import Head from 'next/head';
import { CallbackProvider } from '@/context/CallbackContext';
import CallbackModal from '@/components/CallbackModal';
import TrialNudge from '@/components/TrialNudge';
import ConsentBanner from '@/components/ConsentBanner';
import { useEffect } from 'react';
import { loadMetaPixel, readConsent, track } from '@/lib/analytics';
import { Figtree, Heebo, Poppins } from 'next/font/google';
import '@/styles/globals.css';

// Polices téléchargées au moment du build et servies par le site (aucune requête vers Google côté visiteur,
// donc rien avant le consentement), mêmes graisses qu’avant.
const figtree = Figtree({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
const poppins = Poppins({ subsets: ['latin', 'latin-ext'], weight: ['600', '700', '800'], display: 'swap' });
// Hébreu seulement : pas de préchargement sur les autres langues.
const heebo = Heebo({ subsets: ['hebrew', 'latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', preload: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = router;
  // Pixel Meta chargé d’emblée seulement si le visiteur a déjà accepté (sinon, au clic sur « Accepter »).
  useEffect(() => { if (readConsent() === 'granted') loadMetaPixel(); }, []);
  // Pages vues lors des changements de page côté client, et clics utiles (essai, inscription, appel).
  useEffect(() => {
    const onRoute = (url: string) => track('page_view', { page_location: window.location.origin + url, page_title: document.title });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a');
      const href = a?.getAttribute('href') || '';
      if (href.startsWith('tel:')) track('phone_call_click', { phone: href.slice(4), language: locale });
      else if (/essai-gratuit|\/register/.test(href)) track('begin_trial_click', { link_url: href, language: locale });
    };
    router.events.on('routeChangeComplete', onRoute);
    document.addEventListener('click', onClick);
    return () => { router.events.off('routeChangeComplete', onRoute); document.removeEventListener('click', onClick); };
  }, [router.events, locale]);
  return (
    <I18nProvider locale={locale}>
    <CallbackProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Familles générées par next/font exposées sur :root (tailwind.config.js et globals.css les lisent). */}
      <style jsx global>{`
        :root {
          --font-figtree: ${figtree.style.fontFamily};
          --font-poppins: ${poppins.style.fontFamily};
          --font-heebo: ${heebo.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <CallbackModal />
      <TrialNudge />
      <ConsentBanner />
    </CallbackProvider>
    </I18nProvider>
  );
}
