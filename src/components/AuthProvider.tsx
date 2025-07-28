// src/components/AuthProvider.tsx
'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthCtx = createContext<AuthContextType>({ user: null, loading: true });

export const useUser = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    }, (error) => {
      console.error("Firebase AuthStateChanged error:", error);
      setUser(null); 
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = { user, loading };

  return (
    <AuthCtx.Provider value={contextValue}>
      {children}
    </AuthCtx.Provider>
  );
}