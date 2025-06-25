// src/utils/getAISummary.ts
export const getAISummary = async (text: string) => {
  try {
    const response = await fetch('/.netlify/functions/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result.summary || '';
  } catch (err) {
    return '';
  }
};