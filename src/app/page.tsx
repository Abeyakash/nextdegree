import { createClient } from '@/lib/supabase/server';
import HomePageClient from './HomePageClient'; // Your client component

export default async function HomePage() {
  const supabase = createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch colleges from the database
  const { data: colleges, error } = await supabase
    .from('colleges')
    .select('*');

  if (error) {
    console.error("Error fetching colleges:", error);
  }

  // Fetch the user's favorite college IDs
  const { data: favorites } = user
    ? await supabase.from('favorites').select('college_id').eq('user_id', user.id)
    : { data: [] };
    
  // --- NEW: Fetch latest news articles ---
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false }) // Get the newest first
    .limit(4); // Fetches the 4 most recent articles

  // Create a fast way to check if a college is a favorite
  const favoriteCollegeIds = new Set(favorites?.map(fav => fav.college_id));

  // Pass all fetched data as props to your original UI component
  return (
    <HomePageClient
      initialColleges={colleges || []}
      userId={user?.id}
      favoriteCollegeIds={favoriteCollegeIds}
      news={news || []} // Pass the new news data as a prop
    />
  );
}