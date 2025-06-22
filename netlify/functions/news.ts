const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const query = event.queryStringParameters?.query || '';
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://gnews.io/api/v4/top-headlines?country=us&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news' }),
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
