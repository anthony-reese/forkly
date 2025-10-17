import { NextResponse } from 'next/server';
import {
  Business,
  FoursquarePlaceDetails,
  FoursquareErrorResponse,
  transformFoursquarePlaceToBusiness,
  getPhotoCached, 
} from '@/lib/foursquareCached';

interface FoursquareSearchPlaceResult {
  fsq_id: string;
  name: string;
  rating?: number;
  price?: number;
  categories?: { id: string; name: string; icon?: { prefix: string; suffix: string } }[];
  photos?: { id: string; prefix: string; suffix: string }[];
}

interface FoursquareSearchApiResponse {
  results: FoursquareSearchPlaceResult[];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term') ?? 'restaurants';
  const location = searchParams.get('location');
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const price = searchParams.get('price');
  const categories = searchParams.get('categories');
  const limit = searchParams.get('limit') ?? '10';
  const offset = searchParams.get('offset') ?? '0';

  if (!(latitude && longitude) && (!location || location.trim() === '')) {
    return NextResponse.json(
      { error: 'Need either location (text) or latitude+longitude for Foursquare search' },
      { status: 400 },
    );
  }

  const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
  if (!FOURSQUARE_API_KEY) {
    console.error('FOURSQUARE_API_KEY is UNDEFINED on the server. Check .env.local and restart.');
    return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
  }

  // Build Foursquare Search URL
  const url = new URL('https://places-api.foursquare.com/v3/places/search');
  url.searchParams.set('query', term);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);

  if (latitude && longitude) {
    url.searchParams.set('ll', `${latitude},${longitude}`);
  } else {
    url.searchParams.set('near', location!);
  }

  if (price) {
    url.searchParams.set('min_price', price);
    url.searchParams.set('max_price', price);
  }
  if (categories) url.searchParams.set('categories', categories);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
        'X-Places-Api-Version': '2025-06-17',
      },
    });

    if (!res.ok) {
      const errorJson = (await res.json()) as FoursquareErrorResponse;
      console.error('Foursquare API Error Response:', errorJson);
      const errorMessage = errorJson.message || 'Unknown Foursquare API error';
      return NextResponse.json(
        { error: `Foursquare API Error: ${errorMessage}` },
        { status: res.status },
      );
    }

    const json = (await res.json()) as FoursquareSearchApiResponse;

    if (!json.results || !Array.isArray(json.results)) {
      console.error('Foursquare API response missing "results" array:', json);
      return NextResponse.json(
        { error: 'Foursquare API returned an unexpected response format.' },
        { status: 500 },
      );
    }

    // Fetch cached or fresh photos in parallel
    const businesses: (Business & { photoUrl?: string })[] = await Promise.all(
      json.results.map(async (placeResult: FoursquareSearchPlaceResult) => {
        const business = transformFoursquarePlaceToBusiness(placeResult as FoursquarePlaceDetails);

        // Try Firestore cache first, then fallback to API if not cached
        const photoUrl = await getPhotoCached(placeResult.fsq_id, FOURSQUARE_API_KEY);

        return { ...business, photoUrl: photoUrl ?? '/placeholder.png' };
      }),
    );

    return NextResponse.json({ businesses });
  } catch (err: unknown) {
    console.error('Error in Foursquare API search route:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to fetch places from Foursquare. Details: ${errorMessage}` },
      { status: 500 },
    );
  }
}
