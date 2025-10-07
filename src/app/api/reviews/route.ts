import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // <-- This is the stable import
import { cookies } from 'next/headers';

// GET function (to fetch reviews)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const college_id = searchParams.get('college_id');

  if (!college_id) {
    return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('college_id', college_id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST function (to submit a review)
export async function POST(request: NextRequest) {
  const { college_id, rating, review_text } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to post a review.' }, { status: 401 });
  }

  const user_id = session.user.id;

  const { data, error } = await supabase
    .from('reviews')
    .insert([{ college_id, user_id, rating, review_text }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { 
      return NextResponse.json({ error: 'You have already reviewed this college.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}