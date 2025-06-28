import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyBriefTemplate from '../emails/DailyBriefTemplate';
import nodemailer from 'nodemailer';

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
  image?: string;
}

export class EmailService {
  private resend?: Resend;
  transporter: nodemailer.Transporter;

  constructor() {
    // Only initialize Resend if API key is present
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    // Always initialize nodemailer for Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendDailyBrief(user: User, newsItems: NewsItem[]): Promise<boolean> {
    try {
      const html = `
        <h2>Hey!, Here Are Your Daily Briefs :)</h2>
        <ul>
          ${newsItems.map(item => `
            <li style="margin-bottom:24px;">
              ${item.image ? `<img src="${item.image}" alt="${item.title}" style="max-width:300px;display:block;margin-bottom:8px;" />` : ''}
              <b>${item.title}</b><br/>
              ${item.summary || ''}<br/>
              <a href="${item.url}">Read more</a>
            </li>
          `).join('')}
        </ul>
      `;
      console.log('About to send email to', user.email);
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'Your Daily News Briefs',
        html,
      });
      console.log('Email sendMail finished for', user.email);
      return true;
    } catch (error) {
      console.error('Error sending daily brief:', error);
      return false;
    }
  }

  async sendTestEmail(email: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Test Email from Daily Briefs',
        text: 'This is a test email from Daily Briefs!',
      });
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }

  async fetchAndSendCategoryNews(user: User, category: string): Promise<boolean> {
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.NEWS_API_KEY}`);
      const data = await response.json();

      const categoryNews = data.articles?.map((article: any) => ({
        title: article.title,
        summary: article.description || (article.content ? article.content.substring(0, 200) + '...' : ''),
        url: article.url,
        source: article.source.name,
        category: category,
        publishedAt: article.publishedAt,
        image: article.image // or article.image_url or article.urlToImage depending on API
      })) || [];

      return this.sendDailyBrief(user, categoryNews);
    } catch (error) {
      console.error('Error fetching or sending category news:', error);
      return false;
    }
  }
}