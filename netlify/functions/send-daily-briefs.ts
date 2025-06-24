import { Handler, HandlerEvent } from '@netlify/functions';
import { NewsService } from '../../src/services/newsService';
import { EmailService } from '../../src/services/emailService';
import { UserService } from '../../src/services/userService';
import nodemailer from 'nodemailer';

export const handler = async (event, context) => {
  // Verify this is a scheduled call (security measure)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  console.log('🚀 Starting daily brief generation...');
  
  try {
    const newsService = new NewsService();
    const emailService = new EmailService();
    const userService = new UserService();

    // Get all users who should receive emails
    const users = await userService.getAllUsers();
    const activeUsers = users.filter(user => user.preferences.emailEnabled);

    console.log(`📧 Found ${activeUsers.length} active users`);

    if (activeUsers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No active users found' })
      };
    }

    // Group users by their preferred topics to optimize API calls
    const topicGroups = new Map<string, typeof activeUsers>();
    
    activeUsers.forEach(user => {
      const topicsKey = user.preferences.selectedTopics.sort().join(',');
      if (!topicGroups.has(topicsKey)) {
        topicGroups.set(topicsKey, []);
      }
      topicGroups.get(topicsKey)!.push(user);
    });

    let totalEmailsSent = 0;
    let totalErrors = 0;

    // Process each topic group
    for (const [topicsKey, groupUsers] of topicGroups) {
      const topics = topicsKey.split(',');
      console.log(`📰 Fetching news for topics: ${topics.join(', ')}`);

      try {
        // Fetch news for this topic group
        let newsItems = await newsService.fetchNews(topics, 8);
        
        // Generate AI summaries if available
        newsItems = await newsService.generateAISummary(newsItems);

        if (newsItems.length === 0) {
          console.warn(`⚠️ No news found for topics: ${topics.join(', ')}`);
          continue;
        }

        console.log(`✅ Found ${newsItems.length} news items for ${groupUsers.length} users`);

        // Send emails to all users in this group
        for (const user of groupUsers) {
          try {
            const success = await emailService.sendDailyBrief(user, newsItems);
            
            if (success) {
              await userService.updateLastEmailSent(user.email);
              totalEmailsSent++;
              console.log(`✅ Email sent to ${user.email}`);
            } else {
              totalErrors++;
              console.error(`❌ Failed to send email to ${user.email}`);
            }

            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            totalErrors++;
            console.error(`❌ Error sending email to ${user.email}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing topic group ${topicsKey}:`, error);
        totalErrors += groupUsers.length;
      }
    }

    const summary = {
      totalUsers: activeUsers.length,
      emailsSent: totalEmailsSent,
      errors: totalErrors,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Daily brief summary:', summary);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Daily briefs processed',
        summary
      })
    };

  } catch (error) {
    console.error('💥 Fatal error in daily brief generation:', error);
    
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

  return {
    statusCode: 200,
    body: "Daily brief sent!",
  };
};

// Schedule: every day at 8 AM UTC
export const schedule = "0 8 * * *";

exports.handler = async (event) => {
  const { email, summary } = JSON.parse(event.body);

  // Use your Gmail address and the app password you generated
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourgmail@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD, // Store this in Netlify env vars!
    },
  });

  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: email,
    subject: 'Your Daily Brief',
    html: `<p>${summary}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};