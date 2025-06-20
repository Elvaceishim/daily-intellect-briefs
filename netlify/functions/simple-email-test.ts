// netlify/functions/simple-email-test.ts
import { Resend } from 'resend';

export const handler = async () => {
  try {
    // Log the API key (first few characters only)
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';
    console.log('Using Resend API key starting with:', apiKey.substring(0, 4) + '...');
    
    const resend = new Resend(apiKey);
    const email = "anselmelvis62@gmail.com";
    
    // Send a very simple email
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Use Resend's default sender
      to: email,
      subject: 'Simple Test Email',
      text: 'This is a plain text email to test delivery.'
    });
    
    console.log('Email result:', JSON.stringify(result));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Email sent - check your inbox',
        result 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};