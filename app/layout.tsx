import type { Metadata } from 'next';
import { Header, Footer } from '@/components/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.h2mb.ca'),
  title: { default: 'H2MB — Green hydrogen. Prairie potential.', template: '%s | H2MB' },
  description: 'Developing Manitoba’s green hydrogen economy. H2MB is working toward local production and new opportunities for transportation, industry, heat and power.',
  openGraph: { type: 'website', siteName: 'H2MB', locale: 'en_CA' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-CA"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>;
}
