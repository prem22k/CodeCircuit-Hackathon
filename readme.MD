# 🧠 BrainBoost - Smart Flashcards

BrainBoost is a modern flashcard application that helps users learn and retain information using spaced repetition. Built with Next.js 14, Firebase, and Tailwind CSS, it combines beautiful UI/UX with science-backed learning techniques.

## ✨ Features

### 🎯 Smart Learning

- **Spaced Repetition System (SRS)** - Cards are reviewed at optimal intervals for maximum retention
- **Performance Tracking** - Track your learning progress with detailed statistics
- **Streak System** - Stay motivated with daily streaks and achievements

### 🎨 Beautiful UI/UX

- **Modern Design** - Clean, intuitive interface with smooth animations
- **Dark Mode** - Full dark mode support for comfortable night-time studying
- **Responsive** - Works perfectly on desktop, tablet, and mobile
- **Animations** - Smooth transitions and card flip animations

### 🔐 Authentication

- **Google Sign-in** - Quick and secure authentication
- **Protected Routes** - Secure access to personal decks and progress
- **Session Persistence** - Stay logged in across sessions

### 📚 Deck Management

- **Create Decks** - Organize cards into custom decks
- **Edit & Delete** - Full control over your learning materials
- **Card Management** - Add, edit, and delete cards within decks

### 📊 Progress Tracking

- **Dashboard** - View your learning statistics and progress
- **Review History** - Track your performance over time
- **Streak Calendar** - Visualize your learning consistency
- **Performance Metrics** - Monitor your improvement

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **UI Components**: Headless UI, Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🛠️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📱 User Flow

1. **Landing Page**

   - Introduction to BrainBoost
   - Call-to-action for new users
   - Sign in/Sign up options

2. **Authentication**

   - Google Sign-in
   - Email/Password authentication
   - Protected routes

3. **Deck Management**

   - Create new decks
   - Add cards to decks
   - Edit and delete decks
   - View deck statistics

4. **Review Session**

   - Spaced repetition algorithm
   - Card flip animations
   - Performance rating system
   - Progress tracking

5. **Dashboard**
   - Learning statistics
   - Review history
   - Streak tracking
   - Performance metrics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the CodeCircuit Hackathon
- Inspired by Anki and other spaced repetition systems
- Thanks to all contributors and supporters
