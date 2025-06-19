import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyBriefTemplate from '../emails/DailyBriefTemplate';

interface User {
  email: string;
  name?: string;
  preferences: {
    selectedTopics: string[];
    preferredTime: string;
    emailEnabled: boolean;
  };
}

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

export class EmailService {
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendDailyBrief(user: User, newsItems: NewsItem[]): Promise<boolean> {
    if (!user.preferences.emailEnabled) {
      console.log(`Email disabled for user: ${user.email}`);
      return false;
    }

    try {
      const briefDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const emailHtml = render(DailyBriefTemplate({
        userEmail: user.email,
        userName: user.name,
        briefDate,
        newsItems,
        categories: user.preferences.selectedTopics
      }));

      const result = await this.resend.emails.send({
        from: 'Daily Brief <daily@yourdomain.com>', // Update with your domain
        to: [user.email],
        subject: `📰 Your Daily Brief - ${briefDate}`,
        html: emailHtml,
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'Daily Brief'
        }
      });

      console.log(`Email sent successfully to ${user.email}:`, result.data?.id);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
      return false;
    }
  }

  async sendTestEmail(email: string): Promise<boolean> {
    try {
      const mockNews: NewsItem[] = [
        {
          title: "AI Technology Reaches New Milestone",
          summary: "Researchers announce breakthrough in artificial intelligence that could revolutionize how we interact with technology. The development promises significant improvements in efficiency and accuracy.",
          url: "https://example.com/ai-news",
          source: "Tech News",
          category: "technology",
          publishedAt: new Date().toISOString()
        },
        {
          title: "Global Markets Show Positive Trends",
          summary: "Financial markets worldwide display encouraging signs of growth amid economic uncertainty. Analysts predict continued stability in the coming quarter.",
          url: "https://example.com/market-news",
          source: "Financial Times",
          category: "business",
          publishedAt: new Date().toISOString()
        }
      ];

      const briefDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const emailHtml = render(DailyBriefTemplate({
        userEmail: email,
        userName: "Test User",
        briefDate: `${briefDate} (Test)`,
        newsItems: mockNews,
        categories: ["technology", "business"]
      }));

      const result = await this.resend.emails.send({
        from: 'Daily Brief <daily@yourdomain.com>',
        to: [email],
        subject: `🧪 Test Daily Brief - ${briefDate}`,
        html: emailHtml,
      });

      console.log(`Test email sent to ${email}:`, result.data?.id);
      return true;
    } catch (error) {
      console.error(`Failed to send test email to ${email}:`, error);
      return false;
    }
  }
}