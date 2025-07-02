'use client';

import { useState } from 'react';
import RestaurantCard from '@/components/RestaurantCard';
import RestaurantCardSkeleton from '@/components/RestaurantCardSkeleton';


/* ---- types ------------------------------------------------------------- */
interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  categories: { title: string }[];
  image_url: string;
}
interface YelpSearchResponse {
  businesses: Business[];
}

/* ---- component --------------------------------------------------------- */
export default function Home() {
  // 1. start empty so placeholder shows
  const [term, setTerm] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!term || !location) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/yelp/search?term=${encodeURIComponent(term)}&location=${encodeURIComponent(location)}`,
      );
      if (!res.ok) throw new Error('Yelp request failed');
      const json: YelpSearchResponse = await res.json();
      setResults(json.businesses ?? []);
    } catch (err) {
      console.error(err);
      alert('Sorry, something went wrong. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Forkly</h1>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* 2. clearer placeholders */}
        <input
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="What?"
          className="flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Where?"
          className="flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !term || !location}
          className="bg-indigo-600 text-white px-4 rounded disabled:opacity-40"
        >
          Search
        </button>
      </div>

  {!loading && results.length === 0 ? (
    <>
      <div className="text-center py-20 text-gray-500">
        <p className="text-5xl mb-4">🤷‍♀️</p>
        <p>No restaurants found — try a different search.</p>
      </div>

      <ul className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <RestaurantCardSkeleton />
          </li>
        ))}
      </ul>
    </>
  ) : (
    <ul className="space-y-3">
      <section className="grid gap-6
                          grid-cols-1     /* mobile */
                          sm:grid-cols-2 /* ≥640 px  */
                          lg:grid-cols-3 /* ≥1024 px */
                          px-4 sm:px-0
                          ">
        {results.map(biz => (
          <li key={biz.id}>
            <RestaurantCard
              id={biz.id}
              key={biz.id}
              name={biz.name}
              rating={biz.rating}
              price={biz.price}
              category={biz.categories[0]?.title ?? ''}
              photoUrl={biz.image_url}
            />
          </li>
        ))}
      </section>
    </ul>
  )}
    </main>
  );
}
