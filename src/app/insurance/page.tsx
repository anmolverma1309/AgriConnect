'use client';

import { useState } from 'react';

const PLANS = [
  { name: "Basic Cover", price: 199, color: "green", coverage: 50000, features: ["Crop loss due to natural calamities", "Coverage up to ₹50,000", "Quick claim settlement"] },
  { name: "Standard Cover", price: 499, color: "blue", coverage: 150000, features: ["All Basic features", "Coverage up to ₹1,50,000", "Pest & disease coverage", "AI advisory included"] },
  { name: "Premium Cover", price: 999, color: "purple", coverage: 500000, features: ["All Standard features", "Coverage up to ₹5,00,000", "Market price protection", "24/7 expert support"] },
];

export default function InsurancePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({ cropType: '', area: '', location: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quote = {
      id: Date.now().toString(),
      plan: selectedPlan,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('insuranceQuotes') || '[]');
    localStorage.setItem('insuranceQuotes', JSON.stringify([...existing, quote]));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedPlan(null);
    setFormData({ cropType: '', area: '', location: '' });
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Quote Requested!</h2>
          <p className="text-green-600">Our insurance partner will contact you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Crop Insurance</h1>
      <p className="text-gray-600 mb-8">Protect your harvest with comprehensive crop insurance plans</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${plan.color === 'green' ? 'border-green-500' : plan.color === 'blue' ? 'border-blue-500' : 'border-purple-500'}`}>
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className={`text-3xl font-bold mb-1 ${plan.color === 'green' ? 'text-green-600' : plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>₹{plan.price}<span className="text-sm text-gray-500">/year</span></p>
            <p className="text-sm text-gray-500 mb-4">Coverage up to ₹{plan.coverage.toLocaleString()}</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {plan.features.map((f, i) => <li key={i}>✓ {f}</li>)}
            </ul>
            <button 
              onClick={() => setSelectedPlan(plan.name)}
              className={`w-full text-white py-2 rounded-lg hover:opacity-90 ${plan.color === 'green' ? 'bg-green-600' : plan.color === 'blue' ? 'bg-blue-600' : 'bg-purple-600'}`}
            >
              Get Quote
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">Request Quote: {selectedPlan}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type *</label>
              <input 
                type="text" 
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="e.g., Wheat, Rice, Cotton"
                value={formData.cropType}
                onChange={(e) => setFormData({...formData, cropType: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (acres) *</label>
              <input 
                type="number" 
                required
                min="0.1"
                step="0.1"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="2.5"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input 
                type="text" 
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Village, District"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Submit Request</button>
              <button type="button" onClick={() => setSelectedPlan(null)} className="bg-gray-300 px-4 py-3 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
