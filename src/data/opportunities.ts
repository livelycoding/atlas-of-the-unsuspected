import { OpportunityDetail } from './types';

/**
 * Shared lookup of opportunity details, keyed by the exact opportunity string
 * used in locations.ts. Data extracted from the Cultist Simulator fandom wiki.
 */
export const opportunityDetails: Record<string, OpportunityDetail> = {
  // --- Connections & Licenses ---
  'An Official Connection?': {
    result: 'Official Connection',
    aspects: 'Grail 6, Lantern 6, Asset, Connection, Assists Deception',
  },
  'An Underworld Connection?': {
    result: 'Connection: Underworld',
    aspects: 'Moth 8, Knock 6, Edge 8, Asset, Connection, Assists Deception',
  },
  'A Connection with Radicals?': {
    result: 'Connection: Radicals',
    aspects: 'Moth 8, Forge 6, Edge 8, Asset, Connection, Assists Deception',
  },
  'a Connection with a Ruler?': {
    result: 'Connection: Ruler',
    aspects: 'Grail 10, Knock 10, Edge 10, Asset, Connection, Assists Deception',
  },
  'A Connection with a Holy Man?': {
    result: 'Connection: Holy Man',
    aspects: 'Lantern 4, Heart 4, Asset, Connection, Assists Deception',
  },
  'Import Licence?': {
    result: 'Import Licence',
    aspects: 'Worth 1, Proof, Asset',
  },
  'Medical Credentials?': {
    result: 'Medical Credentials',
    aspects: 'Worth 1, Proof, Portable, Asset',
  },

  // --- Property ---
  'Discreet Office?': {
    result: 'Discreet Office',
    aspects: 'Comfort 1, Space 1, Worth 1, Heart 2, Asset, Assists Deception',
  },
  'Quiet Warehouse?': {
    result: 'Quiet Warehouse',
    aspects: 'Space 2, Worth 2, Heart 4, Forge 4, Asset, Assists Deception',
  },
  'Grand Townhouse?': {
    result: 'Grand Townhouse',
    aspects: 'Comfort 4, Space 2, Worth 4, Heart 4, Grail 4, Asset, Assists Deception',
  },
  'Secluded Villa?': {
    result: 'Secluded Villa',
    aspects: 'Comfort 8, Space 2, Worth 8, Heart 6, Grail 6, Forge 6, Asset, Assists Deception',
  },

  // --- Items ---
  'Purchase a Profane Weapon?': {
    result: 'Profane Weapon',
    aspects: 'Worth 1, Edge 2, Weapon, Portable, Asset',
  },
  'Purchase a Mutilated Manuscript?': {
    result: 'Curio: Pages from the Book of Suns',
    aspects: 'Comfort 1, Worth 2, Lantern 4, Grail 2, Portable, Asset',
  },
  'Purchase an Unusual Weapon?': {
    result: "Lionhunter's Rifle",
    aspects: 'Worth 2, Edge 4, Weapon, Portable, Asset',
  },
  'Purchase Art about Yearning?': {
    result: "Rarity: 'Green as Remembered Rain'",
    aspects: 'Comfort 1, Worth 2, Moth 8, Grail 4, Pentiment, Portable, Asset',
  },
  'Purchase a Case of Extraordinary Wine?': {
    result: 'Rarity: Case of 1865 Domaine Raveline',
    aspects: 'Comfort 2, Worth 4, Grail 12, Portable, Asset',
  },
  'Purchase a Menacing Icon?': {
    result: 'Curio: Bohemian Saint',
    aspects: 'Worth 1, Knock 4, Grail 2, Portable, Asset',
  },
  'Purchase a Dangerous Substance?': {
    result: "Curio: Adept's Powder",
    aspects: 'Worth 1, Forge 4, Supplies, Portable, Asset',
  },
  'Purchase an Unsettling Doll?': {
    result: 'Curio: Threadbare Angel',
    aspects: 'Moth 4, Grail 2, Portable, Asset',
  },
  'Purchase a Crudely Carved Image?': {
    result: 'Curio: Venetian Mommet',
    aspects: 'Comfort 1, Worth 1, Heart 4, Grail 2, Portable, Asset',
  },
  "Purchase the 'Drinker's Knife'?": {
    result: "Biedde's Blade",
    aspects: 'Weapon, Edge, Portable, Unstaunchable wounds',
  },
  'Purchase an Atlas of the Unsuspected?': {
    result: 'Rarity: Atlas of the Unsuspected',
    aspects: 'Comfort 1, Worth 3, Knock 8, Grail 4, Portable, Asset',
  },
  'Purchase an Odd Little Bone?': {
    result: 'Rarity: Odd Little Bone',
    aspects: 'Comfort 1, Worth 2, Forge 8, Grail 4, Portable, Asset',
  },
  'Purchase Red Temptation?': {
    result: "Curio: Crème de Carmine",
    aspects: 'Comfort 1, Worth 2, Grail 8, Supplies, Portable, Asset',
  },
  'Purchase an Antique Guitar?': {
    result: 'Rarity: Grese Guitar',
    aspects: 'Comfort 2, Worth 3, Heart 8, Grail 6, Pentiment, Portable, Asset',
  },
  'Purchase Art about Finality?': {
    result: "'Abydos Unveiled'",
    aspects: 'Comfort 1, Worth 2, Winter 8, Grail 4, Portable, Asset',
  },

  // --- Times ---
  'Dawn': {
    result: 'Dawn',
    aspects: 'Lantern 4, Knock 4',
  },
  'Sunset': {
    result: 'Sunset',
    aspects: 'Winter 4, Forge 4',
  },
  'Night': {
    result: 'Night',
    aspects: 'Winter 4, Moth 4, Assists Deception',
  },

  // --- Distractions ---
  'Freezing Winds': {
    result: 'Freezing Winds',
    aspects: 'Winter 2, Edge 2',
  },
  'The Sea': {
    result: 'The Sea',
    aspects: 'Winter 2, Moth 2',
  },
  'Sea': {
    result: 'The Sea',
    aspects: 'Winter 2, Moth 2',
  },
  'Sulochana Amavasya': {
    result: 'Sulochana Amavasya',
    aspects: 'Ligeian Presence, Unique',
  },
  'Mme Matutine': {
    result: 'Mme Matutine',
    aspects: 'Ligeian Presence, Unique',
  },
  'Heights': {
    result: 'Heights',
    aspects: 'Moth 2, Lantern 2',
  },
  "The Flowermaker's Shadow": {
    result: "The Flowermaker's Shadow",
    aspects: 'Grail 6, Lantern 6',
  },
  'Faith': {
    result: 'Faith',
    aspects: 'Lantern 2, Heart 2',
  },
  "The Wolf Divided's Shadow": {
    result: "The Wolf Divided's Shadow",
    aspects: 'Winter 6, Edge 6',
  },
  'Cats': {
    result: 'Cats',
    aspects: 'Moth 2, Grail 2',
  },
  'Trembling Heat': {
    result: 'Trembling Heat',
    aspects: 'Grail 2, Forge 2',
  },
  'What-Is-Not-Seen': {
    result: 'What-Is-Not-Seen',
    aspects: 'Ligeian Presence, Pentiment, Unique',
  },
  'Echidna': {
    result: 'Echidna',
    aspects: 'Ligeian Presence, Unique',
  },
};
