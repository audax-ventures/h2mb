import type { MetadataRoute } from 'next';
import { articles } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/about','/project','/applications','/insights','/contact','/privacy',...articles.map(a=>`/insights/${a.slug}`)].map(path=>({url:`https://www.h2mb.ca${path}`})); }
