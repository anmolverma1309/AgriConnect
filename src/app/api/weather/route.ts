import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '12.9716'; // Default to Bangalore
  const lon = searchParams.get('lon') || '77.5946';
  const city = searchParams.get('city') || 'Bannikuppe';
  
  try {
    // Try Open-Meteo first (free, no API key needed)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=3`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();
    
    // Map weather codes to conditions
    const weatherCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      80: 'Rain showers', 81: 'Moderate showers', 82: 'Violent showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail'
    };
    
    return NextResponse.json({
      location: city,
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      weathercode: data.current_weather.weathercode,
      condition: weatherCodes[data.current_weather.weathercode] || 'Unknown',
      daily: data.daily,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    // Fallback to mock data if API fails
    return NextResponse.json({
      location: city,
      temperature: 28,
      windspeed: 12,
      weathercode: 1,
      condition: 'Partly Cloudy',
      daily: {
        temperature_2m_max: [30, 31, 29],
        temperature_2m_min: [22, 23, 21],
        precipitation_sum: [0, 2, 5]
      },
      updatedAt: new Date().toISOString(),
      source: 'fallback'
    });
  }
}
