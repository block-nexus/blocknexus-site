'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/#services', label: 'Services', id: 'services' },
  { href: '/#portfolio', label: 'Portfolio', id: 'portfolio' },
  { href: '/#contact', label: 'Contact', id: 'contact' },
];

// Whitelist of allowed hash IDs for navigation (prevents scroll hijacking)
const ALLOWED_HASH_IDS = ['services', 'portfolio', 'contact'] as const;

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll-based active section detection
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Find which section is currently in view
      const sections = ALLOWED_HASH_IDS.map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          id,
          top: rect.top + scrollY,
          bottom: rect.bottom + scrollY,
        };
      }).filter(Boolean) as Array<{ id: string; top: number; bottom: number }>;

      // Determine active section based on scroll position
      const currentScroll = scrollY + window.innerHeight / 3; // Use top third of viewport as reference
      
      for (const section of sections) {
        if (currentScroll >= section.top && currentScroll < section.bottom) {
          setActiveSection(section.id);
          return;
        }
      }

      // If scrolled to top, clear active section
      if (scrollY < 100) {
        setActiveSection('');
      }
    };

    // Initial check
    handleScroll();

    // Throttle scroll events for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    // Handle hash scrolling when navigating from other pages
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const rawHash = window.location.hash.replace('#', '');
      // Sanitize hash to prevent XSS - only allow alphanumeric and hyphens
      const id = rawHash.replace(/[^a-zA-Z0-9-]/g, '');
      
      // Only proceed if sanitization didn't change the hash (valid format)
      // AND the ID is in the whitelist (prevents scroll hijacking)
      if (id && id === rawHash && ALLOWED_HASH_IDS.includes(id as typeof ALLOWED_HASH_IDS[number])) {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element && element.tagName !== 'SCRIPT') {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
          }
        }, 100);
      }
    }
  }, [pathname]);

  const handleInPageClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      // Sanitize ID to prevent XSS
      const sanitizedId = id.replace(/[^a-zA-Z0-9-]/g, '');
      // Only allow whitelisted IDs (prevents scroll hijacking)
      if (sanitizedId && sanitizedId === id && ALLOWED_HASH_IDS.includes(sanitizedId as typeof ALLOWED_HASH_IDS[number])) {
        const element = document.getElementById(sanitizedId);
        if (element && element.tagName !== 'SCRIPT') {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(sanitizedId);
        }
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-slate-800/60 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'border-slate-800/40 bg-background/80 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="logo-shimmer-4 group transition-transform group-hover:scale-105">
          <Image
            src="/block-nexus-logo.png"
            alt="Block Nexus"
            width={120}
            height={27}
            className="h-6 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === '/' && activeSection === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleInPageClick(item.id)}
                  className="relative group"
                >
                  <span
                    className={`relative z-10 text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-emerald-400 transition-all duration-300 ${
                      isActive
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                    style={{
                      transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                    }}
                  />
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/#contact"
            onClick={handleInPageClick('contact')}
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/20 transition-all duration-300 hover:bg-primary-400 hover:shadow-primary-400/30 hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
