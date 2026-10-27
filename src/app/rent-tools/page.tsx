'use client';

import { useState, useEffect } from 'react';

interface Tool {
  id: string;
  name: string;
  owner: string;
  location: string;
  pricePerDay: number;
  available: boolean;
  description: string;
}

export default function RentToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{toolId: string, date: string, days: number} | null>(null);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setTools(data.tools || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tools:', err);
        setLoading(false);
      });
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    
    const tool = tools.find(t => t.id === booking.toolId);
    if (!tool) return;

    const newBooking = {
      id: Date.now().toString(),
      type: 'tool',
      item: tool.name,
      date: booking.date,
      days: booking.days,
      location: tool.location,
      price: tool.pricePerDay * booking.days,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, newBooking]));
    
    alert(`Rental request for ${tool.name} submitted! Owner will contact you.`);
    setBooking(null);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mr-3"></div>
        <span className="text-gray-600">Loading available tools...</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Rent Agricultural Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.filter(t => t.available).map((tool) => (
          <div key={tool.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">{tool.name}</h3>
            <p className="text-sm text-gray-500">{tool.description}</p>
            <p className="text-xs text-gray-400">Owner: {tool.owner}</p>
            <p className="text-xs text-gray-400">{tool.location}</p>
            <p className="text-xl font-bold text-green-600 mt-2">₹{tool.pricePerDay}<span className="text-sm text-gray-500">/day</span></p>
            <button 
              onClick={() => setBooking({toolId: tool.id, date: '', days: 1})}
              className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Rent Now
            </button>
          </div>
        ))}
      </div>

      {booking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Book Tool</h3>
            {(() => {
              const tool = tools.find(t => t.id === booking.toolId);
              return tool ? (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-sm text-gray-600">₹{tool.pricePerDay}/day</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rental Date *</label>
                    <input 
                      type="date" 
                      required
                      className="w-full border rounded-lg px-4 py-2"
                      value={booking.date}
                      onChange={(e) => setBooking({...booking, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Days *</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      className="w-full border rounded-lg px-4 py-2"
                      value={booking.days}
                      onChange={(e) => setBooking({...booking, days: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">Total Cost: <span className="font-bold">₹{(() => {
                      const t = tools.find(tool => tool.id === booking.toolId);
                      return t ? t.pricePerDay * booking.days : 0;
                    })()}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">Confirm</button>
                    <button type="button" onClick={() => setBooking(null)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
