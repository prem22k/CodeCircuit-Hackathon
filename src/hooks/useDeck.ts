import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Deck } from '@/types/firebase';

export function useDeck(deckId: string) {
  const { user } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !deckId) {
      setDeck(null);
      setLoading(false);
      return;
    }

    const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);

    const unsubscribe = onSnapshot(
      deckRef,
      (doc) => {
        if (doc.exists()) {
          setDeck({ id: doc.id, ...doc.data() } as Deck);
        } else {
          setDeck(null);
          setError(new Error('Deck not found'));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching deck:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, deckId]);

  return { deck, loading, error };
} 