import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAXpTynwl7gXaxNbGeW56-dewCSJlq1L-I",
  authDomain: "brainboost-flashcards.firebaseapp.com",
  projectId: "brainboost-flashcards",
  storageBucket: "brainboost-flashcards.firebasestorage.app",
  messagingSenderId: "615321185204",
  appId: "1:615321185204:web:3e144d8a1052bebada60e1",
  measurementId: "G-P512FL207X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Authentication providers
export const googleProvider = new GoogleAuthProvider();

// Export app instance
export default app; 