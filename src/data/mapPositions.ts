// Percentage-based (0–100) x/y coordinates for each location on the game map image.
// Calibrated by clicking on the actual map, then collision-resolved.

export const mapPositions: Record<string, { x: number; y: number }> = {
  // === Western Europe ===
  'london':            { x: 15.4, y: 28.9 },
  'amsterdam':         { x: 24.5, y: 25.1 },
  'rostock':           { x: 34.7, y: 21.9 },

  // === France / Iberia ===
  'paris':             { x: 17.9, y: 40.6 },
  'strasbourg':        { x: 23.7, y: 49.7 },
  'avignon':           { x: 21.5, y: 59.7 },
  'granada':           { x: 12,   y: 73.6 },

  // === Germany / Austria ===
  'rhenish-aachen':    { x: 26.3, y: 35.2 },
  'munich':            { x: 32.5, y: 44.4 },
  'prague':            { x: 34.6, y: 32.1 },
  'vienna':            { x: 40.9, y: 41.7 },

  // === Eastern Europe ===
  'kaunas':            { x: 44.5, y: 22   },
  'krakow':            { x: 43.5, y: 32.6 },
  'budapest':          { x: 43,   y: 51.1 },
  'cluj-napoca':       { x: 51.7, y: 52.4 },
  'kiev':              { x: 54.5, y: 37.4 },

  // === Russia ===
  'leningrad':         { x: 49.5, y: 12.2 },
  'nizhny-novgorod':   { x: 62.1, y: 20.9 },
  'stalingrad':        { x: 65.4, y: 38.2 },
  'sverdlovsk':        { x: 82.2, y: 15.4 },

  // === Italy / Balkans ===
  'venice':            { x: 31.3, y: 59.3 },
  'valletta':          { x: 33.3, y: 77.4 },
  'tirana':            { x: 41,   y: 66.8 },
  'candia-heraklion':  { x: 48.2, y: 80.8 },

  // === North Africa ===
  'marrakech':         { x: 6.7,  y: 90.8 },
  'algiers':           { x: 21.5, y: 75.9 },
  'tripoli':           { x: 31.9, y: 88.1 },

  // === South Mediterranean ===
  'istanbul':          { x: 51.7, y: 65.5 },
  'alexandria':        { x: 54.5, y: 90.2 },

  // === Middle East ===
  'tiflis':            { x: 69.1, y: 57.5 },
  'baghdad':           { x: 72.7, y: 82.3 },
  'meshad':            { x: 88.9, y: 69.6 },
  'samarkand':         { x: 95.3, y: 58.2 },

  // === Map Edge locations ===
  'sunshine-island':       { x: 27.9, y: 10.7 },
  'fogfire-point':         { x: 40.5, y: 4.4  },
  'priory-of-captains':    { x: 12.7, y: 54   },
  'wounded-moon-lake':     { x: 95.9, y: 4.4  },
  'tigers-nest':           { x: 95.9, y: 79.2 },
  'pentapolis':            { x: 21.2, y: 87.7 },
  'hermitage-of-the-scythe': { x: 71.4, y: 95.6 },
};
