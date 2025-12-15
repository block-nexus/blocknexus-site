interface Feature {
  title: string;
  body: string;
  tag: string;
}

const features: Feature[] = [
  {
    title: 'Unified node & data plane',
    body: 'Access full nodes, archive data, and indexers through a single, consistent API surface.',
    tag: 'Infrastructure',
  },
  {
    title: 'Observability built-in',
    body: 'Deep metrics, traces, and alerts across chains without wiring up your own monitoring stack.',
    tag: 'Monitoring',
  },
  {
    title: 'Enterprise-grade controls',
    body: 'Regions, SLAs, role-based access, and audit logs designed for regulated environments.',
    tag: 'Enterprise',
  },
  {
    title: 'Developer-first experience',
    body: 'SDKs, examples, and sane defaults so teams can ship onchain features in days, not months.',
    tag: 'DX',
  },
];

export function FeatureGrid() {
  return (
    <section className="section-padding">
      <div className="space-y-8">
        <div className="max-w-xl space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Platform
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
            Everything you need to run serious blockchain workloads.
          </h2>
          <p className="text-sm text-slate-300">
            BlockNexus abstracts away node operations and network differences so your teams can
            focus on product, not plumbing.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="card-surface rounded-2xl p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                <span>{feature.tag}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs text-slate-300">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
