import { NextResponse } from 'next/server';

// Soil data and crop suitability API
// Provides location-based soil and crop recommendations

const SOIL_DATABASE: Record<string, {
  type: string;
  pH: string;
  nutrients: string[];
  suitableCrops: string[];
  improvements: string[];
}> = {
  'Punjab': {
    type: 'Alluvial (Loamy)',
    pH: '7.0-8.5',
    nutrients: ['High Nitrogen', 'Medium Phosphorus', 'Low Potassium'],
    suitableCrops: ['Wheat', 'Rice', 'Cotton', 'Maize'],
    improvements: ['Add organic matter', 'Apply zinc sulfate', 'Green manuring']
  },
  'Haryana': {
    type: 'Sandy Loam',
    pH: '7.5-8.5',
    nutrients: ['Medium Nitrogen', 'High Phosphorus', 'Low Potassium'],
    suitableCrops: ['Wheat', 'Rice', 'Bajra', 'Sugarcane'],
    improvements: ['Gypsum application', 'FYM application', 'Micronutrient mix']
  },
  'Uttar Pradesh': {
    type: 'Alluvial',
    pH: '6.5-8.0',
    nutrients: ['High Nitrogen', 'Medium Phosphorus', 'Medium Potassium'],
    suitableCrops: ['Wheat', 'Rice', 'Sugarcane', 'Vegetables'],
    improvements: ['Crop rotation', 'Vermicompost', 'Biofertilizers']
  },
  'Madhya Pradesh': {
    type: 'Black Cotton (Clay)',
    pH: '7.5-8.5',
    nutrients: ['High Calcium', 'Medium Nitrogen', 'Low Phosphorus'],
    suitableCrops: ['Soybean', 'Cotton', 'Wheat', 'Gram'],
    improvements: ['Organic matter addition', 'Green manuring', 'Drainage improvement']
  },
  'Maharashtra': {
    type: 'Lateritic/Black',
    pH: '6.0-7.5',
    nutrients: ['Low Nitrogen', 'Medium Phosphorus', 'High Iron'],
    suitableCrops: ['Cotton', 'Sugarcane', 'Jowar', 'Soybean'],
    improvements: ['Lime application', 'FYM', 'Micro-irrigation']
  },
  'Karnataka': {
    type: 'Red Sandy',
    pH: '5.5-7.0',
    nutrients: ['Low Nitrogen', 'Low Phosphorus', 'Medium Potassium'],
    suitableCrops: ['Ragi', 'Groundnut', 'Cotton', 'Pulses'],
    improvements: ['Lime application', 'Organic matter', 'Phosphate solubilizers']
  },
  'Andhra Pradesh': {
    type: 'Red Loamy',
    pH: '6.0-7.5',
    nutrients: ['Low Nitrogen', 'Low Phosphorus', 'Medium Potassium'],
    suitableCrops: ['Rice', 'Groundnut', 'Cotton', 'Chillies'],
    improvements: ['Gypsum application', 'Vermicompost', 'Mulching']
  },
  'Tamil Nadu': {
    type: 'Alluvial/Red',
    pH: '6.5-8.0',
    nutrients: ['Medium Nitrogen', 'Low Phosphorus', 'Medium Potassium'],
    suitableCrops: ['Rice', 'Cotton', 'Sugarcane', 'Banana'],
    improvements: ['Green manuring', 'FYM', 'Biofertilizers']
  },
  'Gujarat': {
    type: 'Medium Black',
    pH: '7.5-8.5',
    nutrients: ['High Calcium', 'Medium Nitrogen', 'Low Phosphorus'],
    suitableCrops: ['Cotton', 'Groundnut', 'Bajra', 'Wheat'],
    improvements: ['Organic matter', 'Gypsum', 'Micro-irrigation']
  },
  'Rajasthan': {
    type: 'Sandy Desert',
    pH: '8.0-9.0',
    nutrients: ['Very Low Nitrogen', 'Low Phosphorus', 'High Potassium'],
    suitableCrops: ['Bajra', 'Moth bean', 'Guar', 'Barley'],
    improvements: ['Organic matter', 'Mulching', 'Drip irrigation', 'Gypsum']
  },
  'West Bengal': {
    type: 'Alluvial',
    pH: '6.0-7.5',
    nutrients: ['High Nitrogen', 'Medium Phosphorus', 'Low Potassium'],
    suitableCrops: ['Rice', 'Jute', 'Potato', 'Vegetables'],
    improvements: ['Lime application', 'Drainage', 'Zinc application']
  },
  'Bihar': {
    type: 'Alluvial Gangetic',
    pH: '6.5-8.0',
    nutrients: ['High Nitrogen', 'Medium Phosphorus', 'Low Potassium'],
    suitableCrops: ['Rice', 'Wheat', 'Maize', 'Lentil'],
    improvements: ['Sulfur application', 'FYM', 'Biofertilizers']
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'Karnataka';
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    // Get soil data for the state
    const soilData = SOIL_DATABASE[state] || SOIL_DATABASE['Karnataka'];
    
    // Generate location-based recommendations
    const season = getCurrentSeason();
    const cropRotation = generateCropRotation(soilData.suitableCrops, season);
    
    return NextResponse.json({
      success: true,
      location: { state, lat, lon },
      timestamp: new Date().toISOString(),
      soil: soilData,
      currentSeason: season,
      recommendations: {
        immediate: soilData.improvements.slice(0, 2),
        seasonal: getSeasonalRecommendations(season, soilData.suitableCrops),
        cropRotation: cropRotation,
        fertilizers: generateFertilizerSchedule(soilData.type)
      },
      suitableCrops: soilData.suitableCrops,
      waterRequirements: getWaterRequirements(soilData.type),
      organicCarbon: calculateOrganicCarbon(soilData.type)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch soil data'
    }, { status: 500 });
  }
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  return 'Zaid';
}

