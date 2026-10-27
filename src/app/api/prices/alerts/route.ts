import { NextResponse } from 'next/server';

// Market Price Alerts & Subscription API
// Manages price tracking, alerts, and optimal selling recommendations

interface PriceAlert {
  id: string;
  crop: string;
  market: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  status: 'active' | 'triggered' | 'expired';
  createdAt: string;
  notifyVia: string[];
}

interface MarketSubscription {
  id: string;
  crops: string[];
  markets: string[];
  frequency: 'daily' | 'weekly' | 'immediate';
  lastNotification: string;
  stats: {
    alertsSent: number;
    profitableSales: number;
    totalGain: number;
  };
}

const MARKET_DATA: Record<string, { current: number; high24h: number; low24h: number; trend: string }> = {
  'Wheat': { current: 2180, high24h: 2200, low24h: 2150, trend: 'up' },
  'Rice (Basmati)': { current: 3550, high24h: 3600, low24h: 3480, trend: 'up' },
  'Cotton': { current: 6280, high24h: 6350, low24h: 6150, trend: 'up' },
  'Soybean': { current: 4450, high24h: 4520, low24h: 4380, trend: 'down' },
  'Tomato': { current: 1950, high24h: 2200, low24h: 1800, trend: 'volatile' },
  'Onion': { current: 1520, high24h: 1600, low24h: 1480, trend: 'stable' },
  'Potato': { current: 1180, high24h: 1220, low24h: 1150, trend: 'down' },
  'Maize': { current: 1880, high24h: 1920, low24h: 1850, trend: 'up' },
  'Chana': { current: 5250, high24h: 5320, low24h: 5180, trend: 'up' },
  'Mustard': { current: 4820, high24h: 4900, low24h: 4750, trend: 'stable' }
};

