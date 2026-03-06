// Percentage-based (0–100) x/y coordinates for each location on the game map image.
// Calibrated by clicking on the actual map.

export const mapPositions: Record<string, { x: number; y: number }> = {
  // === Western Europe ===
  'london':            { x: 18,   y: 33.8 },
  'amsterdam':         { x: 24.3, y: 29.9 },
  'rostock':           { x: 34,   y: 25   },

  // === France / Iberia ===
  'paris':             { x: 21.8, y: 41.5 },
  'strasbourg':        { x: 27.5, y: 44.6 },
  'avignon':           { x: 22.9, y: 57.2 },
  'granada':           { x: 13.6, y: 74   },

  // === Germany / Austria ===
  'rhenish-aachen':    { x: 25.7, y: 36.3 },
  'munich':            { x: 32.9, y: 44.9 },
  'prague':            { x: 36.3, y: 37.3 },
  'vienna':            { x: 39,   y: 43.6 },

  // === Eastern Europe ===
  'kaunas':            { x: 44.7, y: 23.6 },
  'krakow':            { x: 42.1, y: 37.4 },
  'budapest':          { x: 42,   y: 46.4 },
  'cluj-napoca':       { x: 46.4, y: 49   },
  'kiev':              { x: 51.5, y: 38.2 },

  // === Russia ===
  'leningrad':         { x: 47.5, y: 11.1 },
  'nizhny-novgorod':   { x: 62.1, y: 20.9 },
  'stalingrad':        { x: 65.4, y: 38.2 },
  'sverdlovsk':        { x: 82.2, y: 15.4 },

  // === Italy / Balkans ===
  'venice':            { x: 33,   y: 53.9 },
  'valletta':          { x: 34.1, y: 80.7 },
  'tirana':            { x: 41,   y: 66.8 },
  'candia-heraklion':  { x: 48.2, y: 82.3 },

  // === North Africa ===
  'marrakech':         { x: 6.7,  y: 90.8 },
  'algiers':           { x: 20.7, y: 77.1 },
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
  'sunshine-island':       { x: 35.5, y: 21.4 },
  'fogfire-point':         { x: 40.5, y: 2.8  },
  'priory-of-captains':    { x: 15.1, y: 46.1 },
  'wounded-moon-lake':     { x: 97.4, y: 2.5  },
  'tigers-nest':           { x: 99,   y: 79.2 },
  'pentapolis':            { x: 21.2, y: 87.7 },
  'hermitage-of-the-scythe': { x: 71.4, y: 96.9 },
};
