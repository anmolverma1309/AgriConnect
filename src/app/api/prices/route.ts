import { NextResponse } from 'next/server';

// Real mandi prices from Agmarknet/DataGov API
// Fallback to realistic data if API is unavailable

const CROP_CODES: Record<string, string> = {
  'Wheat': '1',
  'Rice (Basmati)': '3',
  'Tomato': '78',
  'Potato': '84',
  'Onion': '86',
  'Cotton': '29',
  'Soybean': '56',
  'Maize': '27',
  'Bajra': '28',
  'Chana': '16'
};

const MARKETS = [
  { name: 'Azadpur, Delhi', state: 'DL' },
  { name: 'Khanna, Punjab', state: 'PB' },
  { name: 'Vashi, Mumbai', state: 'MH' },
  { name: 'Lasalgaon, Nashik', state: 'MH' },
  { name: 'Rajkot, Gujarat', state: 'GJ' },
  { name: 'Indore, MP', state: 'MP' },
  { name: 'Davanagere, Karnataka', state: 'KA' },
  { name: 'Jaipur, Rajasthan', state: 'RJ' },
  { name: 'Bikaner, Rajasthan', state: 'RJ' },
  { name: 'Azamgarh, UP', state: 'UP' }
];

// Realistic base prices (per quintal) - these fluctuate daily
const BASE_PRICES: Record<string, number> = {
  'Wheat': 2150,
  'Rice (Basmati)': 3500,
  'Tomato': 1800,
  'Potato': 1200,
  'Onion': 1500,
  'Cotton': 6200,
  'Soybean': 4500,
  'Maize': 1850,
  'Bajra': 2200,
  'Chana': 5200
};

async function fetchLivePrices() {
  try {
    // Try to fetch from data.gov.in Agmarknet API
    // Note: In production, you'd use a real API key
    const response = await fetch(
      'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d7760?api-key=579b464db66ec23bdd000001&format=json&limit=100',
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.records || null;
    }
  } catch (error) {
    console.log('Live API failed, using realistic data');
  }
  return null;
}

function generateRealisticPrices() {
  const prices = [];
  const crops = Object.keys(BASE_PRICES);
  
  for (let i = 0; i < crops.length; i++) {
    const crop = crops[i];
    const market = MARKETS[i % MARKETS.length];
    const basePrice = BASE_PRICES[crop];
    
    // Add realistic variation (-5% to +5%)
    const variation = (Math.random() - 0.5) * 0.1;
    const price = Math.round(basePrice * (1 + variation));
    const change = Math.round(variation * 100 * 10) / 10;
    
    prices.push({
      crop,
      market: market.name,
      state: market.state,
      price,
      change,
      unit: 'quintal',
      updatedAt: new Date().toISOString()
    });
  }
  
  return prices;
}

export async function GET() {
  try {
    // Try live API first
    const liveData = await fetchLivePrices();
    
    if (liveData && liveData.length > 0) {
      // Parse live data format
      const prices = liveData.slice(0, 20).map((record: any) => ({
        crop: record.commodity || record.crop || 'Unknown',
        market: record.market || record.mandi || 'Unknown',
        state: record.state || '',
        price: parseInt(record.modal_price || record.price || '0'),
        change: parseFloat(record.change || '0'),
        unit: record.unit || 'quintal',
        updatedAt: new Date().toISOString()
      }));
      
      return NextResponse.json({
        updatedAt: new Date().toISOString(),
        source: 'agmarknet-live',
        prices
      });
    }
    
    // Fallback to realistic simulated data
    const prices = generateRealisticPrices();
    
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: 'agmarknet-simulated',
      prices
    });
  } catch (error) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: 'fallback',
      prices: generateRealisticPrices()
    });
  }
}
