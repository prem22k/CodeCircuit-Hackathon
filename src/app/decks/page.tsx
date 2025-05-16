import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Deck } from '@/types/firebase';
import { CreateDeckDialog } from '@/components/decks/CreateDeckDialog';

export default function DecksPage() {
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [decks, loading, error] = useCollection(
    query(
      collection(db, `users/${user?.uid}/decks`),
      orderBy('updatedAt', 'desc')
    )
  );

  const filteredDecks = decks?.docs.filter(doc => {
    const deck = doc.data() as Deck;
    return deck.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Decks</h1>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Deck
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[200px] rounded-lg border bg-muted/10 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Error loading decks. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredDecks?.map((doc) => {
              const deck = doc.data() as Deck;
              return (
                <div
                  key={doc.id}
                  className="group relative rounded-lg border p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col space-y-2">
                    <h2 className="font-semibold">{deck.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {deck.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      <span>{deck.cardCount} cards</span>
                      <span className="mx-2">•</span>
                      <span>Last updated {deck.updatedAt.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <CreateDeckDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
} 