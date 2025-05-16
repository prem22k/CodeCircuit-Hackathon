import Link from 'next/link';
import { Brain, Rocket, Zap, BarChart3 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Home() {
  const { user, signInWithGoogle } = useAuthContext();

  return (
    <div className="flex flex-col gap-16 pb-8">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Boost your learning with smart flashcards
        </h1>
        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Create, study, and master any subject with our intelligent flashcard system. 
          Track your progress and learn more effectively.
        </p>
        {!user && (
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
            >
              Get Started
            </button>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-8"
            >
              Learn More
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to master any subject effectively
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Brain className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Smart Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Adaptive learning system that focuses on what you need to review
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Rocket className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Quick Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Create flashcard decks easily with our intuitive interface
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Spaced Repetition</h3>
                <p className="text-sm text-muted-foreground">
                  Review cards at optimal intervals for better retention
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <BarChart3 className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your learning progress with detailed statistics
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 