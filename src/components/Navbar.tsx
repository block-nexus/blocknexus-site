'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  { href: '/#services', label: 'Services' },
  { href: '/#contact', label: 'Contact' },
];

// Whitelist of allowed hash IDs for navigation (prevents scroll hijacking)
const ALLOWED_HASH_IDS = ['services', 'contact'] as const;

export function Navbar() {
  const pathname = usePathname();

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
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/40 bg-background/80 backdrop-blur-xl">
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
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={
                  item.href.startsWith('/#')
                    ? handleInPageClick(item.href.replace('/#', ''))
                    : undefined
                }
                className="text-base font-medium text-slate-300 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/#contact"
            onClick={handleInPageClick('contact')}
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/20 transition-all duration-300 hover:bg-primary-400 hover:shadow-primary-400/30"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
