export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-white px-6 py-4 shadow-sm">
        <span className="h-3 w-3 rounded-full bg-cyan-600 animate-pulse" />
        <span className="text-slate-700 font-medium">Loading...</span>
      </div>
    </div>
  )
}
