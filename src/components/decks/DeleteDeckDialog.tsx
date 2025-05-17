'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DeleteDeckDialogProps {
  open: boolean;
  onClose: () => void;
  deckId: string;
  deckTitle: string;
}

export function DeleteDeckDialog({ open, onClose, deckId, deckTitle }: DeleteDeckDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      toast.error('You must be signed in to delete a deck');
      return;
    }

    setLoading(true);

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
      await deleteDoc(deckRef);
      toast.success('Deck deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast.error('Failed to delete deck');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Delete Deck
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-6 h-6" />
            <p className="font-medium">Warning: This action cannot be undone</p>
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete the deck "{deckTitle}"? All cards and review history will be permanently deleted.
          </p>

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
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Deck'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 