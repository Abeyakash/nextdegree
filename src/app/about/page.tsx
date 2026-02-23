import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-100 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About NextDegree</h1>
          <p className="text-slate-600 text-lg mb-6">
            NextDegree helps students discover colleges, compare options, and shortlist the best fit by courses, fees, ratings, and reviews.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-2xl font-bold text-amber-800">35+</p>
              <p className="text-slate-600">Colleges tracked</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-2xl font-bold text-emerald-800">50+</p>
              <p className="text-slate-600">Courses mapped</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-4">
              <p className="text-2xl font-bold text-sky-800">1000+</p>
              <p className="text-slate-600">Students supported</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/colleges" className="text-amber-700 font-semibold hover:underline">
              Explore Colleges
            </Link>
            <Link href="/compare" className="text-amber-700 font-semibold hover:underline">
              Compare Colleges
            </Link>
            <Link href="/contact" className="text-amber-700 font-semibold hover:underline">
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
