import type { Metadata } from 'next';
// Use a standard Google Font like Inter instead of Geist_Sans
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

// Initialize Inter font
const inter = Inter({
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
      {/* Apply the Inter font variable */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Render the Toaster component */}
      </body>
    </html>
  );
}
