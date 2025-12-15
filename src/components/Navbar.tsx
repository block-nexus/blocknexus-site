import Link from 'next/link';

const navItems = [
  { href: '/product', label: 'Product' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/company', label: 'Company' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500/20 ring-1 ring-primary-400/60">
            <span className="text-lg font-semibold text-primary-400">BN</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-100 sm:text-base">
            BlockNexus
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:text-white"
          >
            Talk to sales
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-primary-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </header>
  );
}
