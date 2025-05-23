'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Brain,
  BookOpen,
  Clock,
  Target,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteDeckDialog } from '@/components/decks/DeleteDeckDialog';
import { DeleteCardDialog } from '@/components/decks/DeleteCardDialog';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Link from 'next/link';

type SortOption = 'newest' | 'oldest' | 'difficulty';
type FilterOption = 'all' | 'mastered' | 'learning' | 'not-started';

export default function DeckDetailPage() {
  const params = useParams();
  const deckId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [deck, setDeck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Ensure deckId is a string before fetching
    if (typeof deckId !== 'string') {
        setLoading(false);
        toast.error('Invalid deck ID.');
        router.push('/decks'); // Redirect to decks list
        return;
    }

    const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
    const unsubscribe = onSnapshot(deckRef, (doc) => {
      if (doc.exists()) {
        setDeck({ id: doc.id, ...doc.data() });
      } else {
        toast.error('Deck not found');
        router.push('/decks');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching deck:', error);
      toast.error('Failed to load deck');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, deckId, router]);

  const filteredCards = deck?.cards?.filter((card: any) => {
    const matchesSearch = card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.back.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterBy === 'mastered') {
      return matchesSearch && card.difficulty === 5;
    }
    if (filterBy === 'learning') {
      return matchesSearch && card.difficulty > 0 && card.difficulty < 5;
    }
    if (filterBy === 'not-started') {
      return matchesSearch && card.difficulty === 0;
    }
    return matchesSearch;
  }) || [];

  const sortedCards = [...filteredCards].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt?.seconds - a.createdAt?.seconds;
      case 'oldest':
        return a.createdAt?.seconds - b.createdAt?.seconds;
      case 'difficulty':
        return b.difficulty - a.difficulty;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!deck) {
     // This case is handled by the redirect in useEffect if deckId is invalid or not found
    return null;
  }

  return (
    <div className="space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/decks')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deck.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {deck.cards?.length || 0} {deck.cards?.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/decks/${deckId}/cards/new`)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Card</span>
          </motion.button>
          <motion.button
             whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/decks/${deckId}/study`)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>Study Deck</span>
          </motion.button>
           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/decks/${deckId}/edit`)}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            <Pencil className="w-5 h-5" />
            <span>Edit Deck</span>
          </motion.button>
          <motion.button
             whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Deck</span>
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <BookOpen className="w-5 h-5" />
            <span>Total Cards</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{deck.cards?.length || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <Clock className="w-5 h-5" />
            <span>Reviews</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{deck.reviewCount || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <Target className="w-5 h-5" />
            <span>Mastery</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{deck.averagePerformance?.toFixed(1) || 0}%</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-800 dark:text-white transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300"
            >
              {sortBy === 'newest' ? <SortDesc className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <SortAsc className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
              <span className="text-gray-700 dark:text-gray-300">Sort</span>
            </motion.button>
            <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                  >
                    {[
                       { value: 'newest', label: 'Newest First' },
                       { value: 'oldest', label: 'Oldest First' },
                       { value: 'difficulty', label: 'Difficulty' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortOption);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          sortBy === option.value
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
               className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300"
            >
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Filter</span>
            </motion.button>
             <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                  >
                    {[
                      { value: 'all', label: 'All Cards' },
                      { value: 'mastered', label: 'Mastered' },
                      { value: 'learning', label: 'Learning' },
                      { value: 'not-started', label: 'Not Started' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterBy(option.value as FilterOption);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          filterBy === option.value
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <AnimatePresence>
          {sortedCards.map((card: any) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col"
            >
               <Link href={`/decks/${deckId}/cards/${card.id}/edit`} className="flex flex-col flex-grow group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight pr-4">
                    {card.front}
                  </h3>
                   {/* Edit and Delete buttons moved outside the Link */}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-grow mb-4">
                  {card.back}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                  <span>Difficulty: {card.difficulty || 0}/5</span>
                   <span>Last reviewed: {card.lastReviewed ? new Date(card.lastReviewed.seconds * 1000).toLocaleDateString() : 'Never'}</span>
                 </div>
              </Link>
              <div className="flex justify-end gap-1 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                 <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.push(`/decks/${deckId}/cards/${card.id}/edit`)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                   <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCardToDelete(card)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
              </div>
            </motion.div>
          ))
        }
        </AnimatePresence>

         {/* Add New Card Card */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, delay: filteredCards.length * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => router.push(`/decks/${deckId}/cards/new`)}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4"
            >
              <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Card</h3>
          </motion.div>

      </div>

      {/* Empty State */}
      {sortedCards.length === 0 && !searchQuery && filterBy === 'all' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mt-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative opacity-70">
            <Image
              src={theme === 'dark' ? '/dark.png' : '/light.png'}
              alt="No cards"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No cards yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add your first card to this deck to start studying.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/decks/${deckId}/cards/new`)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Card</span>
          </motion.button>
        </motion.div>
      )}

       {/* Empty State - Search/Filter */}
       {sortedCards.length === 0 && (searchQuery || filterBy !== 'all') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mt-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative opacity-70">
            <Image
              src={theme === 'dark' ? '/dark.png' : '/light.png'}
              alt="No cards found"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No matching cards found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
             Try adjusting your search or filters.
          </p>
        </motion.div>
      )}

      {/* Delete Deck Modal */}
      <DeleteDeckDialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        deckId={deck.id}
        deckTitle={deck.title}
      />

      {/* Delete Card Modal */}
      <DeleteCardDialog
        open={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        deckId={deck.id}
        card={cardToDelete}
      />
    </div>
  );
} 