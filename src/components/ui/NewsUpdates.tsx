// src/components/ui/NewsUpdates.tsx
'use client';

import React from "react";
import { Calendar } from "lucide-react";

const updates = [
  {
    id: 1,
    title: "IIT Bombay Admission 2025 Open",
    date: "Sept 25, 2025",
    description: "Applications for B.Tech, M.Tech, and PhD programs are now open.",
  },
  {
    id: 2,
    title: "Mumbai University Cutoff List Released",
    date: "Sept 20, 2025",
    description: "First merit list for engineering admissions is published.",
  },
  {
    id: 3,
    title: "VJTI Mumbai Placement Drive Announced",
    date: "Sept 18, 2025",
    description: "Top recruiters like TCS, Infosys, and Accenture will participate.",
  },
];

export default function NewsUpdates() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📢 News & Updates</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {updates.map((news) => (
            <div
              key={news.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {news.date}
              </div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{news.title}</h3>
              <p className="text-gray-600 text-sm">{news.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
