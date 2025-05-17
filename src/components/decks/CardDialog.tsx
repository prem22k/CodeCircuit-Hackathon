'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit, Brain, Sparkles } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDialogProps {
  open: boolean;
  onClose: () => void;
  deckId: string;
  card?: {
    id: string;
    front: string;
    back: string;
    difficulty: number;
  };
}

export function CardDialog({ open, onClose, deckId, card }: CardDialogProps) {
  const { user } = useAuth();
  const [front, setFront] = useState(card?.front || '');
  const [back, setBack] = useState(card?.back || '');
  const [loading, setLoading] = useState(false);
  const [frontLength, setFrontLength] = useState(0);
  const [backLength, setBackLength] = useState(0);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFront('');
      setBack('');
      setFrontLength(0);
      setBackLength(0);
    } else {
      setFront(card?.front || '');
      setBack(card?.back || '');
      setFrontLength(card?.front?.length || 0);
      setBackLength(card?.back?.length || 0);
    }
  }, [open, card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be signed in to create a card');
      return;
    }

    if (!front.trim() || !back.trim()) {
      toast.error('Please fill in both front and back of the card');
      return;
    }

    setLoading(true);

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
      const newCard = {
        id: card?.id || Date.now().toString(),
        front: front.trim(),
        back: back.trim(),
        difficulty: card?.difficulty || 0,
        createdAt: new Date(),
        lastReviewed: null
      };

      if (card) {
        // Update existing card
        await updateDoc(deckRef, {
          cards: arrayRemove(card)
        });
      }

      await updateDoc(deckRef, {
        cards: arrayUnion(newCard)
      });

      toast.success(card ? 'Card updated successfully!' : 'Card created successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
                className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"
              >
                {card ? (
                  <Edit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {card ? 'Edit Card' : 'Create New Card'}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="front" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Front (Question/Term)
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {frontLength}/500
                </span>
              </div>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <textarea
                  id="front"
                  value={front}
                  onChange={(e) => {
                    setFront(e.target.value);
                    setFrontLength(e.target.value.length);
                  }}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 resize-none"
                  placeholder="Enter the front of the card (question or term)"
                  rows={3}
                  disabled={loading}
                  maxLength={500}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(frontLength / 500) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="back" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Back (Answer/Definition)
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {backLength}/500
                </span>
              </div>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <textarea
                  id="back"
                  value={back}
                  onChange={(e) => {
                    setBack(e.target.value);
                    setBackLength(e.target.value.length);
                  }}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 resize-none"
                  placeholder="Enter the back of the card (answer or definition)"
                  rows={3}
                  disabled={loading}
                  maxLength={500}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(backLength / 500) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                disabled={loading}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                    {card ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {card ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {card ? 'Update Card' : 'Create Card'}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 