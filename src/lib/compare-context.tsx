'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { College } from '../data/colleges';

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (collegeId: number) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<College[]>([]);

  const addToCompare = (college: College) => {
    setCompareList(prev => {
      if (prev.find(c => c.id === college.id)) return prev; // Already in list
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, college];
    });
  };

  const removeFromCompare = (collegeId: number) => {
    setCompareList(prev => prev.filter(c => c.id !== collegeId));
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
