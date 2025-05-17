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

type SortOption = 'newest' | 'oldest' | 'difficulty';
type FilterOption = 'all' | 'mastered' | 'learning' | 'not-started';

export default function DeckDetailPage() {
  const { id } = useParams();
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
    if (!user || !id) return;

    const deckRef = doc(db, `users/${user.id}/decks/${id}`);
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
  }, [user, id, router]);

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
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/decks')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {deck.cards?.length || 0} {deck.cards?.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/decks/${id}/edit`)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Pencil className="w-5 h-5" />
            Edit Deck
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn btn-danger flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete Deck
          </button>
          <button
            onClick={() => router.push(`/decks/${id}/study`)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Study Deck
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <BookOpen className="w-5 h-5" />
            <span>Total Cards</span>
          </div>
          <div className="text-2xl font-bold">{deck.cards?.length || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <Clock className="w-5 h-5" />
            <span>Reviews</span>
          </div>
          <div className="text-2xl font-bold">{deck.reviewCount || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <Target className="w-5 h-5" />
            <span>Mastery</span>
          </div>
          <div className="text-2xl font-bold">{deck.averagePerformance || 0}%</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="btn btn-outline flex items-center gap-2"
            >
              {sortBy === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              Sort
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
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
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
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
              className="btn btn-outline flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
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
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedCards.map((card: any) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{card.front}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{card.back}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/decks/${id}/cards/${card.id}/edit`)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCardToDelete(card)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Difficulty: {card.difficulty || 0}/5</span>
                <span>Last reviewed: {card.lastReviewed ? new Date(card.lastReviewed.seconds * 1000).toLocaleDateString() : 'Never'}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedCards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src={theme === 'dark' ? '/dark.png' : '/light.png'}
              alt="No cards"
              fill
              className="object-contain opacity-50"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">No cards found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first card to get started'}
          </p>
          {!searchQuery && filterBy === 'all' && (
            <button
              onClick={() => router.push(`/decks/${id}/cards/new`)}
              className="btn btn-primary"
            >
              Add Your First Card
            </button>
          )}
        </div>
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