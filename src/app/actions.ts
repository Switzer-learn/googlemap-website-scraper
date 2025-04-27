
"use server";

import type { FullBusinessData } from '@/types';
import { searchBusinesses, getBusinessDetails } from '@/services/google-maps';
import ExcelJS from 'exceljs';

// TODO: Import Firestore functions when implemented


export interface SearchState {
  results: FullBusinessData[];
  loading: boolean;
  error: string | null;
  isFiltered: boolean; // Add flag to indicate if filter is applied
  dashboard: {
    total: number; // Total found *before* filtering
    withWebsite: number; // Count *after* filtering
    withoutWebsite: number; // Count *after* filtering
  };
}

// Placeholder for Firestore caching logic
// Note: Caching logic might need adjustment based on the filter
async function getCachedResults(query: string, radius: number, onlyNoWebsite: boolean): Promise<FullBusinessData[] | null> {
  console.log(`Checking cache for query: "${query}", radius: ${radius}, onlyNoWebsite: ${onlyNoWebsite}`);
  // TODO: Implement Firestore cache check, potentially storing filtered/unfiltered results separately
  // For now, cache is ignored if filter is active
  if (onlyNoWebsite) return null;
  return null; // Assume cache miss for now
}

async function cacheResults(query: string, radius: number, results: FullBusinessData[], onlyNoWebsite: boolean): Promise<void> {
  // Avoid caching filtered results for now to keep it simple
   if (onlyNoWebsite) {
     console.log("Skipping cache for filtered results.");
     return;
   }
  console.log(`Caching ${results.length} results for query: "${query}", radius: ${radius}`);
  // TODO: Implement Firestore cache write
}


export async function searchBusinessesAction(
  query: string,
  radius: number,
  onlyNoWebsite: boolean // Add the filter parameter
): Promise<SearchState> {
  const initialState: SearchState = {
    results: [],
    loading: false,
    error: null,
    isFiltered: onlyNoWebsite,
    dashboard: { total: 0, withWebsite: 0, withoutWebsite: 0 },
  };

  try {
    console.log(`Searching for: "${query}" within ${radius}m radius. Filter active: ${onlyNoWebsite}`);

    // 1. Check Cache (Placeholder - adapted for filter)
    const cachedData = await getCachedResults(query, radius, onlyNoWebsite);
    if (cachedData) {
       console.log("Returning cached results");
       // Recalculate dashboard for cached data
       const total = cachedData.length;
       const withoutWebsite = cachedData.filter(b => !b.website).length;
       const withWebsite = total - withoutWebsite;
       return {
         ...initialState,
         results: cachedData,
         isFiltered: false, // Cache is currently only for unfiltered
         dashboard: { total, withWebsite, withoutWebsite },
       };
    }

    // 2. Call Google Maps API
    const searchResults = await searchBusinesses(query, radius);
    console.log(`Found ${searchResults.length} initial results.`);
    if (searchResults.length === 0) {
        return initialState; // No results found
    }


    // 3. Fetch Details for each result
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

    const totalFound = detailedResults.length; // Total before filtering

    // 4. Apply Filter if requested
    const finalResults = onlyNoWebsite
      ? detailedResults.filter(b => !b.website)
      : detailedResults;

    console.log(`Results after filtering (if any): ${finalResults.length}`);


    // 5. Update Dashboard Stats based on *final* results
    const withoutWebsiteCount = finalResults.filter(b => !b.website).length;
    const withWebsiteCount = finalResults.length - withoutWebsiteCount;


    // 6. Cache Results (Placeholder - adapted for filter)
    // Only cache unfiltered results for simplicity for now
    if (!onlyNoWebsite) {
        await cacheResults(query, radius, detailedResults, onlyNoWebsite);
    }

    return {
      ...initialState,
      results: finalResults,
      isFiltered: onlyNoWebsite,
      dashboard: {
          total: totalFound, // Show total found before filter
          withWebsite: withWebsiteCount, // Show count *after* filter
          withoutWebsite: withoutWebsiteCount // Show count *after* filter
       },
    };
  } catch (error: any) {
    console.error("Error during business search:", error);
    return {
      ...initialState,
      error: error.message || "An unexpected error occurred during search.",
    };
  }
}

export async function exportDataAction(data: FullBusinessData[], format: 'csv' | 'excel'): Promise<{ success: boolean; error?: string, fileContent?: string | Buffer, fileName?: string, mimeType?: string }> {
   console.log(`Exporting ${data.length} records to ${format}`);
   if (data.length === 0) {
     return { success: false, error: "No data to export." };
   }

   const fileName = `webless_explorer_export_${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`; // Basic filename
   const headers = ['Name', 'Address', 'Rating', 'Phone Number', 'Website', 'Has Website'];


   try {
       if (format === 'csv') {
           // Basic CSV generation
           const rows = data.map(b => [
               `"${b.name.replace(/"/g, '""')}"`, // Handle quotes in name
               `"${b.address.replace(/"/g, '""')}"`, // Handle quotes in address
               b.rating ? b.rating.toFixed(1) : 'N/A',
               b.phoneNumber || '',
               b.website || '',
               b.website ? 'Yes' : 'No'
           ]);
           const fileContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
           return { success: true, fileContent, fileName, mimeType: 'text/csv' };

       } else if (format === 'excel') {
            // Excel generation using exceljs
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Businesses');

            // Add header row
            worksheet.addRow(headers);

            // Style header row (optional)
             worksheet.getRow(1).font = { bold: true };
             worksheet.getRow(1).fill = {
               type: 'pattern',
               pattern:'solid',
               fgColor:{argb:'FFDDDDDD'} // Light gray fill
             };
             worksheet.getRow(1).border = {
                bottom: { style: 'thin' }
             };


            // Add data rows
            data.forEach(b => {
                worksheet.addRow([
                    b.name,
                    b.address,
                    b.rating ? b.rating.toFixed(1) : 'N/A',
                    b.phoneNumber || '',
                    b.website || '',
                    b.website ? 'Yes' : 'No'
                ]);
                 // Highlight rows without website (optional)
                 if (!b.website) {
                    const lastRow = worksheet.lastRow;
                    if (lastRow) {
                         lastRow.fill = {
                           type: 'pattern',
                           pattern: 'solid',
                           fgColor: { argb: 'FFFFE0E0' } // Light red fill
                         };
                    }
                 }
            });

             // Adjust column widths (optional)
            worksheet.columns.forEach((column, i) => {
                let maxLength = 0;
                 column.eachCell?.({ includeEmpty: true }, (cell) => {
                    let columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                 });
                 column.width = maxLength < 10 ? 10 : maxLength + 2; // Base width 10, add padding
                 if (i === 1) column.width = Math.min(maxLength + 2, 50); // Limit address width
                 if (i === 2) column.width = 10; // Rating width
                 if (i === 5) column.width = 15; // Has Website width
            });


            // Generate buffer
            const buffer = await workbook.xlsx.writeBuffer();
             return { success: true, fileContent: buffer, fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
       } else {
            return { success: false, error: "Unsupported export format." };
       }

   } catch (error: any) {
       console.error(`Error exporting data to ${format}:`, error);
       return { success: false, error: `Failed to export data: ${error.message}` };
   }
}
