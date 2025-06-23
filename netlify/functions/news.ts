// netlify/functions/news.ts
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const query = event.queryStringParameters?.query || '';
  const limit = event.queryStringParameters?.limit || 7;
  const apiKey = process.env.NEWS_API_KEY || '5121f0823678cd12355a12dcf26358ba';

  let url = `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=us&languages=en&limit=${limit}`;
  if (query) {
    url += `&keywords=${encodeURIComponent(query)}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ data: data.data || [] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news', details: err.message }),
    };
  }
};

// Client-side function to handle "View All" action
const handleViewAll = async () => {
  setLoadingMore(true);
  try {
    const response = await fetch('/.netlify/functions/news?limit=7');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    setBriefs(data.data || []);
  } catch (error) {
    console.error('Failed to load more news:', error);
  }
  setLoadingMore(false);
};
// Assume this is a React state setter for a loading indicator
let loadingMore = false;
function setLoadingMore(value: boolean) {
    loadingMore = value;
}
// Assume briefs is a state variable holding the news briefs
let briefs: any[] = [];

function setBriefs(newBriefs: any[]) {
    briefs = newBriefs;
}

