'use client'

import { MessageSquare } from 'lucide-react'

export const ChatIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-br from-black to-zinc-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-40 hover:shadow-zinc-500/50 group"
      aria-label="Open chat"
    >
      <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />

      <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-50 animate-ping"></span>

      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-900 border border-slate-300">
        AI
      </span>
    </button>
  )
}
