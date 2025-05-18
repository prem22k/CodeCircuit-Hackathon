'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
      setFront('');
      setBack('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {card ? 'Edit Card' : 'Create New Card'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="front" className="block text-sm font-medium mb-1">
              Front (Question/Term)
            </label>
            <textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter the front of the card"
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="back" className="block text-sm font-medium mb-1">
              Back (Answer/Definition)
            </label>
            <textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter the back of the card"
              rows={3}
              disabled={loading}
            />
          </div>

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
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : card ? 'Update Card' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 