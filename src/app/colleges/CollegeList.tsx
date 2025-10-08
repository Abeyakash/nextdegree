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

  const handleHeroSearch = useCallback((query: string, filters: Filters) => {
    const lowercasedQuery = query.toLowerCase();
    const results = initialColleges.filter((college: College) => {
      if (lowercasedQuery && !(college.name.toLowerCase().includes(lowercasedQuery) || college.courses.some(c => c.toLowerCase().includes(lowercasedQuery)))) return false;
      if (filters.location && filters.location !== 'All' && college.location !== filters.location) return false;
      return true;
    });
    setFilteredColleges(results);
  }, [initialColleges]);

  const allCourses = Array.from(new Set(initialColleges.flatMap((c: College) => c.courses))).sort();
  const allLocations = Array.from(new Set(initialColleges.map(c => c.location))).sort();

  return (
    <>
      <HeroSearch onSearch={handleHeroSearch} courses={allCourses} locations={allLocations} ratings={[]} feesRanges={[]} />
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