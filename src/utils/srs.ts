import { Card } from '../types/firebase';

export interface CardReview {
  id: string;
  box: number;
  nextReview: Date;
  lastReview: Date;
  easeFactor: number;
  consecutiveCorrect: number;
}

export interface ReviewResult {
  box: number;
  nextReview: Date;
  easeFactor: number;
  consecutiveCorrect: number;
}

// SM-2 Algorithm constants
const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;
const BOX_INTERVALS = [1, 6, 15, 30, 90]; // Days between reviews for each box

/**
 * Calculate the next review date based on the current box
 */
export function calculateNextReviewDate(box: number): Date {
  const now = new Date();
  const daysToAdd = BOX_INTERVALS[box - 1] || BOX_INTERVALS[BOX_INTERVALS.length - 1];
  return new Date(now.setDate(now.getDate() + daysToAdd));
}

/**
 * Process a card review using the SM-2 algorithm
 */
export function processReview(
  currentReview: CardReview,
  performance: number // 0-5 scale, where 0 is complete failure and 5 is perfect
): ReviewResult {
  const { box, easeFactor, consecutiveCorrect } = currentReview;
  
  // Calculate new ease factor
  let newEaseFactor = easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
  newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);

  // Calculate new box and consecutive correct count
  let newBox = box;
  let newConsecutiveCorrect = consecutiveCorrect;

  if (performance >= 3) {
    // Correct answer
    newConsecutiveCorrect += 1;
    if (newConsecutiveCorrect >= 2) {
      newBox = Math.min(box + 1, BOX_INTERVALS.length);
    }
  } else {
    // Incorrect answer
    newConsecutiveCorrect = 0;
    newBox = Math.max(1, box - 1);
  }

  return {
    box: newBox,
    nextReview: calculateNextReviewDate(newBox),
    easeFactor: newEaseFactor,
    consecutiveCorrect: newConsecutiveCorrect
  };
}

/**
 * Create a new card review with initial values
 */
export function createInitialReview(cardId: string): CardReview {
  return {
    id: cardId,
    box: 1,
    nextReview: calculateNextReviewDate(1),
    lastReview: new Date(),
    easeFactor: INITIAL_EASE_FACTOR,
    consecutiveCorrect: 0
  };
}

/**
 * Get the number of cards due for review today
 */
export function getCardsDueToday(reviews: CardReview[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return reviews.filter(review => {
    const reviewDate = new Date(review.nextReview);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  }).length;
}

/**
 * Get the next review date for a card
 */
export function getNextReviewDate(review: CardReview): Date {
  return new Date(review.nextReview);
}

/**
 * Check if a card is due for review
 */
export function isCardDue(review: CardReview): boolean {
  const now = new Date();
  return new Date(review.nextReview) <= now;
}

export const getReviewProgress = (cards: Card[]): {
  mastered: number;
  learning: number;
  new: number;
} => {
  return cards.reduce(
    (acc, card) => {
      if (card.box >= 4) {
        acc.mastered++;
      } else if (card.box > 0) {
        acc.learning++;
      } else {
        acc.new++;
      }
      return acc;
    },
    { mastered: 0, learning: 0, new: 0 }
  );
}; 