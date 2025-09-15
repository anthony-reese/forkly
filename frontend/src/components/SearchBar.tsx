// src/components/SearchBar.tsx
'use client';
import { useState } from 'react';
import { MapPin, UtensilsCrossed } from 'lucide-react';

interface Props {
  onSearch: (query: string, location: string) => void;
  onLocate?: (lat: number, lon: number, query: string) => void; // optional
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

  return (
    <div className="card p-4 md:p-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
        <div className="relative">
          <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            className="input font-['Patrick_Hand']"
            placeholder="What — burgers, sushi, tacos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="What to eat"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            className="input font-['Patrick_Hand']"
            placeholder="Where — city, neighborhood, or 'near me'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Where to eat"
          />
        </div>

        <div className="flex gap-2 md:justify-end">
          <button
            className="btn-primary h-[44px] px-6 font-semibold"
            onClick={() => onSearch(query, location)}
          >
            Search
          </button>

          {onLocate && (
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition((pos) => {
                  onLocate(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    query
                  );
                });
              }}
              className="h-[44px] px-4 rounded-full bg-emerald-600 text-white"
            >
              Near me
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
