import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body || '{}');
    if (!text) {
      return { statusCode: 400, body: 'Missing text' };
    }

    const gistPrompt = `Summarize this news topic in 1-2 sentences:\n\n${text}`;
    const brainyPrompt = `Write an in-depth summary (5-7 sentences):\n\n${text}`;

    const [gist, brainy] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: gistPrompt }],
        max_tokens: 100,
      }),
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: brainyPrompt }],
        max_tokens: 400,
      }),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        gist: gist.choices[0].message?.content || '',
        brainy: brainy.choices[0].message?.content || '',
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
};

