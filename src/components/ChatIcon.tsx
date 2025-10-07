'use client'

import { MessageSquare } from 'lucide-react'

export const ChatIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-40 hover:shadow-blue-500/50 group"
      aria-label="Open chat"
    >
      <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
      
      {/* Ping animation */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
      
      {/* Notification badge (optional) */}
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        1
      </span>
    </button>
  )
}