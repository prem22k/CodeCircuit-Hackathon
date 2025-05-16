'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDeck } from '@/hooks/useDeck';

export default function ReviewDeck() {
  const params = useParams();
  const deckId = params?.deckId as string;
  const router = useRouter();
  const { user } = useAuth();
  const { deck, loading, error } = useDeck(deckId);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-red-500">Error loading deck</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {error?.message || 'Deck not found'}
        </p>
        <button
          onClick={() => router.back()}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  const cards = deck.cards || [];
  const currentCard = cards[currentCardIndex];

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const resetDeck = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">No cards in this deck</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add some cards to start reviewing!
        </p>
        <button
          onClick={() => router.back()}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{deck.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <button
              onClick={resetDeck}
              className="btn btn-ghost"
              title="Reset deck"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px] perspective-1000">
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="absolute w-full h-full backface-hidden">
              <div className="w-full h-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
                <p className="text-2xl text-center">{currentCard.front}</p>
              </div>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
                <p className="text-2xl text-center">{currentCard.back}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={goToPreviousCard}
            disabled={currentCardIndex === 0}
            className="btn btn-outline"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={goToNextCard}
            disabled={currentCardIndex === cards.length - 1}
            className="btn btn-outline"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 