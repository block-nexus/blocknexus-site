import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { Section } from '../../components/Section';
import { CodeSnippet } from '../../components/CodeSnippet';
import { Timeline } from '../../components/Timeline';

export const metadata: Metadata = {
  title: 'Product | BlockNexus',
  description:
    'Explore the BlockNexus platform: unified node and data infrastructure, observability, and enterprise controls for blockchain workloads.',
};

const exampleCode = `import { BlockNexusClient } from '@blocknexus/sdk';

const client = new BlockNexusClient({
  apiKey: process.env.BLOCKNEXUS_API_KEY!,
});

async function getBalance(address: string) {
  const balance = await client.evm.getBalance({
    chainId: 1,
    address,
  });

  return balance;
}`;

export default function ProductPage() {
  return (
    <Layout>
      <Section>
        <div className="grid gap-10 md:grid-cols-[3fr,2fr] md:items-center">
          <div className="space-y-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
              Product overview
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              One platform for nodes, data, and observability.
            </h1>
            <p className="text-sm text-slate-300">
              BlockNexus centralizes node infrastructure, historical data, and deep monitoring
              into a single control plane. Connect once and ship onchain features across chains
              without rebuilding your stack each time.
            </p>
          </div>
          <CodeSnippet title="Simple balance lookup" code={exampleCode} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">Node infrastructure</h2>
            <p className="text-xs text-slate-300">
              Global, auto-scaled nodes with regional control, failover, and predictable
              performance across supported networks.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">Data & indexing</h2>
            <p className="text-xs text-slate-300">
              High-fidelity historical data and custom indexers so teams can build analytics,
              compliance, and product features on top of a single source of truth.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-50">Observability & control</h2>
            <p className="text-xs text-slate-300">
              Metrics, traces, and alerts out-of-the-box, with fine-grained access controls and
              audit logs for regulated teams.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-[3fr,2fr] md:items-start">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
              Architecture
            </p>
            <h2 className="text-lg font-semibold text-slate-50">
              Designed for reliability, built for security.
            </h2>
            <p className="text-sm text-slate-300">
              Under the hood, BlockNexus runs redundant node clusters, streaming pipelines, and
              observability services tuned for blockchain workloads. Your teams get a simple,
              multi-tenant API while we handle the complexity.
            </p>
          </div>
          <Timeline />
        </div>
      </Section>
    </Layout>
  );
}
