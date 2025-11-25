export enum ArcanaType {
  MAJOR = 'Major Arcana',
  MINOR = 'Minor Arcana'
}

export enum Suit {
  WANDS = 'Wands',
  CUPS = 'Cups',
  SWORDS = 'Swords',
  PENTACLES = 'Pentacles',
  NONE = 'None' // For Major Arcana
}

export interface TarotCard {
  id: number;
  name: string;
  suit: Suit;
  arcana: ArcanaType;
  descriptionKeywords: string[];
  imageSeed: number; // For placeholder generation
}

export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface ReadingResult {
  card: TarotCard;
  position: SpreadPosition;
  isReversed: boolean;
}

export enum AppState {
  WELCOME = 'WELCOME',
  INPUT = 'INPUT',
  SHUFFLE = 'SHUFFLE',
  REVEAL = 'REVEAL',
  READING = 'READING',
  ERROR = 'ERROR'
}
