import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ProcessJourney } from '@/components/process/journey';

const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Our Process — How Green Hydrogen Is Made',
  description: 'Nine stages from water intake and renewable power through PEM electrolysis, gas conditioning, storage, distribution and end use, shown as technical schematics with typical industry figures.',
  alternates: { canonical: '/process' },
};

export default function ProcessPage() {
  return <div className={`${sans.variable} ${mono.variable}`}><ProcessJourney /></div>;
}
