export function LogoCloud() {
  const logos = ['Exchange', 'Fintech', 'Custody', 'DeFi', 'Enterprise'];

  return (
    <section className="section-padding border-y border-slate-800/60 bg-slate-950/60">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
          Trusted by teams building onchain
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs text-slate-400">
          {logos.map((label) => (
            <div
              key={label}
              className="rounded-full border border-slate-800/80 bg-slate-900/60 px-4 py-1.5"
            >
              {label} teams
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
