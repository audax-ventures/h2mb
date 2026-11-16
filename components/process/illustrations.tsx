import type { ReactNode } from 'react';

// Process schematics drawn in a P&ID-inspired line style on a shared 640 × 420 grid.
// Streams: raw water, treated water, power, hydrogen, oxygen. Each line has a faint rail
// that draws in when the figure becomes active, plus a dashed core that animates the flow.
type Stream = 'raw' | 'water' | 'power' | 'h2' | 'o2';

function Line({ d, s, optional = false }: { d: string; s: Stream; optional?: boolean }) {
  return <g className={`dg-line dg-${s}${optional ? ' dg-optional' : ''}`}>
    <path className="dg-rail" d={d} pathLength={1} />
    <path className="dg-flow" d={d} />
  </g>;
}
function Arrow({ x, y, s, dir = 'r' }: { x: number; y: number; s: Stream; dir?: 'r' | 'l' | 'u' | 'd' }) {
  const rotate = { r: 0, d: 90, l: 180, u: 270 }[dir];
  return <path className={`dg-arrow dg-${s}`} d="M-9-5L0 0L-9 5Z" transform={`translate(${x} ${y}) rotate(${rotate})`} />;
}
function Tag({ x, y, code, name, anchor = 'middle' }: { x: number; y: number; code?: string; name: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <g className="dg-tag" textAnchor={anchor}>
    {code && <text x={x} y={y} className="dg-code">{code}</text>}
    <text x={x} y={code ? y + 15 : y}>{name}</text>
  </g>;
}
function Note({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} className="dg-note">{children}</text>;
}
function Instrument({ x, y, code, toY }: { x: number; y: number; code: string; toY: number }) {
  return <g>
    <path className="dg-thin dg-dashed" d={`M${x} ${y + 14}V${toY}`} />
    <circle className="dg-eq" cx={x} cy={y} r="14" />
    <text x={x} y={y + 4} textAnchor="middle" className="dg-instrument">{code}</text>
  </g>;
}
function Frame({ name, children }: { name: string; children: ReactNode }) {
  return <svg className="dg" viewBox="0 0 640 420" role="img" aria-label={name}>{children}</svg>;
}

export function Intake() {
  const hatch = [240, 255, 270, 285];
  return <Frame name="Schematic: water is drawn from a source through a screened intake, pumped, strained and metered on its way to treatment">
    <path className="dg-ground" d="M20 200H70L110 300H250L290 200H620" />
    <g className="dg-thin">{[30, 50, ...Array.from({ length: 16 }, (_, i) => 310 + i * 20)].map(x => <path key={x} d={`M${x} 200l-10 12`} />)}</g>
    <path className="dg-water-surface" d="M80 225H280" />
    <g className="dg-water-hatch">{hatch.map(y => <path key={y} d={`M${70 + (y - 200) * .4 + 6} ${y}H${290 - (y - 200) * .4 - 6}`} />)}</g>
    <Line d="M226 262V130H338" s="raw" />
    <Line d="M382 130H440" s="raw" />
    <Line d="M480 130H612" s="raw" /><Arrow x={620} y={130} s="raw" />
    <rect className="dg-eq" x="215" y="262" width="22" height="22" />
    <path className="dg-thin" d="M221 264V282M226 264V282M231 264V282" />
    <circle className="dg-eq" cx="360" cy="130" r="22" />
    <path className="dg-thin" d="M350 118L374 130L350 142Z" />
    <rect className="dg-eq" x="440" y="116" width="40" height="28" />
    <path className="dg-thin" d="M446 140L458 120M456 140L468 120M466 140L476 124" />
    <Instrument x={540} y={76} code="FT" toY={130} />
    <Note x={600} y={114} anchor="end">TO TREATMENT</Note>
    <Tag x={360} y={172} code="P-101" name="INTAKE PUMP" />
    <Tag x={460} y={172} code="S-101" name="STRAINER" />
    <Tag x={180} y={330} name="SOURCE WATER" />
    <Note x={180} y={346}>SCREENED INTAKE</Note>
  </Frame>;
}

export function Treatment() {
  return <Frame name="Schematic: water passes through a media filter, reverse osmosis and deionization, with conductivity monitored at the outlet">
    <Line d="M20 210H70" s="raw" />
    <Line d="M130 210H210" s="raw" />
    <Line d="M360 210H430" s="water" />
    <Line d="M520 210H612" s="water" /><Arrow x={620} y={210} s="water" />
    <Line d="M345 235V300H400" s="raw" /><Arrow x={408} y={300} s="raw" />
    <rect className="dg-eq" x="70" y="120" width="60" height="180" rx="30" />
    <g className="dg-media">{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={82 + (i % 6) * 7.5 + (Math.floor(i / 6) % 2) * 3} cy={232 + Math.floor(i / 6) * 13} r="2.2" />)}</g>
    <path className="dg-thin" d="M76 222H124" />
    <rect className="dg-eq" x="210" y="185" width="150" height="50" rx="25" />
    <path className="dg-thin dg-dashed" d="M226 210H344" />
    <rect className="dg-eq" x="430" y="140" width="90" height="140" rx="6" />
    <g className="dg-thin">{[446, 458, 470, 482, 494, 506].map((x, i) => <path key={x} d={`M${x} 156V264`} strokeDasharray={i % 2 ? '4 4' : undefined} />)}</g>
    <Instrument x={565} y={130} code="CE" toY={210} />
    <Note x={545} y={134} anchor="end">&lt; 1 µS/cm</Note>
    <Note x={600} y={195} anchor="end">TO ELECTROLYZER</Note>
    <Note x={416} y={304} anchor="start">CONCENTRATE</Note>
    <Tag x={100} y={326} code="F-201" name="MEDIA FILTER" />
    <Tag x={270} y={262} code="RO-201" name="REVERSE OSMOSIS" />
    <Tag x={475} y={306} code="DI-201" name="DEIONIZATION" />
  </Frame>;
}

