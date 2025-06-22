const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const query = event.queryStringParameters?.query;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query parameter' }),
    };
  }
  const apiKey = process.env.NEWS_API_KEY || '5121f0823678cd12355a12dcf26358ba';
  const url = `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=us&languages=en&limit=10&keywords=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news', details: err.message }),
    };
  }
};

// const handleClick = async (brief: { title: string }) => {
//   const response = await fetch(
//     `/.netlify/functions/news?query=${encodeURIComponent(brief.title)}`
//   );
//   const data = await response.json();
//   setNews(data.articles?.[0] || null); // Show the first article or null
// };
// const [news, setNews] = useState<any>(null);
