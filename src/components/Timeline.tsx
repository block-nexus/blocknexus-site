interface Step {
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    title: 'Discovery & design',
    body: 'Share your architecture, throughput requirements, and compliance constraints.',
  },
  {
    title: 'Pilot integration',
    body: 'Integrate a subset of flows against BlockNexus with sandbox credentials.',
  },
  {
    title: 'Scale to production',
    body: 'Roll out across environments with SLAs, on-call, and dashboards configured.',
  },
];

export function Timeline() {
  return (
    <div className="card-surface rounded-2xl p-5 text-xs">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
        How it works
      </p>
      <ol className="mt-4 space-y-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500/20 text-[11px] font-semibold text-primary-300 ring-1 ring-primary-400/40">
              {index + 1}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-100">{step.title}</p>
              <p className="mt-1 text-[11px] text-slate-300">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
