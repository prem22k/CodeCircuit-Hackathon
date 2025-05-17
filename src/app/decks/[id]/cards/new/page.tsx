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
  const { id } = useParams();
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
    if (!user || !id) return;

    const deckRef = doc(db, `users/${user.id}/decks/${id}`);
    const unsubscribe = onSnapshot(deckRef, (doc) => {
      if (doc.exists()) {
        setDeck({ id: doc.id, ...doc.data() });
      } else {
        toast.error('Deck not found');
        router.push('/decks');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, id, router]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSave = async () => {
    if (!user || !deck) return;
    if (!front.trim() || !back.trim()) {
      toast.error('Please fill in both front and back of the card');
      return;
    }

    setSaving(true);

    try {
      const deckRef = doc(db, `users/${user.id}/decks/${id}`);
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
      router.push(`/decks/${id}`);
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
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/decks/${id}`)}
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

      {/* Preview */}
      <div className="relative h-[400px] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className={`absolute w-full h-full backface-hidden rounded-xl p-8 flex items-center justify-center text-center ${
            isFlipped ? 'hidden' : 'block'
          }`}>
            <div className="bg-white dark:bg-gray-800 w-full h-full rounded-xl shadow-lg border dark:border-gray-700 p-8 flex items-center justify-center">
              <p className="text-2xl font-medium">{front || 'Front of card'}</p>
            </div>
          </div>

          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden rounded-xl p-8 flex items-center justify-center text-center ${
            isFlipped ? 'block' : 'hidden'
          }`}>
            <div className="bg-white dark:bg-gray-800 w-full h-full rounded-xl shadow-lg border dark:border-gray-700 p-8 flex items-center justify-center">
              <p className="text-2xl font-medium">{back || 'Back of card'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Front (Question/Term)</span>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
              rows={4}
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
              rows={4}
              placeholder="Enter the back of the card..."
            />
          </label>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
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