'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDecks } from '@/hooks/useDecks';
import { useReviewHistory } from '@/hooks/useReviewHistory';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
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
  Flame,
  Plus,
  ChevronRight,
  Bookmark,
  Target,
  Activity,
  User,
  Settings,
  LogOut,
  Edit
} from 'lucide-react';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { StreakNotification } from '@/components/StreakNotification';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

interface Deck {
  id: string;
  title: string;
  cards?: Array<{
    id: string;
    question: string;
    answer: string;
    box: number;
    nextReview: any;
    lastReview: any;
    easeFactor: number;
    consecutiveCorrect: number;
  }>;
  reviewCount?: number;
  averagePerformance?: number;
}

const COLORS = ['#000000', '#333333', '#666666', '#999999'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { decks, loading: decksLoading } = useDecks();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalReviews: 0,
    averagePerformance: 0,
    reviewStreak: 0,
  });
  const { dailyStats, streak, loading: historyLoading } = useReviewHistory('all');
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dueCardsCount, setDueCardsCount] = useState(0);

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

      let count = 0;
      const now = new Date();
      decks.forEach(deck => {
        deck.cards?.forEach(card => {
          if (card.nextReview && card.nextReview.toDate() <= now) {
            count++;
          }
        });
      });
      setDueCardsCount(count);
    }
  }, [decks, streak]);

  if (authLoading || decksLoading || historyLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const performanceData = [
    { name: 'Known', value: stats.averagePerformance },
    { name: 'To Learn', value: 100 - stats.averagePerformance }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* The header has been moved to the layout file */}
        {/* End Header */}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Cards</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {stats.totalCards}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Reviews</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {stats.totalReviews}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <Target className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Performance</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {stats.averagePerformance.toFixed(1)}%
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <Activity className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Streak</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {stats.reviewStreak} days
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <Flame className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Recent Activity
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            {dailyStats.length > 0 ? (
              <div className="space-y-4">
                {dailyStats.slice(0, 5).map((stat, index) => (
                  <motion.div
                    key={stat.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{new Date(stat.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-black dark:text-white">{stat.reviews} reviews</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.averagePerformance.toFixed(1)}% avg</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <Image
                    src="/studying.svg"
                    alt="No activity"
                    fill
                    className="object-contain opacity-50"
                  />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No recent activity</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/review')}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Reviewing</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Your Decks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Your Decks
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/decks')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            {decks && decks.length > 0 ? (
              <div className="space-y-4">
                {decks.slice(0, 5).map((deck, index) => (
                  <motion.div
                    key={deck.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => router.push(`/decks/${deck.id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <div className="flex items-center">
                      <Bookmark className="w-5 h-5 text-gray-400 mr-3 group-hover:text-black dark:group-hover:text-white transition-colors" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {deck.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium text-black dark:text-white">{deck.cards?.length || 0} cards</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{deck.reviewCount || 0} reviews</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <Image
                    src="/studying.svg"
                    alt="No decks"
                    fill
                    className="object-contain opacity-50"
                  />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No decks yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/decks')}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Deck</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-6">
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reviews" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                    name="Reviews"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="averagePerformance" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                    name="Success Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Success Rate Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-6">
            Success Rate Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Success Rate */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Success Rate</span>
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.averagePerformance.toFixed(1)}%
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.averagePerformance}%` }}
                />
              </div>
            </div>

            {/* Weekly Trend */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Trend</span>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {dailyStats.length > 0 ? (
                  ((dailyStats[dailyStats.length - 1].averagePerformance - dailyStats[0].averagePerformance) / dailyStats[0].averagePerformance * 100).toFixed(1)
                ) : 0}%
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                vs last week
              </div>
            </div>

            {/* Best Performing Deck */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Best Performing Deck</span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              {decks && decks.length > 0 ? (
                <>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {decks.reduce((best, deck) => 
                      ((deck.averagePerformance || 0) > (best.averagePerformance || 0)) ? deck : best
                    , decks[0]).title}
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {decks.reduce((best, deck) => 
                      ((deck.averagePerformance || 0) > (best.averagePerformance || 0)) ? deck : best
                    , decks[0]).averagePerformance?.toFixed(1) || '0'}% success rate
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">No decks yet</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Calendar Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Review Activity
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-3 h-3 rounded-sm ${getColor(intensity)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
          <CalendarHeatmap 
            data={dailyStats.map(stat => ({
              date: new Date(stat.date).toISOString(),
              value: stat.reviews
            }))}
          />
        </motion.div>

        {/* Upcoming Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-6">
            Upcoming Reviews
          </h2>
          <div className="space-y-4">
            {decks.map(deck => {
              const dueCards = deck.cards?.filter(card => {
                if (!card.nextReview) return false;
                const nextReview = new Date(card.nextReview.seconds * 1000);
                const now = new Date();
                const diffDays = Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays >= 0;
              }) || [];

              if (dueCards.length === 0) return null;

              return (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <Bookmark className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{deck.title}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black dark:text-white">{dueCards.length} cards due</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Next review: {new Date(dueCards[0].nextReview.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper function for heatmap colors
function getColor(intensity: number) {
  const colors = [
    'bg-gray-100 dark:bg-gray-800',
    'bg-blue-100 dark:bg-blue-900',
    'bg-blue-200 dark:bg-blue-800',
    'bg-blue-300 dark:bg-blue-700'
  ];
  return colors[intensity] || colors[0];
} 