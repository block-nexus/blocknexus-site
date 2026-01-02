import type { ReactNode } from 'react';
// Icons will be imported when you add portfolio items
// import { IconBox, BrainIcon, ShieldIcon, etc. } from './IconBox';

interface PortfolioItem {
  title: string;
  description: string;
  category: string;
  icon: ReactNode;
  technologies?: string[];
  results?: string[];
}

// TODO: Add your portfolio items here
const portfolioItems: PortfolioItem[] = [
  // Example structure:
  // {
  //   title: 'Project Title',
  //   description: 'Project description...',
  //   category: 'Category Name',
  //   icon: (
  //     <IconBox variant="primary">
  //       <BrainIcon />
  //     </IconBox>
  //   ),
  //   technologies: ['Tech 1', 'Tech 2'],
  //   results: ['Result 1', 'Result 2'],
  // },
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

        {portfolioItems.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
              <svg
                className="w-8 h-8 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-slate-400 text-base">
              Portfolio items coming soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
