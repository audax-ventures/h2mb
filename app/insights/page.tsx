import type { Metadata } from 'next';
import { CTA, PageIntro } from '@/components/site';
import { ResourceLibrary } from '@/components/resource-library';
import { articles } from '@/lib/content';
export const metadata: Metadata = { title: 'Insights & Media', description: 'Explore green hydrogen fundamentals, Manitoba’s opportunity, and historical media coverage of H2MB.' };

const resources = [
  ...articles.map(article => ({ title: article.title, summary: article.summary, href: `/insights/${article.slug}`, category: article.category, label: article.reading })),
  { title: 'Hydrogen is “da bomb” for green energy in Manitoba', summary: 'Manitoba Inc. explores the emerging hydrogen sector and H2MB’s early vision for local production.', href: 'https://manitoba-inc.ca/hydrogen-is-da-bomb-for-green-energy-in-manitoba/', category: 'Media coverage', label: 'Manitoba Inc. · Historical coverage', external: true },
  { title: 'Hydrogen race underway in province', summary: 'A look at Manitoba’s early hydrogen production plans and the effort to build a local supply chain.', href: 'https://www.winnipegfreepress.com/business/2023/02/09/hydrogen-race-underway-in-province', category: 'Media coverage', label: 'Winnipeg Free Press · February 9, 2023 · May require subscription', external: true },
];

export default function Insights() {
  return <><PageIntro label="Insights & media" title="Understanding what comes next." text="Explore the fundamentals, the Manitoba opportunity, and the conversations shaping a hydrogen economy." /><ResourceLibrary resources={resources} /><CTA title="Have a question about H2MB? Let’s connect." /></>;
}
