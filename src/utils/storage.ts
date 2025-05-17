import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { Deck, Card, ReviewSession, ReviewStats } from '@/types';

const STORAGE_KEYS = {
  DECKS: 'brainboost_decks',
  CARDS: 'brainboost_cards',
  REVIEW_SESSIONS: 'brainboost_sessions',
} as const;

// Helper to safely parse JSON with dates
const parseWithDates = (json: string) => {
  return JSON.parse(json, (key, value) => {
    const dateKeys = ['lastReviewed', 'nextReview', 'createdAt', 'updatedAt', 'startedAt'];
    if (dateKeys.includes(key) && value) {
      return new Date(value);
    }
    return value;
  });
};

// Deck functions
export const getDecks = async (userId: string): Promise<Deck[]> => {
  const decksRef = collection(db, 'decks');
  const q = query(
    decksRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Deck[];
};

export const getDeck = async (deckId: string): Promise<Deck | null> => {
  const deckRef = doc(db, 'decks', deckId);
  const deckDoc = await getDoc(deckRef);
  if (!deckDoc.exists()) return null;
  const data = deckDoc.data();
  return {
    id: deckDoc.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Deck;
};

export const createDeck = async (deck: Omit<Deck, 'id'>): Promise<Deck> => {
  const decksRef = collection(db, 'decks');
  const docRef = await addDoc(decksRef, {
    ...deck,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    id: docRef.id,
    ...deck,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateDeck = async (deckId: string, updates: Partial<Deck>): Promise<void> => {
  const deckRef = doc(db, 'decks', deckId);
  await updateDoc(deckRef, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteDeck = async (deckId: string): Promise<void> => {
  const deckRef = doc(db, 'decks', deckId);
  await deleteDoc(deckRef);
};

// Card functions
export const getCards = async (deckId: string): Promise<Card[]> => {
  const cardsRef = collection(db, 'cards');
  const q = query(
    cardsRef,
    where('deckId', '==', deckId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    lastReviewed: doc.data().lastReviewed?.toDate(),
    nextReview: doc.data().nextReview?.toDate(),
  })) as Card[];
};

export const getCard = async (cardId: string): Promise<Card | null> => {
  const cardRef = doc(db, 'cards', cardId);
  const cardDoc = await getDoc(cardRef);
  if (!cardDoc.exists()) return null;
  const data = cardDoc.data();
  return {
    id: cardDoc.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    lastReviewed: data.lastReviewed?.toDate(),
    nextReview: data.nextReview?.toDate(),
  } as Card;
};

export const createCard = async (card: Omit<Card, 'id'>): Promise<Card> => {
  const cardsRef = collection(db, 'cards');
  const docRef = await addDoc(cardsRef, {
    ...card,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviewCount: 0,
    correctCount: 0,
    difficulty: 'medium',
  });
  return {
    id: docRef.id,
    ...card,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviewCount: 0,
    correctCount: 0,
    difficulty: 'medium',
  };
};

export const updateCard = async (cardId: string, updates: Partial<Card>): Promise<void> => {
  const cardRef = doc(db, 'cards', cardId);
  await updateDoc(cardRef, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteCard = async (cardId: string): Promise<void> => {
  const cardRef = doc(db, 'cards', cardId);
  await deleteDoc(cardRef);
};

// Review session functions
export const createReviewSession = async (session: Omit<ReviewSession, 'id'>): Promise<ReviewSession> => {
  const sessionsRef = collection(db, 'reviewSessions');
  const docRef = await addDoc(sessionsRef, session);
  return {
    id: docRef.id,
    ...session,
  };
};

export const updateReviewSession = async (sessionId: string, updates: Partial<ReviewSession>): Promise<void> => {
  const sessionRef = doc(db, 'reviewSessions', sessionId);
  await updateDoc(sessionRef, updates);
};

// Review stats functions
export const getReviewStats = async (userId: string, deckId: string): Promise<ReviewStats> => {
  const statsRef = doc(db, 'reviewStats', `${userId}_${deckId}`);
  const statsDoc = await getDoc(statsRef);
  if (!statsDoc.exists()) {
    return {
      totalReviews: 0,
      correctReviews: 0,
      incorrectReviews: 0,
      averageResponseTime: 0,
      streakDays: 0,
      cardsMastered: 0,
      cardsLearning: 0,
      cardsNotStarted: 0,
    };
  }
  const data = statsDoc.data();
  return {
    ...data,
    lastReviewDate: data.lastReviewDate?.toDate(),
  } as ReviewStats;
};

export const updateReviewStats = async (userId: string, deckId: string, updates: Partial<ReviewStats>): Promise<void> => {
  const statsRef = doc(db, 'reviewStats', `${userId}_${deckId}`);
  await updateDoc(statsRef, updates);
}; 