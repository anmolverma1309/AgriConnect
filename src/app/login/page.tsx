'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
    setLoggedIn(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  if (loggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Login Successful!</h2>
          <p className="text-green-600">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login to AgriConnect</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input 
              type="tel" 
              required
              pattern="[0-9]{10}"
              className="w-full border rounded-lg px-4 py-2" 
              placeholder="10 digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-2" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">Login</button>
        </form>
        <p className="text-center mt-4 text-gray-600">Don&apos;t have an account? <a href="/register" className="text-green-600 hover:underline">Register</a></p>
        <p className="text-center mt-2 text-xs text-gray-400">Demo: Use any 10 digit number and 6+ char password</p>
      </div>
    </div>
  );
}
