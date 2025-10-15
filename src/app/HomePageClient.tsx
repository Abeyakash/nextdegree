'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CollegeCard from '@/components/CollegeCard'
import { Button } from '@/components/ui/Button'
import { ChatIcon } from '@/components/ChatIcon'
import { ChatBot } from '@/components/ChatBot'
import { College } from '@/data/colleges'

// FIX 1: 'any' type ko hatakar ek proper type banaya hu
interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  link: string;
}

export default function HomePageClient({ initialColleges, userId, favoriteCollegeIds, news }: {
    initialColleges: College[];
    userId: string | null | undefined;
    favoriteCollegeIds: Set<number>;
    news: NewsArticle[]; // 
}) {
  // ---ORIGINAL STATE AUR REFS ---
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const collegesRef = useRef<HTMLDivElement>(null)

  // --- ANIMATION LOGIC ---
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)
    if (heroRef.current) observer.observe(heroRef.current)
    if (statsRef.current) observer.observe(statsRef.current)
    if (collegesRef.current) observer.observe(collegesRef.current)
    return () => observer.disconnect()
  }, [])

  // --- SEARCH LOGIC ---
  const filteredColleges = initialColleges.filter(
    (college) =>
      college.name.toLowerCase().includes(query.toLowerCase()) ||
      college.location.toLowerCase().includes(query.toLowerCase()) ||
      college.courses.some((course) =>
        course.toLowerCase().includes(query.toLowerCase())
      )
  )

  return (
    <main className="min-h-screen bg-white">

      {/* ---HERO SECTION --- */}
      <section
        ref={heroRef}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-20 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect <span className="text-indigo-600">College</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the best colleges in Mumbai Metropolitan Region. Compare courses, fees, and find your ideal educational path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colleges, courses..."
              className="w-full sm:w-96 px-6 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-transform hover:scale-105"
            />
            <Button variant="primary" size="lg">Search</Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">Get Course Guidance</Button>
            <Button variant="secondary" size="lg">Compare Colleges</Button>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION--- */}
      <section
        ref={statsRef}
        className="py-16 bg-white opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '30+', label: 'Colleges' },
              { number: '50+', label: 'Courses' },
              { number: '1000+', label: 'Students Helped' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, i) => (
              <div key={i} className="transform hover:scale-110 transition-all duration-300 hover:shadow-xl p-4 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED COLLEGES SECTION--- */}
      <section
        ref={collegesRef}
        className="py-20 bg-gray-50 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {query ? 'Search Results' : 'Featured Colleges'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {query ? 'Showing results for your search.' : 'Top-rated colleges in Mumbai trusted by thousands.'}
            </p>
          </div>
          {filteredColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* FIX:slice(0, 6)' kar diya hai */}
              {filteredColleges.slice(0, 6).map((college) => (
                <CollegeCard 
                  key={college.id} 
                  college={college}
                  userId={userId}
                  isFavorited={favoriteCollegeIds.has(college.id)}
                />
              ))}
            </div>
          ) : (
            query && (<p className="text-center text-gray-500">{`No colleges found for "${query}".`}</p>)
          )}
          <div className="text-center mt-12">
            <Link href="/colleges">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 font-semibold text-lg shadow-lg transition-all hover:scale-105">
                View All Colleges
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FIX: 'news' data ko display karne ka section add kiya hu */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed about admission dates, cut-offs, and more.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {news.map((item) => (
              <a 
                key={item.id} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                <h3 className="text-xl font-semibold text-indigo-700">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.summary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* -- FOOTER-- */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NextDegree</h3>
              <p className="text-gray-400">Your trusted college discovery platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/colleges" className="hover:text-white">Colleges</Link></li>
                <li><Link href="/compare" className="hover:text-white">Compare</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Mumbai, Maharashtra</p>
              <p className="text-gray-400">info@nextdegree.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NextDegree. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* CHATBOT */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
      <ChatIcon onClick={() => setIsChatOpen(true)} />
    </main>
  );
}