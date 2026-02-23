'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { X, Send, Sparkles, TrendingUp, MapPin, DollarSign, Code2, Copy, Check, Mic, Download, Trash2 } from 'lucide-react'
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

type VoiceRecognitionEvent = {
  results?: ArrayLike<ArrayLike<{ transcript?: string }>>
}

type VoiceRecognitionInstance = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: VoiceRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
}

type VoiceRecognitionCtor = new () => VoiceRecognitionInstance

const normalize = (value: string) => value.toLowerCase().trim()

const findCollege = (query: string) => {
  const lower = normalize(query)
  return colleges.find((college) => lower.includes(college.name.toLowerCase()) || lower.includes(college.slug.toLowerCase()))
}

const makeCodeReply = (topic: string): Message => {
  if (topic.includes('api')) {
    return {
      sender: 'bot',
      text: 'Yeh Next.js API route ka simple template hai:',
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
      text: 'Supabase fetch ka compact example:',
      codeSnippet: {
        language: 'ts',
        code: "const supabase = createClient()\nconst { data, error } = await supabase\n  .from('colleges')\n  .select('*')\n  .order('rating', { ascending: false })",
      },
      suggestions: ['API route code', 'Validation code', 'Form submit code'],
    }
  }

  return {
    sender: 'bot',
    text: 'Code help ke liye aap API route, React state, Supabase query, ya form validation puch sakte ho.',
    suggestions: ['API route code', 'Supabase query example', 'Form submit code'],
  }
}

async function askAssistantApi(question: string): Promise<Message | null> {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question }),
    })

    if (!response.ok) return null
    const data = (await response.json()) as { text?: string; suggestions?: string[] }
    if (!data.text) return null

    return {
      sender: 'bot',
      text: data.text,
      suggestions: Array.isArray(data.suggestions) ? data.suggestions.slice(0, 4) : undefined,
    }
  } catch {
    return null
  }
}

export const ChatBot = ({ onClose }: { onClose: () => void }) => {
  const initialMessage: Message = {
    sender: 'bot',
    text: 'Namaste! Main NextDegree assistant hoon. College, coding, career, ya general query kuch bhi pucho.',
    suggestions: ['Top colleges Mumbai', 'Affordable colleges', 'Career guidance', 'API route code'],
  }

  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isListening, setIsListening] = useState(false)
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

  const generateLocalResponse = (rawInput: string): Message | null => {
    const inputLower = normalize(rawInput)

    if (inputLower.includes('code') || inputLower.includes('api') || inputLower.includes('react') || inputLower.includes('supabase')) {
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
        suggestions: [`${mentioned.name} admission process`, `${mentioned.name} placements`, 'Compare with another college'],
      }
    }

    return null
  }

  const generateResponse = async (rawInput: string): Promise<Message> => {
    const local = generateLocalResponse(rawInput)
    if (local) return local

    const remote = await askAssistantApi(rawInput)
    if (remote) return remote

    return {
      sender: 'bot',
      text: 'Main help kar sakta hoon: college details, admission, compare, coding, aur general queries. Please try once more.',
      suggestions: ['Top colleges', 'Admission process', 'Coding help'],
    }
  }

  const sendMessage = async (raw?: string) => {
    const value = (raw ?? input).trim()
    if (!value || isTyping) return

    setMessages((prev) => [...prev, { sender: 'user', text: value }])
    setIsTyping(true)
    setInput('')

    const response = await generateResponse(value)
    setMessages((prev) => [...prev, response])
    setIsTyping(false)
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

  const exportChat = async () => {
    const transcript = messages.map((message) => `${message.sender.toUpperCase()}: ${message.text}`).join('\n\n')
    await navigator.clipboard.writeText(transcript)
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 1200)
  }

  const clearChat = () => {
    setMessages([initialMessage])
    setInput('')
    setIsTyping(false)
  }

  const startVoiceInput = () => {
    const browserWindow = window as unknown as {
      SpeechRecognition?: VoiceRecognitionCtor
      webkitSpeechRecognition?: VoiceRecognitionCtor
    }
    const SpeechRecognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setIsListening(true)

    recognition.onresult = (event: VoiceRecognitionEvent) => {
      const text = event.results?.[0]?.[0]?.transcript ?? ''
      setInput(text)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  return (
    <div className="fixed bottom-5 right-5 w-[24rem] max-w-[calc(100vw-1.5rem)] bg-white border border-amber-200 rounded-2xl shadow-2xl flex flex-col z-50 max-h-[78vh]">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-black to-zinc-800 text-white rounded-t-2xl">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 animate-pulse text-amber-300" />
          <h2 className="font-bold text-lg">NextDegree Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportChat} className="hover:bg-white/20 rounded-full p-1 transition-colors" aria-label="Export chat">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={clearChat} className="hover:bg-white/20 rounded-full p-1 transition-colors" aria-label="Clear chat">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors" aria-label="Close chat">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex gap-2 flex-wrap bg-slate-50">
        {['Top colleges', 'Affordable colleges', 'Career guidance', 'API route code'].map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => void sendMessage(topic)}
            className="text-xs px-2.5 py-1 rounded-full bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"
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
                    ? 'bg-gradient-to-r from-black to-zinc-800 text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line text-sm leading-6">{message.text}</p>
              </div>
            </div>

            {message.collegeCard && (
              <div className="mt-3 ml-2 bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-base text-zinc-900 mb-2">{message.collegeCard.name}</h3>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-amber-700" />{message.collegeCard.location}</div>
                  <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-zinc-700" />Rs. {message.collegeCard.fees.toLocaleString()}/year</div>
                  <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-zinc-700" />Rating: {message.collegeCard.rating}/5</div>
                </div>
                <Link href={`/colleges/${message.collegeCard.slug}`} className="mt-3 block text-center w-full bg-black text-white py-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium">
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
                    onClick={() => void copyCode(i, message.codeSnippet!.code)}
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
                    onClick={() => void sendMessage(suggestion)}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs hover:bg-amber-100 transition-colors border border-amber-200 font-medium"
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
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') void sendMessage()
          }}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-600 transition-colors"
          placeholder="Ask anything..."
        />
        <button
          onClick={startVoiceInput}
          className={`ml-2 p-3 rounded-xl transition-all ${isListening ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
          aria-label="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={() => void sendMessage()}
          className="ml-2 bg-gradient-to-r from-black to-zinc-800 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
