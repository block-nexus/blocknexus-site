'use client';

import type { ReactNode } from 'react';
import { IconBox, BrainIcon, ChartIcon, RocketIcon, ShieldIcon } from './IconBox';
import Image from 'next/image';
import { useState } from 'react';

interface PortfolioItem {
  title: string;
  description: string;
  category: string;
  icon: ReactNode;
  website: string;
  screenshot?: string;
  fallbackScreenshot?: string; // Local fallback image path
  technologies?: string[];
  results?: string[];
}

// Helper function to generate screenshot URL using our Next.js API route
// This proxies the screenshot request for better security and reliability
function getScreenshotUrl(website: string): string {
  const encodedUrl = encodeURIComponent(website);
  // Use our internal API route that proxies screenshot requests
  return `/api/screenshot?url=${encodedUrl}`;
}

const portfolioItems: PortfolioItem[] = [
  {
    title: 'Konkani.ai',
    description: 'World\'s first AI-powered Konkani language learning application, revolutionizing how people learn and preserve the Konkani language through intelligent, personalized instruction. The platform combines advanced natural language processing with culturally-rich content to create an immersive learning experience.',
    category: 'AI & Education',
    website: 'https://konkani.ai',
    screenshot: getScreenshotUrl('https://konkani.ai'),
    fallbackScreenshot: '/portfolio/konkani-ai.png',
    icon: (
      <IconBox variant="primary">
        <BrainIcon />
      </IconBox>
    ),
    technologies: ['AI/ML', 'Natural Language Processing', 'iOS Development', 'Mobile App'],
    results: [
      'First-of-its-kind AI language learning platform',
      'Available on iOS App Store',
      'Preserving endangered language through technology',
      'Personalized learning experience',
    ],
  },
  {
    title: 'Dartmaster.ai',
    description: 'Next-generation darts platform featuring intelligent auto-scoring, real-time game analysis, and personalized performance feedback. Transforms traditional darts into a data-driven sport with AI-powered insights that help players improve their game through advanced analytics and coaching recommendations.',
    category: 'AI & Sports Tech',
    website: 'https://dartmaster.ai',
    screenshot: getScreenshotUrl('https://dartmaster.ai'),
    fallbackScreenshot: '/portfolio/dartmaster-ai.png',
    icon: (
      <IconBox variant="emerald">
        <ChartIcon />
      </IconBox>
    ),
    technologies: ['Computer Vision', 'AI Analytics', 'Real-time Processing', 'Performance Tracking'],
    results: [
      'Intelligent auto-scoring system',
      'Real-time game analysis',
      'Personalized performance insights',
      'Data-driven coaching recommendations',
    ],
  },
  {
    title: 'GWITH.ai',
    description: 'The "do anything with AI" platform—a comprehensive ecosystem of AI-powered tools designed to enhance daily life. From learning and cooking to writing, coding, investing, and shopping, GWITH.ai provides intelligent solutions that adapt to user needs across multiple domains.',
    category: 'AI Platform',
    website: 'https://gwith.ai',
    screenshot: getScreenshotUrl('https://gwith.ai'),
    fallbackScreenshot: '/portfolio/gwith-ai.png',
    icon: (
      <IconBox variant="primary">
        <RocketIcon />
      </IconBox>
    ),
    technologies: ['Multi-domain AI', 'Platform Architecture', 'API Integration', 'User Experience'],
    results: [
      'Multi-purpose AI platform',
      'Ecosystem of intelligent tools',
      'Cross-domain AI solutions',
      'Enhanced daily productivity',
    ],
  },
  {
    title: 'VitalPet',
    description: 'Comprehensive pet care reminder and health tracking application with AI-based health insights. Helps pet owners proactively manage their pets\' well-being through intelligent reminders, health trend analysis, and early warning systems that identify potential health issues before they become serious.',
    category: 'AI & Healthcare',
    website: 'https://vitapet.ai',
    screenshot: getScreenshotUrl('https://vitapet.ai'),
    fallbackScreenshot: '/portfolio/vitalpet-ai.png',
    icon: (
      <IconBox variant="emerald">
        <ShieldIcon />
      </IconBox>
    ),
    technologies: ['AI Health Analytics', 'Mobile App', 'Health Tracking', 'Predictive Analytics'],
    results: [
      'AI-powered health insights',
      'Proactive pet care management',
      'Early health issue detection',
      'Comprehensive tracking system',
    ],
  },
];

// Client component for image with error handling and fallback
function PortfolioImage({ src, alt, fallback }: { src: string; alt: string; fallback?: string }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      // Try fallback image
      setCurrentSrc(fallback);
      setImageError(false);
      setIsLoading(true);
    } else {
      // Both failed
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div className="mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 overflow-hidden rounded-t-3xl">
        <div className="relative w-full h-48 bg-slate-800/50 flex items-center justify-center">
          <div className="text-slate-500 text-sm">Screenshot unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 overflow-hidden rounded-t-3xl">
      <div className="relative w-full h-48 bg-slate-800/50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={currentSrc}
          alt={alt}
          fill
          className={`object-cover opacity-80 group-hover:opacity-100 transition-opacity ${
            isLoading ? 'opacity-0' : 'opacity-80'
          }`}
          onError={handleError}
          onLoad={() => setIsLoading(false)}
          unoptimized={currentSrc.startsWith('/api/') || currentSrc.startsWith('http')}
        />
      </div>
    </div>
  );
}

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
                <div className="absolute top-6 right-6 z-10">
                  <span className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400 border border-primary-500/20">
                    {item.category}
                  </span>
                </div>

                {/* Screenshot/Image */}
                {item.screenshot && (
                  <PortfolioImage
                    src={item.screenshot}
                    alt={`${item.title} screenshot`}
                    fallback={item.fallbackScreenshot}
                  />
                )}

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

                {/* Website Link */}
                <div className="mb-6">
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <span>Visit Website</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

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
                      Key Features
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
