'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  SortDesc,
  ChevronDown,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CreateDeckDialog } from './CreateDeckDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import { Deck } from '@/types';
import { DeleteDeckDialog } from './DeleteDeckDialog';
import { formatDistanceToNowStrict } from 'date-fns';

type SortOption = 'newest' | 'oldest' | 'name' | 'cards' | 'lastStudied';
type FilterOption = 'all' | 'recent' | 'empty' | 'needsReview';

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

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Firestore querying does not support sorting by array length or on multiple fields without composite indexes.
    // We will fetch all decks and perform sorting and filtering client-side for flexibility.

    const decksRef = collection(db, `users/${user.id}/decks`);
    const q = query(decksRef); // Fetch all decks initially

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const decksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastStudied: doc.data().lastStudied?.toDate(),
        // Ensure cards field exists and is an array for sorting/filtering
        cards: Array.isArray(doc.data().cards) ? doc.data().cards : [],
      })) as Deck[];

      setDecks(decksData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching decks:', error);
      toast.error('Failed to load decks');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]); // Only depend on user

  const filteredAndSortedDecks = useMemo(() => {
    let currentDecks = [...decks];

    // Apply Filtering
    currentDecks = currentDecks.filter(deck => {
      const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deck.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterBy === 'recent') {
        // Filter for decks studied in the last 30 days
         const thirtyDaysAgo = new Date();
         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return deck.lastStudied && deck.lastStudied >= thirtyDaysAgo;
      }
      if (filterBy === 'empty') {
        return !deck.cards || deck.cards.length === 0;
      }
      if (filterBy === 'needsReview') {
         // Basic filter: decks studied more than 7 days ago, or never studied (could be improved)
         const sevenDaysAgo = new Date();
         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
         return !deck.lastStudied || deck.lastStudied <= sevenDaysAgo; // Decks needing review are those not studied recently or never
      }
      return true; // 'all' filter
    });

    // Apply Sorting
    currentDecks.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'oldest':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'cards':
          return (b.cards?.length || 0) - (a.cards?.length || 0);
        case 'lastStudied':
           // Sort by last studied date, newest first. Decks never studied come last.
          if (!a.lastStudied && !b.lastStudied) return 0;
          if (!a.lastStudied) return 1; // a never studied, b was - a comes after
          if (!b.lastStudied) return -1; // b never studied, a was - b comes after
          return b.lastStudied.getTime() - a.lastStudied.getTime();
        default:
          return 0;
      }
    });

    return currentDecks;
  }, [decks, searchQuery, filterBy, sortBy]);

  const handleDeleteClick = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsDeleteModalOpen(true);
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Decks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredAndSortedDecks.length} {filteredAndSortedDecks.length === 1 ? 'deck' : 'decks'} found
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-10 px-4 py-2 gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Deck
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search decks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <div className="relative" ref={sortRef}>
            <motion.button
              whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F9FAFB' }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setIsSortOpen(!isSortOpen)}
               className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
             >
              {sortBy === 'newest' ? <SortDesc className="w-5 h-5" /> :
              sortBy === 'oldest' ? <SortAsc className="w-5 h-5" /> :
              sortBy === 'name' ? <span className="w-5 h-5 flex items-center justify-center">Az</span> :
              sortBy === 'cards' ? <BookOpen className="w-5 h-5" /> :
              sortBy === 'lastStudied' ? <Clock className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              Sort
              <motion.div animate={{ rotate: isSortOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden"
                >
                  {[
                    { value: 'newest', label: 'Newest First', icon: <SortDesc className="w-4 h-4" /> },
                    { value: 'oldest', label: 'Oldest First', icon: <SortAsc className="w-4 h-4" /> },
                    { value: 'name', label: 'Name (A-Z)', icon: <span className="w-4 h-4 flex items-center justify-center text-xs font-semibold">Az</span> },
                    { value: 'cards', label: 'Most Cards', icon: <BookOpen className="w-4 h-4" /> },
                    { value: 'lastStudied', label: 'Recently Studied', icon: <Clock className="w-4 h-4" /> },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6' }}
                      onClick={() => {
                        setSortBy(option.value as SortOption);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${sortBy === option.value ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {option.icon} {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative" ref={filterRef}>
            <motion.button
               whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F9FAFB' }}
               whileTap={{ scale: 0.98 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Filter className="w-5 h-5" />
              Filter
               <motion.div animate={{ rotate: isFilterOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden"
                >
                  {[
                    { value: 'all', label: 'All Decks' },
                    { value: 'recent', label: 'Recently Studied' },
                    { value: 'needsReview', label: 'Needs Review', icon: <Clock className="w-4 h-4" /> },
                    { value: 'empty', label: 'Empty Decks' },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6' }}
                      onClick={() => {
                        setFilterBy(option.value as FilterOption);
                        if (option.value === 'needsReview') setSortBy('lastStudied');
                        else if (filterBy === 'needsReview' && sortBy === 'lastStudied') setSortBy('newest'); // Reset sort if leaving needsReview filter
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${filterBy === option.value ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {option.icon && <span className="opacity-70 mr-2">{option.icon}</span>} {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Deck Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredAndSortedDecks.map((deck) => (
            <motion.div
              key={deck.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              {/* Make the card content area clickable for study */}
              <Link href={`/decks/${deck.id}/study`} className="flex-1 p-6 block">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                     {deck.title}
                    </h3>
                   {/* Edit/Delete buttons within the clickable area, but with own click handlers */}
                   <div className="flex gap-2 flex-shrink-0">
                      <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/decks/${deck.id}/edit`); }}
                         className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                         aria-label="Edit deck"
                       >
                         <Pencil className="w-5 h-5" />
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteClick(deck); }}
                         className="p-1.5 text-red-500 hover:text-red-600 rounded-md transition-colors"
                         aria-label="Delete deck"
                       >
                         <Trash2 className="w-5 h-5" />
                       </motion.button>
                   </div>
                 </div>
                 <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                   {deck.description || 'No description provided.'}
                 </p>
                 <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                   <div className="flex items-center gap-1">
                     <BookOpen className="w-4 h-4" />
                     <span>{deck.cards?.length || 0} cards</span>
                   </div>
                   {deck.reviewCount > 0 && (
                     <div className="flex items-center gap-1">
                       <Eye className="w-4 h-4" />
                       <span>{deck.reviewCount} reviews</span>
                     </div>
                   )}
                    {deck.lastStudied && (
                     <div className="flex items-center gap-1">
                       <Clock className="w-4 h-4" />
                       <span>Studied {formatDistanceToNowStrict(deck.lastStudied)} ago</span>
                     </div>
                    )}
                    {deck.averagePerformance > 0 && (
                     <div className="flex items-center gap-1">
                       <Target className="w-4 h-4" />
                       <span>{Math.round(deck.averagePerformance)}% avg</span>
                     </div>
                    )}
                 </div>
              </Link>

              {/* Study button outside clickable area to avoid nested interactive elements */}
               {deck.cards?.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/decks/${deck.id}/study`)}
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-10 px-4 py-2"
                  >
                    Study Deck
                  </motion.button>
                </div>
               )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredAndSortedDecks.length === 0 && (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src={theme === 'dark' ? '/dark.png' : '/light.png'}
              alt="No decks"
              fill
              className="object-contain opacity-50"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No decks found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Create your first deck to get started.'}
          </p>
          {!searchQuery && filterBy === 'all' && ( !loading && // Only show if not loading
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-10 px-4 py-2"
            >
              Create Your First Deck
            </motion.button>
          )}
        </motion.div>
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