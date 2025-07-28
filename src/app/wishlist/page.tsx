// src/app/wishlist/page.tsx
'use client';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { useUser } from '@/components/AuthProvider';

export default function Wishlist() {
  const { user, loading: authLoading } = useUser();

  const [ids, setIds] = useState<string[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setIds([]);
      setLoadingWishlist(false);
      return;
    }

    const userUid: string = user.uid;
    const wishlistCollectionRef = collection(db, 'wishlists', userUid, 'items');

    setLoadingWishlist(true);
    setWishlistError(null);

    const unsubscribe = onSnapshot(
      wishlistCollectionRef,
      (snap) => {
        setIds(snap.docs.map(d => d.id));
        setLoadingWishlist(false);
      },
      (error) => {
        console.error("Error fetching wishlist:", error);
        setWishlistError("Failed to load wishlist. Please try again.");
        setLoadingWishlist(false);
        setIds([]);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  if (authLoading) {
    return <p className="p-6 text-gray-500">Loading user authentication...</p>;
  }

  if (!user) {
    return <p className="p-6 text-gray-700 dark:text-gray-300">Sign in to see your wishlist.</p>;
  }

  if (loadingWishlist) {
    return <p className="p-6 text-gray-500">Loading your saved restaurants...</p>;
  }

  if (wishlistError) {
    return <p className="p-6 text-red-500">Error: {wishlistError}</p>;
  }

  if (ids.length === 0) {
    return <p className="p-6 text-gray-700 dark:text-gray-300">No saved restaurants yet.</p>;
  }

  return <pre className="p-6">{JSON.stringify(ids, null, 2)}</pre>;
}