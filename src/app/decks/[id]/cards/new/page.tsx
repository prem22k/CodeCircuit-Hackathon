'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Plus,
  Save,
  RotateCcw,
  Brain,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function NewCardPage() {
  const params = useParams();
  const deckId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [deck, setDeck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Ensure deckId is a string before fetching
    if (typeof deckId !== 'string') {
        setLoading(false);
        toast.error('Invalid deck ID.');
        router.push('/decks'); // Redirect to decks list
        return;
    }

    const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
    const unsubscribe = onSnapshot(deckRef, (doc) => {
      if (doc.exists()) {
        setDeck({ id: doc.id, ...doc.data() });
      } else {
        toast.error('Deck not found');
        router.push('/decks');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching deck:', error);
      toast.error('Failed to load deck');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, deckId, router]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSave = async () => {
    if (!user || !deck || typeof deckId !== 'string') return; // Added deckId check here too
    if (!front.trim() || !back.trim()) {
      toast.error('Please fill in both front and back of the card');
      return;
    }

    setSaving(true);

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${deckId}`);
      const newCard = {
        id: Date.now().toString(),
        front: front.trim(),
        back: back.trim(),
        difficulty: 0,
        createdAt: new Date(),
        lastReviewed: null,
        nextReview: null
      };

      await updateDoc(deckRef, {
        cards: arrayUnion(newCard)
      });

      toast.success('Card created successfully!');
      router.push(`/decks/${deckId}`); // Use deckId here
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!deck) {
    // This case is handled by the redirect in useEffect if deckId is invalid or not found
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/decks/${deckId}`)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Create New Card</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add a new card to {deck.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFront('');
              setBack('');
              setIsFlipped(false);
            }}
            className="btn btn-outline flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2"
            disabled={saving || !front.trim() || !back.trim()}
          >
            {saving ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Card
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview and Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="relative h-[400px] perspective-1000">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer rounded-xl"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFlip}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden rounded-xl p-8 md:p-12 flex items-center justify-center text-center bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{front || 'Front of card'}</p>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rounded-xl p-8 md:p-12 flex items-center justify-center text-center bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700" style={{ transform: 'rotateY(180deg)' }}>
              <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{back || 'Back of card'}</p>
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Front (Question/Term)</span>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
                rows={6} // Increased rows for better input area
                placeholder="Enter the front of the card..."
              />
            </label>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Back (Answer/Definition)</span>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
                rows={6} // Increased rows for better input area
                placeholder="Enter the back of the card..."
              />
            </label>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">Tips for creating effective flashcards</h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Keep questions and answers concise and clear</li>
              <li>• Use simple language and avoid complex sentences</li>
              <li>• Include one key concept per card</li>
              <li>• Use examples to illustrate abstract concepts</li>
              <li>• Click the card to preview how it will look</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 