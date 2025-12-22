export function Certifications() {
  return (
    <section className="section-padding border-t border-slate-800/40">
      <div className="space-y-16">
        <div className="max-w-3xl space-y-6 mx-auto text-center">
          <h2 className="text-heading-sm md:text-heading font-bold text-slate-50">
            Certified Excellence
          </h2>
          <p className="text-body text-slate-400">
            When selecting a consulting partner, certifications matter. Our team holds industry-recognized
            security and AI certifications that validate our expertise and give you confidence that your
            organization is working with qualified professionals who understand the complexities of securing
            modern technology initiatives.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Security Certified */}
          <div className="card-surface p-6 md:p-10">
            <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-primary-500/20">
              <span className="text-2xl md:text-3xl">🛡️</span>
            </div>
            <p className="mt-6 text-xl md:text-3xl font-bold text-emerald-400">Security Certified</p>
            <p className="mt-2 text-lg md:text-xl font-semibold text-slate-100">
              Trusted Cybersecurity Expertise
            </p>
            <p className="mt-4 text-sm md:text-base text-slate-400">
              When you work with Block Nexus, you&apos;re partnering with certified security professionals
              who have proven their expertise through industry-leading credentials. Our team&apos;s certifications
              demonstrate the depth of knowledge and commitment to security best practices you need for
              protecting your AI & Web3 initiatives.
            </p>
            
            <div className="mt-8 space-y-6">
              {/* (ISC)² Certifications */}
              <div className="pt-6 border-t border-slate-800/60">
                <h4 className="text-sm md:text-base font-semibold text-slate-200 mb-2">(ISC)² Certifications</h4>
                <p className="text-xs md:text-sm text-slate-500 mb-3">
                  Premier certifications for information security professionals demonstrating advanced expertise
                  in cybersecurity architecture, engineering, and management.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-sm md:text-base font-semibold text-slate-100">Certified Information Systems Security Professional</p>
                    <p className="text-xs md:text-sm text-slate-400 mt-0.5">CISSP</p>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">(ISC)²</p>
                  </div>
                </div>
              </div>

              {/* ISACA Certifications */}
              <div className="pt-6 border-t border-slate-800/60">
                <h4 className="text-base font-semibold text-slate-200 mb-2">ISACA Certifications</h4>
                <p className="text-sm text-slate-500 mb-3">
                  Globally recognized credentials for information security management, audit, risk, and governance,
                  validating expertise in enterprise security leadership.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Certified Information Security Manager</p>
                    <p className="text-sm text-slate-400 mt-0.5">CISM</p>
                    <p className="text-xs text-slate-500 mt-1">ISACA</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Certified Information Systems Auditor</p>
                    <p className="text-sm text-slate-400 mt-0.5">CISA</p>
                    <p className="text-xs text-slate-500 mt-1">ISACA</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Certified in Risk and Information Systems Control</p>
                    <p className="text-sm text-slate-400 mt-0.5">CRISC</p>
                    <p className="text-xs text-slate-500 mt-1">ISACA</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Certified in the Governance of Enterprise IT</p>
                    <p className="text-sm text-slate-400 mt-0.5">CGEIT</p>
                    <p className="text-xs text-slate-500 mt-1">ISACA</p>
                  </div>
                </div>
              </div>

              {/* Cloud Security Alliance */}
              <div className="pt-6 border-t border-slate-800/60">
                <h4 className="text-base font-semibold text-slate-200 mb-2">Cloud Security Alliance</h4>
                <p className="text-sm text-slate-500 mb-3">
                  Specialized cloud security certification demonstrating expertise in securing cloud environments
                  and cloud-native applications.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Certificate of Cloud Security Knowledge</p>
                    <p className="text-sm text-slate-400 mt-0.5">CCSK</p>
                    <p className="text-xs text-slate-500 mt-1">Cloud Security Alliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Certified */}
          <div className="card-surface p-6 md:p-10">
            <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-emerald-500/20">
              <span className="text-2xl md:text-3xl">🤖</span>
            </div>
            <p className="mt-6 text-xl md:text-3xl font-bold text-emerald-400">AI Certified</p>
            <p className="mt-2 text-lg md:text-xl font-semibold text-slate-100">
              Proven AI & Web3 Expertise
            </p>
            <p className="mt-4 text-sm md:text-base text-slate-400">
              Our AI certifications validate our team&apos;s advanced knowledge in AI security and audit practices.
              When you engage Block Nexus, you&apos;re working with professionals who have demonstrated mastery
              in securing and auditing AI systems—critical expertise for organizations implementing AI & Web3 solutions
              in regulated or security-sensitive environments.
            </p>
            <div className="mt-8 space-y-6">
              <div className="pt-6 border-t border-slate-800/60">
                <h4 className="text-base font-semibold text-slate-200 mb-2">ISACA AI Certifications</h4>
                <p className="text-sm text-slate-500 mb-3">
                  Advanced certifications in AI security and audit, demonstrating expertise in securing
                  and auditing AI systems and implementations.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Advanced in AI Security Management</p>
                    <p className="text-sm text-slate-400 mt-0.5">AAISM</p>
                    <p className="text-xs text-slate-500 mt-1">ISACA</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-base font-semibold text-slate-100">Advanced in AI Audit</p>
                    <p className="text-sm text-slate-400 mt-0.5">AAIA</p>
                    <p className="text-xs text-slate-500 mt-1">ISACA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-base text-slate-500 text-center max-w-2xl mx-auto">
          These certifications represent our commitment to excellence and the highest standards
          in information security, AI, and Web3 technology.
        </p>
      </div>
    </section>
  );
}
