// netlify/functions/summarize.ts
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Summarize the following news article in 2 sentences, using your own words and avoiding repetition of the original summary:\n\n${text}`
      }],
      max_tokens: 80,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ summary: completion.choices[0].message.content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ summary: '', error: err.message }),
    };
  }
};