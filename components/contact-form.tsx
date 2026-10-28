'use client';
import { useState } from 'react';
import Link from 'next/link';
export function ContactForm({ interest }: { interest: string }) {
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState('');
  return <form className="contact-form" onSubmit={e=>{
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nOrganization: ${data.get('organization') || 'Not provided'}\n\n${data.get('message')}`;
    const url = `mailto:info@h2mb.ca?subject=${encodeURIComponent(`H2MB inquiry: ${data.get('interest')}`)}&body=${encodeURIComponent(body)}`;
    setDraft(url); setReady(true); window.location.href=url;
  }}><h2>Tell us what you have in mind.</h2><p>Complete the form to open a draft in your email app. You can review it before sending.</p><div className="form-grid"><label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={100} /></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={200} /></label></div><label>Organization<input name="organization" autoComplete="organization" maxLength={200} /></label><label>I’m interested in<select name="interest" defaultValue={interest}>{['Hydrogen supply','Partnership','Investment','Media','Transportation','Industry','Heat & Power','General inquiry'].map(o=><option key={o}>{o}</option>)}</select></label><label>Your message <span>*</span><textarea name="message" rows={5} maxLength={2500} required placeholder="Your application, location, or what you’d like to explore…" /></label><p className="fine-print">Your details stay in this form until you choose to send your email. Read our <Link href="/privacy">privacy notice</Link>.</p><button className="button" type="submit">Prepare email draft <span aria-hidden="true">↗</span></button>{ready && <div className="form-status" role="status">Your email draft is ready. Send it from your email app to complete your inquiry. If the app didn’t open, <a href={draft}>open the draft again</a> or email <a href="mailto:info@h2mb.ca">info@h2mb.ca</a> directly. This website has not sent your message.</div>}</form>;
}
