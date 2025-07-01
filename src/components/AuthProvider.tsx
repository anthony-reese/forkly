// src/components/AuthProvider.tsx
'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const AuthCtx = createContext<User | null>(null);
export const useUser = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return <AuthCtx.Provider value={user}>{children}</AuthCtx.Provider>;
}
