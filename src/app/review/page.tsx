import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ReviewPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Review Cards</h1>
        </div>
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Select a deck to start reviewing cards.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
} 