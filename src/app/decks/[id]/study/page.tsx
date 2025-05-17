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

export default function StudyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [deck, setDeck] = useState<any>(null);
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

  useEffect(() => {
    if (!user || !id) return;

    const deckRef = doc(db, `users/${user.id}/decks/${id}`);
    const unsubscribe = onSnapshot(deckRef, (doc) => {
      if (doc.exists()) {
        const deckData = { id: doc.id, ...doc.data() };
        setDeck(deckData);
        
        // Filter cards that are due for review
        const now = new Date();
        const dueCards = deckData.cards?.filter((card: Card) => {
          if (!card.nextReview) return true;
          return new Date(card.nextReview.seconds * 1000) <= now;
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
    });

    return () => unsubscribe();
  }, [user, id, router]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const updateCardDifficulty = async (difficulty: number) => {
    if (!user || !deck || !cards[currentCardIndex]) return;

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

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${id}`);
      const updatedCards = deck.cards.map((c: Card) => {
        if (c.id === card.id) {
          return {
            ...c,
            difficulty: difficulty,
            lastReviewed: now,
            nextReview: nextReviewDate
          };
        }
        return c;
      });

      await updateDoc(deckRef, {
        cards: updatedCards,
        reviewCount: (deck.reviewCount || 0) + 1
      });

      setSessionStats(prev => ({
        ...prev,
        correct: difficulty > 1 ? prev.correct + 1 : prev.correct,
        incorrect: difficulty === 1 ? prev.incorrect + 1 : prev.incorrect,
        remaining: prev.remaining - 1
      }));

      // Move to next card
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {
        // Session complete
        toast.success('Study session complete!');
        router.push(`/decks/${id}`);
      }
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
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
      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <Image
            src={theme === 'dark' ? '/dark.png' : '/light.png'}
            alt="No cards"
            fill
            className="object-contain opacity-50"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">No cards due for review</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          All cards are up to date! Come back later for your next review.
        </p>
        <button
          onClick={() => router.push(`/decks/${id}`)}
          className="btn btn-primary"
        >
          Return to Deck
        </button>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/decks/${id}`)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Card {currentCardIndex + 1} of {cards.length}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span>{sessionStats.correct}</span>
          </div>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="w-5 h-5" />
            <span>{sessionStats.incorrect}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <BookOpen className="w-5 h-5" />
            <span>{sessionStats.remaining}</span>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative h-[400px] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className={`absolute w-full h-full backface-hidden rounded-xl p-8 flex items-center justify-center text-center ${
            isFlipped ? 'hidden' : 'block'
          }`}>
            <div className="bg-white dark:bg-gray-800 w-full h-full rounded-xl shadow-lg border dark:border-gray-700 p-8 flex items-center justify-center">
              <p className="text-2xl font-medium">{currentCard.front}</p>
            </div>
          </div>

          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden rounded-xl p-8 flex items-center justify-center text-center ${
            isFlipped ? 'block' : 'hidden'
          }`}>
            <div className="bg-white dark:bg-gray-800 w-full h-full rounded-xl shadow-lg border dark:border-gray-700 p-8 flex items-center justify-center">
              <p className="text-2xl font-medium">{currentCard.back}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => updateCardDifficulty(1)}
          className="btn btn-danger flex items-center gap-2"
          disabled={!isFlipped}
        >
          <XCircle className="w-5 h-5" />
          Hard
        </button>
        <button
          onClick={() => updateCardDifficulty(2)}
          className="btn btn-primary flex items-center gap-2"
          disabled={!isFlipped}
        >
          <CheckCircle2 className="w-5 h-5" />
          Good
        </button>
        <button
          onClick={() => updateCardDifficulty(3)}
          className="btn btn-success flex items-center gap-2"
          disabled={!isFlipped}
        >
          <Target className="w-5 h-5" />
          Easy
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
        />
      </div>
    </div>
  );
} 