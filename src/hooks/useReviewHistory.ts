import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

export interface ReviewRecord {
  id: string;
  deckId: string;
  cardId: string;
  performance: number;
  timestamp: Date;
}

export interface DailyStats {
  date: string;
  reviews: number;
  averagePerformance: number;
}

export function useReviewHistory(deckId: string, limit: number = 50) {
  const { user } = useAuth();
  const [records, setRecords] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !deckId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        const historyRef = collection(db, `users/${user.id}/decks/${deckId}/history`);
        const q = query(
          historyRef,
          orderBy('timestamp', 'desc'),
          limit(limit)
        );

        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as ReviewRecord[];

        setRecords(historyData);
      } catch (err) {
        console.error('Error loading review history:', err);
        setError(err instanceof Error ? err : new Error('Failed to load review history'));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, deckId, limit]);

  return { records, loading, error };
}

function calculateDailyStats(reviews: ReviewRecord[]): DailyStats[] {
  const statsMap = new Map<string, { count: number; totalPerformance: number }>();

  // Group reviews by date
  reviews.forEach(review => {
    const date = review.timestamp.toISOString().split('T')[0];
    const current = statsMap.get(date) || { count: 0, totalPerformance: 0 };
    
    statsMap.set(date, {
      count: current.count + 1,
      totalPerformance: current.totalPerformance + review.performance
    });
  });

  // Convert to array and calculate averages
  return Array.from(statsMap.entries())
    .map(([date, { count, totalPerformance }]) => ({
      date,
      reviews: count,
      averagePerformance: totalPerformance / count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function calculateStreak(reviews: ReviewRecord[]): number {
  if (reviews.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDates = new Set(
    reviews.map(review => {
      const date = new Date(review.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    })
  );

  let currentStreak = 0;
  let currentDate = today;

  while (true) {
    const dateStr = currentDate.toISOString();
    if (reviewDates.has(dateStr)) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
} 