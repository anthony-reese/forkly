// src/lib/searchClient.ts
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

export async function searchYelp(params: SearchParams) {
  const url = new URL('/api/search', window.location.origin);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  });

  console.log("searchYelp: Calling API with URL:", url.toString());

  const res = await fetch(url.toString());

  // --- CRITICAL CHANGE: Robust Error Handling ---
  if (!res.ok) {
    let errorMessage = `API error: ${res.status} ${res.statusText}`;
    try {
      const errorBody = await res.json();
      if (errorBody && errorBody.error) {
        errorMessage += ` - Details: ${errorBody.error}`;
      } else if (errorBody) {
        errorMessage += ` - Body: ${JSON.stringify(errorBody)}`;
      }
    } catch (e) {
      console.warn("searchYelp: Could not parse error response body as JSON.", e);
    }
    console.error("searchYelp: Fetch failed with error:", errorMessage);
    throw new Error(errorMessage);
  }
  // --- END CRITICAL CHANGE ---

  try {
    const data = await res.json();
    console.log("searchYelp: Received data:", data);
    return data;
  } catch (e) {
    console.error("searchYelp: Error parsing JSON response:", e);
    throw new Error("Invalid JSON response from API. Details: " + (e as Error).message);
  }
}