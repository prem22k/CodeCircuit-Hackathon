import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { Deck, Card, ReviewSession, ReviewStats } from '@/types';

const STORAGE_KEYS = {
  DECKS: 'brainboost_decks',
  CARDS: 'brainboost_cards',
  REVIEW_SESSIONS: 'brainboost_sessions',
} as const;

// Helper to safely parse JSON with dates
const parseWithDates = (json: string) => {
  return JSON.parse(json, (key, value) => {
    const dateKeys = ['lastReviewed', 'nextReview', 'createdAt', 'updatedAt', 'startedAt', 'lastReviewDate'];
    if (dateKeys.includes(key) && value) {
      if (typeof value === 'object' && value !== null && 'seconds' in value) {
        return new Date(value.seconds * 1000);
      }
      return new Date(value); // Handle other date string formats if necessary
    }
    return value;
  });
};

// Deck functions
export const getDecks = async (userId: string): Promise<Deck[]> => {
  if (!userId) return [];
  const decksRef = collection(db, `users/${userId}/decks`);
  const q = query(
    decksRef,
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt, // Handle Firestore Timestamp
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt, // Handle Firestore Timestamp
      lastStudied: data.lastStudied instanceof Timestamp ? data.lastStudied.toDate() : data.lastStudied, // Handle Firestore Timestamp
    } as Deck;
  });
};

export const getDeck = async (userId: string, deckId: string): Promise<Deck | null> => {
  if (!userId || !deckId) return null;
  const deckRef = doc(db, `users/${userId}/decks/${deckId}`);
  const deckDoc = await getDoc(deckRef);
  if (!deckDoc.exists()) return null;
  const data = deckDoc.data();
  return {
    id: deckDoc.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt, // Handle Firestore Timestamp
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt, // Handle Firestore Timestamp
    lastStudied: data.lastStudied instanceof Timestamp ? data.lastStudied.toDate() : data.lastStudied, // Handle Firestore Timestamp
  } as Deck;
};

export const createDeck = async (userId: string, deck: Omit<Deck, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'lastStudied' | 'reviewCount' | 'averagePerformance' | 'totalReviews' | 'cardsMastered' | 'cardsLearning' | 'cardsNotStarted' | 'cards'>): Promise<Deck> => {
  if (!userId) throw new Error('User ID is required to create a deck.');
  const decksRef = collection(db, `users/${userId}/decks`);
  const newDeckData = {
    ...deck,
    userId: userId,
    cards: [], // Cards are in subcollection
    createdAt: serverTimestamp(), // Use serverTimestamp for consistency
    updatedAt: serverTimestamp(), // Use serverTimestamp for consistency
    lastStudied: undefined,
    reviewCount: 0,
    averagePerformance: 0,
    totalReviews: 0,
    cardsMastered: 0,
    cardsLearning: 0,
    cardsNotStarted: 0,
  }

  const docRef = await addDoc(decksRef, newDeckData);

  // Return data with client-side Date objects if serverTimestamp() was used
  // Note: Data returned by addDoc doesn't include serverTimestamp values immediately.
  // To get the actual server timestamps, you'd typically fetch the document after creation.
  // For simplicity here, we'll return the provided data with client dates, but be aware.
  return {
    id: docRef.id,
    ...deck,
    userId: userId,
    cards: [],
    createdAt: new Date(), 
    updatedAt: new Date(), 
    lastStudied: undefined,
    reviewCount: 0,
    averagePerformance: 0,
    totalReviews: 0,
    cardsMastered: 0,
    cardsLearning: 0,
    cardsNotStarted: 0,
  };
};

export const updateDeck = async (userId: string, deckId: string, updates: Partial<Omit<Deck, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  if (!userId || !deckId) throw new Error('User ID and Deck ID are required to update a deck.');
  const deckRef = doc(db, `users/${userId}/decks/${deckId}`);
  await updateDoc(deckRef, {
    ...updates,
    updatedAt: serverTimestamp(), // Use serverTimestamp for consistency
  });
};

export const deleteDeck = async (userId: string, deckId: string): Promise<void> => {
  if (!userId || !deckId) throw new Error('User ID and Deck ID are required to delete a deck.');
  const deckRef = doc(db, `users/${userId}/decks/${deckId}`);
  // TODO: Implement deletion of cards subcollection using a Cloud Function or batched writes if necessary
  await deleteDoc(deckRef);
};

// Card functions
export const getCards = async (userId: string, deckId: string): Promise<Card[]> => {
  if (!userId || !deckId) return [];
  const cardsRef = collection(db, `users/${userId}/decks/${deckId}/cards`);
  const q = query(
    cardsRef,
    orderBy('createdAt', 'asc') // Order by creation date by default
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt, // Handle Firestore Timestamp
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt, // Handle Firestore Timestamp
      lastReviewed: data.lastReviewed instanceof Timestamp ? data.lastReviewed.toDate() : data.lastReviewed, // Handle Firestore Timestamp
      nextReview: data.nextReview instanceof Timestamp ? data.nextReview.toDate() : data.nextReview, // Handle Firestore Timestamp
    } as Card;
  });
};

