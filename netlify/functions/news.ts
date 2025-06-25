exports.handler = async function(event, context) {
  const query = event.queryStringParameters?.query || '';
  const limit = event.queryStringParameters?.limit || 10;
  const apiKey = process.env.GNEWS_API_KEY; // Use your GNews key

  console.log('GNEWS_API_KEY:', process.env.GNEWS_API_KEY);

  let url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&max=${limit}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Log the raw GNews response for debugging
    // console.log('Raw GNews response:', data);

    // Return articles in the expected format for your frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ data: data.articles || [] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news', details: err.message }),
    };
  }
};