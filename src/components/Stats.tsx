const stats = [
  {
    label: 'Requests per day',
    value: '10B+',
  },
  {
    label: 'Supported networks',
    value: '25+',
  },
  {
    label: 'SLA uptime',
    value: '99.99%',
  },
  {
    label: 'Latency to first byte',
    value: '<60ms',
  },
];

export function Stats() {
  return (
    <section className="section-padding">
      <div className="card-surface rounded-3xl px-6 py-7 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-sm space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
              At scale
            </p>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50">
              Built for exchanges, fintechs, and enterprises that can&apos;t afford downtime.
            </h2>
          </div>
          <dl className="grid flex-1 gap-4 text-xs sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-slate-900/80 p-4 ring-1 ring-slate-800/80">
                <dt className="text-[11px] text-slate-400">{stat.label}</dt>
                <dd className="mt-1 text-base font-semibold text-slate-50">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
