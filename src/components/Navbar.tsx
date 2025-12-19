'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  { href: '/#services', label: 'Services' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();

  useEffect(() => {
    // Handle hash scrolling when navigating from other pages
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const rawHash = window.location.hash.replace('#', '');
      // Sanitize hash to prevent XSS - only allow alphanumeric and hyphens
      const id = rawHash.replace(/[^a-zA-Z0-9-]/g, '');
      
      // Only proceed if sanitization didn't change the hash (valid format)
      if (id && id === rawHash) {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
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
      if (sanitizedId && sanitizedId === id) {
        const element = document.getElementById(sanitizedId);
        if (element) {
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
            width={180}
            height={40}
            className="h-10 w-auto"
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
            className="btn-primary text-sm px-6 py-3"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
