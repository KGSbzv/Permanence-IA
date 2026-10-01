import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@/context/ThemeContext';
import { CallbackProvider } from '@/context/CallbackContext';
import CallbackModal from '@/components/CallbackModal';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CallbackProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Component {...pageProps} />
        <CallbackModal />
      </CallbackProvider>
    </ThemeProvider>
  );
}
