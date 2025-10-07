// File: src/app/reset-password/actions.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function updateUserPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const supabase = createClient();

  if (password !== confirmPassword) {
    return redirect(
      '/reset-password?message=Passwords do not match'
    );
  }

  const { error } = await supabase.auth.updateUser({ password: password });

  if (error) {
    console.error('Error updating password:', error);
    return redirect(
      '/reset-password?message=Could not update password. Please try again.'
    );
  }

  // Password update hone ke baad user ko login page par bhej dein
  return redirect('/auth/login?message=Password updated successfully. Please log in.');
}