'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  windspeed: number;
  condition: string;
}

interface PriceData {
  crop: string;
  price: number;
  change: number;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [wheatPrice, setWheatPrice] = useState<PriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState(3);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setWeatherLoading(false);
      })
      .catch(() => setWeatherLoading(false));
    
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => {
        const wheat = data.prices?.find((p: PriceData) => p.crop === 'Wheat');
        setWheatPrice(wheat);
        setPriceLoading(false);
      })
      .catch(() => setPriceLoading(false));

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setPendingTasks(tasks.filter((t: any) => t.status === 'pending').length || 3);
  }, []);
  const features = [
    { icon: "cpu", title: "AI Tools Hub", desc: "Intelligent assistants for diagnosis and forecasting", href: "/tools" },
    { icon: "shopping-cart", title: "Marketplace", desc: "Buy and sell crops directly from farmers", href: "/buy" },
    { icon: "users", title: "Hire Labour", desc: "Find skilled agricultural labourers", href: "/hire-labour" },
    { icon: "clipboard", title: "Farm Log & Tasks", desc: "Track yields, costs, and daily tasks", href: "/farmlog" },
    { icon: "dollar-sign", title: "Live Mandi Prices", desc: "Real-time crop prices from markets", href: "/prices" },
    { icon: "book-open", title: "Knowledge Hub", desc: "Video tutorials and expert sessions", href: "/knowledge-hub" },
    { icon: "shield", title: "Crop Insurance", desc: "Secure your harvest with insurance plans", href: "/insurance" },
    { icon: "lock", title: "Digital Locker", desc: "Store land records and documents securely", href: "/digilocker" },
    { icon: "tool", title: "Tool Rental", desc: "Rent agricultural tools easily", href: "/rent-tools" },
    { icon: "shopping-bag", title: "Farm Shop", desc: "Seeds, fertilizers, and supplies", href: "/shop" },
    { icon: "trending-up", title: "Price Forecasts", desc: "AI-powered market price predictions", href: "/prices" },
    { icon: "credit-card", title: "Loan Portal", desc: "Manage agricultural loans", href: "/loan" },
    { icon: "phone-call", title: "Support Helpline", desc: "24/7 expert assistance", href: "/support" },
  ];

  const steps = [
    { title: "Diagnose & Plan", desc: "Use AI tools to diagnose crop issues and create a farming plan" },
    { title: "Buy Quality Inputs", desc: "Purchase certified seeds and equipment from trusted suppliers" },
    { title: "Track Progress", desc: "Log activities and monitor performance with the dashboard" },
    { title: "Sell at Best Price", desc: "Check mandi prices and list produce for verified buyers" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Harvesting a Better Tomorrow, Today.</h1>
          <p className="text-xl mb-8 max-w-2xl">Welcome to AgriConnect, the digital backbone for India&apos;s farmers. Real-time data, a thriving marketplace, and intelligent tools to boost your yield and income.</p>
          <div className="flex gap-4">
            <Link href="#features" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Explore All Tools</Link>
            <Link href="/sell" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">List Your Crop</Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <strong className="block text-gray-700">{weatherLoading ? 'Loading Weather...' : (weather?.location || 'Bannikuppe Weather')}</strong>
                <span className="text-gray-500">{weatherLoading ? 'Fetching data...' : (weather ? `${weather.temperature}°C, ${weather.condition}` : 'Weather unavailable')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <strong className="block text-gray-700">Today&apos;s Wheat Price</strong>
                <span className="text-gray-500">{priceLoading ? 'Fetching price...' : (wheatPrice ? `₹${wheatPrice.price}/quintal (${wheatPrice.change > 0 ? '+' : ''}${wheatPrice.change}%)` : 'Price unavailable')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <div>
                <strong className="block text-gray-700">Pending Tasks</strong>
                <Link href="/farmlog" className="text-green-600 hover:underline">{pendingTasks} tasks pending</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">One Platform, Every Farming Solution</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From seed to market, AgriConnect provides the tools you need to thrive in modern agriculture.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon === 'cpu' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />}
                    {feature.icon === 'shopping-cart' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />}
                    {feature.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                    {feature.icon === 'clipboard' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
                    {feature.icon === 'dollar-sign' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {feature.icon === 'book-open' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                    {feature.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                    {feature.icon === 'lock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                    {feature.icon === 'tool' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                    {feature.icon === 'shopping-bag' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                    {feature.icon === 'trending-up' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                    {feature.icon === 'credit-card' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />}
                    {feature.icon === 'phone-call' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.desc}</p>
                <Link href={feature.href} className="text-green-600 font-medium hover:text-green-700 transition">Explore &rarr;</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Farming Cycle, Upgraded</h2>
            <p className="text-gray-600">Follow these steps to maximize your farm&apos;s potential with AgriConnect.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Farmers Say</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <blockquote className="text-gray-700 italic mb-4">&quot;AgriConnect is a game-changer. The AI diagnosis saved my tomato crop, and the live mandi prices helped me increase my profits by over 20% last season.&quot;</blockquote>
              <cite className="text-gray-600 font-medium">- Ramesh Kumar, Farmer from Hisar, Haryana</cite>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <blockquote className="text-gray-700 italic mb-4">&quot;The Farm Log is brilliant. For the first time, I have all my data in one place. The AI task suggestions remind me of important activities I used to forget.&quot;</blockquote>
              <cite className="text-gray-600 font-medium">- Sunita Devi, Farmer from Nashik, Maharashtra</cite>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <blockquote className="text-gray-700 italic mb-4">&quot;I used the AI Price Forecaster before taking my ragi to the market and waited two more weeks as it suggested. I made an extra ₹8,000! This tool is pure magic.&quot;</blockquote>
              <cite className="text-gray-600 font-medium">- Ganesh Murthy, Farmer from Mandya, Karnataka</cite>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
