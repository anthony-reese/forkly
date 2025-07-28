// src/lib/searchClient.ts
import { Business } from './foursquareCached';

export interface SearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: string;
  categories?: string;
  limit?: number;
  offset?: number;
}

export interface SearchApiResponse {
  businesses: Business[]; 
  total?: number;
}

interface SearchApiErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
}

/**
 * Performs a search against your Next.js API endpoint, which then
 * presumably calls an external service like Foursquare.
 * @param params Search parameters.
 * @returns A Promise that resolves to an array of Business objects.
 */
export async function searchFoursquare(params: SearchParams): Promise<Business[]> {
  const url = new URL('/api/search', window.location.origin);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  console.log("searchFoursquare: Calling API with URL:", url.toString());

  const res = await fetch(url.toString());

  if (!res.ok) {
    let errorMessage = `API error: ${res.status} ${res.statusText}`;
    try {
      const errorBody = (await res.json()) as SearchApiErrorResponse;

      if (errorBody?.error) {
        errorMessage += ` - Details: ${errorBody.error}`;
      } else if (errorBody?.message) {
        errorMessage += ` - Details: ${errorBody.message}`;
      } else if (Object.keys(errorBody).length > 0) {
        errorMessage += ` - Body: ${JSON.stringify(errorBody)}`;
      }
    } catch (e: unknown) {
      console.warn("searchFoursquare: Could not parse error response body as JSON.", e);
      errorMessage += ` - Could not parse error response body. Original error: ${e instanceof Error ? e.message : String(e)}`;
    }
    console.error("searchFoursquare: Fetch failed with error:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const data = (await res.json()) as SearchApiResponse;
    console.log("searchFoursquare: Received data:", data);

    if (!data.businesses || !Array.isArray(data.businesses)) {
      throw new Error("API response is missing 'businesses' array or it's not an array.");
    }
    return data.businesses;
  } catch (e: unknown) { 
    console.error("searchFoursquare: Error parsing JSON response:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error("Invalid JSON response from API. Details: " + errorMessage);
  }
}