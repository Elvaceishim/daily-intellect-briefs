import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use env variable, not hardcoded key!
});

export const handler: Handler = async () => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: "write a haiku about ai" },
    ],
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: completion.choices[0].message }),
  };
};