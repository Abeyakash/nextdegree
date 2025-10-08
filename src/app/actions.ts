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

// --- Other actions can also live here ---
// Your password reset functions would also be in this file.