export function Power() {
  return <Frame name="Single-line diagram: hydro, wind and solar generation feed a common AC bus, then a transformer and rectifier supply DC power to the electrolyzer">
    <Line d="M96 110H250" s="power" />
    <Line d="M120 210H250" s="power" />
    <Line d="M154 310H250" s="power" />
    <Line d="M250 210H300" s="power" />
    <Line d="M356 210H380" s="power" />
    <Line d="M470 210H612" s="power" /><Arrow x={620} y={210} s="power" />
    <g className="dg-wind">
      <path className="dg-eq" d="M87 135L90 72L93 135Z" />
      <g className="dg-rotor">{[0, 120, 240].map(angle => <path key={angle} className="dg-eq" transform={`rotate(${angle} 90 70)`} d="M90 70L86 44Q90 34 94 44Z" />)}</g>
      <circle className="dg-hub" cx="90" cy="70" r="4" />
    </g>
    <path className="dg-eq" d="M60 230L75 190H125L110 230Z" />
    <path className="dg-thin" d="M67 213H118M85 190L77 230M100 190L93 230" />
    <path className="dg-thin" d="M92 230V245" />
    <g className="dg-water-hatch"><path d="M28 296H58M28 306H55M28 316H52" /></g>
    <path className="dg-eq" d="M60 330L75 285H95L110 330Z" />
    <circle className="dg-eq" cx="140" cy="310" r="14" />
    <text x="140" y="314" textAnchor="middle" className="dg-instrument">G</text>
    <path className="dg-bus" d="M250 90V330" />
    <circle className="dg-eq" cx="318" cy="210" r="18" /><circle className="dg-eq dg-open" cx="338" cy="210" r="18" />
    <rect className="dg-eq" x="380" y="180" width="90" height="60" />
    <path className="dg-thin" d="M380 240L470 180" />
    <text x="398" y="200" textAnchor="middle" className="dg-instrument">~</text>
    <text x="452" y="230" textAnchor="middle" className="dg-instrument">=</text>
    <Note x={275} y={84} anchor="start">AC BUS</Note>
    <Note x={600} y={195} anchor="end">DC TO STACK</Note>
    <Tag x={90} y={160} name="WIND" />
    <Tag x={92} y={264} name="SOLAR PV" />
    <Tag x={95} y={354} name="HYDRO" />
    <Tag x={328} y={252} code="T-301" name="TRANSFORMER" />
    <Tag x={425} y={266} code="R-301" name="RECTIFIER" />
    <Note x={612} y={380} anchor="end">≈ 50–55 kWh PER kg H₂</Note>
  </Frame>;
}