function generateCropRotation(crops: string[], season: string): string[] {
  const rotations: Record<string, string[]> = {
    'Kharif': ['Rice/Soybean', 'Cotton/Groundnut', 'Bajra/Maize'],
    'Rabi': ['Wheat', 'Gram/Lentil', 'Mustard'],
    'Zaid': ['Moong', 'Urad', 'Summer Vegetables']
  };
  return rotations[season] || rotations['Rabi'];
}

function getSeasonalRecommendations(season: string, crops: string[]): string[] {
  const recs: Record<string, string[]> = {
    'Kharif': [
      'Start land preparation before monsoon',
      'Apply green manure crops before sowing',
      'Ensure proper drainage channels'
    ],
    'Rabi': [
      'Timely sowing for maximum yield',
      'Use recommended seed varieties',
      'Apply basal dose of fertilizers'
    ],
    'Zaid': [
      'Use short-duration varieties',
      'Increase irrigation frequency',
      'Monitor for pest attacks closely'
    ]
  };
  return recs[season] || recs['Rabi'];
}

function generateFertilizerSchedule(soilType: string): string[] {
  const schedules: Record<string, string[]> = {
    'Alluvial': ['NPK 20-20-20 @ 500kg/ha', 'Urea top dressing at 30 DAS', 'Zinc sulfate 25kg/ha'],
    'Black Cotton': ['DAP @ 150kg/ha basal', 'Urea split doses', 'Sulfur 20kg/ha'],
    'Red Sandy': ['FYM 10 tons/ha', 'SSP @ 200kg/ha', 'Micronutrient spray'],
    'Sandy': ['Organic matter 20 tons/ha', 'Frequent light irrigations', 'Foliar feeding']
  };
  return schedules[soilType] || schedules['Alluvial'];
}

function getWaterRequirements(soilType: string): string {
  const water: Record<string, string> = {
    'Alluvial': 'Medium (3-4 irrigations)',
    'Black Cotton': 'Low (2-3 irrigations)',
    'Red Sandy': 'High (5-6 irrigations)',
    'Sandy': 'Very High (frequent light)'
  };
  return water[soilType] || 'Medium';
}

function calculateOrganicCarbon(soilType: string): string {
  const oc: Record<string, string> = {
    'Alluvial': '0.5-0.8% (Medium)',
    'Black Cotton': '0.4-0.7% (Medium)',
    'Red Sandy': '0.3-0.5% (Low)',
    'Sandy': '0.2-0.4% (Very Low)'
  };
  return oc[soilType] || '0.5% (Medium)';
}
