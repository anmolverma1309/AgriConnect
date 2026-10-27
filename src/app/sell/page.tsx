'use client';

import { useState } from 'react';

export default function SellPage() {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    price: '',
    market: 'Azadpur',
    description: '',
    location: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const listing = {
      id: Date.now().toString(),
      ...formData,
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      status: 'active',
      createdAt: new Date().toISOString(),
      userId: 'current-user'
    };
    
    const existingListings = JSON.parse(localStorage.getItem('listings') || '[]');
    localStorage.setItem('listings', JSON.stringify([...existingListings, listing]));
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ cropName: '', quantity: '', price: '', market: 'Azadpur', description: '', location: '' });
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Listing Created!</h2>
          <p className="text-green-600">Your produce has been listed for sale. Buyers will contact you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sell Your Produce</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
              <input 
                type="text" 
                required
                className="w-full border rounded-lg px-4 py-2" 
                placeholder="e.g., Wheat, Rice, Tomato"
                value={formData.cropName}
                onChange={(e) => setFormData({...formData, cropName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Quintals) *</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full border rounded-lg px-4 py-2" 
                placeholder="50"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (₹/Quintal) *</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full border rounded-lg px-4 py-2" 
                placeholder="2150"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market *</label>
              <select 
                className="w-full border rounded-lg px-4 py-2"
                value={formData.market}
                onChange={(e) => setFormData({...formData, market: e.target.value})}
              >
                <option>Azadpur, Delhi</option>
                <option>Vashi, Mumbai</option>
                <option>Khanna, Punjab</option>
                <option>Lasalgaon, Nashik</option>
                <option>Rajkot, Gujarat</option>
                <option>Indore, MP</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Location *</label>
            <input 
              type="text" 
              required
              className="w-full border rounded-lg px-4 py-2" 
              placeholder="Village, District, State"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full border rounded-lg px-4 py-2" 
              rows={3} 
              placeholder="Quality, variety, harvest date, moisture content, etc."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your phone number from profile will be shared with interested buyers</span>
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">List for Sale</button>
        </form>
      </div>
    </div>
  );
}
