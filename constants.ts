import { TarotCard, ArcanaType, Suit, Spread } from './types';

// Helper to generate the full 78 card deck
const generateDeck = (): TarotCard[] => {
  const deck: TarotCard[] = [];
  let idCounter = 1;

  // 1. Major Arcana
  const majorArcanaNames = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];

  majorArcanaNames.forEach((name) => {
    deck.push({
      id: idCounter++,
      name,
      suit: Suit.NONE,
      arcana: ArcanaType.MAJOR,
      descriptionKeywords: ["Archetype", "Major Life Event", "Spiritual Lesson"],
      imageSeed: idCounter + 100
    });
  });

  // 2. Minor Arcana
  const suits = [Suit.WANDS, Suit.CUPS, Suit.SWORDS, Suit.PENTACLES];
  const ranks = [
    "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Page", "Knight", "Queen", "King"
  ];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        id: idCounter++,
        name: `${rank} of ${suit}`,
        suit,
        arcana: ArcanaType.MINOR,
        descriptionKeywords: [suit, "Daily Life", "Action"],
        imageSeed: idCounter + 200
      });
    });
  });

  return deck;
};

export const FULL_DECK: TarotCard[] = generateDeck();

export const SPREADS: Spread[] = [
  {
    id: 'single',
    name: 'Single Card Draw',
    description: 'A quick answer to a specific question or a daily theme.',
    cardCount: 1,
    positions: [
      { index: 0, name: 'The Answer', description: 'The core insight into your query.' }
    ]
  },
  {
    id: 'three_card',
    name: 'Past, Present, Future',
    description: 'Understand the timeline of a situation.',
    cardCount: 3,
    positions: [
      { index: 0, name: 'Past', description: 'Influences from the past affecting the situation.' },
      { index: 1, name: 'Present', description: 'The current state of affairs.' },
      { index: 2, name: 'Future', description: 'The likely outcome if the current path is followed.' }
    ]
  },
  {
    id: 'relationship',
    name: 'Relationship Spread',
    description: 'Explore the dynamic between two people.',
    cardCount: 4,
    positions: [
      { index: 0, name: 'You', description: 'Your role and feelings in the relationship.' },
      { index: 1, name: 'Them', description: 'Their role and feelings.' },
      { index: 2, name: 'Dynamics', description: 'The current energy between you.' },
      { index: 3, name: 'Outcome', description: 'Where this relationship is heading.' }
    ]
  }
];
