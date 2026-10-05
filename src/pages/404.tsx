import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout title="Page introuvable — Permanence IA" description="Cette page n’existe pas ou a été déplacée." noindex>
      <section className="bg-paper">
        <div className="wrap py-24 text-center">
          <h1 className="text-h2 font-bold">Cette page n’existe pas ou a été déplacée</h1>
          <p className="mt-3">Revenez à l’accueil ou consultez nos offres.</p>
          <div className="mt-8 flex justify-center gap-3"><Link href="/" className="btn-primary">Retour à l’accueil</Link><Link href="/tarifs" className="btn-ghost">Voir les tarifs</Link></div>
        </div>
      </section>
    </Layout>
  );
}
