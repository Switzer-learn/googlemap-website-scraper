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
  dashboard: { total: 0, withWebsite: 0, withoutWebsite: 0 },
};

export default function Home() {
  const [searchState, setSearchState] = React.useState<SearchState>(initialSearchState);
  const { toast } = useToast();

  const handleSearch = async (query: string, radius: number) => {
    setSearchState((prevState) => ({ ...prevState, loading: true, error: null }));
    const newState = await searchBusinessesAction(query, radius);
    setSearchState(newState);

    if (newState.error) {
       toast({
         variant: "destructive",
         title: "Search Error",
         description: newState.error,
       });
    } else if (newState.results.length > 0) {
        toast({
         title: "Search Complete",
         description: `Found ${newState.dashboard.total} businesses.`,
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
           {searchState.results.length > 0 && <ExportControls data={searchState.results} disabled={searchState.loading}/>}
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
