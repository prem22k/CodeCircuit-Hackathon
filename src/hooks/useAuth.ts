import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { showToast } from '@/components/common/Toast';

export const useAuth = () => {
  const router = useRouter();

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast.success('Successfully signed in!');
      router.push('/decks');
    } catch (error: any) {
      console.error('Error signing in:', error);
      showToast.error(error.message);
    }
  }, [router]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast.success('Account created successfully!');
      router.push('/decks');
    } catch (error: any) {
      console.error('Error creating account:', error);
      showToast.error(error.message);
    }
  }, [router]);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast.success('Successfully signed in with Google!');
      router.push('/decks');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      showToast.error(error.message);
    }
  }, [router]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      showToast.success('Successfully signed out!');
      router.push('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      showToast.error(error.message);
    }
  }, [router]);

  return {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut: handleSignOut,
  };
}; 