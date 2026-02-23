'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'global_error_boundary',
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      }),
    }).catch(() => {
      // ignore telemetry errors
    })
  }, [error])

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full rounded-2xl border border-amber-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-zinc-900 mb-3">Something went wrong</h1>
        <p className="text-zinc-600 mb-6">
          We logged this error. Try again, or go back to the homepage.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-black px-5 py-2 text-white font-semibold hover:bg-zinc-800"
          >
            Retry
          </button>
          <Link href="/" className="rounded-md border border-zinc-300 px-5 py-2 font-semibold text-zinc-800 hover:bg-zinc-100">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}
