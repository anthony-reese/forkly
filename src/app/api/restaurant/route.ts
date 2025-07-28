// src/app/api/restaurant/route.ts
import { NextResponse } from 'next/server';
import { getBusinessCached } from 'src/lib/foursquareCached';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const biz = await getBusinessCached(id);
    return NextResponse.json(biz);
  } catch (err) {
     console.error(err);
    return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 });
  }
}
