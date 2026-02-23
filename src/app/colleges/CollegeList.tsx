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
  initialQuery?: string;
}

const normalizeCourses = (courses: unknown): string[] => {
  if (Array.isArray(courses)) {
    return courses.filter((course): course is string => typeof course === 'string');
  }
  if (typeof courses === 'string') {
    return courses.split(',').map((course) => course.trim()).filter(Boolean);
  }
  return [];
};

export default function CollegeList({
  initialColleges,
  userId,
  favoriteCollegeIds,
  initialQuery = '',
}: CollegeListProps) {
  const [filteredColleges, setFilteredColleges] = useState<College[]>(initialColleges);

  const handleHeroSearch = useCallback((query: string, filters: Filters) => {
    const lowercasedQuery = query.trim().toLowerCase();
    
    const results = initialColleges.filter((college: College) => {
      const normalizedCourses = normalizeCourses((college as unknown as { courses?: unknown }).courses);
      const normalizedCoursesLower = normalizedCourses.map((course) => course.toLowerCase());
      const normalizedLocation = String((college as unknown as { location?: unknown }).location ?? '').trim().toLowerCase();
      const normalizedName = String((college as unknown as { name?: unknown }).name ?? '').trim().toLowerCase();

      if (lowercasedQuery) {
        const nameMatch = normalizedName.includes(lowercasedQuery);
        const courseMatch = normalizedCoursesLower.some((course) => course.includes(lowercasedQuery));
        const locationMatch = normalizedLocation.includes(lowercasedQuery);
        if (!nameMatch && !courseMatch && !locationMatch) {
          return false;
        }
      }

      if (
        filters.location &&
        filters.location !== 'All' &&
        !normalizedLocation.includes(filters.location.trim().toLowerCase())
      ) {
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
      
      if (
        filters.course &&
        filters.course !== 'All' &&
        !normalizedCoursesLower.some((course) => course.includes(filters.course.trim().toLowerCase()))
      ) {
        return false;
      }

      return true;
    });
    
    setFilteredColleges(results);
  }, [initialColleges]);

  const allCourses = Array.from(
    new Set(initialColleges.flatMap((c: College) => normalizeCourses((c as unknown as { courses?: unknown }).courses)))
  ).sort();
  const allLocations = Array.from(new Set(initialColleges.map(c => c.location))).sort();
  const allRatings = [4.0, 4.5];
  const feesRanges = ['0-30000', '30001-60000', '60001-150000'];

  return (
    <>
      <HeroSearch 
        onSearch={handleHeroSearch} 
        courses={allCourses} 
        locations={allLocations} 
        ratings={allRatings} 
        feesRanges={feesRanges} 
        initialQuery={initialQuery}
      />
      <CompareTable />
      <p className="text-lg text-gray-600 mb-6 mt-6 font-semibold">
        Showing {filteredColleges.length} result{filteredColleges.length !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
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
