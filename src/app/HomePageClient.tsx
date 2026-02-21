'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import CollegeCard from '@/components/CollegeCard'
import { Button } from '@/components/ui/Button'
import { ChatIcon } from '@/components/ChatIcon'
import { ChatBot } from '@/components/ChatBot'
import { College } from '@/data/colleges'
import { Sparkles, SlidersHorizontal, History, GraduationCap, WalletCards } from 'lucide-react'

// FIX 1: 'any' type ko hatakar ek proper type banaya hu
interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  link: string;
}

const normalizeCourses = (courses: unknown): string[] => {
  if (Array.isArray(courses)) {
    return courses.filter((course): course is string => typeof course === 'string');
  }
  if (typeof courses === 'string') {
    return courses.split(',').map((course) => course.trim()).filter(Boolean);
  }
  return [];
};

type SortOption = 'relevance' | 'rating' | 'feesLow' | 'feesHigh'

const quickFilters = ['Top Rated', 'Affordable', 'Commerce', 'Science', 'Churchgate']
const streamExplorer = ['BCom', 'BMS', 'BA', 'BSc', 'IT']

export default function HomePageClient({ initialColleges, userId, favoriteCollegeIds, news }: {
    initialColleges: College[];
    userId: string | null | undefined;
    favoriteCollegeIds: Set<number>;
    news: NewsArticle[]; // 
}) {
  // ---ORIGINAL STATE AUR REFS ---
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [budget, setBudget] = useState(50000)
  const [highlightResults, setHighlightResults] = useState(false)
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

  useEffect(() => {
    const storedSearches = localStorage.getItem('recent-searches')
    if (!storedSearches) return
    try {
      const parsed = JSON.parse(storedSearches)
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item): item is string => typeof item === 'string').slice(0, 5))
      }
    } catch {
      setRecentSearches([])
    }
  }, [])

  // --- SEARCH LOGIC ---
  const filteredColleges = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const searched = initialColleges.filter((college) => {
      const normalizedName = String((college as unknown as { name?: unknown }).name ?? '').toLowerCase()
      const normalizedLocation = String((college as unknown as { location?: unknown }).location ?? '').toLowerCase()
      const normalizedCourses = normalizeCourses((college as unknown as { courses?: unknown }).courses).map((course) => course.toLowerCase())

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedLocation.includes(normalizedQuery) ||
        normalizedCourses.some((course) => course.includes(normalizedQuery))
      )
    })

    const sorted = [...searched]
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'feesLow') sorted.sort((a, b) => a.fees - b.fees)
    if (sortBy === 'feesHigh') sorted.sort((a, b) => b.fees - a.fees)
    return sorted
  }, [initialColleges, query, sortBy])

  const affordableCount = useMemo(
    () => initialColleges.filter((college) => college.fees <= budget).length,
    [initialColleges, budget]
  )

  const rememberSearch = (term: string) => {
    const normalized = term.trim()
    if (!normalized) return
    setRecentSearches((prev) => {
      const next = [normalized, ...prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 5)
      localStorage.setItem('recent-searches', JSON.stringify(next))
      return next
    })
  }

  const applyQuickFilter = (filter: string) => {
    if (filter === 'Top Rated') {
      setSortBy('rating')
      setQuery('')
    } else if (filter === 'Affordable') {
      setSortBy('feesLow')
      setQuery('')
    } else {
      setQuery(filter)
    }
    setTimeout(() => handleSearch(), 120)
  }

  const handleSearch = () => {
    if (!collegesRef.current) return
    collegesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setHighlightResults(true)
    setTimeout(() => setHighlightResults(false), 900)
  }

  const executeSearch = () => {
    rememberSearch(query)
    handleSearch()
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ---HERO SECTION --- */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 py-20 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Find Your Perfect <span className="text-cyan-700">College</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Discover the best colleges in Mumbai Metropolitan Region. Compare courses, fees, and find your ideal educational path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') executeSearch()
              }}
              placeholder="Search colleges, courses..."
              className="w-full sm:w-96 px-6 py-3 text-lg border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all duration-300 hover:scale-[1.02] focus:shadow-lg focus:shadow-cyan-200/60"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={executeSearch}
              className="search-cta bg-cyan-700 hover:bg-cyan-800"
            >
              Search
            </Button>
          </div>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => applyQuickFilter(filter)}
                className="rounded-full border border-cyan-300 bg-white/80 px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-100 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
          {recentSearches.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item)
                    setTimeout(() => handleSearch(), 120)
                  }}
                  className="inline-flex items-center rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
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
                <div className="text-3xl font-bold text-cyan-700 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-cyan-900 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { title: 'Quick Filters', subtitle: '1-tap discovery', icon: Sparkles },
              { title: 'Smart Sort', subtitle: 'rating or fees first', icon: SlidersHorizontal },
              { title: 'Recent Search', subtitle: 'continue where you left', icon: History },
              { title: 'Stream Explorer', subtitle: 'browse by course intent', icon: GraduationCap },
              { title: 'Budget Planner', subtitle: 'fees based shortlist', icon: WalletCards },
            ].map(({ title, subtitle, icon: Icon }) => (
              <div key={title} className="feature-glass rounded-2xl p-4">
                <Icon className="h-5 w-5 mb-2 text-cyan-200" />
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-cyan-100">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED COLLEGES SECTION--- */}
      <section
        ref={collegesRef}
        className={`py-20 bg-slate-100 opacity-0 translate-y-8 transition-all duration-700 ${highlightResults ? 'search-results-flash' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-2">Sort Results</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="feesLow">Lowest Fees</option>
                <option value="feesHigh">Highest Fees</option>
              </select>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm md:col-span-2">
              <p className="text-sm font-semibold text-slate-500 mb-2">Stream Explorer</p>
              <div className="flex flex-wrap gap-2">
                {streamExplorer.map((stream) => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => {
                      setQuery(stream)
                      rememberSearch(stream)
                      setTimeout(() => handleSearch(), 120)
                    }}
                    className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100 transition-colors"
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-8 rounded-2xl bg-white p-5 border border-emerald-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Budget Planner</p>
                <p className="text-lg font-bold text-slate-900">
                  {affordableCount} colleges under Rs. {budget.toLocaleString()}
                </p>
              </div>
              <input
                type="range"
                min={15000}
                max={90000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full md:w-96 accent-emerald-600"
              />
            </div>
          </div>
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
              {filteredColleges.slice(0, 6).map((college, index) => (
                <div key={college.id} className="card-lift-in" style={{ animationDelay: `${index * 90}ms` }}>
                  <CollegeCard
                    college={college}
                    userId={userId}
                    isFavorited={favoriteCollegeIds.has(college.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            query && (<p className="text-center text-gray-500">{`No colleges found for "${query}".`}</p>)
          )}
          <div className="text-center mt-12">
            <Link href="/colleges">
              <button className="bg-cyan-700 text-white px-8 py-4 rounded-xl hover:bg-cyan-800 font-semibold text-lg shadow-lg transition-all hover:scale-105">
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
                <h3 className="text-xl font-semibold text-cyan-800">{item.title}</h3>
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
