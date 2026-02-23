import { College } from '@/data/colleges'

const sanitizeText = (value: string): string =>
  value
    .replace(/Ã¢â€šÂ¹/g, 'Rs. ')
    .replace(/â‚¹/g, 'Rs. ')
    .replace(/Ã¢Ëœâ€¦/g, '★')
    .replace(/â˜…/g, '★')
    .replace(/â€™/g, "'")
    .trim()

const normalizeCourses = (courses: unknown): string[] => {
  if (Array.isArray(courses)) {
    return courses
      .map((course) => sanitizeText(String(course)))
      .filter(Boolean)
  }

  if (typeof courses === 'string') {
    return courses
      .split(',')
      .map((course) => sanitizeText(course))
      .filter(Boolean)
  }

  return []
}

const normalizePlacements = (placements: unknown): College['placements'] => {
  const fallback: College['placements'] = {
    avg: 'N/A',
    high: 'N/A',
    recruiters: [],
  }

  if (!placements) return fallback

  const source =
    typeof placements === 'string'
      ? (() => {
          try {
            return JSON.parse(placements)
          } catch {
            return fallback
          }
        })()
      : placements

  if (!source || typeof source !== 'object') return fallback

  const typed = source as { avg?: unknown; high?: unknown; recruiters?: unknown }
  return {
    avg: sanitizeText(String(typed.avg ?? 'N/A')),
    high: sanitizeText(String(typed.high ?? 'N/A')),
    recruiters: Array.isArray(typed.recruiters)
      ? typed.recruiters.map((recruiter) => sanitizeText(String(recruiter))).filter(Boolean)
      : [],
  }
}

export function normalizeCollegeRecord(input: unknown, fallbackId = 0): College | null {
  if (!input || typeof input !== 'object') return null

  const raw = input as Record<string, unknown>
  const name = sanitizeText(String(raw.name ?? ''))
  const slug = String(raw.slug ?? '').trim().toLowerCase()
  const location = sanitizeText(String(raw.location ?? 'Mumbai'))

  if (!name || !slug) return null
  if (name.toLowerCase().includes('demo') || name.toLowerCase().includes('test') || name.toLowerCase().includes('sample')) {
    return null
  }

  const rating = Number(raw.rating ?? 0)
  const fees = Number(raw.fees ?? 0)
  const established = Number(raw.established ?? 0)
  const courses = normalizeCourses(raw.courses)
  const placements = normalizePlacements(raw.placements)

  return {
    id: Number(raw.id ?? fallbackId),
    slug,
    name,
    location,
    rating: Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0,
    courses,
    fees: Number.isFinite(fees) && fees >= 0 ? fees : 0,
    students: sanitizeText(String(raw.students ?? 'N/A')),
    colorClass: String(raw.colorClass ?? 'bg-zinc-500'),
    established: Number.isFinite(established) ? established : 0,
    overview: sanitizeText(String(raw.overview ?? 'Overview will be updated soon.')),
    placements,
    image: String(raw.image ?? '/colleges/images/st_xaviers.jpg'),
  }
}

export function sanitizeCollegeList(list: unknown[]): College[] {
  const usedIds = new Set<number>()
  const usedSlugs = new Set<string>()
  const sanitized: College[] = []

  for (let index = 0; index < list.length; index += 1) {
    const normalized = normalizeCollegeRecord(list[index], index + 1)
    if (!normalized) continue
    if (usedIds.has(normalized.id) || usedSlugs.has(normalized.slug)) continue
    usedIds.add(normalized.id)
    usedSlugs.add(normalized.slug)
    sanitized.push(normalized)
  }

  return sanitized
}
