'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/common/Toast';
import { createDeck } from '@/utils/storage';
import type { Deck } from '@/types';

interface CreateDeckDialogProps {
  open: boolean;
  onClose: () => void;
  onDeckCreated?: (deck: Deck) => void;
}

export function CreateDeckDialog({ open, onClose, onDeckCreated }: CreateDeckDialogProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      showToast('error', 'Please enter a deck title');
      return;
    }

    setIsSubmitting(true);
    try {
      const newDeck = await createDeck(user.id, {
        title: title.trim(),
        description: description.trim(),
      });

      setTitle('');
      setDescription('');
      onDeckCreated?.(newDeck);
      onClose();
      showToast('success', 'Deck created successfully');
    } catch (error) {
      console.error('Error creating deck:', error);
      showToast('error', 'Failed to create deck');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Deck
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                placeholder="Enter deck title"
                maxLength={100}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {title.length}/100 characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
                placeholder="Enter deck description"
                rows={3}
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description.length}/500 characters
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Deck'}
              </motion.button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 
