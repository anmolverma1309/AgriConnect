import { NextResponse } from 'next/server';

// Crop Calendar API - Seasonal advisory and farming schedule
// Provides month-wise activities for major crops

const CROP_CALENDAR: Record<string, Array<{
  month: string;
  activity: string;
  priority: 'high' | 'medium' | 'low';
  details: string;
  window: string;
}>> = {
  'Wheat': [
    { month: 'October', activity: 'Land Preparation', priority: 'high', details: 'Plough field 2-3 times, apply FYM', window: 'Oct 15-31' },
    { month: 'November', activity: 'Sowing', priority: 'high', details: 'Sow HD-2967 or DBW-187 varieties, 100-125kg/ha', window: 'Nov 1-20' },
    { month: 'December', activity: 'First Irrigation', priority: 'high', details: 'Irrigate at crown root initiation stage', window: 'Dec 15-30' },
    { month: 'January', activity: 'Top Dressing', priority: 'medium', details: 'Apply 1st split of nitrogen (40kg N)', window: 'Jan 10-25' },
    { month: 'February', activity: 'Disease Watch', priority: 'high', details: 'Monitor for yellow rust, spray if needed', window: 'Feb 1-28' },
    { month: 'March', activity: 'Second Top Dressing', priority: 'medium', details: 'Apply 2nd nitrogen split, irrigation', window: 'Mar 1-15' },
    { month: 'April', activity: 'Harvesting', priority: 'high', details: 'Harvest when grain hard, moisture <12%', window: 'Apr 1-30' }
  ],
  'Rice': [
    { month: 'May', activity: 'Nursery Preparation', priority: 'high', details: 'Prepare nursery bed, seed treatment', window: 'May 15-30' },
    { month: 'June', activity: 'Sowing & Transplanting', priority: 'high', details: 'Sow in nursery, transplant 25-day seedlings', window: 'Jun 1-30' },
    { month: 'July', activity: 'Weed Management', priority: 'high', details: 'First weeding at 20 DAT', window: 'Jul 10-25' },
    { month: 'August', activity: 'Fertilizer Application', priority: 'medium', details: 'Top dress nitrogen at tillering', window: 'Aug 1-20' },
    { month: 'September', activity: 'Pest Control', priority: 'high', details: 'Monitor stem borer, apply need-based control', window: 'Sep 1-30' },
    { month: 'October', activity: 'Harvesting', priority: 'high', details: 'Harvest at 20-25% moisture, dry to 12%', window: 'Oct 15-Nov 15' }
  ],
  'Cotton': [
    { month: 'April', activity: 'Seed Selection', priority: 'high', details: 'Choose Bt varieties, seed treatment', window: 'Apr 1-15' },
    { month: 'May', activity: 'Sowing', priority: 'high', details: 'Sow at 75-90cm spacing, 3-4 seeds/pit', window: 'May 15-Jun 15' },
    { month: 'June', activity: 'Thinning & Gap Filling', priority: 'medium', details: 'Retain 2 healthy plants per pit', window: 'Jun 15-30' },
    { month: 'July', activity: 'First Pinching', priority: 'medium', details: 'Remove terminal bud at 6-8 leaves', window: 'Jul 1-15' },
    { month: 'August', activity: 'Irrigation', priority: 'high', details: 'Critical irrigation at flowering', window: 'Aug 1-31' },
    { month: 'September', activity: 'Pest Management', priority: 'high', details: 'Monitor pink bollworm, spray if ETL crossed', window: 'Sep 1-30' },
    { month: 'October', activity: 'Boll Opening', priority: 'high', details: 'Stop irrigation, prepare for picking', window: 'Oct 1-31' },
    { month: 'November', activity: 'Harvesting', priority: 'high', details: 'Pick cotton every 7-10 days', window: 'Nov 1-Dec 15' }
  ],
  'Soybean': [
    { month: 'June', activity: 'Land Preparation', priority: 'high', details: 'Fine tilth, treat with Rhizobium', window: 'Jun 1-20' },
    { month: 'June-July', activity: 'Sowing', priority: 'high', details: 'Sow JS-335 at 30-45cm spacing, 60kg/ha', window: 'Jun 20-Jul 15' },
    { month: 'July', activity: 'Thinning', priority: 'medium', details: 'Maintain 10-15 plants/m²', window: 'Jul 15-30' },
    { month: 'August', activity: 'Weeding', priority: 'high', details: 'Two hand weedings at 20 and 40 DAS', window: 'Aug 1-31' },
    { month: 'September', activity: 'Irrigation', priority: 'high', details: 'One critical irrigation at pod filling', window: 'Sep 1-15' },
    { month: 'October', activity: 'Harvesting', priority: 'high', details: 'Harvest when leaves drop, pods brown', window: 'Oct 1-31' }
  ]
};

