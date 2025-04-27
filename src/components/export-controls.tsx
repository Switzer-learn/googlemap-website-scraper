"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FullBusinessData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { exportDataAction } from "@/app/actions"; // Import server action

interface ExportControlsProps {
  data: FullBusinessData[];
  disabled: boolean;
}

export function ExportControls({ data, disabled }: ExportControlsProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async (format: 'csv' | 'excel') => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "There is no data to export.",
      });
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportDataAction(data, format);

      if (result.success && result.fileContent && result.fileName) {
        // Trigger download
        const blob = new Blob([result.fileContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href); // Clean up blob URL

        toast({
          title: "Export Successful",
          description: `Data exported to ${result.fileName}`,
        });
      } else {
        throw new Error(result.error || "Export failed for an unknown reason.");
      }
    } catch (error: any) {
      console.error("Export failed:", error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: error.message || `Could not export data to ${format}.`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={disabled || isExporting || data.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export CSV"}
      </Button>
       {/*
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            disabled={disabled || isExporting || data.length === 0}
            title="Excel export requires an external library (not implemented)"
        >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Excel"}
        </Button>
       */}
        <Button
            variant="outline"
            size="sm"
            disabled={true} // Disable Excel button as it's not implemented
             title="Excel export requires an external library (not implemented)"
        >
            <Download className="mr-2 h-4 w-4" />
            Export Excel (Soon)
        </Button>
    </div>
  );
}
