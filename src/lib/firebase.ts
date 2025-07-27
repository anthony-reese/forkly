// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqv7DIjJg_tXCwv_MNtoYhiw0YLZYsZvw",
  authDomain: "forkly-da5a7.firebaseapp.com",
  projectId: "forkly-da5a7",
  storageBucket: "forkly-da5a7.firebasestorage.app",
  messagingSenderId: "738393752123",
  appId: "1:738393752123:web:9985da4d74ba5d7f1f921e",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth   = getAuth(app);

if (typeof window !== 'undefined' && (window as any).Cypress) {
  // @ts-ignore - We're intentionally adding to window
  (window as any).firebase_auth_instance = auth;
  console.log('Firebase auth instance exposed to window for Cypress.');
}
export const google = new GoogleAuthProvider();
export const db     = getFirestore(app);
