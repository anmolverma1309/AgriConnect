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

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'upi'
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = {
      id: Date.now().toString(),
      items: items,
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      paymentMethod: formData.paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existing, order]));
    localStorage.removeItem('cart');
    
    setOrderPlaced(true);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>;

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-green-600 mb-4">Thank you for your purchase. You will receive a confirmation call shortly.</p>
          <a href="/buy" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block">Continue Shopping</a>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <a href="/buy" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Go to Shop</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              required
              className="w-full border rounded-lg px-4 py-2" 
              placeholder="Full Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                required
                className="w-full border rounded-lg px-4 py-2" 
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <input 
                type="text" 
                required
                className="w-full border rounded-lg px-4 py-2" 
                placeholder="PIN Code"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span className="text-green-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="payment" 
                value="upi"
                checked={formData.paymentMethod === 'upi'}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              />
              <div>
                <span className="font-medium">UPI</span>
                <p className="text-xs text-gray-500">Pay via Google Pay, PhonePe, etc.</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="payment" 
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              />
              <div>
                <span className="font-medium">Debit/Credit Card</span>
                <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="payment" 
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              />
              <div>
                <span className="font-medium">Cash on Delivery</span>
                <p className="text-xs text-gray-500">Pay when you receive</p>
              </div>
            </label>
          </div>
          <button type="submit" className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
            Place Order (₹{total})
          </button>
        </div>
      </form>
    </div>
  );
}
