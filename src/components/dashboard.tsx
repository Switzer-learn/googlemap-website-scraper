import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, XCircle } from "lucide-react";

interface DashboardProps {
  total: number; // Total found *before* filtering
  withWebsite: number; // Count in the *displayed* results
  withoutWebsite: number; // Count in the *displayed* results
}

export function Dashboard({ total, withWebsite, withoutWebsite }: DashboardProps) {
   const displayedTotal = withWebsite + withoutWebsite; // Total currently displayed in the table

  return (
    <div className="grid gap-4 md:grid-cols-3 mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Businesses Found</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
           <p className="text-xs text-muted-foreground">
             Total entries initially found by search
           </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Website (Displayed)</CardTitle>
           <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withWebsite}</div>
           <p className="text-xs text-muted-foreground">
            {displayedTotal > 0 ? `${((withWebsite / displayedTotal) * 100).toFixed(1)}%` : '0%'} of displayed results
           </p>
        </CardContent>
      </Card>
      <Card className={withoutWebsite > 0 ? "border-destructive bg-destructive/10 dark:bg-destructive/20" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${withoutWebsite > 0 ? 'text-destructive dark:text-red-400' : ''}`}>Without Website (Displayed)</CardTitle>
          <XCircle className={`h-4 w-4 ${withoutWebsite > 0 ? 'text-destructive dark:text-red-400' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${withoutWebsite > 0 ? 'text-destructive dark:text-red-400' : ''}`}>{withoutWebsite}</div>
           <p className={`text-xs ${withoutWebsite > 0 ? 'text-muted-foreground dark:text-red-400/80' : 'text-muted-foreground'}`}>
            {displayedTotal > 0 ? `${((withoutWebsite / displayedTotal) * 100).toFixed(1)}%` : '0%'} of displayed results
           </p>
        </CardContent>
      </Card>
       {/* Optional: Placeholder for API Usage - Requires implementation */}
       {/* <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">API Usage (Placeholder)</CardTitle>
           <HelpCircle className="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              API usage tracking not implemented
            </p>
         </CardContent>
       </Card> */}
    </div>
  );
}
