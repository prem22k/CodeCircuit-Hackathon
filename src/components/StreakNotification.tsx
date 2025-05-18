import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, Flame } from 'lucide-react';

interface StreakNotificationProps {
  streak: number;
  lastReviewDate: Date | null;
}

export function StreakNotification({ streak, lastReviewDate }: StreakNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'achievement' | 'reminder' | null>(null);

  useEffect(() => {
    if (!lastReviewDate) return;

    const today = new Date();
    const lastReview = new Date(lastReviewDate);
    const daysSinceLastReview = Math.floor(
      (today.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Show achievement for new streaks
    if (streak > 0 && streak % 7 === 0) {
      setNotificationType('achievement');
      setShowNotification(true);
    }
    // Show reminder if no review in 24 hours
    else if (daysSinceLastReview >= 1) {
      setNotificationType('reminder');
      setShowNotification(true);
    }
  }, [streak, lastReviewDate]);

  if (!showNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">
              {notificationType === 'achievement' ? (
                <Trophy className="w-6 h-6 text-primary-500" />
              ) : (
                <Flame className="w-6 h-6 text-primary-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">
                {notificationType === 'achievement'
                  ? 'Streak Achievement!'
                  : 'Keep Your Streak Alive!'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notificationType === 'achievement'
                  ? `Congratulations! You've maintained a ${streak}-day streak!`
                  : "Don't break your streak! Review your cards today."}
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 