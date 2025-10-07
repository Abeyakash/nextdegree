import type { Metadata, Viewport } from 'next' // 1. Viewport is imported here
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/layout/Header'
import { CompareProvider } from '@/lib/compare-context'

const inter = Inter({ subsets: ['latin'] })

// 2. The viewport key has been removed from here
export const metadata: Metadata = {
  title: 'NextDegree - Find Your Perfect College',
  description: 'Discover the best colleges in Mumbai Metropolitan Region',
}

// 3. Viewport is now its own separate export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <CompareProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            {/* You can add a Footer component here later */}
          </div>
        </CompareProvider>
      </body>
    </html>
  )
}