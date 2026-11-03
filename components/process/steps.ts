export const processSteps = [
  {
    id: 'water-supply', short: 'Water', label: 'Fresh water supply',
    title: 'It starts with water.',
    description: 'Water is drawn from a suitable source—like the lake in this illustration—and sent for treatment.',
  },
  {
    id: 'purification', short: 'Purify', label: 'Water purification',
    title: 'A cleaner beginning.',
    description: 'Filters, reverse osmosis, and deionization remove impurities and minerals, protecting the electrolyzer.',
  },
  {
    id: 'renewable-power', short: 'Power', label: 'Renewable power',
    title: 'Powered by nature.',
    description: 'Wind, solar, or hydropower supplies the electricity that makes this a green hydrogen pathway.',
  },
  {
    id: 'electrolysis', short: 'Split', label: 'Electrolysis',
    title: 'Water becomes two.',
    description: 'Electricity splits water into hydrogen and oxygen. A membrane keeps the gases apart as they follow separate paths.',
  },
  {
    id: 'oxygen', short: 'Oxygen', label: 'Oxygen recovery',
    title: 'Another useful outcome.',
    description: 'Oxygen can be collected and prepared for uses such as water treatment, glassmaking, and metals processing.',
  },
  {
    id: 'conditioning', short: 'Condition', label: 'Hydrogen conditioning',
    title: 'Ready for what’s next.',
    description: 'Moisture and trace impurities are removed. The hydrogen is checked for the quality its next job needs.',
  },
  {
    id: 'storage', short: 'Store', label: 'Compression & storage',
    title: 'More in less space.',
    description: 'Compression packs hydrogen into purpose-built vessels. Cooling manages the heat, while the hydrogen stays a gas.',
  },
  {
    id: 'delivery', short: 'Deliver', label: 'Delivery',
    title: 'On its way.',
    description: 'Hydrogen travels as compressed gas, through suitable pipelines, or as a liquid after separate cooling to about −253°C.',
  },
  {
    id: 'applications', short: 'Use', label: 'Real-world applications',
    title: 'Putting hydrogen to work.',
    description: 'Fuel-cell vehicles, industry, and stationary power. In a fuel cell, hydrogen becomes electricity, water, and heat.',
  },
] as const;
