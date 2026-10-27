import { NextResponse } from 'next/server';

// Pest and Disease Early Warning System API
// Provides real-time alerts based on weather and seasonal patterns

interface Warning {
  id: string;
  type: 'pest' | 'disease' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedCrops: string[];
  affectedRegions: string[];
  startDate: string;
  endDate: string;
  preventiveMeasures: string[];
  weatherTrigger: string;
  status: 'active' | 'expired' | 'upcoming';
}

const CURRENT_WARNINGS: Warning[] = [
  {
    id: 'WRN-2024-001',
    type: 'pest',
    severity: 'high',
    title: 'Fall Armyworm (FAW) Alert - Maize',
    description: 'Fall Armyworm infestation risk HIGH due to humid conditions. Check fields daily.',
    affectedCrops: ['Maize', 'Sorghum', 'Millets'],
    affectedRegions: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Telangana'],
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    preventiveMeasures: [
      'Install pheromone traps (5/acre)',
      'Apply neem-based biopesticides',
      'Use resistant varieties (DKC-9173)',
      'Early planting recommended',
      'Remove egg masses manually'
    ],
    weatherTrigger: 'Temperature 25-32°C with >70% humidity',
    status: 'active'
  },
  {
    id: 'WRN-2024-002',
    type: 'disease',
    severity: 'critical',
    title: 'Yellow Rust Warning - Wheat (Rabi)',
    description: 'Yellow rust outbreak reported in Punjab and Haryana. Immediate action required.',
    affectedCrops: ['Wheat'],
    affectedRegions: ['Punjab', 'Haryana', 'Western UP', 'Rajasthan'],
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    preventiveMeasures: [
      'Spray Propiconazole 0.1% immediately',
      'Monitor fields every 2 days',
      'Use resistant varieties (HD-2967)',
      'Avoid late irrigation',
      'Uproot and burn infected plants'
    ],
    weatherTrigger: 'Temperature 10-15°C with dew',
    status: 'active'
  },
  {
    id: 'WRN-2024-003',
    type: 'disease',
    severity: 'medium',
    title: 'Blast Disease Alert - Rice Nursery',
    description: 'Rice blast favorable conditions due to warm nights and high humidity.',
    affectedCrops: ['Rice'],
    affectedRegions: ['West Bengal', 'Odisha', 'Bihar', 'Andhra Pradesh'],
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    preventiveMeasures: [
      'Treat seeds with Carbendazim',
      'Avoid excess nitrogen',
      'Maintain 2-3 cm water depth',
      'Spray Tricyclazole if symptoms appear',
      'Use blast-resistant varieties'
    ],
    weatherTrigger: '25-28°C with >85% humidity, cloudy days',
    status: 'upcoming'
  },
  {
    id: 'WRN-2024-004',
    type: 'pest',
    severity: 'high',
    title: 'Pink Bollworm Alert - Cotton',
    description: 'Pink bollworm second-generation emergence expected. Monitor fruiting bodies.',
    affectedCrops: ['Cotton'],
    affectedRegions: ['Maharashtra', 'Gujarat', 'Telangana', 'Punjab'],
    startDate: '2024-08-01',
    endDate: '2024-11-30',
    preventiveMeasures: [
      'Install pheromone traps (10/acre)',
      'Release Trichogramma parasitoids',
      'Destroy infested bolls',
      'Apply NSKE 5% or insecticide if ETL crosses 10%',
      'Follow refuge management'
    ],
    weatherTrigger: 'Temperature >30°C with dry conditions',
    status: 'upcoming'
  },
  {
    id: 'WRN-2024-005',
    type: 'weather',
    severity: 'critical',
    title: 'Hailstorm Risk - Wheat Crop',
    description: 'Severe weather alert: Hailstorms expected in wheat-growing regions.',
    affectedCrops: ['Wheat', 'Mustard', 'Chickpea'],
    affectedRegions: ['Punjab', 'Haryana', 'Rajasthan', 'MP'],
    startDate: '2024-03-10',
    endDate: '2024-03-20',
    preventiveMeasures: [
      'Monitor weather forecasts daily',
      'Harvest mature crops immediately if possible',
      'Avoid irrigation before storm',
      'Document damage for insurance claims',
      'Contact PMFBY helpline: 1800-2090-100'
    ],
    weatherTrigger: 'Convective clouds, temperature drop, wind shear',
    status: 'active'
  },
  {
    id: 'WRN-2024-006',
    type: 'pest',
    severity: 'medium',
    title: 'Whitefly Population Rising - Cotton/Vegetables',
    description: 'Whitefly populations building up due to dry spell. Monitor for CLCuV.',
    affectedCrops: ['Cotton', 'Tomato', 'Chilli', 'Brinjal'],
    affectedRegions: ['Rajasthan', 'Punjab', 'Haryana', 'Gujarat'],
    startDate: '2024-06-15',
    endDate: '2024-09-30',
    preventiveMeasures: [
      'Yellow sticky traps (20/acre)',
      'Neem oil 5ml/L spray',
      'Imidacloprid seed treatment',
      'Remove weed hosts',
      'Timely sowing to escape peak'
    ],
    weatherTrigger: 'Dry weather with >35°C temperature',
    status: 'upcoming'
  },
  {
    id: 'WRN-2024-007',
    type: 'disease',
    severity: 'high',
    title: 'Stem Rot Alert - Soybean',
    description: 'Phytophthora stem rot risk HIGH due to wet conditions. Check drainage.',
    affectedCrops: ['Soybean'],
    affectedRegions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
    startDate: '2024-07-01',
    endDate: '2024-09-15',
    preventiveMeasures: [
      'Improve field drainage',
      'Avoid water stagnation',
      'Seed treatment with Metalaxyl',
      'Use resistant varieties (JS-335)',
      'Crop rotation with cereals'
    ],
    weatherTrigger: 'Heavy rainfall, waterlogging, >25°C soil temp',
    status: 'upcoming'
  }
];

