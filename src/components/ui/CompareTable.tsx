'use client';

import React from 'react';
import { useCompare } from '@/lib/compare-context';
import { DollarSign, Star, MapPin, Briefcase } from 'lucide-react';

export const CompareTable: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="overflow-x-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Compare Colleges</h2>
        <button 
          onClick={clearCompare} 
          className="text-red-600 font-semibold hover:underline"
        >
          Clear All
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Attribute</th>
            {compareList.map(college => (
              <th key={college.id} className="px-4 py-2 text-left">{college.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2 font-medium">Location</td>
            {compareList.map(c => <td key={c.id} className="px-4 py-2 flex items-center"><MapPin className="w-4 h-4 mr-1"/> {c.location}</td>)}
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2 font-medium">Courses</td>
            {compareList.map(c => <td key={c.id} className="px-4 py-2 flex items-center"><Briefcase className="w-4 h-4 mr-1"/> {c.courses.join(', ')}</td>)}
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2 font-medium">Fees</td>
            {compareList.map(c => <td key={c.id} className="px-4 py-2 flex items-center"><DollarSign className="w-4 h-4 mr-1"/> ₹{c.fees.toLocaleString()}/year</td>)}
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2 font-medium">Rating</td>
            {compareList.map(c => <td key={c.id} className="px-4 py-2 flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500"/> {c.rating.toFixed(1)}</td>)}
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2 font-medium">Students</td>
            {compareList.map(c => <td key={c.id} className="px-4 py-2">{c.students}</td>)}
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2 font-medium">Action</td>
            {compareList.map(c => (
              <td key={c.id} className="px-4 py-2">
                <button 
                  onClick={() => removeFromCompare(c.id)} 
                  className="text-red-600 hover:underline font-medium"
                >
                  Remove
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
