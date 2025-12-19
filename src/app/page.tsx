import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { FeatureGrid } from '../components/FeatureGrid';
import { ServicesGrid } from '../components/ServicesGrid';
import { Certifications } from '../components/Certifications';
import { Experience } from '../components/Experience';
import { ContactSection } from '../components/ContactSection';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <FeatureGrid />
      <ServicesGrid />
      <Certifications />
      <Experience />
      <ContactSection />
    </Layout>
  );
}
