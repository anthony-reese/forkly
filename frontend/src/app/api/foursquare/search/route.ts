// src/app/api/foursquare/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface FoursquareSearchPlace {
  fsq_id: string;
  name: string;
  geocodes?: {
    main: {
      latitude: number;
      longitude: number;
    }
  };
  categories?: { id: string; name: string; icon?: { prefix: string; suffix: string } }[];
  photos?: { id: string; prefix: string; suffix: string }[];
}

interface FoursquareSearchApiResponse {
  results: FoursquareSearchPlace[];
}

interface FoursquareErrorResponse {
  message: string;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') ?? 'pizza';
  const location = req.nextUrl.searchParams.get('location') ?? 'Tokyo';

  const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
  if (!FOURSQUARE_API_KEY) {
    console.error('FOURSQUARE_API_KEY is not set in environment variables in /api/yelp/search');
    return NextResponse.json(
      { error: 'Server configuration error: API key missing' },
      { status: 500 },
    );
  }

  const foursquareUrl = `https://api.foursquare.com/v3/places/search?term=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&limit=10`;

  try {
    const foursquareRes = await fetch(foursquareUrl, {
      headers: {
        Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
        Accept: 'application/json',
        'X-Places-Api-Version': '2025-06-17',
      },
      next: { revalidate: 60 },
    });

    if (!foursquareRes.ok) {
      const errorBody = (await foursquareRes.json()) as FoursquareErrorResponse;
      console.error('Foursquare API Search Error:', errorBody);

      const errorMessage = errorBody.message || 'Unknown Foursquare API error during search';

      return NextResponse.json(
        { error: `Foursquare request failed: ${errorMessage}` },
        { status: foursquareRes.status },
      );
    }

    const data = (await foursquareRes.json()) as FoursquareSearchApiResponse;
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in /api/yelp/search route:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 },
    );
  }
}