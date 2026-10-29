'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Landscape, sceneIllustrations } from './illustrations';
import { processSteps } from './steps';
import './process.css';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ProcessJourney() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const routeBase = useRef<SVGPathElement>(null);
  const routeSvg = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);
  const [simple, setSimple] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const reduced = simple || systemReduced;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const host = root.current, content = track.current, path = route.current;
    if (!host || !content || !path || !routeBase.current || !routeSvg.current) return;
    const stages = Array.from(content.querySelectorAll<HTMLElement>('.journey-stage'));
    const particles = Array.from(content.querySelectorAll<SVGCircleElement>('.flow-particle'));
    let frame = 0, pathLength = 0, lastActive = -1;

    const measure = () => {
      const bounds = content.getBoundingClientRect();
      const points = stages.map(stage => {
        const rect = stage.querySelector('.process-visual')!.getBoundingClientRect();
        return { x: rect.left - bounds.left + rect.width / 2, top: rect.top - bounds.top + rect.height * .08, bottom: rect.bottom - bounds.top - rect.height * .08 };
      });
      let d = `M ${points[0].x} ${points[0].top - 65}`;
      points.forEach((point, index) => {
        if (index) {
          const prior = points[index - 1];
          const mid = (prior.bottom + point.top) / 2;
          d += ` C ${prior.x} ${mid}, ${point.x} ${mid}, ${point.x} ${point.top}`;
        }
        d += ` L ${point.x} ${point.bottom}`;
      });
      const last = points[points.length - 1];
      d += ` L ${last.x} ${last.bottom + 70}`;
      routeSvg.current!.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      path.setAttribute('d', d);
      routeBase.current!.setAttribute('d', d);
      pathLength = path.getTotalLength();
      update();
    };

    const update = () => {
      frame = 0;
      const bounds = content.getBoundingClientRect();
      const viewport = window.innerHeight;
      const totalProgress = clamp((viewport * .58 - bounds.top) / bounds.height);
      host.style.setProperty('--journey-progress', String(totalProgress));
      host.style.setProperty('--world-shift', String(clamp((totalProgress - .19) / .22)));
      let nearest = 0, distance = Infinity;
      stages.forEach((stage, index) => {
        const rect = stage.getBoundingClientRect();
        const value = clamp((viewport * .8 - rect.top) / (rect.height + viewport * .1));
        stage.style.setProperty('--step-progress', String(reduced ? 1 : value));
        const difference = Math.abs(rect.top + rect.height * .45 - viewport * .5);
        if (difference < distance) { distance = difference; nearest = index; }
      });
      if (nearest !== lastActive) { lastActive = nearest; setActive(nearest); }
      path.style.strokeDashoffset = String(reduced ? 0 : 1 - totalProgress);
      particles.forEach((particle, index) => {
        const progress = totalProgress - index * .005;
        if (reduced || progress < 0 || !pathLength) { particle.style.opacity = '0'; return; }
        const point = path.getPointAtLength(pathLength * clamp(progress));
        particle.setAttribute('cx', String(point.x));
        particle.setAttribute('cy', String(point.y));
        particle.style.opacity = String(1 - index * .13);
        particle.style.fill = totalProgress < .15 ? '#91b8bd' : totalProgress < .39 ? '#68d2ef' : '#c5e77d';
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(measure);
    resize.observe(content);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    measure();
    return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [reduced]);

  return <div className={`process-experience${reduced ? ' simple-process' : ''}`} ref={root}>
    <div className="process-world"><Landscape /></div>
    <section className="process-opening container">
      <div className="process-kicker"><span className="tiny-dot" />OUR PROCESS · AN ILLUSTRATED JOURNEY</div>
      <h1>From a drop of water.<br /><em>To a world of possibility.</em></h1>
      <p>Follow the flow. Discover how water and renewable electricity become green hydrogen—and where that journey can lead.</p>
      <div className="process-opening-bottom"><a href="#water-supply" className="process-begin">Scroll to follow the story <span aria-hidden="true">↓</span></a><div className="process-legend" aria-label="Colour key"><span><i className="water-key" />Water</span><span><i className="hydrogen-key" />Hydrogen</span><span><i className="oxygen-key" />Oxygen</span></div></div>
      <p className="process-intro-note">An educational walkthrough. The scenes illustrate a typical pathway, not a finalized H2MB facility design.</p>
    </section>
    <div className="process-toolbar">
      <nav aria-label="Process chapters" className="process-chapters">{processSteps.map((step, index) => <a key={step.id} href={`#${step.id}`} aria-current={active === index ? 'step' : undefined} aria-label={`Step ${index+1}: ${step.label}`}><span>{String(index+1).padStart(2,'0')}</span><b>{step.short}</b></a>)}</nav>
      <button type="button" className="process-motion-toggle" aria-pressed={reduced} disabled={systemReduced} onClick={() => setSimple(value => !value)}>{systemReduced ? 'Reduced motion on' : simple ? 'Animation off' : 'Animation on'}</button>
      <div className="process-progress" aria-hidden="true" />
    </div>
    <div className="process-track" ref={track}>
      <svg ref={routeSvg} className="process-flow-route" aria-hidden="true" preserveAspectRatio="none">
        <defs><linearGradient id="journey-pipe-colour" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#769aa3" /><stop offset=".19" stopColor="#65c9e8" /><stop offset=".37" stopColor="#65c9e8" /><stop offset=".43" stopColor="#b5d975" /><stop offset="1" stopColor="#b5d975" /></linearGradient></defs>
        <path ref={routeBase} className="flow-route-base" /><path ref={route} className="flow-route-fill" pathLength="1" />
        {Array.from({length:6},(_,i)=><circle className="flow-particle" r={i===0?10:5} key={i} />)}
      </svg>
      {processSteps.map((step, index) => {
        const Scene = sceneIllustrations[index];
        return <section className={`journey-stage stage-${index} ${index % 2 ? 'stage-reverse' : ''}`} key={step.id} id={step.id} aria-labelledby={`${step.id}-title`}>
          <div className="stage-inner container">
            <div className="stage-copy"><div className="stage-label"><span>{String(index+1).padStart(2,'0')}</span>{step.label}</div><h2 id={`${step.id}-title`}>{step.title}</h2><p>{step.description}</p><div className="stage-insight"><span aria-hidden="true">↳</span><p>{step.detail}</p></div><p className="stage-note">{step.note}</p></div>
            <div className="process-visual"><div className="diagram-header"><span className="diagram-tag">{step.signal}</span><span>THE JOURNEY / {String(index+1).padStart(2,'0')}</span></div><Scene /><div className="diagram-caption"><span className={`stream-dot stream-${index}`} />{step.caption}</div></div>
          </div>
          {index < processSteps.length - 1 && <a href={`#${processSteps[index+1].id}`} className="stage-next" aria-label={`Continue to ${processSteps[index+1].label}`}><span aria-hidden="true">↓</span></a>}
        </section>;
      })}
    </div>
    <section className="process-ending container"><span className="eyebrow">Small molecule. Real possibilities.</span><h2>Now, imagine<br /><em>where it could take you.</em></h2><p>The right application starts with a conversation. Explore the possibilities or talk to H2MB about your operation.</p><div className="process-end-actions"><Link href="/applications" className="button">Explore applications ↗</Link><Link href="/contact" className="text-link">Let’s talk <span aria-hidden="true">↗</span></Link></div><a href="#water-supply" className="process-replay">↥ Follow the journey again</a></section>
    <aside className="process-sources container"><details><summary>About this walkthrough & sources</summary><p>Illustrations simplify equipment, flows, and scale. Gas colours and water clarity changes are visual storytelling devices. Actual water treatment, gas quality, storage, and delivery are designed around the equipment and application. Recovering oxygen requires suitable processing and demand.</p><ul><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis" target="_blank" rel="noreferrer">U.S. Department of Energy — electrolysis ↗</a></li><li><a href="https://nelhydrogen.com/faq/" target="_blank" rel="noreferrer">Nel Hydrogen — water quality requirements ↗</a></li><li><a href="https://encyclopedia.airliquide.com/oxygen" target="_blank" rel="noreferrer">Air Liquide — oxygen applications ↗</a></li><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-delivery" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen delivery ↗</a></li><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-storage" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen storage ↗</a></li><li><a href="https://www.iea.org/reports/global-hydrogen-review-2024/ghg-emissions-of-hydrogen-and-its-derivatives" target="_blank" rel="noreferrer">IEA — lifecycle emissions ↗</a></li></ul></details></aside>
  </div>;
}
