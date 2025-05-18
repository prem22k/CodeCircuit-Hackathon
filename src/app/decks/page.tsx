'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronRight,
  X,
  Brain,
  Target,
  Clock,
  Calendar
} from 'lucide-react';
import { getDecks, createDeck, deleteDeck, updateDeck } from '@/utils/storage';
import { Deck } from '@/types';
import { Dialog } from '@headlessui/react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/common/Toast';
import Tutorial from '@/components/Tutorial';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

// Mark this page as dynamic
export const dynamic = 'force-dynamic';

type SortOption = 'newest' | 'oldest' | 'name' | 'cards';
type FilterOption = 'all' | 'recent' | 'empty';

export default function DecksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadDecks();
    } else if (!authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadDecks = async () => {
    try {
      const userDecks = await getDecks(user!.id);
      setDecks(userDecks);
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Error loading decks:', error);
      showToast('error', 'Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) {
      showToast('error', 'Please enter a deck title');
      return;
    }

    try {
      const newDeck = await createDeck(user!.id, {
        title: newDeckTitle,
        description: newDeckDescription,
      });

      setDecks([newDeck, ...decks]);
      setIsCreateModalOpen(false);
      setNewDeckTitle('');
      setNewDeckDescription('');
      showToast('success', 'Deck created successfully!');
    } catch (error) {
      console.error('Error creating deck:', error);
      showToast('error', 'Failed to create deck');
    }
  };

  const handleEditDeck = async () => {
    if (!selectedDeck || !newDeckTitle.trim()) {
      showToast('error', 'Please enter a deck title');
      return;
    }

    try {
      await updateDeck(user!.id, selectedDeck.id, {
        title: newDeckTitle,
        description: newDeckDescription,
      });

      setDecks(decks.map(deck =>
        deck.id === selectedDeck.id ? {
          ...deck,
          title: newDeckTitle,
          description: newDeckDescription,
          updatedAt: new Date(),
        } : deck
      ));

      setIsEditModalOpen(false);
      setSelectedDeck(null);
      setNewDeckTitle('');
      setNewDeckDescription('');
      showToast('success', 'Deck updated successfully!');
    } catch (error) {
      console.error('Error updating deck:', error);
      showToast('error', 'Failed to update deck');
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      await deleteDeck(user!.id, deckId);
      setDecks(decks.filter(deck => deck.id !== deckId));
      showToast('success', 'Deck deleted successfully!');
    } catch (error) {
      console.error('Error deleting deck:', error);
      showToast('error', 'Failed to delete deck');
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const filteredAndSortedDecks = decks
    .filter(deck => {
      const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' ? true :
        filterBy === 'recent' ? (new Date().getTime() - new Date(deck.updatedAt).getTime()) < 7 * 24 * 60 * 60 * 1000 :
          deck.cards.length === 0;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'cards':
          return b.cards.length - a.cards.length;
        default:
          return 0;
      }
    });

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                My Decks
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredAndSortedDecks.length} {filteredAndSortedDecks.length === 1 ? 'deck' : 'decks'} total
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Deck</span>
          </motion.button>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decks..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center space-x-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300"
              >
                <SortAsc className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-300">Sort</span>
              </motion.button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                  >
                    {['newest', 'oldest', 'name', 'cards'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option as SortOption);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${sortBy === option
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
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
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center space-x-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-300">Filter</span>
              </motion.button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                  >
                    {['all', 'recent', 'empty'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterBy(option as FilterOption);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${filterBy === option
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {filteredAndSortedDecks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <Image
                src={theme === 'dark' ? '/dark.png' : '/light.png'}
                alt="No decks"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              {searchQuery ? 'No matching decks found' : 'No decks yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first deck to start learning'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Deck</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAndSortedDecks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <Link href={`/decks/${deck.id}`} className="flex flex-col p-6 flex-grow group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight pr-4">
                        {deck.title}
                      </h3>
                      {/* Edit and Delete buttons moved outside the Link */}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                      {deck.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1.5" />
                          {deck.cards?.length || 0} {deck.cards?.length === 1 ? 'card' : 'cards'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          Updated {new Date(deck.updatedAt).toLocaleDateString()}
                        </div>
                      </div>

                    </div>
                  </Link>
                  <div className="flex justify-end gap-1 p-4 border-t border-gray-100 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedDeck(deck);
                        setNewDeckTitle(deck.title);
                        setNewDeckDescription(deck.description);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create Deck Modal */}
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Deck
                </Dialog.Title>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newDeckTitle}
                    onChange={(e) => setNewDeckTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                    placeholder="Enter deck title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newDeckDescription}
                    onChange={(e) => setNewDeckDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                    placeholder="Enter deck description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateDeck}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Create Deck
                  </motion.button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Deck Modal */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Deck
                </Dialog.Title>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newDeckTitle}
                    onChange={(e) => setNewDeckTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                    placeholder="Enter deck title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newDeckDescription}
                    onChange={(e) => setNewDeckDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                    placeholder="Enter deck description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditDeck}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
} 