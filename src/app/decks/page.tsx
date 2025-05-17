'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { getDecks, createDeck, deleteDeck } from '@/utils/storage';
import { Deck } from '@/types';
import { Dialog } from '@headlessui/react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/components/common/Toast';
import Tutorial from '@/components/Tutorial';
import { auth } from '@/lib/firebase';

// Mark this page as dynamic
export const dynamic = 'force-dynamic';

export default function DecksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (user) {
      loadDecks();
    } else if (!authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadDecks = async () => {
    try {
      const userDecks = await getDecks(user!.id);
      setDecks(userDecks);
      // Show tutorial for new users (no decks)
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Error loading decks:', error);
      showToast.error('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) {
      showToast.error('Please enter a deck title');
      return;
    }

    try {
      const newDeck = await createDeck({
        title: newDeckTitle,
        description: newDeckDescription,
        cardCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user!.id,
      });

      setDecks([newDeck, ...decks]);
      setIsCreateModalOpen(false);
      setNewDeckTitle('');
      setNewDeckDescription('');
      showToast.success('Deck created successfully!');
    } catch (error) {
      console.error('Error creating deck:', error);
      showToast.error('Failed to create deck');
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      await deleteDeck(deckId);
      setDecks(decks.filter(deck => deck.id !== deckId));
      showToast.success('Deck deleted successfully!');
    } catch (error) {
      console.error('Error deleting deck:', error);
      showToast.error('Failed to delete deck');
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Decks</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Deck
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No decks yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first deck to start learning
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {deck.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {deck.cardCount} cards
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/decks/${deck.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Study
                    </Link>
                    <button
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Create New Deck
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  className="input w-full"
                  placeholder="Enter deck title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newDeckDescription}
                  onChange={(e) => setNewDeckDescription(e.target.value)}
                  className="input w-full"
                  placeholder="Enter deck description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDeck}
                  className="btn btn-primary"
                >
                  Create Deck
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 