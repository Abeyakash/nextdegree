'use client'

import { useEffect, useState } from 'react'
import { ChatBot } from '@/components/ChatBot'
import { ChatIcon } from '@/components/ChatIcon'

const OPEN_ASSISTANT_EVENT = 'open-nextdegree-assistant'

export default function GlobalAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const openAssistant = () => setIsOpen(true)
    window.addEventListener(OPEN_ASSISTANT_EVENT, openAssistant)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, openAssistant)
  }, [])

  return (
    <>
      {isOpen && <ChatBot onClose={() => setIsOpen(false)} />}
      {!isOpen && <ChatIcon onClick={() => setIsOpen(true)} />}
    </>
  )
}

export function openGlobalAssistant() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT))
}
