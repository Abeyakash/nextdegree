'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import CollegeCard from '@/components/CollegeCard'
import { Button } from '@/components/ui/Button'
import { ChatIcon } from '@/components/ChatIcon'
import { ChatBot } from '@/components/ChatBot'
import { College } from '@/data/colleges'
import {
  Sparkles,
  SlidersHorizontal,
  History,
  GraduationCap,
  WalletCards,
  ArrowUp,
  BarChart3,
  Clock3,
  Keyboard,
  Search,
} from 'lucide-react'

interface NewsArticle {
  id: number
  title: string
  summary: string
  link: string
}

interface ViewedCollege {
  id: number
  name: string
  slug: string
}

const normalizeCourses = (courses: unknown): string[] => {
  if (Array.isArray(courses)) {
    return courses.filter((course): course is string => typeof course === 'string')
  }
  if (typeof courses === 'string') {
    return courses
      .split(',')
      .map((course) => course.trim())
      .filter(Boolean)
  }
  return []
}

type SortOption = 'relevance' | 'rating' | 'feesLow' | 'feesHigh'

const quickFilters = ['Top Rated', 'Affordable', 'Commerce', 'Science', 'Churchgate']
const streamExplorer = ['BCom', 'BMS', 'BA', 'BSc', 'IT']

const readLocalJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export default function HomePageClient({
  initialColleges,
  userId,
  favoriteCollegeIds,
  news,
}: {
  initialColleges: College[]
  userId: string | null | undefined
  favoriteCollegeIds: Set<number>
  news: NewsArticle[]
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readLocalJson<string[]>('recent-searches', []).filter((item) => typeof item === 'string').slice(0, 5)
  )
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedCollege[]>(() =>
    readLocalJson<ViewedCollege[]>('recently-viewed-colleges', []).slice(0, 5)
  )
  const [budget, setBudget] = useState(50000)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [highlightResults, setHighlightResults] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const collegesRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (statsRef.current) observer.observe(statsRef.current)
    if (collegesRef.current) observer.observe(collegesRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 420)
    const handleShortcut = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleShortcut)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [])

  const filteredColleges = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const searched = initialColleges.filter((college) => {
      const normalizedName = String((college as { name?: unknown }).name ?? '').toLowerCase()
      const normalizedLocation = String((college as { location?: unknown }).location ?? '').toLowerCase()
      const normalizedCourses = normalizeCourses((college as { courses?: unknown }).courses).map((course) =>
        course.toLowerCase()
      )

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

  const searchHints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery.length < 2) return []

    const names = initialColleges
      .filter((college) => college.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)
      .map((college) => college.name)

    return Array.from(new Set(names)).slice(0, 5)
  }, [initialColleges, query])

  const affordableCount = useMemo(
    () => initialColleges.filter((college) => college.fees <= budget).length,
    [initialColleges, budget]
  )

  const searchInsights = useMemo(() => {
    if (filteredColleges.length === 0) {
      return { avgFees: 0, topRating: 0, avgRating: 0 }
    }

    const totalFees = filteredColleges.reduce((sum, college) => sum + college.fees, 0)
    const totalRating = filteredColleges.reduce((sum, college) => sum + college.rating, 0)

    return {
      avgFees: Math.round(totalFees / filteredColleges.length),
      topRating: Math.max(...filteredColleges.map((college) => college.rating)),
      avgRating: Number((totalRating / filteredColleges.length).toFixed(2)),
    }
  }, [filteredColleges])

  const rememberSearch = (term: string) => {
    const normalized = term.trim()
    if (!normalized) return

    setRecentSearches((prev) => {
      const next = [normalized, ...prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 5)
      localStorage.setItem('recent-searches', JSON.stringify(next))
      return next
    })
  }

  const rememberViewedCollege = (college: College) => {
    setRecentlyViewed((prev) => {
      const next = [
        { id: college.id, name: college.name, slug: college.slug },
        ...prev.filter((item) => item.id !== college.id),
      ].slice(0, 5)
      localStorage.setItem('recently-viewed-colleges', JSON.stringify(next))
      return next
    })
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

  const applyQuickFilter = (filter: string) => {
    if (filter === 'Top Rated') {
      setSortBy('rating')
      setQuery('')
    } else if (filter === 'Affordable') {
      setSortBy('feesLow')
      setQuery('')
    } else {
      setQuery(filter)
      rememberSearch(filter)
    }
    setTimeout(() => handleSearch(), 120)
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 py-20 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-slate-300/50 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Find Your Perfect <span className="text-blue-700">College</span>
          </h1>
          <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
            Discover top colleges in Mumbai, compare fees and ratings, and shortlist faster with smart tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-start mb-8">
            <div className="relative w-full sm:w-96">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeSearch()
                }}
                placeholder="Search colleges, courses..."
                className="w-full px-6 py-3 text-lg border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300 hover:scale-[1.02] focus:shadow-lg focus:shadow-blue-200/60"
              />
              {searchHints.length > 0 && (
                <div className="absolute z-20 mt-2 w-full rounded-xl border border-blue-100 bg-white shadow-lg text-left">
                  {searchHints.map((hint) => (
                    <button
                      key={hint}
                      type="button"
                      onClick={() => {
                        setQuery(hint)
                        rememberSearch(hint)
                        setTimeout(() => handleSearch(), 100)
                      }}
                      className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="primary" size="lg" onClick={executeSearch} className="search-cta bg-blue-700 hover:bg-blue-800">
              Search
            </Button>
          </div>

          <p className="text-sm text-slate-600 mb-6 inline-flex items-center gap-2">
            <Keyboard className="h-4 w-4" /> Press <span className="rounded bg-white px-2 py-0.5 font-semibold">/</span> to focus search quickly
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => applyQuickFilter(filter)}
                className="rounded-full border border-blue-300 bg-white/90 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-100 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          {recentSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-3 text-slate-600 text-sm">
                <Clock3 className="h-4 w-4" /> Recent Searches
              </div>
              <div className="flex flex-wrap justify-center gap-2">
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
                <button
                  type="button"
                  onClick={() => {
                    setRecentSearches([])
                    localStorage.removeItem('recent-searches')
                  }}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">Get Course Guidance</Button>
            <Button variant="secondary" size="lg">Compare Colleges</Button>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-16 bg-white opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '30+', label: 'Colleges' },
              { number: '50+', label: 'Courses' },
              { number: '1000+', label: 'Students Helped' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, i) => (
              <div key={i} className="transform hover:scale-110 transition-all duration-300 hover:shadow-xl p-4 rounded-xl">
                <div className="text-3xl font-bold text-blue-700 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { title: 'Smart Suggestions', subtitle: 'live search recommendations', icon: Search },
              { title: 'Slash Shortcut', subtitle: 'keyboard first navigation', icon: Keyboard },
              { title: 'Recent Views', subtitle: 'continue from last college', icon: History },
              { title: 'Search Insights', subtitle: 'fees and rating analytics', icon: BarChart3 },
              { title: 'Back To Top', subtitle: 'faster long page navigation', icon: ArrowUp },
            ].map(({ title, subtitle, icon: Icon }) => (
              <div key={title} className="feature-glass rounded-2xl p-4">
                <Icon className="h-5 w-5 mb-2 text-blue-200" />
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-blue-100">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={collegesRef}
        className={`py-20 bg-slate-100 opacity-0 translate-y-8 transition-all duration-700 ${highlightResults ? 'search-results-flash' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-2">Sort Results</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="feesLow">Lowest Fees</option>
                <option value="feesHigh">Highest Fees</option>
              </select>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm md:col-span-2">
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
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-2xl bg-white p-5 border border-blue-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Budget Planner</p>
                <p className="text-lg font-bold text-slate-900">{affordableCount} colleges under Rs. {budget.toLocaleString()}</p>
              </div>
              <input
                type="range"
                min={15000}
                max={90000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full md:w-96 accent-blue-700"
              />
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Average Fees</p>
              <p className="text-2xl font-bold text-blue-700">Rs. {searchInsights.avgFees.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Top Rating</p>
              <p className="text-2xl font-bold text-blue-700">{searchInsights.topRating.toFixed(1)} / 5</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Average Rating</p>
              <p className="text-2xl font-bold text-blue-700">{searchInsights.avgRating.toFixed(2)} / 5</p>
            </div>
          </div>

          {recentlyViewed.length > 0 && (
            <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600 mb-3 inline-flex items-center gap-2">
                <History className="h-4 w-4" /> Recently Viewed
              </p>
              <div className="flex flex-wrap gap-2">
                {recentlyViewed.map((college) => (
                  <Link
                    key={college.id}
                    href={`/colleges/${college.slug}`}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    {college.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{query ? 'Search Results' : 'Featured Colleges'}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {query ? 'Showing results for your search.' : 'Top-rated colleges in Mumbai trusted by thousands.'}
            </p>
          </div>

          {filteredColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredColleges.slice(0, 6).map((college, index) => (
                <div key={college.id} className="card-lift-in" style={{ animationDelay: `${index * 90}ms` }}>
                  <CollegeCard
                    college={college}
                    userId={userId}
                    isFavorited={favoriteCollegeIds.has(college.id)}
                    onViewDetails={rememberViewedCollege}
                  />
                </div>
              ))}
            </div>
          ) : (
            query && <p className="text-center text-gray-500">{`No colleges found for "${query}".`}</p>
          )}

          <div className="text-center mt-12">
            <Link href="/colleges">
              <button className="bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-800 font-semibold text-lg shadow-lg transition-all hover:scale-105">
                View All Colleges
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News and Updates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Stay informed about admission dates, cut-offs, and more.</p>
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
                <h3 className="text-xl font-semibold text-blue-800">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.summary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

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

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 left-5 z-40 rounded-full bg-blue-700 p-3 text-white shadow-xl hover:bg-blue-800"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
      <ChatIcon onClick={() => setIsChatOpen(true)} />
    </main>
  )
}
