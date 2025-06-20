// netlify/functions/test-email.ts
import { EmailService } from '../../src/services/emailService';
import { NewsService } from '../../src/services/newsService';
import type { Handler } from '@netlify/functions';

interface TestEmailRequest {
  email?: string;
}

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Environment check:', {
      hasGnewsApiKey: Boolean(process.env.GNEWS_API_KEY),
      hasViteGnewsApiKey: Boolean(process.env.VITE_GNEWS_API_KEY),
      hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
      hasViteResendApiKey: Boolean(process.env.VITE_RESEND_API_KEY)
    });
    
    // Update this check for GNews API
    if (!process.env.GNEWS_API_KEY && !process.env.VITE_GNEWS_API_KEY) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Missing GNews API key configuration' 
        })
      };
    }
    
    if (!process.env.VITE_RESEND_API_KEY) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Missing Resend API key configuration' 
        })
      };
    }
    
    // Create services
    const newsService = new NewsService();
    const emailService = new EmailService();
    
    // Fetch sample news
    const topics = ['technology', 'business'];
    const newsItems = await newsService.fetchNews(topics, 4);
    
    if (newsItems.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Could not fetch news items for the test email' 
        })
      };
    }
    
    // Send test email
    const email = 'your-email@example.com'; // Default or user-provided email
    const result = await emailService.sendDailyDigest(
      email, 
      'Test User', 
      newsItems,
      topics
    );
    
    return {
      statusCode: result.success ? 200 : 500,
      body: JSON.stringify({
        success: result.success,
        message: result.success ? 
          `Test email sent successfully to ${email}` : 
          `Failed to send test email to ${email}`,
        data: result
      })
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error sending test email',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
};