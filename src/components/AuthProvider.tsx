// src/components/AuthProvider.tsx
'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Assuming '@/lib/firebase' exports your auth instance

// 1. Define the shape of the context value
interface AuthContextType {
  user: User | null;
  loading: boolean; // Indicates if the initial auth state check is still in progress
}

// 2. Initialize context with a default value
// Default: No user, and currently loading (checking auth state)
const AuthCtx = createContext<AuthContextType>({ user: null, loading: true });

// 3. Custom hook to easily consume the auth context
export const useUser = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start as true, as we need to check auth state

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function that we can use for cleanup
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // This callback fires when the auth state changes (initially, login, logout)
      setUser(firebaseUser); // Update the user state
      setLoading(false);    // Once we've received an auth state, we are no longer loading
    }, (error) => {
      // Optional: Add a callback for errors during auth state observation
      // (though onAuthStateChanged rarely errors itself, more likely initialization issues)
      console.error("Firebase AuthStateChanged error:", error);
      setUser(null); // Ensure user is null if an error occurs
      setLoading(false); // Stop loading even if there's an error
    });

    // Cleanup function: Unsubscribe from the auth state listener when the component unmounts
    return () => unsubscribe();
  }, []); // The `auth` object reference from '@/lib/firebase' is stable, so empty dependency array is appropriate.

  // 4. The context value now includes both 'user' and 'loading'
  const contextValue = { user, loading };

  return (
    <AuthCtx.Provider value={contextValue}>
      {children}
    </AuthCtx.Provider>
  );
}