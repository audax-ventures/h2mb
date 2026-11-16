export type ProcessSpec = { label: string; value: string };

export type ProcessStep = {
  id: string;
  label: string;
  figure: string;
  summary: string;
  detail: string;
  specs: ProcessSpec[];
  output: string;
};

export type ProcessPhase = {
  id: string;
  number: string;
  label: string;
  title: string;
  steps: ProcessStep[];
};

export const processPhases: ProcessPhase[] = [
  {
    id: 'inputs', number: '01', label: 'Inputs', title: 'Water and renewable power',
    steps: [
      {
        id: 'water-supply', label: 'Water intake', figure: 'Raw water intake',
        summary: 'Production starts with a reliable water supply. Water is drawn from a surface, ground or municipal source, screened, and pumped to treatment.',
        detail: 'Source quality sets the treatment train. Seawater or brackish water would need desalination first.',
        specs: [
          { label: 'Sources', value: 'Surface · ground · municipal' },
          { label: 'Consumption', value: '≈ 9 kg water per kg H₂ (stoichiometric)' },
        ],
        output: 'Raw water to treatment',
      },
      {
        id: 'purification', label: 'Feedwater treatment', figure: 'Feedwater treatment train',
        summary: 'Filtration, reverse osmosis and deionization remove particles, dissolved salts and ions. Ultra-pure feedwater protects the electrolyzer and extends stack life.',
        detail: 'Minerals left in the water cause scaling and degrade membranes. Conductivity is monitored continuously.',
        specs: [
          { label: 'Stages', value: 'Filtration → RO → deionization' },
          { label: 'Target', value: '< 1 µS/cm conductivity (typical PEM)' },
        ],
        output: 'Deionized feedwater',
      },
      {
        id: 'renewable-power', label: 'Renewable power', figure: 'Power supply, single-line',
        summary: 'Electricity is the largest input. Renewable generation such as Manitoba’s hydroelectricity, wind or solar is converted from AC to DC for the electrolyzer.',
        detail: 'Renewable supply is what makes the hydrogen green. Equipment and delivery still carry lifecycle emissions.',
        specs: [
          { label: 'Sources', value: 'Hydro · wind · solar' },
          { label: 'Conversion', value: 'Transformer → rectifier (AC → DC)' },
          { label: 'Demand', value: '≈ 50–55 kWh per kg H₂ (typical system)' },
        ],
        output: 'DC power to the stack',
      },
    ],
  },
  {
    id: 'production', number: '02', label: 'Production', title: 'Electrolysis and gas conditioning',
    steps: [
      {
        id: 'electrolysis', label: 'Electrolysis', figure: 'PEM electrolysis cell',
        summary: 'Direct current splits water into hydrogen and oxygen. In a PEM cell, protons cross a thin membrane, so the two gases form on opposite sides and leave separately.',
        detail: 'Oxygen evolves at the anode and hydrogen at the cathode. PEM is shown; alkaline and solid-oxide electrolyzers also exist.',
        specs: [
          { label: 'Reaction', value: '2H₂O → 2H₂ + O₂' },
          { label: 'Technology', value: 'Proton exchange membrane (PEM)' },
          { label: 'Outlet pressure', value: 'Up to ≈ 30 bar (typical PEM)' },
        ],
        output: 'Separate H₂ and O₂ streams',
      },
      {
        id: 'oxygen', label: 'Oxygen recovery', figure: 'Oxygen recovery',
        summary: 'Every kilogram of hydrogen yields about eight kilograms of oxygen. Where there is demand, it can be dried and stored as a co-product rather than vented.',
        detail: 'Recovery depends on local offtake and the purity each use requires.',
        specs: [
          { label: 'Co-product', value: '≈ 8 kg O₂ per kg H₂' },
          { label: 'Markets', value: 'Water treatment · glass · metals' },
        ],
        output: 'Oxygen for selected uses, or safe venting',
      },
      {
        id: 'conditioning', label: 'Hydrogen conditioning', figure: 'Hydrogen purification',
        summary: 'Hydrogen leaves the stack wet and with trace oxygen. Separation, catalytic deoxidation and drying bring it to the purity its end use requires.',
        detail: 'An online analyzer verifies quality before the gas moves to compression.',
        specs: [
          { label: 'Stages', value: 'Separator → deoxo → dryer' },
          { label: 'Fuel-cell grade', value: '≥ 99.97 % H₂ (ISO 14687)' },
        ],
        output: 'Dry, purified hydrogen',
      },
    ],
  },
  {
    id: 'delivery', number: '03', label: 'Delivery', title: 'Storage, transport and end use',
    steps: [
      {
        id: 'storage', label: 'Compression & storage', figure: 'Compression and storage',
        summary: 'Multi-stage compressors raise the pressure, with intercooling between stages. The hydrogen remains a gas and is held in purpose-built vessels.',
        detail: 'Pressure is set by the storage system and the end use. There is no single pressure for every application.',
        specs: [
          { label: 'Compression', value: 'Multi-stage with intercooling' },
          { label: 'Vehicle refuelling', value: '350 or 700 bar' },
        ],
        output: 'Compressed hydrogen in storage',
      },
      {
        id: 'delivery', label: 'Distribution', figure: 'Distribution pathways',
        summary: 'Hydrogen reaches customers as compressed gas in tube trailers, through dedicated pipelines, or as a liquid after cooling to about −253 °C.',
        detail: 'The right pathway depends on volume, distance and how the hydrogen will be used.',
        specs: [
          { label: 'Modes', value: 'Tube trailer · pipeline · liquid tanker' },
          { label: 'Liquid H₂', value: '≈ −253 °C, cryogenic tanks' },
        ],
        output: 'Hydrogen at the point of use',
      },
      {
        id: 'applications', label: 'End use', figure: 'End-use applications',
        summary: 'Hydrogen can replace fossil-derived feedstock in industry or power fuel cells in vehicles and stationary systems. A fuel cell’s only by-products are water and heat.',
        detail: 'Each application needs suitable infrastructure, so supply and demand are planned together.',
        specs: [
          { label: 'Markets', value: 'Industry · transport · power' },
          { label: 'Fuel cell', value: '2H₂ + O₂ → electricity + 2H₂O + heat' },
        ],
        output: 'Useful energy and industrial feedstock',
      },
    ],
  },
];

export const processSteps = processPhases.flatMap(phase => phase.steps.map(step => ({ ...step, phase })));
