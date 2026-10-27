'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  seller: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products));
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const addToCart = (productId: string) => {
    const newCart = [...cart, productId];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert('Added to cart!');
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = category === 'All' ? products : products.filter(p => p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Farm Shop</h1>
          <select 
            className="mt-2 border rounded-lg px-3 py-1 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <a href="/cart" className="bg-green-600 text-white px-4 py-2 rounded-lg">Cart ({cart.length})</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{p.category}</span>
            <h3 className="font-medium mt-2">{p.name}</h3>
            <p className="text-xs text-gray-500">{p.seller}</p>
            <p className="text-lg font-bold text-green-600">₹{p.price}/{p.unit}</p>
            <p className="text-xs text-gray-400">Stock: {p.stock}</p>
            <button 
              onClick={() => addToCart(p.id)}
              className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
