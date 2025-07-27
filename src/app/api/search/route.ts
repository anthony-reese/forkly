// src/app/api/search/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
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
    console.error('FOURSQUARE_API_KEY is UNDEFINED on the server. Check .env.local and server restart.');
    return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
  }

  const url = new URL('https://places-api.foursquare.com/places/search');

  url.searchParams.set('query', term);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);

  if (latitude && longitude) {
    url.searchParams.set('ll', `${latitude},${longitude}`);
  } else {
    url.searchParams.set('near', location!);
  }
  
  if (price) url.searchParams.set('min_price', price);
  if (price) url.searchParams.set('max_price', price);
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

    const json = await res.json();

    if (!res.ok) {
      console.error('Foursquare API Error Response:', json);
      const errorMessage = json.message || 'Unknown Foursquare API error';
      return NextResponse.json({ error: `Foursquare API Error: ${errorMessage}` }, { status: res.status });
    }

    const businesses: Business[] = json.results.map((place: any) => {
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
    });

    return NextResponse.json({ businesses });

  } catch (err) {
    console.error('Error in Foursquare API search route:', err);
    return NextResponse.json({ error: 'Failed to fetch places from Foursquare' }, { status: 500 });
  }
}