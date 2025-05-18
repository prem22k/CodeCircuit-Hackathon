import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin ${className}`}>
      <Loader2 className="w-full h-full" />
    </div>
  );
} 