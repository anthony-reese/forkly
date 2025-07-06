export interface SearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: string;
  categories?: string;
  limit?: number;
  offset?: number;
}

export async function searchYelp(params: SearchParams) {
  const url = new URL('/api/search', window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Search failed');
  return res.json(); 
}
