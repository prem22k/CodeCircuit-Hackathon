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
import { addDays } from 'date-fns';

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
        setCurrentCardIndex(0);
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

  const updateCardDifficulty = async (cardId: string, difficulty: number) => {
    if (!user || !deck || !cards || cards.length === 0 || currentCardIndex >= cards.length || typeof deckId !== 'string') {
      console.error('updateCardDifficulty: Pre-condition check failed', { user, deck, cards, currentCardIndex, deckId });
      setSaving(false);
      return;
    }

    const card = cards.find(c => c.id === cardId);

    if (!card) {
      console.error('updateCardDifficulty: Card not found in current session cards', { cardId, currentCardIndex, cards });
      setSaving(false);
      return;
    }

    const now = new Date();
    let nextReviewDate = new Date();

    switch (difficulty) {
      case 1: // Hard
        nextReviewDate = addDays(now, 1);
        break;
      case 2: // Good
        nextReviewDate = addDays(now, 3);
        break;
      case 3: // Easy
        nextReviewDate = addDays(now, 7);
        break;
      default:
        nextReviewDate = addDays(now, 1);
    }

    setSaving(true);

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);

      const originalCardIndex = deck.cards.findIndex((c: any) => c.id === card.id);

      if (originalCardIndex > -1) {
        const updatedCards = [...deck.cards];

        const originalCard = updatedCards[originalCardIndex];
        if (!originalCard) {
          console.error('updateCardDifficulty: Original card not found in updatedCards array', { cardId: card.id, originalCardIndex });
          toast.error('Failed to update card: Original card data missing.');
          setSaving(false);
          return;
        }

        updatedCards[originalCardIndex] = {
          ...originalCard,
          difficulty: difficulty,
          lastReviewed: now,
          nextReview: nextReviewDate,
        };

        await updateDoc(deckRef, {
          cards: updatedCards,
          reviewCount: (deck.reviewCount || 0) + 1
        });

      } else {
        console.error('Card not found in deck.cards array for update:', card.id);
        toast.error('Failed to update card: Card not found in deck data.');
      }

      setSessionStats(prev => ({
        ...prev,
        correct: difficulty > 1 ? prev.correct + 1 : prev.correct,
        incorrect: difficulty === 1 ? prev.incorrect + 1 : prev.incorrect,
        remaining: prev.remaining > 0 ? prev.remaining - 1 : 0
      }));

      toast.success('Card updated!');

      setTimeout(() => {
        if (currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
          setIsFlipped(false);
        } else {
          toast.success('Study session complete!');
          router.push(`/decks/${deckId}`);
        }
        setSaving(false);
      }, 500);

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

      {/* Card Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        {currentCard ? (
          <motion.div
            key={currentCard.id}
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => setIsAnimating(false)}
            className="relative w-full max-w-md h-[350px] bg-white dark:bg-gray-800 rounded-xl shadow-lg cursor-pointer perspective-1000"
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 flex items-center justify-center p-6 backface-hidden">
              <p className="text-xl font-semibold text-center text-gray-900 dark:text-white break-words">{currentCard.front}</p>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 flex items-center justify-center p-6 backface-hidden rotate-y-180">
              <p className="text-xl text-center text-gray-700 dark:text-gray-300 break-words">{currentCard.back}</p>
            </div>
          </motion.div>
        ) : (
          <LoadingSpinner className="w-12 h-12" />
        )}
      </motion.div>

      {/* Action Buttons */}
      {currentCard && (
        <div className="flex justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateCardDifficulty(currentCard.id, 1)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFlipped || saving}
          >
            {saving && !isFlipped ? <LoadingSpinner className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            Hard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateCardDifficulty(currentCard.id, 2)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFlipped || saving}
          >
            {saving && !isFlipped ? <LoadingSpinner className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            Good
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateCardDifficulty(currentCard.id, 3)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFlipped || saving}
          >
            {saving && !isFlipped ? <LoadingSpinner className="w-5 h-5" /> : <Target className="w-5 h-5" />}
            Easy
          </motion.button>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-8">
        <span>Progress: {sessionStats.total - sessionStats.remaining} / {sessionStats.total}</span>
        <span>Remaining: {sessionStats.remaining}</span>
      </div>
    </div>
  );
} 