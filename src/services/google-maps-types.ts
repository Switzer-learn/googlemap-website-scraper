/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents a business returned by the Google Maps Places Search API.
 * Matches the expected structure more closely.
 */
export interface Business {
  /**
   * The name of the business.
   */
  name: string;
  /**
   * The formatted address of the business (usually).
   * Note: The API might return 'vicinity' instead sometimes.
   */
  address: string; // Often 'formatted_address' or 'vicinity' in API response
  /**
   * The rating of the business (0 if none).
   */
  rating: number; // Places API returns number, often 0 if not rated
  /**
   * The Google Places ID of the business.
   */
  placeId: string; // 'place_id' in API response
}

/**
 * Represents the details of a business obtained from Place Details API.
 */
export interface BusinessDetails {
  /**
   * The formatted phone number of the business.
   */
  phoneNumber: string | null; // 'formatted_phone_number' in API response
  /**
   * The website URL of the business.
   */
  website: string | null; // 'website' in API response
}
