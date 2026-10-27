import { NextResponse } from 'next/server';

const LABOURERS = [
  { id: '1', name: 'Ramesh Kumar', phone: '+91 98765 43210', skills: 'Harvesting, Planting, Weeding', location: 'Bannikuppe, Karnataka', pricePerDay: 500, available: true, rating: 4.5 },
  { id: '2', name: 'Suresh Patel', phone: '+91 98765 43211', skills: 'Equipment Operator, Tractor Driver', location: 'Bannikuppe, Karnataka', pricePerDay: 700, available: true, rating: 4.8 },
  { id: '3', name: 'Lakshmi Devi', phone: '+91 98765 43212', skills: 'Transplanting, Harvesting', location: 'Bannikuppe, Karnataka', pricePerDay: 450, available: true, rating: 4.3 },
  { id: '4', name: 'Ganesh Murthy', phone: '+91 98765 43213', skills: 'Irrigation, Spraying', location: 'Bannikuppe, Karnataka', pricePerDay: 550, available: false, rating: 4.6 },
  { id: '5', name: 'Shiva Reddy', phone: '+91 98765 43214', skills: 'Ploughing, Tilling', location: 'Bannikuppe, Karnataka', pricePerDay: 600, available: true, rating: 4.4 },
];

export async function GET() {
  return NextResponse.json({ labourers: LABOURERS });
}
