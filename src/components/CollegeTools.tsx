'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, Check, Bookmark, BookmarkCheck, MessageCircle } from 'lucide-react'

interface CollegeToolsProps {
  collegeName: string
  slug: string
  annualFees: number
  admissionUrl: string
}

const CHECKLIST_ITEMS = [
  'Check eligibility criteria',
  'Keep documents ready',
  'Fill online form',
  'Track merit list',
  'Complete fee payment',
]

export default function CollegeTools({ collegeName, slug, annualFees, admissionUrl }: CollegeToolsProps) {
  const [duration, setDuration] = useState(12)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [checklist, setChecklist] = useState<boolean[]>(Array(CHECKLIST_ITEMS.length).fill(false))

  useEffect(() => {
    try {
      const shortlist = JSON.parse(localStorage.getItem('shortlist-colleges') ?? '[]') as string[]
      const nextSaved = shortlist.includes(slug)

      const storedChecklist = JSON.parse(localStorage.getItem(`checklist-${slug}`) ?? 'null')
      const nextChecklist =
        Array.isArray(storedChecklist) && storedChecklist.length === CHECKLIST_ITEMS.length
          ? storedChecklist.map(Boolean)
          : null

      requestAnimationFrame(() => {
        setSaved(nextSaved)
        if (nextChecklist) setChecklist(nextChecklist)
      })
    } catch {
      requestAnimationFrame(() => setSaved(false))
    }
  }, [slug])

  const monthlyEstimate = useMemo(() => Math.ceil(annualFees / duration), [annualFees, duration])
  const progress = useMemo(() => Math.round((checklist.filter(Boolean).length / CHECKLIST_ITEMS.length) * 100), [checklist])

  const toggleSave = () => {
    try {
      const shortlist = JSON.parse(localStorage.getItem('shortlist-colleges') ?? '[]') as string[]
      const next = saved ? shortlist.filter((id) => id !== slug) : Array.from(new Set([...shortlist, slug]))
      localStorage.setItem('shortlist-colleges', JSON.stringify(next))
      setSaved(!saved)
    } catch {
      setSaved(!saved)
    }
  }

  const toggleChecklist = (index: number) => {
    const next = checklist.map((item, i) => (i === index ? !item : item))
    setChecklist(next)
    localStorage.setItem(`checklist-${slug}`, JSON.stringify(next))
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(admissionUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Hi, I want admission details for ${collegeName}.`)}` 

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
        <h3 className="text-lg font-bold text-zinc-900 mb-3">Fee Planner</h3>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full rounded-md border border-zinc-300 p-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
        <p className="text-sm text-zinc-600">Estimated monthly budget</p>
        <p className="text-2xl font-bold text-amber-700">Rs. {monthlyEstimate.toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-zinc-900">Admission Toolkit</h3>
          <button
            type="button"
            onClick={toggleSave}
            className="inline-flex items-center gap-1 text-sm rounded-full border border-zinc-300 px-3 py-1 hover:bg-zinc-100"
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-amber-700" /> : <Bookmark className="h-4 w-4" />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={copyLink}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-black text-white py-2 text-sm hover:bg-zinc-800"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-amber-600 text-amber-700 py-2 text-sm hover:bg-amber-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
        <p className="text-xs text-zinc-500">Progress: {progress}% complete</p>
        <div className="mt-1 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-2 rounded-full bg-amber-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 space-y-2">
          {CHECKLIST_ITEMS.map((item, index) => (
            <label key={item} className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={checklist[index]}
                onChange={() => toggleChecklist(index)}
                className="accent-amber-700"
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
