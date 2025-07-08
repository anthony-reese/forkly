'use client';
import { useState, useEffect } from 'react';
import {  useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import { searchYelp } from '@/lib/searchClient';

/* ------------------------------------------------------------------ */
/*  Type helpers                                                      */
/* ------------------------------------------------------------------ */

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  image_url?: string;
  categories: { title: string }[];
}

interface YelpSearchOpts {
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: string;
  categories?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SearchPageClient() {
  const params = useSearchParams();
  const router = useRouter();

  // ---------------- state ----------------
  const [results, setResults]                 = useState<Business[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [lastQuery, setLastQuery]             = useState('restaurants');
  const [term]                                = useState(() => params.get('term') ?? '');
  const [location]                            = useState(() => params.get('location') ?? '');
  const [selectedPrices, setSelectedPrices]   = useState<string[]>([]);
  const [selectedCats,  setSelectedCats]      = useState<string[]>([]);

  // ---------------- helpers -------------
  async function fetchResults(query: string, opts: YelpSearchOpts = {}) {
    setLoading(true);
    try {
      const data = await searchYelp({
        term: query,
        ...opts,
        price: selectedPrices.join(',') || undefined,
        categories: selectedCats.join(',') || undefined,
      });
      setResults(data.businesses ?? []);
      setLastQuery(query);
    } finally {
      setLoading(false);
    }
  }

  // ---------------- search handlers -----
  async function handleSearch(term: string, loc: string) {
    const q = term.trim() || 'restaurants';
    router.replace(`/?term=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`);
    await fetchResults(q, { location: loc });
  }

  async function handleLocate(lat: number, lon: number, term: string) {
    const q = term.trim() || 'restaurants';
    await fetchResults(q, { latitude: lat, longitude: lon });
  }

  // ---------------- filter toggles ------
  function toggle(arr: string[], value: string, setter: (a: string[]) => void) {
    setter(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  }
  const togglePrice    = (v: string) => toggle(selectedPrices, v, setSelectedPrices);
  const toggleCategory = (v: string) => toggle(selectedCats,  v, setSelectedCats);

  /* re-run when filters change */
  useEffect(() => {
    fetchResults(lastQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPrices, selectedCats]);

  /* ---------------------------------------------------------------- */

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      {/* search bar */}
      <SearchBar onSearch={handleSearch} onLocate={handleLocate}
                 initialTerm={term}
                 initialLocation={location} />

      {/* price chips */}
      <div className="flex gap-2 pt-2">
        {['1', '2', '3'].map(p => (
          <button
            key={p}
            onClick={() => togglePrice(p)}
            className={`px-3 py-1 rounded border
                        ${selectedPrices.includes(p)
                          ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                          : 'bg-gray-200 dark:bg-gray-700'}`}>
            {'$'.repeat(Number(p))}
          </button>
        ))}
        {['thai', 'pizza', 'coffee'].map(c => (
          <button
            key={c}
            onClick={() => toggleCategory(c)}
            className={`px-3 py-1 rounded border capitalize
                        ${selectedCats.includes(c)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* results */}
      {loading && <p>Loading…</p>}
      {!loading && results.length === 0 && (
        <p className="text-center py-10 text-gray-500">
          No results for “{lastQuery}”.
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
            category={biz.categories?.[0]?.title ?? ''}
            photoUrl={biz.image_url}
          />
        ))}
      </section>
    </main>
  );
}
