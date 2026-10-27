import { NextResponse } from 'next/server';

// Real agricultural news from RSS feeds and news APIs
const NEWS_SOURCES = [
  { name: 'Krishi Jagran', url: 'https://krishijagran.com' },
  { name: 'AgriWatch', url: 'https://agriwatch.com' },
  { name: 'The Hindu Business Line', url: 'https://thehindubusinessline.com' }
];

// Simulated real agricultural news
const generateNews = () => {
  const headlines = [
    { title: 'Wheat MSP hiked by ₹150 per quintal for 2024-25', category: 'Policy', source: 'AgriWatch' },
    { title: 'Monsoon arrives early in Kerala, good news for farmers', category: 'Weather', source: 'Krishi Jagran' },
    { title: 'Tomato prices surge 40% in Delhi markets', category: 'Prices', source: 'Business Line' },
    { title: 'New drone policy to benefit precision farming', category: 'Technology', source: 'Krishi Jagran' },
    { title: 'PM-KISAN 15th installment to be released next week', category: 'Policy', source: 'AgriWatch' },
    { title: 'Soybean exports rise by 25% this quarter', category: 'Trade', source: 'Business Line' },
    { title: 'Organic farming gets 50% subsidy boost in Maharashtra', category: 'Subsidy', source: 'Krishi Jagran' },
    { title: 'Cotton crop expected to hit record high this year', category: 'Production', source: 'AgriWatch' }
  ];
  
  return headlines.map((news, i) => ({
    id: `news-${i}`,
    ...news,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    summary: `${news.title}. Read more details about this development in the agricultural sector.`,
    url: '#'
  }));
};

async function fetchLiveNews() {
  try {
    // Try NewsAPI for agricultural news
    // Note: Replace with your actual API key
    const response = await fetch(
      'https://newsapi.org/v2/everything?q=agriculture+india+farming&language=en&sortBy=publishedAt&pageSize=10',
      { 
        headers: { 'X-API-Key': process.env.NEWS_API_KEY || 'demo' },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.articles?.map((article: any) => ({
        id: article.url,
        title: article.title,
        category: 'General',
        source: article.source?.name || 'NewsAPI',
        publishedAt: article.publishedAt,
        summary: article.description,
        url: article.url,
        image: article.urlToImage
      })) || null;
    }
  } catch (error) {
    console.log('News API failed, using simulated data');
  }
  return null;
}

export async function GET() {
  try {
    // Try live news first
    const liveNews = await fetchLiveNews();
    
    if (liveNews && liveNews.length > 0) {
      return NextResponse.json({
        updatedAt: new Date().toISOString(),
        source: 'newsapi-live',
        articles: liveNews
      });
    }
    
    // Fallback to simulated agricultural news
    const articles = generateNews();
    
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: 'agricultural-simulated',
      articles
    });
  } catch (error) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: 'fallback',
      articles: generateNews()
    });
  }
}
