import type { ReactNode } from 'react';

const water = '#65c9e8', hydrogen = '#c5e77d', oxygen = '#eb9d7d', ink = '#244b49';
function Pipe({ d, color = water, dashed = false }: { d: string; color?: string; dashed?: boolean }) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={d} stroke="#224c4930" strokeWidth="20" /><path d={d} stroke={color} strokeWidth="10" className={dashed ? 'diagram-flow' : undefined} /></g>;
}
function Label({ x, y, children, color = ink }: { x: number; y: number; children: ReactNode; color?: string }) { return <text x={x} y={y} fill={color} textAnchor="middle" className="diagram-label">{children}</text>; }
function Tree({ x, y, size = 1 }: { x: number; y: number; size?: number }) { return <g transform={`translate(${x} ${y}) scale(${size})`}><path d="M0 0V-100" stroke="#536f53" strokeWidth="8" /><path d="M-42-35L0-115L42-35ZM-32-72L0-140L32-72Z" fill="#6d9971" /><path d="M0-140L32-72H0V-35H42L0-115" fill="#4a795b" /></g>; }
function Tank({ x, y, color = hydrogen, label = 'H₂', height = 170 }: { x: number; y: number; color?: string; label?: string; height?: number }) {
  return <g transform={`translate(${x} ${y})`}><rect x="-25" y="0" width="50" height={height} rx="22" fill="#f4f7ed" stroke={ink} strokeWidth="2" /><rect x="-19" y="16" width="38" height={height-28} rx="17" fill={color} fillOpacity=".7" /><path d="M-10-8H10M0-8V0" stroke={ink} strokeWidth="6" /><Label x={0} y={height/2+5}>{label}</Label><path d={`M-20 ${height-18}H20`} stroke={ink} strokeOpacity=".25" /></g>;
}
function Base({ children, name }: { children: ReactNode; name: string }) { return <svg className="process-diagram" viewBox="0 0 600 500" role="img" aria-label={name}><ellipse cx="300" cy="420" rx="235" ry="26" fill="#183f3720" />{children}</svg>; }
export function Lake() { return <Base name="Illustrated forest lake with an intake pipe carrying raw water toward treatment">
  <path d="M45 275Q140 175 290 230T560 285L550 385Q280 450 35 365Z" fill="#bed4a5" />
  <Tree x={80} y={265} size={1.1} /><Tree x={150} y={225} size={.8} /><Tree x={495} y={255} size={1.25} /><Tree x={440} y={220} size={.75} />
  <path d="M75 300Q145 242 285 267T530 300Q548 335 465 370T190 383Q55 370 75 300Z" fill="#759ca7" stroke="#d9e6c5" strokeWidth="10" />
  <g className="lake-ripples" fill="none" stroke="#c4dde0" strokeWidth="3"><path d="M125 310Q175 300 225 310M290 320Q350 310 410 320M180 351Q240 341 300 351M350 350Q390 340 430 350" /></g>
  <g className="raw-minerals" fill="#556e6b">{[[155,325],[260,295],[330,360],[405,306],[210,375]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={4} />)}</g>
  <Pipe d="M320 330V400Q320 430 350 430H520" color="#759ca7" dashed /><rect x="303" y="309" width="34" height="35" rx="5" fill="#dbe8e1" stroke={ink} strokeWidth="2" /><path d="M309 317H331M309 325H331M309 333H331" stroke={ink} strokeWidth="2" />
  <Label x={300} y={175}>A SUITABLE WATER SOURCE</Label><Label x={470} y={463}>TO TREATMENT →</Label>
</Base>; }
export function Purification() { return <Base name="Raw water passes through filtration, reverse osmosis and deionization, changing to clear blue">
  <defs><linearGradient id="purifying-water" gradientUnits="userSpaceOnUse" x1="35" y1="270" x2="565" y2="270"><stop stopColor="#759ca7" /><stop offset=".45" stopColor="#92bfd2" /><stop offset="1" stopColor="#4dc7f1" /></linearGradient></defs>
  <Pipe d="M35 270H565" color="url(#purifying-water)" dashed />
  {[{x:90,name:'FILTER',c:'#8ba8a8'},{x:250,name:'RO MEMBRANE',c:'#83bdce'},{x:410,name:'DEIONIZATION',c:'#5fcff4'}].map(({x,name,c},i)=><g key={name}>
    <rect x={x} y="145" width="105" height="225" rx="25" fill="#f4f7ed" stroke={ink} strokeWidth="3" /><rect className={`purifying-column-${i}`} x={x+13} y="165" width="79" height="183" rx="16" fill={c} fillOpacity=".65" />
    {Array.from({length:6},(_,j)=><path key={j} d={`M${x+20} ${185+j*25}H${x+85}`} stroke={i===0?'#607875':'#e9f7f7'} strokeWidth={i===0?6:3} />)}
    <rect x={x+22} y="132" width="61" height="22" rx="5" fill="#426661" /><Label x={x+52} y={403}>{name}</Label>
  </g>)}
  <g className="purification-impurities" fill="#5b746c">{[[120,203],[164,234],[143,285],[175,311],[281,200],[310,302]].map(([x,y],i)=><circle cx={x} cy={y} r="5" key={i} />)}</g>
  <g className="clean-water-bubbles" fill="#dff9ff">{[190,240,290,325].map(y=><circle cx="461" cy={y} r="6" key={y} />)}</g>
  <Label x={300} y={88}>PROTECTING THE ELECTROLYZER</Label>
</Base>; }
export function Renewables() { return <Base name="Wind, solar and hydropower supply electricity through power electronics to electrolysis">
  <path d="M40 355Q150 300 280 350T570 355V415H40Z" fill="#cbdcb1" />
  <g transform="translate(165 180)"><path d="M0 0L-10 180H10Z" fill="#dce4da" stroke={ink} strokeWidth="2" /><g className="wind-rotor">{[0,120,240].map(angle=><path key={angle} transform={`rotate(${angle})`} d="M0-5L-8-95Q-5-120 2-112L12-35Z" fill="#f5f8ef" stroke={ink} strokeWidth="2" />)}<circle r="12" fill={ink} /></g></g>
  <g transform="translate(320 235)"><path d="M0 0H170L200 95H-25Z" fill="#366984" stroke="#ecf2e9" strokeWidth="5" /><g stroke="#b2d6e2" strokeWidth="2"><path d="M-8 32H180M-17 64H191M42 0L37 95M85 0V95M127 0L139 95" /></g><path d="M20 97V125M165 97V125" stroke={ink} strokeWidth="7" /></g>
  <circle cx="430" cy="100" r="30" fill="#e5d996" /><path d="M430 53V42M430 158V148M383 100H372M487 100H477M396 66L388 58M463 133L471 141" stroke="#d1c480" strokeWidth="3" />
  <Pipe d="M165 365V410H290V380H370" color={hydrogen} dashed /><rect x="370" y="358" width="145" height="62" rx="9" fill="#f6f8ef" stroke={ink} strokeWidth="2" /><Label x={441} y={385}>POWER ELECTRONICS</Label><Label x={441} y={407}>AC → DC ⚡</Label>
  <path d="M65 270Q85 250 105 270M65 285Q85 265 105 285M65 300Q85 280 105 300" stroke={water} strokeWidth="6" fill="none" /><Label x={85} y={330}>HYDRO</Label>
</Base>; }
export function Electrolyzer() { return <Base name="Simplified PEM electrolyzer: hydrogen forms at the negative cathode on the left, oxygen at the positive anode on the right, separated by a membrane">
  <Pipe d="M440 80V150" dashed /><Label x={440} y={65}>PURIFIED WATER ↓</Label>
  <rect x="120" y="150" width="360" height="230" rx="24" fill="#edf7ef" stroke={ink} strokeWidth="3" /><rect x="145" y="177" width="135" height="175" rx="12" fill="#c5e77d44" /><rect x="320" y="177" width="135" height="175" rx="12" fill="#65c9e84d" />
  <rect x="192" y="190" width="15" height="140" rx="4" fill="#456961" /><rect x="393" y="190" width="15" height="140" rx="4" fill="#456961" /><rect x="290" y="168" width="20" height="195" rx="4" fill="#e0d597" />
  <path d="M200 190V108H400V190" stroke={ink} strokeWidth="4" fill="none" /><rect x="268" y="89" width="65" height="38" rx="6" fill={hydrogen} stroke={ink} strokeWidth="2" /><Label x={300} y={114}>DC ⚡</Label>
  <Label x={175} y={184}>−</Label><Label x={425} y={184}>+</Label><Label x={201} y={405}>CATHODE</Label><Label x={400} y={405}>ANODE</Label>
  <g className="reaction-hydrogen" fill={hydrogen} stroke="#5d873a" strokeWidth="1.5">{[0,1,2,3].map(i=><g key={i} transform={`translate(${226+(i%2)*25} ${220+i*31})`}><circle r="8" /><circle cx="10" r="8" /></g>)}</g>
  <g className="reaction-oxygen" fill={oxygen} stroke="#b57257" strokeWidth="1.5">{[0,1,2].map(i=><g key={i} transform={`translate(350 ${225+i*40})`}><circle r="9" /><circle cx="12" r="9" /></g>)}</g>
  <g className="ion-crossing"><path d="M365 270H240" stroke="#b3984d" strokeWidth="2" strokeDasharray="5 7" /><circle cx="300" cy="270" r="12" fill="#f9f1c5" stroke="#b3984d" /><Label x={300} y={275}>H⁺</Label></g>
  <Pipe d="M150 330H70V430H20" color={hydrogen} dashed /><Pipe d="M450 330H530V430H580" color={oxygen} dashed /><Label x={64} y={465}>H₂ ←</Label><Label x={535} y={465}>→ O₂</Label>
  <path d="M300 365V430" stroke="#9b8a4b" strokeWidth="1.5" /><Label x={300} y={454}>SELECTIVE MEMBRANE</Label>
</Base>; }
export function OxygenRecovery() { return <Base name="Oxygen flows into separate cylinders and can serve wastewater treatment, glass manufacturing and metals processing after suitable conditioning">
  <Pipe d="M560 100H510V188H130V218" color={oxygen} dashed /><Label x={395} y={78}>FROM THE OXYGEN OUTLET</Label>
  {[140,215,290].map((x,i)=><g key={x}><Pipe d={`M${x} 188V220`} color={oxygen} /><Tank x={x} y={220} color={oxygen} label="O₂" height={172-i*8} /></g>)}
  <g transform="translate(370 220)"><rect width="145" height="158" rx="13" fill="#f7f4e9" stroke={ink} strokeWidth="2" /><path d="M15 38H130M15 83H130M15 126H130" stroke="#d5d7c5" /><Label x={72} y={27}>POTENTIAL USES</Label><Label x={72} y={66}>WATER TREATMENT</Label><Label x={72} y={109}>GLASS</Label><Label x={72} y={150}>METALS</Label></g>
  <Pipe d="M20 425H580" color={hydrogen} dashed /><Label x={300} y={465}>H₂ CONTINUES TO CONDITIONING →</Label>
</Base>; }
export function Conditioning() { return <Base name="Hydrogen passes through a separator, purification stage, and dryers, with moisture removed and quality checked">
  <Pipe d="M25 270H570" color={hydrogen} dashed />
  {[{x:105,n:'SEPARATOR',h:155},{x:260,n:'DEOXO',h:190},{x:415,n:'DRYER',h:220}].map(({x,n,h},i)=><g key={n}><rect x={x} y={370-h} width="95" height={h} rx="24" fill="#f2f5ea" stroke={ink} strokeWidth="2" /><rect x={x+12} y={385-h} width="71" height={h-32} rx="18" fill={hydrogen} fillOpacity=".38" />{i===2&&[190,216,242,268,294,320].map(y=><path key={y} d={`M${x+17} ${y}H${x+78}`} stroke="#779963" strokeWidth="4" strokeDasharray="3 6" />)}<Label x={x+47} y={401}>{n}</Label></g>)}
  <g className="moisture-drops" fill={water}><path d="M140 289q-18 25 0 25q18 0 0-25M176 316q-13 20 0 20q13 0 0-20M300 246q-12 18 0 18q12 0 0-18" /></g>
  <path d="M152 370V430H95" stroke="#79a7b1" strokeWidth="7" fill="none" /><Label x={123} y={460}>MOISTURE OUT</Label><circle cx="475" cy="100" r="26" fill={hydrogen} /><path d="M461 100L472 111L489 88" stroke={ink} strokeWidth="4" fill="none" /><Label x={300} y={75}>CHECK QUALITY FOR THE INTENDED USE</Label>
</Base>; }
export function Storage() { return <Base name="Hydrogen passes through a compressor and cooling stage into engineered compressed-gas storage vessels">
  <Pipe d="M20 255H100M260 255H328V190H520" color={hydrogen} dashed /><rect x="100" y="190" width="160" height="155" rx="14" fill="#e7ece1" stroke={ink} strokeWidth="3" />
  <circle cx="180" cy="250" r="43" fill="#f7f9ee" stroke={ink} strokeWidth="2" /><g className="compressor-rotor"><path d="M180 210V290M140 250H220M152 222L208 278M152 278L208 222" stroke="#7c9b71" strokeWidth="7" /></g><circle cx="180" cy="250" r="12" fill={ink} /><Label x={180} y={326}>COMPRESSOR</Label>
  <path d="M119 358H240M130 369H230M145 380H215" stroke={water} strokeWidth="4" /><Label x={180} y={409}>COOLING</Label>
  {[365,435,505].map(x=><g key={x}><Pipe d={`M${x} 190V215`} color={hydrogen} /><Tank x={x} y={220} height={185} /></g>)}
  <g transform="translate(285 100)"><circle r="40" fill="#f9faef" stroke={ink} strokeWidth="2" /><path d="M-28 0A28 28 0 0 1 28 0" stroke="#b2c9a1" strokeWidth="7" fill="none" /><g className="pressure-needle"><path d="M0 0L22-22" stroke={ink} strokeWidth="3" /></g><circle r="5" fill={ink} /></g><Label x={300} y={465}>STORED AS A GAS · PRESSURE SUITS THE SYSTEM</Label>
</Base>; }
function Truck({ x, y, liquid = false }: { x: number; y: number; liquid?: boolean }) { return <g transform={`translate(${x} ${y})`}><path d="M0 70H285V125H0Z" fill="#527669" /><path d="M223 38H265L289 75V114H215V38Z" fill="#d7e4d1" stroke={ink} strokeWidth="2" /><path d="M234 48H259L276 72H234Z" fill="#6c9caa" />{liquid?<rect x="4" y="25" width="199" height="75" rx="36" fill="#e7f0f0" stroke={ink} strokeWidth="2" />:[27,49,71].map(y=><rect key={y} x="5" y={y} width="197" height="19" rx="9" fill={hydrogen} stroke={ink} strokeWidth="1.5" />)}<Label x={100} y={liquid?72:62}>{liquid?'LIQUID H₂':'H₂'}</Label>{[43,184,253].map(x=><g key={x}><circle cx={x} cy="123" r="18" fill={ink} /><circle cx={x} cy="123" r="8" fill="#cbd8ca" /></g>)}</g>; }
export function Delivery() { return <Base name="Two alternative delivery paths: a compressed-gas tube trailer and a cryogenic liquid hydrogen tanker at approximately minus 253 degrees Celsius">
  <Pipe d="M50 100H150Q180 100 180 130V160M150 100H480V315" color={hydrogen} dashed />
  <g className="delivery-truck"><Truck x={65} y={145} /></g><Label x={220} y={125}>COMPRESSED-GAS DELIVERY</Label>
  <g className="delivery-truck alternate"><Truck x={245} y={295} liquid /></g><Label x={385} y={285}>OPTIONAL LIQUEFACTION · ≈ −253°C</Label>
  <path d="M35 450H565" stroke="#7d9485" strokeWidth="3" /><path d="M35 463H565" stroke="#7d9485" strokeWidth="2" strokeDasharray="22 14" />
  <Label x={125} y={350}>SUITABLE PIPELINES</Label><path d="M40 375H195V415" stroke="#64846f" strokeWidth="13" fill="none" /><path d="M40 375H195V415" stroke={hydrogen} strokeWidth="6" fill="none" />
</Base>; }
export function Applications() { return <Base name="Hydrogen powers a fuel-cell bus, supports industrial production and stationary electricity, while a fuel cell releases water and heat">
  <path d="M50 105H140V240H50Z M140 150L190 120V240H140Z M190 160L245 130V240H190Z" fill="#bed0c6" stroke="#7e9b8c" strokeWidth="2" /><path d="M65 85H85V105H65Z" fill="#91a99d" /><g fill="#70928a">{[70,105,160,207].map(x=><rect key={x} x={x} y="183" width="17" height="24" />)}</g><Label x={150} y={270}>INDUSTRY</Label>
  <g transform="translate(365 135)"><rect width="125" height="100" rx="12" fill="#edf2e5" stroke={ink} strokeWidth="2" /><path d="M69 15L40 54H63L53 86L86 43H64Z" fill="#96ba62" /><Label x={62} y={135}>STATIONARY POWER</Label></g>
  <g className="fuel-cell-bus" transform="translate(95 300)"><rect width="355" height="105" rx="22" fill="#d8ebaf" stroke={ink} strokeWidth="3" /><rect x="15" y="15" width="270" height="40" rx="9" fill="#315966" /><path d="M80 15V55M145 15V55M210 15V55" stroke="#d8ebaf" strokeWidth="5" /><rect x="298" y="20" width="35" height="70" rx="4" fill="#9bbbad" stroke={ink} strokeWidth="2" /><Label x={150} y={85}>H₂ · FUEL-CELL ELECTRIC</Label>{[65,270].map(x=><g key={x}><circle cx={x} cy="105" r="23" fill={ink} /><circle cx={x} cy="105" r="10" fill="#d9e7d2" /></g>)}</g>
  <g className="water-return" fill={water}><path d="M495 350q-20 30 0 30q20 0 0-30M535 370q-14 22 0 22q14 0 0-22" /></g><Label x={510} y={425}>WATER</Label><Label x={300} y={475}>ELECTRICITY + WATER + HEAT</Label>
</Base>; }
export const sceneIllustrations = [Lake, Purification, Renewables, Electrolyzer, OxygenRecovery, Conditioning, Storage, Delivery, Applications];

