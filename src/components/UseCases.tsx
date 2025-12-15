interface UseCase {
  title: string;
  body: string;
  badge: string;
}

const useCases: UseCase[] = [
  {
    title: 'Exchanges',
    body: 'Power deposits, withdrawals, and proof-of-reserves without managing fleets of full nodes.',
    badge: 'Trading venues',
  },
  {
    title: 'Fintechs & neobanks',
    body: 'Add onchain payments and rewards to your existing banking stack with minimal changes.',
    badge: 'Financial services',
  },
  {
    title: 'Enterprises',
    body: 'Experiment with tokenization, settlement, and identity with a platform your security team trusts.',
    badge: 'Enterprise',
  },
];

export function UseCases() {
  return (
    <section className="section-padding">
      <div className="space-y-8">
        <div className="max-w-xl space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Solutions
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
            Built for teams where blockchain is mission-critical.
          </h2>
          <p className="text-sm text-slate-300">
            Whether you&apos;re an exchange, fintech, or enterprise innovator, BlockNexus plugs
            into your stack with the right controls and guarantees.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="card-surface flex flex-col rounded-2xl p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{useCase.badge}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-50">
                {useCase.title}
              </h3>
              <p className="mt-2 flex-1 text-xs text-slate-300">{useCase.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
