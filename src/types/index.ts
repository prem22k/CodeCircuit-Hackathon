export interface Card {
  id: string;
  front: string;
  back: string;
  deckId: string;
  lastReviewed?: Date;
  nextReview?: Date;
  box: number; // Leitner system box number (0-5)
  createdAt: Date;
  updatedAt: Date;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  lastReviewed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSession {
  deckId: string;
  startedAt: Date;
  cardsReviewed: number;
  correctCount: number;
  incorrectCount: number;
} 