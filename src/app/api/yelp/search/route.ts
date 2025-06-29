import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const term = req.nextUrl.searchParams.get('term') ?? 'pizza';
  const location = req.nextUrl.searchParams.get('location') ?? 'Tokyo';

  const yelpRes = await fetch(
    `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&limit=10`,
    {
      headers: { Authorization: `Bearer ${process.env.YELP_API_KEY!}` },
      //  simple re-try guard for local dev
      next: { revalidate: 60 }, // cache 60 s in Vercel edge
    }
  );

  if (!yelpRes.ok) {
    return NextResponse.json(
      { error: 'Yelp request failed' },
      { status: yelpRes.status },
    );
  }

  const data = await yelpRes.json();
  return NextResponse.json(data);
}
