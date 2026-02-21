export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact</h1>
          <p className="text-slate-600 mb-8">Need help with admissions, filters, or account issues? Reach out below.</p>
          <div className="space-y-3 text-slate-700">
            <p><span className="font-semibold">Email:</span> support@nextdegree.com</p>
            <p><span className="font-semibold">Location:</span> Mumbai, Maharashtra</p>
            <p><span className="font-semibold">Support Hours:</span> Mon-Sat, 10:00 AM to 7:00 PM</p>
          </div>
        </div>
      </div>
    </main>
  )
}