export function Landscape() { return <svg className="process-landscape" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs><linearGradient id="land-sky" x2="0" y2="1"><stop stopColor="#e7eedc" /><stop offset="1" stopColor="#d0e2cf" /></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#land-sky)" /><circle cx="1250" cy="175" r="66" fill="#f1e9bc" opacity=".7" />
  <g className="forest-world"><path d="M0 460Q250 230 530 400T1050 400T1600 420V900H0" fill="#a9c29b" opacity=".4" /><path d="M0 640Q400 350 750 620T1600 530V900H0" fill="#93b693" opacity=".5" />{Array.from({length:19},(_,i)=><Tree x={i*95-30} y={800+(i%3)*25} size={1.1+(i%4)*.35} key={i} />)}<path d="M0 840Q400 780 800 850T1600 810V900H0" fill="#7ea5ab" opacity=".5" /></g>
  <g className="urban-world"><path d="M0 700H90V520H175V700H230V400H335V700H400V555H525V700H615V470H740V700H900V540H980V700H1070V410H1190V700H1300V505H1400V700H1490V445H1600V900H0Z" fill="#9db3af" opacity=".6" />{Array.from({length:22},(_,i)=><rect key={i} x={55+i*74} y={625-(i%3)*25} width="18" height="35" fill="#d6e3d5" opacity=".8" />)}<path d="M0 810H1600V900H0" fill="#8da69c" opacity=".5" /><path d="M0 850H1600" stroke="#edf2dc" strokeDasharray="50 35" strokeWidth="4" /></g>
</svg>; }
