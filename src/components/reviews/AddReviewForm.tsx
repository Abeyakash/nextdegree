'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function AddReviewForm({ collegeId, onReviewAdded }: { collegeId: number, onReviewAdded: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college_id: collegeId,
          rating: rating,
          review_text: reviewText,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Clear the form and notify the parent component
        setRating(0);
        setReviewText('');
        onReviewAdded();
      } else {
        setError(data.error || 'Failed to submit review.');
      }
  } catch (err) {
  console.error(err); // This uses the 'err' variable
  setError('An error occurred. Please try again.');
}
  };

  if (loading) {
    return <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="text-center bg-gray-100 p-6 rounded-lg">
        <p className="font-semibold">
          You must be logged in to write a review.
        </p>
        <a href="/auth/login" className="text-blue-600 hover:underline mt-2 inline-block">
          Login or Sign Up
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
      <h3 className="text-xl font-bold">Write Your Review</h3>
      
      {/* Star Rating Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
  type="button"
  key={star}
  onClick={() => setRating(star)}
  className="focus:outline-none"
  aria-label={`Rate ${star} out of 5 stars`} // This fixes the error
>
              <svg
                className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">Your Review (Optional)</label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your experience..."
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}