export function Electrolysis() {
  const o2 = [[200, 300, 0], [222, 260, .6], [206, 220, 1.2], [230, 190, 1.8]];
  const h2 = [[404, 296, .3], [430, 262, .9], [414, 222, 1.5], [440, 188, 2.1]];
  return <Frame name="Cross-section of a PEM electrolysis cell: water enters the anode, protons cross the membrane, oxygen leaves the anode side and hydrogen leaves the cathode side">
    <rect className="dg-tint-water" x="181" y="111" width="133" height="208" />
    <rect className="dg-tint-h2" x="326" y="111" width="133" height="208" />
    <Line d="M20 280H180" s="water" /><Arrow x={180} y={280} s="water" />
    <Line d="M210 110V80H28" s="o2" /><Arrow x={20} y={80} s="o2" dir="l" />
    <Line d="M430 110V80H612" s="h2" /><Arrow x={620} y={80} s="h2" />
    <path className="dg-wire" d="M296 55H255V130M344 55H385V130" />
    <rect className="dg-eq" x="296" y="40" width="48" height="30" />
    <text x="320" y="60" textAnchor="middle" className="dg-instrument">DC</text>
    <text x="270" y="48" textAnchor="middle" className="dg-sign">+</text>
    <text x="370" y="48" textAnchor="middle" className="dg-sign">−</text>
    <rect className="dg-eq" x="180" y="110" width="280" height="210" fill="none" />
    <rect className="dg-membrane" x="314" y="110" width="12" height="210" />
    <rect className="dg-electrode" x="250" y="130" width="10" height="170" />
    <rect className="dg-electrode" x="380" y="130" width="10" height="170" />
    {[190, 230, 270].map(y => <g key={y}>
      <path className="dg-ion" d={`M266 ${y}H368`} />
      <path className="dg-ion-head" d={`M366 ${y - 4}L374 ${y}L366 ${y + 4}`} />
      <text x="290" y={y - 6} textAnchor="middle" className="dg-note">H⁺</text>
    </g>)}
    {o2.map(([x, y, delay]) => <circle key={`o${x}${y}`} className="dg-bubble dg-bubble-o2" cx={x} cy={y} r="4" style={{ animationDelay: `${delay}s` }} />)}
    {h2.map(([x, y, delay]) => <circle key={`h${x}${y}`} className="dg-bubble dg-bubble-h2" cx={x} cy={y} r="5" style={{ animationDelay: `${delay}s` }} />)}
    <path className="dg-thin" d="M320 300V372" />
    <Note x={28} y={72} anchor="start">O₂ OUT</Note>
    <Note x={612} y={72} anchor="end">H₂ OUT</Note>
    <Note x={28} y={268} anchor="start">H₂O IN</Note>
    <Tag x={247} y={342} name="ANODE (+)" />
    <Tag x={393} y={342} name="CATHODE (−)" />
    <Tag x={320} y={388} name="MEMBRANE" />
    <Note x={300} y={410} anchor="end">2H₂O → O₂ + 4H⁺ + 4e⁻</Note>
    <Note x={340} y={410} anchor="start">4H⁺ + 4e⁻ → 2H₂</Note>
  </Frame>;
}

export function OxygenRecovery() {
  return <Frame name="Schematic: oxygen from the stack passes a knock-out drum and dryer into storage cylinders for water treatment, glass and metals markets, or is vented where there is no offtake">
    <Line d="M20 120H90" s="o2" />
    <Line d="M140 120H210" s="o2" />
    <Line d="M260 120H470V200H482" s="o2" /><Arrow x={490} y={200} s="o2" />
    {[340, 390, 440].map(x => <Line key={x} d={`M${x} 120V150`} s="o2" />)}
    <Line d="M290 120V44" s="o2" optional /><Arrow x={290} y={40} s="o2" dir="u" />
    <Line d="M115 220V250H170" s="water" /><Arrow x={178} y={250} s="water" />
    <rect className="dg-eq" x="90" y="80" width="50" height="140" rx="25" />
    <path className="dg-thin" d="M96 98H134M96 104H134M96 110H134" />
    <rect className="dg-eq" x="210" y="90" width="50" height="110" rx="8" />
    <g className="dg-media">{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={220 + (i % 3) * 15} cy={108 + Math.floor(i / 3) * 15} r="2.2" />)}</g>
    {[340, 390, 440].map(x => <rect key={x} className="dg-eq" x={x - 15} y="150" width="30" height="120" rx="15" />)}
    <rect className="dg-eq" x="490" y="160" width="130" height="110" />
    <text x="502" y="184" className="dg-code">O₂ MARKETS</text>
    <path className="dg-thin" d="M502 194H608" />
    {['WATER TREATMENT', 'GLASS', 'METALS'].map((m, i) => <text key={m} x="502" y={214 + i * 18} className="dg-note">{m}</text>)}
    <Note x={28} y={104} anchor="start">O₂ FROM STACK</Note>
    <Note x={302} y={44} anchor="start">VENT · IF NO OFFTAKE</Note>
    <Note x={186} y={254} anchor="start">CONDENSATE</Note>
    <Tag x={115} y={284} code="V-501" name="KO DRUM" />
    <Tag x={235} y={226} code="D-501" name="DRYER" />
    <Tag x={390} y={296} name="O₂ STORAGE" />
  </Frame>;
}

