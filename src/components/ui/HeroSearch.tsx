'use client';

import React, { useState, useEffect } from 'react';

// Yeh Filters type export karna zaroori hai taaki page isse use kar sake
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
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  courses,
  locations,
  ratings,
  feesRanges,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    location: 'All',
    fees: 'All',
    rating: 'All',
    course: 'All',
  });

  // Yeh hook search ko automatic (live) banata hai
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Search Input */}
        <input
          id="search"
          type="text"
          placeholder="Search by college, course, or city..."
          value={query}
          onChange={handleInputChange}
          className="md:col-span-5 w-full p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        
        {/* Location Filter */}
        <select
          name="location"
          aria-label="Filter by Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {/* Fees Filter */}
        <select
          name="fees"
          aria-label="Filter by Fees"
          value={filters.fees}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All Fees</option>
          {feesRanges.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          name="rating"
          aria-label="Filter by Rating"
          value={filters.rating}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All Ratings</option>
          {ratings.map(r => (
            <option key={r} value={String(r)}>{r}★+</option>
          ))}
        </select>

        {/* Course Filter */}
        <select
          name="course"
          aria-label="Filter by Course"
          value={filters.course}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All Courses</option>
          {courses.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

      </div>
    </div>
  );
};

