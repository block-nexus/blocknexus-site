import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { Section } from '../../components/Section';

export const metadata: Metadata = {
  title: 'Docs | BlockNexus',
  description:
    'Developer documentation for integrating with the BlockNexus platform. SDKs, API references, and examples.',
};

export default function DocsStubPage() {
  return (
    <Layout>
      <Section>
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Docs
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Developer documentation is coming soon.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            We&apos;re preparing full API references, SDK guides, and integration examples for
            the BlockNexus platform. In the meantime, talk with our team to walk through
            your integration.
          </p>
        </div>
      </Section>
    </Layout>
  );
}
