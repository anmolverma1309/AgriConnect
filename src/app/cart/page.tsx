'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface CartItem extends Product {
  qty: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartIds = JSON.parse(localStorage.getItem('cart') || '[]');
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const productMap = new Map(data.products.map((p: Product) => [p.id, p]));
        const cartItems = cartIds.map((id: string) => {
          const product = productMap.get(id);
          return product ? { ...product, qty: 1 } : null;
        }).filter(Boolean);
        setItems(cartItems);
        setLoading(false);
      });
  }, []);

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(id);
      return;
    }
    const updated = items.map(i => i.id === id ? { ...i, qty: newQty } : i);
    setItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    const cartIds = updated.map(i => i.id);
    localStorage.setItem('cart', JSON.stringify(cartIds));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <a href="/buy" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart ({items.length} items)</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-4 border-b">
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">₹{item.price} per {item.unit}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200"
              >-</button>
              <span className="w-8 text-center">{item.qty}</span>
              <button 
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200"
              >+</button>
            </div>
            <div className="ml-6 text-right">
              <span className="font-bold">₹{item.price * item.qty}</span>
              <button 
                onClick={() => removeItem(item.id)}
                className="block text-red-500 text-sm hover:text-red-700"
              >Remove</button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center pt-4">
          <span className="text-xl font-bold">Total ({items.reduce((sum, i) => sum + i.qty, 0)} items)</span>
          <span className="text-xl font-bold text-green-600">₹{total}</span>
        </div>
        <a href="/checkout" className="block mt-6 text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Proceed to Checkout</a>
      </div>
    </div>
  );
}
