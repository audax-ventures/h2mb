import type { Metadata } from 'next';
import { ProcessJourney } from '@/components/process/journey';

export const metadata: Metadata = {
  title: 'Our Process — From Water to Green Hydrogen',
  description: 'Follow an illustrated scroll journey from water purification and renewable electricity through electrolysis, hydrogen storage, delivery, and real-world applications.',
  alternates: { canonical: '/process' },
};

export default function ProcessPage() {
  return <ProcessJourney />;
}
