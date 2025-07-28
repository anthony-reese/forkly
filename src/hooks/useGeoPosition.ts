// src/hooks/useGeoPosition.ts
import { useState } from 'react';

class GeolocationServiceError extends Error {
  code: number; 

  constructor(message: string, code: number) {
    super(message);
    this.name = 'GeolocationServiceError';
    this.code = code;
    Object.setPrototypeOf(this, GeolocationServiceError.prototype);
  }
}

export function useGeoPosition() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function request() {
    setError(null);
    setCoords(null);

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (err: GeolocationPositionError) => {
            reject(new GeolocationServiceError(err.message, err.code));
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 }
        );
      });

      setCoords(position.coords);
    } catch (err: unknown) {
      if (err instanceof GeolocationServiceError) {
        let errorMessage = 'Geolocation error: ';
        switch (err.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errorMessage += 'Permission denied to access location.';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case GeolocationPositionError.TIMEOUT:
            errorMessage += 'The request to get user location timed out.';
            break;
          default:
            errorMessage += err.message;
            break;
        }
        setError(errorMessage);
      } else if (err instanceof Error) {
        
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        
        setError('An unknown geolocation error occurred.');
      }
      console.error("Geolocation request failed:", err);
    }
  }

  return { coords, error, request };
}