import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { Section } from '../../components/Section';

export const metadata: Metadata = {
  title: 'Company | BlockNexus',
  description:
    'Learn about BlockNexus: our mission, vision, and the team building unified blockchain infrastructure for modern organizations.',
};

export default function CompanyPage() {
  return (
    <Layout>
      <Section>
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Company
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Building the backbone for onchain economies.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            BlockNexus exists to make it simple and safe for organizations to build
            blockchain-powered products. We believe the next decade of financial and
            internet infrastructure will be onchain—and it requires reliable foundations.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-3 text-xs">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">Mission</h2>
            <p className="text-slate-300">
              Give teams the confidence to build onchain by abstracting away operational
              complexity without sacrificing control.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">What we value</h2>
            <p className="text-slate-300">
              We default to reliability, clarity, and partnership. We work closely with
              customers to ship practical infrastructure that scales with them.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">Careers</h2>
            <p className="text-slate-300">
              We&apos;re assembling a small, senior team across infrastructure, security, and
              product engineering. If that sounds like you, we&apos;d love to talk.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="card-surface rounded-3xl px-6 py-8 text-sm md:px-10 md:py-10">
          <h2 className="text-base font-semibold text-slate-50">Join us</h2>
          <p className="mt-2 text-slate-300">
            Share a bit about what you&apos;re excited to build and how you think onchain
            infrastructure should evolve.
          </p>
          <p className="mt-4 text-slate-200">
            Email us at <span className="font-mono text-emerald-300">careers@blocknexus.tech</span>
          </p>
        </div>
      </Section>
    </Layout>
  );
}
