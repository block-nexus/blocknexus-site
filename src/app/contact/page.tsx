import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { Section } from '../../components/Section';
import { ContactForm } from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | BlockNexus',
  description:
    'Talk to the BlockNexus team about your blockchain infrastructure needs. Share your use case and we will follow up shortly.',
};

export default function ContactPage() {
  return (
    <Layout>
      <Section>
        <div className="max-w-xl space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Contact
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Tell us about your use case.
          </h1>
          <p className="text-sm text-slate-300">
            Share a few details about your team, current stack, and what you&apos;re looking
            to build. We&apos;ll follow up with next steps and a tailored walkthrough.
          </p>
          <p className="text-xs text-slate-400">
            Prefer email? Reach us at{' '}
            <span className="font-mono text-emerald-300">hello@blocknexus.tech</span>.
          </p>
        </div>
      </Section>

      <Section>
        <ContactForm />
      </Section>
    </Layout>
  );
}
