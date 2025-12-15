export function Testimonial() {
  return (
    <section className="section-padding">
      <div className="card-surface mx-auto max-w-3xl rounded-3xl px-6 py-8 md:px-10 md:py-10">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">
          Customer spotlight
        </p>
        <p className="mt-4 text-sm text-slate-100 md:text-base">
          “BlockNexus let our team deprecate three different node providers and monitoring
          systems. We cut infra incidents by over 80% while shipping new onchain products
          faster than ever.”
        </p>
        <div className="mt-5 text-xs text-slate-300">
          <p className="font-semibold text-slate-100">Head of Infrastructure</p>
          <p className="text-slate-400">Global digital asset exchange</p>
        </div>
      </div>
    </section>
  );
}
