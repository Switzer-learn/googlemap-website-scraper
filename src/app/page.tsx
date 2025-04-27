"use client";

import * as React from "react";
import { SearchForm } from "@/components/search-form";
import { ResultsTable } from "@/components/results-table";
import { Dashboard } from "@/components/dashboard";
import { ExportControls } from "@/components/export-controls";
import { searchBusinessesAction, type SearchState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const initialSearchState: SearchState = {
  results: [],
  loading: false,
  error: null,
  isFiltered: false, // Add a flag to track if results are filtered
  dashboard: { total: 0, withWebsite: 0, withoutWebsite: 0 },
};

export default function Home() {
  const [searchState, setSearchState] = React.useState<SearchState>(initialSearchState);
  const { toast } = useToast();

  // Update handleSearch signature to accept the new filter parameter
  const handleSearch = async (query: string, radius: number, onlyNoWebsite: boolean) => {
    setSearchState((prevState) => ({ ...prevState, loading: true, error: null, isFiltered: onlyNoWebsite })); // Set isFiltered flag
    // Pass the filter value to the server action
    const newState = await searchBusinessesAction(query, radius, onlyNoWebsite);
    setSearchState(newState);

    if (newState.error) {
       toast({
         variant: "destructive",
         title: "Search Error",
         description: newState.error,
       });
    } else if (newState.results.length > 0) {
        const filteredMessage = newState.isFiltered ? " (showing only businesses without websites)" : "";
        toast({
         title: "Search Complete",
         description: `Found ${newState.dashboard.total} businesses${filteredMessage}.`,
       });
    } else {
         toast({
          variant: "default",
         title: "Search Complete",
         description: "No businesses found matching your criteria.",
       });
    }
  };


  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Webless Explorer</h1>
        <p className="text-muted-foreground">
          Discover businesses on Google Maps and identify those missing a website.
        </p>
      </header>

      <SearchForm onSearch={handleSearch} loading={searchState.loading} />

      {/* Show Dashboard and Export only when there are results or loading */}
       {(searchState.loading || searchState.results.length > 0 || searchState.error) && (
         <>
           <Separator className="my-6" />
           <Dashboard {...searchState.dashboard} />
           {searchState.results.length > 0 && (
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <ExportControls data={searchState.results} disabled={searchState.loading}/>
                {searchState.isFiltered && (
                    <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                        Results are filtered to show only businesses without websites.
                    </p>
                )}
             </div>
           )}
           <ResultsTable results={searchState.results} />
         </>
       )}

       {searchState.loading && (
        <div className="mt-6 text-center text-muted-foreground">
            Loading results...
        </div>
       )}

    </main>
  );
}
