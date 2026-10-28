import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/content';
import { CTA } from '@/components/site';
export function generateStaticParams() { return articles.map(a => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const { slug } = await params; const a = articles.find(a=>a.slug===slug); return {title:a?.title,description:a?.summary}; }
export default async function Article({ params }: { params: Promise<{slug:string}> }) { const { slug } = await params; const a = articles.find(a=>a.slug===slug); if(!a) notFound(); return <><article className="article container"><Link className="back-link" href="/insights">← All insights</Link><span className="eyebrow">{a.category} · {a.reading}</span><h1>{a.title}</h1><p className="lead">{a.summary}</p><div className="article-body">{a.sections.map(s=><section key={s.title}><h2>{s.title}</h2><p>{s.text}</p></section>)}<p className="article-source">Further reading: <a href={a.source} target="_blank" rel="noreferrer">H2MB’s Manitoba hydrogen perspective ↗</a></p></div></article><CTA /></>; }
