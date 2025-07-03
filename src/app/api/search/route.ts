// src/app/api/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');
  const location = searchParams.get('location');
  const price = searchParams.get('price');
  const categories = searchParams.get('categories');
  const limit = searchParams.get('limit') ?? '10';
  const offset = searchParams.get('offset') ?? '0';

  if (!term || !location) {
    return NextResponse.json({ error: 'Missing term or location' }, { status: 400 });
  }

  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.set('term', term);
  url.searchParams.set('location', location);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);
  if (price) url.searchParams.set('price', price);
  if (categories) url.searchParams.set('categories', categories);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY!}`,
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
