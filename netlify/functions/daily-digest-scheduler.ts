import EmailService from '../../src/services/emailService';
import { NewsService } from '../../src/services/newsService';
import UserService from '../../src/services/userService';
import type { Handler } from '@netlify/functions';

// The main function handler
export const handler: Handler = async (event) => {
  console.log('Daily digest scheduled function running:', new Date().toISOString());
  
  try {
    const userService = new UserService();
    const newsService = new NewsService();
    const emailService = new EmailService();
    const results = [];
    
    // Get all active users
    const activeUsers = await userService.getActiveUsers();
    
    // Process for each active user
    for (const user of activeUsers) {
      console.log(`Processing digest for ${user.email}`);
      
      // Fetch news for user's selected topics
      const topics = user.preferences.selectedTopics || ['general'];
      let newsItems = await newsService.fetchNews(topics, 8);
      
      if (newsItems.length === 0) {
        console.warn(`No news found for ${user.email}`);
        results.push({
          email: user.email,
          success: false,
          error: 'No news items found'
        });
        continue;
      }
      
      // Send email
      const emailResult = await emailService.sendDailyDigest(
        user.email,
        user.name || 'Subscriber',
        newsItems,
        topics
      );
      
      results.push({
        email: user.email,
        success: emailResult.success,
        messageId: emailResult.id
      });
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Daily digest processing completed',
        timestamp: new Date().toISOString(),
        results
      })
    };
  } catch (error) {
    console.error('Error processing daily digests:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process daily digests',
        message: error instanceof Error ? error.message : String(error)
      })
    };
  }
};

// This sets up the schedule (8am daily)
export const schedule = '0 8 * * *';