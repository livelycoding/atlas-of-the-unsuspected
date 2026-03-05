export type RegionColor =
  | 'western-europe'
  | 'france-iberia'
  | 'germany-austria'
  | 'eastern-europe'
  | 'russia'
  | 'italy-balkans'
  | 'north-africa'
  | 'middle-east'
  | 'south-med'
  | 'map-edge';

export interface Shrine {
  deity: string;
  description: string;
}

export interface Pentiment {
  name: string;
  howToObtain: string;
  aspect: string;
}

export interface Ligeian {
  name: string;
  howToObtain: string;
  abilities: string[];
}

export interface Ally {
  name: string;
  aspect: string;
  caperChecks: string[];
}

export interface CaperComplication {
  name: string;
  checks: string[];  // e.g. ["Lantern 2", "Forge 2"]
}

export interface Caper {
  name: string;
  complications: CaperComplication[];  // Always 3
  reward: string;
}

export interface Rarity {
  name: string;
  aspect: string;
}

export interface Opportunities {
  connections: string[];
  property: string[];
  items: string[];
  times: string[];
  distractions: string[];
}

export interface Location {
  id: string;
  name: string;
  country: string;
  gridRow: number;
  gridCol: number;
  region: RegionColor;
  isRemote: boolean;
  isTroubled: boolean;
  isMapEdge: boolean;
  cult: 'colonel' | 'lionsmith' | null;
  shrine: Shrine | null;
  pentiment: Pentiment | null;
  ligeian: Ligeian | null;
  ally: Ally | null;
  weapons: string[];
  rarities: Rarity[];
  bookOfSunsPage: number | null;
  onArrival: string[];
  opportunities: Opportunities;
  caper: Caper | null;
  specialFeatures: string[];
  connections: string[];
  edgeConnections: string[];
}

export interface Connection {
  from: string;
  to: string;
}