// Store alerts in memory (use Redis/DB in production)
let alerts: PriceAlert[] = [];
let subscriptions: MarketSubscription[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    const userId = searchParams.get('userId') || 'default';
    
    if (action === 'status') {
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        marketOverview: generateMarketOverview(),
        yourAlerts: alerts.filter(a => a.status === 'active'),
        yourSubscriptions: subscriptions,
        recommendations: generateRecommendations(),
        topGainers: getTopGainers(3),
        topLosers: getTopLosers(3)
      });
    }
    
    if (action === 'history') {
      return NextResponse.json({
        success: true,
        triggeredAlerts: alerts.filter(a => a.status === 'triggered'),
        priceHistory: generatePriceHistory()
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, userId, crop, market, targetPrice, condition, frequency, phone, email, crops, markets } = await request.json();
    
    if (action === 'createAlert') {
      const currentPrice = MARKET_DATA[crop]?.current || 2000;
      
      const alert: PriceAlert = {
        id: `ALT-${Date.now()}`,
        crop,
        market: market || 'All Markets',
        condition,
        targetPrice,
        currentPrice,
        status: 'active',
        createdAt: new Date().toISOString(),
        notifyVia: [phone ? 'sms' : '', email ? 'email' : ''].filter(Boolean)
      };
      
      alerts.push(alert);
      
      return NextResponse.json({
        success: true,
        alertId: alert.id,
        message: `Alert set: ${crop} ${condition} ₹${targetPrice}`,
        currentPrice: currentPrice,
        estimatedTrigger: estimateTriggerTime(crop, targetPrice, condition),
        suggestions: generateAlertSuggestions(crop, currentPrice, targetPrice)
      });
    }
    
    if (action === 'subscribe') {
      const subscription: MarketSubscription = {
        id: `SUB-${Date.now()}`,
        crops: crops || ['Wheat', 'Rice', 'Cotton'],
        markets: markets || ['Azadpur', 'Khanna', 'Vashi'],
        frequency: frequency || 'daily',
        lastNotification: new Date().toISOString(),
        stats: { alertsSent: 0, profitableSales: 0, totalGain: 0 }
      };
      
      subscriptions.push(subscription);
      
      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        message: `Subscribed to ${subscription.crops.length} crops`,
        nextUpdate: calculateNextUpdate(frequency),
        whatYouGet: [
          'Daily price summaries',
          'Price trend analysis',
          'Optimal selling window alerts',
          'Market arbitrage opportunities'
        ]
      });
    }
    
    if (action === 'checkPrice') {
      const prices = crop ? { [crop]: MARKET_DATA[crop] } : MARKET_DATA;
      
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        prices: prices,
        analysis: generateAnalysis(crop),
        recommendation: generateRecommendation(crop)
      });
    }
    
    if (action === 'arbitrage') {
      return NextResponse.json({
        success: true,
        opportunities: findArbitrageOpportunities(),
        transportCosts: { local: 50, district: 150, state: 500 },
        bestDeals: findBestDeals()
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { alertId, subscriptionId } = await request.json();
    
    if (alertId) {
      alerts = alerts.filter(a => a.id !== alertId);
      return NextResponse.json({ success: true, message: 'Alert deleted' });
    }
    
    if (subscriptionId) {
      subscriptions = subscriptions.filter(s => s.id !== subscriptionId);
      return NextResponse.json({ success: true, message: 'Subscription cancelled' });
    }
    
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

function generateMarketOverview() {
  return Object.entries(MARKET_DATA).map(([crop, data]) => ({
    crop,
    current: data.current,
    change24h: Math.round((data.current - data.low24h) / data.low24h * 100),
    trend: data.trend,
    recommendation: data.trend === 'up' ? 'HOLD/Sell gradually' : data.trend === 'down' ? 'WAIT' : 'SELL'
  }));
}

function generateRecommendations(): { crop: string; action: string; reason: string; urgency: string }[] {
  const recs: { crop: string; action: string; reason: string; urgency: string }[] = [];
  
  Object.entries(MARKET_DATA).forEach(([crop, data]) => {
    if (data.trend === 'up' && data.current > data.low24h * 1.05) {
      recs.push({
        crop,
        action: 'SELL',
        reason: `Price up ${Math.round((data.current - data.low24h) / data.low24h * 100)}% from day's low`,
        urgency: 'medium'
      });
    }
    if (data.trend === 'down') {
      recs.push({
        crop,
        action: 'HOLD',
        reason: 'Prices declining, better to wait',
        urgency: 'low'
      });
    }
  });
  
  return recs.slice(0, 3);
}

function getTopGainers(limit: number) {
  return Object.entries(MARKET_DATA)
    .filter(([_, d]) => d.trend === 'up')
    .sort((a, b) => b[1].current - a[1].current)
    .slice(0, limit)
    .map(([crop, data]) => ({ crop, price: data.current, gain: '+2-5%' }));
}

function getTopLosers(limit: number) {
  return Object.entries(MARKET_DATA)
    .filter(([_, d]) => d.trend === 'down')
    .sort((a, b) => a[1].current - b[1].current)
    .slice(0, limit)
    .map(([crop, data]) => ({ crop, price: data.current, loss: '-2-4%' }));
}

function generatePriceHistory() {
  const history: Record<string, number[]> = {};
  Object.keys(MARKET_DATA).forEach(crop => {
    history[crop] = Array.from({ length: 7 }, () => 
      MARKET_DATA[crop].current + Math.floor(Math.random() * 200 - 100)
    );
  });
  return history;
}

function estimateTriggerTime(crop: string, target: number, condition: string): string {
  const current = MARKET_DATA[crop]?.current || 2000;
  const diff = Math.abs(target - current);
  
  if (condition === 'above' && target > current) {
    if (diff < 100) return 'Expected: 1-2 days';
    if (diff < 300) return 'Expected: 3-7 days';
    return 'Expected: 1-2 weeks';
  }
  if (condition === 'below' && target < current) {
    return 'Risk: Price may not drop to target';
  }
  return 'Checking market conditions...';
}

function generateAlertSuggestions(crop: string, current: number, target: number): string[] {
  const suggestions = [];
  const diff = ((target - current) / current * 100);
  
  if (diff > 10) {
    suggestions.push(`Target ${diff.toFixed(1)}% higher than current. Consider staggered selling.`);
  }
  if (diff < 5) {
    suggestions.push('Target close to current price. Good time to set alert.');
  }
  suggestions.push(`Market trend: ${MARKET_DATA[crop]?.trend || 'stable'}`);
  
  return suggestions;
}

function calculateNextUpdate(frequency: string): string {
  const now = new Date();
  if (frequency === 'immediate') return 'Real-time';
  if (frequency === 'daily') {
    now.setDate(now.getDate() + 1);
    return now.toISOString().split('T')[0] + ' 8:00 AM';
  }
  now.setDate(now.getDate() + 7);
  return now.toISOString().split('T')[0];
}

function generateAnalysis(crop?: string) {
  if (!crop) return 'Track multiple crops for better market insights';
  return `${crop} showing ${MARKET_DATA[crop]?.trend || 'stable'} trend. Monitor daily.`;
}

function generateRecommendation(crop?: string) {
  if (!crop) return 'Diversify selling across multiple crops';
  const data = MARKET_DATA[crop];
  if (!data) return 'No data available';
  
  if (data.trend === 'up') return `SELL ${crop} - Prices rising`;
  if (data.trend === 'down') return `HOLD ${crop} - Wait for recovery`;
  return `${crop} stable - Sell at convenience`;
}

function findArbitrageOpportunities(): { crop: string; buyAt: string; sellAt: string; potentialGain: number; transportCost: number; netProfit: number; recommendation: string }[] {
  const opportunities: { crop: string; buyAt: string; sellAt: string; potentialGain: number; transportCost: number; netProfit: number; recommendation: string }[] = [];
  const markets = [
    { name: 'Azadpur, Delhi', premium: 100 },
    { name: 'Mumbai Vashi', premium: 50 },
    { name: 'Chennai', premium: -30 },
    { name: 'Kolkata', premium: 20 }
  ];
  
  Object.entries(MARKET_DATA).slice(0, 3).forEach(([crop, data]) => {
    markets.forEach(market => {
      const potentialPrice = data.current + market.premium;
      const transportCost = market.premium > 0 ? 150 : 50;
      const netGain = market.premium - transportCost;
      
      if (netGain > 50) {
        opportunities.push({
          crop,
          buyAt: 'Local mandi',
          sellAt: market.name,
          potentialGain: netGain,
          transportCost,
          netProfit: netGain,
          recommendation: netGain > 100 ? 'STRONG OPPORTUNITY' : 'MODERATE'
        });
      }
    });
  });
  
  return opportunities;
}

function findBestDeals() {
  return Object.entries(MARKET_DATA)
    .map(([crop, data]) => ({
      crop,
      bestPrice: data.high24h,
      currentPrice: data.current,
      potentialExtra: data.high24h - data.current,
      strategy: data.current < data.high24h * 0.97 ? 'Wait for peak' : 'Sell now'
    }))
    .filter(d => d.potentialExtra > 50)
    .slice(0, 3);
}
