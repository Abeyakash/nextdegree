'use client';

import { useEffect, useState } from 'react';

// Define the structure of a review
interface Review {
  id: number;
  rating: number;
  review_text: string;
  created_at: string;
  // You can add user's name here later
}

export default function ReviewsList({ collegeId }: { collegeId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?college_id=${collegeId}`);
        const data = await response.json();
        if (response.ok) {
          setReviews(data);
        } else {
          console.error('Failed to fetch reviews:', data.error);
        }
      } catch (error) {
        console.error('An error occurred while fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [collegeId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-center text-gray-500">No reviews yet. Be the first to write one!</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Reviews</h3>
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {/* Simple star rating display */}
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="ml-auto text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
          <p className="text-gray-700">{review.review_text}</p>
        </div>
      ))}
    </div>
  );
}