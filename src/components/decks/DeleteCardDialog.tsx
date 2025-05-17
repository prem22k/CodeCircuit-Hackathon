'use client';

import { useState } from 'react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteCardDialogProps {
  open: boolean;
  onClose: () => void;
  deckId: string;
  card: {
    id: string;
    front: string;
    back: string;
  };
}

export function DeleteCardDialog({ open, onClose, deckId, card }: DeleteCardDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      toast.error('You must be signed in to delete a card');
      return;
    }

    setLoading(true);

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
      await updateDoc(deckRef, {
        cards: arrayRemove(card)
      });
      toast.success('Card deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    } finally {
      setLoading(false);
    }
  };

  // Wrap the dialog in AnimatePresence for exit animations
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                   initial={{ rotate: -15, scale: 0.8 }}
                   animate={{ rotate: 0, scale: 1 }}
                   transition={{ duration: 0.3 }}
                   className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full"
                 >
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                 </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Confirm Card Deletion
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all duration-200 rounded-full"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300">
                 <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-semibold text-yellow-700 dark:text-yellow-200">Warning: Irreversible Action</h3>
                   <p className="text-sm">
                     Deleting this card is permanent. This action cannot be undone.
                   </p>
                 </div>
               </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Front:</p>
                <div className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">
                  <p>{card.front}</p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3" />
                <p className="font-semibold text-gray-800 dark:text-gray-200">Back:</p>
                 <div className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">
                   <p>{card.back}</p>
                 </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Are you sure you want to delete this card? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center"
                    >
                      <Loader2 className="w-5 h-5 mr-2" />
                      <span>Deleting...</span>
                    </motion.div>
                  ) : (
                    <span>Delete Card</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 