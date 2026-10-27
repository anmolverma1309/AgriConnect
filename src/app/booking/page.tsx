'use client';

import { useState, useEffect } from 'react';

interface Booking {
  id: string;
  type: string;
  item: string;
  date: string;
  workers?: number;
  days?: number;
  location: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(saved.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const cancelBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No bookings yet</p>
          <div className="flex justify-center gap-4">
            <a href="/hire-labour" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Hire Labour</a>
            <a href="/rent-tools" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Rent Tools</a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{booking.item}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${booking.type === 'labour' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                      {booking.type === 'labour' ? 'Labour' : 'Tool Rental'}
                    </span>
                  </div>
                  <p className="text-gray-500">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  {booking.days && <p className="text-gray-500">Duration: {booking.days} days</p>}
                  <p className="text-gray-500">Location: {booking.location}</p>
                  <p className="text-green-600 font-medium">₹{booking.price}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {booking.status}
                  </span>
                  <button 
                    onClick={() => cancelBooking(booking.id)}
                    className="block mt-2 text-red-500 text-sm hover:text-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
