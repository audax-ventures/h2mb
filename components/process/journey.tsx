'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Landscape, sceneIllustrations } from './illustrations';
import { processSteps } from './steps';
import { distanceAt, roundedPipe, type FlowMoment, type FlowPoint } from './flow-geometry';
import './process.css';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ProcessJourney() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const routeSvg = useRef<SVGSVGElement>(null);
  const oxygenRoute = useRef<SVGPathElement>(null);
  const particleSvg = useRef<SVGSVGElement>(null);
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
    if (!host || !content || !path || !routeSvg.current || !particleSvg.current || !oxygenRoute.current) return;
    const stages = Array.from(content.querySelectorAll<HTMLElement>('.journey-stage'));
    const diagrams = stages.map(stage => stage.querySelector<SVGSVGElement>('.process-diagram')!);
    const guides = diagrams.map(svg => svg.querySelector<SVGPathElement>('[data-flow-guide="main"]')!);
    const joins = Array.from(content.querySelectorAll<SVGGElement>('.flow-join'));
    const particles = Array.from(content.querySelectorAll<SVGCircleElement>('.flow-particle'));
    let frame = 0, lastActive = -1, disposed = false;
    let moments: FlowMoment[] = [], oxygenMoments: FlowMoment[] = [];
    let stageDistances: { start: number; end: number }[] = [];
    let stageBounds: { top: number; height: number; illustrationTop: number; illustrationHeight: number; footerTop: number }[] = [];
    let pathLength = 0, oxygenLength = 0;

    const measure = () => {
      const bounds = content.getBoundingClientRect();
      const viewBox = `0 0 ${bounds.width} ${bounds.height}`;
      routeSvg.current!.setAttribute('viewBox', viewBox);
      particleSvg.current!.setAttribute('viewBox', viewBox);
      stageBounds = stages.map((stage, i) => {
        const rect = stage.getBoundingClientRect(), illustration = diagrams[i].getBoundingClientRect();
        return { top: rect.top - bounds.top, height: rect.height, illustrationTop: illustration.top - bounds.top, illustrationHeight: illustration.height, footerTop: stage.querySelector('.stage-footer')!.getBoundingClientRect().top - bounds.top };
      });
      const sample = (element: SVGPathElement, local = false): FlowPoint[] => {
        const length = element.getTotalLength();
        const matrix = local ? element.getScreenCTM() : null;
        const count = Math.max(2, Math.ceil(length / 5));
        return Array.from({ length: count + 1 }, (_, i) => {
          const point = element.getPointAtLength(length * i / count);
          return matrix
            ? { x: matrix.a * point.x + matrix.c * point.y + matrix.e - bounds.left, y: matrix.b * point.x + matrix.d * point.y + matrix.f - bounds.top }
            : { x: point.x, y: point.y };
        });
      };
      const scenePoints = guides.map(guide => sample(guide, true));
      const mobile = bounds.width <= 760;
      const lane = (index: number, branch: boolean) => bounds.width * (branch ? .26 : index === 3 || index === 4 ? .18 : index % 2 ? .22 : .78);
      const connect = (start: FlowPoint, end: FlowPoint, from: number, to: number, group: SVGGElement, branch = false) => {
        const a = stageBounds[from], b = stageBounds[to];
        const bridgeY = (a.top + a.height + b.top) / 2;
        const exitY = (a.illustrationTop + a.illustrationHeight + a.footerTop) / 2 + (branch ? 12 : 0);
        const enterY = b.illustrationTop - 30;
        // Desktop pipes descend through the illustration columns. On phones an
        // inset lane keeps the stream beside the copy, then returns to the visual.
        const points = mobile
          ? [start, { x: start.x, y: exitY }, { x: lane(from, branch), y: exitY }, { x: lane(from, branch), y: bridgeY }, { x: lane(to, branch), y: bridgeY }, { x: lane(to, branch), y: enterY }, { x: end.x, y: enterY }, end]
          : [start, { x: start.x, y: bridgeY }, { x: end.x, y: bridgeY }, end];
        const d = roundedPipe(points, mobile ? 20 : 44);
        const paths = Array.from(group.querySelectorAll('path'));
        paths.forEach(line => line.setAttribute('d', d));
        const scale = Math.min(diagrams[from].getBoundingClientRect().width / diagrams[from].viewBox.baseVal.width, diagrams[to].getBoundingClientRect().width / diagrams[to].viewBox.baseVal.width);
        group.style.setProperty('--pipe-scale', String(scale));
        return sample(paths[0]);
      };
      const all: FlowPoint[] = [];
      let distance = 0;
      const append = (points: FlowPoint[]) => {
        for (const point of points) {
          const prior = all[all.length - 1];
          if (prior) distance += Math.hypot(point.x - prior.x, point.y - prior.y);
          all.push(point);
        }
      };
      moments = [];
      stageDistances = [];
      scenePoints.forEach((points, i) => {
        if (i) {
          const previous = scenePoints[i - 1];
          append(connect(previous[previous.length - 1], points[0], i - 1, i, joins[i - 1]));
        }
        const start = distance;
        const rect = stageBounds[i];
        moments.push({ y: rect.illustrationTop + rect.illustrationHeight * .18, distance });
        append(points);
        moments.push({ y: rect.illustrationTop + rect.illustrationHeight * .88, distance });
        stageDistances.push({ start, end: distance });
      });
      path.setAttribute('d', all.map((point, i) => `${i ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '));
      pathLength = distance;

      // Oxygen splits at the cell and stays on the opposite side from hydrogen.
      const oxygenStart = sample(diagrams[3].querySelector<SVGPathElement>('[data-flow-guide="oxygen"]')!, true);
      const oxygenEnd = sample(diagrams[4].querySelector<SVGPathElement>('[data-flow-guide="oxygen"]')!, true);
      const oxygenJoin = content.querySelector<SVGGElement>('.oxygen-join')!;
      const oxygenConnection = connect(oxygenStart[oxygenStart.length - 1], oxygenEnd[0], 3, 4, oxygenJoin, true);
      const oxygenPoints = [...oxygenStart, ...oxygenConnection, ...oxygenEnd];
      oxygenRoute.current!.setAttribute('d', oxygenPoints.map((point, i) => `${i ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '));
      oxygenLength = oxygenRoute.current!.getTotalLength();
      const startLength = oxygenStart.reduce((sum, point, i) => i ? sum + Math.hypot(point.x - oxygenStart[i-1].x, point.y - oxygenStart[i-1].y) : 0, 0);
      const endLength = oxygenEnd.reduce((sum, point, i) => i ? sum + Math.hypot(point.x - oxygenEnd[i-1].x, point.y - oxygenEnd[i-1].y) : 0, 0);
      oxygenMoments = [
        { y: stageBounds[3].illustrationTop + stageBounds[3].illustrationHeight * .5, distance: 0 },
        { y: moments[7].y, distance: startLength },
        { y: moments[8].y, distance: oxygenLength - endLength },
        { y: moments[9].y, distance: oxygenLength },
      ];
      update();
    };

    const update = () => {
      frame = 0;
      const bounds = content.getBoundingClientRect();
      const viewport = window.innerHeight;
      const focusY = viewport * .58 - bounds.top;
      const totalProgress = clamp(focusY / bounds.height);
      const travelled = distanceAt(moments, focusY);
      host.style.setProperty('--journey-progress', String(totalProgress));
      host.style.setProperty('--world-shift', String(clamp((totalProgress - .19) / .22)));
      let nearest = 0, distance = Infinity;
      stages.forEach((stage, index) => {
        const rect = stageBounds[index];
        const value = clamp((viewport - bounds.top - rect.illustrationTop) / (viewport + rect.illustrationHeight));
        stage.style.setProperty('--step-progress', String(reduced ? 1 : value));
        const difference = Math.abs(bounds.top + rect.top + rect.height * .45 - viewport * .5);
        if (difference < distance) { distance = difference; nearest = index; }
      });
      if (nearest !== lastActive) { lastActive = nearest; setActive(nearest); }
      const oxygenTravelled = distanceAt(oxygenMoments, focusY);
      const oxygenPoint = oxygenRoute.current!.getPointAtLength(oxygenTravelled);
      oxygenParticle.current!.setAttribute('cx', String(oxygenPoint.x));
      oxygenParticle.current!.setAttribute('cy', String(oxygenPoint.y));
      oxygenParticle.current!.style.opacity = reduced || oxygenTravelled <= 0 || oxygenTravelled >= oxygenLength ? '0' : '1';
      particles.forEach((particle, index) => {
        const position = travelled - index * 18;
        if (reduced || position <= 0 || travelled >= pathLength) { particle.style.opacity = '0'; return; }
        const point = path.getPointAtLength(position);
        particle.setAttribute('cx', String(point.x));
        particle.setAttribute('cy', String(point.y));
        particle.style.opacity = String(1 - index * .15);
        const purification = stageDistances[1], reaction = stageDistances[3];
        const clean = clamp((position - purification.start) / ((purification.end - purification.start) * .63));
        particle.style.fill = position > reaction.start + (reaction.end - reaction.start) * .39 ? '#8bcc36' : `rgb(${Math.round(84 - clean * 75)} ${Math.round(139 + clean * 33)} ${Math.round(152 + clean * 76)})`;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(measure);
    resize.observe(content);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    measure();
    return () => { disposed = true; resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); };
  }, [reduced]);

  return <div className={`process-experience${reduced ? ' simple-process' : ''}`} ref={root}>
    <div className="process-world"><Landscape /></div>
    <section className="process-opening container">
      <div className="process-opening-copy">
      <div className="process-kicker">OUR PROCESS · AN EDUCATIONAL JOURNEY</div>
      <h1>From water.<br /><em>To possibility.</em></h1>
      <p>Here’s a look at how we’re working to manufacture North America’s lowest-cost green hydrogen.</p>
      <a href="#water-supply" className="process-begin">Follow the flow <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="process-opening-image">
        <Image src="/images/hydrogen-applications.png" alt="Wooden blocks representing hydrogen storage, water, refuelling, energy and transport." width={1532} height={1026} sizes="(max-width: 760px) calc(100vw - 40px), 46vw" preload />
      </figure>
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
        {processSteps.slice(0, -1).map((step, index) => <g key={step.id} className={`flow-join ${active === index || active === index + 1 ? 'is-active' : ''}`} style={{ '--stream-colour': index === 0 ? '#548b98' : index < 3 ? '#09ace4' : '#8bcc36' } as CSSProperties}>
          <path className="joined-pipe-shell" /><path className="joined-pipe-water" /><path className="joined-pipe-shimmer diagram-flow" />
        </g>)}
        <g className={`oxygen-join ${active === 3 || active === 4 ? 'is-active' : ''}`}><path className="joined-pipe-shell" /><path className="joined-pipe-water" /><path className="joined-pipe-shimmer diagram-flow" /></g>
      </svg>
      <svg ref={particleSvg} className="process-flow-particles" aria-hidden="true" preserveAspectRatio="none">
        <path ref={route} className="flow-guide" /><path ref={oxygenRoute} className="flow-guide" />
        <circle ref={oxygenParticle} className="oxygen-flow-particle" r="7" />
        {Array.from({length:5},(_,i)=><circle className="flow-particle" r={i===0?8:4} key={i} />)}
      </svg>
      {processSteps.map((step, index) => {
        const Scene = sceneIllustrations[index];
        const next = processSteps[index + 1];
        return <section className={`journey-stage stage-${index} ${index % 2 ? 'stage-reverse' : ''} ${active === index ? 'is-active' : ''}`} key={step.id} id={step.id} aria-labelledby={`${step.id}-title`}>
          <header className="stage-heading container">
            <div className="stage-heading-label">
            <div className="stage-number" aria-hidden="true"><span>STEP</span>{String(index + 1).padStart(2, '0')}</div>
            <h2 id={`${step.id}-title`}><span className="process-sr-only">Step {index + 1}: </span>{step.label}</h2>
            </div>
          </header>
          <div className="stage-inner container">
            <div className="stage-copy">
              <p className="stage-summary">{step.description}</p>
              <dl className="stage-detail"><div><dt>{step.detailLabel}</dt><dd>{step.detail}</dd></div></dl>
            </div>
            <div className="process-visual"><Scene /></div>
          </div>
          <footer className="stage-footer container">
            <div className="stage-footer-content">
            <p><span>RESULT</span>{step.result}</p>
            {next && <a href={`#${next.id}`} aria-label={`Continue to step ${index + 2}: ${next.label}`}><span>Next: {next.label}</span><span aria-hidden="true">↓</span></a>}
            </div>
          </footer>
        </section>;
      })}
    </div>
    <section className="process-ending container"><h2>Made for the <em>real world.</em></h2><Link href="/applications" className="button">Explore applications <span aria-hidden="true">↗</span></Link></section>
    <aside className="process-sources container"><details><summary>About this journey & sources</summary><p>This educational journey illustrates a typical pathway, not a finalized H2MB facility. Equipment, flows, and scale are simplified; the electrolyzer is a PEM example. Water clarity and gas colours help distinguish the streams. Actual treatment, gas quality, storage, and delivery depend on the application. Oxygen recovery requires suitable processing and demand. Renewable electricity lowers production emissions, while equipment and delivery still have lifecycle impacts.</p><ul><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis" target="_blank" rel="noreferrer">U.S. Department of Energy — electrolysis ↗</a></li><li><a href="https://nelhydrogen.com/faq/" target="_blank" rel="noreferrer">Nel Hydrogen — water quality requirements ↗</a></li><li><a href="https://encyclopedia.airliquide.com/oxygen" target="_blank" rel="noreferrer">Air Liquide — oxygen applications ↗</a></li><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-delivery" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen delivery ↗</a></li><li><a href="https://www.energy.gov/cmei/fuels/hydrogen-storage" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen storage ↗</a></li><li><a href="https://www.iea.org/reports/global-hydrogen-review-2024/ghg-emissions-of-hydrogen-and-its-derivatives" target="_blank" rel="noreferrer">IEA — lifecycle emissions ↗</a></li></ul></details></aside>
  </div>;
}
