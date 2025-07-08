'use client';
import { useGeoPosition } from '@/hooks/useGeoPosition';

interface SearchBarProps {
  value: string;
  locationValue: string;
  onSearch: (term: string, location: string) => void;
  onLocate: (lat: number, lon: number, term: string) => void;
}

export default function SearchBar({
  value,
  locationValue,
  onSearch,
  onLocate,
}: SearchBarProps) {
  const { coords, request } = useGeoPosition();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        value={value}
        onChange={e => onSearch(e.target.value, locationValue)}
        placeholder="What?"
        className="h-10 flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      />
      <input
        value={locationValue}
        onChange={e => onSearch(value, e.target.value)}
        placeholder="Where?"
        className="h-10 flex-1 border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      />
      <button
        onClick={() => onSearch(value, locationValue)}
        className="h-10 px-4 bg-indigo-600 text-white rounded"
      >
        Search
      </button>
      <button
        onClick={async () => {
          if (!coords) {
            await request();
          }
          if (coords)
            onLocate(coords.latitude, coords.longitude, value);
        }}
        className="h-10 px-3 bg-emerald-600 text-white rounded"
      >
        Near me
      </button>
    </div>
  );
}