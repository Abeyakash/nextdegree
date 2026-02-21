import { createClient } from '@/lib/supabase/server';
import { Star } from 'lucide-react';

// FIX 1: Define a specific type for a review object.
interface ReviewWithUser {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    email: string;
  } | null; // The user might be null
}

export default async function ReviewsList({ collegeId }: { collegeId: number }) {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, user:users(email)')
    .eq('college_id', collegeId)
    .order('created_at', { ascending: false });

  if (!reviews || reviews.length === 0) {
    return <p className="mt-8 text-center text-gray-600">No reviews yet. Be the first to write one!</p>;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
      <div className="space-y-6">
        {/* FIX 2: Use the new, specific 'ReviewWithUser' type instead of 'any'. */}
        {reviews.map((review: ReviewWithUser) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800">
                {/* FIX 3: Use optional chaining (?.) for safety, in case the user is null. */}
                {review.user?.email.split('@')[0] || 'Anonymous'}
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-4">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
