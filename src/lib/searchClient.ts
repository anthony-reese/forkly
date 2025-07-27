// src/lib/searchClient.ts

// Make sure your Business interface is accessible, e.g.:
import { Business } from './foursquareCached'; // Or from a central types file

// Your existing SearchParams interface
export interface SearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: string; // Consider if this should be a number or string based on API
  categories?: string;
  limit?: number;
  offset?: number;
}

// --- New: Define API Response Interfaces ---

// Interface for a successful search API response
// Adjust 'businesses' property name and type if your API returns something different
export interface SearchApiResponse {
  businesses: Business[]; // Assuming 'Business' interface is defined elsewhere
  // Add other properties if your API response includes them (e.g., total, region)
  total?: number;
}

// Interface for an API error response
// Adjust 'error' property name and type if your API returns something different for errors
interface SearchApiErrorResponse {
  error?: string; // Common for a simple error message
  message?: string; // Some APIs use 'message' for errors
  statusCode?: number;
  // Add other properties if your API error response includes them
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
      // Explicitly type the error response body
      const errorBody = (await res.json()) as SearchApiErrorResponse;

      // Access properties safely using optional chaining or nullish coalescing
      if (errorBody?.error) {
        errorMessage += ` - Details: ${errorBody.error}`;
      } else if (errorBody?.message) { // Check for a 'message' property
        errorMessage += ` - Details: ${errorBody.message}`;
      } else if (Object.keys(errorBody).length > 0) { // Fallback if no specific error property but object exists
        errorMessage += ` - Body: ${JSON.stringify(errorBody)}`;
      }
    } catch (e: unknown) { // Use 'unknown' for catch block errors
      console.warn("searchFoursquare: Could not parse error response body as JSON.", e);
      errorMessage += ` - Could not parse error response body. Original error: ${e instanceof Error ? e.message : String(e)}`;
    }
    console.error("searchFoursquare: Fetch failed with error:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    // Explicitly type the successful data response
    const data = (await res.json()) as SearchApiResponse;
    console.log("searchFoursquare: Received data:", data);

    // Ensure data.businesses exists and is an array before returning
    if (!data.businesses || !Array.isArray(data.businesses)) {
      throw new Error("API response is missing 'businesses' array or it's not an array.");
    }
    return data.businesses;
  } catch (e: unknown) { // Use 'unknown' for catch block errors
    console.error("searchFoursquare: Error parsing JSON response:", e);
    // Safely access error message
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error("Invalid JSON response from API. Details: " + errorMessage);
  }
}