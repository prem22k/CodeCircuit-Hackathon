'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { getDecks, saveDeck, deleteDeck } from '@/utils/storage';
import { Deck } from '@/types';
import { Dialog } from '@headlessui/react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { showToast } from '@/components/common/Toast';
import Tutorial from '@/components/Tutorial';

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    loadDecks();
    // Show tutorial for new users (no decks)
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      const loadedDecks = getDecks();
      setDecks(loadedDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
      showToast.error('Failed to load decks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const deck: Deck = {
        id: editingDeck?.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        cardCount: editingDeck?.cardCount || 0,
        createdAt: editingDeck?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      saveDeck(deck);
      setDecks(getDecks());
      closeModal();
      showToast.success(`Deck ${editingDeck ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving deck:', error);
      showToast.error('Failed to save deck. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (deckId: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      try {
        deleteDeck(deckId);
        setDecks(getDecks());
        showToast.success('Deck deleted successfully!');
      } catch (error) {
        console.error('Error deleting deck:', error);
        showToast.error('Failed to delete deck. Please try again.');
      }
    }
  };

  const openCreateModal = () => {
    setEditingDeck(null);
    setFormData({ title: '', description: '' });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (deck: Deck) => {
    setEditingDeck(deck);
    setFormData({ title: deck.title, description: deck.description });
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingDeck(null);
    setFormData({ title: '', description: '' });
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Decks</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Deck
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No decks yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first deck to start learning!
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div key={deck.id} className="card group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{deck.title}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(deck)}
                    className="p-1 hover:text-primary-500 transition-colors"
                    aria-label="Edit deck"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    className="p-1 hover:text-red-500 transition-colors"
                    aria-label="Delete deck"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{deck.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{deck.cardCount} cards</span>
                <Link
                  href={`/review/${deck.id}`}
                  className="btn bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isCreateModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card max-w-md w-full">
            <Dialog.Title className="text-2xl font-bold mb-4">
              {editingDeck ? 'Edit Deck' : 'Create New Deck'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                  rows={3}
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <LoadingSpinner className="w-5 h-5" />
                  ) : editingDeck ? (
                    'Save Changes'
                  ) : (
                    'Create Deck'
                  )}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 