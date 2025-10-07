'use client'

import Image from 'next/image'
import Link from 'next/link'
import { College } from '@/data/colleges' // Apne data ke type ko import karein

interface CollegeCardProps {
  college: College // Poora college object ek saath lein
}

export default function CollegeCard({ college }: CollegeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={college.image}
          alt={college.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-900">{college.name}</h4>
        <p className="text-gray-600">{college.location}</p>
        
        {/* Baaki details jaise rating, courses, etc. */}
        <div className="mt-4">
          <p><strong>Courses:</strong> {college.courses.join(', ')}</p>
          <p><strong>Fees:</strong> ₹{college.fees.toLocaleString()}</p>
        </div>

        <Link href={`/colleges/${college.slug}`} className="mt-4 inline-block">
          <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}