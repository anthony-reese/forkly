// src/app/SearchPageClient.tsx
'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import { searchFoursquare } from '@/lib/searchClient';

/* ------------- */
/* Type helpers  */
/* --------------*/

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
}

interface FoursquareSearchOpts {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: string;
  categories?: string;
}

/* ------------------------------------------------------------------------------------------ */
/* Debounce Helper Function (as corrected in previous turn, to avoid TypeScript 'any' errors) */
/* ------------------------------------------------------------------------------------------ */
function debounce<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  delay: number
): (...args: TArgs) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return function(this: ThisParameterType<typeof func>, ...args: TArgs) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function SearchPageClient() {
  const params = useSearchParams();
  const router = useRouter();

  // ---------------- state ----------------
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('restaurants');

  
  const [query, setQuery] = useState(() => params.get('term') ?? ''); 
  const [location, setLocation] = useState(() => params.get('location') ?? '');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false); // New state variable
  useEffect(() => {
    setMounted(true); // Set to true once the component mounts on the client
  }, []);

  // ---------------- effects ----------------

  
  const fetchResultsCore = useCallback(async (query: string, opts: FoursquareSearchOpts = {}) => {
      setLoading(true);
      try {
          console.log('fetchResultsCore: Preparing to search with query:', query, 'and opts:', opts);
          const data = await searchFoursquare({
              term: query,
              ...opts,
              price: selectedPrices.join(',') || undefined,
              categories: selectedCats.join(',') || undefined,
          });

          setResults(data);
          console.log('fetchResultsCore: Received successful data:', data);

      } catch (error) {
          console.error('fetchResultsCore: Error during search operation:', error);
          setResults([]);
      } finally {
          setLoading(false);
      }
  }, [selectedPrices, selectedCats]);

  const debouncedFetchResults = useRef(
    debounce((query: string, opts?: FoursquareSearchOpts) => {
      fetchResultsCore(query, opts);
    }, 500)
  ).current;

  useEffect(() => {
    const currentQuery = params.get('term') ?? ''; 
    const currentLocation = params.get('location') ?? '';
    const currentPrices = params.getAll('price') || [];
    const currentCategories = params.getAll('categories') || [];

    setQuery(currentQuery);
    setLocation(currentLocation);
    setSelectedPrices(currentPrices);
    setSelectedCats(currentCategories);

    setLastQuery(currentQuery || 'restaurants');

    console.log("useEffect: currentTerm:", currentQuery, "currentLocation:", currentLocation);

    if (!currentQuery && !currentLocation && !params.get('latitude') && !params.get('longitude')) {
        console.log("useEffect: No search parameters found in URL, not initiating search.");
        setResults([]);
        return;
    }

    const hasLocationData = currentLocation || (params.get('latitude') && params.get('longitude'));
    if (currentQuery && hasLocationData) {
      console.log("useEffect: Initiating debounced search with term:", currentQuery, "location data present.");
      const opts: FoursquareSearchOpts = {};
      if (currentLocation) opts.location = currentLocation;
      if (params.get('latitude') && params.get('longitude')) {
        opts.latitude = Number(params.get('latitude'));
        opts.longitude = Number(params.get('longitude'));
      }
      debouncedFetchResults(currentQuery, opts);
    } else if (currentQuery && !hasLocationData) {
      console.log("useEffect: Term present but no location data. Not initiating full search.");
    }
  }, [params, debouncedFetchResults, router]);

  // ---------------- handlers ----------------

  const togglePrice = (price: string) => {
    const newPrices = selectedPrices.includes(price)
      ? selectedPrices.filter(p => p !== price)
      : [...selectedPrices, price];
    setSelectedPrices(newPrices);
    const newParams = new URLSearchParams(params.toString());
    params.getAll('price').forEach(p => newParams.delete('price', p));
    newPrices.forEach(p => newParams.append('price', p));

    if (query) newParams.set('term', query);
    if (location) newParams.set('location', location);
    router.replace(`/?${newParams.toString()}`);
  };

  const toggleCategory = (category: string) => {
    const newCats = selectedCats.includes(category)
      ? selectedCats.filter(c => c !== category)
      : [...selectedCats, category];
    setSelectedCats(newCats);
    const newParams = new URLSearchParams(params.toString());
    params.getAll('categories').forEach(c => newParams.delete('categories', c));
    newCats.forEach(c => newParams.append('categories', c));

    if (query) newParams.set('term', query);
    if (location) newParams.set('location', location);
    router.replace(`/?${newParams.toString()}`);
  };


  const handleSearch = (newQuery: string, newLocation: string) => {
    setQuery(newQuery);
    setLocation(newLocation);
    const newParams = new URLSearchParams();
    if (newQuery) newParams.set('term', newQuery);
    if (newLocation) newParams.set('location', newLocation);
    selectedPrices.forEach(p => newParams.append('price', p));
    selectedCats.forEach(c => newParams.append('categories', c));
    router.replace(`/?${newParams.toString()}`);
  };

  const handleLocate = (lat: number, lon: number, newQuery: string) => {
    setQuery(newQuery);
    setLocation('');
    const newParams = new URLSearchParams();
    if (newQuery) newParams.set('term', newQuery);
    newParams.set('latitude', lat.toString());
    newParams.set('longitude', lon.toString());
    selectedPrices.forEach(p => newParams.append('price', p));
    selectedCats.forEach(c => newParams.append('categories', c));
    router.replace(`/?${newParams.toString()}`);
  };


  return (
    <main className="container flex flex-col pt-4 pb-12">
      <h2 className="text-3xl font-bold text-center mb-6">
        Find your next favorite spot
      </h2>

      <SearchBar
        onSearch={handleSearch}
        onLocate={handleLocate}
        initialQuery={query}
        initialLocation={location}
      />

      {/* category/price filters */}
      <div className="my-6 flex gap-2 justify-center flex-wrap">
        {['1', '2', '3', '4'].map(p => (
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

        {[
          { id: '13000', name: 'Pizza' },
          { id: '13065', name: 'Thai' },
          { id: '13035', name: 'Coffee Shop' },
          { id: '13028', name: 'Mexican' },
          { id: '13064', name: 'Sushi' },
          { id: '13049', name: 'Burger' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`px-3 py-1 rounded border capitalize
                        ${selectedCats.includes(cat.id)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'}`}>
            {cat.name} {/* Display the human-readable name */}
          </button>
        ))}
      </div>

      {/* results */}
      {/* Conditionally render based on loading, errors, and results */}
      {loading && <p className="text-center py-10 text-gray-500">Loading…</p>}

      {error && <p className="text-center py-10 text-red-500">{error}</p>}

      {/* This block handles showing the main results OR the "No results" message */}
      {mounted && !loading && !error && (
        <>
          {results.length > 0 ? (
            <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(biz => (
                <RestaurantCard
                  key={biz.id}
                  id={biz.id}
                  name={biz.name}
                  rating={biz.rating}
                  price={biz.price}
                  category={biz.category ?? 'N/A'}
                  photoUrl={biz.photoUrl}
                />
              ))}
            </section>
          ) : (
            <p className="text-center py-10 text-gray-500">
              No results for “{/* You can still use lastQuery here if it's available and makes sense */}
              {lastQuery ? `“${lastQuery}”` : 'your search criteria'}.
            </p>
          )}
        </>
      )}

      {/* This placeholder only shows during the initial server-render before hydration */}
      {!mounted && <p className="text-center py-10 text-gray-500">Loading content...</p>}
    </main>
  );
}