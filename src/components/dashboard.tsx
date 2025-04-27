import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, HelpCircle, XCircle } from "lucide-react";

interface DashboardProps {
  total: number;
  withWebsite: number;
  withoutWebsite: number;
}

export function Dashboard({ total, withWebsite, withoutWebsite }: DashboardProps) {
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
             Total entries from the latest search
           </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Website</CardTitle>
           <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withWebsite}</div>
           <p className="text-xs text-muted-foreground">
            {total > 0 ? `${((withWebsite / total) * 100).toFixed(1)}%` : '0%'} have a listed website
           </p>
        </CardContent>
      </Card>
      <Card className="border-destructive bg-destructive/10 dark:bg-destructive/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive dark:text-red-400">Without Website</CardTitle>
          <XCircle className="h-4 w-4 text-destructive dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive dark:text-red-400">{withoutWebsite}</div>
           <p className="text-xs text-muted-foreground dark:text-red-400/80">
            {total > 0 ? `${((withoutWebsite / total) * 100).toFixed(1)}%` : '0%'} are missing a website
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
