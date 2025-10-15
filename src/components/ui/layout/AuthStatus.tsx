// File: src/components/ui/layout/AuthStatus.tsx

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions';

export default async function AuthStatus() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // User ke metadata se 'full_name' nikalne ki koshish karein
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0];

  return user ? (
    // Agar user logged in hai, toh naam aur logout button dikhayein
    <div className="flex items-center gap-4">
      <span className="font-medium text-gray-700 hidden sm:block">{displayName}</span>
      <form action={signOut}>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors">
          Logout
        </button>
      </form>
    </div>
  ) : (
    // Agar user logged out hai, toh login aur signup button dikhayein
    <div className="flex items-center gap-4">
      <Link href="/auth/login" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
        Login
      </Link>
      <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
        Sign Up
      </Link>
    </div>
  );
}