'use client';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import { searchYelp } from '@/lib/searchClient';

interface Business {
  id: string;
  name: string;
  rating: number;
  price?: string;
  image_url?: string;
  categories: { title: string; alias: string }[];
}

const priceOptions = [
  { label: '$', value: '1' },
  { label: '$$', value: '2' },
  { label: '$$$', value: '3' },
];

const categoryOptions = [
  { label: 'Ramen', value: 'ramen' },
  { label: 'Coffee', value: 'coffee' },
  { label: 'Pizza', value: 'pizza' },
];

export default function Home() {
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('restaurants');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  type YelpSearchParams = {
    term: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    price?: string;
    categories?: string;
  };

  const fetchResults = useCallback(
    async (
      term: string,
      loc?: string,
      lat?: number,
      lon?: number
    ) => {
      setLoading(true);
      try {
        const q = term.trim() || 'restaurants';
        const params: YelpSearchParams = { term: q };
        if (loc) params.location = loc;
        if (lat && lon) {
          params.latitude = lat;
          params.longitude = lon;
        }
        if (selectedPrices.length) params.price = selectedPrices.join(',');
        if (selectedCategories.length) params.categories = selectedCategories.join(',');

        const data = await searchYelp(params);
        setResults(data.businesses ?? []);
        setLastQuery(q);
      } finally {
        setLoading(false);
      }
    },
    [selectedPrices, selectedCategories]
  );

  useEffect(() => {
    fetchResults(lastQuery);
  }, [selectedPrices, selectedCategories, fetchResults, lastQuery]);
  
  async function handleSearch(term: string, loc: string) {
    await fetchResults(term, loc);
  }

  async function handleLocate(lat: number, lon: number, term: string) {
    await fetchResults(term, undefined, lat, lon);
  }

  const togglePrice = async (value: string) => {
    const newPrices = selectedPrices.includes(value)
      ? selectedPrices.filter(v => v !== value)
      : [...selectedPrices, value];
    setSelectedPrices(newPrices);
    await fetchResults(lastQuery);
  };

  const toggleCategory = async (value: string) => {
    const newCategories = selectedCategories.includes(value)
      ? selectedCategories.filter(v => v !== value)
      : [...selectedCategories, value];
    setSelectedCategories(newCategories);
    await fetchResults(lastQuery);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <SearchBar onSearch={handleSearch} onLocate={handleLocate} />

      {/* Price filter chips */}
      <div className="flex gap-2">
        {priceOptions.map(option => (
          <button
            key={option.value}
            className={`px-3 py-1 rounded-full border text-sm ${
              selectedPrices.includes(option.value)
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-white text-black dark:bg-gray-900 dark:text-white'
            }`}
            onClick={() => togglePrice(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2">
        {categoryOptions.map(option => (
          <button
            key={option.value}
            className={`px-3 py-1 rounded-full border text-sm ${
              selectedCategories.includes(option.value)
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-white text-black dark:bg-gray-900 dark:text-white'
            }`}
            onClick={() => toggleCategory(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}

      {!loading && results.length === 0 && (
        <p className="text-center py-10 text-gray-500">
          No nearby results for “{lastQuery}”
          {(!lastQuery || lastQuery === 'restaurants') && !selectedPrices.length && !selectedCategories.length
            ? ' near your location'
            : ''}
          . Try another term.
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
