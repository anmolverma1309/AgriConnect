import { NextResponse } from 'next/server';

// AI-powered crop advisory using simulated Gemini-like responses
// In production, integrate with Google Gemini API or OpenAI

const CROP_ADVISORIES: Record<string, string[]> = {
  'Wheat': [
    'Sow wheat in Rabi season (Nov-Dec)',
    'Use certified seeds at 100-125 kg/ha',
    'Apply basal dose of NPK fertilizer',
    'First irrigation at crown root initiation',
    'Watch for yellow rust in cool weather'
  ],
  'Rice': [
    'Transplant seedlings at 20-25 days',
    'Maintain 5cm water depth in initial stages',
    'Apply nitrogen in 3 split doses',
    'Control blast disease with fungicides',
    'Drain field 10 days before harvest'
  ],
  'Cotton': [
    'Sow cotton in Kharif (June-July)',
    'Spacing: 75-90cm between rows',
    'Irrigate at flowering and boll formation',
    'Monitor for bollworm regularly',
    'Apply growth regulators for synchrony'
  ],
  'Tomato': [
    'Start nursery 4-6 weeks before transplanting',
    'Maintain soil pH 6.0-6.8',
    'Stake plants for better air circulation',
    'Drip irrigation recommended',
    'Remove suckers for indeterminate varieties'
  ],
  'Soybean': [
    'Treat seeds with Rhizobium culture',
    'Sow at onset of monsoon',
    'Maintain seed rate of 60-75 kg/ha',
    'Critical irrigation at pod filling',
    'Harvest when pods turn brown'
  ]
};

const SEASONAL_ADVISORIES: Record<string, string[]> = {
  'Kharif': [
    'Prepare land before monsoon onset',
    'Apply FYM/compost during ploughing',
    'Choose short-duration varieties if delayed',
    'Ensure proper drainage in heavy soils'
  ],
  'Rabi': [
    'Ensure adequate soil moisture at sowing',
    'Use recommended seed treatment',
    'Apply phosphorus at sowing time',
    'Plan irrigation schedule carefully'
  ],
  'Zaid': [
    'Use heat-tolerant varieties',
    'Increase irrigation frequency',
    'Mulching recommended to conserve moisture',
    'Control pests more vigilantly'
  ]
};

export async function POST(request: Request) {
  try {
    const { crop, stage, location, query } = await request.json();
    
    // Generate personalized advisory
    const advisories = [];
    
    // Crop-specific advice
    if (crop && CROP_ADVISORIES[crop]) {
      advisories.push(...CROP_ADVISORIES[crop].slice(0, 3));
    }
    
    // Stage-specific advice
    if (stage) {
      const stageAdvice: Record<string, string> = {
        'pre-sowing': 'Test soil nutrients before sowing',
        'sowing': 'Ensure proper seed depth and spacing',
        'vegetative': 'Focus on weed control and micronutrients',
        'flowering': 'Critical irrigation and pest monitoring',
        'fruiting': 'Reduce nitrogen, increase potassium',
        'harvest': 'Monitor moisture content before harvest'
      };
      if (stageAdvice[stage]) advisories.push(stageAdvice[stage]);
    }
    
    // Location-specific advice
    if (location) {
      advisories.push(`Consider local weather patterns for ${location}`);
    }
    
    // Custom query response
    if (query) {
      // Simulate AI response
      advisories.push(`Based on your query "${query}": Monitor field conditions regularly`);
    }
    
    // Add seasonal advice
    const season = getCurrentSeason();
    if (SEASONAL_ADVISORIES[season]) {
      advisories.push(`Seasonal tip (${season}): ${SEASONAL_ADVISORIES[season][0]}`);
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      crop: crop || 'general',
      location: location || 'India',
      advisories,
      nextSteps: [
        'Monitor crop growth weekly',
        'Keep records of inputs applied',
        'Consult local KVK for specific problems'
      ]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate advisory'
    }, { status: 500 });
  }
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  return 'Zaid';
}
