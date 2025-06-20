import { Handler, HandlerEvent } from '@netlify/functions';
import { EmailService } from '../../src/services/emailService';
import { UserService } from '../../src/services/userService';
import { NewsService } from '../../src/services/newsService';
import { getSummariesForTopic } from '../../src/services/aiSummaryService';

// import type { User } from '../../src/types/User'; // Adjust the import path as needed
// import type { User } from '../../src/types/User'; // Adjust the import path as needed
// import type * as UserTypes from '../../src/types/User'; // Adjust the import path as needed
// import type { User } from '../../src/types/User'; // Adjust the import path as needed
import type { User } from '../../src/types/User'; // Adjust the import path as needed

const handler: Handler = async (event: HandlerEvent) => {
  console.log("Scheduled function running at:", new Date().toISOString());
  
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
    const users: User[] = await userService.getAllUsers();
    const activeUsers = users.filter((user: User) => user.preferences.emailEnabled);

    console.log(`📧 Found ${activeUsers.length} active users`);

    if (activeUsers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No active users found' })
      };
    }

    // Group users by their preferred topics to optimize API calls
    const topicGroups = new Map<string, User[]>();
        
    activeUsers.forEach((user: User) => {
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
      // Fetch news for this topic group
      let newsItems = await newsService.fetchNews(topics, 8);

      // Attach AI summaries to each news item
      newsItems = await generateAISummary(newsItems);

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
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          totalErrors++;
          console.error(`❌ Error sending email to ${user.email}:`, error);
        }
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

// Set schedule
export const schedule = "0 8 * * *"; // Run at 8 AM daily

export { handler };

// Remove local NewsItem interface and import the correct one from your types
import type { NewsItem } from '../../src/types/NewsItem';

interface Summary {
  summary: string;
  [key: string]: any;
}
async function generateAISummary(newsItems: NewsItem[]): Promise<NewsItem[]> {
  // For each news item, call getSummariesForTopic to get an AI summary.
  // Assuming getSummariesForTopic takes an array of news items and returns an array of summaries.
  // If getSummariesForTopic expects topics, you may need to adjust this logic.

  // Collect the content of each news item to summarize
  const contents = newsItems.map(item => item.content);

  // Get summaries from the AI service
  let summaries: Summary[];
  try {
    summaries = await getSummariesForTopic(contents);
  } catch (error) {
    console.error('Error generating AI summaries:', error);
    // Fallback: return newsItems without summaries
    return newsItems;
  }

  // Attach summaries to news items
  return newsItems.map((item, idx) => ({
    ...item,
    aiSummary: summaries[idx]?.summary || ''
  }));
}

