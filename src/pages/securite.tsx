import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Heading, Section, Tick } from '@/components/ui';
import { FinalCTA, SecurityBlock } from '@/components/blocks';

export default function Securite() {
  return (
    <Layout title="Sécurité et conformité — Permanence IA" description="Consentement, opt-out, chiffrement, rétention configurable, rôles et traçabilité : comment Permanence IA protège les données de vos appels.">
      <section className="bg-paper">
        <div className="wrap py-14 lg:py-20">
          <Heading as="h1" title="Sécurité et conformité de vos appels IA" intro="Vos appels contiennent des données personnelles. Voici les protections en place et les réglages dont vous disposez pour respecter le RGPD." />
        </div>
      </section>
      <Section><SecurityBlock /></Section>
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading title="Vos réglages" />
            <ul className="mt-8 space-y-3">
              <Tick>Durée de conservation des enregistrements et transcriptions</Tick>
              <Tick>Suppression d’un appel ou d’un contact à la demande</Tick>
              <Tick>Liste d’exclusion pour les appels sortants</Tick>
              <Tick>Plages horaires d’appel autorisées</Tick>
              <Tick>Mention « assistant IA » en début d’appel</Tick>
              <Tick>Enregistrement activable ou non, avec information de l’appelant</Tick>
            </ul>
          </div>
          <div>
            <Heading title="Nos engagements" />
            <ul className="mt-8 space-y-3">
              <Tick>L’agent se présente comme une IA et ne se fait pas passer pour un humain</Tick>
              <Tick>Aucun appel sortant sans consentement préalable du contact</Tick>
              <Tick>Aucun diagnostic médical, juridique ou financier par l’agent</Tick>
              <Tick>Données utilisées uniquement pour fournir le service</Tick>
              <Tick>Accompagnement pour adapter vos mentions d’information</Tick>
            </ul>
            <p className="mt-8 text-[15px]">Pour toute question ou demande d’exercice de droits : <Link href="/confidentialite" className="font-semibold text-signal-deep hover:underline">politique de confidentialité</Link>.</p>
          </div>
        </div>
      </Section>
      <FinalCTA />
    </Layout>
  );
}
