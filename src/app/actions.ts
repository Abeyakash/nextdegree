'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Favorite Action ---
export async function toggleFavorite(collegeId: number, path: string) {
  const supabase = await createClient();
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

// --- Add Review Action ---
export async function addReview(collegeId: number, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const rating = Number(formData.get('rating'));
  const comment = formData.get('comment') as string;

  if (rating === 0 || !comment) {
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
    return;
  }

  const { data: college } = await supabase.from('colleges').select('slug').eq('id', collegeId).single();
  if (college) {
    revalidatePath(`/colleges/${college.slug}`);
  }
}

// --- Sign Out Action ---
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/');
}

// --- Forgot Password Action ---
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();
  
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    return redirect('/forgot-password?message=Error: Could not send reset link');
  }
  return redirect('/forgot-password?message=Password reset link has been sent.');
}

// --- Reset Password Action ---
export async function updateUserPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return redirect('/reset-password?message=Error: Passwords do not match');
  }

  const { error } = await supabase.auth.updateUser({ password: password });

  if (error) {
    return redirect('/reset-password?message=Error: Could not update password.');
  }
  
  return redirect('/auth/login?message=Password updated successfully.');
}
