import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
}

export default function Layout({
  children,
  title = 'Permanence IA | Réceptionniste IA 24/7 pour votre entreprise',
  description = 'Ne manquez plus aucun appel. Permanence IA décroche, qualifie vos leads et planifie vos rendez-vous 24h/24 et 7j/7 avec un agent vocal naturel et fiable. Essai gratuit 7 jours.',
  ogImage = '/logo/permanence-ia-full.svg',
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F1419] text-[#1A2332] dark:text-white transition-colors duration-200">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
