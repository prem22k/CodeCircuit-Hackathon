'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDeck } from '@/hooks/useDeck';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Check, X } from 'lucide-react';

export default function ReviewPage({ params }: { params: { deckId: string } }) {
  const deckId = params?.deckId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { deck, loading: deckLoading, error } = useDeck(deckId);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || deckLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Deck Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The deck you're looking for doesn't exist.</p>
      </div>
    );
  }

  const currentCard = deck.cards[currentCardIndex];
  const progress = (currentCardIndex / deck.cards.length) * 100;

  const handleNext = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkReviewed = () => {
    setReviewedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(currentCard.id);
      return newSet;
    });
    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push(`/decks/${deckId}`)}
          className="btn btn-ghost gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Deck
        </button>
        <h1 className="text-2xl font-bold">{deck.title}</h1>
        <div className="w-24" /> {/* Spacer for alignment */}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="relative aspect-[4/3] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 cursor-pointer"
              onClick={handleFlip}
            >
              <div className="h-full flex items-center justify-center text-center">
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full"
                >
                  <div className={`${isFlipped ? 'hidden' : 'block'}`}>
                    <h2 className="text-2xl font-bold mb-4">Question</h2>
                    <p className="text-xl">{currentCard.question}</p>
                  </div>
                  <div className={`${isFlipped ? 'block' : 'hidden'}`}>
                    <h2 className="text-2xl font-bold mb-4">Answer</h2>
                    <p className="text-xl">{currentCard.answer}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={handleFlip}
          className="btn btn-ghost"
        >
          <RotateCcw className="w-5 h-5" />
          Flip
        </button>
        <button
          onClick={handleMarkReviewed}
          disabled={currentCardIndex === deck.cards.length - 1}
          className="btn btn-ghost"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Card Counter */}
      <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
        Card {currentCardIndex + 1} of {deck.cards.length}
      </div>
    </div>
  );
} 