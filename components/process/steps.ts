export const processSteps = [
  {
    id: 'water-supply', short: 'Water', title: 'Every journey starts with water.', label: 'Fresh water supply',
    description: 'Our illustrated journey begins at a lake. In practice, a suitable supply might come from municipal water, surface water, groundwater, or treated wastewater. Seawater requires desalination and further treatment.',
    detail: 'The source determines the treatment. Responsible intake, local water availability, and water quality all matter.',
    note: 'The lake is illustrative, not a confirmed H2MB water source.', signal: 'H₂O', caption: 'Raw water · ready for treatment',
  },
  {
    id: 'purification', short: 'Purify', title: 'Clear water. A clean start.', label: 'Water purification',
    description: 'Filtration removes suspended material. Reverse osmosis and deionization can then remove dissolved salts and minerals, preparing high-purity water to meet the electrolyzer’s specifications.',
    detail: 'Calcium, magnesium, and other contaminants can cause scaling or damage. Water quality is checked before it enters the equipment.',
    note: 'The colour change illustrates purification. Dissolved minerals are not necessarily visible.', signal: 'H₂O', caption: 'Filter → reverse osmosis → deionization',
  },
  {
    id: 'renewable-power', short: 'Power', title: 'The power behind “green.”', label: 'Renewable energy input',
    description: 'Electricity from renewable sources such as hydropower, wind, and solar supplies the energy for electrolysis. Power electronics convert that electricity into the direct current the electrolyzer needs.',
    detail: 'The electricity source is central to hydrogen’s emissions footprint. Renewable production can be very low-carbon, but equipment and delivery still have lifecycle impacts.',
    note: 'Green hydrogen describes the production pathway, not the colour of the gas.', signal: 'DC', caption: 'Renewable electricity → controlled direct current',
  },
  {
    id: 'electrolysis', short: 'Split', title: 'One molecule. Two new paths.', label: 'Electrolysis',
    description: 'Inside an electrolyzer, electricity drives a reaction that splits water into hydrogen and oxygen. Hydrogen forms at the negative electrode, the cathode. Oxygen forms at the positive electrode, the anode.',
    detail: 'In this simplified PEM example, a membrane lets hydrogen ions pass while keeping the product gases separate. The lime and coral streams follow different paths.',
    note: 'Simplified PEM illustration. Other electrolyzer technologies arrange the process differently.', signal: 'H₂ + O₂', caption: '2H₂O + electricity → 2H₂ + O₂',
  },
  {
    id: 'oxygen', short: 'Oxygen', title: 'A second useful stream.', label: 'Oxygen recovery',
    description: 'Oxygen leaves through its own outlet. Where there is a suitable market, it can be conditioned, checked against required specifications, and collected separately for use.',
    detail: 'Potential applications include wastewater treatment, glass manufacturing, and metals processing. Recovery is a project-specific choice—not an automatic part of every plant.',
    note: 'Illustrated oxygen is not medical-grade. Each application requires appropriate quality controls.', signal: 'O₂', caption: 'A separate stream · a separate opportunity',
  },
  {
    id: 'conditioning', short: 'Condition', title: 'Preparing hydrogen for its next job.', label: 'Drying & purification',
    description: 'Hydrogen leaving the electrolyzer can carry moisture and trace impurities. Gas-liquid separation, drying, and purification prepare it for the requirements of its intended use.',
    detail: 'Where needed, a catalytic deoxo stage converts residual oxygen to water. Dryers then remove moisture, and quality checks verify the finished gas.',
    note: 'The treatment train and purity target depend on the electrolyzer and end use.', signal: 'H₂', caption: 'Separate → purify → dry → verify',
  },
  {
    id: 'storage', short: 'Store', title: 'More energy in less space.', label: 'Compression & storage',
    description: 'Hydrogen gas is very light. Compression lets a useful quantity fit into purpose-built storage vessels. Cooling manages the heat generated during compression.',
    detail: 'The storage pressure depends on the system. For context, many fuel-cell vehicles store hydrogen at 350 or 700 bar; these are not universal production or transport pressures.',
    note: 'Compressed hydrogen remains a gas. Compression does not turn it into liquid hydrogen.', signal: 'H₂', caption: 'Compressed gas · engineered storage',
  },
  {
    id: 'delivery', short: 'Deliver', title: 'The right route to the right place.', label: 'Delivery pathways',
    description: 'Hydrogen can move in compressed-gas tube trailers or through suitable hydrogen pipelines. Another option is liquefaction, a separate, energy-intensive process that cools hydrogen to about −253°C for cryogenic storage and transport.',
    detail: 'Distance, demand, infrastructure, and energy use help determine the delivery pathway. Liquid hydrogen is an alternative—not a mandatory next step after compression.',
    note: 'The routes shown are educational options, not confirmed H2MB delivery services.', signal: 'H₂', caption: 'Compressed gas or cryogenic liquid',
  },
  {
    id: 'applications', short: 'Use', title: 'A new chapter for familiar things.', label: 'Real-world applications',
    description: 'Hydrogen can power fuel-cell buses and suitable fleets, provide an industrial feedstock, or support stationary fuel-cell power. Each application needs the right equipment, supply, and economics.',
    detail: 'In a fuel cell, hydrogen reacts with oxygen from the air to produce electricity, water, and heat. The electricity powers the motor—bringing our story from water to movement.',
    note: 'Hydrogen and oxygen are colourless. Colours throughout this journey distinguish the streams.', signal: 'H₂O', caption: 'Hydrogen + oxygen → electricity + water + heat',
  },
] as const;