const PEST_CALENDAR: Record<string, any[]> = {
  'January': [
    { pest: 'Yellow Rust', crop: 'Wheat', risk: 'High' },
    { pest: 'Termites', crop: 'Wheat/Sugarcane', risk: 'Medium' }
  ],
  'February': [
    { pest: 'Yellow Rust', crop: 'Wheat', risk: 'High' },
    { pest: 'Aphids', crop: 'Mustard', risk: 'Medium' }
  ],
  'March': [
    { pest: 'Powdery Mildew', crop: 'Wheat', risk: 'Medium' },
    { pest: 'Pink Bollworm', crop: 'Cotton', risk: 'High' }
  ],
  'April': [
    { pest: 'Fall Armyworm', crop: 'Maize', risk: 'High' },
    { pest: 'Whitefly', crop: 'Cotton', risk: 'Medium' }
  ],
  'May': [
    { pest: 'Fall Armyworm', crop: 'Maize', risk: 'Critical' },
    { pest: 'Whitefly', crop: 'Vegetables', risk: 'High' }
  ],
  'June': [
    { pest: 'Stem Borer', crop: 'Rice', risk: 'High' },
    { pest: 'Root Rot', crop: 'Cotton', risk: 'Medium' }
  ],
  'July': [
    { pest: 'Blast', crop: 'Rice', risk: 'High' },
    { pest: 'Stem Rot', crop: 'Soybean', risk: 'High' }
  ],
  'August': [
    { pest: 'Blight', crop: 'Rice/Tomato', risk: 'High' },
    { pest: 'Pink Bollworm', crop: 'Cotton', risk: 'Critical' }
  ],
  'September': [
    { pest: 'Leaf Folder', crop: 'Rice', risk: 'Medium' },
    { pest: 'Whitefly', crop: 'Cotton', risk: 'High' }
  ],
  'October': [
    { pest: 'Termites', crop: 'Wheat', risk: 'Medium' },
    { pest: 'Rust', crop: 'Soybean', risk: 'Medium' }
  ],
  'November': [
    { pest: 'Termites', crop: 'Wheat', risk: 'High' },
    { pest: 'Aphids', crop: 'Mustard', risk: 'Medium' }
  ],
  'December': [
    { pest: 'Yellow Rust', crop: 'Wheat', risk: 'Medium' },
    { pest: 'Aphids', crop: 'Mustard/Chickpea', risk: 'High' }
  ]
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'all';
    const crop = searchParams.get('crop') || 'all';
    const severity = searchParams.get('severity') || 'all';
    const month = searchParams.get('month') || new Date().toLocaleString('en-US', { month: 'long' });
    
    // Filter warnings
    let warnings = CURRENT_WARNINGS;
    
    if (state !== 'all') {
      warnings = warnings.filter(w => 
        w.affectedRegions.some(r => r.toLowerCase().includes(state.toLowerCase()))
      );
    }
    
    if (crop !== 'all') {
      warnings = warnings.filter(w => 
        w.affectedCrops.some(c => c.toLowerCase().includes(crop.toLowerCase()))
      );
    }
    
    if (severity !== 'all') {
      warnings = warnings.filter(w => w.severity === severity);
    }
    
    // Get seasonal calendar
    const seasonalThreats = PEST_CALENDAR[month] || [];
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      location: state,
      currentMonth: month,
      summary: {
        activeWarnings: warnings.filter(w => w.status === 'active').length,
        critical: warnings.filter(w => w.severity === 'critical').length,
        high: warnings.filter(w => w.severity === 'high').length,
        medium: warnings.filter(w => w.severity === 'medium').length,
        upcoming: warnings.filter(w => w.status === 'upcoming').length
      },
      warnings: warnings,
      seasonalCalendar: {
        month: month,
        threats: seasonalThreats,
        advisory: generateSeasonalAdvisory(month)
      },
      weatherOutlook: generateWeatherOutlook(),
      resources: {
        plantDoctor: 'https://plantix.net',
        kisanSuvidha: 'https://apps.cabcs.in/kisansuvidha',
        agromet: 'https://www.imdagrimet.gov.in',
        locustWatch: 'https://www.fao.org/ag/locusts/en/activ/DLIS/sgps.html'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch warnings'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { state, crops, subscribeEmail, phone } = await request.json();
    
    // Subscribe to alerts
    return NextResponse.json({
      success: true,
      subscriptionId: `SUB-${Date.now()}`,
      state,
      crops,
      channels: ['SMS', 'Push', 'Email'],
      frequency: 'Daily alerts + Critical immediate',
      nextUpdate: new Date(Date.now() + 86400000).toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}

function generateSeasonalAdvisory(month: string): string {
  const advisories: Record<string, string> = {
    'January': 'Monitor wheat for yellow rust. Avoid late irrigation.',
    'February': 'Critical period for rust in wheat. Scout fields twice weekly.',
    'March': 'Pink bollworm emergence in cotton. Install pheromone traps.',
    'April': 'Fall armyworm risk HIGH in maize. Early planting recommended.',
    'May': 'Peak FAW season. Daily monitoring essential.',
    'June': 'Rice stem borer active. Treat nursery before transplanting.',
    'July': 'Blast disease favorable. Maintain water level and avoid excess N.',
    'August': 'Multiple pest pressure. Integrated pest management critical.',
    'September': 'Whitefly populations peak. Yellow traps + botanicals.',
    'October': 'Soybean rust possible. Monitor lower canopy.',
    'November': 'Termite risk in wheat. Seed treatment essential.',
    'December': 'Rust in wheat, aphids in mustard. Regular scouting needed.'
  };
  return advisories[month] || 'Monitor fields regularly for pest and disease symptoms.';
}

function generateWeatherOutlook(): any {
  return {
    period: 'Next 7 days',
    temperature: 'Above normal by 2-3°C in Central India',
    rainfall: 'Scattered showers expected in Eastern states',
    humidity: 'High (>80%) in coastal regions - disease favorable',
    alerts: ['Heat wave in Rajasthan', 'Heavy rain alert for Kerala']
  };
}
