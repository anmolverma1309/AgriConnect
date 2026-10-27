'use client';

import { useState } from 'react';

const REELS = [
  { id: '1', title: "Harvesting Tips for Wheat", author: "Farmer Rajesh", views: "12K", likes: "1.2K", duration: "0:45" },
  { id: '2', title: "Organic Pest Control Methods", author: "Green Farms", views: "8.5K", likes: "890", duration: "1:12" },
  { id: '3', title: "Drip Irrigation Setup Guide", author: "AgriTech", views: "25K", likes: "3.1K", duration: "0:58" },
  { id: '4', title: "Soil Preparation Before Sowing", author: "Krishna", views: "15K", likes: "1.5K", duration: "0:42" },
  { id: '5', title: "Tomato Plant Care Tips", author: "Anmol Verma", views: "9.2K", likes: "980", duration: "1:05" },
  { id: '6', title: "Tractor Maintenance Basics", author: "Ramesh Mechanic", views: "18K", likes: "2.2K", duration: "1:30" },
];

export default function ReelsPage() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Farmer Reels</h1>
      <p className="text-gray-600 mb-6">Short farming tips and tricks from the community</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REELS.map((reel) => (
          <div key={reel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-80 bg-gray-900 flex items-center justify-center relative group cursor-pointer">
              {playing === reel.id ? (
                <div className="text-white text-center">
                  <div className="animate-pulse text-green-400 text-lg">▶ Playing...</div>
                  <p className="text-sm text-gray-400 mt-2">{reel.title}</p>
                  <button 
                    onClick={() => setPlaying(null)}
                    className="mt-4 bg-white/20 px-4 py-2 rounded text-sm"
                  >
                    Stop
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 text-white/80 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{reel.duration}</span>
                  <div 
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"
                    onClick={() => setPlaying(reel.id)}
                  />
                </>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{reel.title}</h3>
              <p className="text-sm text-gray-500">{reel.author}</p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                <span>{reel.views} views</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {reel.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
