'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDeck } from '@/hooks/useDeck';
import { useSRS } from '@/hooks/useSRS';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { StreakNotification } from '@/components/StreakNotification';
import { useReviewHistory } from '@/hooks/useReviewHistory';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    reviewStreak: 0
  });
  const { dailyStats, streak, loading: historyLoading } = useReviewHistory();
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Load user's decks
        const decksRef = collection(db, 'users', user.id, 'decks');
        const decksSnapshot = await getDocs(decksRef);
        const decksData = decksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDecks(decksData);

        // Calculate stats
        let totalCards = 0;
        let masteredCards = 0;
        let dueCards = 0;

        for (const deck of decksData) {
          const { reviews } = await useSRS(deck.id);
          const deckCards = deck.cards || [];
          totalCards += deckCards.length;
          
          // Count mastered cards (box 4 or higher)
          masteredCards += Object.values(reviews).filter(
            review => review.box >= 4
          ).length;

          // Count due cards
          dueCards += Object.values(reviews).filter(
            review => new Date(review.nextReview) <= new Date()
          ).length;
        }

        setStats({
          totalCards,
          masteredCards,
          dueCards,
          reviewStreak: 0 // TODO: Implement streak tracking
        });

        // Update last review date
        if (dailyStats.length > 0) {
          const lastReview = dailyStats[dailyStats.length - 1];
          setLastReviewDate(new Date(lastReview.date));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
      </div>
    );
  }

  // Sample data for charts - replace with real data
  const reviewHistory = [
    { date: 'Mon', reviews: 12 },
    { date: 'Tue', reviews: 8 },
    { date: 'Wed', reviews: 15 },
    { date: 'Thu', reviews: 10 },
    { date: 'Fri', reviews: 20 },
    { date: 'Sat', reviews: 5 },
    { date: 'Sun', reviews: 18 }
  ];

  const masteryProgress = [
    { name: 'Mastered', value: stats.masteredCards },
    { name: 'Learning', value: stats.totalCards - stats.masteredCards }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <StreakNotification streak={streak} lastReviewDate={lastReviewDate} />
      
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cards</h3>
              <p className="text-2xl font-bold">{stats.totalCards}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Mastered</h3>
              <p className="text-2xl font-bold">{stats.masteredCards}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Today</h3>
              <p className="text-2xl font-bold">{stats.dueCards}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Review Streak</h3>
              <p className="text-2xl font-bold">{stats.reviewStreak} days</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calendar Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6 mb-12"
      >
        <h2 className="text-xl font-bold mb-4">Review Activity</h2>
        <CalendarHeatmap
          data={dailyStats.map(stat => ({
            date: stat.date,
            value: stat.reviews
          }))}
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Review History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Review History</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mastery Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Mastery Progress</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Upcoming Reviews</h2>
        <div className="space-y-4">
          {decks.map(deck => (
            <div
              key={deck.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{deck.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deck.cards?.length || 0} cards
                </p>
              </div>
              <button
                onClick={() => router.push(`/review/${deck.id}`)}
                className="btn btn-primary btn-sm gap-2"
              >
                Review
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 