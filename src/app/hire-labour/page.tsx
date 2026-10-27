'use client';

import { useState, useEffect } from 'react';

interface Labourer {
  id: string;
  name: string;
  phone: string;
  skills: string;
  location: string;
  pricePerDay: number;
  available: boolean;
  rating: number;
}

export default function HireLabourPage() {
  const [labourers, setLabourers] = useState<Labourer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<{workerId: string, date: string, days: number} | null>(null);

  useEffect(() => {
    const fetchLabour = async () => {
      try {
        const response = await fetch('/api/labour');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setLabourers(data.labourers || []);
      } catch (err) {
        console.error('Error fetching labour:', err);
        setError('Failed to load labour data');
      } finally {
        setLoading(false);
      }
    };
    fetchLabour();
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    
    const worker = labourers.find(l => l.id === booking.workerId);
    if (!worker) return;

    const newBooking = {
      id: Date.now().toString(),
      type: 'labour',
      item: worker.name,
      date: booking.date,
      workers: 1,
      days: booking.days,
      location: worker.location,
      price: worker.pricePerDay * booking.days,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, newBooking]));
    
    alert(`Booking request sent to ${worker.name}! They will contact you soon.`);
    setBooking(null);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mr-3"></div>
        <span className="text-gray-600">Loading available workers...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-700 underline"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Hire Labour</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Workers ({labourers.filter(l => l.available).length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {labourers.filter(l => l.available).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No workers available right now</p>
                <p className="text-sm mt-2">Check back later or contact support</p>
              </div>
            ) : (
              <>
              {labourers.filter(l => l.available).map(worker => (
              <div key={worker.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{worker.name}</h3>
                    <p className="text-sm text-gray-500">{worker.skills}</p>
                    <p className="text-xs text-gray-400">{worker.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{worker.rating}/5</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold">₹{worker.pricePerDay}/day</span>
                    <p className="text-xs text-gray-500">{worker.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setBooking({workerId: worker.id, date: '', days: 1})}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Book Now
                </button>
              </div>
              ))}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Book Worker</h2>
          {booking ? (
            <form onSubmit={handleBooking} className="space-y-4">
              {(() => {
                const worker = labourers.find(l => l.id === booking.workerId);
                return worker ? (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-gray-600">₹{worker.pricePerDay}/day</p>
                  </div>
                ) : null;
              })()}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Date *</label>
                <input 
                  type="date" 
                  required
                  className="w-full border rounded-lg px-4 py-2"
                  value={booking.date}
                  onChange={(e) => setBooking({...booking, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days *</label>
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
                  const w = labourers.find(l => l.id === booking.workerId);
                  return w ? w.pricePerDay * booking.days : 0;
                })()}</span></p>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Confirm Booking</button>
                <button type="button" onClick={() => setBooking(null)} className="bg-gray-300 px-4 py-3 rounded-lg">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Select a worker to book</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
