import { NextResponse } from 'next/server';

// Smart Fertilizer Calculator API
// Calculates precise fertilizer requirements based on soil test and crop needs

const CROP_NUTRIENTS: Record<string, { n: number; p: number; k: number; s: number; zn: number; b: number }> = {
  'Wheat': { n: 120, p: 60, k: 40, s: 20, zn: 5, b: 1 },
  'Rice': { n: 100, p: 50, k: 50, s: 20, zn: 5, b: 1 },
  'Cotton': { n: 120, p: 60, k: 60, s: 30, zn: 5, b: 1 },
  'Maize': { n: 150, p: 75, k: 60, s: 25, zn: 10, b: 1.5 },
  'Soybean': { n: 20, p: 60, k: 40, s: 20, zn: 5, b: 1 },
  'Tomato': { n: 100, p: 80, k: 120, s: 30, zn: 5, b: 2 },
  'Potato': { n: 120, p: 100, k: 150, s: 30, zn: 5, b: 1 },
  'Onion': { n: 100, p: 60, k: 80, s: 40, zn: 10, b: 2 },
  'Groundnut': { n: 25, p: 50, k: 50, s: 30, zn: 10, b: 1 },
  'Mustard': { n: 80, p: 40, k: 40, s: 40, zn: 5, b: 1 },
  'Chickpea': { n: 20, p: 60, k: 40, s: 20, zn: 5, b: 1 },
  'Sugarcane': { n: 200, p: 80, k: 100, s: 40, zn: 5, b: 2 }
};

const FERTILIZER_COMPOSITION: Record<string, { n: number; p: number; k: number; s: number }> = {
  'Urea': { n: 46, p: 0, k: 0, s: 0 },
  'DAP': { n: 18, p: 46, k: 0, s: 0 },
  'MOP': { n: 0, p: 0, k: 60, s: 0 },
  'SSP': { n: 0, p: 16, k: 0, s: 11 },
  'NPK 10-26-26': { n: 10, p: 26, k: 26, s: 0 },
  'NPK 12-32-16': { n: 12, p: 32, k: 16, s: 0 },
  'NPK 20-20-20': { n: 20, p: 20, k: 20, s: 0 },
  'Ammonium Sulfate': { n: 20, p: 0, k: 0, s: 24 },
  'Zinc Sulfate': { n: 0, p: 0, k: 0, s: 0 }, // 21% Zn
  'Borax': { n: 0, p: 0, k: 0, s: 0 } // 10.5% B
};

const SOIL_CORRECTION: Record<string, { n: number; p: number; k: number }> = {
  'low': { n: 1.2, p: 1.3, k: 1.2 },
  'medium': { n: 1.0, p: 1.0, k: 1.0 },
  'high': { n: 0.8, p: 0.7, k: 0.8 },
  'very_high': { n: 0.6, p: 0.5, k: 0.6 }
};

