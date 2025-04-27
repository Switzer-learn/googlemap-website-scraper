"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  query: z.string().min(2, {
    message: "Search query must be at least 2 characters.",
  }),
  radius: z.coerce // Use coerce for automatic string to number conversion
    .number()
    .min(100, { message: "Radius must be at least 100 meters." })
    .max(50000, { message: "Radius cannot exceed 50,000 meters." }),
});

interface SearchFormProps {
  onSearch: (query: string, radius: number) => Promise<void>;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
      radius: 5000, // Default radius
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    try {
       await onSearch(values.query, values.radius);
    } catch (error: any) {
       console.error("Search failed:", error);
       toast({
           variant: "destructive",
           title: "Search Error",
           description: error.message || "Could not perform search.",
       });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
           <FormField
             control={form.control}
             name="query"
             render={({ field }) => (
               <FormItem className="md:col-span-2">
                 <FormLabel>Search Keyword</FormLabel>
                 <FormControl>
                   <Input placeholder="e.g., cafes in Bali" {...field} disabled={loading} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <FormField
             control={form.control}
             name="radius"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Search Radius (meters)</FormLabel>
                 <FormControl>
                   <Input type="number" placeholder="e.g., 5000" {...field} disabled={loading} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
        </div>
        <Button type="submit" disabled={loading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Search className="mr-2 h-4 w-4" />
          {loading ? "Searching..." : "Search Businesses"}
        </Button>
      </form>
    </Form>
  );
}
