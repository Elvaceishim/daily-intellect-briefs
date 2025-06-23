const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const query = event.queryStringParameters?.query || '';
  const limit = event.queryStringParameters?.limit || 10;
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