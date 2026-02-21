'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { X, Send, Sparkles, TrendingUp, MapPin, DollarSign, Code2, Copy, Check } from 'lucide-react'
import { colleges } from '@/data/colleges'

interface CollegeCard {
  name: string
  location: string
  fees: number
  rating: number
  slug: string
}

type Message = {
  sender: 'user' | 'bot'
  text: string
  suggestions?: string[]
  collegeCard?: CollegeCard
  codeSnippet?: { language: string; code: string }
}

const normalize = (value: string) => value.toLowerCase().trim()

const findCollege = (query: string) => {
  const lower = normalize(query)
  return colleges.find(
    (college) =>
      lower.includes(college.name.toLowerCase()) ||
      lower.includes(college.slug.toLowerCase())
  )
}

const makeCodeReply = (topic: string): Message => {
  if (topic.includes('api')) {
    return {
      sender: 'bot',
      text: 'Yeh Next.js API route ka simple template hai. Isme GET handler ready hai:',
      codeSnippet: {
        language: 'ts',
        code: "import { NextResponse } from 'next/server'\n\nexport async function GET() {\n  return NextResponse.json({ ok: true, message: 'API working' })\n}",
      },
      suggestions: ['React state example', 'Supabase query example', 'Form submit code'],
    }
  }

  if (topic.includes('supabase')) {
    return {
      sender: 'bot',
      text: 'Supabase se records fetch karne ka compact example:',
      codeSnippet: {
        language: 'ts',
        code: "const supabase = createClient()\nconst { data, error } = await supabase\n  .from('colleges')\n  .select('*')\n  .order('rating', { ascending: false })\n\nif (error) console.error(error)",
      },
      suggestions: ['API route code', 'React state example', 'Validation code'],
    }
  }

  if (topic.includes('form')) {
    return {
      sender: 'bot',
      text: 'Form submit ka clean React pattern:',
      codeSnippet: {
        language: 'tsx',
        code: "const [loading, setLoading] = useState(false)\n\nconst handleSubmit = async (e: React.FormEvent) => {\n  e.preventDefault()\n  setLoading(true)\n  try {\n    // call API/server action\n  } finally {\n    setLoading(false)\n  }\n}",
      },
      suggestions: ['Validation code', 'API route code', 'Supabase query example'],
    }
  }

  return {
    sender: 'bot',
    text: 'Code help ke liye aap yeh puch sakte ho: API route, React state, Supabase query, form validation.',
    suggestions: ['API route code', 'Supabase query example', 'Form submit code'],
  }
}