export function Conditioning() {
  return <Frame name="Schematic: hydrogen passes a gas-liquid separator, a catalytic deoxo reactor and twin dryers, with purity confirmed by an online analyzer">
    <Line d="M20 210H70" s="h2" />
    <Line d="M120 210H190" s="h2" />
    <Line d="M250 210H310" s="h2" />
    <Line d="M330 120V90H450V210H612" s="h2" /><Arrow x={620} y={210} s="h2" />
    <Line d="M95 300V330H62" s="water" /><Arrow x={54} y={330} s="water" dir="l" />
    <rect className="dg-eq" x="70" y="110" width="50" height="190" rx="25" />
    <path className="dg-thin" d="M76 132H114M76 138H114M76 144H114" />
    <rect className="dg-eq" x="190" y="140" width="60" height="140" rx="10" />
    <g className="dg-thin">{[0, 1, 2, 3, 4].map(i => <path key={i} d={`M196 ${170 + i * 18}l48 -12M196 ${158 + i * 18}l48 12`} />)}</g>
    <rect className="dg-eq" x="310" y="120" width="40" height="180" rx="20" />
    <rect className="dg-eq dg-standby" x="370" y="120" width="40" height="180" rx="20" />
    <path className="dg-thin dg-dashed" d="M350 260H370" />
    <text x="330" y="156" textAnchor="middle" className="dg-instrument">A</text>
    <text x="390" y="156" textAnchor="middle" className="dg-instrument">B</text>
    <Instrument x={520} y={140} code="AT" toY={210} />
    <Note x={545} y={144} anchor="start">≥ 99.97 %</Note>
    <Note x={28} y={195} anchor="start">H₂ FROM STACK</Note>
    <Note x={46} y={334} anchor="end">WATER</Note>
    <Note x={360} y={276} >REGEN</Note>
    <Note x={600} y={195} anchor="end">TO COMPRESSION</Note>
    <Tag x={95} y={362} code="V-601" name="SEPARATOR" />
    <Tag x={220} y={362} code="R-601" name="DEOXO" />
    <Tag x={360} y={362} code="T-601 A/B" name="TSA DRYERS" />
  </Frame>;
}

export function Storage() {
  const tubes = [213, 249, 285, 321];
  return <Frame name="Schematic: a compressor and intercooler raise hydrogen pressure into a bank of storage tubes, monitored by a pressure transmitter, before distribution">
    <Line d="M20 150H90" s="h2" />
    <Line d="M150 150H200" s="h2" />
    <Line d="M240 150H300V321" s="h2" />
    {tubes.map(y => <Line key={y} d={`M300 ${y}H330`} s="h2" />)}
    {tubes.map(y => <Line key={`o${y}`} d={`M560 ${y}H580`} s="h2" />)}
    <Line d="M580 321V150H612" s="h2" /><Arrow x={620} y={150} s="h2" />
    <path className="dg-thin dg-cool" d="M220 130V110M220 170V190" />
    <circle className="dg-eq" cx="120" cy="150" r="30" />
    <path className="dg-thin" d="M98 130L142 140V160L98 170Z" />
    <circle className="dg-eq" cx="220" cy="150" r="20" />
    <path className="dg-thin dg-cool" d="M205 150l3-8l5 16l5-16l5 16l5-16l3 8" />
    {tubes.map(y => <rect key={y} className="dg-eq" x="330" y={y - 13} width="230" height="26" rx="13" />)}
    <Instrument x={540} y={110} code="PT" toY={150} />
    <Note x={20} y={135} anchor="start">H₂ IN</Note>
    <Note x={232} y={106} anchor="start">CW</Note>
    <Note x={612} y={135} anchor="end">TO DISTRIBUTION</Note>
    <Tag x={120} y={205} code="C-701" name="COMPRESSOR" />
    <Note x={120} y={238}>MULTI-STAGE</Note>
    <Tag x={220} y={226} code="E-701" name="INTERCOOLER" />
    <Tag x={445} y={356} code="TK-701" name="BUFFER STORAGE" />
  </Frame>;
}

