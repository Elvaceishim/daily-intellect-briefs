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
        <h2>Your Daily Briefs</h2>
        <ul>
          ${newsItems.map(item => `
            <li>
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
}