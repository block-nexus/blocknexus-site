export function CalloutBanner() {
  return (
    <section className="border-y border-slate-800/60 bg-slate-950/70 py-4 text-[11px] text-slate-300">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center sm:text-left">
          Designed for security-conscious teams. SOC 2-ready processes and enterprise support available.
        </p>
        <p className="text-center text-slate-400 sm:text-right">
          Speak with us about your compliance requirements.
        </p>
      </div>
    </section>
  );
}
