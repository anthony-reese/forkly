// src/components/SignInButton.tsx
'use client';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, google } from '@/lib/firebase';
import { useUser } from './AuthProvider';

export default function SignInButton() {
  const user = useUser();
  return user ? (
    <button onClick={() => signOut(auth)} className="text-sm">
      Sign out ({user.displayName ?? user.email})
    </button>
  ) : (
    <button onClick={() => signInWithPopup(auth, google)} className="text-sm">
      Sign in with Google
    </button>
  );
}
