'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDecks } from '@/hooks/useDecks';
import { useReviewHistory } from '@/hooks/useReviewHistory';
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
  ArrowRight,
  Brain,
  Zap,
  Sparkles,
  Flame
} from 'lucide-react';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { StreakNotification } from '@/components/StreakNotification';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Deck {
  id: string;
  title: string;
  cards?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  reviewCount?: number;
  averagePerformance?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { decks, loading: decksLoading } = useDecks();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalReviews: 0,
    averagePerformance: 0,
    reviewStreak: 0
  });
  const { dailyStats, streak, loading: historyLoading } = useReviewHistory('all');
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (decks) {
      const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0);
      const totalReviews = decks.reduce((sum, deck) => sum + (deck.reviewCount || 0), 0);
      const averagePerformance = decks.reduce((sum, deck) => sum + (deck.averagePerformance || 0), 0) / (decks.length || 1);

      setStats({
        totalCards,
        totalReviews,
        averagePerformance,
        reviewStreak: streak
      });
    }
  }, [decks, streak]);

  if (authLoading || decksLoading || historyLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Cards</p>
              <h3 className="text-2xl font-bold">{stats.totalCards}</h3>
            </div>
            <BookOpen className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
              <h3 className="text-2xl font-bold">{stats.totalReviews}</h3>
            </div>
            <Zap className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Performance</p>
              <h3 className="text-2xl font-bold">{stats.averagePerformance.toFixed(1)}%</h3>
            </div>
            <Sparkles className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
              <h3 className="text-2xl font-bold">{stats.reviewStreak} days</h3>
            </div>
            <Flame className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {dailyStats.length > 0 ? (
            <div className="space-y-4">
              {dailyStats.slice(0, 5).map((stat) => (
                <div key={stat.date} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{new Date(stat.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{stat.reviews} reviews</p>
                    <p className="text-sm text-gray-500">{stat.averagePerformance.toFixed(1)}% avg</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Your Decks</h2>
          {decks && decks.length > 0 ? (
            <div className="space-y-4">
              {decks.slice(0, 5).map((deck) => (
                <div key={deck.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{deck.title}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{deck.cards?.length || 0} cards</p>
                    <p className="text-sm text-gray-500">{deck.reviewCount || 0} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No decks yet</p>
          )}
        </motion.div>
      </div>
    </div>
  );
} 