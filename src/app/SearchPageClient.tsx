// src/app/(home)/SearchPageClient.tsx
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import { searchYelp } from '@/lib/searchClient';

/* ------------- */
/* Type helpers  */
/* --------------*/

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
/* Component                                                         */
/* ------------------------------------------------------------------ */

export default function SearchPageClient() {
  const params = useSearchParams();
  const router = useRouter();

  // ---------------- state ----------------
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('restaurants');
  // Initialize term and location states directly from URL params
  const [term, setTerm] = useState(() => params.get('term') ?? '');
  const [location, setLocation] = useState(() => params.get('location') ?? '');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  // ---------------- effects ----------------

  // Function to perform the actual fetch
  const fetchResultsCore = useCallback(async (query: string, opts: YelpSearchOpts = {}) => {
      setLoading(true);
      try {
          console.log('fetchResultsCore: Preparing to search with query:', query, 'and opts:', opts);
          const data = await searchYelp({
              term: query,
              ...opts,
              price: selectedPrices.join(',') || undefined,
              categories: selectedCats.join(',') || undefined,
          });

          console.log('fetchResultsCore: Received successful data:', data);
          if (Array.isArray(data.businesses)) {
              setResults(data.businesses);
          } else {
              console.error('fetchResultsCore: searchYelp did not return an array for businesses:', data.businesses);
              setResults([]);
          }
      } catch (error) {
          console.error('fetchResultsCore: Error during search operation:', error);
          setResults([]); // Clear results on error
      } finally {
          setLoading(false);
      }
  }, [selectedPrices, selectedCats]);

  // Debounced version of the fetch function
  const debouncedFetchResults = useRef(
    debounce((query: string, opts?: YelpSearchOpts) => {
      fetchResultsCore(query, opts);
    }, 500)
  ).current;

  // Effect to handle URL parameter changes and trigger search
  useEffect(() => {
    const currentTerm = params.get('term') ?? '';
    const currentLocation = params.get('location') ?? '';
    const currentPrices = params.getAll('price') || [];
    const currentCategories = params.getAll('categories') || [];

    // Update state based on URL params
    setTerm(currentTerm);
    setLocation(currentLocation);
    setSelectedPrices(currentPrices);
    setSelectedCats(currentCategories);

    setLastQuery(currentTerm || 'restaurants');

    // Debugging logs for useEffect
    console.log("useEffect: currentTerm:", currentTerm, "currentLocation:", currentLocation);

    if (!currentTerm && !currentLocation) {
        console.log("useEffect: Both term and location are empty, not initiating search.");
        setResults([]); // Clear results if no search parameters
        return; // Don't proceed with search
    }

    // Only search if both term and location are present
    if (currentTerm && currentLocation) {
      console.log("useEffect: Initiating debounced search with term:", currentTerm, "location:", currentLocation);
      debouncedFetchResults(currentTerm, { location: currentLocation });
    } else if (currentTerm && !currentLocation) {
      // If only term is present (e.g., default 'restaurants'), but no location, do not trigger a search.
      // The backend handles the 400 for missing location, but we want to prevent the client from sending it.
      // This path *shouldn't* trigger a fetch if the button is disabled for missing location.
      console.log("useEffect: Term present but location missing. Not initiating full search.");
    }
  }, [params, debouncedFetchResults, router]);

  // ---------------- handlers ----------------

  const togglePrice = (price: string) => {
    const newPrices = selectedPrices.includes(price)
      ? selectedPrices.filter(p => p !== price)
      : [...selectedPrices, price];
    setSelectedPrices(newPrices);
    const newParams = new URLSearchParams(params.toString());
    newPrices.forEach(p => newParams.append('price', p));
    if (term) newParams.set('term', term);
    if (location) newParams.set('location', location);
    // Remove existing prices to prevent duplicates when appending
    params.getAll('price').forEach(p => newParams.delete('price', p));
    router.replace(`/?${newParams.toString()}`);
  };

  const toggleCategory = (category: string) => {
    const newCats = selectedCats.includes(category)
      ? selectedCats.filter(c => c !== category)
      : [...selectedCats, category];
    setSelectedCats(newCats);
    const newParams = new URLSearchParams(params.toString());
    newCats.forEach(c => newParams.append('categories', c));
    if (term) newParams.set('term', term);
    if (location) newParams.set('location', location);
    // Remove existing categories to prevent duplicates when appending
    params.getAll('categories').forEach(c => newParams.delete('categories', c));
    router.replace(`/?${newParams.toString()}`);
  };


  const handleSearch = (newTerm: string, newLocation: string) => {
    // These setters will trigger the useEffect due to params dependency
    setTerm(newTerm);
    setLocation(newLocation);
    // Update URL to reflect search parameters
    const newParams = new URLSearchParams();
    if (newTerm) newParams.set('term', newTerm);
    if (newLocation) newParams.set('location', newLocation);
    selectedPrices.forEach(p => newParams.append('price', p));
    selectedCats.forEach(c => newParams.append('categories', c));
    router.replace(`/?${newParams.toString()}`);
  };

  const handleLocate = (lat: number, lon: number, newTerm: string) => {
    // These setters will trigger the useEffect due to params dependency
    setTerm(newTerm);
    setLocation(''); // Clear location text if using geo-coords
    const newParams = new URLSearchParams();
    if (newTerm) newParams.set('term', newTerm);
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
        initialTerm={term}
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
            category={biz.categories[0]?.title ?? 'N/A'}
            photoUrl={biz.image_url}
          />
        ))}
      </section>
    </main>
  );
}