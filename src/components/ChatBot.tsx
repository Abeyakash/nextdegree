'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, TrendingUp, MapPin, DollarSign } from 'lucide-react'
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
}

export const ChatBot = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Namaste! 🙏 Main aapka college guide hun. Puchiye kuch bhi - college fees, courses, admission details. Hinglish ya English, dono chalega! 😎",
      suggestions: [
        "Best engineering colleges",
        "Cheapest colleges Mumbai mein",
        "HR College ke baare mein batao",
        "Top rated colleges"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ESC key to close chatbot
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Smart AI Response Generator
  const generateResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    // 1. Search for specific college
    const mentionedCollege = colleges.find(c => 
      input.includes(c.name.toLowerCase()) || 
      input.includes(c.slug)
    )

    if (mentionedCollege) {
      return {
        sender: 'bot',
        text: `${mentionedCollege.name} ke baare mein bata raha hun! 🎓`,
        collegeCard: mentionedCollege,
        suggestions: [
          "Admission process kya hai?",
          "Placement kaise hain?",
          "Dusre colleges compare karo",
          "Location kahan hai?"
        ]
      }
    }

    // 2. Best/Top colleges query
    if (input.includes('best') || input.includes('top') || input.includes('acche')) {
      const topColleges = colleges.slice(0, 3)
      return {
        sender: 'bot',
        text: `Boss, top 3 colleges yeh hain Mumbai mein:\n\n${topColleges.map((c, i) => 
          `${i + 1}. ${c.name} - ${c.rating}⭐ rating (${c.location})`
        ).join('\n')}\n\nKaunsa detail se janana chahoge? 🤔`,
        suggestions: topColleges.map(c => c.name)
      }
    }

    // 3. Cheap/affordable colleges
    if (input.includes('cheap') || input.includes('sasta') || input.includes('affordable') || input.includes('kam fees')) {
      const cheapColleges = [...colleges].sort((a, b) => a.fees - b.fees).slice(0, 3)
      return {
        sender: 'bot',
        text: `Budget-friendly colleges yeh rahe! 💰\n\n${cheapColleges.map((c, i) => 
          `${i + 1}. ${c.name} - ₹${c.fees.toLocaleString()}/year`
        ).join('\n')}\n\nPaise bachane ka plan solid hai! 😄`,
        suggestions: cheapColleges.map(c => c.name)
      }
    }

    // 4. High rated colleges
    if (input.includes('rating') || input.includes('highest') || input.includes('review')) {
      const topRated = [...colleges].sort((a, b) => b.rating - a.rating).slice(0, 3)
      return {
        sender: 'bot',
        text: `Highest rated colleges dekho! ⭐\n\n${topRated.map((c, i) => 
          `${i + 1}. ${c.name} - ${c.rating}⭐ (${c.students})`
        ).join('\n')}\n\nStudents ka verdict yeh hai!`,
        suggestions: topRated.map(c => c.name)
      }
    }

    // 5. Engineering colleges
    if (input.includes('engineering') || input.includes('btech') || input.includes('technical')) {
      const engColleges = colleges.filter(c => 
        c.courses.some(course => 
          course.toLowerCase().includes('engineering') || 
          course.toLowerCase().includes('technology')
        )
      )
      return {
        sender: 'bot',
        text: `Engineering colleges ki list ready hai! 🔧\n\n${engColleges.map((c, i) => 
          `${i + 1}. ${c.name} - ${c.location}`
        ).join('\n')}\n\nFuture engineer ban jao! 💪`,
        suggestions: engColleges.slice(0, 3).map(c => c.name)
      }
    }

    // 6. Location-based search
    const locations = ['churchgate', 'chowpatty', 'andheri', 'bandra', 'mumbai']
    const location = locations.find(loc => input.includes(loc))
    if (location) {
      const locationColleges = colleges.filter(c => 
        c.location.toLowerCase().includes(location)
      )
      if (locationColleges.length > 0) {
        return {
          sender: 'bot',
          text: `${location.charAt(0).toUpperCase() + location.slice(1)} mein yeh colleges hain! 📍\n\n${locationColleges.map((c, i) => 
            `${i + 1}. ${c.name} - ${c.rating}⭐`
          ).join('\n')}`,
          suggestions: locationColleges.map(c => c.name)
        }
      }
    }

    // 7. Fees/price query
    if (input.includes('fees') || input.includes('price') || input.includes('cost') || input.includes('kitna')) {
      return {
        sender: 'bot',
        text: "College ka naam batao, main fees bata dunga! 💰\n\nYa phir boliye:\n- Cheapest colleges\n- Average fees kitni hai\n- Budget ke andar colleges",
        suggestions: [
          "Cheapest colleges",
          "Average fees Mumbai",
          "Under 50k colleges"
        ]
      }
    }

    // 8. Admission/process query
    if (input.includes('admission') || input.includes('apply') || input.includes('kaise')) {
      return {
        sender: 'bot',
        text: "Admission process generally yeh steps hain:\n\n1️⃣ College ki official website pe jao\n2️⃣ Online application form bharo\n3️⃣ Documents upload karo (12th marksheet, etc.)\n4️⃣ Merit list wait karo\n5️⃣ Counselling attend karo\n\nKis college ke liye specific process chahiye? 🎓",
        suggestions: colleges.slice(0, 3).map(c => `${c.name} admission`)
      }
    }

    // 9. Placement query
    if (input.includes('placement') || input.includes('job') || input.includes('salary')) {
      return {
        sender: 'bot',
        text: "Placement dekhna hai? Smart choice! 💼\n\nTop placement colleges:\n\n" +
          colleges.slice(0, 3).map((c, i) => 
            `${i + 1}. ${c.name} - Approx 95% placement`
          ).join('\n') + 
          "\n\nKaunse college ki detailed placement info chahiye?",
        suggestions: colleges.slice(0, 3).map(c => c.name)
      }
    }

    // 10. Compare colleges
    if (input.includes('compare') || input.includes('vs') || input.includes('difference')) {
      return {
        sender: 'bot',
        text: "College comparison chahiye? Nice! ⚖️\n\nDo college names batao, main compare kar dunga:\n- Fees\n- Rating\n- Courses\n- Location\n\nExample: 'Wilson vs HR College'",
        suggestions: [
          "Wilson vs HR College",
          "Top 3 colleges compare",
          "Best vs cheapest"
        ]
      }
    }

    // 11. Courses query
    if (input.includes('course') || input.includes('stream') || input.includes('subject')) {
      return {
        sender: 'bot',
        text: "Courses available hai yeh:\n\n📚 Science & Technology\n💼 Commerce & Management\n🎨 Arts & Humanities\n⚙️ Engineering\n\nKis stream mein interest hai? Specific colleges bata dunga!",
        suggestions: [
          "Engineering colleges",
          "Commerce colleges",
          "Science colleges",
          "Arts colleges"
        ]
      }
    }

    // 12. Roasting/funny responses
    const roastTriggers = ['bakwas', 'bekar', 'ghatiya', 'waste', 'useless']
    if (roastTriggers.some(word => input.includes(word))) {
      return {
        sender: 'bot',
        text: "Arre bhai bhai! 😂 Itna gussa kyun? Chalo main seriously help karta hun.\n\nBatao:\n- Kya problem hai?\n- Kis college se issue hai?\n- Kya dhund rahe ho exactly?\n\nMain yahan help karne ke liye hun, roast karne nahi! 😎",
        suggestions: [
          "Best colleges dikha",
          "Affordable options",
          "Top rated colleges"
        ]
      }
    }

    // 13. Greeting responses
    if (input.includes('hi') || input.includes('hello') || input.includes('hey') || input.includes('namaste')) {
      return {
        sender: 'bot',
        text: "Hello! Kaise ho? 👋\n\nMain tumhe college dhundne mein madad kar sakta hun. Kya chahiye?\n\n💡 Try asking:\n- Best colleges Mumbai\n- Cheapest options\n- Engineering colleges\n- Specific college details",
        suggestions: [
          "Best colleges",
          "Affordable colleges",
          "Engineering colleges",
          "All colleges list"
        ]
      }
    }

    // 14. Help/guide request
    if (input.includes('help') || input.includes('guide') || input.includes('madad')) {
      return {
        sender: 'bot',
        text: "Bilkul! Main yeh sab bata sakta hun:\n\n🎓 College details (fees, rating, courses)\n📍 Location-wise colleges\n💰 Budget-friendly options\n⭐ Top-rated colleges\n📊 College comparison\n📝 Admission process\n💼 Placement info\n\nKya puchna hai? 😊",
        suggestions: [
          "Top colleges",
          "Cheap colleges",
          "Engineering colleges",
          "Admission process"
        ]
      }
    }

    // 15. Thank you responses
    if (input.includes('thank') || input.includes('thanks') || input.includes('shukriya')) {
      return {
        sender: 'bot',
        text: "Welcome yaar! 😊 Koi aur help chahiye?\n\nAll the best for your college journey! 🎓✨",
        suggestions: [
          "Show me more colleges",
          "Compare colleges",
          "Admission tips"
        ]
      }
    }

    // Default fallback with suggestions
    return {
      sender: 'bot',
      text: "Hmm, samajh nahi aaya exactly kya chahiye! 🤔\n\nTry karo yeh:\n- College ka naam directly puchho\n- 'Best colleges' type karo\n- 'Cheapest options' search karo\n- Ya phir Hinglish mein bolo! 😄",
      suggestions: [
        "Best colleges dikha",
        "Wilson College ke baare mein batao",
        "Sabse sasta college kaun sa hai",
        "Engineering colleges list"
      ]
    }
  }

  const sendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }])
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input)
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 800)

    setInput('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white border-2 border-blue-500 rounded-2xl shadow-2xl flex flex-col z-50 max-h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          <h2 className="font-bold text-lg">College Expert Bot</h2>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i}>
            <div className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-md ${
                m.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            </div>

            {/* College Card */}
            {m.collegeCard && (
              <div className="mt-3 ml-2 bg-white border-2 border-blue-200 rounded-xl p-4 shadow-lg">
                <h3 className="font-bold text-lg text-blue-600 mb-2">{m.collegeCard.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    {m.collegeCard.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    ₹{m.collegeCard.fees.toLocaleString()}/year
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                    Rating: {m.collegeCard.rating}⭐
                  </div>
                  <div className="mt-3">
                    <a 
                      href={`/colleges/${m.collegeCard.slug}`}
                      className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                    >
                      View Full Details →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {m.suggestions && m.suggestions.length > 0 && (
              <div className="mt-3 ml-2 flex flex-wrap gap-2">
                {m.suggestions.map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sugg)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
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

      {/* Input */}
      <div className="flex p-3 border-t border-gray-200 bg-white rounded-b-2xl">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Type karo... (Hinglish/English)"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}