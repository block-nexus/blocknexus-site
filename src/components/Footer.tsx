import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-500/20 ring-1 ring-primary-400/60">
                <span className="text-sm font-semibold text-primary-400">BN</span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-100">
                BlockNexus
              </span>
            </div>
            <p className="max-w-xs text-xs text-slate-400">
              Unified blockchain infrastructure powering exchanges, fintechs, and
              enterprises.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Product
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/product" className="hover:text-slate-100">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-slate-100">
                  Solutions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Company
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/company" className="hover:text-slate-100">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-100">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Legal
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <span className="cursor-default text-slate-500">
                  © {new Date().getFullYear()} BlockNexus.
                </span>
              </li>
              <li>
                <span className="cursor-default text-slate-500">
                  All rights reserved.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
