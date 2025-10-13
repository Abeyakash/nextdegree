'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Favorite Action ---
export async function toggleFavorite(collegeId: number, path: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const { data: existingFavorite } = await supabase
    .from('favorites')
    .select('user_id, college_id')
    .eq('user_id', user.id)
    .eq('college_id', collegeId)
    .single();

  if (existingFavorite) {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('college_id', collegeId);
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, college_id: collegeId });
  }

  revalidatePath(path);
}

// --- NEW: Add Review Action ---
export async function addReview(collegeId: number, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const rating = Number(formData.get('rating'));
  const comment = formData.get('comment') as string;

  // Basic validation
  if (rating === 0 || !comment) {
    // In a real app, you'd handle this error more gracefully
    return;
  }

  const { error } = await supabase.from('reviews').insert({
    user_id: user.id,
    college_id: collegeId,
    rating,
    comment,
  });

  if (error) {
    console.error('Error submitting review:', error);
    // In a real app, you might redirect with an error message
    return;
  }

  // Revalidate the college detail page to show the new review instantly
  const { data: college } = await supabase.from('colleges').select('slug').eq('id', collegeId).single();
  if (college) {
    revalidatePath(`/colleges/${college.slug}`);
  }
}

// --- Your other actions like password reset would also be in this file ---