'use client';

import React, { useState, useCallback } from 'react';
import { HeroSearch, Filters } from '@/components/ui/HeroSearch';
import CollegeCard from '@/components/CollegeCard';
import { CompareTable } from '@/components/ui/CompareTable';
import { College } from '@/data/colleges';

interface CollegeListProps {
  initialColleges: College[];
  userId: string | null | undefined;
  favoriteCollegeIds: Set<number>;
}

export default function CollegeList({ initialColleges, userId, favoriteCollegeIds }: CollegeListProps) {
  const [filteredColleges, setFilteredColleges] = useState<College[]>(initialColleges);

  // --- FIX YAHAN HAI ---
  const handleHeroSearch = useCallback((query: string, filters: Filters) => {
    const lowercasedQuery = query.toLowerCase();
    
    const results = initialColleges.filter((college: College) => {
      // Search Text Filter
      if (lowercasedQuery) {
          const nameMatch = college.name.toLowerCase().includes(lowercasedQuery);
          const courseMatch = college.courses.some(c => c.toLowerCase().includes(lowercasedQuery));
          const locationMatch = college.location.toLowerCase().includes(lowercasedQuery);
          if (!nameMatch && !courseMatch && !locationMatch) {
              return false;
          }
      }

      // Dropdown Filters
      if (filters.location && filters.location !== 'All' && college.location !== filters.location) {
        return false;
      }
      
      if (filters.fees && filters.fees !== 'All') {
        const [min, max] = filters.fees.split('-').map(Number);
        if (college.fees < min || college.fees > max) {
          return false;
        }
      }
      
      if (filters.rating && filters.rating !== 'All' && college.rating < Number(filters.rating)) {
        return false;
      }
      
      if (filters.course && filters.course !== 'All' && !college.courses.includes(filters.course)) {
        return false;
      }

      return true;
    });
    
    setFilteredColleges(results);
  }, [initialColleges]);
  // --- END OF FIX ---

  const allCourses = Array.from(new Set(initialColleges.flatMap((c: College) => c.courses))).sort();
  const allLocations = Array.from(new Set(initialColleges.map(c => c.location))).sort();
  const allRatings = [4.0, 4.5]; // Example ratings
  const feesRanges = ['0-30000', '30001-60000', '60001-150000']; // Example fee ranges

  return (
    <>
      <HeroSearch 
        onSearch={handleHeroSearch} 
        courses={allCourses} 
        locations={allLocations} 
        ratings={allRatings} 
        feesRanges={feesRanges} 
      />
      <CompareTable />
      <p className="text-lg text-gray-600 mb-6 mt-6 font-semibold">
        Showing {filteredColleges.length} result{filteredColleges.length !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredColleges.map((college: College) => (
          <CollegeCard
            key={college.id}
            college={college}
            userId={userId}
            isFavorited={favoriteCollegeIds.has(college.id)}
          />
        ))}
      </div>
    </>
  );
}