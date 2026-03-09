export interface DefianceMethod {
  name: string;
  description: string;
  marks: string;
  repeatable: boolean;
  requirements: string[];
}

export const defianceMethods: DefianceMethod[] = [
  {
    name: 'Consecration',
    description: 'Travel to a Shrine of the Colonel or the Lionsmith with Temptation: Defiance. Colonel produces a Wound; Lionsmith produces Rage. Makes Eternal Enmity (Wolf Divided) victory impossible.',
    marks: '+1',
    repeatable: false,
    requirements: ['Temptation: Defiance', 'Shrine of the Colonel or Lionsmith'],
  },
  {
    name: 'Unflinching / Brazen Vow',
    description: 'Forfeit Temptation: Escape at a Shrine of the Hour you are consecrated to. Colonel produces a Wound; Lionsmith produces Rage. Makes Obscurity victory impossible.',
    marks: '+1',
    repeatable: false,
    requirements: ['Temptation: Escape', 'Consecrated', 'Shrine of your consecrated Hour'],
  },
  {
    name: 'Assist an Uprising',
    description: 'Employ Connection: Radicals with Temptation: Defiance and Forge in a Troubled location. Only increases Defiance if consecrated to the Lionsmith; decreases by 1 if consecrated to the Colonel.',
    marks: '+1 (Lionsmith) / \u22121 (Colonel)',
    repeatable: false,
    requirements: ['Connection: Radicals (exhausted)', 'Temptation: Defiance', '2 Forge', 'Troubled location', 'Consecrated'],
  },
  {
    name: 'Betray an Uprising',
    description: 'Employ Connection: Radicals with Temptation: Defiance and Winter. Only increases Defiance if consecrated to the Colonel; decreases by 1 if consecrated to the Lionsmith.',
    marks: '+1 (Colonel) / \u22121 (Lionsmith)',
    repeatable: false,
    requirements: ['Connection: Radicals (consumed)', 'Temptation: Defiance', '2 Winter', 'Place of Residence', 'Consecrated'],
  },
  {
    name: 'Send a Defiant Gift',
    description: 'Communicate using Temptation: Defiance and any sacred Weapon (not a Profane Weapon).',
    marks: '+1',
    repeatable: false,
    requirements: ['Temptation: Defiance', 'Sacred Weapon (consumed)'],
  },
  {
    name: 'Send a Defiant Summons',
    description: 'Communicate using Temptation: Defiance and your location. Destroys all Obscurity and summons your Foe to your location.',
    marks: '+1',
    repeatable: false,
    requirements: ['Temptation: Defiance', 'Your current location'],
  },
  {
    name: 'Celebrate My Victory',
    description: 'Relinquish a Reckoner Corpse with Temptation: Defiance.',
    marks: '+1',
    repeatable: false,
    requirements: ['Temptation: Defiance', 'A Reckoner Corpse (consumed)'],
  },
  {
    name: 'Foment Chaos (Wolf Divided)',
    description: "Add The Wolf Divided's Shadow to a non-betrayed Uprising. Works regardless of consecration. Only Stalingrad and Tiflis have both Connection: Radicals and The Wolf Divided's Shadow.",
    marks: '+2',
    repeatable: true,
    requirements: ["The Wolf Divided's Shadow", 'Active Uprising', 'Troubled location with Connection: Radicals'],
  },
  {
    name: 'Laugh as the Lionsmith Laughed',
    description: 'When your Foe is attacking, defend using Temptation: Defiance. Your Foe still hits you, creating 2 Wounds. Requires Lionsmith consecration.',
    marks: '+1',
    repeatable: true,
    requirements: ['Temptation: Defiance', 'Consecrated to Lionsmith', 'Foe attacking'],
  },
];

export const defianceVictory = {
  name: 'Edge Victory',
  description: 'Communicate using Temptation: Defiance with 7 marks of Defiance and 6 Foe\'s Wounds to achieve an Edge victory.',
  requirements: ['Temptation: Defiance (7 marks)', "6 Foe's Wounds"],
};
