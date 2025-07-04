import { Handler, HandlerEvent } from '@netlify/functions';
import { NewsService } from '../../src/services/newsService';
import { EmailService } from '../../src/services/emailService';
import { UserService } from '../../src/services/userService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const activeUsers = users.filter(user => user.preferences?.emailEnabled);

    console.log(`📧 Found ${activeUsers.length} active users`);

    if (activeUsers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No active users found' })
      };
    }

    // Warn for users with no selected topics
    activeUsers.forEach(user => {
      const selectedTopics = user.preferences?.selectedTopics ?? [];
      if (!Array.isArray(selectedTopics) || selectedTopics.length === 0) {
        console.warn(`User ${user.email} has no selectedTopics.`);
      }
    });

    // Group users by their preferred topics to optimize API calls
    const topicGroups = new Map<string, typeof activeUsers>();
    
    activeUsers.forEach(user => {
      const selectedTopics = user.preferences?.selectedTopics ?? [];
      const topicsKey = selectedTopics.sort().join(',');
      if (!topicGroups.has(topicsKey)) {
        topicGroups.set(topicsKey, []);
      }
      topicGroups.get(topicsKey)!.push(user);
    });

    let totalEmailsSent = 0;
    let totalErrors = 0;

    for (const [topicsKey, groupUsers] of topicGroups) {
      const topics = ['technology', 'world'];
      console.log(`📰 Fetching news for topics: ${topics.join(', ')}`);

      try {
        let newsItems = await newsService.fetchNews(topics, 8);
        console.log('newsItems after fetch:', newsItems);
        if (newsItems && newsItems.data) {
          newsItems = newsItems.data;
        }
        newsItems = await newsService.generateAISummary(newsItems);

        console.log(`✅ Found ${newsItems.length} news items for ${groupUsers.length} users`);
        console.log('Fetched newsItems:', newsItems);

        // Send emails to all users in this group
        for (const user of groupUsers) {
          try {
            console.log('newsItems to email:', newsItems);
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
};

// Schedule: every day at 8 AM UTC
export const schedule = "0 8 * * *";