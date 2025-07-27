// src/components/SearchBar.tsx
'use client';
import { useState } from 'react';
import { useGeoPosition } from '@/hooks/useGeoPosition'; // Assuming this hook exists and is correct

interface Props {
  onSearch: (query: string, location: string) => void;
  onLocate: (lat: number, lon: number, query: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

export default function SearchBar({
  onSearch,
  onLocate,
  initialQuery = '',
  initialLocation = '',
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const { coords, request } = useGeoPosition(); // Assuming request is an async function

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="What?"
        className="h-10 flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      />
      <input
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Where?"
        className="h-10 flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      />
      <button
        onClick={() => {
          if (!location.trim()) return;
          onSearch(query, location);
        }}
        className="h-10 px-4 bg-indigo-600 text-white rounded"
        disabled={!query || !location}
      >
        Search
      </button>
      <button
        // Refactored lines 48-51:
        onClick={() => {
          // Use `void` to explicitly tell TypeScript/ESLint that the returned Promise
          // from this async IIFE is intentionally not handled/awaited here.
          void (async () => {
            if (!coords) {
              await request(); // request() is presumably async and returns a Promise
            }
            // After request() might have updated coords, check again
            if (coords) { // Still rely on the `coords` state directly from the hook
              onLocate(coords.latitude, coords.longitude, query);
            }
          })(); // Immediately Invoked Async Function Expression
        }}
        className="h-10 px-3 bg-emerald-600 text-white rounded"
      >
        Near me
      </button>
    </div>
  );
}