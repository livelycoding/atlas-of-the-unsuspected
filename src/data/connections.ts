import { Connection } from './types';

// All bidirectional connections between regular locations
export const connections: Connection[] = [
  // Row 0 internal
  { from: 'london', to: 'amsterdam' },

  // Row 0 → Row 1
  { from: 'london', to: 'paris' },
  { from: 'amsterdam', to: 'rostock' },
  { from: 'amsterdam', to: 'rhenish-aachen' },
  { from: 'rostock', to: 'prague' },
  { from: 'rostock', to: 'kaunas' },

  // Row 1 internal
  { from: 'paris', to: 'rhenish-aachen' },
  { from: 'rhenish-aachen', to: 'prague' },
  { from: 'prague', to: 'kaunas' },
  { from: 'kaunas', to: 'leningrad' },
  { from: 'leningrad', to: 'nizhny-novgorod' },

  // Row 1 → Row 2
  { from: 'paris', to: 'strasbourg' },
  { from: 'rhenish-aachen', to: 'munich' },
  { from: 'rhenish-aachen', to: 'strasbourg' },
  { from: 'prague', to: 'vienna' },
  { from: 'kaunas', to: 'krakow' },
  { from: 'leningrad', to: 'kiev' },
  { from: 'nizhny-novgorod', to: 'stalingrad' },
  { from: 'nizhny-novgorod', to: 'sverdlovsk' },

  // Row 2 internal
  { from: 'munich', to: 'vienna' },
  { from: 'vienna', to: 'krakow' },
  { from: 'krakow', to: 'kiev' },
  { from: 'kiev', to: 'stalingrad' },
  { from: 'stalingrad', to: 'sverdlovsk' },

  // Row 2 → Row 3
  { from: 'strasbourg', to: 'granada' },
  { from: 'strasbourg', to: 'munich' },
  { from: 'munich', to: 'avignon' },
  { from: 'vienna', to: 'venice' },
  { from: 'krakow', to: 'budapest' },
  { from: 'kiev', to: 'cluj-napoca' },
  { from: 'stalingrad', to: 'tiflis' },
  { from: 'sverdlovsk', to: 'samarkand' },

  // Row 3 internal
  { from: 'granada', to: 'avignon' },
  { from: 'avignon', to: 'venice' },
  { from: 'venice', to: 'budapest' },
  { from: 'budapest', to: 'cluj-napoca' },
  { from: 'cluj-napoca', to: 'tiflis' },
  { from: 'tiflis', to: 'samarkand' },

  // Row 3 → Row 4
  { from: 'granada', to: 'marrakech' },
  { from: 'avignon', to: 'algiers' },
  { from: 'venice', to: 'valletta' },
  { from: 'budapest', to: 'tirana' },
  { from: 'cluj-napoca', to: 'istanbul' },
  { from: 'tiflis', to: 'baghdad' },
  { from: 'samarkand', to: 'meshad' },

  // Row 4 internal
  { from: 'marrakech', to: 'algiers' },
  { from: 'algiers', to: 'valletta' },
  { from: 'valletta', to: 'tirana' },
  { from: 'tirana', to: 'istanbul' },
  { from: 'istanbul', to: 'baghdad' },
  { from: 'baghdad', to: 'meshad' },

  // Row 4 → Row 5
  { from: 'algiers', to: 'tripoli' },
  { from: 'valletta', to: 'tripoli' },
  { from: 'tirana', to: 'candia-heraklion' },
  { from: 'istanbul', to: 'alexandria' },

  // Row 5 internal
  { from: 'tripoli', to: 'candia-heraklion' },
  { from: 'candia-heraklion', to: 'alexandria' },

  // Row 5 cross-connections
  { from: 'alexandria', to: 'baghdad' },
];

// Edge connections (regular location → map's edge location)
export const edgeConnections: Connection[] = [
  // Sunshine Island
  { from: 'london', to: 'sunshine-island' },
  { from: 'amsterdam', to: 'sunshine-island' },
  { from: 'rostock', to: 'sunshine-island' },

  // Fogfire Point
  { from: 'kaunas', to: 'fogfire-point' },
  { from: 'leningrad', to: 'fogfire-point' },

  // Wounded Moon Lake
  { from: 'nizhny-novgorod', to: 'wounded-moon-lake' },
  { from: 'sverdlovsk', to: 'wounded-moon-lake' },

  // Priory of Captains
  { from: 'london', to: 'priory-of-captains' },
  { from: 'paris', to: 'priory-of-captains' },
  { from: 'strasbourg', to: 'priory-of-captains' },
  { from: 'granada', to: 'priory-of-captains' },
  { from: 'marrakech', to: 'priory-of-captains' },

  // The Tiger's Nest
  { from: 'sverdlovsk', to: 'tigers-nest' },
  { from: 'samarkand', to: 'tigers-nest' },
  { from: 'meshad', to: 'tigers-nest' },

  // The Pentapolis
  { from: 'algiers', to: 'pentapolis' },
  { from: 'marrakech', to: 'pentapolis' },
  { from: 'tripoli', to: 'pentapolis' },

  // Hermitage of the Scythe
  { from: 'alexandria', to: 'hermitage-of-the-scythe' },
  { from: 'baghdad', to: 'hermitage-of-the-scythe' },
  { from: 'candia-heraklion', to: 'hermitage-of-the-scythe' },
  { from: 'meshad', to: 'hermitage-of-the-scythe' },
];
