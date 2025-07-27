// src/lib/foursquareCached.ts
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

const TTL = 1000 * 60 * 60 * 24 * 7;

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
}

function transformFoursquarePlaceToBusiness(place: any): Business {
  const scaledRating = place.rating ? (place.rating / 2) : 0;
  const displayPrice = place.price ? '$'.repeat(place.price) : undefined;

  const primaryCategory = place.categories && place.categories.length > 0
                          ? place.categories[0].name
                          : 'Uncategorized';
  
  const photoUrl = place.photos && place.photos.length > 0
                   ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
                   : (place.categories && place.categories[0]?.icon ? `${place.categories[0].icon.prefix}bg_64${place.categories[0].icon.suffix}` : '/placeholder.png');


  return {
    id: place.fsq_id ?? uuidv4(),
    name: place.name,
    rating: scaledRating,
    price: displayPrice,
    category: primaryCategory,
    photoUrl: photoUrl,
  };
}

export async function getBusinessCached(id: string): Promise<Business> {
  const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
  if (!FOURSQUARE_API_KEY) {
    console.error('FOURSQUARE_API_KEY is not set in environment variables.');
    throw new Error('Server API key not configured for Foursquare.');
  }

  const ref = doc(db, 'restaurants', id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    if (data.lastFetched && (Date.now() - data.lastFetched < TTL)) {
      console.log(`[Firebase Cache Hit] Returning business ${id} from cache.`);
      return data as Business;
    }
  }

  console.log(`[Firebase Cache Miss/Stale] Fetching business ${id} from Foursquare.`);

  const url = `https://places-api.foursquare.com/places/${id}`; // Note: details endpoint also changed
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
        'X-Places-Api-Version': '2025-06-17',
      },
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('Foursquare API Business Details Error Response:', json);
      const errorMessage = json.message || 'Unknown Foursquare API error fetching details';
      throw new Error(`Foursquare API Error: ${errorMessage} (Status: ${res.status})`);
    }

    const transformedBusiness = transformFoursquarePlaceToBusiness(json);

    await setDoc(ref, { ...transformedBusiness, lastFetched: Date.now() });
    console.log(`[Firebase Cache Set] Business ${id} cached.`);

    return transformedBusiness;

  } catch (error) {
    console.error(`Error fetching or transforming business ${id}:`, error);
    throw new Error(`Failed to fetch business details from Foursquare. Details: ${(error as Error).message}`);
  }
}