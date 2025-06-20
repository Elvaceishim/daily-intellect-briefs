import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyDigestEmail from '../emails/DailyDigestEmail';
import { User } from './userService';

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: any;
}

// Change from default export to named export
export class EmailService {
  sendDailyBrief(user: User, newsItems: NewsItem[]) {
    throw new Error('Method not implemented.');
  }
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    this.resend = new Resend(process.env.VITE_RESEND_API_KEY);
    this.fromEmail = 'daily@yourdomain.com'; // Update with your verified domain
  }

  async sendDailyDigest(
    recipientEmail: string, 
    userName: string, 
    newsItems: NewsItem[], 
    categories: string[]
  ): Promise<EmailResult> {
    try {
      const briefDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Render the React email to HTML
      const html = await render(DailyDigestEmail({
        userEmail: recipientEmail,
        userName,
        briefDate,
        newsItems,
        categories
      }));

      // Send the email via Resend
      const result = await this.resend.emails.send({
        from: `Daily Intellect Brief <${this.fromEmail}>`,
        to: recipientEmail,
        subject: `📰 Your Daily Brief - ${briefDate}`,
        html,
      });

      console.log(`Email sent to ${recipientEmail}:`, result);
      return { success: true, id: result.data?.id };
    } catch (error) {
      console.error(`Failed to send email to ${recipientEmail}:`, error);
      return { success: false, error };
    }
  }
}

// Add this default export as well for backward compatibility
export default EmailService;