import { createClient } from '@/lib/supabase/server'
import CollegeList from './CollegeList'
import { colleges as fallbackColleges } from '@/data/colleges'

export const dynamic = 'force-dynamic'

interface CollegesPageProps {
  searchParams?: Promise<{ q?: string }>
}

export default async function CollegesPage({ searchParams }: CollegesPageProps) {
  const params = searchParams ? await searchParams : undefined
  const initialQuery = params?.q?.trim() ?? ''
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: colleges, error: collegesError } = await supabase.from('colleges').select('*')

  if (collegesError) {
    console.error('Colleges Fetch Error:', collegesError.message)
  }

  let favorites: { college_id: number }[] = []

  if (user) {
    const { data, error } = await supabase.from('favorites').select('college_id').eq('user_id', user.id)

    if (error) {
      console.error('Favorites Fetch Error:', error.message)
    }

    favorites = data || []
  }

  const favoriteCollegeIds = new Set(favorites.map((fav) => fav.college_id))
  const resolvedColleges = colleges && colleges.length > 0 ? colleges : fallbackColleges

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CollegeList
          initialColleges={resolvedColleges}
          userId={user?.id}
          favoriteCollegeIds={favoriteCollegeIds}
          initialQuery={initialQuery}
        />
      </div>
    </main>
  )
}
