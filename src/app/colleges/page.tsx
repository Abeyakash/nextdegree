import { createClient } from '@/lib/supabase/server';
import CollegeList from './CollegeList';

export default async function CollegesPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: colleges } = await supabase.from('colleges').select('*');
  const { data: favorites } = await supabase.from('favorites').select('college_id').eq('user_id', user?.id);
  
  const favoriteCollegeIds = new Set(favorites?.map(fav => fav.college_id));

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
  );
}