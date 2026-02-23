// src/app/page.tsx
import { createClient } from '@/lib/supabase/server';
import HomePageClient from './HomePageClient';
import { colleges as fallbackColleges } from '@/data/colleges';
import { sanitizeCollegeList } from '@/lib/college-validation';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: colleges, error } = await supabase
      .from('colleges')
      .select('*');

    if (error) {
      console.error("Error fetching colleges:", error);
    }

    const sourceColleges = colleges && colleges.length > 0 ? colleges : fallbackColleges
    const visibleColleges = sanitizeCollegeList(sourceColleges as unknown[])

    const { data: favorites } = user
      ? await supabase.from('favorites').select('college_id').eq('user_id', user.id)
      : { data: [] };

    const { data: news } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    const favoriteCollegeIds = new Set(favorites?.map(fav => fav.college_id));

    return (
      <HomePageClient
        initialColleges={visibleColleges}
        userId={user?.id}
        favoriteCollegeIds={favoriteCollegeIds}
        news={news || []}
      />
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error:", errorMessage);
    return <div className="text-center mt-10 text-red-600">Error loading page: {errorMessage}</div>;
  }
}
