'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, DollarSign, Star, Briefcase, ChevronRight, Heart } from 'lucide-react';
import { College } from '@/data/colleges';
import { useCompare } from '@/lib/compare-context';
import { toggleFavorite } from '@/app/actions';

interface CollegeCardProps {
  college: College;
  userId?: string | null;
  isFavorited: boolean;
}

export default function CollegeCard({ college, userId, isFavorited }: CollegeCardProps) {
  const { addToCompare, compareList } = useCompare();
  const isInCompare = compareList.some(c => c.id === college.id);
  const toggleFavoriteWithData = toggleFavorite.bind(null, college.id, '/colleges');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={college.image} alt={college.name} fill className="object-cover" />
        {userId && (
          <form action={toggleFavoriteWithData} className="absolute top-3 right-3">
            <button
              type="submit"
              className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Toggle Favorite"
            >
              <Heart 
                className={`w-6 h-6 transition-all ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-gray-300 hover:fill-red-200'}`} 
              />
            </button>
          </form>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link href={`/colleges/${college.slug}`} className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              {college.name}
            </Link>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1"/> {college.location}
            </p>
          </div>
          <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
            {college.rating.toFixed(1)}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4 mt-4">
          <p className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
            {college.courses.join(', ')}
          </p>
          <p className="flex items-center font-bold text-green-700">
            <DollarSign className="w-4 h-4 mr-1" />
            ₹{college.fees.toLocaleString()}/year
          </p>
        </div>
        <div className="mt-auto pt-6 flex items-center justify-between">
          <Link href={`/colleges/${college.slug}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
          <button
            onClick={() => addToCompare(college)}
            disabled={isInCompare}
            className={`px-4 py-2 rounded-md text-white font-semibold transition-colors ${isInCompare ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isInCompare ? 'Added' : 'Add to Compare'}
          </button>
        </div>
      </div>
    </div>
  );
};