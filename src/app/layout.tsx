// File: src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/layout/Header';
import { CompareProvider } from '@/lib/compare-context';
// Naya component import karein
import AuthStatus from '@/components/ui/layout/AuthStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextDegree - Find Your Perfect College',
  description: 'Discover the best colleges in Mumbai Metropolitan Region',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <CompareProvider>
          <div className="flex flex-col min-h-screen">
            {/* --- FIX YAHAN HAI --- */}
            {/* Header ko ab AuthStatus component ek prop ke zariye pass kiya ja raha hai */}
            <Header authStatus={<AuthStatus />} />
            <main className="flex-grow">{children}</main>
          </div>
        </CompareProvider>
      </body>
    </html>
  );
}