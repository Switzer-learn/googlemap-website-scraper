import type { Metadata } from 'next';
import { Geist_Sans } from 'next/font/google'; // Correct import for Geist Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const geist = Geist_Sans({
  variable: '--font-sans', // Use --font-sans as recommended
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'Webless Explorer',
  description: 'Find businesses lacking websites with Google Maps',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}> {/* Apply font variable */}
        {children}
        <Toaster /> {/* Render the Toaster component */}
      </body>
    </html>
  );
}
