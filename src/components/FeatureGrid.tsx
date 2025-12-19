import type { ReactNode } from 'react';
import { IconBox, BriefcaseIcon, ShieldIcon, ChartIcon, FlaskIcon, LockIcon, BookIcon } from './IconBox';

interface Feature {
  title: string;
  body: string;
  icon: ReactNode;
  bullets: string[];
}

const features: Feature[] = [
  {
    title: 'C-Suite & Board Advisory',
    body: 'Strategic guidance for executives and board members navigating AI & Web3 adoption, technology investments, and digital transformation.',
    icon: (
      <IconBox variant="primary">
        <BriefcaseIcon />
      </IconBox>
    ),
    bullets: [
      'AI & Web3 readiness assessments and roadmaps',
      'Technology investment strategy',
      'Risk management and governance',
      'Board presentations and planning',
    ],
  },
  {
    title: 'Fractional CISO Services',
    body: 'Part-time, experienced CISO leadership for organizations needing strategic security guidance without full-time commitment.',
    icon: (
      <IconBox variant="emerald">
        <ShieldIcon />
      </IconBox>
    ),
    bullets: [
      'Security program development',
      'Compliance and risk management',
      'Vendor security assessments',
      'Incident response planning',
    ],
  },
  {
    title: 'AI & Web3 Readiness Assessment',
    body: 'Comprehensive assessments and vendor evaluations to ensure you select the right AI & Web3 solutions.',
    icon: (
      <IconBox variant="primary">
        <ChartIcon />
      </IconBox>
    ),
    bullets: [
      'Maturity assessments',
      'Product evaluation and selection',
      'ROI and business case development',
      'Security and compliance vetting',
    ],
  },
  {
    title: 'POC Strategy & Execution',
    body: 'Structured proof-of-concept development with clear success criteria and actionable outcomes.',
    icon: (
      <IconBox variant="slate">
        <FlaskIcon />
      </IconBox>
    ),
    bullets: [
      'POC scope definition and planning',
      'Success criteria frameworks',
      'Security-first implementation',
      'Results analysis and recommendations',
    ],
  },
  {
    title: 'Security-First Implementation',
    body: 'Integrate security and compliance from day one, ensuring AI & Web3 initiatives meet enterprise standards.',
    icon: (
      <IconBox variant="emerald">
        <LockIcon />
      </IconBox>
    ),
    bullets: [
      'Security architecture design',
      'Data privacy and protection',
      'Regulatory compliance alignment',
      'AI model security assessments',
    ],
  },
  {
    title: 'Change Management & Training',
    body: 'Comprehensive training and organizational change management for successful AI & Web3 adoption.',
    icon: (
      <IconBox variant="primary">
        <BookIcon />
      </IconBox>
    ),
    bullets: [
      'End-user training programs',
      'Change management strategies',
      'Adoption optimization',
      'Ongoing support and enablement',
    ],
  },
];

export function FeatureGrid() {
  return (
    <section className="section-padding border-t border-slate-800/40">
      <div className="space-y-16">
        <div className="max-w-3xl space-y-6 mx-auto text-center">
          <h2 className="text-heading-sm md:text-heading font-bold text-slate-50">
            Strategic Advisory Services
          </h2>
          <p className="text-body text-slate-400">
            Executive-level guidance for board members, C-suite leaders, and security executives
            navigating AI & Web3 adoption and digital transformation.
          </p>
          <p className="text-base text-slate-500">
            Our fractional and advisory services provide strategic leadership when you need it,
            without the commitment of full-time hires.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card-surface-hover p-6 md:p-8 group">
              <div className="transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-lg md:text-2xl font-semibold text-slate-50">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm md:text-base text-slate-400">{feature.body}</p>
              <ul className="mt-6 space-y-3">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm md:text-base text-slate-400">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
