import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Star, Users, Calendar, TrendingUp, Phone, Mail, Globe } from 'lucide-react'
import Link from 'next/link'
import { getCollegeBySlug, getCollegeAdmissionLink, getCollegeDetailsBySlug } from '@/data/colleges'
import CollegeTools from '@/components/CollegeTools'

interface CollegePageProps {
  params: Promise<{ slug: string }>
}

function formatUrl(url?: string) {
  if (!url) return '#'
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

function parseCourses(input: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(input)) {
    return input.filter((course): course is string => typeof course === 'string')
  }
  if (typeof input === 'string') {
    return input.split(',').map((course) => course.trim()).filter(Boolean)
  }
  return fallback
}

function normalizeText(value: string): string {
  return value
    .replace(/â‚¹/g, 'Rs. ')
    .replace(/â˜…/g, '★')
    .replace(/\s+/g, ' ')
    .trim()
}

function parsePlacements(input: unknown, fallback?: { avg: string; high: string; recruiters: string[] }) {
  if (input && typeof input === 'object') {
    const p = input as { avg?: string; high?: string; recruiters?: string[] }
    return {
      avg: normalizeText(p.avg ?? fallback?.avg ?? 'N/A'),
      high: normalizeText(p.high ?? fallback?.high ?? 'N/A'),
      recruiters: Array.isArray(p.recruiters)
        ? p.recruiters.map((recruiter) => normalizeText(String(recruiter)))
        : (fallback?.recruiters ?? []).map((recruiter) => normalizeText(String(recruiter))),
    }
  }

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      return {
        avg: normalizeText(parsed?.avg ?? fallback?.avg ?? 'N/A'),
        high: normalizeText(parsed?.high ?? fallback?.high ?? 'N/A'),
        recruiters: Array.isArray(parsed?.recruiters)
          ? parsed.recruiters.map((recruiter: string) => normalizeText(String(recruiter)))
          : (fallback?.recruiters ?? []).map((recruiter) => normalizeText(String(recruiter))),
      }
    } catch {
      return fallback ?? { avg: 'N/A', high: 'N/A', recruiters: [] }
    }
  }

  return fallback ?? { avg: 'N/A', high: 'N/A', recruiters: [] }
}

function getCollegeSnapshot(name: string, courses: string[], students: string) {
  const lowerName = name.toLowerCase()
  const hasPg = courses.some((course) => course.toLowerCase().startsWith('m'))
  const studentsCount = Number(String(students).replace(/[^0-9]/g, '')) || 0

  const managementType = lowerName.includes('autonomous')
    ? 'Autonomous'
    : lowerName.includes('government') || lowerName.includes('ismail yusuf')
      ? 'Government'
      : 'Trust / Private Aided'

  const specialCategory = lowerName.includes('mahila')
    ? 'Women-focused'
    : lowerName.includes('pharmacy')
      ? 'Specialized Professional'
      : 'Co-educational'

  const campusScale = studentsCount >= 5000
    ? 'Large Campus Activity'
    : studentsCount >= 3000
      ? 'Balanced Campus Activity'
      : 'Compact Campus Activity'

  return {
    admissionWindow: 'Typical cycle: May to July',
    levels: hasPg ? 'Undergraduate + Postgraduate' : 'Primarily Undergraduate',
    streamFocus: courses.slice(0, 3).join(', ') || 'Multi-stream',
    managementType,
    medium: 'Primarily English medium',
    campusScale,
    specialCategory,
  }
}

