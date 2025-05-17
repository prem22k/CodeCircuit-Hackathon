import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, Flame, Sparkles, Clock } from 'lucide-react';

interface StreakNotificationProps {
  streak: number;
  lastReviewDate: Date | null;
}

type NotificationType = 'achievement' | 'reminder' | 'milestone' | null;

interface NotificationContent {
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const getNotificationContent = (type: NotificationType, streak: number): NotificationContent => {
  switch (type) {
    case 'achievement':
      return {
        title: 'Streak Achievement! 🎉',
        message: `Congratulations! You've maintained a ${streak}-day streak! Keep up the amazing work!`,
        icon: <Trophy className="w-6 h-6" />,
        color: 'text-yellow-500',
        gradient: 'from-yellow-400 to-orange-500',
      };
    case 'milestone':
      return {
        title: 'Milestone Reached! 🌟',
        message: `Incredible! You've reached a ${streak}-day streak milestone. You're on fire!`,
        icon: <Sparkles className="w-6 h-6" />,
        color: 'text-purple-500',
        gradient: 'from-purple-400 to-pink-500',
      };
    case 'reminder':
      return {
        title: 'Keep Your Streak Alive! 🔥',
        message: "Don't break your streak! Review your cards today to maintain your progress.",
        icon: <Flame className="w-6 h-6" />,
        color: 'text-red-500',
        gradient: 'from-red-400 to-orange-500',
      };
    default:
      return {
        title: '',
        message: '',
        icon: <Bell className="w-6 h-6" />,
        color: 'text-gray-500',
        gradient: 'from-gray-400 to-gray-500',
      };
  }
};

export function StreakNotification({ streak, lastReviewDate }: StreakNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<NotificationType>(null);

  useEffect(() => {
    if (!lastReviewDate) return;

    const today = new Date();
    const lastReview = new Date(lastReviewDate);
    const daysSinceLastReview = Math.floor(
      (today.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Show achievement for new streaks
    if (streak > 0) {
      if (streak % 30 === 0) {
        setNotificationType('milestone');
        setShowNotification(true);
      } else if (streak % 7 === 0) {
        setNotificationType('achievement');
        setShowNotification(true);
      }
    }
    
    // Show reminder if no review in 24 hours
    if (daysSinceLastReview >= 1) {
      setNotificationType('reminder');
      setShowNotification(true);
    }
  }, [streak, lastReviewDate]);

  if (!showNotification || !notificationType) return null;

  const content = getNotificationContent(notificationType, streak);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div
          initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
          animate={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`p-3 rounded-full bg-gradient-to-r ${content.gradient} shadow-lg`}
              >
                <div className={content.color}>
                  {content.icon}
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-lg mb-1 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
                >
                  {content.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {content.message}
                </motion.p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotification(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Progress bar for reminder */}
            {notificationType === 'reminder' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 h-1 bg-gradient-to-r from-red-400 to-orange-500 rounded-full"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 