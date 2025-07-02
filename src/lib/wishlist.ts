// src/lib/wishlist.ts
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function addToWishlist(uid: string, bizId: string) {
  const ref = doc(db, 'wishlists', uid, 'items', bizId);
  await setDoc(ref, { addedAt: Date.now() });
}

export async function removeFromWishlist(uid: string, bizId: string) {
  const ref = doc(db, 'wishlists', uid, 'items', bizId);
  await deleteDoc(ref);
}
