// src/app/api/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const term       = searchParams.get('term')       ?? 'restaurants';
  const location   = searchParams.get('location');
  const latitude   = searchParams.get('latitude');
  const longitude  = searchParams.get('longitude');
  const price      = searchParams.get('price');
  const categories = searchParams.get('categories');
  const limit      = searchParams.get('limit')  ?? '10';
  const offset     = searchParams.get('offset') ?? '0';

  // Rule: use EITHER (lat,lon) OR location
  if (!(latitude && longitude) && !location) {
    return NextResponse.json(
      { error: 'Need either location or latitude+longitude' },
      { status: 400 },
    );
  }

  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.set('term', term);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);

  if (latitude && longitude) {
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
  } else {
    url.searchParams.set('location', location!);
  }
  if (price) url.searchParams.set('price', price);
  if (categories) url.searchParams.set('categories', categories);

  try {
    const res  = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${process.env.YELP_API_KEY!}` },
    });
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
