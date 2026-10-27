'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description: string;
  seller: string;
}

export default function BuyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<string[]>([]);

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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(filter.toLowerCase()) ||
                         p.seller.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Farm Shop</h1>
        <a href="/cart" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Cart ({cart.length})
        </a>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="flex-1 max-w-md border rounded-lg px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select 
          className="border rounded-lg px-4 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{p.category}</span>
            <h3 className="font-semibold text-lg mt-2">{p.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{p.description}</p>
            <p className="text-sm text-gray-600 mb-2">Seller: {p.seller}</p>
            <p className="text-sm text-gray-500">Stock: {p.stock} {p.unit}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xl font-bold text-green-600">₹{p.price}</span>
              <button 
                onClick={() => addToCart(p.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
