import type { ReactNode } from 'react';
import { IconBox, RocketIcon, ShieldIcon, BrainIcon, CloudIcon, ChartIcon } from './IconBox';

interface PortfolioItem {
  title: string;
  description: string;
  category: string;
  icon: ReactNode;
  technologies?: string[];
  results?: string[];
}

const portfolioItems: PortfolioItem[] = [
  {
    title: 'Enterprise AI Strategy & Implementation',
    description: 'Led comprehensive AI readiness assessment and implementation roadmap for Fortune 500 manufacturing company, resulting in $5M+ annual cost savings through process automation.',
    category: 'AI Strategy',
    icon: (
      <IconBox variant="primary">
        <BrainIcon />
      </IconBox>
    ),
    technologies: ['AI/ML', 'Process Automation', 'Enterprise Architecture'],
    results: [
      '40% reduction in operational costs',
      '5M+ annual savings',
      '12-month ROI achieved',
    ],
  },
  {
    title: 'Web3 Security Architecture',
    description: 'Designed and implemented secure Web3 infrastructure for financial services firm, ensuring regulatory compliance and enterprise-grade security for blockchain operations.',
    category: 'Web3 & Security',
    icon: (
      <IconBox variant="emerald">
        <ShieldIcon />
      </IconBox>
    ),
    technologies: ['Blockchain', 'Smart Contracts', 'Security Architecture'],
    results: [
      'Zero security incidents',
      'SOC 2 Type II compliance',
      '99.9% uptime achieved',
    ],
  },
  {
    title: 'Cloud Migration & Optimization',
    description: 'Executed large-scale cloud migration for global retail organization, modernizing infrastructure and reducing IT costs by 35% while improving scalability.',
    category: 'Cloud Solutions',
    icon: (
      <IconBox variant="primary">
        <CloudIcon />
      </IconBox>
    ),
    technologies: ['AWS', 'Kubernetes', 'DevOps'],
    results: [
      '35% cost reduction',
      '50% faster deployment cycles',
      'Multi-region redundancy',
    ],
  },
  {
    title: 'Digital Transformation Initiative',
    description: 'Led digital transformation program for regulated healthcare organization, implementing AI-powered solutions while maintaining HIPAA compliance and data privacy standards.',
    category: 'Digital Transformation',
    icon: (
      <IconBox variant="emerald">
        <RocketIcon />
      </IconBox>
    ),
    technologies: ['AI/ML', 'HIPAA Compliance', 'Data Privacy'],
    results: [
      'HIPAA compliant implementation',
      '60% improvement in patient outcomes',
      'Streamlined workflows',
    ],
  },
  {
    title: 'Cybersecurity Program Development',
    description: 'Built comprehensive cybersecurity program from ground up for mid-market technology company, establishing security governance, incident response, and compliance frameworks.',
    category: 'Cybersecurity',
    icon: (
      <IconBox variant="slate">
        <ShieldIcon />
      </IconBox>
    ),
    technologies: ['Security Governance', 'Incident Response', 'Compliance'],
    results: [
      'ISO 27001 certification',
      'Zero breaches post-implementation',
      '24/7 security operations',
    ],
  },
  {
    title: 'AI-Powered Analytics Platform',
    description: 'Developed enterprise AI analytics platform enabling real-time decision making and predictive insights, processing millions of data points daily.',
    category: 'AI & Analytics',
    icon: (
      <IconBox variant="primary">
        <ChartIcon />
      </IconBox>
    ),
    technologies: ['Machine Learning', 'Big Data', 'Real-time Processing'],
    results: [
      'Real-time analytics capability',
      '90% faster decision making',
      'Scalable to millions of records',
    ],
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="section-padding border-t border-slate-800/40">
      <div className="space-y-20">
        <div className="max-w-3xl space-y-6 mx-auto text-center">
          <h2 className="text-heading-sm md:text-heading font-bold text-slate-50">
            Our Portfolio
          </h2>
          <p className="text-body text-slate-400">
            Real-world results from our AI, Web3, and cybersecurity consulting engagements.
            Each project demonstrates our commitment to security-first implementation and measurable business outcomes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div
              key={item.title}
              className="card-surface-hover p-6 md:p-8 group relative overflow-hidden"
            >
              {/* Category badge */}
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400 border border-primary-500/20">
                  {item.category}
                </span>
              </div>

              {/* Icon */}
              <div className="transition-transform group-hover:scale-110 mb-6">
                {item.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg md:text-xl font-semibold text-slate-50 mb-3 pr-20">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-slate-400 mb-6">
                {item.description}
              </p>

              {/* Technologies */}
              {item.technologies && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {item.results && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Key Results
                  </p>
                  <ul className="space-y-2">
                    {item.results.map((result) => (
                      <li key={result} className="flex items-start gap-2 text-sm text-slate-400">
                        <svg
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