function Wheels({ xs, y }: { xs: number[]; y: number }) {
  return <>{xs.map(x => <circle key={x} className="dg-eq" cx={x} cy={y} r="9" />)}</>;
}
export function Distribution() {
  return <Frame name="Schematic: hydrogen leaves storage by three routes, a compressed-gas tube trailer, a pipeline with an isolation valve, or liquefaction to a cryogenic tanker at about minus 253 degrees Celsius">
    <Line d="M90 210H120V86H232" s="h2" /><Arrow x={240} y={86} s="h2" />
    <Line d="M90 210H290M310 210H612" s="h2" /><Arrow x={620} y={210} s="h2" />
    <Line d="M90 210H120V340H180" s="h2" />
    <Line d="M270 340H297" s="h2" /><Arrow x={305} y={340} s="h2" />
    <rect className="dg-eq" x="30" y="170" width="60" height="80" rx="8" />
    {[64, 78, 92].map(y => <rect key={y} className="dg-eq" x="250" y={y} width="190" height="10" rx="5" />)}
    <path className="dg-thin" d="M245 108H475" />
    <rect className="dg-eq" x="475" y="72" width="50" height="36" rx="4" />
    <path className="dg-thin" d="M500 78H519V92H500Z" />
    <Wheels xs={[280, 305, 410, 500]} y={116} />
    <path className="dg-eq" d="M290 200L310 220V200L290 220Z" />
    <g className="dg-thin">{[180, 380, 440, 500, 560].map(x => <path key={x} d={`M${x} 222V230`} />)}</g>
    <rect className="dg-eq" x="180" y="315" width="90" height="50" />
    <path className="dg-thin" d="M225 326V354M213 333L237 347M213 347L237 333" />
    <rect className="dg-eq" x="305" y="318" width="170" height="40" rx="20" />
    <rect className="dg-eq dg-open" x="312" y="324" width="156" height="28" rx="14" />
    <rect className="dg-eq" x="480" y="322" width="48" height="36" rx="4" />
    <Wheels xs={[335, 360, 445, 505]} y={366} />
    <Tag x={60} y={272} name="H₂ STORAGE" />
    <Note x={250} y={48} anchor="start">TUBE TRAILER · COMPRESSED GAS</Note>
    <Note x={330} y={194} anchor="start">PIPELINE</Note>
    <Note x={300} y={244}>VALVE</Note>
    <Note x={600} y={194} anchor="end">TO CUSTOMER</Note>
    <Note x={180} y={300} anchor="start">LIQUID TANKER · ≈ −253 °C</Note>
    <Tag x={225} y={392} name="LIQUEFIER" />
  </Frame>;
}

export function EndUse() {
  return <Frame name="Schematic: hydrogen supply branches to industrial feedstock, fuel-cell vehicles and stationary fuel-cell power, where hydrogen and oxygen produce electricity, water and heat">
    <Line d="M20 210H120V90H220" s="h2" /><Arrow x={228} y={90} s="h2" />
    <Line d="M20 210H220" s="h2" /><Arrow x={228} y={210} s="h2" />
    <Line d="M20 210H120V330H220" s="h2" /><Arrow x={228} y={330} s="h2" />
    <path className="dg-eq" d="M232 120V80L264 62V80L296 62V80L328 62V120Z" />
    <path className="dg-thin" d="M244 104H256M268 104H280M292 104H304" />
    <rect className="dg-eq" x="232" y="185" width="110" height="46" rx="8" />
    <rect className="dg-eq" x="252" y="177" width="50" height="8" rx="3" />
    <rect className="dg-eq dg-open" x="242" y="193" width="80" height="14" />
    <Wheels xs={[258, 318]} y={234} />
    <rect className="dg-eq" x="232" y="300" width="90" height="60" />
    <g className="dg-thin">{[242, 250, 258, 266, 274, 282].map(x => <path key={x} d={`M${x} 310V350`} />)}</g>
    <path className="dg-bolt" d="M304 310L294 331H303L298 350L312 326H303Z" />
    <Note x={20} y={195} anchor="start">H₂ SUPPLY</Note>
    <Tag x={350} y={86} name="INDUSTRIAL FEEDSTOCK" anchor="start" />
    <Note x={350} y={104} anchor="start">AMMONIA · REFINING · STEEL</Note>
    <Tag x={362} y={206} name="FUEL-CELL VEHICLES" anchor="start" />
    <Note x={362} y={224} anchor="start">BUSES · TRUCKS · MATERIAL HANDLING</Note>
    <Tag x={342} y={326} name="STATIONARY POWER" anchor="start" />
    <Note x={342} y={344} anchor="start">BACKUP · OFF-GRID · PEAK SUPPORT</Note>
    <Note x={320} y={404}>2H₂ + O₂ → ELECTRICITY + 2H₂O + HEAT</Note>
  </Frame>;
}

export const sceneIllustrations = [Intake, Treatment, Power, Electrolysis, OxygenRecovery, Conditioning, Storage, Distribution, EndUse];
