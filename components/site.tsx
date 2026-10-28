'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const links = [['About H2MB', '/about'], ['Our Project', '/project'], ['Applications', '/applications'], ['Insights', '/insights']] as const;
export function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <span aria-hidden="true">{diagonal ? '↗' : '↗'}</span>; }
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return <header className="header"><div className="nav-wrap"><Link href="/" className="brand" aria-label="H2MB home" onClick={() => setOpen(false)}><img src="/images/h2mb-logo.avif" alt="H2MB — Fuelling our future" width="520" height="155" /></Link><button className="menu-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button><nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">{links.map(([label, href]) => <Link key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}<Link className="button button-small" href="/contact" onClick={() => setOpen(false)}>Let’s talk <Arrow /></Link></nav></div></header>;
}
export function Footer() { return <footer className="footer"><div className="container footer-top"><div><Link href="/" className="brand"><img src="/images/h2mb-logo.avif" alt="H2MB — Fuelling our future" width="520" height="155" /></Link><p>Green hydrogen.<br />Prairie potential.</p></div><div><span className="eyebrow">Explore</span>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div><div><span className="eyebrow">Start a conversation</span><a href="mailto:info@h2mb.ca">info@h2mb.ca ↗</a><a href="tel:+12044798233">+1 204 479 8233</a><p>Winnipeg, Manitoba<br />Canada</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} H2MB Inc.</span><Link href="/privacy">Privacy</Link><span>Built with purpose by <a href="https://www.audaxventures.ca" target="_blank" rel="noreferrer">Audax Ventures ↗</a></span></div></footer>; }
export function CTA({ title = 'The next chapter starts with a conversation.' }: { title?: string }) { return <section className="cta"><div className="container cta-inner"><div><span className="eyebrow">Let’s build what’s next</span><h2>{title}</h2></div><Link className="button" href="/contact">Connect with H2MB <Arrow /></Link></div></section>; }
export function PageIntro({ label, title, text }: { label: string; title: string; text: string }) { return <section className="page-intro"><div className="container"><span className="eyebrow"><span className="tiny-dot" />{label}</span><h1>{title}</h1><p>{text}</p></div></section>; }
