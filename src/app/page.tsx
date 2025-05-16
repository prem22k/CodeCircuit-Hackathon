import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="text-center space-y-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Master Any Subject with BrainBoost
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Create, study, and master flashcards with our intelligent learning system
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/decks" className="btn btn-primary">
            Get Started
          </Link>
          <a href="#features" className="btn bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            Learn More
          </a>
        </div>
      </section>
      
      <section id="features" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Smart Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Adaptive algorithms that adjust to your learning pace and style
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your improvement with detailed statistics and insights
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Collaborative Study</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share decks and learn together with friends and classmates
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 