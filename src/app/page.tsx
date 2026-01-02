import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { FeatureGrid } from '../components/FeatureGrid';
import { ServicesGrid } from '../components/ServicesGrid';
import { Portfolio } from '../components/Portfolio';
import { Certifications } from '../components/Certifications';
import { Experience } from '../components/Experience';
import { ContactSection } from '../components/ContactSection';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <FeatureGrid />
      <ServicesGrid />
      <Portfolio />
      <Certifications />
      <Experience />
      <ContactSection />
    </Layout>
  );
}
