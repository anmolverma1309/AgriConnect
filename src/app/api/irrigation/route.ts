import { NextResponse } from 'next/server';

// Irrigation Calculator API
// Calculates water requirements and schedules irrigation

const CROP_WATER_REQUIREMENTS: Record<string, {
  totalMm: number;
  criticalStages: string[];
  dailyMm: Record<string, number>;
  rootDepth: number;
  kc: Record<string, number>; // Crop coefficients
}> = {
  'Wheat': {
    totalMm: 450,
    criticalStages: ['Crown root initiation', 'Flowering', 'Grain filling'],
    dailyMm: { initial: 3.5, development: 5.5, mid: 7.0, late: 4.0 },
    rootDepth: 1.2,
    kc: { initial: 0.3, development: 0.7, mid: 1.15, late: 0.4 }
  },
  'Rice': {
    totalMm: 1200,
    criticalStages: ['Tillering', 'Panicle initiation', 'Flowering'],
    dailyMm: { initial: 5.0, development: 8.0, mid: 10.0, late: 6.0 },
    rootDepth: 0.6,
    kc: { initial: 1.0, development: 1.2, mid: 1.3, late: 1.0 }
  },
  'Cotton': {
    totalMm: 800,
    criticalStages: ['Flowering', 'Boll formation', 'Boll opening'],
    dailyMm: { initial: 3.0, development: 6.0, mid: 8.0, late: 4.0 },
    rootDepth: 1.5,
    kc: { initial: 0.35, development: 0.7, mid: 1.2, late: 0.7 }
  },
  'Maize': {
    totalMm: 500,
    criticalStages: ['Knee-high', 'Tasseling', 'Grain filling'],
    dailyMm: { initial: 3.5, development: 5.5, mid: 7.5, late: 4.5 },
    rootDepth: 1.0,
    kc: { initial: 0.3, development: 0.7, mid: 1.2, late: 0.5 }
  },
  'Soybean': {
    totalMm: 600,
    criticalStages: ['Flowering', 'Pod filling', 'Seed development'],
    dailyMm: { initial: 3.0, development: 5.0, mid: 7.0, late: 3.5 },
    rootDepth: 1.2,
    kc: { initial: 0.3, development: 0.7, mid: 1.15, late: 0.5 }
  },
  'Tomato': {
    totalMm: 600,
    criticalStages: ['Flowering', 'Fruit set', 'Fruit development'],
    dailyMm: { initial: 2.5, development: 4.5, mid: 6.0, late: 4.0 },
    rootDepth: 0.8,
    kc: { initial: 0.4, development: 0.8, mid: 1.15, late: 0.8 }
  }
};

const SOIL_TYPES: Record<string, { waterHolding: number; infiltration: number; name: string }> = {
  'sandy': { waterHolding: 80, infiltration: 150, name: 'Sandy' },
  'loamy': { waterHolding: 150, infiltration: 80, name: 'Loamy' },
  'clay': { waterHolding: 200, infiltration: 40, name: 'Clay/Black' },
  'silty': { waterHolding: 180, infiltration: 60, name: 'Silty' }
};

