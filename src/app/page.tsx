import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { LogoCloud } from '../components/LogoCloud';
import { FeatureGrid } from '../components/FeatureGrid';
import { Stats } from '../components/Stats';
import { UseCases } from '../components/UseCases';
import { Testimonial } from '../components/Testimonial';
import { CallToAction } from '../components/CallToAction';
import { CalloutBanner } from '../components/CalloutBanner';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <LogoCloud />
      <FeatureGrid />
      <Stats />
      <UseCases />
      <Testimonial />
      <CalloutBanner />
      <CallToAction />
    </Layout>
  );
}
