interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

export class NewsService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    // Check both environment variable formats
    this.apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY || '';
    this.apiUrl = 'https://newsapi.org/v2';
    
    console.log('News API key available:', Boolean(this.apiKey));
  }

  async fetchNews(categories: string[] = ['general'], limit: number = 10): Promise<NewsItem[]> {
    try {
      const allNews: NewsItem[] = [];
      
      // Map our categories to GNews categories
      const categoryMapping: Record<string, string> = {
        'technology': 'technology',
        'business': 'business',
        'entertainment': 'entertainment',
        'general': 'general',
        'health': 'health',
        'science': 'science',
        'sports': 'sports'
      };
      
      // Fetch news for each requested category
      for (const category of categories) {
        const gnewsCategory = categoryMapping[category] || 'general';
        const response = await fetch(
          `${this.apiUrl}/top-headlines?category=${gnewsCategory}&lang=en&max=${Math.ceil(limit / categories.length)}&apikey=${this.apiKey}`
        );
        
        if (!response.ok) {
          console.error(`Error fetching ${category} news:`, response.statusText);
          continue;
        }
        
        const data = await response.json();
        
        // GNews format is different - adapt it to our format
        const categoryNews: NewsItem[] = data.articles?.map((article: any) => ({
          title: article.title || 'Untitled Article',
          summary: article.description || 'No summary available',
          url: article.url || '',
          source: article.source?.name || 'Unknown Source',
          category,
          publishedAt: article.publishedAt || new Date().toISOString()
        })) || [];

        allNews.push(...categoryNews);
      }

      // Filter, sort and limit as before
      const validNews = allNews.filter(article => 
        article.title && article.title !== 'Untitled Article' && 
        article.url && article.url.startsWith('http')
      );
      
      const sortedNews = validNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      return sortedNews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }
}

export default NewsService;