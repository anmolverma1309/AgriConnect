import { NextResponse } from 'next/server';

const TOOLS = [
  { id: '1', name: 'Mahindra 575 DI Tractor', owner: 'Ramesh Farms', location: 'Bannikuppe, Karnataka', pricePerDay: 1500, available: true, description: '57 HP tractor with rotavator attachment', image: '/images/tractor.jpg' },
  { id: '2', name: 'Combine Harvester', owner: 'Krishna Agro Services', location: 'Bannikuppe, Karnataka', pricePerDay: 5000, available: true, description: 'Self-propelled harvester for wheat/paddy', image: '/images/harvester.jpg' },
  { id: '3', name: 'Power Sprayer (Battery)', owner: 'Suresh Tools', location: 'Bannikuppe, Karnataka', pricePerDay: 300, available: true, description: '16L capacity, battery operated', image: '/images/sprayer.jpg' },
  { id: '4', name: 'Power Tiller (8HP)', owner: 'Village Rental', location: 'Bannikuppe, Karnataka', pricePerDay: 800, available: true, description: 'For small farms, ploughing & tilling', image: '/images/tiller.jpg' },
  { id: '5', name: 'Seed Drill Machine', owner: 'Agri Equipment Co', location: 'Bannikuppe, Karnataka', pricePerDay: 600, available: false, description: 'Precision seed sowing', image: '/images/seeder.jpg' },
  { id: '6', name: 'Thresher (Multicrop)', owner: 'Local Cooperative', location: 'Bannikuppe, Karnataka', pricePerDay: 1200, available: true, description: 'For wheat, rice, pulses', image: '/images/thresher.jpg' },
];

export async function GET() {
  return NextResponse.json({ tools: TOOLS });
}
