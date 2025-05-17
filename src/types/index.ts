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
  cardCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags?: string[];
  isPublic?: boolean;
  reviewCount?: number;
  averagePerformance?: number;
  totalReviews?: number;
  cardsMastered?: number;
  cardsLearning?: number;
  cardsNotStarted?: number;
}

export interface Card {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  lastReviewed?: Date;
  nextReview?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  reviewCount: number;
  correctCount: number;
  tags?: string[];
}

export interface ReviewSession {
  id: string;
  deckId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  cardsReviewed: number;
  cardsCorrect: number;
  cardsIncorrect: number;
  averageResponseTime: number;
}

export interface ReviewStats {
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  averageResponseTime: number;
  lastReviewDate?: Date;
  streakDays: number;
  cardsMastered: number;
  cardsLearning: number;
  cardsNotStarted: number;
} 