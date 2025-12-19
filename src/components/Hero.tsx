import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="section-padding">
      <div className="space-y-16">
        {/* Main hero content */}
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="logo-shimmer-4 flex justify-center">
            <Image
              src="/block-nexus-logo.png"
              alt="Block Nexus"
              width={240}
              height={54}
              className="h-12 md:h-14 w-auto"
              priority
            />
          </div>
          
          <h1 className="text-heading md:text-display-sm font-bold text-slate-50">
            AI & Web3 Consulting with{' '}
            <span className="text-gradient">Enterprise Security</span>{' '}
            Expertise
          </h1>
          
          <p className="max-w-2xl mx-auto text-body text-slate-400">
            AI & Web3 strategy and implementation services for enterprises, startups, and regulated
            environments. Built on deep IT and cybersecurity expertise—helping organizations
            successfully adopt AI & Web3 with security-first principles.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5 text-center">
          <div>
            <p className="text-2xl md:text-4xl font-bold text-slate-50">20+</p>
            <p className="mt-2 text-sm md:text-base text-slate-400">Years Experience</p>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-bold text-slate-50">100+</p>
            <p className="mt-2 text-sm md:text-base text-slate-400">Projects Delivered</p>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-bold text-slate-50">$15M+</p>
            <p className="mt-2 text-sm md:text-base text-slate-400">Value Delivered</p>
          </div>
          <div>
            <p className="text-xl md:text-3xl font-bold text-emerald-400">AI</p>
            <p className="mt-2 text-sm md:text-base text-slate-400">Certified</p>
          </div>
          <div>
            <p className="text-lg md:text-3xl font-bold text-emerald-400">Security</p>
            <p className="mt-2 text-sm md:text-base text-slate-400">Certified</p>
          </div>
        </div>

        {/* Hero buttons under stats */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/contact" className="btn-primary">
            Get Started Today
          </Link>
          <Link href="/product" className="btn-secondary">
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
