// src/components/SearchBar.tsx
'use client';
import { useState } from 'react';
import { useGeoPosition } from '@/hooks/useGeoPosition'; 

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
  const { coords, request } = useGeoPosition(); 

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
        onClick={() => {
          void (async () => {
            if (!coords) {
              await request(); 
            }
    
            if (coords) {
              onLocate(coords.latitude, coords.longitude, query);
            }
          })(); 
        }}
        className="h-10 px-3 bg-emerald-600 text-white rounded"
      >
        Near me
      </button>
    </div>
  );
}