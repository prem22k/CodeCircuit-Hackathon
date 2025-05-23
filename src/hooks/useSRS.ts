import { useState, useEffect } from 'react';
import { CardReview, ReviewResult, createInitialReview, processReview, getCardsDueToday } from '@/utils/srs';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, collection, getDoc, setDoc, updateDoc, addDoc } from 'firebase/firestore';

export function useSRS(deckId: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Record<string, CardReview>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load reviews from Firestore
  useEffect(() => {
    if (!user || !deckId) return;

    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewsRef = doc(db, 'users', user.id, 'decks', deckId, 'srs', 'reviews');
        const reviewsDoc = await getDoc(reviewsRef);

        if (reviewsDoc.exists()) {
          setReviews(reviewsDoc.data() as Record<string, CardReview>);
        } else {
          // Initialize empty reviews
          await setDoc(reviewsRef, {});
          setReviews({});
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load reviews'));
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [user, deckId]);

  // Save reviews to Firestore
  const saveReviews = async (newReviews: Record<string, CardReview>) => {
    if (!user || !deckId) return;

    try {
      const reviewsRef = doc(db, 'users', user.id, 'decks', deckId, 'srs', 'reviews');
      await setDoc(reviewsRef, newReviews);
      setReviews(newReviews);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save reviews'));
    }
  };

  // Initialize a new card review
  const initializeCard = async (cardId: string) => {
    if (!user || !deckId) return;

    const newReview = createInitialReview(cardId);
    const newReviews = { ...reviews, [cardId]: newReview };
    await saveReviews(newReviews);
  };

  // Process a card review
  const processCardReview = async (cardId: string, performance: number) => {
    console.log('processCardReview called', { cardId, performance, deckId });
    if (!user || !deckId) {
      console.log('processCardReview: Missing user or deckId', { user, deckId });
      return;
    }

    const currentReview = reviews[cardId] || createInitialReview(cardId);
    const result = processReview(currentReview, performance);

    const newReview: CardReview = {
      ...currentReview,
      ...result,
      lastReview: new Date()
    };

    // Save the updated SRS state for the card
    const newReviews = { ...reviews, [cardId]: newReview };
    await saveReviews(newReviews);

    // Also save a review history record
    try {
      console.log('Attempting to save review history for user:', user.id, 'deck:', deckId);
      const historyRef = collection(db, 'users', user.id, 'decks', deckId, 'history');
      await addDoc(historyRef, {
        cardId: cardId,
        performance: performance,
        timestamp: new Date(),
        deckId: deckId, // Include deckId for easier querying if needed
        userId: user.id // Include userId for easier querying/security rule application
      });
      console.log('Review history saved successfully');
    } catch (err) {
      console.error('Error saving review history:', err);
      // Optionally set an error state or show a toast
    }
  };

  // Get cards due for review
  const getDueCards = () => {
    return Object.entries(reviews)
      .filter(([_, review]) => new Date(review.nextReview) <= new Date())
      .map(([cardId, review]) => ({ cardId, ...review }));
  };

  // Get number of cards due today
  const getDueCount = () => {
    return getCardsDueToday(Object.values(reviews));
  };

  return {
    reviews,
    loading,
    error,
    initializeCard,
    processCardReview,
    getDueCards,
    getDueCount
  };
} 