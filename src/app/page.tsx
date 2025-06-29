'use client';

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  categories: { title: string }[];
}

interface YelpSearchResponse {
  businesses: Business[];
}

import { useState } from 'react';

export default function Home() {
  const [term, setTerm] = useState('sushi');
  const [location, setLocation] = useState('Tokyo');
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/yelp/search?term=${encodeURIComponent(
        term,
      )}&location=${encodeURIComponent(location)}`,
    );
     const json: YelpSearchResponse = await res.json();
    setResults(json.businesses ?? []);

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Forkly</h1>

      <div className="flex gap-2">
        <input
          value={term}
          onChange={e => setTerm(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="What?"
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Where?"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading…</p>}

      <ul className="space-y-2">
        {results.map(biz => (
          <li key={biz.id} className="border p-3 rounded shadow-sm">
            <p className="font-semibold">{biz.name}</p>
            <p className="text-sm">
              ⭐ {biz.rating} • {biz.price ?? '?'} • {biz.categories[0]?.title}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
