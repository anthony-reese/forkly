// src/lib/wishlist.ts
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function addToWishlist(uid: string, bizId: string) {
  await setDoc(doc(db, 'wishlists', uid, 'items', bizId), { addedAt: Date.now() });
}

export async function removeFromWishlist(uid: string, bizId: string) {
  await deleteDoc(doc(db, 'wishlists', uid, 'items', bizId));
}
