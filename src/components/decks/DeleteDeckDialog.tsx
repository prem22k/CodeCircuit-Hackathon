'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteDeckDialogProps {
  open: boolean;
  onClose: () => void;
  deckId: string;
  deckTitle: string;
}

export function DeleteDeckDialog({ open, onClose, deckId, deckTitle }: DeleteDeckDialogProps) {
  const { user } = useAuth();
  const router = useRouter();
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
      router.push('/decks');
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast.error('Failed to delete deck');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-red-600">Delete Deck</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete the deck "{deckTitle}"? This action cannot be undone.
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
              {loading ? 'Deleting...' : 'Delete Deck'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 