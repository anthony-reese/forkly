// src/app/wishlist/page.tsx
'use client';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { useUser } from '@/components/AuthProvider';
import RestaurantCard from '@/components/RestaurantCard';

export default function Wishlist() {
  const user = useUser();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'wishlists', user.uid, 'items');
    return onSnapshot(ref, snap => setIds(snap.docs.map(d => d.id)));
  }, [user]);

  if (!user) return <p className="p-6">Sign in to see your wishlist.</p>;
  if (ids.length === 0) return <p className="p-6">No saved restaurants yet.</p>;

  /* fetch Yelp details for each id, or store details in Firestore for quicker load */
  return <pre className="p-6">{JSON.stringify(ids, null, 2)}</pre>;
}
