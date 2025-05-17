import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  box?: number;
  nextReview?: Timestamp;
  lastReview?: Timestamp;
  easeFactor?: number;
  consecutiveCorrect?: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastStudied?: Timestamp;
  userId: string;
  reviewCount?: number;
  averagePerformance?: number;
  totalReviews?: number;
  cardsMastered?: number;
  cardsLearning?: number;
  cardsNotStarted?: number;
}

export interface ReviewSession {
  id: string;
  userId: string;
  deckId: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
} 