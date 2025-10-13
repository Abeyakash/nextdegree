'use client';

// FIX 1: 'useRef' ko yahan import karein
import { useState, useRef } from 'react';
import { addReview } from '@/app/actions';
import { Star } from 'lucide-react';

export default function AddReviewForm({ collegeId }: { collegeId: number }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const formRef = useRef<HTMLFormElement>(null); // Form ko reset karne ke liye

  // Server action ko collegeId ke saath bind karein
  const addReviewWithId = addReview.bind(null, collegeId);

  return (
    // 'action' attribute mein server action ko call karein
    <form 
      ref={formRef}
      // FIX 2: 'formData' ko 'FormData' type dein
      action={async (formData: FormData) => {
        await addReviewWithId(formData);
        // Form submit hone ke baad use reset kar dein
        formRef.current?.reset();
        setRating(0);
      }} 
      className="bg-white p-6 rounded-lg shadow-md mt-8 border"
    >
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          required
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Share your experience with this college..."
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={rating === 0}
        className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
      >
        Submit Review
      </button>
    </form>
  );
}