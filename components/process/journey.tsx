'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { sceneIllustrations } from './illustrations';
import { processPhases, processSteps } from './steps';
import './process.css';

const pad = (n: number) => String(n).padStart(2, '0');

export function ProcessJourney() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const steps = Array.from(host.querySelectorAll<HTMLElement>('.process-step'));
    const compact = window.matchMedia('(max-width: 960px)');
    let frame = 0, last = -1;
    const update = () => {
      frame = 0;
      // On wide screens a step becomes active as it reaches mid-screen; on narrow screens
      // the sticky figure covers the top of the viewport, so the trigger line sits lower.
      const line = window.innerHeight * (compact.matches ? .6 : .5);
      let index = 0;
      steps.forEach((step, i) => { if (step.getBoundingClientRect().top <= line) index = i; });
      if (index !== last) { last = index; setActive(index); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);

  const current = processSteps[active];

  return <div className={`process-page${paused ? ' is-paused' : ''}`} ref={root}>
    <section className="process-hero container" aria-labelledby="process-title">
      <div className="process-hero-top">
        <div>
          <p className="process-eyebrow">Our process</p>
          <h1 id="process-title">How green hydrogen <em>is made.</em></h1>
        </div>
        <div className="process-hero-side">
          <p>Nine stages turn water and renewable electricity into hydrogen ready for industry, transport and power. This is the pathway behind our work to produce North America’s lowest-cost green hydrogen.</p>
          <a href="#water-supply" className="process-start">Walk through the process <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <ol className="process-map" aria-label="Process overview">
        {processPhases.map(phase => <li key={phase.id} className="process-map-phase">
          <div className="process-map-head"><span>{phase.number}</span>{phase.label}</div>
          <p>{phase.title}</p>
          <ol>
            {phase.steps.map(step => {
              const index = processSteps.findIndex(s => s.id === step.id);
              return <li key={step.id}><a href={`#${step.id}`}><span>{pad(index + 1)}</span>{step.label}</a></li>;
            })}
          </ol>
        </li>)}
      </ol>
    </section>

    <div className="process-body container">
      <div className="process-panel" aria-label="Process schematic">
        <nav className="process-progress" aria-label="Process steps">
          {processPhases.map(phase => <div key={phase.id} className={`process-progress-phase${current.phase.id === phase.id ? ' is-current' : ''}`}>
            <span className="process-progress-label">{phase.number} {phase.label}</span>
            <div className="process-progress-ticks">
              {phase.steps.map(step => {
                const index = processSteps.findIndex(s => s.id === step.id);
                return <a key={step.id} href={`#${step.id}`} className={index < active ? 'is-done' : index === active ? 'is-active' : undefined} aria-label={`Step ${index + 1}: ${step.label}`} aria-current={index === active ? 'step' : undefined} />;
              })}
            </div>
          </div>)}
        </nav>
        <div className="process-figures">
          {sceneIllustrations.map((Scene, index) => <figure key={processSteps[index].id} className={`process-figure${index === active ? ' is-active' : ''}`} aria-hidden={index !== active}>
            <Scene />
          </figure>)}
        </div>
        <div className="process-caption">
          <p aria-live="polite"><span>Fig. {pad(active + 1)}</span>{current.figure}</p>
          <div>
            <span className="process-scale">Schematic · not to scale</span>
            <button type="button" className="process-motion" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Play flow' : 'Pause flow'}</button>
          </div>
        </div>
      </div>

      <div className="process-steps">
        {processPhases.map(phase => <section key={phase.id} className="process-phase" aria-labelledby={`${phase.id}-title`}>
          <header className="process-phase-head">
            <span>Phase {phase.number}</span>
            <h2 id={`${phase.id}-title`}>{phase.label}<em> · {phase.title}</em></h2>
          </header>
          {phase.steps.map(step => {
            const index = processSteps.findIndex(s => s.id === step.id);
            return <article key={step.id} id={step.id} className={`process-step${index === active ? ' is-active' : ''}`} aria-labelledby={`${step.id}-title`}>
              <div className="process-step-index" aria-hidden="true">{pad(index + 1)}<span> / {pad(processSteps.length)}</span></div>
              <h3 id={`${step.id}-title`}><span className="process-sr-only">Step {index + 1}: </span>{step.label}</h3>
              <p className="process-step-summary">{step.summary}</p>
              <p className="process-step-detail">{step.detail}</p>
              <dl className="process-specs">
                {step.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
                <div className="process-output"><dt>Output</dt><dd>{step.output}</dd></div>
              </dl>
            </article>;
          })}
        </section>)}
      </div>
    </div>

    <section className="process-close container" aria-labelledby="process-close-title">
      <div>
        <p className="process-eyebrow">Where it goes</p>
        <h2 id="process-close-title">From molecule <em>to market.</em></h2>
      </div>
      <div className="process-close-actions">
        <Link href="/applications" className="button">Explore applications <span aria-hidden="true">↗</span></Link>
        <Link href="/contact" className="text-link">Talk to our team <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <aside className="process-sources container">
      <details>
        <summary>Notes and sources</summary>
        <p>This page shows a typical green hydrogen pathway in simplified schematic form. It is not a finalized H2MB facility design. Figures are typical industry values, not H2MB specifications, and PEM electrolysis is shown as one example technology. Actual treatment, gas quality, storage pressure and delivery depend on the application. Renewable electricity lowers production emissions, while equipment and delivery still have lifecycle impacts.</p>
        <ul>
          <li><a href="https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis" target="_blank" rel="noreferrer">U.S. Department of Energy — electrolysis ↗</a></li>
          <li><a href="https://nelhydrogen.com/faq/" target="_blank" rel="noreferrer">Nel Hydrogen — water quality requirements ↗</a></li>
          <li><a href="https://encyclopedia.airliquide.com/oxygen" target="_blank" rel="noreferrer">Air Liquide — oxygen applications ↗</a></li>
          <li><a href="https://www.energy.gov/cmei/fuels/hydrogen-delivery" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen delivery ↗</a></li>
          <li><a href="https://www.energy.gov/cmei/fuels/hydrogen-storage" target="_blank" rel="noreferrer">U.S. Department of Energy — hydrogen storage ↗</a></li>
          <li><a href="https://www.iea.org/reports/global-hydrogen-review-2024/ghg-emissions-of-hydrogen-and-its-derivatives" target="_blank" rel="noreferrer">IEA — lifecycle emissions ↗</a></li>
        </ul>
      </details>
    </aside>
  </div>;
}
