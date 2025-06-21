import { Handler, HandlerEvent } from '@netlify/functions';
import { EmailService } from '../../src/services/emailService';
import { UserService } from '../../src/services/userService';
import { NewsService } from '../../src/services/newsService';
import { getSummariesForTopic } from '../../src/services/aiSummaryService';
import type { User } from '../../src/types/User';
import type { NewsItem } from '../../src/types/NewsItem';


// Helper: Attach both gist and brainy summaries to each news item
async function generateAISummaries(newsItems: NewsItem[]): Promise<NewsItem[]> {
  return Promise.all(
    newsItems.map(async (item) => {
      try {
        const summaries = await getSummariesForTopic(item.content);
        return {
          ...item,
          summaries, // { gist, brainy }
        };
      } catch (error) {
        console.error('Error generating AI summaries for item:', item, error);
        return {
          ...item,
          summaries: { gist: '', brainy: '' },
        };
      }
    })
  );
}

const handler: Handler = async (event: HandlerEvent) => {
  console.log("Scheduled function running at:", new Date().toISOString());

  // Only allow POST (Netlify scheduled functions use POST)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  console.log('🚀 Starting daily brief generation...');

  try {
    const newsService = new NewsService();
    const emailService = new EmailService();
    const userService = new UserService();

    // Get all users who should receive emails
    const users: User[] = await userService.getAllUsers();
    const activeUsers = users.filter((user) => user.preferences.emailEnabled);

    console.log(`📧 Found ${activeUsers.length} active users`);

    if (activeUsers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No active users found' }),
      };
    }

    // Group users by their preferred topics to optimize API calls
    const topicGroups = new Map<string, User[]>();
    activeUsers.forEach((user) => {
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

        // Attach AI summaries to each news item
        newsItems = await generateAISummaries(newsItems);

        if (newsItems.length === 0) {
          console.warn(`⚠️ No news found for topics: ${topics.join(', ')}`);
          continue;
        }

        console.log(`✅ Found ${newsItems.length} news items for ${groupUsers.length} users`);

        // Send emails to all users in this group
        for (const user of groupUsers) {
          try {
            await emailService.sendDailyBrief(user, newsItems);
            await userService.updateLastEmailSent(user.email);
            totalEmailsSent++;
            console.log(`✅ Email sent to ${user.email}`);

            // Small delay to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 100));
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
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Daily brief summary:', summary);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Daily briefs processed',
        summary,
      }),
    };
  } catch (error) {
    console.error('💥 Fatal error in daily brief generation:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

// Set schedule for Netlify Scheduled Functions
export const schedule = "0 8 * * *"; // Run at 8 AM daily

export { handler };

