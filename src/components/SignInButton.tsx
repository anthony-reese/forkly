import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, google } from '@/lib/firebase';
import { useUser } from './AuthProvider';

export default function SignInButton() {
  const user = useUser();
  const [open, setOpen] = useState(false);

  /* ---- signed-in view ---- */
  if (user) {
    return (
      <button
        onClick={() => signOut(auth)}
        className="text-sm hover:underline"
      >
        Sign out ({user.displayName ?? user.email})
      </button>
    );
  }

  /* ---- signed-out view ---- */
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
        onClose={setOpen}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop — plain div, not Dialog.Backdrop */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <Dialog.Panel className="relative w-80 rounded bg-white dark:bg-gray-900 p-6 shadow">
          <Dialog.Title className="text-lg font-bold mb-4">
            Sign in
          </Dialog.Title>

          <button
            onClick={() => signInWithPopup(auth, google)}
            className="w-full bg-emerald-600 text-white py-2 rounded"
          >
            Sign in with Google
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
