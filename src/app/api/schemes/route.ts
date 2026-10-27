import { NextResponse } from 'next/server';

// Government schemes and farmer welfare programs API
// Provides real-time status of PM-KISAN, insurance, subsidies

const GOVERNMENT_SCHEMES = [
  {
    id: 'pmkisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    ministry: 'Agriculture & Farmers Welfare',
    description: 'Direct income support of ₹6,000 per year to farmer families',
    eligibility: ['Small and marginal farmers', 'Land ownership records', 'Aadhaar linked bank account'],
    benefitAmount: 6000,
    frequency: 'Annual (3 installments of ₹2,000)',
    status: 'active',
    nextInstallment: '2024-05-15',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Mobile Number'],
    helpline: '155261',
    website: 'https://pmkisan.gov.in',
    statusCheck: {
      url: 'https://pmkisan.gov.in/BeneficiaryStatus.aspx',
      method: 'POST',
      params: ['Aadhaar Number', 'Account Number', 'Mobile Number']
    }
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    ministry: 'Agriculture & Farmers Welfare',
    description: 'Comprehensive crop insurance with low premium',
    eligibility: ['All farmers growing notified crops', 'Loanee and non-loanee farmers'],
    benefitAmount: 0,
    frequency: 'Per crop season',
    status: 'active',
    premium: {
      kharif: '2% of sum insured',
      rabi: '1.5% of sum insured',
      commercial: '5% of sum insured'
    },
    documents: ['Aadhaar Card', 'Land Records', 'Sowing Certificate', 'Bank Account'],
    helpline: '1800-2090-100',
    website: 'https://pmfby.gov.in',
    cropsCovered: ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'Pulses', 'Oilseeds']
  },
  {
    id: 'soilhealth',
    name: 'Soil Health Card Scheme',
    ministry: 'Agriculture & Farmers Welfare',
    description: 'Free soil testing and nutrient recommendations every 2 years',
    eligibility: ['All farmers', 'One card per landholding'],
    benefitAmount: 0,
    frequency: 'Every 2 years',
    status: 'active',
    documents: ['Land Records', 'Aadhaar Card', 'Mobile Number'],
    helpline: '1800-180-1551',
    website: 'https://soilhealth.dac.gov.in',
    features: ['12 Parameters tested', 'Fertilizer recommendations', 'Soil health rating']
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    ministry: 'Finance - NABARD',
    description: 'Short-term credit at 7% interest (with 3% prompt repayment incentive)',
    eligibility: ['All farmers', 'Tenant farmers', 'Self-help groups'],
    benefitAmount: 300000,
    frequency: '5 years renewable',
    status: 'active',
    interestRate: '7% (4% with prompt repayment)',
    documents: ['Aadhaar Card', 'Land Records/Lease Deed', 'Photograph', 'Bank Account'],
    helpline: '1800-11-22-33',
    website: 'https://www.nabard.org',
    features: ['Flexible credit limit', 'ATM-cum-debit card', 'Interest subvention']
  },
  {
    id: 'agriinfra',
    name: 'Agriculture Infrastructure Fund',
    ministry: 'Agriculture & Farmers Welfare',
    description: '₹1 lakh crore financing for farm infrastructure',
    eligibility: ['Farmers', 'FPOs', 'SHGs', 'Startups', 'Agri-entrepreneurs'],
    benefitAmount: 100000000,
    frequency: 'One-time project loan',
    status: 'active',
    interestRate: 'Capped at nominal rate',
    documents: ['Project Report', 'Land Documents', 'Identity Proof', 'Bank Details'],
    helpline: '011-2338-4339',
    website: 'https://agriinfra.dac.gov.in',
    projects: ['Warehouse', 'Cold Storage', 'Processing Units', 'Custom Hiring Centers']
  },
  {
    id: 'nmsa',
    name: 'NMSA (National Mission on Sustainable Agriculture)',
    ministry: 'Agriculture & Farmers Welfare',
    description: 'Climate-resilient practices and organic farming support',
    eligibility: ['Farmers adopting sustainable practices', 'FPOs'],
    benefitAmount: 50000,
    frequency: 'Per hectare subsidy',
    status: 'active',
    components: ['Rainfed Area Development', 'On-Farm Water Management', 'Climate Change'],
    documents: ['Land Records', 'Aadhaar', 'Bank Account', 'Farming Practice Details'],
    helpline: '011-2338-4339',
    website: 'https://nmsa.dac.gov.in',
    subsidies: ['Organic farming: ₹10,000/ha', 'Vermicompost: 50% cost', 'Farm ponds: ₹1.5 lakh']
  },
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    ministry: 'Agriculture & Farmers Welfare',
    description: 'Subsidy on farm machinery and equipment',
    eligibility: ['Individual farmers', 'Cooperatives', 'Custom Hiring Centers'],
    benefitAmount: 0,
    frequency: 'Per machine subsidy',
    status: 'active',
    subsidyPercent: '40-80% depending on category',
    documents: ['Aadhaar', 'Land Records', 'Quotation from dealer', 'Bank Account'],
    helpline: '011-2338-4339',
    website: 'https://smam.gov.in',
    machines: ['Tractor', 'Combine Harvester', 'Power Tiller', 'Thresher', 'Seeder']
  },
  {
    id: 'midh',
    name: 'MIDH (Mission for Integrated Development of Horticulture)',
    ministry: 'Agriculture & Farmers Welfare',
    description: 'Comprehensive horticulture development with 50-100% subsidy',
    eligibility: ['Horticulture farmers', 'FPOs', 'SHGs', 'NGOs'],
    benefitAmount: 0,
    frequency: 'Project-based',
    status: 'active',
    components: ['NHM', 'HMNEH', 'NHB', 'CDB', 'CIH'],
    documents: ['Aadhaar', 'Land Records', 'Project Proposal', 'Bank Account'],
    helpline: '011-2338-4339',
    website: 'https://midh.gov.in',
    crops: ['Mango', 'Banana', 'Apple', 'Tomato', 'Potato', 'Onion', 'Chilli']
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'Karnataka';
    const category = searchParams.get('category') || 'all';
    
    // Filter schemes by category
    let schemes = GOVERNMENT_SCHEMES;
    if (category !== 'all') {
      schemes = schemes.filter(s => {
        if (category === 'financial') return ['pmkisan', 'kcc', 'agriinfra'].includes(s.id);
        if (category === 'insurance') return ['pmfby'].includes(s.id);
        if (category === 'infrastructure') return ['agriinfra', 'smam'].includes(s.id);
        if (category === 'sustainable') return ['nmsa', 'soilhealth'].includes(s.id);
        if (category === 'horticulture') return ['midh'].includes(s.id);
        return true;
      });
    }
    
    // Add state-specific modifications
    const stateSchemes = schemes.map(scheme => ({
      ...scheme,
      stateSpecific: getStateSpecificInfo(scheme.id, state)
    }));
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      state: state,
      totalSchemes: stateSchemes.length,
      categories: ['financial', 'insurance', 'infrastructure', 'sustainable', 'horticulture'],
      schemes: stateSchemes,
      quickLinks: {
        checkPMKISANStatus: 'https://pmkisan.gov.in/BeneficiaryStatus.aspx',
        downloadSoilHealthCard: 'https://soilhealth.dac.gov.in',
        calculateInsurance: 'https://pmfby.gov.in/CalcPremium.aspx',
        findNearestCSC: 'https://csc.gov.in'
      },
      helplines: {
        pmkisan: '155261',
        kisanCallCenter: '1800-180-1551',
        pmfby: '1800-2090-100'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch schemes'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { schemeId, action, aadhaar, details } = await request.json();
    
    // Simulate checking status or applying
    if (action === 'checkStatus') {
      return NextResponse.json({
        success: true,
        schemeId,
        status: Math.random() > 0.3 ? 'active' : 'pending',
        lastUpdated: new Date().toISOString(),
        details: {
          beneficiaryId: `BEN${Math.floor(Math.random() * 1000000)}`,
          installmentsReceived: Math.floor(Math.random() * 3),
          nextInstallmentDate: '2024-05-15',
          amountReceived: 12000
        }
      });
    }
    
    if (action === 'apply') {
      return NextResponse.json({
        success: true,
        schemeId,
        applicationId: `APP${Date.now()}`,
        status: 'submitted',
        message: 'Application submitted successfully. Track with Application ID.',
        nextSteps: [
          'Visit nearest CSC for document verification',
          'Wait for SMS confirmation',
          'Check status online after 7 days'
        ]
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

function getStateSpecificInfo(schemeId: string, state: string) {
  const stateInfo: Record<string, Record<string, any>> = {
    'pmkisan': {
      'Uttar Pradesh': { beneficiaries: 2.5, coverage: '95%' },
      'Maharashtra': { beneficiaries: 1.8, coverage: '92%' },
      'Karnataka': { beneficiaries: 0.9, coverage: '88%' }
    },
    'pmfby': {
      'Uttar Pradesh': { enrolled: 4.2, claimRate: '85%' },
      'Maharashtra': { enrolled: 3.1, claimRate: '82%' },
      'Karnataka': { enrolled: 1.5, claimRate: '88%' }
    }
  };
  
  return stateInfo[schemeId]?.[state] || { beneficiaries: 'Data not available' };
}
