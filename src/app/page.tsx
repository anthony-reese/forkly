'use client';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import { searchYelp } from '@/lib/searchClient';

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  image_url?: string;
  categories: { title: string }[];
}

export default function Home() {
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('restaurants');

  async function handleSearch(term: string, loc: string) {
  setLoading(true);
  try {
    const q = term.trim() || 'restaurants';
    const data = await searchYelp({ term: q, location: loc });
    setResults(data.businesses ?? []);
    setLastQuery(q);
  } finally {
    setLoading(false);
    }
  }

  async function handleLocate(lat: number, lon: number, term: string) {
  setLoading(true);
  try {
    const q = term.trim() || 'restaurants';
    const data = await searchYelp({ term: q, latitude: lat, longitude: lon });
    setResults(data.businesses ?? []);
    setLastQuery(q);
  } finally {
    setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <SearchBar onSearch={handleSearch} onLocate={handleLocate} />

      {loading && <p>Loading…</p>}

      {!loading && results.length === 0 && (
        <p className="text-center py-10 text-gray-500">
          No nearby results for “{lastQuery}”. Try another term.
        </p>
      )}

      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(biz => (
          <RestaurantCard
            key={biz.id}
            id={biz.id}
            name={biz.name}
            rating={biz.rating}
            price={biz.price}
            category={biz.categories[0]?.title ?? ''}
            photoUrl={biz.image_url}
          />
        ))}
      </section>
    </main>
  );
}
