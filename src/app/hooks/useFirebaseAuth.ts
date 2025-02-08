'use client';

import { auth } from '@/lib/firebase';
import { browserLocalPersistence, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithCredential, User } from 'firebase/auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    console.log('Firebase auth hook - session update', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      hasIdToken: !!session?.idToken,
      status,
      currentUser: auth.currentUser?.email
    });

    const initializeAuth = async () => {
      if (!session?.accessToken || !session?.idToken) {
        setLoading(false);
        return;
      }

      try {
        // Set persistence first
        await setPersistence(auth, browserLocalPersistence);
        console.log('Firebase persistence set to local');

        // Only sign in if we don't have a current user or emails don't match
        if (!auth.currentUser || auth.currentUser.email !== session.user?.email) {
          console.log('Signing in to Firebase with session tokens');
          const credential = GoogleAuthProvider.credential(
            session.idToken,
            session.accessToken
          );
          await signInWithCredential(auth, credential);
        } else {
          console.log('Firebase user already signed in and matches session');
        }
      } catch (error) {
        console.error('Error in Firebase auth initialization:', error);
        setLoading(false);
      }
    };

    // Initialize auth immediately
    void initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase auth state changed', { 
        hasFirebaseUser: !!firebaseUser,
        firebaseEmail: firebaseUser?.email,
        sessionEmail: session?.user?.email,
        currentUser: auth.currentUser?.email
      });
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session, status]);

  return { user, loading: loading || status === 'loading' };
} 