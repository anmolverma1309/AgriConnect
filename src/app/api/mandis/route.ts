import { NextResponse } from 'next/server';

// Mandi/Market Locator API
// Find nearest APMC markets with distance and facilities

const MANDI_DATABASE = [
  {
    id: 'DEL-001',
    name: 'Azadpur Mandi',
    state: 'Delhi',
    district: 'North Delhi',
    type: 'APMC',
    location: { lat: 28.7105, lon: 77.1734 },
    commodities: ['Onion', 'Potato', 'Tomato', 'Cauliflower', 'Cabbage'],
    facilities: ['Cold Storage', 'Electronic Weighing', 'Banking', 'Restrooms'],
    fees: { commission: '1%', market: '₹20/quintal' },
    timings: '4:00 AM - 8:00 PM',
    contact: '011-2763-XXXX'
  },
  {
    id: 'PUN-001',
    name: 'Khanna Mandi',
    state: 'Punjab',
    district: 'Ludhiana',
    type: 'APMC',
    location: { lat: 30.6995, lon: 76.2205 },
    commodities: ['Wheat', 'Rice', 'Maize', 'Bajra'],
    facilities: ['Grain Storage', 'Moisture Testing', 'MSP Procurement', 'Truck Parking'],
    fees: { commission: '1%', market: '₹15/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '01628-2XXXXX'
  },
  {
    id: 'MH-001',
    name: 'Vashi APMC',
    state: 'Maharashtra',
    district: 'Navi Mumbai',
    type: 'APMC',
    location: { lat: 19.0770, lon: 73.0129 },
    commodities: ['Onion', 'Tomato', 'Brinjal', 'Okra', 'Chilli', 'Mango', 'Banana'],
    facilities: ['Cold Storage', 'Ripening Chambers', 'Export Facility', 'Banking', 'ATM'],
    fees: { commission: '1.5%', market: '₹25/quintal' },
    timings: '3:00 AM - 9:00 PM',
    contact: '022-2763-XXXX'
  },
  {
    id: 'MH-002',
    name: 'Lasalgaon Onion Market',
    state: 'Maharashtra',
    district: 'Nashik',
    type: 'Specialized',
    location: { lat: 20.1439, lon: 74.2384 },
    commodities: ['Onion', 'Onion Seeds'],
    facilities: ['Sorting/Grading', 'Storage Godowns', 'Price Display Board', 'Wifi'],
    fees: { commission: '1%', market: '₹18/quintal' },
    timings: '4:00 AM - 8:00 PM',
    contact: '02550-2XXXXX',
    note: 'Largest onion market in India'
  },
  {
    id: 'GJ-001',
    name: 'Rajkot APMC',
    state: 'Gujarat',
    district: 'Rajkot',
    type: 'APMC',
    location: { lat: 22.3039, lon: 70.8022 },
    commodities: ['Cotton', 'Groundnut', 'Cumin', 'Sesame', 'Bajra'],
    facilities: ['Cotton Ginning', 'Cold Storage', 'Testing Lab', 'Banking'],
    fees: { commission: '1%', market: '₹20/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '0281-2XXXXX'
  },
  {
    id: 'MP-001',
    name: 'Indore Mandi',
    state: 'Madhya Pradesh',
    district: 'Indore',
    type: 'APMC',
    location: { lat: 22.7196, lon: 75.8577 },
    commodities: ['Wheat', 'Soybean', 'Gram', 'Lentil', 'Mustard'],
    facilities: ['Electronic Auction', 'Grain Storage', 'MSP Operations', 'Parking'],
    fees: { commission: '1%', market: '₹15/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '0731-2XXXXX'
  },
  {
    id: 'KA-001',
    name: 'Davanagere APMC',
    state: 'Karnataka',
    district: 'Davanagere',
    type: 'APMC',
    location: { lat: 14.4644, lon: 75.9216 },
    commodities: ['Maize', 'Ragi', 'Jowar', 'Groundnut', 'Sunflower'],
    facilities: ['Drying Yards', 'Storage', 'Banking', 'Weight Bridge'],
    fees: { commission: '1%', market: '₹18/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '08192-2XXXXX'
  },
  {
    id: 'RJ-001',
    name: 'Jaipur Mandi',
    state: 'Rajasthan',
    district: 'Jaipur',
    type: 'APMC',
    location: { lat: 26.9124, lon: 75.7873 },
    commodities: ['Bajra', 'Moong', 'Groundnut', 'Guar', 'Wheat'],
    facilities: ['Storage', 'Banking', 'Sorting', 'Parking'],
    fees: { commission: '1%', market: '₹15/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '0141-2XXXXX'
  },
  {
    id: 'UP-001',
    name: 'Azamgarh Mandi',
    state: 'Uttar Pradesh',
    district: 'Azamgarh',
    type: 'APMC',
    location: { lat: 26.0737, lon: 83.1859 },
    commodities: ['Wheat', 'Rice', 'Potato', 'Tomato', 'Chilli'],
    facilities: ['Storage', 'Banking', 'Weighbridge'],
    fees: { commission: '1%', market: '₹15/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '05462-2XXXXX'
  },
  {
    id: 'WB-001',
    name: 'Beldanga Mandi',
    state: 'West Bengal',
    district: 'Murshidabad',
    type: 'APMC',
    location: { lat: 23.9373, lon: 88.1604 },
    commodities: ['Rice', 'Jute', 'Potato', 'Mustard'],
    facilities: ['Paddy Drying', 'Jute Storage', 'Banking'],
    fees: { commission: '1%', market: '₹12/quintal' },
    timings: '5:00 AM - 7:00 PM',
    contact: '03482-2XXXXX'
  }
];

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');
    const commodity = searchParams.get('commodity');
    const state = searchParams.get('state');
    const maxDistance = parseInt(searchParams.get('maxDistance') || '200'); // km
    
    let mandis = [...MANDI_DATABASE];
    
    // Filter by state if provided
    if (state) {
      mandis = mandis.filter(m => m.state.toLowerCase() === state.toLowerCase());
    }
    
    // Filter by commodity if provided
    if (commodity) {
      mandis = mandis.filter(m => 
        m.commodities.some(c => c.toLowerCase().includes(commodity.toLowerCase()))
      );
    }
    
    // Calculate distances if lat/lon provided
    if (lat && lon) {
      mandis = mandis.map(m => ({
        ...m,
        distance: calculateDistance(lat, lon, m.location.lat, m.location.lon)
      }))
      .filter(m => (m as any).distance <= maxDistance)
      .sort((a, b) => (a as any).distance - (b as any).distance);
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      location: lat && lon ? { lat, lon } : 'Not specified',
      filters: { commodity, state, maxDistance },
      totalMandis: mandis.length,
      mandis: mandis.map(m => ({
        id: m.id,
        name: m.name,
        state: m.state,
        distance: (m as any).distance || null,
        commodities: m.commodities.slice(0, 5),
        timings: m.timings,
        commission: m.fees.commission,
        contact: m.contact,
        facilities: m.facilities.slice(0, 3)
      })),
      topRecommended: mandis.slice(0, 3).map(m => ({
        ...m,
        whyRecommended: generateRecommendation(m, commodity)
      })),
      transportCost: generateTransportEstimate(mandis[0] as any, lat, lon)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch mandi data'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { lat, lon, crop, quantity, preferredTime } = await request.json();
    
    // Find best mandis for selling
    const mandisWithDistance = MANDI_DATABASE.map(m => ({
      ...m,
      distance: calculateDistance(lat, lon, m.location.lat, m.location.lon),
      suitable: m.commodities.some(c => c.toLowerCase() === crop.toLowerCase())
    }))
    .filter(m => m.suitable)
    .sort((a, b) => a.distance - b.distance);
    
    const top3 = mandisWithDistance.slice(0, 3);
    
    // Calculate profitability
    const priceAnalysis = top3.map(m => ({
      ...m,
      transportCost: m.distance * 8, // ₹8 per km
      netEstimate: `Market price - ₹${m.distance * 8} transport`,
      timeEstimate: `${Math.round(m.distance / 40)} hours by truck`
    }));
    
    return NextResponse.json({
      success: true,
      query: { lat, lon, crop, quantity },
      recommendations: priceAnalysis,
      bestOption: priceAnalysis[0],
      alternatives: priceAnalysis.slice(1),
      tips: [
        'Reach mandi early morning (4-6 AM) for best rates',
        'Bring sample of produce for quality check',
        'Check price on Agmarknet before selling'
      ],
      documents: ['Gate Pass', 'Land Record', 'ID Proof', 'Bank Passbook']
    });
  } catch (error) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

function generateRecommendation(mandi: any, commodity: string | null): string {
  const reasons = [];
  
  if (commodity && mandi.commodities.includes(commodity)) {
    reasons.push(`${commodity} traded actively`);
  }
  
  if (mandi.facilities.includes('Cold Storage')) {
    reasons.push('Cold storage available');
  }
  
  if (mandi.facilities.includes('Electronic Auction')) {
    reasons.push('Transparent e-auction');
  }
  
  if ((mandi as any).distance && (mandi as any).distance < 50) {
    reasons.push('Nearby location');
  }
  
  return reasons.join(', ') || 'Good facilities';
}

function generateTransportEstimate(nearestMandi: any, userLat: number, userLon: number) {
  if (!nearestMandi || !userLat) return null;
  
  const distance = calculateDistance(userLat, userLon, nearestMandi.location.lat, nearestMandi.location.lon);
  
  return {
    distance: `${distance} km`,
    byTruck: {
      cost: `₹${distance * 8}/quintal`,
      time: `${Math.round(distance / 35)} hours`
    },
    byTractor: {
      cost: `₹${distance * 12}/quintal`,
      time: `${Math.round(distance / 20)} hours`
    },
    byTempo: {
      cost: `₹${distance * 15}/quintal`,
      time: `${Math.round(distance / 25)} hours`
    }
  };
}