const SEASONAL_ADVISORY: Record<string, string[]> = {
  'Kharif': [
    'Pre-monsoon: Complete land preparation before rains',
    'Early sowing: Use short-duration varieties if delayed',
    'Drainage: Ensure proper drainage in heavy soils',
    'Pest alert: Monitor for stem borer and leaf folder in rice',
    'Nutrition: Apply 1/3 N basal, 2/3 in splits'
  ],
  'Rabi': [
    'Timely sowing: Complete sowing by recommended dates',
    'Irrigation: Plan limited water efficiently',
    'Disease watch: Yellow rust in wheat, blast in rice',
    'Frost protection: Light irrigation during frost nights',
    'Harvest: Monitor grain moisture for safe storage'
  ],
  'Zaid': [
    'Heat management: Choose heat-tolerant varieties',
    'Irrigation: Increase frequency, reduce depth',
    'Quick crops: Prefer 60-90 day varieties',
    'Pest pressure: Higher pest activity expected',
    'Market: Plan for early market entry'
  ]
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop');
    const month = searchParams.get('month') || getCurrentMonth();
    const location = searchParams.get('location') || 'North India';
    
    if (!crop) {
      return NextResponse.json({
        success: true,
        currentMonth: month,
        currentSeason: getCurrentSeason(),
        availableCrops: Object.keys(CROP_CALENDAR),
        seasonalAdvisory: SEASONAL_ADVISORY[getCurrentSeason()],
        message: 'Select a crop to view detailed calendar'
      });
    }
    
    const calendar = CROP_CALENDAR[crop];
    if (!calendar) {
      return NextResponse.json({ error: 'Crop not found' }, { status: 404 });
    }
    
    // Get current activities
    const currentActivities = calendar.filter(a => a.month.includes(month));
    const upcoming = calendar.filter(a => getMonthIndex(a.month) > getMonthIndex(month));
    const completed = calendar.filter(a => getMonthIndex(a.month) < getMonthIndex(month));
    
    return NextResponse.json({
      success: true,
      crop,
      location,
      currentMonth: month,
      season: getCurrentSeason(),
      activities: {
        current: currentActivities,
        upcoming: upcoming.slice(0, 3),
        completed: completed.slice(-2)
      },
      seasonalTips: SEASONAL_ADVISORY[getCurrentSeason()],
      keyDates: extractKeyDates(calendar),
      laborRequirements: estimateLabor(crop),
      inputSchedule: generateInputSchedule(crop, month)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { crops, area, startDate } = await request.json();
    
    // Generate integrated calendar for multiple crops
    const integratedCalendar = generateIntegratedCalendar(crops, startDate);
    
    return NextResponse.json({
      success: true,
      crops,
      totalArea: `${area} acres`,
      integratedSchedule: integratedCalendar,
      conflicts: findConflicts(integratedCalendar),
      recommendations: optimizeSchedule(integratedCalendar, area)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}

function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  return 'Zaid';
}

function getMonthIndex(monthStr: string): number {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months.findIndex(m => monthStr.includes(m));
}

function extractKeyDates(calendar: any[]) {
  return calendar
    .filter(a => a.priority === 'high')
    .map(a => ({
      activity: a.activity,
      month: a.month,
      window: a.window
    }));
}

function estimateLabor(crop: string): string {
  const labor: Record<string, string> = {
    'Wheat': '25-30 man-days/acre',
    'Rice': '40-50 man-days/acre (transplanting)',
    'Cotton': '60-80 man-days/acre (picking intensive)',
    'Soybean': '15-20 man-days/acre'
  };
  return labor[crop] || '20-30 man-days/acre';
}

function generateInputSchedule(crop: string, month: string) {
  return {
    seeds: `Required: Check variety for ${month} sowing`,
    fertilizers: 'Apply as per soil test recommendations',
    pesticides: 'Keep ready: Neem oil, Fungicide, Insecticide',
    irrigation: 'Check pump/pipe availability'
  };
}

function generateIntegratedCalendar(crops: string[], startDate: string) {
  const schedule: any[] = [];
  crops.forEach(crop => {
    const cal = CROP_CALENDAR[crop];
    if (cal) {
      cal.forEach(activity => {
        schedule.push({
          crop,
          ...activity,
          id: `${crop}-${activity.month}-${activity.activity}`
        });
      });
    }
  });
  return schedule.sort((a, b) => getMonthIndex(a.month) - getMonthIndex(b.month));
}

function findConflicts(schedule: any[]) {
  const conflicts: any[] = [];
  // Check for overlapping high-priority activities
  const highPriority = schedule.filter(s => s.priority === 'high');
  
  for (let i = 0; i < highPriority.length; i++) {
    for (let j = i + 1; j < highPriority.length; j++) {
      if (highPriority[i].month === highPriority[j].month && 
          highPriority[i].crop !== highPriority[j].crop) {
        conflicts.push({
          month: highPriority[i].month,
          activities: [highPriority[i], highPriority[j]],
          suggestion: 'Stagger operations or hire additional labor'
        });
      }
    }
  }
  return conflicts;
}

function optimizeSchedule(schedule: any[], area: number) {
  const recommendations = [];
  
  if (area > 10) {
    recommendations.push('Consider mechanization for >10 acres');
  }
  
  const highPriorityMonths = schedule.filter(s => s.priority === 'high')
    .reduce((acc: Record<string, number>, curr) => {
      acc[curr.month] = (acc[curr.month] || 0) + 1;
      return acc;
    }, {});
  
  Object.entries(highPriorityMonths).forEach(([month, count]) => {
    if ((count as number) > 2) {
      recommendations.push(`${month}: ${count} critical activities - plan labor carefully`);
    }
  });
  
  return recommendations.length > 0 ? recommendations : ['Schedule looks manageable'];
}
