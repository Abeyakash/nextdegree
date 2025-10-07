'use client';

// 1. 'useCallback' ko yahan import karein
import React, { useState, useCallback } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, DollarSign, Star, Briefcase, ChevronRight } from 'lucide-react';
import { colleges, College } from '../../data/colleges';
import { HeroSearch, Filters } from '@/components/ui/HeroSearch';
import { useCompare } from '@/lib/compare-context';

// --- College Card Component (Aapka code, koi change nahi) ---
const CollegeCard: React.FC<{ college: College }> = ({ college }) => {
  const { addToCompare, compareList } = useCompare();
  const isInCompare = compareList.some(c => c.id === college.id);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={college.image} alt={college.name} fill className="object-cover" />
      </div>
      <div className="p-6">
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
        <div className="flex justify-between mt-4 items-center">
          <Link href={`/colleges/${college.slug}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
          <button
            onClick={() => addToCompare(college)}
            disabled={isInCompare}
            className={`px-4 py-2 rounded-md text-white font-semibold ${isInCompare ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isInCompare ? 'Added' : 'Add to Compare'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Compare Table Component (Aapka code, koi change nahi) ---
const CompareTable: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  if (compareList.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare Colleges</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Courses</th>
              <th className="p-2 border">Fees</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {compareList.map(college => (
              <tr key={college.id} className="hover:bg-gray-50">
                <td className="p-2 border">{college.name}</td>
                <td className="p-2 border">{college.location}</td>
                <td className="p-2 border">{college.rating.toFixed(1)}</td>
                <td className="p-2 border">{college.courses.join(', ')}</td>
                <td className="p-2 border">₹{college.fees.toLocaleString()}</td>
                <td className="p-2 border">
                  <button onClick={() => removeFromCompare(college.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button onClick={clearCompare} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Clear Compare
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Colleges Page ---
export default function CollegesPage() {
  const [filteredColleges, setFilteredColleges] = useState<College[]>(colleges);

  // 2. Search function ko 'useCallback' se wrap karein
  // Isse infinite loop band ho jayega
  const handleHeroSearch = useCallback((query: string, filters: Filters) => {
    const lowercasedQuery = query.toLowerCase();
    const results = colleges.filter(college => {
      if (lowercasedQuery) {
        const nameMatch = college.name.toLowerCase().includes(lowercasedQuery);
        const courseMatch = college.courses.some(c => c.toLowerCase().includes(lowercasedQuery));
        const locationMatch = college.location.toLowerCase().includes(lowercasedQuery);
        if (!nameMatch && !courseMatch && !locationMatch) {
          return false;
        }
      }
      if (filters.location && filters.location !== 'All' && college.location !== filters.location) return false;
      if (filters.fees && filters.fees !== 'All') {
        const [min, max] = filters.fees.split('-').map(Number);
        if (college.fees < min || college.fees > max) return false;
      }
      if (filters.rating && filters.rating !== 'All' && college.rating < Number(filters.rating)) return false;
      if (filters.course && filters.course !== 'All' && !college.courses.includes(filters.course)) return false;
      return true;
    });
    setFilteredColleges(results);
  }, []); // Empty array ka matlab hai yeh function sirf ek baar banega

  const allLocations = Array.from(new Set(colleges.map(c => c.location))).sort();
  const allCourses = Array.from(new Set(colleges.flatMap(c => c.courses))).sort();
  const allRatings = [4, 4.5, 5];
  const feesRanges = ['10000-20000', '20001-35000', '35001-50000'];

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSearch
          courses={allCourses}
          locations={allLocations}
          ratings={allRatings}
          feesRanges={feesRanges}
          onSearch={handleHeroSearch}
        />
        <CompareTable />
        <p className="text-lg text-gray-600 mb-6 mt-6 font-semibold">
          Showing {filteredColleges.length} result{filteredColleges.length !== 1 ? 's' : ''}
        </p>
        <div className="space-y-6">
          {filteredColleges.length > 0 ? (
            filteredColleges.map(college => <CollegeCard key={college.id} college={college} />)
          ) : (
            <div className="p-12 text-center bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-600">No Colleges Found</h3>
              <p className="text-gray-500 mt-2">Try widening your filters or selecting fewer options.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}