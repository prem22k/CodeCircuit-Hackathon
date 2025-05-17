export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  userId: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  lastStudied?: Date;
  reviewCount: number;
  averagePerformance: number;
  totalReviews: number;
  cardsMastered: number;
  cardsLearning: number;
  cardsNotStarted: number;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  deckId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastReviewed?: Date;
  nextReview?: Date;
  difficulty: number;
  reviewCount: number;
  successCount: number;
}

export interface ReviewSession {
  id: string;
  deckId: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTimePerCard: number;
}

export interface ReviewStats {
  totalReviews: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTimePerCard: number;
  streak: number;
  lastReviewDate: Date;
} 