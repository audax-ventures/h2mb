'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { navigation } from '@/lib/navigation';

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  return (
    <header className="header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <div className="nav-wrap">
        <Link href="/" className="brand" aria-label="H2MB home" onClick={() => setOpen(false)}>
          <img src="/images/h2mb-logo.avif" alt="H2MB — Fuelling our future" width="520" height="155" />
        </Link>
        <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(value => !value)}>
          {open ? 'Close −' : 'Menu +'}
        </button>
        <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link className="button button-small" href="/contact" aria-current={path === '/contact' ? 'page' : undefined} onClick={() => setOpen(false)}>Let’s talk <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
