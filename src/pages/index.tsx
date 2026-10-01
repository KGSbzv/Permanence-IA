import React from 'react';
import Layout from '@/components/Layout';
import HeroAgents from '@/components/Home/HeroAgents';
import AgentDefinition from '@/components/Home/AgentDefinition';
import AgentCatalogue from '@/components/Home/AgentCatalogue';
import ArchitectureProcess from '@/components/Home/ArchitectureProcess';
import SectorsPreview from '@/components/Home/SectorsPreview';
import PackagesCompare from '@/components/Home/PackagesCompare';
import ComparisonTable from '@/components/Home/ComparisonTable';
import ClientPortalMockup from '@/components/Home/ClientPortalMockup';
import FreeTierBanner from '@/components/Home/FreeTierBanner';
import FAQCTASection from '@/components/Home/FAQCTASection';

export default function Home() {
  return (
    <Layout
      title="Permanence IA | Une équipe d’agents IA pour attirer, convertir et fidéliser"
      description="Capturez les demandes, qualifiez les prospects, planifiez des rappels et gardez chaque conversation organisée — sans carte bancaire, sans engagement et sans numéro public."
    >
      <HeroAgents />
      <AgentDefinition />
      <AgentCatalogue />
      <ArchitectureProcess />
      <SectorsPreview />
      <PackagesCompare />
      <ComparisonTable />
      <ClientPortalMockup />
      <FreeTierBanner />
      <FAQCTASection />
    </Layout>
  );
}