export const ChatBot = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! Main NextDegree assistant hoon. College info, compare, fees, ratings aur coding help dono de sakta hoon.',
      suggestions: [
        'Best colleges Mumbai',
        'Affordable colleges',
        'HR College details',
        'API route code',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [onClose])

  const generateResponse = (rawInput: string): Message => {
    const inputLower = normalize(rawInput)

    if (
      inputLower.includes('code') ||
      inputLower.includes('api') ||
      inputLower.includes('react') ||
      inputLower.includes('supabase') ||
      inputLower.includes('form')
    ) {
      return makeCodeReply(inputLower)
    }

    const compareMatch = rawInput.match(/(.+)\s+vs\s+(.+)/i)
    if (compareMatch) {
      const first = findCollege(compareMatch[1])
      const second = findCollege(compareMatch[2])

      if (first && second) {
        return {
          sender: 'bot',
          text:
            `${first.name} vs ${second.name}\n\n` +
            `Rating: ${first.rating} vs ${second.rating}\n` +
            `Fees: Rs. ${first.fees.toLocaleString()} vs Rs. ${second.fees.toLocaleString()}\n` +
            `Location: ${first.location} vs ${second.location}`,
          suggestions: [first.name, second.name, 'Top rated colleges'],
        }
      }
    }

    const mentioned = findCollege(rawInput)
    if (mentioned) {
      return {
        sender: 'bot',
        text: `Yeh rahi ${mentioned.name} ki quick profile:`,
        collegeCard: mentioned,
        suggestions: [
          `${mentioned.name} admission process`,
          `${mentioned.name} placements`,
          'Compare with another college',
        ],
      }
    }

    if (inputLower.includes('best') || inputLower.includes('top')) {
      const top = [...colleges].sort((a, b) => b.rating - a.rating).slice(0, 3)
      return {
        sender: 'bot',
        text: top.map((c, i) => `${i + 1}. ${c.name} - ${c.rating}/5`).join('\n'),
        suggestions: top.map((c) => c.name),
      }
    }

    if (inputLower.includes('cheap') || inputLower.includes('affordable') || inputLower.includes('sasta')) {
      const lowest = [...colleges].sort((a, b) => a.fees - b.fees).slice(0, 3)
      return {
        sender: 'bot',
        text: lowest.map((c, i) => `${i + 1}. ${c.name} - Rs. ${c.fees.toLocaleString()}/year`).join('\n'),
        suggestions: lowest.map((c) => c.name),
      }
    }

    if (inputLower.includes('admission') || inputLower.includes('apply')) {
      return {
        sender: 'bot',
        text:
          'Typical flow: form fill -> document upload -> merit list -> fee payment -> confirmation. College specific process chahiye to college ka naam bhejo.',
        suggestions: ['HR College admission', 'Jai Hind admission', 'Top colleges Mumbai'],
      }
    }

    if (inputLower.includes('placement') || inputLower.includes('job')) {
      const top = [...colleges].sort((a, b) => b.rating - a.rating).slice(0, 3)
      return {
        sender: 'bot',
        text: `Placement focus ke liye yeh 3 dekh sakte ho:\n${top.map((c) => `- ${c.name}`).join('\n')}`,
        suggestions: top.map((c) => c.name),
      }
    }

    if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey')) {
      return {
        sender: 'bot',
        text: 'Hello! Aap college recommendation chahte ho ya coding help?',
        suggestions: ['Top colleges', 'Affordable colleges', 'API route code'],
      }
    }

    return {
      sender: 'bot',
      text: 'Main help kar sakta hoon: college details, compare, admissions, placements, aur code snippets.',
      suggestions: ['Top colleges', 'Compare colleges', 'Supabase query example'],
    }
  }

  const sendMessage = (raw?: string) => {
    const value = (raw ?? input).trim()
    if (!value) return

    setMessages((prev) => [...prev, { sender: 'user', text: value }])
    setIsTyping(true)
    setInput('')

    setTimeout(() => {
      const response = generateResponse(value)
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 500)
  }

  const copyCode = async (index: number, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1300)
    } catch {
      setCopiedIndex(null)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 w-[24rem] max-w-[calc(100vw-1.5rem)] bg-white border border-blue-200 rounded-2xl shadow-2xl flex flex-col z-50 max-h-[78vh]">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-900 to-blue-800 text-white rounded-t-2xl">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          <h2 className="font-bold text-lg">NextDegree Assistant</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors" aria-label="Close chat">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex gap-2 flex-wrap bg-slate-50">
        {['Top colleges', 'Affordable colleges', 'Compare colleges', 'API route code'].map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => sendMessage(topic)}
            className="text-xs px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((message, i) => (
          <div key={`${message.sender}-${i}`}>
            <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl max-w-[84%] shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line text-sm leading-6">{message.text}</p>
              </div>
            </div>

            {message.collegeCard && (
              <div className="mt-3 ml-2 bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-base text-blue-700 mb-2">{message.collegeCard.name}</h3>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" />{message.collegeCard.location}</div>
                  <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-emerald-600" />Rs. {message.collegeCard.fees.toLocaleString()}/year</div>
                  <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-purple-600" />Rating: {message.collegeCard.rating}/5</div>
                </div>
                <Link
                  href={`/colleges/${message.collegeCard.slug}`}
                  className="mt-3 block text-center w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                  View Full Details
                </Link>
              </div>
            )}

            {message.codeSnippet && (
              <div className="mt-3 ml-2 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-sm">
                <div className="px-3 py-2 border-b border-slate-700 flex justify-between items-center text-xs">
                  <div className="inline-flex items-center gap-2"><Code2 className="w-4 h-4" /> {message.codeSnippet.language}</div>
                  <button
                    type="button"
                    onClick={() => copyCode(i, message.codeSnippet!.code)}
                    className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
                  >
                    {copiedIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === i ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-3 text-xs overflow-x-auto"><code>{message.codeSnippet.code}</code></pre>
              </div>
            )}

            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 ml-2 flex flex-wrap gap-2">
                {message.suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion}-${i}`}
                    onClick={() => sendMessage(suggestion)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="flex p-3 border-t border-gray-200 bg-white rounded-b-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Ask about colleges or code snippets..."
        />
        <button
          onClick={() => sendMessage()}
          className="ml-2 bg-gradient-to-r from-blue-700 to-slate-800 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
