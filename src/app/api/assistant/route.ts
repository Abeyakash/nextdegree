import { NextResponse } from 'next/server'
import { colleges } from '@/data/colleges'

type AssistantRequest = {
  message?: string
}

type AssistantResult = {
  text: string
  suggestions?: string[]
}

const normalize = (value: string) => value.toLowerCase().trim()

const localAssistant = (rawMessage: string): AssistantResult => {
  const message = normalize(rawMessage)

  if (!message) {
    return {
      text: 'Type your question and I will help with college, admissions, comparison, coding, or general guidance.',
      suggestions: ['Top colleges in Mumbai', 'Admission process', 'Compare HR vs Jai Hind'],
    }
  }

  if (message.includes('top') || message.includes('best')) {
    const top = [...colleges].sort((a, b) => b.rating - a.rating).slice(0, 5)
    return {
      text: `Top picks right now:\n${top.map((college, index) => `${index + 1}. ${college.name} (${college.rating}/5)`).join('\n')}`,
      suggestions: ['Affordable colleges', 'Commerce colleges', 'Compare colleges'],
    }
  }

  if (message.includes('affordable') || message.includes('cheap') || message.includes('fees')) {
    const lowFee = [...colleges].sort((a, b) => a.fees - b.fees).slice(0, 5)
    return {
      text: `Budget-friendly options:\n${lowFee.map((college, index) => `${index + 1}. ${college.name} - Rs. ${college.fees.toLocaleString()}/year`).join('\n')}`,
      suggestions: ['Top rated colleges', 'Science colleges', 'Admission checklist'],
    }
  }

  if (message.includes('admission') || message.includes('apply')) {
    return {
      text: 'Admission flow is usually: registration, document upload, merit list, fee payment, and seat confirmation. Tell me a college name for exact guidance.',
      suggestions: ['HR College admission', 'Mithibai admission', 'Documents required'],
    }
  }

  const match = colleges.find(
    (college) =>
      message.includes(college.name.toLowerCase()) ||
      message.includes(college.slug.toLowerCase())
  )

  if (match) {
    return {
      text:
        `${match.name}\n` +
        `Location: ${match.location}\n` +
        `Rating: ${match.rating}/5\n` +
        `Fees: Rs. ${match.fees.toLocaleString()}/year\n` +
        `Popular courses: ${match.courses.join(', ')}`,
      suggestions: [`${match.name} admission`, `${match.name} placements`, 'Compare colleges'],
    }
  }

  return {
    text: 'I can help with colleges, admissions, course choices, fee comparisons, coding snippets, and general questions. Ask anything.',
    suggestions: ['Top colleges', 'Career advice after 12th', 'Build a Next.js API route'],
  }
}

async function openAiAssistant(message: string): Promise<AssistantResult | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You are NextDegree assistant. Reply clearly in Hinglish (roman script), concise and useful. Handle any user query: college guidance, coding, productivity, and general knowledge. If uncertain, say so.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.4,
      }),
      cache: 'no-store',
    })

    if (!response.ok) return null
    const json = (await response.json()) as { output_text?: string }
    const text = json.output_text?.trim()
    if (!text) return null

    return {
      text,
      suggestions: ['Ask follow-up', 'College compare', 'Coding help'],
    }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequest
    const message = String(body.message ?? '').trim()
    if (!message) {
      return NextResponse.json({ text: 'Please type a message first.' }, { status: 400 })
    }

    const ai = await openAiAssistant(message)
    if (ai) return NextResponse.json(ai)

    return NextResponse.json(localAssistant(message))
  } catch {
    return NextResponse.json(
      { text: 'Assistant is temporarily unavailable. Please try again.', suggestions: ['Try again'] },
      { status: 500 }
    )
  }
}
