'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen,
  Clock,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { getDecks } from '@/utils/storage'; // Assuming getDecks is needed here
import { Deck } from '@/types'; // Assuming Deck type is defined here
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDecks();
    } else if (!authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const userDecks = await getDecks(user!.id);
      // Optionally filter decks that have cards available for review here
      setDecks(userDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
      // Consider showing a toast error here
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
        >
           <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700 rounded-xl"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Cards</h1>
            <p className="text-gray-600 dark:text-gray-400">Select a deck to start your review session.</p>
          </div>
        </motion.div>

        {decks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-24 h-24 mx-auto mb-6 relative opacity-70">
               {/* Placeholder for an image or icon */}
                <BookOpen className="w-24 h-24 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No decks available for review</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create some decks or add cards to your existing decks to start reviewing.
            </p>
            <Link href="/decks" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2">
             <BookOpen className="w-5 h-5" />
              <span>Go to My Decks</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <AnimatePresence>
              {decks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                   transition={{ delay: index * 0.05, duration: 0.4 }}
                   className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/decks/${deck.id}/study`)}
                >
                   <div className="p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight pr-4">
                        {deck.title}
                      </h3>
                       <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <BookOpen className="w-4 h-4 mr-1.5" />
                          {deck.cards?.length || 0} cards
                        </div>
                    </div>
                     <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                      {deck.description || 'No description provided.'}
                    </p>
                     <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                        <div className="flex items-center">
                           <Clock className="w-4 h-4 mr-1" />
                           Last Studied: {deck.lastStudied ? new Date(deck.lastStudied).toLocaleDateString() : 'Never'}
                        </div>
                         <motion.div
                           whileHover={{ x: 4 }}
                           className="flex items-center text-sm text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors"
                         >
                          Start Study
                           <ChevronRight className="w-4 h-4 ml-1" />
                         </motion.div>
                      </div>
                  </div>
                </motion.div>
              ))}
             </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
} 