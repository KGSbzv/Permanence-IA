import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PhoneCall } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { SIGNUP_URL, SITE, WIDGET_SRC } from '@/data/site';
import { useCallbackModal } from '@/context/CallbackContext';
import { useI18n } from '@/i18n';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  ogImage?: string;
  jsonLd?: object;
  /** Fil d’Ariane (hors accueil) pour le balisage BreadcrumbList. */
  breadcrumbs?: { name: string; path: string }[];
  noindex?: boolean;
}

/** URL absolue d’un chemin interne dans une langue donnée (le français est sans préfixe). */
const localeUrl = (l: Locale, path: string) =>
  l === DEFAULT_LOCALE ? `${SITE.url}${path}` : `${SITE.url}/${l}${path === '/' ? '' : path}`;

export default function Layout({ children, title, description, ogImage = '/og-image.jpg', jsonLd, breadcrumbs, noindex }: LayoutProps) {
  const { asPath } = useRouter();
  const { openCallbackModal } = useCallbackModal();
  const { locale, market, c, path: localePath } = useI18n();
  const t = c.ui.components.layout;
  // Langue du site mémorisée pour tout le domaine : l’espace client (app.permanenceia.com) la lit
  // pour que Lucie accueille le client dans la langue du site d’où il vient.
  React.useEffect(() => {
    try {
      document.cookie = `pia_lang=${locale}; domain=.permanenceia.com; path=/; max-age=31536000; samesite=lax; secure`;
    } catch { /* cookies bloqués : l’espace client utilisera la langue du navigateur */ }
  }, [locale]);
  // asPath ne contient pas le préfixe de langue.
  const path = asPath.split('?')[0].split('#')[0] || '/';
  const url = localeUrl(locale, path);
  // Barre d’action mobile : on n’y répète pas l’action déjà proposée par la page courante.
  const showTrial = path !== SIGNUP_URL;
  const showCallback = path !== '/contact';
  const barBtn = 'min-h-[2.75rem] whitespace-normal px-3 py-2 text-center text-[13px] leading-tight sm:text-sm';
  const crumbs = breadcrumbs && {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [{ name: t.home, path: '/' }, ...breadcrumbs].map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: `${SITE.url}${localePath(b.path)}` })),
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
        {!noindex && LOCALES.map((l) => <link key={l} rel="alternate" hrefLang={MARKETS[l].hreflang} href={localeUrl(l, path)} />)}
        {!noindex && <link rel="alternate" hrefLang="x-default" href={localeUrl(DEFAULT_LOCALE, path)} />}
        <meta property="og:site_name" content={market.brand} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE.url}${ogImage}`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={market.ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
        {crumbs && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />}
      </Head>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2">{c.site.skipToContent}</a>
      <Navbar />
      <main id="contenu">{children}</main>
      <Footer />
      {/* Barre d’action collante sur mobile (doc 113) ; l’action de la page courante n’y est pas répétée. */}
      <div className={`fixed inset-x-0 bottom-0 z-40 grid gap-2 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden ${showTrial && showCallback ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {showTrial && <Link href={SIGNUP_URL} className={`btn-primary ${barBtn}`}>{t.freeTrial}</Link>}
        {showCallback && <button type="button" onClick={() => openCallbackModal({ type: 'commercial' })} className={`btn-ghost ${barBtn}`}><PhoneCall className="h-4 w-4 shrink-0" aria-hidden />{t.callMeBack}</button>}
      </div>
      <div className="h-[4.75rem] lg:hidden" aria-hidden />
      {/* Assistante commerciale IA (voix + chat) sur toutes les pages, propre au marché */}
      <Script key={market.widgetAssistantId} src={WIDGET_SRC} data-assistant-id={market.widgetAssistantId} strategy="lazyOnload" />
    </>
  );
}
