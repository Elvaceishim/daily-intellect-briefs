// netlify/functions/test-news.ts
export const handler = async () => {
  try {
    const API_KEY = process.env.VITE_NEWS_API_KEY;
    
    // Log the key prefix (first few characters only - for security)
    console.log('API Key prefix:', API_KEY?.substring(0, 4) + '...');
    
    // Make a simple request to News API
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'error') {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: `News API error: ${data.message || 'Unknown error'}`,
          code: data.code
        })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'News API connection successful',
        totalResults: data.totalResults
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: `Error testing News API: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    };
  }
};