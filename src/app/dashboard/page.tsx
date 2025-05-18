'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDecks } from '@/hooks/useDecks';
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
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Image from 'next/image';

// Import necessary types and functions from useReviewHistory
import { DailyStats, ReviewRecord, calculateDailyStats, calculateStreak } from '../../hooks/useReviewHistory';

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

const COLORS = ['#10B981', '#3B82F6', '#6B7280'];

// Update the getColor function for better color intensity
function getColor(intensity: number): string {
  const colors = [
    'bg-gray-100 dark:bg-gray-800',
    'bg-blue-100 dark:bg-blue-900',
    'bg-blue-200 dark:bg-blue-800',
    'bg-blue-300 dark:bg-blue-700',
    'bg-blue-400 dark:bg-blue-600'
  ];
  return colors[intensity] || colors[0];
}

// Add function to calculate heatmap intensity
function calculateIntensity(value: number, maxValue: number): number {
  if (value === 0) return 0;
  if (value >= maxValue) return 4;
  return Math.ceil((value / maxValue) * 4);
}

// Add missing getReviewProgress function
function getReviewProgress(cards: any[]): {
  mastered: number;
  learning: number;
  new: number;
} {
  return cards.reduce(
    (acc, card) => {
      if (card.box >= 4) {
        acc.mastered++;
      } else if (card.box > 0) {
        acc.learning++;
      } else {
        acc.new++;
      }
      return acc;
    },
    { mastered: 0, learning: 0, new: 0 }
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { decks, loading: decksLoading } = useDecks();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalReviews: 0,
    averagePerformance: 0,
    reviewStreak: 0,
    mastered: 0,
    learning: 0,
    new: 0
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [streak, setStreak] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Add state for heatmap data
  const [heatmapData, setHeatmapData] = useState<Array<{ date: string; value: number }>>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch and aggregate review history for all decks
  useEffect(() => {
    const fetchAllHistory = async () => {
      if (!user || !decks) {
        setDailyStats([]);
        setStreak(0);
        setHistoryLoading(false);
        return;
      }

      setHistoryLoading(true);
      let allReviewRecords: ReviewRecord[] = [];

      try {
        for (const deck of decks) {
          const historyRef = collection(db, `users/${user.id}/decks/${deck.id}/history`);
          // Fetch all history for each deck (up to a reasonable limit if needed)
          const q = query(historyRef, orderBy('timestamp', 'desc'), limit(365)); // Fetch last 365 reviews per deck
          const snapshot = await getDocs(q);
          const deckHistory = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
          })) as ReviewRecord[];
          allReviewRecords = [...allReviewRecords, ...deckHistory];
        }

        // Calculate daily stats and streak from aggregated history
        const calculatedDailyStats = calculateDailyStats(allReviewRecords);
        const calculatedStreak = calculateStreak(allReviewRecords);

        setDailyStats(calculatedDailyStats);
        setStreak(calculatedStreak);

      } catch (error) {
        console.error('Error fetching all review history:', error);
        setDailyStats([]);
        setStreak(0);
        // Handle error state as needed
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchAllHistory();

  }, [user, decks]); // Depend on user and decks

  useEffect(() => {
    if (decks) {
      const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0);
      const totalReviews = decks.reduce((sum, deck) => sum + (deck.reviewCount || 0), 0);
      const averagePerformance = decks.reduce((sum, deck) => sum + (deck.averagePerformance || 0), 0) / (decks.length || 1);

      // Calculate review progress from all cards across all decks
      const allCards = decks.flatMap(deck => deck.cards || []);
      const progress = getReviewProgress(allCards);

      setStats({
        totalCards,
        totalReviews,
        averagePerformance,
        reviewStreak: streak,
        ...progress
      });
    }
  }, [decks, streak]); // Depend on decks and the new aggregated streak

  // Update heatmap data when dailyStats changes (now populated by fetchAllHistory)
  useEffect(() => {
    if (dailyStats.length > 0) {
      const data = dailyStats.map(stat => ({
        date: new Date(stat.date).toISOString(),
        value: stat.reviews
      }));
      setHeatmapData(data);
    } else {
      setHeatmapData([]);
    }
  }, [dailyStats]);

  // Add click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate the date range for the heatmap (last 90 days) - keep this for passing to component
  const today = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(today.getDate() - 90);

  if (authLoading || decksLoading || historyLoading) { // Include historyLoading in the check
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Update the performance data calculation
  const performanceData = [
    { name: 'Mastered', value: stats.mastered },
    { name: 'Learning', value: stats.learning },
    { name: 'New', value: stats.new }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-8 h-8 text-black dark:text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              BrainBoost
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/decks')}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-2"
            >
              <Bookmark className="w-5 h-5" />
              <span>My Decks</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/review')}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>Review</span>
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || 'User'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          router.push('/profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          router.push('/profile/edit');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          router.push('/settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        router.push('/login');
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
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

          {/* Add new stats card for mastery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mastery Rate</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {stats.totalCards > 0 ? ((stats.mastered / stats.totalCards) * 100).toFixed(1) : 0}%
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-black dark:text-white" />
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
        {stats.totalCards > 0 ? (
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
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1000}
                      labelLine={false}
                      label={({ name, percent, cx, cy, midAngle, outerRadius, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 20;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill={COLORS[index % COLORS.length]}
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            className="text-sm font-medium"
                          >
                            {`${name} ${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
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
                      formatter={(value: number) => [`${value} cards`, '']}
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm text-center"
          >
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image
                src="/studying.svg"
                alt="No data"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Create cards in your decks to see performance data.</p>
          </motion.div>
        )}

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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Review Activity
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track your daily review progress over the last 90 days
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((intensity) => (
                    <div
                      key={intensity}
                      className={`w-4 h-4 rounded-md transition-all duration-200 ${intensity === 0
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : intensity === 1
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : intensity === 2
                            ? 'bg-blue-200 dark:bg-blue-800'
                            : intensity === 3
                              ? 'bg-blue-300 dark:bg-blue-700'
                              : 'bg-blue-400 dark:bg-blue-600'
                        }`}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
              {/* Display total reviews from aggregated data */}
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {dailyStats.reduce((sum, day) => sum + day.reviews, 0)} total reviews
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white dark:from-gray-800 via-transparent to-white dark:to-gray-800 pointer-events-none z-10" />
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[800px]">
                <CalendarHeatmap
                  data={heatmapData}
                  startDate={ninetyDaysAgo}
                  endDate={today}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last 90 days</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {/* Display active days percentage from aggregated data */}
              <span>
                {dailyStats.length > 0
                  ? `${Math.round(
                    (dailyStats.filter(day => day.reviews > 0).length / dailyStats.filter(day => new Date(day.date) >= ninetyDaysAgo && new Date(day.date) <= today).length) * 100
                  )}% active days`
                  : '0% active days'}
              </span>
            </div>
          </div>
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