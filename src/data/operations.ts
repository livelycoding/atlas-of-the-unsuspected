export interface OperationChallenge {
  level: number;
  aspects: string;
}

export interface Operation {
  name: string;
  requirements: string[];
  challenges: OperationChallenge[];
  rewards: string[];
}

export const operations: Operation[] = [
  {
    name: 'Compete in Illegal Fights',
    requirements: ['Connection: Underworld (exhausted)', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Edge/Grail' },
      { level: 8, aspects: 'Edge/Moth' },
      { level: 12, aspects: 'Edge/Forge' },
    ],
    rewards: ['1 Wound per failed challenge', '2 Cash', '1\u20133 extra Cash from effectiveness'],
  },
  {
    name: 'Smuggling Operation',
    requirements: ['Connection: Underworld (exhausted)', 'Sea (consumed)', '2 Space (returned)'],
    challenges: [
      { level: 4, aspects: 'Knock/Moth' },
      { level: 8, aspects: 'Heart/Moth' },
      { level: 12, aspects: 'Winter/Moth' },
    ],
    rewards: ['2 Cash', '1 extra Cash from effectiveness', 'Possible Obscurity from subtlety'],
  },
  {
    name: 'Counterfeiting Operation',
    requirements: ['Connection: Underworld (returned)', '6 Forge Aspect', '2 Space (returned)'],
    challenges: [
      { level: 4, aspects: 'Forge/Winter' },
      { level: 8, aspects: 'Forge/Moth' },
      { level: 12, aspects: 'Forge/Grail' },
    ],
    rewards: ['2 Cash', '1\u20133 extra Cash from effectiveness'],
  },
  {
    name: 'Import Business',
    requirements: ['Import Licence (returned)', 'Sea (consumed)', '2 Space (returned)'],
    challenges: [
      { level: 4, aspects: 'Heart/Lantern' },
      { level: 8, aspects: 'Forge/Lantern' },
      { level: 12, aspects: 'Lantern/Winter' },
    ],
    rewards: ['2 Cash', '1\u20133 extra Cash from effectiveness'],
  },
  {
    name: 'Medical Practice',
    requirements: ['Medical Credentials (returned)', 'Discreet Office (returned)', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Heart/Grail' },
      { level: 8, aspects: 'Heart/Grail' },
      { level: 12, aspects: 'Heart/Forge' },
    ],
    rewards: ['2 Cash', '1\u20132 extra Cash from effectiveness', 'Possible Obscurity'],
  },
  {
    name: 'Run a Sanatorium',
    requirements: ['Medical Credentials', 'Grand Townhouse or Secluded Villa', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Heart/Grail' },
      { level: 8, aspects: 'Heart/Grail' },
      { level: 12, aspects: 'Heart/Forge' },
    ],
    rewards: ['4 Cash', '1\u20132 extra Cash from effectiveness', 'Possible Obscurity'],
  },
  {
    name: 'Betray an Uprising',
    requirements: ['Connection: Radicals (consumed)', '2 Winter (returned)', 'Place of Residence (returned)', 'Temptation: Defiance (returned)'],
    challenges: [
      { level: 4, aspects: 'Heart/Winter' },
      { level: 8, aspects: 'Heart/Winter' },
      { level: 12, aspects: 'Heart/Winter' },
    ],
    rewards: ['4 Cash', '1 Connection: Ruler', 'Possible Obscurity'],
  },
  {
    name: 'Assist an Uprising',
    requirements: ['Connection: Radicals (exhausted)', '2 Forge (returned)', 'Troubled location', 'Temptation: Defiance (returned)'],
    challenges: [
      { level: 4, aspects: 'Heart/Edge' },
      { level: 8, aspects: 'Heart/Edge' },
      { level: 12, aspects: 'Heart/Edge' },
    ],
    rewards: ['4 Cash', 'False Trail', 'Place set in Flames', '1\u20133 extra Cash', 'Possible Obscurity'],
  },
  {
    name: 'Patronage',
    requirements: ['Connection: Ruler (exhausted)', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Heart/Lantern' },
      { level: 8, aspects: 'Heart/Lantern' },
      { level: 12, aspects: 'Heart/Lantern' },
    ],
    rewards: ['3 Cash', '1\u20133 extra Cash', 'Possible Obscurity', 'Chance of Grand Townhouse'],
  },
  {
    name: 'Run a Faith-Healing Cult',
    requirements: ['Connection: Holy Man (exhausted)', '2 Space', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Moth/Grail' },
      { level: 8, aspects: 'Moth/Lantern' },
      { level: 12, aspects: 'Moth/Winter' },
    ],
    rewards: ['2 Cash', 'A New Faith? (if challenge 2 uses Lantern)', '1 extra Cash', 'Possible Obscurity'],
  },
  {
    name: 'Continue a Faith-Healing Cult',
    requirements: ['A New Faith?', 'Space', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Moth/Grail' },
      { level: 8, aspects: 'Moth/Lantern' },
      { level: 12, aspects: 'Moth/Winter' },
    ],
    rewards: ['3 Cash', 'A New Faith?', '1 extra Cash', 'Possible Obscurity'],
  },
  {
    name: 'Esoteric Cult: Wolf Divided',
    requirements: ['A New Faith?', "The Wolf Divided's Shadow (consumed)", 'Space', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Edge/Winter' },
      { level: 8, aspects: 'Edge/Lantern' },
      { level: 12, aspects: 'Grail/Winter' },
    ],
    rewards: ['3 Cash', 'Corpse', 'Local Contact (requires 1+ Effectiveness)'],
  },
  {
    name: 'Esoteric Cult: Horned Axe',
    requirements: ['A New Faith?', "The Horned Axe's Shadow (consumed)", 'Space', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Knock/Winter' },
      { level: 8, aspects: 'Knock/Forge' },
      { level: 12, aspects: 'Knock/Lantern' },
    ],
    rewards: ['Cash'],
  },
  {
    name: 'Esoteric Cult: Flowermaker',
    requirements: ['A New Faith?', "The Flowermaker's Shadow (consumed)", 'Space', 'Stolen Year (consumed)'],
    challenges: [
      { level: 4, aspects: 'Grail/Lantern' },
      { level: 8, aspects: 'Grail/Knock' },
      { level: 12, aspects: 'Grail/Winter' },
    ],
    rewards: ['Cash'],
  },
];
