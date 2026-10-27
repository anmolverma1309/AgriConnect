'use client';

import { useState, useEffect } from 'react';

interface CropPlan {
  id: string;
  name: string;
  area: number;
  season: string;
  status: string;
  createdAt: string;
}

const SEASONS = ['Kharif (June-Oct)', 'Rabi (Nov-Apr)', 'Zaid (Apr-June)'];

export default function PlannerPage() {
  const [plans, setPlans] = useState<CropPlan[]>([]);
  const [formData, setFormData] = useState({ name: 'Wheat', area: '', season: 'Kharif (June-Oct)' });
  const [generated, setGenerated] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cropPlans') || '[]');
    setPlans(saved);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const plan: CropPlan = {
      id: Date.now().toString(),
      name: formData.name,
      area: parseFloat(formData.area),
      season: formData.season,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    const updated = [...plans, plan];
    setPlans(updated);
    localStorage.setItem('cropPlans', JSON.stringify(updated));
    
    // Generate plan text
    const planText = generatePlanText(plan);
    setGenerated(planText);
  };

  const generatePlanText = (plan: CropPlan) => {
    const schedules: Record<string, string[]> = {
      'Kharif (June-Oct)': ['June: Land preparation', 'July: Sowing', 'Aug: First irrigation', 'Sep: Fertilizer application', 'Oct: Harvest'],
      'Rabi (Nov-Apr)': ['Nov: Land preparation', 'Dec: Sowing', 'Jan: Irrigation', 'Feb: Pest control', 'Mar-Apr: Harvest'],
      'Zaid (Apr-June)': ['Apr: Quick land prep', 'May: Sowing', 'May-June: Regular irrigation', 'June: Early harvest']
    };
    
    return `
📋 FARMING PLAN FOR ${plan.name.toUpperCase()}

Area: ${plan.area} acres
Season: ${plan.season}

📅 SCHEDULE:
${schedules[plan.season].map(s => `• ${s}`).join('\n')}

💡 RECOMMENDATIONS:
• Use certified seeds
• Test soil before planting
• Maintain proper spacing
• Monitor for pests regularly
    `.trim();
  };

  const deletePlan = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    localStorage.setItem('cropPlans', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Farming Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop *</label>
              <select 
                className="w-full border rounded-lg px-4 py-2"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              >
                <option>Wheat</option>
                <option>Rice</option>
                <option>Tomato</option>
                <option>Cotton</option>
                <option>Soybean</option>
                <option>Maize</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (acres) *</label>
              <input 
                type="number" 
                required
                min="0.1"
                step="0.1"
                className="w-full border rounded-lg px-4 py-2" 
                placeholder="2"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season *</label>
              <select 
                className="w-full border rounded-lg px-4 py-2"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
              >
                {SEASONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Generate Plan</button>
          </form>

          {generated && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Generated Plan</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{generated}</pre>
              <button 
                onClick={() => setGenerated(null)}
                className="mt-2 text-sm text-green-600 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Plans ({plans.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {plans.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No plans created yet</p>
            ) : (
              plans.map(plan => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.area} acres • {plan.season}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{plan.status}</span>
                      <button 
                        onClick={() => deletePlan(plan.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
