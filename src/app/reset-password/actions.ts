'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

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

  return redirect('/auth/login?message=Password updated successfully. Please log in.');
}
