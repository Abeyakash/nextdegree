'use client';

import React from 'react';
import { useCompare } from '@/lib/compare-context';
import { College } from '@/data/colleges';
import { MapPin, DollarSign, Star, Briefcase, Users } from 'lucide-react';

export const CompareTable: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return null;
  }

  const highestRating = Math.max(...compareList.map((college) => college.rating));
  const lowestFee = Math.min(...compareList.map((college) => college.fees));

  const attributes = [
    { name: 'Location', icon: <MapPin className="w-4 h-4 mr-2" /> },
    { name: 'Courses', icon: <Briefcase className="w-4 h-4 mr-2" /> },
    { name: 'Fees', icon: <DollarSign className="w-4 h-4 mr-2" /> },
    { name: 'Rating', icon: <Star className="w-4 h-4 mr-2" /> },
    { name: 'Students', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Action', icon: <div className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Compare Colleges</h2>
        <button onClick={clearCompare} className="font-semibold text-red-600 hover:text-red-800 transition-colors">
          Clear All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-4 font-semibold text-gray-600 w-[15%]">Attribute</th>
              {compareList.map((college: College) => (
                <th key={college.id} className="p-4 font-bold text-gray-800">
                  {college.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute, index) => (
              <tr
                key={attribute.name}
                className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="p-4 font-semibold text-gray-700 flex items-center">
                  {attribute.icon}
                  {attribute.name}
                </td>
                {compareList.map((college: College) => (
                  <td key={`${college.id}-${attribute.name}`} className="p-4 text-gray-600">
                    {attribute.name === 'Location' && college.location}
                    {attribute.name === 'Courses' && college.courses.join(', ')}

                    {attribute.name === 'Fees' && (
                      <span className={college.fees === lowestFee ? 'font-bold text-green-600' : ''}>
                        Rs. {college.fees.toLocaleString()}/year
                      </span>
                    )}
                    {attribute.name === 'Rating' && (
                      <div
                        className={`flex items-center ${
                          college.rating === highestRating ? 'font-bold text-green-600' : ''
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 mr-1 ${
                            college.rating === highestRating
                              ? 'text-green-500 fill-green-500'
                              : 'text-yellow-500 fill-yellow-500'
                          }`}
                        />
                        {college.rating.toFixed(1)}
                      </div>
                    )}

                    {attribute.name === 'Students' && college.students}
                    {attribute.name === 'Action' && (
                      <button
                        onClick={() => removeFromCompare(college.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
