import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="section-padding">
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-emerald-500/10 rounded-4xl" />
        
        <div className="card-surface relative mx-auto max-w-4xl px-6 py-12 text-center md:px-8 md:py-16 lg:px-16 lg:py-20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
          
          <h2 className="text-heading-sm md:text-heading font-bold text-slate-50">
            Let&apos;s Transform Your Business
          </h2>
          <p className="mt-6 text-base md:text-body-lg text-slate-400 max-w-2xl mx-auto">
            Ready to take your organization to the next level with AI & Web3?
            Get in touch with our experts today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Get Started Today
            </Link>
            <Link href="/product" className="btn-secondary">
              View Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