export const getCard = async (userId: string, deckId: string, cardId: string): Promise<Card | null> => {
  if (!userId || !deckId || !cardId) return null;
  const cardRef = doc(db, `users/${userId}/decks/${deckId}/cards/${cardId}`);
  const cardDoc = await getDoc(cardRef);
  if (!cardDoc.exists()) return null;
  const data = cardDoc.data();
  return {
    id: cardDoc.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt, // Handle Firestore Timestamp
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt, // Handle Firestore Timestamp
    lastReviewed: data.lastReviewed instanceof Timestamp ? data.lastReviewed.toDate() : data.lastReviewed, // Handle Firestore Timestamp
    nextReview: data.nextReview instanceof Timestamp ? data.nextReview.toDate() : data.nextReview, // Handle Firestore Timestamp
  } as Card;
};

export const createCard = async (userId: string, deckId: string, card: Omit<Card, 'id' | 'userId' | 'deckId' | 'createdAt' | 'updatedAt' | 'reviewCount' | 'successCount' | 'difficulty' | 'lastReviewed' | 'nextReview'>): Promise<Card> => {
  if (!userId || !deckId) throw new Error('User ID and Deck ID are required to create a card.');
  const cardsRef = collection(db, `users/${userId}/decks/${deckId}/cards`);
  const newCardData = {
    ...card,
    userId: userId,
    deckId: deckId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reviewCount: 0,
    successCount: 0,
    difficulty: 0,
    lastReviewed: null,
    nextReview: null,
  }

  const docRef = await addDoc(cardsRef, newCardData);

  return {
    id: docRef.id,
    ...card,
    userId: userId,
    deckId: deckId,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviewCount: 0,
    successCount: 0,
    difficulty: 0,
    lastReviewed: null,
    nextReview: null,
  };
};

export const updateCard = async (userId: string, deckId: string, cardId: string, updates: Partial<Omit<Card, 'id' | 'userId' | 'deckId' | 'createdAt'>>): Promise<void> => {
  if (!userId || !deckId || !cardId) throw new Error('User ID, Deck ID, and Card ID are required to update a card.');
  const cardRef = doc(db, `users/${userId}/decks/${deckId}/cards/${cardId}`);
  await updateDoc(cardRef, { 
    ...updates,
    updatedAt: serverTimestamp(), // Use serverTimestamp for consistency
  });
};

export const deleteCard = async (userId: string, deckId: string, cardId: string): Promise<void> => {
  if (!userId || !deckId || !cardId) throw new Error('User ID, Deck ID, and Card ID are required to delete a card.');
  const cardRef = doc(db, `users/${userId}/decks/${deckId}/cards/${cardId}`);
  await deleteDoc(cardRef);
};

// Review session functions
export const createReviewSession = async (userId: string, session: Omit<ReviewSession, 'id' | 'userId' | 'startedAt' | 'endedAt'>): Promise<ReviewSession> => {
  if (!userId) throw new Error('User ID is required to create a review session.');
  const sessionsRef = collection(db, `users/${userId}/sessions`);
  const newSessionData = {
    ...session,
    userId: userId,
    startedAt: serverTimestamp(), // Use serverTimestamp for consistency
    endedAt: null,
  }
  const docRef = await addDoc(sessionsRef, newSessionData);
  // Return data with client-side Date objects if serverTimestamp() was used
  // Note: Data returned by addDoc doesn't include serverTimestamp values immediately.
  return {
    id: docRef.id,
    ...session,
    userId: userId,
    startedAt: new Date(),
    endedAt: null,
  };
};

export const updateReviewSession = async (userId: string, sessionId: string, updates: Partial<Omit<ReviewSession, 'id' | 'userId' | 'startedAt'>>): Promise<void> => {
  if (!userId || !sessionId) throw new Error('User ID and Session ID are required to update a review session.');
  const sessionRef = doc(db, `users/${userId}/sessions/${sessionId}`);
  await updateDoc(sessionRef, updates);
};

// Review stats functions
export const getReviewStats = async (userId: string): Promise<ReviewStats | null> => {
  if (!userId) throw new Error('User ID is required to get review stats.');
  const statsRef = doc(db, `users/${userId}/reviewStats/summary`); // Using a fixed doc ID for summary
  const statsDoc = await getDoc(statsRef);
  if (!statsDoc.exists()) return null;
  const data = statsDoc.data();
  // Map Firestore field names (potentially from old structure) to current type
  return {
    totalReviews: data.totalReviews || 0,
    correctAnswers: data.correctAnswers || data.correctReviews || 0, // Handle possible old field name
    incorrectAnswers: data.incorrectAnswers || data.incorrectReviews || 0, // Handle possible old field name
    averageTimePerCard: data.averageTimePerCard || data.averageResponseTime || 0, // Handle possible old field name
    streak: data.streak || data.streakDays || 0, // Handle possible old field name
    lastReviewDate: data.lastReviewDate instanceof Timestamp ? data.lastReviewDate.toDate() : (data.lastReviewDate || new Date(0)), // Handle Firestore Timestamp and missing field
  } as ReviewStats;
};

export const updateReviewStats = async (userId: string, updates: Partial<ReviewStats>): Promise<void> => {
  if (!userId) throw new Error('User ID is required to update review stats.');
  const statsRef = doc(db, `users/${userId}/reviewStats/summary`);
  // Use set with merge: true to create the document if it doesn't exist
  await setDoc(statsRef, { 
    ...updates,
    // Consider updating lastReviewDate with serverTimestamp()
    lastReviewDate: updates.lastReviewDate ? serverTimestamp() : undefined,
  }, { merge: true });
}; 