// src/components/SignInButton.tsx
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, google } from '@/lib/firebase';
import { useUser } from './AuthProvider';
import { toast } from 'react-hot-toast'; // Assuming you have toast imported
import { FirebaseError } from 'firebase/app'; // Import FirebaseError (usually from firebase/app)

export default function SignInButton() {
  const { user, loading: authLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  /* ---- signed-in view ---- */
  if (authLoading) {
    return <span className="text-sm text-gray-500">Loading user...</span>;
  }

  if (user) {
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        // Optional: toast.success('Signed out successfully!');
      } catch (error) {
        console.error('Error signing out:', error);
        // Optional: toast.error('Failed to sign out. Please try again.');
      }
    };

    return (
      <button
        onClick={() => { void handleSignOut(); }}
        className="text-sm hover:underline"
      >
        Sign out ({user.displayName ?? user.email})
      </button>
    );
  }

  /* ---- signed-out view ---- */
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, google);
      // Optional: toast.success('Signed in successfully!');
      setOpen(false); // Close the dialog on successful sign-in
    } catch (error: unknown) { // Best practice to type catch block as unknown
      console.error('Error during Google sign-in:', error);

      // Refactored line here:
      if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') {
        // Handle popup-closed-by-user specifically (e.g., no toast, or a different message)
        // toast.error('Sign-in cancelled.');
      } else {
        // Provide a general error message for other Firebase errors or unknown errors
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast.error(`Sign-in failed: ${errorMessage}`);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm bg-indigo-600 text-white px-3 py-1 rounded"
      >
        Sign in
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop — plain div, not Dialog.Backdrop */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <Dialog.Panel className="relative w-80 rounded bg-white dark:bg-gray-900 p-6 shadow">
          <Dialog.Title className="text-lg font-bold mb-4">
            Sign in
          </Dialog.Title>
          <button
            onClick={() => { void handleGoogleSignIn(); }}
            className="w-full bg-emerald-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSigningIn}
          >
            {isSigningIn ? 'Signing In...' : 'Sign in with Google'}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}