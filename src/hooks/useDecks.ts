import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { Deck } from '@/types/firebase';

export function useDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    const decksRef = collection(db, `users/${user.uid}/decks`);
    const decksQuery = query(decksRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      decksQuery,
      (snapshot) => {
        const decksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Deck[];
        setDecks(decksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching decks:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { decks, loading, error };
} 