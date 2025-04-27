export interface BusinessSearchResult {
  name: string;
  address: string;
  rating: number;
  placeId: string;
}

export interface BusinessDetails {
  phoneNumber: string | null;
  website: string | null;
}

export interface FullBusinessData extends BusinessSearchResult, BusinessDetails {
  // Combined type for easier handling
}
