"use server";

import type { FullBusinessData } from '@/types';
import { searchBusinesses, getBusinessDetails } from '@/services/google-maps';
// TODO: Import Firestore functions when implemented
// TODO: Import CSV/Excel generation libraries when implemented

export interface SearchState {
  results: FullBusinessData[];
  loading: boolean;
  error: string | null;
  dashboard: {
    total: number;
    withWebsite: number;
    withoutWebsite: number;
  };
}

// Placeholder for Firestore caching logic
async function getCachedResults(query: string, radius: number): Promise<FullBusinessData[] | null> {
  console.log(`Checking cache for query: "${query}", radius: ${radius}`);
  // TODO: Implement Firestore cache check
  return null; // Assume cache miss for now
}

async function cacheResults(query: string, radius: number, results: FullBusinessData[]): Promise<void> {
  console.log(`Caching ${results.length} results for query: "${query}", radius: ${radius}`);
  // TODO: Implement Firestore cache write
}


export async function searchBusinessesAction(
  query: string,
  radius: number
): Promise<SearchState> {
  try {
    console.log(`Searching for: "${query}" within ${radius}m radius`);

    // 1. Check Cache (Placeholder)
    const cachedData = await getCachedResults(query, radius);
    if (cachedData) {
       console.log("Returning cached results");
       const total = cachedData.length;
       const withoutWebsite = cachedData.filter(b => !b.website).length;
       const withWebsite = total - withoutWebsite;
       return {
         results: cachedData,
         loading: false,
         error: null,
         dashboard: { total, withWebsite, withoutWebsite },
       };
    }

    // 2. Call Google Maps API (Placeholders)
    const searchResults = await searchBusinesses(query, radius);
    console.log(`Found ${searchResults.length} initial results.`);

    // 3. Fetch Details for each result (Placeholders)
    const detailedResults: FullBusinessData[] = await Promise.all(
      searchResults.map(async (business) => {
        try {
          const details = await getBusinessDetails(business.placeId);
          return { ...business, ...details };
        } catch (detailError) {
           console.error(`Error fetching details for ${business.placeId}:`, detailError);
           // Return basic info even if details fail
           return { ...business, phoneNumber: null, website: null };
        }
      })
    );
    console.log(`Fetched details for ${detailedResults.length} businesses.`);


    // 4. Update Dashboard Stats
    const total = detailedResults.length;
    const withoutWebsite = detailedResults.filter(b => !b.website).length;
    const withWebsite = total - withoutWebsite;

    // 5. Cache Results (Placeholder)
    await cacheResults(query, radius, detailedResults);

    return {
      results: detailedResults,
      loading: false,
      error: null,
      dashboard: { total, withWebsite, withoutWebsite },
    };
  } catch (error: any) {
    console.error("Error during business search:", error);
    return {
      results: [],
      loading: false,
      error: error.message || "An unexpected error occurred.",
      dashboard: { total: 0, withWebsite: 0, withoutWebsite: 0 },
    };
  }
}

export async function exportDataAction(data: FullBusinessData[], format: 'csv' | 'excel'): Promise<{ success: boolean; error?: string, fileContent?: string, fileName?: string }> {
   console.log(`Exporting ${data.length} records to ${format}`);
   if (data.length === 0) {
     return { success: false, error: "No data to export." };
   }

   try {
       let fileContent = '';
       const fileName = `webless_explorer_export_${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`; // Basic filename

       if (format === 'csv') {
           // Basic CSV generation
           const headers = ['Name', 'Address', 'Rating', 'Phone Number', 'Website', 'Has Website'];
           const rows = data.map(b => [
               `"${b.name.replace(/"/g, '""')}"`, // Handle quotes in name
               `"${b.address.replace(/"/g, '""')}"`, // Handle quotes in address
               b.rating,
               b.phoneNumber || '',
               b.website || '',
               b.website ? 'Yes' : 'No'
           ]);
           fileContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
       } else {
           // Placeholder for Excel generation
           // You would typically use a library like 'exceljs' here
           // For now, we'll return an error for Excel as it requires a library
           console.warn("Excel export requires an external library (e.g., exceljs) which is not implemented yet.");
           return { success: false, error: "Excel export is not yet supported in this basic implementation." };
       }

       return { success: true, fileContent, fileName };

   } catch (error: any) {
       console.error(`Error exporting data to ${format}:`, error);
       return { success: false, error: `Failed to export data: ${error.message}` };
   }
}
