// src/hooks/useGeoPosition.ts
import { useState } from 'react';

export function useGeoPosition() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  async function request() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setCoords(pos.coords),
      err => setError(err.message),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return { coords, error, request };
}
