import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BlockNexus | Unified Blockchain Infrastructure',
  description:
    'BlockNexus provides unified blockchain infrastructure for exchanges, fintechs, and enterprises. Reliable node, data, and monitoring in a single platform.',
  metadataBase: new URL('https://blocknexus.tech'),
  openGraph: {
    title: 'BlockNexus | Unified Blockchain Infrastructure',
    description:
      'Unified node, data, and observability infrastructure for exchanges, fintechs, and enterprises.',
    url: 'https://blocknexus.tech',
    siteName: 'BlockNexus',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="main-gradient min-h-screen">
        {children}
      </body>
    </html>
  );
}
