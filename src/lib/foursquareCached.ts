// src/lib/foursquareCached.ts
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

const TTL = 1000 * 60 * 60 * 24 * 7;

interface FoursquareIcon {
  prefix: string;
  suffix: string;
}

interface FoursquareCategory {
  id: string;
  name: string;
  icon?: FoursquareIcon;
}

interface FoursquarePhoto {
  id: string;
  prefix: string;
  suffix: string;
}

export interface FoursquarePlaceDetails {
  fsq_id: string;
  name: string;
  rating?: number;
  price?: number;
  categories?: FoursquareCategory[];
  photos?: FoursquarePhoto[];
}

interface CachedBusinessData {
  id: string;
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
  lastFetched: number;
}

export interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
}

export interface FoursquareErrorResponse {
  message: string;
}

/**
 * Transforms a Foursquare Place API response object into your internal Business interface.
 * @param place The Foursquare Place details object.
 * @returns A Business object.
 */
export function transformFoursquarePlaceToBusiness(place: FoursquarePlaceDetails): Business {
  const scaledRating = place.rating !== undefined && place.rating !== null ? (place.rating / 2) : 0;
  const displayPrice = place.price ? '$'.repeat(place.price) : undefined;

  const primaryCategory = place.categories && place.categories.length > 0
    ? place.categories[0].name
    : 'Uncategorized';

  const photoUrl = place.photos && place.photos.length > 0
    ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
    : (place.categories?.[0]?.icon
      ? `${place.categories[0].icon.prefix}bg_64${place.categories[0].icon.suffix}`
      : '/placeholder.png');

  return {
    id: place.fsq_id ?? uuidv4(),
    name: place.name,
    rating: scaledRating,
    price: displayPrice,
    category: primaryCategory,
    photoUrl: photoUrl,
  };
}

/**
 * Fetches business details from Firestore cache or Foursquare API.
 * Caches the result in Firestore if fetched from API.
 * @param id The Foursquare Place ID.
 * @returns A Promise that resolves to a Business object.
 */
export async function getBusinessCached(id: string): Promise<Business> {
  const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
  if (!FOURSQUARE_API_KEY) {
    console.error('FOURSQUARE_API_KEY is not set in environment variables.');
    throw new Error('Server API key not configured for Foursquare.');
  }

  const ref = doc(db, 'restaurants', id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data() as CachedBusinessData;
    if (data.lastFetched && (Date.now() - data.lastFetched < TTL)) {
      console.log(`[Firebase Cache Hit] Returning business ${id} from cache.`);
      return data as Business;
    }
  }

  console.log(`[Firebase Cache Miss/Stale] Fetching business ${id} from Foursquare.`);
  const url = `https://places-api.foursquare.com/places/${id}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
        'X-Places-Api-Version': '2025-06-17',
      },
    });

    if (!res.ok) {
      const errorJson = (await res.json()) as FoursquareErrorResponse;
      console.error('Foursquare API Business Details Error Response:', errorJson);
      const errorMessage = errorJson.message || `Unknown Foursquare API error (Status: ${res.status})`;
      throw new Error(`Foursquare API Error: ${errorMessage}`);
    }

    const json = (await res.json()) as FoursquarePlaceDetails;

    const transformedBusiness = transformFoursquarePlaceToBusiness(json);
    await setDoc(ref, { ...transformedBusiness, lastFetched: Date.now() } as CachedBusinessData);
    console.log(`[Firebase Cache Set] Business ${id} cached.`);
    return transformedBusiness;
  } catch (error: unknown) {
    console.error(`Error fetching or transforming business ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch business details from Foursquare. Details: ${errorMessage}`);
  }
}