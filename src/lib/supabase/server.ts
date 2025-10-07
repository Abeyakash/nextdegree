// File: src/lib/supabase/server.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Agar aapne Supabase CLI se types generate ki hain toh is line ko uncomment karein
// import { Database } from '@/types/supabase'

export const createClient = () =>
  createServerComponentClient({
    cookies,
    // Agar upar wali 'Database' line uncomment ki hai, toh yahan bhi karein
    // options: {
    //   supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // },
  })