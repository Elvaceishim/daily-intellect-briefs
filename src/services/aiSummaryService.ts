export async function getSummariesForTopic(text: string) {
  const res = await fetch('/.netlify/functions/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to get summary');
  return res.json();
}


//const newsArticleText = "Your news article text goes here.";

//const summaries = await getSummariesForTopic(newsArticleText);
