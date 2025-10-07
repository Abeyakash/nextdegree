'use client'

import { useCompare } from '@/lib/compare-context';
import Image from 'next/image';
import Link from 'next/link';

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Colleges
          </h1>
          <p className="text-xl text-gray-600">
            {/* The apostrophe is now fixed */}
            You haven&apos;t selected any colleges to compare yet.
          </p>
          <Link href="/colleges" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
            Browse Colleges
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          College Comparison
        </h1>
        
        {/* Using a more reliable grid layout that works for 1, 2, or 3 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {compareList.map(college => (
            <div key={college.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center h-full">
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                <Image 
                  src={college.image} 
                  alt={college.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow w-full">
                <h3 className="text-xl font-bold text-center mb-2">{college.name}</h3>
                <p className="text-gray-600 text-center mb-4">{college.location}</p>
                
                <div className="w-full text-left space-y-2 mb-4 border-t pt-4">
                  <p><strong>Rating:</strong> {college.rating} ★</p>
                  <p><strong>Courses:</strong> {college.courses.join(', ')}</p>
                  <p><strong>Fees:</strong> ₹{college.fees.toLocaleString()}</p>
                  <p><strong>Established:</strong> {college.established}</p>
                </div>
                
                <button 
                  onClick={() => removeFromCompare(college.id)}
                  className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}