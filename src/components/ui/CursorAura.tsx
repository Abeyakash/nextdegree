'use client'

import { useEffect } from 'react'

export default function CursorAura() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches

    if (prefersReducedMotion || !hasFinePointer) return

    const root = document.documentElement
    let raf = 0
    let x = -9999
    let y = -9999

    const update = () => {
      root.style.setProperty('--cursor-x', `${x}px`)
      root.style.setProperty('--cursor-y', `${y}px`)
      raf = 0
    }

    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-aura" aria-hidden="true" />
}
