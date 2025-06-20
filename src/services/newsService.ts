interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

interface NewsAPIArticle {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
}

export class NewsService {
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY;
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'https://newsapi.org/v2';
  }

  async fetchNews(categories: string[] = ['general'], limit: number = 10): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    for (const category of categories) {
      try {
        const response = await fetch(
          `${this.apiUrl}/top-headlines?category=${category}&country=us&pageSize=${Math.ceil(limit / categories.length)}&apiKey=${this.NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          console.error(`Error fetching ${category} news:`, response.statusText);
          continue;
        }
        
        const data = await response.json();
        
        const categoryNews: NewsItem[] = data.articles?.map((article: NewsAPIArticle) => ({
          title: article.title?.replace(/\s\|\s.*$/, '') || 'Untitled Article',
          summary: article.description || article.content?.substring(0, 160) + '...' || 'No summary available',
          url: article.url || '',
          source: article.source?.name || 'Unknown Source',
          category,
          publishedAt: article.publishedAt || new Date().toISOString()
        })) || [];

        allNews.push(...categoryNews);
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
      }
    }

    // Filter out articles without titles or URLs
    const validNews = allNews.filter(article => 
      article.title && article.title !== 'Untitled Article' && 
      article.url && article.url.startsWith('http')
    );
    
    // Sort by published date (newest first)
    const sortedNews = validNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Return limited number of items
    return sortedNews.slice(0, limit);
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