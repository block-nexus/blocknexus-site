import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { Section } from '../../components/Section';

export const metadata: Metadata = {
  title: 'Solutions | BlockNexus',
  description:
    'BlockNexus solutions for exchanges, fintechs, and enterprises where blockchain is mission-critical.',
};

const segments = [
  {
    title: 'Exchanges',
    subtitle: 'Trading venues & brokers',
    pain: 'You manage fleets of nodes and brittle integrations just to keep deposits, withdrawals, and proof-of-reserves online.',
    solution:
      'BlockNexus consolidates node providers into a single platform with SLAs, multi-region routing, and observability out-of-the-box.',
  },
  {
    title: 'Fintechs & neobanks',
    subtitle: 'Consumer & business finance',
    pain: 'You want to add onchain payments or rewards without rewriting your existing core banking stack.',
    solution:
      'Expose blockchain capabilities behind a clean API, with rate limits, audit logs, and regional controls your compliance team expects.',
  },
  {
    title: 'Enterprises',
    subtitle: 'Large organizations & innovators',
    pain: 'You need a secure way to experiment with tokenization, settlement, and identity across multiple chains.',
    solution:
      'BlockNexus gives you a governed control plane with environments, roles, and observability that plug into your existing tooling.',
  },
];

export default function SolutionsPage() {
  return (
    <Layout>
      <Section>
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Solutions
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Tailored for teams where downtime is not an option.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            BlockNexus sits between your applications and the chains you rely on, giving you a
            consistent way to build and operate onchain features without piecing together a
            patchwork of infrastructure.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {segments.map((segment) => (
            <article key={segment.title} className="card-surface flex flex-col rounded-2xl p-5 text-xs">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                {segment.subtitle}
              </p>
              <h2 className="mt-2 text-sm font-semibold text-slate-50">{segment.title}</h2>
              <p className="mt-3 text-slate-300">{segment.pain}</p>
              <div className="mt-3 rounded-xl bg-slate-900/70 p-3 text-slate-200">
                <p className="text-[11px] font-semibold text-emerald-300">How BlockNexus helps</p>
                <p className="mt-1 text-[11px] text-slate-200">{segment.solution}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
