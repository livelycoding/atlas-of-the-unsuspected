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
    weaknessPool: { name: 'Environment', others: ['Trembling Heat', 'The Sea'] },
  },
  'The Sea': {
    result: 'The Sea',
    aspects: 'Winter 2, Moth 2',
    weaknessPool: { name: 'Environment', others: ['Freezing Winds', 'Trembling Heat'] },
  },
  'Sea': {
    result: 'The Sea',
    aspects: 'Winter 2, Moth 2',
    weaknessPool: { name: 'Environment', others: ['Freezing Winds', 'Trembling Heat'] },
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
    weaknessPool: { name: 'Quirks', others: ['Cats', 'Faith'] },
  },
  "The Flowermaker's Shadow": {
    result: "The Flowermaker's Shadow",
    aspects: 'Grail 6, Lantern 6',
    weaknessPool: { name: 'Disfavor', others: ["The Wolf Divided's Shadow", "The Horned Axe's Shadow"] },
  },
  'Faith': {
    result: 'Faith',
    aspects: 'Lantern 2, Heart 2',
    weaknessPool: { name: 'Quirks', others: ['Cats', 'Heights'] },
  },
  "The Wolf Divided's Shadow": {
    result: "The Wolf Divided's Shadow",
    aspects: 'Winter 6, Edge 6',
    weaknessPool: { name: 'Disfavor', others: ["The Horned Axe's Shadow", "The Flowermaker's Shadow"] },
  },
  'Cats': {
    result: 'Cats',
    aspects: 'Moth 2, Grail 2',
    weaknessPool: { name: 'Quirks', others: ['Heights', 'Faith'] },
  },
  "The Horned Axe's Shadow": {
    result: "The Horned Axe's Shadow",
    aspects: 'Edge 6, Forge 6',
    weaknessPool: { name: 'Disfavor', others: ["The Wolf Divided's Shadow", "The Flowermaker's Shadow"] },
  },
  'Trembling Heat': {
    result: 'Trembling Heat',
    aspects: 'Grail 2, Forge 2',
    weaknessPool: { name: 'Environment', others: ['Freezing Winds', 'The Sea'] },
  },
  'What-Is-Not-Seen': {
    result: 'What-Is-Not-Seen',
    aspects: 'Ligeian Presence, Pentiment, Unique',
  },
  'Echidna': {
    result: 'Echidna',
    aspects: 'Ligeian Presence, Unique',
  },

  // --- Book of Suns ---
  'Book of Suns: Page 1': {
    result: 'Curio: Pages from the Book of Suns',
    aspects: 'Comfort 1, Worth 2, Lantern 4, Grail 2, Portable, Asset. Collect all 3 pages + 1 Cash to reassemble into the Book of Suns (Lantern 8, Grail 4, Pentiment)',
  },
  'Book of Suns: Page 2': {
    result: 'Curio: Pages from the Book of Suns',
    aspects: 'Comfort 1, Worth 2, Lantern 4, Grail 2, Portable, Asset. Collect all 3 pages + 1 Cash to reassemble into the Book of Suns (Lantern 8, Grail 4, Pentiment)',
  },
  'Book of Suns: Page 3': {
    result: 'Curio: Pages from the Book of Suns',
    aspects: 'Comfort 1, Worth 2, Lantern 4, Grail 2, Portable, Asset. Collect all 3 pages + 1 Cash to reassemble into the Book of Suns (Lantern 8, Grail 4, Pentiment)',
  },

  // --- Pentiment & Reward Items ---
  'Stained Gloves': {
    result: 'Stained Gloves',
    aspects: 'Worth 1, Grail 4, Pentiment, Portable, Asset',
  },
  'My Unhealing Wound': {
    result: 'My Unhealing Wound',
    aspects: 'Winter 4, Knock 4, Pentiment',
  },
  'Labhitic Memento': {
    result: 'Labhitic Memento',
    aspects: 'Comfort 1, Edge 8, Pentiment, Supplies, Portable, Asset',
  },
  'Sun-Kissed Stone': {
    result: 'Sun-Kissed Stone',
    aspects: 'Comfort 1, Lantern 4, Pentiment, Portable, Asset',
  },
  'Kirqa-Caul': {
    result: 'Kirqa-Caul',
    aspects: 'Grail 2, Lantern 2, Pentiment, Portable, Asset',
  },
  'Half-Smoked Cigarette': {
    result: 'Half-Smoked Cigarette',
    aspects: 'Heart 2, Knock 2, Pentiment',
  },
  "Stranger's Water": {
    result: "Stranger's Water",
    aspects: 'Worth 1, Knock 8, Edge 8, Supplies, Portable, Asset',
  },
  'Flûte Matutine': {
    result: 'Curio: Flûte Matutine',
    aspects: 'Winter 4. Single use: employ with a Sea opportunity to summon Mme Matutine. Can also address Winter needs in Operations or Capers',
  },

  // --- Weapons ---
  'Profane Weapon': {
    result: 'Profane Weapon',
    aspects: 'Worth 1, Edge 2, Weapon, Portable, Asset',
  },
  "Lionhunter's Rifle": {
    result: "Lionhunter's Rifle",
    aspects: 'Worth 2, Edge 4, Weapon, Portable, Asset, Uses Remaining 3',
  },
  'Ebrehel, the Ragged Sword': {
    result: 'Ebrehel, the Ragged Sword',
    aspects: 'Worth 3, Edge 6, Forge 6, Knock 6, Pentiment, Weapon, Portable, Asset',
  },
  "Biedde's Blade": {
    result: "Biedde's Blade",
    aspects: 'Weapon, Edge, Portable, Unstaunchable wounds',
  },
  'Imhullune Tectrix': {
    result: 'Imhullune Tectrix',
    aspects: 'Worth 4, Edge 10, Weapon, Portable, Asset',
  },

  // --- Caper Rewards ---
  "The Merry Feaster's Carcass": {
    result: "The Merry Feaster's Carcass",
    aspects: 'Asset, Decays in 300s',
  },
  'Maggot-Spice?': {
    result: 'Maggot-Spice?',
    aspects: 'Worth 1, Winter 12, Supplies, Portable, Asset',
  },
  'Mamurren Scar': {
    result: 'Mamurren Scar',
    aspects: 'Winter 2, Heart 2',
  },
  'Fluttering Goo': {
    result: 'Fluttering Goo',
    aspects: 'Worth 1, Moth 12, Supplies, Portable, Asset',
  },
  'Percussigant Pelt!': {
    result: 'Percussigant Pelt!',
    aspects: 'Worth 2, Heart 4, Portable, Asset',
  },
  'Tarrasquine Relic, Beguiling Curio, and Cash': {
    result: 'Tarrasquine Relic + Beguiling Curio + Cash',
    aspects: 'Relic: Worth 1, Grail 2, Winter 4\nCurio: Comfort 1, Worth 1, Grail 2',
  },
  "Hokobald's Alchemical Substance": {
    result: "Hokobald's Alchemical Substance",
    aspects: 'Worth 1, Forge 12, Supplies, Portable, Asset',
  },
  'A Snoozing Undergoer': {
    result: 'A Snoozing Undergoer',
    aspects: 'Asset, Decays in 300s',
  },
  'Serapeum Peristasis': {
    result: 'Serapeum Peristasis',
    aspects: 'Location (one-use). Dr Blackwood offers: heal up to 3 Wounds (give a Wound), purge up to 7 Traces + False Trail (give a Trace), gain 3 Obscurity (give Temptation: Escape), or show her the re-assembled Book of Suns for some lore',
  },
};
