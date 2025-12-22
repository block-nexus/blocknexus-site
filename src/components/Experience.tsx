import { IconBox, ShieldIcon, NetworkIcon } from './IconBox';

export function Experience() {
  return (
    <section className="section-padding border-t border-slate-800/40">
      <div className="space-y-16">
        <div className="max-w-3xl space-y-6 mx-auto text-center">
          <h2 className="text-heading-sm md:text-heading font-bold text-slate-50">
            Our Professional Experience
          </h2>
          <p className="text-body text-slate-400">
            Our team brings 20+ years of combined IT and cybersecurity experience delivering
            measurable value across industries. We serve organizations of all sizes—from startups
            to large enterprises and government agencies.
          </p>
          <p className="text-body-sm text-slate-500">
            Our deep foundation in enterprise IT and cybersecurity consulting provides the critical
            expertise needed to successfully implement AI & Web3 solutions with proper security,
            governance, and enterprise architecture—ensuring your organization receives guidance
            backed by real-world experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card-surface p-6 md:p-8">
            <IconBox variant="primary">
              <ShieldIcon />
            </IconBox>
            <h3 className="mt-6 text-lg md:text-2xl font-semibold text-slate-50">
              20+ Years of IT & Cybersecurity Experience
            </h3>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              Over 20 years of in-house IT and cybersecurity experience across global enterprises, manufacturing, retail, and regulated environments. This proven foundation uniquely positions us to guide your AI & Web3 initiatives with security and enterprise-grade best practices.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                100+ successful IT and security projects completed
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Millions in value delivered to clients
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Proven track record with Fortune 500 companies
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Deep expertise in complex enterprise transformations
              </li>
            </ul>
          </div>

          <div className="card-surface p-6 md:p-8">
            <IconBox variant="emerald">
              <ShieldIcon />
            </IconBox>
            <h3 className="mt-6 text-lg md:text-2xl font-semibold text-slate-50">
              Certified Security & AI Leadership
            </h3>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              Security-certified professionals ensuring the highest standards of security and
              compliance in every engagement.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Information security expertise
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Security management leadership
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Regulatory compliance specialists
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Security-first approach always
              </li>
            </ul>
          </div>

          <div className="card-surface p-6 md:p-8">
            <IconBox variant="slate">
              <NetworkIcon />
            </IconBox>
            <h3 className="mt-6 text-lg md:text-2xl font-semibold text-slate-50">
              Cross-Industry Expertise
            </h3>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              Deep experience across global enterprises, financial services, retail, regulated environments, and government enables us to bring best practices from diverse industries.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Global enterprise transformations
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Manufacturing & supply chain optimization
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Retail & customer experience
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                Regulated environment compliance
              </li>
            </ul>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="space-y-8">
          <h3 className="text-lg md:text-2xl font-semibold text-slate-50 text-center">Who We Serve</h3>
          <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-4">
            <div className="card-surface-hover p-4 md:p-8 text-center">
              <div className="text-2xl md:text-3xl mb-4">🚀</div>
              <p className="text-base md:text-xl font-semibold text-slate-100">Startups</p>
              <p className="mt-2 text-xs md:text-base text-slate-400">Scalable solutions for growing companies</p>
            </div>
            <div className="card-surface-hover p-4 md:p-8 text-center">
              <div className="text-2xl md:text-3xl mb-4">📈</div>
              <p className="text-base md:text-xl font-semibold text-slate-100">Mid-Market</p>
              <p className="mt-2 text-xs md:text-base text-slate-400">Strategic guidance for expansion</p>
            </div>
            <div className="card-surface-hover p-4 md:p-8 text-center">
              <div className="text-2xl md:text-3xl mb-4">🏢</div>
              <p className="text-base md:text-xl font-semibold text-slate-100">Enterprise</p>
              <p className="mt-2 text-xs md:text-base text-slate-400">Enterprise-grade solutions</p>
            </div>
            <div className="card-surface-hover p-4 md:p-8 text-center">
              <div className="text-2xl md:text-3xl mb-4">🏛️</div>
              <p className="text-base md:text-xl font-semibold text-slate-100">Government Agencies</p>
              <p className="mt-2 text-xs md:text-base text-slate-400">Compliant solutions for public sector organizations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
