import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export async function getSummariesForTopic(topicText: string) {
  // Prompt for "Just the Gist"
  const gistPrompt = `Summarize this news topic in 1-2 sentences, focusing only on the main point:\n\n${topicText}`;
  // Prompt for "More Brainy"
  const brainyPrompt = `Write an in-depth, thoughtful summary (5-7 sentences) of this news topic, including context, implications, and key details:\n\n${topicText}`;

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
    gist: gist.choices[0].message?.content || '',
    brainy: brainy.choices[0].message?.content || '',
  };
}


//const newsArticleText = "Your news article text goes here.";

//const summaries = await getSummariesForTopic(newsArticleText);
