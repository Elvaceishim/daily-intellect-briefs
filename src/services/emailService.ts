import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyDigestEmail from '../emails/DailyDigestEmail';

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

class EmailService {
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
      return { success: true, id: result.id };
    } catch (error) {
      console.error(`Failed to send email to ${recipientEmail}:`, error);
      return { success: false, error };
    }
  }
}

export default EmailService;