'use client';

import { useEffect, useState } from 'react';

interface Price {
  crop: string;
  market: string;
  price: number;
  change: number;
  unit: string;
  state?: string;
}

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/prices');
      if (!res.ok) throw new Error('Failed to fetch prices');
      const data = await res.json();
      setPrices(data.prices || []);
      setLastUpdated(data.updatedAt || new Date().toISOString());
    } catch (err) {
      setError('Unable to load prices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = prices.filter(p => 
    p.crop?.toLowerCase().includes(filter.toLowerCase()) ||
    p.market?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Live Mandi Prices</h1>
      <p className="text-gray-600 mb-6">Real-time crop prices from major agricultural markets across India</p>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by crop or market..." 
          className="w-full max-w-md border rounded-lg px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live mandi prices...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
          <button onClick={fetchPrices} className="ml-auto text-red-700 underline">Retry</button>
        </div>
      )}

      {!loading && !error && prices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No price data available</p>
        </div>
      )}

      {!loading && !error && prices.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (₹/Quintal)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrices.map((price, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{price.crop}</td>
                <td className="px-6 py-4 text-gray-600">{price.market}</td>
                <td className="px-6 py-4 font-bold">₹{price.price.toLocaleString()}</td>
                <td className={`px-6 py-4 ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {price.change >= 0 ? '+' : ''}{price.change}%
                </td>
                <td className="px-6 py-4">
                  {price.change >= 0 ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
            <p>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Loading...'}</p>
            <button onClick={fetchPrices} className="text-green-600 hover:underline mt-2">Refresh Now</button>
        <p className="mt-2">Data sourced from AGMARKNET and local mandi committees</p>
      </div>
    </div>
  );
}
