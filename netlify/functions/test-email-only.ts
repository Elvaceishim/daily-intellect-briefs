// netlify/functions/test-email-only.ts
import { Resend } from 'resend';

export const handler = async (event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);
    const email = "anselmelvis62@gmail.com";
    
    console.log(`Sending simple test email to ${email}`);
    
    const result = await resend.emails.send({
      from: 'Daily Brief <onboarding@resend.dev>', // Use Resend's verified sender
      to: email,
      subject: 'Test Email from Daily Brief App',
      html: '<h1>This is a test email</h1><p>If you can see this, email delivery is working!</p>'
    });
    
    console.log('Email send result:', result);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Simple test email sent to ${email}`,
        data: result
      })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    };
  }
};