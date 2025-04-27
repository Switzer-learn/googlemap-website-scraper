import type { Business, BusinessDetails } from './google-maps-types';

// --- IMPORTANT ---
// To make actual API calls, you need a way to make HTTP requests.
// You can use the built-in 'fetch' in Node.js 18+ or install a library like 'axios':
// npm install axios
// Uncomment the relevant code sections below and the import if you install axios.
// import axios from 'axios';
// -----------------

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Checks if the Google Maps API key is configured.
 * Logs an error and throws an exception if not configured.
 */
function checkApiKey(): void {
  if (!API_KEY) {
    const errorMessage = 'Google Maps API key is missing. Please set GOOGLE_MAPS_API_KEY in your .env file.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Asynchronously searches for businesses using the Google Maps Places API.
 *
 * @param query The search query (e.g., "cafes in Bali").
 * @param radius The search radius in meters.
 * @returns A promise that resolves to an array of Business objects.
 * @throws Error if API key is missing or if the API request fails.
 */
export async function searchBusinesses(query: string, radius: number): Promise<Business[]> {
  checkApiKey(); // Ensure API key is present

  // --- Option 1: Using Node Fetch (Built-in for Node 18+) ---
   const searchUrl = `${PLACES_API_BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&radius=${radius}&key=${API_KEY}`;
   console.log(`[Google Maps] Making Text Search request to: ${PLACES_API_BASE_URL}/textsearch/json?query=...`); // Log safely

   try {
     const response = await fetch(searchUrl);
     const data = await response.json();

     if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
       console.error('[Google Maps] Text Search API Error:', data.status, data.error_message);
       throw new Error(`Google Maps Text Search API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
     }

     if (data.status === 'ZERO_RESULTS' || !data.results) {
        console.log('[Google Maps] Text Search returned zero results.');
        return [];
     }

     console.log(`[Google Maps] Text Search returned ${data.results.length} results.`);
     // Map API response to our Business type
     return data.results.map((place: any) => ({
       name: place.name || 'N/A',
       address: place.formatted_address || place.vicinity || 'N/A', // Use formatted_address first, fallback to vicinity
       rating: place.rating || 0,
       placeId: place.place_id,
     }));

   } catch (error: any) {
     console.error('[Google Maps] Error during Text Search fetch:', error);
     // Rethrow or handle as appropriate for your app's error strategy
     throw new Error(`Failed to fetch businesses: ${error.message}`);
   }

  // --- Option 2: Using Axios (Requires installation: npm install axios) ---
  /*
  const searchUrl = `${PLACES_API_BASE_URL}/textsearch/json`;
  console.log(`[Google Maps] Making Text Search request to: ${searchUrl} with query: ${query}`);

  try {
    const response = await axios.get(searchUrl, {
      params: {
        query: query,
        radius: radius,
        key: API_KEY,
      },
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      console.error('[Google Maps] Text Search API Error:', response.data.status, response.data.error_message);
      throw new Error(`Google Maps Text Search API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
    }

     if (response.data.status === 'ZERO_RESULTS' || !response.data.results) {
        console.log('[Google Maps] Text Search returned zero results.');
        return [];
     }

    console.log(`[Google Maps] Text Search returned ${response.data.results.length} results.`);
    // Map API response to our Business type
    return response.data.results.map((place: any) => ({
      name: place.name || 'N/A',
      address: place.formatted_address || place.vicinity || 'N/A',
      rating: place.rating || 0,
      placeId: place.place_id,
    }));

  } catch (error: any) {
    console.error('[Google Maps] Error during Text Search request:', error.response?.data || error.message);
    throw new Error(`Failed to fetch businesses: ${error.message}`);
  }
  */

  // --- Fallback/Placeholder (Remove once API calls are uncommented) ---
  // console.warn("[Google Maps] Using placeholder data for searchBusinesses. Uncomment API call code.");
  // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
  // return []; // Return empty array for placeholder
}

/**
 * Asynchronously fetches the details of a business using the Google Maps Place Details API.
 *
 * @param placeId The Google Places ID of the business.
 * @returns A promise that resolves to a BusinessDetails object.
 * @throws Error if API key is missing or if the API request fails.
 */
export async function getBusinessDetails(placeId: string): Promise<BusinessDetails> {
  checkApiKey(); // Ensure API key is present

  const fields = 'formatted_phone_number,website'; // Specify required fields

  // --- Option 1: Using Node Fetch (Built-in for Node 18+) ---
   const detailsUrl = `${PLACES_API_BASE_URL}/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
   console.log(`[Google Maps] Making Place Details request for Place ID: ${placeId}`);

   try {
     const response = await fetch(detailsUrl);
     const data = await response.json();

     if (data.status !== 'OK') {
       console.error('[Google Maps] Place Details API Error:', data.status, data.error_message);
       // Don't throw an error here, just return nulls for details
       // throw new Error(`Google Maps Place Details API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
        return {
         phoneNumber: null,
         website: null,
       };
     }

     const result = data.result || {};
      console.log(`[Google Maps] Place Details fetched successfully for ${placeId}. Website: ${result.website ? 'Yes' : 'No'}, Phone: ${result.formatted_phone_number ? 'Yes' : 'No'}`);

     return {
       phoneNumber: result.formatted_phone_number || null,
       website: result.website || null,
     };

   } catch (error: any) {
     console.error(`[Google Maps] Error during Place Details fetch for ${placeId}:`, error);
      // Don't throw an error here, return nulls to allow partial results
      // throw new Error(`Failed to fetch business details: ${error.message}`);
      return {
        phoneNumber: null,
        website: null,
      };
   }

  // --- Option 2: Using Axios (Requires installation: npm install axios) ---
  /*
  const detailsUrl = `${PLACES_API_BASE_URL}/details/json`;
   console.log(`[Google Maps] Making Place Details request for Place ID: ${placeId}`);

  try {
    const response = await axios.get(detailsUrl, {
      params: {
        place_id: placeId,
        fields: fields,
        key: API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
       console.error('[Google Maps] Place Details API Error:', response.data.status, response.data.error_message);
       // Don't throw an error here, just return nulls for details
       // throw new Error(`Google Maps Place Details API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        return {
         phoneNumber: null,
         website: null,
       };
    }

    const result = response.data.result || {};
    console.log(`[Google Maps] Place Details fetched successfully for ${placeId}. Website: ${result.website ? 'Yes' : 'No'}, Phone: ${result.formatted_phone_number ? 'Yes' : 'No'}`);

    return {
      phoneNumber: result.formatted_phone_number || null,
      website: result.website || null,
    };
  } catch (error: any) {
     console.error(`[Google Maps] Error during Place Details request for ${placeId}:`, error.response?.data || error.message);
     // Don't throw an error here, return nulls to allow partial results
     // throw new Error(`Failed to fetch business details: ${error.message}`);
      return {
        phoneNumber: null,
        website: null,
      };
  }
  */

  // --- Fallback/Placeholder (Remove once API calls are uncommented) ---
  // console.warn(`[Google Maps] Using placeholder data for getBusinessDetails (Place ID: ${placeId}). Uncomment API call code.`);
  // await new Promise(resolve => setTimeout(resolve, 100)); // Simulate latency
  // return { phoneNumber: null, website: null }; // Return nulls for placeholder
}