export default async function CollegePage({ params }: CollegePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: college, error } = await supabase.from('colleges').select('*').eq('slug', slug).single()
  const fallbackCollege = getCollegeBySlug(slug)

  if ((error || !college) && !fallbackCollege) {
    console.error('College fetch error:', error)
    notFound()
  }

  const mergedCollege = {
    ...fallbackCollege,
    ...college,
    name: college?.name ?? fallbackCollege?.name ?? 'College',
    slug: college?.slug ?? fallbackCollege?.slug ?? slug,
    location: college?.location ?? fallbackCollege?.location ?? 'Mumbai',
    rating: Number(college?.rating ?? fallbackCollege?.rating ?? 0),
    students: String(college?.students ?? fallbackCollege?.students ?? 'N/A'),
    established: Number(college?.established ?? fallbackCollege?.established ?? 0),
    overview: college?.overview ?? fallbackCollege?.overview ?? 'Overview will be updated soon.',
    fees: Number(college?.fees ?? fallbackCollege?.fees ?? 0),
    courses: parseCourses(college?.courses, fallbackCollege?.courses ?? []),
    image: college?.image ?? fallbackCollege?.image,
  }

  const placements = parsePlacements(college?.placements, fallbackCollege?.placements)
  const snapshot = getCollegeSnapshot(mergedCollege.name, mergedCollege.courses, mergedCollege.students)
  const details = getCollegeDetailsBySlug(
    mergedCollege.slug,
    mergedCollege.name,
    mergedCollege.courses,
    mergedCollege.location
  )

  const applyUrl = formatUrl(college?.website_url ?? details.officialWebsite)
  const brochureUrl = formatUrl(college?.brochure_url)
  const admissionInfoLink = getCollegeAdmissionLink(
    mergedCollege.slug,
    mergedCollege.name,
    mergedCollege.location
  )

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-amber-700 hover:underline">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/colleges" className="text-amber-700 hover:underline">Colleges</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{mergedCollege.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{mergedCollege.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-amber-700" />{mergedCollege.location}</div>
                <div className="flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />{mergedCollege.rating} Rating</div>
                <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-zinc-700" />{mergedCollege.students} Students</div>
                <div className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-zinc-700" />Est. {mergedCollege.established || 'N/A'}</div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all font-semibold">Apply Now</a>
              <a href={admissionInfoLink} target="_blank" rel="noopener noreferrer" className="border-2 border-amber-700 text-amber-700 px-6 py-3 rounded-lg hover:bg-amber-50 transition-all font-semibold">Admission Details</a>
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={brochureUrl === '#'}
                className={`border-2 px-6 py-3 rounded-lg transition-all font-semibold ${
                  brochureUrl === '#'
                    ? 'border-zinc-300 text-zinc-400 pointer-events-none cursor-not-allowed'
                    : 'border-zinc-700 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Brochure
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-zinc-900 mb-2">Rs. {(mergedCollege.fees / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Annual Fees</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{placements.avg}</div>
            <div className="text-gray-600">Avg Package</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{placements.high}</div>
            <div className="text-gray-600">Highest Package</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{mergedCollege.courses.length}+</div>
            <div className="text-gray-600">Courses Offered</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section id="overview" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center"><div className="w-1 h-8 bg-amber-700 mr-4"></div>Overview</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{mergedCollege.overview}</p>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center"><div className="w-1 h-8 bg-amber-700 mr-4"></div>College Snapshot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Admission Window</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.admissionWindow}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Program Levels</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.levels}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Core Streams</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.streamFocus}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Management Type</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.managementType}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Teaching Medium</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.medium}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Campus Environment</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.campusScale}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Category</p>
                  <p className="font-semibold text-zinc-900 mt-1">{snapshot.specialCategory}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center"><div className="w-1 h-8 bg-amber-700 mr-4"></div>Admission and College Facts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">University</p>
                  <p className="font-semibold text-zinc-900 mt-1">{details.university}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Accreditation</p>
                  <p className="font-semibold text-zinc-900 mt-1">{details.accreditation}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Admission Mode</p>
                  <p className="font-semibold text-zinc-900 mt-1">{details.admissionMode}</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Popular Programs</p>
                  <p className="font-semibold text-zinc-900 mt-1">{details.popularPrograms.join(', ') || 'Not available'}</p>
                </div>
              </div>
            </section>

            <section id="courses" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center"><div className="w-1 h-8 bg-amber-700 mr-4"></div>Courses Offered</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mergedCollege.courses.map((course: string, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-zinc-50 to-amber-50 p-4 rounded-lg border-2 border-zinc-200 hover:border-amber-300 transition-all">
                    <div className="font-semibold text-zinc-900">{course}</div>
                  </div>
                ))}
              </div>
            </section>

            <section id="placements" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center"><div className="w-1 h-8 bg-amber-700 mr-4"></div><TrendingUp className="w-8 h-8 mr-3 text-zinc-800" />Placements</h2>
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Top Recruiters</h3>
              <div className="flex flex-wrap gap-3">
                {placements.recruiters.map((recruiter: string, index: number) => (
                  <span key={index} className="bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full font-medium">{recruiter}</span>
                ))}
              </div>
            </section>

            <section id="admission" className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center"><div className="w-1 h-8 bg-amber-700 mr-4"></div>Admission Essentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-amber-100 bg-amber-50">
                  <p className="font-semibold text-amber-900 mb-1">Typical Eligibility</p>
                  <p className="text-sm text-gray-700">10+2 pass in relevant stream with qualifying marks based on merit/cut-off.</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="font-semibold text-zinc-900 mb-1">Documents Required</p>
                  <p className="text-sm text-gray-700">Marksheet, photo ID, passport photos, transfer and category docs (if applicable).</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <p className="font-semibold text-zinc-900 mb-1">Admission Steps</p>
                  <p className="text-sm text-gray-700">Register online, upload docs, check merit list, confirm seat, and complete fee payment.</p>
                </div>
                <div className="p-4 rounded-lg border border-orange-100 bg-orange-50">
                  <p className="font-semibold text-orange-900 mb-1">Official Admission Link</p>
                  <a href={admissionInfoLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-orange-700 hover:underline">
                    Open admission page for {mergedCollege.name}
                  </a>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start"><Phone className="w-5 h-5 text-zinc-700 mr-3 mt-1" /><div><div className="text-sm text-gray-500">Phone</div><div className="font-medium">{details.contactPhone}</div></div></div>
                <div className="flex items-start"><Mail className="w-5 h-5 text-zinc-700 mr-3 mt-1" /><div><div className="text-sm text-gray-500">Email</div><div className="font-medium">{details.contactEmail}</div></div></div>
                <div className="flex items-start"><Globe className="w-5 h-5 text-zinc-700 mr-3 mt-1" /><div><div className="text-sm text-gray-500">Website</div><a href={applyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-700 hover:underline">Official Website</a></div></div>
              </div>
            </div>

            <CollegeTools
              collegeName={mergedCollege.name}
              slug={mergedCollege.slug}
              annualFees={mergedCollege.fees}
              admissionUrl={admissionInfoLink}
            />

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#admission" className="block text-amber-700 hover:underline py-2">Admission Process</a>
                <a href="#courses" className="block text-amber-700 hover:underline py-2">Fee Structure</a>
                <a href={admissionInfoLink} target="_blank" rel="noopener noreferrer" className="block text-amber-700 hover:underline py-2">Official Admission Link</a>
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="block text-amber-700 hover:underline py-2">Campus Website</a>
                <a href="#placements" className="block text-amber-700 hover:underline py-2">Placement Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
