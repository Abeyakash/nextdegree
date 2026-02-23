import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/layout/Header';
import { CompareProvider } from '@/lib/compare-context';
import AuthStatus from '@/components/ui/layout/AuthStatus';
import CursorAura from '@/components/ui/CursorAura';

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
        <CursorAura />
        <CompareProvider>
          <div className="flex flex-col min-h-screen">
            <Header authStatus={<AuthStatus />} />
            <main className="flex-grow">{children}</main>
          </div>
        </CompareProvider>
      </body>
    </html>
  );
}
