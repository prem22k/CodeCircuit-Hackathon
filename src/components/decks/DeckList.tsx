'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Brain,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CreateDeckDialog } from './CreateDeckDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import { Deck } from '@/types';
import { DeleteDeckDialog } from './DeleteDeckDialog';

type SortOption = 'newest' | 'oldest' | 'name' | 'cards';
type FilterOption = 'all' | 'recent' | 'empty';

export function DeckList() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  useEffect(() => {
    if (!user) return;

    const decksRef = collection(db, `users/${user.id}/decks`);
    const q = query(decksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const decksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastStudied: doc.data().lastStudied?.toDate(),
      })) as Deck[];
      setDecks(decksData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching decks:', error);
      toast.error('Failed to load decks');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredDecks = decks.filter(deck => {
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deck.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterBy === 'recent') {
      return matchesSearch && deck.reviewCount > 0;
    }
    if (filterBy === 'empty') {
      return matchesSearch && (!deck.cards || deck.cards.length === 0);
    }
    return matchesSearch;
  });

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'cards':
        return (b.cards?.length || 0) - (a.cards?.length || 0);
      default:
        return 0;
    }
  });

  const handleDeleteClick = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Decks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {sortedDecks.length} {sortedDecks.length === 1 ? 'deck' : 'decks'}
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Deck
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <SortAsc className="w-5 h-5" />
              Sort
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'name', label: 'Name' },
                  { value: 'cards', label: 'Number of Cards' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as SortOption);
                      setIsSortOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                {[
                  { value: 'all', label: 'All Decks' },
                  { value: 'recent', label: 'Recently Studied' },
                  { value: 'empty', label: 'Empty Decks' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterBy(option.value as FilterOption);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedDecks.map((deck) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {deck.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/decks/${deck.id}/edit`)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(deck)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {deck.description || 'No description provided'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{deck.cards?.length || 0} cards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{deck.reviewCount} reviews</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{Math.round(deck.averagePerformance)}%</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => router.push(`/decks/${deck.id}/study`)}
                  className="w-full btn btn-primary"
                >
                  Study Deck
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedDecks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src={theme === 'dark' ? '/dark.png' : '/light.png'}
              alt="No decks"
              fill
              className="object-contain opacity-50"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">No decks found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first deck to get started'}
          </p>
          {!searchQuery && filterBy === 'all' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              Create Your First Deck
            </button>
          )}
        </div>
      )}

      {/* Create Deck Modal */}
      <CreateDeckDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Delete Deck Modal */}
      {selectedDeck && (
        <DeleteDeckDialog
          open={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedDeck(null);
          }}
          deckId={selectedDeck.id}
          deckTitle={selectedDeck.title}
        />
      )}
    </div>
  );
} 