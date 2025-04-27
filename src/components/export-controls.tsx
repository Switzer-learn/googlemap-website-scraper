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
  const [isExportingCsv, setIsExportingCsv] = React.useState(false);
  const [isExportingExcel, setIsExportingExcel] = React.useState(false);

  const handleExport = async (format: 'csv' | 'excel') => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "There is no data to export.",
      });
      return;
    }

    if (format === 'csv') setIsExportingCsv(true);
    if (format === 'excel') setIsExportingExcel(true);

    try {
      const result = await exportDataAction(data, format);

      if (result.success && result.fileContent && result.fileName && result.mimeType) {
        // Trigger download
        const blob = new Blob([result.fileContent], { type: result.mimeType });
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
        throw new Error(result.error || `Export to ${format} failed for an unknown reason.`);
      }
    } catch (error: any) {
      console.error(`Export to ${format} failed:`, error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: error.message || `Could not export data to ${format}.`,
      });
    } finally {
       if (format === 'csv') setIsExportingCsv(false);
       if (format === 'excel') setIsExportingExcel(false);
    }
  };

   const isExporting = isExportingCsv || isExportingExcel;

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={disabled || isExporting || data.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        {isExportingCsv ? "Exporting..." : "Export CSV"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={disabled || isExporting || data.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        {isExportingExcel ? "Exporting..." : "Export Excel"}
      </Button>
    </div>
  );
}
