'use client';

import { useState, useEffect } from 'react';

interface Loan {
  id: string;
  type: string;
  bank: string;
  amount: number;
  emi: number;
  status: string;
}

export default function LoanPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'KCC (Kisan Credit Card)',
    amount: '',
    purpose: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('loans') || '[]');
    setLoans(saved);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loan = {
      id: Date.now().toString(),
      type: formData.type,
      bank: 'Pending Assignment',
      amount: parseFloat(formData.amount),
      emi: Math.round(parseFloat(formData.amount) / 24),
      status: 'pending',
      purpose: formData.purpose
    };
    const updated = [...loans, loan];
    setLoans(updated);
    localStorage.setItem('loans', JSON.stringify(updated));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({ type: 'KCC (Kisan Credit Card)', amount: '', purpose: '' });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
          <p className="text-green-600">Bank representative will contact you within 48 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Loan Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Loans ({loans.length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {loans.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active loans</p>
            ) : (
              loans.map(loan => (
                <div key={loan.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{loan.type}</h3>
                      <p className="text-sm text-gray-500">{loan.bank}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${loan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-lg font-bold">₹{loan.amount.toLocaleString()}</p>
                  {loan.status === 'active' && <p className="text-sm text-gray-500">EMI: ₹{loan.emi.toLocaleString()}/month</p>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Apply for New Loan</h2>
          {!showForm ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Get quick agricultural loans</p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Start Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type *</label>
                <select 
                  className="w-full border rounded-lg px-4 py-2"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>KCC (Kisan Credit Card)</option>
                  <option>Tractor Loan</option>
                  <option>Equipment Loan</option>
                  <option>Warehouse Receipt Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Required (₹) *</label>
                <input 
                  type="number" 
                  required
                  min="10000"
                  className="w-full border rounded-lg px-4 py-2" 
                  placeholder="50000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea 
                  className="w-full border rounded-lg px-4 py-2" 
                  rows={2} 
                  placeholder="Describe your purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Apply Now</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-3 rounded-lg">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
