import type { Business, BusinessDetails, Location } from './google-maps-types'; // Import types from new file

/**
 * Asynchronously searches for businesses using the Google Maps Places API.
 *
 * @param query The search query (e.g., "cafes in Bali").
 * @param radius The search radius in meters.
 * @returns A promise that resolves to an array of Business objects.
 */
export async function searchBusinesses(query: string, radius: number): Promise<Business[]> {
  console.log(`[Placeholder] Searching Google Maps for: "${query}", radius: ${radius}m`);
  // TODO: Replace with actual Google Maps Places Text Search API call
  // Example structure - replace with real API interaction

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate results based on query (very basic)
  if (query.toLowerCase().includes("cafe") && query.toLowerCase().includes("bali")) {
    return [
      {
        name: 'Revolver Espresso',
        address: 'Jl. Kayu Aya No.Gang 51, Seminyak, Bali',
        rating: 4.6,
        placeId: 'ChIJN1t_tDeu0i0R4bq9_eDk', // Example Place ID
      },
      {
         name: 'Sisterfields Cafe',
         address: 'Jl. Kayu Cendana No.7, Seminyak, Bali',
         rating: 4.5,
         placeId: 'ChIJ4zaT1Cau0i0R0fN1_eDk', // Example Place ID
       },
        {
         name: 'Kynd Community',
         address: 'Jalan Petitenget No.12 Kerobokan Kelod, Seminyak, Bali',
         rating: 4.7,
         placeId: 'ChIJh5bT7Cau0i0RdfV5_eDk', // Example Place ID (no website)
       },
       {
        name: 'Example Business Without Rating',
        address: '456 Another St, Denpasar, Bali',
        rating: 0, // Simulate no rating
        placeId: 'ChIJo9bT7Cau0i0RdfV6_eDk', // Example Place ID
      },
    ];
  } else if (query.toLowerCase().includes("restaurant")) {
     return [
       {
         name: 'Sample Restaurant',
         address: '789 Food St',
         rating: 4.2,
         placeId: '67890',
       },
     ]
  }

  // Default: return empty if no specific match
  console.log("[Placeholder] No specific mock results found, returning empty array.");
  return [];
}

/**
 * Asynchronously fetches the details of a business using the Google Maps Places API.
 *
 * @param placeId The Google Places ID of the business.
 * @returns A promise that resolves to a BusinessDetails object.
 */
export async function getBusinessDetails(placeId: string): Promise<BusinessDetails> {
   console.log(`[Placeholder] Fetching details for Place ID: ${placeId}`);
  // TODO: Replace with actual Google Maps Place Details API call
  // Need to request 'formatted_phone_number' and 'website' fields

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));


   // Simulate details based on Place ID
   switch (placeId) {
    case 'ChIJN1t_tDeu0i0R4bq9_eDk': // Revolver
      return {
        phoneNumber: '+62 851-0088-4968',
        website: 'https://revolverbali.com/',
      };
    case 'ChIJ4zaT1Cau0i0R0fN1_eDk': // Sisterfields
      return {
        phoneNumber: '+62 811-3860-507',
        website: 'https://sisterfields.com/',
      };
    case 'ChIJh5bT7Cau0i0RdfV5_eDk': // Kynd (No website)
      return {
        phoneNumber: '+62 859-3112-0209',
        website: null, // Simulate missing website
      };
    case 'ChIJo9bT7Cau0i0RdfV6_eDk': // Example Business (No Phone)
       return {
         phoneNumber: null,
         website: 'http://examplenophone.com',
       };
    case '67890': // Sample Restaurant
      return {
         phoneNumber: '555-987-6543',
         website: 'http://samplerestaurant.net',
      }
    default:
      console.warn(`[Placeholder] No mock details found for Place ID: ${placeId}`);
      return {
        phoneNumber: '555-000-0000', // Default placeholder
        website: 'http://unknown-business.com', // Default placeholder
      };
  }
}
