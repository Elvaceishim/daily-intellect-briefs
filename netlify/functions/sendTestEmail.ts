import { Handler, HandlerEvent } from '@netlify/functions';
import { EmailService } from '../../src/services/emailService';

const handler: Handler = async (event: HandlerEvent) => {
  console.log('Function triggered');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');
    
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email address is required' })
      };
    }

    const emailService = new EmailService();
    const success = await emailService.sendTestEmail(email);

    console.log('Email send attempted');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success,
        message: success ? 'Test email sent successfully' : 'Failed to send test email'
      })
    };

  } catch (error) {
    console.error('Error sending test email:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };