'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  // Uses the Environment Variable for the redirect URL
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error('Password Reset Error:', error);
    return redirect('/forgot-password?message=Error: Could not send reset link');
  }

  return redirect(
    '/forgot-password?message=Password reset link has been sent to your email.'
  );
}
