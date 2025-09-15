// src/lib/wishlist.ts
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  getDoc,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Restaurant {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  price?: string;
  photoUrl?: string;
  addedAt?: number;
}

// Helper function to remove undefined values from an object
function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

export async function addToWishlist(uid: string, restaurant: Restaurant) {
  const ref = doc(db, 'wishlists', uid, 'items', restaurant.id);
  
  // Use the helper function to filter out any 'undefined' values
  const dataToSave = removeUndefined({
    ...restaurant,
    addedAt: Date.now(),
  });
  
  await setDoc(ref, dataToSave);
}

export async function removeFromWishlist(uid: string, bizId: string) {
  const ref = doc(db, 'wishlists', uid, 'items', bizId);
  await deleteDoc(ref);
}

export async function fetchUserWishlistDetails(userId: string): Promise<Restaurant[]> {
  const wishlistItemsRef = collection(db, 'wishlists', userId, 'items');
  const wishlistSnapshot = await getDocs(wishlistItemsRef);

  const restaurantIds = wishlistSnapshot.docs.map((doc) => doc.id);

  const restaurantPromises = restaurantIds.map(async (id) => {
    const restaurantRef = doc(db, 'restaurants', id);
    const restaurantSnap = await getDoc(restaurantRef);

    if (restaurantSnap.exists()) {
      const rawData = restaurantSnap.data();

      if (typeof rawData.name === 'string') {
        const categories = Array.isArray(rawData.categories) ? rawData.categories : [];
        let category: string | undefined = undefined;

        if (categories.length > 0 && typeof categories[0]?.title === 'string') {
          category = categories[0].title;
        }

        const transformedRestaurant: Restaurant = {
          id: restaurantSnap.id,
          name: rawData.name,
          rating: typeof rawData.rating === 'number' ? rawData.rating : undefined,
          price: typeof rawData.price === 'string' ? rawData.price : undefined,
          photoUrl: typeof rawData.image_url === 'string' ? rawData.image_url : undefined,
          category: category,
        };
        return transformedRestaurant;
      } else {
        console.warn(`Restaurant with ID ${id} exists but is missing the required 'name' field.`);
        return null;
      }
    } else {
      console.warn(`Restaurant with ID ${id} in wishlist but not found in /restaurants collection.`);
      return null;
    }
  });

  const results = await Promise.all(restaurantPromises);
  return results.filter((item): item is Restaurant => item !== null);
}