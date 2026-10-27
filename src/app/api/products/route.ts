import { NextResponse } from 'next/server';

const PRODUCTS = [
  { id: '1', name: 'Pusa Gold Wheat Seeds', category: 'Seeds', price: 450, stock: 100, unit: '5kg', description: 'High-yield variety, disease resistant', seller: 'Krishna Seeds Pvt Ltd', image: '/images/seeds.jpg' },
  { id: '2', name: 'Urea Fertilizer', category: 'Fertilizers', price: 300, stock: 500, unit: '50kg', description: '46% Nitrogen for better growth', seller: 'Indian Farmers Fertiliser Coop', image: '/images/fertilizer.jpg' },
  { id: '3', name: 'DAP Fertilizer', category: 'Fertilizers', price: 1350, stock: 200, unit: '50kg', description: '18-46-0 NPK grade', seller: 'Coromandel International', image: '/images/dap.jpg' },
  { id: '4', name: 'Organic Vermicompost', category: 'Fertilizers', price: 200, stock: 150, unit: '25kg', description: '100% organic, rich in nutrients', seller: 'Green Earth Organics', image: '/images/organic.jpg' },
  { id: '5', name: 'Tomato Hybrid Seeds (Arka Rakshak)', category: 'Seeds', price: 180, stock: 80, unit: '10g', description: 'Disease resistant variety', seller: 'NHRDF Seeds', image: '/images/tomato-seeds.jpg' },
  { id: '6', name: 'Neem-based Pesticide', category: 'Pesticides', price: 350, stock: 75, unit: '1L', description: 'Organic pest control solution', seller: 'BioProtect Solutions', image: '/images/neem.jpg' },
  { id: '7', name: 'NPK 19-19-19 Fertilizer', category: 'Fertilizers', price: 800, stock: 120, unit: '50kg', description: 'Balanced nutrition for all crops', seller: 'Madras Fertilizers', image: '/images/npk.jpg' },
  { id: '8', name: 'Cold Pressed Neem Oil', category: 'Organic', price: 150, stock: 200, unit: '500ml', description: 'Pure neem oil for plants', seller: 'Kisan Naturals', image: '/images/neem-oil.jpg' },
  { id: '9', name: 'Cotton Seeds (Bollgard-II)', category: 'Seeds', price: 750, stock: 60, unit: '450g', description: 'Bt cotton hybrid variety', seller: 'Mahyco Seeds', image: '/images/cotton.jpg' },
  { id: '10', name: 'Bio-Fungicide (Trichoderma)', category: 'Pesticides', price: 280, stock: 90, unit: '1kg', description: 'Biological fungicide', seller: 'AgriLife Solutions', image: '/images/fungicide.jpg' },
  { id: '11', name: 'Drip Irrigation Kit (1/2 acre)', category: 'Equipment', price: 8500, stock: 25, unit: 'kit', description: 'Complete drip system with emitters', seller: 'Jain Irrigation', image: '/images/drip.jpg' },
  { id: '12', name: 'Manual Seed Drill', category: 'Equipment', price: 1200, stock: 40, unit: 'piece', description: 'Hand-operated seed sowing', seller: 'Kisan Kraft', image: '/images/seeder.jpg' },
];

export async function GET() {
  return NextResponse.json({ products: PRODUCTS });
}
