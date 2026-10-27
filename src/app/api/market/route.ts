import { NextResponse } from 'next/server';

// Market intelligence and price prediction API
// Provides price forecasts and market trends

const CROPS_DATA: Record<string, {
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  forecast: number[];
  factors: string[];
}> = {
  'Wheat': {
    currentPrice: 2150,
    trend: 'stable',
    forecast: [2180, 2220, 2250, 2280],
    factors: ['Good monsoon expected', 'Export demand stable', 'Buffer stock adequate']
  },
  'Rice (Basmati)': {
    currentPrice: 3500,
    trend: 'up',
    forecast: [3550, 3620, 3700, 3750],
    factors: ['Export to Middle East rising', 'MSP increased', 'Quality crop expected']
  },
  'Cotton': {
    currentPrice: 6200,
    trend: 'up',
    forecast: [6300, 6400, 6500, 6550],
    factors: ['Textile industry demand', 'Lower acreage reported', 'International prices firm']
  },
  'Soybean': {
    currentPrice: 4500,
    trend: 'down',
    forecast: [4450, 4400, 4350, 4300],
    factors: ['Higher production expected', 'Import pressure', 'Crushing margins low']
  },
  'Tomato': {
    currentPrice: 1800,
    trend: 'up',
    forecast: [2000, 2200, 1900, 1700],
    factors: ['Seasonal shortage', 'Transport costs high', 'Weather damage in some areas']
  },
  'Onion': {
    currentPrice: 1500,
    trend: 'stable',
    forecast: [1550, 1600, 1500, 1450],
    factors: ['Buffer stock release', 'New crop arrival', 'Storage availability']
  },
  'Potato': {
    currentPrice: 1200,
    trend: 'down',
    forecast: [1180, 1150, 1100, 1050],
    factors: ['Cold storage stocks high', 'New crop planting', 'Processing demand steady']
  },
  'Maize': {
    currentPrice: 1850,
    trend: 'up',
    forecast: [1880, 1920, 1950, 1980],
    factors: ['Poultry feed demand', 'Ethanol production', 'Lower imports']
  },
  'Chana': {
    currentPrice: 5200,
    trend: 'up',
    forecast: [5250, 5320, 5400, 5450],
    factors: ['Protein demand rising', 'Import duties increased', 'Shortage in storing states']
  },
  'Mustard': {
    currentPrice: 4800,
    trend: 'stable',
    forecast: [4820, 4850, 4830, 4800],
    factors: ['Edible oil demand steady', 'MSP support', 'Import substitution focus']
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop') || 'Wheat';
    const days = parseInt(searchParams.get('days') || '30');
    
    const cropData = CROPS_DATA[crop] || CROPS_DATA['Wheat'];
    
    // Generate AI-like market analysis
    const analysis = generateMarketAnalysis(crop, cropData);
    
    // Get related commodities
    const related = getRelatedCommodities(crop);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      crop: crop,
      market: {
        currentPrice: cropData.currentPrice,
        currency: 'INR',
        unit: 'per quintal',
        trend: cropData.trend,
        change24h: calculateChange(cropData),
        forecast: {
          next7Days: cropData.forecast[0],
          next15Days: cropData.forecast[1],
          next30Days: cropData.forecast[2],
          next90Days: cropData.forecast[3]
        }
      },
      analysis: analysis,
      factors: cropData.factors,
      relatedCommodities: related,
      recommendation: generateRecommendation(cropData),
      bestSellingWindow: getBestSellingWindow(cropData),
      alerts: generateAlerts(crop, cropData)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate market intelligence'
    }, { status: 500 });
  }
}

function generateMarketAnalysis(crop: string, data: any): string {
  const analyses: Record<string, string> = {
    'up': `${crop} prices are showing upward momentum due to ${data.factors[0].toLowerCase()}. Farmers should consider staggered selling.`,
    'down': `${crop} prices are under pressure due to ${data.factors[0].toLowerCase()}. Consider holding if storage permits.`,
    'stable': `${crop} market is stable with balanced supply-demand. Current price is fair for selling.`
  };
  return analyses[data.trend] || analyses['stable'];
}

function getRelatedCommodities(crop: string): string[] {
  const related: Record<string, string[]> = {
    'Wheat': ['Barley', 'Rice', 'Maize'],
    'Rice (Basmati)': ['Wheat', 'Non-Basmati Rice'],
    'Cotton': ['Soybean', 'Groundnut'],
    'Soybean': ['Cotton', 'Groundnut', 'Sunflower'],
    'Tomato': ['Potato', 'Onion', 'Chillies'],
    'Onion': ['Potato', 'Tomato'],
    'Chana': ['Masur', 'Peas', 'Moong'],
    'Mustard': ['Groundnut', 'Sunflower', 'Soybean']
  };
  return related[crop] || [];
}

function calculateChange(data: any): string {
  const changes: Record<string, string> = {
    'up': `+${(Math.random() * 3 + 1).toFixed(1)}%`,
    'down': `-${(Math.random() * 3 + 1).toFixed(1)}%`,
    'stable': '0.5%'
  };
  return changes[data.trend] || '0%';
}

function generateRecommendation(data: any): string {
  const recs: Record<string, string> = {
    'up': 'SELL - Prices trending up. Sell 50% now, hold rest for further gains.',
    'down': 'HOLD - Prices expected to recover. Store if possible, sell only if urgent.',
    'stable': 'SELL GRADUALLY - Market stable. Sell in lots over 2-3 weeks.'
  };
  return recs[data.trend] || recs['stable'];
}

function getBestSellingWindow(data: any): string {
  const windows: Record<string, string> = {
    'up': 'Next 7-15 days',
    'down': 'Wait for 30-45 days',
    'stable': 'Any time in next 30 days'
  };
  return windows[data.trend] || 'Monitor daily';
}

function generateAlerts(crop: string, data: any): string[] {
  const alerts: string[] = [];
  
  if (data.trend === 'down') {
    alerts.push(`⚠️ ${crop} prices declining. Consider storage.`);
  }
  if (data.forecast[2] > data.currentPrice * 1.1) {
    alerts.push(`📈 Potential 10% price rise expected in 30 days`);
  }
  if (data.forecast[2] < data.currentPrice * 0.9) {
    alerts.push(`📉 Prices may drop 10% in coming weeks. Consider immediate sale.`);
  }
  
  return alerts.length > 0 ? alerts : ['Market stable. No immediate alerts.'];
}
