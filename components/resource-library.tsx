'use client';

import Link from 'next/link';
import { useState } from 'react';

type Resource = { title: string; summary: string; href: string; category: string; label: string; external?: boolean };
export function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [category, setCategory] = useState('All resources');
  const [query, setQuery] = useState('');
  const categories = ['All resources', ...new Set(resources.map(item => item.category))];
  const filtered = resources.filter(item => (category === 'All resources' || item.category === category) && `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="container section resource-section" aria-label="Resource library">
    <div className="resource-tools"><div className="resource-filters" role="group" aria-label="Filter resources">{categories.map(item=><button key={item} type="button" aria-pressed={category === item} onClick={()=>setCategory(item)}>{item}</button>)}</div><label className="resource-search">Search resources<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search hydrogen, Manitoba…" /></label></div>
    <p className="resource-count" role="status">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}</p>
    {filtered.length ? <div className="resource-grid">{filtered.map(item=><article className="resource-card" key={item.href}><span className="eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.summary}</p><span className="resource-label">{item.label}</span>{item.external ? <a href={item.href} target="_blank" rel="noreferrer" className="text-link" aria-label={`Read ${item.title} (opens in a new tab)`}>Read coverage <span aria-hidden="true">↗</span></a> : <Link href={item.href} className="text-link" aria-label={`Read ${item.title}`}>Read the story <span aria-hidden="true">↗</span></Link>}</article>)}</div> : <div className="resource-empty"><h2>No matching resources.</h2><p>Try a different search or view the full library.</p><button type="button" className="button" onClick={()=>{setCategory('All resources');setQuery('');}}>Clear filters</button></div>}
    <p className="fine-print resource-disclaimer">Media coverage is historical. Project plans and timelines discussed in those articles may have changed.</p>
  </section>;
}
