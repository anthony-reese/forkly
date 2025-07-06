'use client';
import { useState } from 'react';
import { useGeoPosition } from '@/hooks/useGeoPosition';

export default function SearchBar({
  onSearch,
  onLocate,
}: {
  onSearch: (term: string, location: string) => void;
  onLocate: (lat: number, lon: number, term: string) => void;
}) {
  const [term, setTerm] = useState('');
  const [location, setLocation] = useState('');
  const { coords, request } = useGeoPosition();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        value={term}
        onChange={e => setTerm(e.target.value)}
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
        onClick={() => onSearch(term, location)}
        className="h-10 px-4 bg-indigo-600 text-white rounded"
      >
        Search
      </button>
      <button
        onClick={
            async function handleNearMe() {
                if (!coords) {
                  await request();
                }
                if (coords) 
                  onLocate(coords.latitude, coords.longitude, term);
            }
        }
        className="h-10 px-3 bg-emerald-600 text-white rounded"
      >
        Near me
      </button>
    </div>
  );
}
