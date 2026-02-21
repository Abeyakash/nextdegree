import Link from 'next/link'

const faqs = [
  { q: 'How do I search colleges?', a: 'Use the homepage search bar or filters on the Colleges page.' },
  { q: 'How do I compare colleges?', a: 'Open Compare page and add colleges from cards using Add to Compare.' },
  { q: 'Do I need an account?', a: 'Account is required for favorites and posting reviews.' },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Help Center</h1>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">{faq.q}</h2>
                <p className="text-slate-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/contact" className="text-cyan-700 font-semibold hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
