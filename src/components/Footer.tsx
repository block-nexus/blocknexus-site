import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/40 bg-slate-950/80">
      <div className="mx-auto max-w-content px-6 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr,1fr,1fr,1fr]">
          <div className="space-y-4">
            <Link href="/" className="logo-shimmer-4 inline-block">
              <Image
                src="/block-nexus-logo.png"
                alt="Block Nexus"
                width={90}
                height={20}
                className="h-5 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-400">
              Block Nexus delivers expert IT, AI, and Web3 consulting services, helping businesses
              and government agencies navigate the digital landscape with confidence.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Services
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li className="hover:text-slate-200 transition-colors cursor-default">AI & Web3 Strategy</li>
              <li className="hover:text-slate-200 transition-colors cursor-default">Cybersecurity</li>
              <li className="hover:text-slate-200 transition-colors cursor-default">Digital Transformation</li>
              <li className="hover:text-slate-200 transition-colors cursor-default">Cloud Solutions</li>
              <li className="hover:text-slate-200 transition-colors cursor-default">Compliance & Governance</li>
              <li className="hover:text-slate-200 transition-colors cursor-default">IT Infrastructure</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/product" className="hover:text-slate-200 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-200 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-slate-300">contact@blocknexus.tech</li>
              <li className="text-slate-500">New York City</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-800/60 pt-6">
          <p className="text-sm text-slate-600 text-center">
            © {new Date().getFullYear()} Block Nexus LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