export async function POST(request: Request) {
  try {
    const { 
      crop, 
      area, 
      soilType = 'loamy', 
      growthStage = 'mid',
      irrigationMethod = 'flood',
      lastIrrigationDays,
      expectedRainfall = 0,
      temperature = 30
    } = await request.json();
    
    if (!crop || !CROP_WATER_REQUIREMENTS[crop]) {
      return NextResponse.json({ 
        error: 'Invalid or unsupported crop',
        supportedCrops: Object.keys(CROP_WATER_REQUIREMENTS)
      }, { status: 400 });
    }
    
    const cropData = CROP_WATER_REQUIREMENTS[crop];
    const soil = SOIL_TYPES[soilType] || SOIL_TYPES['loamy'];
    
    // Calculate water requirements
    const dailyET = calculateET(crop, growthStage, temperature);
    const soilMoisture = calculateSoilMoisture(soil, lastIrrigationDays, dailyET);
    const irrigationNeeded = calculateIrrigationNeed(soilMoisture, soil, expectedRainfall);
    
    // Calculate volume
    const areaHa = area / 2.471;
    const volumePerHa = irrigationNeeded.volumeMm * 10; // Convert mm to m³/ha
    const totalVolume = volumePerHa * areaHa;
    
    // Calculate duration
    const duration = calculateIrrigationDuration(irrigationNeeded.volumeMm, irrigationMethod, area);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      inputs: {
        crop,
        area: `${area} acres (${areaHa.toFixed(2)} ha)`,
        soilType: soil.name,
        growthStage,
        irrigationMethod,
        daysSinceLastIrrigation: lastIrrigationDays
      },
      currentStatus: {
        dailyWaterRequirement: `${dailyET.toFixed(1)} mm/day`,
        soilMoisture: `${soilMoisture.toFixed(0)}% of field capacity`,
        waterStress: soilMoisture < 50 ? 'Yes - Immediate irrigation needed' : 'No'
      },
      recommendation: {
        irrigateNow: irrigationNeeded.urgent,
        volume: `${totalVolume.toFixed(0)} m³ (${(totalVolume * 1000).toFixed(0)} liters)`,
        depth: `${irrigationNeeded.volumeMm.toFixed(1)} mm`,
        duration: duration,
        timing: getBestIrrigationTime(temperature, irrigationMethod),
        method: getIrrigationAdvice(irrigationMethod, crop)
      },
      schedule: generateSchedule(crop, growthStage, soilType, area, irrigationMethod),
      efficiencyTips: [
        'Irrigate during early morning (4-8 AM) to minimize evaporation',
        'Monitor soil moisture at 15-20 cm depth',
        'Adjust for rainfall - skip irrigation if >10mm rain expected',
        'Use mulching to reduce evaporation by 30-40%'
      ],
      monthlyEstimate: calculateMonthlyEstimate(crop, area, soilType)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop');
    
    if (crop && CROP_WATER_REQUIREMENTS[crop]) {
      return NextResponse.json({
        success: true,
        crop,
        waterRequirements: CROP_WATER_REQUIREMENTS[crop],
        criticalStages: CROP_WATER_REQUIREMENTS[crop].criticalStages
      });
    }
    
    return NextResponse.json({
      success: true,
      supportedCrops: Object.keys(CROP_WATER_REQUIREMENTS),
      soilTypes: Object.keys(SOIL_TYPES),
      irrigationMethods: ['flood', 'furrow', 'drip', 'sprinkler'],
      generalGuidelines: {
        wheat: '6-7 irrigations: Crown root, Tillering, Jointing, Flowering, Milk, Dough',
        rice: 'Continuous flooding 5cm depth, drain 10 days before harvest',
        cotton: 'Critical: Flowering (60 DAS) and Boll formation (90 DAS)',
        maize: 'Critical: Knee-high (25 DAS), Tasseling (45 DAS), Grain filling'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

function calculateET(crop: string, stage: string, temp: number): number {
  const kc = CROP_WATER_REQUIREMENTS[crop].kc[stage] || 1.0;
  // Simplified ET calculation
  const eto = 0.0023 * (temp + 17.8) * Math.pow((temp - 0.5), 0.5); // Blaney-Criddle
  return eto * kc;
}

function calculateSoilMoisture(soil: any, daysSince: number, dailyET: number): number {
  if (!daysSince || daysSince === 0) return 100;
  const waterLoss = dailyET * daysSince;
  const current = 100 - (waterLoss / soil.waterHolding * 100);
  return Math.max(20, Math.min(100, current));
}

function calculateIrrigationNeed(soilMoisture: number, soil: any, expectedRain: number): { urgent: boolean; volumeMm: number } {
  const threshold = 50; // 50% depletion
  
  if (soilMoisture > threshold && expectedRain > 10) {
    return { urgent: false, volumeMm: 0 };
  }
  
  const needToFill = (100 - soilMoisture) / 100 * soil.waterHolding;
  const adjustedForRain = Math.max(0, needToFill - expectedRain);
  
  return {
    urgent: soilMoisture < threshold,
    volumeMm: adjustedForRain
  };
}

function calculateIrrigationDuration(volumeMm: number, method: string, area: number): string {
  if (volumeMm === 0) return 'No irrigation needed';
  
  const rates: Record<string, number> = {
    'drip': 4,      // mm/hour
    'sprinkler': 8,
    'furrow': 12,
    'flood': 15
  };
  
  const rate = rates[method] || 10;
  const hours = volumeMm / rate;
  
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  return `${hours.toFixed(1)} hours`;
}

function getBestIrrigationTime(temp: number, method: string): string {
  if (temp > 35) return 'Early morning (4-7 AM) only - avoid midday heat';
  if (method === 'drip') return 'Any time (drip minimizes evaporation)';
  return 'Early morning (4-8 AM) preferred';
}

function getIrrigationAdvice(method: string, crop: string): string {
  const advice: Record<string, string> = {
    'drip': 'Most efficient - use for vegetables, orchards, cotton',
    'sprinkler': 'Good for uneven terrain - wheat, pulses',
    'furrow': 'Traditional - cotton, maize, vegetables',
    'flood': 'For rice paddies and flat terrain'
  };
  return advice[method] || 'Select based on crop and terrain';
}

function generateSchedule(crop: string, currentStage: string, soilType: string, area: number, method: string): any[] {
  const stages = ['initial', 'development', 'mid', 'late'];
  const currentIndex = stages.indexOf(currentStage);
  const schedule = [];
  
  for (let i = currentIndex; i < stages.length; i++) {
    const stage = stages[i];
    const days = stage === 'initial' ? 20 : stage === 'development' ? 30 : stage === 'mid' ? 40 : 20;
    const frequency = calculateFrequency(soilType, crop, stage);
    
    schedule.push({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      duration: `${days} days`,
      irrigations: Math.round(days / frequency),
      frequency: `Every ${frequency} days`,
      critical: CROP_WATER_REQUIREMENTS[crop].criticalStages.includes(stage)
    });
  }
  
  return schedule;
}

function calculateFrequency(soilType: string, crop: string, stage: string): number {
  const baseFreq = CROP_WATER_REQUIREMENTS[crop].dailyMm[stage] || 5;
  const soilFactor: Record<string, number> = { sandy: 0.7, loamy: 1, clay: 1.3, silty: 1.2 };
  return Math.round((SOIL_TYPES[soilType].waterHolding / 100) / (baseFreq / 100) * (soilFactor[soilType] || 1));
}

function calculateMonthlyEstimate(crop: string, area: number, soilType: string) {
  const cropData = CROP_WATER_REQUIREMENTS[crop];
  const avgDaily = Object.values(cropData.dailyMm).reduce((a, b) => a + b, 0) / 4;
  const monthly = avgDaily * 30;
  const totalM3 = (monthly * 10 * area) / 2.471;
  
  return {
    monthlyWaterRequirement: `${monthly.toFixed(0)} mm`,
    totalVolume: `${totalM3.toFixed(0)} m³`,
    estimatedPumpHours: `${(totalM3 / 20).toFixed(0)} hours` // Assuming 20 m³/hour pump
  };
}
