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
  const oxygenRoute = useRef<SVGPathElement>(null);
  const oxygenBase = useRef<SVGPathElement>(null);
  const oxygenParticle = useRef<SVGCircleElement>(null);
  const chapterMenu = useRef<HTMLDetailsElement>(null);
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
    let frame = 0, pathLength = 0, oxygenLength = 0, lastActive = -1;
    let routeSamples: number[] = [], oxygenSamples: number[] = [];

    // Map the viewport's vertical position to distance along each curved pipe.
    const sample = (element: SVGPathElement, length: number) => Array.from({ length: 161 }, (_, index) => element.getPointAtLength(length * index / 160).y);
    const progressAt = (samples: number[], y: number) => {
      const index = samples.findIndex(value => value >= y);
      if (index < 0) return 1;
      if (index === 0) return 0;
      return (index - 1 + clamp((y - samples[index - 1]) / Math.max(1, samples[index] - samples[index - 1]))) / (samples.length - 1);
    };

    const measure = () => {
      const bounds = content.getBoundingClientRect();
      const points = stages.map(stage => {
        const rect = stage.querySelector('.process-visual')!.getBoundingClientRect();
        return { x: rect.left - bounds.left + rect.width / 2, top: rect.top - bounds.top + rect.height * .08, bottom: rect.bottom - bounds.top - rect.height * .08 };
      });
      // Oxygen is a side stream; the hydrogen route bypasses its recovery scene.
      const hydrogenPoints = points.filter((_, index) => index !== 4);
      let d = `M ${hydrogenPoints[0].x} ${hydrogenPoints[0].top - 65}`;
      hydrogenPoints.forEach((point, index) => {
        if (index) {
          const prior = hydrogenPoints[index - 1];
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
      routeSamples = sample(path, pathLength);
      const port = (index: number, x: number, y: number) => {
        const svg = stages[index].querySelector<SVGSVGElement>('.process-diagram')!;
        const rect = svg.getBoundingClientRect();
        const view = svg.viewBox.baseVal;
        return { x: rect.left - bounds.left + (x - view.x) / view.width * rect.width, y: rect.top - bounds.top + (y - view.y) / view.height * rect.height };
      };
      const start = port(3, 580, 430);
      const end = port(4, 560, 100);
      const mid = (start.y + end.y) / 2;
      const oxygenD = `M ${start.x} ${start.y} C ${start.x} ${mid}, ${end.x} ${mid}, ${end.x} ${end.y}`;
      oxygenRoute.current!.setAttribute('d', oxygenD);
      oxygenBase.current!.setAttribute('d', oxygenD);
      oxygenLength = oxygenRoute.current!.getTotalLength();
      oxygenSamples = sample(oxygenRoute.current!, oxygenLength);
      update();
    };

    const update = () => {
      frame = 0;
      const bounds = content.getBoundingClientRect();
      const viewport = window.innerHeight;
      const totalProgress = clamp((viewport * .58 - bounds.top) / bounds.height);
      const focusY = viewport * .58 - bounds.top;
      const pipeProgress = progressAt(routeSamples, focusY);
      host.style.setProperty('--journey-progress', String(totalProgress));
      host.style.setProperty('--world-shift', String(clamp((totalProgress - .19) / .22)));
      let nearest = 0, distance = Infinity;
      stages.forEach((stage, index) => {
        const rect = stage.getBoundingClientRect();
        const illustration = stage.querySelector('.process-diagram')!.getBoundingClientRect();
        const value = clamp((viewport - illustration.top) / (viewport + illustration.height));
        stage.style.setProperty('--step-progress', String(reduced ? 1 : value));
        const difference = Math.abs(rect.top + rect.height * .45 - viewport * .5);
        if (difference < distance) { distance = difference; nearest = index; }
      });
      if (nearest !== lastActive) { lastActive = nearest; setActive(nearest); }
      path.style.strokeDashoffset = String(reduced ? 0 : 1 - pipeProgress);
      const oxygenProgress = progressAt(oxygenSamples, focusY);
      oxygenRoute.current!.style.strokeDashoffset = String(reduced ? 0 : 1 - oxygenProgress);
      const oxygenPoint = oxygenRoute.current!.getPointAtLength(oxygenLength * oxygenProgress);
      oxygenParticle.current!.setAttribute('cx', String(oxygenPoint.x));
      oxygenParticle.current!.setAttribute('cy', String(oxygenPoint.y));
      oxygenParticle.current!.style.opacity = reduced || oxygenProgress <= 0 || oxygenProgress >= 1 ? '0' : '1';
      particles.forEach((particle, index) => {
        const progress = pipeProgress - index * .005;
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
      <div className="process-kicker">OUR PROCESS · AN EDUCATIONAL JOURNEY</div>
      <h1>From water.<br /><em>To possibility.</em></h1>
      <p>Watch water become green hydrogen.</p>
      <a href="#water-supply" className="process-begin">Follow the flow <span aria-hidden="true">↓</span></a>
    </section>
    <div className="process-toolbar">
      <details ref={chapterMenu} className="process-step-menu" onKeyDown={event => {
        if (event.key === 'Escape' && chapterMenu.current?.open) {
          chapterMenu.current.open = false;
          chapterMenu.current.querySelector('summary')?.focus();
        }
      }} onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}>
        <summary><span>{String(active + 1).padStart(2,'0')} / 09</span>Steps <span aria-hidden="true">⌄</span></summary>
        <nav aria-label="Process chapters" className="process-chapters">{processSteps.map((step, index) => <a key={step.id} href={`#${step.id}`} aria-current={active === index ? 'step' : undefined} aria-label={`Step ${index+1}: ${step.label}`} onClick={() => {
          if (chapterMenu.current) {
            chapterMenu.current.open = false;
            chapterMenu.current.querySelector('summary')?.focus();
          }
        }}><span>{String(index+1).padStart(2,'0')}</span>{step.label}</a>)}</nav>
      </details>
      <button type="button" className="process-motion-toggle" aria-label="Reduce motion" aria-pressed={reduced} disabled={systemReduced} onClick={() => setSimple(value => !value)}><span aria-hidden="true">{reduced ? '▷' : 'Ⅱ'}</span>{reduced ? 'Motion off' : 'Motion on'}</button>
    </div>
    <div className="process-track" ref={track}>
      <svg ref={routeSvg} className="process-flow-route" aria-hidden="true" preserveAspectRatio="none">
        <defs><linearGradient id="journey-pipe-colour" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#769aa3" /><stop offset=".19" stopColor="#65c9e8" /><stop offset=".37" stopColor="#65c9e8" /><stop offset=".43" stopColor="#b5d975" /><stop offset="1" stopColor="#b5d975" /></linearGradient></defs>
        <path ref={routeBase} className="flow-route-base" /><path ref={route} className="flow-route-fill" pathLength="1" />
        <path ref={oxygenBase} className="flow-route-base oxygen-route-base" /><path ref={oxygenRoute} className="flow-route-fill oxygen-route-fill" pathLength="1" /><circle ref={oxygenParticle} className="oxygen-flow-particle" r="8" />
        {Array.from({length:6},(_,i)=><circle className="flow-particle" r={i===0?10:5} key={i} />)}
      </svg>
      {processSteps.map((step, index) => {
        const Scene = sceneIllustrations[index];
        return <section className={`journey-stage stage-${index} ${index % 2 ? 'stage-reverse' : ''} ${active === index ? 'is-active' : ''}`} key={step.id} id={step.id} aria-labelledby={`${step.id}-title`}>
          <div className="stage-inner container">
            <div className="stage-copy"><div className="stage-label"><span>{String(index+1).padStart(2,'0')}</span>{step.label}</div><h2 id={`${step.id}-title`}>{step.title}</h2><p>{step.description}</p></div>
            <div className="process-visual"><Scene /></div>
          </div>
        </section>;
      })}
    </div>
    <section className="process-ending container"><h2>Made for the <em>real world.</em></h2><Link href="/applications" className="button">Explore applications <span aria-hidden="true">↗</span></Link></section>
    <aside className="process-sources container"><details><summary>About this journey & sources</summary><p>This educational journey illustrates a typical pathway, not a finalized H2MB facility. Equipment, flows, and scale are simplified; the electrolyzer is a PEM example. Water clarity and gas colours help distinguish the streams. Actual treatment, gas quality, storage, and delivery depend on the application. Oxygen recovery requires suitable processing and demand. Renewable electricity lowers production emissions, while equipment and delivery still have lifecycle impacts.</p><ul><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis" target="_blank" rel="noreferrer">U.S. Department of Energy — electrolysis ↗</a></li><li><a href="https://nelhydrogen.com/faq/" target="_blank" rel="noreferrer">Nel Hydrogen — water quality requirements ↗</a></li><li><a href="https://encyclopedia.airliquide.com/oxygen" target="_blank" rel="noreferrer">Air Liquide — oxygen applications ↗</a></li><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-delivery" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen delivery ↗</a></li><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-storage" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen storage ↗</a></li><li><a href="https://www.iea.org/reports/global-hydrogen-review-2024/ghg-emissions-of-hydrogen-and-its-derivatives" target="_blank" rel="noreferrer">IEA — lifecycle emissions ↗</a></li></ul></details></aside>
  </div>;
}
