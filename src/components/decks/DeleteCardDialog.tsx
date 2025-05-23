'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-red-600">Delete Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-medium mb-2">Front:</p>
            <p className="text-gray-600 dark:text-gray-300">{card.front}</p>
            <p className="font-medium mt-4 mb-2">Back:</p>
            <p className="text-gray-600 dark:text-gray-300">{card.back}</p>
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this card? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 