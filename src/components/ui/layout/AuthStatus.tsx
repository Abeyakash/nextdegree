import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions'

export default async function AuthStatus() {
  const supabase = await createClient()

  let user = null

  try {
    const {
      data,
      error,
    } = await supabase.auth.getUser()

    if (error && error.message !== 'Auth session missing!') {
      console.error('Supabase Auth Error:', error.message)
    }

    user = data?.user ?? null
  } catch (err) {
    console.error('Unexpected Auth Error:', err)
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'

  return user ? (
    <div className="flex items-center gap-4">
      <span className="font-medium text-gray-700 hidden sm:block">
        {displayName}
      </span>

      <form action={signOut}>
        <button
          type="submit"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/login"
        className="text-gray-600 font-medium hover:text-amber-700 transition-colors"
      >
        Login
      </Link>

      <Link
        href="/auth/signup"
        className="bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-amber-700 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  )
}
