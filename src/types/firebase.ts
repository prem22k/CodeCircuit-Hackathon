import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface Deck {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPublic: boolean;
  cardCount: number;
  tags: string[];
}

export interface Card {
  id: string;
  deckId: string;
  userId: string;
  front: string;
  back: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastReviewed?: Timestamp;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReviewDate?: Timestamp;
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