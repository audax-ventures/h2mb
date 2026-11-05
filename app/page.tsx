import Link from 'next/link';
import Image from 'next/image';
import { Arrow } from '@/components/site';
import './home.css';

const principles = [
  { title: 'Produce locally', text: 'Build on Manitoba’s renewable energy resources.' },
  { title: 'Connect industries', text: 'Bring hydrogen supply and potential users together.' },
  { title: 'Enable change', text: 'Help develop a practical market for green hydrogen.' },
];

const advantages = [
  { title: 'Renewable foundations', text: 'Manitoba’s hydroelectric resources are central to our vision for green hydrogen.' },
  { title: 'Connected geography', text: 'Road and rail links connect the Prairies to markets across North America.' },
  { title: 'Industrial opportunity', text: 'Transportation, agriculture, and manufacturing create opportunities for hydrogen adoption.' },
];

export default function Home() {
  return <div className="home-page">
    <section className="home-hero home-container" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <span className="home-eyebrow"><span className="home-dot" />Rooted in Manitoba. Looking forward.</span>
        <h1 id="home-title">Green hydrogen.<br /><em>Prairie potential.</em></h1>
        <p>We’re developing Manitoba’s hydrogen economy. Connecting local production with the industries ready for what’s next.</p>
        <div className="home-actions">
          <Link className="home-button" href="/project">Explore our project <Arrow /></Link>
          <Link className="home-link" href="/process">Follow the process <Arrow /></Link>
        </div>
      </div>
      <figure className="home-hero-figure">
        <div className="home-photo-shape">
          <Image src="/images/hydrogen-applications.png" alt="Wooden blocks showing hydrogen storage, water, refuelling, energy and transport, with a hand placing an H₂ block." width={1532} height={1026} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1440px) 48vw, 650px" preload />
        </div>
        <figcaption><span className="home-dot" />Small molecule. Big possibility.</figcaption>
      </figure>
      <a className="home-scroll" href="#opportunity"><span aria-hidden="true">↓</span>Discover the opportunity</a>
    </section>

    <section className="home-intro home-container home-section" id="opportunity" aria-labelledby="opportunity-title">
      <div className="home-centered-copy">
        <span className="home-eyebrow">A local foundation. A lasting impact.</span>
        <h2 id="opportunity-title">A new energy chapter.<br /><em>Starting right here.</em></h2>
        <p>The energy transition needs practical solutions. H2MB is developing a green hydrogen production project and exploring new pathways to reduce emissions with local industries.</p>
        <Link className="home-link" href="/about">Meet H2MB <Arrow /></Link>
      </div>
      <div className="home-principles">
        {principles.map((item, i) => <article key={item.title}>
          <span className="home-step" aria-hidden="true">0{i + 1}</span>
          <h3>{item.title}</h3><p>{item.text}</p>
        </article>)}
      </div>
    </section>

    <section className="home-project home-container home-section" aria-labelledby="home-project-title">
      <div className="home-project-visual">
        <svg className="home-molecule" viewBox="0 0 500 470" role="img" aria-label="An illustrated hydrogen molecule surrounded by orbiting paths">
          <defs><radialGradient id="home-molecule-wash"><stop stopColor="#e6f1dc" /><stop offset="1" stopColor="#f7faf4" /></radialGradient></defs>
          <path d="M60 225C50 99 150 34 279 48S462 162 440 287S298 449 168 409S66 329 60 225Z" fill="url(#home-molecule-wash)" />
          <g fill="none" stroke="#8aaf78" strokeWidth="1.5">
            <ellipse cx="250" cy="235" rx="190" ry="83" transform="rotate(-32 250 235)" />
            <ellipse cx="250" cy="235" rx="190" ry="83" transform="rotate(32 250 235)" />
            <ellipse cx="250" cy="235" rx="83" ry="190" />
          </g>
          <circle cx="250" cy="235" r="76" fill="#fff" />
          <text x="250" y="261" textAnchor="middle" fill="#386632" fontFamily="Arial, sans-serif" fontSize="80" letterSpacing="-6">H₂</text>
          <circle cx="104" cy="138" r="15" fill="#629c49" /><circle cx="388" cy="345" r="12" fill="#143c88" /><circle cx="250" cy="45" r="8" fill="#b8d89a" />
        </svg>
        <Link className="home-link" href="/process">From water to possibility <Arrow /></Link>
      </div>
      <div className="home-project-copy">
        <span className="home-eyebrow">Our project</span>
        <h2 id="home-project-title">Building the supply.<br /><em>Opening possibilities.</em></h2>
        <p>Our ambition is to produce and deliver the lowest-cost green hydrogen in the Prairie region. We’re working toward production that can support a growing local hydrogen economy.</p>
        <span className="home-project-status"><span className="home-dot" />In development, with the future in mind.</span>
        <Link className="home-link" href="/project">Inside our approach <Arrow /></Link>
      </div>
    </section>

    <section className="home-applications home-container home-section" aria-labelledby="home-applications-title">
      <div className="home-section-heading">
        <div><span className="home-eyebrow">Where hydrogen can make a difference</span><h2 id="home-applications-title">One molecule.<br /><em>Many possibilities.</em></h2></div>
        <Link className="home-link" href="/applications">Explore applications <Arrow /></Link>
      </div>
      <div className="home-uses">
        <Link className="home-use" href="/applications#transportation">
          <div className="home-use-media home-use-transport"><Image src="/images/transport.webp" alt="Transportation and freight" fill sizes="(max-width: 760px) calc(100vw - 48px), 30vw" /></div>
          <span className="home-eyebrow">Mobility</span><h3>Transportation <Arrow /></h3><p>New ways to move people and goods.</p>
        </Link>
        <Link className="home-use" href="/applications#industry">
          <div className="home-use-media home-use-industry"><Image src="/images/industry.webp" alt="Industrial production facilities" fill sizes="(max-width: 760px) calc(100vw - 48px), 30vw" /></div>
          <span className="home-eyebrow">Production</span><h3>Industry <Arrow /></h3><p>A cleaner input for essential processes.</p>
        </Link>
        <Link className="home-use" href="/applications#heat-power">
          <div className="home-use-media home-use-power"><svg viewBox="0 0 400 300" aria-hidden="true"><circle cx="200" cy="148" r="100" fill="#edf4e5" /><path d="M208 62L141 163H193L180 241L261 132H208Z" fill="#6f9c4c" /><path d="M90 100C47 174 91 255 161 271M302 210C350 132 308 50 238 30" fill="none" stroke="#9dbaa4" strokeWidth="2" strokeLinecap="round" /><circle cx="90" cy="100" r="7" fill="#143c88" /><circle cx="302" cy="210" r="7" fill="#629c49" /></svg></div>
          <span className="home-eyebrow">Energy</span><h3>Heat & power <Arrow /></h3><p>Exploring hydrogen’s role in energy systems.</p>
        </Link>
      </div>
    </section>

    <section className="home-place home-container home-section" aria-labelledby="home-place-title">
      <div className="home-place-copy"><span className="home-eyebrow">The Manitoba advantage</span><h2 id="home-place-title">The right place<br />to start something<br /><em>meaningful.</em></h2><p>Renewable resources. Industrial know-how. Connections across the continent. Our home province offers a compelling foundation for a hydrogen economy.</p><Link className="home-link" href="/insights/manitoba-advantage">Why Manitoba <Arrow /></Link></div>
      <div className="home-advantages">{advantages.map((item, i) => <article key={item.title}><span className="home-step" aria-hidden="true">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <section className="home-insights home-container home-section" aria-labelledby="home-insights-title">
      <div className="home-section-heading"><div><span className="home-eyebrow">Ideas for the road ahead</span><h2 id="home-insights-title">A clearer view <em>of hydrogen.</em></h2></div><Link className="home-link" href="/insights">All insights <Arrow /></Link></div>
      <div className="home-stories">
        <Link href="/insights/green-hydrogen"><span className="home-story-number" aria-hidden="true">01</span><div><span className="home-eyebrow">Hydrogen explained · 3 min read</span><h3>Green hydrogen,<br />from the beginning.</h3><span className="home-link">Understand the process <Arrow /></span></div></Link>
        <Link href="/insights/manitoba-advantage"><span className="home-story-number" aria-hidden="true">02</span><div><span className="home-eyebrow">Regional perspective · 3 min read</span><h3>Why the hydrogen conversation belongs in Manitoba.</h3><span className="home-link">Explore the opportunity <Arrow /></span></div></Link>
      </div>
    </section>

    <section className="home-contact home-container" aria-labelledby="home-contact-title"><span className="home-eyebrow">Let’s build what’s next</span><h2 id="home-contact-title">Big possibilities.<br /><em>One conversation away.</em></h2><Link className="home-button" href="/contact">Connect with H2MB <Arrow /></Link></section>
  </div>;
}
