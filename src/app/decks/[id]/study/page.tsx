'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  RotateCcw,
  Brain,
  Target,
  Clock,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface Card {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  lastReviewed: any;
  nextReview: any;
}

interface Deck {
  id: string;
  title: string;
  cards: Card[];
  reviewCount?: number;
  averagePerformance?: number;
}

export default function StudyPage() {
  const params = useParams();
  const deckId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    remaining: 0
  });
  const [saving, setSaving] = useState(false);

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
        const deckData = { id: doc.id, ...doc.data() } as Deck;
        setDeck(deckData);
        
        // Filter cards that are due for review
        const now = new Date();
        const dueCards = deckData.cards?.filter((card: Card) => {
          if (!card.nextReview) return true;
          // Handle Firestore Timestamp conversion
          const nextReviewDate = card.nextReview && card.nextReview.seconds ? new Date(card.nextReview.seconds * 1000) : new Date(0);
          return nextReviewDate <= now;
        }) || [];

        // Shuffle cards
        const shuffledCards = [...dueCards].sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
        setSessionStats(prev => ({
          ...prev,
          total: shuffledCards.length,
          remaining: shuffledCards.length
        }));
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

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const updateCardDifficulty = async (difficulty: number) => {
    if (!user || !deck || !cards[currentCardIndex] || typeof deckId !== 'string') return; // Added deckId check here too

    const card = cards[currentCardIndex];
    const now = new Date();
    let nextReviewDate = new Date();

    // Calculate next review date based on difficulty (spaced repetition)
    switch (difficulty) {
      case 1: // Hard
        nextReviewDate.setDate(now.getDate() + 1);
        break;
      case 2: // Good
        nextReviewDate.setDate(now.getDate() + 3);
        break;
      case 3: // Easy
        nextReviewDate.setDate(now.getDate() + 7);
        break;
      default:
        nextReviewDate.setDate(now.getDate() + 1);
    }

    setSaving(true); // Indicate saving is in progress

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
      // To avoid potential issues with arrayUnion and updating existing cards, 
      // a safer approach would be to fetch the deck's cards, find the specific card, 
      // update it, and then update the entire cards array. 
      // However, given the current structure, we'll proceed with a modified update.

      // Find the index of the card to update
      const cardIndexToUpdate = deck.cards.findIndex((c: any) => c.id === card.id);

      if (cardIndexToUpdate > -1) {
        const updatedCards = [...deck.cards];
        updatedCards[cardIndexToUpdate] = {
          ...updatedCards[cardIndexToUpdate],
          difficulty: difficulty,
          lastReviewed: now,
          nextReview: nextReviewDate,
          // Ensure other properties are carried over if the type is 'any'
          front: card.front, // Assuming front and back are always present
          back: card.back,
           // Copy other potential fields if necessary
        };

         // Update the entire cards array for simplicity in this iteration
        await updateDoc(deckRef, {
          cards: updatedCards,
          reviewCount: (deck.reviewCount || 0) + 1
        });

      } else {
           console.error('Card not found in deck for update:', card.id);
           toast.error('Failed to update card: Card not found in deck.');
            setSaving(false);
           return;
      }

      setSessionStats(prev => ({
        ...prev,
        correct: difficulty > 1 ? prev.correct + 1 : prev.correct, // Count correct if not 'Hard'
        incorrect: difficulty === 1 ? prev.incorrect + 1 : prev.incorrect, // Count incorrect if 'Hard'
        remaining: prev.remaining > 0 ? prev.remaining - 1 : 0 // Prevent negative remaining count
      }));

      toast.success('Card updated!');

      // Move to next card after a slight delay to allow stat update visibility
      setTimeout(() => {
        if (currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
          setIsFlipped(false);
        } else {
          // Session complete
          toast.success('Study session complete!');
          router.push(`/decks/${deckId}`);
        }
      }, 500); // Increased delay slightly

    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
       setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    // This case is handled by the redirect in useEffect if deckId is invalid or not found
    // The no cards due message is also handled here
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
        <div className="w-32 h-32 mx-auto mb-6 relative opacity-70">
          <Image
            src={theme === 'dark' ? '/dark.png' : '/light.png'}
            alt="No cards"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No cards due for review</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          All cards are up to date! Come back later for your next review.
        </p>
        <button
          onClick={() => router.push(`/decks/${deckId}`)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Return to Deck
        </button>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/decks/${deckId}`)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deck.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Card {currentCardIndex + 1} of {cards.length}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Correct: {sessionStats.correct}</span>
          </div>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
            <XCircle className="w-5 h-5" />
            <span>Incorrect: {sessionStats.incorrect}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Remaining: {sessionStats.remaining}</span>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative h-[400px] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer rounded-xl"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden rounded-xl p-8 md:p-12 flex items-center justify-center text-center bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{currentCard?.front || 'Front'}</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rounded-xl p-8 md:p-12 flex items-center justify-center text-center bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 bg-yellow-200 dark:bg-yellow-700" style={{ transform: 'rotateY(180deg)' }}>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{currentCard?.back || 'Back'}</p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => updateCardDifficulty(1)}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFlipped || saving} // Disable while saving
        >
           {saving && !isFlipped ? <LoadingSpinner className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          Hard
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => updateCardDifficulty(2)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFlipped || saving} // Disable while saving
        >
           {saving && !isFlipped ? <LoadingSpinner className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          Good
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => updateCardDifficulty(3)}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFlipped || saving} // Disable while saving
        >
           {saving && !isFlipped ? <LoadingSpinner className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          Easy
        </motion.button>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-8">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
        />
      </div>
    </div>
  );
} 