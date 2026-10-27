'use client';

import { useState } from 'react';

const BOOKS = [
  { id: '1', title: "Organic Farming Guide", author: "Dr. A. Singh", category: "Farming", pages: 120, rating: 4.5 },
  { id: '2', title: "Pest Management Handbook", author: "R. Kumar", category: "Protection", pages: 85, rating: 4.2 },
  { id: '3', title: "Soil Science Basics", author: "Dr. P. Patel", category: "Science", pages: 200, rating: 4.7 },
  { id: '4', title: "Modern Irrigation Systems", author: "S. Gupta", category: "Technology", pages: 150, rating: 4.3 },
  { id: '5', title: "Crop Rotation Guide", author: "M. Sharma", category: "Farming", pages: 95, rating: 4.1 },
  { id: '6', title: "Sustainable Agriculture", author: "Dr. K. Reddy", category: "Farming", pages: 180, rating: 4.6 },
];

export default function LibraryPage() {
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Farming', 'Protection', 'Science', 'Technology'];
  const filtered = category === 'All' ? BOOKS : BOOKS.filter(b => b.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Digital Library</h1>
      <p className="text-gray-600 mb-6">Access agricultural knowledge anytime, anywhere</p>
      
      <select 
        className="mb-6 border rounded-lg px-4 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{book.category}</span>
            <h3 className="font-semibold mt-2">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
            <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
              <span>{book.pages} pages</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span> {book.rating}
              </span>
            </div>
            <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Read Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
