import { createClient } from '@/lib/supabase/server'
import CollegeList from './CollegeList'

export const dynamic = 'force-dynamic'

export default async function CollegesPage() {
  // 🔥 MUST use await
  const supabase = await createClient()

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get colleges
  const { data: colleges, error: collegesError } =
    await supabase.from('colleges').select('*')

  if (collegesError) {
    console.error('Colleges Fetch Error:', collegesError.message)
  }

  // Get favorites only if user exists
  let favorites: { college_id: number }[] = []

  if (user) {
    const { data, error } = await supabase
      .from('favorites')
      .select('college_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Favorites Fetch Error:', error.message)
    }

    favorites = data || []
  }

  const favoriteCollegeIds = new Set(
    favorites.map((fav) => fav.college_id)
  )

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CollegeList
          initialColleges={colleges || []}
          userId={user?.id}
          favoriteCollegeIds={favoriteCollegeIds}
        />
      </div>
    </main>
  )
}
