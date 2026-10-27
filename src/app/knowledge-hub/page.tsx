'use client';

import { useState } from 'react';

const VIDEOS = [
  { id: '1', title: "Modern Agricultural Practices", category: "Tutorial", duration: "25 min", author: "Dr. Rajesh Kumar", views: "15K" },
  { id: '2', title: "Drip Irrigation Techniques", category: "Live Session", duration: "45 min", author: "Dr. Ramesh Gupta", views: "8.5K" },
  { id: '3', title: "Organic Farming Basics", category: "Tutorial", duration: "12 min", author: "Krishna Farms", views: "32K" },
  { id: '4', title: "Pest Management", category: "Tutorial", duration: "18 min", author: "AgriLife Solutions", views: "21K" },
  { id: '5', title: "Soil Health & Fertility", category: "Tutorial", duration: "15 min", author: "Green Earth", views: "19K" },
  { id: '6', title: "Kharif Crop Planning", category: "Seasonal Guide", duration: "30 min", author: "KVK Extension", views: "12K" },
];

const UPCOMING = [
  { title: "Post-Harvest Management", date: "Apr 10, 4:00 PM", speaker: "Dr. Sunita Devi" },
  { title: "Organic Fertilizer Making", date: "Apr 15, 5:00 PM", speaker: "Ramesh Organic" },
];

export default function KnowledgeHubPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Tutorial', 'Live Session', 'Seasonal Guide'];
  const filtered = filter === 'All' ? VIDEOS : VIDEOS.filter(v => v.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Knowledge Hub</h1>
      
      <div className="mb-6">
        <select 
          className="border rounded-lg px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map(video => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="bg-gray-200 h-48 flex items-center justify-center relative">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{video.duration}</span>
            </div>
            <div className="p-6">
              <span className={`text-xs font-medium px-2 py-1 rounded ${video.category === 'Live Session' ? 'bg-blue-100 text-blue-600' : video.category === 'Tutorial' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>{video.category}</span>
              <h3 className="text-lg font-semibold mt-2">{video.title}</h3>
              <p className="text-sm text-gray-500">{video.author}</p>
              <p className="text-xs text-gray-400 mt-1">{video.views} views</p>
              <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Watch Now</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Upcoming Live Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UPCOMING.map((session, i) => (
          <div key={i} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Upcoming</span>
            <h3 className="font-medium mt-2">{session.title}</h3>
            <p className="text-sm text-blue-600">{session.date}</p>
            <p className="text-sm text-gray-500">Speaker: {session.speaker}</p>
            <button className="mt-2 text-blue-600 font-medium hover:underline">Set Reminder</button>
          </div>
        ))}
      </div>
    </div>
  );
}
