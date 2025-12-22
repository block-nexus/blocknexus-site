import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { ServicesGrid } from '../../components/ServicesGrid';
import { FeatureGrid } from '../../components/FeatureGrid';
import { CallToAction } from '../../components/CallToAction';

export const metadata: Metadata = {
  title: 'Services | Block Nexus',
  description:
    'Block Nexus offers comprehensive AI & Web3 consulting services including security assessments, strategy, implementation, and training.',
};

export default function ServicesPage() {
  return (
    <Layout>
      <FeatureGrid />
      <ServicesGrid />
      <CallToAction />
    </Layout>
  );
}
