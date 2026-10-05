import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { I18nProvider } from '@/i18n';
import Head from 'next/head';
import { CallbackProvider } from '@/context/CallbackContext';
import CallbackModal from '@/components/CallbackModal';
import TrialNudge from '@/components/TrialNudge';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  return (
    <I18nProvider locale={locale}>
    <CallbackProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <CallbackModal />
      <TrialNudge />
    </CallbackProvider>
    </I18nProvider>
  );
}
