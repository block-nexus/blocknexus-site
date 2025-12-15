import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="section-padding">
      <div className="card-surface mx-auto max-w-3xl rounded-3xl px-6 py-8 text-center md:px-10 md:py-10">
        <h2 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
          Ready to consolidate your blockchain infrastructure?
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          Share your use case and we&apos;ll walk through how BlockNexus can plug into your
          existing stack in under an hour.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-primary-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400"
          >
            Talk to our team
          </Link>
          <Link
            href="/product"
            className="rounded-full border border-slate-700 px-5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            View product overview
          </Link>
        </div>
      </div>
    </section>
  );
}
