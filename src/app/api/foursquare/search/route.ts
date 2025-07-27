// src/app/api/yelp/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') ?? 'pizza';
  const location = req.nextUrl.searchParams.get('location') ?? 'Tokyo';

  const foursquareRes = await fetch(
    `https://api.foursquare.com/v3/places/search?term=${query}&location=${location}&limit=10`,
    {
      headers: { Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY!}`, Accept: "application/json" },
      //  simple re-try guard for local dev
      next: { revalidate: 60 }, // cache 60 s in Vercel edge
    }
  );

  if (!foursquareRes.ok) {
    return NextResponse.json(
      { error: 'Foursquare request failed' },
      { status: foursquareRes.status },
    );
  }

  const data = await foursquareRes.json();
  return NextResponse.json(data);
}
