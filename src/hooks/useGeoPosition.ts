// src/hooks/useGeoPosition.ts
import { useState } from 'react';

// Define a custom error class for geolocation errors
class GeolocationServiceError extends Error {
  code: number; // Corresponds to GeolocationPositionError.code

  constructor(message: string, code: number) {
    super(message);
    this.name = 'GeolocationServiceError'; // Set a distinct name for the error
    this.code = code;
    // Set the prototype explicitly. This is important for instanceof checks to work correctly in some environments.
    Object.setPrototypeOf(this, GeolocationServiceError.prototype);
  }
}

export function useGeoPosition() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function request() {
    setError(null); // Clear any previous errors when a new request is made
    setCoords(null); // Clear any previous coordinates as well

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return; // Exit if geolocation is not supported
    }

    try {
      // Wrap the callback-based getCurrentPosition in a Promise
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos); // Resolve the Promise with the GeolocationPosition object
          },
          (err: GeolocationPositionError) => {
            // Reject the Promise with our custom Error instance
            reject(new GeolocationServiceError(err.message, err.code));
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 } // Options for getCurrentPosition
        );
      });

      setCoords(position.coords); // Update state with coordinates from the resolved Promise
    } catch (err: unknown) { // Catch any errors (e.g., permission denied, timeout)
      if (err instanceof GeolocationServiceError) { // Now safely check for our custom error
        let errorMessage = 'Geolocation error: ';
        switch (err.code) { // Access the code property safely
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
            errorMessage += err.message; // Use the message from our custom error
            break;
        }
        setError(errorMessage);
      } else if (err instanceof Error) {
        // Fallback for other standard Error objects
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        // Fallback for truly unknown error types
        setError('An unknown geolocation error occurred.');
      }
      console.error("Geolocation request failed:", err);
    }
  }

  return { coords, error, request };
}