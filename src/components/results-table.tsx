"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Globe, Phone, Star, XCircle } from "lucide-react";
import type { FullBusinessData } from "@/types";

interface ResultsTableProps {
  results: FullBusinessData[];
  itemsPerPage?: number;
}

export function ResultsTable({ results, itemsPerPage = 10 }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (results.length === 0) {
    return <p className="text-muted-foreground mt-4">No businesses found matching your criteria.</p>;
  }


  return (
    <div className="mt-6">
       <div className="rounded-md border shadow-sm">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Website</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {currentResults.map((business) => (
                <TableRow key={business.placeId} className={!business.website ? "bg-red-50 dark:bg-red-900/20" : ""}>
                <TableCell className="font-medium">{business.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{business.address}</TableCell>
                <TableCell className="text-center">
                    {business.rating ? (
                        <Badge variant="secondary" className="inline-flex items-center gap-1">
                           <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {business.rating.toFixed(1)}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                    )}
                </TableCell>
                 <TableCell className="text-muted-foreground text-sm">
                   {business.phoneNumber ? (
                     <span className="inline-flex items-center gap-1"> <Phone className="h-3 w-3" /> {business.phoneNumber}</span>
                   ) : (
                      <span className="text-xs italic">Not Available</span>
                   )}
                 </TableCell>
                <TableCell>
                    {business.website ? (
                        <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-foreground hover:text-primary underline inline-flex items-center gap-1 text-sm"
                        >
                           <Globe className="h-3 w-3" /> Visit
                        </a>
                    ) : (
                        <Badge variant="destructive" className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground">
                            <XCircle className="h-3 w-3"/> Missing
                        </Badge>
                    )}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 space-x-2">
           <Button
             variant="outline"
             size="sm"
             onClick={handlePrevPage}
             disabled={currentPage === 1}
           >
             <ArrowLeft className="mr-1 h-4 w-4" />
             Previous
           </Button>
           <span className="text-sm text-muted-foreground">
             Page {currentPage} of {totalPages}
           </span>
           <Button
             variant="outline"
             size="sm"
             onClick={handleNextPage}
             disabled={currentPage === totalPages}
           >
             Next
             <ArrowRight className="ml-1 h-4 w-4" />
           </Button>
         </div>
      )}
    </div>
  );
}
