'use client';

import React, { useState, useEffect } from 'react';

export interface Filters {
  location: string;
  fees: string;
  rating: string;
  course: string;
}

interface HeroSearchProps {
  courses: string[];
  locations: string[];
  ratings: number[];
  feesRanges: string[];
  onSearch: (query: string, filters: Filters) => void;
  initialQuery?: string;
  initialFilters?: Partial<Filters>;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  courses,
  locations,
  ratings,
  feesRanges,
  onSearch,
  initialQuery = '',
  initialFilters,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    location: 'All',
    fees: 'All',
    rating: 'All',
    course: 'All',
    ...initialFilters,
  });

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!initialFilters) return;
    setFilters((prev) => ({
      ...prev,
      ...initialFilters,
    }));
  }, [initialFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query, filters);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, filters, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          id="search"
          type="text"
          placeholder="Search by college, course, or city..."
          value={query}
          onChange={handleInputChange}
          className="md:col-span-5 w-full p-3 rounded-md border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-black focus:border-black"
        />

        <select
          name="location"
          aria-label="Filter by Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 text-gray-900 focus:ring-black focus:border-black"
        >
          <option value="All">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          name="fees"
          aria-label="Filter by Fees"
          value={filters.fees}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 text-gray-900 focus:ring-black focus:border-black"
        >
          <option value="All">All Fees</option>
          {feesRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>

        <select
          name="rating"
          aria-label="Filter by Rating"
          value={filters.rating}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 text-gray-900 focus:ring-black focus:border-black"
        >
          <option value="All">All Ratings</option>
          {ratings.map((rating) => (
            <option key={rating} value={String(rating)}>
              {rating}★+
            </option>
          ))}
        </select>

        <select
          name="course"
          aria-label="Filter by Course"
          value={filters.course}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 text-gray-900 focus:ring-black focus:border-black"
        >
          <option value="All">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
