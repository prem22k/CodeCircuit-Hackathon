import { ReactNode } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Header } from './Header';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for CodeCircuit Hackathon
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 BrainBoost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 