interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

export class NewsService {
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY;
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  async fetchNews(categories: string[], limit: number = 10): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    for (const category of categories) {
      try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=${Math.ceil(limit / categories.length)}&apiKey=${this.NEWS_API_KEY}`;
        console.log('Fetching:', apiUrl); // <-- Log the full API URL

        const response = await fetch(apiUrl);
        console.log('Response status:', response.status); // <-- Log the HTTP status

        if (!response.ok) continue;

        const data = await response.json();
        console.log('Raw news API response:', data); // <-- Already present

        if (data.status && data.status !== 'ok') {
          console.error('News API error:', data); // <-- Log API errors
        }

        const categoryNews = data.articles?.map((article: any) => ({
          title: article.title,
          summary: article.description || (article.content ? article.content.substring(0, 200) + '...' : ''),
          url: article.url,
          source: article.source.name,
          category: category,
          publishedAt: article.publishedAt
        })) || [];

        allNews.push(...categoryNews);
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
      }
    }

    console.log('All news before sort/limit:', allNews); // <-- ADD HERE

    // Sort by published date and limit
    return allNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async generateAISummary(articles: NewsItem[]): Promise<NewsItem[]> {
    if (!this.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using original summaries');
      return articles;
    }

    try {
      const summariesPromises = articles.map(async (article) => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a news summarizer. Create concise, informative 2-sentence summaries of news articles.'
              },
              {
                role: 'user',
                content: `Summarize this news article in 2 sentences:\n\nTitle: ${article.title}\nContent: ${article.summary}`
              }
            ],
            max_tokens: 100,
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            ...article,
            summary: data.choices[0]?.message?.content || article.summary
          };
        }
        
        return article;
      });

      return await Promise.all(summariesPromises);
    } catch (error) {
      console.error('Error generating AI summaries:', error);
      return articles;
    }
  }
}