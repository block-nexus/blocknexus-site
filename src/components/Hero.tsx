import Link from 'next/link';
import { strings } from '../content/strings';

export function Hero() {
  return (
    <section className="section-padding">
      <div className="grid gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Unified blockchain infrastructure</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
            Run blockchain infrastructure
            <span className="text-primary-400"> without the operational drag.</span>
          </h1>
          <p className="max-w-xl text-balance text-sm text-slate-300 md:text-base">
            {strings.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-primary-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400"
            >
              {strings.primaryCta}
            </Link>
            <Link
              href="/product"
              className="rounded-full border border-slate-700 px-5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              {strings.secondaryCta}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-3 text-[11px] text-slate-400">
            <span>99.99% uptime</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Multi-chain coverage</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Enterprise-grade support</span>
          </div>
        </div>
        <div className="relative">
          <div className="card-surface relative overflow-hidden rounded-2xl p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.25),_transparent_55%)] opacity-70" />
            <div className="relative space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Live network health
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-slate-900/60 p-3 ring-1 ring-slate-800/80">
                  <p className="text-[11px] text-slate-400">Avg. block time</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">0.9s</p>
                  <p className="mt-1 text-[10px] text-emerald-400">Stable</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-3 ring-1 ring-slate-800/80">
                  <p className="text-[11px] text-slate-400">Success rate</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">99.99%</p>
                  <p className="mt-1 text-[10px] text-emerald-400">SLA-backed</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-3 ring-1 ring-slate-800/80">
                  <p className="text-[11px] text-slate-400">Chains</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">25+</p>
                  <p className="mt-1 text-[10px] text-slate-400">EVM & more</p>
                </div>
              </div>
              <div className="grid gap-3 text-xs md:grid-cols-2">
                <div className="rounded-xl bg-slate-900/60 p-3 ring-1 ring-slate-800/80">
                  <p className="text-[11px] text-slate-400">Real-time alerts</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Detect anomalies across chains and notify your on-call instantly.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-3 ring-1 ring-slate-800/80">
                  <p className="text-[11px] text-slate-400">Single control plane</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Manage networks, keys, and throughput from one dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