export async function POST(request: Request) {
  try {
    const { crop, area, soilTest, organicMatter, irrigation, yieldTarget } = await request.json();
    
    if (!crop || !CROP_NUTRIENTS[crop]) {
      return NextResponse.json({ error: 'Invalid or missing crop' }, { status: 400 });
    }
    
    const baseRequirements = CROP_NUTRIENTS[crop];
    const areaHa = area / 2.471; // Convert acres to hectares
    
    // Apply soil test corrections
    const soilStatus = soilTest || { n: 'medium', p: 'medium', k: 'medium' };
    const correctionFactors = {
      n: SOIL_CORRECTION[soilStatus.n]?.n || 1,
      p: SOIL_CORRECTION[soilStatus.p]?.p || 1,
      k: SOIL_CORRECTION[soilStatus.k]?.k || 1
    };
    
    // Apply organic matter reduction
    const omFactor = organicMatter ? Math.max(0.7, 1 - (organicMatter * 0.03)) : 1;
    
    // Apply irrigation adjustment
    const irrFactor = irrigation === 'drip' ? 0.85 : irrigation === 'sprinkler' ? 0.9 : 1;
    
    // Calculate actual requirements
    const adjustedN = Math.round(baseRequirements.n * areaHa * correctionFactors.n * omFactor * irrFactor);
    const adjustedP = Math.round(baseRequirements.p * areaHa * correctionFactors.p);
    const adjustedK = Math.round(baseRequirements.k * areaHa * correctionFactors.k);
    const adjustedS = Math.round(baseRequirements.s * areaHa);
    const adjustedZn = Math.round(baseRequirements.zn * areaHa);
    const adjustedB = Math.round(baseRequirements.b * areaHa * 10) / 10;
    
    // Calculate fertilizer quantities
    const fertilizerPlan = calculateFertilizerPlan(adjustedN, adjustedP, adjustedK, adjustedS, adjustedZn, adjustedB);
    
    // Calculate cost
    const costEstimate = calculateCost(fertilizerPlan);
    
    // Generate schedule
    const schedule = generateSchedule(crop, fertilizerPlan, irrigation);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      inputs: {
        crop,
        area: `${area} acres (${areaHa.toFixed(2)} ha)`,
        soilTest: soilStatus,
        organicMatter: `${organicMatter || 'N/A'}%`,
        irrigation
      },
      nutrientRequirements: {
        nitrogen: { required: adjustedN, unit: 'kg/ha', corrected: correctionFactors.n !== 1 },
        phosphorus: { required: adjustedP, unit: 'kg/ha', corrected: correctionFactors.p !== 1 },
        potassium: { required: adjustedK, unit: 'kg/ha', corrected: correctionFactors.k !== 1 },
        sulfur: { required: adjustedS, unit: 'kg/ha' },
        zinc: { required: adjustedZn, unit: 'kg/ha' },
        boron: { required: adjustedB, unit: 'kg/ha' }
      },
      fertilizerRecommendation: fertilizerPlan,
      costEstimate: costEstimate,
      applicationSchedule: schedule,
      organicOptions: generateOrganicAlternatives(adjustedN, adjustedP, adjustedK, areaHa),
      warnings: generateWarnings(crop, soilStatus, organicMatter),
      ispm: generateIPSMRecommendations(crop, areaHa)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}

function calculateFertilizerPlan(n: number, p: number, k: number, s: number, zn: number, b: number) {
  const plan = [];
  
  // Basal application
  const dapForP = Math.round((p * 100) / FERTILIZER_COMPOSITION['DAP'].p);
  const nFromDAP = Math.round(dapForP * FERTILIZER_COMPOSITION['DAP'].n / 100);
  const remainingN = n - nFromDAP;
  
  plan.push({
    stage: 'Basal (Sowing)',
    fertilizers: [
      { name: 'DAP', quantity: `${dapForP} kg`, purpose: 'Phosphorus + starter N' },
      { name: 'MOP', quantity: `${Math.round((k * 100) / 60)} kg`, purpose: 'Potassium' },
      { name: 'Zinc Sulfate', quantity: `${Math.round(zn * 5)} kg`, purpose: 'Zinc' },
      { name: 'Borax', quantity: `${Math.round(b * 10)} kg`, purpose: 'Boron' }
    ],
    method: 'Broadcast and mix in soil'
  });
  
  // Top dressing splits
  const ureaSplits = remainingN > 0 ? Math.ceil(remainingN / 46) : 0;
  if (ureaSplits > 0) {
    const split1 = Math.round(ureaSplits * 0.4);
    const split2 = Math.round(ureaSplits * 0.35);
    const split3 = Math.round(ureaSplits * 0.25);
    
    plan.push({
      stage: 'Top Dress 1 (30 DAS)',
      fertilizers: [{ name: 'Urea', quantity: `${split1} kg`, purpose: 'Nitrogen' }],
      method: 'Band placement near root zone'
    });
    
    if (split2 > 0) {
      plan.push({
        stage: 'Top Dress 2 (45-50 DAS)',
        fertilizers: [{ name: 'Urea', quantity: `${split2} kg`, purpose: 'Nitrogen' }],
        method: 'Band placement with irrigation'
      });
    }
    
    if (split3 > 0) {
      plan.push({
        stage: 'Top Dress 3 (60-65 DAS)',
        fertilizers: [{ name: 'Urea', quantity: `${split3} kg`, purpose: 'Nitrogen' }],
        method: 'Foliar if required'
      });
    }
  }
  
  return plan;
}

function calculateCost(plan: any[]) {
  const prices: Record<string, number> = {
    'Urea': 300,
    'DAP': 1400,
    'MOP': 1800,
    'SSP': 600,
    'Zinc Sulfate': 250,
    'Borax': 120
  };
  
  let totalCost = 0;
  plan.forEach(stage => {
    stage.fertilizers.forEach((fert: any) => {
      const qty = parseInt(fert.quantity);
      const price = prices[fert.name] || 500;
      totalCost += qty * (price / 50); // Price per kg
    });
  });
  
  return {
    total: Math.round(totalCost),
    currency: 'INR',
    perAcre: Math.round(totalCost / 2.471),
    note: 'Prices indicative. Check current market rates.'
  };
}

function generateSchedule(crop: string, plan: any[], irrigation: string) {
  const schedules: Record<string, string[]> = {
    'Wheat': ['0 DAS: Basal', '30 DAS: First split', '45 DAS: Second split'],
    'Rice': ['0 DAT: Basal', '20 DAT: First split', '40 DAT: Second split'],
    'Cotton': ['0 DAS: Basal', '30 DAS: Flowering stage', '60 DAS: Boll formation'],
    'Maize': ['0 DAS: Basal', '25 DAS: Knee-high', '40 DAS: Tasseling'],
    'Tomato': ['0 DAT: Basal', '20 DAT: Vegetative', '40 DAT: Fruiting', '60 DAT: Harvesting']
  };
  
  return schedules[crop] || ['Follow general split application schedule'];
}

function generateOrganicAlternatives(n: number, p: number, k: number, area: number) {
  return {
    fym: {
      name: 'Farm Yard Manure (FYM)',
      quantity: `${Math.round(area * 10)} tonnes`,
      provides: 'N-P-K + Micronutrients + Organic matter',
      timing: 'Apply 2-3 weeks before sowing'
    },
    vermicompost: {
      name: 'Vermicompost',
      quantity: `${Math.round(area * 2.5)} tonnes`,
      provides: 'Humus, beneficial microbes, slow-release N',
      timing: 'Mix with soil at sowing'
    },
    greenManure: {
      name: 'Green Manuring (Dhaincha/Sesbania)',
      quantity: 'Grow for 45 days, incorporate',
      provides: `~${Math.round(area * 40)} kg N equivalent`,
      timing: '45 days before main crop'
    },
    biofertilizers: {
      name: 'Biofertilizers (Rhizobium/PSB)',
      quantity: `${Math.round(area * 500)} g`,
      provides: 'N fixation / P solubilization',
      timing: 'Seed treatment at sowing'
    }
  };
}

function generateWarnings(crop: string, soilTest: any, om: number): string[] {
  const warnings = [];
  
  if (soilTest.p === 'high' || soilTest.p === 'very_high') {
    warnings.push('⚠️ High soil phosphorus. Reduce DAP, use SSP instead.');
  }
  
  if (soilTest.k === 'high' || soilTest.k === 'very_high') {
    warnings.push('⚠️ High soil potassium. Skip MOP application.');
  }
  
  if (!om || om < 0.5) {
    warnings.push('⚠️ Low organic matter. Add 10t/ha FYM or compost.');
  }
  
  if (crop === 'Rice' && soilTest.n === 'high') {
    warnings.push('ℹ️ Reduce N by 20% for rice to prevent lodging.');
  }
  
  return warnings.length > 0 ? warnings : ['✓ Soil-nutrient balance looks good.'];
}

function generateIPSMRecommendations(crop: string, area: number) {
  return {
    integratedApproach: 'Combine chemical + organic + biofertilizers',
    soilTesting: `Test soil every 2 years. Current area: ${area.toFixed(2)} ha`,
    balancedFertilization: 'Apply nutrients based on crop removal',
    micronutrients: 'Zn, B deficiency common. Apply as per recommendation.',
    timing: 'Split N application for efficiency. Avoid runoff.',
    method: 'Band placement > Broadcasting. Fertigation best for micro-irrigation.'
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    supportedCrops: Object.keys(CROP_NUTRIENTS),
    fertilizerTypes: Object.keys(FERTILIZER_COMPOSITION),
    soilTestParameters: ['n', 'p', 'k'],
    soilTestLevels: ['low', 'medium', 'high', 'very_high'],
    units: {
      area: 'acres or hectares',
      nutrients: 'kg/hectare',
      fertilizers: 'kg',
      organicMatter: 'percentage'
    },
    example: {
      crop: 'Wheat',
      area: 2,
      soilTest: { n: 'medium', p: 'low', k: 'medium' },
      organicMatter: 0.8,
      irrigation: 'flood'
    }
  });
}
