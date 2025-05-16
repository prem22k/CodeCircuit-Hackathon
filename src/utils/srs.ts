import { Card } from '../types';

// Leitner System intervals (in days) for each box
const BOX_INTERVALS = [
  0,      // Box 0: Review same day
  1,      // Box 1: Review next day
  3,      // Box 2: Review after 3 days
  7,      // Box 3: Review after a week
  14,     // Box 4: Review after 2 weeks
  30,     // Box 5: Review after a month
];

export const calculateNextReview = (card: Card, isCorrect: boolean): Date => {
  let newBox = card.box;

  if (isCorrect) {
    // Move up a box if correct (max box 5)
    newBox = Math.min(card.box + 1, 5);
  } else {
    // Move back to box 0 if incorrect
    newBox = 0;
  }

  const intervalDays = BOX_INTERVALS[newBox];
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return nextReview;
};

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