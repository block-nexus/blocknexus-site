import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Block Nexus | AI & Web3 Consulting Services',
  description:
    'Block Nexus LLC provides expert AI & Web3 consulting services. Security assessments, learning, strategy, and implementation.',
  metadataBase: new URL('https://blocknexus.tech'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Block Nexus | AI & Web3 Consulting Services',
    description:
      'Technology services company specializing in AI & Web3. Security-first consulting and implementation.',
    url: 'https://blocknexus.tech',
    siteName: 'Block Nexus',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark">
      <body className="main-gradient min-h-screen font-sans">
        <ErrorBoundary>
          <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
